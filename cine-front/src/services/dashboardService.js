import api from './api';

const dashboardService = {
    getStats: async () => {
        try {
            const response = await api.get('/admin/stats');
            return response.data;
        } catch (error) {
            console.error('Error fetching admin stats:', error);
            throw error;
        }
    }
};

export default dashboardService;
