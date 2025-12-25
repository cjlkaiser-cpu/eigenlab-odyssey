/**
 * AccessibilityManager - M7.3 Sistema de accesibilidad
 *
 * Opciones para mejorar la experiencia de todos los jugadores.
 */

// Configuración por defecto
const DEFAULT_SETTINGS = {
    // Visual
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    colorblindMode: 'none', // 'none', 'protanopia', 'deuteranopia', 'tritanopia'

    // Audio
    subtitles: true,
    soundEffects: true,
    music: true,
    masterVolume: 0.5,

    // Controles
    keyboardOnly: false,
    autoAdvanceDialog: false,
    dialogSpeed: 30, // ms por caracter

    // Gameplay
    skipTutorial: false,
    showHints: true
};

class AccessibilityManager {
    constructor() {
        this.settings = this.loadSettings();
        this.listeners = new Map();
    }

    /**
     * Carga configuración desde localStorage
     */
    loadSettings() {
        try {
            const saved = localStorage.getItem('eigenlab-accessibility');
            return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : { ...DEFAULT_SETTINGS };
        } catch (e) {
            return { ...DEFAULT_SETTINGS };
        }
    }

    /**
     * Guarda configuración
     */
    saveSettings() {
        try {
            localStorage.setItem('eigenlab-accessibility', JSON.stringify(this.settings));
        } catch (e) {
            console.warn('No se pudo guardar configuración de accesibilidad');
        }
    }

    /**
     * Obtiene un valor de configuración
     */
    get(key) {
        return this.settings[key];
    }

    /**
     * Establece un valor de configuración
     */
    set(key, value) {
        if (key in DEFAULT_SETTINGS) {
            this.settings[key] = value;
            this.saveSettings();
            this.emit(key, value);
        }
    }

    /**
     * Alterna un valor booleano
     */
    toggle(key) {
        if (typeof this.settings[key] === 'boolean') {
            this.set(key, !this.settings[key]);
            return this.settings[key];
        }
        return null;
    }

    /**
     * Resetea a valores por defecto
     */
    reset() {
        this.settings = { ...DEFAULT_SETTINGS };
        this.saveSettings();
        Object.keys(this.settings).forEach(key => {
            this.emit(key, this.settings[key]);
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // EVENT SYSTEM
    // ═══════════════════════════════════════════════════════════════

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
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    emit(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => callback(data));
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // HELPERS DE ACCESIBILIDAD
    // ═══════════════════════════════════════════════════════════════

    /**
     * Obtiene el tamaño de fuente ajustado
     */
    getFontSize(baseSize) {
        return this.settings.largeText ? Math.floor(baseSize * 1.3) : baseSize;
    }

    /**
     * Obtiene la velocidad del diálogo
     */
    getDialogSpeed() {
        return this.settings.dialogSpeed;
    }

    /**
     * Verifica si debe reducir movimiento
     */
    shouldReduceMotion() {
        // También respeta preferencia del sistema
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        return this.settings.reducedMotion || prefersReducedMotion;
    }

    /**
     * Aplica transformación de color para daltonismo
     */
    transformColor(color, mode = null) {
        const colorMode = mode || this.settings.colorblindMode;
        if (colorMode === 'none') return color;

        // Matrices de simulación de daltonismo
        const matrices = {
            protanopia: [
                0.567, 0.433, 0,
                0.558, 0.442, 0,
                0, 0.242, 0.758
            ],
            deuteranopia: [
                0.625, 0.375, 0,
                0.7, 0.3, 0,
                0, 0.3, 0.7
            ],
            tritanopia: [
                0.95, 0.05, 0,
                0, 0.433, 0.567,
                0, 0.475, 0.525
            ]
        };

        const matrix = matrices[colorMode];
        if (!matrix) return color;

        // Extraer RGB
        const r = (color >> 16) & 0xff;
        const g = (color >> 8) & 0xff;
        const b = color & 0xff;

        // Aplicar matriz
        const newR = Math.min(255, Math.max(0, Math.round(matrix[0] * r + matrix[1] * g + matrix[2] * b)));
        const newG = Math.min(255, Math.max(0, Math.round(matrix[3] * r + matrix[4] * g + matrix[5] * b)));
        const newB = Math.min(255, Math.max(0, Math.round(matrix[6] * r + matrix[7] * g + matrix[8] * b)));

        return (newR << 16) | (newG << 8) | newB;
    }

    /**
     * Obtiene colores de alto contraste
     */
    getHighContrastColors() {
        if (!this.settings.highContrast) return null;

        return {
            background: 0x000000,
            text: 0xffffff,
            accent: 0xffff00,
            success: 0x00ff00,
            error: 0xff0000,
            warning: 0xffaa00
        };
    }

    /**
     * Genera descripción textual para lectores de pantalla
     */
    getScreenReaderText(element, context) {
        const descriptions = {
            portal: (realm) => `Portal al reino de ${realm}. Presiona E para entrar.`,
            simulation: (name) => `Simulación: ${name}. Presiona Enter para explorar.`,
            eigenvalor: (count) => `${count} de 12 eigenvalores obtenidos.`,
            resonance: (value) => `Resonancia actual: ${value}%.`,
            lira: (strings) => `Lira con ${strings} cuerdas activas.`
        };

        const descFn = descriptions[element];
        return descFn ? descFn(context) : '';
    }
}

// Singleton
const accessibilityManager = new AccessibilityManager();
export default accessibilityManager;
