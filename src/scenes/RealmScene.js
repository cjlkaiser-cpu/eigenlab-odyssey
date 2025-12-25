/**
 * RealmScene - Escena genérica para cada reino
 *
 * Muestra las simulaciones disponibles como nodos navegables.
 * Se configura dinámicamente según el reino que se visita.
 */

import Phaser from 'phaser';
import {
    GAME_WIDTH,
    GAME_HEIGHT,
    REALM_COLORS,
    UI_COLORS,
    REALM_SIMULATIONS
} from '../core/constants.js';
import ProgressUI from '../ui/ProgressUI.js';
import LyreHUD from '../ui/LyreHUD.js';
import ResonanceBar from '../ui/ResonanceBar.js';
import gameState from '../systems/GameState.js';
import { getMission } from '../data/missions.js';
import { getGuardianIntro } from '../data/guardians.js';

// Metadatos de simulaciones
const SIMULATION_META = {
    // COSMOS
    'formacion-galaxias': { name: 'Formación de Galaxias', desc: 'N-body gravitacional' },
    'sistema-solar': { name: 'Sistema Solar', desc: 'Órbitas planetarias' },
    'agujero-negro': { name: 'Agujero Negro', desc: 'Horizonte de eventos' },
    'expansion-universo': { name: 'Expansión del Universo', desc: 'Ley de Hubble' },
    'nucleosintesis': { name: 'Nucleosíntesis', desc: 'Forja estelar' },
    'pulsares': { name: 'Púlsares', desc: 'Faros cósmicos' },
    'lentes-gravitacionales': { name: 'Lentes Gravitacionales', desc: 'Luz curvada' },
    'ondas-gravitacionales': { name: 'Ondas Gravitacionales', desc: 'Rizos del espacio-tiempo' },
    'diagrama-hr': { name: 'Diagrama H-R', desc: 'Vida de las estrellas' },
    'orbitas-kepler': { name: 'Órbitas de Kepler', desc: 'Leyes del movimiento' },
    'three-body': { name: 'Problema de 3 Cuerpos', desc: 'Caos gravitacional' },

    // CHAOS
    'lorenz-attractor': { name: 'Atractor de Lorenz', desc: 'El efecto mariposa' },
    'strange-attractors': { name: 'Atractores Extraños', desc: 'Orden en el caos' },
    'double-pendulum': { name: 'Péndulo Doble', desc: 'Sensibilidad inicial' },
    'atractor-multicuerpo': { name: 'Atractor Multicuerpo', desc: 'Danza caótica' },
    'boids-masivo': { name: 'Boids Masivo', desc: 'Emergencia colectiva' },
    'game-of-life': { name: 'Juego de la Vida', desc: 'Autómata de Conway' },
    'reaccion-difusion': { name: 'Reacción-Difusión', desc: 'Patrones de Turing' },
    'emergence': { name: 'Emergencia', desc: 'Lo simple crea lo complejo' },
    'flow-fields': { name: 'Campos de Flujo', desc: 'Vectores en movimiento' },
    'juego-caos': { name: 'Juego del Caos', desc: 'Fractales iterativos' },

    // LOGOS
    'mandelbrot': { name: 'Conjunto de Mandelbrot', desc: 'Infinito en finito' },
    'fractales-ifs': { name: 'Fractales IFS', desc: 'Sistemas iterados' },
    'riemann': { name: 'Hipótesis de Riemann', desc: 'Los ceros de zeta' },
    'domain-coloring': { name: 'Domain Coloring', desc: 'Funciones complejas' },
    'collatz-tree': { name: 'Árbol de Collatz', desc: 'Conjetura 3n+1' },
    'ulam-spiral': { name: 'Espiral de Ulam', desc: 'Patrón de primos' },
    'fourier-epicycles': { name: 'Epiciclos de Fourier', desc: 'Círculos que dibujan' },
    'taylor': { name: 'Series de Taylor', desc: 'Aproximación infinita' },
    'phyllotaxis': { name: 'Filotaxis', desc: 'Geometría vegetal' },
    'l-systems': { name: 'L-Systems', desc: 'Gramáticas de crecimiento' },
    'voronoi': { name: 'Diagrama de Voronoi', desc: 'Territorios óptimos' },
    'mathematical-knots': { name: 'Nudos Matemáticos', desc: 'Topología en 3D' },
    'poincare-disk': { name: 'Disco de Poincaré', desc: 'Geometría hiperbólica' },
    'symmetry-groups': { name: 'Grupos de Simetría', desc: 'Transformaciones' },

    // ATOMOS
    'orbitales': { name: 'Orbitales 3D', desc: 'Nubes de probabilidad cuántica' },
    'ondas': { name: 'Ondas', desc: 'Propagación ondulatoria' },
    'interferencia': { name: 'Interferencia', desc: 'Superposición de ondas' },
    'efecto-doppler': { name: 'Efecto Doppler', desc: 'Frecuencia en movimiento' },
    'pendulo-simple': { name: 'Péndulo Simple', desc: 'Oscilación armónica' },
    'oscilador-forzado': { name: 'Oscilador Forzado', desc: 'Resonancia mecánica' },
    'colisiones': { name: 'Colisiones', desc: 'Conservación del momento' },
    'campo-electrico': { name: 'Campo Eléctrico', desc: 'Líneas de fuerza' },
    'optica': { name: 'Óptica', desc: 'Reflexión y refracción' },
    'relatividad': { name: 'Relatividad', desc: 'Espacio-tiempo' },
    'efecto-tunel': { name: 'Efecto Túnel', desc: 'Probabilidad cuántica' },
    'mecanica-lagrangiana': { name: 'Mecánica Lagrangiana', desc: 'Principio de mínima acción' },

    // TERRA
    'tectonica-placas': { name: 'Tectónica de Placas', desc: 'Deriva continental' },
    'terremotos': { name: 'Terremotos', desc: 'Ondas sísmicas' },
    'volcanes': { name: 'Volcanes', desc: 'Magma y erupciones' },
    'erosion': { name: 'Erosión', desc: 'Desgaste del terreno' },
    'erosion-hidraulica': { name: 'Erosión Hidráulica', desc: 'Poder del agua' },
    'ciclo-rocas': { name: 'Ciclo de las Rocas', desc: 'Transformación mineral' },
    'estratigrafia': { name: 'Estratigrafía', desc: 'Capas del tiempo' },

    // MACHINA
    'automatas-elementales': { name: 'Autómatas Elementales', desc: 'Regla 110 y más' },
    'finite-automata': { name: 'Autómatas Finitos', desc: 'Estados y transiciones' },
    'binary-search-tree': { name: 'Árbol Binario', desc: 'Búsqueda eficiente' },
    'bubble-sort': { name: 'Bubble Sort', desc: 'Ordenamiento simple' },
    'logic-gates': { name: 'Compuertas Lógicas', desc: 'AND, OR, NOT' },
    'logic-gates-sandbox': { name: 'Sandbox de Lógica', desc: 'Diseña circuitos' },
    'stack-heap': { name: 'Stack y Heap', desc: 'Memoria en acción' },
    'perceptron': { name: 'Perceptrón', desc: 'Neurona artificial' },
    'perceptron-playground': { name: 'Playground IA', desc: 'Entrena tu red' },

    // ALCHEMY
    'gas-ideal': { name: 'Gas Ideal', desc: 'PV = nRT' },
    'gases-reales': { name: 'Gases Reales', desc: 'Van der Waals' },
    'termodinamica': { name: 'Termodinámica', desc: 'Energía y entropía' },
    'entropia': { name: 'Entropía', desc: 'Desorden universal' },
    'le-chatelier': { name: 'Le Chatelier', desc: 'Equilibrio químico' },
    'cinetica-colisiones': { name: 'Cinética', desc: 'Velocidad de reacción' },
    'titulacion': { name: 'Titulación', desc: 'Análisis volumétrico' },
    'nernst': { name: 'Ecuación de Nernst', desc: 'Potencial electroquímico' },
    'celda-galvanica': { name: 'Celda Galvánica', desc: 'Electricidad química' },
    'diagrama-fases': { name: 'Diagrama de Fases', desc: 'Estados de la materia' },
    'solubilidad': { name: 'Solubilidad', desc: 'Disolución' },

    // BIOS
    'neurona': { name: 'Neurona H-H', desc: 'Potencial de acción' },
    'adn-replicacion': { name: 'Replicación ADN', desc: 'Copia del código' },
    'sintesis-proteinas': { name: 'Síntesis de Proteínas', desc: 'Del gen a la proteína' },
    'mitosis': { name: 'Mitosis', desc: 'División celular' },
    'meiosis': { name: 'Meiosis', desc: 'Células sexuales' },
    'mutaciones': { name: 'Mutaciones', desc: 'Cambios genéticos' },
    'evolucion': { name: 'Evolución', desc: 'Selección natural' },
    'genetica-poblacional': { name: 'Genética Poblacional', desc: 'Hardy-Weinberg' },
    'ecosistema': { name: 'Ecosistema', desc: 'Cadenas tróficas' },
    'krebs': { name: 'Ciclo de Krebs', desc: 'Respiración celular' },
    'glucolisis': { name: 'Glucólisis', desc: 'Energía de la glucosa' },
    'membrana-fluida': { name: 'Membrana Celular', desc: 'Mosaico fluido' },

    // PSYCHE
    'boids-masivo': { name: 'Boids Masivo', desc: 'Emergencia colectiva' },
    'vision': { name: 'Visión', desc: 'Procesamiento visual' },
    'ritmos-circadianos': { name: 'Ritmos Circadianos', desc: 'Reloj biológico' },

    // AETHER
    'contrapunctus': { name: 'Contrapunctus', desc: 'Contrapunto barroco' },
    'sympathetic-12': { name: 'Sympathetic 12', desc: 'Cuerdas resonantes' },
    'musica-esferas-moderna': { name: 'Música de las Esferas', desc: 'Armonía celestial' },
    'tonnetz-chromatic': { name: 'Tonnetz Cromático', desc: 'Geometría tonal' },
    'tonnetz-dual': { name: 'Tonnetz Dual', desc: 'Espacios armónicos' },
    'cadencia-orbital': { name: 'Cadencia Orbital', desc: 'Ritmo planetario' },
    'harmonices-mundi': { name: 'Harmonices Mundi', desc: 'La armonía de Kepler' },
    'rameau-machine': { name: 'Rameau Machine', desc: 'Armonía funcional' },
    'orbifold-walker': { name: 'Orbifold Walker', desc: 'Espacios armónicos' }
};

const REALM_NAMES = {
    cosmos: 'COSMOS',
    chaos: 'CHAOS',
    logos: 'LOGOS',
    atomos: 'ATOMOS',
    terra: 'TERRA',
    machina: 'MACHINA',
    alchemy: 'ALCHEMY',
    bios: 'BIOS',
    psyche: 'PSYCHE',
    aether: 'AETHER'
};

const REALM_DESCRIPTIONS = {
    cosmos: 'Donde nacen y mueren las estrellas',
    chaos: 'Donde el orden emerge del desorden',
    logos: 'Donde las verdades son eternas',
    atomos: 'Las leyes fundamentales del universo',
    terra: 'El tiempo hecho piedra',
    machina: 'La lógica hecha materia',
    alchemy: 'Transmutación y equilibrio',
    bios: 'La danza de la vida',
    psyche: 'Donde la consciencia despierta',
    aether: 'El reino de la música'
};

export default class RealmScene extends Phaser.Scene {
    constructor() {
        super({ key: 'RealmScene' });
        this.realm = null;
        this.simulations = [];
        this.simNodes = [];
        this.progressUI = null;
        this.lyreHUD = null;
        this.resonanceBar = null;
    }

    init(data) {
        this.realm = data.realm || 'cosmos';
        this.fromRealm = data.from || 'aether';
    }

    create() {
        const { width, height } = this.cameras.main;
        const color = REALM_COLORS[this.realm];

        // Registrar visita
        gameState.setCurrentRealm(this.realm);

        // Obtener simulaciones
        this.simulations = REALM_SIMULATIONS[this.realm] || [];

        // UI
        this.createBackground(color);
        this.createHeader(color);
        this.createSimulationGrid(color);
        this.createControls();

        // Progress UI
        this.progressUI = new ProgressUI(this);

        // Lyre HUD
        this.lyreHUD = new LyreHUD(this);

        // M2: Barra de resonancia
        this.resonanceBar = new ResonanceBar(this, width - 200, 30);

        // Fade in
        this.cameras.main.fadeIn(500);

        // Mostrar diálogo del Guardián si es primera visita
        this.checkGuardianDialogue();
    }

    checkGuardianDialogue() {
        // Verificar si es la primera visita a este reino
        const visitKey = `guardian-${this.realm}-seen`;

        // Usar localStorage para persistir entre sesiones
        const hasSeen = localStorage.getItem(visitKey);

        if (!hasSeen) {
            // Marcar como visto
            localStorage.setItem(visitKey, 'true');

            // Mostrar diálogo después de un breve delay
            this.time.delayedCall(800, () => {
                const lines = getGuardianIntro(this.realm);
                this.scene.launch('DialogScene', {
                    lines,
                    onComplete: () => {
                        // Opcional: hacer algo después del diálogo
                    }
                });
            });
        }
    }

    createBackground(color) {
        const { width, height } = this.cameras.main;

        this.add.rectangle(width / 2, height / 2, width, height, UI_COLORS.background);

        // Gradiente del reino
        for (let i = 5; i > 0; i--) {
            const alpha = 0.015 * i;
            const radius = (Math.min(width, height) / 2) * (i / 5) * 1.8;
            this.add.circle(width / 2, height / 2, radius, color.primary, alpha);
        }

        // Grid
        const grid = this.add.graphics();
        grid.lineStyle(1, color.primary, 0.08);
        for (let y = 0; y < height; y += 40) {
            grid.lineBetween(0, y, width, y);
        }
        for (let x = 0; x < width; x += 40) {
            grid.lineBetween(x, 0, x, height);
        }
    }

    createHeader(color) {
        const { width } = this.cameras.main;

        // Nombre del reino
        this.add.text(40, 25, REALM_NAMES[this.realm], {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '28px',
            fontWeight: '700',
            color: `#${color.primary.toString(16).padStart(6, '0')}`
        });

        this.add.text(40, 58, REALM_DESCRIPTIONS[this.realm], {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '13px',
            color: '#64748b'
        });

        // Contador de completadas
        const completed = gameState.getCompletedCount(this.realm);
        const total = gameState.getTotalCount(this.realm);

        this.completionText = this.add.text(width - 40, 35,
            `${completed}/${total} exploradas`, {
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '14px',
                color: '#94a3b8'
            }).setOrigin(1, 0);

        // Barra de progreso
        const barWidth = 120;
        const barX = width - 40 - barWidth;
        const barY = 55;

        this.add.graphics()
            .fillStyle(0x1e293b, 1)
            .fillRoundedRect(barX, barY, barWidth, 6, 3);

        const progressWidth = total > 0 ? (completed / total) * barWidth : 0;
        this.add.graphics()
            .fillStyle(color.primary, 1)
            .fillRoundedRect(barX, barY, progressWidth, 6, 3);
    }

    createSimulationGrid(color) {
        const { width, height } = this.cameras.main;

        const startY = 100;
        const cols = 4;
        const nodeWidth = 280;
        const nodeHeight = 65;
        const paddingX = 25;
        const paddingY = 12;

        const totalWidth = cols * nodeWidth + (cols - 1) * paddingX;
        const startX = (width - totalWidth) / 2;

        this.simulations.forEach((simId, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);

            const x = startX + col * (nodeWidth + paddingX) + nodeWidth / 2;
            const y = startY + row * (nodeHeight + paddingY) + nodeHeight / 2;

            const node = this.createSimNode(x, y, nodeWidth, nodeHeight, simId, color);
            this.simNodes.push(node);
        });
    }

    createSimNode(x, y, w, h, simId, color) {
        const container = this.add.container(x, y);
        const isCompleted = gameState.isSimulationCompleted(simId);
        const mission = getMission(simId);
        const isCentralPuzzle = mission.isCentralPuzzle || false;

        // Fondo
        const bg = this.add.graphics();
        this.drawNodeBg(bg, w, h, color, isCompleted, false, isCentralPuzzle);
        container.add(bg);

        // Metadata
        const meta = SIMULATION_META[simId] || { name: simId, desc: '' };

        // Indicador de estado (más grande para puzzles centrales)
        const statusColor = isCompleted ? 0x22c55e : (isCentralPuzzle ? 0xfbbf24 : color.primary);
        const statusAlpha = isCompleted ? 1 : (isCentralPuzzle ? 1 : 0.4);
        const statusSize = isCentralPuzzle ? 8 : 5;
        const statusCircle = this.add.circle(-w / 2 + 18, 0, statusSize, statusColor, statusAlpha);
        container.add(statusCircle);

        // Símbolo según estado
        if (isCompleted) {
            const check = this.add.text(-w / 2 + 18, 0, '✓', {
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '8px',
                color: '#030712'
            }).setOrigin(0.5);
            container.add(check);
        } else if (isCentralPuzzle) {
            // Símbolo lambda para puzzles centrales
            const lambda = this.add.text(-w / 2 + 18, 0, 'λ', {
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '10px',
                fontWeight: '700',
                color: '#030712'
            }).setOrigin(0.5);
            container.add(lambda);
        }

        // Badge de puzzle central
        if (isCentralPuzzle && !isCompleted) {
            const badge = this.add.text(w / 2 - 10, -h / 2 + 12, '★ PUZZLE CENTRAL', {
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '8px',
                fontWeight: '700',
                color: '#fbbf24'
            }).setOrigin(1, 0.5);
            container.add(badge);
        }

        // Nombre
        const nameColor = isCompleted ? '#22c55e' : (isCentralPuzzle ? '#fbbf24' : '#f8fafc');
        const nameText = this.add.text(-w / 2 + 35, -10, meta.name, {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '13px',
            fontWeight: isCentralPuzzle ? '700' : '500',
            color: nameColor
        });
        container.add(nameText);

        // Descripción
        const descText = this.add.text(-w / 2 + 35, 8, meta.desc, {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '10px',
            color: '#64748b'
        });
        container.add(descText);

        // Área interactiva
        const hitArea = this.add.rectangle(0, 0, w, h, 0x000000, 0);
        hitArea.setInteractive({ useHandCursor: true });
        container.add(hitArea);

        hitArea.on('pointerover', () => {
            this.drawNodeBg(bg, w, h, color, isCompleted, true, isCentralPuzzle);
        });

        hitArea.on('pointerout', () => {
            this.drawNodeBg(bg, w, h, color, isCompleted, false, isCentralPuzzle);
        });

        hitArea.on('pointerdown', () => {
            this.launchSimulation(simId);
        });

        container.simId = simId;
        container.bg = bg;
        container.isCentralPuzzle = isCentralPuzzle;

        return container;
    }

    drawNodeBg(graphics, w, h, color, isCompleted, isHover, isCentralPuzzle = false) {
        graphics.clear();

        const bgColor = isHover ? color.primary : 0x0f172a;
        const bgAlpha = isHover ? 0.2 : 0.85;

        // Puzzles centrales tienen borde dorado
        let borderColor, borderAlpha, borderWidth;
        if (isCompleted) {
            borderColor = 0x22c55e;
            borderAlpha = isHover ? 0.8 : 0.5;
            borderWidth = isHover ? 2 : 1;
        } else if (isCentralPuzzle) {
            borderColor = 0xfbbf24; // Dorado
            borderAlpha = isHover ? 1 : 0.7;
            borderWidth = 2;
        } else {
            borderColor = color.primary;
            borderAlpha = isHover ? 0.8 : 0.3;
            borderWidth = isHover ? 2 : 1;
        }

        graphics.fillStyle(bgColor, bgAlpha);
        graphics.fillRoundedRect(-w / 2, -h / 2, w, h, 6);
        graphics.lineStyle(borderWidth, borderColor, borderAlpha);
        graphics.strokeRoundedRect(-w / 2, -h / 2, w, h, 6);

        // Glow sutil para puzzles centrales
        if (isCentralPuzzle && !isCompleted) {
            graphics.lineStyle(4, 0xfbbf24, 0.1);
            graphics.strokeRoundedRect(-w / 2 - 2, -h / 2 - 2, w + 4, h + 4, 8);
        }
    }

    createControls() {
        const { width, height } = this.cameras.main;

        // Instrucciones
        this.add.text(width / 2, height - 25,
            'Click para explorar  •  ESC para volver a Aether', {
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '12px',
                color: '#475569'
            }).setOrigin(0.5);

        // Botón volver
        const backBtn = this.add.text(40, height - 25, '← Volver', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '13px',
            color: '#94a3b8'
        }).setInteractive({ useHandCursor: true });

        backBtn.on('pointerover', () => backBtn.setColor('#ffffff'));
        backBtn.on('pointerout', () => backBtn.setColor('#94a3b8'));
        backBtn.on('pointerdown', () => this.returnToAether());

        // Tecla ESC
        this.input.keyboard.on('keydown-ESC', () => this.returnToAether());
    }

    launchSimulation(simId) {
        this.scene.launch('SimulationScene', {
            simulation: simId,
            realm: this.realm,
            onComplete: (completed, explorationData) => {
                if (completed) {
                    // Si es exploración, SimulationScene ya llamó a exploreSimulation()
                    // Solo los puzzles centrales llaman a completeSimulation() para eigenvalor
                    if (!explorationData?.isExploration) {
                        gameState.completeSimulation(simId);
                    }
                    // Actualizar UI
                    this.updateCompletionUI();
                    this.updateNodeVisual(simId);
                }
            }
        });
    }

    updateCompletionUI() {
        const completed = gameState.getCompletedCount(this.realm);
        const total = gameState.getTotalCount(this.realm);
        if (this.completionText) {
            this.completionText.setText(`${completed}/${total} exploradas`);
        }
    }

    updateNodeVisual(simId) {
        const node = this.simNodes.find(n => n.simId === simId);
        if (node) {
            // Recrear el nodo como completado
            // Por simplicidad, solo cambiamos el color del círculo
            const circle = node.list.find(child =>
                child.type === 'Arc' || child.constructor.name === 'Arc'
            );
            if (circle) {
                circle.setFillStyle(0x22c55e, 1);
            }
        }
    }

    returnToAether() {
        this.cameras.main.fadeOut(400);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('AetherHub', { fromRealm: this.realm });
        });
    }

    shutdown() {
        if (this.progressUI) {
            this.progressUI.destroy();
        }
        if (this.lyreHUD) {
            this.lyreHUD.destroy();
        }
        if (this.resonanceBar) {
            this.resonanceBar.destroy();
        }
    }
}
