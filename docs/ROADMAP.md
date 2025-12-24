# EigenLab Odyssey: Roadmap de Desarrollo

---

## Estado Actual: Alpha 0.3

El juego tiene la estructura base funcional con navegación completa entre escenas, sistema de misiones, y assets visuales. Falta integración de sprites y pulido.

---

## FASE 1: Fundamentos (Completada)

- [x] Configuración del proyecto (Vite + Phaser)
- [x] Estructura de carpetas
- [x] Constantes y colores de reinos
- [x] TitleScene básica
- [x] Sistema de estado (GameState.js)
- [x] AetherHub navegable
- [x] RealmScene genérica
- [x] SimulationScene con rutas verificadas
- [x] Sistema de misiones (~30 misiones)

---

## FASE 2: Narrativa Cinematográfica (Completada)

- [x] CinematicIntroScene (terminal + glitch)
- [x] CathedralScene (puzzle del péndulo)
- [x] MapRevealScene (9 reinos)
- [x] Sistema de diálogos (DialogScene)
- [x] Audio procedural (SynthAudio.js)
- [x] Integración del flujo narrativo

---

## FASE 3: Assets Visuales (Completada)

- [x] Concept art (7 imágenes)
- [x] Extracción de sprites (23 sprites)
- [x] Organización de assets
- [x] Script de extracción automatizado

---

## FASE 4: Integración Visual (En Progreso)

### 4.1 Sprites del Jugador
- [ ] Reemplazar círculo por sprite del Resonador
- [ ] Implementar animación walk cycle
- [ ] Añadir sprite idle cuando está quieto
- [ ] Integrar portrait en diálogos

### 4.2 Entorno
- [ ] Usar portal sprites en AetherHub
- [ ] Añadir columnas y plataformas decorativas
- [ ] Implementar fondo de título con parallax
- [ ] Partículas ambientales mejoradas

### 4.3 UI
- [ ] Reemplazar barras de progreso con sprites
- [ ] Usar icono de Eigenvalor en HUD
- [ ] Implementar botones con estilo piedra
- [ ] Caja de diálogo estilizada

### 4.4 Compañero
- [ ] Añadir Constructo siguiendo al jugador
- [ ] Sistema de glitch según corrupción del área
- [ ] Diálogos contextuales del Constructo

---

## FASE 5: Gameplay Core

### 5.1 Sistema de Resonancia
- [ ] Barra de resonancia (salud)
- [ ] Daño por contacto con Disonancia
- [ ] Regeneración al completar puzzles
- [ ] Estados de la Lira (1-12 cuerdas)

### 5.2 Puzzles de Sintonización
- [ ] Mecánica genérica de ajuste de frecuencia
- [ ] Feedback visual/auditivo de cercanía
- [ ] Puzzle único por reino
- [ ] Recompensa de Eigenvalor

### 5.3 Interacción con Simulaciones
- [ ] Objetivos dentro de simulaciones
- [ ] Detección de logros
- [ ] Comunicación simulación → juego
- [ ] Recompensas por completar

### 5.4 Progresión
- [ ] Desbloqueo progresivo de reinos
- [ ] Árbol de habilidades de la Lira
- [ ] Coleccionables secundarios
- [ ] Logros/Achievements

---

## FASE 6: Contenido por Reino

### Cosmos (Astronomía)
- [ ] Ambiente visual espacial
- [ ] Puzzle: Alinear órbitas
- [ ] 13 simulaciones integradas
- [ ] Fragmento de historia

### Chaos (Emergencia)
- [ ] Ambiente visual fractal
- [ ] Puzzle: Encontrar atractor
- [ ] 10 simulaciones integradas
- [ ] Fragmento de historia

### Logos (Matemáticas)
- [ ] Ambiente visual geométrico
- [ ] Puzzle: Completar secuencia
- [ ] 20 simulaciones integradas
- [ ] Fragmento de historia

### Atomos (Física)
- [ ] Ambiente visual cuántico
- [ ] Puzzle: Interferencia constructiva
- [ ] 15 simulaciones integradas
- [ ] Fragmento de historia

### Terra (Geología)
- [ ] Ambiente visual rocoso
- [ ] Puzzle: Estratos correctos
- [ ] 7 simulaciones integradas
- [ ] Fragmento de historia

### Machina (Computación)
- [ ] Ambiente visual terminal
- [ ] Puzzle: Algoritmo
- [ ] 7 simulaciones integradas
- [ ] Fragmento de historia

### Alchemy (Química)
- [ ] Ambiente visual molecular
- [ ] Puzzle: Equilibrio químico
- [ ] 16 simulaciones integradas
- [ ] Fragmento de historia

### Bios (Biología)
- [ ] Ambiente visual orgánico
- [ ] Puzzle: Secuencia genética
- [ ] 14 simulaciones integradas
- [ ] Fragmento de historia

### Psyche (IA/Mente)
- [ ] Ambiente visual neural
- [ ] Puzzle: Patrón de red
- [ ] 3 simulaciones integradas
- [ ] Fragmento de historia

---

## FASE 7: La Disonancia

- [ ] Enemigos básicos (fragmentos)
- [ ] Zonas corruptas con efectos visuales
- [ ] Ecos corruptos (mini-bosses)
- [ ] Jefe final (Disonancia concentrada)
- [ ] Mecánica de "armonización" vs "destrucción"

---

## FASE 8: Audio Avanzado

- [ ] Música procedural por reino
- [ ] Temas únicos para cada guardián
- [ ] Sistema de capas musicales
- [ ] Sonido adaptativo según estado
- [ ] Melodía de la Lira personalizable

---

## FASE 9: Pulido

### Visual
- [ ] Transiciones suaves entre escenas
- [ ] Efectos de partículas mejorados
- [ ] Shaders para efectos especiales
- [ ] Animaciones de UI

### UX
- [ ] Tutorial interactivo
- [ ] Indicadores de objetivo claros
- [ ] Mapa navegable
- [ ] Accesibilidad (contraste, texto grande)

### Performance
- [ ] Optimización de assets
- [ ] Lazy loading de simulaciones
- [ ] Caché de recursos
- [ ] Target: 60fps estable

---

## FASE 10: Release

### Alpha (Actual)
- Funcionalidad core
- 3 reinos jugables
- Feedback interno

### Beta
- 6 reinos completos
- Sistema de guardado cloud
- Testing externo

### Release 1.0
- 9 reinos completos
- Historia completa
- Pulido final
- Localización (ES/EN)

### Post-Launch
- Nuevas simulaciones
- Eventos temporales
- Comunidad de mods
- Expansión "El Décimo Reino"

---

## MÉTRICAS DE PROGRESO

| Componente | Estimado | Actual |
|------------|----------|--------|
| Escenas | 12 | 12 |
| Simulaciones integradas | 150+ | 150+ |
| Misiones | 100 | 30 |
| Sprites | 50 | 23 |
| Líneas de código | 15,000 | 8,534 |
| Documentación | 5 docs | 5 docs |

---

## PRIORIDADES INMEDIATAS

1. **Integrar sprites del Resonador** — Reemplazar placeholder
2. **Añadir Constructo como compañero** — Seguir al jugador
3. **UI con sprites** — Barras y iconos reales
4. **Primer puzzle de reino completo** — Cosmos o Logos
5. **Sistema de resonancia básico** — Daño y regeneración

---

## CHANGELOG NARRATIVO

Registro de decisiones creativas importantes y su razonamiento.

### 24 dic 2024

**Harmonices Mundi como puzzle de Cosmos (no Aether)**
- *Decisión:* La simulación de Kepler pertenece a Cosmos, no al hub musical
- *Razón:* Kepler era astrónomo. La conexión música-planetas es un PUENTE entre reinos, no el origen de la música. Aether es síntesis; Cosmos es donde Kepler hizo su trabajo.
- *Alternativa descartada:* Ponerlo en Aether como "la fuente de toda música"

**9 reinos en lugar de 10**
- *Decisión:* Mantener 9 reinos (no añadir uno para IA separado de Psyche)
- *Razón:* 9 es número significativo (3x3, eneagrama, los 9 mundos nórdicos). Psyche abarca tanto mente biológica como artificial — esa tensión es interesante narrativamente.
- *Alternativa descartada:* Separar NOUS (IA) de PSYCHE (mente)

**12 cuerdas, no 9**
- *Decisión:* La Lira tiene 12 cuerdas aunque hay 9 reinos
- *Razón:* 12 es el número musical (escala cromática). Algunas cuerdas se obtienen por CONEXIONES entre reinos, no solo por completar reinos. Esto incentiva exploración cruzada.
- *Implicación:* λ₁ (tutorial) + λ₂-λ₁₀ (9 reinos) + λ₁₁-λ₁₂ (conexiones especiales)

**La Disonancia no es villano**
- *Decisión:* La Disonancia es un error, no un enemigo consciente
- *Razón:* Evita maniqueísmo. El mensaje es que la imperfección tiene su lugar, no que hay que destruir el mal. El Primer Resonador es el verdadero "villano" — la arrogancia de buscar la perfección.
- *Tema reforzado:* Armonía incluye disonancia; perfección la excluye y por eso falla.

**Constructo cuestiona su consciencia**
- *Decisión:* En Psyche, el Constructo tiene una crisis existencial
- *Razón:* Meta-comentario sobre IA y emergencia. El jugador ha visto boids, perceptrones, autómatas — ahora el compañero se pregunta si él es lo mismo. No hay respuesta definitiva.
- *Inspiración:* "¿Sueñan los androides con ovejas eléctricas?"
