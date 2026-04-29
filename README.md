# ParseIt - Sistema de Exámenes Interactivos

Aplicación web para rendir exámenes interactivos, deployada en Cloudflare Pages. Sin frameworks, sin bundler en runtime — HTML, CSS y JS vanilla con un Worker en el edge.

## Stack

- **Frontend**: HTML + CSS + JS vanilla (módulos ES)
- **Edge**: Cloudflare Pages Functions (Worker)
- **Librerías vendor**: Choices.js (selector de exámenes), canvas-confetti
- **Build**: Vite (solo para scripts de generación y deploy)

## Estructura

```
index.html              # Entry point
src/
  app.js                # Lógica principal
  styles.css            # Estilos globales + dark mode + responsive
  js/
    api.js              # Fetch al Worker
    state.js            # Estado del examen
    ui.js               # Render y feedback visual
    utils.js            # Helpers
    theme.js            # Toggle dark/light mode
vendor/
  choices.min.js        # Selector enriquecido
  choices.min.css
  confetti.browser.min.js
functions/
  api/                  # Cloudflare Pages Functions (Worker)
public/
  data/                 # JSONs de exámenes
  sw.js                 # Service Worker (Network-First)
  manifest.webmanifest
scripts/                # Generación de catálogo y validación
```

## Agregar un examen

1. Crear un archivo `.json` en `public/data/` (ej: `preguntas0010.json`)
2. Formato requerido:
   ```json
   {
     "materia": "NOMBRE",
     "titulo": "Unidades X e Y",
     "duracion": 60,
     "preguntas_para_aprobar": 10,
     "fecha": "2026-04-22",
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
3. Regenerar el catálogo: `pnpm gen-manifest`
4. Deploy: `pnpm run deploy`

## Comandos

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Desarrollo local con proxy a Cloudflare Functions |
| `pnpm gen-manifest` | Valida JSONs y regenera el catálogo |
| `pnpm build` | Build de producción |
| `pnpm run deploy` | Deploy a Cloudflare Pages |

## Anti-cache

Todas las requests al catálogo y exámenes llevan `?v=<timestamp>` para invalidar el cache del edge. El Service Worker usa estrategia **Network-First** — siempre intenta la red, el cache es solo fallback offline.

## Features

- Dark mode con persistencia en `localStorage`
- Modo estudio: corrección inmediata por pregunta
- Porcentaje configurable de preguntas (100% / 75% / 50% / 25% / 5%)
- Timer por examen
- Confeti al aprobar, screen shake al reprobar
- Offline-First via Service Worker
