import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, API_TIMEOUT_MS } from '../../../app/config/config';

const API_CLIENT = axios.create({
    baseURL: `${API_BASE_URL}/api/v1/locations`,
    timeout: API_TIMEOUT_MS,
});

// Interceptor para añadir el token JWT a todas las peticiones
API_CLIENT.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const locationService = {
    /**
     * Publica la ubicación actual del usuario
     */
    publishLocation: async (latitude, longitude, accuracy, isPublic = true) => {
        try {
            const response = await API_CLIENT.post('/publish', {
                latitude,
                longitude,
                accuracy,
                isPublic,
            });
            return response.data;
        } catch (error) {
            console.error('Error publishing location:', error);
            throw error;
        }
    },

    /**
     * Obtiene la ubicación más reciente del usuario autenticado
     */
    getMyLocation: async () => {
        try {
            const response = await API_CLIENT.get('/me');
            return response.data;
        } catch (error) {
            console.error('Error getting my location:', error);
            throw error;
        }
    },

    /**
     * Obtiene todas las ubicaciones públicas (últimas 100)
     */
    getPublicLocations: async () => {
        try {
            const response = await API_CLIENT.get('/public');
            return response.data;
        } catch (error) {
            console.error('Error fetching public locations:', error);
            throw error;
        }
    },

    /**
     * Obtiene ubicaciones públicas desde un número de minutos atrás
     */
    getPublicLocationsSince: async (minutesSince = 10) => {
        try {
            const response = await API_CLIENT.get('/public/since', {
                params: { minutesSince },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching public locations since:', error);
            throw error;
        }
    },

    /**
     * Obtiene la ubicación más reciente pública de un usuario específico
     */
    getUserLocation: async (userId) => {
        try {
            const response = await API_CLIENT.get(`/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user location:', error);
            throw error;
        }
    },

    /**
     * Cambia la privacidad de tu ubicación (pública/privada)
     */
    togglePrivacy: async () => {
        try {
            const response = await API_CLIENT.put('/toggle-privacy');
            return response.data;
        } catch (error) {
            console.error('Error toggling privacy:', error);
            throw error;
        }
    },

    /**
     * Elimina tu ubicación publicada
     */
    deleteMyLocation: async () => {
        try {
            const response = await API_CLIENT.delete('/me');
            return response.data;
        } catch (error) {
            console.error('Error deleting location:', error);
            throw error;
        }
    },
};
