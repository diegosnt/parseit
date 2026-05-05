# ParseIt - Sistema de Exámenes Interactivos (v9)

Aplicación web para rendir exámenes interactivos, deployada en Cloudflare Pages. Sin frameworks pesados, sin bundler en runtime — HTML, CSS y JS vanilla con un Worker en el edge para la API.

## Stack

- **Frontend**: HTML5 + CSS3 (Variables + Animaciones) + JS Vanilla (ES Modules)
- **Edge**: Cloudflare Pages Functions (Worker)
- **Validación**: Zod 4 (esquemas de datos)
- **Librerías vendor**: Choices.js (selector de exámenes), canvas-confetti
- **Build & Tooling**: Vite 8, Wrangler 3, pnpm 10

## Novedades (v9)

- **UX Compacto**: Rediseño integral de la interfaz para máxima legibilidad.
- **Selector de Intensidad**: Permite elegir qué porcentaje de preguntas rendir (100%, 75%, 50%, 25% o 5%).
- **Feedback Activo**: El botón de progreso pulsa visualmente cuando el examen está listo para ser entregado.
- **Footer Dinámico**: Visualización de metadatos del examen (versión, fecha, materia) directamente en el pie de página.
- **Estandarización**: Todos los archivos de datos ahora siguen el patrón `preguntas00X.json`.

## Estructura

```
index.html              # Entry point (UI y layout)
src/
  app.js                # Orquestador principal
  styles.css            # Diseño responsivo + Temas + Animaciones
  js/
    api.js              # Comunicación con el Worker
    state.js            # Gestión de estado (Redux-like simplificado)
    ui.js               # Manipulación del DOM y renderizado
    utils.js            # Helpers de lógica
    theme.js            # Gestión de Dark/Light mode
vendor/                 # Librerías externas (offline-ready)
functions/
  api/                  # Endpoints en Cloudflare Functions
public/
  data/                 # Base de datos JSON (Exámenes)
  sw.js                 # Service Worker (Network-First Strategy)
scripts/                # Scripts de validación y build
```

## Agregar un examen

1. Crear un archivo `.json` en `public/data/` siguiendo el patrón `preguntas00X.json` (ej: `preguntas003.json`).
2. Formato requerido (validado con Zod):
   ```json
   {
     "materia": "NOMBRE",
     "titulo": "Unidades X e Y",
     "duracion": 60,
     "preguntas_para_aprobar": 10,
     "fecha": "2026-05-05",
     "version": "1.0",
     "preguntas": [
       {
         "id": 1,
         "pregunta": "¿Texto de la pregunta?",
         "opciones": ["Opción A", "Opción B", "Opción C"],
         "respuesta_correcta": 0
       }
     ]
   }
   ```
3. Regenerar el catálogo: `pnpm gen-manifest` (esto valida los JSONs automáticamente).
4. Deploy: `pnpm run deploy`

## Comandos

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Entorno local completo (Vite + Wrangler Proxy) |
| `pnpm gen-manifest` | Valida JSONs y regenera el catálogo |
| `pnpm build` | Genera los assets de producción en `dist/` |
| `pnpm run deploy` | Compila y sube a Cloudflare Pages |

## Características

- **Dark Mode**: Persistencia automática según preferencia del usuario.
- **Modo Estudio**: Corrección inmediata pregunta a pregunta para aprendizaje rápido.
- **Offline-First**: Funciona sin conexión gracias al Service Worker.
- **Anti-Cache**: Invalida el cache del edge automáticamente con timestamps.
- **Gamificación**: Confeti al aprobar y feedback visual (shake) al fallar.
