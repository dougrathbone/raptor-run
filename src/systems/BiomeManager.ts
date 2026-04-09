// ======================
// Biome Manager
// Tracks distance and triggers biome transitions as the
// raptor runs through different environments:
// Jungle -> Swamp (1000m) -> Volcano (2500m) -> Caves (5000m)
// ======================

import {
  BIOME_THRESHOLDS,
  BIOME_CONFIGS,
  BiomeName,
  BiomeConfig,
} from '../utils/constants';

export class BiomeManager {
  private currentBiomeName: BiomeName = 'JUNGLE';
  private onTransition: ((biome: BiomeConfig) => void) | null = null;

  constructor(onTransition?: (biome: BiomeConfig) => void) {
    if (onTransition) {
      this.onTransition = onTransition;
    }
  }

  /**
   * Check if we've crossed a biome threshold.
   * Returns the new BiomeConfig if a transition happened, or null if not.
   */
  update(distance: number): BiomeConfig | null {
    let newBiome: BiomeName | null = null;

    if (distance >= BIOME_THRESHOLDS.CAVES && this.currentBiomeName !== 'CAVES') {
      newBiome = 'CAVES';
    } else if (distance >= BIOME_THRESHOLDS.VOLCANO && this.currentBiomeName !== 'VOLCANO' && this.currentBiomeName !== 'CAVES') {
      newBiome = 'VOLCANO';
    } else if (distance >= BIOME_THRESHOLDS.SWAMP && this.currentBiomeName !== 'SWAMP' && this.currentBiomeName !== 'VOLCANO' && this.currentBiomeName !== 'CAVES') {
      newBiome = 'SWAMP';
    }

    if (newBiome) {
      this.currentBiomeName = newBiome;
      const config = BIOME_CONFIGS[newBiome];
      if (this.onTransition) {
        this.onTransition(config);
      }
      return config;
    }

    return null;
  }

  /** Returns the current biome configuration */
  getCurrentBiome(): BiomeConfig {
    return BIOME_CONFIGS[this.currentBiomeName];
  }

  /** Returns the current biome name string */
  getBiomeName(): string {
    return this.currentBiomeName;
  }
}
