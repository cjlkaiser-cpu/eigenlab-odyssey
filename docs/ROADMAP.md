# EigenLab Odyssey: Plan de Producción

> Última actualización: 25 dic 2024
> Estado: **Alpha 0.7** — Milestone 3 completado (Tres Reinos Jugables)

---

## ESTADO ACTUAL

### Lo que tenemos

| Categoría | Completado | Detalles |
|-----------|------------|----------|
| **Documentación** | 100% | GDD, STORY, CHARACTERS, PITCH.html |
| **Escenas base** | 100% | 12 escenas Phaser funcionales |
| **Navegación** | 90% | Hub → Reinos → Simulaciones |
| **Sprites** | 46% | 23/50 sprites extraídos |
| **Puzzles centrales** | 0% | Diseñados, no implementados |
| **Diálogos** | 0% | Escritos, no implementados |
| **Audio** | 30% | SynthAudio base, sin temas |
| **Líneas de código** | 8,534 | Target: 15,000 |

### Archivos clave existentes

```
src/
├── scenes/
│   ├── TitleScene.js        (12,836 líneas) ✓
│   ├── CinematicIntroScene.js (16,838) ✓
│   ├── CathedralScene.js    (24,414) ✓
│   ├── MapRevealScene.js    (16,461) ✓
│   ├── AetherHub.js         (16,432) ✓
│   ├── RealmScene.js        (17,849) ✓
│   ├── SimulationScene.js   (27,989) ✓
│   ├── GraphScene.js        (33,504) ✓
│   ├── DialogScene.js       (5,216) — necesita expansión
│   └── PauseScene.js        (6,169) ✓
├── systems/
│   ├── GameState.js         (371) ✓
│   └── NavigationSystem.js  (292) ✓
├── audio/
│   └── SynthAudio.js        ✓
└── data/
    ├── missions.js          (~30 misiones)
    └── knowledgeGraph.js    ✓
```

---

## MILESTONE 1: VERTICAL SLICE (Prioridad Alta)

**Objetivo:** Un reino completamente jugable de principio a fin.

**Reino elegido:** COSMOS (más visual, narrativamente importante)

### M1.1 — Sprites del Resonador
| Tarea | Archivo | Criterio de éxito |
|-------|---------|-------------------|
| Cargar spritesheet | `PreloadScene.js` | Sin errores en consola |
| Sprite en AetherHub | `AetherHub.js` | Resonador visible, no círculo |
| Animación idle | `AetherHub.js` | Sprite respira/parpadea |
| Animación walk | `AetherHub.js` | 4 direcciones fluidas |

**Verificación:** `npm run dev` → mover con WASD → sprite animado visible

### M1.2 — Constructo Compañero
| Tarea | Archivo | Criterio de éxito |
|-------|---------|-------------------|
| Crear entidad | `src/entities/Constructo.js` | Clase con follow behavior |
| Añadir a Hub | `AetherHub.js` | Sigue al Resonador suavemente |
| Sprite normal/glitch | Assets | Alternar según contexto |
| Bobbing animation | `Constructo.js` | Flotación vertical sutil |

**Verificación:** Constructo visible, sigue al jugador, flota

### M1.3 — Portal a Cosmos funcional
| Tarea | Archivo | Criterio de éxito |
|-------|---------|-------------------|
| Sprite portal activo | `AetherHub.js` | Portal animado con glow |
| Colisión con portal | `AetherHub.js` | Detecta proximidad |
| Transición a RealmScene | `NavigationSystem.js` | Fade suave a COSMOS |
| Cargar datos de Cosmos | `RealmScene.js` | Simulaciones correctas |

**Verificación:** Caminar al portal → transición → ver reino COSMOS

### M1.4 — Puzzle central: Harmonices Mundi
| Tarea | Archivo | Criterio de éxito |
|-------|---------|-------------------|
| Detectar simulación clave | `RealmScene.js` | Mostrar distintivo |
| Abrir Harmonices Mundi | `SimulationScene.js` | Simulación carga correcta |
| Definir objetivo | `src/data/puzzles.js` | Alinear órbitas planetarias |
| Detectar completado | `SimulationScene.js` | Comunicación con juego |
| Otorgar λ₂ | `GameState.js` | Eigenvalor guardado |

**Verificación:** Completar puzzle → λ₂ aparece → guardado en localStorage

### M1.5 — Lira visual progresiva
| Tarea | Archivo | Criterio de éxito |
|-------|---------|-------------------|
| HUD con Lira | `src/ui/LyreHUD.js` | Marco de 12 cuerdas visible |
| Cuerdas según λ | `LyreHUD.js` | 2 cuerdas brillan (λ₁ + λ₂) |
| Animación al obtener | `LyreHUD.js` | Nueva cuerda aparece con glow |

**Verificación:** Obtener eigenvalor → animación → cuerda nueva en HUD

### M1.6 — Diálogo del Guardián
| Tarea | Archivo | Criterio de éxito |
|-------|---------|-------------------|
| Trigger al entrar | `RealmScene.js` | Detectar primera visita |
| Cargar diálogo | `DialogScene.js` | Texto del Guardián de Cosmos |
| Portrait del Guardián | Assets | Placeholder si no existe |
| Opciones de respuesta | `DialogScene.js` | Si aplica |

**Verificación:** Entrar a Cosmos → diálogo automático → cerrar con Space

### Autoevaluación M1

```
✓ Resonador animado reemplaza placeholder
✓ Constructo sigue al jugador
✓ Portal a Cosmos funciona
✓ Harmonices Mundi jugable con objetivo
✓ λ₂ se obtiene y guarda
✓ Lira muestra cuerdas según eigenvalores
✓ Guardián habla al entrar
✓ Build sin errores
```

**Criterio de éxito global:** Un playtester puede jugar desde título hasta obtener λ₂ sin intervención.

**Completado:** 25 dic 2024

---

## MILESTONE 2: SISTEMA DE EXPLORACIÓN

**Objetivo:** Implementar las recompensas de exploración diseñadas.

### M2.1 — Fragmentos del Constructo
| Tarea | Archivo | Criterio de éxito |
|-------|---------|-------------------|
| Crear data de fragmentos | `src/data/constructoFragments.js` | 30+ diálogos por simulación |
| Trigger al abrir exploración | `SimulationScene.js` | Detectar tipo de simulación |
| Mostrar diálogo | `DialogScene.js` | Constructo habla |
| Marcar como visto | `GameState.js` | No repetir fragmento |

### M2.2 — Resonancia (+5%)
| Tarea | Archivo | Criterio de éxito |
|-------|---------|-------------------|
| Crear sistema de resonancia | `src/systems/ResonanceSystem.js` | Barra de salud |
| UI de resonancia | `src/ui/ResonanceBar.js` | Visible en HUD |
| +5% al explorar | `SimulationScene.js` | Incremento visible |
| Efecto visual | `ResonanceBar.js` | Brillo al aumentar |

### M2.3 — Conexiones del Grafo
| Tarea | Archivo | Criterio de éxito |
|-------|---------|-------------------|
| Tracking de exploraciones | `GameState.js` | Lista de sims visitadas |
| Desbloquear enlaces | `knowledgeGraph.js` | Conexiones nuevas |
| Notificación | `NotificationManager.js` | "Conexión desbloqueada" |
| Visibilidad en GraphScene | `GraphScene.js` | Línea aparece |

### Autoevaluación M2

```
✓ Constructo habla al abrir exploración
✓ Diálogo único por simulación (50+ fragmentos)
✓ Barra de resonancia visible
✓ +5% funciona y se ve
✓ Conexiones del grafo se desbloquean (25+ conexiones)
✓ Notificaciones informan al jugador
```

**Completado:** 25 dic 2024

---

## MILESTONE 3: TRES REINOS JUGABLES

**Objetivo:** Cosmos, Chaos, Logos completamente funcionales.

### M3.1 — Chaos: Atractor de Lorenz
| Tarea | Criterio |
|-------|----------|
| Ambiente visual fractal | Partículas rojas caóticas |
| Puzzle: encontrar punto fijo | Objetivo claro en UI |
| Guardián: Patrón Emergente | Diálogo implementado |
| λ₃ obtenible | Guardado correctamente |
| 3 exploraciones funcionales | Fragmentos + resonancia |

### M3.2 — Logos: Mandelbrot
| Tarea | Criterio |
|-------|----------|
| Ambiente visual geométrico | Partículas doradas |
| Puzzle: encontrar isla-λ | Zoom hasta símbolo |
| Guardián: Teorema Viviente | Diálogo implementado |
| λ₄ obtenible | Guardado correctamente |
| 3 exploraciones funcionales | Fragmentos + resonancia |

### M3.3 — Progresión entre reinos
| Tarea | Criterio |
|-------|----------|
| Desbloqueo por λ | Acto I: 3 reinos con 1λ |
| Indicador visual | Portales grises si bloqueados |
| Mensaje si intenta acceder | "Necesitas más Eigenvalores" |

### Autoevaluación M3

```
✓ 3 reinos jugables (Cosmos, Chaos, Logos)
✓ 3 puzzles centrales completables
✓ 3 Eigenvalores obtenibles (λ₂, λ₃, λ₄)
✓ 9+ exploraciones con recompensas
✓ Lira muestra 4 cuerdas (con λ₁ tutorial)
✓ Grafo tiene conexiones desbloqueadas
✓ Sistema de desbloqueo funciona
```

**Completado:** 25 dic 2024

---

## MILESTONE 4: SEIS REINOS (Acto II completo)

**Objetivo:** Atomos, Terra, Machina añadidos.

### M4.1 — Atomos: Orbitales 3D
- Puzzle: encontrar orbital 4f₀
- Guardián: Observador Cuántico
- λ₅ obtenible

### M4.2 — Terra: Ondas Sísmicas
- Puzzle: triangular epicentro
- Guardián: Memoria Geológica
- λ₆ obtenible

### M4.3 — Machina: Game of Life
- Puzzle: crear Gosper Glider Gun
- Guardián: Algoritmo Primordial
- λ₇ obtenible

### Autoevaluación M4

```
□ 6 reinos jugables
□ 6 puzzles completables
□ 7 Eigenvalores (λ₁-λ₇)
□ Lira con 7 cuerdas brillantes
□ Acto II narrativamente completo
```

---

## MILESTONE 5: NUEVE REINOS (Acto II + III)

**Objetivo:** Alchemy, Bios, Psyche + revelación del Acto III.

### M5.1 — Alchemy: Le Chatelier
- λ₈ obtenible

### M5.2 — Bios: Neurona H-H
- λ₉ obtenible

### M5.3 — Psyche: Boids
- λ₁₀ obtenible
- Crisis existencial del Constructo

### M5.4 — Acto III: La Revelación
| Escena | Contenido |
|--------|-----------|
| Atril aparece | Trigger al tener 10λ |
| Rameau Machine | Simulación integrada |
| Flashback | Cinemática del Primer Resonador |
| λ₁₁ | Obtenido tras revelación |

### Autoevaluación M5

```
□ 9 reinos completados
□ 11 Eigenvalores (λ₁-λ₁₁)
□ Rameau Machine playable en Acto III
□ Flashback cinemático funciona
□ Constructo tiene crisis en Psyche
□ Historia revelada correctamente
```

---

## MILESTONE 6: FINAL (Acto IV + Epílogo)

### M6.1 — El Corazón de La Disonancia
- Nueva escena: `DissonanceScene.js`
- Ambiente fracturado
- Encuentro con La Disonancia

### M6.2 — Puzzle Final: Contrapunctus
- Simulación integrada
- 6 fases de contrapunto
- λ₁₂ al completar

### M6.3 — Epílogo
- Regreso a Aether transformado
- Tocar la Lira completa
- Créditos interactivos

### M6.4 — Lira como Oasis
- Implementar apertura de Sympathetic-12
- Pasar cuerdas desbloqueadas como parámetro
- Disponible post-eigenvalor

### Autoevaluación M6

```
□ Acto IV jugable completo
□ 12 Eigenvalores obtenibles
□ Contrapunctus funciona como puzzle
□ El Resonador habla por primera vez
□ Créditos interactivos
□ Lira tocable con 12 cuerdas
□ Juego completable de inicio a fin
```

---

## MILESTONE 7: PULIDO Y RELEASE

### M7.1 — Audio
- Tema por reino
- Música adaptativa
- Efectos de UI

### M7.2 — Visual
- Transiciones suaves
- Partículas mejoradas
- Shaders opcionales

### M7.3 — UX
- Tutorial mejorado
- Accesibilidad
- Guardado en nube (opcional)

### M7.4 — Testing
- Playtest completo
- Bugs críticos resueltos
- Performance 60fps

### Autoevaluación M7

```
□ Sin crashes en playthrough completo
□ Audio coherente y agradable
□ Transiciones profesionales
□ Feedback de playtester positivo
□ Build de producción funciona
```

---

## MÉTRICAS DE PROGRESO

| Milestone | Escenas | Puzzles | Eigenvalores | Exploraciones | Estado |
|-----------|---------|---------|--------------|---------------|--------|
| M1 | +0 | 1 | 2 | 0 | ✅ Completado |
| M2 | +0 | 1 | 2 | 3+ | ✅ Completado |
| M3 | +0 | 3 | 4 | 9+ | ✅ Completado |
| M4 | +0 | 6 | 7 | 15+ | ⏳ Siguiente |
| M5 | +1 | 10 | 11 | 25+ | ⬜ Pendiente |
| M6 | +1 | 11 | 12 | 30+ | ⬜ Pendiente |
| M7 | +0 | 11 | 12 | 30+ | ⬜ Pendiente |

---

## DEPENDENCIAS CRÍTICAS

```
M1 ────────────────────────────────────────────────────────────────►
    │
    └──► M2 (exploración necesita M1 funcional)
           │
           └──► M3 (3 reinos necesita sistemas de M2)
                  │
                  └──► M4 (misma estructura, más contenido)
                         │
                         └──► M5 (Acto III necesita 9 reinos)
                                │
                                └──► M6 (Acto IV necesita revelación)
                                       │
                                       └──► M7 (pulido al final)
```

---

## CHANGELOG NARRATIVO

### 25 dic 2024 (Milestone 3 - Tres Reinos Jugables)

**Milestone 3 completado**
- lorenz-attractor marcado como puzzle central de CHAOS
  - Objetivo: encontrar las dos "alas" del atractor
  - Otorga λ₃ al completar
- mandelbrot marcado como puzzle central de LOGOS
  - Objetivo: zoom hasta mini-Mandelbrot (isla-λ)
  - Otorga λ₄ al completar
- Sistema de progresión implementado
  - Puzzles centrales dan eigenvalores
  - Exploraciones dan resonancia (+5%)
  - Reinos bloqueados muestran requisitos
- Notificación visual de eigenvalor
  - Animación lambda dorada pulsante
  - Conteo de cuerdas restauradas

**Archivos modificados:**
- `src/data/missions.js` - puzzles centrales marcados
- `src/core/constants.js` - comentarios de puzzles centrales
- `src/scenes/RealmScene.js` - diferenciación puzzle/exploración
- `src/ui/NotificationManager.js` - notificación eigenvalor

### 25 dic 2024 (Milestone 2 - Sistema de Exploración)

**Milestone 2 completado**
- Sistema de fragmentos del Constructo implementado
  - 50+ diálogos únicos por simulación
  - Cada exploración muestra un fragmento aleatorio la primera vez
  - Los fragmentos revelan la personalidad y filosofía del Constructo
- Sistema de resonancia funcional
  - ResonanceBar.js como HUD visual
  - Base 100%, +5% por exploración completada
  - Animaciones y colores según nivel de resonancia
- Sistema de conexiones del grafo
  - 25+ conexiones conceptuales entre simulaciones
  - Se desbloquean al explorar ambas simulaciones requeridas
  - Conexiones intra-reino e inter-reino
- Notificaciones de exploración y conexiones

**Archivos nuevos:**
- `src/data/constructoFragments.js`
- `src/data/graphConnections.js`
- `src/ui/ResonanceBar.js`

### 25 dic 2024 (Milestone 1 - Vertical Slice)

**Milestone 1 completado**
- Resonador con sprites reales y animaciones direccionales
- Constructo compañero con follow behavior y bobbing
- Portales visuales con glow y tintes de color
- Harmonices Mundi como puzzle central de COSMOS
- LyreHUD mostrando progreso de eigenvalores
- Diálogos de guardianes para todos los reinos
- Build verificado sin errores

**Game of Life reemplaza Perceptrón en MACHINA**
- *Razón:* Más visual, demuestra Turing-completitud y emergencia
- *Metáfora:* "still life" = perfección congelada = muerte

**Orbitales 3D reemplaza Doble Rendija en ATOMOS**
- *Razón:* Más visual (Three.js 3D), nubes de probabilidad espectaculares
- *Metáfora:* "forzar certeza creó el colapso"

**Rameau Machine añadida al Acto III**
- *Razón:* Visualiza la obsesión del Primer Resonador con eliminar tensión
- *Conexión:* Rameau (vertical) + Fux (horizontal) = dos sistemas, mismo problema

**Lira redefinida como oasis, no arma**
- *Razón:* Momentos contemplativos > mecánicas de combate
- *Implementación:* Abre Sympathetic-12 real con cuerdas desbloqueadas

**Sistema de exploración híbrido**
- *Recompensas:* Fragmentos Constructo + Resonancia + Conexiones Grafo
- *Filosofía:* Explorar enriquece, nunca bloquea

### 24 dic 2024

- Harmonices Mundi en Cosmos (no Aether)
- 9 reinos, no 10
- 12 cuerdas (escala cromática)
- La Disonancia no es villano
- Constructo cuestiona consciencia en Psyche
