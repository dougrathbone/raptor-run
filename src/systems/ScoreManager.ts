// ======================
// Score Manager
// Tracks distance, score, food eaten, and combos.
// Also handles high score saving/loading.
// ======================

import {
  FOOD_SCORES,
  GROWTH_BONUS,
  COMBO_TIMEOUT,
  COMBO_MAX_MULTIPLIER,
} from '../utils/constants';
import { FoodType } from '../entities/Food';
import { getHighScore, setHighScore } from '../utils/storage';

export class ScoreManager {
  private score = 0;
  private distance = 0;
  private foodEaten = 0;
  private comboCount = 0;
  private comboMultiplier = 1;
  private lastEatTime = 0;

  /** Add score for eating food. Returns the points earned (including combo). */
  addFoodScore(foodType: FoodType, time: number): number {
    this.foodEaten++;

    // Combo system: eat quickly to multiply your score!
    if (time - this.lastEatTime < COMBO_TIMEOUT && this.lastEatTime > 0) {
      this.comboCount++;
      this.comboMultiplier = Math.min(
        1 + Math.floor(this.comboCount / 3),
        COMBO_MAX_MULTIPLIER,
      );
    } else {
      this.comboCount = 0;
      this.comboMultiplier = 1;
    }
    this.lastEatTime = time;

    const points = (FOOD_SCORES[foodType] ?? 10) * this.comboMultiplier;
    this.score += points;
    return points;
  }

  /** Bonus points for evolving */
  addGrowthBonus(): void {
    this.score += GROWTH_BONUS;
  }

  /** Called every frame to track how far the raptor has run */
  updateDistance(delta: number, speed: number): void {
    // Convert pixels to "meters" (10 pixels = 1 meter for nice numbers)
    const meters = (speed * delta) / 1000 / 10;
    this.distance += meters;
    // 1 point per meter run
    this.score += meters;
  }

  getScore(): number {
    return Math.floor(this.score);
  }

  getDistance(): number {
    return Math.floor(this.distance);
  }

  getFoodEaten(): number {
    return this.foodEaten;
  }

  getComboMultiplier(): number {
    return this.comboMultiplier;
  }

  /** Save the score if it's a new high score */
  saveHighScore(): void {
    setHighScore(this.getScore());
  }

  getHighScore(): number {
    return getHighScore();
  }
}
