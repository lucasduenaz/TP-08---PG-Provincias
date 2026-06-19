class ValidacionesHelper {

    /**
     * Valida los datos de una provincia antes de insertar o actualizar.
     * @param {*} province
     * @returns {string|null} El mensaje de error, o null si es válida.
     */
    validarProvince = (province) => {

        if (!province.name || province.name.trim().length < 3) {
            return 'El nombre de la provincia es obligatorio y debe tener al menos 3 letras.';
        }

        if (!province.full_name || province.full_name.trim().length < 3) {
            return 'El nombre completo de la provincia es obligatorio y debe tener al menos 3 letras.';
        }

        if (province.latitude === undefined || province.latitude === null || isNaN(province.latitude)) {
            return 'La latitud es obligatoria y debe ser un número.';
        }

        if (province.longitude === undefined || province.longitude === null || isNaN(province.longitude)) {
            return 'La longitud es obligatoria y debe ser un número.';
        }

        return null;
    }
}

export default new ValidacionesHelper();
