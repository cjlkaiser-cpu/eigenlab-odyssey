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

        // UI del reino
        this.createRealmUI();

        // Configurar cámara
        this.cameras.main.fadeIn(800, 0, 0, 0);

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
        } else if (eigenvalores < 5) {
            lines = [
                'La Lira de Cuerdas Simpáticas.',
                `Has reunido ${eigenvalores} Eigenvalor${eigenvalores > 1 ? 'es' : ''}.`,
                'Algunas cuerdas empiezan a vibrar tenuemente...',
                'Necesitas más conocimiento para restaurarla.'
            ];
        } else {
            lines = [
                'La Lira responde a tu presencia.',
                `Con ${eigenvalores} Eigenvalores, las cuerdas resuenan.`,
                'Las conexiones que has descubierto le dan vida.',
                'Pronto podrás tocarla de nuevo...'
            ];
        }

        this.scene.launch('DialogScene', { lines, onComplete: () => {} });
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

        // Sonido de portal al entrar
        synthAudio.playPortal();

        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
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
    }
}
