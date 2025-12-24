/**
 * CinematicIntroScene - "El Vacío Digital"
 *
 * Secuencia cinematográfica de apertura:
 * 1. Terminal con texto escribiéndose
 * 2. Errores y glitches
 * 3. La Disonancia (audio/visual)
 * 4. Narración de "La Estructura"
 * 5. La cuerda solitaria
 * 6. Transición al despertar
 */

import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../core/constants.js';
import synthAudio from '../audio/SynthAudio.js';

// Secuencia de comandos de terminal
const TERMINAL_SEQUENCE = [
    { text: '> INICIANDO SISTEMA DE REALIDAD...', delay: 0, type: 'command' },
    { text: '> CARGANDO CONSTANTES UNIVERSALES...', delay: 2000, type: 'command' },
    { text: '> ERROR. GRAVEDAD NO ENCONTRADA.', delay: 4000, type: 'error' },
    { text: '> ERROR. ELECTROMAGNETISMO CORRUPTO.', delay: 5500, type: 'error' },
    { text: '> ERROR. TIEMPO NO DEFINIDO.', delay: 7000, type: 'error' },
    { text: '> S1ST3M@ F@!L...', delay: 8500, type: 'glitch' }
];

// Narración de La Estructura
const NARRATION = [
    { text: 'Dicen que al principio fue el Verbo.', delay: 0 },
    { text: 'Se equivocan.', delay: 3000 },
    { text: 'Al principio fue la Frecuencia.', delay: 5000 },
    { text: 'Una onda perfecta que cruzó la nada y dijo:', delay: 8000 },
    { text: '"Hágase la luz".', delay: 11000 },
    { text: 'Y la luz no fue más que una vibración.', delay: 13500 },
    { text: '', delay: 16000 }, // Pausa
    { text: 'Todo lo que ves, tocas y amas...', delay: 17000 },
    { text: 'es música cristalizada.', delay: 19500 },
    { text: 'Las órbitas de los planetas son ritmo.', delay: 22000 },
    { text: 'Los enlaces químicos son armonía.', delay: 24500 },
    { text: 'Tu propia mente es un acorde de jazz improvisado.', delay: 27000 },
    { text: '', delay: 30000 }, // Pausa
    { text: 'Pero alguien ha desafinado el instrumento.', delay: 31000 },
    { text: 'La Entropía ha dejado de ser un silencio suave', delay: 34000 },
    { text: 'para convertirse en Ruido.', delay: 37000 },
    { text: 'El universo ha olvidado cómo sonar.', delay: 40000 }
];

export default class CinematicIntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CinematicIntroScene' });
        this.terminalLines = [];
        this.currentLine = 0;
        this.charIndex = 0;
        this.glitchActive = false;
        this.glitchGraphics = null;
        this.stringLine = null;
        this.phase = 'terminal'; // 'terminal', 'glitch', 'narration', 'string', 'transition'
    }

    create() {
        const { width, height } = this.cameras.main;

        // Inicializar audio
        synthAudio.init();
        synthAudio.resume();

        // Fondo negro absoluto
        this.add.rectangle(width / 2, height / 2, width, height, 0x000000);

        // Contenedor para el terminal
        this.terminalContainer = this.add.container(60, 100);

        // Contenedor para la narración
        this.narrationContainer = this.add.container(width / 2, height / 2);
        this.narrationContainer.setAlpha(0);

        // Contenedor para la cuerda
        this.stringContainer = this.add.container(width / 2, height / 2);
        this.stringContainer.setAlpha(0);

        // Gráficos para glitch
        this.glitchGraphics = this.add.graphics();
        this.glitchGraphics.setDepth(100);

        // Cursor parpadeante del terminal
        this.cursor = this.add.rectangle(0, 0, 10, 20, 0x00ff00);
        this.cursor.setOrigin(0, 0);
        this.terminalContainer.add(this.cursor);

        // Parpadeo del cursor
        this.tweens.add({
            targets: this.cursor,
            alpha: 0,
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        // Iniciar secuencia
        this.startTerminalSequence();

        // Skip con cualquier tecla después de 5 segundos
        this.time.delayedCall(5000, () => {
            this.input.keyboard.on('keydown', () => this.skipToGame());
            this.input.on('pointerdown', () => this.skipToGame());

            // Texto de skip
            this.skipText = this.add.text(width - 30, height - 30, 'Pulsa para saltar', {
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '12px',
                color: '#4a5568'
            }).setOrigin(1, 1).setAlpha(0);

            this.tweens.add({
                targets: this.skipText,
                alpha: 0.6,
                duration: 1000
            });
        });
    }

    startTerminalSequence() {
        this.phase = 'terminal';

        TERMINAL_SEQUENCE.forEach((line, index) => {
            this.time.delayedCall(line.delay, () => {
                this.typeTerminalLine(line.text, line.type, index);
            });
        });

        // Después del terminal, iniciar glitch
        this.time.delayedCall(9500, () => {
            this.startGlitchPhase();
        });
    }

    typeTerminalLine(text, type, lineIndex) {
        const y = lineIndex * 28;
        let color = '#00ff00'; // Verde fosforescente por defecto

        if (type === 'error') {
            color = '#ff3333';
        } else if (type === 'glitch') {
            color = '#ffff00';
        }

        const textObj = this.add.text(0, y, '', {
            fontFamily: '"Courier New", monospace',
            fontSize: '18px',
            color: color
        });
        this.terminalContainer.add(textObj);

        // Efecto de escritura letra por letra
        let charIndex = 0;
        const typeInterval = this.time.addEvent({
            delay: 30,
            callback: () => {
                if (charIndex < text.length) {
                    textObj.setText(text.substring(0, charIndex + 1));
                    charIndex++;

                    // Actualizar posición del cursor
                    this.cursor.setPosition(textObj.width + 5, y);

                    // Sonido de tecla
                    if (Math.random() > 0.5) {
                        synthAudio.playKeyClick();
                    }

                    // Vibración visual ocasional
                    if (Math.random() > 0.7) {
                        textObj.setX(textObj.x + Phaser.Math.Between(-1, 1));
                        this.time.delayedCall(50, () => textObj.setX(0));
                    }
                } else {
                    typeInterval.destroy();
                }
            },
            loop: true
        });

        // Glitch en líneas de error
        if (type === 'error' || type === 'glitch') {
            this.time.delayedCall(text.length * 30 + 200, () => {
                this.glitchText(textObj);
            });
        }
    }

    glitchText(textObj) {
        const originalText = textObj.text;

        // Sonido de glitch
        synthAudio.playGlitch(0.15);

        // Glitch rápido
        const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/\\~`';
        let glitchCount = 0;

        const glitchInterval = this.time.addEvent({
            delay: 50,
            callback: () => {
                if (glitchCount < 6) {
                    let glitched = '';
                    for (let i = 0; i < originalText.length; i++) {
                        if (Math.random() > 0.7) {
                            glitched += glitchChars[Math.floor(Math.random() * glitchChars.length)];
                        } else {
                            glitched += originalText[i];
                        }
                    }
                    textObj.setText(glitched);
                    glitchCount++;
                } else {
                    textObj.setText(originalText);
                    glitchInterval.destroy();
                }
            },
            loop: true
        });
    }

    startGlitchPhase() {
        this.phase = 'glitch';

        // Glitch intenso de pantalla completa
        const { width, height } = this.cameras.main;

        let glitchCount = 0;
        const maxGlitches = 30;

        const glitchInterval = this.time.addEvent({
            delay: 100,
            callback: () => {
                if (glitchCount < maxGlitches) {
                    this.drawScreenGlitch();
                    glitchCount++;

                    // Sonido de glitch ocasional
                    if (glitchCount % 3 === 0) {
                        synthAudio.playGlitch(0.1);
                    }

                    // Shake de cámara
                    if (glitchCount % 5 === 0) {
                        this.cameras.main.shake(100, 0.01);
                    }
                } else {
                    glitchInterval.destroy();
                    this.glitchGraphics.clear();
                    this.fadeToNarration();
                }
            },
            loop: true
        });

        // Fade out del terminal
        this.tweens.add({
            targets: this.terminalContainer,
            alpha: 0,
            duration: 2000,
            delay: 1000
        });
    }

    drawScreenGlitch() {
        const { width, height } = this.cameras.main;

        this.glitchGraphics.clear();

        // Líneas horizontales aleatorias
        for (let i = 0; i < 10; i++) {
            const y = Phaser.Math.Between(0, height);
            const h = Phaser.Math.Between(2, 20);
            const offsetX = Phaser.Math.Between(-50, 50);

            this.glitchGraphics.fillStyle(
                Phaser.Math.Between(0, 1) ? 0x00ff00 : 0xff0000,
                Phaser.Math.FloatBetween(0.1, 0.5)
            );
            this.glitchGraphics.fillRect(offsetX, y, width, h);
        }

        // Bloques de ruido
        for (let i = 0; i < 5; i++) {
            const x = Phaser.Math.Between(0, width);
            const y = Phaser.Math.Between(0, height);
            const w = Phaser.Math.Between(20, 100);
            const h = Phaser.Math.Between(10, 50);

            this.glitchGraphics.fillStyle(
                Phaser.Utils.Array.GetRandom([0x00ff00, 0xff0000, 0xffff00, 0x000000]),
                Phaser.Math.FloatBetween(0.2, 0.8)
            );
            this.glitchGraphics.fillRect(x, y, w, h);
        }

        // Limpiar después de un frame
        this.time.delayedCall(50, () => {
            this.glitchGraphics.clear();
        });
    }

    fadeToNarration() {
        this.phase = 'narration';
        const { width, height } = this.cameras.main;

        // Fade in de la narración
        this.tweens.add({
            targets: this.narrationContainer,
            alpha: 1,
            duration: 2000
        });

        // Texto de narración centrado
        this.narrationText = this.add.text(0, 0, '', {
            fontFamily: 'Georgia, serif',
            fontSize: '24px',
            color: '#e2e8f0',
            align: 'center',
            wordWrap: { width: width - 200 }
        }).setOrigin(0.5);
        this.narrationContainer.add(this.narrationText);

        // Mostrar cada línea de narración
        NARRATION.forEach((line, index) => {
            this.time.delayedCall(line.delay, () => {
                this.showNarrationLine(line.text);
            });
        });

        // Después de la narración, mostrar la cuerda
        this.time.delayedCall(43000, () => {
            this.showString();
        });
    }

    showNarrationLine(text) {
        // Fade out texto anterior
        this.tweens.add({
            targets: this.narrationText,
            alpha: 0,
            duration: 500,
            onComplete: () => {
                this.narrationText.setText(text);
                this.tweens.add({
                    targets: this.narrationText,
                    alpha: 1,
                    duration: 500
                });
            }
        });
    }

    showString() {
        this.phase = 'string';
        const { width, height } = this.cameras.main;

        // Fade out narración
        this.tweens.add({
            targets: this.narrationContainer,
            alpha: 0,
            duration: 1000
        });

        // Fade in cuerda
        this.tweens.add({
            targets: this.stringContainer,
            alpha: 1,
            duration: 2000,
            delay: 1000,
            onComplete: () => {
                // Sonido de cuerda vibrando
                synthAudio.playString(110, 4);
            }
        });

        // Dibujar la cuerda vibrante
        this.stringGraphics = this.add.graphics();
        this.stringContainer.add(this.stringGraphics);

        // Animación de la cuerda
        let time = 0;
        const stringLength = 400;
        const stringY = 0;

        this.stringAnimation = this.time.addEvent({
            delay: 16, // ~60fps
            callback: () => {
                time += 0.05;
                this.stringGraphics.clear();

                // Dibujar cuerda vibrante (onda sinusoidal)
                this.stringGraphics.lineStyle(2, 0xffffff, 1);
                this.stringGraphics.beginPath();

                for (let x = -stringLength / 2; x <= stringLength / 2; x += 2) {
                    const amplitude = 20 * Math.sin(time) * Math.exp(-Math.abs(x) / 100);
                    const y = stringY + amplitude * Math.sin((x / 30) + time * 3);

                    if (x === -stringLength / 2) {
                        this.stringGraphics.moveTo(x, y);
                    } else {
                        this.stringGraphics.lineTo(x, y);
                    }
                }

                this.stringGraphics.strokePath();

                // Glow
                this.stringGraphics.lineStyle(6, 0xffffff, 0.2);
                this.stringGraphics.beginPath();
                for (let x = -stringLength / 2; x <= stringLength / 2; x += 4) {
                    const amplitude = 20 * Math.sin(time) * Math.exp(-Math.abs(x) / 100);
                    const y = stringY + amplitude * Math.sin((x / 30) + time * 3);

                    if (x === -stringLength / 2) {
                        this.stringGraphics.moveTo(x, y);
                    } else {
                        this.stringGraphics.lineTo(x, y);
                    }
                }
                this.stringGraphics.strokePath();
            },
            loop: true
        });

        // Texto debajo de la cuerda
        this.time.delayedCall(3000, () => {
            const breakText = this.add.text(0, 60, 'La cuerda se rompe...', {
                fontFamily: 'Georgia, serif',
                fontSize: '18px',
                color: '#94a3b8'
            }).setOrigin(0.5).setAlpha(0);
            this.stringContainer.add(breakText);

            this.tweens.add({
                targets: breakText,
                alpha: 1,
                duration: 1000
            });
        });

        // Romper la cuerda y transición
        this.time.delayedCall(6000, () => {
            this.breakStringAndTransition();
        });
    }

    breakStringAndTransition() {
        this.phase = 'transition';

        // Sonido de ruptura (glitch fuerte)
        synthAudio.playGlitch(0.5);

        // Detener animación de cuerda
        if (this.stringAnimation) {
            this.stringAnimation.destroy();
        }

        // Efecto de ruptura
        this.stringGraphics.clear();

        // Líneas fragmentadas
        const fragments = 8;
        for (let i = 0; i < fragments; i++) {
            const startX = -200 + (400 / fragments) * i;
            const endX = startX + (400 / fragments) - 10;
            const offsetY = Phaser.Math.Between(-30, 30);

            const frag = this.add.graphics();
            frag.lineStyle(2, 0xffffff, 1);
            frag.lineBetween(startX, offsetY, endX, offsetY + Phaser.Math.Between(-10, 10));
            this.stringContainer.add(frag);

            // Animar fragmentos cayendo
            this.tweens.add({
                targets: frag,
                y: 300,
                alpha: 0,
                angle: Phaser.Math.Between(-45, 45),
                duration: 2000,
                delay: i * 100,
                ease: 'Power2'
            });
        }

        // Glitch final
        this.cameras.main.shake(500, 0.02);

        // Fade a negro y transición
        this.time.delayedCall(2500, () => {
            this.cameras.main.fadeOut(1500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('CathedralScene');
            });
        });
    }

    skipToGame() {
        // Limpiar todos los eventos
        this.time.removeAllEvents();

        if (this.stringAnimation) {
            this.stringAnimation.destroy();
        }

        // Transición directa
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('CathedralScene');
        });
    }
}
