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

    /**
     * Registra un nuevo usuario.
     * @param {string} username
     * @param {string} password     - Contraseña en texto plano.
     * @param {string} passwordConfirm - Confirmación de contraseña.
     * @returns {Object} { error, user }
     */
    registerAsync = async (username, password, passwordConfirm) => {

        // 1. Validaciones
        if (!username || username.trim().length === 0) {
            return { error: 'El username es obligatorio.', user: null };
        }
        if (username.trim().length < 3) {
            return { error: 'El username debe tener al menos 3 caracteres.', user: null };
        }
        if (!password || password.length === 0) {
            return { error: 'La contraseña es obligatoria.', user: null };
        }
        if (password.length < 6) {
            return { error: 'La contraseña debe tener al menos 6 caracteres.', user: null };
        }
        if (password !== passwordConfirm) {
            return { error: 'Las contraseñas no coinciden.', user: null };
        }

        // 2. Verificar que el username no esté tomado
        const existing = await this.repository.getByUsernameAsync(username.trim());
        if (existing) {
            return { error: 'Ese nombre de usuario ya está en uso.', user: null };
        }

        // 3. Hashear la contraseña y crear el usuario
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.repository.createUserAsync(username.trim(), hashedPassword);

        return { error: null, user };
    }
}
