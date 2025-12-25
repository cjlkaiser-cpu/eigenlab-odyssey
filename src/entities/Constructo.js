/**
 * Constructo - El Compañero Esférico
 *
 * Una entidad enigmática que sirve de guía al Resonador.
 * Normalmente aparece sereno, pero glitchea cerca de la corrupción.
 * Sigue al jugador con un movimiento suave y flotante.
 */

import Phaser from 'phaser';
import { REALM_COLORS } from '../core/constants.js';

export default class Constructo extends Phaser.GameObjects.Container {
    constructor(scene, target, options = {}) {
        // Posición inicial cerca del target
        const startX = target.x + 50;
        const startY = target.y - 30;

        super(scene, startX, startY);

        this.scene = scene;
        this.target = target; // El Resonador que debe seguir
        this.isGlitched = false;

        // Configuración
        this.config = {
            followDistance: options.followDistance || 60, // Distancia al jugador
            followSpeed: options.followSpeed || 0.04, // Velocidad de seguimiento (lerp)
            bobAmplitude: options.bobAmplitude || 8, // Amplitud de flotación
            bobSpeed: options.bobSpeed || 0.003, // Velocidad de flotación
            glowIntensity: options.glowIntensity || 0.3,
            scale: options.scale || 0.08 // Escala del sprite (son grandes)
        };

        // Estado interno
        this.bobPhase = Math.random() * Math.PI * 2; // Fase aleatoria inicial
        this.targetX = startX;
        this.targetY = startY;
        this.baseY = startY;

        // Crear sprites
        this.createSprites();

        // Crear glow
        this.createGlow();

        // Crear partículas sutiles
        this.createParticles();

        // Agregar a la escena
        scene.add.existing(this);
        this.setDepth(95); // Justo debajo del Resonador
    }

    createSprites() {
        // Sprite normal
        const normalTexture = this.scene.textures.exists('construct-normal')
            ? 'construct-normal'
            : 'particle';

        this.normalSprite = this.scene.add.image(0, 0, normalTexture);
        this.normalSprite.setScale(this.config.scale);
        this.add(this.normalSprite);

        // Sprite glitched
        const glitchTexture = this.scene.textures.exists('construct-glitch')
            ? 'construct-glitch'
            : 'particle';

        this.glitchSprite = this.scene.add.image(0, 0, glitchTexture);
        this.glitchSprite.setScale(this.config.scale);
        this.glitchSprite.setVisible(false);
        this.add(this.glitchSprite);

        this.currentSprite = this.normalSprite;
    }

    createGlow() {
        // Glow suave alrededor del Constructo
        this.glow = this.scene.add.graphics();
        this.add(this.glow);
        this.sendToBack(this.glow);
        this.updateGlow();
    }

    updateGlow() {
        this.glow.clear();

        const color = this.isGlitched
            ? REALM_COLORS.chaos.primary
            : REALM_COLORS.aether.primary;

        const alpha = this.config.glowIntensity;
        const size = 25;

        // Glow en capas
        for (let i = 3; i > 0; i--) {
            this.glow.fillStyle(color, alpha * (i / 3) * 0.3);
            this.glow.fillCircle(0, 0, size * (i / 3));
        }
    }

    createParticles() {
        // Partículas sutiles que emanan del Constructo
        if (!this.scene.textures.exists('particle')) return;

        this.particles = this.scene.add.particles(0, 0, 'particle', {
            follow: this,
            scale: { start: 0.2, end: 0 },
            alpha: { start: 0.2, end: 0 },
            speed: { min: 5, max: 15 },
            angle: { min: 0, max: 360 },
            lifespan: 600,
            frequency: 150,
            tint: REALM_COLORS.aether.secondary,
            blendMode: 'ADD'
        });
    }

    setGlitched(glitched) {
        if (this.isGlitched === glitched) return;

        this.isGlitched = glitched;

        // Cambiar sprite
        this.normalSprite.setVisible(!glitched);
        this.glitchSprite.setVisible(glitched);
        this.currentSprite = glitched ? this.glitchSprite : this.normalSprite;

        // Actualizar glow
        this.updateGlow();

        // Cambiar color de partículas
        if (this.particles) {
            this.particles.setParticleTint(
                glitched ? REALM_COLORS.chaos.primary : REALM_COLORS.aether.secondary
            );
        }

        // Efecto de transición
        if (glitched) {
            this.startGlitchEffect();
        } else {
            this.stopGlitchEffect();
        }
    }

    startGlitchEffect() {
        // Efecto de temblor cuando está glitcheado
        this.glitchTween = this.scene.tweens.add({
            targets: this.currentSprite,
            x: { from: -2, to: 2 },
            duration: 50,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    stopGlitchEffect() {
        if (this.glitchTween) {
            this.glitchTween.destroy();
            this.glitchTween = null;
            this.currentSprite.x = 0;
        }
    }

    update(time) {
        if (!this.target) return;

        // Calcular posición objetivo (offset del jugador)
        // El Constructo se posiciona ligeramente arriba y a la derecha
        const offsetX = 50;
        const offsetY = -30;

        this.targetX = this.target.x + offsetX;
        this.targetY = this.target.y + offsetY;

        // Seguimiento suave (lerp)
        this.x = Phaser.Math.Linear(this.x, this.targetX, this.config.followSpeed);
        this.baseY = Phaser.Math.Linear(this.baseY, this.targetY, this.config.followSpeed);

        // Animación de flotación (bobbing)
        this.bobPhase += this.config.bobSpeed * (time - (this.lastTime || time));
        this.lastTime = time;

        const bobOffset = Math.sin(this.bobPhase) * this.config.bobAmplitude;
        this.y = this.baseY + bobOffset;

        // Rotación sutil sincronizada con el bobbing
        const rotation = Math.sin(this.bobPhase * 0.5) * 0.05;
        this.currentSprite.setRotation(rotation);

        // Escala pulsante sutil
        const pulseScale = 1 + Math.sin(this.bobPhase * 2) * 0.02;
        this.currentSprite.setScale(this.config.scale * pulseScale);
    }

    /**
     * Hace que el Constructo diga algo (trigger de diálogo)
     */
    speak(lines, onComplete) {
        this.scene.scene.launch('DialogScene', {
            lines,
            speaker: 'Constructo',
            onComplete: onComplete || (() => {})
        });
    }

    /**
     * Animación de celebración cuando se obtiene un eigenvalor
     */
    celebrate() {
        this.scene.tweens.add({
            targets: this,
            y: this.y - 20,
            duration: 300,
            yoyo: true,
            ease: 'Bounce.out'
        });

        // Flash de luz
        if (this.glow) {
            const originalIntensity = this.config.glowIntensity;
            this.config.glowIntensity = 1;
            this.updateGlow();

            this.scene.time.delayedCall(300, () => {
                this.config.glowIntensity = originalIntensity;
                this.updateGlow();
            });
        }
    }

    destroy() {
        if (this.glitchTween) {
            this.glitchTween.destroy();
        }
        if (this.particles) {
            this.particles.destroy();
        }
        super.destroy();
    }
}
