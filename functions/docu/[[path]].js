export async function onRequest(context) {
    const url = new URL(context.request.url);
    const response = await context.env.ASSETS.fetch(context.request);

    const body = [
        'FUNCTION REACHED',
        `path: ${url.pathname}`,
        `assets_status: ${response.status}`,
        `assets_content_type: ${response.headers.get('content-type') ?? 'none'}`,
    ].join('\n');

    return new Response(body, {
        status: 200,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
}
