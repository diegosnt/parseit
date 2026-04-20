/**
 * functions/api/examenes.js - Listar exámenes en Cloudflare Pages
 */
export async function onRequestGet(context) {
    const { request } = context;
    const url = new URL(request.url);
    const catalogUrl = `${url.origin}/data/catalog.json`;

    try {
        const response = await fetch(catalogUrl);
        if (!response.ok) throw new Error('Catálogo no encontrado');
        
        const catalog = await response.json();

        return new Response(JSON.stringify(catalog), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'No se pudieron listar los exámenes.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
