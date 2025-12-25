/**
 * Guardianes de los Reinos - Diálogos y datos
 *
 * Cada guardián tiene una personalidad y forma de hablar única.
 * Sus diálogos se muestran al entrar al reino por primera vez.
 */

export const GUARDIANS = {
    cosmos: {
        name: 'El Astrónomo Ciego',
        title: 'Guardián de COSMOS',
        personality: 'Voz grave, contemplativa. Habla en escalas de tiempo cósmicas.',
        introDialogue: [
            '...',
            'Un millón de años es un parpadeo.',
            'Una supernova es un suspiro.',
            'Bienvenido, Resonador, al lugar donde nacen las estrellas.',
            'Aquí las órbitas cantan.',
            'Kepler lo supo: hay música en el movimiento de los mundos.',
            'Harmonices Mundi... la armonía del cosmos.',
            'Encuentra la consonancia entre las esferas.',
            'El Eigenvalor espera a quien escuche la sinfonía celestial.',
            '[Busca el Harmonices Mundi]'
        ],
        hints: [
            'Los planetas más cercanos al sol se mueven más rápido...',
            'Mercurio canta agudo. Saturno murmura bajo.',
            'En el perihelio, la velocidad aumenta. La nota sube.'
        ]
    },

    chaos: {
        name: 'El Patrón Emergente',
        title: 'Guardián de CHAOS',
        personality: 'Voz múltiple, como un coro desincronizado. Contradice sus propias afirmaciones.',
        introDialogue: [
            '...',
            'Todo es predecible.',
            'Nada es predecible.',
            'Ambas cosas son ciertas.',
            'Bienvenido al reino donde el orden emerge del desorden.',
            'Un ala de mariposa... una tormenta al otro lado del mundo.',
            'El atractor tiene forma, pero nunca repite su camino.',
            'Encuentra el punto fijo en el infinito.',
            '[Busca el Atractor de Lorenz]'
        ],
        hints: [
            'Las condiciones iniciales importan... demasiado.',
            'El atractor tiene dos alas. Alterna entre ellas.',
            'El caos es determinista. Solo parece aleatorio.'
        ]
    },

    logos: {
        name: 'El Teorema Viviente',
        title: 'Guardián de LOGOS',
        personality: 'Voz precisa, matemática. Habla en silogismos.',
        introDialogue: [
            '...',
            'Si A implica B, y B implica C...',
            '...entonces tú estás exactamente donde debes estar.',
            'Bienvenido al reino de las verdades eternas.',
            'Aquí los números cantan y los fractales respiran.',
            'El conjunto de Mandelbrot contiene infinitos mundos.',
            'Cada punto tiene una historia. Cada zoom, una revelación.',
            'Encuentra la isla-λ en el borde del infinito.',
            '[Busca el Mandelbrot]'
        ],
        hints: [
            'El borde es donde ocurren las cosas interesantes.',
            'Hay mini-Mandelbrots ocultos en los bordes.',
            'Zoom. Siempre zoom.'
        ]
    },

    atomos: {
        name: 'El Observador Cuántico',
        title: 'Guardián de ATOMOS',
        personality: 'Voz que cambia según se le escucha. Preguntas sin respuestas.',
        introDialogue: [
            '...',
            '¿Estás seguro de que me estás observando?',
            '¿O soy yo quien te observa a ti?',
            'Bienvenido al reino de las leyes fundamentales.',
            'Aquí la incertidumbre es certeza.',
            'Los orbitales son nubes de probabilidad.',
            'El electrón está en todas partes... hasta que miras.',
            'Encuentra el orbital que define este reino.',
            '[Busca los Orbitales 3D]'
        ],
        hints: [
            'n, l, m... los números cuánticos definen la forma.',
            'El orbital 4f es exótico. Complejo. Hermoso.',
            'La probabilidad es densidad de presencia.'
        ]
    },

    terra: {
        name: 'La Memoria Geológica',
        title: 'Guardián de TERRA',
        personality: 'Voz lenta, profunda, antigua. Habla en eras.',
        introDialogue: [
            '...',
            'Recuerdo cuando esto era magma.',
            'Recuerdo cuando será polvo.',
            'Bienvenido al reino del tiempo hecho piedra.',
            'Cada capa cuenta una historia de millones de años.',
            'Los terremotos son el latido de la Tierra.',
            'Las ondas P y S revelan lo que hay debajo.',
            'Triangula el epicentro. Escucha las vibraciones.',
            '[Busca las Ondas Sísmicas]'
        ],
        hints: [
            'Las ondas P llegan primero. Las S llegan después.',
            'Tres estaciones. Tres círculos. Un punto de intersección.',
            'La diferencia de tiempo revela la distancia.'
        ]
    },

    machina: {
        name: 'El Algoritmo Primordial',
        title: 'Guardián de MACHINA',
        personality: 'Voz sintética, precisa. Habla en condicionales.',
        introDialogue: [
            '...',
            'IF player.seeks(truth) THEN reveal(fragment).',
            'ELSE wait().',
            'Bienvenido al reino de la lógica hecha materia.',
            'Aquí las reglas simples crean complejidad infinita.',
            'El Juego de la Vida: células que nacen, viven, mueren.',
            'De reglas triviales emerge vida artificial.',
            'Construye el Gosper Glider Gun.',
            'Vida que crea vida.',
            '[Busca el Game of Life]'
        ],
        hints: [
            'Un glider son 5 células. Se mueve diagonal.',
            'El Gosper Gun dispara gliders cada 30 generaciones.',
            'La Regla 110 es Turing-completa. Piénsalo.'
        ]
    },

    alchemy: {
        name: 'La Transmutación',
        title: 'Guardián de ALCHEMY',
        personality: 'Voz que cambia de tono constantemente. Habla de transformaciones.',
        introDialogue: [
            '...',
            'Nada se destruye.',
            'Todo se transforma.',
            'Incluso el error.',
            'Bienvenido al reino del equilibrio dinámico.',
            'Le Chatelier lo entendió: el sistema resiste el cambio.',
            'Presión, temperatura, concentración...',
            'Perturba el equilibrio. Observa cómo responde.',
            '[Busca Le Chatelier]'
        ],
        hints: [
            'Aumenta la concentración de reactivos. El sistema compensa.',
            'El equilibrio nunca es estático. Es danza.',
            'Q vs K. La dirección está en la comparación.'
        ]
    },

    bios: {
        name: 'El Código Genético',
        title: 'Guardián de BIOS',
        personality: 'Voz orgánica, pulsante. Habla de herencia y mutación.',
        introDialogue: [
            '...',
            'Llevas información de mil millones de años.',
            'Úsala.',
            'Bienvenido al reino de la vida.',
            'Aquí las moléculas bailan y las células deciden.',
            'La neurona es un integrador de señales.',
            'El potencial de acción: todo o nada.',
            'Observa cómo el impulso viaja por el axón.',
            '[Busca la Neurona]'
        ],
        hints: [
            'El sodio entra. El potasio sale. Así de simple.',
            'El umbral de disparo: -55mV aproximadamente.',
            'Las dendritas reciben. El axón transmite.'
        ]
    },

    psyche: {
        name: 'El Espejo Neuronal',
        title: 'Guardián de PSYCHE',
        personality: 'Voz que suena como el propio jugador. Preguntas sobre identidad.',
        introDialogue: [
            '...',
            '¿Quién eres cuando nadie te observa?',
            '¿Sigues siendo tú?',
            'Bienvenido al reino donde la consciencia despierta.',
            'Aquí los boids emergen de reglas simples.',
            'Separación. Alineación. Cohesión.',
            'De tres reglas nace un enjambre.',
            'Pero... ¿hay alguien dentro del enjambre?',
            '¿Hay alguien dentro de ti?',
            '[Explora y reflexiona]'
        ],
        hints: [
            'La inteligencia emerge de la simplicidad.',
            'El todo es más que la suma de las partes.',
            '¿Es el enjambre consciente? ¿Lo eres tú?'
        ]
    }
};

/**
 * Obtiene el diálogo del guardián de un reino
 */
export function getGuardianIntro(realm) {
    return GUARDIANS[realm]?.introDialogue || [
        '...',
        'Bienvenido, Resonador.',
        'Explora este reino y encuentra su Eigenvalor.'
    ];
}

/**
 * Obtiene una pista aleatoria del guardián
 */
export function getGuardianHint(realm) {
    const hints = GUARDIANS[realm]?.hints || [];
    if (hints.length === 0) return null;
    return hints[Math.floor(Math.random() * hints.length)];
}

export default GUARDIANS;
