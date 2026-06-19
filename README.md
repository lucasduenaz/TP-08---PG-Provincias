# TP04 - API de Provincias (Node.js + Express + PostgreSQL)

Guía paso a paso para levantar el proyecto desde cero.

## 1. Requisitos previos (ya instalados)
- Node.js
- Visual Studio Code
- PostgreSQL (con pgAdmin)
- Postman (para probar los endpoints) → https://www.postman.com/downloads/

## 2. Crear la base de datos

1. Abrí **pgAdmin**.
2. Conectate al servidor de PostgreSQL (te va a pedir la contraseña que pusiste al instalar).
3. Click derecho en "Databases" → **Create** → **Database**.
   - Name: `tp04_province`
   - Click en **Save**.
4. Click derecho sobre la base `tp04_province` recién creada → **Query Tool**.
5. Abrí el archivo `database.sql` de este proyecto, copiá **desde la sección 2 en adelante**
   (la creación de la tabla `provinces` y los INSERT) y pegalo en el Query Tool.
6. Ejecutalo (botón ▶ o F5).

Esto te crea la tabla `provinces` con 10 provincias de ejemplo ya cargadas.

## 3. Configurar el archivo `.env`

Abrí el archivo `.env` en la raíz del proyecto y reemplazá `TU_PASSWORD_AQUI`
por la contraseña que le pusiste a PostgreSQL al instalarlo:

```
DB_PASSWORD = "tu_contraseña_real"
```

## 4. Instalar las dependencias

1. Abrí la carpeta del proyecto con **Visual Studio Code** (File → Open Folder).
2. Abrí una terminal dentro de VS Code: menú **Terminal → New Terminal**.
3. Ejecutá:

```bash
npm install
```

Esto va a leer el `package.json` y descargar automáticamente: `cors`, `dotenv`,
`express`, `http-status-codes`, `nodemon` y `pg`.

## 5. Levantar el servidor

En la misma terminal:

```bash
npm run dev
```

(usa `nodemon`, así que se reinicia solo cada vez que guardás un cambio).

Si todo salió bien, vas a ver en la terminal:

```
Example app listening on port 3000
```

Tu API ya está corriendo en `http://localhost:3000`.

## 6. Probar los endpoints con Postman

Importá la colección incluida `tp04-province.postman_collection.json`:
1. Abrí Postman → **Import** → arrastrá ese archivo.
2. Vas a tener ya armadas las 5 requests: GET todas, GET por id, POST, PUT y DELETE.
3. Asegurate de que el servidor (`npm run dev`) esté corriendo antes de probar.

## 7. Estructura del proyecto

```
tp-province/
├── index.js                          # Arranca el servidor Express
├── package.json
├── .env                               # Variables de entorno (NO subir a git)
├── database.sql                       # Script SQL de creación de tabla + datos
├── src/
│   ├── configs/
│   │   └── db-config.js               # Configuración de conexión a PostgreSQL
│   ├── controllers/
│   │   └── province-controller.js     # Define las rutas/endpoints
│   ├── entities/
│   │   └── province.js                # Clase modelo Province
│   ├── helpers/
│   │   ├── log-helper.js              # Guarda errores en archivo/consola
│   │   └── validaciones-helper.js     # Reglas de negocio (validaciones)
│   ├── repositories/
│   │   └── province-repository.js     # Consultas SQL a la base de datos
│   └── services/
│       └── province-service.js        # Lógica de negocio entre controller y repository
```

## 8. Endpoints disponibles

| Método | Ruta                    | Descripción                          |
|--------|-------------------------|---------------------------------------|
| GET    | /api/province           | Lista todas las provincias            |
| GET    | /api/province/:id       | Obtiene una provincia por id          |
| POST   | /api/province           | Crea una nueva provincia              |
| PUT    | /api/province           | Actualiza una provincia (manda `id` en el body) |
| DELETE | /api/province/:id       | Elimina una provincia por id          |

### Ejemplo de body para POST/PUT

```json
{
    "name": "Chaco Provincia",
    "full_name": "Provincia de Chaco",
    "latitude": -24.895086288452148,
    "longitude": -59.93218994140625,
    "display_order": 100
}
```

Para el PUT, además hay que mandar el `id`:

```json
{
    "id": 34,
    "name": "Provincia Modificada",
    "full_name": "Provincia Modificada",
    "latitude": -24.895086288452148,
    "longitude": -59.93218994140625,
    "display_order": 100
}
```

## 9. Problemas comunes

- **Error `ECONNREFUSED` al hacer una petición**: el servidor de PostgreSQL no está
  corriendo, o el `.env` tiene mal el host/puerto.
- **Error `password authentication failed`**: la contraseña en `.env` no coincide
  con la de PostgreSQL.
- **Error `relation "provinces" does not exist`**: no ejecutaste el `database.sql`,
  o lo ejecutaste en la base de datos equivocada.
- **`npm run dev` no hace nada / da error de "command not found"**: asegurate de
  haber corrido `npm install` primero, y de estar parado en la carpeta del proyecto
  en la terminal.
