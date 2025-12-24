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

        // Crear sprite del jugador
        this.sprite = scene.add.image(0, 0, 'resonator');
        this.add(this.sprite);

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

    update() {
        // Movimiento
        let velocityX = 0;
        let velocityY = 0;

        // Teclas de dirección o WASD
        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            velocityX = -this.speed;
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            velocityX = this.speed;
        }

        if (this.cursors.up.isDown || this.wasd.up.isDown) {
            velocityY = -this.speed;
        } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
            velocityY = this.speed;
        }

        // Normalizar diagonal
        if (velocityX !== 0 && velocityY !== 0) {
            velocityX *= 0.707;
            velocityY *= 0.707;
        }

        // Aplicar velocidad
        this.body.setVelocity(velocityX, velocityY);

        // Efecto visual al moverse
        const isMoving = velocityX !== 0 || velocityY !== 0;
        this.trail.emitting = isMoving;

        // Pulso del sprite
        const pulse = Math.sin(this.scene.time.now * 0.005) * 0.1 + 1;
        this.sprite.setScale(pulse);
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
}
