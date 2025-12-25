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
import { CONNECTIONS } from '../data/graphConnections.js';

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
            lastSaved: null,
            // M2: Sistema de exploración
            seenFragments: [],      // Fragmentos del Constructo vistos
            exploredSimulations: [], // Simulaciones exploradas (no puzzles)
            resonance: 100,          // Salud de la Lira (100% base)
            unlockedConnections: []  // Conexiones del grafo desbloqueadas
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

    // === M2: FRAGMENTOS DEL CONSTRUCTO ===

    hasSeenFragment(simId) {
        return this.state.seenFragments.includes(simId);
    }

    markFragmentSeen(simId) {
        if (!this.hasSeenFragment(simId)) {
            this.state.seenFragments.push(simId);
            this.emit('fragment-seen', simId);
            this.save();
            return true;
        }
        return false;
    }

    getSeenFragmentsCount() {
        return this.state.seenFragments.length;
    }

    // === M2: EXPLORACIONES ===

    hasExploredSimulation(simId) {
        return this.state.exploredSimulations.includes(simId);
    }

    exploreSimulation(simId) {
        if (this.hasExploredSimulation(simId)) {
            return { isNew: false, resonanceGained: 0, connectionUnlocked: null };
        }

        this.state.exploredSimulations.push(simId);

        // Añadir resonancia (+5%)
        const resonanceGained = 5;
        this.addResonance(resonanceGained);

        // Verificar conexiones desbloqueadas
        const connectionUnlocked = this.checkExplorationConnections(simId);

        this.emit('exploration-complete', {
            simId,
            resonanceGained,
            connectionUnlocked
        });
        this.save();

        return {
            isNew: true,
            resonanceGained,
            connectionUnlocked
        };
    }

    getExploredCount() {
        return this.state.exploredSimulations.length;
    }

    getExploredSimulations() {
        return [...this.state.exploredSimulations];
    }

    // === M2: RESONANCIA (SALUD DE LA LIRA) ===

    getResonance() {
        return this.state.resonance;
    }

    addResonance(amount) {
        const maxResonance = 100 + (this.state.exploredSimulations.length * 5);
        this.state.resonance = Math.min(maxResonance, this.state.resonance + amount);
        this.emit('resonance-change', {
            current: this.state.resonance,
            max: maxResonance,
            gained: amount
        });
        this.save();
        return this.state.resonance;
    }

    getMaxResonance() {
        // Base 100% + 5% por cada exploración completada
        return 100 + (this.state.exploredSimulations.length * 5);
    }

    getResonancePercentage() {
        const max = this.getMaxResonance();
        return Math.round((this.state.resonance / max) * 100);
    }

    // === M2: CONEXIONES DEL GRAFO ===

    checkExplorationConnections(completedSimId) {
        // Verificar si completar esta exploración desbloquea una conexión
        for (const conn of CONNECTIONS) {
            if (this.state.unlockedConnections.includes(conn.id)) continue;

            // Una conexión se desbloquea cuando se han explorado ambas simulaciones requeridas
            const allExplored = conn.requiredSims.every(sim =>
                this.state.exploredSimulations.includes(sim) ||
                this.state.completedSimulations.includes(sim)
            );

            if (allExplored) {
                this.state.unlockedConnections.push(conn.id);
                this.emit('graph-connection-unlocked', conn);
                return conn;
            }
        }
        return null;
    }

    isConnectionUnlocked(connId) {
        return this.state.unlockedConnections.includes(connId);
    }

    getUnlockedConnections() {
        return CONNECTIONS.filter(c => this.state.unlockedConnections.includes(c.id));
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
