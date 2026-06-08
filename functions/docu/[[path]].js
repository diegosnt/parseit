export async function onRequest(context) {
    const url = new URL(context.request.url);

    // Try 1: original clean URL (ASSETS smart matching)
    const r1 = await context.env.ASSETS.fetch(context.request);
    const t1 = await r1.text();

    // Try 2: explicit .html path
    const htmlPath = url.pathname.endsWith('.html') ? url.pathname : url.pathname + '.html';
    const r2 = await context.env.ASSETS.fetch(new Request(new URL(htmlPath, url.origin).href));
    const t2 = await r2.text();

    const body = [
        'DIAGNOSTIC v2',
        `path: ${url.pathname}`,
        '',
        `[try1] clean_url status=${r1.status} length=${t1.length}`,
        `[try1] starts_with: ${t1.substring(0, 80).replace(/\n/g, ' ')}`,
        '',
        `[try2] html_path=${htmlPath} status=${r2.status} length=${t2.length}`,
        `[try2] starts_with: ${t2.substring(0, 80).replace(/\n/g, ' ')}`,
    ].join('\n');

    return new Response(body, {
        status: 200,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
}
