/**
 * AetherHub - El reino central de la música
 *
 * Aquí despierta El Resonador. Desde aquí se accede a todos los reinos.
 * La Lira de Cuerdas Simpáticas yace rota en el centro.
 */

import Phaser from 'phaser';
import {
    GAME_WIDTH,
    GAME_HEIGHT,
    REALM_COLORS,
    UI_COLORS,
    PLAYER,
    PORTAL,
    NARRATIVE
} from '../core/constants.js';
import Resonator from '../entities/Resonator.js';
import Constructo from '../entities/Constructo.js';
import ProgressUI from '../ui/ProgressUI.js';
import NotificationManager from '../ui/NotificationManager.js';
import LyreHUD from '../ui/LyreHUD.js';
import ResonanceBar from '../ui/ResonanceBar.js';
import gameState from '../systems/GameState.js';
import synthAudio from '../audio/SynthAudio.js';
import { getSpecialDialogue, hasSeenSpecialDialogue, markSpecialDialogueSeen } from '../data/specialDialogues.js';
import TransitionManager from '../systems/TransitionManager.js';
import ParticleEffects from '../systems/ParticleEffects.js';

export default class AetherHub extends Phaser.Scene {
    constructor() {
        super({ key: 'AetherHub' });

        this.player = null;
        this.constructo = null;
        this.portals = {};
        this.lyra = null;
        this.ambientParticles = null;
        this.portalLabels = {};
        this.progressUI = null;
        this.lyreHUD = null;
        this.resonanceBar = null;
        // M5.4: Atril del Primer Resonador
        this.atril = null;
        this.atrilPrompt = null;
        // M6: Portal a La Disonancia
        this.disonanciaPortal = null;
        this.disonanciaPrompt = null;
        // M7.2: Sistemas visuales
        this.transitionManager = null;
        this.particleEffects = null;
    }

    init(data) {
        this.fromRealm = data?.fromRealm || null;
    }

    create() {
        const { width, height } = this.cameras.main;

        // Registrar visita
        gameState.setCurrentRealm('aether');

        // Fondo con gradiente radial simulado
        this.createBackground();

        // Sistema de partículas ambientales
        this.createAmbientParticles();

        // Crear la Lira rota en el centro
        this.createLyra();

        // M5.4: Crear el Atril del Primer Resonador (aparece con 10λ)
        this.createAtril();

        // M6: Crear el Portal a La Disonancia (aparece con 11λ)
        this.createDisonanciaPortal();

        // Crear los portales (todos los reinos)
        this.createPortals();

        // Crear al jugador
        this.createPlayer();

        // Crear al Constructo (compañero)
        this.createConstructo();

        // UI de progreso
        this.progressUI = new ProgressUI(this);

        // HUD de la Lira
        this.lyreHUD = new LyreHUD(this);

        // M2: Barra de resonancia
        this.resonanceBar = new ResonanceBar(this, width - 200, 30);

        // Sistema de notificaciones
        this.notifications = new NotificationManager(this);

        // M7.2: Sistemas visuales
        this.transitionManager = new TransitionManager(this);
        this.particleEffects = new ParticleEffects(this);
        this.particleEffects.createAmbientParticles('aether', 'medium');

        // UI del reino
        this.createRealmUI();

        // Configurar cámara
        this.cameras.main.fadeIn(800, 0, 0, 0);

        // M7.1: Iniciar música del reino Aether
        synthAudio.startRealmMusic('aether');

        // Secuencia de despertar (solo primera vez)
        if (!gameState.hasSeenIntro()) {
            this.time.delayedCall(1000, () => {
                this.triggerAwakening();
            });
        } else {
            this.showInstructions();
        }

        // Input para interactuar
        this.input.keyboard.on('keydown-E', () => this.checkInteraction());
        this.input.keyboard.on('keydown-SPACE', () => this.checkInteraction());
        this.input.keyboard.on('keydown-ESC', () => this.openPauseMenu());
        this.input.keyboard.on('keydown-G', () => this.openKnowledgeGraph());
    }

    createBackground() {
        const { width, height } = this.cameras.main;

        // Fondo base
        this.add.rectangle(width / 2, height / 2, width, height, UI_COLORS.background);

        // Capas de gradiente para simular profundidad
        const layers = 5;
        for (let i = layers; i > 0; i--) {
            const alpha = 0.03 * i;
            const radius = (Math.min(width, height) / 2) * (i / layers) * 1.5;
            this.add.circle(width / 2, height / 2, radius, REALM_COLORS.aether.primary, alpha);
        }

        // Grid sutil de fondo
        const gridGraphics = this.add.graphics();
        gridGraphics.lineStyle(1, 0x1e293b, 0.3);

        for (let y = 0; y < height; y += 60) {
            gridGraphics.lineBetween(0, y, width, y);
        }
        for (let x = 0; x < width; x += 60) {
            gridGraphics.lineBetween(x, 0, x, height);
        }

        // Ondas decorativas
        this.createWaveRings();
    }

    createWaveRings() {
        const { width, height } = this.cameras.main;
        const centerX = width / 2;
        const centerY = height / 2;

        this.waveRings = [];
        const ringCount = 4;

        for (let i = 0; i < ringCount; i++) {
            const ring = this.add.circle(centerX, centerY, 100 + (i * 80), REALM_COLORS.aether.primary, 0);
            ring.setStrokeStyle(1, REALM_COLORS.aether.primary, 0.15);
            ring.initialRadius = 100 + (i * 80);
            ring.phase = (i / ringCount) * Math.PI * 2;
            this.waveRings.push(ring);
        }
    }

    createAmbientParticles() {
        const { width, height } = this.cameras.main;

        this.ambientParticles = this.add.particles(0, 0, 'particle', {
            x: { min: 0, max: width },
            y: { min: 0, max: height },
            scale: { start: 0.3, end: 0 },
            alpha: { start: 0.4, end: 0 },
            speed: { min: 10, max: 30 },
            angle: { min: 0, max: 360 },
            lifespan: 4000,
            frequency: 200,
            tint: [REALM_COLORS.aether.primary, REALM_COLORS.aether.secondary, 0xffffff],
            blendMode: 'ADD'
        });
    }

    createLyra() {
        const { width, height } = this.cameras.main;

        this.lyra = this.add.image(width / 2, height / 2 + 40, 'lyra-broken');
        this.lyra.setScale(1.2);
        this.lyra.setAlpha(0.9);

        this.lyraGlow = this.add.circle(width / 2, height / 2 + 40, 50, REALM_COLORS.aether.primary, 0.1);

        this.lyra.setInteractive({ useHandCursor: true });
        this.lyra.interactionRadius = 100;

        this.lyraPrompt = this.add.text(width / 2, height / 2 + 120, '[E] Examinar la Lira', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '14px',
            color: '#94a3b8'
        }).setOrigin(0.5).setAlpha(0);
    }

    // M5.4: Atril del Primer Resonador - aparece con 10 eigenvalores
    createAtril() {
        const eigenvalores = gameState.getEigenvalores();

        // El atril solo aparece con 10+ eigenvalores
        if (eigenvalores < 10) return;

        const { width, height } = this.cameras.main;
        const atrilX = width / 2 + 150;
        const atrilY = height / 2;

        // Crear gráfico procedural del atril (partituras antiguas)
        const atrilGraphics = this.add.graphics();

        // Base del atril
        atrilGraphics.fillStyle(0x4a3728, 1); // Madera oscura
        atrilGraphics.fillRect(atrilX - 3, atrilY - 30, 6, 60);

        // Soporte de partituras
        atrilGraphics.fillStyle(0x5d4636, 1);
        atrilGraphics.fillRect(atrilX - 35, atrilY - 50, 70, 45);
        atrilGraphics.lineStyle(2, 0x8b7355, 1);
        atrilGraphics.strokeRect(atrilX - 35, atrilY - 50, 70, 45);

        // Partituras (páginas amarillentas)
        atrilGraphics.fillStyle(0xf5e6c8, 0.9);
        atrilGraphics.fillRect(atrilX - 28, atrilY - 45, 56, 35);

        // Líneas de pentagrama
        atrilGraphics.lineStyle(1, 0x3d3d3d, 0.4);
        for (let i = 0; i < 5; i++) {
            const y = atrilY - 40 + i * 6;
            atrilGraphics.lineBetween(atrilX - 25, y, atrilX + 25, y);
        }

        // Anotaciones del Primer Resonador (garabatos)
        atrilGraphics.lineStyle(1, 0xcc0000, 0.6);
        atrilGraphics.lineBetween(atrilX - 20, atrilY - 35, atrilX - 5, atrilY - 25);
        atrilGraphics.lineBetween(atrilX + 5, atrilY - 38, atrilX + 18, atrilY - 28);

        // Glow dorado (eigenvalor inestable)
        const atrilGlow = this.add.graphics();
        atrilGlow.fillStyle(0xfbbf24, 0.15);
        atrilGlow.fillCircle(atrilX, atrilY - 30, 60);

        // Pulso del glow
        this.tweens.add({
            targets: atrilGlow,
            alpha: { from: 1, to: 0.5 },
            scale: { from: 1, to: 1.1 },
            duration: 1500,
            yoyo: true,
            repeat: -1
        });

        // Área de interacción
        this.atril = this.add.zone(atrilX, atrilY - 20, 80, 80);
        this.atril.interactionRadius = 80;
        this.atril.x = atrilX;
        this.atril.y = atrilY - 20;

        // Prompt
        this.atrilPrompt = this.add.text(atrilX, atrilY + 45, '[E] Examinar Partituras', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '13px',
            color: '#fbbf24'
        }).setOrigin(0.5).setAlpha(0);

        // Label
        this.add.text(atrilX, atrilY - 75, 'ATRIL DEL PRIMER RESONADOR', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '10px',
            fontWeight: '600',
            color: '#fbbf24'
        }).setOrigin(0.5);

        // Mostrar diálogo de aparición si es la primera vez
        if (!hasSeenSpecialDialogue('atril-aparece')) {
            this.time.delayedCall(1500, () => {
                markSpecialDialogueSeen('atril-aparece');
                const dialogue = getSpecialDialogue('atril-aparece');
                if (dialogue) {
                    this.scene.launch('DialogScene', {
                        lines: dialogue.lines,
                        onComplete: () => {}
                    });
                }
            });
        }
    }

    // M6: Portal a La Disonancia - aparece con 11 eigenvalores
    createDisonanciaPortal() {
        const eigenvalores = gameState.getEigenvalores();

        // El portal solo aparece con 11+ eigenvalores
        if (eigenvalores < 11) return;

        const { width, height } = this.cameras.main;
        const portalX = width / 2 - 150;
        const portalY = height / 2;

        // Portal oscuro con vetas rojas
        const portalGraphics = this.add.graphics();

        // Vórtice negro
        for (let i = 5; i > 0; i--) {
            const alpha = 0.2 * (i / 5);
            const radius = 30 + (i * 8);
            portalGraphics.fillStyle(0x0a0000, alpha);
            portalGraphics.fillCircle(portalX, portalY, radius);
        }

        // Borde rojo pulsante
        portalGraphics.lineStyle(3, 0xff0000, 0.8);
        portalGraphics.strokeCircle(portalX, portalY, 35);

        // Vetas rojas dentro del portal
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const innerX = portalX + Math.cos(angle) * 15;
            const innerY = portalY + Math.sin(angle) * 15;
            const outerX = portalX + Math.cos(angle) * 30;
            const outerY = portalY + Math.sin(angle) * 30;
            portalGraphics.lineStyle(1, 0xff3333, 0.5);
            portalGraphics.lineBetween(innerX, innerY, outerX, outerY);
        }

        // Pulso amenazante
        const pulseCircle = this.add.circle(portalX, portalY, 40, 0xff0000, 0.1);
        this.tweens.add({
            targets: pulseCircle,
            scale: { from: 1, to: 1.5 },
            alpha: { from: 0.2, to: 0 },
            duration: 1500,
            repeat: -1
        });

        // Área de interacción
        this.disonanciaPortal = this.add.zone(portalX, portalY, 80, 80).setInteractive({ useHandCursor: true });
        this.disonanciaPortal.x = portalX;
        this.disonanciaPortal.y = portalY;
        this.disonanciaPortal.interactionRadius = 80;

        // Prompt
        this.disonanciaPrompt = this.add.text(portalX, portalY + 55, '[E] Entrar al Vacío', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '13px',
            color: '#ff6666'
        }).setOrigin(0.5).setAlpha(0);

        // Label
        this.add.text(portalX, portalY - 55, 'EL CORAZÓN', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '11px',
            fontWeight: '600',
            color: '#ff3333'
        }).setOrigin(0.5);

        this.add.text(portalX, portalY - 42, 'DE LA DISONANCIA', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '9px',
            color: '#ff6666'
        }).setOrigin(0.5);

        // Mostrar diálogo de aparición si es la primera vez
        if (!hasSeenSpecialDialogue('disonancia-portal-aparece')) {
            this.time.delayedCall(2000, () => {
                markSpecialDialogueSeen('disonancia-portal-aparece');
                const lines = [
                    '...',
                    'Un nuevo portal ha aparecido.',
                    'Negro con vetas rojas pulsantes.',
                    'Puedo sentir la interferencia desde aquí.',
                    'Es el Corazón de La Disonancia.',
                    'Es hora de terminar esto.'
                ];
                this.scene.launch('DialogScene', {
                    lines,
                    onComplete: () => {}
                });
            });
        }
    }

    createPortals() {
        const { width, height } = this.cameras.main;

        // Configuración de todos los portales
        const portalConfig = {
            // Tier 1 - Iniciales
            cosmos: { x: width / 2, y: 80, label: 'COSMOS', sublabel: 'Donde nacen las estrellas' },
            chaos: { x: 120, y: height / 2 - 60, label: 'CHAOS', sublabel: 'Donde el orden emerge' },
            logos: { x: width - 120, y: height / 2 - 60, label: 'LOGOS', sublabel: 'Donde las verdades son eternas' },

            // Tier 2 - Requieren 2 eigenvalores
            atomos: { x: 120, y: height / 2 + 100, label: 'ATOMOS', sublabel: 'Las leyes fundamentales' },
            machina: { x: width - 120, y: height / 2 + 100, label: 'MACHINA', sublabel: 'La lógica hecha materia' },
            terra: { x: width / 2, y: height - 80, label: 'TERRA', sublabel: 'El tiempo hecho piedra' },

            // Tier 3 - Requieren 5+ eigenvalores
            alchemy: { x: 220, y: height - 130, label: 'ALCHEMY', sublabel: 'Transmutación y equilibrio' },
            bios: { x: width - 220, y: height - 130, label: 'BIOS', sublabel: 'La danza de la vida' },
            psyche: { x: width / 2, y: height / 2 + 180, label: 'PSYCHE', sublabel: 'Donde la consciencia despierta' }
        };

        Object.entries(portalConfig).forEach(([realm, config]) => {
            this.createPortal(realm, config);
        });
    }

    createPortal(realm, config) {
        const isUnlocked = gameState.isRealmUnlocked(realm);
        const color = REALM_COLORS[realm];

        // Usar sprites reales si existen, si no generar procedural
        let textureKey;
        if (isUnlocked && this.textures.exists('portal-active')) {
            textureKey = 'portal-active';
        } else if (!isUnlocked && this.textures.exists('portal-inactive')) {
            textureKey = 'portal-inactive';
        } else {
            // Fallback a textura procedural
            textureKey = isUnlocked ? `portal-${realm}` : 'portal-inactive';
            if (!this.textures.exists(textureKey) && isUnlocked) {
                this.createPortalTexture(realm, color);
                textureKey = `portal-${realm}`;
            }
            if (!this.textures.exists(textureKey)) {
                textureKey = 'portal-cosmos';
            }
        }

        const portal = this.add.image(config.x, config.y, textureKey);

        // Escalar sprites reales (son grandes)
        const targetSize = PORTAL.radius * 2;
        const scale = targetSize / Math.max(portal.width, portal.height);
        portal.setScale(isUnlocked ? scale : scale * 0.7);

        portal.realm = realm;
        portal.baseScale = isUnlocked ? scale : scale * 0.7;
        portal.isUnlocked = isUnlocked;

        if (!isUnlocked) {
            portal.setAlpha(0.3);
            portal.setTint(0x4b5563);
        } else {
            // Tinte de color del reino
            portal.setTint(color.primary);
        }

        // Crear glow para el portal (solo si está desbloqueado)
        if (isUnlocked) {
            const glow = this.add.graphics();
            glow.fillStyle(color.primary, 0.15);
            glow.fillCircle(config.x, config.y, PORTAL.radius * 1.3);
            glow.setDepth(-1);
            portal.glow = glow;
        }

        this.portals[realm] = portal;

        // Labels
        const labelColor = isUnlocked
            ? `#${color.secondary.toString(16).padStart(6, '0')}`
            : '#4b5563';

        const label = this.add.text(config.x, config.y - PORTAL.radius - 25, config.label, {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '14px',
            fontWeight: '600',
            color: labelColor
        }).setOrigin(0.5);

        const sublabel = this.add.text(config.x, config.y - PORTAL.radius - 8, config.sublabel, {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '10px',
            color: isUnlocked ? '#64748b' : '#374151'
        }).setOrigin(0.5);

        // Mostrar requisito si bloqueado
        if (!isUnlocked) {
            const progress = gameState.getUnlockProgress(realm);
            const lockText = this.add.text(config.x, config.y + PORTAL.radius + 15,
                `🔒 ${progress.current}/${progress.required} λ`, {
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '11px',
                    color: '#64748b'
                }).setOrigin(0.5);
            portal.lockText = lockText;
        }

        // Prompt de entrada
        const prompt = this.add.text(config.x, config.y + PORTAL.radius + 15,
            isUnlocked ? '[E] Entrar' : '', {
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '13px',
                color: '#94a3b8'
            }).setOrigin(0.5).setAlpha(0);

        portal.prompt = prompt;
        this.portalLabels[realm] = { label, sublabel };
    }

    createPortalTexture(realm, color) {
        const size = PORTAL.radius * 2;
        const graphics = this.add.graphics();

        for (let i = 5; i > 0; i--) {
            const alpha = 0.1 + (i * 0.08);
            const radius = (size / 2) * (i / 5);
            graphics.fillStyle(color.primary, alpha);
            graphics.fillCircle(size / 2, size / 2, radius);
        }

        graphics.lineStyle(2, color.secondary, 0.6);
        graphics.strokeCircle(size / 2, size / 2, size / 2 - 4);
        graphics.fillStyle(color.secondary, 0.8);
        graphics.fillCircle(size / 2, size / 2, 6);

        graphics.generateTexture(`portal-${realm}`, size, size);
        graphics.destroy();
    }

    createPlayer() {
        const { width, height } = this.cameras.main;
        this.player = new Resonator(this, width / 2, height / 2 - 60);
        this.physics.world.enable(this.player);
    }

    createConstructo() {
        if (!this.player) return;

        this.constructo = new Constructo(this, this.player, {
            followDistance: 60,
            followSpeed: 0.05,
            bobAmplitude: 6,
            scale: 0.06
        });
    }

    createRealmUI() {
        this.add.text(30, 30, 'AETHER', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '24px',
            fontWeight: '700',
            color: '#a855f7'
        });

        this.add.text(30, 58, 'El Reino de la Música', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '12px',
            color: '#64748b'
        });

        // Instrucciones
        const { width, height } = this.cameras.main;
        this.instructions = this.add.text(width / 2, height - 30,
            'WASD mover  •  E interactuar  •  G grafo de conocimiento  •  ESC menú', {
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '12px',
                color: '#475569'
            }).setOrigin(0.5).setAlpha(0);
    }

    showInstructions() {
        this.tweens.add({
            targets: this.instructions,
            alpha: 1,
            duration: 500
        });
    }

    triggerAwakening() {
        this.scene.launch('DialogScene', {
            lines: NARRATIVE.awakening,
            onComplete: () => {
                gameState.markIntroSeen();
                this.showInstructions();
            }
        });
    }

    checkInteraction() {
        if (!this.player) return;

        const playerX = this.player.x;
        const playerY = this.player.y;

        // Verificar Lira
        const lyraDistance = Phaser.Math.Distance.Between(playerX, playerY, this.lyra.x, this.lyra.y);
        if (lyraDistance < this.lyra.interactionRadius) {
            this.interactWithLyra();
            return;
        }

        // M5.4: Verificar Atril del Primer Resonador
        if (this.atril) {
            const atrilDistance = Phaser.Math.Distance.Between(playerX, playerY, this.atril.x, this.atril.y);
            if (atrilDistance < this.atril.interactionRadius) {
                this.interactWithAtril();
                return;
            }
        }

        // M6: Verificar Portal a La Disonancia
        if (this.disonanciaPortal) {
            const disonanciaDistance = Phaser.Math.Distance.Between(playerX, playerY, this.disonanciaPortal.x, this.disonanciaPortal.y);
            if (disonanciaDistance < this.disonanciaPortal.interactionRadius) {
                this.enterDisonancia();
                return;
            }
        }

        // Verificar portales
        for (const [realm, portal] of Object.entries(this.portals)) {
            const distance = Phaser.Math.Distance.Between(playerX, playerY, portal.x, portal.y);
            if (distance < PORTAL.activationDistance + 30) {
                this.enterPortal(realm, portal);
                return;
            }
        }
    }

    interactWithLyra() {
        const eigenvalores = gameState.getEigenvalores();
        let lines;

        if (eigenvalores === 0) {
            lines = NARRATIVE.lyraInteract;
            this.scene.launch('DialogScene', { lines, onComplete: () => {} });
        } else if (eigenvalores < 5) {
            lines = [
                'La Lira de Cuerdas Simpáticas.',
                `Has reunido ${eigenvalores} Eigenvalor${eigenvalores > 1 ? 'es' : ''}.`,
                'Algunas cuerdas empiezan a vibrar tenuemente...',
                'Necesitas más conocimiento para restaurarla.'
            ];
            this.scene.launch('DialogScene', { lines, onComplete: () => {} });
        } else if (eigenvalores < 12) {
            // M6.4: Lira parcialmente tocable
            lines = [
                'La Lira responde a tu presencia.',
                `Con ${eigenvalores} Eigenvalores, ${eigenvalores} cuerdas resuenan.`,
                '¿Deseas tocarla?'
            ];
            this.scene.launch('DialogScene', {
                lines,
                onComplete: () => {
                    this.showLyraPlayOption(eigenvalores);
                }
            });
        } else {
            // M6.4: Lira completa - 12 cuerdas
            lines = [
                'La Lira de Cuerdas Simpáticas.',
                'Las doce cuerdas vibran en perfecta armonía.',
                'La Gran Sinfonía del Conocimiento espera ser tocada.'
            ];
            this.scene.launch('DialogScene', {
                lines,
                onComplete: () => {
                    this.showLyraPlayOption(eigenvalores);
                }
            });
        }
    }

    // M6.4: Opción para tocar la Lira (abre Sympathetic-12)
    showLyraPlayOption(eigenvalores) {
        const { width, height } = this.cameras.main;

        const box = this.add.graphics();
        box.fillStyle(0x0f172a, 0.95);
        box.fillRoundedRect(width / 2 - 180, height / 2 - 50, 360, 100, 8);
        box.lineStyle(2, 0xa855f7, 0.8);
        box.strokeRoundedRect(width / 2 - 180, height / 2 - 50, 360, 100, 8);

        const title = this.add.text(width / 2, height / 2 - 25, `LIRA DE CUERDAS SIMPATICAS (${eigenvalores}/12)`, {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '14px',
            fontWeight: '600',
            color: '#a855f7'
        }).setOrigin(0.5);

        const subtitle = this.add.text(width / 2, height / 2, 'Un oasis contemplativo. Sin objetivos, sin tiempo.', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '11px',
            color: '#64748b'
        }).setOrigin(0.5);

        const playBtn = this.add.text(width / 2 - 60, height / 2 + 30, '[ E ] Tocar', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '14px',
            color: '#22c55e'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        const cancelBtn = this.add.text(width / 2 + 60, height / 2 + 30, '[ ESC ] Volver', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '14px',
            color: '#94a3b8'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        const cleanup = () => {
            box.destroy();
            title.destroy();
            subtitle.destroy();
            playBtn.destroy();
            cancelBtn.destroy();
        };

        const playLyra = () => {
            cleanup();
            this.openSympathetic12(eigenvalores);
        };

        playBtn.on('pointerdown', playLyra);
        cancelBtn.on('pointerdown', cleanup);

        this.input.keyboard.once('keydown-E', playLyra);
        this.input.keyboard.once('keydown-ESC', cleanup);
    }

    // M6.4: Abrir Sympathetic-12 como oasis
    openSympathetic12(eigenvalores) {
        // Lanzar la simulación con las cuerdas desbloqueadas
        this.scene.launch('SimulationScene', {
            simulation: 'sympathetic-12',
            realm: 'aether',
            isOasis: true, // No hay misión, es contemplativo
            lyreStrings: eigenvalores, // Pasar número de cuerdas
            onComplete: () => {
                // No hacer nada especial, solo volver
            }
        });
    }

    // M5.4: Interacción con el Atril del Primer Resonador
    interactWithAtril() {
        // Primera interacción: mostrar intro de Rameau
        if (!hasSeenSpecialDialogue('rameau-intro')) {
            const dialogue = getSpecialDialogue('rameau-intro');
            if (dialogue) {
                this.scene.launch('DialogScene', {
                    lines: dialogue.lines,
                    onComplete: () => {
                        markSpecialDialogueSeen('rameau-intro');
                        // Lanzar la Rameau Machine
                        this.launchRameauMachine();
                    }
                });
            }
        } else {
            // Ya vio la intro, lanzar directamente
            this.launchRameauMachine();
        }
    }

    launchRameauMachine() {
        // Lanzar la simulación Rameau Machine
        this.scene.launch('SimulationScene', {
            simulation: 'rameau-machine',
            realm: 'aether',
            onComplete: (completed) => {
                if (completed && !hasSeenSpecialDialogue('primer-resonador-flashback')) {
                    // Mostrar flashback después de usar la Rameau Machine
                    const flashback = getSpecialDialogue('primer-resonador-flashback');
                    if (flashback) {
                        this.scene.launch('DialogScene', {
                            lines: flashback.lines,
                            onComplete: () => {
                                markSpecialDialogueSeen('primer-resonador-flashback');
                                // Mostrar revelación de la Disonancia
                                this.showDisonanciaRevelation();
                            }
                        });
                    }
                }
            }
        });
    }

    showDisonanciaRevelation() {
        if (hasSeenSpecialDialogue('disonancia-revelation')) return;

        const revelation = getSpecialDialogue('disonancia-revelation');
        if (revelation) {
            this.scene.launch('DialogScene', {
                lines: revelation.lines,
                onComplete: () => {
                    markSpecialDialogueSeen('disonancia-revelation');
                    // Otorgar λ₁₁ (eigenvalor del Primer Resonador)
                    if (revelation.eigenvalorReward && !gameState.isSimulationCompleted('rameau-machine')) {
                        gameState.completeSimulation('rameau-machine');
                        this.notifications.show({
                            title: 'EIGENVALOR OBTENIDO',
                            message: 'λ₁₁ — El legado del Primer Resonador',
                            type: 'eigenvalor',
                            realm: 'aether'
                        });
                    }
                }
            });
        }
    }

    // M6: Entrar al Corazón de La Disonancia
    enterDisonancia() {
        synthAudio.playPortal();

        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('DissonanceScene');
        });
    }

    enterPortal(realm, portal) {
        if (!portal.isUnlocked) {
            const progress = gameState.getUnlockProgress(realm);
            this.scene.launch('DialogScene', {
                lines: [
                    `${realm.toUpperCase()} está sellado.`,
                    `Necesitas ${progress.required} Eigenvalores para entrar.`,
                    `Actualmente tienes ${progress.current}.`,
                    'Explora otros reinos para ganar más.'
                ],
                onComplete: () => {}
            });
            return;
        }

        // M7.2: Transición mejorada con efectos del reino
        this.transitionManager.realmTransition(realm, 800).then(() => {
            this.scene.start('RealmScene', {
                realm: realm,
                from: 'aether'
            });
        });
    }

    openPauseMenu() {
        this.scene.pause();
        this.scene.launch('PauseScene', { parentScene: 'AetherHub' });
    }

    openKnowledgeGraph() {
        this.cameras.main.fadeOut(400, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('GraphScene');
        });
    }

    update(time, delta) {
        if (this.player) {
            this.player.update();
        }

        if (this.constructo) {
            this.constructo.update(time);
        }

        // Animar anillos
        if (this.waveRings) {
            this.waveRings.forEach((ring) => {
                const pulse = Math.sin(time * 0.001 + ring.phase) * 0.5 + 0.5;
                ring.setStrokeStyle(1, REALM_COLORS.aether.primary, 0.05 + pulse * 0.1);
                ring.setScale(1 + pulse * 0.05);
            });
        }

        // Animar glow de la lira
        if (this.lyraGlow) {
            const pulse = Math.sin(time * 0.002) * 0.5 + 0.5;
            this.lyraGlow.setAlpha(0.05 + pulse * 0.1);
            this.lyraGlow.setScale(1 + pulse * 0.1);
        }

        // Animar portales
        Object.values(this.portals).forEach(portal => {
            if (portal.isUnlocked) {
                const pulse = Math.sin(time * 0.003 + portal.x * 0.01) * 0.5 + 0.5;
                portal.setScale(portal.baseScale + pulse * 0.08);
                portal.setAlpha(0.7 + pulse * 0.3);
            }
        });

        // Prompts de proximidad
        this.updateProximityPrompts();
    }

    updateProximityPrompts() {
        if (!this.player) return;

        const playerX = this.player.x;
        const playerY = this.player.y;

        // Lira
        const lyraDistance = Phaser.Math.Distance.Between(playerX, playerY, this.lyra.x, this.lyra.y);
        this.lyraPrompt.setAlpha(lyraDistance < this.lyra.interactionRadius ? 1 : 0);

        // M5.4: Atril
        if (this.atril && this.atrilPrompt) {
            const atrilDistance = Phaser.Math.Distance.Between(playerX, playerY, this.atril.x, this.atril.y);
            this.atrilPrompt.setAlpha(atrilDistance < this.atril.interactionRadius ? 1 : 0);
        }

        // M6: Portal Disonancia
        if (this.disonanciaPortal && this.disonanciaPrompt) {
            const disonanciaDistance = Phaser.Math.Distance.Between(playerX, playerY, this.disonanciaPortal.x, this.disonanciaPortal.y);
            this.disonanciaPrompt.setAlpha(disonanciaDistance < this.disonanciaPortal.interactionRadius ? 1 : 0);
        }

        // Portales
        Object.values(this.portals).forEach(portal => {
            const distance = Phaser.Math.Distance.Between(playerX, playerY, portal.x, portal.y);
            if (portal.isUnlocked && portal.prompt) {
                portal.prompt.setAlpha(distance < PORTAL.activationDistance + 50 ? 1 : 0);
            }
        });
    }

    shutdown() {
        if (this.progressUI) {
            this.progressUI.destroy();
        }
        if (this.notifications) {
            this.notifications.destroy();
        }
        if (this.constructo) {
            this.constructo.destroy();
        }
        if (this.lyreHUD) {
            this.lyreHUD.destroy();
        }
        if (this.resonanceBar) {
            this.resonanceBar.destroy();
        }
        // M7.2: Limpieza de sistemas visuales
        if (this.transitionManager) {
            this.transitionManager.cleanup();
        }
        if (this.particleEffects) {
            this.particleEffects.destroy();
        }
    }
}
