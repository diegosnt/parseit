/**
 * api.js - Llamadas a la API de Cloudflare Functions
 */
import { fetchWithRetry } from './utils.js';

/**
 * Obtiene el catálogo completo de exámenes.
 */
export async function getExamenes() {
    return fetchWithRetry('/api/examenes');
}

/**
 * Obtiene los datos de un examen específico por ID.
 */
export async function getExamen(id) {
    return fetchWithRetry(`/api/examen/${id}`);
}
