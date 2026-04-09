// ======================
// Platform — Elevated surfaces the raptor can jump onto.
// Scrolls left with the world. Raptor can stand on top.
// ======================

import Phaser from 'phaser';
import { PLATFORM_WIDTH, PLATFORM_HEIGHT } from '../utils/constants';

export class Platform extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'platform');

    scene.add.existing(this);
    scene.physics.add.existing(this, true); // static = true for colliders

    const body = this.body as Phaser.Physics.Arcade.StaticBody;
    body.setSize(PLATFORM_WIDTH, PLATFORM_HEIGHT);
    body.immovable = true;

    this.setDisplaySize(PLATFORM_WIDTH, PLATFORM_HEIGHT);
    this.setDepth(3);
  }
}
