/**
 * Conexiones del Grafo de Conocimiento - M2.3
 *
 * Cada conexión representa una relación conceptual entre simulaciones
 * que se desbloquea cuando el jugador explora ambas simulaciones.
 *
 * Estructura:
 * - id: Identificador único
 * - name: Nombre de la conexión
 * - description: Por qué estas simulaciones están conectadas
 * - requiredSims: Simulaciones que deben completarse
 * - realms: Reinos involucrados (para colores)
 * - concept: Concepto que une las simulaciones
 */

export const CONNECTIONS = [
    // ═══════════════════════════════════════════════════════════════
    // CONEXIONES INTRA-REINO (dentro del mismo reino)
    // ═══════════════════════════════════════════════════════════════

    // COSMOS
    {
        id: 'gravity-orbits',
        name: 'Danza Gravitacional',
        description: 'La gravedad esculpe galaxias y define órbitas',
        requiredSims: ['formacion-galaxias', 'orbitas-kepler'],
        realms: ['cosmos', 'cosmos'],
        concept: 'gravity'
    },
    {
        id: 'stellar-lifecycle',
        name: 'Ciclo Estelar',
        description: 'Las estrellas nacen, viven y mueren siguiendo patrones',
        requiredSims: ['diagrama-hr', 'agujero-negro'],
        realms: ['cosmos', 'cosmos'],
        concept: 'emergence'
    },
    {
        id: 'cosmic-expansion',
        name: 'Universo en Fuga',
        description: 'Todo se expande, todo se aleja',
        requiredSims: ['expansion-universo', 'ondas-gravitacionales'],
        realms: ['cosmos', 'cosmos'],
        concept: 'waves'
    },

    // CHAOS
    {
        id: 'butterfly-pendulum',
        name: 'Sensibilidad Inicial',
        description: 'Pequeños cambios, grandes consecuencias',
        requiredSims: ['lorenz-attractor', 'double-pendulum'],
        realms: ['chaos', 'chaos'],
        concept: 'chaos'
    },
    {
        id: 'emergence-rules',
        name: 'Reglas Simples, Patrones Complejos',
        description: 'La complejidad emerge de la simplicidad',
        requiredSims: ['boids-masivo', 'game-of-life'],
        realms: ['chaos', 'chaos'],
        concept: 'emergence'
    },
    {
        id: 'pattern-formation',
        name: 'Morfogénesis',
        description: 'Cómo la naturaleza crea patrones',
        requiredSims: ['reaccion-difusion', 'flow-fields'],
        realms: ['chaos', 'chaos'],
        concept: 'fractals'
    },

    // LOGOS
    {
        id: 'infinite-self',
        name: 'Auto-similitud',
        description: 'El infinito contenido en lo finito',
        requiredSims: ['mandelbrot', 'fractales-ifs'],
        realms: ['logos', 'logos'],
        concept: 'fractals'
    },
    {
        id: 'circle-magic',
        name: 'Magia Circular',
        description: 'Los círculos pueden dibujar cualquier cosa',
        requiredSims: ['fourier-epicycles', 'phyllotaxis'],
        realms: ['logos', 'logos'],
        concept: 'harmony'
    },
    {
        id: 'growth-grammar',
        name: 'Gramáticas de Crecimiento',
        description: 'Reglas que generan formas naturales',
        requiredSims: ['l-systems', 'voronoi'],
        realms: ['logos', 'logos'],
        concept: 'emergence'
    },

    // ATOMOS
    {
        id: 'wave-interference',
        name: 'Superposición',
        description: 'Las ondas se suman y se cancelan',
        requiredSims: ['ondas', 'interferencia'],
        realms: ['atomos', 'atomos'],
        concept: 'waves'
    },
    {
        id: 'oscillation-harmony',
        name: 'Oscilación Armónica',
        description: 'Todo oscila, todo vibra',
        requiredSims: ['pendulo-simple', 'oscilador-forzado'],
        realms: ['atomos', 'atomos'],
        concept: 'harmony'
    },

    // ═══════════════════════════════════════════════════════════════
    // CONEXIONES INTER-REINO (entre reinos diferentes)
    // ═══════════════════════════════════════════════════════════════

    // COSMOS <-> CHAOS
    {
        id: 'cosmic-chaos',
        name: 'Caos Cósmico',
        description: 'El problema de tres cuerpos es caótico por naturaleza',
        requiredSims: ['three-body', 'lorenz-attractor'],
        realms: ['cosmos', 'chaos'],
        concept: 'chaos'
    },

    // COSMOS <-> LOGOS
    {
        id: 'harmony-of-spheres',
        name: 'Armonía de las Esferas',
        description: 'Kepler encontró matemáticas en las órbitas',
        requiredSims: ['orbitas-kepler', 'phyllotaxis'],
        realms: ['cosmos', 'logos'],
        concept: 'harmony'
    },

    // CHAOS <-> LOGOS
    {
        id: 'fractal-chaos',
        name: 'Fractales del Caos',
        description: 'Los atractores extraños son fractales',
        requiredSims: ['strange-attractors', 'mandelbrot'],
        realms: ['chaos', 'logos'],
        concept: 'fractals'
    },
    {
        id: 'turing-patterns',
        name: 'Patrones de Turing',
        description: 'Reacción-difusión y morfogénesis matemática',
        requiredSims: ['reaccion-difusion', 'l-systems'],
        realms: ['chaos', 'logos'],
        concept: 'emergence'
    },

    // ATOMOS <-> COSMOS
    {
        id: 'waves-everywhere',
        name: 'Ondas Universales',
        description: 'De ondas sonoras a ondas gravitacionales',
        requiredSims: ['ondas', 'ondas-gravitacionales'],
        realms: ['atomos', 'cosmos'],
        concept: 'waves'
    },

    // ATOMOS <-> CHAOS
    {
        id: 'pendulum-chaos',
        name: 'Del Orden al Caos',
        description: 'Un péndulo simple es predecible, uno doble es caótico',
        requiredSims: ['pendulo-simple', 'double-pendulum'],
        realms: ['atomos', 'chaos'],
        concept: 'chaos'
    },

    // MACHINA <-> CHAOS
    {
        id: 'computation-emergence',
        name: 'Emergencia Computacional',
        description: 'Autómatas simples pueden ser Turing-completos',
        requiredSims: ['automatas-elementales', 'game-of-life'],
        realms: ['machina', 'chaos'],
        concept: 'computation'
    },

    // MACHINA <-> LOGOS
    {
        id: 'logic-math',
        name: 'Lógica y Matemáticas',
        description: 'Las compuertas lógicas son la base del cálculo',
        requiredSims: ['logic-gates-sandbox', 'binary-search-tree'],
        realms: ['machina', 'logos'],
        concept: 'computation'
    },

    // ALCHEMY <-> CHAOS
    {
        id: 'entropy-disorder',
        name: 'Entropía Universal',
        description: 'El desorden siempre aumenta',
        requiredSims: ['entropia', 'galton-board'],
        realms: ['alchemy', 'chaos'],
        concept: 'chaos'
    },

    // ALCHEMY <-> ATOMOS
    {
        id: 'thermo-waves',
        name: 'Calor y Ondas',
        description: 'La difusión del calor es un fenómeno ondulatorio',
        requiredSims: ['termodinamica', 'difusion-calor'],
        realms: ['alchemy', 'atomos'],
        concept: 'waves'
    },

    // BIOS <-> CHAOS
    {
        id: 'evolution-emergence',
        name: 'Evolución Emergente',
        description: 'La selección natural crea patrones complejos',
        requiredSims: ['evolucion', 'boids-masivo'],
        realms: ['bios', 'chaos'],
        concept: 'emergence'
    },

    // BIOS <-> LOGOS
    {
        id: 'dna-fractals',
        name: 'Geometría de la Vida',
        description: 'El ADN y los L-Systems comparten principios',
        requiredSims: ['adn-replicacion', 'l-systems'],
        realms: ['bios', 'logos'],
        concept: 'fractals'
    },

    // AETHER <-> COSMOS
    {
        id: 'music-cosmos',
        name: 'Música de las Esferas',
        description: 'Kepler escuchaba acordes en las órbitas',
        requiredSims: ['harmonices-mundi', 'tonnetz-chromatic'],
        realms: ['cosmos', 'aether'],
        concept: 'harmony'
    },

    // AETHER <-> ATOMOS
    {
        id: 'resonance-physics',
        name: 'Resonancia Física',
        description: 'Las cuerdas simpáticas y la física de ondas',
        requiredSims: ['sympathetic-12', 'oscilador-forzado'],
        realms: ['aether', 'atomos'],
        concept: 'harmony'
    },

    // AETHER <-> LOGOS
    {
        id: 'music-math',
        name: 'Matemáticas de la Música',
        description: 'Fourier y la armonía',
        requiredSims: ['tonnetz-dual', 'fourier-epicycles'],
        realms: ['aether', 'logos'],
        concept: 'harmony'
    }
];

/**
 * Obtiene una conexión por su ID
 */
export function getConnection(id) {
    return CONNECTIONS.find(c => c.id === id);
}

/**
 * Obtiene todas las conexiones que involucran una simulación específica
 */
export function getConnectionsForSimulation(simId) {
    return CONNECTIONS.filter(c => c.requiredSims.includes(simId));
}

/**
 * Obtiene conexiones por concepto
 */
export function getConnectionsByConcept(concept) {
    return CONNECTIONS.filter(c => c.concept === concept);
}

/**
 * Verifica si una conexión está disponible (ambas simulaciones completadas)
 */
export function isConnectionAvailable(conn, completedSims) {
    return conn.requiredSims.every(sim => completedSims.includes(sim));
}
