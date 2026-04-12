// ======================
// Biome Manager
// Tracks distance and triggers biome transitions as the
// raptor runs through different environments:
// Jungle -> Swamp (1000m) -> Volcano (2500m) -> Caves (5000m) -> Mountain (8000m) -> Tundra (12000m)
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
  private static readonly BIOME_ORDER: BiomeName[] = ['JUNGLE', 'SWAMP', 'VOLCANO', 'CAVES', 'MOUNTAIN', 'TUNDRA'];

  update(distance: number): BiomeConfig | null {
    let newBiome: BiomeName | null = null;
    const idx = BiomeManager.BIOME_ORDER.indexOf(this.currentBiomeName);

    if (distance >= BIOME_THRESHOLDS.TUNDRA && idx < 5) {
      newBiome = 'TUNDRA';
    } else if (distance >= BIOME_THRESHOLDS.MOUNTAIN && idx < 4) {
      newBiome = 'MOUNTAIN';
    } else if (distance >= BIOME_THRESHOLDS.CAVES && idx < 3) {
      newBiome = 'CAVES';
    } else if (distance >= BIOME_THRESHOLDS.VOLCANO && idx < 2) {
      newBiome = 'VOLCANO';
    } else if (distance >= BIOME_THRESHOLDS.SWAMP && idx < 1) {
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
