// ======================
// Spawn Manager
// Spawns food, obstacles, hazards, and platforms.
// Adapts hazard types based on current biome.
// ======================

import Phaser from 'phaser';
import { Food, FoodType } from '../entities/Food';
import { Obstacle, ObstacleType } from '../entities/Obstacle';
import { Platform } from '../entities/Platform';
import {
  GAME_WIDTH,
  GROUND_Y,
  FOOD_SPAWN_INTERVAL,
  OBSTACLE_SPAWN_INTERVAL,
  PLATFORM_SPAWN_INTERVAL,
  PLATFORM_Y_MIN,
  PLATFORM_Y_MAX,
  OBSTACLE_SPAWN_TABLE,
} from '../utils/constants';

export class SpawnManager {
  private scene: Phaser.Scene;
  private foodGroup: Phaser.Physics.Arcade.Group;
  private obstacleGroup: Phaser.Physics.Arcade.Group;
  private jumpableGroup: Phaser.Physics.Arcade.Group;
  private platformGroup: Phaser.Physics.Arcade.StaticGroup;

  private lastFoodTime = 0;
  private lastObstacleTime = 0;
  private lastPlatformTime = 0;

  constructor(
    scene: Phaser.Scene,
    foodGroup: Phaser.Physics.Arcade.Group,
    obstacleGroup: Phaser.Physics.Arcade.Group,
    jumpableGroup: Phaser.Physics.Arcade.Group,
    platformGroup: Phaser.Physics.Arcade.StaticGroup,
  ) {
    this.scene = scene;
    this.foodGroup = foodGroup;
    this.obstacleGroup = obstacleGroup;
    this.jumpableGroup = jumpableGroup;
    this.platformGroup = platformGroup;
  }

  update(time: number, scrollSpeed: number, distance: number): void {
    if (time - this.lastFoodTime > FOOD_SPAWN_INTERVAL) {
      this.spawnFood(scrollSpeed);
      this.lastFoodTime = time;
    }

    if (time - this.lastObstacleTime > OBSTACLE_SPAWN_INTERVAL) {
      this.spawnObstacle(scrollSpeed, distance);
      this.lastObstacleTime = time;
    }

    if (time - this.lastPlatformTime > PLATFORM_SPAWN_INTERVAL) {
      this.spawnPlatform(scrollSpeed);
      this.lastPlatformTime = time;
    }

    // Update velocities for moving objects
    this.foodGroup.setVelocityX(-scrollSpeed);
    this.obstacleGroup.getChildren().forEach((child) => {
      const obs = child as Obstacle;
      switch (obs.obstacleType) {
        case 'pterodactyl': obs.setVelocityX(-scrollSpeed * 1.2); break;
        case 'triceratops': obs.setVelocityX(-scrollSpeed * 1.5); break;
        case 'compy': obs.setVelocityX(-scrollSpeed * 1.3); break;
        case 'dimorphodon': obs.setVelocityX(-scrollSpeed * 1.4); break;
        case 'stegosaurus': obs.setVelocityX(-scrollSpeed * 0.8); break;
        case 'ankylosaurus': obs.setVelocityX(-scrollSpeed * 0.7); break;
        case 'parasaurolophus': obs.setVelocityX(-scrollSpeed * 1.1); break;
        case 'spear': obs.setVelocityX(-scrollSpeed * 1.8); break;
        case 'rock': break; // rock has its own velocity
        case 'venom': break; // venom has gravity-based arc
        default: obs.setVelocityX(-scrollSpeed); break;
      }
    });
    this.jumpableGroup.setVelocityX(-scrollSpeed);

    // Move platforms manually (they're static bodies so no velocity)
    this.platformGroup.getChildren().forEach((child) => {
      const plat = child as Platform;
      plat.x -= scrollSpeed * (this.scene.game.loop.delta / 1000);
      (plat.body as Phaser.Physics.Arcade.StaticBody).updateFromGameObject();
    });

    this.cleanup(scrollSpeed);
  }

  // ===== FOOD =====

  private spawnFood(scrollSpeed: number): void {
    const types: FoodType[] = ['bug', 'lizard', 'fish', 'egg'];
    const weights = [40, 30, 20, 10];
    const type = this.weightedPick(types, weights);

    const roll = Math.random();
    let y: number;
    if (roll < 0.5) {
      y = Phaser.Math.Between(GROUND_Y - 40, GROUND_Y - 12);
    } else if (roll < 0.8) {
      y = Phaser.Math.Between(GROUND_Y - 90, GROUND_Y - 50);
    } else {
      y = Phaser.Math.Between(GROUND_Y - 130, GROUND_Y - 90);
    }

    const food = new Food(this.scene, GAME_WIDTH + 40, y, type);
    food.setVelocityX(-scrollSpeed);
    this.foodGroup.add(food);
  }

  // ===== OBSTACLES =====

  private spawnObstacle(scrollSpeed: number, distance: number): void {
    const available = OBSTACLE_SPAWN_TABLE.filter(e => distance >= e.unlockDistance);
    const type = this.weightedPick(
      available.map(e => e.type),
      available.map(e => e.weight),
    );
    this.spawnByType(type, scrollSpeed);
  }

  private spawnByType(type: string, scrollSpeed: number): void {
    switch (type) {
      case 'log': this.spawnLog(scrollSpeed); break;
      case 'bench': this.spawnBench(scrollSpeed); break;
      case 'pterodactyl': this.spawnPterodactyl(scrollSpeed); break;
      case 'rock': this.spawnRock(scrollSpeed); break;
      case 'triceratops': this.spawnTriceratops(scrollSpeed); break;
      case 'trap': this.spawnHunterTrap(scrollSpeed); break;
      case 'spear': this.spawnSpear(scrollSpeed); break;
      case 'compy': this.spawnCompyPack(scrollSpeed); break;
      case 'dimorphodon': this.spawnDimorphodon(scrollSpeed); break;
      case 'stegosaurus': this.spawnStegosaurus(scrollSpeed); break;
      case 'dilophosaurus': this.spawnDilophosaurus(scrollSpeed); break;
      case 'ankylosaurus': this.spawnAnkylosaurus(scrollSpeed); break;
      case 'parasaurolophus': this.spawnParasaurolophus(scrollSpeed); break;
    }
  }

  private spawnLog(scrollSpeed: number): void {
    const obstacle = new Obstacle(this.scene, GAME_WIDTH + 40, GROUND_Y - 16, 'obstacle-log', 'log');
    obstacle.setVelocityX(-scrollSpeed);
    this.jumpableGroup.add(obstacle);
  }

  private spawnBench(scrollSpeed: number): void {
    const obstacle = new Obstacle(this.scene, GAME_WIDTH + 40, GROUND_Y - 22, 'obstacle-bench', 'bench');
    obstacle.setVelocityX(-scrollSpeed);
    this.jumpableGroup.add(obstacle);
  }

  private spawnPterodactyl(scrollSpeed: number): void {
    const y = Phaser.Math.Between(GROUND_Y - 190, GROUND_Y - 90);
    const obstacle = new Obstacle(this.scene, GAME_WIDTH + 60, y, 'hazard-pterodactyl', 'pterodactyl');
    obstacle.setFlipX(true);
    obstacle.setVelocityX(-scrollSpeed * 1.2);
    this.scene.tweens.add({
      targets: obstacle,
      y: y + 50,
      duration: 700 + Math.random() * 400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
    this.obstacleGroup.add(obstacle);
  }

  private spawnRock(scrollSpeed: number): void {
    const x = Phaser.Math.Between(Math.floor(GAME_WIDTH * 0.4), GAME_WIDTH + 20);
    const obstacle = new Obstacle(this.scene, x, -30, 'hazard-rock', 'rock');
    obstacle.setVelocity(-scrollSpeed * 0.2, 280);
    this.scene.tweens.add({
      targets: obstacle,
      angle: 360,
      duration: 1200,
      repeat: -1,
    });
    this.obstacleGroup.add(obstacle);
  }

  private spawnTriceratops(scrollSpeed: number): void {
    const texture = this.scene.textures.exists('triceratops-sprite')
      ? 'triceratops-sprite' : 'hazard-triceratops';
    const obstacle = new Obstacle(
      this.scene, GAME_WIDTH + 80, GROUND_Y - 32,
      texture, 'triceratops',
    );
    obstacle.setVelocityX(-scrollSpeed * 1.5);
    this.obstacleGroup.add(obstacle);
  }

  private spawnHunterTrap(scrollSpeed: number): void {
    const obstacle = new Obstacle(
      this.scene, GAME_WIDTH + 40, GROUND_Y - 10,
      'hazard-trap', 'trap',
    );
    obstacle.setVelocityX(-scrollSpeed);
    this.obstacleGroup.add(obstacle);
  }

  private spawnSpear(scrollSpeed: number): void {
    // Spears fly horizontally at head height
    const y = Phaser.Math.Between(GROUND_Y - 60, GROUND_Y - 30);
    const obstacle = new Obstacle(
      this.scene, GAME_WIDTH + 40, y,
      'hazard-spear', 'spear',
    );
    obstacle.setFlipX(true);
    obstacle.setVelocityX(-scrollSpeed * 1.8);
    this.obstacleGroup.add(obstacle);
  }

  private spawnCompyPack(scrollSpeed: number): void {
    const count = Phaser.Math.Between(3, 4);
    for (let i = 0; i < count; i++) {
      const xOffset = i * Phaser.Math.Between(18, 30);
      const y = Phaser.Math.Between(GROUND_Y - 28, GROUND_Y - 10);
      const compy = new Obstacle(
        this.scene, GAME_WIDTH + 40 + xOffset, y,
        'hazard-compy', 'compy',
      );
      compy.setFlipX(true);
      compy.setVelocityX(-scrollSpeed * 1.3);
      this.obstacleGroup.add(compy);
    }
  }

  private spawnDimorphodon(scrollSpeed: number): void {
    const startY = GROUND_Y - 220;
    const obstacle = new Obstacle(
      this.scene, GAME_WIDTH + 60, startY,
      'hazard-dimorphodon', 'dimorphodon',
    );
    obstacle.setFlipX(true);
    obstacle.setVelocityX(-scrollSpeed * 1.4);
    this.obstacleGroup.add(obstacle);

    // Dive toward ground, then swoop back up
    this.scene.tweens.add({
      targets: obstacle,
      y: GROUND_Y - 30,
      duration: 800,
      ease: 'Sine.easeIn',
      onComplete: () => {
        if (!obstacle.active) return;
        // Swoop back up
        this.scene.tweens.add({
          targets: obstacle,
          y: GROUND_Y - 250,
          duration: 600,
          ease: 'Sine.easeOut',
        });
      },
    });
  }

  private spawnStegosaurus(scrollSpeed: number): void {
    const texture = this.scene.textures.exists('stegosaurus-sprite')
      ? 'stegosaurus-sprite' : 'hazard-stegosaurus';
    const obstacle = new Obstacle(
      this.scene, GAME_WIDTH + 60, GROUND_Y - 36,
      texture, 'stegosaurus',
    );
    obstacle.setFlipX(true);
    obstacle.setVelocityX(-scrollSpeed * 0.8);
    this.obstacleGroup.add(obstacle);
  }

  private spawnDilophosaurus(scrollSpeed: number): void {
    const texture = this.scene.textures.exists('dilophosaurus-sprite')
      ? 'dilophosaurus-sprite' : 'hazard-dilophosaurus';
    const obstacle = new Obstacle(
      this.scene, GAME_WIDTH + 40, GROUND_Y - 35,
      texture, 'dilophosaurus',
    );
    obstacle.setVelocityX(-scrollSpeed);
    this.obstacleGroup.add(obstacle);

    // Spit 1-2 venom globs after a delay
    this.scene.time.delayedCall(600, () => {
      if (obstacle.active) {
        this.spawnVenom(obstacle.x - 10, obstacle.y - 20, scrollSpeed);
      }
    });
    this.scene.time.delayedCall(1000, () => {
      if (obstacle.active && Math.random() < 0.6) {
        this.spawnVenom(obstacle.x - 10, obstacle.y - 25, scrollSpeed);
      }
    });
  }

  private spawnVenom(x: number, y: number, scrollSpeed: number): void {
    const venom = new Obstacle(this.scene, x, y, 'hazard-venom', 'venom');
    venom.setVelocity(-scrollSpeed * 1.5, -200);
    this.obstacleGroup.add(venom);
    // Enable gravity AFTER adding to group (group default is allowGravity: false)
    (venom.body as Phaser.Physics.Arcade.Body).setAllowGravity(true);
  }

  private spawnAnkylosaurus(scrollSpeed: number): void {
    const obstacle = new Obstacle(
      this.scene, GAME_WIDTH + 60, GROUND_Y - 26,
      'hazard-ankylosaurus', 'ankylosaurus',
    );
    obstacle.setVelocityX(-scrollSpeed * 0.7);
    this.obstacleGroup.add(obstacle);
  }

  private spawnParasaurolophus(scrollSpeed: number): void {
    const obstacle = new Obstacle(
      this.scene, GAME_WIDTH + 60, GROUND_Y - 38,
      'hazard-parasaurolophus', 'parasaurolophus',
    );
    obstacle.setFlipX(true);
    obstacle.setVelocityX(-scrollSpeed * 1.1);
    this.obstacleGroup.add(obstacle);
  }

  // ===== PLATFORMS =====

  private spawnPlatform(scrollSpeed: number): void {
    if (Math.random() > 0.6) return; // Don't always spawn

    const y = Phaser.Math.Between(PLATFORM_Y_MIN, PLATFORM_Y_MAX);
    const platform = new Platform(this.scene, GAME_WIDTH + 80, y);
    this.platformGroup.add(platform);

    // Spawn food on top of the platform sometimes
    if (Math.random() < 0.7) {
      const types: FoodType[] = ['fish', 'egg'];
      const type = types[Math.floor(Math.random() * types.length)];
      const food = new Food(this.scene, GAME_WIDTH + 80, y - 20, type);
      food.setVelocityX(-scrollSpeed);
      this.foodGroup.add(food);
    }
  }

  // ===== CLEANUP =====

  private cleanup(_scrollSpeed: number): void {
    const destroyOffscreen = (group: Phaser.Physics.Arcade.Group | Phaser.Physics.Arcade.StaticGroup) => {
      group.getChildren().forEach((child) => {
        const sprite = child as Phaser.GameObjects.Sprite;
        if (sprite.x < -150 || sprite.y > GROUND_Y + 150) {
          sprite.destroy();
        }
      });
    };
    destroyOffscreen(this.foodGroup);
    destroyOffscreen(this.obstacleGroup);
    destroyOffscreen(this.jumpableGroup);
    destroyOffscreen(this.platformGroup);
  }

  private weightedPick<T>(items: T[], weights: number[]): T {
    const total = weights.reduce((sum, w) => sum + w, 0);
    let random = Math.random() * total;
    for (let i = 0; i < items.length; i++) {
      random -= weights[i];
      if (random <= 0) return items[i];
    }
    return items[items.length - 1];
  }
}
