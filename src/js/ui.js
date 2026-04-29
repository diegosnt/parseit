/**
 * ui.js - Funciones para renderizar la interfaz y feedback visual
 */
import { escapeHTML } from './utils.js';

/**
 * Inyecta los metadatos del examen en el DOM.
 */
export function renderMetadata(data) {
    const metaContainer = document.getElementById('examen-metadatos');
    if (!metaContainer) return;
    
    const items = [
        { label: 'Mínimo', value: data.preguntas_para_aprobar },
        { label: 'Fecha', value: data.fecha },
        { label: 'Versión', value: data.version }
    ];

    metaContainer.innerHTML = items.map(item => `
        <span class="meta-item"><strong>${item.label}:</strong> ${item.value}</span>
    `).join('');
}

/**
 * Genera el HTML para las preguntas y sus opciones.
 */
export function renderPreguntas(preguntas) {
    const container = document.getElementById('preguntas-container');
    if (!container) return;
    
    container.innerHTML = preguntas.map((p, pIdx) => `
        <article class="pregunta-card" data-id="${p.id}" id="card-${p.id}">
            <h3>${pIdx + 1}. ${escapeHTML(p.pregunta)}</h3>
            <div class="opciones-group">
                ${p.opciones.map((opt) => `
                    <label class="opcion-label" id="label-${p.id}-${opt.id}">
                        <input type="radio" name="pregunta-${p.id}" value="${opt.id}" required>
                        <span>${escapeHTML(opt.texto)}</span>
                    </label>
                `).join('')}
            </div>
        </article>
    `).join('');
}

/**
 * Muestra los resultados finales en la burbuja de estado.
 */
export function renderStatusBubble(obtenidas, incorrectas, aprobado) {
    const statusBubble = document.getElementById('examen-status');
    if (!statusBubble) return;

    const thumbUp = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>`;
    const thumbDown = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-2"></path></svg>`;
    
    statusBubble.innerHTML = `
        ${aprobado ? thumbUp : thumbDown}
        <span>${obtenidas} / ${incorrectas}</span>
    `;
    statusBubble.className = `status-bubble ${aprobado ? 'aprobado' : 'reprobado'}`;
    statusBubble.classList.remove('hidden');
}

/**
 * Feedback sensorial (sacudida y viñeta roja) al fallar.
 */
export function dispararEfectoNegativo() {
    const main = document.querySelector('main');
    if (main) {
        main.classList.add('shake-effect');
        setTimeout(() => main.classList.remove('shake-effect'), 1000);
    }

    const vignette = document.createElement('div');
    vignette.className = 'failure-vignette';
    document.body.appendChild(vignette);
    setTimeout(() => vignette.remove(), 2500);
}

/**
 * Lanza confeti dinámico usando canvas-confetti.
 */
export function lanzarConfeti() {
    const confettiFunc = window.confetti || (typeof confetti === 'function' ? confetti : null);
    if (!confettiFunc) return;
    
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);

        const particleCount = 50 * (timeLeft / duration);
        confettiFunc(Object.assign({}, defaults, { 
            particleCount, 
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } 
        }));
        confettiFunc(Object.assign({}, defaults, { 
            particleCount, 
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } 
        }));
    }, 250);
}
