import axios from 'axios';

// URL del backend desde variable de entorno
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const auth = localStorage.getItem('auth');
    // No enviar auth en login/registro para evitar conflictos 401
    // Solo excluir POST a /usuarios (registro), no GET (listar usuarios para admin)
    const isRegister = config.method === 'post' && config.url.endsWith('/usuarios');
    const isLogin = config.url.includes('/login');

    if (auth && !isLogin && !isRegister) {
        config.headers.Authorization = `Basic ${auth}`;
    }
    return config;
});

// Interceptor para manejar errores de respuesta (ej: 401 Unauthorized)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Si el token/usuario ya no es válido (ej: base de datos reseteada), cerramos sesión
            localStorage.removeItem('auth');
            localStorage.removeItem('user');
            // Redirigir al login (usando window.location para forzar recarga limpia)
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;