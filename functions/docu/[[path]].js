export async function onRequest(context) {
    const response = await context.env.ASSETS.fetch(context.request);

    if (!response.ok) {
        const url = new URL(context.request.url);
        return new Response(
            `Not found: ${url.pathname} (ASSETS returned ${response.status})`,
            { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
        );
    }

    return response;
}
