/**
 * PerformanceMonitor - M7.4 Sistema de monitoreo de rendimiento
 *
 * Herramientas para medir y optimizar el rendimiento del juego.
 */

class PerformanceMonitor {
    constructor() {
        this.fps = 60;
        this.frameTime = 0;
        this.frames = 0;
        this.lastTime = 0;
        this.deltaHistory = [];
        this.maxHistoryLength = 60;
        this.enabled = false;
        this.overlay = null;

        // Thresholds
        this.FPS_WARNING = 30;
        this.FPS_CRITICAL = 15;
    }

    /**
     * Inicia el monitoreo
     */
    start() {
        this.enabled = true;
        this.lastTime = performance.now();
        this.requestUpdate();
    }

    /**
     * Detiene el monitoreo
     */
    stop() {
        this.enabled = false;
    }

    /**
     * Actualiza métricas cada frame
     */
    requestUpdate() {
        if (!this.enabled) return;

        requestAnimationFrame(() => {
            this.update();
            this.requestUpdate();
        });
    }

    update() {
        const now = performance.now();
        const delta = now - this.lastTime;
        this.lastTime = now;

        // Actualizar historial de deltas
        this.deltaHistory.push(delta);
        if (this.deltaHistory.length > this.maxHistoryLength) {
            this.deltaHistory.shift();
        }

        // Calcular FPS promedio
        const avgDelta = this.deltaHistory.reduce((a, b) => a + b, 0) / this.deltaHistory.length;
        this.fps = Math.round(1000 / avgDelta);
        this.frameTime = avgDelta;

        this.frames++;
    }

    /**
     * Obtiene el FPS actual
     */
    getFPS() {
        return this.fps;
    }

    /**
     * Obtiene el tiempo de frame promedio en ms
     */
    getFrameTime() {
        return Math.round(this.frameTime * 100) / 100;
    }

    /**
     * Obtiene estado de rendimiento
     */
    getStatus() {
        if (this.fps >= 55) return 'good';
        if (this.fps >= this.FPS_WARNING) return 'warning';
        return 'critical';
    }

    /**
     * Crea overlay de debug en una escena de Phaser
     */
    createOverlay(scene) {
        if (this.overlay) this.destroyOverlay();

        this.overlay = {
            container: scene.add.container(10, 10).setDepth(9999).setScrollFactor(0),
            fpsText: null,
            frameTimeText: null,
            scene: scene
        };

        // Fondo
        const bg = scene.add.rectangle(0, 0, 120, 50, 0x000000, 0.7).setOrigin(0);
        this.overlay.container.add(bg);

        // Texto FPS
        this.overlay.fpsText = scene.add.text(10, 5, 'FPS: 60', {
            fontFamily: 'monospace',
            fontSize: '12px',
            color: '#22c55e'
        });
        this.overlay.container.add(this.overlay.fpsText);

        // Texto Frame Time
        this.overlay.frameTimeText = scene.add.text(10, 22, 'Frame: 16.67ms', {
            fontFamily: 'monospace',
            fontSize: '11px',
            color: '#94a3b8'
        });
        this.overlay.container.add(this.overlay.frameTimeText);

        // Actualizar cada frame
        scene.events.on('update', this.updateOverlay, this);
        scene.events.on('shutdown', this.destroyOverlay, this);
    }

    updateOverlay() {
        if (!this.overlay) return;

        const status = this.getStatus();
        const color = status === 'good' ? '#22c55e' :
                      status === 'warning' ? '#fbbf24' : '#ef4444';

        this.overlay.fpsText.setText(`FPS: ${this.fps}`);
        this.overlay.fpsText.setColor(color);
        this.overlay.frameTimeText.setText(`Frame: ${this.getFrameTime()}ms`);
    }

    destroyOverlay() {
        if (this.overlay) {
            if (this.overlay.scene) {
                this.overlay.scene.events.off('update', this.updateOverlay, this);
                this.overlay.scene.events.off('shutdown', this.destroyOverlay, this);
            }
            this.overlay.container.destroy();
            this.overlay = null;
        }
    }

    /**
     * Mide el tiempo de ejecución de una función
     */
    measure(name, fn) {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        console.log(`[Perf] ${name}: ${(end - start).toFixed(2)}ms`);
        return result;
    }

    /**
     * Crea un profiler para medir múltiples operaciones
     */
    createProfiler(name) {
        const timings = {};
        let startTime = 0;

        return {
            start: (label) => {
                startTime = performance.now();
            },
            end: (label) => {
                timings[label] = (timings[label] || 0) + (performance.now() - startTime);
            },
            report: () => {
                console.log(`\n[Profiler: ${name}]`);
                Object.entries(timings)
                    .sort((a, b) => b[1] - a[1])
                    .forEach(([label, time]) => {
                        console.log(`  ${label}: ${time.toFixed(2)}ms`);
                    });
            }
        };
    }
}

// Singleton
const performanceMonitor = new PerformanceMonitor();
export default performanceMonitor;

// Utilidades de optimización
export const OptimizationUtils = {
    /**
     * Debounce para limitar llamadas frecuentes
     */
    debounce(fn, delay) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn(...args), delay);
        };
    },

    /**
     * Throttle para limitar frecuencia de llamadas
     */
    throttle(fn, limit) {
        let lastCall = 0;
        return (...args) => {
            const now = Date.now();
            if (now - lastCall >= limit) {
                lastCall = now;
                return fn(...args);
            }
        };
    },

    /**
     * Pool de objetos para evitar garbage collection
     */
    createPool(factory, initialSize = 10) {
        const pool = [];
        const inUse = new Set();

        // Pre-crear objetos
        for (let i = 0; i < initialSize; i++) {
            pool.push(factory());
        }

        return {
            acquire() {
                let obj = pool.pop();
                if (!obj) {
                    obj = factory();
                }
                inUse.add(obj);
                return obj;
            },
            release(obj) {
                if (inUse.has(obj)) {
                    inUse.delete(obj);
                    pool.push(obj);
                }
            },
            size() {
                return pool.length;
            },
            inUse() {
                return inUse.size;
            }
        };
    },

    /**
     * Limita updates de UI a 30fps
     */
    createUILimiter() {
        let lastUpdate = 0;
        const minInterval = 1000 / 30; // 30 FPS

        return (callback) => {
            const now = performance.now();
            if (now - lastUpdate >= minInterval) {
                lastUpdate = now;
                callback();
            }
        };
    }
};
