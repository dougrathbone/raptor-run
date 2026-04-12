// ======================
// Game Scene — Where all the action happens!
// The raptor runs, jumps, ducks, eats food, dodges obstacles,
// and grows through 3 stages: Hatchling → Juvenile → Adult.
// ======================

import Phaser from 'phaser';
import { Raptor } from '../entities/Raptor';
import { Food } from '../entities/Food';
import { Obstacle } from '../entities/Obstacle';
import { ScrollManager } from '../systems/ScrollManager';
import { SpawnManager } from '../systems/SpawnManager';
import { GrowthSystem } from '../systems/GrowthSystem';
import { ScoreManager } from '../systems/ScoreManager';
import { BiomeManager } from '../systems/BiomeManager';
import { ChaseManager } from '../systems/ChaseManager';
import { HUD } from '../ui/HUD';
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  GROUND_Y,
  ROAR_STUN_RADIUS,
  BiomeConfig,
} from '../utils/constants';

export class GameScene extends Phaser.Scene {
  private raptor!: Raptor;

  private scrollManager!: ScrollManager;
  private spawnManager!: SpawnManager;
  private growthSystem!: GrowthSystem;
  private scoreManager!: ScoreManager;
  private biomeManager!: BiomeManager;
  private hud!: HUD;
  private chaseManager!: ChaseManager;
  private chaseSpeedMultiplier = 1;
  private lastChaseCheckTime = 0;

  private foodGroup!: Phaser.Physics.Arcade.Group;
  private obstacleGroup!: Phaser.Physics.Arcade.Group;
  private jumpableGroup!: Phaser.Physics.Arcade.Group;
  private platformGroup!: Phaser.Physics.Arcade.StaticGroup;

  private groundSprite!: Phaser.GameObjects.TileSprite;
  private hillsFar!: Phaser.GameObjects.TileSprite;
  private hillsNear!: Phaser.GameObjects.TileSprite;

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private jumpKey!: Phaser.Input.Keyboard.Key;
  private duckKey!: Phaser.Input.Keyboard.Key;
  private dashKey!: Phaser.Input.Keyboard.Key;
  private roarKey!: Phaser.Input.Keyboard.Key;
  private roarKeyAlt!: Phaser.Input.Keyboard.Key;
  private pauseKey!: Phaser.Input.Keyboard.Key;

  private isGameOver = false;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    this.isGameOver = false;

    // Physics world bounds (ground level)
    this.physics.world.setBounds(0, 0, GAME_WIDTH, GROUND_Y);

    // Background + ground
    this.createBackground();

    // Raptor
    this.raptor = new Raptor(this, 120, GROUND_Y - 40);

    // Physics groups
    this.foodGroup = this.physics.add.group({ allowGravity: false });
    this.obstacleGroup = this.physics.add.group({ allowGravity: false });
    this.jumpableGroup = this.physics.add.group({ allowGravity: false });
    this.platformGroup = this.physics.add.staticGroup();

    // Systems
    this.scrollManager = new ScrollManager(this.groundSprite);
    this.scrollManager.addBackground(this.hillsFar, 0.15);
    this.scrollManager.addBackground(this.hillsNear, 0.4);

    this.scoreManager = new ScoreManager();
    this.biomeManager = new BiomeManager((biome) => this.onBiomeTransition(biome));
    this.growthSystem = new GrowthSystem(() => this.onRaptorEvolve());
    this.spawnManager = new SpawnManager(
      this, this.foodGroup, this.obstacleGroup, this.jumpableGroup, this.platformGroup,
    );

    this.chaseManager = new ChaseManager(
      this,
      (multiplier) => { this.chaseSpeedMultiplier = multiplier; },
      (bonus) => {
        this.scoreManager.addChaseBonus(bonus);
        this.showFloatingText(`ESCAPED! +${bonus}`, GAME_WIDTH / 2, GAME_HEIGHT / 2, '#44ff44', 36);
        // Restore biome background color
        const biome = this.biomeManager.getCurrentBiome();
        this.cameras.main.setBackgroundColor(biome.bgColor);
      },
    );

    // HUD
    this.hud = new HUD(this);
    this.hud.createHearts(this.raptor.maxHp);

    // Collisions
    this.physics.add.overlap(
      this.raptor, this.foodGroup,
      this.onCollectFood as any, undefined, this,
    );
    this.physics.add.overlap(
      this.raptor, this.obstacleGroup,
      this.onHitObstacle as any, undefined, this,
    );

    // Jumpable obstacles (logs, benches) — one-way platform from above, damage from sides
    this.physics.add.collider(
      this.raptor, this.jumpableGroup, undefined,
      (_raptor, _obstacle) => {
        const rb = (_raptor as Phaser.Types.Physics.Arcade.GameObjectWithBody).body as Phaser.Physics.Arcade.Body;
        const ob = (_obstacle as Phaser.Types.Physics.Arcade.GameObjectWithBody).body as Phaser.Physics.Arcade.Body;
        // Only collide when raptor is falling/standing and feet are above obstacle top
        return rb.velocity.y >= 0 && rb.bottom <= ob.top + 10;
      },
      this,
    );
    this.physics.add.overlap(
      this.raptor, this.jumpableGroup,
      this.onHitObstacle as any,
      (_raptor, _obstacle) => {
        const rb = (_raptor as Phaser.Types.Physics.Arcade.GameObjectWithBody).body as Phaser.Physics.Arcade.Body;
        const ob = (_obstacle as Phaser.Types.Physics.Arcade.GameObjectWithBody).body as Phaser.Physics.Arcade.Body;
        // Only deal damage when NOT landing on top
        return !(rb.velocity.y >= 0 && rb.bottom <= ob.top + 10);
      },
      this,
    );

    // Platform collision — raptor can stand on platforms
    this.physics.add.collider(this.raptor, this.platformGroup);

    // Input
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.jumpKey = this.input.keyboard!.addKey('W');
    this.duckKey = this.input.keyboard!.addKey('S');
    this.dashKey = this.input.keyboard!.addKey('SHIFT');
    this.roarKey = this.input.keyboard!.addKey('F');
    this.roarKeyAlt = this.input.keyboard!.addKey('ENTER');
    this.pauseKey = this.input.keyboard!.addKey('ESC');
  }

  // ===== UPDATE =====

  update(time: number, delta: number): void {
    if (this.isGameOver) return;

    this.handleInput();
    this.raptor.update(time, delta);

    // Scroll speed includes stage bonus and chase multiplier
    const baseSpeed = this.scrollManager.getSpeed() + this.raptor.speedBonus;
    const effectiveSpeed = baseSpeed * this.chaseSpeedMultiplier;
    this.scrollManager.setEffectiveSpeed(effectiveSpeed);
    this.scrollManager.update(delta);

    this.spawnManager.update(time, effectiveSpeed, this.scoreManager.getDistance());
    this.scoreManager.updateDistance(delta, effectiveSpeed);

    this.chaseManager.update(delta);

    // T-Rex chase check — only roll once per obstacle spawn interval (~1800ms)
    if (!this.chaseManager.isActive && time - this.lastChaseCheckTime > 1800) {
      this.lastChaseCheckTime = time;
      this.chaseManager.tryTrigger(this.scoreManager.getDistance());
    }

    // Check for biome transitions based on distance traveled
    this.biomeManager.update(this.scoreManager.getDistance());

    // HUD updates
    this.hud.updateHearts(this.raptor.hp, this.raptor.maxHp);
    this.hud.updateDistance(this.scoreManager.getDistance());
    this.hud.updateScore(this.scoreManager.getScore());
    this.hud.updateGrowthMeter(this.growthSystem.getProgress());
  }

  // ===== INPUT =====

  private handleInput(): void {
    // Jump
    const jumpPressed =
      Phaser.Input.Keyboard.JustDown(this.cursors.space!) ||
      Phaser.Input.Keyboard.JustDown(this.cursors.up!) ||
      Phaser.Input.Keyboard.JustDown(this.jumpKey);
    if (jumpPressed) {
      this.raptor.jump();
    }

    // Duck (hold down arrow or S)
    const duckHeld = this.cursors.down!.isDown || this.duckKey.isDown;
    if (duckHeld) {
      this.raptor.duck();
    } else if (this.raptor.isDucking) {
      this.raptor.standUp();
    }

    // Dash
    if (Phaser.Input.Keyboard.JustDown(this.dashKey)) {
      this.raptor.dash();
    }

    // Roar (Adult only)
    if (Phaser.Input.Keyboard.JustDown(this.roarKey) || Phaser.Input.Keyboard.JustDown(this.roarKeyAlt)) {
      if (this.raptor.roar()) {
        this.performRoar();
      }
    }

    // Pause
    if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
      this.scene.pause();
      this.scene.launch('PauseScene');
    }
  }

  // ===== ROAR ABILITY =====

  private performRoar(): void {
    // Create a visual shockwave
    const wave = this.add.circle(this.raptor.x, this.raptor.y, 10, 0xffaa44, 0.4);
    wave.setDepth(200);
    this.tweens.add({
      targets: wave,
      scaleX: 8,
      scaleY: 8,
      alpha: 0,
      duration: 500,
      onComplete: () => wave.destroy(),
    });

    // Camera shake
    this.cameras.main.shake(200, 0.008);

    // Show text
    this.showFloatingText('ROAR!', this.raptor.x, this.raptor.y - 60, '#ff6644', 36);

    // Stun/destroy nearby obstacles (including jumpable ones)
    const allObstacles = [
      ...this.obstacleGroup.getChildren(),
      ...this.jumpableGroup.getChildren(),
    ];
    allObstacles.forEach((child) => {
      const obs = child as Obstacle;
      const dist = Phaser.Math.Distance.Between(
        this.raptor.x, this.raptor.y, obs.x, obs.y,
      );
      if (dist < ROAR_STUN_RADIUS) {
        // Ankylosaurus is armored — immune to roar
        if (obs.obstacleType === 'ankylosaurus') {
          // Deflect effect: brief white flash + "CLANG" text
          obs.setTint(0xffffff);
          this.time.delayedCall(150, () => {
            if (obs.active) obs.clearTint();
          });
          this.showFloatingText('CLANG!', obs.x, obs.y - 20, '#aaaaaa', 18);
          return;
        }

        // Flash and destroy
        this.tweens.add({
          targets: obs,
          alpha: 0,
          scaleX: 1.5,
          scaleY: 1.5,
          duration: 300,
          onComplete: () => obs.destroy(),
        });

        // Score bonus for each destroyed obstacle
        this.scoreManager.addFoodScore('egg', this.time.now);
      }
    });
  }

  // ===== COLLISION CALLBACKS =====

  private onCollectFood(_raptor: any, foodObj: any): void {
    const food = foodObj as Food;
    const points = this.scoreManager.addFoodScore(food.foodType, this.time.now);
    this.growthSystem.addGrowth(food.foodType);
    this.raptor.eat();
    this.hud.showCombo(this.scoreManager.getComboMultiplier());
    this.showFloatingText(`+${points}`, food.x, food.y);

    // Adult stage: eating food regenerates a quarter heart
    if (this.raptor.stage === 'adult' && this.raptor.hp < this.raptor.maxHp) {
      this.raptor.hp = Math.min(this.raptor.hp + 1, this.raptor.maxHp);
      this.showFloatingText('+HP', food.x, food.y - 20, '#44ff44', 16);
    }

    food.destroy();
  }

  private onHitObstacle(_raptor: any, _obstacle: any): void {
    const isDead = this.raptor.takeDamage();
    if (isDead) {
      this.gameOver();
    }
  }

  // ===== EVOLUTION =====

  private onRaptorEvolve(): void {
    this.raptor.evolve();
    this.scoreManager.addGrowthBonus();

    const stageName = this.raptor.stage.toUpperCase();
    this.showFloatingText(
      `EVOLVED TO ${stageName}!`,
      this.raptor.x, this.raptor.y - 60, '#ffff00', 32,
    );

    this.cameras.main.flash(400, 255, 255, 100);

    // Show ability unlock text
    if (this.raptor.stage === 'juvenile') {
      this.time.delayedCall(600, () => {
        this.showFloatingText('DASH unlocked! (SHIFT)', GAME_WIDTH / 2, GAME_HEIGHT / 2, '#44ddff', 24);
      });
    } else if (this.raptor.stage === 'adult') {
      this.time.delayedCall(600, () => {
        this.showFloatingText('ROAR unlocked! (F)', GAME_WIDTH / 2, GAME_HEIGHT / 2, '#ff8844', 24);
      });
    }
  }

  // ===== BIOME TRANSITION =====

  private onBiomeTransition(biome: BiomeConfig): void {
    // Swap tileSprite textures to the new biome
    this.groundSprite.setTexture(biome.ground);
    this.hillsFar.setTexture(biome.hillsFar);
    this.hillsNear.setTexture(biome.hillsNear);

    // Change camera background color
    this.cameras.main.setBackgroundColor(biome.bgColor);

    // Show biome name as floating text
    this.showFloatingText(
      biome.name, GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40, '#ffffff', 42,
    );

    // Brief screen flash for transition effect
    this.cameras.main.flash(600, 255, 255, 255);
  }

  // ===== GAME OVER =====

  private gameOver(): void {
    this.isGameOver = true;
    this.raptor.setVelocity(0, 0);
    // Play death animation using external sprite if available
    if (this.textures.exists('dino-dead')) {
      this.raptor.clearTint();
      this.raptor.play('dino-dead-anim');
    } else {
      this.raptor.setTint(0xff4444);
    }
    this.scoreManager.saveHighScore();

    this.chaseManager.cleanup();

    this.time.delayedCall(600, () => {
      this.scene.start('GameOverScene', {
        score: this.scoreManager.getScore(),
        distance: this.scoreManager.getDistance(),
        foodEaten: this.scoreManager.getFoodEaten(),
        highScore: this.scoreManager.getHighScore(),
      });
    });
  }

  // ===== HELPERS =====

  private createBackground(): void {
    // Set initial background color (Jungle biome)
    this.cameras.main.setBackgroundColor(0x87ceeb);

    this.hillsFar = this.add
      .tileSprite(GAME_WIDTH / 2, GROUND_Y - 80, GAME_WIDTH, 200, 'bg-hills-far')
      .setDepth(0);
    this.hillsNear = this.add
      .tileSprite(GAME_WIDTH / 2, GROUND_Y - 50, GAME_WIDTH, 250, 'bg-hills-near')
      .setDepth(1);
    this.groundSprite = this.add
      .tileSprite(GAME_WIDTH / 2, GROUND_Y + 38, GAME_WIDTH, 76, 'ground')
      .setDepth(2);
  }

  private showFloatingText(
    text: string, x: number, y: number, color = '#ffffff', size = 22,
  ): void {
    const floatText = this.add
      .text(x, y, text, {
        fontSize: `${size}px`,
        color,
        fontFamily: 'Arial Black, Arial',
        stroke: '#000000',
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setDepth(200);

    this.tweens.add({
      targets: floatText,
      y: y - 60,
      alpha: 0,
      duration: 900,
      ease: 'Power2',
      onComplete: () => floatText.destroy(),
    });
  }
}
