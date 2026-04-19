/**
 * App.js - Lógica principal del Examen Dinámico e Interactivo
 */

let examData = null;
let examTimer = null;
let tiempoRestante = 0;

/**
 * Realiza una petición fetch con lógica de reintentos.
 */
async function fetchWithRetry(url, options = {}, retries = 3, backoff = 500) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        return await response.json();
    } catch (error) {
        if (retries > 0) {
            console.warn(`Fallo en la conexión. Reintentando en ${backoff}ms... (${retries} intentos restantes)`);
            await new Promise(resolve => setTimeout(resolve, backoff));
            return fetchWithRetry(url, options, retries - 1, backoff * 2);
        }
        throw error;
    }
}

/**
 * Gestión del Modo Oscuro
 */
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    themeToggle.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

/**
 * Inyecta los metadatos del examen en el DOM.
 */
function renderMetadata(data) {
    const metaContainer = document.getElementById('examen-metadatos');
    const items = [
         { label: 'Mínimo para aprobar', value: data.preguntas_para_aprobar },
        { label: 'Fecha', value: data.fecha },
        { label: 'Versión', value: data.version }
    ];

    metaContainer.innerHTML = items.map(item => `
        <span class="meta-item"><strong>${item.label}:</strong> ${item.value}</span>
    `).join('');
}

/**
 * Escapa caracteres especiales de HTML para prevenir XSS.
 */
function escapeHTML(str) {
    if (!str) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return str.toString().replace(/[&<>"']/g, function(m) { return map[m]; });
}

/**
 * Genera el HTML para cada pregunta y sus opciones mezcladas.
 */
function renderPreguntas(preguntas) {
    const container = document.getElementById('preguntas-container');
    
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
    
    // El progreso se actualiza mediante delegación de eventos en el formulario
    updateProgress();
}

function updateProgress() {
    if (!examData || !examData.preguntas) return;
    const total = examData.preguntas.length;
    const contestadas = document.querySelectorAll('#preguntas-container input[type="radio"]:checked').length;
    
    const display = document.getElementById('progress-display');
    if (display) {
        display.textContent = `${contestadas} / ${total}`;
    }

    const btnFinalizar = document.getElementById('btn-finalizar');
    if (btnFinalizar) {
        btnFinalizar.disabled = (contestadas < total);
    }
}

/**
 * Carga un examen específico.
 */
async function loadExamen(examId) {
    const statusMsg = document.getElementById('status-message');
    const form = document.getElementById('examen-form');
    const statusBubble = document.getElementById('examen-status');
    
    if (examTimer) {
        clearInterval(examTimer);
        examTimer = null;
    }
    
    try {
        statusMsg.classList.add('hidden');
        form.classList.remove('hidden');
        form.classList.remove('disabled');
        if (statusBubble) {
            statusBubble.classList.add('hidden');
            statusBubble.innerHTML = '';
            statusBubble.classList.remove('aprobado', 'reprobado');
        }
        
        examData = await fetchWithRetry(`/api/examen/${examId}`);
        renderMetadata(examData);
        renderPreguntas(examData.preguntas);
        
        if (examData.duracion > 0) {
            iniciarTimer(examData.duracion);
        } else {
            document.getElementById('timer-container').classList.add('hidden');
        }
    } catch (error) {
        console.error('Error al cargar el examen:', error);
        statusMsg.textContent = "Error al cargar el examen seleccionado.";
        statusMsg.classList.remove('hidden');
        statusMsg.classList.add('error');
    }
}

/**
 * Inicia el temporizador del examen.
 */
function iniciarTimer(minutos) {
    const timerContainer = document.getElementById('timer-container');
    const timerDisplay = document.getElementById('timer-display');
    
    tiempoRestante = minutos * 60;
    timerContainer.classList.remove('hidden');
    actualizarTimerDisplay();
    
    examTimer = setInterval(() => {
        tiempoRestante--;
        actualizarTimerDisplay();
        
        if (tiempoRestante <= 0) {
            clearInterval(examTimer);
            examTimer = null;
            terminarPorTiempo();
        }
    }, 1000);
}

function actualizarTimerDisplay() {
    const timerDisplay = document.getElementById('timer-display');
    const minutos = Math.floor(tiempoRestante / 60);
    const segundos = tiempoRestante % 60;
    timerDisplay.textContent = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
}

function terminarPorTiempo() {
    const form = document.getElementById('examen-form');
    form.classList.add('disabled');
    
    const btnFinalizar = document.getElementById('btn-finalizar');
    if (btnFinalizar) btnFinalizar.disabled = true;
    
    let correctas = 0;
    
    examData.preguntas.forEach(p => {
        const respuestaSeleccionada = document.querySelector(`input[name="pregunta-${p.id}"]:checked`);
        
        const labelCorrecta = document.getElementById(`label-${p.id}-${p.respuesta_correcta}`);
        if (labelCorrecta) labelCorrecta.classList.add('esperada');
        
        if (respuestaSeleccionada) {
            const idSeleccionado = parseInt(respuestaSeleccionada.value);
            if (idSeleccionado === p.respuesta_correcta) {
                correctas++;
                if (labelCorrecta) {
                    labelCorrecta.classList.remove('esperada');
                    labelCorrecta.classList.add('correcta');
                }
            } else {
                respuestaSeleccionada.parentElement.classList.add('incorrecta');
            }
        }
    });
    
    showResultados(correctas, examData.preguntas.length, examData.preguntas_para_aprobar);
}

/**
 * Inicializa el selector de exámenes.
 */
let choicesInstance = null;

async function initExamenSelector() {
    const selector = document.getElementById('examen-select');
    try {
        const examenes = await fetchWithRetry('/api/examenes');
        
        selector.innerHTML = '<option value="" disabled>Elegir un examen...</option>';
        
        examenes.forEach(ex => {
            const option = document.createElement('option');
            option.value = ex.id;
            option.textContent = ex.titulo;
            option.setAttribute('data-materia', ex.materia);
            selector.appendChild(option);
        });

        // Inicializar Choices.js
        choicesInstance = new Choices(selector, {
            searchEnabled: false,
            itemSelectText: '',
            shouldSort: false,
            callbackOnCreateTemplates: function(template) {
                return {
                    choice: (classNames, data) => {
                        const materia = data.element ? data.element.getAttribute('data-materia') : null;
                        const materiaHtml = materia ? `<span class="choice-materia">${materia}</span>` : '';
                        return template(`
                            <div class="${classNames.item} ${classNames.itemChoice} ${classNames.itemSelectable}" data-select-text="${this.config.itemSelectText}" data-choice data-id="${data.id}" data-value="${data.value}" data-choice-selectable>
                                <div class="choice-content">
                                    ${materiaHtml}
                                    <span class="choice-titulo">${data.label}</span>
                                </div>
                            </div>
                        `);
                    },
                    item: (classNames, data) => {
                        const materia = data.element ? data.element.getAttribute('data-materia') : null;
                        const materiaHtml = materia ? `<span class="choice-materia">${materia}</span>` : '';
                        return template(`
                            <div class="${classNames.item} ${data.highlighted ? classNames.highlightedState : classNames.itemSelectable}" data-item data-id="${data.id}" data-value="${data.value}" ${data.active ? 'aria-selected="true"' : ''} ${data.disabled ? 'aria-disabled="true"' : ''}>
                                <div class="choice-content">
                                    ${materiaHtml}
                                    <span class="choice-titulo">${data.label}</span>
                                </div>
                            </div>
                        `);
                    },
                };
            },
        });
        
        selector.addEventListener('change', (e) => {
            loadExamen(e.target.value);
        });

        // Cargar el primero por defecto
        if (examenes.length > 0) {
            choicesInstance.setChoiceByValue(examenes[0].id);
            loadExamen(examenes[0].id);
        }
    } catch (error) {
        console.error('Error al listar exámenes:', error);
    }
}

/**
 * Procesa el envío del formulario y calcula el resultado.
 */
function handleExamenSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    
    // Detener el timer si está corriendo
    if (examTimer) {
        clearInterval(examTimer);
        examTimer = null;
    }
    
    const form = document.getElementById('examen-form');
    const btnFinalizar = document.getElementById('btn-finalizar');
    if (btnFinalizar) btnFinalizar.disabled = true;

    const formData = new FormData(form);
    let correctas = 0;

    form.classList.add('disabled');

    examData.preguntas.forEach(p => {
        const respuestaSeleccionada = formData.get(`pregunta-${p.id}`);
        const idSeleccionado = parseInt(respuestaSeleccionada);
        const idCorrecto = p.respuesta_correcta;

        const labelCorrecta = document.getElementById(`label-${p.id}-${idCorrecto}`);
        if (labelCorrecta) labelCorrecta.classList.add('esperada');

        if (idSeleccionado === idCorrecto) {
            correctas++;
            if (labelCorrecta) {
                labelCorrecta.classList.remove('esperada');
                labelCorrecta.classList.add('correcta');
            }
        } else {
            const labelIncorrecta = document.getElementById(`label-${p.id}-${idSeleccionado}`);
            if (labelIncorrecta) labelIncorrecta.classList.add('incorrecta');
        }
    });

    showResultados(correctas, examData.preguntas.length, examData.preguntas_para_aprobar);
}

/**
 * Muestra la pantalla de resultados finales.
 */
function showResultados(obtenidas, totales, paraAprobar) {
    const statusBubble = document.getElementById('examen-status');
    const aprobado = obtenidas >= paraAprobar;
    const incorrectas = totales - obtenidas;

    if (statusBubble) {
        const thumbUp = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>`;
        const thumbDown = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-2"></path></svg>`;
        
        statusBubble.innerHTML = `
            ${aprobado ? thumbUp : thumbDown}
            <span>${obtenidas} / ${incorrectas}</span>
        `;
        statusBubble.className = `status-bubble ${aprobado ? 'aprobado' : 'reprobado'}`;
        statusBubble.classList.remove('hidden');
    }

    if (aprobado && typeof confetti === 'function') {
        lanzarConfeti();
    } else if (!aprobado) {
        dispararEfectoNegativo();
    }

    // Scroll al principio para ver el resultado en el header al terminar
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Dispara un efecto visual de error (sacudida y viñeta roja).
 */
function dispararEfectoNegativo() {
    const main = document.querySelector('main');
    if (main) {
        main.classList.add('shake-effect');
        // Quitar la clase después de la animación para permitir re-disparo
        setTimeout(() => main.classList.remove('shake-effect'), 1000);
    }

    // Crear la viñeta de forma dinámica
    const vignette = document.createElement('div');
    vignette.className = 'failure-vignette';
    document.body.appendChild(vignette);
    
    // Eliminar el elemento del DOM al terminar el efecto visual
    setTimeout(() => vignette.remove(), 2500);
}

/**
 * Lanza un efecto de confeti épico.
 */
function lanzarConfeti() {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { 
            particleCount, 
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } 
        }));
        confetti(Object.assign({}, defaults, { 
            particleCount, 
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } 
        }));
    }, 250);
}

/**
 * Función de inicio de la aplicación.
 */
async function init() {
    initTheme();
    await initExamenSelector();
}

// Listeners
document.getElementById('examen-form').addEventListener('submit', handleExamenSubmit);
document.getElementById('examen-form').addEventListener('change', (e) => {
    if (e.target.type === 'radio') {
        updateProgress();

        // Lógica de corrección inmediata (Modo Estudio)
        const checkEstudio = document.getElementById('check-estudio');
        if (checkEstudio && checkEstudio.checked) {
            const radio = e.target;
            const nameParts = radio.name.split('-');
            const preguntaId = parseInt(nameParts[1]);
            const selectedOptId = parseInt(radio.value);
            
            // Encontrar la pregunta en los datos
            const pregunta = examData.preguntas.find(p => p.id === preguntaId);
            if (pregunta) {
                const correctOptId = pregunta.respuesta_correcta;
                const container = radio.closest('.opciones-group');
                
                // Limpiar clases previas de esta pregunta
                container.querySelectorAll('.opcion-label').forEach(label => {
                    label.classList.remove('correcta', 'incorrecta', 'esperada');
                });

                // Marcar la correcta (esperada)
                const labelCorrecta = document.getElementById(`label-${preguntaId}-${correctOptId}`);
                if (labelCorrecta) labelCorrecta.classList.add('correcta');

                // Si se equivocó, marcar la incorrecta
                if (selectedOptId !== correctOptId) {
                    radio.parentElement.classList.add('incorrecta');
                }
            }
        }
    }
});

// El temporizador completo actúa como botón de reinicio
document.getElementById('timer-container').addEventListener('click', () => {
    const currentExamId = document.getElementById('examen-select').value;
    if (currentExamId) {
        loadExamen(currentExamId);
    }
});

// Finalizar examen desde el contador de progreso
document.getElementById('btn-finalizar').addEventListener('click', (e) => {
    e.preventDefault();
    
    const total = examData.preguntas.length;
    const contestadas = document.querySelectorAll('#preguntas-container input[type="radio"]:checked').length;
    
    if (contestadas < total) {
        if (!confirm(`Aún te faltan ${total - contestadas} preguntas por responder. ¿Estás seguro de que quieres finalizar el examen?`)) {
            return;
        }
    }
    
    handleExamenSubmit(new Event('submit'));
});

init();
