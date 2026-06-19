import { Client } from 'pg';
import DBConfig from './../configs/db-config.js'
import LogHelper from './../helpers/log-helper.js'

export default class ProvinceRepository {

    /**
     * Retorna todas las provincias.
     */
    getAllAsync = async () => {

        let returnEntity = [];
        const client = new Client(DBConfig);

        try {
            await client.connect();

            const sql = `SELECT * FROM provinces ORDER BY display_order ASC`;
            const result = await client.query(sql);

            returnEntity = result.rows;

        } catch (error) {
            LogHelper.logError(error);
            throw error;
        } finally {
            await client.end();
        }

        return returnEntity;
    }

    /**
     * Retorna una provincia según su id, o null si no existe.
     */
    getByIdAsync = async (id) => {

        let returnEntity = null;
        const client = new Client(DBConfig);

        try {
            await client.connect();

            const sql = `SELECT * FROM provinces WHERE id=$1`;
            const values = [id];
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

    /**
     * Inserta una nueva provincia y retorna la entidad insertada.
     */
    insertAsync = async (province) => {

        let returnEntity = null;
        const client = new Client(DBConfig);

        try {
            await client.connect();

            const sql = `INSERT INTO provinces (name, full_name, latitude, longitude, display_order)
                         VALUES ($1, $2, $3, $4, $5)
                         RETURNING *`;
            const values = [
                province.name,
                province.full_name,
                province.latitude,
                province.longitude,
                province.display_order
            ];

            const result = await client.query(sql, values);
            returnEntity = result.rows[0];

        } catch (error) {
            LogHelper.logError(error);
            throw error;
        } finally {
            await client.end();
        }

        return returnEntity;
    }

    /**
     * Actualiza una provincia existente. Retorna la entidad actualizada o null si no existía.
     */
    updateAsync = async (province) => {

        let returnEntity = null;
        const client = new Client(DBConfig);

        try {
            await client.connect();

            const sql = `UPDATE provinces
                         SET name=$1, full_name=$2, latitude=$3, longitude=$4, display_order=$5
                         WHERE id=$6
                         RETURNING *`;
            const values = [
                province.name,
                province.full_name,
                province.latitude,
                province.longitude,
                province.display_order,
                province.id
            ];

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

    /**
     * Elimina una provincia según su id. Retorna true si se eliminó, false si no existía.
     */
    deleteAsync = async (id) => {

        let deleted = false;
        const client = new Client(DBConfig);

        try {
            await client.connect();

            const sql = `DELETE FROM provinces WHERE id=$1`;
            const values = [id];
            const result = await client.query(sql, values);

            deleted = result.rowCount > 0;

        } catch (error) {
            LogHelper.logError(error);
            throw error;
        } finally {
            await client.end();
        }

        return deleted;
    }
}
