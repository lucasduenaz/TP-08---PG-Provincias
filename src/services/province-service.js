import ProvinceRepository from './../repositories/province-repository.js'
import ValidacionesHelper from './../helpers/validaciones-helper.js'

export default class ProvinceService {

    repository = new ProvinceRepository();

    getAllAsync = async () => {
        return await this.repository.getAllAsync();
    }

    getByIdAsync = async (id) => {
        return await this.repository.getByIdAsync(id);
    }

    /**
     * Inserta una provincia luego de validar las reglas de negocio.
     * @returns {Object} { error, entity }
     */
    insertAsync = async (province) => {

        const errorMessage = ValidacionesHelper.validarProvince(province);
        if (errorMessage) {
            return { error: errorMessage, entity: null };
        }

        const entity = await this.repository.insertAsync(province);
        return { error: null, entity };
    }

    /**
     * Actualiza una provincia luego de validar las reglas de negocio.
     * @returns {Object} { error, entity }
     */
    updateAsync = async (province) => {

        const errorMessage = ValidacionesHelper.validarProvince(province);
        if (errorMessage) {
            return { error: errorMessage, entity: null };
        }

        const entity = await this.repository.updateAsync(province);
        return { error: null, entity };
    }

    deleteAsync = async (id) => {
        return await this.repository.deleteAsync(id);
    }
}
