/**
 * NavigationSystem - Gestión de navegación entre reinos
 *
 * Controla las transiciones, el desbloqueo progresivo,
 * y las conexiones entre los nueve reinos.
 */

import { REALM_COLORS, REALM_SIMULATIONS } from '../core/constants.js';

// Estructura del mapa de reinos
export const REALM_MAP = {
    // Posiciones relativas de cada reino en el mapa global
    // (para visualización del mapa completo)
    aether: { x: 0.5, y: 0.5, tier: 0 },   // Centro

    cosmos: { x: 0.5, y: 0.15, tier: 1 },  // Norte
    chaos:  { x: 0.15, y: 0.5, tier: 1 },  // Oeste
    logos:  { x: 0.85, y: 0.5, tier: 1 },  // Este

    atomos:  { x: 0.25, y: 0.35, tier: 2 }, // Noroeste
    machina: { x: 0.75, y: 0.35, tier: 2 }, // Noreste
    terra:   { x: 0.5, y: 0.7, tier: 2 },   // Sur

    alchemy: { x: 0.25, y: 0.7, tier: 3 },  // Suroeste
    bios:    { x: 0.75, y: 0.7, tier: 3 },  // Sureste
    psyche:  { x: 0.5, y: 0.9, tier: 3 }    // Sur profundo
};

// Conexiones directas entre reinos (para navegación)
export const REALM_CONNECTIONS = {
    aether: ['cosmos', 'chaos', 'logos'],
    cosmos: ['aether', 'atomos', 'machina'],
    chaos: ['aether', 'atomos'],
    logos: ['aether', 'machina'],
    atomos: ['cosmos', 'chaos', 'terra', 'alchemy'],
    machina: ['cosmos', 'logos', 'terra', 'bios'],
    terra: ['atomos', 'machina', 'alchemy', 'bios', 'psyche'],
    alchemy: ['atomos', 'terra'],
    bios: ['machina', 'terra'],
    psyche: ['terra', 'bios', 'machina']
};

// Requisitos de desbloqueo
export const UNLOCK_REQUIREMENTS = {
    aether: { eigenvalores: 0, connections: 0 },
    cosmos: { eigenvalores: 0, connections: 0 },
    chaos: { eigenvalores: 0, connections: 0 },
    logos: { eigenvalores: 0, connections: 0 },
    atomos: { eigenvalores: 3, connections: 0 },
    machina: { eigenvalores: 3, connections: 0 },
    terra: { eigenvalores: 3, connections: 0 },
    alchemy: { eigenvalores: 6, connections: 1 },
    bios: { eigenvalores: 6, connections: 1 },
    psyche: { eigenvalores: 10, connections: 3 }
};

// Conexiones temáticas descubribles
export const THEMATIC_CONNECTIONS = [
    {
        id: 'resonancia-gravitacional',
        realms: ['cosmos', 'aether'],
        name: 'Resonancia Gravitacional',
        description: 'Las órbitas planetarias crean patrones rítmicos — la música de las esferas.',
        simulations: ['orbitas-kepler', 'musica-esferas-moderna'],
        discovered: false
    },
    {
        id: 'atractores-musicales',
        realms: ['chaos', 'aether'],
        name: 'Atractores Musicales',
        description: 'El atractor de Lorenz tiene frecuencias naturales. El caos canta.',
        simulations: ['lorenz-attractor', 'sympathetic-12'],
        discovered: false
    },
    {
        id: 'simetria-infinita',
        realms: ['logos', 'cosmos'],
        name: 'Simetría Infinita',
        description: 'Los fractales aparecen en la estructura de galaxias.',
        simulations: ['mandelbrot', 'formacion-galaxias'],
        discovered: false
    },
    {
        id: 'ondas-universales',
        realms: ['atomos', 'aether'],
        name: 'Ondas Universales',
        description: 'Fourier revela que todo vibra — luz, sonido, materia.',
        simulations: ['ondas', 'fourier'],
        discovered: false
    },
    {
        id: 'tiempo-geologico',
        realms: ['terra', 'logos'],
        name: 'Tiempo Geológico',
        description: 'Los estratos siguen patrones matemáticos.',
        simulations: ['estratigrafia', 'l-systems'],
        discovered: false
    },
    {
        id: 'vida-emergente',
        realms: ['bios', 'chaos'],
        name: 'Vida Emergente',
        description: 'Conway demostró que la vida emerge de reglas simples.',
        simulations: ['evolucion', 'game-of-life'],
        discovered: false
    },
    {
        id: 'mente-artificial',
        realms: ['psyche', 'machina'],
        name: 'Mente Artificial',
        description: 'El perceptrón imita a la neurona. Código que piensa.',
        simulations: ['neurona', 'perceptron'],
        discovered: false
    },
    {
        id: 'transmutacion',
        realms: ['alchemy', 'atomos'],
        name: 'Transmutación',
        description: 'Los alquimistas tenían razón — todo es transformación de energía.',
        simulations: ['termodinamica', 'colisiones'],
        discovered: false
    }
];

export default class NavigationSystem {
    constructor(scene) {
        this.scene = scene;
        this.currentRealm = 'aether';
        this.playerState = {
            eigenvalores: 0,
            discoveredConnections: [],
            completedSimulations: [],
            visitedRealms: ['aether']
        };

        // Cargar estado guardado
        this.loadState();
    }

    // Verificar si un reino está desbloqueado
    isRealmUnlocked(realm) {
        const req = UNLOCK_REQUIREMENTS[realm];
        return (
            this.playerState.eigenvalores >= req.eigenvalores &&
            this.playerState.discoveredConnections.length >= req.connections
        );
    }

    // Obtener reinos accesibles desde el actual
    getAccessibleRealms() {
        const connections = REALM_CONNECTIONS[this.currentRealm] || [];
        return connections.filter(realm => this.isRealmUnlocked(realm));
    }

    // Obtener todos los reinos con su estado
    getAllRealmsStatus() {
        return Object.keys(REALM_MAP).map(realm => ({
            id: realm,
            ...REALM_MAP[realm],
            color: REALM_COLORS[realm],
            unlocked: this.isRealmUnlocked(realm),
            visited: this.playerState.visitedRealms.includes(realm),
            simulations: REALM_SIMULATIONS[realm] || [],
            completedCount: this.getCompletedSimulationsCount(realm)
        }));
    }

    // Contar simulaciones completadas en un reino
    getCompletedSimulationsCount(realm) {
        const sims = REALM_SIMULATIONS[realm] || [];
        return sims.filter(sim =>
            this.playerState.completedSimulations.includes(sim)
        ).length;
    }

    // Navegar a un reino
    navigateTo(realm) {
        if (!this.isRealmUnlocked(realm)) {
            console.warn(`Realm ${realm} is locked`);
            return false;
        }

        this.currentRealm = realm;

        if (!this.playerState.visitedRealms.includes(realm)) {
            this.playerState.visitedRealms.push(realm);
        }

        this.saveState();
        return true;
    }

    // Completar una simulación
    completeSimulation(simulation, grantEigenvalor = true) {
        if (!this.playerState.completedSimulations.includes(simulation)) {
            this.playerState.completedSimulations.push(simulation);

            if (grantEigenvalor) {
                this.playerState.eigenvalores++;
            }

            // Verificar si se descubrió una conexión
            this.checkForConnections(simulation);

            this.saveState();
            return true;
        }
        return false;
    }

    // Verificar si completar una simulación revela una conexión
    checkForConnections(simulation) {
        THEMATIC_CONNECTIONS.forEach(connection => {
            if (connection.discovered) return;

            // Verificar si ambas simulaciones de la conexión están completas
            const allComplete = connection.simulations.every(sim =>
                this.playerState.completedSimulations.includes(sim)
            );

            if (allComplete) {
                connection.discovered = true;
                this.playerState.discoveredConnections.push(connection.id);
                this.scene.events.emit('connection-discovered', connection);
            }
        });
    }

    // Obtener conexiones descubiertas
    getDiscoveredConnections() {
        return THEMATIC_CONNECTIONS.filter(c =>
            this.playerState.discoveredConnections.includes(c.id)
        );
    }

    // Obtener progreso general
    getProgress() {
        const totalSims = Object.values(REALM_SIMULATIONS)
            .flat().length;
        const completedSims = this.playerState.completedSimulations.length;
        const totalConnections = THEMATIC_CONNECTIONS.length;
        const discoveredConnections = this.playerState.discoveredConnections.length;

        return {
            eigenvalores: this.playerState.eigenvalores,
            simulations: {
                completed: completedSims,
                total: totalSims,
                percentage: Math.round((completedSims / totalSims) * 100)
            },
            connections: {
                discovered: discoveredConnections,
                total: totalConnections,
                percentage: Math.round((discoveredConnections / totalConnections) * 100)
            },
            realms: {
                visited: this.playerState.visitedRealms.length,
                total: Object.keys(REALM_MAP).length
            }
        };
    }

    // Persistencia
    saveState() {
        try {
            localStorage.setItem('eigenlab-odyssey-state', JSON.stringify(this.playerState));
        } catch (e) {
            console.warn('Could not save state:', e);
        }
    }

    loadState() {
        try {
            const saved = localStorage.getItem('eigenlab-odyssey-state');
            if (saved) {
                this.playerState = { ...this.playerState, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.warn('Could not load state:', e);
        }
    }

    resetState() {
        this.playerState = {
            eigenvalores: 0,
            discoveredConnections: [],
            completedSimulations: [],
            visitedRealms: ['aether']
        };
        this.saveState();
    }
}
