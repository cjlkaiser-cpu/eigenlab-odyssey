/**
 * GameState - Sistema centralizado de estado del juego
 *
 * Gestiona:
 * - Eigenvalores (progresión principal)
 * - Simulaciones completadas
 * - Conexiones descubiertas
 * - Reinos visitados/desbloqueados
 * - Persistencia en localStorage
 */

import { REALM_SIMULATIONS } from '../core/constants.js';

const STORAGE_KEY = 'eigenlab-odyssey-save';

// Requisitos de desbloqueo por reino
const UNLOCK_REQUIREMENTS = {
    aether: { eigenvalores: 0 },
    cosmos: { eigenvalores: 0 },
    chaos: { eigenvalores: 0 },
    logos: { eigenvalores: 0 },
    atomos: { eigenvalores: 2 },
    machina: { eigenvalores: 2 },
    terra: { eigenvalores: 2 },
    alchemy: { eigenvalores: 5 },
    bios: { eigenvalores: 5 },
    psyche: { eigenvalores: 8 }
};

// Conexiones temáticas entre reinos
const CONNECTIONS = [
    {
        id: 'gravitational-resonance',
        realms: ['cosmos', 'aether'],
        name: 'Resonancia Gravitacional',
        description: 'Las órbitas planetarias crean patrones rítmicos.',
        requiredSims: ['orbitas-kepler', 'musica-esferas-moderna']
    },
    {
        id: 'chaotic-attractors',
        realms: ['chaos', 'aether'],
        name: 'Atractores Musicales',
        description: 'El caos tiene frecuencias naturales.',
        requiredSims: ['lorenz-attractor', 'sympathetic-12']
    },
    {
        id: 'infinite-symmetry',
        realms: ['logos', 'cosmos'],
        name: 'Simetría Infinita',
        description: 'Los fractales aparecen en galaxias.',
        requiredSims: ['mandelbrot', 'formacion-galaxias']
    },
    {
        id: 'universal-waves',
        realms: ['atomos', 'aether'],
        name: 'Ondas Universales',
        description: 'Todo vibra — luz, sonido, materia.',
        requiredSims: ['ondas', 'fourier-epicycles']
    },
    {
        id: 'emergent-life',
        realms: ['bios', 'chaos'],
        name: 'Vida Emergente',
        description: 'La vida emerge de reglas simples.',
        requiredSims: ['evolucion', 'game-of-life']
    },
    {
        id: 'artificial-mind',
        realms: ['psyche', 'machina'],
        name: 'Mente Artificial',
        description: 'El perceptrón imita a la neurona.',
        requiredSims: ['neurona', 'perceptron']
    },
    {
        id: 'transmutation',
        realms: ['alchemy', 'atomos'],
        name: 'Transmutación',
        description: 'Todo es transformación de energía.',
        requiredSims: ['termodinamica', 'colisiones']
    },
    {
        id: 'geological-time',
        realms: ['terra', 'logos'],
        name: 'Tiempo Geológico',
        description: 'Los estratos siguen patrones matemáticos.',
        requiredSims: ['estratigrafia', 'l-systems']
    }
];

class GameState {
    constructor() {
        this.state = this.getDefaultState();
        this.listeners = new Map();
        this.load();
    }

    getDefaultState() {
        return {
            eigenvalores: 0,
            completedSimulations: [],
            discoveredConnections: [],
            completedPaths: [],
            visitedRealms: ['aether'],
            unlockedRealms: ['aether', 'cosmos', 'chaos', 'logos'],
            currentRealm: 'aether',
            hasSeenIntro: false,
            playTime: 0,
            lastSaved: null
        };
    }

    // === EIGENVALORES ===

    getEigenvalores() {
        return this.state.eigenvalores;
    }

    addEigenvalor(amount = 1) {
        this.state.eigenvalores += amount;
        this.checkUnlocks();
        this.emit('eigenvalor-change', this.state.eigenvalores);
        this.save();
        return this.state.eigenvalores;
    }

    // === SIMULACIONES ===

    isSimulationCompleted(simId) {
        return this.state.completedSimulations.includes(simId);
    }

    completeSimulation(simId) {
        if (this.isSimulationCompleted(simId)) {
            return { newEigenvalor: false, newConnection: null };
        }

        this.state.completedSimulations.push(simId);
        this.addEigenvalor(1);

        // Verificar conexiones
        const newConnection = this.checkConnections(simId);

        this.emit('simulation-complete', { simId, newConnection });
        this.save();

        return { newEigenvalor: true, newConnection };
    }

    getCompletedCount(realm) {
        const realmSims = REALM_SIMULATIONS[realm] || [];
        return realmSims.filter(sim => this.isSimulationCompleted(sim)).length;
    }

    getTotalCount(realm) {
        return (REALM_SIMULATIONS[realm] || []).length;
    }

    getCompletedSimulations() {
        return new Set(this.state.completedSimulations);
    }

    getCompletedSimulationsList() {
        return [...this.state.completedSimulations];
    }

    // === REINOS ===

    isRealmUnlocked(realm) {
        return this.state.unlockedRealms.includes(realm);
    }

    isRealmVisited(realm) {
        return this.state.visitedRealms.includes(realm);
    }

    visitRealm(realm) {
        if (!this.state.visitedRealms.includes(realm)) {
            this.state.visitedRealms.push(realm);
            this.emit('realm-visited', realm);
            this.save();
        }
    }

    setCurrentRealm(realm) {
        this.state.currentRealm = realm;
        this.visitRealm(realm);
    }

    checkUnlocks() {
        let newUnlocks = [];

        Object.entries(UNLOCK_REQUIREMENTS).forEach(([realm, req]) => {
            if (!this.state.unlockedRealms.includes(realm)) {
                if (this.state.eigenvalores >= req.eigenvalores) {
                    this.state.unlockedRealms.push(realm);
                    newUnlocks.push(realm);
                }
            }
        });

        if (newUnlocks.length > 0) {
            this.emit('realms-unlocked', newUnlocks);
        }

        return newUnlocks;
    }

    getUnlockProgress(realm) {
        const req = UNLOCK_REQUIREMENTS[realm];
        if (!req) return { current: 0, required: 0, percentage: 100 };

        return {
            current: this.state.eigenvalores,
            required: req.eigenvalores,
            percentage: Math.min(100, Math.round((this.state.eigenvalores / req.eigenvalores) * 100))
        };
    }

    // === CONEXIONES ===

    checkConnections(completedSimId) {
        for (const conn of CONNECTIONS) {
            if (this.state.discoveredConnections.includes(conn.id)) continue;

            const allComplete = conn.requiredSims.every(sim =>
                this.state.completedSimulations.includes(sim)
            );

            if (allComplete) {
                this.state.discoveredConnections.push(conn.id);
                this.emit('connection-discovered', conn);
                return conn;
            }
        }
        return null;
    }

    getDiscoveredConnections() {
        return CONNECTIONS.filter(c => this.state.discoveredConnections.includes(c.id));
    }

    getAllConnections() {
        return CONNECTIONS.map(c => ({
            ...c,
            discovered: this.state.discoveredConnections.includes(c.id)
        }));
    }

    // === CAMINOS DE APRENDIZAJE ===

    completePath(pathId, reward) {
        if (this.state.completedPaths.includes(pathId)) return false;

        this.state.completedPaths.push(pathId);
        if (reward?.eigenvalores) {
            this.addEigenvalor(reward.eigenvalores);
        }
        this.emit('path-completed', { pathId, reward });
        this.save();
        return true;
    }

    isPathCompleted(pathId) {
        return this.state.completedPaths.includes(pathId);
    }

    getCompletedPaths() {
        return [...this.state.completedPaths];
    }

    // === PROGRESO GENERAL ===

    getProgress() {
        const totalSims = Object.values(REALM_SIMULATIONS).flat().length;
        const completedSims = this.state.completedSimulations.length;

        return {
            eigenvalores: this.state.eigenvalores,
            simulations: {
                completed: completedSims,
                total: totalSims,
                percentage: Math.round((completedSims / totalSims) * 100)
            },
            connections: {
                discovered: this.state.discoveredConnections.length,
                total: CONNECTIONS.length,
                percentage: Math.round((this.state.discoveredConnections.length / CONNECTIONS.length) * 100)
            },
            realms: {
                unlocked: this.state.unlockedRealms.length,
                visited: this.state.visitedRealms.length,
                total: Object.keys(UNLOCK_REQUIREMENTS).length
            }
        };
    }

    // === INTRO ===

    markIntroSeen() {
        this.state.hasSeenIntro = true;
        this.save();
    }

    hasSeenIntro() {
        return this.state.hasSeenIntro;
    }

    // === PERSISTENCIA ===

    save() {
        try {
            this.state.lastSaved = Date.now();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
            this.emit('game-saved');
        } catch (e) {
            console.warn('Could not save game state:', e);
        }
    }

    load() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                this.state = { ...this.getDefaultState(), ...parsed };
                this.emit('game-loaded');
                return true;
            }
        } catch (e) {
            console.warn('Could not load game state:', e);
        }
        return false;
    }

    reset() {
        this.state = this.getDefaultState();
        localStorage.removeItem(STORAGE_KEY);
        this.emit('game-reset');
    }

    hasSaveData() {
        return localStorage.getItem(STORAGE_KEY) !== null;
    }

    // === EVENTOS ===

    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    off(event, callback) {
        if (this.listeners.has(event)) {
            const callbacks = this.listeners.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) callbacks.splice(index, 1);
        }
    }

    emit(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(cb => cb(data));
        }
    }
}

// Singleton
export const gameState = new GameState();
export default gameState;
