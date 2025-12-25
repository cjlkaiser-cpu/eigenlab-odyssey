/**
 * Resonator - El protagonista
 *
 * Un ser capaz de percibir las conexiones ocultas entre fenómenos.
 * Sus herramientas son instrumentos que manipulan la realidad
 * a través del sonido y la vibración.
 */

import Phaser from 'phaser';
import { PLAYER, REALM_COLORS } from '../core/constants.js';

export default class Resonator extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);

        this.scene = scene;
        this.speed = PLAYER.speed;
        this.direction = 'down'; // Dirección actual: down, up, left, right
        this.isMoving = false;
        this.breathPhase = 0;

        // Estado del jugador
        this.state = {
            eigenvalores: 0,
            instruments: {
                lyra: false,
                contrapunctus: false,
                diapason: true, // El único que funciona al inicio
                partitura: false
            },
            visitedRealms: ['aether'],
            connections: []
        };

        // Crear sprites para cada dirección
        this.sprites = {
            idle: this.createSprite('resonator-idle'),
            down: this.createSprite('resonator-walk-down'),
            up: this.createSprite('resonator-walk-up'),
            left: this.createSprite('resonator-walk-left'),
            right: this.createSprite('resonator-walk-right')
        };

        // Ocultar todos excepto idle
        Object.values(this.sprites).forEach(sprite => {
            sprite.setVisible(false);
            this.add(sprite);
        });
        this.sprites.idle.setVisible(true);
        this.currentSprite = this.sprites.idle;

        // Glow trail
        this.createGlowTrail();

        // Agregar a la escena
        scene.add.existing(this);

        // Configurar física
        scene.physics.world.enable(this);
        this.body.setCircle(PLAYER.size / 2);
        this.body.setOffset(-PLAYER.size / 2, -PLAYER.size / 2);
        this.body.setCollideWorldBounds(true);
        this.body.setDrag(800);
        this.body.setMaxVelocity(PLAYER.speed);

        // Input
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.wasd = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        // Profundidad (encima de otros elementos)
        this.setDepth(100);

        // Iniciar animación de breathing
        this.startBreathingAnimation();
    }

    createSprite(textureKey) {
        // Verificar si la textura existe, si no usar fallback
        const texture = this.scene.textures.exists(textureKey) ? textureKey : 'resonator';
        const sprite = this.scene.add.image(0, 0, texture);

        // Escalar el sprite a un tamaño apropiado (los originales son muy grandes)
        const targetHeight = PLAYER.size * 3; // ~72px de alto
        const scale = targetHeight / sprite.height;
        sprite.setScale(scale);

        return sprite;
    }

    createGlowTrail() {
        // Partículas que siguen al jugador
        this.trail = this.scene.add.particles(0, 0, 'particle', {
            follow: this,
            scale: { start: 0.4, end: 0 },
            alpha: { start: 0.3, end: 0 },
            speed: { min: 5, max: 20 },
            angle: { min: 0, max: 360 },
            lifespan: 800,
            frequency: 50,
            tint: REALM_COLORS.aether.primary,
            blendMode: 'ADD'
        });
    }

    startBreathingAnimation() {
        // Animación de respiración sutil cuando está idle
        this.breathTween = this.scene.tweens.add({
            targets: this,
            breathPhase: Math.PI * 2,
            duration: 2500,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    switchSprite(direction) {
        if (this.currentSprite === this.sprites[direction]) return;

        // Ocultar sprite actual
        this.currentSprite.setVisible(false);

        // Mostrar nuevo sprite
        this.currentSprite = this.sprites[direction];
        this.currentSprite.setVisible(true);
    }

    update() {
        // Movimiento
        let velocityX = 0;
        let velocityY = 0;
        let newDirection = null;

        // Teclas de dirección o WASD
        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            velocityX = -this.speed;
            newDirection = 'left';
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            velocityX = this.speed;
            newDirection = 'right';
        }

        if (this.cursors.up.isDown || this.wasd.up.isDown) {
            velocityY = -this.speed;
            if (!newDirection) newDirection = 'up';
        } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
            velocityY = this.speed;
            if (!newDirection) newDirection = 'down';
        }

        // Normalizar diagonal
        if (velocityX !== 0 && velocityY !== 0) {
            velocityX *= 0.707;
            velocityY *= 0.707;
        }

        // Aplicar velocidad
        this.body.setVelocity(velocityX, velocityY);

        // Determinar si está en movimiento
        this.isMoving = velocityX !== 0 || velocityY !== 0;

        // Cambiar sprite según dirección
        if (this.isMoving && newDirection) {
            this.direction = newDirection;
            this.switchSprite(newDirection);
        } else if (!this.isMoving) {
            // Volver a idle cuando no se mueve
            this.switchSprite('idle');
        }

        // Efecto visual
        this.trail.emitting = this.isMoving;

        // Animación de breathing/pulso
        const breathScale = 1 + Math.sin(this.breathPhase) * 0.03;
        const baseScale = this.currentSprite.scale || 0.1;

        if (!this.isMoving) {
            // Breathing más pronunciado cuando está idle
            const idleBreath = 1 + Math.sin(this.breathPhase) * 0.05;
            this.currentSprite.setScale(baseScale * idleBreath);
        } else {
            // Bobbing sutil al caminar
            const walkBob = 1 + Math.sin(this.scene.time.now * 0.015) * 0.02;
            this.currentSprite.setScale(baseScale * walkBob);
        }
    }

    // Métodos de progresión
    addEigenvalor(amount = 1) {
        this.state.eigenvalores += amount;
        this.scene.events.emit('eigenvalor-collected', this.state.eigenvalores);
    }

    unlockInstrument(instrument) {
        if (this.state.instruments.hasOwnProperty(instrument)) {
            this.state.instruments[instrument] = true;
            this.scene.events.emit('instrument-unlocked', instrument);
        }
    }

    visitRealm(realm) {
        if (!this.state.visitedRealms.includes(realm)) {
            this.state.visitedRealms.push(realm);
            this.scene.events.emit('realm-visited', realm);
        }
    }

    discoverConnection(realmA, realmB, description) {
        const connection = { realmA, realmB, description };
        this.state.connections.push(connection);
        this.scene.events.emit('connection-discovered', connection);
    }

    getState() {
        return { ...this.state };
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
    }

    destroy() {
        if (this.breathTween) {
            this.breathTween.destroy();
        }
        if (this.trail) {
            this.trail.destroy();
        }
        super.destroy();
    }
}
