/**
 * ProgressUI - Componente de UI para mostrar progreso del juego
 *
 * Muestra:
 * - Eigenvalores actuales
 * - Reino actual
 * - Notificaciones de desbloqueo
 */

import Phaser from 'phaser';
import { REALM_COLORS, UI_COLORS } from '../core/constants.js';
import gameState from '../systems/GameState.js';

export default class ProgressUI {
    constructor(scene) {
        this.scene = scene;
        this.container = null;
        this.eigenText = null;
        this.realmText = null;
        this.notificationQueue = [];
        this.isShowingNotification = false;

        this.create();
        this.setupListeners();
    }

    create() {
        const { width, height } = this.scene.cameras.main;

        // Container principal
        this.container = this.scene.add.container(0, 0);
        this.container.setDepth(1000);

        // Panel superior derecho - Eigenvalores
        this.createEigenPanel(width);

        // Panel superior izquierdo - Reino (se crea en las escenas)

        // Área de notificaciones (centro superior)
        this.notificationText = this.scene.add.text(width / 2, -50, '', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '16px',
            fontWeight: '600',
            color: '#fbbf24',
            align: 'center'
        }).setOrigin(0.5);
        this.container.add(this.notificationText);

        // Subtítulo de notificación
        this.notificationSubtext = this.scene.add.text(width / 2, -25, '', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '12px',
            color: '#94a3b8',
            align: 'center'
        }).setOrigin(0.5);
        this.container.add(this.notificationSubtext);
    }

    createEigenPanel(width) {
        // Fondo del panel
        const panelWidth = 160;
        const panelHeight = 50;
        const panelX = width - panelWidth - 20;
        const panelY = 15;

        const panelBg = this.scene.add.graphics();
        panelBg.fillStyle(0x0f172a, 0.8);
        panelBg.fillRoundedRect(panelX, panelY, panelWidth, panelHeight, 6);
        panelBg.lineStyle(1, 0xa855f7, 0.3);
        panelBg.strokeRoundedRect(panelX, panelY, panelWidth, panelHeight, 6);
        this.container.add(panelBg);

        // Icono de eigenvalor (símbolo lambda estilizado)
        const icon = this.scene.add.text(panelX + 15, panelY + panelHeight / 2, 'λ', {
            fontFamily: 'Georgia, serif',
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#a855f7'
        }).setOrigin(0, 0.5);
        this.container.add(icon);

        // Contador
        this.eigenText = this.scene.add.text(panelX + 45, panelY + 12, '0', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '20px',
            fontWeight: '700',
            color: '#f8fafc'
        });
        this.container.add(this.eigenText);

        // Label
        const label = this.scene.add.text(panelX + 45, panelY + 34, 'Eigenvalores', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '10px',
            color: '#64748b'
        });
        this.container.add(label);

        // Actualizar con valor actual
        this.updateEigenCount();
    }

    setupListeners() {
        // Escuchar cambios en el estado
        gameState.on('eigenvalor-change', (value) => {
            this.updateEigenCount(value);
            this.pulseEigen();
        });

        gameState.on('realms-unlocked', (realms) => {
            realms.forEach(realm => {
                this.queueNotification(
                    `¡${realm.toUpperCase()} DESBLOQUEADO!`,
                    'Un nuevo reino te espera',
                    REALM_COLORS[realm]?.primary || 0xa855f7
                );
            });
        });

        gameState.on('connection-discovered', (connection) => {
            this.queueNotification(
                `CONEXIÓN: ${connection.name}`,
                connection.description,
                0xfbbf24
            );
        });

        gameState.on('simulation-complete', ({ simId }) => {
            this.queueNotification(
                '+1 EIGENVALOR',
                `${simId} completada`,
                0x22c55e
            );
        });
    }

    updateEigenCount(value) {
        const count = value ?? gameState.getEigenvalores();
        if (this.eigenText) {
            this.eigenText.setText(count.toString());
        }
    }

    pulseEigen() {
        if (this.eigenText) {
            this.scene.tweens.add({
                targets: this.eigenText,
                scale: { from: 1.3, to: 1 },
                duration: 300,
                ease: 'Back.out'
            });
        }
    }

    queueNotification(title, subtitle, color = 0xfbbf24) {
        this.notificationQueue.push({ title, subtitle, color });
        if (!this.isShowingNotification) {
            this.showNextNotification();
        }
    }

    showNextNotification() {
        if (this.notificationQueue.length === 0) {
            this.isShowingNotification = false;
            return;
        }

        this.isShowingNotification = true;
        const { title, subtitle, color } = this.notificationQueue.shift();

        const colorHex = `#${color.toString(16).padStart(6, '0')}`;
        this.notificationText.setText(title);
        this.notificationText.setColor(colorHex);
        this.notificationSubtext.setText(subtitle);

        // Animación de entrada
        this.scene.tweens.add({
            targets: [this.notificationText, this.notificationSubtext],
            y: '+=80',
            alpha: { from: 0, to: 1 },
            duration: 400,
            ease: 'Back.out',
            onComplete: () => {
                // Mantener visible
                this.scene.time.delayedCall(2500, () => {
                    // Animación de salida
                    this.scene.tweens.add({
                        targets: [this.notificationText, this.notificationSubtext],
                        y: '-=80',
                        alpha: 0,
                        duration: 300,
                        ease: 'Cubic.in',
                        onComplete: () => {
                            this.showNextNotification();
                        }
                    });
                });
            }
        });
    }

    destroy() {
        if (this.container) {
            this.container.destroy();
        }
    }
}
