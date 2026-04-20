# 📝 ParseIt - Sistema de Exámenes Interactivos Dinámicos

**ParseIt** es una aplicación web moderna, robusta y optimizada para Cloudflare Pages, diseñada para ofrecer una experiencia de evaluación y estudio inigualable. El sistema destaca por su enfoque en la UX inmersiva, feedback sensorial y herramientas de aprendizaje en tiempo real.

## 🚀 Características Destacadas

- **Optimizado para Cloudflare Pages**: Arquitectura basada en **Cloudflare Functions**, lista para escalar globalmente en el edge sin necesidad de un servidor tradicional.
- **Vite-Powered**: Entorno de desarrollo ultra-rápido con Hot Module Replacement (HMR) y builds de producción optimizados.
- **PWA (Progressive Web App)**: Instalable en dispositivos móviles y con funcionamiento **Offline-First**. Estudia sin conexión a internet.
- **Validación Estricta (Zod)**: Todo examen cargado es validado en tiempo de build, garantizando que no existan errores de formato o lógica de respuestas.
- **Experiencia Inmersiva (Dual Feedback)**:
  - **Celebración**: Ráfagas de confeti dinámicas (`canvas-confetti`) al aprobar.
  - **Impacto Negativo**: Efecto de sacudida de pantalla (*Screen Shake*) y viñeta roja periférica al reprobar para un feedback sensorial inmediato.
- **Modo Oscuro Orgánico**: Paleta de colores premium con toggle de tema elíptico.

## 🛡️ Seguridad y Robustez

- **Validación Shift-Left**: Los errores en los JSONs se detectan antes del despliegue mediante esquemas de **Zod**. Si un examen está roto, el build falla y el despliegue se detiene.
- **Arquitectura Modular (ES Modules)**: Separación estricta de responsabilidades en módulos dedicados (`api.js`, `ui.js`, `state.js`, `theme.js`, `utils.js`).
- **Autonomía Total (No CDNs)**: Todas las librerías externas se sirven localmente, garantizando funcionamiento sin internet y máxima privacidad.

## 🛠️ Stack Tecnológico

- **Frontend**: HTML5, CSS3, Vanilla JS (ES6+ Modules / Vite).
- **Backend**: Cloudflare Pages Functions (Serverless).
- **Validación**: Zod (Schema Validation).
- **Herramientas**: `pnpm`, `vite`, `wrangler`, `concurrently`.

## 🔧 Instalación y Desarrollo Local

1. **Instalar dependencias**:
   ```bash
   pnpm install
   ```

2. **Ejecutar en modo desarrollo (Full Stack)**:
   ```bash
   pnpm dev
   ```
   *Esto inicia el frontend en `http://localhost:5173` y el backend en `http://localhost:8788` de forma simultánea.*

3. **Build para Producción**:
   ```bash
   pnpm build
   ```
   *Genera la carpeta `dist/` con todos los activos optimizados y validados.*

4. **Probar Build localmente (con funciones)**:
   ```bash
   pnpm start
   ```

## 📄 Estructura del Proyecto

```text
/
├── dist/               # Carpeta de build final (generada)
├── functions/          # Backend Serverless (Cloudflare Functions)
│   └── api/            # Endpoints dinámicos de exámenes
├── public/             # Archivos estáticos puros (No procesados por Vite)
│   ├── data/           # JSONs de exámenes y catalog.json (Validado)
│   ├── vendor/         # Librerías de terceros (Choices.js, Confetti)
│   ├── sw.js           # Service Worker (Caché Offline)
│   └── manifest.webmanifest # Configuración PWA
├── src/                # Código fuente de la aplicación
│   ├── js/             # Módulos de lógica (api, ui, state, theme, utils)
│   ├── app.js          # Orquestador principal
│   └── styles.css      # Estilos premium
├── scripts/            # Scripts de automatización en Node.js
│   └── generate-catalog.js # Generador y Validador (Zod)
├── index.html          # Punto de entrada de la aplicación
├── vite.config.js      # Configuración de Vite
├── package.json        # Configuración de scripts y dependencias
└── README.md
```

## 📂 Gestión de Exámenes (JSON)

Ubicación: `public/data/*.json`. El sistema detecta y valida automáticamente cualquier archivo `.json` en esta carpeta.

### Cómo agregar un nuevo examen:

1.  **Crear el archivo**: Crea un archivo `.json` dentro de `public/data/`.
2.  **Seguir el formato**: Asegúrate de incluir todos los campos obligatorios (`materia`, `titulo`, `duracion`, `preguntas_para_aprobar`, `fecha`, `version`, `preguntas`).
### Ejemplo de formato JSON:

```json
{
  "materia": "HISTORIA",
  "titulo": "Revolución de Mayo",
  "duracion": 15,
  "preguntas_para_aprobar": 8,
  "fecha": "2026-04-18",
  "version": "1.2",
  "preguntas": [
    {
      "id": 1,
      "pregunta": "¿En qué año fue la Revolución de Mayo?",
      "opciones": ["1810", "1816", "1820", "1789"],
      "respuesta_correcta": 0
    }
  ]
}
```

---

## 📈 Roadmap Técnico (Completado)

1.  ✅ **Optimización de API (Catálogo Estático)**: Eliminación de latencia N+1 mediante `catalog.json`.
2.  ✅ **Arquitectura de Frontend Modular**: Refactorizado a **ES Modules** con separación de responsabilidades.
3.  ✅ **Validación Estricta de Datos (Zod)**: Implementado control de calidad en tiempo de build.
4.  ✅ **Capacidades PWA (Offline-First)**: Funcionamiento offline absoluto mediante Service Worker.
5.  ✅ **Modernización del Tooling (Vite)**: Migración a un entorno de desarrollo de clase mundial.

---
## 👨‍💻 Autor

Desarrollado con ❤️ por **Diego**.

*Transformando la educación en una experiencia segura, rápida e inmersiva.*
