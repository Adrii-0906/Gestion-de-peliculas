import api from './api';

const comentarioService = {
    // Obtener todos los comentarios
    obtenerTodos: async () => {
        try {
            const response = await api.get('/comentarios');
            return response.data;
        } catch (error) {
            console.error('Error fetching all comments:', error);
            throw error;
        }
    },

    // Obtener comentarios de una película
    obtenerPorPelicula: async (peliculaId) => {
        const response = await api.get(`/comentarios/pelicula/${peliculaId}`);
        return response.data;
    },

    // Crear nuevo comentario
    create: async (peliculaId, texto) => {
        const response = await api.post('/comentarios', { peliculaId, texto });
        return response.data;
    },

    // Eliminar comentario
    delete: async (id) => {
        await api.delete(`/comentarios/${id}`);
    },

    // Alias para delete
    eliminar: async (id) => {
        await api.delete(`/comentarios/${id}`);
    }
};

export default comentarioService;
