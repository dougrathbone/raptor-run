// ======================
// Obstacle — Things that hurt the raptor!
// Logs on the ground, pterodactyls in the air, falling rocks.
// ======================

import Phaser from 'phaser';

export type ObstacleType = 'log' | 'bench' | 'pterodactyl' | 'rock' | 'triceratops' | 'trap' | 'spear'
  | 'stegosaurus' | 'ankylosaurus' | 'dilophosaurus' | 'compy' | 'dimorphodon' | 'venom';

export class Obstacle extends Phaser.Physics.Arcade.Sprite {
  public obstacleType: ObstacleType;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string = 'obstacle-log',
    type: ObstacleType = 'log',
  ) {
    super(scene, x, y, texture);
    this.obstacleType = type;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);

    this.setDepth(5);
  }
}
