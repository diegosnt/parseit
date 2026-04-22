/**
 * api.js - Acceso a los datos de exámenes
 */
import { fetchWithRetry } from './utils.js';

/**
 * Obtiene el catálogo completo de exámenes.
 */
export async function getExamenes() {
    // Agregamos un timestamp para saltar el cache de Cloudflare Edge y Service Worker
    const v = new Date().getTime();
    return fetchWithRetry(`/data/catalog.json?v=${v}`);
}

/**
 * Obtiene los datos de un examen específico por ID.
 */
export async function getExamen(id) {
    // Los exámenes individuales también podrían cambiar, mejor asegurar
    return fetchWithRetry(`/data/${id}.json`);
}
