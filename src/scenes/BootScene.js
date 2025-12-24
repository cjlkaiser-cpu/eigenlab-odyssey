/**
 * BootScene - Inicialización mínima del juego
 */

import Phaser from 'phaser';
import { UI_COLORS, REALM_COLORS } from '../core/constants.js';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    create() {
        // Mostrar texto de carga mínimo
        const { width, height } = this.cameras.main;

        this.add.text(width / 2, height / 2, 'EIGENLAB ODYSSEY', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '32px',
            color: '#a855f7'
        }).setOrigin(0.5).setAlpha(0.5);

        // Transición a PreloadScene
        this.time.delayedCall(500, () => {
            this.scene.start('PreloadScene');
        });
    }
}
