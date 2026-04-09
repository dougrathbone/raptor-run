// ======================
// Food — Yummy things for the raptor to eat!
// Each type gives different growth and score values.
// ======================

import Phaser from 'phaser';

export type FoodType = 'bug' | 'lizard' | 'fish' | 'egg';

export class Food extends Phaser.Physics.Arcade.Sprite {
  public foodType: FoodType;

  constructor(scene: Phaser.Scene, x: number, y: number, foodType: FoodType) {
    super(scene, x, y, `food-${foodType}`);
    this.foodType = foodType;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Food floats in the air — no gravity
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    // Make the hitbox a bit bigger so it's easier to collect
    body.setSize(this.width + 12, this.height + 12);
    body.setOffset(-6, -6);

    this.setDepth(5);

    // Gentle hover animation (not spinning — looks more natural)
    scene.tweens.add({
      targets: this,
      y: y - 4,
      duration: 600 + Math.random() * 300,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }
}
