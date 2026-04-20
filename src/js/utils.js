/**
 * utils.js - Funciones de ayuda generales
 */

/**
 * Escapa caracteres especiales de HTML para prevenir XSS.
 */
export function escapeHTML(str) {
    if (!str) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return str.toString().replace(/[&<>"']/g, function(m) { return map[m]; });
}

/**
 * Mezcla aleatoriamente los elementos de un array (Fisher-Yates).
 */
export function shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Realiza una petición fetch con lógica de reintentos.
 */
export async function fetchWithRetry(url, options = {}, retries = 3, backoff = 500) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        return await response.json();
    } catch (error) {
        if (retries > 0) {
            console.warn(`Fallo en la conexión. Reintentando en ${backoff}ms... (${retries} intentos restantes)`);
            await new Promise(resolve => setTimeout(resolve, backoff));
            return fetchWithRetry(url, options, retries - 1, backoff * 2);
        }
        throw error;
    }
}
