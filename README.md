# 📝 ParseIt - Sistema de Exámenes Interactivos Dinámicos

**ParseIt** es una aplicación web moderna, robusta y optimizada para Cloudflare Pages, diseñada para ofrecer una experiencia de evaluación y estudio inigualable. El sistema destaca por su enfoque en la UX inmersiva, feedback sensorial y herramientas de aprendizaje en tiempo real.

## 🚀 Características Destacadas

- **Optimizado para Cloudflare Pages**: Arquitectura basada en **Cloudflare Functions**, lista para escalar globalmente en el edge.
- **Modo Estudio (Corrección Inmediata)**: Un switch dinámico en el header que, al activarse, revela la respuesta correcta e incorrecta al instante después de cada selección.
- **Header Inteligente y Responsivo**: Un centro de control ultra-compacto en móviles que agrupa metadatos, progreso en tiempo real (`15 / 20`) y temporizador dinámico.
- **Experiencia Inmersiva (Dual Feedback)**:
  - **Celebración**: Ráfagas de confeti dinámicas (`canvas-confetti`) al aprobar.
  - **Impacto Negativo**: Efecto de sacudida de pantalla (*Screen Shake*) y viñeta roja periférica al reprobar.
- **Validación Estricta**: El botón de finalizar se bloquea visual y funcionalmente hasta que se responden todas las preguntas.
- **Modo Oscuro Orgánico**: Paleta de colores basada en tonos crema y marrones profundos, con un toggle de tema elíptico.
- **Seguridad Blindada**: Protección nativa contra Path Traversal (sanitización de IDs), prevención de XSS y headers de seguridad vía `Helmet` (emulado en Functions).

## 🛡️ Infraestructura y Seguridad

- **Autonomía Total**: Todas las librerías externas (`Choices.js`, `Confetti`) se sirven localmente desde `public/vendor/`, eliminando la dependencia de CDNs externos.
- **Edge Computing**: Lógica de barajado (Fisher-Yates) ejecutada en Cloudflare Workers para garantizar aleatoriedad segura en cada carga.
- **Sanitización de Datos**: Limpieza rigurosa de parámetros y escape de HTML en el renderizado de preguntas.

## 🛠️ Stack Tecnológico

- **Frontend**: HTML5, CSS3 (Variables, Media Queries Avanzadas), Vanilla JS (ES6+).
- **Backend**: Cloudflare Pages Functions (Serverless).
- **Herramientas**: `pnpm`, `wrangler` (Cloudflare CLI).
- **Librerías**: Choices.js, Canvas-Confetti.

## 📋 Requisitos Previos

- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/)
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/) (instalado automáticamente vía dependencias).

## 🔧 Instalación y Desarrollo Local

1. **Instalar dependencias**:
   ```bash
   pnpm install
   ```

2. **Ejecutar localmente**:
   ```bash
   pnpm start
   ```
   *Esto iniciará el emulador de Cloudflare Pages en `http://localhost:8788`.*

3. **Generar Manifiesto**:
   Si agregas nuevos JSONs en `public/data/`, ejecutá:
   ```bash
   pnpm build
   ```

## 📄 Estructura del Proyecto

```text
/
├── functions/          # Backend Serverless (API)
│   └── api/            # Endpoints de exámenes y listado
├── public/             # Assets estáticos y datos
│   ├── data/           # JSONs de exámenes y manifest.json
│   ├── vendor/         # Librerías externas locales
│   ├── app.js          # Lógica de progreso, timer y modo estudio
│   └── styles.css      # Estilos orgánicos y responsivos
├── package.json        # Scripts de Cloudflare y dependencias
└── README.md
```

## 📂 Formato de Examen (JSON)

Los exámenes deben residir en `public/data/`. Ejemplo de formato recomendado:

```json
{
  "materia": "CIENCIAS",
  "titulo": "El Sistema Solar",
  "duracion": 10,
  "preguntas_para_aprobar": 4,
  "preguntas": [
    {
      "id": 1,
      "pregunta": "¿Cuál es el planeta más grande?",
      "opciones": ["Marte", "Júpiter", "Tierra", "Saturno"],
      "respuesta_correcta": 1
    }
  ]
}
```

---
Desarrollado con ❤️ para transformar la educación en una experiencia segura, rápida y divertida.
