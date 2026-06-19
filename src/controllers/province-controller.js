import express from 'express';
import { StatusCodes } from 'http-status-codes';
import ProvinceService from './../services/province-service.js'
import LogHelper from './../helpers/log-helper.js'

const router = express.Router();
const service = new ProvinceService();

/**
 * GET /api/province
 * Retorna status 200 (OK) y el array de provincias.
 */
router.get('/', async (req, res) => {
    try {
        const provinces = await service.getAllAsync();
        res.status(StatusCodes.OK).json(provinces);
    } catch (error) {
        LogHelper.logError(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Ocurrió un error interno.');
    }
});

/**
 * GET /api/province/{id}
 * Retorna 200 (OK) y la provincia si existe.
 * Retorna 404 (Not Found) si no existe.
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const province = await service.getByIdAsync(id);

        if (!province) {
            return res.status(StatusCodes.NOT_FOUND).send(`No existe una provincia con el id ${id}.`);
        }

        res.status(StatusCodes.OK).json(province);
    } catch (error) {
        LogHelper.logError(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Ocurrió un error interno.');
    }
});

/**
 * POST /api/province
 * Inserta una provincia.
 * Retorna 201 (Created) si se insertó correctamente.
 * Retorna 400 (Bad Request) y el texto del error si hay un error de reglas de negocio.
 */
router.post('/', async (req, res) => {
    try {
        const province = req.body;
        const { error, entity } = await service.insertAsync(province);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).send(error);
        }

        res.status(StatusCodes.CREATED).json(entity);
    } catch (error) {
        LogHelper.logError(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Ocurrió un error interno.');
    }
});

/**
 * PUT /api/province
 * Actualiza una provincia.
 * Retorna 201 (Created) si se actualizó correctamente.
 * Retorna 404 (Not Found) si no existe.
 * Retorna 400 (Bad Request) y el texto del error si hay un error de reglas de negocio.
 */
router.put('/', async (req, res) => {
    try {
        const province = req.body;

        const existing = await service.getByIdAsync(province.id);
        if (!existing) {
            return res.status(StatusCodes.NOT_FOUND).send(`No existe una provincia con el id ${province.id}.`);
        }

        const { error, entity } = await service.updateAsync(province);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).send(error);
        }

        res.status(StatusCodes.CREATED).json(entity);
    } catch (error) {
        LogHelper.logError(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Ocurrió un error interno.');
    }
});

/**
 * DELETE /api/province/{id}
 * Retorna 200 (OK) si la encontró y eliminó.
 * Retorna 404 (Not Found) si no existe.
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await service.deleteAsync(id);

        if (!deleted) {
            return res.status(StatusCodes.NOT_FOUND).send(`No existe una provincia con el id ${id}.`);
        }

        res.status(StatusCodes.OK).send('Provincia eliminada correctamente.');
    } catch (error) {
        LogHelper.logError(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Ocurrió un error interno.');
    }
});

export default router;
