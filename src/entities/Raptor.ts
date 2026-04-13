// ======================
// The Raptor — Our hero!
// Grows through 3 stages: Hatchling → Juvenile → Adult.
// Can jump, double-jump, duck, dash (Juvenile+), and roar (Adult).
// ======================

import Phaser from 'phaser';
import {
  JUMP_VELOCITY,
  STAGES,
  INVINCIBLE_DURATION,
  DASH_DURATION,
  DASH_COOLDOWN,
  ROAR_COOLDOWN,
  STAGE_SPEED_BONUS,
} from '../utils/constants';

export type RaptorStage = 'hatchling' | 'juvenile' | 'adult';

const STAGE_CONFIG: Record<RaptorStage, typeof STAGES.HATCHLING> = {
  hatchling: STAGES.HATCHLING,
  juvenile: STAGES.JUVENILE,
  adult: STAGES.ADULT,
};

const STAGE_ORDER: RaptorStage[] = ['hatchling', 'juvenile', 'adult'];

export class Raptor extends Phaser.Physics.Arcade.Sprite {
  public stage: RaptorStage = 'hatchling';
  public hp: number;
  public maxHp: number;

  private jumpCount = 0;
  private maxJumps = 2;
  private invincibleTimer = 0;
  private _isDashing = false;
  private _isDucking = false;
  private dashCooldownTimer = 0;
  private roarCooldownTimer = 0;

  // Store the normal body dimensions for un-ducking
  private normalBodyWidth: number;
  private normalBodyHeight: number;

  // Scale per stage so the dino sprite grows visually
  private static STAGE_SCALE: Record<RaptorStage, number> = {
    hatchling: 0.45,
    juvenile: 0.6,
    adult: 0.8,
  };

  constructor(scene: Phaser.Scene, x: number, y: number) {
    // Use external sprite sheet if available, fall back to Canvas2D texture
    const useExternal = scene.textures.exists('dino-idle');
    const texture = useExternal ? 'dino-idle' : STAGES.HATCHLING.texture;
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    body.setSize(STAGES.HATCHLING.bodyWidth, STAGES.HATCHLING.bodyHeight);

    this.normalBodyWidth = STAGES.HATCHLING.bodyWidth;
    this.normalBodyHeight = STAGES.HATCHLING.bodyHeight;

    this.hp = STAGES.HATCHLING.hp;
    this.maxHp = STAGES.HATCHLING.hp;

    this.setDepth(10);

    // Start the run animation if using external sprites
    if (useExternal) {
      this.setScale(Raptor.STAGE_SCALE.hatchling);
      this.play('dino-run-anim');
    }
  }

  // --- Speed bonus from current stage ---
  get speedBonus(): number {
    return STAGE_SPEED_BONUS[this.stage] ?? 0;
  }

  // --- Jumping ---
  jump(): boolean {
    // Can't jump while ducking
    if (this._isDucking) {
      this.standUp();
    }

    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body.blocked.down) {
      this.jumpCount = 0;
    }
    if (this.jumpCount < this.maxJumps) {
      this.setVelocityY(JUMP_VELOCITY);
      this.jumpCount++;
      return true;
    }
    return false;
  }

  // --- Ducking / Crouching ---

  duck(): void {
    if (this._isDucking) return;
    const body = this.body as Phaser.Physics.Arcade.Body;
    // Only duck on the ground
    if (!body.blocked.down) return;

    this._isDucking = true;
    const cfg = STAGE_CONFIG[this.stage];
    const base = this.getBaseScale();

    // Anchor at bottom so the squish keeps feet on the ground
    const bottomY = this.y + this.displayHeight * 0.5;
    this.setOrigin(0.5, 1);
    this.y = bottomY;

    // Flatten the sprite visually
    this.setScale(base, base * 0.55);

    // Resize physics body and align to bottom
    body.setSize(cfg.bodyWidth + 6, cfg.crouchHeight);
    body.setOffset(
      (this.width - (cfg.bodyWidth + 6)) / 2,
      this.height - cfg.crouchHeight,
    );
  }

  standUp(): void {
    if (!this._isDucking) return;
    this._isDucking = false;
    const cfg = STAGE_CONFIG[this.stage];
    const body = this.body as Phaser.Physics.Arcade.Body;
    const base = this.getBaseScale();

    // Restore scale first
    this.setScale(base);

    // Switch back to center origin
    const bottomY = this.y;
    this.setOrigin(0.5, 0.5);
    this.y = bottomY - this.displayHeight * 0.5;

    body.setSize(cfg.bodyWidth, cfg.bodyHeight);
    body.setOffset(
      (this.width - cfg.bodyWidth) / 2,
      (this.height - cfg.bodyHeight) / 2,
    );
  }

  get isDucking(): boolean {
    return this._isDucking;
  }

  // --- Taking damage ---
  takeDamage(): boolean {
    if (this.invincibleTimer > 0 || this._isDashing) return false;

    this.hp -= 4; // 1 full heart = 4 quarter-heart units
    this.invincibleTimer = INVINCIBLE_DURATION;

    this.scene.tweens.add({
      targets: this,
      alpha: 0.3,
      duration: 100,
      yoyo: true,
      repeat: 7,
    });

    return this.hp <= 0;
  }

  // --- Eating food ---
  eat(): void {
    const baseScale = this.getBaseScale();
    this.scene.tweens.add({
      targets: this,
      scaleX: baseScale * 1.15,
      scaleY: this._isDucking ? baseScale * 0.65 : baseScale * 1.15,
      duration: 80,
      yoyo: true,
    });
  }

  /** Get the target scale for the current stage (external sprites scale with growth) */
  private getBaseScale(): number {
    const useExternal = this.scene.textures.exists('dino-idle');
    return useExternal ? Raptor.STAGE_SCALE[this.stage] : 1;
  }

  // --- Evolving to the next stage ---
  evolve(): boolean {
    const currentIndex = STAGE_ORDER.indexOf(this.stage);
    if (currentIndex >= STAGE_ORDER.length - 1) return false; // Already at max

    const nextStage = STAGE_ORDER[currentIndex + 1];
    this.stage = nextStage;
    const cfg = STAGE_CONFIG[nextStage];

    // Use external sprite if available, else fall back to Canvas2D texture
    const useExternal = this.scene.textures.exists('dino-idle');
    if (!useExternal) {
      this.setTexture(cfg.texture);
    }
    // Scale the sprite to match the new growth stage
    const targetScale = useExternal ? Raptor.STAGE_SCALE[nextStage] : 1;

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(cfg.bodyWidth, cfg.bodyHeight);
    this.normalBodyWidth = cfg.bodyWidth;
    this.normalBodyHeight = cfg.bodyHeight;

    // Full heal on evolution
    this.maxHp = cfg.hp;
    this.hp = cfg.hp;

    // Triumphant scale-up, then settle to new stage scale
    this.scene.tweens.add({
      targets: this,
      scaleX: targetScale * 1.5,
      scaleY: targetScale * 1.5,
      duration: 300,
      yoyo: true,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.setScale(targetScale);
        if (useExternal) this.play('dino-run-anim');
      },
    });

    return true;
  }

  /** Can the raptor evolve further? */
  get canEvolve(): boolean {
    return STAGE_ORDER.indexOf(this.stage) < STAGE_ORDER.length - 1;
  }

  // --- Dash ability (Juvenile or Adult) ---
  private startX = 0;

  dash(): boolean {
    if (this.stage === 'hatchling') return false;
    if (this._isDashing || this.dashCooldownTimer > 0) return false;
    if (this._isDucking) this.standUp();

    this._isDashing = true;
    this.startX = this.x;
    this.setTint(0xffff44);

    // Lunge forward
    this.scene.tweens.add({
      targets: this,
      x: this.x + 150,
      duration: DASH_DURATION * 0.4,
      ease: 'Power2',
    });

    this.scene.time.delayedCall(DASH_DURATION, () => {
      this._isDashing = false;
      this.clearTint();
      this.dashCooldownTimer = DASH_COOLDOWN;
      // Return to normal position
      this.scene.tweens.add({
        targets: this,
        x: this.startX,
        duration: 200,
        ease: 'Power2',
      });
    });

    return true;
  }

  get isDashing(): boolean {
    return this._isDashing;
  }

  get dashReady(): boolean {
    return this.stage !== 'hatchling' && !this._isDashing && this.dashCooldownTimer <= 0;
  }

  // --- Roar ability (Adult only) ---
  roar(): boolean {
    if (this.stage !== 'adult') return false;
    if (this.roarCooldownTimer > 0) return false;

    this.roarCooldownTimer = ROAR_COOLDOWN;

    // Visual: brief red tint + scale pulse
    this.setTint(0xff6644);
    this.scene.tweens.add({
      targets: this,
      scaleX: 1.3,
      scaleY: 1.3,
      duration: 150,
      yoyo: true,
      onComplete: () => {
        this.clearTint();
      },
    });

    return true;
  }

  get roarReady(): boolean {
    return this.stage === 'adult' && this.roarCooldownTimer <= 0;
  }

  // --- Called every frame ---
  update(_time: number, delta: number): void {
    // Invincibility timer
    if (this.invincibleTimer > 0) {
      this.invincibleTimer -= delta;
      if (this.invincibleTimer <= 0) {
        this.invincibleTimer = 0;
        this.setAlpha(1);
      }
    }

    // Dash cooldown
    if (this.dashCooldownTimer > 0) {
      this.dashCooldownTimer -= delta;
    }

    // Roar cooldown
    if (this.roarCooldownTimer > 0) {
      this.roarCooldownTimer -= delta;
    }

    // Reset jump count on ground
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body.blocked.down) {
      this.jumpCount = 0;
    }

    // Auto-stand when leaving the ground (jumped while ducking shouldn't stay ducked)
    if (this._isDucking && !body.blocked.down) {
      this.standUp();
    }
  }
}
