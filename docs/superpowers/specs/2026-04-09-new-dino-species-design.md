# New Dinosaur Species & Art Upgrade

**Date:** 2026-04-09
**Status:** Approved

## Summary

Add 6 new dinosaur enemy species with progressive unlocking, upgrade existing dino art for realism, and introduce a T-Rex chase mini-boss event. Art uses a hybrid approach: external CC0 sprites where available, enhanced procedural Canvas2D for the rest.

## Species Roster

### Existing (upgraded art)

| Species | Current Size | New Size | Changes |
|---|---|---|---|
| Pterodactyl | 56x38 | 80x56 | More wing membrane detail, better anatomy |
| Triceratops | 64x48 | 90x64 | Better frill, horn detail, muscle definition |

### New Species

| Species | Size | Type | Speed | Unlock Distance | Art Source |
|---|---|---|---|---|---|
| Compsognathus Pack | 32x28 each | Ground swarm | 1.3x | 300m | Procedural |
| Dimorphodon | 52x44 | Flying dive bomber | 1.4x | 600m | External or procedural |
| Stegosaurus | 100x72 | Ground tall obstacle | 0.8x | 1000m | External |
| Dilophosaurus | 80x70 | Ranged (stationary) | Stationary | 1500m | Procedural |
| Ankylosaurus | 96x52 | Ground armored | 0.7x | 2000m | External |
| T-Rex | 160x120 | Chase mini-boss | Matches scroll | 3000m | External |

## Species Behaviors

### Compsognathus Pack (300m)
- Spawns 3-4 tiny compys in a spread formation at different Y positions
- Fast (1.3x scroll speed), hard to avoid due to vertical spread
- Each compy is its own sprite; hitting any one deals damage
- Small size makes them visually distinct from other ground enemies
- Feathered (scientifically accurate)

### Dimorphodon (600m)
- Starts at top of screen, dives diagonally toward the raptor's position
- After reaching low point, swoops back up and off-screen
- More aggressive than pterodactyl's gentle bobbing pattern
- Large head relative to body (distinctive silhouette)

### Stegosaurus (1000m)
- Tall spiked plates make it hard to jump over
- Slow (0.8x) but wide hitbox
- Player must duck or dash to avoid
- Plates extend above the sprite body for extra vertical coverage

### Dilophosaurus (1500m)
- Spawns at right edge of screen, stands still
- Spits 1-2 venom glob projectiles that arc toward the raptor
- Venom globs are separate obstacle sprites (small, green, arcing trajectory)
- The dilophosaurus body itself scrolls off-screen normally
- Twin crests and dramatic frill when spitting
- Frill fans out as a visual cue before spit

### Ankylosaurus (2000m)
- Low, wide profile — easy to jump over but covers a lot of ground width
- Immune to Roar ability (armored shell deflects it)
- Club tail has a separate hitbox that swings periodically
- Slow (0.7x) but punishing if you misjudge the tail timing

### T-Rex Chase Mini-Boss (3000m)
- **Trigger:** ~5% chance per obstacle spawn roll after 3000m. Cooldown: 90 seconds minimum between chases.
- **Warning phase (1.5s):** Camera shake intensifies, ground trembles
- **Entrance:** T-Rex slides in from left edge, occupies left ~20% of screen
- **Chase phase (10-12s):**
  - Scroll speed increases to 1.5x
  - T-Rex matches scroll speed, stays on left side
  - Normal obstacles continue spawning at the faster speed
  - Slight red/orange screen tint
  - T-Rex inches forward when raptor is on ground, backs off slightly when raptor jumps (rewards active play)
- **Exit:** T-Rex roars, slows down, falls behind off left edge. Speed returns to normal over 2 seconds.
- **Reward:** 1000 point bonus, "ESCAPED!" floating text
- **Death:** If HP hits 0 during chase, normal game over (no special behavior)
- T-Rex has no direct collision hitbox — it's a background threat that forces faster obstacle dodging

## Progressive Unlock System

New species are added to the spawn pool based on distance traveled. The SpawnManager tracks current distance and adjusts available obstacle types accordingly.

### Unlock thresholds
- 0m: Log, Bench, Pterodactyl, Rock, Triceratops, Trap, Spear
- 300m: + Compsognathus Pack
- 600m: + Dimorphodon
- 1000m: + Stegosaurus (coincides with Swamp biome transition)
- 1500m: + Dilophosaurus
- 2000m: + Ankylosaurus
- 3000m: + T-Rex chase event

### Spawn weight rebalancing
When new species unlock, they take proportional weight from existing species. Early game stays simple; late game has full variety.

**Start (0m):** Log 25%, Bench 10%, Pterodactyl 20%, Rock 15%, Triceratops 15%, Trap 10%, Spear 5%

**All unlocked (3000m+):** Log 12%, Bench 6%, Pterodactyl 10%, Rock 8%, Triceratops 8%, Trap 6%, Spear 4%, Compy 10%, Dimorphodon 8%, Stego 8%, Dilo 7%, Ankylo 7%, T-Rex 6%

## Art Upgrade Strategy

### Approach: Hybrid
- **External CC0 sprites:** T-Rex, Stegosaurus, Ankylosaurus, Dimorphodon — search OpenGameArt for matching assets
- **Enhanced procedural (Canvas2D):** Compsognathus, Dilophosaurus, venom projectiles — need custom FX
- **Upgraded procedural:** Pterodactyl and Triceratops — larger canvases, more detail

### Realism standards for all dinos
- Proper muscle definition via multi-stop gradients
- Scale/skin texture patterns
- Feathers on theropods (compys, dilophosaurus) — scientifically accurate
- Earth-tone color palettes with species-specific accents
- Shadow beneath each ground dino
- Accurate proportions (reference real paleontology reconstructions)

### Fallback
If a suitable CC0 sprite isn't found for a species, fall back to enhanced procedural Canvas2D at the specified dimensions. The existing raptor procedural art demonstrates this can achieve high quality.

## Architecture Changes

### New obstacle types
Add to `ObstacleType`: `'stegosaurus' | 'ankylosaurus' | 'dilophosaurus' | 'compy' | 'dimorphodon' | 'trex'`

### SpawnManager changes
- Accept current distance as a parameter in `update()`
- Maintain an `unlockedSpecies` set that grows as distance thresholds are crossed
- Spawn roll draws only from unlocked species
- New spawn methods for each species with their unique behavior setup
- Compy pack spawns multiple sprites per spawn event
- Dilophosaurus spawns venom globs as delayed follow-up obstacles

### T-Rex chase system
New system class `ChaseManager` or integrated into GameScene:
- Manages chase state machine: idle → warning → chase → exit
- Controls scroll speed override during chase
- Manages T-Rex sprite (not in obstacle group — purely visual + speed modifier)
- Applies screen effects (tint, shake)
- Tracks cooldown timer

### Ankylosaurus roar immunity
In `performRoar()`, skip destruction for obstacles where `obstacleType === 'ankylosaurus'`. Add a visual "clang" or deflect effect instead.

### Venom projectile system
Dilophosaurus creates 1-2 venom glob sprites added to the obstacle group with arcing velocity (negative X + parabolic Y using gravity or tween).

## Testing Considerations

- Each species should be testable individually by forcing spawn
- T-Rex chase should be triggerable via debug key for testing
- Progressive unlock distances should be verified by playing through
- Verify Ankylosaurus is truly roar-immune
- Verify compy pack deals damage from any individual compy
- Verify venom globs despawn off-screen
