/**
 * ResonanceBar - HUD que muestra la "salud" de la Lira
 *
 * La resonancia representa la vitalidad/conexión de la Lira con el universo.
 * Base: 100%
 * +5% por cada exploración completada
 * Máximo teórico: 100% + (exploraciones × 5%)
 */

import Phaser from 'phaser';
import { UI_COLORS, REALM_COLORS } from '../core/constants.js';
import gameState from '../systems/GameState.js';

export default class ResonanceBar {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = 150;
        this.height = 8;
        this.isAnimating = false;

        this.container = this.scene.add.container(x, y);
        this.container.setScrollFactor(0);
        this.container.setDepth(100);

        this.createBar();
        this.setupListeners();
        this.update();
    }

    createBar() {
        // Etiqueta
        this.label = this.scene.add.text(0, -15, '🎵 RESONANCIA', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '9px',
            fontWeight: '600',
            color: '#94a3b8'
        });
        this.container.add(this.label);

        // Fondo de la barra
        this.barBg = this.scene.add.graphics();
        this.barBg.fillStyle(0x1e293b, 1);
        this.barBg.fillRoundedRect(0, 0, this.width, this.height, 4);
        this.container.add(this.barBg);

        // Barra de relleno (resonancia actual)
        this.barFill = this.scene.add.graphics();
        this.container.add(this.barFill);

        // Barra de bonus (resonancia extra por exploraciones)
        this.barBonus = this.scene.add.graphics();
        this.container.add(this.barBonus);

        // Efecto de glow cuando aumenta
        this.glow = this.scene.add.graphics();
        this.glow.setAlpha(0);
        this.container.add(this.glow);

        // Texto de porcentaje
        this.percentText = this.scene.add.text(this.width + 8, -2, '100%', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '11px',
            fontWeight: '700',
            color: '#a855f7'
        });
        this.container.add(this.percentText);

        // Texto de bonus (aparece al ganar resonancia)
        this.bonusText = this.scene.add.text(this.width + 8, 10, '', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '9px',
            color: '#22c55e'
        });
        this.bonusText.setAlpha(0);
        this.container.add(this.bonusText);
    }

    setupListeners() {
        // Escuchar cambios de resonancia
        gameState.on('resonance-change', (data) => {
            this.animateChange(data.gained);
            this.update();
        });

        // Escuchar exploraciones completadas
        gameState.on('exploration-complete', (data) => {
            if (data.resonanceGained > 0) {
                this.showBonusAnimation(data.resonanceGained);
            }
        });
    }

    update() {
        const current = gameState.getResonance();
        const max = gameState.getMaxResonance();
        const baseMax = 100;

        // Calcular porcentajes
        const basePercent = Math.min(current, baseMax) / baseMax;
        const bonusPercent = max > baseMax ? (current - baseMax) / (max - baseMax) : 0;
        const totalPercent = current / max;

        // Actualizar barra principal (base 100%)
        this.barFill.clear();
        const baseWidth = Math.max(0, Math.min(this.width, this.width * (Math.min(current, baseMax) / baseMax)));

        // Color degradado según nivel
        let fillColor;
        if (totalPercent > 0.7) {
            fillColor = 0xa855f7; // Violeta (saludable)
        } else if (totalPercent > 0.4) {
            fillColor = 0xfbbf24; // Amarillo (advertencia)
        } else {
            fillColor = 0xef4444; // Rojo (peligro)
        }

        this.barFill.fillStyle(fillColor, 1);
        this.barFill.fillRoundedRect(0, 0, baseWidth, this.height, 4);

        // Si hay bonus por encima de 100%, mostrar barra extra
        this.barBonus.clear();
        if (current > baseMax && max > baseMax) {
            const bonusWidth = ((current - baseMax) / (max - baseMax)) * this.width;
            this.barBonus.fillStyle(0x22c55e, 0.6); // Verde para bonus
            this.barBonus.fillRoundedRect(0, 0, bonusWidth, this.height, 4);
        }

        // Actualizar texto
        const displayPercent = Math.round((current / baseMax) * 100);
        this.percentText.setText(`${displayPercent}%`);

        // Cambiar color del texto según nivel
        if (displayPercent > 100) {
            this.percentText.setColor('#22c55e'); // Verde si hay bonus
        } else if (displayPercent > 70) {
            this.percentText.setColor('#a855f7'); // Violeta normal
        } else if (displayPercent > 40) {
            this.percentText.setColor('#fbbf24'); // Amarillo advertencia
        } else {
            this.percentText.setColor('#ef4444'); // Rojo peligro
        }
    }

    animateChange(gained) {
        if (this.isAnimating) return;
        this.isAnimating = true;

        // Glow effect
        this.glow.clear();
        this.glow.fillStyle(0xa855f7, 0.3);
        this.glow.fillRoundedRect(-5, -5, this.width + 10, this.height + 10, 8);
        this.glow.setAlpha(1);

        this.scene.tweens.add({
            targets: this.glow,
            alpha: 0,
            duration: 600,
            ease: 'Power2',
            onComplete: () => {
                this.isAnimating = false;
            }
        });

        // Pulso de la barra
        this.scene.tweens.add({
            targets: this.container,
            scaleX: 1.05,
            scaleY: 1.1,
            duration: 150,
            yoyo: true
        });
    }

    showBonusAnimation(amount) {
        // Mostrar +5% animado
        this.bonusText.setText(`+${amount}%`);
        this.bonusText.setAlpha(1);
        this.bonusText.setY(10);

        this.scene.tweens.add({
            targets: this.bonusText,
            y: -5,
            alpha: 0,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => {
                this.bonusText.setY(10);
            }
        });
    }

    setPosition(x, y) {
        this.container.setPosition(x, y);
    }

    setVisible(visible) {
        this.container.setVisible(visible);
    }

    destroy() {
        gameState.off('resonance-change');
        gameState.off('exploration-complete');
        this.container.destroy();
    }
}
