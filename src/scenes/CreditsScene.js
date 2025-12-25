/**
 * CreditsScene - Créditos Interactivos
 *
 * Los créditos ruedan sobre un fondo donde las 150+ simulaciones
 * de EigenLab aparecen como constelaciones.
 */

import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, REALM_COLORS } from '../core/constants.js';
import gameState from '../systems/GameState.js';

export default class CreditsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CreditsScene' });
        this.creditsContainer = null;
        this.scrollSpeed = 0.5;
    }

    create() {
        const { width, height } = this.cameras.main;

        // Fondo con simulaciones como constelaciones
        this.createConstellationBackground();

        // Contenedor de créditos que se desplaza
        this.createCreditsContent();

        // Controles
        this.input.keyboard.on('keydown-ESC', () => this.returnToTitle());
        this.input.keyboard.on('keydown-SPACE', () => this.scrollSpeed = 2);
        this.input.keyboard.on('keyup-SPACE', () => this.scrollSpeed = 0.5);

        // Instrucciones
        this.add.text(width / 2, height - 30, 'ESPACIO acelerar  •  ESC volver al título', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '12px',
            color: '#475569'
        }).setOrigin(0.5);

        // Fade in
        this.cameras.main.fadeIn(1000, 0, 0, 0);
    }

    createConstellationBackground() {
        const { width, height } = this.cameras.main;

        // Fondo oscuro
        this.add.rectangle(width / 2, height / 2, width, height, 0x030712);

        // Crear "estrellas" representando simulaciones
        const simulations = [
            'harmonices-mundi', 'lorenz-attractor', 'mandelbrot', 'orbitales',
            'terremotos', 'game-of-life', 'le-chatelier', 'neurona',
            'boids-masivo', 'contrapunctus', 'pendulo-simple', 'ondas',
            'gas-ideal', 'evolucion', 'fourier-epicycles', 'three-body',
            'double-pendulum', 'entropy', 'titulacion', 'adn-replicacion'
        ];

        const colors = Object.values(REALM_COLORS).map(r => r.primary);

        for (let i = 0; i < 100; i++) {
            const x = Phaser.Math.Between(0, width);
            const y = Phaser.Math.Between(0, height);
            const size = Phaser.Math.Between(1, 4);
            const color = colors[i % colors.length];
            const alpha = 0.3 + Math.random() * 0.5;

            const star = this.add.circle(x, y, size, color, alpha);

            // Parpadeo
            this.tweens.add({
                targets: star,
                alpha: { from: alpha, to: alpha * 0.3 },
                duration: Phaser.Math.Between(1000, 3000),
                yoyo: true,
                repeat: -1,
                delay: Math.random() * 2000
            });
        }

        // Líneas de constelación sutiles
        const constellationLines = this.add.graphics();
        constellationLines.lineStyle(1, 0x1e293b, 0.3);

        for (let i = 0; i < 15; i++) {
            const x1 = Phaser.Math.Between(0, width);
            const y1 = Phaser.Math.Between(0, height);
            const x2 = x1 + Phaser.Math.Between(-100, 100);
            const y2 = y1 + Phaser.Math.Between(-100, 100);
            constellationLines.lineBetween(x1, y1, x2, y2);
        }
    }

    createCreditsContent() {
        const { width, height } = this.cameras.main;

        this.creditsContainer = this.add.container(width / 2, height + 50);

        let yOffset = 0;
        const lineHeight = 30;
        const sectionGap = 60;

        const addText = (text, style = {}) => {
            const defaultStyle = {
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '16px',
                color: '#f8fafc',
                align: 'center',
                ...style
            };
            const t = this.add.text(0, yOffset, text, defaultStyle).setOrigin(0.5);
            this.creditsContainer.add(t);
            yOffset += lineHeight;
        };

        const addTitle = (text) => {
            yOffset += sectionGap / 2;
            addText(text, { fontSize: '24px', fontWeight: '700', color: '#a855f7' });
            yOffset += 10;
        };

        const addSubtitle = (text) => {
            addText(text, { fontSize: '14px', color: '#64748b' });
        };

        // ═══════════════════════════════════════════════════════════════
        // CONTENIDO DE CRÉDITOS
        // ═══════════════════════════════════════════════════════════════

        addTitle('EIGENLAB ODYSSEY');
        addSubtitle('Una aventura a través del conocimiento');
        yOffset += sectionGap;

        addTitle('Diseño y Desarrollo');
        addText('Carlos Kaiser');
        addSubtitle('Concepto, programación, narrativa');
        yOffset += sectionGap;

        addTitle('Asistente de Desarrollo');
        addText('Claude (Anthropic)');
        addSubtitle('Arquitectura, implementación, documentación');
        yOffset += sectionGap;

        addTitle('EigenLab');
        addText('150+ simulaciones científicas interactivas');
        addSubtitle('Física • Química • Biología • Matemáticas');
        addSubtitle('Astronomía • Computación • Música • Geología');
        yOffset += sectionGap;

        addTitle('Los Nueve Reinos');
        const realms = [
            { name: 'AETHER', desc: 'El reino de la música', color: REALM_COLORS.aether.primary },
            { name: 'COSMOS', desc: 'Donde nacen las estrellas', color: REALM_COLORS.cosmos.primary },
            { name: 'CHAOS', desc: 'Donde el orden emerge', color: REALM_COLORS.chaos.primary },
            { name: 'LOGOS', desc: 'Donde las verdades son eternas', color: REALM_COLORS.logos.primary },
            { name: 'ATOMOS', desc: 'Las leyes fundamentales', color: REALM_COLORS.atomos.primary },
            { name: 'TERRA', desc: 'El tiempo hecho piedra', color: REALM_COLORS.terra.primary },
            { name: 'MACHINA', desc: 'La lógica hecha materia', color: REALM_COLORS.machina.primary },
            { name: 'ALCHEMY', desc: 'Transmutación y equilibrio', color: REALM_COLORS.alchemy.primary },
            { name: 'BIOS', desc: 'La danza de la vida', color: REALM_COLORS.bios.primary },
            { name: 'PSYCHE', desc: 'Donde la consciencia despierta', color: REALM_COLORS.psyche.primary }
        ];

        realms.forEach(realm => {
            const t = this.add.text(0, yOffset, realm.name, {
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '14px',
                fontWeight: '600',
                color: `#${realm.color.toString(16).padStart(6, '0')}`
            }).setOrigin(0.5);
            this.creditsContainer.add(t);
            yOffset += lineHeight * 0.8;

            addSubtitle(realm.desc);
            yOffset += 5;
        });

        yOffset += sectionGap;

        addTitle('Tecnologías');
        addText('Phaser.js 3');
        addSubtitle('Motor de juego');
        addText('Web Audio API');
        addSubtitle('Audio procedural');
        addText('Vite');
        addSubtitle('Bundler');
        yOffset += sectionGap;

        addTitle('Inspiración');
        addText('Johann Fux — Gradus ad Parnassum');
        addText('Jean-Philippe Rameau — Traité de l\'harmonie');
        addText('Benoit Mandelbrot — Fractales');
        addText('Edward Lorenz — Teoría del caos');
        addText('John Conway — Game of Life');
        yOffset += sectionGap;

        addTitle('Agradecimientos Especiales');
        addText('A todos los que creen que');
        addText('el conocimiento es una sinfonía,');
        addText('no una lista de datos.');
        yOffset += sectionGap;

        // Stats del jugador
        const progress = gameState.getProgress();
        addTitle('Tu Viaje');
        addText(`${progress.eigenvalores} / 12 Eigenvalores`);
        addText(`${progress.simulations.completed} Simulaciones completadas`);
        addText(`${progress.connections.discovered} Conexiones descubiertas`);
        yOffset += sectionGap;

        // Cita final
        yOffset += sectionGap;
        const finalQuote = this.add.text(0, yOffset,
            '"La música no existe a pesar de la disonancia.\nExiste gracias a ella."', {
                fontFamily: 'Georgia, serif',
                fontSize: '20px',
                fontStyle: 'italic',
                color: '#f8fafc',
                align: 'center'
            }).setOrigin(0.5);
        this.creditsContainer.add(finalQuote);
        yOffset += sectionGap * 2;

        // FIN
        const endText = this.add.text(0, yOffset, 'FIN', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '32px',
            fontWeight: '700',
            color: '#a855f7'
        }).setOrigin(0.5);
        this.creditsContainer.add(endText);
        yOffset += sectionGap * 2;

        // Guardar altura total
        this.totalCreditsHeight = yOffset;
    }

    update() {
        // Scroll de créditos
        if (this.creditsContainer) {
            this.creditsContainer.y -= this.scrollSpeed;

            // Si llegamos al final, reiniciar o ir a título
            if (this.creditsContainer.y < -this.totalCreditsHeight - 100) {
                this.returnToTitle();
            }
        }
    }

    returnToTitle() {
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            // Resetear estado o volver al título
            this.scene.start('TitleScene');
        });
    }
}
