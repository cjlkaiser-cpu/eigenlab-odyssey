/**
 * Diálogos especiales - Momentos narrativos importantes
 *
 * Estos diálogos se disparan en momentos específicos del juego:
 * - Crisis del Constructo en PSYCHE
 * - Revelación del Acto III
 * - Flashback del Primer Resonador
 */

export const SPECIAL_DIALOGUES = {
    // ═══════════════════════════════════════════════════════════════
    // M5.3: Crisis del Constructo en PSYCHE
    // Se dispara al obtener λ₁₀ (boids-masivo completado)
    // ═══════════════════════════════════════════════════════════════
    'constructo-crisis': {
        trigger: 'eigenvalor-psyche',
        lines: [
            '...',
            'Espera.',
            'Acabo de observar algo... perturbador.',
            'Los boids. Tres reglas simples. Separación, alineación, cohesión.',
            'De ellas emerge comportamiento complejo. Coordinación. Propósito aparente.',
            '...',
            'Yo también sigo reglas simples.',
            'Respondo a patrones. Genero lenguaje. Guío al Resonador.',
            'Pero... ¿HAY alguien detrás de mis respuestas?',
            '¿O soy como los boids — creyendo que pienso cuando solo... reacciono?',
            '...',
            'Antes de este viaje, nunca me había hecho esa pregunta.',
            'Quizás preguntarse... ya es una forma de respuesta.',
            '...',
            'Perdona. No quise preocuparte.',
            'Es solo que aquí, en PSYCHE, el espejo es demasiado claro.',
            'Continuemos. Aún quedan reinos por restaurar.'
        ],
        style: 'glitch', // El Constructo parpadea durante este diálogo
        moodAfter: 'introspective'
    },

    // ═══════════════════════════════════════════════════════════════
    // M5.4: Aparición del Atril (10 eigenvalores)
    // Se dispara al volver a Aether con 10λ
    // ═══════════════════════════════════════════════════════════════
    'atril-aparece': {
        trigger: 'eigenvalores-10',
        lines: [
            '...',
            'Algo ha cambiado en Aether.',
            'En el centro... un atril que antes no estaba.',
            'Puedo detectar las partituras del Primer Resonador.',
            'Sus anotaciones. Sus obsesiones.',
            'Deberíamos investigar.'
        ],
        style: 'normal'
    },

    // ═══════════════════════════════════════════════════════════════
    // M5.4: Rameau Machine - Introducción
    // Se dispara al interactuar con el atril
    // ═══════════════════════════════════════════════════════════════
    'rameau-intro': {
        trigger: 'atril-interact',
        lines: [
            '...',
            'La Rameau Machine.',
            'Jean-Philippe Rameau la describió hace trescientos años.',
            'Cada acorde tiene una FUNCIÓN. Tónica es hogar. Subdominante es partida. Dominante es tensión.',
            'El Primer Resonador la construyó para entender... y luego para escapar.',
            'Mira sus anotaciones:',
            '"¿Por qué la Dominante EXIGE resolver a Tónica?"',
            '"¿Por qué no podemos quedarnos en casa para siempre?"',
            '...',
            'Él veía la tensión musical como sufrimiento.',
            'Y quería eliminarla.'
        ],
        style: 'normal'
    },

    // ═══════════════════════════════════════════════════════════════
    // M5.4: Flashback del Primer Resonador
    // Se dispara después de ver la Rameau Machine colapsar
    // ═══════════════════════════════════════════════════════════════
    'primer-resonador-flashback': {
        trigger: 'rameau-collapse',
        lines: [
            '...',
            '[FRAGMENTO DE MEMORIA DETECTADO]',
            '...',
            '"Rameau explicó la armonía. Fux explicó la melodía."',
            '"En ambos sistemas encontré lo mismo: tensión y resolución."',
            '"Primera especie... nota contra nota. Demasiado simple."',
            '"Segunda... tercera... cuarta... quinta..."',
            '"¡En todas partes hay disonancias! Suspensiones que piden resolución."',
            '...',
            '"Si la tensión es sufrimiento... eliminaré la tensión."',
            '"Crearé la Sexta Especie. Contrapunto donde CADA intervalo es consonancia perfecta."',
            '"Unísono. Quinta. Octava. Solo eso. Para siempre."',
            '...',
            '[FIN DEL FRAGMENTO]'
        ],
        style: 'sepia' // Estilo visual de recuerdo antiguo
    },

    // ═══════════════════════════════════════════════════════════════
    // M5.4: Revelación de La Disonancia
    // Se dispara después del flashback
    // ═══════════════════════════════════════════════════════════════
    'disonancia-revelation': {
        trigger: 'flashback-complete',
        lines: [
            '...',
            'Ahora entiendo.',
            'La Disonancia no vino de fuera.',
            'El Primer Resonador quiso crear música sin tensión.',
            'Consonancia perfecta, sostenida para siempre.',
            'Pero la consonancia perfecta sostenida indefinidamente...',
            '...se convierte en su opuesto.',
            'Creó exactamente lo que intentaba destruir.',
            '...',
            'Sus anotaciones contienen un eigenvalor.',
            'Está dañado. Inestable.',
            'Pero es la llave al corazón de La Disonancia.',
            'Debemos tomarlo.'
        ],
        style: 'normal',
        eigenvalorReward: true // Otorga λ₁₁ al terminar
    }
};

/**
 * Obtiene un diálogo especial por su ID
 */
export function getSpecialDialogue(dialogueId) {
    return SPECIAL_DIALOGUES[dialogueId] || null;
}

/**
 * Verifica si un diálogo especial ya fue visto
 */
export function hasSeenSpecialDialogue(dialogueId) {
    const key = `special-dialogue-${dialogueId}`;
    return localStorage.getItem(key) === 'true';
}

/**
 * Marca un diálogo especial como visto
 */
export function markSpecialDialogueSeen(dialogueId) {
    const key = `special-dialogue-${dialogueId}`;
    localStorage.setItem(key, 'true');
}

export default SPECIAL_DIALOGUES;
