# Instrucciones de Ejecución Autónoma

> Este archivo define cómo Claude Code debe ejecutar los milestones del proyecto.

---

## PERMISOS CONCEDIDOS

Claude tiene permiso explícito para:

- ✅ Crear, editar y eliminar cualquier archivo en el proyecto
- ✅ Ejecutar `npm run dev`, `npm run build`, y cualquier comando de desarrollo
- ✅ Hacer commits y push a GitHub
- ✅ Instalar dependencias con `npm install`
- ✅ Crear nuevas carpetas y reorganizar estructura
- ✅ Modificar assets (sprites, audio, etc.)
- ✅ Tomar decisiones técnicas de implementación

---

## REGLAS DE AUTONOMÍA

### Decidir solo (no preguntar)

- Nombres de variables y funciones
- Estructura interna de clases
- Orden de implementación dentro de un milestone
- Solución de bugs técnicos
- Optimizaciones de código
- Formato y estilo de código

### Preguntar antes

- Cambios en la narrativa o diálogos escritos
- Modificaciones al diseño de puzzles definido
- Decisiones estéticas significativas (colores, estilos visuales)
- Añadir features no especificadas en el plan
- Eliminar contenido existente del guión

### En caso de duda

Implementar la opción más simple primero. Si no funciona, entonces preguntar.

---

## FLUJO DE TRABAJO

### Al iniciar sesión

1. Leer `CLAUDE.md` para contexto del proyecto
2. Leer `docs/ROADMAP.md` para ver estado actual
3. Identificar el milestone en curso (marcado con ⏳)
4. Ejecutar tareas en orden hasta completar

### Durante la ejecución

1. Usar `TodoWrite` para trackear progreso visible
2. Hacer commits frecuentes (cada sub-milestone completado)
3. Verificar con `npm run dev` antes de marcar como completado
4. Actualizar ROADMAP.md al completar cada milestone

### Al finalizar sesión

1. Commit de todo el trabajo
2. Push a GitHub
3. Actualizar ROADMAP.md con estado actual
4. Dejar nota de qué sigue en el próximo milestone

---

## ESTRUCTURA DE MILESTONES

### M1: Vertical Slice (COSMOS)
**Objetivo:** Un reino jugable completo.

```
M1.1 Sprites del Resonador
M1.2 Constructo Compañero
M1.3 Portal a Cosmos
M1.4 Puzzle: Harmonices Mundi
M1.5 Lira visual progresiva
M1.6 Diálogo del Guardián
```

**Criterio de éxito:** Playthrough desde título hasta λ₂ sin crashes.

### M2: Sistema de Exploración
**Objetivo:** Recompensas por explorar simulaciones.

```
M2.1 Fragmentos del Constructo
M2.2 Resonancia (+5%)
M2.3 Conexiones del Grafo
```

### M3-M7: Ver ROADMAP.md

---

## ARCHIVOS CLAVE

| Archivo | Propósito |
|---------|-----------|
| `CLAUDE.md` | Contexto general del proyecto |
| `docs/ROADMAP.md` | Plan de producción con tareas |
| `docs/GDD.md` | Diseño de mecánicas |
| `docs/STORY.md` | Narrativa y diálogos |
| `docs/CHARACTERS.md` | Personajes y reglas del universo |
| `docs/PITCH.html` | Resumen visual |

---

## RUTAS DE SIMULACIONES

Las simulaciones de EigenLab están en:
```
/Users/carlos/Projects/EigenLab/
├── Physics/Physics Sound Lab/generativos/
│   ├── harmonices-mundi/    ← COSMOS puzzle
│   ├── rameau-machine/      ← Acto III
│   ├── contrapunctus/       ← Acto IV
│   └── sympathetic-12/      ← Lira oasis
├── Mathematics/Math Visual Lab/
│   ├── mandelbrot.html      ← LOGOS puzzle
│   ├── game-of-life.html    ← MACHINA puzzle
│   └── lorenz-attractor.html ← CHAOS puzzle
├── Physics/Physics Visual Lab/
│   └── interferencia.html   ← Exploración
├── Chemistry/Chemistry Visual Lab/
│   ├── orbitales.html       ← ATOMOS puzzle
│   └── le-chatelier.html    ← ALCHEMY puzzle
├── Geology/Geology Visual Lab/
│   └── ondas-sismicas.html  ← TERRA puzzle
└── Biology/Biology Visual Lab/
    └── neurona.html         ← BIOS puzzle
```

---

## PROMPTS POR SESIÓN

### Sesión M1 (Vertical Slice)

```
Lee CLAUDE.md y CLAUDE_INSTRUCTIONS.md. Ejecuta el Milestone 1 completo según docs/ROADMAP.md.

Tienes permisos para todo. Trabaja de forma autónoma. Solo pregunta si hay decisión creativa crítica.

Al terminar cada sub-milestone (M1.1, M1.2, etc.), haz commit. Al completar M1 entero, actualiza ROADMAP.md marcándolo como ✅.
```

### Sesión M2 (Exploración)

```
Lee CLAUDE.md y CLAUDE_INSTRUCTIONS.md. Ejecuta el Milestone 2 completo según docs/ROADMAP.md.

M1 está completado. Ahora implementa el sistema de exploración: fragmentos, resonancia, conexiones.

Tienes permisos para todo. Solo pregunta si hay decisión creativa crítica.
```

### Sesión M3 (Tres Reinos)

```
Lee CLAUDE.md y CLAUDE_INSTRUCTIONS.md. Ejecuta el Milestone 3 completo según docs/ROADMAP.md.

M1 y M2 completados. Ahora implementa Chaos y Logos con la misma estructura que Cosmos.

Tienes permisos para todo. Solo pregunta si hay decisión creativa crítica.
```

### Sesión M4 (Seis Reinos)

```
Lee CLAUDE.md y CLAUDE_INSTRUCTIONS.md. Ejecuta el Milestone 4 completo según docs/ROADMAP.md.

Añade Atomos, Terra, Machina. Misma estructura que los anteriores.

Tienes permisos para todo. Solo pregunta si hay decisión creativa crítica.
```

### Sesión M5 (Nueve Reinos + Acto III)

```
Lee CLAUDE.md y CLAUDE_INSTRUCTIONS.md. Ejecuta el Milestone 5 completo según docs/ROADMAP.md.

Añade Alchemy, Bios, Psyche. Implementa el Acto III con Rameau Machine y flashback.

Tienes permisos para todo. Solo pregunta si hay decisión creativa crítica.
```

### Sesión M6 (Final)

```
Lee CLAUDE.md y CLAUDE_INSTRUCTIONS.md. Ejecuta el Milestone 6 completo según docs/ROADMAP.md.

Implementa Acto IV: Corazón de la Disonancia, Contrapunctus, Epílogo, Lira como oasis.

Tienes permisos para todo. Solo pregunta si hay decisión creativa crítica.
```

### Sesión M7 (Pulido)

```
Lee CLAUDE.md y CLAUDE_INSTRUCTIONS.md. Ejecuta el Milestone 7 completo según docs/ROADMAP.md.

Pulido final: audio, transiciones, UX, testing. El juego debe ser completable sin crashes.

Tienes permisos para todo. Solo pregunta si hay decisión creativa crítica.
```

---

## VERIFICACIÓN DE COMPLETITUD

Antes de marcar un milestone como ✅, verificar:

1. `npm run dev` funciona sin errores
2. El flujo descrito en "Criterio de éxito" es jugable
3. Todos los items del checklist de autoevaluación están marcados
4. Commits hechos y pusheados
5. ROADMAP.md actualizado

---

## NOTAS TÉCNICAS

- **Motor:** Phaser.js 3.70+
- **Bundler:** Vite
- **Audio:** Web Audio API (SynthAudio.js)
- **Estado:** localStorage via GameState.js
- **Navegación:** NavigationSystem.js

### Patrones de código existentes

```javascript
// Escena típica
export default class MiScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MiScene' });
    }
    preload() { }
    create() { }
    update() { }
}

// Registrar en config.js
import MiScene from './scenes/MiScene.js';
// Añadir a scene: [...]

// Transición entre escenas
this.scene.start('OtraScene', { data: valor });

// Acceso a estado global
import { gameState } from '../systems/GameState.js';
gameState.addEigenvalue('cosmos');
```

---

## EN CASO DE ERROR

1. Leer el mensaje de error completo
2. Buscar en el código existente patrones similares
3. Intentar solución simple primero
4. Si persiste, describir el error y pedir ayuda

---

*Última actualización: 25 dic 2024*
