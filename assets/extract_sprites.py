#!/usr/bin/env python3
"""
EigenLab Odyssey - Sprite Extractor
Extrae sprites de los concept arts con fondo transparente.
"""

from PIL import Image
import os

# Rutas
CONCEPTS_DIR = "concepts"
SPRITES_DIR = "sprites"
UI_DIR = "ui"
EFFECTS_DIR = "effects"
BACKGROUNDS_DIR = "backgrounds"

def ensure_dirs():
    """Crea los directorios necesarios."""
    dirs = [
        f"{SPRITES_DIR}/resonator",
        f"{SPRITES_DIR}/lyra",
        f"{SPRITES_DIR}/companion",
        f"{SPRITES_DIR}/portals",
        f"{SPRITES_DIR}/environment",
        f"{SPRITES_DIR}/items",
        UI_DIR,
        EFFECTS_DIR,
        BACKGROUNDS_DIR,
    ]
    for d in dirs:
        os.makedirs(d, exist_ok=True)

def remove_background(img, threshold=30, bg_color=(216, 213, 206)):
    """
    Remueve el fondo gris/beige de las imágenes.
    Convierte píxeles cercanos al color de fondo a transparente.
    """
    img = img.convert("RGBA")
    data = img.getdata()

    new_data = []
    for item in data:
        # Si el pixel es cercano al color de fondo
        if (abs(item[0] - bg_color[0]) < threshold and
            abs(item[1] - bg_color[1]) < threshold and
            abs(item[2] - bg_color[2]) < threshold):
            new_data.append((255, 255, 255, 0))  # Transparente
        else:
            new_data.append(item)

    img.putdata(new_data)
    return img

def crop_and_save(img, box, output_path, remove_bg=True, bg_threshold=30):
    """Recorta una región y la guarda con transparencia."""
    cropped = img.crop(box)
    if remove_bg:
        cropped = remove_background(cropped, threshold=bg_threshold)
    cropped.save(output_path, "PNG")
    print(f"  ✓ {output_path}")

def extract_concept_02():
    """Concept 02: Character Sheet - Resonador idle y portrait"""
    print("\n📦 Concept 02: Character Sheet")
    img = Image.open(f"{CONCEPTS_DIR}/concept-02-character-sheet.png")
    w, h = img.size

    # Resonador idle (izquierda) - cuerpo completo
    crop_and_save(img, (50, 80, 750, 1450), f"{SPRITES_DIR}/resonator/idle.png")

    # Resonador portrait (derecha) - busto
    crop_and_save(img, (1350, 50, 2750, 1450), f"{SPRITES_DIR}/resonator/portrait.png")

def extract_concept_03():
    """Concept 03: Companion + Lyra inactiva"""
    print("\n📦 Concept 03: Companion + Lyra")
    img = Image.open(f"{CONCEPTS_DIR}/concept-03-companion-lyra.png")

    # Constructo normal (izquierda)
    crop_and_save(img, (30, 150, 920, 1350), f"{SPRITES_DIR}/companion/construct-normal.png")

    # Constructo glitch (centro)
    crop_and_save(img, (920, 150, 1810, 1350), f"{SPRITES_DIR}/companion/construct-glitch.png")

    # Lyra inactiva (derecha)
    crop_and_save(img, (1850, 150, 2750, 1400), f"{SPRITES_DIR}/lyra/lyra-inactive.png")

def extract_concept_04():
    """Concept 04: Environment - Portales y assets"""
    print("\n📦 Concept 04: Environment")
    img = Image.open(f"{CONCEPTS_DIR}/concept-04-environment.png")

    # Portal inactivo (izquierda) - fondo oscuro, no remover
    crop_and_save(img, (20, 180, 880, 1400), f"{SPRITES_DIR}/portals/portal-inactive.png",
                  remove_bg=True, bg_threshold=15)

    # Portal activo (centro)
    crop_and_save(img, (880, 180, 1750, 1400), f"{SPRITES_DIR}/portals/portal-active.png",
                  remove_bg=True, bg_threshold=15)

    # Columna con fórmulas (derecha arriba)
    crop_and_save(img, (1900, 100, 2500, 1100), f"{SPRITES_DIR}/environment/column-formulas.png",
                  remove_bg=True, bg_threshold=15)

    # Plataforma (derecha abajo)
    crop_and_save(img, (1850, 950, 2750, 1450), f"{SPRITES_DIR}/environment/platform-stone.png",
                  remove_bg=True, bg_threshold=15)

def extract_concept_05():
    """Concept 05: UI + VFX"""
    print("\n📦 Concept 05: UI + VFX")
    img = Image.open(f"{CONCEPTS_DIR}/concept-05-ui-vfx.png")

    # UI Elements
    # Barra de resonancia (salud)
    crop_and_save(img, (30, 100, 1150, 280), f"{UI_DIR}/bar-resonance.png")

    # Icono Eigenvalor
    crop_and_save(img, (1550, 30, 1950, 430), f"{UI_DIR}/icon-eigenvalor.png")

    # Barra de sintonización
    crop_and_save(img, (30, 320, 1150, 480), f"{UI_DIR}/bar-tuning.png")

    # Botones
    crop_and_save(img, (1400, 430, 1750, 560), f"{UI_DIR}/button-with-key.png")
    crop_and_save(img, (1780, 430, 2100, 560), f"{UI_DIR}/button-simple.png")

    # VFX
    # Onda de sonido dorada
    crop_and_save(img, (20, 780, 1000, 1450), f"{EFFECTS_DIR}/vfx-soundwave.png")

    # Fragmentos de glitch
    crop_and_save(img, (1050, 800, 1800, 1450), f"{EFFECTS_DIR}/vfx-glitch.png")

    # Chispas de afinación
    crop_and_save(img, (1850, 800, 2750, 1450), f"{EFFECTS_DIR}/vfx-sparks.png")

def extract_concept_06():
    """Concept 06: Walk Cycle - 4 direcciones"""
    print("\n📦 Concept 06: Walk Cycle")
    img = Image.open(f"{CONCEPTS_DIR}/concept-06-walk-cycle.png")
    w, h = img.size

    # Dividir en 4 partes iguales (aproximadamente)
    char_width = w // 4

    # Walk Front (Down)
    crop_and_save(img, (0, 100, 700, 1450), f"{SPRITES_DIR}/resonator/walk-down.png")

    # Walk Back (Up)
    crop_and_save(img, (700, 100, 1400, 1450), f"{SPRITES_DIR}/resonator/walk-up.png")

    # Walk Left
    crop_and_save(img, (1400, 100, 2100, 1450), f"{SPRITES_DIR}/resonator/walk-left.png")

    # Walk Right
    crop_and_save(img, (2100, 100, 2800, 1450), f"{SPRITES_DIR}/resonator/walk-right.png")

def extract_concept_07():
    """Concept 07: Lyra Activa"""
    print("\n📦 Concept 07: Lyra Active")
    img = Image.open(f"{CONCEPTS_DIR}/concept-07-lyra-active.png")
    w, h = img.size

    # Lyra centrada - recortar con margen
    margin_x = 700
    margin_y = 200
    crop_and_save(img, (margin_x, margin_y, w - margin_x, h - margin_y),
                  f"{SPRITES_DIR}/lyra/lyra-active.png")

def extract_concept_01():
    """Concept 01: Hero Scene - Background"""
    print("\n📦 Concept 01: Hero Scene (Background)")
    img = Image.open(f"{CONCEPTS_DIR}/concept-01-hero.png")

    # Guardar como fondo de título (sin modificar)
    img.save(f"{BACKGROUNDS_DIR}/title-screen.png", "PNG")
    print(f"  ✓ {BACKGROUNDS_DIR}/title-screen.png")

def main():
    print("=" * 50)
    print("🎮 EigenLab Odyssey - Sprite Extractor")
    print("=" * 50)

    # Cambiar al directorio de assets
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    ensure_dirs()

    extract_concept_01()
    extract_concept_02()
    extract_concept_03()
    extract_concept_04()
    extract_concept_05()
    extract_concept_06()
    extract_concept_07()

    print("\n" + "=" * 50)
    print("✅ Extracción completada!")
    print("=" * 50)

if __name__ == "__main__":
    main()
