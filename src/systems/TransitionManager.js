/**
 * TransitionManager - M7.2 Sistema de transiciones visuales
 *
 * Maneja transiciones suaves entre escenas con efectos visuales.
 */

import Phaser from 'phaser';
import { REALM_COLORS, UI_COLORS } from '../core/constants.js';
import synthAudio from '../audio/SynthAudio.js';

export default class TransitionManager {
    constructor(scene) {
        this.scene = scene;
        this.overlay = null;
        this.wipeGraphics = null;
    }

    /**
     * Transición de fade estándar
     */
    fadeOut(duration = 500, color = 0x000000) {
        return new Promise(resolve => {
            synthAudio.playTransition(false);
            this.scene.cameras.main.fadeOut(duration,
                (color >> 16) & 0xff,
                (color >> 8) & 0xff,
                color & 0xff
            );
            this.scene.cameras.main.once('camerafadeoutcomplete', resolve);
        });
    }

    fadeIn(duration = 500, color = 0x000000) {
        return new Promise(resolve => {
            this.scene.cameras.main.fadeIn(duration,
                (color >> 16) & 0xff,
                (color >> 8) & 0xff,
                color & 0xff
            );
            this.scene.cameras.main.once('camerafadeincomplete', resolve);
        });
    }

    /**
     * Transición tipo "wipe" horizontal
     */
    wipeOut(duration = 600, fromRight = false) {
        return new Promise(resolve => {
            const { width, height } = this.scene.cameras.main;

            synthAudio.playTransition(false);

            this.wipeGraphics = this.scene.add.graphics();
            this.wipeGraphics.setDepth(2000);
            this.wipeGraphics.setScrollFactor(0);

            const startX = fromRight ? width : -width;
            const targetX = 0;

            let progress = 0;
            const wipeUpdate = () => {
                progress += 16 / duration;
                if (progress > 1) progress = 1;

                const easedProgress = this.easeInOutCubic(progress);
                const currentX = startX + (targetX - startX) * easedProgress;

                this.wipeGraphics.clear();
                this.wipeGraphics.fillStyle(UI_COLORS.background, 1);
                this.wipeGraphics.fillRect(currentX, 0, width, height);

                if (progress < 1) {
                    this.scene.time.delayedCall(16, wipeUpdate);
                } else {
                    resolve();
                }
            };

            wipeUpdate();
        });
    }

    wipeIn(duration = 600, toRight = true) {
        return new Promise(resolve => {
            if (!this.wipeGraphics) {
                resolve();
                return;
            }

            const { width, height } = this.scene.cameras.main;
            const startX = 0;
            const targetX = toRight ? width : -width;

            let progress = 0;
            const wipeUpdate = () => {
                progress += 16 / duration;
                if (progress > 1) progress = 1;

                const easedProgress = this.easeInOutCubic(progress);
                const currentX = startX + (targetX - startX) * easedProgress;

                this.wipeGraphics.clear();
                this.wipeGraphics.fillStyle(UI_COLORS.background, 1);
                this.wipeGraphics.fillRect(currentX, 0, width, height);

                if (progress < 1) {
                    this.scene.time.delayedCall(16, wipeUpdate);
                } else {
                    this.wipeGraphics.destroy();
                    this.wipeGraphics = null;
                    resolve();
                }
            };

            wipeUpdate();
        });
    }

    /**
     * Transición tipo "iris" (círculo expandiendo/contrayendo)
     */
    irisOut(duration = 800, focusX = null, focusY = null) {
        return new Promise(resolve => {
            const { width, height } = this.scene.cameras.main;
            const centerX = focusX ?? width / 2;
            const centerY = focusY ?? height / 2;
            const maxRadius = Math.sqrt(width * width + height * height);

            synthAudio.playTransition(false);

            this.irisGraphics = this.scene.add.graphics();
            this.irisGraphics.setDepth(2000);
            this.irisGraphics.setScrollFactor(0);

            let progress = 0;
            const irisUpdate = () => {
                progress += 16 / duration;
                if (progress > 1) progress = 1;

                const easedProgress = this.easeInOutCubic(progress);
                const radius = maxRadius * (1 - easedProgress);

                this.irisGraphics.clear();

                // Dibujar todo negro excepto el círculo
                this.irisGraphics.fillStyle(UI_COLORS.background, 1);
                this.irisGraphics.fillRect(0, 0, width, height);

                if (radius > 0) {
                    // "Recortar" el círculo usando blend
                    this.irisGraphics.fillStyle(0x000000, 0);
                    this.irisGraphics.beginPath();
                    this.irisGraphics.arc(centerX, centerY, radius, 0, Math.PI * 2);
                    this.irisGraphics.closePath();
                    // En Phaser necesitamos otro enfoque: usar un mask o stencil
                    // Por ahora, simplemente hacemos fade
                    this.irisGraphics.clear();
                    this.irisGraphics.fillStyle(UI_COLORS.background, easedProgress);
                    this.irisGraphics.fillRect(0, 0, width, height);
                }

                if (progress < 1) {
                    this.scene.time.delayedCall(16, irisUpdate);
                } else {
                    resolve();
                }
            };

            irisUpdate();
        });
    }

    /**
     * Transición específica para portales de reino
     */
    realmTransition(realm, duration = 800) {
        return new Promise(resolve => {
            const { width, height } = this.scene.cameras.main;
            const color = REALM_COLORS[realm]?.primary || REALM_COLORS.aether.primary;

            synthAudio.playPortal();

            // Crear overlay con color del reino
            this.overlay = this.scene.add.graphics();
            this.overlay.setDepth(2000);
            this.overlay.setScrollFactor(0);

            // Partículas del color del reino
            this.createPortalParticles(color, width / 2, height / 2);

            let progress = 0;
            const transitionUpdate = () => {
                progress += 16 / duration;
                if (progress > 1) progress = 1;

                const easedProgress = this.easeInOutCubic(progress);

                this.overlay.clear();

                // Anillos concéntricos expandiendo
                const numRings = 5;
                for (let i = 0; i < numRings; i++) {
                    const ringProgress = Math.max(0, Math.min(1, (easedProgress - i * 0.1) / 0.6));
                    const maxRadius = Math.sqrt(width * width + height * height);
                    const radius = maxRadius * ringProgress;
                    const alpha = 0.3 - i * 0.05;

                    this.overlay.fillStyle(color, alpha * (1 - easedProgress * 0.5));
                    this.overlay.fillCircle(width / 2, height / 2, radius);
                }

                // Fade a negro al final
                if (easedProgress > 0.6) {
                    const fadeProgress = (easedProgress - 0.6) / 0.4;
                    this.overlay.fillStyle(UI_COLORS.background, fadeProgress);
                    this.overlay.fillRect(0, 0, width, height);
                }

                if (progress < 1) {
                    this.scene.time.delayedCall(16, transitionUpdate);
                } else {
                    resolve();
                }
            };

            transitionUpdate();
        });
    }

    /**
     * Crea partículas de transición
     */
    createPortalParticles(color, x, y) {
        if (!this.scene.textures.exists('particle')) return;

        const particles = this.scene.add.particles(x, y, 'particle', {
            speed: { min: 100, max: 300 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.5, end: 0 },
            alpha: { start: 0.8, end: 0 },
            lifespan: 800,
            frequency: 20,
            quantity: 3,
            tint: color,
            blendMode: 'ADD'
        });

        particles.setDepth(2001);
        particles.setScrollFactor(0);

        this.scene.time.delayedCall(800, () => {
            particles.stop();
            this.scene.time.delayedCall(1000, () => particles.destroy());
        });
    }

    /**
     * Limpia recursos de transición
     */
    cleanup() {
        if (this.overlay) {
            this.overlay.destroy();
            this.overlay = null;
        }
        if (this.wipeGraphics) {
            this.wipeGraphics.destroy();
            this.wipeGraphics = null;
        }
        if (this.irisGraphics) {
            this.irisGraphics.destroy();
            this.irisGraphics = null;
        }
    }

    // Funciones de easing
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    easeOutBack(t) {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    }

    easeOutElastic(t) {
        if (t === 0 || t === 1) return t;
        return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI) / 3) + 1;
    }
}
