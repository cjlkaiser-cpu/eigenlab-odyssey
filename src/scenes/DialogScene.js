/**
 * DialogScene - Sistema de diálogos narrativos
 *
 * Overlay que muestra texto con efecto typewriter.
 * Se superpone a la escena actual sin detenerla.
 */

import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, UI_COLORS, REALM_COLORS } from '../core/constants.js';
import synthAudio from '../audio/SynthAudio.js';

export default class DialogScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DialogScene' });

        this.lines = [];
        this.currentLineIndex = 0;
        this.isTyping = false;
        this.typewriterTimer = null;
        this.onComplete = null;
    }

    init(data) {
        this.lines = data.lines || [];
        this.onComplete = data.onComplete || (() => {});
        this.currentLineIndex = 0;
    }

    create() {
        const { width, height } = this.cameras.main;

        // Fondo semi-transparente
        this.overlay = this.add.rectangle(
            width / 2, height / 2,
            width, height,
            0x000000, 0.7
        );

        // Caja de diálogo
        const boxWidth = 700;
        const boxHeight = 150;
        const boxY = height - 120;

        this.dialogBox = this.add.graphics();
        this.dialogBox.fillStyle(0x0f172a, 0.95);
        this.dialogBox.fillRoundedRect(
            (width - boxWidth) / 2,
            boxY - boxHeight / 2,
            boxWidth,
            boxHeight,
            8
        );
        this.dialogBox.lineStyle(1, REALM_COLORS.aether.primary, 0.5);
        this.dialogBox.strokeRoundedRect(
            (width - boxWidth) / 2,
            boxY - boxHeight / 2,
            boxWidth,
            boxHeight,
            8
        );

        // Texto del diálogo
        this.dialogText = this.add.text(
            width / 2,
            boxY - 15,
            '',
            {
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '18px',
                color: '#f8fafc',
                align: 'center',
                wordWrap: { width: boxWidth - 60 },
                lineSpacing: 8
            }
        ).setOrigin(0.5);

        // Indicador de continuar
        this.continuePrompt = this.add.text(
            width / 2,
            boxY + 45,
            '▼ ESPACIO para continuar',
            {
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '12px',
                color: '#64748b'
            }
        ).setOrigin(0.5).setAlpha(0);

        // Input
        this.input.keyboard.on('keydown-SPACE', () => this.advance());
        this.input.keyboard.on('keydown-ENTER', () => this.advance());
        this.input.keyboard.on('keydown-E', () => this.advance());

        // Click también avanza
        this.input.on('pointerdown', () => this.advance());

        // Mostrar primera línea
        this.showLine(0);

        // Fade in
        this.cameras.main.fadeIn(200);

        // M7.1: Sonido de apertura
        synthAudio.playDialogOpen();
    }

    showLine(index) {
        if (index >= this.lines.length) {
            this.closeDialog();
            return;
        }

        this.currentLineIndex = index;
        const line = this.lines[index];

        // Si es línea vacía, mostrar inmediatamente y seguir
        if (line === '' || line === '...') {
            this.dialogText.setText(line);
            this.continuePrompt.setAlpha(1);
            this.isTyping = false;
            return;
        }

        // Efecto typewriter
        this.isTyping = true;
        this.continuePrompt.setAlpha(0);
        this.dialogText.setText('');

        let charIndex = 0;
        const typeSpeed = 30; // ms por caracter

        if (this.typewriterTimer) {
            this.typewriterTimer.destroy();
        }

        this.typewriterTimer = this.time.addEvent({
            delay: typeSpeed,
            callback: () => {
                if (charIndex < line.length) {
                    this.dialogText.setText(line.substring(0, charIndex + 1));
                    charIndex++;
                } else {
                    this.isTyping = false;
                    this.continuePrompt.setAlpha(1);
                    this.typewriterTimer.destroy();

                    // Pulso del indicador
                    this.tweens.add({
                        targets: this.continuePrompt,
                        alpha: { from: 1, to: 0.5 },
                        duration: 500,
                        yoyo: true,
                        repeat: -1
                    });
                }
            },
            loop: true
        });
    }

    advance() {
        if (this.isTyping) {
            // Saltar animación, mostrar texto completo
            if (this.typewriterTimer) {
                this.typewriterTimer.destroy();
            }
            this.dialogText.setText(this.lines[this.currentLineIndex]);
            this.isTyping = false;
            this.continuePrompt.setAlpha(1);
        } else {
            // Siguiente línea
            this.showLine(this.currentLineIndex + 1);
        }
    }

    closeDialog() {
        // M7.1: Sonido de cierre
        synthAudio.playDialogClose();

        this.cameras.main.fadeOut(200);

        this.cameras.main.once('camerafadeoutcomplete', () => {
            if (this.onComplete) {
                this.onComplete();
            }
            this.scene.stop();
        });
    }
}
