// ======================
// Growth System
// Tracks how much the raptor has eaten.
// The Growth Meter fills twice: once for Juvenile, once for Adult.
// ======================

import { GROWTH_MAX, GROWTH_PER_FOOD } from '../utils/constants';
import { FoodType } from '../entities/Food';

export class GrowthSystem {
  private meter = 0;
  private evolutionCount = 0;  // 0 = hatchling, 1 = juvenile, 2 = adult
  private maxEvolutions = 2;   // Two evolutions total
  private onEvolve: () => void;

  constructor(onEvolve: () => void) {
    this.onEvolve = onEvolve;
  }

  /** Add growth from eating food. Returns true if the raptor just evolved. */
  addGrowth(foodType: FoodType): boolean {
    if (this.evolutionCount >= this.maxEvolutions) return false;

    this.meter += GROWTH_PER_FOOD[foodType] ?? 0;

    if (this.meter >= GROWTH_MAX) {
      this.meter = 0; // Reset meter for next evolution
      this.evolutionCount++;
      this.onEvolve();
      return true;
    }
    return false;
  }

  getMeter(): number {
    return this.meter;
  }

  /** Progress as a fraction from 0.0 to 1.0 for the current stage */
  getProgress(): number {
    if (this.evolutionCount >= this.maxEvolutions) return 1;
    return this.meter / GROWTH_MAX;
  }

  /** How many times the raptor has evolved (0, 1, or 2) */
  getEvolutionCount(): number {
    return this.evolutionCount;
  }

  /** Whether the raptor is at max stage */
  isMaxed(): boolean {
    return this.evolutionCount >= this.maxEvolutions;
  }
}
