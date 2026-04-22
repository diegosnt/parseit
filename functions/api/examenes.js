/**
 * functions/api/examenes.js - Listar exámenes
 */
export async function onRequestGet(context) {
    const { request } = context;
    const url = new URL(request.url);
    
    // Intentamos varias rutas por si el deploy es desde root o desde dist
    const possiblePaths = [
        `${url.origin}/data/catalog.json`,
        `${url.origin}/public/data/catalog.json`
    ];

    let lastError = null;

    for (const path of possiblePaths) {
        try {
            // Agregamos cache busting
            const finalUrl = `${path}?v=${new Date().getTime()}`;
            const response = await fetch(finalUrl);
            
            if (response.ok) {
                const catalog = await response.json();
                return new Response(JSON.stringify(catalog), {
                    headers: { 
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-store, no-cache, must-revalidate'
                    }
                });
            }
            lastError = `Status ${response.status} en ${path}`;
        } catch (e) {
            lastError = e.message;
        }
    }

    return new Response(JSON.stringify({ 
        error: 'No se pudo cargar el catálogo.',
        details: lastError,
        tried: possiblePaths
    }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
    });
}
