/**
 * functions/api/examenes.js - Listar exámenes en Cloudflare Pages
 */
export async function onRequestGet(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const manifestUrl = `${url.origin}/data/manifest.json`;

    try {
        const response = await fetch(manifestUrl);
        const examIds = await response.json();

        const examenes = await Promise.all(
            examIds.map(async (id) => {
                const examResponse = await fetch(`${url.origin}/data/${id}.json`);
                const json = await examResponse.json();
                return {
                    id,
                    materia: json.materia || "Sin materia",
                    titulo: json.titulo || id
                };
            })
        );

        return new Response(JSON.stringify(examenes), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'No se pudieron listar los exámenes.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
