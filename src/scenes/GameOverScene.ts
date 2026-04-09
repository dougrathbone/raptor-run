// ======================
// Game Over Scene — "EXTINCT!"
// Shows your stats and lets you try again or go to the menu.
// ======================

import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../utils/constants';

interface GameOverData {
  score: number;
  distance: number;
  foodEaten: number;
  highScore: number;
}

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  create(data: GameOverData): void {
    // Dark background
    this.add.rectangle(
      GAME_WIDTH / 2, GAME_HEIGHT / 2,
      GAME_WIDTH, GAME_HEIGHT,
      0x1a0a00, 0.85,
    );

    // --- EXTINCT! title ---
    const title = this.add
      .text(GAME_WIDTH / 2, 70, 'EXTINCT!', {
        fontSize: '60px',
        color: '#ff3333',
        fontFamily: 'Arial Black, Arial',
        stroke: '#000000',
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    // Dramatic shake on the title
    this.tweens.add({
      targets: title,
      x: GAME_WIDTH / 2 - 3,
      duration: 50,
      yoyo: true,
      repeat: 5,
    });

    // --- Fainted raptor ---
    const raptor = this.add
      .sprite(GAME_WIDTH / 2, 155, 'raptor-hatchling')
      .setScale(2)
      .setAngle(90)
      .setAlpha(0.8);

    // Blink the eyes (comedic faint)
    this.tweens.add({
      targets: raptor,
      alpha: 0.5,
      duration: 600,
      yoyo: true,
      repeat: -1,
    });

    // --- Stats ---
    const statsX = GAME_WIDTH / 2;
    const statsY = 220;
    const gap = 38;

    this.add
      .text(statsX, statsY, `Distance: ${data.distance} m`, {
        fontSize: '24px', color: '#ffffff', fontFamily: 'Arial',
      })
      .setOrigin(0.5);

    this.add
      .text(statsX, statsY + gap, `Food Eaten: ${data.foodEaten}`, {
        fontSize: '24px', color: '#ffffff', fontFamily: 'Arial',
      })
      .setOrigin(0.5);

    this.add
      .text(statsX, statsY + gap * 2, `Score: ${data.score}`, {
        fontSize: '30px', color: '#ffff00', fontFamily: 'Arial Black, Arial',
        stroke: '#000000', strokeThickness: 3,
      })
      .setOrigin(0.5);

    // High score message
    const isNewHighScore = data.score >= data.highScore && data.score > 0;
    const highScoreText = isNewHighScore
      ? 'NEW HIGH SCORE!'
      : `High Score: ${data.highScore}`;
    const highScoreColor = isNewHighScore ? '#ff9900' : '#aaaaaa';

    this.add
      .text(statsX, statsY + gap * 3, highScoreText, {
        fontSize: isNewHighScore ? '26px' : '20px',
        color: highScoreColor,
        fontFamily: 'Arial',
        stroke: '#000000',
        strokeThickness: isNewHighScore ? 3 : 0,
      })
      .setOrigin(0.5);

    // --- Action prompts ---
    const tryAgain = this.add
      .text(GAME_WIDTH / 2, 440, 'Press SPACE to Try Again', {
        fontSize: '26px',
        color: '#ffffff',
        fontFamily: 'Arial',
        stroke: '#000000',
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: tryAgain,
      alpha: 0.4,
      duration: 600,
      yoyo: true,
      repeat: -1,
    });

    this.add
      .text(GAME_WIDTH / 2, 490, 'Press M for Main Menu', {
        fontSize: '18px',
        color: '#aaaaaa',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5);

    // --- Input ---
    this.input.keyboard!.once('keydown-SPACE', () => {
      this.scene.start('GameScene');
    });

    this.input.keyboard!.once('keydown-M', () => {
      this.scene.start('TitleScene');
    });
  }
}
