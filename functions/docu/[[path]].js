export async function onRequest(context) {
    const url = new URL(context.request.url);
    let pathname = url.pathname;

    // Add .html extension if missing
    if (!pathname.endsWith('.html')) {
        pathname = pathname + '.html';
    }

    const assetUrl = new URL(pathname, url.origin);
    const response = await context.env.ASSETS.fetch(new Request(assetUrl.href, {
        method: context.request.method,
        headers: context.request.headers,
    }));

    if (!response.ok) {
        return new Response('Not found', { status: 404 });
    }

    return new Response(response.body, {
        status: response.status,
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
        },
    });
}
