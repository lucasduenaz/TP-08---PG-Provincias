import express     from 'express';
import { StatusCodes } from 'http-status-codes';
import AuthService from './../services/auth-service.js';
import LogHelper   from './../helpers/log-helper.js';

const router  = express.Router();
const service = new AuthService();

/**
 * POST /api/auth/login
 * Body: { username, password }
 * Retorna 200 (OK) y el token JWT si las credenciales son correctas.
 * Retorna 400 (Bad Request) si faltan datos.
 * Retorna 401 (Unauthorized) si las credenciales son incorrectas.
 */
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const { error, token } = await service.loginAsync(username, password);

        if (error) {
            // Distinguimos error de validación (400) de credenciales inválidas (401)
            const isValidationError = error.includes('obligatori');
            const statusCode = isValidationError
                ? StatusCodes.BAD_REQUEST
                : StatusCodes.UNAUTHORIZED;

            return res.status(statusCode).send(error);
        }

        res.status(StatusCodes.OK).json({ token });

    } catch (error) {
        LogHelper.logError(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Ocurrió un error interno.');
    }
});

export default router;
