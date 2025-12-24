/**
 * NotificationManager - Sistema de notificaciones visuales
 *
 * Muestra popups elegantes para:
 * - Conexión descubierta
 * - Camino completado
 * - Reino desbloqueado
 * - Achievements
 */

import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, REALM_COLORS, UI_COLORS } from '../core/constants.js';
import { CONCEPTS, LEARNING_PATHS } from '../data/knowledgeGraph.js';
import gameState from '../systems/GameState.js';

export default class NotificationManager {
    constructor(scene) {
        this.scene = scene;
        this.queue = [];
        this.isShowing = false;
        this.currentNotification = null;

        // Suscribirse a eventos del GameState
        this.setupListeners();
    }

    setupListeners() {
        gameState.on('connection-discovered', (connection) => {
            this.queueNotification({
                type: 'connection',
                data: connection
            });
        });

        gameState.on('realms-unlocked', (realms) => {
            realms.forEach(realm => {
                this.queueNotification({
                    type: 'realm-unlocked',
                    data: { realm }
                });
            });
        });

        gameState.on('path-completed', ({ pathId, reward }) => {
            const path = LEARNING_PATHS[pathId];
            if (path) {
                this.queueNotification({
                    type: 'path-completed',
                    data: { path, reward }
                });
            }
        });
    }

    queueNotification(notification) {
        this.queue.push(notification);
        if (!this.isShowing) {
            this.showNext();
        }
    }

    showNext() {
        if (this.queue.length === 0) {
            this.isShowing = false;
            return;
        }

        this.isShowing = true;
        const notification = this.queue.shift();

        switch (notification.type) {
            case 'connection':
                this.showConnectionNotification(notification.data);
                break;
            case 'realm-unlocked':
                this.showRealmUnlockedNotification(notification.data);
                break;
            case 'path-completed':
                this.showPathCompletedNotification(notification.data);
                break;
            default:
                this.showNext();
        }
    }

    showConnectionNotification(connection) {
        const { width, height } = this.scene.cameras.main;

        // Container
        const container = this.scene.add.container(width / 2, -150);
        container.setDepth(1000);
        container.setScrollFactor(0);

        // Fondo
        const bg = this.scene.add.graphics();
        bg.fillStyle(0x0f172a, 0.98);
        bg.fillRoundedRect(-200, -60, 400, 120, 12);

        // Borde con gradiente
        const realms = connection.realms || [];
        const color1 = REALM_COLORS[realms[0]]?.primary || 0xa855f7;
        const color2 = REALM_COLORS[realms[1]]?.primary || 0x3b82f6;

        bg.lineStyle(2, color1, 0.8);
        bg.strokeRoundedRect(-200, -60, 400, 120, 12);
        container.add(bg);

        // Icono
        const icon = this.scene.add.text(0, -35, '🔗', {
            fontSize: '28px'
        }).setOrigin(0.5);
        container.add(icon);

        // Título
        const title = this.scene.add.text(0, -5, 'CONEXIÓN DESCUBIERTA', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '12px',
            fontWeight: '700',
            color: '#a855f7'
        }).setOrigin(0.5);
        container.add(title);

        // Nombre de la conexión
        const name = this.scene.add.text(0, 18, connection.name, {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '16px',
            fontWeight: '600',
            color: '#f8fafc'
        }).setOrigin(0.5);
        container.add(name);

        // Descripción
        const desc = this.scene.add.text(0, 42, connection.description, {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '11px',
            color: '#94a3b8',
            align: 'center'
        }).setOrigin(0.5);
        container.add(desc);

        // Animación entrada
        this.scene.tweens.add({
            targets: container,
            y: 100,
            duration: 500,
            ease: 'Back.out'
        });

        // Salida después de 4 segundos
        this.scene.time.delayedCall(4000, () => {
            this.scene.tweens.add({
                targets: container,
                y: -150,
                alpha: 0,
                duration: 400,
                ease: 'Power2',
                onComplete: () => {
                    container.destroy();
                    this.showNext();
                }
            });
        });

        this.currentNotification = container;
    }

    showRealmUnlockedNotification(data) {
        const { width, height } = this.scene.cameras.main;
        const realmColor = REALM_COLORS[data.realm]?.primary || 0xa855f7;
        const colorHex = `#${realmColor.toString(16).padStart(6, '0')}`;

        // Container
        const container = this.scene.add.container(width / 2, -150);
        container.setDepth(1000);
        container.setScrollFactor(0);

        // Fondo con glow
        const glow = this.scene.add.graphics();
        glow.fillStyle(realmColor, 0.2);
        glow.fillRoundedRect(-220, -70, 440, 140, 16);
        container.add(glow);

        const bg = this.scene.add.graphics();
        bg.fillStyle(0x0f172a, 0.98);
        bg.fillRoundedRect(-200, -60, 400, 120, 12);
        bg.lineStyle(2, realmColor, 0.8);
        bg.strokeRoundedRect(-200, -60, 400, 120, 12);
        container.add(bg);

        // Icono
        const icon = this.scene.add.text(0, -35, '🌟', {
            fontSize: '28px'
        }).setOrigin(0.5);
        container.add(icon);

        // Título
        const title = this.scene.add.text(0, -5, 'REINO DESBLOQUEADO', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '12px',
            fontWeight: '700',
            color: colorHex
        }).setOrigin(0.5);
        container.add(title);

        // Nombre del reino
        const name = this.scene.add.text(0, 18, data.realm.toUpperCase(), {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '20px',
            fontWeight: '700',
            color: '#f8fafc'
        }).setOrigin(0.5);
        container.add(name);

        // Descripción
        const desc = this.scene.add.text(0, 42, 'Un nuevo reino te espera por explorar', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '11px',
            color: '#94a3b8'
        }).setOrigin(0.5);
        container.add(desc);

        // Animación entrada con partículas
        this.scene.tweens.add({
            targets: container,
            y: 100,
            duration: 600,
            ease: 'Back.out'
        });

        // Pulso del glow
        this.scene.tweens.add({
            targets: glow,
            alpha: { from: 1, to: 0.5 },
            scale: { from: 1, to: 1.1 },
            duration: 800,
            yoyo: true,
            repeat: 2
        });

        // Salida después de 5 segundos
        this.scene.time.delayedCall(5000, () => {
            this.scene.tweens.add({
                targets: container,
                y: -150,
                alpha: 0,
                duration: 400,
                ease: 'Power2',
                onComplete: () => {
                    container.destroy();
                    this.showNext();
                }
            });
        });

        this.currentNotification = container;
    }

    showPathCompletedNotification(data) {
        const { path, reward } = data;
        const { width, height } = this.scene.cameras.main;
        const colorHex = `#${path.color.toString(16).padStart(6, '0')}`;

        // Container más grande para este logro especial
        const container = this.scene.add.container(width / 2, height / 2);
        container.setDepth(1000);
        container.setScrollFactor(0);
        container.setAlpha(0);
        container.setScale(0.8);

        // Fondo oscuro detrás
        const overlay = this.scene.add.rectangle(0, 0, width, height, 0x000000, 0.7);
        container.add(overlay);

        // Panel central
        const bg = this.scene.add.graphics();
        bg.fillStyle(0x0f172a, 0.98);
        bg.fillRoundedRect(-250, -150, 500, 300, 16);

        // Borde brillante
        bg.lineStyle(3, path.color, 1);
        bg.strokeRoundedRect(-250, -150, 500, 300, 16);
        container.add(bg);

        // Glow pulsante
        const glow = this.scene.add.graphics();
        glow.fillStyle(path.color, 0.15);
        glow.fillRoundedRect(-260, -160, 520, 320, 20);
        container.add(glow);

        // Icono grande
        const icon = this.scene.add.text(0, -100, path.icon, {
            fontSize: '48px'
        }).setOrigin(0.5);
        container.add(icon);

        // Título
        const title = this.scene.add.text(0, -50, 'CAMINO COMPLETADO', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '14px',
            fontWeight: '700',
            color: colorHex
        }).setOrigin(0.5);
        container.add(title);

        // Nombre del camino
        const name = this.scene.add.text(0, -20, path.name, {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '24px',
            fontWeight: '700',
            color: '#f8fafc'
        }).setOrigin(0.5);
        container.add(name);

        // Descripción
        const desc = this.scene.add.text(0, 15, path.description, {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '12px',
            color: '#94a3b8'
        }).setOrigin(0.5);
        container.add(desc);

        // Recompensa
        if (reward) {
            const rewardBg = this.scene.add.graphics();
            rewardBg.fillStyle(path.color, 0.15);
            rewardBg.fillRoundedRect(-150, 45, 300, 50, 8);
            container.add(rewardBg);

            const rewardTitle = this.scene.add.text(0, 55, reward.title, {
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '13px',
                fontWeight: '600',
                color: colorHex
            }).setOrigin(0.5);
            container.add(rewardTitle);

            const rewardValue = this.scene.add.text(0, 78, `+${reward.eigenvalores}λ Eigenvalores`, {
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '11px',
                color: '#a855f7'
            }).setOrigin(0.5);
            container.add(rewardValue);
        }

        // Insight
        if (reward?.insight) {
            const insightText = this.scene.add.text(0, 115, `"${reward.insight}"`, {
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '11px',
                fontStyle: 'italic',
                color: '#64748b',
                wordWrap: { width: 400 },
                align: 'center'
            }).setOrigin(0.5);
            container.add(insightText);
        }

        // Animación de entrada épica
        this.scene.tweens.add({
            targets: container,
            alpha: 1,
            scale: 1,
            duration: 500,
            ease: 'Back.out'
        });

        // Pulso del glow
        this.scene.tweens.add({
            targets: glow,
            alpha: { from: 1, to: 0.3 },
            scale: { from: 1, to: 1.05 },
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

        // Rotación del icono
        this.scene.tweens.add({
            targets: icon,
            angle: { from: -5, to: 5 },
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.inOut'
        });

        // Click para cerrar
        overlay.setInteractive();
        overlay.on('pointerdown', () => {
            this.scene.tweens.add({
                targets: container,
                alpha: 0,
                scale: 0.8,
                duration: 300,
                onComplete: () => {
                    container.destroy();
                    this.showNext();
                }
            });
        });

        // Auto-cerrar después de 8 segundos
        this.scene.time.delayedCall(8000, () => {
            if (container.active) {
                this.scene.tweens.add({
                    targets: container,
                    alpha: 0,
                    scale: 0.8,
                    duration: 300,
                    onComplete: () => {
                        container.destroy();
                        this.showNext();
                    }
                });
            }
        });

        this.currentNotification = container;
    }

    destroy() {
        gameState.off('connection-discovered');
        gameState.off('realms-unlocked');
        gameState.off('path-completed');

        if (this.currentNotification) {
            this.currentNotification.destroy();
        }
    }
}
