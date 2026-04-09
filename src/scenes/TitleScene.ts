// ======================
// Title Scene — The main menu
// ======================

import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../utils/constants';

export class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  create(): void {
    // --- Background ---
    // Gradient sky (darker at top)
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 4, GAME_WIDTH, GAME_HEIGHT / 2, 0x5a9aba);
    this.add.rectangle(GAME_WIDTH / 2, (GAME_HEIGHT * 3) / 4, GAME_WIDTH, GAME_HEIGHT / 2, 0x87ceeb);

    // Background hills for depth
    this.add.tileSprite(GAME_WIDTH / 2, GAME_HEIGHT - 130, GAME_WIDTH, 200, 'bg-hills-far');
    this.add.tileSprite(GAME_WIDTH / 2, GAME_HEIGHT - 90, GAME_WIDTH, 250, 'bg-hills-near');

    // Ground
    this.add.tileSprite(GAME_WIDTH / 2, GAME_HEIGHT - 38, GAME_WIDTH, 76, 'ground');

    // --- Dark overlay vignette for contrast ---
    const vignette = this.add.graphics();
    vignette.fillStyle(0x000000, 0.25);
    vignette.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // --- Title ---
    const title = this.add
      .text(GAME_WIDTH / 2, 90, 'RAPTOR RUN', {
        fontSize: '72px',
        color: '#e8dcc0',
        fontFamily: 'Arial Black, Arial',
        stroke: '#2a1a08',
        strokeThickness: 8,
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: title,
      y: 96,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // --- Subtitle ---
    this.add
      .text(GAME_WIDTH / 2, 168, 'A Prehistoric Adventure', {
        fontSize: '20px',
        color: '#c0b898',
        fontFamily: 'Arial',
        stroke: '#000000',
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    // --- Raptor on screen (use animated sprite if available) ---
    const useExternal = this.textures.exists('dino-idle');
    const raptorTexture = useExternal ? 'dino-idle' : 'raptor-adult';
    const raptorScale = useExternal ? 1.8 : 2.5;
    const raptor = this.add.sprite(GAME_WIDTH / 2, 300, raptorTexture).setScale(raptorScale);
    if (useExternal && this.anims.exists('dino-idle-anim')) {
      raptor.play('dino-idle-anim');
    } else {
      // Breathing idle for procedural textures
      this.tweens.add({
        targets: raptor,
        scaleY: raptorScale * 1.03,
        scaleX: raptorScale * 0.97,
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }

    // --- "Press SPACE to Start" ---
    const startText = this.add
      .text(GAME_WIDTH / 2, 430, '[ PRESS SPACE TO START ]', {
        fontSize: '24px',
        color: '#e8dcc0',
        fontFamily: 'Arial',
        stroke: '#000000',
        strokeThickness: 4,
        letterSpacing: 2,
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: startText,
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    // --- Controls ---
    this.add
      .text(GAME_WIDTH / 2, 478, 'JUMP: Space/W/Up   DUCK: S/Down   DASH: Shift   ROAR: F   PAUSE: Esc', {
        fontSize: '13px',
        color: '#8a8a7a',
        fontFamily: 'Arial',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    // --- Credits ---
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT - 16, 'Created by Will & Dad', {
        fontSize: '13px',
        color: '#6a6a5a',
        fontFamily: 'Arial',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    // --- Input ---
    this.input.keyboard!.once('keydown-SPACE', () => {
      this.scene.start('GameScene');
    });
  }
}
