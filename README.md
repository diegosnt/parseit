# 📝 ParseIt - Sistema de Exámenes Interactivos Dinámicos

**ParseIt** es una aplicación web moderna, robusta y optimizada para Cloudflare Pages. Diseñada para ofrecer una experiencia de evaluación y estudio inigualable, con un enfoque en la UX inmersiva, funcionamiento offline y validación estricta de datos.

## 🚀 Cómo agregar nuevos exámenes (Paso a Paso)

El sistema automatiza la detección y validación de exámenes. Para subir contenido nuevo:

1.  **Crear el JSON**: Crea un archivo `.json` en `public/data/` (ej: `preguntas0003.json`).
2.  **Formato Obligatorio**: Asegúrate de que el archivo cumpla con este esquema:
    ```json
    {
      "materia": "NOMBRE DE LA MATERIA",
      "titulo": "Unidades X e Y",
      "duracion": 60,
      "preguntas_para_aprobar": 10,
      "fecha": "2026-04-22",
      "version": "1.0",
      "preguntas": [
        {
          "id": 1,
          "pregunta": "¿Cuál es la respuesta?",
          "opciones": ["Opción A", "Opción B", "Opción C"],
          "respuesta_correcta": 0
        }
      ]
    }
    ```
3.  **Generar Catálogo**: El sistema necesita actualizar el `catalog.json`.
    - En desarrollo: Se actualiza solo al ejecutar `pnpm dev`.
    - Manualmente: `pnpm gen-manifest`.
4.  **Desplegar**: Al ejecutar `pnpm run deploy`, el sistema valida automáticamente todos los JSONs. Si alguno tiene un error de formato, el build fallará para proteger la producción.

## 🛡️ Arquitectura Anti-Cache (v9)

Hemos implementado una estrategia de guerra contra el cache para asegurar que los usuarios siempre vean los exámenes más nuevos:
- **Cache Busting**: Todas las peticiones al catálogo y exámenes incluyen un timestamp (`?v=...`) para saltar el cache de Cloudflare Edge.
- **Service Worker Inteligente**: Utiliza una estrategia **Network-First** para los datos. Prioriza siempre la descarga fresca de internet y usa el cache solo como respaldo (Offline-Mode).
- **Indicador de Versión**: En el footer de la página verás la versión actual (ej: **v9**). Si no ves la última versión, fuerza una recarga (Ctrl+F5).

## 🛠️ Stack y Características

- **Validación con Zod**: Los exámenes se validan en tiempo de build. No más errores 404 o campos faltantes en producción.
- **Normalización en Cliente**: La app es capaz de procesar JSONs crudos (arrays de preguntas) o exámenes completos con metadatos, normalizando todo en el navegador.
- **Offline-First**: Gracias al Service Worker, una vez que cargaste un examen, podés hacerlo sin conexión a internet.
- **Feedback Sensorial**: Confeti al aprobar y efecto de sacudida (*Screen Shake*) al reprobar.

## ⚙️ Comandos Útiles

- `pnpm dev`: Inicia el entorno de desarrollo con proxy a Cloudflare Functions.
- `pnpm gen-manifest`: Valida los JSONs y regenera el catálogo de exámenes.
- `pnpm build`: Prepara los archivos para producción.
- `pnpm run deploy`: Sube los cambios a Cloudflare Pages.

---
Desarrollado con ❤️ por **Diego**. (v9)
