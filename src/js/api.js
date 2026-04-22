/**
 * api.js - Acceso a los datos de exámenes
 */
import { fetchWithRetry } from './utils.js';

/**
 * Obtiene el catálogo completo de exámenes.
 */
export async function getExamenes() {
    // Apuntamos directamente al archivo estático para aprovechar el caché del SW
    return fetchWithRetry('/data/catalog.json');
}

/**
 * Obtiene los datos de un examen específico por ID.
 */
export async function getExamen(id) {
    // Apuntamos directamente al archivo estático
    return fetchWithRetry(`/data/${id}.json`);
}
