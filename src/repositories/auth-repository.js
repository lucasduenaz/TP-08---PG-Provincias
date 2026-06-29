import { Client } from 'pg';
import DBConfig    from './../configs/db-config.js';
import LogHelper   from './../helpers/log-helper.js';

export default class AuthRepository {

    /**
     * Busca un usuario por su username.
     * @param {string} username
     * @returns {Object|null} El usuario o null si no existe.
     */
    getByUsernameAsync = async (username) => {

        let returnEntity = null;
        const client = new Client(DBConfig);

        try {
            await client.connect();

            const sql    = `SELECT * FROM users WHERE username = $1`;
            const values = [username];
            const result = await client.query(sql, values);

            if (result.rows.length > 0) {
                returnEntity = result.rows[0];
            }

        } catch (error) {
            LogHelper.logError(error);
            throw error;
        } finally {
            await client.end();
        }

        return returnEntity;
    }
}
