/**
 * api.js - Acceso a los datos de exámenes via API
 */
import { fetchWithRetry } from './utils.js';

/**
 * Obtiene el catálogo completo de exámenes.
 */
export async function getExamenes() {
    const v = new Date().getTime();
    // Usamos la API de Cloudflare que ya maneja las rutas internas correctamente
    return fetchWithRetry(`/api/examenes?v=${v}`);
}

/**
 * Obtiene los datos de un examen específico por ID.
 */
export async function getExamen(id) {
    const v = new Date().getTime();
    return fetchWithRetry(`/api/examen/${id}?v=${v}`);
}
