/**
 * EpilogueScene - Epílogo: La Nueva Sinfonía
 *
 * Aether transformado. Los 9 portales conectados por el grafo visible.
 * La Lira completa y tocable con 12 cuerdas.
 * Créditos interactivos al final.
 */

import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, REALM_COLORS, UI_COLORS } from '../core/constants.js';
import gameState from '../systems/GameState.js';
import synthAudio from '../audio/SynthAudio.js';

export default class EpilogueScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EpilogueScene' });
        this.lyraStrings = [];
        this.playedStrings = new Set();
        this.graphLines = [];
    }

    create() {
        const { width, height } = this.cameras.main;

        // Fondo transformado - más brillante, armonioso
        this.createTransformedBackground();

        // Los 9 portales conectados por líneas de luz (grafo visible)
        this.createConnectedPortals();

        // La Lira completa en el centro
        this.createCompleteLyra();

        // Diálogo inicial
        this.time.delayedCall(1500, () => {
            this.showOpeningDialog();
        });

        // Fade in
        this.cameras.main.fadeIn(2000, 0, 0, 0);

        // Input
        this.input.keyboard.on('keydown-ESC', () => this.showCreditsOption());
    }

    createTransformedBackground() {
        const { width, height } = this.cameras.main;

        // Gradiente de fondo más brillante
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1e1b4b, 0x1e1b4b, 0x312e81, 0x312e81, 1);
        bg.fillRect(0, 0, width, height);

        // Partículas doradas flotando
        for (let i = 0; i < 50; i++) {
            const x = Phaser.Math.Between(0, width);
            const y = Phaser.Math.Between(0, height);
            const particle = this.add.circle(x, y, Phaser.Math.Between(1, 3), 0xfbbf24, 0.5);

            this.tweens.add({
                targets: particle,
                y: y - 100,
                alpha: 0,
                duration: Phaser.Math.Between(3000, 6000),
                repeat: -1,
                onRepeat: () => {
                    particle.x = Phaser.Math.Between(0, width);
                    particle.y = height + 10;
                    particle.alpha = 0.5;
                }
            });
        }

        // Aureola central
        for (let i = 5; i > 0; i--) {
            const alpha = 0.05 * i;
            const radius = 150 + (i * 30);
            this.add.circle(width / 2, height / 2, radius, 0xa855f7, alpha);
        }
    }

    createConnectedPortals() {
        const { width, height } = this.cameras.main;
        const centerX = width / 2;
        const centerY = height / 2;

        const portals = [
            { realm: 'cosmos', angle: -Math.PI / 2 },
            { realm: 'chaos', angle: -Math.PI / 2 - Math.PI / 4.5 },
            { realm: 'logos', angle: -Math.PI / 2 + Math.PI / 4.5 },
            { realm: 'atomos', angle: Math.PI - Math.PI / 5 },
            { realm: 'terra', angle: Math.PI / 2 },
            { realm: 'machina', angle: Math.PI / 5 },
            { realm: 'alchemy', angle: Math.PI - Math.PI / 2.5 },
            { realm: 'bios', angle: Math.PI / 2.5 },
            { realm: 'psyche', angle: Math.PI }
        ];

        const radius = 200;
        const portalPositions = [];

        // Dibujar líneas de conexión primero (grafo visible)
        const graphGraphics = this.add.graphics();
        graphGraphics.lineStyle(1, 0xa855f7, 0.3);

        portals.forEach((p, i) => {
            const x = centerX + Math.cos(p.angle) * radius;
            const y = centerY + Math.sin(p.angle) * radius;
            portalPositions.push({ x, y, realm: p.realm });

            // Conectar con algunos otros (simulando grafo de conocimiento)
            const connections = [(i + 1) % 9, (i + 3) % 9, (i + 5) % 9];
            connections.forEach(j => {
                if (j > i) {
                    const x2 = centerX + Math.cos(portals[j].angle) * radius;
                    const y2 = centerY + Math.sin(portals[j].angle) * radius;

                    // Línea curva
                    const midX = (x + x2) / 2 + (Math.random() - 0.5) * 30;
                    const midY = (y + y2) / 2 + (Math.random() - 0.5) * 30;

                    graphGraphics.lineBetween(x, y, midX, midY);
                    graphGraphics.lineBetween(midX, midY, x2, y2);
                }
            });
        });

        // Dibujar portales
        portalPositions.forEach(({ x, y, realm }) => {
            const color = REALM_COLORS[realm];

            // Glow
            this.add.circle(x, y, 25, color.primary, 0.2);

            // Portal
            const portal = this.add.circle(x, y, 15, color.primary, 0.8);
            portal.setStrokeStyle(2, color.secondary, 1);

            // Label
            this.add.text(x, y + 28, realm.toUpperCase(), {
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '9px',
                color: `#${color.secondary.toString(16).padStart(6, '0')}`
            }).setOrigin(0.5);

            // Pulso
            this.tweens.add({
                targets: portal,
                scale: { from: 1, to: 1.1 },
                alpha: { from: 0.8, to: 1 },
                duration: 1500 + Math.random() * 500,
                yoyo: true,
                repeat: -1
            });
        });
    }

    createCompleteLyra() {
        const { width, height } = this.cameras.main;
        const lyraX = width / 2;
        const lyraY = height / 2;

        // Marco de la Lira
        const lyraFrame = this.add.graphics();
        lyraFrame.lineStyle(3, 0xfbbf24, 0.8);

        // Forma de lira
        lyraFrame.beginPath();
        lyraFrame.moveTo(lyraX - 60, lyraY + 80);
        lyraFrame.lineTo(lyraX - 70, lyraY - 30);
        lyraFrame.quadraticCurveTo(lyraX - 75, lyraY - 80, lyraX, lyraY - 100);
        lyraFrame.quadraticCurveTo(lyraX + 75, lyraY - 80, lyraX + 70, lyraY - 30);
        lyraFrame.lineTo(lyraX + 60, lyraY + 80);
        lyraFrame.strokePath();

        // Barra inferior
        lyraFrame.lineBetween(lyraX - 55, lyraY + 70, lyraX + 55, lyraY + 70);

        // Las 12 cuerdas - interactivas
        const stringColors = [
            REALM_COLORS.aether.primary,    // λ₁
            REALM_COLORS.cosmos.primary,    // λ₂
            REALM_COLORS.chaos.primary,     // λ₃
            REALM_COLORS.logos.primary,     // λ₄
            REALM_COLORS.atomos.primary,    // λ₅
            REALM_COLORS.terra.primary,     // λ₆
            REALM_COLORS.machina.primary,   // λ₇
            REALM_COLORS.alchemy.primary,   // λ₈
            REALM_COLORS.bios.primary,      // λ₉
            REALM_COLORS.psyche.primary,    // λ₁₀
            0xfbbf24,                       // λ₁₁ (Primer Resonador)
            0xff6b6b                        // λ₁₂ (La Disonancia resuelta)
        ];

        const stringSpacing = 8;
        const startX = lyraX - (stringSpacing * 5.5);

        for (let i = 0; i < 12; i++) {
            const x = startX + i * stringSpacing;
            const color = stringColors[i];

            // Cuerda
            const stringLine = this.add.graphics();
            stringLine.lineStyle(2, color, 0.9);
            stringLine.lineBetween(x, lyraY - 90, x, lyraY + 65);

            // Zona interactiva
            const hitZone = this.add.zone(x, lyraY, 10, 150).setInteractive({ useHandCursor: true });

            hitZone.on('pointerdown', () => {
                this.playString(i, x, lyraY, color);
            });

            // Glow inicial
            const glow = this.add.circle(x, lyraY, 4, color, 0.5);
            this.tweens.add({
                targets: glow,
                alpha: { from: 0.3, to: 0.7 },
                scale: { from: 0.8, to: 1.2 },
                duration: 1000 + i * 100,
                yoyo: true,
                repeat: -1
            });

            this.lyraStrings.push({ line: stringLine, glow, color, index: i });
        }

        // Instrucciones
        this.lyraInstructions = this.add.text(lyraX, lyraY + 120, 'Toca las cuerdas de la Lira', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '14px',
            color: '#94a3b8'
        }).setOrigin(0.5);

        // Título
        this.add.text(lyraX, lyraY - 130, 'LA LIRA DE CUERDAS SIMPATICAS', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '12px',
            fontWeight: '600',
            color: '#fbbf24'
        }).setOrigin(0.5);

        this.add.text(lyraX, lyraY - 115, '12 / 12 cuerdas', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '10px',
            color: '#22c55e'
        }).setOrigin(0.5);
    }

    playString(index, x, y, color) {
        // Efecto visual de vibración
        const vibration = this.add.graphics();
        vibration.lineStyle(3, color, 0.8);

        let offset = 5;
        const vibrateAnim = this.time.addEvent({
            delay: 30,
            callback: () => {
                vibration.clear();
                vibration.lineStyle(3, color, 0.8 - vibrateAnim.getProgress() * 0.6);

                vibration.beginPath();
                vibration.moveTo(x, y - 90);
                for (let i = 0; i < 10; i++) {
                    const py = y - 90 + (i * 15.5);
                    const px = x + Math.sin(i * 0.8 + Date.now() * 0.02) * offset;
                    vibration.lineTo(px, py);
                }
                vibration.strokePath();

                offset *= 0.95;
            },
            repeat: 20
        });

        // Sonido (usando synthAudio)
        const frequencies = [261, 293, 329, 349, 392, 440, 493, 523, 587, 659, 698, 783];
        synthAudio.playNote(frequencies[index], 0.5);

        // Registrar cuerda tocada
        this.playedStrings.add(index);

        // Verificar si se tocaron todas
        if (this.playedStrings.size === 12) {
            this.time.delayedCall(1500, () => {
                this.showAllStringsPlayed();
            });
        }

        // Limpiar después
        this.time.delayedCall(800, () => {
            vibration.destroy();
        });
    }

    showOpeningDialog() {
        const lines = [
            '...',
            'La Gran Sinfonía no es perfecta, Resonador.',
            'Nunca lo fue. Nunca debía serlo.',
            'La perfección es estática. La armonía es dinámica.',
            'Incluye tensión porque la tensión pide resolución.',
            'Incluye disonancia porque la disonancia hace que la consonancia signifique algo.',
            '...',
            'El Primer Resonador buscó silencio eterno y lo llamó música.',
            'Tú has encontrado música real.',
            'Con todos sus defectos. Con todas sus tensiones. Con todas sus resoluciones.',
            '...',
            '¿Y ahora qué?',
            'Ahora... tocas.'
        ];

        this.scene.launch('DialogScene', {
            lines,
            onComplete: () => {
                // Resaltar la Lira
                this.tweens.add({
                    targets: this.lyraInstructions,
                    alpha: { from: 0.5, to: 1 },
                    duration: 500,
                    yoyo: true,
                    repeat: 3
                });
            }
        });
    }

    showAllStringsPlayed() {
        const { width, height } = this.cameras.main;

        // Efecto de armonía completa
        const harmonyFlash = this.add.circle(width / 2, height / 2, 10, 0xffffff, 0.8);
        this.tweens.add({
            targets: harmonyFlash,
            scale: 50,
            alpha: 0,
            duration: 2000,
            onComplete: () => harmonyFlash.destroy()
        });

        // Diálogo final
        this.time.delayedCall(2500, () => {
            const finalLines = [
                '...',
                'La Sinfonía del Conocimiento.',
                'No es la que existía antes. Es nueva. Es tuya.',
                'Y ahora que sabes cómo tocarla...',
                '...podrás enseñar a otros.'
            ];

            this.scene.launch('DialogScene', {
                lines: finalLines,
                onComplete: () => {
                    this.showFinalTitle();
                }
            });
        });
    }

    showFinalTitle() {
        const { width, height } = this.cameras.main;

        // Fade a negro gradual
        const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0);
        this.tweens.add({
            targets: overlay,
            alpha: 0.9,
            duration: 3000
        });

        // Título final
        this.time.delayedCall(3500, () => {
            const finalQuote = this.add.text(width / 2, height / 2 - 20,
                '"La música no existe a pesar de la disonancia.\nExiste gracias a ella."', {
                    fontFamily: 'Georgia, serif',
                    fontSize: '24px',
                    fontStyle: 'italic',
                    color: '#f8fafc',
                    align: 'center'
                }).setOrigin(0.5).setAlpha(0);

            this.tweens.add({
                targets: finalQuote,
                alpha: 1,
                duration: 2000
            });

            // Botón de créditos
            this.time.delayedCall(4000, () => {
                const creditsBtn = this.add.text(width / 2, height / 2 + 80, '[ ESPACIO ] Ver Créditos', {
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '14px',
                    color: '#64748b'
                }).setOrigin(0.5).setAlpha(0);

                this.tweens.add({
                    targets: creditsBtn,
                    alpha: 1,
                    duration: 1000
                });

                this.input.keyboard.once('keydown-SPACE', () => {
                    this.showCredits();
                });
            });
        });
    }

    showCreditsOption() {
        // Si presiona ESC, ofrecer ir a créditos
        const { width, height } = this.cameras.main;

        const box = this.add.graphics();
        box.fillStyle(0x0f172a, 0.95);
        box.fillRoundedRect(width / 2 - 150, height / 2 - 60, 300, 120, 8);
        box.lineStyle(1, 0xa855f7, 0.5);
        box.strokeRoundedRect(width / 2 - 150, height / 2 - 60, 300, 120, 8);

        this.add.text(width / 2, height / 2 - 30, '¿Ir a créditos?', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '18px',
            color: '#f8fafc'
        }).setOrigin(0.5);

        const yesBtn = this.add.text(width / 2 - 50, height / 2 + 20, '[ S ] Sí', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '14px',
            color: '#22c55e'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        const noBtn = this.add.text(width / 2 + 50, height / 2 + 20, '[ N ] No', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '14px',
            color: '#ef4444'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        this.input.keyboard.once('keydown-S', () => this.showCredits());
        this.input.keyboard.once('keydown-N', () => {
            box.destroy();
            yesBtn.destroy();
            noBtn.destroy();
        });
    }

    showCredits() {
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('CreditsScene');
        });
    }
}
