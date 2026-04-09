# New Dinosaur Species & Art Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 6 new dinosaur enemy species with progressive unlocking, upgrade existing dino art, and introduce a T-Rex chase mini-boss event.

**Architecture:** Refactor SpawnManager from hardcoded if/else spawn rolls to a weighted table filtered by distance. Add ChaseManager as a new system for T-Rex events. All new dino textures are procedural Canvas2D (with external sprites swapped in later where available). Each new species has its own spawn method with unique movement behavior.

**Tech Stack:** Phaser 3.80.1, TypeScript, Canvas2D for procedural textures

**Spec:** `docs/superpowers/specs/2026-04-09-new-dino-species-design.md`

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/utils/constants.ts` | Modify | Add spawn table, chase constants, unlock distances |
| `src/entities/Obstacle.ts` | Modify | Add new obstacle types |
| `src/systems/SpawnManager.ts` | Modify | Progressive unlock, weighted spawn, new spawn methods |
| `src/systems/ChaseManager.ts` | Create | T-Rex chase state machine |
| `src/scenes/GameScene.ts` | Modify | Wire distance, integrate ChaseManager, roar immunity |
| `src/scenes/BootScene.ts` | Modify | New textures + upgraded textures |
| `src/systems/ScoreManager.ts` | Modify | Add chase bonus method |

---

### Task 1: Constants & Types

**Files:**
- Modify: `src/entities/Obstacle.ts:8`
- Modify: `src/utils/constants.ts`

- [ ] **Step 1: Add new obstacle types**

In `src/entities/Obstacle.ts`, replace the ObstacleType:

```typescript
export type ObstacleType = 'log' | 'bench' | 'pterodactyl' | 'rock' | 'triceratops' | 'trap' | 'spear'
  | 'stegosaurus' | 'ankylosaurus' | 'dilophosaurus' | 'compy' | 'dimorphodon' | 'venom';
```

- [ ] **Step 2: Add spawn table and chase constants**

Append to `src/utils/constants.ts`:

```typescript
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
```

- [ ] **Step 3: Verify build**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/entities/Obstacle.ts src/utils/constants.ts
git commit -m "feat: add new dino obstacle types and spawn/chase constants"
```

---

### Task 2: Progressive Unlock Spawn System

**Files:**
- Modify: `src/systems/SpawnManager.ts`

- [ ] **Step 1: Add import for spawn table**

In `src/systems/SpawnManager.ts`, update the imports:

```typescript
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
```

- [ ] **Step 2: Update the update() signature to accept distance**

Change the `update` method signature from:

```typescript
update(time: number, scrollSpeed: number): void {
```

to:

```typescript
update(time: number, scrollSpeed: number, distance: number): void {
```

And change the obstacle spawn call from:

```typescript
this.spawnObstacle(scrollSpeed);
```

to:

```typescript
this.spawnObstacle(scrollSpeed, distance);
```

- [ ] **Step 3: Replace spawnObstacle with weighted table lookup**

Replace the `spawnObstacle` method:

```typescript
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
  }
}
```

- [ ] **Step 4: Update velocity loop for new species**

Replace the obstacleGroup velocity loop:

```typescript
this.obstacleGroup.getChildren().forEach((child) => {
  const obs = child as Obstacle;
  switch (obs.obstacleType) {
    case 'pterodactyl': obs.setVelocityX(-scrollSpeed * 1.2); break;
    case 'triceratops': obs.setVelocityX(-scrollSpeed * 1.5); break;
    case 'compy': obs.setVelocityX(-scrollSpeed * 1.3); break;
    case 'dimorphodon': obs.setVelocityX(-scrollSpeed * 1.4); break;
    case 'stegosaurus': obs.setVelocityX(-scrollSpeed * 0.8); break;
    case 'ankylosaurus': obs.setVelocityX(-scrollSpeed * 0.7); break;
    case 'spear': obs.setVelocityX(-scrollSpeed * 1.8); break;
    case 'rock': break; // rock has its own velocity
    case 'venom': break; // venom has gravity-based arc
    default: obs.setVelocityX(-scrollSpeed); break;
  }
});
```

- [ ] **Step 5: Add stub spawn methods for new species**

Add empty spawn methods so the build passes (actual implementation comes in later tasks):

```typescript
private spawnCompyPack(scrollSpeed: number): void {
  this.spawnLog(scrollSpeed); // temporary fallback until Task 5
}

private spawnDimorphodon(scrollSpeed: number): void {
  this.spawnPterodactyl(scrollSpeed);
}

private spawnStegosaurus(scrollSpeed: number): void {
  this.spawnTriceratops(scrollSpeed);
}

private spawnDilophosaurus(scrollSpeed: number): void {
  this.spawnHunterTrap(scrollSpeed);
}

private spawnAnkylosaurus(scrollSpeed: number): void {
  this.spawnTriceratops(scrollSpeed);
}
```

- [ ] **Step 6: Verify build**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 7: Commit**

```bash
git add src/systems/SpawnManager.ts
git commit -m "feat: refactor SpawnManager for progressive unlock weighted spawning"
```

---

### Task 3: Wire Distance to SpawnManager in GameScene

**Files:**
- Modify: `src/scenes/GameScene.ts:151`

- [ ] **Step 1: Pass distance to SpawnManager.update()**

In `GameScene.update()`, change:

```typescript
this.spawnManager.update(time, effectiveSpeed);
```

to:

```typescript
this.spawnManager.update(time, effectiveSpeed, this.scoreManager.getDistance());
```

- [ ] **Step 2: Verify build and play-test**

Run: `npx tsc --noEmit`
Expected: No errors

Run: `npm run dev`
Expected: Game plays normally — existing obstacles still spawn, no new species visible yet (all below 300m threshold initially, stubs fall back to existing types)

- [ ] **Step 3: Commit**

```bash
git add src/scenes/GameScene.ts
git commit -m "feat: pass distance to SpawnManager for progressive unlock"
```

---

### Task 4: Upgrade Existing Dino Art

**Files:**
- Modify: `src/scenes/BootScene.ts` (makeHazardPterodactyl and makeHazardTriceratops methods)
- Modify: `src/systems/SpawnManager.ts` (adjust spawn Y positions)

- [ ] **Step 1: Upgrade pterodactyl texture to 80x56**

In `src/scenes/BootScene.ts`, replace the `makeHazardPterodactyl` method. The new version uses an 80x56 canvas with more wing membrane detail, visible wing fingers, better body proportions, textured skin, and a more detailed crest. Follow the same gradient/shading patterns used by the existing method but at the larger size. Key features:
- Wider wingspan with visible membrane veins/fingers (3-4 lines per wing)
- More anatomically correct body shape (larger torso)
- Better head with visible teeth in beak
- More detailed crest with gradient
- Textured skin with subtle scale pattern on body
- Shadow beneath

Update canvas dimensions from `const W = 56, H = 38` to `const W = 80, H = 56` and scale all coordinates proportionally (~1.43x), then add the extra detail features.

- [ ] **Step 2: Adjust pterodactyl spawn position**

In `src/systems/SpawnManager.ts`, update `spawnPterodactyl` — change the Y range to account for the taller sprite:

```typescript
private spawnPterodactyl(scrollSpeed: number): void {
  const y = Phaser.Math.Between(GROUND_Y - 190, GROUND_Y - 90);
  const obstacle = new Obstacle(this.scene, GAME_WIDTH + 60, y, 'hazard-pterodactyl', 'pterodactyl');
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
```

- [ ] **Step 3: Upgrade triceratops texture to 90x64**

In `src/scenes/BootScene.ts`, replace the `makeHazardTriceratops` method. New 90x64 canvas with more detail. Key features:
- More anatomically accurate body proportions (bulkier)
- Detailed frill with scalloped edge and decorative eye spots
- Three properly positioned horns (two long brow horns, one shorter nose horn)
- Visible musculature via gradient shading on legs and shoulders
- Textured hide with subtle bumpy pattern
- Better eye with brow ridge
- Short thick tail
- Shadow beneath

Update canvas from `const W = 64, H = 48` to `const W = 90, H = 64` and scale coordinates proportionally (~1.4x), adding the detail features.

- [ ] **Step 4: Adjust triceratops spawn position**

In `src/systems/SpawnManager.ts`, update `spawnTriceratops` for the taller sprite:

```typescript
private spawnTriceratops(scrollSpeed: number): void {
  const obstacle = new Obstacle(
    this.scene, GAME_WIDTH + 80, GROUND_Y - 32,
    'hazard-triceratops', 'triceratops',
  );
  obstacle.setVelocityX(-scrollSpeed * 1.5);
  this.obstacleGroup.add(obstacle);
}
```

- [ ] **Step 5: Verify build and play-test**

Run: `npx tsc --noEmit && npm run dev`
Expected: Pterodactyl and triceratops appear larger and more detailed in-game

- [ ] **Step 6: Commit**

```bash
git add src/scenes/BootScene.ts src/systems/SpawnManager.ts
git commit -m "feat: upgrade pterodactyl and triceratops art to larger, more detailed textures"
```

---

### Task 5: Compsognathus Pack

**Files:**
- Modify: `src/scenes/BootScene.ts` (add makeHazardCompy)
- Modify: `src/systems/SpawnManager.ts` (replace stub spawnCompyPack)

- [ ] **Step 1: Add compy texture**

In `src/scenes/BootScene.ts`, add a call to `this.makeHazardCompy()` in `generateAllTextures()` (after `makeObstacleBench`), then add the method:

```typescript
private makeHazardCompy(): void {
  const W = 32, H = 28;
  const { ctx, refresh } = this.canvas('hazard-compy', W, H);

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.beginPath();
  ctx.ellipse(16, H - 2, 12, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tail (long, thin, stiff)
  const tailGrad = ctx.createLinearGradient(0, 8, 0, 14);
  tailGrad.addColorStop(0, '#5a7a38');
  tailGrad.addColorStop(1, '#7a9a58');
  ctx.fillStyle = tailGrad;
  ctx.beginPath();
  ctx.moveTo(6, 10);
  ctx.quadraticCurveTo(2, 9, 0, 8);
  ctx.lineTo(0, 11);
  ctx.quadraticCurveTo(2, 12, 6, 13);
  ctx.closePath();
  ctx.fill();

  // Body (small, lean)
  const bodyGrad = ctx.createLinearGradient(0, 6, 0, 20);
  bodyGrad.addColorStop(0, '#4a6a28');
  bodyGrad.addColorStop(0.5, '#5a8038');
  bodyGrad.addColorStop(1, '#8aaa68');
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.ellipse(14, 13, 8, 6, -0.1, 0, Math.PI * 2);
  ctx.fill();

  // Feather tufts along back
  ctx.strokeStyle = '#3a5a18';
  ctx.lineWidth = 0.8;
  for (let i = 0; i < 4; i++) {
    const fx = 9 + i * 3;
    ctx.beginPath();
    ctx.moveTo(fx, 8);
    ctx.lineTo(fx + 1, 5);
    ctx.stroke();
  }

  // Hind leg
  ctx.fillStyle = '#4a6a28';
  ctx.fillRect(15, 17, 3, 7);
  ctx.fillRect(13, 23, 5, 2); // foot

  // Head (small, alert)
  ctx.fillStyle = '#5a7a38';
  ctx.beginPath();
  ctx.ellipse(23, 8, 5, 4, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Snout
  ctx.fillStyle = '#6a8a48';
  ctx.beginPath();
  ctx.moveTo(27, 6);
  ctx.lineTo(31, 7);
  ctx.lineTo(31, 9);
  ctx.lineTo(27, 10);
  ctx.closePath();
  ctx.fill();

  // Eye (large for small dino)
  ctx.fillStyle = '#ffaa22';
  ctx.beginPath();
  ctx.arc(24, 7, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(24.5, 7, 0.8, 0, Math.PI * 2);
  ctx.fill();

  // Tiny arm
  ctx.strokeStyle = '#4a6a28';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(19, 12);
  ctx.lineTo(21, 14);
  ctx.lineTo(20, 15);
  ctx.stroke();

  refresh();
}
```

- [ ] **Step 2: Implement compy pack spawn**

In `src/systems/SpawnManager.ts`, replace the stub `spawnCompyPack`:

```typescript
private spawnCompyPack(scrollSpeed: number): void {
  const count = Phaser.Math.Between(3, 4);
  for (let i = 0; i < count; i++) {
    const xOffset = i * Phaser.Math.Between(18, 30);
    const y = Phaser.Math.Between(GROUND_Y - 28, GROUND_Y - 10);
    const compy = new Obstacle(
      this.scene, GAME_WIDTH + 40 + xOffset, y,
      'hazard-compy', 'compy',
    );
    compy.setVelocityX(-scrollSpeed * 1.3);
    this.obstacleGroup.add(compy);
  }
}
```

- [ ] **Step 3: Verify build and play-test**

Run: `npx tsc --noEmit && npm run dev`
Expected: After 300m, packs of 3-4 tiny compys appear running fast together

- [ ] **Step 4: Commit**

```bash
git add src/scenes/BootScene.ts src/systems/SpawnManager.ts
git commit -m "feat: add Compsognathus pack enemy (unlocks at 300m)"
```

---

### Task 6: Dimorphodon

**Files:**
- Modify: `src/scenes/BootScene.ts` (add makeHazardDimorphodon)
- Modify: `src/systems/SpawnManager.ts` (replace stub spawnDimorphodon)

- [ ] **Step 1: Add dimorphodon texture**

In `src/scenes/BootScene.ts`, add `this.makeHazardDimorphodon()` in `generateAllTextures()`, then add the method. Canvas size 52x44. Key features:
- Disproportionately large head (~40% of body length) — this is the dimorphodon's defining trait
- Prominent teeth visible in open jaw
- Short, bat-like wings with membrane detail
- Compact body with short tail
- Dark coloring: deep brown/burgundy body (#5a2a1a), lighter wing membranes (#8a6a4a)
- Bright eye (amber/yellow)
- Small crest on head

Follow the same Canvas2D gradient/shape patterns used in `makeHazardPterodactyl`.

- [ ] **Step 2: Implement dimorphodon dive spawn**

In `src/systems/SpawnManager.ts`, replace the stub `spawnDimorphodon`:

```typescript
private spawnDimorphodon(scrollSpeed: number): void {
  const startY = GROUND_Y - 220;
  const obstacle = new Obstacle(
    this.scene, GAME_WIDTH + 60, startY,
    'hazard-dimorphodon', 'dimorphodon',
  );
  obstacle.setVelocityX(-scrollSpeed * 1.4);
  this.obstacleGroup.add(obstacle);

  // Dive toward ground, then swoop back up
  this.scene.tweens.add({
    targets: obstacle,
    y: GROUND_Y - 30,
    duration: 800,
    ease: 'Sine.easeIn',
    onComplete: () => {
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
```

- [ ] **Step 3: Verify build and play-test**

Run: `npx tsc --noEmit && npm run dev`
Expected: After 600m, dimorphodons dive from the top of the screen toward the ground, then swoop back up

- [ ] **Step 4: Commit**

```bash
git add src/scenes/BootScene.ts src/systems/SpawnManager.ts
git commit -m "feat: add Dimorphodon dive-bomber enemy (unlocks at 600m)"
```

---

### Task 7: Stegosaurus

**Files:**
- Modify: `src/scenes/BootScene.ts` (add makeHazardStegosaurus)
- Modify: `src/systems/SpawnManager.ts` (replace stub spawnStegosaurus)

- [ ] **Step 1: Add stegosaurus texture**

In `src/scenes/BootScene.ts`, add `this.makeHazardStegosaurus()` in `generateAllTextures()`, then add the method. Canvas size 100x72. Key features:
- Large, rounded body (quadruped stance) — earthy brown/olive (#6a5a3a body, #8a7a5a highlights)
- 5-6 diamond/pentagonal plates along the spine, alternating slightly left/right, gradient from base to tip (#7a6a4a to #9a8a6a)
- Thagomizer: 4 spikes on the tail tip (#c8b890 bone color)
- Small head relative to body, low to ground
- Thick columnar legs (elephant-like)
- Textured hide with subtle bumpy pattern
- Shadow beneath

- [ ] **Step 2: Implement stegosaurus spawn**

In `src/systems/SpawnManager.ts`, replace the stub `spawnStegosaurus`:

```typescript
private spawnStegosaurus(scrollSpeed: number): void {
  const obstacle = new Obstacle(
    this.scene, GAME_WIDTH + 60, GROUND_Y - 36,
    'hazard-stegosaurus', 'stegosaurus',
  );
  obstacle.setVelocityX(-scrollSpeed * 0.8);
  this.obstacleGroup.add(obstacle);
}
```

- [ ] **Step 3: Verify build and play-test**

Run: `npx tsc --noEmit && npm run dev`
Expected: After 1000m, slow-moving stegosaurs appear. Their tall plates make them hard to jump over — player should duck or dash.

- [ ] **Step 4: Commit**

```bash
git add src/scenes/BootScene.ts src/systems/SpawnManager.ts
git commit -m "feat: add Stegosaurus tall ground enemy (unlocks at 1000m)"
```

---

### Task 8: Dilophosaurus + Venom Projectile

**Files:**
- Modify: `src/scenes/BootScene.ts` (add makeHazardDilophosaurus + makeHazardVenom)
- Modify: `src/systems/SpawnManager.ts` (replace stub spawnDilophosaurus, add spawnVenom)

- [ ] **Step 1: Add dilophosaurus texture**

In `src/scenes/BootScene.ts`, add `this.makeHazardDilophosaurus()` in `generateAllTextures()`, then add the method. Canvas size 80x70. Key features:
- Bipedal stance (standing more upright than other dinos, ~60 degree angle)
- Twin parallel crests on top of head (#aa4422 to #cc6644 gradient)
- Expandable frill around neck (fanned out, bright warning colors: orange/yellow with dark spots)
- Open mouth showing teeth (about to spit)
- Lean body, earth-tone greens (#4a5a2a)
- Long tail for balance
- Feathered forearms (scientifically accurate theropod)

- [ ] **Step 2: Add venom projectile texture**

Add `this.makeHazardVenom()` in `generateAllTextures()`, then add the method:

```typescript
private makeHazardVenom(): void {
  const W = 16, H = 16;
  const { ctx, refresh } = this.canvas('hazard-venom', W, H);

  // Glowing green glob
  const grad = ctx.createRadialGradient(8, 8, 1, 8, 8, 7);
  grad.addColorStop(0, '#bbff44');
  grad.addColorStop(0.4, '#66cc00');
  grad.addColorStop(0.8, '#338800');
  grad.addColorStop(1, 'rgba(30, 80, 0, 0.3)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(8, 8, 7, 0, Math.PI * 2);
  ctx.fill();

  // Inner shine
  ctx.fillStyle = 'rgba(220, 255, 150, 0.5)';
  ctx.beginPath();
  ctx.ellipse(6, 6, 2.5, 2, -0.3, 0, Math.PI * 2);
  ctx.fill();

  // Drip trail
  ctx.fillStyle = '#55aa00';
  ctx.beginPath();
  ctx.ellipse(12, 13, 1.5, 2.5, 0.3, 0, Math.PI * 2);
  ctx.fill();

  refresh();
}
```

- [ ] **Step 3: Implement dilophosaurus spawn with venom spit**

In `src/systems/SpawnManager.ts`, replace the stub `spawnDilophosaurus` and add `spawnVenom`:

```typescript
private spawnDilophosaurus(scrollSpeed: number): void {
  const obstacle = new Obstacle(
    this.scene, GAME_WIDTH + 40, GROUND_Y - 35,
    'hazard-dilophosaurus', 'dilophosaurus',
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
```

- [ ] **Step 4: Verify build and play-test**

Run: `npx tsc --noEmit && npm run dev`
Expected: After 1500m, dilophosaurs stand at the right edge and spit green venom globs that arc toward the player

- [ ] **Step 5: Commit**

```bash
git add src/scenes/BootScene.ts src/systems/SpawnManager.ts
git commit -m "feat: add Dilophosaurus ranged enemy with venom spit (unlocks at 1500m)"
```

---

### Task 9: Ankylosaurus + Roar Immunity

**Files:**
- Modify: `src/scenes/BootScene.ts` (add makeHazardAnkylosaurus)
- Modify: `src/systems/SpawnManager.ts` (replace stub spawnAnkylosaurus)
- Modify: `src/scenes/GameScene.ts` (roar immunity in performRoar)

- [ ] **Step 1: Add ankylosaurus texture**

In `src/scenes/BootScene.ts`, add `this.makeHazardAnkylosaurus()` in `generateAllTextures()`, then add the method. Canvas size 96x52. Key features:
- Very wide, low body (tank shape) — dark brown/grey armor (#5a5040 to #7a7060)
- Armored shell with visible scute pattern (rows of bumps/ovals across the back)
- Prominent club tail on the right side (#8a7a60 bone color, round knob shape)
- Small head with beak-like mouth, beady eyes
- Short, thick legs (barely visible under the armor)
- Spiky armor ridges along the sides
- Shadow beneath (wide)

- [ ] **Step 2: Implement ankylosaurus spawn**

In `src/systems/SpawnManager.ts`, replace the stub `spawnAnkylosaurus`:

```typescript
private spawnAnkylosaurus(scrollSpeed: number): void {
  const obstacle = new Obstacle(
    this.scene, GAME_WIDTH + 60, GROUND_Y - 26,
    'hazard-ankylosaurus', 'ankylosaurus',
  );
  obstacle.setVelocityX(-scrollSpeed * 0.7);
  this.obstacleGroup.add(obstacle);
}
```

- [ ] **Step 3: Add roar immunity**

In `src/scenes/GameScene.ts`, in the `performRoar` method, modify the obstacle destruction loop. Replace:

```typescript
if (dist < ROAR_STUN_RADIUS) {
  // Flash and destroy
  this.tweens.add({
```

with:

```typescript
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
```

Note: change the `forEach` callback to use `return` correctly. Since the loop uses `forEach`, `return` skips the current iteration (which is what we want — skip the destroy for ankylosaurus, continue to next obstacle).

- [ ] **Step 4: Verify build and play-test**

Run: `npx tsc --noEmit && npm run dev`
Expected: After 2000m, armored ankylosaurus appears. Roar shows "CLANG!" and deflects off it instead of destroying it.

- [ ] **Step 5: Commit**

```bash
git add src/scenes/BootScene.ts src/systems/SpawnManager.ts src/scenes/GameScene.ts
git commit -m "feat: add Ankylosaurus armored enemy with roar immunity (unlocks at 2000m)"
```

---

### Task 10: T-Rex Chase System

**Files:**
- Create: `src/systems/ChaseManager.ts`
- Modify: `src/scenes/BootScene.ts` (add makeHazardTrex)
- Modify: `src/scenes/GameScene.ts` (integrate ChaseManager)

- [ ] **Step 1: Add T-Rex texture**

In `src/scenes/BootScene.ts`, add `this.makeHazardTrex()` in `generateAllTextures()`, then add the method. Canvas size 160x120. Key features:
- Massive bipedal predator, forward-leaning stance
- Enormous head (~35% of body length) with powerful jaw
- Many large, visible teeth (8-10 in upper jaw, serrated look)
- Tiny vestigial arms (comically small relative to body)
- Massive muscular legs with large claws
- Thick, heavy tail for counterbalance
- Dark coloring: deep forest green/brown (#2a3a1a body, #4a5a2a highlights)
- Fierce amber eye with heavy brow ridge
- Textured hide with scale pattern and muscle highlights
- This is the biggest sprite in the game — make it imposing

- [ ] **Step 2: Create ChaseManager**

Create `src/systems/ChaseManager.ts`:

```typescript
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
  private savedBgColor: number = 0;
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

  /** Called once per obstacle spawn tick. Returns true if chase triggered. */
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

  // --- State transitions ---

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

    // Announce
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

    // Restore background (will be set by BiomeManager on next transition check)
    this.onChaseEnd(TREX_CHASE_BONUS);
  }

  // --- Per-frame updates ---

  private updateWarning(): void {
    // Escalating camera shake
    const progress = 1 - this.stateTimer / TREX_WARNING_DURATION;
    const intensity = 0.002 + progress * 0.008;
    this.scene.cameras.main.shake(100, intensity);

    if (this.stateTimer <= 0) {
      this.startChase();
    }
  }

  private updateChase(): void {
    // Subtle ongoing camera shake
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
```

- [ ] **Step 3: Integrate ChaseManager into GameScene**

In `src/scenes/GameScene.ts`:

Add import:
```typescript
import { ChaseManager } from '../systems/ChaseManager';
```

Add constant import — add `TREX_CHASE_BONUS` to the existing constants import.

Add a `addChaseBonus` method to `src/systems/ScoreManager.ts`:
```typescript
/** Bonus for surviving a T-Rex chase */
addChaseBonus(bonus: number): void {
  this.score += bonus;
}
```

Add member variable after `private hud!: HUD;`:
```typescript
private chaseManager!: ChaseManager;
private chaseSpeedMultiplier = 1;
```

In `create()`, after creating the SpawnManager, add:
```typescript
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
```

In `update()`, add chase manager update and apply speed multiplier. Change:
```typescript
const effectiveSpeed = this.scrollManager.getSpeed() + this.raptor.speedBonus;
```
to:
```typescript
const baseSpeed = this.scrollManager.getSpeed() + this.raptor.speedBonus;
const effectiveSpeed = baseSpeed * this.chaseSpeedMultiplier;
```

Add chase update after `this.spawnManager.update(...)`:
```typescript
this.chaseManager.update(delta);
```

Add chase trigger check. In `update()`, after the spawn manager call, add:
```typescript
// T-Rex chase check (independent of spawn timer)
const distance = this.scoreManager.getDistance();
if (!this.chaseManager.isActive) {
  this.chaseManager.tryTrigger(distance);
}
```

In `gameOver()`, add cleanup:
```typescript
this.chaseManager.cleanup();
```

- [ ] **Step 4: Verify build**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 5: Play-test the chase**

Run: `npm run dev`
To test quickly, temporarily change `TREX_UNLOCK_DISTANCE` to 100 in constants.ts, play past 100m, and verify:
- Camera shakes as warning
- T-Rex slides in from the left
- Speed increases
- Background turns reddish
- After ~11s, T-Rex retreats
- "ESCAPED!" text appears
- Speed returns to normal

Then restore `TREX_UNLOCK_DISTANCE` to 3000.

- [ ] **Step 6: Commit**

```bash
git add src/systems/ChaseManager.ts src/scenes/BootScene.ts src/scenes/GameScene.ts
git commit -m "feat: add T-Rex chase mini-boss event (unlocks at 3000m)"
```

---

### Task 11: Search for External Sprites

**Files:**
- Potentially: `assets/sprites/` (new files)
- Potentially: `src/scenes/BootScene.ts` (load external sprites, use as primary with procedural fallback)

- [ ] **Step 1: Search OpenGameArt for CC0 dinosaur sprites**

Search for CC0/public domain sprite sheets on OpenGameArt.org matching these species:
- T-Rex
- Stegosaurus
- Ankylosaurus
- Dimorphodon

Look for sprites that:
- Match the game's side-scrolling perspective (side view)
- Are CC0 or public domain licensed
- Have reasonable dimensions (not too small, not too large)
- Fit the existing art style (colorful but not cartoonish)

- [ ] **Step 2: Download and integrate any found sprites**

For each sprite found:
1. Download to `assets/sprites/`
2. Add `this.load.image()` or `this.load.spritesheet()` call in `BootScene.preload()`
3. In the corresponding spawn method, check for the external texture: `if (this.scene.textures.exists('external-key'))` and use it, falling back to the procedural texture

This follows the same pattern used for the raptor (external dino-idle sprite with procedural raptor-hatchling fallback).

- [ ] **Step 3: Verify build and play-test**

Run: `npx tsc --noEmit && npm run dev`
Expected: External sprites display where available, procedural textures used as fallback

- [ ] **Step 4: Commit**

```bash
git add assets/sprites/ src/scenes/BootScene.ts
git commit -m "feat: add external CC0 sprites for dinosaurs where available"
```
