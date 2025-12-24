/**
 * CathedralScene - "El Despertar en Aether"
 *
 * La Catedral de Datos:
 * - Columnas de cristal flotantes y rotas
 * - Fórmulas matemáticas grabadas en el aire
 * - El Péndulo Maestro congelado
 * - El primer puzzle: restaurar la gravedad
 */

import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, REALM_COLORS } from '../core/constants.js';
import gameState from '../systems/GameState.js';
import synthAudio from '../audio/SynthAudio.js';

// Fórmulas que aparecen flotando (algunas corruptas)
const FORMULAS = [
    { text: 'E = mc²', x: 150, y: 120, corrupt: false },
    { text: '∇ × E = -∂B/∂t', x: 900, y: 150, corrupt: true },
    { text: 'F = ma', x: 200, y: 500, corrupt: false },
    { text: 'S = k log W', x: 1000, y: 450, corrupt: true },
    { text: 'iℏ∂Ψ/∂t = ĤΨ', x: 100, y: 350, corrupt: true },
    { text: 'PV = nRT', x: 1100, y: 280, corrupt: false },
    { text: '∂²u/∂t² = c²∇²u', x: 180, y: 220, corrupt: true },
    { text: 'T = 2π√(L/g)', x: 640, y: 580, corrupt: true, key: true } // La ecuación del péndulo
];

// Narración de La Estructura
const CATHEDRAL_NARRATION = [
    { text: 'Bienvenido de vuelta, Resonador.', delay: 1000 },
    { text: 'Dormiste durante la Gran Caída.', delay: 4000 },
    { text: 'Mira a tu alrededor.', delay: 7000 },
    { text: 'El corazón de Aether se ha detenido.', delay: 9000 }
];

export default class CathedralScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CathedralScene' });
        this.pendulum = null;
        this.pendulumAngle = 0.4; // Congelado en ángulo imposible
        this.staticNoise = null;
        this.formulaTexts = [];
        this.lyraString = null;
        this.puzzleActive = false;
        this.gValue = 0; // Valor actual de g
        this.targetG = 9.81;
        this.puzzleSolved = false;
    }

    create() {
        const { width, height } = this.cameras.main;

        // Fondo de catedral
        this.createCathedralBackground();

        // Columnas de cristal rotas
        this.createCrystalColumns();

        // Fórmulas flotantes
        this.createFloatingFormulas();

        // El Péndulo Maestro
        this.createMasterPendulum();

        // Estática/Disonancia alrededor del péndulo
        this.createStaticNoise();

        // UI mínima
        this.createUI();

        // Fade in
        this.cameras.main.fadeIn(2000, 0, 0, 0);

        // Iniciar narración
        this.time.delayedCall(500, () => {
            this.playNarration();
        });
    }

    createCathedralBackground() {
        const { width, height } = this.cameras.main;

        // Fondo negro profundo
        this.add.rectangle(width / 2, height / 2, width, height, 0x030712);

        // Grid infinito (perspectiva)
        const gridGraphics = this.add.graphics();
        gridGraphics.lineStyle(1, 0x1e293b, 0.3);

        // Líneas verticales convergentes
        const vanishY = height * 0.3;
        for (let i = 0; i <= 20; i++) {
            const x = (width / 20) * i;
            gridGraphics.lineBetween(x, height, width / 2 + (x - width / 2) * 0.3, vanishY);
        }

        // Líneas horizontales
        for (let i = 0; i < 15; i++) {
            const y = height - (height - vanishY) * (i / 15) ** 1.5;
            const scale = 1 - (i / 15) * 0.7;
            gridGraphics.lineBetween(
                width / 2 - (width / 2) * scale,
                y,
                width / 2 + (width / 2) * scale,
                y
            );
        }

        // Glow central sutil
        const glow = this.add.graphics();
        for (let i = 5; i > 0; i--) {
            glow.fillStyle(REALM_COLORS.aether.primary, 0.02 * i);
            glow.fillCircle(width / 2, height / 2 - 50, 150 + i * 30);
        }
    }

    createCrystalColumns() {
        const { width, height } = this.cameras.main;

        // Columnas a los lados
        const columnPositions = [
            { x: 100, y: height / 2, broken: true },
            { x: 250, y: height / 2 - 50, broken: false },
            { x: width - 100, y: height / 2, broken: true },
            { x: width - 250, y: height / 2 - 30, broken: false },
            { x: 180, y: height / 2 + 100, broken: true },
            { x: width - 180, y: height / 2 + 80, broken: false }
        ];

        columnPositions.forEach(col => {
            this.createColumn(col.x, col.y, col.broken);
        });
    }

    createColumn(x, y, broken) {
        const graphics = this.add.graphics();
        const columnHeight = broken ? Phaser.Math.Between(100, 200) : Phaser.Math.Between(250, 350);
        const columnWidth = 30;

        // Gradiente de cristal
        for (let i = 0; i < columnHeight; i += 5) {
            const alpha = 0.1 + Math.sin(i / 20) * 0.05;
            const color = broken ? 0x64748b : 0xa855f7;
            graphics.fillStyle(color, alpha);
            graphics.fillRect(x - columnWidth / 2, y - columnHeight / 2 + i, columnWidth, 5);
        }

        // Borde brillante
        graphics.lineStyle(1, broken ? 0x475569 : 0xc084fc, 0.5);
        graphics.strokeRect(x - columnWidth / 2, y - columnHeight / 2, columnWidth, columnHeight);

        // Fragmentos flotando si está rota
        if (broken) {
            for (let i = 0; i < 3; i++) {
                const fragX = x + Phaser.Math.Between(-40, 40);
                const fragY = y - columnHeight / 2 - Phaser.Math.Between(20, 80);
                const fragSize = Phaser.Math.Between(10, 25);

                const frag = this.add.graphics();
                frag.fillStyle(0x64748b, 0.3);
                frag.fillRect(-fragSize / 2, -fragSize / 2, fragSize, fragSize);
                frag.setPosition(fragX, fragY);

                // Flotar
                this.tweens.add({
                    targets: frag,
                    y: fragY + Phaser.Math.Between(-10, 10),
                    angle: Phaser.Math.Between(-5, 5),
                    duration: Phaser.Math.Between(2000, 4000),
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.inOut'
                });
            }
        }
    }

    createFloatingFormulas() {
        const { width, height } = this.cameras.main;

        FORMULAS.forEach(formula => {
            const text = this.add.text(formula.x, formula.y, formula.text, {
                fontFamily: '"Times New Roman", serif',
                fontSize: formula.key ? '22px' : '18px',
                color: formula.corrupt ? '#ef4444' : '#94a3b8',
                fontStyle: 'italic'
            }).setOrigin(0.5);

            if (formula.corrupt) {
                // Parpadeo de error
                this.tweens.add({
                    targets: text,
                    alpha: { from: 1, to: 0.3 },
                    duration: Phaser.Math.Between(500, 1500),
                    yoyo: true,
                    repeat: -1
                });

                // Glitch ocasional
                this.time.addEvent({
                    delay: Phaser.Math.Between(2000, 5000),
                    callback: () => this.glitchFormula(text, formula.text),
                    loop: true
                });
            }

            // Flotar suavemente
            this.tweens.add({
                targets: text,
                y: formula.y + Phaser.Math.Between(-5, 5),
                duration: Phaser.Math.Between(3000, 5000),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.inOut'
            });

            this.formulaTexts.push({ text, formula });
        });
    }

    glitchFormula(textObj, originalText) {
        const glitchChars = '!@#$%^&*()[]{}|<>?/\\';
        let glitched = '';

        for (let i = 0; i < originalText.length; i++) {
            if (Math.random() > 0.6) {
                glitched += glitchChars[Math.floor(Math.random() * glitchChars.length)];
            } else {
                glitched += originalText[i];
            }
        }

        textObj.setText(glitched);
        this.time.delayedCall(100, () => textObj.setText(originalText));
    }

    createMasterPendulum() {
        const { width, height } = this.cameras.main;

        // Contenedor del péndulo
        this.pendulumContainer = this.add.container(width / 2, 50);

        // Punto de suspensión
        const pivot = this.add.circle(0, 0, 8, 0xa855f7);
        this.pendulumContainer.add(pivot);

        // Cuerda
        this.pendulumRope = this.add.graphics();
        this.pendulumContainer.add(this.pendulumRope);

        // Bob del péndulo
        const ropeLength = 280;
        const bobX = Math.sin(this.pendulumAngle) * ropeLength;
        const bobY = Math.cos(this.pendulumAngle) * ropeLength;

        this.pendulumBob = this.add.circle(bobX, bobY, 25, 0xfbbf24);
        this.pendulumBob.setStrokeStyle(3, 0xfde68a);
        this.pendulumContainer.add(this.pendulumBob);

        // Dibujar cuerda
        this.pendulumRope.lineStyle(3, 0xa855f7, 0.8);
        this.pendulumRope.lineBetween(0, 0, bobX, bobY);

        // Glow alrededor del bob (congelado)
        this.frozenGlow = this.add.circle(bobX, bobY, 40, 0x64748b, 0.3);
        this.pendulumContainer.add(this.frozenGlow);

        // Panel de ecuación debajo del péndulo
        this.createEquationPanel();
    }

    createEquationPanel() {
        const { width, height } = this.cameras.main;

        this.equationPanel = this.add.container(width / 2, height - 120);
        this.equationPanel.setAlpha(0);

        // Fondo del panel
        const panelBg = this.add.graphics();
        panelBg.fillStyle(0x0f172a, 0.95);
        panelBg.fillRoundedRect(-200, -50, 400, 100, 12);
        panelBg.lineStyle(2, 0xa855f7, 0.5);
        panelBg.strokeRoundedRect(-200, -50, 400, 100, 12);
        this.equationPanel.add(panelBg);

        // Ecuación
        this.equationText = this.add.text(0, -25, 'T = 2π√(L/g)', {
            fontFamily: '"Times New Roman", serif',
            fontSize: '28px',
            color: '#f8fafc',
            fontStyle: 'italic'
        }).setOrigin(0.5);
        this.equationPanel.add(this.equationText);

        // Valor de g (inicialmente corrupto)
        this.gValueText = this.add.text(0, 15, 'g = ???', {
            fontFamily: 'monospace',
            fontSize: '20px',
            color: '#ef4444'
        }).setOrigin(0.5);
        this.equationPanel.add(this.gValueText);

        // Instrucción
        this.instructionText = this.add.text(0, 40, 'Pulsa la cuerda para encontrar la frecuencia', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '12px',
            color: '#64748b'
        }).setOrigin(0.5).setAlpha(0);
        this.equationPanel.add(this.instructionText);
    }

    createStaticNoise() {
        const { width, height } = this.cameras.main;

        // Contenedor de estática
        this.staticContainer = this.add.container(width / 2, 50 + 280);

        // Partículas de estática
        this.staticGraphics = this.add.graphics();
        this.staticContainer.add(this.staticGraphics);

        // Animar estática
        this.time.addEvent({
            delay: 50,
            callback: () => this.updateStaticNoise(),
            loop: true
        });
    }

    updateStaticNoise() {
        if (this.puzzleSolved) {
            this.staticGraphics.clear();
            return;
        }

        this.staticGraphics.clear();

        // Radio de la estática
        const radius = 60 + Math.sin(Date.now() / 500) * 10;

        // Puntos de ruido
        for (let i = 0; i < 50; i++) {
            const angle = Math.random() * Math.PI * 2;
            const r = Math.random() * radius;
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;

            this.staticGraphics.fillStyle(
                Phaser.Utils.Array.GetRandom([0x64748b, 0x475569, 0x1e293b]),
                Math.random() * 0.8
            );
            this.staticGraphics.fillRect(x, y, Phaser.Math.Between(2, 6), Phaser.Math.Between(2, 6));
        }
    }

    createUI() {
        const { width, height } = this.cameras.main;

        // Título del lugar
        this.placeTitle = this.add.text(width / 2, 30, 'AETHER — El Núcleo Central', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '14px',
            color: '#64748b'
        }).setOrigin(0.5).setAlpha(0);

        // Objetivo
        this.objectiveText = this.add.text(30, height - 30, '', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '12px',
            color: '#94a3b8'
        }).setAlpha(0);
    }

    playNarration() {
        const { width, height } = this.cameras.main;

        // Caja de texto de narración
        this.narrationBox = this.add.container(width / 2, height - 200);
        this.narrationBox.setAlpha(0);

        const boxBg = this.add.graphics();
        boxBg.fillStyle(0x000000, 0.8);
        boxBg.fillRoundedRect(-300, -30, 600, 60, 8);
        this.narrationBox.add(boxBg);

        this.narrationText = this.add.text(0, 0, '', {
            fontFamily: 'Georgia, serif',
            fontSize: '18px',
            color: '#e2e8f0',
            align: 'center'
        }).setOrigin(0.5);
        this.narrationBox.add(this.narrationText);

        // Label de quién habla
        const speakerLabel = this.add.text(-290, -20, 'LA ESTRUCTURA', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '10px',
            color: '#a855f7'
        });
        this.narrationBox.add(speakerLabel);

        // Mostrar cada línea
        CATHEDRAL_NARRATION.forEach((line, index) => {
            this.time.delayedCall(line.delay, () => {
                this.showNarrationLine(line.text, index === CATHEDRAL_NARRATION.length - 1);
            });
        });

        // Fade in de la caja
        this.tweens.add({
            targets: this.narrationBox,
            alpha: 1,
            duration: 500
        });

        // Después de la narración, activar el puzzle
        this.time.delayedCall(12000, () => {
            this.activatePuzzle();
        });
    }

    showNarrationLine(text, isLast) {
        this.tweens.add({
            targets: this.narrationText,
            alpha: 0,
            duration: 300,
            onComplete: () => {
                this.narrationText.setText(text);
                this.tweens.add({
                    targets: this.narrationText,
                    alpha: 1,
                    duration: 300
                });

                if (isLast) {
                    this.time.delayedCall(3000, () => {
                        this.tweens.add({
                            targets: this.narrationBox,
                            alpha: 0,
                            duration: 500
                        });
                    });
                }
            }
        });
    }

    activatePuzzle() {
        this.puzzleActive = true;
        const { width, height } = this.cameras.main;

        // Mostrar panel de ecuación
        this.tweens.add({
            targets: this.equationPanel,
            alpha: 1,
            duration: 500
        });

        // Mostrar instrucción
        this.tweens.add({
            targets: this.instructionText,
            alpha: 1,
            duration: 500,
            delay: 500
        });

        // Mostrar objetivo
        this.objectiveText.setText('OBJETIVO: Diagnosticar el Péndulo Maestro');
        this.tweens.add({
            targets: this.objectiveText,
            alpha: 1,
            duration: 500
        });

        // Crear la cuerda interactiva (Lira)
        this.createLyraString();
    }

    createLyraString() {
        const { width, height } = this.cameras.main;

        // Contenedor de la cuerda
        this.lyraContainer = this.add.container(width / 2 + 250, height / 2);
        this.lyraContainer.setAlpha(0);

        // Marco de la cuerda
        const frame = this.add.graphics();
        frame.lineStyle(2, 0xfbbf24, 0.8);
        frame.strokeRect(-30, -150, 60, 300);
        this.lyraContainer.add(frame);

        // La cuerda
        this.lyraStringGraphics = this.add.graphics();
        this.lyraContainer.add(this.lyraStringGraphics);

        // Zona interactiva
        this.lyraHitZone = this.add.rectangle(0, 0, 60, 300, 0xffffff, 0)
            .setInteractive({ useHandCursor: true, draggable: true });
        this.lyraContainer.add(this.lyraHitZone);

        // Valor actual mostrado
        this.stringValueText = this.add.text(0, 170, 'g = 0.00', {
            fontFamily: 'monospace',
            fontSize: '14px',
            color: '#fbbf24'
        }).setOrigin(0.5);
        this.lyraContainer.add(this.stringValueText);

        // Etiqueta
        const label = this.add.text(0, -170, 'DIAPASÓN', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '10px',
            color: '#fbbf24'
        }).setOrigin(0.5);
        this.lyraContainer.add(label);

        // Fade in
        this.tweens.add({
            targets: this.lyraContainer,
            alpha: 1,
            duration: 500
        });

        // Interactividad
        this.lyraHitZone.on('drag', (pointer, dragX, dragY) => {
            this.onStringDrag(dragY);
        });

        this.lyraHitZone.on('dragend', () => {
            this.onStringRelease();
        });

        // Dibujar cuerda inicial
        this.drawLyraString(0);
    }

    drawLyraString(displacement) {
        this.lyraStringGraphics.clear();

        // Cuerda principal
        this.lyraStringGraphics.lineStyle(2, 0xfbbf24, 1);
        this.lyraStringGraphics.beginPath();

        for (let y = -140; y <= 140; y += 5) {
            const x = displacement * Math.sin((y / 140) * Math.PI);

            if (y === -140) {
                this.lyraStringGraphics.moveTo(x, y);
            } else {
                this.lyraStringGraphics.lineTo(x, y);
            }
        }

        this.lyraStringGraphics.strokePath();

        // Glow
        this.lyraStringGraphics.lineStyle(6, 0xfbbf24, 0.2);
        this.lyraStringGraphics.beginPath();

        for (let y = -140; y <= 140; y += 10) {
            const x = displacement * Math.sin((y / 140) * Math.PI);

            if (y === -140) {
                this.lyraStringGraphics.moveTo(x, y);
            } else {
                this.lyraStringGraphics.lineTo(x, y);
            }
        }

        this.lyraStringGraphics.strokePath();
    }

    onStringDrag(dragY) {
        // Mapear posición Y a valor de g (0 a 20)
        const normalizedY = Phaser.Math.Clamp(dragY, -140, 140);
        this.gValue = ((normalizedY + 140) / 280) * 20;

        // Actualizar visuales
        const displacement = (normalizedY / 140) * 25;
        this.drawLyraString(displacement);

        // Actualizar texto
        this.stringValueText.setText(`g = ${this.gValue.toFixed(2)}`);
        this.gValueText.setText(`g = ${this.gValue.toFixed(2)}`);

        // Color según cercanía al objetivo
        const distance = Math.abs(this.gValue - this.targetG);
        if (distance < 0.1) {
            this.gValueText.setColor('#22c55e');
            this.stringValueText.setColor('#22c55e');
        } else if (distance < 1) {
            this.gValueText.setColor('#fbbf24');
            this.stringValueText.setColor('#fbbf24');
        } else {
            this.gValueText.setColor('#ef4444');
            this.stringValueText.setColor('#ef4444');
        }
    }

    onStringRelease() {
        const distance = Math.abs(this.gValue - this.targetG);

        if (distance < 0.15 && !this.puzzleSolved) {
            // ¡ÉXITO!
            this.solvePuzzle();
        } else {
            // Vibración de cuerda (no encontró)
            this.vibrateString();
        }
    }

    vibrateString() {
        // Sonido de cuerda (frecuencia depende del valor de g)
        const freq = 220 + (this.gValue * 20);
        synthAudio.playString(freq, 1.5);

        let time = 0;
        const vibration = this.time.addEvent({
            delay: 16,
            callback: () => {
                time += 0.3;
                const displacement = 15 * Math.sin(time * 10) * Math.exp(-time);
                this.drawLyraString(displacement);

                if (time > 2) {
                    vibration.destroy();
                    this.drawLyraString(0);
                }
            },
            loop: true
        });
    }

    solvePuzzle() {
        this.puzzleSolved = true;

        // Sonidos de éxito y resonancia
        synthAudio.playSuccess();
        synthAudio.playResonance(440);

        // Efecto de "Lock-in"
        this.cameras.main.flash(500, 255, 215, 0, true);

        // Texto de éxito
        this.gValueText.setText('g = 9.81 m/s²');
        this.gValueText.setColor('#22c55e');

        // Limpiar estática
        this.tweens.add({
            targets: this.staticContainer,
            alpha: 0,
            duration: 1000
        });

        // Animar péndulo (empieza a oscilar)
        this.startPendulumSwing();

        // Mostrar mensaje de sistema
        this.showSystemMessage();

        // Después del éxito, revelar el mapa
        this.time.delayedCall(5000, () => {
            this.transitionToMapReveal();
        });
    }

    startPendulumSwing() {
        const ropeLength = 280;
        let angle = this.pendulumAngle;
        let angularVelocity = 0;
        const gravity = 9.81;
        const damping = 0.995;
        let lastSign = Math.sign(angle);

        // Actualizar glow a dorado
        this.frozenGlow.setFillStyle(0xfbbf24, 0.4);

        // Animación del péndulo
        this.time.addEvent({
            delay: 16,
            callback: () => {
                // Física del péndulo
                const angularAcceleration = -(gravity / ropeLength) * Math.sin(angle);
                angularVelocity += angularAcceleration * 0.016;
                angularVelocity *= damping;
                angle += angularVelocity * 0.016;

                // Tick cuando cruza el centro
                const currentSign = Math.sign(angle);
                if (currentSign !== lastSign && Math.abs(angularVelocity) > 0.01) {
                    synthAudio.playPendulumTick(1 + Math.abs(angularVelocity) * 0.5);
                    lastSign = currentSign;
                }

                // Actualizar posición
                const bobX = Math.sin(angle) * ropeLength;
                const bobY = Math.cos(angle) * ropeLength;

                this.pendulumBob.setPosition(bobX, bobY);
                this.frozenGlow.setPosition(bobX, bobY);

                // Redibujar cuerda
                this.pendulumRope.clear();
                this.pendulumRope.lineStyle(3, 0xfbbf24, 0.8);
                this.pendulumRope.lineBetween(0, 0, bobX, bobY);
            },
            loop: true
        });
    }

    showSystemMessage() {
        const { width, height } = this.cameras.main;

        const sysContainer = this.add.container(width / 2, 100);
        sysContainer.setAlpha(0);

        const sysBg = this.add.graphics();
        sysBg.fillStyle(0x0f172a, 0.95);
        sysBg.fillRoundedRect(-200, -30, 400, 60, 8);
        sysBg.lineStyle(2, 0x22c55e, 0.8);
        sysBg.strokeRoundedRect(-200, -30, 400, 60, 8);
        sysContainer.add(sysBg);

        const sysText = this.add.text(0, -10, '> GRAVEDAD RESTAURADA.', {
            fontFamily: '"Courier New", monospace',
            fontSize: '16px',
            color: '#22c55e'
        }).setOrigin(0.5);
        sysContainer.add(sysText);

        const eigenText = this.add.text(0, 15, '> EIGENVALOR OBTENIDO: [CONSTANTE G]', {
            fontFamily: '"Courier New", monospace',
            fontSize: '14px',
            color: '#a855f7'
        }).setOrigin(0.5);
        sysContainer.add(eigenText);

        this.tweens.add({
            targets: sysContainer,
            alpha: 1,
            duration: 500
        });

        // Otorgar eigenvalor
        gameState.addEigenvalor(1);
    }

    transitionToMapReveal() {
        this.cameras.main.fadeOut(1500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('MapRevealScene');
        });
    }
}
