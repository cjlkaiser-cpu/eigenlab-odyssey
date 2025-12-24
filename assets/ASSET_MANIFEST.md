# EigenLab Odyssey - Asset Manifest

## Estado de Assets

### 1. Concept Art (Referencias)
| Archivo | Descripción | Estado |
|---------|-------------|--------|
| `concept-01-hero.png` | Resonador con Lira, Catedral de fondo, Disonancia | Recibido |
| `concept-02-character-sheet.png` | Resonador idle + close-up con Lira y Diapasón | Recibido |
| `concept-03-companion-lyra.png` | Constructo de Éter (normal/glitch) + Lira inactiva | Recibido |
| `concept-04-environment.png` | Portales (inactivo/activo) + Columna + Plataformas | Recibido |
| `concept-05-ui-vfx.png` | UI (barras, iconos, botones) + VFX (ondas, glitch, chispas) | Recibido |
| `concept-06-walk-cycle.png` | Resonador 4 direcciones (front/back/left/right) | Recibido |
| `concept-07-lyra-active.png` | Lira Simpática aislada, estado máximo poder | Recibido |

---

## Sprites Necesarios

### sprites/resonator/
| Archivo | Descripción | Estado |
|---------|-------------|--------|
| `idle.png` | Pose de reposo | Pendiente (extraer de concept-02) |
| `portrait.png` | Busto para diálogos | Pendiente (extraer de concept-02) |
| `walk-down.png` | Caminando hacia cámara (4 frames) | Pendiente (extraer de concept-06) |
| `walk-up.png` | Caminando alejándose (4 frames) | Pendiente (extraer de concept-06) |
| `walk-left.png` | Caminando izquierda (4 frames) | Pendiente (extraer de concept-06) |
| `walk-right.png` | Caminando derecha (mirror left) | Pendiente (extraer de concept-06) |
| `interact.png` | Tocando la Lira | Pendiente |

### sprites/lyra/
| Archivo | Descripción | Estado |
|---------|-------------|--------|
| `lyra-inactive.png` | Lira apagada, sin cuerdas de luz | Pendiente (extraer de concept-03) |
| `lyra-broken.png` | Lira rota (inicio del juego) | Pendiente |
| `lyra-1string.png` | Lira con 1 cuerda restaurada | Pendiente |
| `lyra-full.png` | Lira completa (12 cuerdas) | Pendiente |
| `lyra-active.png` | Lira brillando al tocar | Pendiente (extraer de concept-07) |

### sprites/companion/
| Archivo | Descripción | Estado |
|---------|-------------|--------|
| `construct-normal.png` | Constructo de Éter estado normal | Pendiente (extraer de concept-03) |
| `construct-glitch.png` | Constructo de Éter glitcheado | Pendiente (extraer de concept-03) |
| `construct-idle-anim.png` | Spritesheet rotación idle | Pendiente |

### sprites/items/
| Archivo | Descripción | Estado |
|---------|-------------|--------|
| `tuning-fork.png` | Diapasón de Vacío | Pendiente (extraer de concept-02) |
| `eigenvalor.png` | Icono de Eigenvalor (λ) | Pendiente |

### sprites/portals/
| Archivo | Descripción | Estado |
|---------|-------------|--------|
| `portal-frame.png` | Marco de piedra con runas (base) | Pendiente (extraer de concept-04) |
| `portal-inactive.png` | Centro oscuro (bloqueado) | Pendiente (extraer de concept-04) |
| `portal-vortex.png` | Vórtice espiral (se tiñe por reino) | Pendiente (extraer de concept-04) |
| `portal-vortex-anim.png` | Spritesheet animación vórtice | Pendiente |

### sprites/environment/
| Archivo | Descripción | Estado |
|---------|-------------|--------|
| `column-obsidian.png` | Columna con fórmulas brillantes | Pendiente (extraer de concept-04) |
| `platform-stone.png` | Plataforma fragmentada | Pendiente (extraer de concept-04) |
| `debris-rocks.png` | Rocas flotantes pequeñas | Pendiente |
| `stairs-broken.png` | Escaleras rotas | Pendiente (extraer de concept-04) |

### backgrounds/
| Archivo | Descripción | Estado |
|---------|-------------|--------|
| `title-screen.png` | Fondo pantalla título | Pendiente (adaptar concept-01) |
| `aether-hub.png` | Fondo del hub central | Pendiente |
| `cathedral.png` | Catedral de Datos | Pendiente (extraer de concept-01) |

### ui/
| Archivo | Descripción | Estado |
|---------|-------------|--------|
| `bar-resonance.png` | Barra de salud (latón + cristal) | Pendiente (extraer de concept-05) |
| `bar-resonance-fill.png` | Relleno cian de la barra | Pendiente (extraer de concept-05) |
| `bar-tuning.png` | Barra de progreso sintonización | Pendiente (extraer de concept-05) |
| `bar-tuning-fill.png` | Relleno de progreso | Pendiente (extraer de concept-05) |
| `icon-eigenvalor.png` | Runa dorada de Eigenvalor | Pendiente (extraer de concept-05) |
| `button-stone.png` | Botón piedra normal | Pendiente (extraer de concept-05) |
| `button-stone-hover.png` | Botón piedra iluminado | Pendiente (extraer de concept-05) |
| `dialog-box.png` | Caja de diálogo | Pendiente |

### effects/
| Archivo | Descripción | Estado |
|---------|-------------|--------|
| `vfx-soundwave.png` | Onda dorada con notas musicales | Pendiente (extraer de concept-05) |
| `vfx-glitch.png` | Fragmentos rojos/negros Disonancia | Pendiente (extraer de concept-05) |
| `vfx-sparks.png` | Chispas azul/dorado de éxito | Pendiente (extraer de concept-05) |
| `particle-note.png` | Nota musical individual | Pendiente (extraer de concept-05) |

---

## Notas de Estilo
- **Paleta principal:** Índigo (#4338ca), Dorado (#fbbf24), Cian (#06b6d4)
- **Estilo:** Cell-shaded con texturas de acuarela
- **Resolución base:** 64x64 para sprites de personaje en gameplay
- **Resolución retratos:** 256x256 o superior para diálogos
