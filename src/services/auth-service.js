import bcrypt         from 'bcryptjs';
import jwt            from 'jsonwebtoken';
import 'dotenv/config';
import AuthRepository from './../repositories/auth-repository.js';

export default class AuthService {

    repository = new AuthRepository();

    /**
     * Valida las credenciales y, si son correctas, genera un JWT.
     * @param {string} username
     * @param {string} password  - Contraseña en texto plano enviada por el cliente.
     * @returns {Object} { error, token }
     */
    loginAsync = async (username, password) => {

        // 1. Validaciones básicas de entrada
        if (!username || username.trim().length === 0) {
            return { error: 'El username es obligatorio.', token: null };
        }
        if (!password || password.trim().length === 0) {
            return { error: 'La contraseña es obligatoria.', token: null };
        }

        // 2. Buscar el usuario en la base de datos
        const user = await this.repository.getByUsernameAsync(username.trim());
        if (!user) {
            return { error: 'Usuario o contraseña incorrectos.', token: null };
        }

        // 3. Comparar la contraseña con el hash almacenado
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return { error: 'Usuario o contraseña incorrectos.', token: null };
        }

        // 4. Generar el JWT (no incluir la contraseña en el payload)
        const payload = {
            id:       user.id,
            username: user.username,
            role:     user.role
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '1h'
        });

        return { error: null, token };
    }
}
