/**
 * functions/api/examen/[[id]].js - Obtener un examen mezclado por su ID
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

    // 🔒 Sanitizar el ID
    const sanitizedId = examId.replace(/[^a-zA-Z0-9_-]/g, '');
    if (!sanitizedId || sanitizedId !== examId) {
        return new Response(JSON.stringify({ error: 'ID de examen no válido.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const url = new URL(request.url);
    const jsonUrl = `${url.origin}/data/${sanitizedId}.json`;

    try {
        const response = await fetch(jsonUrl);
        if (!response.ok) throw new Error('Examen no encontrado');
        
        const data = await response.json();

        // Envolver en objeto si es array
        let examen = Array.isArray(data) ? {
            materia: "Examen Genérico",
            titulo: sanitizedId,
            duracion: 0,
            preguntas_para_aprobar: Math.ceil(data.length * 0.6),
            fecha: new Date().toISOString().split('T')[0],
            total_preguntas: data.length,
            version: 1,
            preguntas: data
        } : data;

        // Mezclar las preguntas y opciones
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
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Examen no encontrado.' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
