/**
 * EigenLab Odyssey
 *
 * "En el principio fue el patrón. Y el patrón se hizo número.
 *  Y el número se hizo mundo."
 *
 * Una aventura épica a través de los reinos del conocimiento.
 */

import Phaser from 'phaser';
import { gameConfig } from './config.js';

// Crear instancia del juego
const game = new Phaser.Game(gameConfig);

// Exponer para debugging (remover en producción)
window.game = game;
