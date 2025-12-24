/**
 * GraphScene - Visualización interactiva del Grafo de Conocimiento
 *
 * Un mapa estelar donde cada simulación es una estrella,
 * y las conexiones conceptuales son constelaciones de luz.
 */

import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, REALM_COLORS, UI_COLORS } from '../core/constants.js';
import { NODES, EDGES, CONCEPTS, LEARNING_PATHS, getNodeConnections, getPathProgress, isPathComplete } from '../data/knowledgeGraph.js';
import gameState from '../systems/GameState.js';
import NotificationManager from '../ui/NotificationManager.js';

export default class GraphScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GraphScene' });
        this.nodeSprites = {};
        this.edgeGraphics = null;
        this.selectedNode = null;
        this.hoveredNode = null;
        this.camera = null;
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.zoom = 1;
        this.viewMode = 'full'; // 'full', 'paths', 'realm'
        this.activePath = null;
        this.particleEmitters = [];
    }

    create() {
        const { width, height } = this.cameras.main;

        // Fondo estelar profundo
        this.createStarfield();

        // Container para zoom/pan
        this.graphContainer = this.add.container(0, 0);

        // Dibujar aristas primero (debajo de los nodos)
        this.edgeGraphics = this.add.graphics();
        this.graphContainer.add(this.edgeGraphics);

        // Crear nodos
        this.createNodes();

        // Dibujar conexiones
        this.drawEdges();

        // UI superpuesta
        this.createUI();

        // Controles
        this.setupControls();

        // Centrar en el grafo
        this.centerGraph();

        // Sistema de notificaciones
        this.notifications = new NotificationManager(this);

        // Verificar caminos completados
        this.checkPathCompletions();

        // Animación de entrada
        this.playEntryAnimation();
    }

    checkPathCompletions() {
        const completed = gameState.getCompletedSimulations();

        Object.entries(LEARNING_PATHS).forEach(([pathId, path]) => {
            // Solo verificar si no está ya marcado como completado
            if (!gameState.isPathCompleted(pathId)) {
                const allNodesComplete = path.nodes.every(nodeId => completed.has(nodeId));

                if (allNodesComplete) {
                    // ¡Camino completado! Otorgar recompensa
                    gameState.completePath(pathId, path.reward);
                }
            }
        });
    }

    createStarfield() {
        const { width, height } = this.cameras.main;

        // Fondo degradado
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x0a0a1a, 0x0a0a1a, 0x1a0a2e, 0x1a0a2e, 1);
        bg.fillRect(0, 0, width * 3, height * 3);
        bg.setScrollFactor(0);

        // Estrellas de fondo (parallax lento)
        for (let i = 0; i < 300; i++) {
            const x = Phaser.Math.Between(0, width * 2);
            const y = Phaser.Math.Between(0, height * 2);
            const size = Phaser.Math.FloatBetween(0.5, 2);
            const alpha = Phaser.Math.FloatBetween(0.2, 0.8);

            const star = this.add.circle(x, y, size, 0xffffff, alpha);
            star.setScrollFactor(0.1);

            // Algunas estrellas titilan
            if (Math.random() > 0.7) {
                this.tweens.add({
                    targets: star,
                    alpha: alpha * 0.3,
                    duration: Phaser.Math.Between(1000, 3000),
                    yoyo: true,
                    repeat: -1
                });
            }
        }

        // Nebulosas de colores
        const nebulaColors = [0x6366f1, 0xa855f7, 0x3b82f6, 0x22c55e];
        for (let i = 0; i < 5; i++) {
            const x = Phaser.Math.Between(100, width * 2 - 100);
            const y = Phaser.Math.Between(100, height * 2 - 100);
            const color = Phaser.Utils.Array.GetRandom(nebulaColors);

            const nebula = this.add.graphics();
            nebula.fillStyle(color, 0.03);
            nebula.fillCircle(x, y, Phaser.Math.Between(100, 200));
            nebula.setScrollFactor(0.2);
        }
    }

    createNodes() {
        const completed = gameState.getCompletedSimulations();
        const discovered = gameState.getDiscoveredConnections?.() || new Set();

        Object.entries(NODES).forEach(([id, node]) => {
            const isCompleted = completed.has(id);
            const realmColor = REALM_COLORS[node.realm]?.primary || 0xffffff;

            // Calcular posición escalada
            const x = node.position.x + 100;
            const y = node.position.y + 100;

            // Container del nodo
            const nodeContainer = this.add.container(x, y);

            // Halo exterior (solo completados)
            if (isCompleted) {
                const halo = this.add.graphics();
                halo.lineStyle(2, realmColor, 0.3);
                halo.strokeCircle(0, 0, 25);
                nodeContainer.add(halo);

                // Pulso animado
                this.tweens.add({
                    targets: halo,
                    scaleX: 1.3,
                    scaleY: 1.3,
                    alpha: 0,
                    duration: 2000,
                    repeat: -1
                });
            }

            // Glow
            const glow = this.add.graphics();
            glow.fillStyle(realmColor, isCompleted ? 0.4 : 0.15);
            glow.fillCircle(0, 0, isCompleted ? 20 : 15);
            nodeContainer.add(glow);

            // Núcleo del nodo
            const core = this.add.graphics();
            core.fillStyle(isCompleted ? realmColor : 0x1e293b, 1);
            core.fillCircle(0, 0, isCompleted ? 12 : 8);
            core.lineStyle(2, realmColor, isCompleted ? 1 : 0.5);
            core.strokeCircle(0, 0, isCompleted ? 12 : 8);
            nodeContainer.add(core);

            // Nombre (visible solo en hover o completado)
            const nameText = this.add.text(0, 25, node.name, {
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '11px',
                color: isCompleted ? '#f8fafc' : '#64748b',
                align: 'center'
            }).setOrigin(0.5, 0);
            nameText.setAlpha(isCompleted ? 0.9 : 0);
            nodeContainer.add(nameText);

            // Reino badge
            const realmBadge = this.add.text(0, -22, node.realm.toUpperCase().slice(0, 3), {
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '8px',
                color: `#${realmColor.toString(16).padStart(6, '0')}`,
                fontWeight: '700'
            }).setOrigin(0.5).setAlpha(0);
            nodeContainer.add(realmBadge);

            // Hitbox interactiva
            const hitbox = this.add.circle(0, 0, 20, 0xffffff, 0)
                .setInteractive({ useHandCursor: true });
            nodeContainer.add(hitbox);

            // Eventos
            hitbox.on('pointerover', () => this.onNodeHover(id, nodeContainer, nameText, realmBadge));
            hitbox.on('pointerout', () => this.onNodeOut(id, nodeContainer, nameText, realmBadge, isCompleted));
            hitbox.on('pointerdown', () => this.onNodeClick(id));

            // Guardar referencia
            this.nodeSprites[id] = {
                container: nodeContainer,
                core,
                glow,
                nameText,
                realmBadge,
                isCompleted,
                data: node
            };

            this.graphContainer.add(nodeContainer);
        });
    }

    drawEdges(highlightConcept = null, highlightNode = null) {
        this.edgeGraphics.clear();

        const completed = gameState.getCompletedSimulations();

        EDGES.forEach(edge => {
            const fromNode = NODES[edge.from];
            const toNode = NODES[edge.to];
            if (!fromNode || !toNode) return;

            const fromX = fromNode.position.x + 100;
            const fromY = fromNode.position.y + 100;
            const toX = toNode.position.x + 100;
            const toY = toNode.position.y + 100;

            // Determinar si la conexión está "activa"
            const bothCompleted = completed.has(edge.from) && completed.has(edge.to);
            const isHighlighted = highlightConcept === edge.concept ||
                highlightNode === edge.from ||
                highlightNode === edge.to;

            // Color basado en concepto
            const conceptColor = CONCEPTS[edge.concept]?.color || 0x64748b;

            // Estilo de línea
            let alpha = bothCompleted ? 0.6 : 0.15;
            let lineWidth = bothCompleted ? 2 : 1;

            if (isHighlighted) {
                alpha = 0.9;
                lineWidth = 3;
            }

            // Dibujar línea con gradiente simulado
            this.edgeGraphics.lineStyle(lineWidth, conceptColor, alpha);
            this.edgeGraphics.beginPath();
            this.edgeGraphics.moveTo(fromX, fromY);

            // Línea curva para edges largos
            const dx = toX - fromX;
            const dy = toY - fromY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 150) {
                const midX = (fromX + toX) / 2;
                const midY = (fromY + toY) / 2 - dist * 0.1;
                this.edgeGraphics.quadraticBezierTo(midX, midY, toX, toY);
            } else {
                this.edgeGraphics.lineTo(toX, toY);
            }

            this.edgeGraphics.strokePath();

            // Puntos de energía en conexiones activas
            if (bothCompleted && isHighlighted) {
                const particles = 3;
                for (let i = 0; i < particles; i++) {
                    const t = (Date.now() / 2000 + i / particles) % 1;
                    const px = fromX + (toX - fromX) * t;
                    const py = fromY + (toY - fromY) * t;

                    this.edgeGraphics.fillStyle(conceptColor, 0.8);
                    this.edgeGraphics.fillCircle(px, py, 3);
                }
            }
        });
    }

    onNodeHover(nodeId, container, nameText, realmBadge) {
        this.hoveredNode = nodeId;

        // Escalar nodo
        this.tweens.add({
            targets: container,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 150
        });

        // Mostrar nombre y badge
        this.tweens.add({
            targets: [nameText, realmBadge],
            alpha: 1,
            duration: 150
        });

        // Resaltar conexiones
        this.drawEdges(null, nodeId);

        // Mostrar info panel
        this.showNodeInfo(nodeId);
    }

    onNodeOut(nodeId, container, nameText, realmBadge, isCompleted) {
        this.hoveredNode = null;

        // Restaurar escala
        this.tweens.add({
            targets: container,
            scaleX: 1,
            scaleY: 1,
            duration: 150
        });

        // Ocultar nombre si no está completado
        this.tweens.add({
            targets: [nameText, realmBadge],
            alpha: isCompleted ? 0.9 : 0,
            duration: 150
        });

        // Restaurar conexiones
        this.drawEdges();

        // Ocultar info panel
        this.hideNodeInfo();
    }

    onNodeClick(nodeId) {
        const node = NODES[nodeId];
        if (!node) return;

        // Vibración de feedback
        this.cameras.main.shake(50, 0.002);

        // Lanzar simulación
        this.scene.launch('SimulationScene', {
            simulation: nodeId,
            realm: node.realm,
            onComplete: (completed) => {
                if (completed) {
                    gameState.completeSimulation(nodeId);
                    // Refresh del grafo
                    this.refreshGraph();
                }
            }
        });
    }

    showNodeInfo(nodeId) {
        const node = NODES[nodeId];
        if (!node) return;

        const { width, height } = this.cameras.main;

        // Panel de info
        if (this.infoPanel) this.infoPanel.destroy();

        this.infoPanel = this.add.container(width - 220, 100);
        this.infoPanel.setScrollFactor(0);
        this.infoPanel.setDepth(100);

        // Fondo
        const bg = this.add.graphics();
        bg.fillStyle(0x0f172a, 0.95);
        bg.fillRoundedRect(0, 0, 200, 180, 8);
        bg.lineStyle(1, REALM_COLORS[node.realm]?.primary || 0x64748b, 0.5);
        bg.strokeRoundedRect(0, 0, 200, 180, 8);
        this.infoPanel.add(bg);

        // Título
        const title = this.add.text(15, 15, node.name, {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '14px',
            fontWeight: '600',
            color: '#f8fafc'
        });
        this.infoPanel.add(title);

        // Reino
        const realmText = this.add.text(15, 38, node.realm.toUpperCase(), {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '10px',
            color: `#${(REALM_COLORS[node.realm]?.primary || 0x64748b).toString(16).padStart(6, '0')}`
        });
        this.infoPanel.add(realmText);

        // Conceptos
        let conceptY = 60;
        this.add.text(15, conceptY, 'Conceptos:', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '10px',
            color: '#64748b'
        }).setScrollFactor(0).setDepth(100);
        this.infoPanel.add(this.add.text(15, conceptY, 'Conceptos:', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '10px',
            color: '#64748b'
        }));

        conceptY += 18;
        node.concepts.forEach((conceptId, i) => {
            const concept = CONCEPTS[conceptId];
            if (!concept) return;

            const tag = this.add.text(15 + (i % 2) * 90, conceptY + Math.floor(i / 2) * 22,
                `${concept.icon} ${concept.name}`, {
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '10px',
                    color: `#${concept.color.toString(16).padStart(6, '0')}`
                });
            this.infoPanel.add(tag);
        });

        // Conexiones
        const connections = getNodeConnections(nodeId);
        const connText = this.add.text(15, 130, `${connections.length} conexiones`, {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '11px',
            color: '#94a3b8'
        });
        this.infoPanel.add(connText);

        // Estado
        const isCompleted = gameState.getCompletedSimulations().has(nodeId);
        const statusText = this.add.text(15, 150, isCompleted ? '✓ Completado' : '○ Por explorar', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '11px',
            color: isCompleted ? '#22c55e' : '#64748b'
        });
        this.infoPanel.add(statusText);

        // Animación de entrada
        this.infoPanel.setAlpha(0);
        this.tweens.add({
            targets: this.infoPanel,
            alpha: 1,
            duration: 150
        });
    }

    hideNodeInfo() {
        if (this.infoPanel) {
            this.tweens.add({
                targets: this.infoPanel,
                alpha: 0,
                duration: 100,
                onComplete: () => {
                    if (this.infoPanel) {
                        this.infoPanel.destroy();
                        this.infoPanel = null;
                    }
                }
            });
        }
    }

    createUI() {
        const { width, height } = this.cameras.main;

        // Header
        const header = this.add.graphics();
        header.fillStyle(0x0f172a, 0.9);
        header.fillRect(0, 0, width, 60);
        header.setScrollFactor(0).setDepth(50);

        // Título
        this.add.text(25, 18, 'GRAFO DE CONOCIMIENTO', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '18px',
            fontWeight: '700',
            color: '#f8fafc'
        }).setScrollFactor(0).setDepth(51);

        this.add.text(25, 40, 'Explora las conexiones entre fenómenos', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '11px',
            color: '#64748b'
        }).setScrollFactor(0).setDepth(51);

        // Eigenvalor counter
        const lambda = gameState.getEigenvalores();
        this.lambdaText = this.add.text(width - 25, 25, `${lambda}λ`, {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '20px',
            fontWeight: '700',
            color: '#a855f7'
        }).setOrigin(1, 0).setScrollFactor(0).setDepth(51);

        // Botón volver
        const backBtn = this.add.text(width - 25, 45, '← Volver [ESC]', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '11px',
            color: '#64748b'
        }).setOrigin(1, 0).setScrollFactor(0).setDepth(51)
            .setInteractive({ useHandCursor: true });

        backBtn.on('pointerover', () => backBtn.setColor('#f8fafc'));
        backBtn.on('pointerout', () => backBtn.setColor('#64748b'));
        backBtn.on('pointerdown', () => this.returnToHub());

        // Panel de caminos de aprendizaje
        this.createPathsPanel();

        // Leyenda de conceptos
        this.createConceptLegend();

        // Controles de zoom
        this.createZoomControls();
    }

    createPathsPanel() {
        const { width, height } = this.cameras.main;
        const panelWidth = 220;
        const panelX = 15;
        const panelY = 75;

        const pathsContainer = this.add.container(panelX, panelY);
        pathsContainer.setScrollFactor(0).setDepth(50);

        // Fondo
        const bg = this.add.graphics();
        bg.fillStyle(0x0f172a, 0.9);
        bg.fillRoundedRect(0, 0, panelWidth, 280, 8);
        pathsContainer.add(bg);

        // Título
        const title = this.add.text(15, 12, '🛤️ CAMINOS DE APRENDIZAJE', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '11px',
            fontWeight: '700',
            color: '#f8fafc'
        });
        pathsContainer.add(title);

        // Lista de caminos
        let y = 40;
        const completedSims = gameState.getCompletedSimulations();

        Object.entries(LEARNING_PATHS).forEach(([pathId, path]) => {
            const progress = getPathProgress(pathId, completedSims);
            const isComplete = gameState.isPathCompleted(pathId);

            // Icono y nombre
            const pathRow = this.add.container(15, y);

            // Checkmark para completados
            if (isComplete) {
                const check = this.add.text(-2, 0, '✓', {
                    fontSize: '12px',
                    color: '#22c55e',
                    fontWeight: '700'
                });
                pathRow.add(check);
            }

            const icon = this.add.text(isComplete ? 14 : 0, 0, path.icon, { fontSize: '14px' });
            pathRow.add(icon);

            const name = this.add.text(isComplete ? 36 : 22, 1, path.name, {
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '11px',
                color: isComplete ? '#22c55e' : '#94a3b8'
            }).setInteractive({ useHandCursor: true });
            pathRow.add(name);

            // Barra de progreso
            const barBg = this.add.graphics();
            barBg.fillStyle(0x1e293b, 1);
            barBg.fillRoundedRect(0, 18, 180, 4, 2);
            pathRow.add(barBg);

            const barFill = this.add.graphics();
            barFill.fillStyle(path.color, 1);
            barFill.fillRoundedRect(0, 18, 180 * progress.percentage / 100, 4, 2);
            pathRow.add(barFill);

            // Progreso texto
            const progText = this.add.text(185, 16, `${progress.completed}/${progress.total}`, {
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '9px',
                color: '#64748b'
            }).setOrigin(1, 0);
            pathRow.add(progText);

            // Interactividad
            name.on('pointerover', () => {
                name.setColor('#ffffff');
                this.highlightPath(pathId);
            });
            name.on('pointerout', () => {
                name.setColor(isComplete ? '#22c55e' : '#94a3b8');
                this.clearPathHighlight();
            });

            pathsContainer.add(pathRow);
            y += 30;
        });
    }

    highlightPath(pathId) {
        const path = LEARNING_PATHS[pathId];
        if (!path) return;

        this.activePath = pathId;

        // Atenuar todos los nodos
        Object.values(this.nodeSprites).forEach(sprite => {
            sprite.container.setAlpha(0.2);
        });

        // Resaltar nodos del camino
        path.nodes.forEach((nodeId, index) => {
            const sprite = this.nodeSprites[nodeId];
            if (sprite) {
                sprite.container.setAlpha(1);
                sprite.nameText.setAlpha(1);

                // Mostrar número de orden
                const orderBadge = this.add.text(
                    sprite.container.x,
                    sprite.container.y - 30,
                    `${index + 1}`,
                    {
                        fontFamily: 'Inter, system-ui, sans-serif',
                        fontSize: '12px',
                        fontWeight: '700',
                        color: `#${path.color.toString(16).padStart(6, '0')}`,
                        backgroundColor: '#0f172a',
                        padding: { x: 6, y: 2 }
                    }
                ).setOrigin(0.5);
                orderBadge.setName('pathOrder');
                this.graphContainer.add(orderBadge);
            }
        });

        // Redibujar edges resaltando los del camino
        this.drawPathEdges(path);
    }

    drawPathEdges(path) {
        this.edgeGraphics.clear();

        // Dibujar todos los edges atenuados
        EDGES.forEach(edge => {
            const fromNode = NODES[edge.from];
            const toNode = NODES[edge.to];
            if (!fromNode || !toNode) return;

            this.edgeGraphics.lineStyle(1, 0x64748b, 0.1);
            this.edgeGraphics.beginPath();
            this.edgeGraphics.moveTo(fromNode.position.x + 100, fromNode.position.y + 100);
            this.edgeGraphics.lineTo(toNode.position.x + 100, toNode.position.y + 100);
            this.edgeGraphics.strokePath();
        });

        // Dibujar edges del camino resaltados
        for (let i = 0; i < path.nodes.length - 1; i++) {
            const fromId = path.nodes[i];
            const toId = path.nodes[i + 1];
            const fromNode = NODES[fromId];
            const toNode = NODES[toId];

            if (fromNode && toNode) {
                this.edgeGraphics.lineStyle(3, path.color, 0.9);
                this.edgeGraphics.beginPath();
                this.edgeGraphics.moveTo(fromNode.position.x + 100, fromNode.position.y + 100);
                this.edgeGraphics.lineTo(toNode.position.x + 100, toNode.position.y + 100);
                this.edgeGraphics.strokePath();

                // Flecha direccional
                const angle = Phaser.Math.Angle.Between(
                    fromNode.position.x, fromNode.position.y,
                    toNode.position.x, toNode.position.y
                );
                const arrowX = toNode.position.x + 100 - Math.cos(angle) * 25;
                const arrowY = toNode.position.y + 100 - Math.sin(angle) * 25;

                this.edgeGraphics.fillStyle(path.color, 0.9);
                this.edgeGraphics.fillTriangle(
                    arrowX + Math.cos(angle) * 8,
                    arrowY + Math.sin(angle) * 8,
                    arrowX + Math.cos(angle - 2.5) * 8,
                    arrowY + Math.sin(angle - 2.5) * 8,
                    arrowX + Math.cos(angle + 2.5) * 8,
                    arrowY + Math.sin(angle + 2.5) * 8
                );
            }
        }
    }

    clearPathHighlight() {
        this.activePath = null;

        // Restaurar todos los nodos
        Object.entries(this.nodeSprites).forEach(([id, sprite]) => {
            sprite.container.setAlpha(1);
            sprite.nameText.setAlpha(sprite.isCompleted ? 0.9 : 0);
        });

        // Eliminar badges de orden
        this.graphContainer.list
            .filter(child => child.name === 'pathOrder')
            .forEach(badge => badge.destroy());

        // Restaurar edges
        this.drawEdges();
    }

    createConceptLegend() {
        const { width, height } = this.cameras.main;

        const legendContainer = this.add.container(width - 220, height - 200);
        legendContainer.setScrollFactor(0).setDepth(50);

        // Fondo
        const bg = this.add.graphics();
        bg.fillStyle(0x0f172a, 0.9);
        bg.fillRoundedRect(0, 0, 200, 185, 8);
        legendContainer.add(bg);

        // Título
        const title = this.add.text(15, 12, '💡 CONCEPTOS', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '11px',
            fontWeight: '700',
            color: '#f8fafc'
        });
        legendContainer.add(title);

        // Lista de conceptos (los más importantes)
        const mainConcepts = ['gravity', 'chaos', 'waves', 'emergence', 'fractals', 'harmony', 'computation', 'evolution'];
        let y = 35;

        mainConcepts.forEach(conceptId => {
            const concept = CONCEPTS[conceptId];
            if (!concept) return;

            const row = this.add.container(15, y);

            // Color dot
            const dot = this.add.graphics();
            dot.fillStyle(concept.color, 1);
            dot.fillCircle(6, 6, 5);
            row.add(dot);

            // Nombre
            const name = this.add.text(18, 0, `${concept.icon} ${concept.name}`, {
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '10px',
                color: '#94a3b8'
            }).setInteractive({ useHandCursor: true });
            row.add(name);

            // Interactividad para filtrar
            name.on('pointerover', () => {
                name.setColor('#ffffff');
                this.highlightConcept(conceptId);
            });
            name.on('pointerout', () => {
                name.setColor('#94a3b8');
                this.clearConceptHighlight();
            });

            legendContainer.add(row);
            y += 18;
        });
    }

    highlightConcept(conceptId) {
        // Resaltar nodos con ese concepto
        Object.entries(this.nodeSprites).forEach(([id, sprite]) => {
            const hasConcept = sprite.data.concepts.includes(conceptId);
            sprite.container.setAlpha(hasConcept ? 1 : 0.2);
            if (hasConcept) {
                sprite.nameText.setAlpha(1);
            }
        });

        // Resaltar edges con ese concepto
        this.drawEdges(conceptId, null);
    }

    clearConceptHighlight() {
        // Restaurar todos los nodos
        Object.entries(this.nodeSprites).forEach(([id, sprite]) => {
            sprite.container.setAlpha(1);
            sprite.nameText.setAlpha(sprite.isCompleted ? 0.9 : 0);
        });

        // Restaurar edges
        this.drawEdges();
    }

    createZoomControls() {
        const { width, height } = this.cameras.main;

        const zoomContainer = this.add.container(width - 60, height / 2);
        zoomContainer.setScrollFactor(0).setDepth(50);

        // Fondo
        const bg = this.add.graphics();
        bg.fillStyle(0x0f172a, 0.9);
        bg.fillRoundedRect(0, 0, 45, 100, 8);
        zoomContainer.add(bg);

        // Zoom in
        const zoomIn = this.add.text(22, 20, '+', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '20px',
            color: '#94a3b8'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        zoomIn.on('pointerover', () => zoomIn.setColor('#ffffff'));
        zoomIn.on('pointerout', () => zoomIn.setColor('#94a3b8'));
        zoomIn.on('pointerdown', () => this.zoomIn());
        zoomContainer.add(zoomIn);

        // Zoom level
        this.zoomText = this.add.text(22, 50, '100%', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '10px',
            color: '#64748b'
        }).setOrigin(0.5);
        zoomContainer.add(this.zoomText);

        // Zoom out
        const zoomOut = this.add.text(22, 80, '−', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '20px',
            color: '#94a3b8'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        zoomOut.on('pointerover', () => zoomOut.setColor('#ffffff'));
        zoomOut.on('pointerout', () => zoomOut.setColor('#94a3b8'));
        zoomOut.on('pointerdown', () => this.zoomOut());
        zoomContainer.add(zoomOut);
    }

    zoomIn() {
        this.zoom = Math.min(2, this.zoom + 0.2);
        this.applyZoom();
    }

    zoomOut() {
        this.zoom = Math.max(0.5, this.zoom - 0.2);
        this.applyZoom();
    }

    applyZoom() {
        this.tweens.add({
            targets: this.graphContainer,
            scaleX: this.zoom,
            scaleY: this.zoom,
            duration: 200,
            ease: 'Power2'
        });
        this.zoomText.setText(`${Math.round(this.zoom * 100)}%`);
    }

    setupControls() {
        // ESC para volver
        this.input.keyboard.on('keydown-ESC', () => this.returnToHub());

        // Drag para pan
        this.input.on('pointerdown', (pointer) => {
            if (pointer.leftButtonDown() && !this.hoveredNode) {
                this.isDragging = true;
                this.dragStart.x = pointer.x - this.graphContainer.x;
                this.dragStart.y = pointer.y - this.graphContainer.y;
            }
        });

        this.input.on('pointermove', (pointer) => {
            if (this.isDragging) {
                this.graphContainer.x = pointer.x - this.dragStart.x;
                this.graphContainer.y = pointer.y - this.dragStart.y;
            }
        });

        this.input.on('pointerup', () => {
            this.isDragging = false;
        });

        // Scroll para zoom
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
            if (deltaY > 0) {
                this.zoomOut();
            } else {
                this.zoomIn();
            }
        });
    }

    centerGraph() {
        const { width, height } = this.cameras.main;

        // Calcular bounds del grafo
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;

        Object.values(NODES).forEach(node => {
            minX = Math.min(minX, node.position.x);
            maxX = Math.max(maxX, node.position.x);
            minY = Math.min(minY, node.position.y);
            maxY = Math.max(maxY, node.position.y);
        });

        const graphWidth = maxX - minX + 200;
        const graphHeight = maxY - minY + 200;

        // Centrar
        this.graphContainer.x = (width - graphWidth) / 2 - minX;
        this.graphContainer.y = (height - graphHeight) / 2 - minY + 30;
    }

    playEntryAnimation() {
        // Fade in de nodos
        Object.values(this.nodeSprites).forEach((sprite, index) => {
            sprite.container.setAlpha(0);
            sprite.container.setScale(0);

            this.tweens.add({
                targets: sprite.container,
                alpha: 1,
                scaleX: 1,
                scaleY: 1,
                duration: 500,
                delay: index * 20,
                ease: 'Back.out'
            });
        });

        // Fade in de edges
        this.edgeGraphics.setAlpha(0);
        this.tweens.add({
            targets: this.edgeGraphics,
            alpha: 1,
            duration: 800,
            delay: 500
        });
    }

    refreshGraph() {
        // Actualizar estado visual de nodos completados
        const completed = gameState.getCompletedSimulations();

        Object.entries(this.nodeSprites).forEach(([id, sprite]) => {
            const isNowCompleted = completed.has(id);
            if (isNowCompleted && !sprite.isCompleted) {
                sprite.isCompleted = true;

                // Animación de completado
                this.tweens.add({
                    targets: sprite.container,
                    scaleX: 1.5,
                    scaleY: 1.5,
                    duration: 200,
                    yoyo: true,
                    onComplete: () => {
                        // Actualizar visuals
                        sprite.core.clear();
                        sprite.core.fillStyle(REALM_COLORS[sprite.data.realm]?.primary || 0xffffff, 1);
                        sprite.core.fillCircle(0, 0, 12);
                        sprite.core.lineStyle(2, REALM_COLORS[sprite.data.realm]?.primary || 0xffffff, 1);
                        sprite.core.strokeCircle(0, 0, 12);

                        sprite.nameText.setAlpha(0.9);
                        sprite.nameText.setColor('#f8fafc');
                    }
                });
            }
        });

        // Redibujar edges
        this.drawEdges();

        // Actualizar lambda counter
        this.lambdaText.setText(`${gameState.getEigenvalores()}λ`);
    }

    returnToHub() {
        this.scene.start('AetherHub');
    }
}
