export async function onRequest(context) {
    const url = new URL(context.request.url);
    let pathname = url.pathname;

    // Si la ruta no termina en .html, le agregamos la extensión
    if (!pathname.endsWith('.html')) {
        pathname = pathname + '.html';
    }

    const assetUrl = new URL(pathname, url.origin);
    
    // Al solicitar el archivo con extensión .html (que está excluido en _routes.json),
    // ASSETS.fetch evitará ejecutar de nuevo la función, previniendo bucles infinitos
    // y trayendo el archivo HTML estático real desde la carpeta de distribución.
    const response = await context.env.ASSETS.fetch(new Request(assetUrl.toString(), context.request));

    return response;
}
