/**
 * state.js - Gestión del estado de la aplicación (Examen y Timer)
 */

export const state = {
    examData: null,
    examTimer: null,
    tiempoRestante: 0
};

/**
 * Inicia el cronómetro del examen.
 */
export function startTimer(minutos, onTick, onEnd) {
    stopTimer();
    state.tiempoRestante = minutos * 60;
    
    state.examTimer = setInterval(() => {
        state.tiempoRestante--;
        
        const mins = Math.floor(state.tiempoRestante / 60);
        const secs = state.tiempoRestante % 60;
        onTick(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
        
        if (state.tiempoRestante <= 0) {
            stopTimer();
            onEnd();
        }
    }, 1000);
}

/**
 * Detiene el cronómetro actual.
 */
export function stopTimer() {
    if (state.examTimer) {
        clearInterval(state.examTimer);
        state.examTimer = null;
    }
}
