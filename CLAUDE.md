# EigenLab Odyssey - Contexto del Proyecto

> **Para ejecución autónoma:** Lee también `CLAUDE_INSTRUCTIONS.md`

## Descripción

**EigenLab Odyssey** es un juego de aventura/exploración que conecta más de 150 simulaciones científicas interactivas de EigenLab en una narrativa unificada. El jugador es "El Resonador", un ser que restaura la armonía del conocimiento usando instrumentos musicales mágicos.

## Stack Técnico

- **Motor:** Phaser.js 3.70+
- **Audio:** Web Audio API (SynthAudio.js - sonidos procedurales)
- **Bundler:** Vite
- **Simulaciones:** Embebidas desde EigenLab (HTML/JS externos)
- **Assets:** PNG con transparencia, estilo cell-shaded/Ghibli

## Estructura del Proyecto

```
eigenlab-odyssey/
├── src/
│   ├── main.js              # Entry point
│   ├── config.js            # Configuración Phaser
│   ├── core/
│   │   └── constants.js     # Colores, dimensiones, config reinos
│   ├── scenes/
│   │   ├── TitleScene.js    # Pantalla título
│   │   ├── CinematicIntroScene.js  # Intro terminal + glitch
│   │   ├── CathedralScene.js       # Puzzle del péndulo
│   │   ├── MapRevealScene.js       # Revelación 9 reinos
│   │   ├── AetherHub.js            # Hub central
│   │   ├── RealmScene.js           # Escena de cada reino
│   │   ├── SimulationScene.js      # Wrapper simulaciones
│   │   ├── GraphScene.js           # Grafo de conocimiento
│   │   ├── DialogScene.js          # Sistema de diálogos
│   │   └── PauseScene.js           # Menú pausa
│   ├── systems/
│   │   ├── GameState.js     # Estado persistente (localStorage)
│   │   └── NavigationSystem.js
│   ├── entities/
│   │   └── Resonator.js     # Entidad del jugador
│   ├── ui/
│   │   ├── ProgressUI.js
│   │   └── NotificationManager.js
│   ├── audio/
│   │   └── SynthAudio.js    # Audio procedural Web Audio API
│   └── data/
│       ├── missions.js      # ~30 misiones definidas
│       └── knowledgeGraph.js # Grafo de conocimiento
├── assets/
│   ├── concepts/            # 7 concept arts originales
│   ├── sprites/             # Sprites recortados con transparencia
│   │   ├── resonator/       # idle, portrait, walk-*
│   │   ├── lyra/            # lyra-active, lyra-inactive
│   │   ├── companion/       # construct-normal, construct-glitch
│   │   ├── portals/         # portal-active, portal-inactive
│   │   └── environment/     # column-formulas, platform-stone
│   ├── ui/                  # Barras, iconos, botones
│   ├── effects/             # VFX particles
│   └── backgrounds/         # title-screen
├── docs/
│   ├── GDD.md               # Diseño + navegación + progresión
│   ├── STORY.md             # Guión con escenas por reino
│   ├── CHARACTERS.md        # Personajes + lore + reglas universo
│   └── ROADMAP.md           # Plan + changelog narrativo
└── public/
```

## Los Nueve Reinos

| Reino | Disciplina | Color Primario | Simulaciones |
|-------|------------|----------------|--------------|
| Aether | Música (Hub) | `0xa855f7` violeta | 9 |
| Cosmos | Astronomía | `0x1e3a8a` azul | 13 |
| Chaos | Emergencia | `0xdc2626` rojo | 10 |
| Logos | Matemáticas | `0xfbbf24` dorado | 20 |
| Atomos | Física | `0x06b6d4` cian | 15 |
| Terra | Geología | `0x84cc16` verde lima | 7 |
| Machina | Computación | `0x22c55e` verde | 7 |
| Alchemy | Química | `0x9333ea` púrpura | 16 |
| Bios | Biología | `0x10b981` verde vida | 14 |
| Psyche | IA/Mente | `0xec4899` rosa | 3 |

## Flujo del Juego

```
TitleScene → CinematicIntroScene → CathedralScene → MapRevealScene → AetherHub
                                                                        ↓
                                                              RealmScene (x9)
                                                                        ↓
                                                            SimulationScene
```

## Personajes Principales

1. **El Resonador** - Protagonista jugable, túnica índigo con circuitos dorados
2. **Constructo de Éter** - Compañero esférico, indica corrupción con glitch
3. **La Disonancia** - Antagonista abstracto, entropía/corrupción

## Items Clave

- **Lira de Cuerdas Simpáticas** - Arma principal, 12 cuerdas de luz
- **Diapasón de Vacío** - Herramienta secundaria, energía azul
- **Eigenvalores (λ)** - Coleccionables, desbloquean reinos

## Mecánicas Core

1. **Exploración** - Navegar entre reinos y simulaciones
2. **Puzzles de Sintonización** - Encontrar frecuencias correctas
3. **Misiones** - Completar objetivos en simulaciones
4. **Grafo de Conocimiento** - Visualizar conexiones entre conceptos

## Comandos de Desarrollo

```bash
npm run dev      # Servidor desarrollo (Vite)
npm run build    # Build producción
npm run preview  # Preview build
```

## Rutas de Simulaciones

Las simulaciones se cargan desde EigenLab local:
- Base: `/Users/carlos/Projects/EigenLab/`
- Labs: `{Discipline} Visual Lab/`, `Physics Sound Lab/`, etc.
- Archivos: `{simulation-id}.html`

Ver `src/scenes/SimulationScene.js` → `SIMULATION_PATHS` para mapeo completo.

## Estado Actual: Alpha 0.5

Ver `docs/ROADMAP.md` para el plan de producción detallado.

### Completado
- [x] Escenas cinematográficas (intro, catedral, mapa)
- [x] Hub central funcional
- [x] Navegación a reinos
- [x] Sistema de misiones
- [x] Grafo de conocimiento interactivo
- [x] Audio procedural base
- [x] 23 sprites extraídos
- [x] Documentación completa (GDD, STORY, CHARACTERS, PITCH)
- [x] Plan de producción con 7 milestones
- [x] **Milestone 1 (Vertical Slice):**
  - [x] Sprites del Resonador con animaciones direccionales
  - [x] Constructo como compañero con follow behavior
  - [x] Portales visuales con glow y colores de reino
  - [x] Harmonices Mundi como puzzle central de COSMOS
  - [x] LyreHUD mostrando cuerdas por eigenvalor
  - [x] Diálogos de guardianes para todos los reinos

### Próximo: Milestone 2 (Sistema de Exploración)
- [ ] Fragmentos del Constructo por simulación
- [ ] Resonancia (+5% por exploración)
- [ ] Conexiones del grafo desbloqueables

## Convenciones

- **Colores:** Usar constantes de `constants.js`
- **Escenas:** Heredar de `Phaser.Scene`, key en PascalCase
- **Estado:** Usar `GameState` singleton para persistencia
- **Audio:** Usar `synthAudio` singleton para sonidos
