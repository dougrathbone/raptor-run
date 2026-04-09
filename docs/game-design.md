# Raptor Run — Game Design Document & PRD

> **Working Title:** Raptor Run
> **Created by:** Will (age 8) & Dad
> **Platform:** Desktop (keyboard controls)
> **Language:** TypeScript
> **Art Style:** Cute / cartoonish, kid-friendly
> **Inspiration:** Banana Kong

---

## 1. Vision

Raptor Run is a side-scrolling action platformer where you play as a baby velociraptor hatching from an egg and growing into a fearsome adult. You run, jump, eat, and roar your way through prehistoric biomes — dodging hazards, gobbling up snacks, and evolving bigger and stronger as you go.

The game blends endless-runner momentum with milestone levels that unlock new biomes and growth stages. It should feel fast, fun, and funny — a game an 8-year-old wants to show his friends.

---

## 2. Core Game Loop

```
Hatch → Run → Eat → Grow → Dodge → Survive → Reach Milestone → New Biome → Repeat
```

1. **Run:** The raptor auto-runs to the right. The world scrolls faster as the game progresses.
2. **Eat:** Collect food scattered through the level (bugs, lizards, fish, eggs, small dinos). Eating fills a **Growth Meter**.
3. **Grow:** When the Growth Meter fills, the raptor evolves to the next stage. Each stage changes the sprite size and unlocks new abilities.
4. **Dodge:** Avoid obstacles — bigger dinos, falling rocks, lava pools, tar pits, hunter traps. Getting hit costs health.
5. **Milestone Levels:** At set distance/score thresholds, the biome transitions. Each biome has a short "boss moment" or challenge gate before it unlocks.
6. **Death & Retry:** When health hits zero, the run ends. Show distance, food eaten, and high score. Restart from the current biome.

---

## 3. The Raptor — Growth Stages

| Stage | Name | Size | Unlocked Ability | Visual Change |
|-------|------|------|------------------|---------------|
| 1 | Hatchling | Tiny | Double jump | Egg shell fragments on head |
| 2 | Juvenile | Small-Medium | Speed dash | Feathery fuzz, bigger claws |
| 3 | Adult | Large | Roar (stun enemies in range) | Full raptor, teeth visible, confident run animation |

**Gameplay impact of size:**
- **Hatchling:** Small hitbox, easy to dodge, but fragile (2 hit points). Can fit through tight gaps.
- **Juvenile:** Medium hitbox, sturdier (3 hit points). Some gaps are now too small.
- **Adult:** Large hitbox, tanky (5 hit points). Powerful but harder to dodge. Can smash through certain obstacles.

---

## 4. Controls

| Key | Action |
|-----|--------|
| `Space` or `W` or `Up Arrow` | Jump (press again in air for double jump at Stage 1+) |
| `Shift` or `D` | Dash / Speed boost (Stage 2+, cooldown-based) |
| `F` or `Enter` | Roar — stuns nearby enemies (Stage 3, cooldown-based) |
| `Esc` | Pause menu |

Keep it simple — an 8-year-old should be able to play with one hand on the keyboard.

---

## 5. Biomes

Each biome has its own visual theme, music mood, obstacle set, and food types.

### 5.1 Jungle (Starting Biome)
- **Look:** Lush green canopy, vines, ferns, waterfalls in background
- **Obstacles:** Fallen logs, river gaps, swooping pterodactyls
- **Food:** Butterflies, beetles, small lizards, frog eggs
- **Mood:** Bright, welcoming, tutorial-ish

### 5.2 Swamp
- **Look:** Murky water, dead trees, fireflies, fog
- **Obstacles:** Tar pits (sticky = slow down), snapping crocs half-submerged, falling dead branches
- **Food:** Fish jumping from water, dragonflies, turtle eggs
- **Mood:** Eerie but still cute — funny bubbling sounds

### 5.3 Volcano
- **Look:** Red/orange sky, lava flows, volcanic rock, ash particles
- **Obstacles:** Lava pools, erupting geysers, rolling boulders
- **Food:** Fire beetles (bonus points), charred eggs, small dinos fleeing the eruption
- **Mood:** Intense, fast — the scrolling speed increases here

### 5.4 Caves
- **Look:** Dark with bioluminescent mushrooms, crystal formations, underground rivers
- **Obstacles:** Stalactites falling, dark zones (limited visibility), bat swarms, hunter traps (nets, cages)
- **Food:** Glowing grubs, blind fish, mushroom clusters, crystal eggs (rare bonus)
- **Mood:** Mysterious, rewarding — highest-value food items here

---

## 6. Power-Ups

Power-ups spawn randomly and are collected by running through them.

| Power-Up | Icon Idea | Effect | Duration |
|----------|-----------|--------|----------|
| Speed Dash | Lightning bolt | Burst of speed, invincible during dash, smash through obstacles | 2 seconds |
| Roar Blast | Sound wave / megaphone | Stuns all enemies on screen, scatters small obstacles | Instant |
| Meat Chunk | Drumstick | Instantly fills 25% of Growth Meter | Instant |
| Shield Egg | Glowing egg shell | Absorbs one hit without taking damage | Until hit |

---

## 7. Obstacles & Hazards

| Category | Examples | Behavior |
|----------|----------|----------|
| **Predators** | T-Rex (background, jaws snap into foreground), Triceratops charge, Pterodactyl swoop | Pattern-based, learnable timing |
| **Environmental** | Lava pools, tar pits, river gaps, falling rocks, stalactites | Static or triggered by proximity |
| **Human Hunters** | Net traps, cage traps, spear obstacles | Appear in Caves biome, some are hidden |

---

## 8. Scoring & Progression

- **Distance Score:** 1 point per meter survived
- **Food Score:** Each food item has a point value (bugs = 10, fish = 25, eggs = 50, crystal eggs = 200)
- **Combo Multiplier:** Eating 3+ items in quick succession increases multiplier (x2, x3, x4 max)
- **Growth Bonus:** +500 points each time the raptor evolves
- **Biome Unlock:** Reaching distance milestones triggers a biome transition (Jungle → Swamp at 1000m, Swamp → Volcano at 2500m, Volcano → Caves at 5000m)
- **High Score Board:** Local high score table (top 10), persisted to disk

---

## 9. UI & Screens

### 9.1 Title Screen
- Game logo ("Raptor Run" with a cute raptor peeking over the text)
- Animated raptor running in place
- Menu: **Start**, **High Scores**, **Quit**
- Background: Jungle scene, parallax scrolling

### 9.2 HUD (During Gameplay)
- **Top-left:** Health (heart icons)
- **Top-center:** Distance counter (meters)
- **Top-right:** Score
- **Bottom-left:** Growth Meter (egg → raptor silhouette fill bar)
- **Bottom-right:** Power-up cooldown indicators

### 9.3 Pause Screen
- Overlay with **Resume**, **Restart**, **Quit to Menu**

### 9.4 Game Over Screen
- "EXTINCT!" with a funny raptor faint animation
- Stats: Distance, Food Eaten, Score, High Score comparison
- **Try Again**, **Main Menu**

---

## 10. Audio (Stretch Goal)

| Element | Description |
|---------|-------------|
| Background music | Upbeat, jungle-themed (royalty-free chiptune or orchestral) |
| Jump SFX | Bouncy spring sound |
| Eat SFX | Satisfying chomp/crunch |
| Roar SFX | Cute but fierce raptor roar |
| Hit SFX | Comical bonk |
| Growth SFX | Triumphant jingle + size-up whoosh |
| Biome transition | Musical shift + brief fanfare |

---

## 11. Technical Architecture

### 11.1 Recommended Stack
- **Language:** TypeScript
- **Game Framework:** Phaser 3 (mature 2D game framework, huge community, great docs)
- **Build Tool:** Vite (fast dev server, HMR)
- **Desktop Wrapper:** Electron or Tauri (to make it a desktop app)
- **Asset Pipeline:** Free sprite sheets + Aseprite for custom pixel/cartoon art

### 11.2 Project Structure (Suggested)
```
raptor-run/
├── src/
│   ├── main.ts                 # Entry point, Phaser game config
│   ├── scenes/
│   │   ├── BootScene.ts        # Asset preloading
│   │   ├── TitleScene.ts       # Main menu
│   │   ├── GameScene.ts        # Core gameplay
│   │   ├── PauseScene.ts       # Pause overlay
│   │   └── GameOverScene.ts    # End screen
│   ├── entities/
│   │   ├── Raptor.ts           # Player character, growth stages, state machine
│   │   ├── Food.ts             # Food item base class + variants
│   │   ├── Obstacle.ts         # Obstacle base class + variants
│   │   └── PowerUp.ts          # Power-up base class + variants
│   ├── systems/
│   │   ├── ScrollManager.ts    # World scrolling, speed progression
│   │   ├── SpawnManager.ts     # Procedural spawning of food/obstacles
│   │   ├── GrowthSystem.ts     # Growth meter, evolution logic
│   │   ├── ScoreManager.ts     # Score tracking, combos, high scores
│   │   └── BiomeManager.ts     # Biome transitions, theming
│   ├── ui/
│   │   ├── HUD.ts              # In-game overlay
│   │   └── HealthBar.ts        # Heart display
│   └── utils/
│       ├── constants.ts        # Tuning values, speeds, thresholds
│       └── storage.ts          # High score persistence
├── assets/
│   ├── sprites/
│   ├── audio/
│   └── tilemaps/
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### 11.3 Key Technical Decisions
- **Phaser Arcade Physics** for collision detection (simple, performant, perfect for side-scrollers)
- **Tilemap or procedural generation** for level terrain — start with hand-crafted tile patterns that combine randomly for variety
- **Sprite sheet animations** for raptor (idle, run, jump, eat, roar, hurt, evolve per stage)
- **Parallax scrolling** for background layers (sky → mountains → trees → ground)
- **Object pooling** for food and obstacles (recycle off-screen objects to avoid GC hitches)

---

## 12. MVP Scope (Build This First)

The first playable version should be achievable in a focused sprint:

1. **Single biome** (Jungle) with parallax background
2. **Raptor runs and jumps** (keyboard input, gravity, ground collision)
3. **Auto-scrolling world** that speeds up over time
4. **Food spawns** and can be collected (fills Growth Meter)
5. **One obstacle type** (fallen logs to jump over)
6. **Growth from Hatchling → Juvenile** (sprite swap, hitbox change)
7. **Health system** (3 hearts, hit = lose one, 0 = game over)
8. **Score counter and distance tracker**
9. **Game Over screen** with restart
10. **Placeholder art** (colored rectangles or free sprites — gameplay first)

### Post-MVP Milestones
- **M2:** Add all 3 growth stages + dash and roar abilities
- **M3:** Add Swamp biome + biome transition system
- **M4:** Add all power-ups + combo system
- **M5:** Add Volcano and Caves biomes
- **M6:** Polish — title screen, high scores, sound effects, juice (screen shake, particles)
- **M7:** Desktop packaging with Electron/Tauri

---

## 13. Design Prompt (For Claude Code / Claude)

Use this prompt when starting a new coding session:

---

> **You are helping build "Raptor Run," a 2D side-scrolling platformer built with TypeScript and Phaser 3.**
>
> **The game:** You play as a baby velociraptor that auto-runs to the right through prehistoric biomes (Jungle, Swamp, Volcano, Caves). You jump to avoid obstacles, eat food to fill a Growth Meter, and evolve through 3 stages: Hatchling → Juvenile → Adult. Each stage makes you bigger, sturdier, and unlocks a new ability (double jump, dash, roar). The game mixes endless-runner gameplay with milestone-based biome transitions.
>
> **The player:** This is being built by a dad and his 8-year-old son Will. They are first-time game developers. Code should be clean, well-commented, and organized into small files. Prefer simple patterns over clever abstractions. When in doubt, keep it straightforward.
>
> **Tech stack:** TypeScript, Phaser 3, Vite. Desktop target (Electron or Tauri later). Arcade physics for collisions.
>
> **Art approach:** Start with placeholder colored shapes or free sprite assets. Gameplay first, polish later.
>
> **Current milestone:** [UPDATE THIS — e.g., "MVP: single biome, run/jump, one food type, one obstacle, basic scoring"]
>
> **Key files:** See project structure in the PRD. Main gameplay logic is in `src/scenes/GameScene.ts`. Player entity is `src/entities/Raptor.ts`. Tuning values are in `src/utils/constants.ts`.
>
> When writing code, always consider: Would an 8-year-old understand what this code does if his dad explained it to him?

---

## 14. Will's Ideas Checklist

These are the ideas and decisions that came directly from Will or were chosen together. Keep these front and center — it's his game.

- [x] You play as a raptor (not a generic dino)
- [x] Start as a baby, grow bigger
- [x] Eat everything — bugs, lizards, fish, eggs, small dinos
- [x] Dodge bigger dinos AND hunters AND environmental stuff
- [x] Speed boost / dash power-up
- [x] Roar that stuns enemies
- [x] Multiple biomes including a volcano and caves
- [x] Cute cartoonish style
- [ ] *(Ask Will)* What should the raptor's name be?
- [ ] *(Ask Will)* What color should the raptor be?
- [ ] *(Ask Will)* Any other power-ups or enemies he wants?
- [ ] *(Ask Will)* What happens when you reach max size — does the game get harder, or is there a final boss?

---

*This document is the source of truth for Raptor Run. Update it as the game evolves. Have fun building it together!* 🦖