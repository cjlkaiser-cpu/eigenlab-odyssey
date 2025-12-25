/**
 * ParticleEffects - M7.2 Sistema de efectos de partículas
 *
 * Efectos visuales ambientales y de feedback para el juego.
 */

import Phaser from 'phaser';
import { REALM_COLORS } from '../core/constants.js';

export default class ParticleEffects {
    constructor(scene) {
        this.scene = scene;
        this.emitters = new Map();
    }

    /**
     * Partículas ambientales flotantes para un reino
     */
    createAmbientParticles(realm, density = 'medium') {
        const { width, height } = this.scene.cameras.main;
        const color = REALM_COLORS[realm]?.primary || REALM_COLORS.aether.primary;
        const color2 = REALM_COLORS[realm]?.secondary || color;

        const densityConfig = {
            low: { frequency: 400, quantity: 1, alpha: 0.3 },
            medium: { frequency: 200, quantity: 1, alpha: 0.4 },
            high: { frequency: 100, quantity: 2, alpha: 0.5 }
        };

        const config = densityConfig[density] || densityConfig.medium;

        if (!this.scene.textures.exists('particle')) {
            // Crear textura de partícula si no existe
            this.createParticleTexture();
        }

        const emitter = this.scene.add.particles(0, 0, 'particle', {
            x: { min: 0, max: width },
            y: { min: 0, max: height },
            scale: { start: 0.3, end: 0 },
            alpha: { start: config.alpha, end: 0 },
            speed: { min: 10, max: 40 },
            angle: { min: 0, max: 360 },
            lifespan: 4000,
            frequency: config.frequency,
            quantity: config.quantity,
            tint: [color, color2, 0xffffff],
            blendMode: 'ADD'
        });

        emitter.setDepth(-1);
        this.emitters.set(`ambient-${realm}`, emitter);

        return emitter;
    }

    /**
     * Efecto de brillo para eigenvalor obtenido
     */
    eigenvalorBurst(x, y) {
        const { width, height } = this.scene.cameras.main;

        if (!this.scene.textures.exists('particle')) {
            this.createParticleTexture();
        }

        // Explosión de partículas doradas
        const burst = this.scene.add.particles(x, y, 'particle', {
            speed: { min: 100, max: 300 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.8, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 1000,
            frequency: -1, // Burst mode
            quantity: 30,
            tint: [0xfbbf24, 0xfde68a, 0xffffff],
            blendMode: 'ADD'
        });

        burst.setDepth(1000);
        burst.explode();

        // Anillos expandiendo
        this.createRingEffect(x, y, 0xfbbf24, 3);

        this.scene.time.delayedCall(1500, () => burst.destroy());
    }

    /**
     * Efecto de resonancia ganada
     */
    resonanceEffect(x, y) {
        if (!this.scene.textures.exists('particle')) {
            this.createParticleTexture();
        }

        const particles = this.scene.add.particles(x, y, 'particle', {
            speed: { min: 50, max: 150 },
            angle: { min: -45, max: -135 }, // Hacia arriba
            scale: { start: 0.5, end: 0 },
            alpha: { start: 0.8, end: 0 },
            lifespan: 800,
            frequency: -1,
            quantity: 15,
            tint: [0x22c55e, 0x4ade80],
            blendMode: 'ADD'
        });

        particles.setDepth(100);
        particles.explode();

        this.scene.time.delayedCall(1000, () => particles.destroy());
    }

    /**
     * Efecto de portal activado
     */
    portalActivation(x, y, realm) {
        const color = REALM_COLORS[realm]?.primary || 0xa855f7;

        if (!this.scene.textures.exists('particle')) {
            this.createParticleTexture();
        }

        // Vórtice de partículas
        const vortex = this.scene.add.particles(x, y, 'particle', {
            speed: { min: 20, max: 80 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.4, end: 0 },
            alpha: { start: 0.6, end: 0 },
            lifespan: 1500,
            frequency: 30,
            quantity: 2,
            tint: color,
            blendMode: 'ADD',
            // Movimiento espiral
            radial: true,
            gravityY: -50
        });

        vortex.setDepth(10);
        this.emitters.set(`portal-${realm}`, vortex);

        return vortex;
    }

    /**
     * Efecto de conexión del grafo
     */
    connectionEffect(x1, y1, x2, y2, color1, color2) {
        if (!this.scene.textures.exists('particle')) {
            this.createParticleTexture();
        }

        // Partículas viajando entre dos puntos
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;

        const particles = this.scene.add.particles(midX, midY, 'particle', {
            speed: { min: 30, max: 80 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.3, end: 0 },
            alpha: { start: 0.7, end: 0 },
            lifespan: 600,
            frequency: -1,
            quantity: 10,
            tint: [color1, color2],
            blendMode: 'ADD'
        });

        particles.setDepth(50);
        particles.explode();

        this.scene.time.delayedCall(800, () => particles.destroy());
    }

    /**
     * Efecto de anillos expandiendo
     */
    createRingEffect(x, y, color, count = 3) {
        for (let i = 0; i < count; i++) {
            const ring = this.scene.add.circle(x, y, 10, color, 0);
            ring.setStrokeStyle(2, color, 0.8);
            ring.setDepth(999);

            this.scene.tweens.add({
                targets: ring,
                radius: 100 + i * 30,
                alpha: 0,
                duration: 800,
                delay: i * 150,
                ease: 'Power2',
                onUpdate: (tween) => {
                    const value = tween.getValue();
                    ring.setStrokeStyle(2, color, 0.8 * (1 - value / (100 + i * 30)));
                },
                onComplete: () => ring.destroy()
            });
        }
    }

    /**
     * Partículas de hover sobre elementos interactivos
     */
    hoverSparkle(x, y, color = 0xffffff) {
        if (!this.scene.textures.exists('particle')) {
            this.createParticleTexture();
        }

        const sparkle = this.scene.add.particles(x, y, 'particle', {
            speed: { min: 10, max: 30 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.2, end: 0 },
            alpha: { start: 0.5, end: 0 },
            lifespan: 400,
            frequency: -1,
            quantity: 5,
            tint: color,
            blendMode: 'ADD'
        });

        sparkle.setDepth(100);
        sparkle.explode();

        this.scene.time.delayedCall(500, () => sparkle.destroy());
    }

    /**
     * Efecto de glitch visual
     */
    glitchEffect(duration = 300) {
        const { width, height } = this.scene.cameras.main;

        // Crear líneas de glitch
        const glitchGraphics = this.scene.add.graphics();
        glitchGraphics.setDepth(3000);
        glitchGraphics.setScrollFactor(0);

        let elapsed = 0;
        const glitchUpdate = () => {
            elapsed += 16;
            if (elapsed > duration) {
                glitchGraphics.destroy();
                return;
            }

            glitchGraphics.clear();

            // Líneas horizontales aleatorias
            for (let i = 0; i < 5; i++) {
                if (Math.random() > 0.5) {
                    const y = Math.random() * height;
                    const h = 2 + Math.random() * 8;
                    const offset = (Math.random() - 0.5) * 20;

                    glitchGraphics.fillStyle(0xff0000, 0.3);
                    glitchGraphics.fillRect(offset, y, width, h);

                    glitchGraphics.fillStyle(0x00ffff, 0.3);
                    glitchGraphics.fillRect(-offset, y + 2, width, h);
                }
            }

            this.scene.time.delayedCall(16, glitchUpdate);
        };

        glitchUpdate();
    }

    /**
     * Crear textura de partícula si no existe
     */
    createParticleTexture() {
        if (this.scene.textures.exists('particle')) return;

        const graphics = this.scene.add.graphics();
        graphics.fillStyle(0xffffff, 1);
        graphics.fillCircle(8, 8, 8);
        graphics.generateTexture('particle', 16, 16);
        graphics.destroy();
    }

    /**
     * Detiene todos los emitters
     */
    stopAll() {
        this.emitters.forEach(emitter => {
            emitter.stop();
        });
    }

    /**
     * Limpia todos los emitters
     */
    destroy() {
        this.emitters.forEach(emitter => {
            emitter.destroy();
        });
        this.emitters.clear();
    }
}
