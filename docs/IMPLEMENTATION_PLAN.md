# EigenLab Odyssey - Plan de Implementación

## Estado Actual ✅
- [x] Hub de Aether con jugador movible
- [x] 3 portales iniciales (Cosmos, Chaos, Logos)
- [x] Navegación a RealmScene
- [x] Grid de simulaciones por reino
- [x] SimulationScene con iframe
- [x] Sistema de diálogos básico
- [x] NavigationSystem (estructura)

---

## FASE 1: Sistema de Progresión Completo
**Objetivo:** El juego debe recordar el progreso y mostrar desbloqueos

### 1.1 GameState Manager
- [ ] Crear clase GameState centralizada
- [ ] Persistencia en localStorage
- [ ] Eventos de cambio de estado

### 1.2 UI de Progresión
- [ ] Contador de Eigenvalores visible
- [ ] Indicador de simulaciones completadas
- [ ] Marcado visual en grid de simulaciones

### 1.3 Sistema de Desbloqueo
- [ ] Reinos bloqueados visualmente en AetherHub
- [ ] Mensaje al intentar entrar a reino bloqueado
- [ ] Animación de desbloqueo

---

## FASE 2: Todos los Reinos
**Objetivo:** Los 9 reinos accesibles con sus simulaciones

### 2.1 Expandir AetherHub
- [ ] Agregar portales para los 6 reinos restantes
- [ ] Layout circular/radial para 9 portales
- [ ] Portales bloqueados con aspecto diferente

### 2.2 Completar Metadatos
- [ ] Nombres y descripciones para TODAS las simulaciones
- [ ] Rutas correctas a archivos de EigenLab

---

## FASE 3: Sistema de Conexiones
**Objetivo:** Descubrir relaciones entre disciplinas

### 3.1 Detección de Conexiones
- [ ] Verificar al completar simulación
- [ ] Notificación visual de conexión descubierta

### 3.2 Mapa de Conexiones
- [ ] Escena para visualizar conexiones
- [ ] Líneas entre reinos conectados

---

## FASE 4: Narrativa
**Objetivo:** Historia coherente en 4 actos

### 4.1 Textos Narrativos
- [ ] Intro de cada reino
- [ ] Diálogos de progresión
- [ ] Revelaciones al descubrir conexiones

### 4.2 NPCs/Entidades
- [ ] "El Eco" - guía en Aether
- [ ] Guardianes de cada reino (opcionales)

---

## FASE 5: Pantallas de Menú
**Objetivo:** Experiencia de juego completa

### 5.1 Pantalla de Título
- [ ] Logo animado
- [ ] Nuevo Juego / Continuar
- [ ] Créditos

### 5.2 Menú de Pausa
- [ ] ESC para pausar
- [ ] Ver progreso / Mapa / Salir

### 5.3 Pantalla de Mapa Global
- [ ] Vista de los 9 reinos
- [ ] Estado de cada uno
- [ ] Navegación directa

---

## FASE 6: Polish
**Objetivo:** Calidad profesional

### 6.1 Audio
- [ ] Música ambiente por reino
- [ ] Efectos de sonido (portales, UI)

### 6.2 Transiciones
- [ ] Efectos de entrada/salida de reinos
- [ ] Partículas temáticas

### 6.3 Responsive
- [ ] Adaptar a diferentes tamaños de pantalla

---

## Orden de Ejecución

```
FASE 1 ──► FASE 2 ──► FASE 5.1 ──► FASE 3 ──► FASE 4 ──► FASE 5.2/5.3 ──► FASE 6
  │           │           │           │           │              │            │
  └─ Core ────┴─ Content ─┴─ Polish ──┴─ Story ───┴─ Features ───┴─ Final ────┘
```

## Criterios de Autoevaluación

Después de cada fase:
1. ¿Funciona sin errores en consola?
2. ¿La UX es intuitiva?
3. ¿El código es mantenible?
4. ¿Está integrado con lo anterior?

---

*Inicio: Fase 1.1 - GameState Manager*
