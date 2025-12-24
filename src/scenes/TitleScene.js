/**
 * TitleScene - Pantalla de título del juego
 *
 * Primera pantalla que ve el jugador.
 * Opciones: Nuevo Juego, Continuar, Créditos
 */

import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, REALM_COLORS, UI_COLORS } from '../core/constants.js';
import gameState from '../systems/GameState.js';
import synthAudio from '../audio/SynthAudio.js';

export default class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
        this.particles = [];
    }

    create() {
        const { width, height } = this.cameras.main;

        // Inicializar audio (se activa en primera interacción del usuario)
        synthAudio.init();

        // Fondo
        this.createBackground();

        // Logo y título
        this.createTitle();

        // Botones del menú
        this.createMenu();

        // Versión
        this.add.text(width - 20, height - 20, 'v0.1.0', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '11px',
            color: '#374151'
        }).setOrigin(1, 1);

        // Créditos
        this.add.text(20, height - 20, 'Un viaje por EigenLab', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '11px',
            color: '#374151'
        }).setOrigin(0, 1);

        // Fade in
        this.cameras.main.fadeIn(1000);

        // Cualquier tecla para empezar (opcional)
        this.input.keyboard.on('keydown-ENTER', () => this.startGame());
        this.input.keyboard.on('keydown-SPACE', () => this.startGame());
    }

    createBackground() {
        const { width, height } = this.cameras.main;

        // Fondo base
        this.add.rectangle(width / 2, height / 2, width, height, UI_COLORS.background);

        // Gradiente central
        for (let i = 8; i > 0; i--) {
            const alpha = 0.02 * i;
            const radius = (Math.min(width, height) / 2) * (i / 8) * 2;
            this.add.circle(width / 2, height / 2, radius, REALM_COLORS.aether.primary, alpha);
        }

        // Partículas flotantes
        this.createFloatingParticles();

        // Anillos orbitales decorativos
        this.createOrbitalRings();
    }

    createFloatingParticles() {
        const { width, height } = this.cameras.main;

        // Crear partículas estáticas que se animarán
        for (let i = 0; i < 50; i++) {
            const x = Phaser.Math.Between(0, width);
            const y = Phaser.Math.Between(0, height);
            const size = Phaser.Math.Between(1, 3);
            const alpha = Phaser.Math.FloatBetween(0.1, 0.4);

            const particle = this.add.circle(x, y, size, 0xffffff, alpha);
            particle.baseY = y;
            particle.speed = Phaser.Math.FloatBetween(0.2, 0.8);
            particle.amplitude = Phaser.Math.Between(5, 20);
            particle.phase = Phaser.Math.FloatBetween(0, Math.PI * 2);
            this.particles.push(particle);
        }
    }

    createOrbitalRings() {
        const { width, height } = this.cameras.main;
        const centerX = width / 2;
        const centerY = height / 2 - 30;

        this.rings = [];

        // Crear anillos que representan los reinos
        const realmColors = [
            REALM_COLORS.cosmos.primary,
            REALM_COLORS.chaos.primary,
            REALM_COLORS.logos.primary,
            REALM_COLORS.aether.primary
        ];

        realmColors.forEach((color, i) => {
            const radius = 180 + i * 40;
            const ring = this.add.circle(centerX, centerY, radius, color, 0);
            ring.setStrokeStyle(1, color, 0.15);
            ring.rotationSpeed = 0.0002 * (i % 2 === 0 ? 1 : -1);
            this.rings.push(ring);
        });
    }

    createTitle() {
        const { width, height } = this.cameras.main;
        const centerY = height / 2 - 80;

        // Símbolo lambda grande
        this.add.text(width / 2, centerY - 60, 'λ', {
            fontFamily: 'Georgia, serif',
            fontSize: '72px',
            fontWeight: 'bold',
            color: '#a855f7'
        }).setOrigin(0.5);

        // Título principal
        const title = this.add.text(width / 2, centerY + 20, 'EIGENLAB', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '48px',
            fontWeight: '700',
            color: '#f8fafc'
        }).setOrigin(0.5);

        // Subtítulo
        const subtitle = this.add.text(width / 2, centerY + 70, 'O D Y S S E Y', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '24px',
            fontWeight: '300',
            letterSpacing: 12,
            color: '#a855f7'
        }).setOrigin(0.5);

        // Tagline
        this.add.text(width / 2, centerY + 110, 'Un viaje a través de los reinos del conocimiento', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '14px',
            color: '#64748b'
        }).setOrigin(0.5);

        // Animación sutil del título
        this.tweens.add({
            targets: title,
            alpha: { from: 0.9, to: 1 },
            duration: 2000,
            yoyo: true,
            repeat: -1
        });
    }

    createMenu() {
        const { width, height } = this.cameras.main;
        const menuY = height / 2 + 100;
        const buttonSpacing = 50;

        const hasSave = gameState.hasSaveData();

        // Botón Continuar (solo si hay save)
        if (hasSave) {
            const progress = gameState.getProgress();
            this.createButton(
                width / 2,
                menuY,
                'CONTINUAR',
                `${progress.eigenvalores}λ · ${progress.simulations.completed} exploraciones`,
                () => this.continueGame()
            );

            this.createButton(
                width / 2,
                menuY + buttonSpacing,
                'NUEVO VIAJE',
                'Comenzar desde el principio',
                () => this.confirmNewGame()
            );
        } else {
            this.createButton(
                width / 2,
                menuY,
                'COMENZAR VIAJE',
                'Adéntrate en los reinos del conocimiento',
                () => this.startGame()
            );
        }

        // Créditos
        this.createButton(
            width / 2,
            menuY + (hasSave ? buttonSpacing * 2 : buttonSpacing),
            'CRÉDITOS',
            '',
            () => this.showCredits(),
            true
        );
    }

    createButton(x, y, text, subtext, callback, small = false) {
        const container = this.add.container(x, y);

        // Texto principal
        const mainText = this.add.text(0, 0, text, {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: small ? '14px' : '18px',
            fontWeight: '600',
            color: '#f8fafc'
        }).setOrigin(0.5);
        container.add(mainText);

        // Subtexto
        if (subtext) {
            const sub = this.add.text(0, 22, subtext, {
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '11px',
                color: '#64748b'
            }).setOrigin(0.5);
            container.add(sub);
        }

        // Área interactiva
        const hitWidth = 300;
        const hitHeight = subtext ? 50 : 30;
        const hitArea = this.add.rectangle(0, subtext ? 10 : 0, hitWidth, hitHeight, 0x000000, 0);
        hitArea.setInteractive({ useHandCursor: true });
        container.add(hitArea);

        // Efectos hover
        hitArea.on('pointerover', () => {
            synthAudio.playHover();
            mainText.setColor('#a855f7');
            this.tweens.add({
                targets: container,
                scale: 1.05,
                duration: 100
            });
        });

        hitArea.on('pointerout', () => {
            mainText.setColor('#f8fafc');
            this.tweens.add({
                targets: container,
                scale: 1,
                duration: 100
            });
        });

        hitArea.on('pointerdown', () => {
            synthAudio.playSelect();
            synthAudio.resume(); // Asegurar que el contexto de audio esté activo
            callback();
        });

        return container;
    }

    startGame() {
        this.cameras.main.fadeOut(800, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            // Nuevo juego: iniciar secuencia cinematográfica
            this.scene.start('CinematicIntroScene');
        });
    }

    continueGame() {
        this.cameras.main.fadeOut(800, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('AetherHub');
        });
    }

    confirmNewGame() {
        // Mostrar confirmación
        const { width, height } = this.cameras.main;

        const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8);
        overlay.setDepth(100);

        const box = this.add.graphics();
        box.fillStyle(0x0f172a, 1);
        box.fillRoundedRect(width / 2 - 200, height / 2 - 80, 400, 160, 8);
        box.lineStyle(1, REALM_COLORS.aether.primary, 0.5);
        box.strokeRoundedRect(width / 2 - 200, height / 2 - 80, 400, 160, 8);
        box.setDepth(101);

        const title = this.add.text(width / 2, height / 2 - 50, '¿Comenzar nuevo viaje?', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '18px',
            fontWeight: '600',
            color: '#f8fafc'
        }).setOrigin(0.5).setDepth(102);

        const desc = this.add.text(width / 2, height / 2 - 20, 'Se perderá todo el progreso actual', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '13px',
            color: '#94a3b8'
        }).setOrigin(0.5).setDepth(102);

        // Botón Sí
        const yesBtn = this.add.text(width / 2 - 60, height / 2 + 30, 'SÍ, REINICIAR', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '14px',
            color: '#ef4444'
        }).setOrigin(0.5).setDepth(102).setInteractive({ useHandCursor: true });

        yesBtn.on('pointerover', () => yesBtn.setColor('#f87171'));
        yesBtn.on('pointerout', () => yesBtn.setColor('#ef4444'));
        yesBtn.on('pointerdown', () => {
            gameState.reset();
            this.startGame();
        });

        // Botón No
        const noBtn = this.add.text(width / 2 + 60, height / 2 + 30, 'CANCELAR', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '14px',
            color: '#94a3b8'
        }).setOrigin(0.5).setDepth(102).setInteractive({ useHandCursor: true });

        noBtn.on('pointerover', () => noBtn.setColor('#f8fafc'));
        noBtn.on('pointerout', () => noBtn.setColor('#94a3b8'));
        noBtn.on('pointerdown', () => {
            overlay.destroy();
            box.destroy();
            title.destroy();
            desc.destroy();
            yesBtn.destroy();
            noBtn.destroy();
        });
    }

    showCredits() {
        const { width, height } = this.cameras.main;

        const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.9);
        overlay.setDepth(100).setInteractive();

        const credits = [
            'EIGENLAB ODYSSEY',
            '',
            'Un viaje a través de los reinos del conocimiento',
            '',
            '─────────────────',
            '',
            'Concepto y Desarrollo',
            'Carlos',
            '',
            'Motor de Juego',
            'Phaser 3',
            '',
            'Simulaciones',
            'EigenLab',
            '',
            '─────────────────',
            '',
            '"En el principio fue el patrón.',
            'Y el patrón se hizo número.',
            'Y el número se hizo mundo."',
            '',
            '',
            'Click para cerrar'
        ];

        const creditsText = this.add.text(width / 2, height / 2, credits.join('\n'), {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '14px',
            color: '#94a3b8',
            align: 'center',
            lineSpacing: 6
        }).setOrigin(0.5).setDepth(101);

        overlay.on('pointerdown', () => {
            overlay.destroy();
            creditsText.destroy();
        });
    }

    update(time) {
        // Animar partículas
        this.particles.forEach(p => {
            p.y = p.baseY + Math.sin(time * 0.001 * p.speed + p.phase) * p.amplitude;
        });

        // Animar anillos
        if (this.rings) {
            this.rings.forEach(ring => {
                ring.rotation += ring.rotationSpeed;
            });
        }
    }
}
