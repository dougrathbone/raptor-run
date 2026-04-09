// ======================
// HUD — Heads-Up Display
// Shows health hearts, distance, score, growth meter, and combo text
// on top of the game while you're playing.
// ======================

import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../utils/constants';

const HUD_DEPTH = 100;

export class HUD {
  private scene: Phaser.Scene;

  // UI elements
  private hearts: Phaser.GameObjects.Sprite[] = [];
  private distanceText: Phaser.GameObjects.Text;
  private scoreText: Phaser.GameObjects.Text;
  private growthBarGraphics: Phaser.GameObjects.Graphics;
  private growthLabel: Phaser.GameObjects.Text;
  private comboText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    // --- Distance counter (top center) ---
    this.distanceText = scene.add
      .text(GAME_WIDTH / 2, 16, '0 m', {
        fontSize: '26px',
        color: '#ffffff',
        fontFamily: 'Arial Black, Arial',
        stroke: '#000000',
        strokeThickness: 4,
      })
      .setOrigin(0.5, 0)
      .setDepth(HUD_DEPTH);

    // --- Score (top right) ---
    this.scoreText = scene.add
      .text(GAME_WIDTH - 16, 16, 'Score: 0', {
        fontSize: '20px',
        color: '#ffffff',
        fontFamily: 'Arial',
        stroke: '#000000',
        strokeThickness: 3,
      })
      .setOrigin(1, 0)
      .setDepth(HUD_DEPTH);

    // --- Growth meter (bottom left) ---
    this.growthLabel = scene.add
      .text(16, GAME_HEIGHT - 34, 'Growth:', {
        fontSize: '14px',
        color: '#ffffff',
        fontFamily: 'Arial',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setDepth(HUD_DEPTH);

    this.growthBarGraphics = scene.add.graphics().setDepth(HUD_DEPTH);

    // --- Combo text (flashes in center when you get a combo) ---
    this.comboText = scene.add
      .text(GAME_WIDTH / 2, 60, '', {
        fontSize: '30px',
        color: '#ffdd00',
        fontFamily: 'Arial Black, Arial',
        stroke: '#000000',
        strokeThickness: 4,
      })
      .setOrigin(0.5, 0)
      .setDepth(HUD_DEPTH)
      .setAlpha(0);
  }

  // --- Hearts ---

  createHearts(count: number): void {
    this.hearts.forEach((h) => h.destroy());
    this.hearts = [];

    for (let i = 0; i < count; i++) {
      const heart = this.scene.add
        .sprite(24 + i * 32, 24, 'heart')
        .setScale(1.4)
        .setDepth(HUD_DEPTH);
      this.hearts.push(heart);
    }
  }

  updateHearts(current: number, max: number): void {
    // Rebuild hearts if max HP changed (evolution!)
    if (this.hearts.length !== max) {
      this.createHearts(max);
    }
    for (let i = 0; i < this.hearts.length; i++) {
      this.hearts[i].setAlpha(i < current ? 1 : 0.25);
    }
  }

  // --- Distance ---

  updateDistance(meters: number): void {
    this.distanceText.setText(`${meters} m`);
  }

  // --- Score ---

  updateScore(score: number): void {
    this.scoreText.setText(`Score: ${score}`);
  }

  // --- Growth meter bar ---

  updateGrowthMeter(progress: number): void {
    const g = this.growthBarGraphics;
    g.clear();

    const barX = 80;
    const barY = GAME_HEIGHT - 30;
    const barW = 120;
    const barH = 14;

    // Background
    g.fillStyle(0x333333, 0.7);
    g.fillRoundedRect(barX, barY, barW, barH, 4);

    // Fill (green bar that grows as you eat)
    if (progress > 0) {
      const fillW = Math.max(4, (barW - 4) * Math.min(progress, 1));
      g.fillStyle(0x44ff44, 1);
      g.fillRoundedRect(barX + 2, barY + 2, fillW, barH - 4, 3);
    }

    // Border
    g.lineStyle(2, 0xffffff, 0.6);
    g.strokeRoundedRect(barX, barY, barW, barH, 4);
  }

  // --- Combo ---

  showCombo(multiplier: number): void {
    if (multiplier <= 1) return;

    this.comboText.setText(`x${multiplier} COMBO!`);
    this.comboText.setAlpha(1);
    this.comboText.setScale(1.2);

    this.scene.tweens.add({
      targets: this.comboText,
      alpha: 0,
      scaleX: 1,
      scaleY: 1,
      duration: 900,
      ease: 'Power2',
    });
  }
}
