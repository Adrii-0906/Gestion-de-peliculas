import axios from 'axios';

// Aquí apuntamos a tu Spring Boot en Docker
// Si en Docker usaste otro puerto que no sea 8080, cámbialo aquí.
const BASE_URL = 'http://localhost:8081/api';
// NOTA: Asegúrate de que tus controllers en Java tengan @RequestMapping("/api/...")
// o cambia la URL de arriba para que coincida con tus rutas (ej: http://localhost:8080).

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;