import api from './api';

const getProfileName = () => {
    try {
        const profile = JSON.parse(localStorage.getItem('currentProfile'));
        return profile?.name || 'Default';
    } catch (e) {
        return 'Default';
    }
};

const listaService = {
    // Obtener lista del usuario
    obtenerLista: async (usuarioId) => {
        try {
            const response = await api.get(`/lista/usuario/${usuarioId}`, {
                params: { profileName: getProfileName() }
            });
            return response.data;
        } catch (error) {
            console.error('Error al obtener la lista:', error);
            throw error;
        }
    },

    // Verificar si una película está en la lista
    verificarEstado: async (usuarioId, peliculaId) => {
        try {
            const response = await api.get(`/lista/check/${usuarioId}/${peliculaId}`, {
                params: { profileName: getProfileName() }
            });
            return response.data;
        } catch (error) {
            console.error('Error al verificar estado:', error);
            return false;
        }
    },

    // Agregar a la lista
    agregar: async (usuarioId, peliculaId) => {
        try {
            await api.post(`/lista/${usuarioId}/${peliculaId}`, null, {
                params: { profileName: getProfileName() }
            });
        } catch (error) {
            console.error('Error al agregar a la lista:', error);
            throw error;
        }
    },

    // Quitar de la lista
    quitar: async (usuarioId, peliculaId) => {
        try {
            await api.delete(`/lista/${usuarioId}/${peliculaId}`, {
                params: { profileName: getProfileName() }
            });
        } catch (error) {
            console.error('Error al quitar de la lista:', error);
            throw error;
        }
    }
};

export default listaService;
