---
name: Raptor Run project status
description: Current milestone and what's been built so far for the Raptor Run game
type: project
---

Raptor Run expanded build completed on 2026-04-08. The game is a 2D side-scrolling platformer built with TypeScript + Phaser 3 + Vite.

**What's built:**
- 3 growth stages: Hatchling → Juvenile (dash) → Adult (roar), each with unique Canvas2D-drawn texture
- All 4 biomes: Jungle → Swamp (1000m) → Volcano (2500m) → Caves (5000m), each with unique ground + hill textures
- Duck/crouch mechanic (S/Down key) — reduces hitbox, dodge high threats
- Roar ability (F key, Adult only) — stuns/destroys nearby obstacles with shockwave visual
- Platforms at different heights — raptor can jump on them, food spawns on top
- 6 hazard types: logs, pterodactyls (swooping), falling rocks, triceratops charge, hunter traps, spears
- Speed increases with growth stage (juvenile +40px/s, adult +90px/s)
- Combo scoring, growth meter resets per evolution, floating score text
- Canvas2D textures with bezier curves, gradients, scale patterns (major quality upgrade from v1)

**Why:** Will's game — he wanted more predators, hunters, ducking, multi-level terrain, biomes, and 3 stages.

**How to apply:** Next up would be M6 polish (screen shake, particles, sound effects, juice) and M7 (desktop packaging with Electron/Tauri). Design doc is at docs/game-design.md.
