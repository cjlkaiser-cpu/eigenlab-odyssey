/**
 * EigenLab Odyssey - Constantes del juego
 */

// Dimensiones
export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;

// Colores de los Nueve Reinos (hex sin #)
export const REALM_COLORS = {
    aether:   { primary: 0xa855f7, secondary: 0x7c3aed, name: 'Violeta' },      // Música - Hub central
    cosmos:   { primary: 0x1e3a8a, secondary: 0x3b82f6, name: 'Azul profundo' }, // Astronomía
    chaos:    { primary: 0xdc2626, secondary: 0xf97316, name: 'Rojo/Naranja' },  // Emergencia
    logos:    { primary: 0xfbbf24, secondary: 0xfde68a, name: 'Blanco/Oro' },    // Matemáticas
    atomos:   { primary: 0x06b6d4, secondary: 0x22d3ee, name: 'Cian' },          // Física
    terra:    { primary: 0x84cc16, secondary: 0xa3e635, name: 'Verde lima' },    // Geología
    machina:  { primary: 0x22c55e, secondary: 0x4ade80, name: 'Verde terminal' }, // Computación
    alchemy:  { primary: 0x9333ea, secondary: 0xc084fc, name: 'Púrpura' },       // Química
    bios:     { primary: 0x10b981, secondary: 0x34d399, name: 'Verde vida' },    // Biología
    psyche:   { primary: 0xec4899, secondary: 0xf472b6, name: 'Rosa' }           // IA/Mente
};

// Colores UI
export const UI_COLORS = {
    background: 0x030712,
    backgroundAlt: 0x0f172a,
    text: 0xf8fafc,
    textMuted: 0x94a3b8,
    accent: 0xa855f7
};

// Configuración del jugador
export const PLAYER = {
    speed: 200,
    size: 24,
    glowRadius: 40
};

// Configuración de portales
export const PORTAL = {
    radius: 60,
    pulseSpeed: 0.02,
    activationDistance: 80
};

// Los tres reinos iniciales accesibles desde Aether
export const INITIAL_REALMS = ['cosmos', 'chaos', 'logos'];

// Mapeo de reinos a simulaciones de EigenLab - VERIFICADO
export const REALM_SIMULATIONS = {
    cosmos: [
        'harmonices-mundi', // Puzzle central de COSMOS
        'formacion-galaxias',
        'sistema-solar',
        'agujero-negro',
        'expansion-universo',
        'nucleosintesis',
        'pulsares',
        'lentes-gravitacionales',
        'ondas-gravitacionales',
        'diagrama-hr',
        'orbitas-kepler',
        'three-body',
        'fases-lunares',
        'estaciones'
    ],
    chaos: [
        'lorenz-attractor',
        'strange-attractors',
        'double-pendulum',
        'atractor-multicuerpo',
        'boids-masivo',
        'game-of-life',
        'reaccion-difusion',
        'flow-fields',
        'juego-caos',
        'galton-board'
    ],
    logos: [
        'mandelbrot',
        'fractales-ifs',
        'riemann',
        'domain-coloring',
        'collatz-tree',
        'ulam-spiral',
        'fourier-epicycles',
        'taylor',
        'phyllotaxis',
        'l-systems',
        'voronoi',
        'mathematical-knots',
        'poincare-disk',
        'symmetry-groups',
        'funciones',
        'trigonometria',
        'probabilidad',
        'montecarlo-pi',
        'geometria-3d',
        'mobius-strip'
    ],
    atomos: [
        'ondas',
        'interferencia',
        'efecto-doppler',
        'pendulo-simple',
        'oscilador-forzado',
        'colisiones',
        'campo-electrico',
        'optica',
        'relatividad',
        'efecto-tunel',
        'mecanica-lagrangiana',
        'circuitos',
        'proyectil',
        'difusion-calor',
        'fluidos-2d'
    ],
    terra: [
        'tectonica-placas',
        'terremotos',
        'volcanes',
        'erosion',
        'erosion-hidraulica',
        'ciclo-rocas',
        'estratigrafia'
    ],
    machina: [
        'automatas-elementales',
        'finite-automata',
        'binary-search-tree',
        'bubble-sort-race',
        'logic-gates-sandbox',
        'stack-heap-visualizer',
        'perceptron-playground'
    ],
    alchemy: [
        'gas-ideal',
        'gases-reales',
        'termodinamica',
        'entropia',
        'le-chatelier',
        'cinetica-colisiones',
        'titulacion',
        'nernst',
        'celda-galvanica',
        'diagrama-fases',
        'solubilidad',
        'tabla-periodica',
        'orbitales',
        'modelo-bohr',
        'enlaces',
        'vsepr'
    ],
    bios: [
        'adn-replicacion',
        'sintesis-proteinas',
        'mitosis',
        'meiosis',
        'mutaciones',
        'evolucion',
        'genetica-poblacional',
        'ecosistema',
        'krebs',
        'glucolisis',
        'membrana-fluida',
        'transcripcion',
        'traduccion',
        'plegamiento'
    ],
    psyche: [
        'neurona',
        'vision',
        'ritmos-circadianos'
    ],
    aether: [
        'contrapunctus',
        'sympathetic-12',
        'musica-esferas-moderna',
        'tonnetz-chromatic',
        'tonnetz-dual',
        'cadencia-orbital',
        'harmonices-mundi',
        'rameau-machine',
        'orbifold-walker'
    ]
};

// Textos narrativos
export const NARRATIVE = {
    awakening: [
        "...",
        "Despiertas en un lugar que reconoces sin recordar.",
        "El silencio aquí es diferente. Está... incompleto.",
        "Fragmentos de una melodía olvidada flotan en el vacío.",
        "La Lira yace rota a tus pies.",
        "Los portales brillan tenues, esperando."
    ],
    lyraInteract: [
        "La Lira de Cuerdas Simpáticas.",
        "Alguna vez, sus doce cuerdas resonaban con el universo entero.",
        "Ahora solo quedan ecos.",
        "Para restaurarla, necesitarás Eigenvalores de los otros reinos.",
        "[Cosmos, Chaos y Logos aguardan]"
    ],
    portalHints: {
        cosmos: "COSMOS — Donde nacen y mueren las estrellas",
        chaos: "CHAOS — Donde el orden emerge del desorden",
        logos: "LOGOS — Donde las verdades son eternas"
    }
};
