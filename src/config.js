/**
 * EigenLab Odyssey - Configuración de Phaser
 */

import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, UI_COLORS } from './core/constants.js';

import TitleScene from './scenes/TitleScene.js';
import BootScene from './scenes/BootScene.js';
import PreloadScene from './scenes/PreloadScene.js';
import CinematicIntroScene from './scenes/CinematicIntroScene.js';
import CathedralScene from './scenes/CathedralScene.js';
import MapRevealScene from './scenes/MapRevealScene.js';
import AetherHub from './scenes/AetherHub.js';
import DialogScene from './scenes/DialogScene.js';
import RealmScene from './scenes/RealmScene.js';
import SimulationScene from './scenes/SimulationScene.js';
import PauseScene from './scenes/PauseScene.js';
import GraphScene from './scenes/GraphScene.js';

export const gameConfig = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent: 'game-container',
    backgroundColor: UI_COLORS.background,

    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },

    scene: [
        TitleScene,           // Primera escena - Pantalla de título
        BootScene,
        PreloadScene,
        CinematicIntroScene,  // Intro cinematográfica - terminal + La Estructura
        CathedralScene,       // Catedral de Datos - puzzle del péndulo
        MapRevealScene,       // Revelación del mapa de los 9 reinos
        AetherHub,
        DialogScene,
        RealmScene,
        SimulationScene,
        PauseScene,
        GraphScene            // Grafo de conocimiento navegable
    ],

    render: {
        pixelArt: false,
        antialias: true,
        antialiasGL: true
    },

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};
