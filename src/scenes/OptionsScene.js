/**
 * OptionsScene - M7.3 Menú de opciones y accesibilidad
 *
 * Permite configurar audio, visual y controles.
 */

import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, UI_COLORS, REALM_COLORS } from '../core/constants.js';
import accessibilityManager from '../systems/AccessibilityManager.js';
import synthAudio from '../audio/SynthAudio.js';

export default class OptionsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'OptionsScene' });
        this.parentScene = null;
        this.options = [];
        this.selectedIndex = 0;
    }

    init(data) {
        this.parentScene = data.parentScene || 'TitleScene';
    }

    create() {
        const { width, height } = this.cameras.main;

        // Fondo
        this.add.rectangle(width / 2, height / 2, width, height, UI_COLORS.background, 0.95);

        // Título
        this.add.text(width / 2, 60, 'OPCIONES', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '28px',
            fontWeight: '700',
            color: '#a855f7'
        }).setOrigin(0.5);

        // Crear secciones
        this.createAudioSection(150);
        this.createVisualSection(300);
        this.createGameplaySection(450);

        // Botón volver
        const backBtn = this.add.text(width / 2, height - 60, '[ ESC ] Volver', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '14px',
            color: '#64748b'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        backBtn.on('pointerover', () => backBtn.setColor('#ffffff'));
        backBtn.on('pointerout', () => backBtn.setColor('#64748b'));
        backBtn.on('pointerdown', () => this.close());

        // Input
        this.input.keyboard.on('keydown-ESC', () => this.close());

        // Fade in
        this.cameras.main.fadeIn(200);
    }

    createAudioSection(startY) {
        const { width } = this.cameras.main;
        const leftX = width / 2 - 200;
        const rightX = width / 2 + 150;

        // Header
        this.add.text(width / 2, startY, 'AUDIO', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '16px',
            fontWeight: '600',
            color: '#94a3b8'
        }).setOrigin(0.5);

        // Volumen Master
        this.createSlider(leftX, startY + 40, 'Volumen', 'masterVolume', 0, 1);

        // Música
        this.createToggle(leftX, startY + 80, 'Música', 'music');

        // Efectos de sonido
        this.createToggle(rightX, startY + 80, 'Efectos', 'soundEffects');
    }

    createVisualSection(startY) {
        const { width } = this.cameras.main;
        const leftX = width / 2 - 200;
        const rightX = width / 2 + 150;

        // Header
        this.add.text(width / 2, startY, 'VISUAL', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '16px',
            fontWeight: '600',
            color: '#94a3b8'
        }).setOrigin(0.5);

        // Alto contraste
        this.createToggle(leftX, startY + 40, 'Alto Contraste', 'highContrast');

        // Texto grande
        this.createToggle(rightX, startY + 40, 'Texto Grande', 'largeText');

        // Reducir movimiento
        this.createToggle(leftX, startY + 80, 'Reducir Movimiento', 'reducedMotion');

        // Modo daltonismo
        this.createSelector(rightX, startY + 80, 'Daltonismo', 'colorblindMode', [
            { value: 'none', label: 'Ninguno' },
            { value: 'protanopia', label: 'Protanopia' },
            { value: 'deuteranopia', label: 'Deuteranopia' },
            { value: 'tritanopia', label: 'Tritanopia' }
        ]);
    }

    createGameplaySection(startY) {
        const { width } = this.cameras.main;
        const leftX = width / 2 - 200;
        const rightX = width / 2 + 150;

        // Header
        this.add.text(width / 2, startY, 'JUEGO', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '16px',
            fontWeight: '600',
            color: '#94a3b8'
        }).setOrigin(0.5);

        // Velocidad de diálogo
        this.createSlider(leftX, startY + 40, 'Velocidad Diálogo', 'dialogSpeed', 10, 60);

        // Mostrar hints
        this.createToggle(rightX, startY + 40, 'Mostrar Ayudas', 'showHints');

        // Subtítulos
        this.createToggle(leftX, startY + 80, 'Subtítulos', 'subtitles');

        // Reset tutorial
        const resetBtn = this.add.text(rightX + 50, startY + 80, 'Resetear Tutorial', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '12px',
            color: '#f87171',
            backgroundColor: '#1e293b',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        resetBtn.on('pointerover', () => resetBtn.setColor('#ffffff'));
        resetBtn.on('pointerout', () => resetBtn.setColor('#f87171'));
        resetBtn.on('pointerdown', () => {
            localStorage.removeItem('eigenlab-tutorial-seen');
            this.showConfirmation('Tutorial reseteado');
        });
    }

    createToggle(x, y, label, settingKey) {
        const value = accessibilityManager.get(settingKey);

        const labelText = this.add.text(x, y, label, {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '13px',
            color: '#e2e8f0'
        }).setOrigin(0, 0.5);

        const toggle = this.add.text(x + 150, y, value ? 'ON' : 'OFF', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '13px',
            fontWeight: '600',
            color: value ? '#22c55e' : '#64748b'
        }).setOrigin(0, 0.5).setInteractive({ useHandCursor: true });

        toggle.on('pointerdown', () => {
            const newValue = accessibilityManager.toggle(settingKey);
            toggle.setText(newValue ? 'ON' : 'OFF');
            toggle.setColor(newValue ? '#22c55e' : '#64748b');
            synthAudio.playSelect();
        });

        toggle.on('pointerover', () => {
            synthAudio.playHover();
        });
    }

    createSlider(x, y, label, settingKey, min, max) {
        const value = accessibilityManager.get(settingKey);
        const normalizedValue = (value - min) / (max - min);

        this.add.text(x, y, label, {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '13px',
            color: '#e2e8f0'
        }).setOrigin(0, 0.5);

        // Barra de fondo
        const barWidth = 100;
        const barHeight = 8;
        const barX = x + 130;

        const bgBar = this.add.rectangle(barX, y, barWidth, barHeight, 0x1e293b);
        bgBar.setOrigin(0, 0.5);

        // Barra de valor
        const valueBar = this.add.rectangle(barX, y, barWidth * normalizedValue, barHeight, REALM_COLORS.aether.primary);
        valueBar.setOrigin(0, 0.5);

        // Área interactiva
        const hitArea = this.add.rectangle(barX + barWidth / 2, y, barWidth + 20, barHeight + 20, 0x000000, 0);
        hitArea.setInteractive({ useHandCursor: true });

        const valueText = this.add.text(barX + barWidth + 15, y, Math.round(value * 100) + '%', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '11px',
            color: '#94a3b8'
        }).setOrigin(0, 0.5);

        hitArea.on('pointerdown', (pointer) => {
            const relativeX = pointer.x - barX;
            const newNormalized = Math.max(0, Math.min(1, relativeX / barWidth));
            const newValue = min + newNormalized * (max - min);

            accessibilityManager.set(settingKey, newValue);
            valueBar.setSize(barWidth * newNormalized, barHeight);

            if (settingKey === 'masterVolume') {
                synthAudio.setVolume(newValue);
                valueText.setText(Math.round(newValue * 100) + '%');
            } else if (settingKey === 'dialogSpeed') {
                valueText.setText(Math.round(newValue) + 'ms');
            }

            synthAudio.playSelect();
        });
    }

    createSelector(x, y, label, settingKey, options) {
        const value = accessibilityManager.get(settingKey);
        const currentOption = options.find(o => o.value === value) || options[0];

        this.add.text(x, y, label, {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '13px',
            color: '#e2e8f0'
        }).setOrigin(0, 0.5);

        const selector = this.add.text(x + 100, y, currentOption.label, {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '12px',
            color: '#a855f7',
            backgroundColor: '#1e293b',
            padding: { x: 8, y: 4 }
        }).setOrigin(0, 0.5).setInteractive({ useHandCursor: true });

        let currentIndex = options.findIndex(o => o.value === value);

        selector.on('pointerdown', () => {
            currentIndex = (currentIndex + 1) % options.length;
            const newOption = options[currentIndex];
            accessibilityManager.set(settingKey, newOption.value);
            selector.setText(newOption.label);
            synthAudio.playSelect();
        });

        selector.on('pointerover', () => {
            synthAudio.playHover();
        });
    }

    showConfirmation(message) {
        const { width, height } = this.cameras.main;

        const text = this.add.text(width / 2, height - 120, message, {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '14px',
            color: '#22c55e'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: text,
            alpha: 0,
            y: height - 140,
            duration: 1500,
            delay: 500,
            onComplete: () => text.destroy()
        });
    }

    close() {
        this.cameras.main.fadeOut(200);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            if (this.parentScene === 'PauseScene') {
                this.scene.stop();
                this.scene.resume('PauseScene');
            } else {
                this.scene.stop();
            }
        });
    }
}
