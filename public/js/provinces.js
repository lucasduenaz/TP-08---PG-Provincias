/**
 * provinces.js — Lógica del CRUD de provincias.
 *
 * Flujo:
 *  1. Al cargar: verificar token. Si no existe → redirigir a index.html.
 *  2. loadProvinces(): GET /api/province y renderizar tabla.
 *  3. openModal(province): null = nueva provincia, objeto = edición.
 *  4. saveProvince(): POST si es nueva, PUT si tiene id.
 *  5. deleteProvince(id): confirm → DELETE → recargar tabla.
 *  6. logout(): limpiar localStorage → redirigir a index.html.
 *  7. Cualquier 401 en fetch → redirigir a index.html (token expirado).
 */

const TOKEN_KEY    = 'jwt_token';
const API_BASE     = '/api/province';

// ── 1. Verificar token al cargar ─────────────────────────────────────────────
const token = localStorage.getItem(TOKEN_KEY);
if (!token) {
    window.location.href = 'index.html';
}

/**
 * Devuelve los headers comunes para todas las peticiones protegidas.
 * @returns {HeadersInit}
 */
function authHeaders() {
    return {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${token}`,
    };
}

/**
 * Maneja una respuesta de fetch. Si el status es 401, redirige al login.
 * Lanza un Error con el texto de respuesta si el status no es OK.
 * @param {Response} response
 * @returns {Promise<any>} — JSON parseado o undefined si no hay cuerpo
 */
async function handleResponse(response) {
    if (response.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        window.location.href = 'index.html';
        return;
    }

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Error ${response.status}`);
    }

    // Intentar parsear JSON; si el body está vacío devuelve null
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
        return response.json();
    }
    return response.text();
}

// ── Notificaciones ────────────────────────────────────────────────────────────
let notifTimeout;

/**
 * Muestra una notificación en la parte superior del contenido.
 * @param {string} message
 * @param {'success'|'error'} type
 */
function showNotification(message, type = 'success') {
    const el = document.getElementById('notification');
    el.textContent = message;
    el.className = `notification ${type}`;
    el.classList.remove('hidden');

    clearTimeout(notifTimeout);
    notifTimeout = setTimeout(() => el.classList.add('hidden'), 4000);
}

// ── 2. Cargar y renderizar provincias ─────────────────────────────────────────

/**
 * Obtiene todas las provincias de la API y renderiza la tabla.
 */
async function loadProvinces() {
    const tbody = document.getElementById('provincesBody');
    tbody.innerHTML = '<tr id="loadingRow"><td colspan="7" class="table-placeholder">Cargando provincias…</td></tr>';

    try {
        const response = await fetch(API_BASE, {
            method:  'GET',
            headers: authHeaders(),
        });

        const provinces = await handleResponse(response);

        if (!provinces) return; // redirigió a login

        if (provinces.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="table-placeholder">No hay provincias registradas.</td></tr>';
            return;
        }

        // Ordenar por display_order antes de renderizar
        provinces.sort((a, b) => a.display_order - b.display_order);

        tbody.innerHTML = provinces.map(p => `
            <tr>
                <td>${p.id}</td>
                <td>${escapeHtml(p.name)}</td>
                <td>${escapeHtml(p.full_name)}</td>
                <td>${p.latitude}</td>
                <td>${p.longitude}</td>
                <td>${p.display_order}</td>
                <td>
                    <div class="action-buttons">
                        <button
                            class="btn btn-sm btn-primary"
                            onclick="openModal(${JSON.stringify(p).replace(/"/g, '&quot;')})"
                            title="Editar">
                            Editar
                        </button>
                        <button
                            class="btn btn-sm btn-danger"
                            onclick="deleteProvince(${p.id})"
                            title="Eliminar">
                            Eliminar
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

    } catch (error) {
        console.error('[loadProvinces]', error);
        tbody.innerHTML = `<tr><td colspan="7" class="table-placeholder">Error al cargar provincias: ${escapeHtml(error.message)}</td></tr>`;
    }
}

// ── 3. Modal (crear / editar) ─────────────────────────────────────────────────

/**
 * Abre el modal para crear una nueva provincia o editar una existente.
 * @param {Object|null} province — null para crear, objeto provincia para editar
 */
function openModal(province = null) {
    const overlay    = document.getElementById('modalOverlay');
    const title      = document.getElementById('modalTitle');
    const provinceId = document.getElementById('provinceId');

    // Limpiar errores previos
    hideModalError();

    if (province) {
        // ── Modo edición ──────────────────────────────────────────────────────
        title.textContent = 'Editar Provincia';
        provinceId.value  = province.id;
        document.getElementById('fieldName').value         = province.name;
        document.getElementById('fieldFullName').value     = province.full_name;
        document.getElementById('fieldLatitude').value     = province.latitude;
        document.getElementById('fieldLongitude').value    = province.longitude;
        document.getElementById('fieldDisplayOrder').value = province.display_order;
    } else {
        // ── Modo creación ─────────────────────────────────────────────────────
        title.textContent = 'Nueva Provincia';
        provinceId.value  = '';
        document.getElementById('fieldName').value         = '';
        document.getElementById('fieldFullName').value     = '';
        document.getElementById('fieldLatitude').value     = '';
        document.getElementById('fieldLongitude').value    = '';
        document.getElementById('fieldDisplayOrder').value = '';
    }

    overlay.classList.remove('hidden');
    // Foco en el primer campo para accesibilidad
    document.getElementById('fieldName').focus();
}

/**
 * Cierra el modal y resetea el formulario.
 */
function closeModal() {
    document.getElementById('modalOverlay').classList.add('hidden');
    document.getElementById('provinceForm').reset();
    document.getElementById('provinceId').value = '';
    hideModalError();
}

/**
 * Cierra el modal al hacer clic en el overlay (fuera del modal).
 * @param {MouseEvent} event
 */
function handleOverlayClick(event) {
    if (event.target === document.getElementById('modalOverlay')) {
        closeModal();
    }
}

/**
 * Muestra un mensaje de error dentro del modal.
 * @param {string} message
 */
function showModalError(message) {
    const el = document.getElementById('modalError');
    el.textContent = message;
    el.classList.remove('hidden');
}

/**
 * Oculta el mensaje de error del modal.
 */
function hideModalError() {
    const el = document.getElementById('modalError');
    el.textContent = '';
    el.classList.add('hidden');
}

// ── 4. Guardar (POST o PUT) ───────────────────────────────────────────────────

/**
 * Guarda la provincia. Si tiene id hace PUT, si no tiene hace POST.
 */
async function saveProvince() {
    hideModalError();

    const id           = document.getElementById('provinceId').value;
    const name         = document.getElementById('fieldName').value.trim();
    const fullName     = document.getElementById('fieldFullName').value.trim();
    const latitude     = document.getElementById('fieldLatitude').value;
    const longitude    = document.getElementById('fieldLongitude').value;
    const displayOrder = document.getElementById('fieldDisplayOrder').value;

    // Validación del lado cliente
    if (!name || !fullName || latitude === '' || longitude === '' || displayOrder === '') {
        showModalError('Todos los campos son obligatorios.');
        return;
    }

    const saveBtn       = document.getElementById('saveBtn');
    const saveBtnText   = document.getElementById('saveBtnText');
    const saveBtnSpinner = document.getElementById('saveBtnSpinner');

    // Mostrar spinner
    saveBtn.disabled        = true;
    saveBtnText.textContent = 'Guardando…';
    saveBtnSpinner.classList.remove('hidden');

    const body = {
        name,
        full_name:     fullName,
        latitude:      parseFloat(latitude),
        longitude:     parseFloat(longitude),
        display_order: parseInt(displayOrder, 10),
    };

    const isEdit = !!id;
    const method = isEdit ? 'PUT' : 'POST';

    if (isEdit) {
        body.id = parseInt(id, 10);
    }

    try {
        const response = await fetch(API_BASE, {
            method,
            headers: authHeaders(),
            body:    JSON.stringify(body),
        });

        await handleResponse(response);

        closeModal();
        showNotification(
            isEdit
                ? 'Provincia actualizada correctamente.'
                : 'Provincia creada correctamente.',
            'success'
        );
        await loadProvinces();

    } catch (error) {
        console.error('[saveProvince]', error);
        showModalError(error.message || 'No se pudo guardar la provincia.');
    } finally {
        // Restaurar botón
        saveBtn.disabled        = false;
        saveBtnText.textContent = 'Guardar';
        saveBtnSpinner.classList.add('hidden');
    }
}

// ── 5. Eliminar ───────────────────────────────────────────────────────────────

/**
 * Pide confirmación y elimina una provincia por su id.
 * @param {number} id
 */
async function deleteProvince(id) {
    const confirmed = confirm(`¿Estás seguro de que querés eliminar la provincia con ID ${id}? Esta acción no se puede deshacer.`);
    if (!confirmed) return;

    try {
        const response = await fetch(`${API_BASE}/${id}`, {
            method:  'DELETE',
            headers: authHeaders(),
        });

        await handleResponse(response);

        showNotification('Provincia eliminada correctamente.', 'success');
        await loadProvinces();

    } catch (error) {
        console.error('[deleteProvince]', error);
        showNotification(`Error al eliminar: ${error.message}`, 'error');
    }
}

// ── 6. Cerrar sesión ──────────────────────────────────────────────────────────

/**
 * Borra el token de localStorage y redirige al login.
 */
function logout() {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = 'index.html';
}

// ── Utilidades ────────────────────────────────────────────────────────────────

/**
 * Escapa caracteres HTML especiales para evitar XSS al inyectar en el DOM.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ── Atajo de teclado: Escape cierra el modal ──────────────────────────────────
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        const overlay = document.getElementById('modalOverlay');
        if (!overlay.classList.contains('hidden')) {
            closeModal();
        }
    }
});

// ── Inicialización ────────────────────────────────────────────────────────────
loadProvinces();
