# 📝 ParseIt - Sistema de Exámenes Interactivos Dinámicos

**ParseIt** es una aplicación web moderna, robusta y optimizada para Cloudflare Pages, diseñada para ofrecer una experiencia de evaluación y estudio inigualable. El sistema destaca por su enfoque en la UX inmersiva, feedback sensorial y herramientas de aprendizaje en tiempo real.

## 🚀 Características Destacadas

- **Optimizado para Cloudflare Pages**: Arquitectura basada en **Cloudflare Functions**, lista para escalar globalmente en el edge sin necesidad de un servidor tradicional.
- **Modo Estudio (Corrección Inmediata)**: Un switch dinámico en el header que, al activarse, revela la respuesta correcta e incorrecta al instante después de cada selección.
- **Header Inteligente y Responsivo Extreme**: Centro de control ultra-compacto diseñado específicamente para móviles, con fuentes optimizadas, botones alineados y metadatos legibles en cualquier resolución.
- **Experiencia Inmersiva (Dual Feedback)**:
  - **Celebración**: Ráfagas de confeti dinámicas (`canvas-confetti`) al aprobar.
  - **Impacto Negativo**: Efecto de sacudida de pantalla (*Screen Shake*) y viñeta roja periférica al reprobar para un feedback sensorial inmediato.
- **Validación Estricta**: El botón de finalizar se bloquea visual y funcionalmente (sin efectos de hover) hasta que se responden todas las preguntas, evitando entregas accidentales.
- **Modo Oscuro Orgánico**: Paleta de colores premium basada en tonos crema y marrones profundos, con un toggle de tema elíptico que muestra sol y luna simultáneamente.

## 🛡️ Seguridad y Robustez

- **Protección contra Path Traversal**: El servidor sanitiza rigurosamente los parámetros de entrada, bloqueando cualquier intento de acceso no autorizado a archivos.
- **Prevención de XSS**: Implementación de funciones de escape de HTML en el frontend para asegurar un renderizado seguro de contenidos externos.
- **Autonomía Total (No CDNs)**: Todas las librerías externas (`Choices.js`, `Confetti`) se sirven localmente desde `public/vendor/`, garantizando funcionamiento offline parcial y máxima privacidad.

## 🛠️ Stack Tecnológico

- **Frontend**: HTML5, CSS3 (Variables, Media Queries avanzadas), Vanilla JS (ES6+).
- **Backend**: Cloudflare Pages Functions (Serverless / Node.js Runtime).
- **Herramientas**: `pnpm`, `wrangler` (Cloudflare CLI).
- **Librerías**: Choices.js, Canvas-Confetti.

## 🔧 Instalación y Desarrollo Local

1. **Instalar dependencias**:
   ```bash
   pnpm install
   ```

2. **Ejecutar localmente**:
   ```bash
   pnpm start
   ```
   *Esto sincroniza automáticamente los exámenes de `data/` a `public/data/`, genera el manifiesto e inicia el emulador de Cloudflare en `http://localhost:8788`.*

3. **Generar Manifiesto y Sincronizar**:
   Si agregas o modificas JSONs en la carpeta raíz `data/`, ejecutá:
   ```bash
   pnpm build
   ```

## 📄 Estructura del Proyecto

```text
/
├── data/               # FUENTE DE VERDAD: JSONs de exámenes (editá acá)
├── functions/          # Backend Serverless (API)
│   └── api/            # Endpoints dinámicos de exámenes
├── public/             # Assets estáticos (generados o estáticos)
│   ├── data/           # Copia automática de exámenes y manifest (no editar)
│   ├── vendor/         # Librerías externas servidas localmente
│   ├── app.js          # Lógica de progreso, timer, confeti y modo estudio
│   ├── styles.css      # Estilos orgánicos con optimización móvil extrema
│   └── index.html      # Estructura principal de la SPA
├── package.json        # Scripts de automatización (gen-manifest, dev, deploy)
└── README.md
```

## 📂 Formato de Examen (JSON)

Ubicación: `data/*.json`. El sistema detecta automáticamente cualquier archivo `.json` en esta carpeta y lo incluye en el selector de la aplicación.

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
## 👨‍💻 Autor

Desarrollado con ❤️ por **Diego**.

*Transformando la educación en una experiencia segura, rápida e inmersiva.*
