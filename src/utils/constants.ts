// ======================
// RAPTOR RUN — Game Constants
// All the numbers that control how the game feels.
// Tweak these to make the game easier, harder, or more fun!
// ======================

// --- Screen size ---
export const GAME_WIDTH = 1024;
export const GAME_HEIGHT = 576;

// --- Ground level (where the raptor stands) ---
export const GROUND_Y = 500;

// --- Physics ---
export const GRAVITY = 900;
export const JUMP_VELOCITY = -430; // Negative = upward

// --- World scrolling speed (pixels per second) ---
export const BASE_SCROLL_SPEED = 200;
export const MAX_SCROLL_SPEED = 500;
export const SPEED_INCREASE_RATE = 2; // How much faster it gets each second

// --- Speed boost per evolution stage ---
export const STAGE_SPEED_BONUS: Record<string, number> = {
  hatchling: 0,
  juvenile: 40,  // +40 px/s when juvenile
  adult: 90,     // +90 px/s when adult
};

// --- Raptor growth stages ---
export const STAGES = {
  HATCHLING: {
    name: 'Hatchling',
    texture: 'raptor-hatchling',
    bodyWidth: 30,
    bodyHeight: 36,
    crouchHeight: 20,
    hp: 2,
  },
  JUVENILE: {
    name: 'Juvenile',
    texture: 'raptor-juvenile',
    bodyWidth: 40,
    bodyHeight: 48,
    crouchHeight: 26,
    hp: 3,
  },
  ADULT: {
    name: 'Adult',
    texture: 'raptor-adult',
    bodyWidth: 50,
    bodyHeight: 58,
    crouchHeight: 32,
    hp: 5,
  },
};

// --- Growth meter ---
export const GROWTH_MAX = 100; // Per stage transition
export const GROWTH_PER_FOOD: Record<string, number> = {
  bug: 8,
  lizard: 12,
  fish: 18,
  egg: 25,
  crystal_egg: 50,
};

// --- Spawning intervals (milliseconds) ---
export const FOOD_SPAWN_INTERVAL = 1100;
export const OBSTACLE_SPAWN_INTERVAL = 1800;
export const PLATFORM_SPAWN_INTERVAL = 4000;
export const MIN_OBSTACLE_GAP = 400;

// --- Scoring ---
export const FOOD_SCORES: Record<string, number> = {
  bug: 10,
  lizard: 15,
  fish: 25,
  egg: 50,
  crystal_egg: 200,
};
export const GROWTH_BONUS = 500;
export const COMBO_TIMEOUT = 1500;
export const COMBO_MAX_MULTIPLIER = 4;

// --- Dash ability (Juvenile+) ---
export const DASH_DURATION = 500;
export const DASH_COOLDOWN = 3000;

// --- Roar ability (Adult only) ---
export const ROAR_COOLDOWN = 5000; // ms
export const ROAR_STUN_RADIUS = 300; // pixels

// --- Invincibility after being hit ---
export const INVINCIBLE_DURATION = 1500;

// --- Biome transition distances ---
export const BIOME_THRESHOLDS = {
  SWAMP: 1000,
  VOLCANO: 2500,
  CAVES: 5000,
};

// --- Biome configurations ---
export type BiomeName = 'JUNGLE' | 'SWAMP' | 'VOLCANO' | 'CAVES';

export interface BiomeConfig {
  name: BiomeName;
  bgColor: number;
  ground: string;
  hillsFar: string;
  hillsNear: string;
  obstacleTypes: string[];
  foodTypes: string[];
}

export const BIOME_CONFIGS: Record<BiomeName, BiomeConfig> = {
  JUNGLE: {
    name: 'JUNGLE',
    bgColor: 0x87ceeb,
    ground: 'ground-jungle',
    hillsFar: 'hills-far-jungle',
    hillsNear: 'hills-near-jungle',
    obstacleTypes: ['log', 'pterodactyl', 'rock'],
    foodTypes: ['bug', 'lizard', 'fish', 'egg'],
  },
  SWAMP: {
    name: 'SWAMP',
    bgColor: 0x6a8a7a,
    ground: 'ground-swamp',
    hillsFar: 'hills-far-swamp',
    hillsNear: 'hills-near-swamp',
    obstacleTypes: ['log', 'pterodactyl', 'rock'],
    foodTypes: ['bug', 'lizard', 'fish', 'egg'],
  },
  VOLCANO: {
    name: 'VOLCANO',
    bgColor: 0xcc6644,
    ground: 'ground-volcano',
    hillsFar: 'hills-far-volcano',
    hillsNear: 'hills-near-volcano',
    obstacleTypes: ['log', 'pterodactyl', 'rock'],
    foodTypes: ['bug', 'lizard', 'fish', 'egg'],
  },
  CAVES: {
    name: 'CAVES',
    bgColor: 0x2a2a3a,
    ground: 'ground-caves',
    hillsFar: 'hills-far-caves',
    hillsNear: 'hills-near-caves',
    obstacleTypes: ['log', 'pterodactyl', 'rock'],
    foodTypes: ['bug', 'lizard', 'fish', 'egg'],
  },
};

// --- Platform constants ---
export const PLATFORM_WIDTH = 120;
export const PLATFORM_HEIGHT = 16;
export const PLATFORM_Y_MIN = GROUND_Y - 140; // Highest platform
export const PLATFORM_Y_MAX = GROUND_Y - 60;  // Lowest platform

// --- Spawn weight table with progressive unlock ---
export interface SpawnEntry {
  type: string;
  weight: number;
  unlockDistance: number;
}

export const OBSTACLE_SPAWN_TABLE: SpawnEntry[] = [
  { type: 'log', weight: 22, unlockDistance: 0 },
  { type: 'bench', weight: 10, unlockDistance: 0 },
  { type: 'pterodactyl', weight: 18, unlockDistance: 0 },
  { type: 'rock', weight: 15, unlockDistance: 0 },
  { type: 'triceratops', weight: 15, unlockDistance: 0 },
  { type: 'trap', weight: 10, unlockDistance: 0 },
  { type: 'spear', weight: 10, unlockDistance: 0 },
  { type: 'compy', weight: 12, unlockDistance: 300 },
  { type: 'dimorphodon', weight: 10, unlockDistance: 600 },
  { type: 'stegosaurus', weight: 10, unlockDistance: 1000 },
  { type: 'dilophosaurus', weight: 8, unlockDistance: 1500 },
  { type: 'ankylosaurus', weight: 8, unlockDistance: 2000 },
];

// --- T-Rex chase event ---
export const TREX_UNLOCK_DISTANCE = 3000;
export const TREX_CHASE_DURATION = 11000;
export const TREX_CHASE_SPEED_MULTIPLIER = 1.5;
export const TREX_CHASE_COOLDOWN = 90000;
export const TREX_CHASE_CHANCE = 0.05;
export const TREX_WARNING_DURATION = 1500;
export const TREX_EXIT_DURATION = 2000;
export const TREX_CHASE_BONUS = 1000;
