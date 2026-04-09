import Phaser from 'phaser';
import {
  GROUND_Y,
  TREX_CHASE_DURATION,
  TREX_CHASE_SPEED_MULTIPLIER,
  TREX_CHASE_COOLDOWN,
  TREX_CHASE_CHANCE,
  TREX_WARNING_DURATION,
  TREX_EXIT_DURATION,
  TREX_CHASE_BONUS,
  TREX_UNLOCK_DISTANCE,
} from '../utils/constants';

type ChaseState = 'idle' | 'warning' | 'chasing' | 'exiting';

export class ChaseManager {
  private scene: Phaser.Scene;
  private state: ChaseState = 'idle';
  private trexSprite: Phaser.GameObjects.Sprite | null = null;
  private stateTimer = 0;
  private cooldownTimer = 0;
  private onSpeedMultiplier: (multiplier: number) => void;
  private onChaseEnd: (bonus: number) => void;

  constructor(
    scene: Phaser.Scene,
    onSpeedMultiplier: (multiplier: number) => void,
    onChaseEnd: (bonus: number) => void,
  ) {
    this.scene = scene;
    this.onSpeedMultiplier = onSpeedMultiplier;
    this.onChaseEnd = onChaseEnd;
  }

  get isChasing(): boolean {
    return this.state === 'chasing';
  }

  get isActive(): boolean {
    return this.state !== 'idle';
  }

  get speedMultiplier(): number {
    return this.state === 'chasing' ? TREX_CHASE_SPEED_MULTIPLIER : 1;
  }

  /** Called periodically. Returns true if chase triggered. */
  tryTrigger(distance: number): boolean {
    if (this.state !== 'idle') return false;
    if (this.cooldownTimer > 0) return false;
    if (distance < TREX_UNLOCK_DISTANCE) return false;
    if (Math.random() > TREX_CHASE_CHANCE) return false;

    this.startWarning();
    return true;
  }

  update(delta: number): void {
    if (this.cooldownTimer > 0) {
      this.cooldownTimer -= delta;
    }

    if (this.state === 'idle') return;

    this.stateTimer -= delta;

    switch (this.state) {
      case 'warning':
        this.updateWarning();
        break;
      case 'chasing':
        this.updateChase();
        break;
      case 'exiting':
        this.updateExit();
        break;
    }
  }

  cleanup(): void {
    if (this.trexSprite) {
      this.trexSprite.destroy();
      this.trexSprite = null;
    }
    this.state = 'idle';
  }

  private startWarning(): void {
    this.state = 'warning';
    this.stateTimer = TREX_WARNING_DURATION;
  }

  private startChase(): void {
    this.state = 'chasing';
    this.stateTimer = TREX_CHASE_DURATION;

    // Create T-Rex sprite off-screen left
    this.trexSprite = this.scene.add.sprite(-160, GROUND_Y - 60, 'hazard-trex');
    this.trexSprite.setDepth(8);

    // Slide in from the left
    this.scene.tweens.add({
      targets: this.trexSprite,
      x: 90,
      duration: 1200,
      ease: 'Power2',
    });

    // Screen tint — darken + redden
    this.scene.cameras.main.setBackgroundColor(0x6a2a1a);

    // Speed up
    this.onSpeedMultiplier(TREX_CHASE_SPEED_MULTIPLIER);
  }

  private startExit(): void {
    this.state = 'exiting';
    this.stateTimer = TREX_EXIT_DURATION;

    // Speed back to normal
    this.onSpeedMultiplier(1);

    // T-Rex slows and falls behind
    if (this.trexSprite) {
      this.scene.tweens.add({
        targets: this.trexSprite,
        x: -200,
        alpha: 0,
        duration: TREX_EXIT_DURATION,
        ease: 'Power2',
      });
    }
  }

  private endChase(): void {
    if (this.trexSprite) {
      this.trexSprite.destroy();
      this.trexSprite = null;
    }
    this.state = 'idle';
    this.cooldownTimer = TREX_CHASE_COOLDOWN;

    this.onChaseEnd(TREX_CHASE_BONUS);
  }

  private updateWarning(): void {
    const progress = 1 - this.stateTimer / TREX_WARNING_DURATION;
    const intensity = 0.002 + progress * 0.008;
    this.scene.cameras.main.shake(100, intensity);

    if (this.stateTimer <= 0) {
      this.startChase();
    }
  }

  private updateChase(): void {
    this.scene.cameras.main.shake(50, 0.003);

    if (this.stateTimer <= 0) {
      this.startExit();
    }
  }

  private updateExit(): void {
    if (this.stateTimer <= 0) {
      this.endChase();
    }
  }
}
