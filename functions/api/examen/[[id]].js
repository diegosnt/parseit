/**
 * functions/api/examen/[[id]].js - Obtener un examen mezclado
 */
function shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export async function onRequestGet(context) {
    const { params, request } = context;
    const examId = params.id ? params.id[0] : null;

    if (!examId) {
        return new Response(JSON.stringify({ error: 'ID de examen no especificado.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const sanitizedId = examId.replace(/[^a-zA-Z0-9_-]/g, '');
    const url = new URL(request.url);
    
    const possiblePaths = [
        `${url.origin}/data/${sanitizedId}.json`,
        `${url.origin}/public/data/${sanitizedId}.json`
    ];

    let lastError = null;

    for (const path of possiblePaths) {
        try {
            const response = await fetch(`${path}?v=${new Date().getTime()}`);
            if (response.ok) {
                const data = await response.json();

                // Normalización de datos
                let examen = Array.isArray(data) ? {
                    materia: "Examen Genérico",
                    titulo: sanitizedId,
                    duracion: 0,
                    preguntas_para_aprobar: Math.ceil(data.length * 0.6),
                    fecha: new Date().toISOString().split('T')[0],
                    version: 1,
                    preguntas: data
                } : data;

                // Mezclado de preguntas y opciones
                const shuffledQuestions = shuffle(examen.preguntas).map(pregunta => {
                    const opcionesConId = pregunta.opciones.map((texto, index) => ({
                        texto,
                        id: index
                    }));
                    return {
                        ...pregunta,
                        opciones: shuffle(opcionesConId)
                    };
                });

                return new Response(JSON.stringify({
                    ...examen,
                    preguntas: shuffledQuestions
                }), {
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
        error: 'Examen no encontrado.',
        details: lastError,
        tried: possiblePaths
    }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
    });
}
