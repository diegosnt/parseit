# 📝 ParseIt - Sistema de Exámenes Interactivos Dinámicos

**ParseIt** es una aplicación web moderna, robusta y pulida diseñada para evaluaciones de opción múltiple. El sistema destaca por su enfoque en la experiencia de usuario (UX) inmersiva y su arquitectura centrada en la seguridad y el rendimiento.

## 🚀 Características Destacadas

- **Header Inteligente**: Un centro de control compacto que muestra metadatos, progreso en tiempo real (`15 / 20`) y un temporizador dinámico.
- **Feedback Visual Inmediato**: Al finalizar, el sistema muestra una burbuja de estado con iconos de pulgar (👍/👎) y el contador final de aciertos vs. errores directamente en la parte superior.
- **Experiencia Inmersiva (Dual Feedback)**:
  - **Celebración**: Ráfagas de confeti dinámicas (`canvas-confetti`) al aprobar.
  - **Impacto Negativo**: Efecto de sacudida de pantalla (*Screen Shake*) y viñeta roja periférica al reprobar, proporcionando un feedback sensorial claro y directo.
- **Validación Estricta**: El botón de finalizar se bloquea visual y funcionalmente hasta que se responden todas las preguntas, evitando entregas incompletas.
- **Modo Oscuro Orgánico**: Paleta de colores basada en tonos crema y marrones profundos, con un toggle de tema que permite ver el sol y la luna simultáneamente en un diseño elíptico.
- **Dinamismo Total**: Algoritmo de barajado (Fisher-Yates) en el backend para preguntas y opciones, asegurando que cada intento sea único.
- **Carga Automática**: Detecta y carga archivos `.json` de la carpeta `data/` al vuelo, sin necesidad de configuraciones manuales.

## 🛡️ Seguridad y Robustez

- **Protección contra Path Traversal**: El servidor sanitiza rigurosamente los parámetros de entrada, evitando que se puedan leer archivos fuera de la carpeta de datos permitida.
- **Prevención de XSS**: Implementación de funciones de escape de HTML en el frontend para asegurar que el contenido de los exámenes se renderice de forma segura.
- **Headers de Seguridad**: Integración con `Helmet` para inyectar cabeceras HTTP que protegen contra ataques comunes (Clickjacking, MIME Sniffing, etc.).
- **Autonomía Total (No CDNs)**: Todas las librerías externas se sirven de forma local desde la carpeta `vendor/`, garantizando que la aplicación funcione sin depender de conexiones externas y mejorando la privacidad.

## 🛠️ Stack Tecnológico

- **Frontend**: HTML5, CSS3 (Variables, Animaciones, Flexbox), Vanilla JavaScript (ES6+).
- **Backend**: Node.js, Express.js.
- **Librerías Locales**: 
  - [Choices.js](https://choices-js.github.io/Choices/) para selectores elegantes.
  - [Canvas-Confetti](https://www.npmjs.com/package/canvas-confetti) para efectos visuales.
- **Seguridad**: Helmet.js.

## 📋 Requisitos Previos

- [Node.js](https://nodejs.org/) (v16+)
- [pnpm](https://pnpm.io/) (recomendado) o npm.

## 🔧 Instalación y Ejecución

1. **Instalar dependencias**:
   ```bash
   pnpm install
   ```

2. **Ejecutar**:
   ```bash
   pnpm start
   ```

Abre [http://localhost:3000](http://localhost:3000) y ¡listo!

## 📂 Estructura del Proyecto

```text
/
├── data/               # Carpeta con exámenes en formato JSON
├── public/             
│   ├── vendor/         # Librerías externas servidas localmente
│   ├── index.html      # Estructura con header reactivo
│   ├── styles.css      # Paleta orgánica, animaciones y efectos sensoriales
│   └── app.js          # Lógica de progreso, timer, confeti y sanitización
├── server.js           # API REST con lógica de shuffle y seguridad
└── package.json        # Scripts y dependencias
```

## 📄 Estructura del Archivo JSON (Exámenes)

Los archivos deben guardarse en la carpeta `data/` con extensión `.json`. El sistema soporta dos formatos:

### 1. Formato Completo (Recomendado)
Permite definir metadatos específicos del examen.

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

### 2. Formato Simple (Array)
Si solo se proporciona un array de preguntas, el sistema asignará metadatos genéricos automáticamente.

```json
[
  {
    "id": 1,
    "pregunta": "¿Capital de Francia?",
    "opciones": ["Londres", "París", "Madrid", "Roma"],
    "respuesta_correcta": 1
  }
]
```

### 💡 Notas sobre el formato:
- **`duracion`**: Tiempo en minutos (0 para sin tiempo).
- **`respuesta_correcta`**: Es el **índice** (empezando en 0) del array de `opciones` que contiene la respuesta válida. El sistema se encarga de barajar las opciones manteniendo la integridad de este índice.

---
Desarrollado con ❤️ para transformar la forma en que evaluamos y aprendemos de manera segura, eficiente e inmersiva.
