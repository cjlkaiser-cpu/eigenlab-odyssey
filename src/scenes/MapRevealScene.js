/**
 * MapRevealScene - "La Revelación del Mapa"
 *
 * El péndulo proyecta los 9 reinos como esferas flotantes
 * conectadas por hilos tenues de luz.
 */

import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, REALM_COLORS } from '../core/constants.js';
import synthAudio from '../audio/SynthAudio.js';

// Posiciones de los reinos en el mapa
const REALM_POSITIONS = {
    aether: { x: 0.5, y: 0.5, scale: 1.2 },      // Centro
    cosmos: { x: 0.2, y: 0.25, scale: 0.8 },     // Arriba izquierda
    chaos: { x: 0.8, y: 0.25, scale: 0.8 },      // Arriba derecha
    logos: { x: 0.15, y: 0.55, scale: 0.75 },    // Izquierda
    atomos: { x: 0.85, y: 0.55, scale: 0.75 },   // Derecha
    terra: { x: 0.25, y: 0.8, scale: 0.7 },      // Abajo izquierda
    machina: { x: 0.5, y: 0.85, scale: 0.7 },    // Abajo centro
    alchemy: { x: 0.75, y: 0.8, scale: 0.7 },    // Abajo derecha
    bios: { x: 0.35, y: 0.35, scale: 0.65 },     // Entre cosmos y logos
    psyche: { x: 0.65, y: 0.35, scale: 0.65 }    // Entre chaos y atomos
};

// Conexiones entre reinos (hilos de luz)
const CONNECTIONS = [
    ['aether', 'cosmos'],
    ['aether', 'chaos'],
    ['aether', 'logos'],
    ['cosmos', 'bios'],
    ['chaos', 'psyche'],
    ['logos', 'terra'],
    ['atomos', 'alchemy'],
    ['terra', 'machina'],
    ['machina', 'alchemy'],
    ['bios', 'psyche']
];

// Narración final
const FINAL_NARRATION = [
    { text: '¿Lo oyes?', delay: 1000 },
    { text: 'Es el latido del mundo.', delay: 3500 },
    { text: 'Has recordado la primera regla.', delay: 6500 },
    { text: '', delay: 9000 },
    { text: 'Has afinado una sola nota, Resonador.', delay: 10000 },
    { text: 'Pero la sinfonía es vasta.', delay: 13000 },
    { text: 'Y el silencio... el silencio tiene hambre.', delay: 16000 },
    { text: '', delay: 19500 },
    { text: 'Toma tu diapasón.', delay: 20500 },
    { text: 'Ve a Logos.', delay: 23000 },
    { text: 'Allí donde nacen los números,', delay: 25000 },
    { text: 'encontraremos las herramientas para arreglar las estrellas.', delay: 27500 }
];

export default class MapRevealScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MapRevealScene' });
        this.realmSpheres = {};
        this.connectionLines = null;
        this.lightBeam = null;
    }

    create() {
        const { width, height } = this.cameras.main;

        // Fondo negro del vacío
        this.add.rectangle(width / 2, height / 2, width, height, 0x030712);

        // Estrellas distantes
        this.createStarfield();

        // Contenedor principal
        this.mapContainer = this.add.container(0, 0);
        this.mapContainer.setAlpha(0);

        // Líneas de conexión (debajo de las esferas)
        this.connectionGraphics = this.add.graphics();
        this.mapContainer.add(this.connectionGraphics);

        // Crear esferas de los reinos
        this.createRealmSpheres();

        // Haz de luz desde el centro (péndulo proyectando)
        this.createLightBeam();

        // Fade in
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        // Secuencia de revelación
        this.time.delayedCall(500, () => {
            this.startRevealSequence();
        });
    }

    createStarfield() {
        const { width, height } = this.cameras.main;

        for (let i = 0; i < 200; i++) {
            const x = Phaser.Math.Between(0, width);
            const y = Phaser.Math.Between(0, height);
            const size = Phaser.Math.FloatBetween(0.5, 2);
            const alpha = Phaser.Math.FloatBetween(0.1, 0.5);

            const star = this.add.circle(x, y, size, 0xffffff, alpha);

            // Algunas titilan
            if (Math.random() > 0.8) {
                this.tweens.add({
                    targets: star,
                    alpha: alpha * 0.2,
                    duration: Phaser.Math.Between(1000, 3000),
                    yoyo: true,
                    repeat: -1
                });
            }
        }
    }

    createRealmSpheres() {
        const { width, height } = this.cameras.main;

        Object.entries(REALM_POSITIONS).forEach(([realmId, pos]) => {
            const x = pos.x * width;
            const y = pos.y * height;
            const baseRadius = 35 * pos.scale;
            const color = REALM_COLORS[realmId]?.primary || 0xffffff;

            // Contenedor de la esfera
            const sphereContainer = this.add.container(x, y);
            sphereContainer.setAlpha(0);
            sphereContainer.setScale(0);

            // Glow exterior
            const glow = this.add.graphics();
            for (let i = 4; i > 0; i--) {
                glow.fillStyle(color, 0.05 * i);
                glow.fillCircle(0, 0, baseRadius + i * 10);
            }
            sphereContainer.add(glow);

            // Esfera principal
            const sphere = this.add.graphics();
            sphere.fillStyle(color, 0.8);
            sphere.fillCircle(0, 0, baseRadius);

            // Borde brillante
            sphere.lineStyle(2, 0xffffff, 0.6);
            sphere.strokeCircle(0, 0, baseRadius);
            sphereContainer.add(sphere);

            // Brillo interno
            const highlight = this.add.graphics();
            highlight.fillStyle(0xffffff, 0.3);
            highlight.fillCircle(-baseRadius * 0.3, -baseRadius * 0.3, baseRadius * 0.4);
            sphereContainer.add(highlight);

            // Nombre del reino
            const name = this.add.text(0, baseRadius + 15, realmId.toUpperCase(), {
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: `${10 * pos.scale + 4}px`,
                color: '#f8fafc',
                fontWeight: '600'
            }).setOrigin(0.5);
            sphereContainer.add(name);

            // Estado (oscuro/apagado excepto aether y logos)
            if (realmId !== 'aether' && realmId !== 'logos' && realmId !== 'cosmos' && realmId !== 'chaos') {
                sphereContainer.setAlpha(0.3);
            }

            this.mapContainer.add(sphereContainer);
            this.realmSpheres[realmId] = sphereContainer;

            // Animación de flotación
            this.tweens.add({
                targets: sphereContainer,
                y: y + Phaser.Math.Between(-5, 5),
                duration: Phaser.Math.Between(2000, 4000),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.inOut',
                delay: Phaser.Math.Between(0, 1000)
            });
        });
    }

    createLightBeam() {
        const { width, height } = this.cameras.main;

        this.lightBeam = this.add.graphics();
        this.lightBeam.setAlpha(0);
    }

    drawConnections(progress = 1) {
        const { width, height } = this.cameras.main;

        this.connectionGraphics.clear();

        CONNECTIONS.forEach((conn, index) => {
            const fromPos = REALM_POSITIONS[conn[0]];
            const toPos = REALM_POSITIONS[conn[1]];

            if (!fromPos || !toPos) return;

            const fromX = fromPos.x * width;
            const fromY = fromPos.y * height;
            const toX = toPos.x * width;
            const toY = toPos.y * height;

            // Calcular punto intermedio basado en progreso
            const currentProgress = Math.min(1, progress * CONNECTIONS.length - index);
            if (currentProgress <= 0) return;

            const endX = fromX + (toX - fromX) * currentProgress;
            const endY = fromY + (toY - fromY) * currentProgress;

            // Color basado en los reinos conectados
            const color1 = REALM_COLORS[conn[0]]?.primary || 0xffffff;
            const color2 = REALM_COLORS[conn[1]]?.primary || 0xffffff;

            // Línea tenue
            this.connectionGraphics.lineStyle(1, color1, 0.2);
            this.connectionGraphics.lineBetween(fromX, fromY, endX, endY);

            // Punto brillante viajando por la línea
            if (currentProgress > 0 && currentProgress < 1) {
                this.connectionGraphics.fillStyle(0xffffff, 0.8);
                this.connectionGraphics.fillCircle(endX, endY, 3);
            }
        });
    }

    startRevealSequence() {
        const { width, height } = this.cameras.main;

        // Fase 1: Haz de luz desde el centro
        this.lightBeam.clear();
        this.lightBeam.fillStyle(0xfbbf24, 0.3);
        this.lightBeam.fillTriangle(
            width / 2, height / 2,
            width / 2 - 50, 0,
            width / 2 + 50, 0
        );

        this.tweens.add({
            targets: this.lightBeam,
            alpha: 1,
            duration: 1000,
            onComplete: () => {
                // Fase 2: Expandir hacia arriba y revelar esferas
                this.time.delayedCall(500, () => {
                    this.revealSpheres();
                });
            }
        });
    }

    revealSpheres() {
        const { width, height } = this.cameras.main;

        // Fade in del mapa
        this.tweens.add({
            targets: this.mapContainer,
            alpha: 1,
            duration: 500
        });

        // Revelar cada esfera con delay
        const revealOrder = ['aether', 'cosmos', 'chaos', 'logos', 'bios', 'psyche', 'atomos', 'terra', 'machina', 'alchemy'];

        revealOrder.forEach((realmId, index) => {
            this.time.delayedCall(index * 300, () => {
                const sphere = this.realmSpheres[realmId];
                if (sphere) {
                    // Sonido de portal al aparecer cada esfera
                    synthAudio.playPortal();

                    this.tweens.add({
                        targets: sphere,
                        alpha: (realmId === 'aether' || realmId === 'logos' || realmId === 'cosmos' || realmId === 'chaos') ? 1 : 0.4,
                        scaleX: 1,
                        scaleY: 1,
                        duration: 500,
                        ease: 'Back.out'
                    });
                }
            });
        });

        // Animar conexiones progresivamente
        let connectionProgress = 0;
        this.time.addEvent({
            delay: 50,
            callback: () => {
                connectionProgress += 0.02;
                this.drawConnections(Math.min(connectionProgress, 1));
            },
            repeat: 60
        });

        // Resaltar camino a Logos
        this.time.delayedCall(4000, () => {
            this.highlightPathToLogos();
        });

        // Narración
        this.time.delayedCall(2000, () => {
            this.playFinalNarration();
        });
    }

    highlightPathToLogos() {
        const { width, height } = this.cameras.main;

        const aetherPos = REALM_POSITIONS.aether;
        const logosPos = REALM_POSITIONS.logos;

        // Línea brillante de Aether a Logos
        const pathGraphics = this.add.graphics();
        this.mapContainer.add(pathGraphics);

        pathGraphics.lineStyle(3, 0xfbbf24, 0);

        // Animación del camino
        let progress = 0;
        this.time.addEvent({
            delay: 20,
            callback: () => {
                progress += 0.02;
                if (progress > 1) return;

                pathGraphics.clear();
                pathGraphics.lineStyle(3, 0xfbbf24, 0.8);

                const fromX = aetherPos.x * width;
                const fromY = aetherPos.y * height;
                const toX = fromX + (logosPos.x * width - fromX) * progress;
                const toY = fromY + (logosPos.y * height - fromY) * progress;

                pathGraphics.lineBetween(fromX, fromY, toX, toY);

                // Partículas a lo largo del camino
                if (Math.random() > 0.7) {
                    const particle = this.add.circle(toX, toY, 2, 0xfbbf24, 1);
                    this.tweens.add({
                        targets: particle,
                        alpha: 0,
                        scale: 2,
                        duration: 500,
                        onComplete: () => particle.destroy()
                    });
                }
            },
            repeat: 60
        });
    }

    playFinalNarration() {
        const { width, height } = this.cameras.main;

        // Contenedor de narración
        this.narrationContainer = this.add.container(width / 2, height - 80);

        const bg = this.add.graphics();
        bg.fillStyle(0x000000, 0.8);
        bg.fillRoundedRect(-350, -30, 700, 60, 8);
        this.narrationContainer.add(bg);

        this.narrationText = this.add.text(0, 0, '', {
            fontFamily: 'Georgia, serif',
            fontSize: '18px',
            color: '#e2e8f0',
            align: 'center'
        }).setOrigin(0.5);
        this.narrationContainer.add(this.narrationText);

        // Mostrar cada línea
        FINAL_NARRATION.forEach(line => {
            this.time.delayedCall(line.delay, () => {
                this.tweens.add({
                    targets: this.narrationText,
                    alpha: 0,
                    duration: 300,
                    onComplete: () => {
                        this.narrationText.setText(line.text);
                        this.tweens.add({
                            targets: this.narrationText,
                            alpha: 1,
                            duration: 300
                        });
                    }
                });
            });
        });

        // Título final
        this.time.delayedCall(31000, () => {
            this.showTitle();
        });
    }

    showTitle() {
        const { width, height } = this.cameras.main;

        // Fade out narración
        this.tweens.add({
            targets: this.narrationContainer,
            alpha: 0,
            duration: 500
        });

        // Título épico
        const titleContainer = this.add.container(width / 2, height / 2);
        titleContainer.setAlpha(0);

        // Fondo oscuro
        const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7);
        titleContainer.add(overlay);

        // EIGENLAB
        const titleTop = this.add.text(0, -40, 'E I G E N L A B', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '48px',
            fontWeight: '900',
            color: '#f8fafc',
            letterSpacing: 20
        }).setOrigin(0.5);
        titleContainer.add(titleTop);

        // ODYSSEY
        const titleBottom = this.add.text(0, 30, 'O D Y S S E Y', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '32px',
            fontWeight: '700',
            color: '#a855f7',
            letterSpacing: 15
        }).setOrigin(0.5);
        titleContainer.add(titleBottom);

        // Subtítulo
        const subtitle = this.add.text(0, 80, 'La Sinfonía Rota', {
            fontFamily: 'Georgia, serif',
            fontSize: '18px',
            fontStyle: 'italic',
            color: '#94a3b8'
        }).setOrigin(0.5);
        titleContainer.add(subtitle);

        // Animación de entrada
        this.tweens.add({
            targets: titleContainer,
            alpha: 1,
            duration: 1500
        });

        // Pulso del título
        this.tweens.add({
            targets: [titleTop, titleBottom],
            scale: { from: 1, to: 1.02 },
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.inOut'
        });

        // Continuar al hub después de unos segundos
        this.time.delayedCall(5000, () => {
            // Instrucción para continuar
            const continueText = this.add.text(width / 2, height - 50, 'Pulsa cualquier tecla para comenzar', {
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '14px',
                color: '#64748b'
            }).setOrigin(0.5);

            this.tweens.add({
                targets: continueText,
                alpha: { from: 0.5, to: 1 },
                duration: 800,
                yoyo: true,
                repeat: -1
            });

            // Esperar input
            this.input.keyboard.once('keydown', () => this.goToHub());
            this.input.once('pointerdown', () => this.goToHub());
        });
    }

    goToHub() {
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('AetherHub');
        });
    }
}
