// ======================
// Pause Scene
// Shows a dark overlay with Resume / Restart options.
// Runs on top of the paused GameScene.
// ======================

import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../utils/constants';

export class PauseScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PauseScene' });
  }

  create(): void {
    // Dark overlay
    this.add.rectangle(
      GAME_WIDTH / 2, GAME_HEIGHT / 2,
      GAME_WIDTH, GAME_HEIGHT,
      0x000000, 0.6,
    );

    // PAUSED title
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 60, 'PAUSED', {
        fontSize: '52px',
        color: '#ffffff',
        fontFamily: 'Arial Black, Arial',
        stroke: '#000000',
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    // Options
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20, 'Press ESC to Resume', {
        fontSize: '24px',
        color: '#cccccc',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 60, 'Press R to Restart', {
        fontSize: '24px',
        color: '#cccccc',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 100, 'Press M for Main Menu', {
        fontSize: '20px',
        color: '#999999',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5);

    // --- Input handlers ---
    this.input.keyboard!.once('keydown-ESC', () => {
      this.scene.resume('GameScene');
      this.scene.stop();
    });

    this.input.keyboard!.once('keydown-R', () => {
      this.scene.stop('GameScene');
      this.scene.stop();
      this.scene.start('GameScene');
    });

    this.input.keyboard!.once('keydown-M', () => {
      this.scene.stop('GameScene');
      this.scene.stop();
      this.scene.start('TitleScene');
    });
  }
}
