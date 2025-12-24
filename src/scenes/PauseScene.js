/**
 * PauseScene - Menú de pausa
 *
 * Se superpone a la escena actual sin detenerla.
 * Opciones: Continuar, Ver Progreso, Volver al Título
 */

import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, REALM_COLORS, UI_COLORS } from '../core/constants.js';
import gameState from '../systems/GameState.js';

export default class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseScene' });
    }

    init(data) {
        this.parentScene = data.parentScene || 'AetherHub';
    }

    create() {
        const { width, height } = this.cameras.main;

        // Overlay
        this.overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.85);

        // Panel central
        this.createPanel();

        // Progreso
        this.createProgressDisplay();

        // Botones
        this.createButtons();

        // ESC para cerrar
        this.input.keyboard.on('keydown-ESC', () => this.resume());
    }

    createPanel() {
        const { width, height } = this.cameras.main;

        const panelWidth = 500;
        const panelHeight = 400;
        const panelX = (width - panelWidth) / 2;
        const panelY = (height - panelHeight) / 2;

        const panel = this.add.graphics();
        panel.fillStyle(0x0f172a, 0.98);
        panel.fillRoundedRect(panelX, panelY, panelWidth, panelHeight, 12);
        panel.lineStyle(1, REALM_COLORS.aether.primary, 0.4);
        panel.strokeRoundedRect(panelX, panelY, panelWidth, panelHeight, 12);

        // Título
        this.add.text(width / 2, panelY + 35, 'PAUSA', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '24px',
            fontWeight: '700',
            color: '#f8fafc'
        }).setOrigin(0.5);
    }

    createProgressDisplay() {
        const { width, height } = this.cameras.main;
        const progress = gameState.getProgress();

        const startY = height / 2 - 100;

        // Eigenvalores
        this.add.text(width / 2 - 100, startY, 'λ', {
            fontFamily: 'Georgia, serif',
            fontSize: '36px',
            color: '#a855f7'
        }).setOrigin(0.5);

        this.add.text(width / 2 - 40, startY - 10, progress.eigenvalores.toString(), {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '32px',
            fontWeight: '700',
            color: '#f8fafc'
        });

        this.add.text(width / 2 - 40, startY + 15, 'Eigenvalores', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '12px',
            color: '#64748b'
        });

        // Simulaciones
        this.add.text(width / 2 + 80, startY - 10, `${progress.simulations.completed}`, {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '32px',
            fontWeight: '700',
            color: '#22c55e'
        });

        this.add.text(width / 2 + 80, startY + 15, `/ ${progress.simulations.total} sims`, {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '12px',
            color: '#64748b'
        });

        // Barra de progreso general
        const barY = startY + 60;
        const barWidth = 300;

        this.add.text(width / 2 - barWidth / 2, barY, 'Progreso general', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '11px',
            color: '#64748b'
        });

        const bgBar = this.add.graphics();
        bgBar.fillStyle(0x1e293b, 1);
        bgBar.fillRoundedRect(width / 2 - barWidth / 2, barY + 18, barWidth, 8, 4);

        const progressBar = this.add.graphics();
        progressBar.fillStyle(REALM_COLORS.aether.primary, 1);
        progressBar.fillRoundedRect(
            width / 2 - barWidth / 2,
            barY + 18,
            barWidth * (progress.simulations.percentage / 100),
            8,
            4
        );

        this.add.text(width / 2 + barWidth / 2, barY, `${progress.simulations.percentage}%`, {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '11px',
            color: '#94a3b8'
        }).setOrigin(1, 0);

        // Conexiones descubiertas
        const connY = barY + 50;
        this.add.text(width / 2, connY, `${progress.connections.discovered}/${progress.connections.total} conexiones descubiertas`, {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '13px',
            color: '#fbbf24'
        }).setOrigin(0.5);

        // Reinos visitados
        this.add.text(width / 2, connY + 25, `${progress.realms.visited}/${progress.realms.total} reinos visitados`, {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '13px',
            color: '#94a3b8'
        }).setOrigin(0.5);
    }

    createButtons() {
        const { width, height } = this.cameras.main;
        const buttonY = height / 2 + 100;
        const buttonSpacing = 45;

        // Continuar
        this.createButton(width / 2, buttonY, 'CONTINUAR', '#22c55e', () => this.resume());

        // Volver al título
        this.createButton(width / 2, buttonY + buttonSpacing, 'VOLVER AL TÍTULO', '#94a3b8', () => this.returnToTitle());

        // Instrucciones
        this.add.text(width / 2, buttonY + buttonSpacing * 2 + 10, 'ESC para continuar', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '11px',
            color: '#475569'
        }).setOrigin(0.5);
    }

    createButton(x, y, text, color, callback) {
        const btn = this.add.text(x, y, text, {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '16px',
            fontWeight: '600',
            color: color
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        btn.on('pointerover', () => btn.setColor('#ffffff'));
        btn.on('pointerout', () => btn.setColor(color));
        btn.on('pointerdown', callback);

        return btn;
    }

    resume() {
        this.scene.stop();
        this.scene.resume(this.parentScene);
    }

    returnToTitle() {
        this.scene.stop(this.parentScene);
        this.scene.stop();
        this.scene.start('TitleScene');
    }
}
