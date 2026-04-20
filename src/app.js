/**
 * App.js - Lógica principal (Orquestador)
 */
import { initTheme } from './js/theme.js';
import { getExamenes, getExamen } from './js/api.js';
import { state, startTimer, stopTimer } from './js/state.js';
import * as ui from './js/ui.js';

let choicesInstance = null;

/**
 * Carga un examen específico.
 */
async function loadExamen(examId) {
    const statusMsg = document.getElementById('status-message');
    const form = document.getElementById('examen-form');
    const statusBubble = document.getElementById('examen-status');
    const timerContainer = document.getElementById('timer-container');
    const timerDisplay = document.getElementById('timer-display');
    
    stopTimer();
    
    try {
        statusMsg.classList.add('hidden');
        form.classList.remove('hidden');
        form.classList.remove('disabled');
        if (statusBubble) {
            statusBubble.classList.add('hidden');
            statusBubble.innerHTML = '';
            statusBubble.classList.remove('aprobado', 'reprobado');
        }
        
        state.examData = await getExamen(examId);
        ui.renderMetadata(state.examData);
        ui.renderPreguntas(state.examData.preguntas);
        
        if (state.examData.duracion > 0) {
            timerContainer.classList.remove('hidden');
            startTimer(
                state.examData.duracion, 
                (timeStr) => timerDisplay.textContent = timeStr,
                () => terminarExamen()
            );
        } else {
            timerContainer.classList.add('hidden');
        }
        updateProgress();
    } catch (error) {
        console.error('Error al cargar el examen:', error);
        statusMsg.textContent = "Error al cargar el examen seleccionado.";
        statusMsg.classList.remove('hidden');
        statusMsg.classList.add('error');
    }
}

/**
 * Actualiza el contador de progreso en el header.
 */
function updateProgress() {
    if (!state.examData) return;
    const total = state.examData.preguntas.length;
    const contestadas = document.querySelectorAll('#preguntas-container input[type="radio"]:checked').length;
    
    const display = document.getElementById('progress-display');
    if (display) display.textContent = `${contestadas} / ${total}`;

    const btnFinalizar = document.getElementById('btn-finalizar');
    if (btnFinalizar) btnFinalizar.disabled = (contestadas < total);
}

/**
 * Procesa el envío y cálculo de resultados.
 */
function terminarExamen() {
    stopTimer();
    
    const form = document.getElementById('examen-form');
    const btnFinalizar = document.getElementById('btn-finalizar');
    if (btnFinalizar) btnFinalizar.disabled = true;

    const formData = new FormData(form);
    let correctas = 0;

    form.classList.add('disabled');

    state.examData.preguntas.forEach(p => {
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
        } else if (!isNaN(idSeleccionado)) {
            const labelIncorrecta = document.getElementById(`label-${p.id}-${idSeleccionado}`);
            if (labelIncorrecta) labelIncorrecta.classList.add('incorrecta');
        }
    });

    const totales = state.examData.preguntas.length;
    const aprobado = correctas >= state.examData.preguntas_para_aprobar;
    
    ui.renderStatusBubble(correctas, totales - correctas, aprobado);

    if (aprobado) ui.lanzarConfeti();
    else ui.dispararEfectoNegativo();

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Inicializa el selector de exámenes con Choices.js.
 */
async function initExamenSelector() {
    const selector = document.getElementById('examen-select');
    try {
        const examenes = await getExamenes();
        
        selector.innerHTML = '<option value="" disabled>Elegir un examen...</option>';
        examenes.forEach(ex => {
            const option = document.createElement('option');
            option.value = ex.id;
            option.textContent = ex.titulo;
            option.setAttribute('data-materia', ex.materia);
            selector.appendChild(option);
        });

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
        
        selector.addEventListener('change', (e) => loadExamen(e.target.value));

        if (examenes.length > 0) {
            choicesInstance.setChoiceByValue(examenes[0].id);
            loadExamen(examenes[0].id);
        }
    } catch (error) {
        console.error('Error al listar exámenes:', error);
    }
}

// Inicialización
async function init() {
    initTheme();
    await initExamenSelector();

    // 🚀 Registro de Service Worker para capacidades PWA (Mejora 4)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(reg => console.log('✅ Service Worker registrado para Offline-First.'))
                .catch(err => console.warn('❌ Error al registrar Service Worker:', err));
        });
    }
}

// Event Listeners
document.getElementById('examen-form').addEventListener('submit', (e) => {
    e.preventDefault();
    terminarExamen();
});

document.getElementById('examen-form').addEventListener('change', (e) => {
    if (e.target.type === 'radio') {
        updateProgress();

        const checkEstudio = document.getElementById('check-estudio');
        if (checkEstudio && checkEstudio.checked) {
            const radio = e.target;
            const preguntaId = parseInt(radio.name.split('-')[1]);
            const selectedOptId = parseInt(radio.value);
            
            const pregunta = state.examData.preguntas.find(p => p.id === preguntaId);
            if (pregunta) {
                const correctOptId = pregunta.respuesta_correcta;
                const container = radio.closest('.opciones-group');
                
                container.querySelectorAll('.opcion-label').forEach(label => {
                    label.classList.remove('correcta', 'incorrecta', 'esperada');
                });

                const labelCorrecta = document.getElementById(`label-${preguntaId}-${correctOptId}`);
                if (labelCorrecta) labelCorrecta.classList.add('correcta');

                if (selectedOptId !== correctOptId) {
                    radio.parentElement.classList.add('incorrecta');
                }
            }
        }
    }
});

document.getElementById('timer-container').addEventListener('click', () => {
    const currentExamId = document.getElementById('examen-select').value;
    if (currentExamId) loadExamen(currentExamId);
});

document.getElementById('btn-finalizar').addEventListener('click', (e) => {
    e.preventDefault();
    const total = state.examData.preguntas.length;
    const contestadas = document.querySelectorAll('#preguntas-container input[type="radio"]:checked').length;
    
    if (contestadas < total) {
        if (!confirm(`Aún te faltan ${total - contestadas} preguntas. ¿Terminar igual?`)) return;
    }
    terminarExamen();
});

init();
