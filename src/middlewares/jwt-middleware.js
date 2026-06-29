import jwt            from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import 'dotenv/config';

/**
 * Middleware que verifica el JWT enviado en el header Authorization.
 * Formato esperado: Authorization: Bearer <token>
 *
 * Si el token es válido, agrega req.user con el payload decodificado
 * y pasa al siguiente middleware/handler.
 * Si no, responde con 401 (Unauthorized).
 */
const verifyToken = (req, res, next) => {

    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .send('Acceso denegado. Se requiere un token JWT.');
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;   // { id, username, role, iat, exp }
        next();
    } catch (error) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .send('Token inválido o expirado.');
    }
};

export default verifyToken;
