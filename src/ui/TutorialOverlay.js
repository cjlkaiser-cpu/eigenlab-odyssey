/**
 * TutorialOverlay - M7.3 Sistema de tutorial contextual
 *
 * Muestra hints y guías para nuevos jugadores.
 */

import Phaser from 'phaser';
import { UI_COLORS, REALM_COLORS } from '../core/constants.js';
import gameState from '../systems/GameState.js';

// Definición de hints contextuales
const TUTORIAL_HINTS = {
    'first-start': {
        title: 'Bienvenido a EigenLab Odyssey',
        message: 'Usa WASD para moverte y E para interactuar.',
        position: 'center',
        arrow: null
    },
    'first-portal': {
        title: 'Portal de Reino',
        message: 'Acércate a un portal y presiona E para entrar.',
        position: 'bottom',
        arrow: 'up'
    },
    'first-simulation': {
        title: 'Simulación',
        message: 'Haz clic en una simulación para explorarla.',
        position: 'top',
        arrow: 'down'
    },
    'first-eigenvalor': {
        title: 'Eigenvalor Obtenido',
        message: 'Los λ desbloquean cuerdas de la Lira y nuevos reinos.',
        position: 'center',
        arrow: null
    },
    'first-graph': {
        title: 'Grafo de Conocimiento',
        message: 'Presiona G para ver las conexiones entre conceptos.',
        position: 'bottom-right',
        arrow: null
    },
    'lira-hint': {
        title: 'La Lira',
        message: 'Acércate a la Lira y presiona E para examinarla.',
        position: 'center',
        arrow: 'down'
    },
    'resonance-hint': {
        title: 'Resonancia',
        message: 'Explorar simulaciones aumenta tu resonancia (+5%).',
        position: 'top-right',
        arrow: null
    }
};

export default class TutorialOverlay {
    constructor(scene) {
        this.scene = scene;
        this.container = null;
        this.currentHint = null;
        this.isShowing = false;
        this.seenHints = this.loadSeenHints();
    }

    /**
     * Carga los hints ya vistos desde localStorage
     */
    loadSeenHints() {
        try {
            const saved = localStorage.getItem('eigenlab-tutorial-seen');
            return saved ? new Set(JSON.parse(saved)) : new Set();
        } catch (e) {
            return new Set();
        }
    }

    /**
     * Guarda los hints vistos
     */
    saveSeenHints() {
        try {
            localStorage.setItem('eigenlab-tutorial-seen',
                JSON.stringify([...this.seenHints]));
        } catch (e) { }
    }

    /**
     * Muestra un hint si no se ha visto antes
     */
    showHint(hintId, targetX = null, targetY = null) {
        if (this.seenHints.has(hintId)) return false;
        if (this.isShowing) return false;

        const hint = TUTORIAL_HINTS[hintId];
        if (!hint) return false;

        this.isShowing = true;
        this.currentHint = hintId;

        const { width, height } = this.scene.cameras.main;

        // Container principal
        this.container = this.scene.add.container(0, 0);
        this.container.setDepth(1500);
        this.container.setScrollFactor(0);

        // Overlay semi-transparente
        const overlay = this.scene.add.rectangle(
            width / 2, height / 2, width, height, 0x000000, 0.5
        );
        overlay.setInteractive();
        this.container.add(overlay);

        // Calcular posición del hint
        let hintX = width / 2;
        let hintY = height / 2;

        switch (hint.position) {
            case 'top':
                hintY = 120;
                break;
            case 'bottom':
                hintY = height - 120;
                break;
            case 'top-right':
                hintX = width - 180;
                hintY = 100;
                break;
            case 'bottom-right':
                hintX = width - 180;
                hintY = height - 100;
                break;
            case 'center':
            default:
                hintX = width / 2;
                hintY = height / 2;
        }

        // Caja del hint
        const boxWidth = 320;
        const boxHeight = 120;

        const box = this.scene.add.graphics();
        box.fillStyle(0x0f172a, 0.95);
        box.fillRoundedRect(hintX - boxWidth / 2, hintY - boxHeight / 2, boxWidth, boxHeight, 12);
        box.lineStyle(2, REALM_COLORS.aether.primary, 0.8);
        box.strokeRoundedRect(hintX - boxWidth / 2, hintY - boxHeight / 2, boxWidth, boxHeight, 12);
        this.container.add(box);

        // Flecha si aplica
        if (hint.arrow && targetX !== null && targetY !== null) {
            this.drawArrow(hintX, hintY, targetX, targetY, hint.arrow);
        }

        // Icono
        const icon = this.scene.add.text(hintX, hintY - 35, '💡', {
            fontSize: '24px'
        }).setOrigin(0.5);
        this.container.add(icon);

        // Título
        const title = this.scene.add.text(hintX, hintY - 8, hint.title, {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '14px',
            fontWeight: '700',
            color: '#a855f7'
        }).setOrigin(0.5);
        this.container.add(title);

        // Mensaje
        const message = this.scene.add.text(hintX, hintY + 18, hint.message, {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '12px',
            color: '#e2e8f0',
            align: 'center',
            wordWrap: { width: boxWidth - 40 }
        }).setOrigin(0.5);
        this.container.add(message);

        // Botón cerrar
        const closeBtn = this.scene.add.text(hintX, hintY + 45, '[ESPACIO] Entendido', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '11px',
            color: '#64748b'
        }).setOrigin(0.5);
        this.container.add(closeBtn);

        // Animación de entrada
        this.container.setAlpha(0);
        this.scene.tweens.add({
            targets: this.container,
            alpha: 1,
            duration: 300,
            ease: 'Power2'
        });

        // Input para cerrar
        this.closeHandler = () => this.hideHint();
        this.scene.input.keyboard.once('keydown-SPACE', this.closeHandler);
        this.scene.input.keyboard.once('keydown-E', this.closeHandler);
        this.scene.input.keyboard.once('keydown-ESC', this.closeHandler);
        overlay.once('pointerdown', this.closeHandler);

        return true;
    }

    /**
     * Dibuja una flecha hacia el objetivo
     */
    drawArrow(fromX, fromY, toX, toY, direction) {
        const arrow = this.scene.add.graphics();
        arrow.lineStyle(3, REALM_COLORS.aether.primary, 0.8);

        const arrowSize = 10;

        if (direction === 'up') {
            arrow.lineBetween(fromX, fromY - 60, fromX, fromY - 100);
            arrow.lineBetween(fromX - arrowSize, fromY - 90, fromX, fromY - 100);
            arrow.lineBetween(fromX + arrowSize, fromY - 90, fromX, fromY - 100);
        } else if (direction === 'down') {
            arrow.lineBetween(fromX, fromY + 60, fromX, fromY + 100);
            arrow.lineBetween(fromX - arrowSize, fromY + 90, fromX, fromY + 100);
            arrow.lineBetween(fromX + arrowSize, fromY + 90, fromX, fromY + 100);
        }

        this.container.add(arrow);
    }

    /**
     * Oculta el hint actual
     */
    hideHint() {
        if (!this.isShowing) return;

        // Marcar como visto
        this.seenHints.add(this.currentHint);
        this.saveSeenHints();

        // Animación de salida
        this.scene.tweens.add({
            targets: this.container,
            alpha: 0,
            duration: 200,
            onComplete: () => {
                if (this.container) {
                    this.container.destroy();
                    this.container = null;
                }
                this.isShowing = false;
                this.currentHint = null;
            }
        });
    }

    /**
     * Resetea todos los hints vistos
     */
    resetTutorial() {
        this.seenHints.clear();
        this.saveSeenHints();
    }

    /**
     * Verifica si un hint específico ya se vio
     */
    hasSeenHint(hintId) {
        return this.seenHints.has(hintId);
    }

    /**
     * Limpieza
     */
    destroy() {
        if (this.container) {
            this.container.destroy();
        }
    }
}
