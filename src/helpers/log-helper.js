import 'dotenv/config'
import fs from 'fs';
import path from 'path';

class LogHelper {

    constructor() {
        this.filePath            = process.env.LOG_FILE_PATH;
        this.fileName            = process.env.LOG_FILE_NAME;
        this.logToFileEnabled    = process.env.LOG_TO_FILE_ENABLED.toLowerCase() === 'true';
        this.logToConsoleEnabled = process.env.LOG_TO_CONSOLE_ENABLED.toLowerCase() === 'true';
    }

    /**
     * Este método almacena en un archivo de texto y/o muestra por consola información del Error.
     * @param {*} errorObject
     */
    logError = (errorObject) => {

        const timestamp = new Date().toISOString();
        const message   = `${timestamp}: error - ${errorObject.message}\n` +
                           `Stack Trace:\n${errorObject.stack}\n`;

        if (this.logToConsoleEnabled) {
            console.error(message);
        }

        if (this.logToFileEnabled) {
            try {
                // Si la carpeta de logs no existe, la creo.
                if (!fs.existsSync(this.filePath)) {
                    fs.mkdirSync(this.filePath, { recursive: true });
                }

                const fullPath = path.join(this.filePath, this.fileName);
                fs.appendFileSync(fullPath, message + '\n');

            } catch (fileError) {
                // Si falla escribir en el archivo, al menos lo muestro en consola.
                console.error('No se pudo escribir el archivo de log:', fileError.message);
            }
        }
    }
}

export default new LogHelper();
