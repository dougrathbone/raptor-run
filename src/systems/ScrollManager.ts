// ======================
// Scroll Manager
// Makes the world scroll, getting faster over time.
// Speed also increases with raptor growth stage.
// ======================

import { BASE_SCROLL_SPEED, MAX_SCROLL_SPEED, SPEED_INCREASE_RATE } from '../utils/constants';

export class ScrollManager {
  private speed: number = BASE_SCROLL_SPEED;
  private effectiveSpeed: number = BASE_SCROLL_SPEED;
  private backgrounds: Phaser.GameObjects.TileSprite[] = [];
  private scrollFactors: number[] = [];
  private ground: Phaser.GameObjects.TileSprite;

  constructor(ground: Phaser.GameObjects.TileSprite) {
    this.ground = ground;
  }

  addBackground(tileSprite: Phaser.GameObjects.TileSprite, factor: number): void {
    this.backgrounds.push(tileSprite);
    this.scrollFactors.push(factor);
  }

  /** Base scroll speed (without stage bonus) */
  getSpeed(): number {
    return this.speed;
  }

  /** Set the effective speed (base + stage bonus) from GameScene */
  setEffectiveSpeed(speed: number): void {
    this.effectiveSpeed = Math.min(speed, MAX_SCROLL_SPEED);
  }

  /** Get effective speed used for scrolling */
  getEffectiveSpeed(): number {
    return this.effectiveSpeed;
  }

  update(delta: number): void {
    // Increase base speed over time
    this.speed = Math.min(
      this.speed + SPEED_INCREASE_RATE * (delta / 1000),
      MAX_SCROLL_SPEED,
    );

    const pixels = this.effectiveSpeed * (delta / 1000);

    this.ground.tilePositionX += pixels;

    for (let i = 0; i < this.backgrounds.length; i++) {
      this.backgrounds[i].tilePositionX += pixels * this.scrollFactors[i];
    }
  }

  /** Swap textures when biome changes */
  setGroundTexture(key: string): void {
    this.ground.setTexture(key);
  }

  setBackgroundTextures(farKey: string, nearKey: string): void {
    if (this.backgrounds.length >= 2) {
      this.backgrounds[0].setTexture(farKey);
      this.backgrounds[1].setTexture(nearKey);
    }
  }
}
