/**
 * DissonanceScene - El Corazón de La Disonancia (Acto IV)
 *
 * Espacio fracturado donde fragmentos de los 9 reinos flotan.
 * El Resonador se enfrenta a La Disonancia y debe resolverla
 * con el Contrapunctus.
 */

import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, REALM_COLORS, UI_COLORS } from '../core/constants.js';
import gameState from '../systems/GameState.js';
import synthAudio from '../audio/SynthAudio.js';

export default class DissonanceScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DissonanceScene' });
        this.fragments = [];
        this.disonancia = null;
        this.dialogPhase = 0;
    }

    create() {
        const { width, height } = this.cameras.main;

        // Fondo negro con estática roja
        this.createFracturedBackground();

        // Fragmentos flotantes de los 9 reinos
        this.createRealmFragments();

        // La Disonancia en el centro
        this.createDisonancia();

        // Iniciar secuencia de diálogo
        this.time.delayedCall(1500, () => {
            this.startDialogSequence();
        });

        // Fade in dramático
        this.cameras.main.fadeIn(2000, 0, 0, 0);

        // Input
        this.input.keyboard.on('keydown-ESC', () => this.openPauseMenu());
    }

    createFracturedBackground() {
        const { width, height } = this.cameras.main;

        // Fondo negro profundo
        this.add.rectangle(width / 2, height / 2, width, height, 0x050505);

        // Estática roja pulsante
        this.staticGraphics = this.add.graphics();
        this.updateStatic();

        // Timer para actualizar estática
        this.time.addEvent({
            delay: 100,
            callback: () => this.updateStatic(),
            loop: true
        });

        // Vórtice central oscuro
        for (let i = 5; i > 0; i--) {
            const alpha = 0.05 * i;
            const radius = 100 + (i * 40);
            const vortex = this.add.circle(width / 2, height / 2, radius, 0x1a0000, alpha);
            this.tweens.add({
                targets: vortex,
                scale: { from: 1, to: 1.1 },
                alpha: { from: alpha, to: alpha * 0.5 },
                duration: 2000 + (i * 500),
                yoyo: true,
                repeat: -1
            });
        }
    }

    updateStatic() {
        const { width, height } = this.cameras.main;
        this.staticGraphics.clear();

        // Partículas de estática roja
        for (let i = 0; i < 30; i++) {
            const x = Phaser.Math.Between(0, width);
            const y = Phaser.Math.Between(0, height);
            const size = Phaser.Math.Between(1, 3);
            const alpha = Math.random() * 0.3;
            this.staticGraphics.fillStyle(0xff0000, alpha);
            this.staticGraphics.fillRect(x, y, size, size);
        }

        // Líneas de interferencia
        if (Math.random() > 0.7) {
            const y = Phaser.Math.Between(0, height);
            this.staticGraphics.fillStyle(0x330000, 0.5);
            this.staticGraphics.fillRect(0, y, width, 2);
        }
    }

    createRealmFragments() {
        const { width, height } = this.cameras.main;
        const centerX = width / 2;
        const centerY = height / 2;

        const realmData = [
            { name: 'COSMOS', color: REALM_COLORS.cosmos.primary, symbol: '★' },
            { name: 'CHAOS', color: REALM_COLORS.chaos.primary, symbol: '∞' },
            { name: 'LOGOS', color: REALM_COLORS.logos.primary, symbol: 'π' },
            { name: 'ATOMOS', color: REALM_COLORS.atomos.primary, symbol: '⚛' },
            { name: 'TERRA', color: REALM_COLORS.terra.primary, symbol: '◆' },
            { name: 'MACHINA', color: REALM_COLORS.machina.primary, symbol: '⚙' },
            { name: 'ALCHEMY', color: REALM_COLORS.alchemy.primary, symbol: '⚗' },
            { name: 'BIOS', color: REALM_COLORS.bios.primary, symbol: '🧬' },
            { name: 'PSYCHE', color: REALM_COLORS.psyche.primary, symbol: '◎' }
        ];

        realmData.forEach((realm, i) => {
            const angle = (i / realmData.length) * Math.PI * 2;
            const distance = 200 + Math.random() * 100;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;

            // Fragmento como polígono irregular
            const fragment = this.add.graphics();
            fragment.fillStyle(realm.color, 0.3);
            fragment.lineStyle(1, realm.color, 0.6);

            // Forma irregular
            const points = [];
            const sides = Phaser.Math.Between(4, 6);
            for (let j = 0; j < sides; j++) {
                const a = (j / sides) * Math.PI * 2;
                const r = 20 + Math.random() * 15;
                points.push({
                    x: Math.cos(a) * r,
                    y: Math.sin(a) * r
                });
            }
            fragment.beginPath();
            fragment.moveTo(points[0].x, points[0].y);
            points.forEach(p => fragment.lineTo(p.x, p.y));
            fragment.closePath();
            fragment.fillPath();
            fragment.strokePath();

            fragment.setPosition(x, y);
            fragment.initialX = x;
            fragment.initialY = y;
            fragment.orbitSpeed = 0.0005 + Math.random() * 0.0003;
            fragment.orbitRadius = distance;
            fragment.orbitAngle = angle;

            this.fragments.push(fragment);

            // Label del fragmento
            this.add.text(x, y, realm.symbol, {
                fontSize: '16px',
                color: `#${realm.color.toString(16).padStart(6, '0')}`
            }).setOrigin(0.5).setAlpha(0.6);
        });
    }

    createDisonancia() {
        const { width, height } = this.cameras.main;
        const centerX = width / 2;
        const centerY = height / 2;

        // La Disonancia - forma fractal humanoide
        this.disonanciaContainer = this.add.container(centerX, centerY);

        // Núcleo pulsante
        this.disonanciaCore = this.add.graphics();
        this.drawDisonanciaForm();
        this.disonanciaContainer.add(this.disonanciaCore);

        // Aura de interferencia
        for (let i = 0; i < 3; i++) {
            const aura = this.add.circle(0, 0, 60 + i * 20, 0xff0000, 0.05);
            this.disonanciaContainer.add(aura);
            this.tweens.add({
                targets: aura,
                scale: { from: 1, to: 1.5 },
                alpha: { from: 0.1, to: 0 },
                duration: 2000 + i * 500,
                repeat: -1
            });
        }

        // Glitch effect
        this.time.addEvent({
            delay: 150,
            callback: () => {
                this.disonanciaCore.clear();
                this.drawDisonanciaForm();
            },
            loop: true
        });

        // Label
        this.disonanciaLabel = this.add.text(centerX, centerY - 100, 'LA DISONANCIA', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '18px',
            fontWeight: '700',
            color: '#ff3333'
        }).setOrigin(0.5).setAlpha(0);
    }

    drawDisonanciaForm() {
        const glitchOffset = () => Phaser.Math.Between(-3, 3);

        this.disonanciaCore.clear();

        // Forma humanoide distorsionada
        this.disonanciaCore.lineStyle(2, 0xff0000, 0.8);

        // Cabeza (círculo distorsionado)
        this.disonanciaCore.strokeCircle(glitchOffset(), -40 + glitchOffset(), 20);

        // Torso
        this.disonanciaCore.beginPath();
        this.disonanciaCore.moveTo(-15 + glitchOffset(), -20);
        this.disonanciaCore.lineTo(-25 + glitchOffset(), 30);
        this.disonanciaCore.lineTo(25 + glitchOffset(), 30);
        this.disonanciaCore.lineTo(15 + glitchOffset(), -20);
        this.disonanciaCore.closePath();
        this.disonanciaCore.strokePath();

        // Brazos como ondas
        this.disonanciaCore.beginPath();
        this.disonanciaCore.moveTo(-25, -10);
        for (let i = 0; i < 5; i++) {
            const x = -25 - i * 10;
            const y = -10 + Math.sin(Date.now() * 0.01 + i) * 10;
            this.disonanciaCore.lineTo(x + glitchOffset(), y);
        }
        this.disonanciaCore.strokePath();

        this.disonanciaCore.beginPath();
        this.disonanciaCore.moveTo(25, -10);
        for (let i = 0; i < 5; i++) {
            const x = 25 + i * 10;
            const y = -10 + Math.sin(Date.now() * 0.01 + i + Math.PI) * 10;
            this.disonanciaCore.lineTo(x + glitchOffset(), y);
        }
        this.disonanciaCore.strokePath();

        // Interferencia adicional
        if (Math.random() > 0.7) {
            this.disonanciaCore.lineStyle(1, 0xff6666, 0.5);
            this.disonanciaCore.lineBetween(
                Phaser.Math.Between(-50, 50),
                Phaser.Math.Between(-60, 50),
                Phaser.Math.Between(-50, 50),
                Phaser.Math.Between(-60, 50)
            );
        }
    }

    startDialogSequence() {
        this.dialogPhase = 1;
        this.showDialogPhase1();
    }

    showDialogPhase1() {
        // Constructo tiembla
        const lines = [
            '...',
            'Mis sensores... todo es ruido ahí dentro. No puedo procesar...',
            'Pero si el Resonador entra, yo entro. Para eso existo.'
        ];

        this.scene.launch('DialogScene', {
            lines,
            onComplete: () => {
                this.tweens.add({
                    targets: this.disonanciaLabel,
                    alpha: 1,
                    duration: 1000
                });
                this.time.delayedCall(1500, () => this.showDialogPhase2());
            }
        });
    }

    showDialogPhase2() {
        // La Disonancia habla
        const lines = [
            '...',
            'Otro... Resonador.',
            'Vienes a... ¿silenciarme? ¿Destruirme?'
        ];

        this.scene.launch('DialogScene', {
            lines,
            onComplete: () => {
                this.time.delayedCall(1000, () => this.showDialogPhase3());
            }
        });
    }

    showDialogPhase3() {
        // El Resonador habla por PRIMERA VEZ
        const lines = [
            '...',
            '[ EL RESONADOR ]',
            '"Vengo a entenderte."'
        ];

        this.scene.launch('DialogScene', {
            lines,
            onComplete: () => {
                this.time.delayedCall(1000, () => this.showDialogPhase4());
            }
        });
    }

    showDialogPhase4() {
        // La Disonancia se explica
        const lines = [
            '...',
            'Entenderme... él también dijo eso. El primero.',
            'Me creó buscando... perfección. Y ahora soy todo lo que... odiaba.',
            '¿Sabes qué soy?',
            'Soy la séptima... sin resolución.',
            'La suspensión... que nunca cae.',
            'El tritono... que nunca encuentra su tónica.',
            'SOY LA TENSIÓN QUE ÉL QUISO ELIMINAR.',
            'Y sin mí... no hay música. Solo...',
            '...ruido blanco eterno.'
        ];

        this.scene.launch('DialogScene', {
            lines,
            onComplete: () => {
                this.time.delayedCall(1000, () => this.showContrapunctusAppear());
            }
        });
    }

    showContrapunctusAppear() {
        const { width, height } = this.cameras.main;

        // El Contrapunctus aparece
        const contrapunctusLines = [
            '...',
            'El Contrapunctus.',
            'Con él, el Primer Resonador compuso la Sexta Especie.',
            'Con él, tú puedes componer algo diferente.',
            'No eliminar la disonancia. RESOLVERLA.'
        ];

        this.scene.launch('DialogScene', {
            lines: contrapunctusLines,
            onComplete: () => {
                // Mostrar prompt para iniciar puzzle
                this.showPuzzlePrompt();
            }
        });
    }

    showPuzzlePrompt() {
        const { width, height } = this.cameras.main;

        // Crear prompt visual
        const promptBox = this.add.graphics();
        promptBox.fillStyle(0x0f172a, 0.9);
        promptBox.fillRoundedRect(width / 2 - 200, height - 150, 400, 100, 8);
        promptBox.lineStyle(2, 0xa855f7, 0.8);
        promptBox.strokeRoundedRect(width / 2 - 200, height - 150, 400, 100, 8);

        this.add.text(width / 2, height - 115, 'EL CONTRAPUNCTUS', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '16px',
            fontWeight: '700',
            color: '#a855f7'
        }).setOrigin(0.5);

        this.add.text(width / 2, height - 90, 'Compón un contrapunto que resuelva a La Disonancia', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '12px',
            color: '#94a3b8'
        }).setOrigin(0.5);

        const startBtn = this.add.text(width / 2, height - 60, '[ ESPACIO ] Comenzar', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '14px',
            color: '#22c55e'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        // Pulso
        this.tweens.add({
            targets: startBtn,
            alpha: { from: 1, to: 0.5 },
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        // Input para comenzar
        this.input.keyboard.once('keydown-SPACE', () => {
            this.launchContrapunctus();
        });

        startBtn.on('pointerdown', () => {
            this.launchContrapunctus();
        });
    }

    launchContrapunctus() {
        // Lanzar la simulación Contrapunctus
        this.scene.launch('SimulationScene', {
            simulation: 'contrapunctus',
            realm: 'aether',
            onComplete: (completed) => {
                if (completed) {
                    this.showResolution();
                }
            }
        });
    }

    showResolution() {
        // La Disonancia se transforma
        const resolutionLines = [
            '...',
            'Esto es... resolución.',
            'Después de tanto tiempo...',
            'No desaparezco. No me destruyes.',
            'Me... completas.'
        ];

        this.scene.launch('DialogScene', {
            lines: resolutionLines,
            onComplete: () => {
                // Transformar visualmente La Disonancia
                this.tweens.add({
                    targets: this.disonanciaContainer,
                    scale: { from: 1, to: 0.1 },
                    alpha: { from: 1, to: 0 },
                    duration: 2000,
                    onComplete: () => {
                        this.showEigenvalorObtained();
                    }
                });

                // Cambiar color del ambiente
                this.tweens.add({
                    targets: this.cameras.main,
                    alpha: 1,
                    duration: 2000
                });
            }
        });
    }

    showEigenvalorObtained() {
        const { width, height } = this.cameras.main;

        // Eigenvalor λ₁₂ aparece
        const eigenvalor = this.add.text(width / 2, height / 2, 'λ₁₂', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '72px',
            fontWeight: '700',
            color: '#a855f7'
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: eigenvalor,
            alpha: 1,
            scale: { from: 0.5, to: 1.2 },
            duration: 1500,
            ease: 'Back.easeOut',
            onComplete: () => {
                // Registrar eigenvalor
                if (!gameState.isSimulationCompleted('contrapunctus')) {
                    gameState.completeSimulation('contrapunctus');
                }

                // Diálogo final
                this.time.delayedCall(2000, () => {
                    this.showFinalDialog();
                });
            }
        });
    }

    showFinalDialog() {
        const finalLines = [
            '...',
            'El Primer Resonador quiso crear perfección eliminando la imperfección.',
            'Tú has creado armonía integrándola.',
            'La Lira está completa. Las doce cuerdas vibran.',
            '...',
            'Es hora de volver a Aether.'
        ];

        this.scene.launch('DialogScene', {
            lines: finalLines,
            onComplete: () => {
                // Transición a Epílogo
                this.cameras.main.fadeOut(2000, 0, 0, 0);
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start('EpilogueScene');
                });
            }
        });
    }

    openPauseMenu() {
        this.scene.pause();
        this.scene.launch('PauseScene', { parentScene: 'DissonanceScene' });
    }

    update(time) {
        // Rotar fragmentos en órbita
        this.fragments.forEach(fragment => {
            fragment.orbitAngle += fragment.orbitSpeed;
            const centerX = this.cameras.main.width / 2;
            const centerY = this.cameras.main.height / 2;
            fragment.x = centerX + Math.cos(fragment.orbitAngle) * fragment.orbitRadius;
            fragment.y = centerY + Math.sin(fragment.orbitAngle) * fragment.orbitRadius;
            fragment.rotation += 0.002;
        });
    }
}
