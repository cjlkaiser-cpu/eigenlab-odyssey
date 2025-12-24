/**
 * Grafo de Conocimiento - El corazón de EigenLab Odyssey
 *
 * Cada simulación es un nodo. Las conexiones representan
 * relaciones conceptuales entre fenómenos científicos.
 *
 * El jugador "descubre" conexiones al completar simulaciones
 * conectadas, desbloqueando insights y caminos de aprendizaje.
 */

// ═══════════════════════════════════════════════════════════════
// CONCEPTOS FUNDAMENTALES (tags que conectan simulaciones)
// ═══════════════════════════════════════════════════════════════

export const CONCEPTS = {
    gravity: { name: 'Gravedad', icon: '🌍', color: 0x3b82f6 },
    waves: { name: 'Ondas', icon: '🌊', color: 0x06b6d4 },
    chaos: { name: 'Caos', icon: '🦋', color: 0xf59e0b },
    emergence: { name: 'Emergencia', icon: '🐦', color: 0x22c55e },
    fractals: { name: 'Fractales', icon: '🌀', color: 0xa855f7 },
    thermodynamics: { name: 'Termodinámica', icon: '🔥', color: 0xef4444 },
    information: { name: 'Información', icon: '💾', color: 0x64748b },
    oscillation: { name: 'Oscilación', icon: '〰️', color: 0xeab308 },
    symmetry: { name: 'Simetría', icon: '✧', color: 0xec4899 },
    evolution: { name: 'Evolución', icon: '🧬', color: 0x10b981 },
    resonance: { name: 'Resonancia', icon: '🎵', color: 0x8b5cf6 },
    fields: { name: 'Campos', icon: '⚡', color: 0xfbbf24 },
    probability: { name: 'Probabilidad', icon: '🎲', color: 0x6366f1 },
    optimization: { name: 'Optimización', icon: '📈', color: 0x14b8a6 },
    computation: { name: 'Computación', icon: '🖥️', color: 0x71717a },
    geometry: { name: 'Geometría', icon: '📐', color: 0xf472b6 },
    harmony: { name: 'Armonía', icon: '🎼', color: 0xc084fc }
};

// ═══════════════════════════════════════════════════════════════
// NODOS DEL GRAFO (cada simulación con sus conceptos)
// ═══════════════════════════════════════════════════════════════

export const NODES = {
    // ─────────────────────────────────────────────────────────
    // COSMOS
    // ─────────────────────────────────────────────────────────
    'formacion-galaxias': {
        realm: 'cosmos',
        name: 'Formación de Galaxias',
        concepts: ['gravity', 'emergence', 'chaos'],
        position: { x: 150, y: 120 }
    },
    'sistema-solar': {
        realm: 'cosmos',
        name: 'Sistema Solar',
        concepts: ['gravity', 'oscillation', 'harmony'],
        position: { x: 220, y: 180 }
    },
    'orbitas-kepler': {
        realm: 'cosmos',
        name: 'Órbitas de Kepler',
        concepts: ['gravity', 'geometry', 'harmony'],
        position: { x: 280, y: 140 }
    },
    'three-body': {
        realm: 'cosmos',
        name: 'Problema de 3 Cuerpos',
        concepts: ['gravity', 'chaos', 'computation'],
        position: { x: 350, y: 180 }
    },
    'agujero-negro': {
        realm: 'cosmos',
        name: 'Agujero Negro',
        concepts: ['gravity', 'geometry', 'fields'],
        position: { x: 200, y: 60 }
    },
    'expansion-universo': {
        realm: 'cosmos',
        name: 'Expansión del Universo',
        concepts: ['gravity', 'geometry', 'probability'],
        position: { x: 120, y: 200 }
    },
    'ondas-gravitacionales': {
        realm: 'cosmos',
        name: 'Ondas Gravitacionales',
        concepts: ['gravity', 'waves', 'resonance'],
        position: { x: 280, y: 80 }
    },

    // ─────────────────────────────────────────────────────────
    // CHAOS
    // ─────────────────────────────────────────────────────────
    'lorenz-attractor': {
        realm: 'chaos',
        name: 'Atractor de Lorenz',
        concepts: ['chaos', 'geometry', 'fractals'],
        position: { x: 450, y: 150 }
    },
    'double-pendulum': {
        realm: 'chaos',
        name: 'Péndulo Doble',
        concepts: ['chaos', 'oscillation', 'gravity'],
        position: { x: 520, y: 200 }
    },
    'strange-attractors': {
        realm: 'chaos',
        name: 'Atractores Extraños',
        concepts: ['chaos', 'fractals', 'geometry'],
        position: { x: 480, y: 100 }
    },
    'game-of-life': {
        realm: 'chaos',
        name: 'Juego de la Vida',
        concepts: ['emergence', 'computation', 'information'],
        position: { x: 550, y: 140 }
    },
    'boids-masivo': {
        realm: 'chaos',
        name: 'Boids (Bandadas)',
        concepts: ['emergence', 'optimization', 'chaos'],
        position: { x: 600, y: 180 }
    },
    'reaccion-difusion': {
        realm: 'chaos',
        name: 'Reacción-Difusión',
        concepts: ['emergence', 'fractals', 'evolution'],
        position: { x: 650, y: 120 }
    },

    // ─────────────────────────────────────────────────────────
    // LOGOS
    // ─────────────────────────────────────────────────────────
    'mandelbrot': {
        realm: 'logos',
        name: 'Conjunto de Mandelbrot',
        concepts: ['fractals', 'computation', 'geometry'],
        position: { x: 750, y: 150 }
    },
    'fractales-ifs': {
        realm: 'logos',
        name: 'Fractales IFS',
        concepts: ['fractals', 'geometry', 'symmetry'],
        position: { x: 800, y: 100 }
    },
    'fourier-epicycles': {
        realm: 'logos',
        name: 'Epiciclos de Fourier',
        concepts: ['waves', 'harmony', 'geometry'],
        position: { x: 720, y: 200 }
    },
    'l-systems': {
        realm: 'logos',
        name: 'L-Systems',
        concepts: ['fractals', 'evolution', 'computation'],
        position: { x: 850, y: 160 }
    },
    'voronoi': {
        realm: 'logos',
        name: 'Diagramas de Voronoi',
        concepts: ['geometry', 'optimization', 'emergence'],
        position: { x: 780, y: 220 }
    },
    'phyllotaxis': {
        realm: 'logos',
        name: 'Filotaxis',
        concepts: ['fractals', 'harmony', 'optimization'],
        position: { x: 900, y: 120 }
    },
    'collatz-tree': {
        realm: 'logos',
        name: 'Árbol de Collatz',
        concepts: ['computation', 'fractals', 'chaos'],
        position: { x: 830, y: 60 }
    },

    // ─────────────────────────────────────────────────────────
    // ATOMOS
    // ─────────────────────────────────────────────────────────
    'ondas': {
        realm: 'atomos',
        name: 'Ondas',
        concepts: ['waves', 'oscillation', 'resonance'],
        position: { x: 150, y: 350 }
    },
    'interferencia': {
        realm: 'atomos',
        name: 'Interferencia',
        concepts: ['waves', 'harmony', 'probability'],
        position: { x: 220, y: 400 }
    },
    'efecto-doppler': {
        realm: 'atomos',
        name: 'Efecto Doppler',
        concepts: ['waves', 'oscillation', 'fields'],
        position: { x: 180, y: 300 }
    },
    'pendulo-simple': {
        realm: 'atomos',
        name: 'Péndulo Simple',
        concepts: ['oscillation', 'gravity', 'harmony'],
        position: { x: 280, y: 350 }
    },
    'colisiones': {
        realm: 'atomos',
        name: 'Colisiones',
        concepts: ['thermodynamics', 'probability', 'optimization'],
        position: { x: 320, y: 420 }
    },
    'campo-electrico': {
        realm: 'atomos',
        name: 'Campo Eléctrico',
        concepts: ['fields', 'geometry', 'waves'],
        position: { x: 250, y: 280 }
    },
    'relatividad': {
        realm: 'atomos',
        name: 'Relatividad',
        concepts: ['geometry', 'gravity', 'fields'],
        position: { x: 350, y: 300 }
    },

    // ─────────────────────────────────────────────────────────
    // MACHINA
    // ─────────────────────────────────────────────────────────
    'automatas-elementales': {
        realm: 'machina',
        name: 'Autómatas Elementales',
        concepts: ['computation', 'emergence', 'information'],
        position: { x: 450, y: 380 }
    },
    'perceptron': {
        realm: 'machina',
        name: 'Perceptrón',
        concepts: ['computation', 'optimization', 'evolution'],
        position: { x: 520, y: 420 }
    },
    'logic-gates': {
        realm: 'machina',
        name: 'Compuertas Lógicas',
        concepts: ['computation', 'information', 'symmetry'],
        position: { x: 480, y: 340 }
    },
    'binary-search-tree': {
        realm: 'machina',
        name: 'Árbol Binario',
        concepts: ['computation', 'optimization', 'fractals'],
        position: { x: 550, y: 360 }
    },
    'finite-automata': {
        realm: 'machina',
        name: 'Autómatas Finitos',
        concepts: ['computation', 'information', 'geometry'],
        position: { x: 600, y: 400 }
    },

    // ─────────────────────────────────────────────────────────
    // ALCHEMY
    // ─────────────────────────────────────────────────────────
    'gas-ideal': {
        realm: 'alchemy',
        name: 'Gas Ideal',
        concepts: ['thermodynamics', 'probability', 'emergence'],
        position: { x: 700, y: 350 }
    },
    'entropia': {
        realm: 'alchemy',
        name: 'Entropía',
        concepts: ['thermodynamics', 'information', 'probability'],
        position: { x: 750, y: 400 }
    },
    'le-chatelier': {
        realm: 'alchemy',
        name: 'Le Chatelier',
        concepts: ['thermodynamics', 'optimization', 'oscillation'],
        position: { x: 680, y: 420 }
    },
    'cinetica-colisiones': {
        realm: 'alchemy',
        name: 'Cinética',
        concepts: ['thermodynamics', 'probability', 'chaos'],
        position: { x: 800, y: 360 }
    },

    // ─────────────────────────────────────────────────────────
    // BIOS
    // ─────────────────────────────────────────────────────────
    'evolucion': {
        realm: 'bios',
        name: 'Evolución',
        concepts: ['evolution', 'optimization', 'emergence'],
        position: { x: 850, y: 400 }
    },
    'adn-replicacion': {
        realm: 'bios',
        name: 'Replicación ADN',
        concepts: ['information', 'evolution', 'computation'],
        position: { x: 900, y: 350 }
    },
    'genetica-poblacional': {
        realm: 'bios',
        name: 'Genética Poblacional',
        concepts: ['evolution', 'probability', 'chaos'],
        position: { x: 880, y: 450 }
    },
    'ecosistema': {
        realm: 'bios',
        name: 'Ecosistema',
        concepts: ['emergence', 'evolution', 'oscillation'],
        position: { x: 950, y: 380 }
    },

    // ─────────────────────────────────────────────────────────
    // AETHER (Música y Armonía)
    // ─────────────────────────────────────────────────────────
    'sympathetic-12': {
        realm: 'aether',
        name: 'Cuerdas Simpáticas',
        concepts: ['resonance', 'harmony', 'waves'],
        position: { x: 500, y: 500 }
    },
    'contrapunctus': {
        realm: 'aether',
        name: 'Contrapunto',
        concepts: ['harmony', 'symmetry', 'computation'],
        position: { x: 580, y: 520 }
    },
    'tonnetz-chromatic': {
        realm: 'aether',
        name: 'Tonnetz',
        concepts: ['harmony', 'geometry', 'symmetry'],
        position: { x: 550, y: 480 }
    },
    'musica-esferas-moderna': {
        realm: 'aether',
        name: 'Música de las Esferas',
        concepts: ['harmony', 'gravity', 'resonance'],
        position: { x: 450, y: 540 }
    }
};

// ═══════════════════════════════════════════════════════════════
// CONEXIONES EXPLÍCITAS (aristas del grafo)
// ═══════════════════════════════════════════════════════════════

export const EDGES = [
    // ── Gravedad Universal ──
    { from: 'sistema-solar', to: 'orbitas-kepler', concept: 'gravity', strength: 1.0 },
    { from: 'orbitas-kepler', to: 'three-body', concept: 'gravity', strength: 0.9 },
    { from: 'three-body', to: 'agujero-negro', concept: 'gravity', strength: 0.7 },
    { from: 'agujero-negro', to: 'ondas-gravitacionales', concept: 'gravity', strength: 0.9 },
    { from: 'formacion-galaxias', to: 'expansion-universo', concept: 'gravity', strength: 0.8 },

    // ── Caos y Predictibilidad ──
    { from: 'lorenz-attractor', to: 'double-pendulum', concept: 'chaos', strength: 1.0 },
    { from: 'double-pendulum', to: 'three-body', concept: 'chaos', strength: 0.9 },
    { from: 'lorenz-attractor', to: 'strange-attractors', concept: 'chaos', strength: 1.0 },
    { from: 'three-body', to: 'lorenz-attractor', concept: 'chaos', strength: 0.8 },

    // ── Emergencia ──
    { from: 'game-of-life', to: 'boids-masivo', concept: 'emergence', strength: 0.9 },
    { from: 'boids-masivo', to: 'reaccion-difusion', concept: 'emergence', strength: 0.8 },
    { from: 'reaccion-difusion', to: 'evolucion', concept: 'emergence', strength: 0.7 },
    { from: 'game-of-life', to: 'automatas-elementales', concept: 'emergence', strength: 0.9 },
    { from: 'gas-ideal', to: 'entropia', concept: 'emergence', strength: 0.8 },

    // ── Fractales y Auto-similitud ──
    { from: 'mandelbrot', to: 'fractales-ifs', concept: 'fractals', strength: 1.0 },
    { from: 'fractales-ifs', to: 'l-systems', concept: 'fractals', strength: 0.9 },
    { from: 'l-systems', to: 'phyllotaxis', concept: 'fractals', strength: 0.8 },
    { from: 'lorenz-attractor', to: 'mandelbrot', concept: 'fractals', strength: 0.6 },
    { from: 'reaccion-difusion', to: 'l-systems', concept: 'fractals', strength: 0.7 },

    // ── Ondas y Vibraciones ──
    { from: 'ondas', to: 'interferencia', concept: 'waves', strength: 1.0 },
    { from: 'interferencia', to: 'efecto-doppler', concept: 'waves', strength: 0.8 },
    { from: 'ondas', to: 'sympathetic-12', concept: 'waves', strength: 0.9 },
    { from: 'ondas-gravitacionales', to: 'ondas', concept: 'waves', strength: 0.7 },
    { from: 'fourier-epicycles', to: 'ondas', concept: 'waves', strength: 0.9 },

    // ── Armonía y Música ──
    { from: 'sympathetic-12', to: 'contrapunctus', concept: 'harmony', strength: 0.9 },
    { from: 'contrapunctus', to: 'tonnetz-chromatic', concept: 'harmony', strength: 1.0 },
    { from: 'fourier-epicycles', to: 'sympathetic-12', concept: 'harmony', strength: 0.8 },
    { from: 'sistema-solar', to: 'musica-esferas-moderna', concept: 'harmony', strength: 0.7 },
    { from: 'phyllotaxis', to: 'tonnetz-chromatic', concept: 'harmony', strength: 0.6 },

    // ── Oscilación ──
    { from: 'pendulo-simple', to: 'double-pendulum', concept: 'oscillation', strength: 1.0 },
    { from: 'pendulo-simple', to: 'ondas', concept: 'oscillation', strength: 0.9 },
    { from: 'orbitas-kepler', to: 'pendulo-simple', concept: 'oscillation', strength: 0.7 },
    { from: 'le-chatelier', to: 'ecosistema', concept: 'oscillation', strength: 0.6 },

    // ── Computación ──
    { from: 'automatas-elementales', to: 'game-of-life', concept: 'computation', strength: 1.0 },
    { from: 'perceptron', to: 'evolucion', concept: 'computation', strength: 0.7 },
    { from: 'logic-gates', to: 'automatas-elementales', concept: 'computation', strength: 0.8 },
    { from: 'adn-replicacion', to: 'automatas-elementales', concept: 'computation', strength: 0.6 },
    { from: 'collatz-tree', to: 'mandelbrot', concept: 'computation', strength: 0.7 },

    // ── Información ──
    { from: 'entropia', to: 'adn-replicacion', concept: 'information', strength: 0.8 },
    { from: 'logic-gates', to: 'finite-automata', concept: 'information', strength: 0.9 },

    // ── Evolución ──
    { from: 'evolucion', to: 'genetica-poblacional', concept: 'evolution', strength: 1.0 },
    { from: 'genetica-poblacional', to: 'adn-replicacion', concept: 'evolution', strength: 0.9 },
    { from: 'l-systems', to: 'evolucion', concept: 'evolution', strength: 0.6 },
    { from: 'perceptron', to: 'evolucion', concept: 'evolution', strength: 0.7 },

    // ── Termodinámica ──
    { from: 'gas-ideal', to: 'colisiones', concept: 'thermodynamics', strength: 0.9 },
    { from: 'colisiones', to: 'entropia', concept: 'thermodynamics', strength: 0.9 },
    { from: 'cinetica-colisiones', to: 'entropia', concept: 'thermodynamics', strength: 0.8 },

    // ── Campos ──
    { from: 'campo-electrico', to: 'ondas', concept: 'fields', strength: 0.7 },
    { from: 'agujero-negro', to: 'campo-electrico', concept: 'fields', strength: 0.6 },

    // ── Geometría ──
    { from: 'voronoi', to: 'ecosistema', concept: 'geometry', strength: 0.5 },
    { from: 'tonnetz-chromatic', to: 'voronoi', concept: 'geometry', strength: 0.6 },
    { from: 'relatividad', to: 'agujero-negro', concept: 'geometry', strength: 0.9 },

    // ── Resonancia ──
    { from: 'sympathetic-12', to: 'interferencia', concept: 'resonance', strength: 0.8 },
    { from: 'ondas-gravitacionales', to: 'sympathetic-12', concept: 'resonance', strength: 0.5 },

    // ── Optimización ──
    { from: 'voronoi', to: 'boids-masivo', concept: 'optimization', strength: 0.7 },
    { from: 'phyllotaxis', to: 'voronoi', concept: 'optimization', strength: 0.8 },
    { from: 'binary-search-tree', to: 'perceptron', concept: 'optimization', strength: 0.6 },

    // ── Probabilidad ──
    { from: 'colisiones', to: 'genetica-poblacional', concept: 'probability', strength: 0.6 },
    { from: 'interferencia', to: 'genetica-poblacional', concept: 'probability', strength: 0.5 }
];

// ═══════════════════════════════════════════════════════════════
// CAMINOS DE APRENDIZAJE (rutas pedagógicas temáticas)
// ═══════════════════════════════════════════════════════════════

export const LEARNING_PATHS = {
    'path-gravity': {
        name: 'El Camino de la Gravedad',
        description: 'De manzanas cayendo a agujeros negros devorando luz',
        icon: '🌍',
        color: 0x3b82f6,
        nodes: [
            'pendulo-simple',      // Gravedad básica
            'sistema-solar',       // Gravedad orbital
            'orbitas-kepler',      // Leyes del movimiento planetario
            'three-body',          // Complejidad gravitacional
            'agujero-negro',       // Gravedad extrema
            'ondas-gravitacionales' // Ondulaciones del espacio-tiempo
        ],
        reward: {
            title: 'Maestro de la Gravedad',
            eigenvalores: 3,
            insight: 'La gravedad no es una fuerza, es la curvatura del espacio-tiempo'
        }
    },

    'path-chaos': {
        name: 'El Efecto Mariposa',
        description: 'Pequeñas causas, grandes consecuencias impredecibles',
        icon: '🦋',
        color: 0xf59e0b,
        nodes: [
            'pendulo-simple',      // Determinista
            'double-pendulum',     // Caos mecánico
            'lorenz-attractor',    // Caos atmosférico
            'three-body',          // Caos gravitacional
            'strange-attractors',  // La geometría del caos
            'genetica-poblacional' // Caos en la vida
        ],
        reward: {
            title: 'Domador del Caos',
            eigenvalores: 3,
            insight: 'El caos no es desorden, es orden demasiado complejo para predecir'
        }
    },

    'path-emergence': {
        name: 'El Todo es Más',
        description: 'Cómo reglas simples crean complejidad asombrosa',
        icon: '🐦',
        color: 0x22c55e,
        nodes: [
            'automatas-elementales', // Reglas simples
            'game-of-life',          // Vida artificial
            'boids-masivo',          // Comportamiento colectivo
            'reaccion-difusion',     // Patrones de Turing
            'ecosistema',            // Redes tróficas
            'evolucion'              // La emergencia suprema
        ],
        reward: {
            title: 'Arquitecto de la Emergencia',
            eigenvalores: 3,
            insight: 'La vida es información que ha aprendido a copiarse a sí misma'
        }
    },

    'path-fractals': {
        name: 'Infinito en lo Finito',
        description: 'Auto-similitud desde las matemáticas hasta la naturaleza',
        icon: '🌀',
        color: 0xa855f7,
        nodes: [
            'mandelbrot',        // El fractal matemático
            'fractales-ifs',     // Sistemas iterados
            'l-systems',         // Fractales biológicos
            'reaccion-difusion', // Fractales químicos
            'phyllotaxis',       // Fractales en plantas
            'collatz-tree'       // Fractales en números
        ],
        reward: {
            title: 'Viajero del Infinito',
            eigenvalores: 3,
            insight: 'Entre cualquier dos puntos hay infinitos fractales escondidos'
        }
    },

    'path-waves': {
        name: 'Vibraciones Universales',
        description: 'Todo vibra: luz, sonido, materia, espacio-tiempo',
        icon: '🌊',
        color: 0x06b6d4,
        nodes: [
            'pendulo-simple',        // Oscilación básica
            'ondas',                 // Ondas mecánicas
            'interferencia',         // Superposición
            'efecto-doppler',        // Ondas en movimiento
            'fourier-epicycles',     // Análisis armónico
            'ondas-gravitacionales'  // Ondas del espacio-tiempo
        ],
        reward: {
            title: 'Resonador Universal',
            eigenvalores: 3,
            insight: 'El universo es una sinfonía de vibraciones en diferentes frecuencias'
        }
    },

    'path-harmony': {
        name: 'Armonía de las Esferas',
        description: 'De Pitágoras a las cuerdas simpáticas',
        icon: '🎼',
        color: 0xc084fc,
        nodes: [
            'ondas',                  // Fundamento físico
            'interferencia',          // Consonancia y disonancia
            'fourier-epicycles',      // Descomposición armónica
            'sympathetic-12',         // Resonancia simpática
            'contrapunctus',          // Estructura musical
            'musica-esferas-moderna'  // Música celestial
        ],
        reward: {
            title: 'Músico de los Mundos',
            eigenvalores: 3,
            insight: 'La armonía no es solo belleza, es la estructura matemática del cosmos'
        }
    },

    'path-computation': {
        name: 'La Máquina Universal',
        description: 'De compuertas lógicas a inteligencia artificial',
        icon: '🖥️',
        color: 0x64748b,
        nodes: [
            'logic-gates',           // Fundamentos
            'finite-automata',       // Estados y transiciones
            'automatas-elementales', // Computación mínima
            'game-of-life',          // Computación emergente
            'binary-search-tree',    // Estructuras de datos
            'perceptron'             // Aprendizaje
        ],
        reward: {
            title: 'Arquitecto de Máquinas',
            eigenvalores: 3,
            insight: 'Cualquier cómputo puede reducirse a operaciones lógicas elementales'
        }
    },

    'path-thermodynamics': {
        name: 'La Flecha del Tiempo',
        description: 'Por qué el universo envejece y no rejuvenece',
        icon: '🔥',
        color: 0xef4444,
        nodes: [
            'colisiones',         // Mecánica estadística
            'gas-ideal',          // Comportamiento colectivo
            'cinetica-colisiones', // Velocidad y temperatura
            'entropia',           // El desorden crece
            'evolucion',          // Entropía y vida
            'expansion-universo'  // Muerte térmica
        ],
        reward: {
            title: 'Guardián de la Entropía',
            eigenvalores: 3,
            insight: 'La vida es un río que fluye contra la corriente de la entropía'
        }
    },

    'path-life': {
        name: 'El Código de la Vida',
        description: 'De moléculas a ecosistemas complejos',
        icon: '🧬',
        color: 0x10b981,
        nodes: [
            'adn-replicacion',       // Información genética
            'genetica-poblacional',  // Herencia y variación
            'evolucion',             // Selección natural
            'reaccion-difusion',     // Morfogénesis
            'ecosistema',            // Redes de vida
            'boids-masivo'           // Comportamiento colectivo
        ],
        reward: {
            title: 'Guardián del Genoma',
            eigenvalores: 3,
            insight: 'Todos los seres vivos comparten el mismo código: somos primos del brócoli'
        }
    }
};

// ═══════════════════════════════════════════════════════════════
// FUNCIONES DE UTILIDAD
// ═══════════════════════════════════════════════════════════════

/**
 * Obtiene todas las conexiones de un nodo
 */
export function getNodeConnections(nodeId) {
    return EDGES.filter(e => e.from === nodeId || e.to === nodeId)
        .map(e => ({
            target: e.from === nodeId ? e.to : e.from,
            concept: e.concept,
            strength: e.strength
        }));
}

/**
 * Obtiene nodos que comparten un concepto
 */
export function getNodesByConcept(conceptId) {
    return Object.entries(NODES)
        .filter(([_, node]) => node.concepts.includes(conceptId))
        .map(([id, node]) => ({ id, ...node }));
}

/**
 * Calcula la "distancia" conceptual entre dos nodos
 */
export function getConceptualDistance(nodeA, nodeB) {
    const conceptsA = new Set(NODES[nodeA]?.concepts || []);
    const conceptsB = new Set(NODES[nodeB]?.concepts || []);

    const intersection = [...conceptsA].filter(c => conceptsB.has(c));
    const union = new Set([...conceptsA, ...conceptsB]);

    return 1 - (intersection.length / union.size); // Jaccard distance
}

/**
 * Encuentra el camino más corto entre dos nodos
 */
export function findPath(startId, endId) {
    const visited = new Set();
    const queue = [[startId]];

    while (queue.length > 0) {
        const path = queue.shift();
        const current = path[path.length - 1];

        if (current === endId) return path;
        if (visited.has(current)) continue;

        visited.add(current);
        const connections = getNodeConnections(current);

        for (const conn of connections) {
            if (!visited.has(conn.target)) {
                queue.push([...path, conn.target]);
            }
        }
    }

    return null; // No path found
}

/**
 * Obtiene el progreso en un camino de aprendizaje
 */
export function getPathProgress(pathId, completedSims) {
    const path = LEARNING_PATHS[pathId];
    if (!path) return { completed: 0, total: 0, percentage: 0 };

    const completed = path.nodes.filter(n => completedSims.has(n)).length;
    return {
        completed,
        total: path.nodes.length,
        percentage: Math.round((completed / path.nodes.length) * 100)
    };
}

/**
 * Verifica si un camino está completo
 */
export function isPathComplete(pathId, completedSims) {
    const path = LEARNING_PATHS[pathId];
    if (!path) return false;
    return path.nodes.every(n => completedSims.has(n));
}

/**
 * Sugiere el siguiente nodo a explorar basado en conexiones
 */
export function suggestNextNode(completedSims, currentRealm = null) {
    const completed = new Set(completedSims);
    const candidates = [];

    // Buscar nodos conectados a los completados pero no visitados
    for (const simId of completed) {
        const connections = getNodeConnections(simId);
        for (const conn of connections) {
            if (!completed.has(conn.target)) {
                candidates.push({
                    id: conn.target,
                    fromConnection: simId,
                    concept: conn.concept,
                    strength: conn.strength
                });
            }
        }
    }

    // Ordenar por fuerza de conexión
    candidates.sort((a, b) => b.strength - a.strength);

    // Filtrar por realm si se especifica
    if (currentRealm) {
        const filtered = candidates.filter(c => NODES[c.id]?.realm === currentRealm);
        if (filtered.length > 0) return filtered[0];
    }

    return candidates[0] || null;
}
