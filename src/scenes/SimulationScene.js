/**
 * SimulationScene - Carga y muestra una simulación de EigenLab
 *
 * Sistema de misiones:
 * 1. Muestra objetivo al entrar
 * 2. Timer de exploración mínima
 * 3. Verificación con pregunta
 * 4. Eigenvalor al completar
 */

import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, REALM_COLORS, UI_COLORS } from '../core/constants.js';
import { getMission } from '../data/missions.js';
import { getFragment, isCentralPuzzle } from '../data/constructoFragments.js';
import gameState from '../systems/GameState.js';

// Rutas de simulaciones - VERIFICADAS contra estructura real de EigenLab
const SIMULATION_PATHS = {
    // ═══════════════════════════════════════════════════════════════
    // COSMOS - Astronomía
    // ═══════════════════════════════════════════════════════════════
    'formacion-galaxias': 'Astronomy/Astronomy Visual Lab/formacion-galaxias.html',
    'sistema-solar': 'Physics/Physics Visual Lab/sistema-solar.html',
    'agujero-negro': 'Astronomy/Astronomy Visual Lab/agujero-negro.html',
    'expansion-universo': 'Astronomy/Astronomy Visual Lab/expansion-universo.html',
    'nucleosintesis': 'Astronomy/Astronomy Visual Lab/nucleosintesis.html',
    'pulsares': 'Astronomy/Astronomy Sound Lab/pulsares.html',
    'lentes-gravitacionales': 'Astronomy/Astronomy Visual Lab/lentes-gravitacionales.html',
    'ondas-gravitacionales': 'Astronomy/Astronomy Sound Lab/ondas-gravitacionales.html',
    'diagrama-hr': 'Astronomy/Astronomy Visual Lab/diagrama-hr.html',
    'orbitas-kepler': 'Physics/Physics Visual Lab/orbitas-kepler.html',
    'three-body': 'Mathematics/Math Visual Lab/three-body.html',
    'fases-lunares': 'Astronomy/Astronomy Visual Lab/fases-lunares.html',
    'estaciones': 'Astronomy/Astronomy Visual Lab/estaciones.html',

    // ═══════════════════════════════════════════════════════════════
    // CHAOS - Sistemas Dinámicos y Emergentes
    // ═══════════════════════════════════════════════════════════════
    'lorenz-attractor': 'Mathematics/Math Visual Lab/lorenz-attractor.html',
    'strange-attractors': 'Mathematics/Math Generative Art Lab/strange-attractors.html',
    'double-pendulum': 'Mathematics/Math Visual Lab/double-pendulum.html',
    'atractor-multicuerpo': 'Physics/Physics Visual Lab/atractor-multicuerpo.html',
    'boids-masivo': 'Biology/Biology Visual Lab/boids-masivo.html',
    'game-of-life': 'Mathematics/Math Visual Lab/game-of-life.html',
    'reaccion-difusion': 'Mathematics/Math Generative Art Lab/reaccion-difusion.html',
    'flow-fields': 'Mathematics/Math Generative Art Lab/flow-fields.html',
    'juego-caos': 'Mathematics/Math Visual Lab/juego-caos.html',
    'galton-board': 'Mathematics/Math Visual Lab/galton-board.html',

    // ═══════════════════════════════════════════════════════════════
    // LOGOS - Matemáticas Puras
    // ═══════════════════════════════════════════════════════════════
    'mandelbrot': 'Mathematics/Math Visual Lab/mandelbrot.html',
    'fractales-ifs': 'Mathematics/Math Generative Art Lab/fractales-ifs.html',
    'riemann': 'Mathematics/Math Visual Lab/riemann.html',
    'domain-coloring': 'Mathematics/Math Visual Lab/domain-coloring.html',
    'collatz-tree': 'Mathematics/Math Visual Lab/collatz-tree.html',
    'ulam-spiral': 'Mathematics/Math Visual Lab/ulam-spiral.html',
    'fourier-epicycles': 'Mathematics/Math Visual Lab/fourier-epicycles.html',
    'taylor': 'Mathematics/Math Visual Lab/taylor.html',
    'phyllotaxis': 'Mathematics/Math Generative Art Lab/phyllotaxis.html',
    'l-systems': 'Mathematics/Math Generative Art Lab/l-systems.html',
    'voronoi': 'Mathematics/Math Visual Lab/voronoi.html',
    'mathematical-knots': 'Mathematics/Math Visual Lab/mathematical-knots.html',
    'poincare-disk': 'Mathematics/Math Visual Lab/poincare-disk.html',
    'symmetry-groups': 'Mathematics/Math Visual Lab/symmetry-groups.html',
    'funciones': 'Mathematics/Math Visual Lab/funciones.html',
    'trigonometria': 'Mathematics/Math Visual Lab/trigonometria.html',
    'probabilidad': 'Mathematics/Math Visual Lab/probabilidad.html',
    'montecarlo-pi': 'Mathematics/Math Visual Lab/montecarlo-pi.html',
    'ecuaciones-diferenciales': 'Mathematics/Math Visual Lab/ecuaciones-diferenciales.html',
    'geometria-3d': 'Mathematics/Math Visual Lab/geometria-3d.html',
    'mobius-strip': 'Mathematics/Math Visual Lab/mobius-strip.html',
    'transform-matrix': 'Mathematics/Math Visual Lab/transform-matrix.html',
    'vector-field': 'Mathematics/Math Visual Lab/vector-field.html',
    'teselaciones-aperiodicas': 'Mathematics/Math Generative Art Lab/teselaciones-aperiodicas.html',

    // ═══════════════════════════════════════════════════════════════
    // ATOMOS - Física
    // ═══════════════════════════════════════════════════════════════
    'ondas': 'Physics/Physics Visual Lab/ondas.html',
    'interferencia': 'Physics/Physics Visual Lab/interferencia.html',
    'efecto-doppler': 'Physics/Physics Visual Lab/efecto-doppler.html',
    'pendulo-simple': 'Physics/Physics Visual Lab/pendulo-simple.html',
    'oscilador-forzado': 'Physics/Physics Visual Lab/oscilador-forzado.html',
    'colisiones': 'Physics/Physics Visual Lab/colisiones.html',
    'campo-electrico': 'Physics/Physics Visual Lab/campo-electrico.html',
    'optica': 'Physics/Physics Visual Lab/optica.html',
    'relatividad': 'Physics/Physics Visual Lab/relatividad.html',
    'efecto-tunel': 'Physics/Physics Visual Lab/efecto-tunel.html',
    'mecanica-lagrangiana': 'Physics/Physics Visual Lab/mecanica-lagrangiana.html',
    'circuitos': 'Physics/Physics Visual Lab/circuitos.html',
    'proyectil': 'Physics/Physics Visual Lab/proyectil.html',
    'pendulos-desacoplados': 'Physics/Physics Visual Lab/pendulos-desacoplados.html',
    'difusion-calor': 'Physics/Physics Visual Lab/difusion-calor.html',
    'fluidos-2d': 'Physics/Physics Visual Lab/fluidos-2d.html',
    'simulacion-tela': 'Physics/Physics Visual Lab/simulacion-tela.html',
    'fourier': 'Physics/Physics Visual Lab/fourier.html',

    // ═══════════════════════════════════════════════════════════════
    // TERRA - Geología
    // ═══════════════════════════════════════════════════════════════
    'tectonica-placas': 'Geology/Geology Visual Lab/tectonica-placas.html',
    'terremotos': 'Geology/Geology Visual Lab/terremotos.html',
    'volcanes': 'Geology/Geology Visual Lab/volcanes.html',
    'erosion': 'Geology/Geology Visual Lab/erosion.html',
    'erosion-hidraulica': 'Geology/Geology Visual Lab/erosion-hidraulica.html',
    'ciclo-rocas': 'Geology/Geology Visual Lab/ciclo-rocas.html',
    'estratigrafia': 'Geology/Geology Visual Lab/estratigrafia.html',

    // ═══════════════════════════════════════════════════════════════
    // MACHINA - Computación
    // ═══════════════════════════════════════════════════════════════
    'automatas-elementales': 'Mathematics/Math Visual Lab/automatas-elementales.html',
    'finite-automata': 'Computation/Computation Lab/finite-automata.html',
    'binary-search-tree': 'Computation/Computation Lab/binary-search-tree.html',
    'bubble-sort-race': 'Computation/Computation Lab/bubble-sort-race.html',
    'logic-gates-sandbox': 'Computation/Computation Lab/logic-gates-sandbox.html',
    'stack-heap-visualizer': 'Computation/Computation Lab/stack-heap-visualizer.html',
    'perceptron-playground': 'Computation/Computation Lab/perceptron-playground.html',

    // ═══════════════════════════════════════════════════════════════
    // ALCHEMY - Química
    // ═══════════════════════════════════════════════════════════════
    'gas-ideal': 'Physics/Physics Visual Lab/gas-ideal.html',
    'gases-reales': 'Chemistry/Chemistry Visual Lab/gases-reales.html',
    'termodinamica': 'Physics/Physics Visual Lab/termodinamica.html',
    'entropia': 'Physics/Physics Visual Lab/entropia.html',
    'le-chatelier': 'Chemistry/Chemistry Visual Lab/le-chatelier.html',
    'cinetica-colisiones': 'Chemistry/Chemistry Visual Lab/cinetica-colisiones.html',
    'titulacion': 'Chemistry/Chemistry Visual Lab/titulacion.html',
    'nernst': 'Chemistry/Chemistry Visual Lab/nernst.html',
    'celda-galvanica': 'Chemistry/Chemistry Visual Lab/celda-galvanica.html',
    'diagrama-fases': 'Chemistry/Chemistry Visual Lab/diagrama-fases.html',
    'solubilidad': 'Chemistry/Chemistry Visual Lab/solubilidad.html',
    'tabla-periodica': 'Chemistry/Chemistry Visual Lab/tabla-periodica.html',
    'orbitales': 'Chemistry/Chemistry Visual Lab/orbitales.html',
    'modelo-bohr': 'Chemistry/Chemistry Visual Lab/modelo-bohr.html',
    'enlaces': 'Chemistry/Chemistry Visual Lab/enlaces.html',
    'vsepr': 'Chemistry/Chemistry Visual Lab/vsepr.html',
    'isomeria': 'Chemistry/Chemistry Visual Lab/isomeria.html',
    'calorimetria': 'Chemistry/Chemistry Visual Lab/calorimetria.html',
    'reactivo-limitante': 'Chemistry/Chemistry Visual Lab/reactivo-limitante.html',
    'tendencias': 'Chemistry/Chemistry Visual Lab/tendencias.html',
    'decaimiento': 'Chemistry/Chemistry Visual Lab/decaimiento.html',

    // ═══════════════════════════════════════════════════════════════
    // BIOS - Biología y Bioquímica
    // ═══════════════════════════════════════════════════════════════
    'adn-replicacion': 'Biochemistry/Biochem Visual Lab/adn-replicacion.html',
    'sintesis-proteinas': 'Biochemistry/Biochem Visual Lab/sintesis-proteinas.html',
    'mitosis': 'Biology/Biology Visual Lab/mitosis.html',
    'meiosis': 'Biology/Biology Visual Lab/meiosis.html',
    'mutaciones': 'Biochemistry/Biochem Visual Lab/mutaciones.html',
    'evolucion': 'Biology/Biology Visual Lab/evolucion.html',
    'genetica-poblacional': 'Biology/Biology Visual Lab/genetica-poblacional.html',
    'ecosistema': 'Biology/Biology Visual Lab/ecosistema.html',
    'krebs': 'Biochemistry/Biochem Visual Lab/krebs.html',
    'glucolisis': 'Biochemistry/Biochem Visual Lab/glucolisis.html',
    'membrana-fluida': 'Biochemistry/Biochem Visual Lab/membrana-fluida.html',
    'transcripcion': 'Biochemistry/Biochem Visual Lab/transcripcion.html',
    'traduccion': 'Biochemistry/Biochem Visual Lab/traduccion.html',
    'plegamiento': 'Biochemistry/Biochem Visual Lab/plegamiento.html',
    'estructura-proteica': 'Biochemistry/Biochem Visual Lab/estructura-proteica.html',
    'michaelis-menten': 'Biochemistry/Biochem Visual Lab/michaelis-menten.html',
    'cadena-respiratoria': 'Biochemistry/Biochem Visual Lab/cadena-respiratoria.html',
    'fermentacion': 'Biochemistry/Biochem Visual Lab/fermentacion.html',
    'regulacion-genica': 'Biochemistry/Biochem Visual Lab/regulacion-genica.html',
    'lipidos': 'Biochemistry/Biochem Visual Lab/lipidos.html',
    'desnaturalizacion': 'Biochemistry/Biochem Visual Lab/desnaturalizacion.html',

    // ═══════════════════════════════════════════════════════════════
    // PSYCHE - Neurociencia
    // ═══════════════════════════════════════════════════════════════
    'neurona': 'Biology/Biology Visual Lab/neurona.html',
    'vision': 'Biology/Biology Visual Lab/vision.html',
    'ritmos-circadianos': 'Biology/Biology Visual Lab/ritmos-circadianos.html',

    // ═══════════════════════════════════════════════════════════════
    // AETHER - Música y Armonía
    // ═══════════════════════════════════════════════════════════════
    'contrapunctus': 'Physics/Physics Sound Lab/generativos/contrapunctus/index.html',
    'sympathetic-12': 'Physics/Physics Sound Lab/generativos/sympathetic-12/web/index.html',
    'musica-esferas-moderna': 'Astronomy/Astronomy Sound Lab/musica-esferas-moderna.html',
    'tonnetz-chromatic': 'Physics/Physics Sound Lab/generativos/tonnetz-atractor/tonnetz-chromatic.html',
    'tonnetz-dual': 'Physics/Physics Sound Lab/generativos/tonnetz-atractor/tonnetz-dual.html',
    'cadencia-orbital': 'Physics/Physics Sound Lab/generativos/cadencia-orbital/cadencia-orbital.html',
    'harmonices-mundi': 'Physics/Physics Sound Lab/generativos/harmonices-mundi/tutorial.html',
    'rameau-machine': 'Physics/Physics Sound Lab/generativos/rameau-machine/index.html',
    'orbifold-walker': 'Physics/Physics Sound Lab/generativos/orbifold-walker/index.html'
};

export default class SimulationScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SimulationScene' });
        this.iframe = null;
        this.overlay = null;
        this.mission = null;
        this.timeRemaining = 0;
        this.canComplete = false;
        this.timerText = null;
        this.completeBtn = null;
        this.isExploration = false;
        this.fragment = null;
        this.hasShownFragment = false;
    }

    init(data) {
        this.simulation = data.simulation;
        this.realm = data.realm;
        this.onComplete = data.onComplete || (() => {});
        this.mission = getMission(this.simulation);
        this.timeRemaining = this.mission.minTime;
        this.canComplete = false;

        // M2: Detectar si es exploración (no puzzle central)
        this.isExploration = !isCentralPuzzle(this.simulation);
        this.fragment = getFragment(this.simulation);
        this.hasShownFragment = gameState.hasSeenFragment(this.simulation);
    }

    create() {
        const { width, height } = this.cameras.main;
        const color = REALM_COLORS[this.realm] || REALM_COLORS.aether;

        // Overlay oscuro
        this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.92);

        // M2: Mostrar fragmento del Constructo si es exploración nueva
        if (this.isExploration && this.fragment && !this.hasShownFragment) {
            this.showConstructoFragment(color, () => {
                gameState.markFragmentSeen(this.simulation);
                this.startSimulationUI(color);
            });
        } else {
            this.startSimulationUI(color);
        }

        // ESC para salir
        this.input.keyboard.on('keydown-ESC', () => this.closeSimulation(false));
    }

    startSimulationUI(color) {
        // Header con misión
        this.createHeader(color);

        // Panel de misión
        this.createMissionPanel(color);

        // Crear iframe
        this.createSimulationFrame();

        // Footer con controles
        this.createFooter(color);

        // Timer
        this.startTimer();
    }

    showConstructoFragment(color, onComplete) {
        const { width, height } = this.cameras.main;
        const colorHex = `#${color.primary.toString(16).padStart(6, '0')}`;

        // Container del fragmento
        const fragmentContainer = this.add.container(width / 2, height / 2);
        fragmentContainer.setDepth(100);

        // Fondo con gradiente
        const bg = this.add.graphics();
        bg.fillStyle(0x0f172a, 0.98);
        bg.fillRoundedRect(-300, -120, 600, 240, 16);
        bg.lineStyle(2, color.primary, 0.6);
        bg.strokeRoundedRect(-300, -120, 600, 240, 16);
        fragmentContainer.add(bg);

        // Glow pulsante
        const glow = this.add.graphics();
        glow.fillStyle(color.primary, 0.1);
        glow.fillRoundedRect(-310, -130, 620, 260, 20);
        fragmentContainer.add(glow);

        // Icono del Constructo
        const icon = this.add.text(0, -80, '🔮', {
            fontSize: '36px'
        }).setOrigin(0.5);
        fragmentContainer.add(icon);

        // Título
        const title = this.add.text(0, -40, 'FRAGMENTO DEL CONSTRUCTO', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '12px',
            fontWeight: '700',
            color: colorHex
        }).setOrigin(0.5);
        fragmentContainer.add(title);

        // Línea del fragmento (seleccionar una aleatoria)
        const randomLine = Phaser.Utils.Array.GetRandom(this.fragment.lines);
        const text = this.add.text(0, 10, `"${randomLine}"`, {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '16px',
            fontStyle: 'italic',
            color: '#f8fafc',
            align: 'center',
            wordWrap: { width: 500 }
        }).setOrigin(0.5);
        fragmentContainer.add(text);

        // Mood indicator
        const moodText = this.add.text(0, 60, `— Estado: ${this.fragment.mood}`, {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '10px',
            color: '#64748b'
        }).setOrigin(0.5);
        fragmentContainer.add(moodText);

        // Indicador de continuar
        const continueText = this.add.text(0, 95, '▼ Presiona ESPACIO para explorar', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '11px',
            color: '#94a3b8'
        }).setOrigin(0.5);
        fragmentContainer.add(continueText);

        // Animación de entrada
        fragmentContainer.setAlpha(0);
        fragmentContainer.setScale(0.9);
        this.tweens.add({
            targets: fragmentContainer,
            alpha: 1,
            scale: 1,
            duration: 400,
            ease: 'Back.out'
        });

        // Pulso del glow
        this.tweens.add({
            targets: glow,
            alpha: { from: 1, to: 0.5 },
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

        // Pulso del indicador
        this.tweens.add({
            targets: continueText,
            alpha: { from: 1, to: 0.5 },
            duration: 600,
            yoyo: true,
            repeat: -1
        });

        // Rotación suave del icono
        this.tweens.add({
            targets: icon,
            angle: { from: -5, to: 5 },
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.inOut'
        });

        // Input para continuar
        const handleContinue = () => {
            this.input.keyboard.off('keydown-SPACE', handleContinue);
            this.input.keyboard.off('keydown-ENTER', handleContinue);
            this.input.off('pointerdown', handleContinue);

            // Animación de salida
            this.tweens.add({
                targets: fragmentContainer,
                alpha: 0,
                scale: 0.9,
                duration: 250,
                onComplete: () => {
                    fragmentContainer.destroy();
                    onComplete();
                }
            });
        };

        this.input.keyboard.on('keydown-SPACE', handleContinue);
        this.input.keyboard.on('keydown-ENTER', handleContinue);
        this.input.on('pointerdown', handleContinue);
    }

    createHeader(color) {
        const { width } = this.cameras.main;

        this.add.graphics()
            .fillStyle(0x0f172a, 0.98)
            .fillRect(0, 0, width, 45);

        this.add.graphics()
            .lineStyle(1, color.primary, 0.4)
            .lineBetween(0, 45, width, 45);

        this.add.text(20, 14, `${this.realm.toUpperCase()} › ${this.simulation}`, {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '13px',
            color: '#94a3b8'
        });

        const closeBtn = this.add.text(width - 20, 14, '✕ Salir [ESC]', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '13px',
            color: '#ef4444'
        }).setOrigin(1, 0).setInteractive({ useHandCursor: true });

        closeBtn.on('pointerover', () => closeBtn.setColor('#f87171'));
        closeBtn.on('pointerout', () => closeBtn.setColor('#ef4444'));
        closeBtn.on('pointerdown', () => this.closeSimulation(false));
    }

    createMissionPanel(color) {
        const { width } = this.cameras.main;
        const panelY = 55;
        const panelHeight = 70;

        // Fondo del panel de misión
        this.add.graphics()
            .fillStyle(color.primary, 0.1)
            .fillRect(0, panelY, width, panelHeight);

        this.add.graphics()
            .lineStyle(1, color.primary, 0.3)
            .lineBetween(0, panelY + panelHeight, width, panelY + panelHeight);

        // Icono de misión
        this.add.text(25, panelY + 15, '🎯', {
            fontSize: '20px'
        });

        // Título de misión
        this.add.text(55, panelY + 12, 'MISIÓN', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '10px',
            fontWeight: '600',
            color: `#${color.primary.toString(16).padStart(6, '0')}`
        });

        // Objetivo
        this.add.text(55, panelY + 28, this.mission.objective, {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '14px',
            fontWeight: '500',
            color: '#f8fafc',
            wordWrap: { width: width - 200 }
        });

        // Pista
        this.add.text(55, panelY + 50, `💡 ${this.mission.hint}`, {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '11px',
            color: '#94a3b8',
            wordWrap: { width: width - 200 }
        });

        // Timer
        this.timerText = this.add.text(width - 25, panelY + 35, '', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '24px',
            fontWeight: '700',
            color: '#fbbf24'
        }).setOrigin(1, 0.5);
    }

    createSimulationFrame() {
        const { width, height } = this.cameras.main;
        const simPath = SIMULATION_PATHS[this.simulation];

        if (!simPath) {
            this.showNotFound();
            return;
        }

        const gameCanvas = document.querySelector('canvas');
        const rect = gameCanvas.getBoundingClientRect();
        const scaleX = rect.width / GAME_WIDTH;
        const scaleY = rect.height / GAME_HEIGHT;

        const headerHeight = 125; // Header + Mission panel
        const footerHeight = 55;
        const padding = 15;

        this.overlay = document.createElement('div');
        this.overlay.id = 'simulation-overlay';
        this.overlay.style.cssText = `
            position: absolute;
            left: ${rect.left + padding * scaleX}px;
            top: ${rect.top + headerHeight * scaleY}px;
            width: ${(width - padding * 2) * scaleX}px;
            height: ${(height - headerHeight - footerHeight) * scaleY}px;
            background: #0f172a;
            border-radius: 8px;
            overflow: hidden;
            z-index: 1000;
            border: 1px solid rgba(168, 85, 247, 0.2);
        `;

        this.iframe = document.createElement('iframe');
        this.iframe.src = `/eigenlab/${simPath}`;
        this.iframe.style.cssText = `
            width: 100%;
            height: 100%;
            border: none;
            background: #0f172a;
        `;

        this.overlay.appendChild(this.iframe);
        document.body.appendChild(this.overlay);

        this.loadingText = this.add.text(width / 2, height / 2, 'Cargando simulación...', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '14px',
            color: '#64748b'
        }).setOrigin(0.5);

        this.iframe.onload = () => {
            if (this.loadingText) this.loadingText.destroy();
        };
    }

    showNotFound() {
        const { width, height } = this.cameras.main;

        this.add.text(width / 2, height / 2, `Simulación "${this.simulation}" no disponible`, {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '16px',
            color: '#94a3b8'
        }).setOrigin(0.5);
    }

    createFooter(color) {
        const { width, height } = this.cameras.main;

        this.add.graphics()
            .fillStyle(0x0f172a, 0.98)
            .fillRect(0, height - 55, width, 55);

        this.add.graphics()
            .lineStyle(1, color.primary, 0.4)
            .lineBetween(0, height - 55, width, height - 55);

        // Instrucciones
        this.add.text(25, height - 35, 'Completa la misión y luego verifica tu conocimiento', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '12px',
            color: '#64748b'
        });

        // Botón completar (inicialmente deshabilitado)
        const colorHex = `#${color.primary.toString(16).padStart(6, '0')}`;
        this.completeBtn = this.add.text(width - 25, height - 30, '⏳ Explorando...', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '14px',
            fontWeight: '600',
            color: '#4b5563'
        }).setOrigin(1, 0.5);
    }

    startTimer() {
        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
        this.updateTimer();
    }

    updateTimer() {
        if (this.timeRemaining > 0) {
            this.timeRemaining--;
            this.timerText.setText(`${this.timeRemaining}s`);

            if (this.timeRemaining <= 10) {
                this.timerText.setColor('#22c55e');
            }
        } else if (!this.canComplete) {
            this.canComplete = true;
            this.timerText.setText('✓');
            this.timerText.setColor('#22c55e');
            this.enableCompletion();
        }
    }

    enableCompletion() {
        const color = REALM_COLORS[this.realm] || REALM_COLORS.aether;
        const colorHex = `#${color.primary.toString(16).padStart(6, '0')}`;

        this.completeBtn.setText('✓ Completar Misión [+1λ]');
        this.completeBtn.setColor(colorHex);
        this.completeBtn.setInteractive({ useHandCursor: true });

        this.completeBtn.on('pointerover', () => this.completeBtn.setColor('#ffffff'));
        this.completeBtn.on('pointerout', () => this.completeBtn.setColor(colorHex));
        this.completeBtn.on('pointerdown', () => this.attemptCompletion());

        // Pulso para llamar la atención
        this.tweens.add({
            targets: this.completeBtn,
            scale: { from: 1, to: 1.05 },
            duration: 500,
            yoyo: true,
            repeat: 2
        });
    }

    attemptCompletion() {
        if (this.mission.verification) {
            this.showVerification();
        } else {
            this.closeSimulation(true);
        }
    }

    showVerification() {
        const { width, height } = this.cameras.main;
        const color = REALM_COLORS[this.realm] || REALM_COLORS.aether;

        // Ocultar iframe temporalmente
        if (this.overlay) {
            this.overlay.style.opacity = '0.3';
        }

        // Panel de verificación
        const panelWidth = 500;
        const panelHeight = 280;
        const panelX = (width - panelWidth) / 2;
        const panelY = (height - panelHeight) / 2;

        const verifyBg = this.add.graphics();
        verifyBg.fillStyle(0x000000, 0.9);
        verifyBg.fillRect(0, 0, width, height);
        verifyBg.setDepth(200);

        const panel = this.add.graphics();
        panel.fillStyle(0x0f172a, 1);
        panel.fillRoundedRect(panelX, panelY, panelWidth, panelHeight, 12);
        panel.lineStyle(2, color.primary, 0.6);
        panel.strokeRoundedRect(panelX, panelY, panelWidth, panelHeight, 12);
        panel.setDepth(201);

        // Título
        const title = this.add.text(width / 2, panelY + 30, '🧪 VERIFICACIÓN', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '16px',
            fontWeight: '700',
            color: `#${color.primary.toString(16).padStart(6, '0')}`
        }).setOrigin(0.5).setDepth(202);

        // Pregunta
        const question = this.add.text(width / 2, panelY + 70, this.mission.verification.question, {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '15px',
            color: '#f8fafc',
            wordWrap: { width: panelWidth - 60 },
            align: 'center'
        }).setOrigin(0.5).setDepth(202);

        // Opciones
        const options = this.mission.verification.options;
        const optionStartY = panelY + 120;
        const optionSpacing = 35;

        const optionButtons = options.map((opt, i) => {
            const y = optionStartY + i * optionSpacing;

            const btn = this.add.text(width / 2, y, `${String.fromCharCode(65 + i)}) ${opt}`, {
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '14px',
                color: '#94a3b8'
            }).setOrigin(0.5).setDepth(202).setInteractive({ useHandCursor: true });

            btn.on('pointerover', () => btn.setColor('#ffffff'));
            btn.on('pointerout', () => btn.setColor('#94a3b8'));
            btn.on('pointerdown', () => {
                this.checkAnswer(i, btn, optionButtons, verifyBg, panel, title, question);
            });

            return btn;
        });
    }

    checkAnswer(selectedIndex, selectedBtn, allButtons, ...uiElements) {
        const correct = this.mission.verification.correct;

        if (selectedIndex === correct) {
            // Correcto
            selectedBtn.setColor('#22c55e');
            selectedBtn.setText('✓ ' + selectedBtn.text);

            this.time.delayedCall(800, () => {
                uiElements.forEach(el => el.destroy());
                allButtons.forEach(btn => btn.destroy());
                if (this.overlay) this.overlay.style.opacity = '1';
                this.closeSimulation(true);
            });
        } else {
            // Incorrecto
            selectedBtn.setColor('#ef4444');
            selectedBtn.setText('✗ ' + selectedBtn.text);
            selectedBtn.disableInteractive();

            // Mostrar la correcta después de un momento
            this.time.delayedCall(1000, () => {
                allButtons[correct].setColor('#22c55e');
            });

            // Permitir reintentar o salir
            this.time.delayedCall(2000, () => {
                uiElements.forEach(el => el.destroy());
                allButtons.forEach(btn => btn.destroy());
                if (this.overlay) this.overlay.style.opacity = '1';
                // No dar eigenvalor si falla
                this.closeSimulation(false);
            });
        }
    }

    closeSimulation(completed) {
        if (this.timerEvent) {
            this.timerEvent.destroy();
        }

        if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;
            this.iframe = null;
        }

        // M2: Si es exploración completada, registrar
        if (completed && this.isExploration) {
            const result = gameState.exploreSimulation(this.simulation);
            // onComplete recibe info adicional para exploraciones
            this.onComplete(completed, {
                isExploration: true,
                resonanceGained: result.resonanceGained,
                connectionUnlocked: result.connectionUnlocked
            });
        } else {
            this.onComplete(completed);
        }

        this.scene.stop();
    }

    shutdown() {
        if (this.timerEvent) {
            this.timerEvent.destroy();
        }
        if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;
            this.iframe = null;
        }
    }
}
