# EigenLab Odyssey

> *"En el principio fue la frecuencia. De la frecuencia nació el patrón. Del patrón emergió el número. Y del número... todo lo demás."*

Una aventura épica a través de los reinos del conocimiento. Más de 150 simulaciones científicas convertidas en mundos explorables, conectadas por una narrativa sobre la armonía del universo.

![Status](https://img.shields.io/badge/status-alpha%200.3-yellow)
![Phaser](https://img.shields.io/badge/phaser-3.70-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## Sinopsis

Eres **El Resonador** — el último de una línea de seres capaces de percibir las conexiones ocultas entre fenómenos. Armado con la **Lira de Cuerdas Simpáticas**, debes restaurar la Gran Sinfonía del Conocimiento antes de que **La Disonancia** consuma toda la realidad.

Explora nueve reinos, cada uno representando una disciplina científica. Completa misiones dentro de simulaciones interactivas. Descubre los Eigenvalores que restaurarán la armonía cósmica.

---

## Los Nueve Reinos

| Reino | Disciplina | Simulaciones | Estado |
|-------|------------|--------------|--------|
| **Aether** | Música (Hub) | 9 | Jugable |
| **Cosmos** | Astronomía | 13 | Jugable |
| **Chaos** | Sistemas emergentes | 10 | Jugable |
| **Logos** | Matemáticas | 20 | Jugable |
| **Atomos** | Física | 15 | Jugable |
| **Terra** | Geología | 7 | Jugable |
| **Machina** | Computación | 7 | Jugable |
| **Alchemy** | Química | 16 | Jugable |
| **Bios** | Biología | 14 | Jugable |
| **Psyche** | IA/Mente | 3 | Jugable |

---

## Características

### Implementado
- Secuencia cinematográfica de introducción
- Puzzle tutorial (encontrar g = 9.81)
- Hub central con portales a todos los reinos
- Navegación a 150+ simulaciones de EigenLab
- Sistema de misiones con objetivos
- Grafo de conocimiento interactivo
- Audio procedural (Web Audio API)
- 23 sprites extraídos del concept art

### En desarrollo
- Integración de sprites en gameplay
- Sistema de resonancia (salud)
- Puzzles únicos por reino
- Compañero (Constructo de Éter)
- Historia completa con finales

---

## Screenshots

*Próximamente*

---

## Instalación

```bash
# Clonar
git clone https://github.com/tu-usuario/eigenlab-odyssey.git
cd eigenlab-odyssey

# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build
npm run build
```

**Requisito:** Las simulaciones se cargan desde EigenLab local. Asegúrate de tener el proyecto EigenLab en la ruta correcta o actualiza `SIMULATION_PATHS` en `src/scenes/SimulationScene.js`.

---

## Controles

| Tecla | Acción |
|-------|--------|
| WASD / Flechas | Mover |
| E / Enter | Interactuar |
| Espacio | Confirmar diálogo |
| G | Abrir grafo de conocimiento |
| ESC | Pausa / Menú |

---

## Documentación

| Documento | Descripción |
|-----------|-------------|
| [Game Design Document](docs/GDD.md) | Diseño completo del juego |
| [Story](docs/STORY.md) | Guión narrativo completo |
| [Characters](docs/CHARACTERS.md) | Personajes y lore |
| [Roadmap](docs/ROADMAP.md) | Plan de desarrollo |
| [Navigation Map](docs/NAVIGATION_MAP.md) | Mapa de navegación |

---

## Estructura del Proyecto

```
eigenlab-odyssey/
├── src/
│   ├── main.js              # Entry point
│   ├── config.js            # Configuración Phaser
│   ├── core/                # Constantes y utilidades
│   ├── scenes/              # 12 escenas del juego
│   ├── systems/             # GameState, navegación
│   ├── entities/            # Resonador, NPCs
│   ├── ui/                  # Componentes UI
│   ├── audio/               # SynthAudio procedural
│   └── data/                # Misiones, grafo conocimiento
├── assets/
│   ├── concepts/            # 7 concept arts
│   ├── sprites/             # 23 sprites organizados
│   ├── ui/                  # Elementos de interfaz
│   ├── effects/             # Partículas y VFX
│   └── backgrounds/         # Fondos
├── docs/                    # Documentación
└── public/                  # Assets públicos
```

---

## Stack Técnico

- **Motor:** [Phaser.js 3](https://phaser.io/)
- **Bundler:** [Vite](https://vitejs.dev/)
- **Audio:** Web Audio API (procedural)
- **Arte:** Cell-shaded + acuarela (estilo Ghibli/Zelda)
- **Simulaciones:** [EigenLab](https://github.com/tu-usuario/eigenlab)

---

## Créditos

- **Diseño y desarrollo:** Carlos
- **Concept art:** Generado con IA (Gemini), refinado manualmente
- **Simulaciones:** Proyecto EigenLab
- **Inspiración:** Zelda: Tears of the Kingdom, Studio Ghibli, Braid

---

## Licencia

MIT License - Ver [LICENSE](LICENSE) para detalles.

---

## Contacto

*Proyecto en desarrollo activo. Issues y PRs bienvenidos.*
