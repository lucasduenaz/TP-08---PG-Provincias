/**
 * login.js — Lógica de login y registro.
 */

const TOKEN_KEY       = 'jwt_token';
const API_LOGIN       = '/api/auth/login';
const API_REGISTER    = '/api/auth/register';

// ── Si ya hay sesión activa, ir directo al CRUD ───────────────────────────────
if (localStorage.getItem(TOKEN_KEY)) {
    window.location.href = 'provinces.html';
}

// ── Referencias DOM ───────────────────────────────────────────────────────────
const loginForm           = document.getElementById('loginForm');
const registerForm        = document.getElementById('registerForm');
const formSubtitle        = document.getElementById('formSubtitle');

const loginError          = document.getElementById('loginError');
const loginBtn            = document.getElementById('loginBtn');
const loginBtnText        = document.getElementById('loginBtnText');
const loginBtnSpinner     = document.getElementById('loginBtnSpinner');

const registerError       = document.getElementById('registerError');
const registerSuccess     = document.getElementById('registerSuccess');
const registerBtn         = document.getElementById('registerBtn');
const registerBtnText     = document.getElementById('registerBtnText');
const registerBtnSpinner  = document.getElementById('registerBtnSpinner');

// ── Toggle entre login y registro ─────────────────────────────────────────────
document.getElementById('goToRegister').addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    formSubtitle.textContent = 'Creá tu cuenta para continuar';
    hideMsg(loginError);
});

document.getElementById('goToLogin').addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    formSubtitle.textContent = 'Ingresá tus credenciales para continuar';
    hideMsg(registerError);
    hideMsg(registerSuccess);
});

// ── Helpers de mensajes ───────────────────────────────────────────────────────
function showMsg(el, message) {
    el.textContent = message;
    el.classList.remove('hidden');
}
function hideMsg(el) {
    el.textContent = '';
    el.classList.add('hidden');
}
function setLoading(btn, textEl, spinnerEl, loading, defaultText) {
    btn.disabled       = loading;
    textEl.textContent = loading ? 'Espera…' : defaultText;
    spinnerEl.classList.toggle('hidden', !loading);
}

// ── LOGIN ─────────────────────────────────────────────────────────────────────
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideMsg(loginError);

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (!username || !password) {
        showMsg(loginError, 'Completá usuario y contraseña.');
        return;
    }

    setLoading(loginBtn, loginBtnText, loginBtnSpinner, true, 'Ingresar');

    try {
        const res = await fetch(API_LOGIN, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ username, password }),
        });

        if (res.ok) {
            const data = await res.json();
            localStorage.setItem(TOKEN_KEY, data.token);
            window.location.href = 'provinces.html';
        } else {
            const text = await res.text();
            if (res.status === 401) {
                showMsg(loginError, 'Usuario o contraseña incorrectos.');
            } else if (res.status === 400) {
                showMsg(loginError, text || 'Datos inválidos.');
            } else {
                showMsg(loginError, 'Error del servidor. Intentá de nuevo.');
            }
        }
    } catch {
        showMsg(loginError, 'No se pudo conectar con el servidor.');
    } finally {
        setLoading(loginBtn, loginBtnText, loginBtnSpinner, false, 'Ingresar');
    }
});

// ── REGISTRO ──────────────────────────────────────────────────────────────────
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideMsg(registerError);
    hideMsg(registerSuccess);

    const username        = document.getElementById('regUsername').value.trim();
    const password        = document.getElementById('regPassword').value;
    const passwordConfirm = document.getElementById('regPasswordConfirm').value;

    if (!username || !password || !passwordConfirm) {
        showMsg(registerError, 'Completá todos los campos.');
        return;
    }
    if (password !== passwordConfirm) {
        showMsg(registerError, 'Las contraseñas no coinciden.');
        return;
    }
    if (password.length < 6) {
        showMsg(registerError, 'La contraseña debe tener al menos 6 caracteres.');
        return;
    }

    setLoading(registerBtn, registerBtnText, registerBtnSpinner, true, 'Crear cuenta');

    try {
        const res = await fetch(API_REGISTER, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ username, password, passwordConfirm }),
        });

        if (res.ok) {
            // Registro exitoso: mostrar éxito y volver al login automáticamente
            registerForm.reset();
            showMsg(registerSuccess, `¡Cuenta creada! Ya podés iniciar sesión con "${username}".`);
            setTimeout(() => {
                document.getElementById('goToLogin').click();
                document.getElementById('username').value = username;
            }, 2000);
        } else {
            const text = await res.text();
            showMsg(registerError, text || 'No se pudo crear la cuenta.');
        }
    } catch {
        showMsg(registerError, 'No se pudo conectar con el servidor.');
    } finally {
        setLoading(registerBtn, registerBtnText, registerBtnSpinner, false, 'Crear cuenta');
    }
});
