/**
 * PreloadScene - Carga de assets y generación procedural de gráficos
 */

import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, REALM_COLORS, PLAYER, PORTAL } from '../core/constants.js';

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        // Crear barra de progreso
        const { width, height } = this.cameras.main;

        const progressBox = this.add.graphics();
        const progressBar = this.add.graphics();

        progressBox.fillStyle(0x1e293b, 0.8);
        progressBox.fillRoundedRect(width / 2 - 160, height / 2 - 15, 320, 30, 4);

        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(REALM_COLORS.aether.primary, 1);
            progressBar.fillRoundedRect(width / 2 - 155, height / 2 - 10, 310 * value, 20, 3);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
        });
    }

    create() {
        // Generar texturas procedurales en create (no en preload)
        this.generateTextures();

        // Todo cargado, ir al hub
        this.time.delayedCall(300, () => {
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('AetherHub');
            });
        });
    }

    generateTextures() {
        // Textura del Resonador (jugador)
        this.generateResonatorTexture();

        // Texturas de portales para cada reino inicial
        this.generatePortalTextures();

        // Textura de la Lira rota
        this.generateLyraTexture();

        // Partículas de ambiente
        this.generateParticleTexture();
    }

    generateResonatorTexture() {
        const size = PLAYER.size * 2;
        const graphics = this.add.graphics();

        // Glow exterior
        graphics.fillStyle(REALM_COLORS.aether.primary, 0.2);
        graphics.fillCircle(size, size, size * 0.9);

        graphics.fillStyle(REALM_COLORS.aether.primary, 0.4);
        graphics.fillCircle(size, size, size * 0.6);

        graphics.fillStyle(REALM_COLORS.aether.secondary, 0.7);
        graphics.fillCircle(size, size, size * 0.35);

        // Núcleo brillante
        graphics.fillStyle(0xffffff, 0.9);
        graphics.fillCircle(size, size, size * 0.15);

        graphics.generateTexture('resonator', size * 2, size * 2);
        graphics.destroy();
    }

    generatePortalTextures() {
        const realms = ['cosmos', 'chaos', 'logos'];

        realms.forEach(realm => {
            const size = PORTAL.radius * 2;
            const graphics = this.add.graphics();
            const color = REALM_COLORS[realm];

            // Anillos concéntricos
            for (let i = 5; i > 0; i--) {
                const alpha = 0.1 + (i * 0.08);
                const radius = (size / 2) * (i / 5);
                graphics.fillStyle(color.primary, alpha);
                graphics.fillCircle(size / 2, size / 2, radius);
            }

            // Borde exterior
            graphics.lineStyle(2, color.secondary, 0.6);
            graphics.strokeCircle(size / 2, size / 2, size / 2 - 4);

            // Núcleo
            graphics.fillStyle(color.secondary, 0.8);
            graphics.fillCircle(size / 2, size / 2, 6);

            graphics.generateTexture(`portal-${realm}`, size, size);
            graphics.destroy();
        });

        // Portal genérico desactivado
        const size = PORTAL.radius * 2;
        const graphics = this.add.graphics();
        graphics.fillStyle(0x374151, 0.3);
        graphics.fillCircle(size / 2, size / 2, size / 2);
        graphics.lineStyle(1, 0x4b5563, 0.5);
        graphics.strokeCircle(size / 2, size / 2, size / 2 - 4);
        graphics.generateTexture('portal-inactive', size, size);
        graphics.destroy();
    }

    generateLyraTexture() {
        const width = 80;
        const height = 120;
        const graphics = this.add.graphics();

        // Marco de la lira (forma simplificada)
        graphics.lineStyle(3, REALM_COLORS.aether.secondary, 0.7);

        // Arco superior
        graphics.beginPath();
        graphics.arc(width / 2, 35, 22, Math.PI, 0, false);
        graphics.strokePath();

        // Brazos
        graphics.lineStyle(2, REALM_COLORS.aether.secondary, 0.6);
        graphics.lineBetween(width / 2 - 22, 35, width / 2 - 18, 95);
        graphics.lineBetween(width / 2 + 22, 35, width / 2 + 18, 95);

        // Base
        graphics.lineStyle(3, REALM_COLORS.aether.secondary, 0.7);
        graphics.lineBetween(width / 2 - 18, 95, width / 2 + 18, 95);

        // Cuerdas (algunas rotas)
        graphics.lineStyle(1, 0xfbbf24, 0.5);
        const stringPositions = [-12, -8, -4, 0, 4, 8, 12];
        stringPositions.forEach((offset, i) => {
            const x = width / 2 + offset;
            const startY = 40;
            // Algunas cuerdas rotas (terminan antes)
            const endY = (i === 1 || i === 4 || i === 5) ? 55 + Math.random() * 15 : 90;
            graphics.lineBetween(x, startY, x, endY);
        });

        // Glow central sutil
        graphics.fillStyle(REALM_COLORS.aether.primary, 0.1);
        graphics.fillCircle(width / 2, 65, 25);

        graphics.generateTexture('lyra-broken', width, height);
        graphics.destroy();
    }

    generateParticleTexture() {
        const size = 8;
        const graphics = this.add.graphics();

        // Partícula suave con gradiente simulado
        graphics.fillStyle(0xffffff, 0.8);
        graphics.fillCircle(size / 2, size / 2, size / 2);

        graphics.fillStyle(0xffffff, 1);
        graphics.fillCircle(size / 2, size / 2, size / 4);

        graphics.generateTexture('particle', size, size);
        graphics.destroy();
    }
}
