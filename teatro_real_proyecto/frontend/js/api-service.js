/**
 * Servicio de API - Teatro Real
 * Conecta el frontend con el backend Java Spring Boot
 */

const API_BASE_URL = 'http://localhost:8080/api';

class ApiService {
    constructor() {
        this.baseUrl = API_BASE_URL;
    }

    async fetchWithHeaders(endpoint, options = {}) {
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        };

        const mergedOptions = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers
            }
        };

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, mergedOptions);
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // TEMPO - ACTIVIDADES
    async getAllActividades() {
        return this.fetchWithHeaders('/tempo/actividades');
    }

    async getActividadById(id) {
        return this.fetchWithHeaders(`/tempo/actividades/${id}`);
    }

    async createActividad(actividadData) {
        return this.fetchWithHeaders('/tempo/actividades', {
            method: 'POST',
            body: JSON.stringify(actividadData)
        });
    }

    // TEMPO - ESPACIOS
    async getAllEspacios() {
        return this.fetchWithHeaders('/tempo/espacios');
    }

    async getEspacioById(id) {
        return this.fetchWithHeaders(`/tempo/espacios/${id}`);
    }

    async createEspacio(espacioData) {
        return this.fetchWithHeaders('/tempo/espacios', {
            method: 'POST',
            body: JSON.stringify(espacioData)
        });
    }
}

const apiService = new ApiService();
