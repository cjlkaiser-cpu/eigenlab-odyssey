/**
 * LyreHUD - Visualización de la Lira de Cuerdas Simpáticas
 *
 * Muestra el progreso del jugador a través de las 12 cuerdas de la Lira.
 * Cada eigenvalor obtenido enciende una cuerda.
 * λ₁ se obtiene en el tutorial, λ₂-λ₁₂ en los reinos.
 */

import Phaser from 'phaser';
import { REALM_COLORS } from '../core/constants.js';
import gameState from '../systems/GameState.js';

export default class LyreHUD {
    constructor(scene, x = null, y = null) {
        this.scene = scene;
        this.container = scene.add.container(0, 0);
        this.container.setDepth(1000);

        // Posición por defecto: esquina superior derecha
        const { width, height } = scene.cameras.main;
        this.x = x !== null ? x : width - 80;
        this.y = y !== null ? y : 80;

        // Configuración
        this.config = {
            totalStrings: 12,
            stringWidth: 2,
            stringHeight: 50,
            stringSpacing: 5,
            frameWidth: 80,
            frameHeight: 70,
            activeColor: 0xfbbf24, // Dorado
            inactiveColor: 0x374151, // Gris
            glowColor: REALM_COLORS.aether.primary
        };

        // Estado
        this.strings = [];
        this.activeCount = 0;

        // Crear visuales
        this.createFrame();
        this.createStrings();
        this.createLabel();

        // Escuchar cambios de eigenvalores
        gameState.on('eigenvalor-change', (count) => {
            this.updateStrings(count);
        });

        // Inicializar con estado actual
        this.updateStrings(gameState.getEigenvalores());
    }

    createFrame() {
        const frame = this.scene.add.graphics();

        // Marco de la lira (simplificado)
        frame.lineStyle(2, REALM_COLORS.aether.secondary, 0.6);

        // Arco superior
        frame.beginPath();
        frame.arc(this.x, this.y - 15, 35, Math.PI, 0, false);
        frame.strokePath();

        // Brazos laterales
        frame.lineStyle(2, REALM_COLORS.aether.secondary, 0.5);
        frame.lineBetween(this.x - 35, this.y - 15, this.x - 30, this.y + 30);
        frame.lineBetween(this.x + 35, this.y - 15, this.x + 30, this.y + 30);

        // Base
        frame.lineStyle(2, REALM_COLORS.aether.secondary, 0.6);
        frame.lineBetween(this.x - 30, this.y + 30, this.x + 30, this.y + 30);

        this.container.add(frame);
        this.frame = frame;
    }

    createStrings() {
        const { totalStrings, stringWidth, stringHeight, stringSpacing, activeColor, inactiveColor } = this.config;

        // Calcular posiciones de las cuerdas
        const totalWidth = (totalStrings - 1) * stringSpacing;
        const startX = this.x - totalWidth / 2;

        for (let i = 0; i < totalStrings; i++) {
            const stringX = startX + i * stringSpacing;
            const stringStartY = this.y - 10;
            const stringEndY = this.y + 25;

            // Contenedor para la cuerda y su glow
            const stringContainer = {
                index: i,
                x: stringX,
                startY: stringStartY,
                endY: stringEndY,
                isActive: false,
                graphics: this.scene.add.graphics(),
                glow: null
            };

            // Dibujar cuerda inactiva
            this.drawString(stringContainer, false);

            this.strings.push(stringContainer);
            this.container.add(stringContainer.graphics);
        }
    }

    drawString(stringContainer, isActive) {
        const { stringWidth, activeColor, inactiveColor, glowColor } = this.config;
        const { graphics, x, startY, endY } = stringContainer;

        graphics.clear();

        if (isActive) {
            // Glow de la cuerda activa
            graphics.lineStyle(6, activeColor, 0.2);
            graphics.lineBetween(x, startY, x, endY);

            graphics.lineStyle(4, activeColor, 0.4);
            graphics.lineBetween(x, startY, x, endY);

            // Cuerda principal
            graphics.lineStyle(stringWidth, activeColor, 1);
            graphics.lineBetween(x, startY, x, endY);
        } else {
            // Cuerda inactiva (tenue)
            graphics.lineStyle(1, inactiveColor, 0.3);
            graphics.lineBetween(x, startY, x, endY);
        }

        stringContainer.isActive = isActive;
    }

    createLabel() {
        // Contador de eigenvalores
        this.eigenLabel = this.scene.add.text(this.x, this.y + 45, '0/12 λ', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '11px',
            color: '#64748b'
        }).setOrigin(0.5);

        this.container.add(this.eigenLabel);
    }

    updateStrings(eigenCount) {
        // Actualizar cuerdas
        const newCount = Math.min(eigenCount, this.config.totalStrings);

        for (let i = 0; i < this.config.totalStrings; i++) {
            const shouldBeActive = i < newCount;
            const stringContainer = this.strings[i];

            if (shouldBeActive !== stringContainer.isActive) {
                this.drawString(stringContainer, shouldBeActive);

                // Animación al activar nueva cuerda
                if (shouldBeActive && i >= this.activeCount) {
                    this.animateNewString(stringContainer);
                }
            }
        }

        this.activeCount = newCount;

        // Actualizar label
        this.eigenLabel.setText(`${newCount}/12 λ`);

        // Cambiar color del label según progreso
        if (newCount >= 12) {
            this.eigenLabel.setColor('#fbbf24'); // Completo
        } else if (newCount >= 6) {
            this.eigenLabel.setColor('#a855f7'); // Más de la mitad
        } else {
            this.eigenLabel.setColor('#64748b'); // Normal
        }
    }

    animateNewString(stringContainer) {
        // Flash brillante cuando se activa una nueva cuerda
        const flash = this.scene.add.graphics();
        flash.lineStyle(8, 0xffffff, 0.8);
        flash.lineBetween(stringContainer.x, stringContainer.startY, stringContainer.x, stringContainer.endY);
        this.container.add(flash);

        this.scene.tweens.add({
            targets: flash,
            alpha: 0,
            duration: 500,
            ease: 'Power2',
            onComplete: () => flash.destroy()
        });

        // Pulso en el marco
        this.scene.tweens.add({
            targets: this.frame,
            alpha: { from: 1, to: 0.5 },
            duration: 200,
            yoyo: true,
            ease: 'Sine.easeInOut'
        });
    }

    /**
     * Animación especial cuando se completa la Lira (12 cuerdas)
     */
    celebrateComplete() {
        // Pulso dorado en todas las cuerdas
        this.strings.forEach((stringContainer, i) => {
            this.scene.time.delayedCall(i * 50, () => {
                const burst = this.scene.add.graphics();
                burst.fillStyle(0xfbbf24, 0.5);
                burst.fillCircle(stringContainer.x, (stringContainer.startY + stringContainer.endY) / 2, 10);
                this.container.add(burst);

                this.scene.tweens.add({
                    targets: burst,
                    alpha: 0,
                    scale: 2,
                    duration: 400,
                    onComplete: () => burst.destroy()
                });
            });
        });
    }

    setVisible(visible) {
        this.container.setVisible(visible);
    }

    destroy() {
        if (this.container) {
            this.container.destroy();
        }
    }
}
