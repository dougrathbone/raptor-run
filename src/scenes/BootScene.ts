// ======================
// Boot Scene — Texture Generator
// Creates all game art using the Canvas2D API for smooth curves,
// gradients, and proper anti-aliasing. Much nicer than basic shapes!
// ======================

import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    // --- External sprite sheet assets ---
    // Dino character (CC0 by pzUH from OpenGameArt)
    this.load.spritesheet('dino-idle', 'assets/sprites/dino-idle.png', {
      frameWidth: 150,
      frameHeight: 110,
    });
    this.load.spritesheet('dino-dead', 'assets/sprites/dino-dead.png', {
      frameWidth: 150,
      frameHeight: 110,
    });
    this.load.image('dino-jump', 'assets/sprites/dino-jump.png');

    // Pterodactyl (CC0 from OpenGameArt 2D Dinosaur Set)
    this.load.image('pterodactyl-sprite', 'assets/sprites/pterodactyl.png');

    // Triceratops (CC0 by ARoachIFoundOnMyPillow from OpenGameArt)
    this.load.image('triceratops-sprite', 'assets/sprites/triceratops.png');

    // Stegosaurus (CC0 from OpenGameArt 2D Dinosaur Set)
    this.load.image('stegosaurus-sprite', 'assets/sprites/stegosaurus.png');

    // Dilophosaurus — use canvas-drawn cartoon version (no external sprite)
  }

  create(): void {
    // Create sprite animations from the loaded sheets
    this.createAnimations();
    // Generate remaining textures procedurally
    this.generateAllTextures();
    this.scene.start('TitleScene');
  }

  private createAnimations(): void {
    // Dino idle / run animation (10 frames)
    this.anims.create({
      key: 'dino-idle-anim',
      frames: this.anims.generateFrameNumbers('dino-idle', { start: 0, end: 9 }),
      frameRate: 10,
      repeat: -1,
    });

    // Dino run (same frames, faster)
    this.anims.create({
      key: 'dino-run-anim',
      frames: this.anims.generateFrameNumbers('dino-idle', { start: 0, end: 9 }),
      frameRate: 16,
      repeat: -1,
    });

    // Dino death (8 frames, plays once)
    this.anims.create({
      key: 'dino-dead-anim',
      frames: this.anims.generateFrameNumbers('dino-dead', { start: 0, end: 7 }),
      frameRate: 10,
      repeat: 0,
    });
  }

  /** Helper: create a Canvas2D context for a new texture */
  private canvas(key: string, w: number, h: number) {
    const ct = this.textures.createCanvas(key, w, h)!;
    return { ctx: ct.context, refresh: () => ct.refresh() };
  }

  private generateAllTextures(): void {
    this.makeRaptorHatchling();
    this.makeRaptorJuvenile();
    this.makeRaptorAdult();
    this.makeGround();
    this.makeHillsFar();
    this.makeHillsNear();
    this.makeBiomeTextures();
    this.makeFoodBug();
    this.makeFoodLizard();
    this.makeFoodFish();
    this.makeFoodEgg();
    this.makeObstacleLog();
    this.makeObstacleBench();
    this.makeHazardCompy();
    this.makeHazardDimorphodon();
    this.makeHazardStegosaurus();
    this.makeHazardDilophosaurus();
    this.makeHazardVenom();
    this.makeHazardAnkylosaurus();
    this.makeHazardParasaurolophus();
    this.makeHazardTrex();
    this.makeHazardPterodactyl();
    this.makeHazardRock();
    this.makeHazardTriceratops();
    this.makeHazardTrap();
    this.makeHazardSpear();
    this.makePlatform();
    this.makeHeart();
  }

  // ================================================================
  //  RAPTOR HATCHLING — baby velociraptor with eggshell fragment
  //  Horizontal posture, long narrow snout, big eye, counterbalancing tail
  // ================================================================
  private makeRaptorHatchling(): void {
    const W = 72, H = 62;
    const { ctx, refresh } = this.canvas('raptor-hatchling', W, H);

    // --- TAIL (long, thin, horizontal for balance) ---
    const tailGradH = ctx.createLinearGradient(0, 22, 0, 32);
    tailGradH.addColorStop(0, '#4a6e30');
    tailGradH.addColorStop(0.5, '#5c8a3e');
    tailGradH.addColorStop(1, '#7aaa58');
    ctx.fillStyle = tailGradH;
    ctx.beginPath();
    ctx.moveTo(18, 22);
    ctx.quadraticCurveTo(12, 20, 6, 19);
    ctx.bezierCurveTo(2, 18, 0, 20, 0, 23);
    ctx.bezierCurveTo(0, 26, 2, 28, 6, 27);
    ctx.quadraticCurveTo(12, 27, 18, 28);
    ctx.closePath();
    ctx.fill();

    // Tail stripes
    ctx.strokeStyle = 'rgba(30, 55, 18, 0.35)';
    ctx.lineWidth = 0.8;
    for (let i = 0; i < 4; i++) {
      const x = 4 + i * 3.5;
      ctx.beginPath();
      ctx.moveTo(x, 19 + i * 0.5);
      ctx.lineTo(x + 0.5, 27 - i * 0.3);
      ctx.stroke();
    }

    // --- BODY (horizontal, lean, forward-leaning posture) ---
    const bodyGrad = ctx.createLinearGradient(20, 10, 20, 36);
    bodyGrad.addColorStop(0, '#3d6028');
    bodyGrad.addColorStop(0.3, '#4a7832');
    bodyGrad.addColorStop(0.6, '#5c8a3e');
    bodyGrad.addColorStop(1, '#8ab668');

    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.moveTo(18, 22);  // tail base top
    ctx.bezierCurveTo(22, 18, 26, 14, 32, 12); // back (nearly horizontal)
    ctx.bezierCurveTo(36, 10, 40, 9, 44, 9);   // shoulder area
    ctx.quadraticCurveTo(46, 10, 46, 14);       // S-curve neck start
    ctx.quadraticCurveTo(44, 22, 42, 28);       // belly front
    ctx.bezierCurveTo(38, 32, 32, 34, 26, 33); // belly underside
    ctx.quadraticCurveTo(22, 32, 18, 28);       // tail base bottom
    ctx.closePath();
    ctx.fill();

    // --- BELLY LIGHT PATCH ---
    ctx.save();
    ctx.globalAlpha = 0.18;
    const bellyGrad = ctx.createLinearGradient(20, 24, 20, 34);
    bellyGrad.addColorStop(0, 'transparent');
    bellyGrad.addColorStop(0.4, '#c8dda8');
    bellyGrad.addColorStop(1, '#c8dda8');
    ctx.fillStyle = bellyGrad;
    ctx.beginPath();
    ctx.moveTo(18, 26);
    ctx.quadraticCurveTo(24, 28, 32, 30);
    ctx.quadraticCurveTo(38, 32, 42, 28);
    ctx.quadraticCurveTo(38, 34, 30, 34);
    ctx.quadraticCurveTo(22, 33, 18, 28);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // --- BACK HIGHLIGHT ---
    ctx.save();
    ctx.globalAlpha = 0.1;
    const topLight = ctx.createLinearGradient(20, 10, 20, 24);
    topLight.addColorStop(0, '#ffffff');
    topLight.addColorStop(0.5, '#ffffff');
    topLight.addColorStop(1, 'transparent');
    ctx.fillStyle = topLight;
    ctx.beginPath();
    ctx.moveTo(18, 22);
    ctx.bezierCurveTo(22, 18, 26, 14, 32, 12);
    ctx.bezierCurveTo(36, 10, 40, 9, 44, 9);
    ctx.quadraticCurveTo(46, 10, 46, 14);
    ctx.quadraticCurveTo(40, 14, 32, 18);
    ctx.quadraticCurveTo(24, 22, 18, 24);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // --- SCALE PATTERN on body ---
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(18, 22);
    ctx.bezierCurveTo(22, 18, 26, 14, 32, 12);
    ctx.bezierCurveTo(36, 10, 40, 9, 44, 9);
    ctx.quadraticCurveTo(46, 10, 46, 14);
    ctx.quadraticCurveTo(44, 22, 42, 28);
    ctx.bezierCurveTo(38, 32, 32, 34, 26, 33);
    ctx.quadraticCurveTo(22, 32, 18, 28);
    ctx.closePath();
    ctx.clip();

    ctx.strokeStyle = 'rgba(35, 65, 22, 0.2)';
    ctx.lineWidth = 0.5;
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 8; col++) {
        const sx = 18 + col * 4 + (row % 2) * 2;
        const sy = 12 + row * 4;
        ctx.beginPath();
        ctx.arc(sx, sy, 1.8, Math.PI * 0.8, Math.PI * 2.2);
        ctx.stroke();
      }
    }
    ctx.restore();

    // --- S-CURVE NECK + HEAD + LONG NARROW SNOUT ---
    const headGrad = ctx.createLinearGradient(44, 0, 44, 20);
    headGrad.addColorStop(0, '#3d6028');
    headGrad.addColorStop(0.4, '#4a7832');
    headGrad.addColorStop(1, '#6a9e4e');

    ctx.fillStyle = headGrad;
    ctx.beginPath();
    ctx.moveTo(44, 9);                          // neck base (at shoulder)
    ctx.bezierCurveTo(46, 6, 47, 3, 49, 1);    // neck curves up
    ctx.quadraticCurveTo(52, -1, 56, -2);       // top of skull
    ctx.bezierCurveTo(60, -2, 64, -1, 67, 1);  // forehead to snout bridge
    ctx.quadraticCurveTo(69, 3, 71, 5);         // snout narrows
    ctx.lineTo(71, 8);                           // snout tip front
    ctx.quadraticCurveTo(68, 9, 64, 10);        // upper jaw line back
    ctx.lineTo(66, 11);                          // jaw hinge
    ctx.quadraticCurveTo(69, 12, 71, 12);        // lower jaw tip
    ctx.quadraticCurveTo(68, 14, 63, 14);        // lower jaw underside
    ctx.bezierCurveTo(58, 15, 53, 16, 49, 16); // throat
    ctx.bezierCurveTo(47, 15, 46, 14, 46, 14); // neck bottom connects to chest
    ctx.closePath();
    ctx.fill();

    // Jaw underside shading
    ctx.fillStyle = 'rgba(30, 55, 20, 0.15)';
    ctx.beginPath();
    ctx.moveTo(64, 10);
    ctx.lineTo(66, 11);
    ctx.quadraticCurveTo(69, 12, 71, 12);
    ctx.quadraticCurveTo(68, 14, 63, 14);
    ctx.quadraticCurveTo(60, 13, 58, 12);
    ctx.closePath();
    ctx.fill();

    // --- NOSTRIL ---
    ctx.fillStyle = 'rgba(28, 48, 18, 0.5)';
    ctx.beginPath();
    ctx.ellipse(69, 4, 1.2, 0.8, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // --- TEETH (small, sharp baby teeth) ---
    this.drawTooth(ctx, 68, 8, 2.2, true);
    this.drawTooth(ctx, 66, 9, 1.8, true);
    this.drawTooth(ctx, 64, 9.5, 1.5, true);
    // Lower teeth
    this.drawTooth(ctx, 68, 12, 1.8, false);
    this.drawTooth(ctx, 66, 12.5, 1.5, false);

    // --- EYE (large relative to head — baby proportions) ---
    this.drawRaptorEye(ctx, 55, 3, 3.8);

    // --- BROW RIDGE (subtle on hatchling) ---
    ctx.strokeStyle = '#3a6228';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(52, 0);
    ctx.quadraticCurveTo(55, -2, 59, -1);
    ctx.stroke();

    // --- HIND LEG (digitigrade) ---
    const legGrad = ctx.createLinearGradient(22, 30, 30, 55);
    legGrad.addColorStop(0, '#4a7832');
    legGrad.addColorStop(1, '#3d6028');
    ctx.fillStyle = legGrad;

    ctx.beginPath();
    ctx.moveTo(24, 30);  // hip joint
    ctx.quadraticCurveTo(28, 32, 30, 38); // thigh
    ctx.quadraticCurveTo(29, 42, 26, 46); // knee
    ctx.lineTo(24, 50);  // ankle
    ctx.lineTo(20, 50);
    ctx.quadraticCurveTo(22, 46, 24, 42); // shin back
    ctx.quadraticCurveTo(22, 36, 20, 32); // thigh back
    ctx.closePath();
    ctx.fill();

    // Hind foot + claws
    this.drawRaptorFoot(ctx, 16, 50, false);

    // --- FRONT LEG ---
    ctx.fillStyle = legGrad;
    ctx.beginPath();
    ctx.moveTo(36, 30);
    ctx.quadraticCurveTo(40, 32, 40, 38);
    ctx.quadraticCurveTo(38, 42, 36, 48);
    ctx.lineTo(34, 50);
    ctx.lineTo(30, 50);
    ctx.quadraticCurveTo(32, 44, 34, 40);
    ctx.quadraticCurveTo(34, 35, 32, 32);
    ctx.closePath();
    ctx.fill();

    // Front foot + claws
    this.drawRaptorFoot(ctx, 26, 50, false);

    // --- TINY ARM (vestigial) ---
    ctx.fillStyle = '#5a8a40';
    ctx.beginPath();
    ctx.moveTo(46, 13);
    ctx.quadraticCurveTo(48, 15, 47, 19);
    ctx.lineTo(45, 19);
    ctx.quadraticCurveTo(44, 15, 44, 13);
    ctx.closePath();
    ctx.fill();
    // Arm claw
    ctx.fillStyle = '#888';
    ctx.beginPath();
    ctx.moveTo(45, 19);
    ctx.lineTo(47, 19);
    ctx.lineTo(46, 22);
    ctx.closePath();
    ctx.fill();

    // --- EGG SHELL fragment on head ---
    ctx.fillStyle = '#f5f0e0';
    ctx.strokeStyle = '#c8c0a8';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(51, 0);
    ctx.lineTo(53, -6);
    ctx.lineTo(58, -4);
    ctx.lineTo(58, -1);
    ctx.quadraticCurveTo(56, 1, 52, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Crack lines
    ctx.strokeStyle = 'rgba(150, 140, 120, 0.5)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(54, -5);
    ctx.lineTo(56, -2);
    ctx.lineTo(55, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(56, -4);
    ctx.lineTo(57, -2);
    ctx.stroke();

    // --- BACK STRIPE PATTERN (subtle juvenile markings) ---
    ctx.strokeStyle = 'rgba(30, 50, 18, 0.25)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const x = 22 + i * 4.5;
      const y = 14 - i * 0.8;
      ctx.beginPath();
      ctx.moveTo(x, y + 2);
      ctx.lineTo(x + 2, y);
      ctx.stroke();
    }

    // --- BODY OUTLINE for definition ---
    ctx.strokeStyle = 'rgba(28, 50, 16, 0.3)';
    ctx.lineWidth = 0.7;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(0, 23);
    ctx.quadraticCurveTo(6, 19, 12, 20);
    ctx.quadraticCurveTo(18, 18, 26, 14);
    ctx.bezierCurveTo(32, 12, 38, 10, 44, 9);
    ctx.bezierCurveTo(46, 6, 48, 2, 52, -1);
    ctx.quadraticCurveTo(60, -2, 67, 1);
    ctx.quadraticCurveTo(70, 3, 71, 5);
    ctx.stroke();

    refresh();
  }

  // ================================================================
  //  RAPTOR JUVENILE — bigger, fiercer, feathered crest
  //  More muscular build, prominent snout, visible teeth, bigger claws
  // ================================================================
  private makeRaptorJuvenile(): void {
    const W = 92, H = 82;
    const { ctx, refresh } = this.canvas('raptor-juvenile', W, H);

    // --- TAIL (long, thick, stiff for balance) ---
    const tailGradJ = ctx.createLinearGradient(0, 24, 0, 38);
    tailGradJ.addColorStop(0, '#3a6022');
    tailGradJ.addColorStop(0.5, '#4a7830');
    tailGradJ.addColorStop(1, '#6a9a4e');
    ctx.fillStyle = tailGradJ;
    ctx.beginPath();
    ctx.moveTo(20, 26);
    ctx.quadraticCurveTo(12, 23, 6, 22);
    ctx.bezierCurveTo(2, 21, 0, 24, 0, 28);
    ctx.bezierCurveTo(0, 32, 2, 35, 6, 34);
    ctx.quadraticCurveTo(12, 34, 20, 34);
    ctx.closePath();
    ctx.fill();

    // Tail stripes (darker bands)
    ctx.strokeStyle = 'rgba(25, 48, 14, 0.35)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const x = 3 + i * 3.8;
      ctx.beginPath();
      ctx.moveTo(x, 22 + i * 0.5);
      ctx.lineTo(x + 0.5, 34 - i * 0.4);
      ctx.stroke();
    }

    // --- BODY (horizontal, muscular, forward-leaning) ---
    const bodyGrad = ctx.createLinearGradient(24, 8, 24, 46);
    bodyGrad.addColorStop(0, '#2d5518');
    bodyGrad.addColorStop(0.3, '#3d6e28');
    bodyGrad.addColorStop(0.6, '#4a8836');
    bodyGrad.addColorStop(1, '#78b458');

    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.moveTo(20, 26);  // tail base top
    ctx.bezierCurveTo(26, 20, 32, 14, 40, 10); // back line (horizontal)
    ctx.bezierCurveTo(46, 8, 52, 6, 56, 6);    // shoulder hump
    ctx.quadraticCurveTo(58, 8, 58, 14);        // S-curve neck start
    ctx.quadraticCurveTo(56, 26, 52, 36);       // chest / belly front
    ctx.bezierCurveTo(46, 42, 36, 44, 28, 42); // belly underside
    ctx.quadraticCurveTo(24, 40, 20, 34);       // tail base bottom
    ctx.closePath();
    ctx.fill();

    // Belly light patch
    ctx.save();
    ctx.globalAlpha = 0.15;
    const bellyGradJ = ctx.createLinearGradient(24, 32, 24, 44);
    bellyGradJ.addColorStop(0, 'transparent');
    bellyGradJ.addColorStop(0.4, '#b8d098');
    bellyGradJ.addColorStop(1, '#b8d098');
    ctx.fillStyle = bellyGradJ;
    ctx.beginPath();
    ctx.moveTo(20, 32);
    ctx.quadraticCurveTo(30, 36, 40, 38);
    ctx.quadraticCurveTo(48, 40, 52, 36);
    ctx.quadraticCurveTo(46, 44, 34, 44);
    ctx.quadraticCurveTo(24, 42, 20, 34);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Back highlight
    ctx.save();
    ctx.globalAlpha = 0.1;
    const topLight = ctx.createLinearGradient(24, 6, 24, 22);
    topLight.addColorStop(0, '#fff');
    topLight.addColorStop(0.4, '#fff');
    topLight.addColorStop(1, 'transparent');
    ctx.fillStyle = topLight;
    ctx.beginPath();
    ctx.moveTo(20, 26);
    ctx.bezierCurveTo(26, 20, 32, 14, 40, 10);
    ctx.bezierCurveTo(46, 8, 52, 6, 56, 6);
    ctx.quadraticCurveTo(58, 8, 58, 14);
    ctx.quadraticCurveTo(50, 12, 40, 16);
    ctx.quadraticCurveTo(28, 22, 20, 28);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Scale pattern
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(20, 26);
    ctx.bezierCurveTo(26, 20, 32, 14, 40, 10);
    ctx.bezierCurveTo(46, 8, 52, 6, 56, 6);
    ctx.quadraticCurveTo(58, 8, 58, 14);
    ctx.quadraticCurveTo(56, 26, 52, 36);
    ctx.bezierCurveTo(46, 42, 36, 44, 28, 42);
    ctx.quadraticCurveTo(24, 40, 20, 34);
    ctx.closePath();
    ctx.clip();

    ctx.strokeStyle = 'rgba(28, 58, 18, 0.18)';
    ctx.lineWidth = 0.5;
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 12; col++) {
        const sx = 18 + col * 4 + (row % 2) * 2;
        const sy = 8 + row * 4;
        ctx.beginPath();
        ctx.arc(sx, sy, 2, Math.PI * 0.8, Math.PI * 2.2);
        ctx.stroke();
      }
    }
    ctx.restore();

    // --- S-CURVE NECK + HEAD + LONG SNOUT ---
    const headGrad = ctx.createLinearGradient(56, -4, 56, 26);
    headGrad.addColorStop(0, '#2d5518');
    headGrad.addColorStop(0.35, '#3d6e28');
    headGrad.addColorStop(1, '#5a9240');

    ctx.fillStyle = headGrad;
    ctx.beginPath();
    ctx.moveTo(56, 6);                           // neck base
    ctx.bezierCurveTo(58, 2, 60, -2, 62, -4);   // S-curve neck up
    // Long narrow skull
    ctx.quadraticCurveTo(66, -6, 70, -6);        // top of skull
    ctx.bezierCurveTo(74, -6, 78, -5, 82, -2);  // forehead
    ctx.quadraticCurveTo(86, 1, 89, 5);          // snout bridge
    ctx.lineTo(90, 9);                            // snout tip front (narrow)
    // Upper jaw line back
    ctx.quadraticCurveTo(86, 11, 80, 12);
    // Jaw gap
    ctx.lineTo(82, 13);                           // jaw hinge
    ctx.quadraticCurveTo(87, 15, 90, 16);         // lower jaw tip
    ctx.quadraticCurveTo(86, 19, 78, 19);         // lower jaw underside
    ctx.bezierCurveTo(70, 20, 64, 21, 60, 20);  // throat
    ctx.bezierCurveTo(58, 18, 58, 14, 58, 14);  // neck bottom
    ctx.closePath();
    ctx.fill();

    // Jaw underside shading
    ctx.fillStyle = 'rgba(25, 50, 16, 0.2)';
    ctx.beginPath();
    ctx.moveTo(80, 12);
    ctx.lineTo(82, 13);
    ctx.quadraticCurveTo(87, 15, 90, 16);
    ctx.quadraticCurveTo(86, 19, 78, 19);
    ctx.quadraticCurveTo(72, 18, 68, 16);
    ctx.closePath();
    ctx.fill();

    // Nostril
    ctx.fillStyle = 'rgba(22, 40, 14, 0.5)';
    ctx.beginPath();
    ctx.ellipse(87, 3, 1.8, 1, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // --- TEETH (prominent, many visible) ---
    this.drawTooth(ctx, 87, 9, 3.5, true);
    this.drawTooth(ctx, 84, 10, 3, true);
    this.drawTooth(ctx, 81, 11, 2.5, true);
    this.drawTooth(ctx, 78, 11.5, 2, true);
    // Lower jaw
    this.drawTooth(ctx, 87, 16, 3, false);
    this.drawTooth(ctx, 84, 16.5, 2.5, false);
    this.drawTooth(ctx, 81, 17, 2, false);

    // --- EYE ---
    this.drawRaptorEye(ctx, 70, -1, 4.5);

    // --- BROW RIDGE (fierce, angular) ---
    ctx.strokeStyle = '#2d5518';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(65, -4);
    ctx.quadraticCurveTo(70, -7, 76, -5);
    ctx.stroke();
    ctx.lineCap = 'butt';

    // --- FEATHER CREST (prominent) ---
    const crests = [
      { x: 58, y: -2, h: 11 },
      { x: 62, y: -4, h: 14 },
      { x: 66, y: -5, h: 15 },
      { x: 70, y: -6, h: 14 },
      { x: 74, y: -5, h: 12 },
    ];
    for (const c of crests) {
      const cGrad = ctx.createLinearGradient(c.x, c.y - c.h, c.x, c.y);
      cGrad.addColorStop(0, '#8b3a10');
      cGrad.addColorStop(0.5, '#a85520');
      cGrad.addColorStop(1, '#3d6e28');
      ctx.fillStyle = cGrad;
      ctx.beginPath();
      ctx.moveTo(c.x - 1.5, c.y);
      ctx.quadraticCurveTo(c.x, c.y - c.h * 0.8, c.x + 1, c.y - c.h);
      ctx.quadraticCurveTo(c.x + 2, c.y - c.h * 0.8, c.x + 2.5, c.y);
      ctx.closePath();
      ctx.fill();
    }

    // --- BACK STRIPE PATTERN ---
    ctx.strokeStyle = 'rgba(22, 45, 12, 0.28)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 7; i++) {
      const x = 24 + i * 5;
      const y = 16 - i * 1.2;
      ctx.beginPath();
      ctx.moveTo(x, y + 3);
      ctx.lineTo(x + 3, y);
      ctx.stroke();
    }

    // --- HIND LEG (muscular, powerful) ---
    const legGrad = ctx.createLinearGradient(26, 38, 36, 72);
    legGrad.addColorStop(0, '#3d6e28');
    legGrad.addColorStop(1, '#2d5518');
    ctx.fillStyle = legGrad;

    ctx.beginPath();
    ctx.moveTo(28, 40);  // hip
    ctx.quadraticCurveTo(34, 42, 38, 50); // thigh outer (muscular)
    ctx.quadraticCurveTo(36, 58, 32, 64); // shin
    ctx.lineTo(30, 68);  // ankle
    ctx.lineTo(24, 68);
    ctx.quadraticCurveTo(28, 60, 30, 54); // shin inner
    ctx.quadraticCurveTo(28, 46, 24, 42); // thigh inner
    ctx.closePath();
    ctx.fill();

    // Thigh muscle highlight
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.beginPath();
    ctx.ellipse(32, 48, 4, 6, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Hind foot
    this.drawRaptorFoot(ctx, 20, 68, true);

    // --- FRONT LEG ---
    ctx.fillStyle = legGrad;
    ctx.beginPath();
    ctx.moveTo(42, 38);
    ctx.quadraticCurveTo(48, 40, 48, 50);
    ctx.quadraticCurveTo(46, 56, 42, 64);
    ctx.lineTo(40, 68);
    ctx.lineTo(36, 68);
    ctx.quadraticCurveTo(38, 60, 40, 54);
    ctx.quadraticCurveTo(40, 46, 38, 40);
    ctx.closePath();
    ctx.fill();

    // Front foot
    this.drawRaptorFoot(ctx, 32, 68, true);

    // --- ARMS (small but with visible claws) ---
    ctx.fillStyle = '#4a8030';
    ctx.beginPath();
    ctx.moveTo(58, 16);
    ctx.quadraticCurveTo(61, 20, 60, 26);
    ctx.lineTo(57, 26);
    ctx.quadraticCurveTo(56, 20, 56, 16);
    ctx.closePath();
    ctx.fill();
    // Arm claws (two visible)
    ctx.fillStyle = '#888';
    ctx.beginPath();
    ctx.moveTo(57, 26); ctx.lineTo(60, 26); ctx.lineTo(58, 30); ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(56, 25); ctx.lineTo(58, 25); ctx.lineTo(56, 29); ctx.closePath();
    ctx.fill();

    // --- OUTLINE ---
    ctx.strokeStyle = 'rgba(18, 40, 10, 0.28)';
    ctx.lineWidth = 0.8;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(0, 28);
    ctx.quadraticCurveTo(6, 22, 14, 23);
    ctx.quadraticCurveTo(20, 20, 30, 14);
    ctx.bezierCurveTo(38, 10, 48, 7, 56, 6);
    ctx.bezierCurveTo(58, 2, 60, -2, 64, -5);
    ctx.quadraticCurveTo(74, -6, 82, -2);
    ctx.quadraticCurveTo(87, 2, 90, 5);
    ctx.stroke();

    refresh();
  }

  // ================================================================
  //  RAPTOR ADULT — full-grown velociraptor, the "final form"
  //  Powerful build, long tail, huge killing claws, feather crest,
  //  many teeth, dark saturated green, fierce brow ridges
  // ================================================================
  private makeRaptorAdult(): void {
    const W = 110, H = 96;
    const { ctx, refresh } = this.canvas('raptor-adult', W, H);

    // --- TAIL (very long, thick, stiff counterbalance) ---
    const tailGradA = ctx.createLinearGradient(0, 26, 0, 42);
    tailGradA.addColorStop(0, '#2a4e14');
    tailGradA.addColorStop(0.4, '#3a6420');
    tailGradA.addColorStop(1, '#5a8a3a');
    ctx.fillStyle = tailGradA;
    ctx.beginPath();
    ctx.moveTo(24, 28);
    ctx.quadraticCurveTo(16, 24, 8, 22);
    ctx.bezierCurveTo(3, 21, 0, 24, 0, 28);
    ctx.bezierCurveTo(0, 34, 3, 38, 8, 37);
    ctx.quadraticCurveTo(16, 37, 24, 38);
    ctx.closePath();
    ctx.fill();

    // Tail stripes (darker bands)
    ctx.strokeStyle = 'rgba(18, 38, 10, 0.35)';
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 6; i++) {
      const x = 3 + i * 3.5;
      ctx.beginPath();
      ctx.moveTo(x, 22 + i * 0.6);
      ctx.lineTo(x + 0.5, 37 - i * 0.5);
      ctx.stroke();
    }

    // Tail dorsal ridge
    ctx.strokeStyle = 'rgba(20, 40, 12, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(24, 28);
    ctx.bezierCurveTo(16, 24, 8, 22, 2, 24);
    ctx.stroke();

    // --- BODY (massive horizontal torso) ---
    const bodyGrad = ctx.createLinearGradient(30, 6, 30, 52);
    bodyGrad.addColorStop(0, '#1e4210');
    bodyGrad.addColorStop(0.25, '#2a5816');
    bodyGrad.addColorStop(0.5, '#3a6e24');
    bodyGrad.addColorStop(0.8, '#4a8832');
    bodyGrad.addColorStop(1, '#6aaa4a');

    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.moveTo(24, 28);   // tail base top
    ctx.bezierCurveTo(30, 22, 38, 14, 48, 10); // back (horizontal, powerful)
    ctx.bezierCurveTo(56, 7, 62, 5, 68, 5);    // shoulder hump (muscular)
    ctx.quadraticCurveTo(70, 7, 70, 14);        // S-curve neck start
    ctx.quadraticCurveTo(68, 28, 64, 40);       // chest / belly front
    ctx.bezierCurveTo(56, 48, 44, 50, 34, 48); // belly underside
    ctx.quadraticCurveTo(28, 46, 24, 38);       // tail base bottom
    ctx.closePath();
    ctx.fill();

    // Belly light patch (countershading)
    ctx.save();
    ctx.globalAlpha = 0.16;
    const bellyGradA = ctx.createLinearGradient(30, 36, 30, 50);
    bellyGradA.addColorStop(0, 'transparent');
    bellyGradA.addColorStop(0.3, '#a8c888');
    bellyGradA.addColorStop(1, '#a8c888');
    ctx.fillStyle = bellyGradA;
    ctx.beginPath();
    ctx.moveTo(24, 36);
    ctx.quadraticCurveTo(34, 40, 46, 44);
    ctx.quadraticCurveTo(56, 46, 64, 40);
    ctx.quadraticCurveTo(56, 50, 40, 50);
    ctx.quadraticCurveTo(28, 48, 24, 38);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Back highlight
    ctx.save();
    ctx.globalAlpha = 0.08;
    const topLightA = ctx.createLinearGradient(30, 5, 30, 24);
    topLightA.addColorStop(0, '#fff');
    topLightA.addColorStop(0.4, '#fff');
    topLightA.addColorStop(1, 'transparent');
    ctx.fillStyle = topLightA;
    ctx.beginPath();
    ctx.moveTo(24, 28);
    ctx.bezierCurveTo(30, 22, 38, 14, 48, 10);
    ctx.bezierCurveTo(56, 7, 62, 5, 68, 5);
    ctx.quadraticCurveTo(70, 7, 70, 14);
    ctx.quadraticCurveTo(60, 12, 48, 16);
    ctx.quadraticCurveTo(34, 22, 24, 30);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Scale pattern (larger, more defined)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(24, 28);
    ctx.bezierCurveTo(30, 22, 38, 14, 48, 10);
    ctx.bezierCurveTo(56, 7, 62, 5, 68, 5);
    ctx.quadraticCurveTo(70, 7, 70, 14);
    ctx.quadraticCurveTo(68, 28, 64, 40);
    ctx.bezierCurveTo(56, 48, 44, 50, 34, 48);
    ctx.quadraticCurveTo(28, 46, 24, 38);
    ctx.closePath();
    ctx.clip();

    ctx.strokeStyle = 'rgba(20, 48, 12, 0.16)';
    ctx.lineWidth = 0.6;
    for (let row = 0; row < 12; row++) {
      for (let col = 0; col < 14; col++) {
        const sx = 22 + col * 4 + (row % 2) * 2;
        const sy = 8 + row * 4;
        ctx.beginPath();
        ctx.arc(sx, sy, 2.2, Math.PI * 0.8, Math.PI * 2.2);
        ctx.stroke();
      }
    }
    ctx.restore();

    // --- BACK STRIPE PATTERN (dark chevrons) ---
    ctx.strokeStyle = 'rgba(16, 36, 8, 0.25)';
    ctx.lineWidth = 1.8;
    for (let i = 0; i < 9; i++) {
      const x = 28 + i * 5;
      const y = 18 - i * 1.2;
      ctx.beginPath();
      ctx.moveTo(x, y + 4);
      ctx.lineTo(x + 3, y);
      ctx.stroke();
    }

    // --- S-CURVE NECK + HEAD + LONG POWERFUL SNOUT ---
    const headGrad = ctx.createLinearGradient(68, -8, 68, 28);
    headGrad.addColorStop(0, '#1e4210');
    headGrad.addColorStop(0.3, '#2a5816');
    headGrad.addColorStop(0.7, '#3a6e24');
    headGrad.addColorStop(1, '#4a8832');

    ctx.fillStyle = headGrad;
    ctx.beginPath();
    ctx.moveTo(68, 5);                            // neck base
    ctx.bezierCurveTo(70, 0, 72, -4, 74, -6);    // S-curve neck up
    // Long powerful skull
    ctx.quadraticCurveTo(78, -9, 82, -10);         // top of skull
    ctx.bezierCurveTo(86, -10, 90, -9, 95, -5);   // forehead
    ctx.quadraticCurveTo(100, -1, 104, 4);         // snout bridge
    ctx.lineTo(106, 9);                             // snout tip (narrow, powerful)
    // Upper jaw line back
    ctx.quadraticCurveTo(102, 11, 96, 13);
    // Jaw gap (mouth open showing teeth)
    ctx.lineTo(98, 14);                             // jaw hinge
    ctx.quadraticCurveTo(103, 16, 106, 17);         // lower jaw tip
    ctx.quadraticCurveTo(102, 21, 94, 22);          // lower jaw underside
    ctx.bezierCurveTo(86, 24, 78, 25, 74, 24);    // throat
    ctx.bezierCurveTo(72, 22, 70, 18, 70, 14);    // neck bottom
    ctx.closePath();
    ctx.fill();

    // Jaw underside shading
    ctx.fillStyle = 'rgba(18, 40, 12, 0.22)';
    ctx.beginPath();
    ctx.moveTo(96, 13);
    ctx.lineTo(98, 14);
    ctx.quadraticCurveTo(103, 16, 106, 17);
    ctx.quadraticCurveTo(102, 21, 94, 22);
    ctx.quadraticCurveTo(88, 20, 84, 18);
    ctx.closePath();
    ctx.fill();

    // Head top highlight
    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(78, -9);
    ctx.quadraticCurveTo(86, -10, 92, -7);
    ctx.quadraticCurveTo(96, -4, 100, 0);
    ctx.quadraticCurveTo(94, -2, 86, -6);
    ctx.quadraticCurveTo(82, -8, 78, -8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Nostril
    ctx.fillStyle = 'rgba(16, 34, 10, 0.55)';
    ctx.beginPath();
    ctx.ellipse(102, 2, 2, 1.2, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // --- TEETH (many, prominent, fearsome) ---
    // Upper jaw
    this.drawTooth(ctx, 103, 9, 4, true);
    this.drawTooth(ctx, 100, 10, 3.5, true);
    this.drawTooth(ctx, 97, 11, 3, true);
    this.drawTooth(ctx, 94, 12, 2.8, true);
    this.drawTooth(ctx, 91, 12.5, 2.5, true);
    // Lower jaw
    this.drawTooth(ctx, 103, 17, 3.5, false);
    this.drawTooth(ctx, 100, 17.5, 3, false);
    this.drawTooth(ctx, 97, 18, 2.8, false);
    this.drawTooth(ctx, 94, 18.5, 2.5, false);

    // --- EYE (intense, forward-facing) ---
    this.drawRaptorEye(ctx, 82, -3, 5);

    // --- BROW RIDGES (very fierce, angular) ---
    ctx.strokeStyle = '#1e4210';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(77, -7);
    ctx.quadraticCurveTo(82, -11, 88, -8);
    ctx.stroke();
    // Second subtle ridge line for depth
    ctx.strokeStyle = 'rgba(30, 66, 16, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(78, -5);
    ctx.quadraticCurveTo(82, -8, 87, -6);
    ctx.stroke();
    ctx.lineCap = 'butt';

    // --- FEATHER CREST (tall, reddish-brown, impressive) ---
    const crestFeathers = [
      { x: 70, y: -4, h: 13 },
      { x: 74, y: -7, h: 17 },
      { x: 78, y: -9, h: 20 },
      { x: 82, y: -10, h: 21 },
      { x: 86, y: -9, h: 19 },
      { x: 90, y: -8, h: 15 },
    ];
    for (const c of crestFeathers) {
      const cGrad = ctx.createLinearGradient(c.x, c.y - c.h, c.x, c.y);
      cGrad.addColorStop(0, '#7a2a08');
      cGrad.addColorStop(0.3, '#9b4418');
      cGrad.addColorStop(0.7, '#a85520');
      cGrad.addColorStop(1, '#2a5816');
      ctx.fillStyle = cGrad;
      ctx.beginPath();
      ctx.moveTo(c.x - 2, c.y);
      ctx.quadraticCurveTo(c.x - 0.5, c.y - c.h * 0.7, c.x + 1, c.y - c.h);
      ctx.quadraticCurveTo(c.x + 2.5, c.y - c.h * 0.7, c.x + 3, c.y);
      ctx.closePath();
      ctx.fill();
    }

    // Feather barb lines on crest
    ctx.strokeStyle = 'rgba(100, 50, 20, 0.2)';
    ctx.lineWidth = 0.4;
    for (const c of crestFeathers) {
      ctx.beginPath();
      ctx.moveTo(c.x + 0.5, c.y - c.h * 0.9);
      ctx.lineTo(c.x + 0.5, c.y - 2);
      ctx.stroke();
    }

    // --- HIND LEG (massive, powerful digitigrade) ---
    const legGrad = ctx.createLinearGradient(30, 44, 42, 82);
    legGrad.addColorStop(0, '#2a5816');
    legGrad.addColorStop(1, '#1e4210');
    ctx.fillStyle = legGrad;

    ctx.beginPath();
    ctx.moveTo(34, 44);   // hip
    ctx.quadraticCurveTo(42, 46, 46, 56); // thigh outer (very muscular)
    ctx.quadraticCurveTo(44, 64, 38, 72); // shin
    ctx.lineTo(36, 78);   // ankle
    ctx.lineTo(28, 78);
    ctx.quadraticCurveTo(34, 68, 36, 60); // shin inner
    ctx.quadraticCurveTo(34, 52, 28, 46); // thigh inner
    ctx.closePath();
    ctx.fill();

    // Thigh muscle highlights
    ctx.fillStyle = 'rgba(255,255,255,0.07)';
    ctx.beginPath();
    ctx.ellipse(38, 54, 5, 7, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    ctx.beginPath();
    ctx.ellipse(36, 50, 3, 4, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Hind foot (huge killing claw)
    this.drawRaptorFoot(ctx, 22, 78, true);

    // --- FRONT LEG ---
    ctx.fillStyle = legGrad;
    ctx.beginPath();
    ctx.moveTo(52, 42);
    ctx.quadraticCurveTo(58, 44, 58, 56);
    ctx.quadraticCurveTo(56, 64, 50, 72);
    ctx.lineTo(48, 78);
    ctx.lineTo(42, 78);
    ctx.quadraticCurveTo(46, 68, 48, 60);
    ctx.quadraticCurveTo(48, 50, 46, 44);
    ctx.closePath();
    ctx.fill();

    // Front foot
    this.drawRaptorFoot(ctx, 36, 78, true);

    // --- ARMS (small but with wicked claws) ---
    ctx.fillStyle = '#3a6420';
    ctx.beginPath();
    ctx.moveTo(70, 16);
    ctx.quadraticCurveTo(73, 20, 72, 28);
    ctx.lineTo(69, 28);
    ctx.quadraticCurveTo(68, 20, 68, 16);
    ctx.closePath();
    ctx.fill();
    // Arm claws (two sharp ones)
    ctx.fillStyle = '#777';
    ctx.beginPath();
    ctx.moveTo(69, 28); ctx.lineTo(72, 28); ctx.lineTo(70, 33); ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(68, 27); ctx.lineTo(70, 27); ctx.lineTo(68, 32); ctx.closePath();
    ctx.fill();

    // --- OUTLINE for definition ---
    ctx.strokeStyle = 'rgba(14, 32, 8, 0.25)';
    ctx.lineWidth = 0.9;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(0, 28);
    ctx.bezierCurveTo(6, 22, 14, 22, 20, 24);
    ctx.quadraticCurveTo(24, 22, 34, 16);
    ctx.bezierCurveTo(44, 10, 56, 6, 68, 5);
    ctx.bezierCurveTo(70, 0, 72, -4, 76, -8);
    ctx.quadraticCurveTo(82, -10, 90, -8);
    ctx.quadraticCurveTo(98, -2, 104, 4);
    ctx.lineTo(106, 9);
    ctx.stroke();

    // Lower outline
    ctx.beginPath();
    ctx.moveTo(0, 34);
    ctx.bezierCurveTo(6, 37, 14, 37, 20, 36);
    ctx.quadraticCurveTo(24, 38, 30, 44);
    ctx.stroke();

    refresh();
  }

  // ================================================================
  //  SHARED RAPTOR HELPERS
  // ================================================================

  /** Draw a raptor eye with radial gradient iris and slit pupil */
  private drawRaptorEye(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
    // White sclera
    ctx.fillStyle = '#e8e0cc';
    ctx.beginPath();
    ctx.ellipse(x, y, r * 1.1, r * 0.9, 0, 0, Math.PI * 2);
    ctx.fill();

    // Iris gradient (amber)
    const irisGrad = ctx.createRadialGradient(x, y, 0, x, y, r * 0.85);
    irisGrad.addColorStop(0, '#ffdd44');
    irisGrad.addColorStop(0.4, '#ddaa00');
    irisGrad.addColorStop(0.8, '#aa7700');
    irisGrad.addColorStop(1, '#774400');
    ctx.fillStyle = irisGrad;
    ctx.beginPath();
    ctx.arc(x, y, r * 0.85, 0, Math.PI * 2);
    ctx.fill();

    // Slit pupil
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.ellipse(x + 0.3, y, r * 0.18, r * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eye shine (top-left highlight)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.beginPath();
    ctx.arc(x - r * 0.3, y - r * 0.25, r * 0.22, 0, Math.PI * 2);
    ctx.fill();

    // Thin dark outline
    ctx.strokeStyle = 'rgba(30, 20, 0, 0.5)';
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.ellipse(x, y, r * 1.1, r * 0.9, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  /** Draw a small pointed tooth */
  private drawTooth(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, pointDown: boolean): void {
    ctx.fillStyle = '#eeeedd';
    ctx.beginPath();
    if (pointDown) {
      ctx.moveTo(x - 1, y);
      ctx.lineTo(x + 1, y);
      ctx.lineTo(x, y + h);
    } else {
      ctx.moveTo(x - 1, y);
      ctx.lineTo(x + 1, y);
      ctx.lineTo(x, y - h);
    }
    ctx.closePath();
    ctx.fill();
  }

  /** Draw a raptor foot with claws */
  private drawRaptorFoot(ctx: CanvasRenderingContext2D, x: number, y: number, large: boolean): void {
    const s = large ? 1.3 : 1;

    // Three toes spreading forward
    ctx.fillStyle = '#3a6828';
    // Center toe
    ctx.beginPath();
    ctx.moveTo(x + 4 * s, y);
    ctx.lineTo(x + 6 * s, y);
    ctx.lineTo(x + 10 * s, y + 4 * s);
    ctx.lineTo(x + 3 * s, y + 2 * s);
    ctx.closePath();
    ctx.fill();
    // Outer toe
    ctx.beginPath();
    ctx.moveTo(x + 6 * s, y);
    ctx.lineTo(x + 8 * s, y);
    ctx.lineTo(x + 14 * s, y + 2 * s);
    ctx.lineTo(x + 8 * s, y + 2 * s);
    ctx.closePath();
    ctx.fill();
    // Inner toe (with the big killing claw!)
    ctx.beginPath();
    ctx.moveTo(x + 2 * s, y);
    ctx.lineTo(x + 4 * s, y);
    ctx.lineTo(x + 2 * s, y + 4 * s);
    ctx.lineTo(x, y + 2 * s);
    ctx.closePath();
    ctx.fill();

    // Claw tips (light gray, sharp)
    ctx.fillStyle = '#999';
    ctx.beginPath();
    ctx.moveTo(x + 10 * s, y + 4 * s);
    ctx.lineTo(x + 12 * s, y + 5 * s);
    ctx.lineTo(x + 9 * s, y + 4 * s);
    ctx.fill();
    // Killing claw (bigger, curved)
    ctx.fillStyle = '#888';
    ctx.beginPath();
    ctx.moveTo(x + 2 * s, y + 4 * s);
    ctx.quadraticCurveTo(x - 1 * s, y + 6 * s, x, y + 8 * s);
    ctx.lineTo(x + 2 * s, y + 6 * s);
    ctx.closePath();
    ctx.fill();
  }

  // ================================================================
  //  GROUND — layered earth with grass blades
  // ================================================================
  private makeGround(): void {
    const w = 128, h = 76;
    const { ctx, refresh } = this.canvas('ground-jungle', w, h);

    // Dark, rich jungle floor — humus and wet earth
    const dirtGrad = ctx.createLinearGradient(0, 8, 0, h);
    dirtGrad.addColorStop(0, '#3a2a12');
    dirtGrad.addColorStop(0.1, '#4a3418');
    dirtGrad.addColorStop(0.3, '#55381a');
    dirtGrad.addColorStop(0.6, '#4a3015');
    dirtGrad.addColorStop(0.85, '#3a2510');
    dirtGrad.addColorStop(1, '#2a1a0a');
    ctx.fillStyle = dirtGrad;
    ctx.fillRect(0, 0, w, h);

    // Damp patches — darker wet spots in the soil
    ctx.fillStyle = 'rgba(20, 12, 5, 0.25)';
    const wetSpots = [
      { x: 20, y: 32, rx: 10, ry: 5 }, { x: 65, y: 50, rx: 12, ry: 4 },
      { x: 105, y: 38, rx: 8, ry: 5 }, { x: 42, y: 62, rx: 14, ry: 4 },
    ];
    for (const ws of wetSpots) {
      ctx.beginPath();
      ctx.ellipse(ws.x, ws.y, ws.rx, ws.ry, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Organic debris — decomposing matter, tiny particles
    for (let i = 0; i < 40; i++) {
      const dx = (i * 29 + 7) % w;
      const dy = 14 + (i * 17 + 3) % (h - 18);
      const shade = 40 + (i * 11) % 35;
      const isLeafy = i % 5 === 0;
      if (isLeafy) {
        ctx.fillStyle = `rgba(${shade + 20}, ${shade + 10}, ${shade - 15}, 0.3)`;
        ctx.beginPath();
        ctx.ellipse(dx, dy, 2 + (i % 3), 1, i * 1.1, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = `rgba(${shade}, ${shade * 0.6}, ${shade * 0.3}, 0.3)`;
        ctx.beginPath();
        ctx.arc(dx, dy, 0.6 + (i % 3) * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Exposed surface roots — thick, winding, partially buried
    ctx.lineCap = 'round';
    const roots = [
      { x: 5, y: 18, segs: [[12, 20], [22, 16], [34, 19], [42, 15]] },
      { x: 55, y: 22, segs: [[62, 19], [70, 23], [80, 18]] },
      { x: 88, y: 16, segs: [[96, 20], [108, 15], [118, 18], [126, 14]] },
      { x: 30, y: 40, segs: [[38, 38], [48, 42], [55, 37]] },
      { x: 72, y: 45, segs: [[82, 42], [90, 47], [100, 43]] },
    ];
    for (const root of roots) {
      // Root shadow
      ctx.strokeStyle = 'rgba(15, 8, 2, 0.3)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(root.x, root.y + 1);
      for (const [sx, sy] of root.segs) ctx.lineTo(sx, sy + 1);
      ctx.stroke();
      // Root body
      const rg = ctx.createLinearGradient(root.x, root.y - 2, root.x, root.y + 3);
      rg.addColorStop(0, '#5a4020');
      rg.addColorStop(0.5, '#4a3218');
      rg.addColorStop(1, '#3a2410');
      ctx.strokeStyle = rg;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(root.x, root.y);
      for (const [sx, sy] of root.segs) ctx.lineTo(sx, sy);
      ctx.stroke();
      // Root highlight
      ctx.strokeStyle = 'rgba(90, 70, 40, 0.2)';
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(root.x, root.y - 1);
      for (const [sx, sy] of root.segs) ctx.lineTo(sx, sy - 1);
      ctx.stroke();
    }

    // Fallen leaves — various tropical shapes and decay stages
    const leaves = [
      { x: 8, y: 26, r: 0.3, c: '#6a5020', s: 3.5 },
      { x: 28, y: 48, r: 1.2, c: '#7a6028', s: 4 },
      { x: 50, y: 22, r: 2.0, c: '#5a4a18', s: 3 },
      { x: 70, y: 55, r: 0.7, c: '#8a6830', s: 4.5 },
      { x: 95, y: 30, r: 1.8, c: '#6a5520', s: 3.5 },
      { x: 112, y: 45, r: 0.5, c: '#7a5a22', s: 3 },
      { x: 38, y: 34, r: 2.5, c: '#4a3a12', s: 3.5 },
      { x: 82, y: 42, r: 1.0, c: '#6a5828', s: 4 },
      { x: 18, y: 58, r: 1.5, c: '#5a4818', s: 3 },
      { x: 120, y: 28, r: 0.8, c: '#7a6830', s: 3.5 },
    ];
    for (const l of leaves) {
      ctx.save();
      ctx.translate(l.x, l.y);
      ctx.rotate(l.r);
      ctx.fillStyle = l.c;
      ctx.beginPath();
      ctx.ellipse(0, 0, l.s, l.s * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();
      // Leaf vein
      ctx.strokeStyle = 'rgba(40, 30, 10, 0.3)';
      ctx.lineWidth = 0.4;
      ctx.beginPath();
      ctx.moveTo(-l.s, 0);
      ctx.lineTo(l.s, 0);
      ctx.stroke();
      ctx.restore();
    }

    // Moss and lichen patches on ground surface
    const mossPatchData = [
      { x: 10, y: 14, rx: 8, ry: 3 }, { x: 35, y: 12, rx: 10, ry: 3 },
      { x: 62, y: 13, rx: 7, ry: 2.5 }, { x: 88, y: 11, rx: 9, ry: 3 },
      { x: 115, y: 14, rx: 8, ry: 2.5 },
    ];
    for (const m of mossPatchData) {
      const mg = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.rx);
      mg.addColorStop(0, 'rgba(40, 80, 25, 0.35)');
      mg.addColorStop(0.6, 'rgba(35, 70, 20, 0.25)');
      mg.addColorStop(1, 'rgba(30, 60, 15, 0)');
      ctx.fillStyle = mg;
      ctx.beginPath();
      ctx.ellipse(m.x, m.y, m.rx, m.ry, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Dense undergrowth — low ferns and broad-leaf plants at surface
    const surfGrad = ctx.createLinearGradient(0, 0, 0, 16);
    surfGrad.addColorStop(0, '#2a5518');
    surfGrad.addColorStop(0.5, '#356820');
    surfGrad.addColorStop(1, '#2a4a14');
    ctx.fillStyle = surfGrad;
    ctx.fillRect(0, 0, w, 10);

    // Tropical ground ferns — broad arching fronds
    ctx.lineCap = 'round';
    for (let x = 0; x < w; x += 4) {
      const fh = 5 + Math.sin(x * 0.5) * 3 + Math.sin(x * 1.1) * 2;
      const lean = Math.sin(x * 0.3) * 3;
      const gv = 65 + (x * 11) % 50;
      // Frond stem
      ctx.strokeStyle = `rgba(30, ${gv}, 18, 0.6)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, 10);
      ctx.quadraticCurveTo(x + lean * 0.5, 10 - fh * 0.6, x + lean, 10 - fh);
      ctx.stroke();
      // Leaflets along frond
      if (x % 8 === 0) {
        ctx.fillStyle = `rgba(35, ${gv + 10}, 20, 0.4)`;
        for (let lp = 0.3; lp < 0.9; lp += 0.2) {
          const lx = x + lean * lp;
          const ly = 10 - fh * lp;
          ctx.beginPath();
          ctx.ellipse(lx - 1.5, ly, 2, 0.8, -0.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(lx + 1.5, ly, 2, 0.8, 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Small mushrooms growing in damp spots
    const mushrooms = [
      { x: 22, y: 15 }, { x: 58, y: 13 }, { x: 98, y: 14 },
    ];
    for (const mu of mushrooms) {
      // Stem
      ctx.fillStyle = '#c8b890';
      ctx.fillRect(mu.x - 0.5, mu.y - 3, 1.5, 3);
      // Cap
      ctx.fillStyle = '#a05030';
      ctx.beginPath();
      ctx.ellipse(mu.x + 0.2, mu.y - 3, 2.5, 1.5, 0, Math.PI, 0);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.beginPath();
      ctx.arc(mu.x - 0.5, mu.y - 3.8, 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    refresh();
    // Alias so existing code referencing 'ground' still works
    (this.textures.get('ground-jungle') as Phaser.Textures.CanvasTexture).canvas &&
      this.textures.addCanvas('ground', (this.textures.get('ground-jungle') as Phaser.Textures.CanvasTexture).canvas);
  }

  // ================================================================
  //  BACKGROUND HILLS
  // ================================================================
  private makeHillsFar(): void {
    const w = 512, h = 200;
    const { ctx, refresh } = this.canvas('hills-far-jungle', w, h);

    // Humid tropical sky wash
    const skyWash = ctx.createLinearGradient(0, 0, 0, h);
    skyWash.addColorStop(0, 'rgba(110, 180, 200, 0.06)');
    skyWash.addColorStop(0.5, 'rgba(130, 195, 190, 0.04)');
    skyWash.addColorStop(1, 'rgba(140, 200, 180, 0)');
    ctx.fillStyle = skyWash;
    ctx.fillRect(0, 0, w, h);

    // Furthest ridge — blue-green mountains lost in haze
    const ridge0 = ctx.createLinearGradient(0, 30, 0, h);
    ridge0.addColorStop(0, '#6a9a88');
    ridge0.addColorStop(0.4, '#5a8a78');
    ridge0.addColorStop(1, '#6a9a86');
    ctx.fillStyle = ridge0;
    ctx.beginPath();
    ctx.moveTo(0, h); ctx.lineTo(0, 95);
    ctx.bezierCurveTo(25, 60, 60, 75, 100, 50);
    ctx.bezierCurveTo(140, 30, 180, 55, 220, 44);
    ctx.bezierCurveTo(260, 34, 300, 58, 340, 40);
    ctx.bezierCurveTo(380, 25, 420, 50, 460, 38);
    ctx.bezierCurveTo(490, 30, 510, 44, 512, 50);
    ctx.lineTo(512, h); ctx.closePath(); ctx.fill();

    // Steam/mist rising from distant canopy
    for (const mx of [80, 200, 330, 460]) {
      const mg = ctx.createRadialGradient(mx, 60, 0, mx, 60, 40);
      mg.addColorStop(0, 'rgba(180, 220, 210, 0.14)');
      mg.addColorStop(0.6, 'rgba(170, 210, 200, 0.06)');
      mg.addColorStop(1, 'rgba(160, 200, 190, 0)');
      ctx.fillStyle = mg;
      ctx.beginPath();
      ctx.ellipse(mx, 60, 50, 25, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Middle ridge — dense emerald rainforest
    const ridge1 = ctx.createLinearGradient(0, 55, 0, h);
    ridge1.addColorStop(0, '#2a5a3a');
    ridge1.addColorStop(0.3, '#1e4a30');
    ridge1.addColorStop(0.7, '#2a5838');
    ridge1.addColorStop(1, '#3a6a4a');
    ctx.fillStyle = ridge1;
    ctx.beginPath();
    ctx.moveTo(0, h); ctx.lineTo(0, 115);
    ctx.bezierCurveTo(35, 72, 75, 90, 115, 62);
    ctx.bezierCurveTo(155, 42, 195, 80, 235, 68);
    ctx.bezierCurveTo(275, 54, 315, 84, 355, 52);
    ctx.bezierCurveTo(395, 35, 435, 68, 475, 55);
    ctx.bezierCurveTo(500, 46, 510, 58, 512, 68);
    ctx.lineTo(512, h); ctx.closePath(); ctx.fill();

    // Emergent canopy trees poking above middle ridge
    for (let x = 20; x < w; x += 35 + (x * 7) % 20) {
      const baseY = 60 + Math.sin(x * 0.02) * 22 + Math.sin(x * 0.04) * 10;
      const tH = 10 + (x * 3) % 12;
      const tW = tH * 0.8;
      // Dark canopy mass
      ctx.fillStyle = `rgba(${18 + (x % 10)}, ${40 + (x % 20)}, ${24 + (x % 12)}, 0.5)`;
      ctx.beginPath();
      ctx.ellipse(x, baseY - tH * 0.4, tW, tH * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      // Highlight on top
      ctx.fillStyle = `rgba(${50 + (x % 15)}, ${90 + (x % 20)}, ${40 + (x % 10)}, 0.2)`;
      ctx.beginPath();
      ctx.ellipse(x - 2, baseY - tH * 0.6, tW * 0.5, tH * 0.25, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Mist layer between middle and near ridges
    const mist1 = ctx.createLinearGradient(0, 80, 0, 130);
    mist1.addColorStop(0, 'rgba(160, 210, 195, 0)');
    mist1.addColorStop(0.4, 'rgba(165, 215, 200, 0.15)');
    mist1.addColorStop(0.7, 'rgba(160, 210, 195, 0.1)');
    mist1.addColorStop(1, 'rgba(155, 205, 190, 0)');
    ctx.fillStyle = mist1;
    ctx.fillRect(0, 80, w, 50);

    // Nearest ridge — lush, saturated green
    const ridge2 = ctx.createLinearGradient(0, 85, 0, h);
    ridge2.addColorStop(0, '#1e5028');
    ridge2.addColorStop(0.3, '#2a6035');
    ridge2.addColorStop(0.6, '#357040');
    ridge2.addColorStop(1, '#408050');
    ctx.fillStyle = ridge2;
    ctx.beginPath();
    ctx.moveTo(0, h); ctx.lineTo(0, 138);
    ctx.bezierCurveTo(45, 108, 95, 128, 155, 98);
    ctx.bezierCurveTo(195, 84, 255, 114, 315, 100);
    ctx.bezierCurveTo(375, 88, 415, 112, 455, 96);
    ctx.bezierCurveTo(485, 88, 510, 100, 512, 108);
    ctx.lineTo(512, h); ctx.closePath(); ctx.fill();

    // Dense canopy texture on nearest ridge
    for (let x = 3; x < w; x += 7) {
      const baseY = 98 + Math.sin(x * 0.022) * 20 + Math.sin(x * 0.05) * 8;
      const cr = 6 + (x * 5) % 8;
      const gVal = 60 + (x * 3) % 40;
      ctx.fillStyle = `rgba(${20 + (x % 12)}, ${gVal}, ${25 + (x % 10)}, 0.35)`;
      ctx.beginPath();
      ctx.arc(x, baseY, cr, Math.PI, 0);
      ctx.fill();
    }

    // Bottom humidity haze
    const haze = ctx.createLinearGradient(0, 125, 0, h);
    haze.addColorStop(0, 'rgba(130, 195, 180, 0)');
    haze.addColorStop(0.4, 'rgba(140, 200, 185, 0.1)');
    haze.addColorStop(1, 'rgba(135, 206, 190, 0.22)');
    ctx.fillStyle = haze;
    ctx.fillRect(0, 125, w, 75);

    // Tropical birds — parrots in flight
    ctx.strokeStyle = 'rgba(25, 45, 30, 0.2)';
    ctx.lineWidth = 0.8;
    for (const bx of [90, 220, 350, 450]) {
      const by = 20 + (bx * 3) % 25;
      ctx.beginPath();
      ctx.moveTo(bx - 5, by + 2);
      ctx.quadraticCurveTo(bx - 1, by - 1, bx, by);
      ctx.quadraticCurveTo(bx + 1, by - 1, bx + 5, by + 2);
      ctx.stroke();
    }

    refresh();
    // Alias so existing code referencing 'bg-hills-far' still works
    (this.textures.get('hills-far-jungle') as Phaser.Textures.CanvasTexture).canvas &&
      this.textures.addCanvas('bg-hills-far', (this.textures.get('hills-far-jungle') as Phaser.Textures.CanvasTexture).canvas);
  }

  private makeHillsNear(): void {
    const w = 512, h = 250;
    const { ctx, refresh } = this.canvas('hills-near-jungle', w, h);

    // Sky/background visible between tree trunks — dark jungle interior
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, '#0a1e0c');
    bgGrad.addColorStop(0.5, '#122a14');
    bgGrad.addColorStop(1, '#1a361a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Big jungle trees filling the background with green vines
    const trees = [
      { x: -10, h: 130, bw: 14 }, { x: 30, h: 150, bw: 16 },
      { x: 68, h: 140, bw: 15 }, { x: 105, h: 155, bw: 17 },
      { x: 142, h: 145, bw: 16 }, { x: 178, h: 135, bw: 15 },
      { x: 215, h: 150, bw: 16 }, { x: 252, h: 140, bw: 15 },
      { x: 288, h: 155, bw: 17 }, { x: 325, h: 145, bw: 16 },
      { x: 362, h: 135, bw: 15 }, { x: 398, h: 150, bw: 16 },
      { x: 435, h: 140, bw: 15 }, { x: 472, h: 155, bw: 17 },
      { x: 510, h: 145, bw: 16 },
    ];
    for (const t of trees) {
      const tw = t.bw;
      // Buttress roots — wide flared base
      ctx.fillStyle = '#2a1a0e';
      ctx.beginPath();
      ctx.moveTo(t.x - tw * 2, h);
      ctx.quadraticCurveTo(t.x - tw * 1.4, h - 18, t.x - tw * 0.5, h - 30);
      ctx.lineTo(t.x + tw * 0.5, h - 30);
      ctx.quadraticCurveTo(t.x + tw * 1.4, h - 18, t.x + tw * 2, h);
      ctx.closePath();
      ctx.fill();

      // Main trunk — thick, tall
      const trunkGrad = ctx.createLinearGradient(t.x - tw / 2, h - t.h, t.x + tw / 2, h);
      trunkGrad.addColorStop(0, '#3a2a16');
      trunkGrad.addColorStop(0.3, '#4a3420');
      trunkGrad.addColorStop(0.7, '#3e2c18');
      trunkGrad.addColorStop(1, '#2a1a0e');
      ctx.fillStyle = trunkGrad;
      const lean = Math.sin(t.x * 0.04) * 5;
      ctx.beginPath();
      ctx.moveTo(t.x - tw * 0.5, h - 30);
      ctx.quadraticCurveTo(t.x - tw * 0.4 + lean * 0.5, h - t.h * 0.5, t.x - tw * 0.3 + lean, h - t.h);
      ctx.lineTo(t.x + tw * 0.3 + lean, h - t.h);
      ctx.quadraticCurveTo(t.x + tw * 0.4 + lean * 0.5, h - t.h * 0.5, t.x + tw * 0.5, h - 30);
      ctx.closePath();
      ctx.fill();

      // Bark texture
      ctx.strokeStyle = 'rgba(20, 12, 5, 0.2)';
      ctx.lineWidth = 0.5;
      for (let by = h - t.h + 6; by < h - 30; by += 4) {
        ctx.beginPath();
        ctx.moveTo(t.x - tw * 0.35, by);
        ctx.quadraticCurveTo(t.x, by + (by % 2 ? 1 : -1), t.x + tw * 0.35, by + 0.5);
        ctx.stroke();
      }

      // Moss patches on trunk
      ctx.fillStyle = 'rgba(40, 85, 30, 0.2)';
      ctx.beginPath();
      ctx.ellipse(t.x - tw * 0.25, h - t.h * 0.45, tw * 0.35, 10, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(35, 75, 25, 0.15)';
      ctx.beginPath();
      ctx.ellipse(t.x + tw * 0.2, h - t.h * 0.65, tw * 0.3, 7, -0.1, 0, Math.PI * 2);
      ctx.fill();

      // Wild tropical canopy — irregular spreading branches with big leaves
      const cy = h - t.h - 8;
      const topX = t.x + lean;

      // Large spreading branches from trunk top
      const branches = [
        { angle: -0.8, len: 35 + tw }, { angle: -0.3, len: 40 + tw },
        { angle: 0.2, len: 38 + tw }, { angle: 0.7, len: 34 + tw },
        { angle: -1.2, len: 28 + tw }, { angle: 1.1, len: 30 + tw },
      ];
      for (const br of branches) {
        const bx = topX + Math.sin(br.angle) * br.len;
        const by = cy - Math.cos(br.angle) * br.len * 0.4;
        // Branch
        ctx.strokeStyle = '#3a2a16';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(topX, cy);
        ctx.quadraticCurveTo(topX + (bx - topX) * 0.4, cy - 8, bx, by);
        ctx.stroke();

        // Big tropical leaves at branch ends — elongated, pointed, irregular
        for (let li = 0; li < 3; li++) {
          const leafAngle = br.angle + (li - 1) * 0.4;
          const leafLen = 14 + (li * 7 + Math.abs(t.x)) % 10;
          const leafTip_x = bx + Math.sin(leafAngle) * leafLen;
          const leafTip_y = by - Math.cos(leafAngle) * leafLen * 0.3 + li * 3;
          const gv = 100 + (li * 30 + t.x) % 60;
          ctx.fillStyle = `rgba(${20 + li * 8}, ${gv}, ${15 + li * 5}, 0.55)`;
          ctx.beginPath();
          ctx.moveTo(bx, by);
          ctx.quadraticCurveTo(bx + (leafTip_x - bx) * 0.5 + 4, by + (leafTip_y - by) * 0.5 - 5, leafTip_x, leafTip_y);
          ctx.quadraticCurveTo(bx + (leafTip_x - bx) * 0.5 - 4, by + (leafTip_y - by) * 0.5 + 5, bx, by);
          ctx.closePath();
          ctx.fill();
          // Leaf midrib
          ctx.strokeStyle = `rgba(15, ${gv - 30}, 10, 0.3)`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(bx, by);
          ctx.lineTo(leafTip_x, leafTip_y);
          ctx.stroke();
        }
      }

      // Giant banana-style leaves — long drooping broad leaves
      const bananaLeaves = [
        { side: -1, droop: 0.3 }, { side: 1, droop: 0.5 },
        { side: -1, droop: 0.7 }, { side: 1, droop: 0.2 },
      ];
      for (const bl of bananaLeaves) {
        const blLen = 25 + tw;
        const blStartY = cy + 5 + bl.droop * 15;
        const blEndX = topX + bl.side * blLen;
        const blEndY = blStartY + bl.droop * blLen * 0.5;
        const gv = 90 + (Math.abs(t.x * bl.side * 10)) % 50;
        // Broad leaf shape
        ctx.fillStyle = `rgba(${25 + bl.droop * 15}, ${gv}, ${18}, 0.5)`;
        ctx.beginPath();
        ctx.moveTo(topX, blStartY);
        ctx.quadraticCurveTo(topX + bl.side * blLen * 0.5, blStartY - 8, blEndX, blEndY);
        ctx.quadraticCurveTo(topX + bl.side * blLen * 0.5, blStartY + 10, topX, blStartY);
        ctx.closePath();
        ctx.fill();
        // Central vein
        ctx.strokeStyle = `rgba(20, ${gv - 25}, 12, 0.35)`;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(topX, blStartY);
        ctx.quadraticCurveTo(topX + bl.side * blLen * 0.5, blStartY + 1, blEndX, blEndY);
        ctx.stroke();
      }

      // --- GREEN VINES hanging from branches ---
      const spread = 30 + tw;
      const vineCount = 3 + (t.x % 3);
      for (let vi = 0; vi < vineCount; vi++) {
        const vx = topX - spread + (vi / vineCount) * spread * 2;
        const vineLen = 45 + (vi * 17 + t.x) % 55;
        const sway = Math.sin(vx * 0.1 + vi) * 8;
        const vineStartY = cy + 10;

        // Main vine strand
        ctx.strokeStyle = `rgba(${30 + vi * 5}, ${80 + vi * 10}, ${20 + vi * 3}, ${0.35 + vi * 0.03})`;
        ctx.lineWidth = 1.2 + (vi % 2) * 0.5;
        ctx.beginPath();
        ctx.moveTo(vx, vineStartY);
        ctx.bezierCurveTo(
          vx + sway * 0.3, vineStartY + vineLen * 0.3,
          vx + sway, vineStartY + vineLen * 0.6,
          vx + sway * 0.6, vineStartY + vineLen,
        );
        ctx.stroke();

        // Small green leaves along vine
        for (let lp = 0.2; lp < 1.0; lp += 0.18) {
          const lx = vx + sway * lp * 0.8;
          const ly = vineStartY + vineLen * lp;
          const side = (Math.floor(lp * 10) % 2) ? -1 : 1;
          ctx.fillStyle = `rgba(${40 + vi * 4}, ${90 + vi * 8}, ${28}, 0.35)`;
          ctx.beginPath();
          ctx.ellipse(lx + side * 3, ly, 3, 1.5, side * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Dense tropical undergrowth — big broad leaves, ferns, monstera
    for (let fx = 0; fx < w; fx += 20) {
      const fy = h - 8;
      const gv = 80 + (fx * 7) % 50;

      // Large monstera/split-leaf philodendron shapes
      for (let ml = -1; ml <= 1; ml += 2) {
        const mx = fx + ml * 8;
        const my = fy - 12;
        ctx.fillStyle = `rgba(${25 + (fx % 15)}, ${gv}, ${18}, 0.45)`;
        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.quadraticCurveTo(fx + ml * 3, fy - 18, mx, my);
        ctx.quadraticCurveTo(mx + ml * 6, my - 4, mx + ml * 10, my + 2);
        ctx.quadraticCurveTo(mx + ml * 5, my + 8, fx, fy);
        ctx.closePath();
        ctx.fill();
      }

      // Tall tropical grass/reeds
      for (let g = -2; g <= 2; g++) {
        const gh = 10 + Math.abs(g) * 2 + (fx % 5);
        ctx.strokeStyle = `rgba(30, ${gv + 10}, 20, 0.4)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(fx + g * 3, fy);
        ctx.quadraticCurveTo(fx + g * 4, fy - gh * 0.6, fx + g * 5, fy - gh);
        ctx.stroke();
      }
    }

    // Bright tropical flowers peeking through undergrowth
    const flowers = [
      { x: 35, y: 228, c: '#ff4466' }, { x: 120, y: 230, c: '#ffaa22' },
      { x: 210, y: 226, c: '#ff66aa' }, { x: 310, y: 229, c: '#ff4466' },
      { x: 400, y: 227, c: '#ffcc33' }, { x: 480, y: 230, c: '#ff66aa' },
    ];
    for (const fl of flowers) {
      for (let p = 0; p < 5; p++) {
        const pa = p * Math.PI * 2 / 5;
        ctx.fillStyle = fl.c;
        ctx.beginPath();
        ctx.ellipse(fl.x + Math.cos(pa) * 2.5, fl.y + Math.sin(pa) * 2.5, 2, 1.2, pa, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#ffee55';
      ctx.beginPath();
      ctx.arc(fl.x, fl.y, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Warm humidity haze at base
    const hazeNear = ctx.createLinearGradient(0, h - 35, 0, h);
    hazeNear.addColorStop(0, 'rgba(80, 140, 80, 0)');
    hazeNear.addColorStop(0.5, 'rgba(90, 150, 90, 0.06)');
    hazeNear.addColorStop(1, 'rgba(100, 160, 100, 0.1)');
    ctx.fillStyle = hazeNear;
    ctx.fillRect(0, h - 35, w, 35);

    refresh();
    // Alias so existing code referencing 'bg-hills-near' still works
    (this.textures.get('hills-near-jungle') as Phaser.Textures.CanvasTexture).canvas &&
      this.textures.addCanvas('bg-hills-near', (this.textures.get('hills-near-jungle') as Phaser.Textures.CanvasTexture).canvas);
  }

  // ================================================================
  //  BIOME TEXTURES — ground + hills for Swamp, Volcano, Caves
  //  (Jungle textures generated above in makeGround/makeHillsFar/makeHillsNear)
  // ================================================================

  private makeBiomeTextures(): void {
    this.makeGroundSwamp();
    this.makeHillsFarSwamp();
    this.makeHillsNearSwamp();
    this.makeGroundVolcano();
    this.makeHillsFarVolcano();
    this.makeHillsNearVolcano();
    this.makeGroundCaves();
    this.makeHillsFarCaves();
    this.makeHillsNearCaves();
    this.makeGroundMountain();
    this.makeHillsFarMountain();
    this.makeHillsNearMountain();
    this.makeGroundTundra();
    this.makeHillsFarTundra();
    this.makeHillsNearTundra();
  }

  // ---- SWAMP GROUND ----
  private makeGroundSwamp(): void {
    const w = 128, h = 76;
    const { ctx, refresh } = this.canvas('ground-swamp', w, h);

    const mudGrad = ctx.createLinearGradient(0, 10, 0, h);
    mudGrad.addColorStop(0, '#3a4a2a');
    mudGrad.addColorStop(0.3, '#4a5530');
    mudGrad.addColorStop(0.7, '#3d4828');
    mudGrad.addColorStop(1, '#2e3820');
    ctx.fillStyle = mudGrad;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = 'rgba(60, 50, 30, 0.4)';
    for (let i = 0; i < 15; i++) {
      const dx = (i * 41 + 7) % w;
      const dy = 18 + (i * 29 + 3) % (h - 24);
      const dr = 2 + (i % 4);
      ctx.beginPath();
      ctx.ellipse(dx, dy, dr, dr * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    const waterPatches = [
      { x: 20, y: 40, rx: 14, ry: 5 },
      { x: 75, y: 55, rx: 10, ry: 4 },
      { x: 110, y: 35, rx: 8, ry: 3 },
    ];
    for (const wp of waterPatches) {
      const wg = ctx.createRadialGradient(wp.x, wp.y, 0, wp.x, wp.y, wp.rx);
      wg.addColorStop(0, 'rgba(70, 90, 100, 0.6)');
      wg.addColorStop(0.7, 'rgba(60, 80, 85, 0.4)');
      wg.addColorStop(1, 'rgba(50, 70, 60, 0)');
      ctx.fillStyle = wg;
      ctx.beginPath();
      ctx.ellipse(wp.x, wp.y, wp.rx, wp.ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(120, 150, 160, 0.3)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(wp.x - wp.rx * 0.5, wp.y);
      ctx.quadraticCurveTo(wp.x, wp.y - 1, wp.x + wp.rx * 0.5, wp.y);
      ctx.stroke();
    }

    const dgg = ctx.createLinearGradient(0, 0, 0, 14);
    dgg.addColorStop(0, '#5a6a3a');
    dgg.addColorStop(1, '#4a5830');
    ctx.fillStyle = dgg;
    ctx.fillRect(0, 0, w, 10);

    for (let x = 0; x < w; x += 4) {
      const bh = 4 + Math.sin(x * 0.5) * 3;
      const lean = Math.sin(x * 0.3) * 3;
      ctx.strokeStyle = `rgba(${80 + (x % 20)}, ${75 + (x % 15)}, ${40 + (x % 10)}, 0.6)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, 10);
      ctx.quadraticCurveTo(x + lean * 0.5, 10 - bh * 0.6, x + lean, 10 - bh);
      ctx.stroke();
    }

    refresh();
  }

  // ---- SWAMP HILLS FAR ----
  private makeHillsFarSwamp(): void {
    const w = 512, h = 200;
    const { ctx, refresh } = this.canvas('hills-far-swamp', w, h);

    const fogGrad = ctx.createLinearGradient(0, 0, 0, h);
    fogGrad.addColorStop(0, 'rgba(100, 120, 100, 0.3)');
    fogGrad.addColorStop(1, 'rgba(80, 100, 80, 0.6)');
    ctx.fillStyle = fogGrad;
    ctx.fillRect(0, 0, w, h);

    const ridge = ctx.createLinearGradient(0, 60, 0, h);
    ridge.addColorStop(0, '#4a5a4a');
    ridge.addColorStop(1, '#5a6a58');
    ctx.fillStyle = ridge;
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, 130);
    ctx.bezierCurveTo(40, 100, 80, 120, 120, 90);
    ctx.bezierCurveTo(160, 75, 200, 110, 240, 95);
    ctx.bezierCurveTo(280, 80, 320, 105, 360, 85);
    ctx.bezierCurveTo(400, 70, 440, 100, 480, 90);
    ctx.lineTo(512, 95);
    ctx.lineTo(512, h);
    ctx.closePath();
    ctx.fill();

    const treesX = [60, 150, 280, 400, 470];
    for (const tx of treesX) {
      ctx.strokeStyle = 'rgba(40, 50, 35, 0.5)';
      ctx.lineWidth = 2;
      const treeBase = 100 + Math.sin(tx * 0.02) * 20;
      ctx.beginPath();
      ctx.moveTo(tx, treeBase);
      ctx.lineTo(tx - 1, treeBase - 40);
      ctx.stroke();
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(tx - 1, treeBase - 30);
      ctx.lineTo(tx - 12, treeBase - 45);
      ctx.moveTo(tx, treeBase - 35);
      ctx.lineTo(tx + 10, treeBase - 50);
      ctx.moveTo(tx - 1, treeBase - 20);
      ctx.lineTo(tx + 8, treeBase - 32);
      ctx.stroke();
    }

    const heavyFog = ctx.createLinearGradient(0, 100, 0, h);
    heavyFog.addColorStop(0, 'rgba(130, 150, 130, 0)');
    heavyFog.addColorStop(0.5, 'rgba(130, 150, 130, 0.2)');
    heavyFog.addColorStop(1, 'rgba(130, 150, 130, 0.45)');
    ctx.fillStyle = heavyFog;
    ctx.fillRect(0, 100, w, 100);

    refresh();
  }

  // ---- SWAMP HILLS NEAR ----
  private makeHillsNearSwamp(): void {
    const w = 512, h = 250;
    const { ctx, refresh } = this.canvas('hills-near-swamp', w, h);

    const foliage = ctx.createLinearGradient(0, 100, 0, h);
    foliage.addColorStop(0, '#2a4a22');
    foliage.addColorStop(0.5, '#3a5a30');
    foliage.addColorStop(1, '#344a2c');
    ctx.fillStyle = foliage;
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, 170);
    ctx.bezierCurveTo(40, 140, 80, 160, 120, 135);
    ctx.bezierCurveTo(160, 120, 200, 150, 250, 130);
    ctx.bezierCurveTo(300, 115, 340, 145, 380, 125);
    ctx.bezierCurveTo(420, 110, 460, 135, 500, 120);
    ctx.lineTo(512, 125);
    ctx.lineTo(512, h);
    ctx.closePath();
    ctx.fill();

    const treeX = [70, 180, 310, 430];
    for (const tx of treeX) {
      const treeH = 60 + Math.sin(tx) * 12;
      const trunkGrad = ctx.createLinearGradient(tx, h - treeH, tx, h);
      trunkGrad.addColorStop(0, '#3a3028');
      trunkGrad.addColorStop(1, '#2a2018');
      ctx.fillStyle = trunkGrad;
      ctx.beginPath();
      ctx.moveTo(tx - 3, h);
      ctx.quadraticCurveTo(tx - 5, h - treeH * 0.5, tx - 2, h - treeH);
      ctx.lineTo(tx + 3, h - treeH);
      ctx.quadraticCurveTo(tx + 4, h - treeH * 0.5, tx + 4, h);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = 'rgba(50, 40, 30, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(tx, h - treeH);
      ctx.quadraticCurveTo(tx - 15, h - treeH - 5, tx - 20, h - treeH + 10);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(tx, h - treeH + 5);
      ctx.quadraticCurveTo(tx + 12, h - treeH, tx + 18, h - treeH + 12);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(80, 100, 60, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(tx - 15, h - treeH + 2);
      ctx.quadraticCurveTo(tx - 14, h - treeH + 15, tx - 16, h - treeH + 22);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(tx + 14, h - treeH + 5);
      ctx.quadraticCurveTo(tx + 13, h - treeH + 18, tx + 15, h - treeH + 25);
      ctx.stroke();
    }

    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = '#a0b0a0';
    for (let i = 0; i < 6; i++) {
      const fx = (i * 97 + 20) % w;
      const fy = 180 + (i * 13) % 40;
      ctx.beginPath();
      ctx.ellipse(fx, fy, 30 + i * 5, 6, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    refresh();
  }

  // ---- VOLCANO GROUND ----
  private makeGroundVolcano(): void {
    const w = 128, h = 76;
    const { ctx, refresh } = this.canvas('ground-volcano', w, h);

    const rockGrad = ctx.createLinearGradient(0, 10, 0, h);
    rockGrad.addColorStop(0, '#2a2a2a');
    rockGrad.addColorStop(0.3, '#3a3535');
    rockGrad.addColorStop(0.7, '#2d2828');
    rockGrad.addColorStop(1, '#222020');
    ctx.fillStyle = rockGrad;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = 'rgba(50, 45, 40, 0.4)';
    for (let i = 0; i < 20; i++) {
      const dx = (i * 37 + 11) % w;
      const dy = 16 + (i * 23 + 5) % (h - 22);
      const dr = 1 + (i % 3);
      ctx.beginPath();
      ctx.arc(dx, dy, dr, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = 'rgba(255, 120, 20, 0.7)';
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 8; i++) {
      const rx = (i * 31 + 10) % w;
      const ry = 14 + (i * 19) % (h - 20);
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.quadraticCurveTo(rx + 6, ry + 4, rx + 14, ry + 1);
      ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(255, 80, 0, 0.3)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 4; i++) {
      const rx = (i * 53 + 15) % w;
      const ry = 20 + (i * 37) % (h - 30);
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.quadraticCurveTo(rx + 5, ry + 3, rx + 12, ry - 1);
      ctx.stroke();
    }

    const ashGrad = ctx.createLinearGradient(0, 0, 0, 14);
    ashGrad.addColorStop(0, '#4a4040');
    ashGrad.addColorStop(1, '#3a3030');
    ctx.fillStyle = ashGrad;
    ctx.fillRect(0, 0, w, 10);

    ctx.fillStyle = 'rgba(80, 70, 65, 0.5)';
    for (let x = 0; x < w; x += 5) {
      const ay = 2 + Math.sin(x * 0.8) * 3;
      ctx.beginPath();
      ctx.arc(x, ay, 0.8, 0, Math.PI * 2);
      ctx.fill();
    }

    refresh();
  }

  // ---- VOLCANO HILLS FAR ----
  private makeHillsFarVolcano(): void {
    const w = 512, h = 200;
    const { ctx, refresh } = this.canvas('hills-far-volcano', w, h);

    const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
    skyGrad.addColorStop(0, 'rgba(200, 80, 40, 0.4)');
    skyGrad.addColorStop(0.5, 'rgba(180, 60, 30, 0.3)');
    skyGrad.addColorStop(1, 'rgba(100, 40, 20, 0.2)');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    const peakGrad = ctx.createLinearGradient(0, 30, 0, h);
    peakGrad.addColorStop(0, '#3a2828');
    peakGrad.addColorStop(0.4, '#4a3535');
    peakGrad.addColorStop(1, '#5a4040');
    ctx.fillStyle = peakGrad;
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, 140);
    ctx.lineTo(60, 80);
    ctx.lineTo(100, 110);
    ctx.lineTo(150, 50);
    ctx.lineTo(200, 100);
    ctx.lineTo(250, 70);
    ctx.lineTo(300, 120);
    ctx.lineTo(350, 40);
    ctx.lineTo(400, 90);
    ctx.lineTo(450, 110);
    ctx.lineTo(490, 60);
    ctx.lineTo(512, 100);
    ctx.lineTo(512, h);
    ctx.closePath();
    ctx.fill();

    const peakTops = [
      { x: 150, y: 50 },
      { x: 350, y: 40 },
      { x: 490, y: 60 },
    ];
    for (const pt of peakTops) {
      const glowGrad = ctx.createRadialGradient(pt.x, pt.y - 5, 0, pt.x, pt.y - 5, 25);
      glowGrad.addColorStop(0, 'rgba(255, 120, 30, 0.5)');
      glowGrad.addColorStop(0.5, 'rgba(255, 80, 10, 0.2)');
      glowGrad.addColorStop(1, 'rgba(255, 60, 0, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y - 5, 25, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = 'rgba(80, 70, 65, 0.2)';
    for (const pt of peakTops) {
      for (let i = 0; i < 5; i++) {
        const sx = pt.x - 8 + (i * 7) % 16;
        const sy = pt.y - 15 - i * 8;
        const sr = 3 + i * 1.5;
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    refresh();
  }

  // ---- VOLCANO HILLS NEAR ----
  private makeHillsNearVolcano(): void {
    const w = 512, h = 250;
    const { ctx, refresh } = this.canvas('hills-near-volcano', w, h);

    const rockRidge = ctx.createLinearGradient(0, 80, 0, h);
    rockRidge.addColorStop(0, '#2e2222');
    rockRidge.addColorStop(0.5, '#3a2e2e');
    rockRidge.addColorStop(1, '#4a3838');
    ctx.fillStyle = rockRidge;
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, 160);
    ctx.bezierCurveTo(30, 130, 70, 150, 100, 120);
    ctx.bezierCurveTo(140, 100, 180, 140, 220, 115);
    ctx.bezierCurveTo(260, 95, 300, 130, 340, 110);
    ctx.bezierCurveTo(380, 90, 420, 125, 470, 105);
    ctx.lineTo(512, 115);
    ctx.lineTo(512, h);
    ctx.closePath();
    ctx.fill();

    const lavaStreams = [120, 300, 450];
    for (const lx of lavaStreams) {
      ctx.strokeStyle = 'rgba(255, 60, 0, 0.2)';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(lx, 120 + Math.sin(lx * 0.01) * 20);
      ctx.quadraticCurveTo(lx + 5, 160, lx - 3, 200);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255, 100, 20, 0.6)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(lx, 120 + Math.sin(lx * 0.01) * 20);
      ctx.quadraticCurveTo(lx + 5, 160, lx - 3, 200);
      ctx.quadraticCurveTo(lx + 2, 230, lx - 1, h);
      ctx.stroke();
    }

    ctx.fillStyle = '#252020';
    const rockX = [50, 190, 370];
    for (const rx of rockX) {
      ctx.beginPath();
      ctx.moveTo(rx, h);
      ctx.lineTo(rx - 8, h - 30);
      ctx.lineTo(rx - 3, h - 50);
      ctx.lineTo(rx + 5, h - 45);
      ctx.lineTo(rx + 10, h - 25);
      ctx.lineTo(rx + 12, h);
      ctx.closePath();
      ctx.fill();
    }

    refresh();
  }

  // ---- CAVES GROUND ----
  private makeGroundCaves(): void {
    const w = 128, h = 76;
    const { ctx, refresh } = this.canvas('ground-caves', w, h);

    const stoneGrad = ctx.createLinearGradient(0, 10, 0, h);
    stoneGrad.addColorStop(0, '#2a2435');
    stoneGrad.addColorStop(0.3, '#352e3e');
    stoneGrad.addColorStop(0.7, '#2e2838');
    stoneGrad.addColorStop(1, '#252030');
    ctx.fillStyle = stoneGrad;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = 'rgba(50, 40, 60, 0.4)';
    for (let i = 0; i < 18; i++) {
      const dx = (i * 37 + 9) % w;
      const dy = 16 + (i * 23 + 11) % (h - 22);
      const dr = 1 + (i % 3);
      ctx.beginPath();
      ctx.arc(dx, dy, dr, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = 'rgba(20, 15, 25, 0.3)';
    ctx.lineWidth = 0.7;
    for (let i = 0; i < 6; i++) {
      const rx = (i * 43 + 8) % w;
      const ry = 18 + (i * 31) % (h - 24);
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.quadraticCurveTo(rx + 7, ry + 2, rx + 16, ry - 2);
      ctx.stroke();
    }

    const mushrooms = [
      { x: 18, y: 25, r: 4 }, { x: 60, y: 40, r: 3 },
      { x: 95, y: 30, r: 3.5 }, { x: 40, y: 55, r: 2.5 },
      { x: 115, y: 50, r: 3 },
    ];
    for (const m of mushrooms) {
      const glowGrad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 3);
      glowGrad.addColorStop(0, 'rgba(50, 200, 180, 0.3)');
      glowGrad.addColorStop(0.5, 'rgba(40, 180, 160, 0.1)');
      glowGrad.addColorStop(1, 'rgba(30, 160, 140, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r * 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(60, 220, 200, 0.7)';
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(100, 255, 230, 0.5)';
      ctx.beginPath();
      ctx.arc(m.x, m.y - m.r * 0.2, m.r * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    const crystals = [
      { x: 78, y: 20 }, { x: 30, y: 65 }, { x: 105, y: 60 },
    ];
    for (const c of crystals) {
      ctx.fillStyle = 'rgba(120, 80, 220, 0.6)';
      ctx.beginPath();
      ctx.moveTo(c.x, c.y);
      ctx.lineTo(c.x - 2, c.y + 8);
      ctx.lineTo(c.x + 2, c.y + 8);
      ctx.closePath();
      ctx.fill();

      const cGlow = ctx.createRadialGradient(c.x, c.y + 4, 0, c.x, c.y + 4, 6);
      cGlow.addColorStop(0, 'rgba(140, 100, 255, 0.2)');
      cGlow.addColorStop(1, 'rgba(140, 100, 255, 0)');
      ctx.fillStyle = cGlow;
      ctx.beginPath();
      ctx.arc(c.x, c.y + 4, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    const surfGrad = ctx.createLinearGradient(0, 0, 0, 12);
    surfGrad.addColorStop(0, '#302838');
    surfGrad.addColorStop(1, '#282230');
    ctx.fillStyle = surfGrad;
    ctx.fillRect(0, 0, w, 8);

    refresh();
  }

  // ---- CAVES HILLS FAR ----
  private makeHillsFarCaves(): void {
    const w = 512, h = 200;
    const { ctx, refresh } = this.canvas('hills-far-caves', w, h);

    ctx.fillStyle = '#1a1525';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#2a2235';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 40);
    for (let x = 0; x < w; x += 20) {
      const stalH = 30 + Math.sin(x * 0.08) * 20 + Math.sin(x * 0.15) * 10;
      ctx.lineTo(x + 10, stalH);
      ctx.lineTo(x + 20, stalH - 15 + Math.sin(x * 0.1) * 8);
    }
    ctx.lineTo(w, 0);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#352d40';
    for (let x = 15; x < w; x += 40) {
      const tipLen = 15 + Math.sin(x * 0.12) * 10;
      const baseY = 35 + Math.sin(x * 0.08) * 15;
      ctx.beginPath();
      ctx.moveTo(x - 3, baseY);
      ctx.lineTo(x, baseY + tipLen);
      ctx.lineTo(x + 3, baseY);
      ctx.closePath();
      ctx.fill();
    }

    const wallGrad = ctx.createLinearGradient(0, 100, 0, h);
    wallGrad.addColorStop(0, '#252035');
    wallGrad.addColorStop(1, '#302840');
    ctx.fillStyle = wallGrad;
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, 130);
    ctx.bezierCurveTo(50, 110, 100, 140, 160, 120);
    ctx.bezierCurveTo(220, 105, 280, 130, 340, 115);
    ctx.bezierCurveTo(400, 100, 450, 125, 512, 110);
    ctx.lineTo(512, h);
    ctx.closePath();
    ctx.fill();

    const distCrystals = [
      { x: 80, y: 125, r: 100, g: 60, b: 200, a: 0.3 },
      { x: 250, y: 118, r: 50, g: 180, b: 160, a: 0.25 },
      { x: 420, y: 112, r: 180, g: 80, b: 220, a: 0.3 },
    ];
    for (const dc of distCrystals) {
      const dcGlow = ctx.createRadialGradient(dc.x, dc.y, 0, dc.x, dc.y, 20);
      dcGlow.addColorStop(0, `rgba(${dc.r}, ${dc.g}, ${dc.b}, ${dc.a})`);
      dcGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = dcGlow;
      ctx.beginPath();
      ctx.arc(dc.x, dc.y, 20, 0, Math.PI * 2);
      ctx.fill();
    }

    const riverGlow = ctx.createLinearGradient(0, 160, 0, h);
    riverGlow.addColorStop(0, 'rgba(30, 120, 140, 0)');
    riverGlow.addColorStop(0.5, 'rgba(30, 120, 140, 0.1)');
    riverGlow.addColorStop(1, 'rgba(40, 150, 170, 0.2)');
    ctx.fillStyle = riverGlow;
    ctx.fillRect(0, 160, w, 40);

    refresh();
  }

  // ---- CAVES HILLS NEAR ----
  private makeHillsNearCaves(): void {
    const w = 512, h = 250;
    const { ctx, refresh } = this.canvas('hills-near-caves', w, h);

    ctx.fillStyle = '#1e1828';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#2e2638';
    for (let x = 0; x < w; x += 30) {
      const stalW = 6 + (x % 10);
      const stalH = 40 + Math.sin(x * 0.1) * 25;
      ctx.beginPath();
      ctx.moveTo(x - stalW / 2, 0);
      ctx.lineTo(x, stalH);
      ctx.lineTo(x + stalW / 2, 0);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = 'rgba(80, 70, 100, 0.3)';
      ctx.beginPath();
      ctx.arc(x, stalH - 2, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#2e2638';
    }

    const floorGrad = ctx.createLinearGradient(0, 140, 0, h);
    floorGrad.addColorStop(0, '#252038');
    floorGrad.addColorStop(1, '#302842');
    ctx.fillStyle = floorGrad;
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, 170);
    ctx.bezierCurveTo(40, 150, 80, 165, 120, 140);
    ctx.bezierCurveTo(160, 125, 200, 155, 250, 135);
    ctx.bezierCurveTo(300, 120, 340, 150, 380, 130);
    ctx.bezierCurveTo(420, 115, 460, 140, 500, 125);
    ctx.lineTo(512, 130);
    ctx.lineTo(512, h);
    ctx.closePath();
    ctx.fill();

    const crystalClusters = [
      { x: 100, y: 145, color1: '#8a50e0', color2: '#7040c0' },
      { x: 280, y: 130, color1: '#40c8b0', color2: '#30a090' },
      { x: 430, y: 120, color1: '#a060f0', color2: '#8050d0' },
    ];
    for (const cc of crystalClusters) {
      for (let i = -2; i <= 2; i++) {
        const shardH = 18 + Math.abs(i) * -4;
        const sx = cc.x + i * 5;
        ctx.fillStyle = Math.abs(i) % 2 === 0 ? cc.color1 : cc.color2;
        ctx.beginPath();
        ctx.moveTo(sx - 2, cc.y);
        ctx.lineTo(sx + i * 0.5, cc.y - shardH);
        ctx.lineTo(sx + 2, cc.y);
        ctx.closePath();
        ctx.fill();
      }

      ctx.save();
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = cc.color1;
      ctx.beginPath();
      ctx.arc(cc.x, cc.y - 8, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.strokeStyle = 'rgba(40, 160, 180, 0.4)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 210);
    ctx.bezierCurveTo(60, 205, 120, 215, 180, 208);
    ctx.bezierCurveTo(240, 200, 300, 212, 360, 206);
    ctx.bezierCurveTo(420, 198, 480, 210, 512, 205);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(40, 160, 180, 0.15)';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.moveTo(0, 210);
    ctx.bezierCurveTo(60, 205, 120, 215, 180, 208);
    ctx.bezierCurveTo(240, 200, 300, 212, 360, 206);
    ctx.bezierCurveTo(420, 198, 480, 210, 512, 205);
    ctx.stroke();

    refresh();
  }

  // ---- MOUNTAIN GROUND ----
  private makeGroundMountain(): void {
    const w = 128, h = 76;
    const { ctx, refresh } = this.canvas('ground-mountain', w, h);

    // Rocky grey-brown ground
    const rockGrad = ctx.createLinearGradient(0, 10, 0, h);
    rockGrad.addColorStop(0, '#7a7a80');
    rockGrad.addColorStop(0.3, '#686870');
    rockGrad.addColorStop(0.7, '#585860');
    rockGrad.addColorStop(1, '#4a4a55');
    ctx.fillStyle = rockGrad;
    ctx.fillRect(0, 0, w, h);

    // Scattered gravel and pebbles
    ctx.fillStyle = 'rgba(90, 90, 100, 0.5)';
    for (let i = 0; i < 20; i++) {
      const dx = (i * 31 + 7) % w;
      const dy = 14 + (i * 19 + 5) % (h - 20);
      const dr = 1 + (i % 3);
      ctx.beginPath();
      ctx.ellipse(dx, dy, dr, dr * 0.7, (i * 0.5), 0, Math.PI * 2);
      ctx.fill();
    }

    // Stone crack lines
    ctx.strokeStyle = 'rgba(50, 50, 58, 0.4)';
    ctx.lineWidth = 0.8;
    for (let i = 0; i < 5; i++) {
      const rx = (i * 47 + 12) % w;
      const ry = 16 + (i * 29) % (h - 22);
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.quadraticCurveTo(rx + 10, ry + 3, rx + 20, ry - 1);
      ctx.stroke();
    }

    // Sparse snow patches
    ctx.fillStyle = 'rgba(220, 230, 240, 0.25)';
    const snowPatches = [
      { x: 15, y: 18, rx: 8, ry: 3 },
      { x: 55, y: 35, rx: 6, ry: 2.5 },
      { x: 100, y: 22, rx: 10, ry: 3 },
      { x: 75, y: 55, rx: 7, ry: 2 },
    ];
    for (const s of snowPatches) {
      ctx.beginPath();
      ctx.ellipse(s.x, s.y, s.rx, s.ry, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Surface edge — rocky top
    const surfGrad = ctx.createLinearGradient(0, 0, 0, 10);
    surfGrad.addColorStop(0, '#8a8a92');
    surfGrad.addColorStop(1, '#7a7a82');
    ctx.fillStyle = surfGrad;
    ctx.fillRect(0, 0, w, 6);

    refresh();
  }

  // ---- MOUNTAIN HILLS FAR ----
  private makeHillsFarMountain(): void {
    const w = 512, h = 200;
    const { ctx, refresh } = this.canvas('hills-far-mountain', w, h);

    // Sky gradient — pale blue fading down
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
    skyGrad.addColorStop(0, '#a0c4e0');
    skyGrad.addColorStop(0.5, '#b8d4ea');
    skyGrad.addColorStop(1, '#c8ddf0');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // Distant mountain range (furthest, faint blue-grey)
    ctx.fillStyle = '#8a9ab0';
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, 140);
    ctx.lineTo(40, 100);
    ctx.lineTo(90, 70);
    ctx.lineTo(130, 90);
    ctx.lineTo(170, 55);
    ctx.lineTo(220, 80);
    ctx.lineTo(260, 60);
    ctx.lineTo(310, 85);
    ctx.lineTo(350, 50);
    ctx.lineTo(390, 75);
    ctx.lineTo(430, 65);
    ctx.lineTo(470, 90);
    ctx.lineTo(512, 80);
    ctx.lineTo(512, h);
    ctx.closePath();
    ctx.fill();

    // Snow caps on distant peaks
    ctx.fillStyle = 'rgba(240, 245, 255, 0.6)';
    const distPeaks = [
      { x: 90, y: 70, w: 20 }, { x: 170, y: 55, w: 22 },
      { x: 260, y: 60, w: 18 }, { x: 350, y: 50, w: 24 },
      { x: 430, y: 65, w: 16 },
    ];
    for (const p of distPeaks) {
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - p.w * 0.4, p.y + 14);
      ctx.lineTo(p.x + p.w * 0.5, p.y + 12);
      ctx.closePath();
      ctx.fill();
    }

    // Mid-range mountains (darker grey)
    const midGrad = ctx.createLinearGradient(0, 90, 0, h);
    midGrad.addColorStop(0, '#6a7888');
    midGrad.addColorStop(1, '#7a8898');
    ctx.fillStyle = midGrad;
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, 150);
    ctx.lineTo(60, 110);
    ctx.lineTo(120, 95);
    ctx.lineTo(180, 120);
    ctx.lineTo(240, 90);
    ctx.lineTo(300, 115);
    ctx.lineTo(360, 100);
    ctx.lineTo(420, 110);
    ctx.lineTo(480, 95);
    ctx.lineTo(512, 105);
    ctx.lineTo(512, h);
    ctx.closePath();
    ctx.fill();

    // Snow caps on mid peaks
    ctx.fillStyle = 'rgba(235, 240, 250, 0.5)';
    const midPeaks = [
      { x: 120, y: 95, w: 18 }, { x: 240, y: 90, w: 20 },
      { x: 360, y: 100, w: 16 }, { x: 480, y: 95, w: 18 },
    ];
    for (const p of midPeaks) {
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - p.w * 0.35, p.y + 10);
      ctx.lineTo(p.x + p.w * 0.45, p.y + 8);
      ctx.closePath();
      ctx.fill();
    }

    // Wispy clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    const clouds = [
      { x: 80, y: 40, rx: 30, ry: 8 },
      { x: 280, y: 30, rx: 40, ry: 10 },
      { x: 450, y: 45, rx: 25, ry: 7 },
    ];
    for (const c of clouds) {
      ctx.beginPath();
      ctx.ellipse(c.x, c.y, c.rx, c.ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(c.x + c.rx * 0.6, c.y - 3, c.rx * 0.6, c.ry * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    refresh();
  }

  // ---- MOUNTAIN HILLS NEAR ----
  private makeHillsNearMountain(): void {
    const w = 512, h = 250;
    const { ctx, refresh } = this.canvas('hills-near-mountain', w, h);

    // Base fill
    ctx.fillStyle = '#b0c4d8';
    ctx.fillRect(0, 0, w, h);

    // Near mountain slopes — large rocky forms
    const slopeGrad = ctx.createLinearGradient(0, 80, 0, h);
    slopeGrad.addColorStop(0, '#5a6068');
    slopeGrad.addColorStop(0.4, '#686e78');
    slopeGrad.addColorStop(0.8, '#6a7080');
    slopeGrad.addColorStop(1, '#585e68');
    ctx.fillStyle = slopeGrad;
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, 160);
    ctx.bezierCurveTo(30, 130, 60, 100, 100, 80);
    ctx.bezierCurveTo(140, 60, 170, 90, 200, 110);
    ctx.bezierCurveTo(230, 130, 260, 85, 300, 70);
    ctx.bezierCurveTo(340, 55, 370, 95, 400, 120);
    ctx.bezierCurveTo(430, 140, 460, 90, 490, 75);
    ctx.lineTo(512, 85);
    ctx.lineTo(512, h);
    ctx.closePath();
    ctx.fill();

    // Snow on near peaks
    ctx.fillStyle = 'rgba(230, 238, 248, 0.55)';
    ctx.beginPath();
    ctx.moveTo(80, 90);
    ctx.bezierCurveTo(90, 82, 100, 80, 110, 85);
    ctx.bezierCurveTo(105, 95, 90, 98, 80, 90);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(280, 78);
    ctx.bezierCurveTo(290, 70, 305, 70, 315, 78);
    ctx.bezierCurveTo(305, 88, 290, 88, 280, 78);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(475, 82);
    ctx.bezierCurveTo(483, 75, 494, 75, 500, 82);
    ctx.bezierCurveTo(495, 90, 482, 90, 475, 82);
    ctx.closePath();
    ctx.fill();

    // Rock face detail — cracks and ledges
    ctx.strokeStyle = 'rgba(40, 44, 52, 0.3)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      const lx = (i * 67 + 20) % w;
      const ly = 120 + (i * 23) % 80;
      ctx.beginPath();
      ctx.moveTo(lx, ly);
      ctx.lineTo(lx + 25, ly + 3);
      ctx.lineTo(lx + 40, ly - 2);
      ctx.stroke();
    }

    // Scattered boulders on slopes
    ctx.fillStyle = 'rgba(75, 80, 90, 0.4)';
    const boulders = [
      { x: 60, y: 170, r: 6 }, { x: 150, y: 155, r: 5 },
      { x: 250, y: 140, r: 7 }, { x: 350, y: 160, r: 5 },
      { x: 460, y: 145, r: 6 },
    ];
    for (const b of boulders) {
      ctx.beginPath();
      ctx.ellipse(b.x, b.y, b.r, b.r * 0.7, 0.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Pine trees on lower slopes (small, distant)
    const treeColor = '#3a5038';
    const trees = [
      { x: 40, y: 190 }, { x: 75, y: 180 }, { x: 130, y: 170 },
      { x: 175, y: 160 }, { x: 220, y: 175 }, { x: 330, y: 165 },
      { x: 380, y: 175 }, { x: 440, y: 160 }, { x: 500, y: 170 },
    ];
    for (const t of trees) {
      // Trunk
      ctx.fillStyle = '#4a3a28';
      ctx.fillRect(t.x - 1, t.y, 2, 8);
      // Canopy — triangular pine
      ctx.fillStyle = treeColor;
      ctx.beginPath();
      ctx.moveTo(t.x, t.y - 12);
      ctx.lineTo(t.x - 6, t.y + 2);
      ctx.lineTo(t.x + 6, t.y + 2);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(t.x, t.y - 7);
      ctx.lineTo(t.x - 5, t.y + 5);
      ctx.lineTo(t.x + 5, t.y + 5);
      ctx.closePath();
      ctx.fill();
    }

    // Atmospheric haze near bottom
    const hazeGrad = ctx.createLinearGradient(0, h - 40, 0, h);
    hazeGrad.addColorStop(0, 'rgba(180, 195, 215, 0)');
    hazeGrad.addColorStop(1, 'rgba(180, 195, 215, 0.3)');
    ctx.fillStyle = hazeGrad;
    ctx.fillRect(0, h - 40, w, 40);

    refresh();
  }

  // ---- TUNDRA GROUND ----
  private makeGroundTundra(): void {
    const w = 128, h = 76;
    const { ctx, refresh } = this.canvas('ground-tundra', w, h);

    // Frozen ground — icy white-blue
    const iceGrad = ctx.createLinearGradient(0, 0, 0, h);
    iceGrad.addColorStop(0, '#d8e4f0');
    iceGrad.addColorStop(0.3, '#c4d4e4');
    iceGrad.addColorStop(0.7, '#b0c4d8');
    iceGrad.addColorStop(1, '#98b0c8');
    ctx.fillStyle = iceGrad;
    ctx.fillRect(0, 0, w, h);

    // Permafrost cracks
    ctx.strokeStyle = 'rgba(80, 100, 130, 0.35)';
    ctx.lineWidth = 0.7;
    for (let i = 0; i < 8; i++) {
      const rx = (i * 41 + 5) % w;
      const ry = 12 + (i * 27) % (h - 18);
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.lineTo(rx + 8, ry + 2);
      ctx.lineTo(rx + 14, ry - 1);
      ctx.lineTo(rx + 22, ry + 3);
      ctx.stroke();
    }

    // Snow drifts
    ctx.fillStyle = 'rgba(240, 246, 255, 0.5)';
    const drifts = [
      { x: 10, y: 20, rx: 12, ry: 4 },
      { x: 45, y: 40, rx: 15, ry: 3.5 },
      { x: 80, y: 15, rx: 10, ry: 3 },
      { x: 110, y: 50, rx: 14, ry: 4 },
      { x: 30, y: 60, rx: 11, ry: 3 },
      { x: 95, y: 35, rx: 8, ry: 2.5 },
    ];
    for (const d of drifts) {
      ctx.beginPath();
      ctx.ellipse(d.x, d.y, d.rx, d.ry, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Frozen pebbles / ice chunks
    ctx.fillStyle = 'rgba(160, 185, 210, 0.4)';
    for (let i = 0; i < 12; i++) {
      const px = (i * 29 + 11) % w;
      const py = 10 + (i * 23 + 7) % (h - 16);
      ctx.beginPath();
      ctx.ellipse(px, py, 1.5 + (i % 2), 1, i * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Icy surface sheen at top
    const sheenGrad = ctx.createLinearGradient(0, 0, 0, 8);
    sheenGrad.addColorStop(0, 'rgba(220, 235, 255, 0.5)');
    sheenGrad.addColorStop(1, 'rgba(200, 220, 245, 0.2)');
    ctx.fillStyle = sheenGrad;
    ctx.fillRect(0, 0, w, 6);

    refresh();
  }

  // ---- TUNDRA HILLS FAR ----
  private makeHillsFarTundra(): void {
    const w = 512, h = 200;
    const { ctx, refresh } = this.canvas('hills-far-tundra', w, h);

    // Pale overcast sky
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
    skyGrad.addColorStop(0, '#c0cee0');
    skyGrad.addColorStop(0.4, '#ccd8e6');
    skyGrad.addColorStop(1, '#d8e0ea');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // Distant frozen hills — very faint, flat tundra horizon
    ctx.fillStyle = '#a8b8cc';
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, 140);
    ctx.bezierCurveTo(60, 132, 120, 138, 180, 128);
    ctx.bezierCurveTo(240, 120, 300, 135, 360, 125);
    ctx.bezierCurveTo(420, 118, 470, 130, 512, 122);
    ctx.lineTo(512, h);
    ctx.closePath();
    ctx.fill();

    // Snow covering on far hills
    ctx.fillStyle = 'rgba(230, 238, 248, 0.45)';
    ctx.beginPath();
    ctx.moveTo(0, 140);
    ctx.bezierCurveTo(60, 132, 120, 138, 180, 128);
    ctx.bezierCurveTo(240, 120, 300, 135, 360, 125);
    ctx.bezierCurveTo(420, 118, 470, 130, 512, 122);
    ctx.lineTo(512, 132);
    ctx.bezierCurveTo(470, 140, 420, 128, 360, 135);
    ctx.bezierCurveTo(300, 145, 240, 130, 180, 138);
    ctx.bezierCurveTo(120, 148, 60, 142, 0, 150);
    ctx.closePath();
    ctx.fill();

    // Faint aurora / sky glow at top
    const auroraGrad = ctx.createLinearGradient(0, 0, 0, 80);
    auroraGrad.addColorStop(0, 'rgba(100, 200, 180, 0.08)');
    auroraGrad.addColorStop(0.5, 'rgba(80, 180, 200, 0.04)');
    auroraGrad.addColorStop(1, 'rgba(80, 160, 200, 0)');
    ctx.fillStyle = auroraGrad;
    ctx.fillRect(0, 0, w, 80);

    // Low grey clouds
    ctx.fillStyle = 'rgba(180, 190, 205, 0.3)';
    const clouds = [
      { x: 60, y: 50, rx: 45, ry: 12 },
      { x: 200, y: 35, rx: 55, ry: 14 },
      { x: 380, y: 55, rx: 40, ry: 10 },
      { x: 480, y: 40, rx: 35, ry: 11 },
    ];
    for (const c of clouds) {
      ctx.beginPath();
      ctx.ellipse(c.x, c.y, c.rx, c.ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(c.x + c.rx * 0.5, c.y - 4, c.rx * 0.5, c.ry * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Distant frozen lake shimmer
    ctx.fillStyle = 'rgba(160, 195, 220, 0.2)';
    ctx.beginPath();
    ctx.ellipse(256, 170, 80, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(200, 225, 245, 0.15)';
    ctx.beginPath();
    ctx.ellipse(256, 168, 50, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    refresh();
  }

  // ---- TUNDRA HILLS NEAR ----
  private makeHillsNearTundra(): void {
    const w = 512, h = 250;
    const { ctx, refresh } = this.canvas('hills-near-tundra', w, h);

    // Base
    ctx.fillStyle = '#c4d0e0';
    ctx.fillRect(0, 0, w, h);

    // Near rolling tundra terrain — low, wide, snow-covered
    const terrainGrad = ctx.createLinearGradient(0, 100, 0, h);
    terrainGrad.addColorStop(0, '#b0bfd0');
    terrainGrad.addColorStop(0.3, '#a0b0c4');
    terrainGrad.addColorStop(0.7, '#94a8bc');
    terrainGrad.addColorStop(1, '#8898b0');
    ctx.fillStyle = terrainGrad;
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, 150);
    ctx.bezierCurveTo(40, 135, 80, 145, 120, 130);
    ctx.bezierCurveTo(160, 118, 200, 140, 250, 125);
    ctx.bezierCurveTo(300, 112, 340, 135, 380, 120);
    ctx.bezierCurveTo(420, 108, 460, 128, 500, 115);
    ctx.lineTo(512, 120);
    ctx.lineTo(512, h);
    ctx.closePath();
    ctx.fill();

    // Snow layer on top of terrain
    ctx.fillStyle = 'rgba(225, 235, 248, 0.5)';
    ctx.beginPath();
    ctx.moveTo(0, 150);
    ctx.bezierCurveTo(40, 135, 80, 145, 120, 130);
    ctx.bezierCurveTo(160, 118, 200, 140, 250, 125);
    ctx.bezierCurveTo(300, 112, 340, 135, 380, 120);
    ctx.bezierCurveTo(420, 108, 460, 128, 500, 115);
    ctx.lineTo(512, 120);
    ctx.lineTo(512, 130);
    ctx.bezierCurveTo(460, 138, 420, 118, 380, 130);
    ctx.bezierCurveTo(340, 145, 300, 122, 250, 135);
    ctx.bezierCurveTo(200, 150, 160, 128, 120, 140);
    ctx.bezierCurveTo(80, 155, 40, 145, 0, 160);
    ctx.closePath();
    ctx.fill();

    // Exposed dark rock patches poking through snow
    ctx.fillStyle = 'rgba(70, 80, 95, 0.3)';
    const rockPatches = [
      { x: 80, y: 145, rx: 10, ry: 4 },
      { x: 220, y: 138, rx: 8, ry: 3 },
      { x: 350, y: 132, rx: 12, ry: 4 },
      { x: 470, y: 125, rx: 9, ry: 3 },
    ];
    for (const r of rockPatches) {
      ctx.beginPath();
      ctx.ellipse(r.x, r.y, r.rx, r.ry, 0.1, 0, Math.PI * 2);
      ctx.fill();
    }

    // Dead/frozen scrub bushes
    ctx.strokeStyle = '#5a5a68';
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    const shrubs = [
      { x: 50, y: 165 }, { x: 140, y: 155 }, { x: 260, y: 148 },
      { x: 370, y: 152 }, { x: 450, y: 140 },
    ];
    for (const s of shrubs) {
      for (let b = -2; b <= 2; b++) {
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x + b * 4, s.y - 8 - Math.abs(b));
        ctx.stroke();
      }
    }

    // Scattered snow boulders
    const boulderGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 8);
    boulderGrad.addColorStop(0, 'rgba(190, 205, 225, 0.5)');
    boulderGrad.addColorStop(1, 'rgba(140, 160, 185, 0.4)');
    const boulders = [
      { x: 100, y: 170, r: 6 }, { x: 200, y: 160, r: 5 },
      { x: 310, y: 155, r: 7 }, { x: 420, y: 148, r: 5 },
    ];
    for (const b of boulders) {
      ctx.save();
      ctx.translate(b.x, b.y);
      const bg = ctx.createRadialGradient(-1, -1, 0, 0, 0, b.r);
      bg.addColorStop(0, 'rgba(190, 205, 225, 0.5)');
      bg.addColorStop(1, 'rgba(140, 160, 185, 0.4)');
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.ellipse(0, 0, b.r, b.r * 0.65, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Blowing snow / ground haze
    const hazeGrad = ctx.createLinearGradient(0, h - 50, 0, h);
    hazeGrad.addColorStop(0, 'rgba(200, 215, 235, 0)');
    hazeGrad.addColorStop(0.5, 'rgba(210, 220, 240, 0.15)');
    hazeGrad.addColorStop(1, 'rgba(220, 230, 245, 0.35)');
    ctx.fillStyle = hazeGrad;
    ctx.fillRect(0, h - 50, w, 50);

    // Wind-blown snow streaks
    ctx.strokeStyle = 'rgba(230, 240, 255, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      const sy = 200 + (i * 17) % 40;
      const sx = (i * 83) % w;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + 40 + (i % 3) * 15, sy - 2);
      ctx.stroke();
    }

    refresh();
  }

  // ================================================================
  //  FOOD — detailed, appealing collectibles
  // ================================================================
  private makeFoodBug(): void {
    const { ctx, refresh } = this.canvas('food-bug', 24, 20);

    // Body segments
    ctx.fillStyle = '#d4a520';
    ctx.beginPath();
    ctx.ellipse(12, 11, 3, 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#c89818';
    ctx.beginPath();
    ctx.ellipse(10, 11, 2, 1.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wings (translucent, iridescent)
    ctx.save();
    ctx.globalAlpha = 0.5;
    const wingGrad = ctx.createLinearGradient(4, 4, 20, 10);
    wingGrad.addColorStop(0, '#ffe8cc');
    wingGrad.addColorStop(0.5, '#ddeeff');
    wingGrad.addColorStop(1, '#ffeedd');
    ctx.fillStyle = wingGrad;
    // Upper wings
    ctx.beginPath();
    ctx.ellipse(7, 7, 5.5, 3.5, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(17, 7, 5.5, 3.5, 0.3, 0, Math.PI * 2);
    ctx.fill();
    // Lower wings
    ctx.beginPath();
    ctx.ellipse(8, 13, 4, 2.5, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(16, 13, 4, 2.5, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Wing veins
    ctx.strokeStyle = 'rgba(180, 160, 120, 0.3)';
    ctx.lineWidth = 0.4;
    ctx.beginPath();
    ctx.moveTo(12, 10); ctx.lineTo(6, 5);
    ctx.moveTo(12, 10); ctx.lineTo(18, 5);
    ctx.moveTo(12, 12); ctx.lineTo(7, 15);
    ctx.moveTo(12, 12); ctx.lineTo(17, 15);
    ctx.stroke();

    // Head
    ctx.fillStyle = '#b88a14';
    ctx.beginPath();
    ctx.arc(15, 10, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Antennae
    ctx.strokeStyle = '#a07810';
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.moveTo(15, 9);
    ctx.quadraticCurveTo(18, 4, 20, 2);
    ctx.moveTo(16, 9);
    ctx.quadraticCurveTo(20, 5, 22, 4);
    ctx.stroke();
    // Antenna tips
    ctx.fillStyle = '#c89818';
    ctx.beginPath();
    ctx.arc(20, 2, 0.8, 0, Math.PI * 2);
    ctx.arc(22, 4, 0.8, 0, Math.PI * 2);
    ctx.fill();

    refresh();
  }

  private makeFoodLizard(): void {
    const { ctx, refresh } = this.canvas('food-lizard', 30, 20);

    // Body
    const bodyGrad = ctx.createLinearGradient(4, 6, 4, 14);
    bodyGrad.addColorStop(0, '#cc6633');
    bodyGrad.addColorStop(1, '#aa5522');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.moveTo(4, 10);
    ctx.quadraticCurveTo(8, 6, 14, 5);
    ctx.quadraticCurveTo(20, 5, 24, 7);
    ctx.quadraticCurveTo(24, 12, 20, 13);
    ctx.quadraticCurveTo(14, 14, 8, 14);
    ctx.quadraticCurveTo(4, 13, 4, 10);
    ctx.fill();

    // Belly stripe
    ctx.fillStyle = 'rgba(255, 200, 150, 0.3)';
    ctx.beginPath();
    ctx.moveTo(8, 11);
    ctx.quadraticCurveTo(14, 12, 20, 11);
    ctx.quadraticCurveTo(14, 13, 8, 13);
    ctx.closePath();
    ctx.fill();

    // Spot pattern
    ctx.fillStyle = 'rgba(100, 50, 20, 0.3)';
    ctx.beginPath();
    ctx.arc(10, 8, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath();
    ctx.arc(16, 7, 1.2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath();
    ctx.arc(13, 10, 1, 0, Math.PI * 2); ctx.fill();

    // Head
    ctx.fillStyle = '#cc6633';
    ctx.beginPath();
    ctx.ellipse(25, 8, 4, 3.5, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Eye
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(27, 7, 1.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath();
    ctx.arc(26.5, 6.5, 0.5, 0, Math.PI * 2);
    ctx.fill();

    // Tail (curved)
    ctx.strokeStyle = '#bb5522';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(4, 10);
    ctx.quadraticCurveTo(1, 12, 0, 16);
    ctx.stroke();
    ctx.lineCap = 'butt';

    // Legs
    ctx.strokeStyle = '#aa5522';
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(10, 13); ctx.lineTo(8, 18);
    ctx.moveTo(18, 13); ctx.lineTo(16, 18);
    ctx.moveTo(12, 6); ctx.lineTo(10, 2);
    ctx.moveTo(20, 6); ctx.lineTo(18, 2);
    ctx.stroke();
    ctx.lineCap = 'butt';

    refresh();
  }

  private makeFoodFish(): void {
    const { ctx, refresh } = this.canvas('food-fish', 28, 22);

    // Body
    const fishGrad = ctx.createLinearGradient(4, 4, 4, 18);
    fishGrad.addColorStop(0, '#2a7acc');
    fishGrad.addColorStop(0.4, '#4a9add');
    fishGrad.addColorStop(0.7, '#6ab8ee');
    fishGrad.addColorStop(1, '#8acaff');
    ctx.fillStyle = fishGrad;
    ctx.beginPath();
    ctx.moveTo(4, 11);
    ctx.quadraticCurveTo(4, 4, 12, 3);
    ctx.quadraticCurveTo(18, 2, 22, 5);
    ctx.quadraticCurveTo(26, 8, 26, 11);
    ctx.quadraticCurveTo(26, 14, 22, 17);
    ctx.quadraticCurveTo(18, 20, 12, 19);
    ctx.quadraticCurveTo(4, 18, 4, 11);
    ctx.fill();

    // Tail fin
    ctx.fillStyle = '#3a88bb';
    ctx.beginPath();
    ctx.moveTo(4, 8);
    ctx.lineTo(0, 3);
    ctx.lineTo(1, 11);
    ctx.lineTo(0, 19);
    ctx.lineTo(4, 14);
    ctx.closePath();
    ctx.fill();

    // Dorsal fin
    ctx.fillStyle = '#2a6a99';
    ctx.beginPath();
    ctx.moveTo(12, 3);
    ctx.quadraticCurveTo(14, -1, 18, 2);
    ctx.lineTo(16, 4);
    ctx.closePath();
    ctx.fill();

    // Scale lines
    ctx.strokeStyle = 'rgba(20, 70, 120, 0.2)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 5; i++) {
      const sx = 8 + i * 3;
      ctx.beginPath();
      ctx.arc(sx, 11, 4, -0.5, 0.5);
      ctx.stroke();
    }

    // Belly highlight
    ctx.fillStyle = 'rgba(200, 230, 255, 0.3)';
    ctx.beginPath();
    ctx.ellipse(14, 14, 7, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eye
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(22, 9, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(22.5, 9, 1.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.beginPath();
    ctx.arc(21.8, 8.3, 0.6, 0, Math.PI * 2);
    ctx.fill();

    refresh();
  }

  private makeFoodEgg(): void {
    const { ctx, refresh } = this.canvas('food-egg', 22, 28);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.beginPath();
    ctx.ellipse(12, 16, 9, 13, 0, 0, Math.PI * 2);
    ctx.fill();

    // Egg body with gradient
    const eggGrad = ctx.createRadialGradient(9, 11, 1, 11, 14, 13);
    eggGrad.addColorStop(0, '#fff8e8');
    eggGrad.addColorStop(0.5, '#f0e4c8');
    eggGrad.addColorStop(1, '#d8c8a0');
    ctx.fillStyle = eggGrad;
    ctx.beginPath();
    ctx.ellipse(11, 14, 8.5, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Speckles
    const speckles = [
      { x: 7, y: 8, r: 2 }, { x: 14, y: 7, r: 1.8 },
      { x: 10, y: 18, r: 1.5 }, { x: 15, y: 15, r: 1.8 },
      { x: 6, y: 14, r: 1.3 }, { x: 12, y: 11, r: 1 },
      { x: 8, y: 21, r: 1.5 }, { x: 14, y: 21, r: 1.2 },
    ];
    for (const s of speckles) {
      ctx.fillStyle = `rgba(160, 130, 80, ${0.2 + Math.random() * 0.2})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Shine
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.beginPath();
    ctx.ellipse(8, 9, 3, 5, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Outline
    ctx.strokeStyle = 'rgba(160, 140, 100, 0.4)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.ellipse(11, 14, 8.5, 12, 0, 0, Math.PI * 2);
    ctx.stroke();

    refresh();
  }

  // ================================================================
  //  OBSTACLES & HAZARDS
  // ================================================================
  private makeObstacleLog(): void {
    const w = 64, h = 36;
    const { ctx, refresh } = this.canvas('obstacle-log', w, h);

    // Log shadow
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.ellipse(w / 2, h - 2, w / 2 - 2, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Main log body
    const logGrad = ctx.createLinearGradient(0, 4, 0, 30);
    logGrad.addColorStop(0, '#7a5030');
    logGrad.addColorStop(0.3, '#5a3018');
    logGrad.addColorStop(0.7, '#4a2510');
    logGrad.addColorStop(1, '#3a1a08');
    ctx.fillStyle = logGrad;
    ctx.beginPath();
    ctx.moveTo(8, 4);
    ctx.lineTo(w - 4, 4);
    ctx.quadraticCurveTo(w, 4, w, 8);
    ctx.lineTo(w, 28);
    ctx.quadraticCurveTo(w, 32, w - 4, 32);
    ctx.lineTo(8, 32);
    ctx.quadraticCurveTo(4, 32, 4, 28);
    ctx.lineTo(4, 8);
    ctx.quadraticCurveTo(4, 4, 8, 4);
    ctx.closePath();
    ctx.fill();

    // Bark grain lines
    ctx.strokeStyle = 'rgba(35, 18, 5, 0.3)';
    ctx.lineWidth = 0.7;
    for (let y = 8; y < 30; y += 3) {
      ctx.beginPath();
      ctx.moveTo(8, y + Math.sin(y * 0.5) * 1);
      for (let x = 12; x < w - 4; x += 4) {
        ctx.lineTo(x, y + Math.sin(x * 0.3 + y) * 0.8);
      }
      ctx.stroke();
    }

    // Top highlight
    ctx.fillStyle = 'rgba(140, 100, 60, 0.25)';
    ctx.fillRect(8, 4, w - 12, 6);

    // Cross-section (left end)
    const ringGrad = ctx.createRadialGradient(8, 18, 0, 8, 18, 14);
    ringGrad.addColorStop(0, '#8a6848');
    ringGrad.addColorStop(0.3, '#7a5838');
    ringGrad.addColorStop(0.5, '#6a4828');
    ringGrad.addColorStop(0.7, '#5a3818');
    ringGrad.addColorStop(1, '#4a2810');
    ctx.fillStyle = ringGrad;
    ctx.beginPath();
    ctx.ellipse(8, 18, 5, 13, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ring lines
    ctx.strokeStyle = 'rgba(60, 35, 15, 0.3)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.ellipse(8, 18, 3, 8, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(8, 18, 1.5, 4, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Moss spots
    ctx.fillStyle = 'rgba(60, 110, 40, 0.4)';
    ctx.beginPath();
    ctx.arc(30, 6, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath();
    ctx.arc(48, 7, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath();
    ctx.arc(38, 5, 2, 0, Math.PI * 2); ctx.fill();

    refresh();
  }

  // ================================================================
  //  BENCH — Wooden park bench the raptor can jump onto
  // ================================================================
  private makeObstacleBench(): void {
    const w = 60, h = 44;
    const { ctx, refresh } = this.canvas('obstacle-bench', w, h);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath();
    ctx.ellipse(w / 2, h - 2, w / 2 - 4, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Legs (two thick wooden posts)
    const legGrad = ctx.createLinearGradient(0, 16, 0, h - 4);
    legGrad.addColorStop(0, '#6a4a28');
    legGrad.addColorStop(1, '#4a3018');
    ctx.fillStyle = legGrad;
    // Left leg
    ctx.fillRect(8, 18, 6, h - 22);
    // Right leg
    ctx.fillRect(w - 14, 18, 6, h - 22);

    // Cross brace
    ctx.strokeStyle = '#5a3a20';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(14, 30);
    ctx.lineTo(w - 14, 30);
    ctx.stroke();

    // Seat (thick plank)
    const seatGrad = ctx.createLinearGradient(0, 14, 0, 22);
    seatGrad.addColorStop(0, '#a07848');
    seatGrad.addColorStop(0.4, '#8a6438');
    seatGrad.addColorStop(1, '#7a5430');
    ctx.fillStyle = seatGrad;
    ctx.beginPath();
    ctx.moveTo(4, 14);
    ctx.lineTo(w - 4, 14);
    ctx.quadraticCurveTo(w - 2, 14, w - 2, 16);
    ctx.lineTo(w - 2, 22);
    ctx.quadraticCurveTo(w - 2, 24, w - 4, 24);
    ctx.lineTo(4, 24);
    ctx.quadraticCurveTo(2, 24, 2, 22);
    ctx.lineTo(2, 16);
    ctx.quadraticCurveTo(2, 14, 4, 14);
    ctx.closePath();
    ctx.fill();

    // Seat plank lines
    ctx.strokeStyle = 'rgba(50, 30, 10, 0.25)';
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(4, 18); ctx.lineTo(w - 4, 18);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(4, 21); ctx.lineTo(w - 4, 21);
    ctx.stroke();

    // Seat top highlight
    ctx.fillStyle = 'rgba(180, 140, 90, 0.3)';
    ctx.fillRect(4, 14, w - 8, 3);

    // Back rest
    const backGrad = ctx.createLinearGradient(0, 0, 0, 14);
    backGrad.addColorStop(0, '#9a6840');
    backGrad.addColorStop(1, '#7a5430');
    ctx.fillStyle = backGrad;
    ctx.beginPath();
    ctx.moveTo(6, 2);
    ctx.lineTo(w - 6, 2);
    ctx.quadraticCurveTo(w - 4, 2, w - 4, 4);
    ctx.lineTo(w - 4, 12);
    ctx.quadraticCurveTo(w - 4, 14, w - 6, 14);
    ctx.lineTo(6, 14);
    ctx.quadraticCurveTo(4, 14, 4, 12);
    ctx.lineTo(4, 4);
    ctx.quadraticCurveTo(4, 2, 6, 2);
    ctx.closePath();
    ctx.fill();

    // Back rest slat lines
    ctx.strokeStyle = 'rgba(50, 30, 10, 0.2)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(6, 6); ctx.lineTo(w - 6, 6);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(6, 10); ctx.lineTo(w - 6, 10);
    ctx.stroke();

    // Back rest highlight
    ctx.fillStyle = 'rgba(180, 140, 90, 0.25)';
    ctx.fillRect(6, 2, w - 12, 3);

    refresh();
  }

  private makeHazardDimorphodon(): void {
    const W = 52, H = 44;
    const { ctx, refresh } = this.canvas('hazard-dimorphodon', W, H);

    // Shadow beneath body
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.ellipse(24, 42, 12, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // --- Short bat-like wings ---
    const wingGrad = ctx.createLinearGradient(0, 10, 0, 28);
    wingGrad.addColorStop(0, '#8a6a4a');
    wingGrad.addColorStop(0.5, '#7a5a3a');
    wingGrad.addColorStop(1, '#6a4a2a');

    // Left wing (short, bat-shaped)
    ctx.fillStyle = wingGrad;
    ctx.beginPath();
    ctx.moveTo(22, 24);
    ctx.quadraticCurveTo(14, 16, 4, 10);
    ctx.quadraticCurveTo(0, 8, 2, 13);
    ctx.quadraticCurveTo(10, 22, 20, 28);
    ctx.closePath();
    ctx.fill();

    // Right wing (short, bat-shaped)
    ctx.beginPath();
    ctx.moveTo(26, 24);
    ctx.quadraticCurveTo(34, 16, 44, 10);
    ctx.quadraticCurveTo(48, 8, 46, 13);
    ctx.quadraticCurveTo(38, 22, 28, 28);
    ctx.closePath();
    ctx.fill();

    // Wing membrane veins - left
    ctx.strokeStyle = 'rgba(50, 30, 15, 0.35)';
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.moveTo(22, 24); ctx.quadraticCurveTo(12, 14, 4, 10); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(21, 25); ctx.quadraticCurveTo(13, 19, 6, 16); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(21, 27); ctx.quadraticCurveTo(15, 24, 10, 22); ctx.stroke();
    // Wing membrane veins - right
    ctx.beginPath();
    ctx.moveTo(26, 24); ctx.quadraticCurveTo(36, 14, 44, 10); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(27, 25); ctx.quadraticCurveTo(35, 19, 42, 16); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(27, 27); ctx.quadraticCurveTo(33, 24, 38, 22); ctx.stroke();

    // Compact body
    const bodyGrad = ctx.createLinearGradient(24, 18, 24, 34);
    bodyGrad.addColorStop(0, '#5a2a1a');
    bodyGrad.addColorStop(0.5, '#6a3a2a');
    bodyGrad.addColorStop(1, '#4a1a0a');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.ellipse(24, 27, 8, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Short stubby tail
    ctx.fillStyle = '#5a2a1a';
    ctx.beginPath();
    ctx.moveTo(16, 27);
    ctx.quadraticCurveTo(10, 28, 7, 30);
    ctx.lineTo(8, 32);
    ctx.quadraticCurveTo(11, 31, 17, 30);
    ctx.closePath();
    ctx.fill();

    // Skin texture on body
    ctx.strokeStyle = 'rgba(80, 40, 20, 0.25)';
    ctx.lineWidth = 0.5;
    for (let sx = 18; sx <= 30; sx += 4) {
      ctx.beginPath();
      ctx.arc(sx, 27, 2, 0, Math.PI);
      ctx.stroke();
    }

    // LARGE head (~40% of body length) - the defining trait
    const headGrad = ctx.createLinearGradient(28, 12, 28, 28);
    headGrad.addColorStop(0, '#6a3a2a');
    headGrad.addColorStop(0.5, '#5a2a1a');
    headGrad.addColorStop(1, '#4a1a0a');
    ctx.fillStyle = headGrad;
    ctx.beginPath();
    ctx.ellipse(36, 20, 11, 9, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Small crest on head
    ctx.fillStyle = '#7a3a2a';
    ctx.beginPath();
    ctx.moveTo(30, 13);
    ctx.quadraticCurveTo(33, 7, 37, 9);
    ctx.quadraticCurveTo(39, 11, 37, 14);
    ctx.closePath();
    ctx.fill();
    // Crest highlight
    ctx.strokeStyle = 'rgba(140, 70, 40, 0.5)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(30, 13);
    ctx.quadraticCurveTo(33, 7, 37, 9);
    ctx.stroke();

    // Open jaw — upper jaw
    ctx.fillStyle = '#5a2a1a';
    ctx.beginPath();
    ctx.moveTo(43, 18);
    ctx.lineTo(51, 20);
    ctx.lineTo(43, 23);
    ctx.closePath();
    ctx.fill();

    // Lower jaw (open, angled down)
    ctx.fillStyle = '#4a1a0a';
    ctx.beginPath();
    ctx.moveTo(43, 23);
    ctx.lineTo(50, 26);
    ctx.lineTo(43, 27);
    ctx.closePath();
    ctx.fill();

    // Prominent teeth (visible in open jaw)
    ctx.fillStyle = '#e8e0c0';
    for (let tx = 44; tx <= 50; tx += 3) {
      // Upper teeth pointing down
      ctx.beginPath();
      ctx.moveTo(tx, 23);
      ctx.lineTo(tx + 1, 25.5);
      ctx.lineTo(tx + 2, 23);
      ctx.closePath();
      ctx.fill();
    }
    // Lower teeth pointing up
    ctx.fillStyle = '#d8d0b0';
    for (let tx = 45; tx <= 49; tx += 4) {
      ctx.beginPath();
      ctx.moveTo(tx, 26);
      ctx.lineTo(tx + 1, 23.5);
      ctx.lineTo(tx + 2, 26);
      ctx.closePath();
      ctx.fill();
    }

    // Bright amber eye
    ctx.fillStyle = '#ffaa22';
    ctx.beginPath();
    ctx.arc(38, 18, 2.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(38.5, 18, 1.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.beginPath();
    ctx.arc(37.5, 17.2, 0.7, 0, Math.PI * 2);
    ctx.fill();

    // Feet/claws (short legs)
    ctx.fillStyle = '#4a2010';
    ctx.beginPath();
    ctx.moveTo(21, 32); ctx.lineTo(19, 40); ctx.lineTo(17, 40);
    ctx.lineTo(15, 44); ctx.lineTo(19, 42); ctx.lineTo(22, 44);
    ctx.lineTo(22, 40); ctx.lineTo(24, 33);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(27, 32); ctx.lineTo(29, 40); ctx.lineTo(27, 40);
    ctx.lineTo(25, 44); ctx.lineTo(29, 42); ctx.lineTo(32, 44);
    ctx.lineTo(31, 40); ctx.lineTo(29, 33);
    ctx.closePath();
    ctx.fill();

    refresh();
  }

  private makeHazardStegosaurus(): void {
    const W = 100, H = 72;
    const { ctx, refresh } = this.canvas('hazard-stegosaurus', W, H);

    // Shadow beneath
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.beginPath();
    ctx.ellipse(50, 69, 38, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Main body — large rounded quadruped shape
    const bodyGrad = ctx.createLinearGradient(15, 14, 15, 62);
    bodyGrad.addColorStop(0, '#8a7a5a');
    bodyGrad.addColorStop(0.35, '#7a6a4a');
    bodyGrad.addColorStop(0.75, '#6a5a3a');
    bodyGrad.addColorStop(1, '#4a3a24');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.moveTo(14, 38);
    ctx.quadraticCurveTo(12, 20, 28, 16);
    ctx.quadraticCurveTo(44, 12, 62, 14);
    ctx.quadraticCurveTo(78, 16, 84, 26);
    ctx.quadraticCurveTo(90, 36, 86, 48);
    ctx.quadraticCurveTo(82, 58, 72, 60);
    ctx.quadraticCurveTo(50, 64, 28, 61);
    ctx.quadraticCurveTo(14, 58, 12, 48);
    ctx.closePath();
    ctx.fill();

    // Belly shading underside
    const bellyGrad = ctx.createLinearGradient(30, 50, 30, 64);
    bellyGrad.addColorStop(0, 'rgba(0,0,0,0)');
    bellyGrad.addColorStop(1, 'rgba(0,0,0,0.22)');
    ctx.fillStyle = bellyGrad;
    ctx.beginPath();
    ctx.moveTo(20, 56);
    ctx.quadraticCurveTo(50, 66, 78, 58);
    ctx.quadraticCurveTo(50, 62, 20, 56);
    ctx.closePath();
    ctx.fill();

    // Textured hide — small bumpy arcs scattered over body
    ctx.strokeStyle = 'rgba(90, 72, 44, 0.35)';
    ctx.lineWidth = 1;
    const bumpData = [
      [25, 28], [35, 22], [44, 20], [54, 21], [64, 24], [72, 30],
      [68, 40], [58, 38], [46, 34], [34, 36], [24, 40], [30, 50],
      [50, 48], [66, 46], [42, 52], [58, 54],
    ];
    for (const [bx, by] of bumpData) {
      ctx.beginPath();
      ctx.arc(bx, by, 3, Math.PI, 0);
      ctx.stroke();
    }

    // Dorsal plates — 6 tall diamond/pentagonal shapes along spine
    // Plates extend from spine up to near top of canvas (y≈2 to y≈14)
    // to make them "too tall to jump over"
    const platePositions = [
      { x: 32, baseY: 18, width: 10, lean: -1 },
      { x: 42, baseY: 14, width: 12, lean:  1 },
      { x: 52, baseY: 13, width: 13, lean: -1 },
      { x: 62, baseY: 14, width: 12, lean:  1 },
      { x: 71, baseY: 17, width: 10, lean: -1 },
      { x: 79, baseY: 22, width:  8, lean:  1 },
    ];
    for (const { x, baseY, width, lean } of platePositions) {
      const plateGrad = ctx.createLinearGradient(x, 2, x, baseY);
      plateGrad.addColorStop(0, '#9a8a6a');
      plateGrad.addColorStop(0.5, '#8a7a58');
      plateGrad.addColorStop(1, '#7a6a4a');
      ctx.fillStyle = plateGrad;
      const hw = width / 2;
      const tipX = x + lean * 3;
      const tipY = 2;
      ctx.beginPath();
      // Pentagon: tip at top, wide diamond middle, narrows at base
      ctx.moveTo(tipX, tipY);
      ctx.lineTo(x + hw + 2, baseY - 6);
      ctx.lineTo(x + hw, baseY);
      ctx.lineTo(x - hw, baseY);
      ctx.lineTo(x - hw - 2, baseY - 6);
      ctx.closePath();
      ctx.fill();
      // Plate highlight on leading edge
      ctx.strokeStyle = 'rgba(180,160,110,0.45)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(tipX, tipY + 1);
      ctx.lineTo(x - hw - 1, baseY - 7);
      ctx.stroke();
      // Plate shading on trailing edge
      ctx.strokeStyle = 'rgba(60,48,28,0.3)';
      ctx.beginPath();
      ctx.moveTo(tipX, tipY + 1);
      ctx.lineTo(x + hw + 1, baseY - 7);
      ctx.stroke();
    }

    // Tail — tapering to the right
    const tailGrad = ctx.createLinearGradient(82, 44, 100, 52);
    tailGrad.addColorStop(0, '#7a6a4a');
    tailGrad.addColorStop(1, '#5a4a30');
    ctx.fillStyle = tailGrad;
    ctx.beginPath();
    ctx.moveTo(82, 38);
    ctx.quadraticCurveTo(92, 36, 98, 42);
    ctx.quadraticCurveTo(96, 48, 88, 52);
    ctx.quadraticCurveTo(84, 52, 82, 48);
    ctx.closePath();
    ctx.fill();

    // Thagomizer — 4 bone-colored spikes at tail tip
    ctx.fillStyle = '#c8b890';
    const spikeData = [
      { sx: 94, sy: 38, ex: 100, ey: 32, w: 3 },
      { sx: 96, sy: 42, ex: 100, ey: 36, w: 2.5 },
      { sx: 97, sy: 46, ex: 100, ey: 52, w: 2.5 },
      { sx: 94, sy: 50, ex: 99, ey: 58, w: 3 },
    ];
    for (const { sx, sy, ex, ey, w } of spikeData) {
      const angle = Math.atan2(ey - sy, ex - sx);
      const perp = angle + Math.PI / 2;
      ctx.fillStyle = '#c8b890';
      ctx.beginPath();
      ctx.moveTo(sx + Math.cos(perp) * w, sy + Math.sin(perp) * w);
      ctx.lineTo(ex, ey);
      ctx.lineTo(sx - Math.cos(perp) * w, sy - Math.sin(perp) * w);
      ctx.closePath();
      ctx.fill();
      // Spike shading
      ctx.fillStyle = 'rgba(100,80,50,0.25)';
      ctx.beginPath();
      ctx.moveTo(sx + Math.cos(perp) * w * 0.5, sy + Math.sin(perp) * w * 0.5);
      ctx.lineTo(ex, ey);
      ctx.lineTo(sx, sy);
      ctx.closePath();
      ctx.fill();
    }

    // Head — small, low, at left side
    ctx.fillStyle = '#6a5a3a';
    ctx.beginPath();
    ctx.ellipse(10, 44, 12, 8, -0.2, 0, Math.PI * 2);
    ctx.fill();
    // Head shading
    const headShade = ctx.createLinearGradient(2, 38, 22, 52);
    headShade.addColorStop(0, 'rgba(120,100,66,0.2)');
    headShade.addColorStop(1, 'rgba(0,0,0,0.25)');
    ctx.fillStyle = headShade;
    ctx.beginPath();
    ctx.ellipse(10, 44, 12, 8, -0.2, 0, Math.PI * 2);
    ctx.fill();
    // Snout beak-like tip
    ctx.fillStyle = '#5a4a2a';
    ctx.beginPath();
    ctx.moveTo(0, 43); ctx.lineTo(-4, 45); ctx.lineTo(0, 48); ctx.closePath(); ctx.fill();
    // Eye
    ctx.fillStyle = '#aa5500';
    ctx.beginPath();
    ctx.arc(8, 41, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(8, 41, 1.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.beginPath();
    ctx.arc(7.2, 40.3, 0.7, 0, Math.PI * 2);
    ctx.fill();

    // Legs — 4 thick columnar elephant-like legs
    const legPositions = [
      { x: 28, front: true },
      { x: 42, front: false },
      { x: 58, front: false },
      { x: 72, front: true },
    ];
    for (const { x } of legPositions) {
      const legG = ctx.createLinearGradient(x, 54, x + 10, 68);
      legG.addColorStop(0, '#7a6a4a');
      legG.addColorStop(1, '#4a3a24');
      ctx.fillStyle = legG;
      ctx.beginPath();
      ctx.roundRect(x - 5, 54, 10, 16, 3);
      ctx.fill();
      // Leg muscle highlight
      ctx.fillStyle = 'rgba(160,130,90,0.22)';
      ctx.beginPath();
      ctx.ellipse(x - 1, 58, 3, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      // Foot pad
      ctx.fillStyle = '#3a2a14';
      ctx.beginPath();
      ctx.ellipse(x, 69, 7, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      // Toe nubs
      ctx.fillStyle = '#2a1a0a';
      for (let t = -2; t <= 2; t++) {
        ctx.beginPath();
        ctx.arc(x + t * 2.2, 71, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    refresh();
  }

  private makeHazardPterodactyl(): void {
    const W = 80, H = 56;
    const { ctx, refresh } = this.canvas('hazard-pterodactyl', W, H);

    // Shadow beneath body
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.ellipse(40, 52, 18, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // --- Wings ---
    const wingGrad = ctx.createLinearGradient(0, 0, 0, 28);
    wingGrad.addColorStop(0, '#5a4535');
    wingGrad.addColorStop(0.5, '#7a6555');
    wingGrad.addColorStop(1, '#4a3828');

    // Left wing (wider membrane)
    ctx.fillStyle = wingGrad;
    ctx.beginPath();
    ctx.moveTo(40, 23);
    ctx.quadraticCurveTo(28, 14, 14, 6);
    ctx.quadraticCurveTo(6, 1, 0, 0);
    ctx.quadraticCurveTo(0, 6, 3, 11);
    ctx.quadraticCurveTo(14, 22, 34, 26);
    ctx.closePath();
    ctx.fill();

    // Right wing (wider membrane)
    ctx.beginPath();
    ctx.moveTo(40, 23);
    ctx.quadraticCurveTo(52, 14, 66, 6);
    ctx.quadraticCurveTo(74, 1, 80, 0);
    ctx.quadraticCurveTo(80, 6, 77, 11);
    ctx.quadraticCurveTo(66, 22, 46, 26);
    ctx.closePath();
    ctx.fill();

    // Wing membrane veins/fingers - left wing (3-4 lines)
    ctx.strokeStyle = 'rgba(60, 40, 25, 0.35)';
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.moveTo(38, 23); ctx.quadraticCurveTo(24, 11, 4, 2); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(38, 23); ctx.quadraticCurveTo(22, 17, 8, 9); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(38, 24); ctx.quadraticCurveTo(26, 20, 12, 16); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(38, 25); ctx.quadraticCurveTo(30, 23, 18, 22); ctx.stroke();
    // Wing membrane veins/fingers - right wing
    ctx.beginPath();
    ctx.moveTo(42, 23); ctx.quadraticCurveTo(56, 11, 76, 2); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(42, 23); ctx.quadraticCurveTo(58, 17, 72, 9); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(42, 24); ctx.quadraticCurveTo(54, 20, 68, 16); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(42, 25); ctx.quadraticCurveTo(50, 23, 62, 22); ctx.stroke();

    // Body (larger torso)
    const bodyGrad = ctx.createLinearGradient(40, 16, 40, 36);
    bodyGrad.addColorStop(0, '#4a3828');
    bodyGrad.addColorStop(0.5, '#5a4838');
    bodyGrad.addColorStop(1, '#3a2818');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.ellipse(40, 26, 10, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Textured skin - subtle scale pattern on body
    ctx.strokeStyle = 'rgba(80, 55, 35, 0.25)';
    ctx.lineWidth = 0.5;
    for (let sx = 32; sx <= 48; sx += 4) {
      ctx.beginPath();
      ctx.arc(sx, 26, 2, 0, Math.PI);
      ctx.stroke();
    }
    for (let sx = 34; sx <= 46; sx += 4) {
      ctx.beginPath();
      ctx.arc(sx, 30, 2, 0, Math.PI);
      ctx.stroke();
    }

    // Head
    ctx.fillStyle = '#4a3828';
    ctx.beginPath();
    ctx.ellipse(52, 20, 8, 6, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Beak (upper)
    const beakGrad = ctx.createLinearGradient(58, 17, 72, 22);
    beakGrad.addColorStop(0, '#8a7050');
    beakGrad.addColorStop(1, '#6a5030');
    ctx.fillStyle = beakGrad;
    ctx.beginPath();
    ctx.moveTo(58, 17);
    ctx.lineTo(72, 20);
    ctx.lineTo(58, 22);
    ctx.closePath();
    ctx.fill();

    // Beak (lower jaw with teeth)
    ctx.fillStyle = '#7a6040';
    ctx.beginPath();
    ctx.moveTo(58, 22);
    ctx.lineTo(70, 23);
    ctx.lineTo(58, 25);
    ctx.closePath();
    ctx.fill();
    // Visible teeth
    ctx.fillStyle = '#e8e0c8';
    for (let tx = 60; tx <= 68; tx += 4) {
      ctx.beginPath();
      ctx.moveTo(tx, 22);
      ctx.lineTo(tx + 1.5, 24);
      ctx.lineTo(tx + 3, 22);
      ctx.closePath();
      ctx.fill();
    }

    // Crest with gradient detail
    const crestGrad = ctx.createLinearGradient(46, 8, 52, 18);
    crestGrad.addColorStop(0, '#cc3322');
    crestGrad.addColorStop(0.5, '#993322');
    crestGrad.addColorStop(1, '#663322');
    ctx.fillStyle = crestGrad;
    ctx.beginPath();
    ctx.moveTo(46, 17);
    ctx.quadraticCurveTo(48, 6, 54, 8);
    ctx.quadraticCurveTo(56, 10, 54, 16);
    ctx.closePath();
    ctx.fill();
    // Crest edge highlight
    ctx.strokeStyle = 'rgba(200, 80, 60, 0.4)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(46, 17);
    ctx.quadraticCurveTo(48, 6, 54, 8);
    ctx.stroke();

    // Eye (menacing red)
    ctx.fillStyle = '#ff2200';
    ctx.beginPath();
    ctx.arc(53, 19, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(53.5, 19, 1.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.beginPath();
    ctx.arc(52.5, 18.2, 0.7, 0, Math.PI * 2);
    ctx.fill();

    // Feet/claws
    ctx.fillStyle = '#4a3828';
    ctx.beginPath();
    ctx.moveTo(37, 32); ctx.lineTo(34, 44); ctx.lineTo(32, 44);
    ctx.lineTo(29, 50); ctx.lineTo(34, 48); ctx.lineTo(39, 50);
    ctx.lineTo(37, 44); ctx.lineTo(40, 34);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(43, 32); ctx.lineTo(46, 44); ctx.lineTo(44, 44);
    ctx.lineTo(41, 50); ctx.lineTo(46, 48); ctx.lineTo(51, 50);
    ctx.lineTo(49, 44); ctx.lineTo(46, 34);
    ctx.closePath();
    ctx.fill();
    // Claw tips
    ctx.fillStyle = '#2a1808';
    ctx.beginPath();
    ctx.moveTo(29, 50); ctx.lineTo(27, 53); ctx.lineTo(34, 48); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(39, 50); ctx.lineTo(40, 53); ctx.lineTo(34, 48); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(41, 50); ctx.lineTo(39, 53); ctx.lineTo(46, 48); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(51, 50); ctx.lineTo(53, 53); ctx.lineTo(46, 48); ctx.fill();

    refresh();
  }

  private makeHazardRock(): void {
    const { ctx, refresh } = this.canvas('hazard-rock', 32, 28);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.ellipse(17, 25, 12, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Rock body (angular)
    const rockGrad = ctx.createLinearGradient(4, 0, 20, 24);
    rockGrad.addColorStop(0, '#8a8a8a');
    rockGrad.addColorStop(0.4, '#6a6a6a');
    rockGrad.addColorStop(1, '#4a4a4a');
    ctx.fillStyle = rockGrad;
    ctx.beginPath();
    ctx.moveTo(14, 0);
    ctx.lineTo(24, 2);
    ctx.lineTo(30, 8);
    ctx.lineTo(28, 18);
    ctx.lineTo(22, 24);
    ctx.lineTo(10, 24);
    ctx.lineTo(2, 18);
    ctx.lineTo(0, 10);
    ctx.lineTo(6, 2);
    ctx.closePath();
    ctx.fill();

    // Light face
    ctx.fillStyle = 'rgba(180, 180, 180, 0.3)';
    ctx.beginPath();
    ctx.moveTo(14, 2);
    ctx.lineTo(24, 4);
    ctx.lineTo(28, 12);
    ctx.lineTo(16, 10);
    ctx.lineTo(8, 6);
    ctx.closePath();
    ctx.fill();

    // Cracks
    ctx.strokeStyle = 'rgba(40, 40, 40, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(10, 6);
    ctx.lineTo(16, 14);
    ctx.lineTo(24, 12);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(14, 14);
    ctx.lineTo(8, 20);
    ctx.stroke();

    // Surface texture
    ctx.fillStyle = 'rgba(100, 100, 100, 0.2)';
    ctx.beginPath();
    ctx.arc(18, 8, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath();
    ctx.arc(12, 16, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath();
    ctx.arc(22, 18, 1.5, 0, Math.PI * 2); ctx.fill();

    // Edge highlight
    ctx.strokeStyle = 'rgba(200, 200, 200, 0.2)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(6, 2);
    ctx.lineTo(14, 0);
    ctx.lineTo(24, 2);
    ctx.stroke();

    refresh();
  }

  // ================================================================
  //  UI
  // ================================================================
  private makeHazardTriceratops(): void {
    const W = 90, H = 64;
    const { ctx, refresh } = this.canvas('hazard-triceratops', W, H);

    // Shadow beneath
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.ellipse(45, 61, 30, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body (bulkier proportions)
    const bodyGrad = ctx.createLinearGradient(14, 12, 14, 56);
    bodyGrad.addColorStop(0, '#8a7a58');
    bodyGrad.addColorStop(0.4, '#7a6a4a');
    bodyGrad.addColorStop(1, '#5a4a38');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.moveTo(10, 28);
    ctx.quadraticCurveTo(16, 13, 33, 10);
    ctx.quadraticCurveTo(55, 7, 70, 16);
    ctx.quadraticCurveTo(78, 22, 78, 33);
    ctx.quadraticCurveTo(78, 50, 68, 55);
    ctx.quadraticCurveTo(50, 60, 26, 57);
    ctx.quadraticCurveTo(12, 54, 10, 44);
    ctx.closePath();
    ctx.fill();

    // Shoulder muscle shading
    const shoulderGrad = ctx.createRadialGradient(30, 28, 2, 30, 28, 16);
    shoulderGrad.addColorStop(0, 'rgba(160,140,100,0.3)');
    shoulderGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = shoulderGrad;
    ctx.beginPath();
    ctx.ellipse(30, 32, 14, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Textured hide - bumpy pattern
    ctx.fillStyle = 'rgba(100, 80, 50, 0.15)';
    for (let bx = 20; bx <= 70; bx += 8) {
      for (let by = 18; by <= 50; by += 7) {
        ctx.beginPath();
        ctx.arc(bx + (by % 8), by, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Frill (shield behind head) with scalloped edge
    const frillGrad = ctx.createLinearGradient(58, 0, 90, 28);
    frillGrad.addColorStop(0, '#9a8a6a');
    frillGrad.addColorStop(0.5, '#8a7a58');
    frillGrad.addColorStop(1, '#7a6a4a');
    ctx.fillStyle = frillGrad;
    ctx.beginPath();
    ctx.moveTo(60, 8);
    ctx.quadraticCurveTo(72, 0, 82, 4);
    ctx.quadraticCurveTo(90, 14, 86, 26);
    ctx.quadraticCurveTo(80, 22, 72, 18);
    ctx.quadraticCurveTo(68, 16, 62, 14);
    ctx.closePath();
    ctx.fill();
    // Scalloped frill edge
    ctx.strokeStyle = 'rgba(140, 100, 60, 0.5)';
    ctx.lineWidth = 1;
    for (let fi = 0; fi < 3; fi++) {
      const fx = 62 + fi * 9;
      const fy = 4 + fi * 6;
      ctx.beginPath();
      ctx.arc(fx, fy, 3, 0, Math.PI);
      ctx.stroke();
    }
    // Frill decorative eye spots
    ctx.fillStyle = 'rgba(120, 60, 30, 0.4)';
    ctx.beginPath();
    ctx.arc(76, 12, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(180, 100, 50, 0.3)';
    ctx.beginPath();
    ctx.arc(76, 12, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(120, 60, 30, 0.4)';
    ctx.beginPath();
    ctx.arc(68, 6, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = '#6a5a44';
    ctx.beginPath();
    ctx.ellipse(14, 33, 14, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    // Head shading
    const headShade = ctx.createLinearGradient(4, 26, 28, 44);
    headShade.addColorStop(0, 'rgba(120,100,70,0.2)');
    headShade.addColorStop(1, 'rgba(0,0,0,0.2)');
    ctx.fillStyle = headShade;
    ctx.beginPath();
    ctx.ellipse(14, 33, 14, 11, 0, 0, Math.PI * 2);
    ctx.fill();

    // Three properly positioned horns
    ctx.fillStyle = '#c8b890';
    // Left brow horn (long)
    ctx.beginPath();
    ctx.moveTo(6, 28); ctx.lineTo(0, 16); ctx.lineTo(8, 25); ctx.closePath(); ctx.fill();
    // Right brow horn (long)
    ctx.beginPath();
    ctx.moveTo(10, 25); ctx.lineTo(6, 11); ctx.lineTo(13, 22); ctx.closePath(); ctx.fill();
    // Nose horn (shorter)
    ctx.beginPath();
    ctx.moveTo(3, 33); ctx.lineTo(-2, 29); ctx.lineTo(3, 37); ctx.closePath(); ctx.fill();
    // Horn shading
    ctx.fillStyle = 'rgba(100, 80, 50, 0.3)';
    ctx.beginPath();
    ctx.moveTo(7, 27); ctx.lineTo(3, 19); ctx.lineTo(8, 25); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(11, 24); ctx.lineTo(8, 14); ctx.lineTo(13, 22); ctx.closePath(); ctx.fill();

    // Brow ridge above eye
    ctx.fillStyle = '#5a4a36';
    ctx.beginPath();
    ctx.ellipse(12, 28, 5, 2, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Eye with brow detail
    ctx.fillStyle = '#aa3300';
    ctx.beginPath();
    ctx.arc(11, 30, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(10.5, 30, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.beginPath();
    ctx.arc(9.5, 29, 1, 0, Math.PI * 2);
    ctx.fill();

    // Legs with gradient musculature
    const legGrad = ctx.createLinearGradient(0, 52, 12, 62);
    legGrad.addColorStop(0, '#6a5a44');
    legGrad.addColorStop(1, '#4a3a28');
    ctx.fillStyle = legGrad;
    ctx.beginPath();
    ctx.roundRect(26, 52, 10, 12, 2);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(50, 52, 10, 12, 2);
    ctx.fill();
    // Leg highlight (musculature)
    ctx.fillStyle = 'rgba(160, 130, 90, 0.25)';
    ctx.beginPath();
    ctx.ellipse(29, 55, 3, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(53, 55, 3, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    // Feet
    ctx.fillStyle = '#4a3a28';
    ctx.fillRect(22, 62, 16, 4);
    ctx.fillRect(46, 62, 16, 4);
    // Toes
    ctx.fillStyle = '#3a2a18';
    ctx.fillRect(21, 65, 5, 2);
    ctx.fillRect(27, 65, 5, 2);
    ctx.fillRect(33, 65, 5, 2);
    ctx.fillRect(45, 65, 5, 2);
    ctx.fillRect(51, 65, 5, 2);
    ctx.fillRect(57, 65, 5, 2);

    // Short thick tail
    ctx.fillStyle = '#6a5a44';
    ctx.beginPath();
    ctx.moveTo(72, 36);
    ctx.quadraticCurveTo(82, 40, 86, 48);
    ctx.quadraticCurveTo(82, 44, 72, 42);
    ctx.closePath();
    ctx.fill();
    // Tail shading
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.moveTo(73, 39);
    ctx.quadraticCurveTo(80, 42, 84, 48);
    ctx.quadraticCurveTo(80, 44, 73, 42);
    ctx.closePath();
    ctx.fill();

    refresh();
  }

  private makeHazardTrap(): void {
    const W = 36, H = 28;
    const { ctx, refresh } = this.canvas('hazard-trap', W, H);

    // Net base (rope)
    ctx.strokeStyle = '#8a7a50';
    ctx.lineWidth = 2;
    // Ground stakes
    ctx.fillStyle = '#6a5a40';
    ctx.fillRect(2, 16, 4, 12);
    ctx.fillRect(30, 16, 4, 12);

    // Net mesh
    ctx.strokeStyle = '#a89870';
    ctx.lineWidth = 1;
    // Vertical lines
    for (let x = 4; x <= 32; x += 4) {
      ctx.beginPath();
      ctx.moveTo(x, 2);
      ctx.quadraticCurveTo(x + 1, 14, x, 20);
      ctx.stroke();
    }
    // Horizontal lines
    for (let y = 4; y <= 18; y += 4) {
      ctx.beginPath();
      ctx.moveTo(4, y);
      ctx.lineTo(32, y);
      ctx.stroke();
    }

    // Rope at top
    ctx.strokeStyle = '#7a6a44';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(4, 2);
    ctx.quadraticCurveTo(18, -2, 32, 2);
    ctx.stroke();

    refresh();
  }

  private makeHazardSpear(): void {
    const W = 48, H = 10;
    const { ctx, refresh } = this.canvas('hazard-spear', W, H);

    // Shaft
    const shaftGrad = ctx.createLinearGradient(0, 3, 0, 7);
    shaftGrad.addColorStop(0, '#8a7050');
    shaftGrad.addColorStop(1, '#6a5030');
    ctx.fillStyle = shaftGrad;
    ctx.fillRect(0, 3, 38, 4);

    // Spear tip
    ctx.fillStyle = '#aaa';
    ctx.beginPath();
    ctx.moveTo(38, 1);
    ctx.lineTo(48, 5);
    ctx.lineTo(38, 9);
    ctx.closePath();
    ctx.fill();
    // Tip shine
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.beginPath();
    ctx.moveTo(40, 3);
    ctx.lineTo(46, 5);
    ctx.lineTo(40, 5);
    ctx.closePath();
    ctx.fill();

    // Feather fletching at back
    ctx.fillStyle = '#cc4444';
    ctx.beginPath();
    ctx.moveTo(4, 3); ctx.lineTo(0, 0); ctx.lineTo(8, 3); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(4, 7); ctx.lineTo(0, 10); ctx.lineTo(8, 7); ctx.fill();

    refresh();
  }

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

  // ================================================================
  //  DILOPHOSAURUS — stationary ranged bipedal theropod with crests
  // ================================================================
  private makeHazardDilophosaurus(): void {
    const W = 80, H = 70;
    const { ctx, refresh } = this.canvas('hazard-dilophosaurus', W, H);

    // --- SHADOW ---
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.beginPath();
    ctx.ellipse(42, 66, 22, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // --- TAIL (long, thin, low, sweeping right) ---
    ctx.strokeStyle = '#3a4a1a';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(60, 52);
    ctx.quadraticCurveTo(72, 55, 78, 50);
    ctx.stroke();
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(78, 50);
    ctx.quadraticCurveTo(82, 46, 79, 42);
    ctx.stroke();

    // --- BODY ---
    const bodyGrad = ctx.createLinearGradient(30, 30, 65, 60);
    bodyGrad.addColorStop(0, '#5a6a2a');
    bodyGrad.addColorStop(0.5, '#4a5a2a');
    bodyGrad.addColorStop(1, '#3a4a1a');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.ellipse(48, 48, 18, 12, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Body outline
    ctx.strokeStyle = '#3a4a1a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(48, 48, 18, 12, -0.3, 0, Math.PI * 2);
    ctx.stroke();

    // --- LEGS ---
    ctx.strokeStyle = '#3a4a1a';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    // Back leg
    ctx.beginPath();
    ctx.moveTo(54, 56);
    ctx.lineTo(56, 63);
    ctx.lineTo(52, 66);
    ctx.stroke();
    // Front leg
    ctx.beginPath();
    ctx.moveTo(44, 57);
    ctx.lineTo(45, 63);
    ctx.lineTo(42, 66);
    ctx.stroke();

    // --- FEATHERED FOREARMS ---
    ctx.strokeStyle = '#6a7a3a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(37, 44);
    ctx.lineTo(28, 50);
    ctx.stroke();
    // Feather barbs
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      const tx = 37 - i * 2.2;
      const ty = 44 + i * 1.5;
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(tx - 3, ty + 3);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(tx + 2, ty + 3);
      ctx.stroke();
    }

    // --- NECK (upright ~60 degrees) ---
    const neckGrad = ctx.createLinearGradient(36, 30, 40, 48);
    neckGrad.addColorStop(0, '#5a6a2a');
    neckGrad.addColorStop(1, '#4a5a2a');
    ctx.fillStyle = neckGrad;
    ctx.beginPath();
    ctx.moveTo(34, 48);
    ctx.quadraticCurveTo(30, 38, 34, 28);
    ctx.quadraticCurveTo(40, 26, 42, 36);
    ctx.quadraticCurveTo(42, 44, 38, 48);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#3a4a1a';
    ctx.lineWidth = 1;
    ctx.stroke();

    // --- FRILL (expandable neck frill, fanned out) ---
    const frillColors = ['#ff8800', '#ffcc00', '#ff6600', '#ffaa00'];
    for (let i = 0; i < 8; i++) {
      const angle = (-0.6 + i * 0.18) * Math.PI;
      const fx = 36 + Math.cos(angle) * 16;
      const fy = 34 + Math.sin(angle) * 14;
      ctx.strokeStyle = frillColors[i % frillColors.length];
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(36, 34);
      ctx.lineTo(fx, fy);
      ctx.stroke();
      // Dark spot at tip
      ctx.fillStyle = '#441100';
      ctx.beginPath();
      ctx.arc(fx, fy, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    // Frill membrane
    ctx.fillStyle = 'rgba(255, 140, 0, 0.2)';
    ctx.beginPath();
    ctx.moveTo(36, 34);
    for (let i = 0; i < 8; i++) {
      const angle = (-0.6 + i * 0.18) * Math.PI;
      ctx.lineTo(36 + Math.cos(angle) * 16, 34 + Math.sin(angle) * 14);
    }
    ctx.closePath();
    ctx.fill();

    // --- HEAD ---
    const headGrad = ctx.createLinearGradient(14, 18, 36, 32);
    headGrad.addColorStop(0, '#5a6a2a');
    headGrad.addColorStop(1, '#4a5a2a');
    ctx.fillStyle = headGrad;
    ctx.beginPath();
    ctx.ellipse(24, 26, 13, 8, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#3a4a1a';
    ctx.lineWidth = 1;
    ctx.stroke();

    // --- TWIN CRESTS on head ---
    for (let c = 0; c < 2; c++) {
      const crestGrad = ctx.createLinearGradient(18 + c * 4, 12, 26 + c * 4, 22);
      crestGrad.addColorStop(0, '#cc6644');
      crestGrad.addColorStop(1, '#aa4422');
      ctx.fillStyle = crestGrad;
      ctx.beginPath();
      ctx.moveTo(18 + c * 4, 22);
      ctx.lineTo(16 + c * 4, 12);
      ctx.lineTo(22 + c * 4, 11);
      ctx.lineTo(24 + c * 4, 20);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#882200';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // --- EYE ---
    ctx.fillStyle = '#ffee88';
    ctx.beginPath();
    ctx.arc(19, 23, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#111100';
    ctx.beginPath();
    ctx.arc(18.5, 23, 1.8, 0, Math.PI * 2);
    ctx.fill();
    // Eye shine
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.beginPath();
    ctx.arc(17.8, 22.3, 0.7, 0, Math.PI * 2);
    ctx.fill();

    // --- OPEN MOUTH / teeth (about to spit) ---
    ctx.fillStyle = '#cc2200';
    ctx.beginPath();
    ctx.moveTo(11, 26);
    ctx.lineTo(7, 24);
    ctx.lineTo(7, 28);
    ctx.closePath();
    ctx.fill();
    // Upper teeth
    ctx.fillStyle = '#eeeecc';
    for (let t = 0; t < 3; t++) {
      ctx.beginPath();
      ctx.moveTo(10 - t * 1.2, 25.5);
      ctx.lineTo(9.5 - t * 1.2, 28);
      ctx.lineTo(9 - t * 1.2, 25.5);
      ctx.fill();
    }
    // Venom drip hint at mouth tip
    ctx.fillStyle = '#88dd00';
    ctx.beginPath();
    ctx.arc(7.5, 27.5, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // --- BELLY stripes (subtle camouflage) ---
    ctx.strokeStyle = 'rgba(80, 100, 30, 0.4)';
    ctx.lineWidth = 1;
    for (let s = 0; s < 4; s++) {
      ctx.beginPath();
      ctx.moveTo(36 + s * 5, 52);
      ctx.lineTo(40 + s * 5, 44);
      ctx.stroke();
    }

    refresh();
  }

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

  private makeHazardAnkylosaurus(): void {
    const W = 96, H = 52;
    const { ctx, refresh } = this.canvas('hazard-ankylosaurus', W, H);

    // Shadow beneath
    ctx.fillStyle = 'rgba(0,0,0,0.20)';
    ctx.beginPath();
    ctx.ellipse(48, 50, 40, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Short thick legs (barely visible below armor)
    ctx.fillStyle = '#4a4030';
    // Front-left leg
    ctx.beginPath();
    ctx.roundRect(18, 38, 10, 12, 2);
    ctx.fill();
    // Front-right leg
    ctx.beginPath();
    ctx.roundRect(30, 38, 10, 12, 2);
    ctx.fill();
    // Rear-left leg
    ctx.beginPath();
    ctx.roundRect(54, 38, 10, 12, 2);
    ctx.fill();
    // Rear-right leg
    ctx.beginPath();
    ctx.roundRect(66, 38, 10, 12, 2);
    ctx.fill();

    // Main armored body — wide, low, tank-like
    const bodyGrad = ctx.createLinearGradient(10, 10, 10, 44);
    bodyGrad.addColorStop(0, '#7a7060');
    bodyGrad.addColorStop(0.4, '#6a6050');
    bodyGrad.addColorStop(0.85, '#5a5040');
    bodyGrad.addColorStop(1, '#3a3028');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.moveTo(14, 38);
    ctx.quadraticCurveTo(8, 36, 10, 26);
    ctx.quadraticCurveTo(12, 14, 26, 10);
    ctx.quadraticCurveTo(44, 6, 62, 8);
    ctx.quadraticCurveTo(76, 10, 80, 20);
    ctx.quadraticCurveTo(84, 30, 80, 38);
    ctx.quadraticCurveTo(70, 42, 48, 43);
    ctx.quadraticCurveTo(28, 43, 14, 38);
    ctx.closePath();
    ctx.fill();

    // Armor highlight top
    ctx.fillStyle = 'rgba(160,148,120,0.22)';
    ctx.beginPath();
    ctx.ellipse(46, 17, 32, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Scute pattern — rows of raised oval bumps across the back
    const scuteColor = '#8a7a60';
    const scuteShadow = '#4a4030';
    const scuteRows = [
      // [cx, cy, rx, ry]
      [24, 20, 5, 4],
      [35, 15, 6, 4],
      [46, 12, 6, 4],
      [57, 14, 6, 4],
      [67, 18, 5, 4],
      [74, 26, 4, 3],
      [20, 30, 4, 3],
      [31, 26, 5, 4],
      [43, 23, 5, 4],
      [55, 24, 5, 4],
      [65, 28, 4, 3],
      [24, 36, 4, 3],
      [37, 34, 5, 3],
      [50, 33, 5, 3],
      [62, 34, 4, 3],
    ] as const;
    for (const [cx, cy, rx, ry] of scuteRows) {
      // Shadow under scute
      ctx.fillStyle = scuteShadow;
      ctx.beginPath();
      ctx.ellipse(cx + 1, cy + 1.5, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
      // Scute itself
      const scuteGrad = ctx.createRadialGradient(cx - 1, cy - 1, 1, cx, cy, rx);
      scuteGrad.addColorStop(0, '#a09070');
      scuteGrad.addColorStop(0.5, scuteColor);
      scuteGrad.addColorStop(1, '#5a5040');
      ctx.fillStyle = scuteGrad;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Spiky armor ridges along the sides
    ctx.fillStyle = '#7a6a50';
    const sideSpikes = [
      [16, 34, 14, 32, 12, 38],
      [22, 34, 20, 31, 18, 37],
      [68, 36, 72, 33, 74, 38],
      [62, 36, 66, 32, 68, 38],
    ] as const;
    for (const [x1, y1, x2, y2, x3, y3] of sideSpikes) {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x3, y3);
      ctx.closePath();
      ctx.fill();
    }

    // Club tail — right side, bone-colored round knob
    // Tail shaft
    ctx.fillStyle = '#8a7a60';
    ctx.beginPath();
    ctx.moveTo(78, 28);
    ctx.quadraticCurveTo(88, 26, 90, 30);
    ctx.quadraticCurveTo(88, 34, 80, 34);
    ctx.closePath();
    ctx.fill();
    // Club knob
    const clubGrad = ctx.createRadialGradient(91, 30, 2, 91, 30, 7);
    clubGrad.addColorStop(0, '#c0b090');
    clubGrad.addColorStop(0.5, '#9a8a6a');
    clubGrad.addColorStop(1, '#6a5a40');
    ctx.fillStyle = clubGrad;
    ctx.beginPath();
    ctx.ellipse(91, 30, 6, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    // Club knob highlight
    ctx.fillStyle = 'rgba(220,200,160,0.35)';
    ctx.beginPath();
    ctx.ellipse(89, 27, 3, 2, -0.5, 0, Math.PI * 2);
    ctx.fill();

    // Small head — left side
    const headGrad = ctx.createLinearGradient(4, 18, 4, 36);
    headGrad.addColorStop(0, '#7a7060');
    headGrad.addColorStop(1, '#5a5040');
    ctx.fillStyle = headGrad;
    ctx.beginPath();
    ctx.moveTo(14, 22);
    ctx.quadraticCurveTo(10, 18, 6, 22);
    ctx.quadraticCurveTo(2, 26, 4, 32);
    ctx.quadraticCurveTo(6, 36, 12, 34);
    ctx.quadraticCurveTo(16, 32, 14, 26);
    ctx.closePath();
    ctx.fill();

    // Beak-like mouth
    ctx.fillStyle = '#4a3a28';
    ctx.beginPath();
    ctx.moveTo(4, 32);
    ctx.lineTo(2, 35);
    ctx.lineTo(8, 34);
    ctx.closePath();
    ctx.fill();

    // Beady eye
    ctx.fillStyle = '#1a1008';
    ctx.beginPath();
    ctx.arc(8, 24, 2, 0, Math.PI * 2);
    ctx.fill();
    // Eye highlight
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.beginPath();
    ctx.arc(9, 23, 0.7, 0, Math.PI * 2);
    ctx.fill();

    // Neck/head armor banding
    ctx.strokeStyle = 'rgba(60,50,32,0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(12, 20);
    ctx.quadraticCurveTo(14, 24, 12, 30);
    ctx.stroke();

    refresh();
  }

  private makeHazardParasaurolophus(): void {
    const W = 96, H = 80;
    const { ctx, refresh } = this.canvas('hazard-parasaurolophus', W, H);

    // --- GROUND SHADOW ---
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.beginPath();
    ctx.ellipse(46, 77, 32, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // --- TAIL (long, muscular, tapering right with slight droop) ---
    const tailGrad = ctx.createLinearGradient(62, 38, 94, 48);
    tailGrad.addColorStop(0, '#5a6e3a');
    tailGrad.addColorStop(0.5, '#4e6030');
    tailGrad.addColorStop(1, '#3a4a22');
    ctx.fillStyle = tailGrad;
    ctx.beginPath();
    ctx.moveTo(62, 36);
    ctx.quadraticCurveTo(74, 32, 84, 36);
    ctx.quadraticCurveTo(92, 40, 94, 44);
    ctx.quadraticCurveTo(90, 48, 82, 46);
    ctx.quadraticCurveTo(72, 44, 62, 44);
    ctx.closePath();
    ctx.fill();
    // Tail spine ridge
    ctx.strokeStyle = 'rgba(80,100,50,0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(64, 37);
    ctx.quadraticCurveTo(76, 33, 88, 38);
    ctx.stroke();
    // Tail underside shading
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath();
    ctx.moveTo(64, 44);
    ctx.quadraticCurveTo(78, 48, 90, 46);
    ctx.quadraticCurveTo(78, 46, 64, 44);
    ctx.closePath();
    ctx.fill();

    // --- FAR HIND LEG (behind body, darker) ---
    const farLegGrad = ctx.createLinearGradient(48, 52, 48, 76);
    farLegGrad.addColorStop(0, '#3e5222');
    farLegGrad.addColorStop(0.6, '#334518');
    farLegGrad.addColorStop(1, '#2a3812');
    ctx.fillStyle = farLegGrad;
    // Thigh
    ctx.beginPath();
    ctx.moveTo(52, 50);
    ctx.quadraticCurveTo(58, 54, 56, 60);
    ctx.lineTo(54, 68);
    ctx.quadraticCurveTo(53, 72, 50, 74);
    ctx.lineTo(44, 74);
    ctx.quadraticCurveTo(44, 70, 46, 66);
    ctx.lineTo(44, 58);
    ctx.quadraticCurveTo(44, 52, 48, 50);
    ctx.closePath();
    ctx.fill();
    // Far foot
    ctx.fillStyle = '#2a3812';
    ctx.beginPath();
    ctx.moveTo(44, 74);
    ctx.lineTo(42, 76);
    ctx.lineTo(54, 76);
    ctx.lineTo(50, 74);
    ctx.closePath();
    ctx.fill();
    // Toe claws
    ctx.fillStyle = '#1a2008';
    for (const tx of [43, 47, 51]) {
      ctx.beginPath();
      ctx.moveTo(tx, 76);
      ctx.lineTo(tx + 1, 78);
      ctx.lineTo(tx + 2, 76);
      ctx.closePath();
      ctx.fill();
    }

    // --- FAR FRONT LEG ---
    ctx.fillStyle = farLegGrad;
    ctx.beginPath();
    ctx.moveTo(30, 52);
    ctx.quadraticCurveTo(34, 56, 34, 62);
    ctx.lineTo(33, 70);
    ctx.quadraticCurveTo(32, 74, 28, 76);
    ctx.lineTo(24, 76);
    ctx.quadraticCurveTo(24, 72, 26, 68);
    ctx.lineTo(26, 60);
    ctx.quadraticCurveTo(26, 54, 28, 52);
    ctx.closePath();
    ctx.fill();

    // --- NEAR HIND LEG (muscular, in front) ---
    const nearLegGrad = ctx.createLinearGradient(52, 50, 52, 76);
    nearLegGrad.addColorStop(0, '#5a6e3a');
    nearLegGrad.addColorStop(0.4, '#4e6030');
    nearLegGrad.addColorStop(0.8, '#3e5222');
    nearLegGrad.addColorStop(1, '#334518');
    ctx.fillStyle = nearLegGrad;
    // Muscular thigh
    ctx.beginPath();
    ctx.moveTo(56, 48);
    ctx.quadraticCurveTo(64, 50, 64, 58);
    ctx.quadraticCurveTo(63, 62, 60, 66);
    ctx.lineTo(58, 72);
    ctx.quadraticCurveTo(56, 76, 52, 76);
    ctx.lineTo(48, 76);
    ctx.quadraticCurveTo(48, 72, 50, 68);
    ctx.lineTo(52, 62);
    ctx.quadraticCurveTo(52, 56, 52, 50);
    ctx.closePath();
    ctx.fill();
    // Muscle definition on thigh
    ctx.strokeStyle = 'rgba(80,100,50,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(58, 50);
    ctx.quadraticCurveTo(62, 56, 58, 64);
    ctx.stroke();
    // Near foot
    ctx.fillStyle = '#334518';
    ctx.beginPath();
    ctx.moveTo(48, 76);
    ctx.lineTo(46, 77);
    ctx.lineTo(58, 77);
    ctx.lineTo(52, 76);
    ctx.closePath();
    ctx.fill();
    // Toe claws
    ctx.fillStyle = '#1a2008';
    for (const tx of [47, 51, 55]) {
      ctx.beginPath();
      ctx.moveTo(tx, 77);
      ctx.lineTo(tx + 1, 79);
      ctx.lineTo(tx + 2, 77);
      ctx.closePath();
      ctx.fill();
    }

    // --- NEAR FRONT LEG ---
    const nearFrontGrad = ctx.createLinearGradient(30, 50, 30, 76);
    nearFrontGrad.addColorStop(0, '#5a6e3a');
    nearFrontGrad.addColorStop(0.6, '#4a5e2a');
    nearFrontGrad.addColorStop(1, '#3a4e1a');
    ctx.fillStyle = nearFrontGrad;
    ctx.beginPath();
    ctx.moveTo(32, 50);
    ctx.quadraticCurveTo(38, 52, 40, 58);
    ctx.lineTo(40, 66);
    ctx.quadraticCurveTo(40, 72, 36, 76);
    ctx.lineTo(30, 76);
    ctx.quadraticCurveTo(30, 72, 32, 68);
    ctx.lineTo(32, 60);
    ctx.quadraticCurveTo(30, 54, 30, 50);
    ctx.closePath();
    ctx.fill();
    // Knee joint
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.beginPath();
    ctx.ellipse(36, 66, 4, 2, 0, 0, Math.PI * 2);
    ctx.fill();
    // Foot
    ctx.fillStyle = '#3a4e1a';
    ctx.beginPath();
    ctx.moveTo(30, 76);
    ctx.lineTo(28, 77);
    ctx.lineTo(40, 77);
    ctx.lineTo(36, 76);
    ctx.closePath();
    ctx.fill();

    // --- BODY (large barrel-shaped torso) ---
    const bodyGrad = ctx.createLinearGradient(26, 26, 66, 60);
    bodyGrad.addColorStop(0, '#6a8044');
    bodyGrad.addColorStop(0.25, '#5e7438');
    bodyGrad.addColorStop(0.55, '#52682e');
    bodyGrad.addColorStop(0.85, '#465c24');
    bodyGrad.addColorStop(1, '#3a4e1a');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.moveTo(28, 52);
    ctx.quadraticCurveTo(20, 48, 22, 38);
    ctx.quadraticCurveTo(26, 28, 38, 26);
    ctx.quadraticCurveTo(52, 24, 64, 28);
    ctx.quadraticCurveTo(72, 32, 70, 42);
    ctx.quadraticCurveTo(68, 52, 60, 54);
    ctx.quadraticCurveTo(46, 58, 28, 52);
    ctx.closePath();
    ctx.fill();

    // Belly underside lighter
    const bellyGrad = ctx.createLinearGradient(34, 48, 34, 58);
    bellyGrad.addColorStop(0, 'rgba(130,160,80,0.15)');
    bellyGrad.addColorStop(1, 'rgba(90,110,50,0.25)');
    ctx.fillStyle = bellyGrad;
    ctx.beginPath();
    ctx.moveTo(30, 50);
    ctx.quadraticCurveTo(46, 58, 64, 52);
    ctx.quadraticCurveTo(46, 56, 30, 50);
    ctx.closePath();
    ctx.fill();

    // Spine ridge highlight
    ctx.strokeStyle = 'rgba(110,140,70,0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(30, 30);
    ctx.quadraticCurveTo(46, 24, 66, 30);
    ctx.stroke();

    // Hide texture — scattered scale-like bumps
    ctx.strokeStyle = 'rgba(60,80,30,0.25)';
    ctx.lineWidth = 0.8;
    const hideMarks = [
      [34, 34], [42, 30], [50, 32], [58, 34], [64, 38],
      [36, 42], [44, 38], [52, 40], [60, 42], [30, 38],
      [40, 46], [50, 48], [58, 46], [34, 50], [46, 52],
    ];
    for (const [hx, hy] of hideMarks) {
      ctx.beginPath();
      ctx.arc(hx, hy, 2.5, Math.PI * 0.8, Math.PI * 0.2, true);
      ctx.stroke();
    }

    // --- DARK BANDING (natural camouflage stripes across back/flanks) ---
    ctx.fillStyle = 'rgba(40,55,18,0.2)';
    const bandPositions = [32, 40, 48, 56, 62];
    for (const bx of bandPositions) {
      ctx.beginPath();
      ctx.moveTo(bx, 28 + Math.abs(bx - 46) * 0.15);
      ctx.quadraticCurveTo(bx + 2, 40, bx + 1, 52 - Math.abs(bx - 46) * 0.1);
      ctx.quadraticCurveTo(bx - 1, 40, bx, 28 + Math.abs(bx - 46) * 0.15);
      ctx.closePath();
      ctx.fill();
    }

    // --- NECK (thick, gracefully curved upward) ---
    const neckGrad = ctx.createLinearGradient(16, 16, 34, 42);
    neckGrad.addColorStop(0, '#6a8044');
    neckGrad.addColorStop(0.5, '#5e7438');
    neckGrad.addColorStop(1, '#52682e');
    ctx.fillStyle = neckGrad;
    ctx.beginPath();
    ctx.moveTo(30, 38);
    ctx.quadraticCurveTo(26, 32, 22, 24);
    ctx.quadraticCurveTo(18, 16, 16, 14);
    ctx.quadraticCurveTo(14, 12, 18, 12);
    ctx.quadraticCurveTo(24, 14, 28, 20);
    ctx.quadraticCurveTo(34, 28, 36, 36);
    ctx.closePath();
    ctx.fill();
    // Neck throat lighter stripe
    ctx.fillStyle = 'rgba(130,160,80,0.2)';
    ctx.beginPath();
    ctx.moveTo(22, 24);
    ctx.quadraticCurveTo(20, 18, 18, 14);
    ctx.quadraticCurveTo(16, 16, 20, 22);
    ctx.quadraticCurveTo(22, 28, 28, 34);
    ctx.closePath();
    ctx.fill();
    // Neck wrinkle lines
    ctx.strokeStyle = 'rgba(50,70,24,0.3)';
    ctx.lineWidth = 0.7;
    for (let n = 0; n < 3; n++) {
      const ny = 20 + n * 5;
      ctx.beginPath();
      ctx.moveTo(22 + n * 1, ny);
      ctx.quadraticCurveTo(26 + n * 1, ny + 2, 30 + n * 1, ny);
      ctx.stroke();
    }

    // --- HEAD (elongated, duck-billed) ---
    const headGrad = ctx.createLinearGradient(2, 8, 22, 22);
    headGrad.addColorStop(0, '#6a8044');
    headGrad.addColorStop(0.5, '#5e7438');
    headGrad.addColorStop(1, '#52682e');
    ctx.fillStyle = headGrad;
    ctx.beginPath();
    ctx.moveTo(20, 10);
    ctx.quadraticCurveTo(16, 8, 10, 10);
    ctx.quadraticCurveTo(4, 12, 2, 16);
    ctx.quadraticCurveTo(2, 20, 6, 22);
    ctx.quadraticCurveTo(12, 24, 18, 22);
    ctx.quadraticCurveTo(22, 18, 20, 14);
    ctx.closePath();
    ctx.fill();

    // Jaw line / lower jaw
    ctx.fillStyle = '#52682e';
    ctx.beginPath();
    ctx.moveTo(6, 20);
    ctx.quadraticCurveTo(4, 22, 2, 22);
    ctx.quadraticCurveTo(2, 24, 6, 24);
    ctx.quadraticCurveTo(12, 24, 16, 22);
    ctx.quadraticCurveTo(12, 22, 6, 20);
    ctx.closePath();
    ctx.fill();

    // Duck bill — broad flat keratinous beak
    const billGrad = ctx.createLinearGradient(0, 14, 6, 22);
    billGrad.addColorStop(0, '#7a8a50');
    billGrad.addColorStop(1, '#5a6a34');
    ctx.fillStyle = billGrad;
    ctx.beginPath();
    ctx.moveTo(4, 14);
    ctx.quadraticCurveTo(0, 16, -1, 18);
    ctx.quadraticCurveTo(0, 22, 4, 22);
    ctx.quadraticCurveTo(6, 20, 6, 16);
    ctx.closePath();
    ctx.fill();
    // Bill edge line
    ctx.strokeStyle = '#3a4a20';
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(0, 16);
    ctx.quadraticCurveTo(0, 20, 4, 22);
    ctx.stroke();

    // Nostril
    ctx.fillStyle = '#3a4a20';
    ctx.beginPath();
    ctx.ellipse(6, 14, 1.2, 0.8, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // --- CREST (signature long curved hollow tube crest) ---
    const crestGrad = ctx.createLinearGradient(14, 0, 40, 12);
    crestGrad.addColorStop(0, '#8a6832');
    crestGrad.addColorStop(0.3, '#7a5a28');
    crestGrad.addColorStop(0.6, '#6a4c20');
    crestGrad.addColorStop(1, '#5a4018');
    ctx.fillStyle = crestGrad;
    ctx.beginPath();
    ctx.moveTo(16, 12);
    ctx.quadraticCurveTo(18, 6, 24, 3);
    ctx.quadraticCurveTo(32, 0, 40, 2);
    ctx.quadraticCurveTo(44, 4, 42, 7);
    ctx.quadraticCurveTo(38, 6, 32, 6);
    ctx.quadraticCurveTo(24, 8, 20, 12);
    ctx.closePath();
    ctx.fill();
    // Crest top highlight
    ctx.strokeStyle = 'rgba(180,150,90,0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(18, 8);
    ctx.quadraticCurveTo(26, 2, 36, 2);
    ctx.stroke();
    // Crest underside shadow
    ctx.strokeStyle = 'rgba(40,30,10,0.35)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(20, 12);
    ctx.quadraticCurveTo(28, 9, 38, 7);
    ctx.stroke();
    // Crest bone-ridge detail line
    ctx.strokeStyle = 'rgba(120,100,60,0.3)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(20, 10);
    ctx.quadraticCurveTo(28, 5, 38, 4);
    ctx.stroke();

    // --- EYE (detailed with iris ring) ---
    // Eye socket shadow
    ctx.fillStyle = 'rgba(30,40,10,0.3)';
    ctx.beginPath();
    ctx.ellipse(12, 14, 3.5, 2.8, 0, 0, Math.PI * 2);
    ctx.fill();
    // Sclera
    ctx.fillStyle = '#c8c4a0';
    ctx.beginPath();
    ctx.ellipse(12, 14, 2.8, 2.2, 0, 0, Math.PI * 2);
    ctx.fill();
    // Iris
    ctx.fillStyle = '#5a6820';
    ctx.beginPath();
    ctx.arc(11.6, 14, 1.6, 0, Math.PI * 2);
    ctx.fill();
    // Pupil
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(11.4, 14, 0.9, 0, Math.PI * 2);
    ctx.fill();
    // Specular highlight
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.beginPath();
    ctx.arc(10.6, 13.2, 0.6, 0, Math.PI * 2);
    ctx.fill();
    // Lower eyelid
    ctx.strokeStyle = 'rgba(60,80,30,0.4)';
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.arc(12, 14, 2.6, 0.3, Math.PI - 0.3);
    ctx.stroke();

    // --- BODY OUTLINE for definition ---
    ctx.strokeStyle = 'rgba(40,55,18,0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(28, 52);
    ctx.quadraticCurveTo(20, 48, 22, 38);
    ctx.quadraticCurveTo(26, 28, 38, 26);
    ctx.quadraticCurveTo(52, 24, 64, 28);
    ctx.quadraticCurveTo(72, 32, 70, 42);
    ctx.quadraticCurveTo(68, 52, 60, 54);
    ctx.stroke();

    // --- RIB SHADOWS (subtle musculature) ---
    ctx.strokeStyle = 'rgba(40,55,18,0.15)';
    ctx.lineWidth = 0.7;
    for (let r = 0; r < 4; r++) {
      const rx = 34 + r * 8;
      ctx.beginPath();
      ctx.moveTo(rx, 30 + r * 0.5);
      ctx.quadraticCurveTo(rx + 2, 40, rx + 1, 50 - r * 0.5);
      ctx.stroke();
    }

    refresh();
  }

  // ================================================================
  //  T-REX — Massive bipedal apex predator
  //  Enormous head with powerful jaw, tiny arms, muscular legs,
  //  thick counterbalancing tail. The BIGGEST sprite in the game.
  // ================================================================
  private makeHazardTrex(): void {
    const W = 160, H = 120;
    const { ctx, refresh } = this.canvas('hazard-trex', W, H);

    const bodyColor = '#2a3a1a';
    const highlightColor = '#4a5a2a';
    const bellyColor = '#3a4a28';
    const darkAccent = '#1a2a10';

    // --- TAIL (thick, heavy, extends to the right for counterbalance) ---
    const tailGrad = ctx.createLinearGradient(90, 40, 160, 55);
    tailGrad.addColorStop(0, bodyColor);
    tailGrad.addColorStop(0.5, highlightColor);
    tailGrad.addColorStop(1, '#3a4a22');
    ctx.fillStyle = tailGrad;
    ctx.beginPath();
    ctx.moveTo(90, 42);
    ctx.bezierCurveTo(110, 38, 130, 40, 155, 48);
    ctx.bezierCurveTo(160, 50, 160, 56, 155, 58);
    ctx.bezierCurveTo(130, 62, 110, 58, 90, 56);
    ctx.closePath();
    ctx.fill();

    // Tail scale/stripe pattern
    ctx.strokeStyle = 'rgba(74,90,42,0.5)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 6; i++) {
      const tx = 100 + i * 10;
      ctx.beginPath();
      ctx.moveTo(tx, 43 + i * 0.8);
      ctx.quadraticCurveTo(tx + 3, 50 + i * 0.3, tx, 56 - i * 0.5);
      ctx.stroke();
    }

    // --- BODY (massive, barrel-shaped torso) ---
    const bodyGrad = ctx.createRadialGradient(70, 50, 5, 70, 50, 40);
    bodyGrad.addColorStop(0, highlightColor);
    bodyGrad.addColorStop(0.4, bodyColor);
    bodyGrad.addColorStop(1, darkAccent);
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.moveTo(50, 30);
    ctx.bezierCurveTo(60, 22, 80, 20, 95, 30);
    ctx.bezierCurveTo(100, 38, 98, 55, 95, 65);
    ctx.bezierCurveTo(85, 72, 60, 72, 50, 65);
    ctx.bezierCurveTo(45, 55, 45, 40, 50, 30);
    ctx.closePath();
    ctx.fill();

    // Body muscle highlights
    ctx.strokeStyle = 'rgba(74,90,42,0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, 35);
    ctx.quadraticCurveTo(75, 30, 88, 35);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(55, 50);
    ctx.quadraticCurveTo(72, 45, 90, 50);
    ctx.stroke();

    // Body scale texture
    ctx.fillStyle = 'rgba(74,90,42,0.2)';
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 5; col++) {
        const sx = 55 + col * 8 + (row % 2) * 4;
        const sy = 32 + row * 9;
        ctx.beginPath();
        ctx.ellipse(sx, sy, 3, 2, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Belly (lighter underside)
    const bellyGrad = ctx.createLinearGradient(60, 55, 60, 72);
    bellyGrad.addColorStop(0, 'rgba(58,74,40,0.5)');
    bellyGrad.addColorStop(1, 'rgba(80,95,55,0.4)');
    ctx.fillStyle = bellyGrad;
    ctx.beginPath();
    ctx.moveTo(55, 58);
    ctx.quadraticCurveTo(72, 70, 90, 58);
    ctx.quadraticCurveTo(72, 74, 55, 58);
    ctx.fill();

    // --- LEGS (massive, muscular hind legs) ---
    // Left leg (behind, darker)
    ctx.fillStyle = darkAccent;
    ctx.beginPath();
    ctx.moveTo(68, 62);
    ctx.bezierCurveTo(64, 75, 60, 90, 58, 105);
    ctx.lineTo(52, 105);
    ctx.bezierCurveTo(54, 95, 55, 80, 62, 62);
    ctx.closePath();
    ctx.fill();

    // Left foot
    ctx.fillStyle = '#1a2510';
    ctx.beginPath();
    ctx.moveTo(48, 105);
    ctx.lineTo(60, 105);
    ctx.lineTo(62, 110);
    ctx.lineTo(56, 112);
    ctx.lineTo(53, 110);
    ctx.lineTo(48, 112);
    ctx.lineTo(45, 108);
    ctx.closePath();
    ctx.fill();

    // Left claws
    ctx.fillStyle = '#e8dcc0';
    ctx.beginPath();
    ctx.moveTo(48, 112);
    ctx.lineTo(44, 117);
    ctx.lineTo(47, 114);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(53, 112);
    ctx.lineTo(52, 118);
    ctx.lineTo(55, 114);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(58, 111);
    ctx.lineTo(60, 116);
    ctx.lineTo(61, 112);
    ctx.fill();

    // Right leg (front, lighter)
    const legGrad = ctx.createLinearGradient(75, 62, 75, 105);
    legGrad.addColorStop(0, bodyColor);
    legGrad.addColorStop(0.5, highlightColor);
    legGrad.addColorStop(1, bodyColor);
    ctx.fillStyle = legGrad;
    ctx.beginPath();
    ctx.moveTo(80, 62);
    ctx.bezierCurveTo(84, 75, 82, 90, 78, 105);
    ctx.lineTo(70, 105);
    ctx.bezierCurveTo(72, 92, 74, 78, 74, 62);
    ctx.closePath();
    ctx.fill();

    // Leg muscle bulge
    ctx.fillStyle = 'rgba(74,90,42,0.3)';
    ctx.beginPath();
    ctx.ellipse(78, 75, 5, 10, -0.15, 0, Math.PI * 2);
    ctx.fill();

    // Right foot
    ctx.fillStyle = '#222e14';
    ctx.beginPath();
    ctx.moveTo(66, 105);
    ctx.lineTo(80, 105);
    ctx.lineTo(82, 110);
    ctx.lineTo(76, 112);
    ctx.lineTo(73, 110);
    ctx.lineTo(68, 112);
    ctx.lineTo(64, 108);
    ctx.closePath();
    ctx.fill();

    // Right claws
    ctx.fillStyle = '#e8dcc0';
    ctx.beginPath();
    ctx.moveTo(68, 112);
    ctx.lineTo(64, 117);
    ctx.lineTo(67, 114);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(73, 112);
    ctx.lineTo(72, 118);
    ctx.lineTo(75, 114);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(78, 111);
    ctx.lineTo(80, 116);
    ctx.lineTo(81, 112);
    ctx.fill();

    // --- TINY ARMS (comically small, vestigial) ---
    ctx.fillStyle = highlightColor;
    ctx.beginPath();
    ctx.moveTo(52, 42);
    ctx.bezierCurveTo(48, 46, 44, 50, 42, 52);
    ctx.bezierCurveTo(43, 54, 45, 54, 46, 52);
    ctx.bezierCurveTo(48, 48, 50, 46, 54, 44);
    ctx.closePath();
    ctx.fill();

    // Tiny claws on arm
    ctx.fillStyle = '#e8dcc0';
    ctx.beginPath();
    ctx.moveTo(42, 52);
    ctx.lineTo(40, 55);
    ctx.lineTo(42, 54);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(44, 53);
    ctx.lineTo(42, 56);
    ctx.lineTo(44, 55);
    ctx.fill();

    // --- NECK (thick, muscular) ---
    const neckGrad = ctx.createLinearGradient(40, 25, 50, 40);
    neckGrad.addColorStop(0, bodyColor);
    neckGrad.addColorStop(1, highlightColor);
    ctx.fillStyle = neckGrad;
    ctx.beginPath();
    ctx.moveTo(50, 30);
    ctx.bezierCurveTo(45, 25, 38, 18, 32, 12);
    ctx.bezierCurveTo(28, 10, 25, 12, 25, 16);
    ctx.bezierCurveTo(28, 22, 35, 30, 45, 38);
    ctx.quadraticCurveTo(48, 40, 52, 40);
    ctx.closePath();
    ctx.fill();

    // --- HEAD (enormous, ~35% of body length) ---
    const headGrad = ctx.createRadialGradient(22, 14, 3, 22, 14, 20);
    headGrad.addColorStop(0, highlightColor);
    headGrad.addColorStop(0.6, bodyColor);
    headGrad.addColorStop(1, darkAccent);
    ctx.fillStyle = headGrad;
    ctx.beginPath();
    // Top of head / brow ridge
    ctx.moveTo(32, 8);
    ctx.bezierCurveTo(28, 2, 18, 0, 8, 4);
    // Snout tip
    ctx.bezierCurveTo(2, 6, 0, 10, 0, 14);
    // Lower jaw line
    ctx.bezierCurveTo(0, 18, 4, 24, 10, 26);
    // Back of jaw
    ctx.bezierCurveTo(18, 28, 28, 26, 34, 22);
    // Connect back to top
    ctx.bezierCurveTo(36, 16, 36, 10, 32, 8);
    ctx.closePath();
    ctx.fill();

    // Heavy brow ridge
    ctx.fillStyle = darkAccent;
    ctx.beginPath();
    ctx.moveTo(32, 8);
    ctx.bezierCurveTo(28, 4, 18, 3, 10, 6);
    ctx.bezierCurveTo(18, 5, 28, 6, 32, 10);
    ctx.closePath();
    ctx.fill();

    // Jaw separation line
    ctx.strokeStyle = darkAccent;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(2, 14);
    ctx.bezierCurveTo(10, 16, 22, 18, 34, 18);
    ctx.stroke();

    // --- TEETH (upper jaw, 8-10 large serrated teeth) ---
    ctx.fillStyle = '#f0e8d0';
    const teethUpper = [
      { x: 3, y: 13, h: 5 },
      { x: 6, y: 13, h: 6 },
      { x: 9, y: 13, h: 7 },
      { x: 12, y: 14, h: 6 },
      { x: 15, y: 14, h: 7 },
      { x: 18, y: 15, h: 6 },
      { x: 21, y: 15, h: 5 },
      { x: 24, y: 16, h: 5 },
      { x: 27, y: 16, h: 4 },
      { x: 30, y: 17, h: 3 },
    ];
    teethUpper.forEach(t => {
      ctx.beginPath();
      ctx.moveTo(t.x - 1.2, t.y);
      ctx.lineTo(t.x, t.y + t.h);
      ctx.lineTo(t.x + 1.2, t.y);
      ctx.closePath();
      ctx.fill();
    });

    // Lower jaw teeth (smaller, pointing up)
    const teethLower = [
      { x: 4, y: 16, h: -4 },
      { x: 7, y: 16, h: -5 },
      { x: 10, y: 17, h: -5 },
      { x: 13, y: 17, h: -4 },
      { x: 16, y: 18, h: -5 },
      { x: 19, y: 18, h: -4 },
      { x: 22, y: 18, h: -3 },
      { x: 25, y: 18, h: -3 },
    ];
    teethLower.forEach(t => {
      ctx.beginPath();
      ctx.moveTo(t.x - 1, t.y);
      ctx.lineTo(t.x, t.y + t.h);
      ctx.lineTo(t.x + 1, t.y);
      ctx.closePath();
      ctx.fill();
    });

    // Tooth serration detail
    ctx.strokeStyle = 'rgba(200,190,170,0.4)';
    ctx.lineWidth = 0.5;
    teethUpper.forEach(t => {
      if (t.h > 4) {
        ctx.beginPath();
        ctx.moveTo(t.x - 0.5, t.y + 1);
        ctx.lineTo(t.x, t.y + t.h - 1);
        ctx.stroke();
      }
    });

    // --- EYE (fierce amber with heavy brow) ---
    // Eye socket shadow
    ctx.fillStyle = 'rgba(10,10,5,0.5)';
    ctx.beginPath();
    ctx.ellipse(26, 10, 5, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eye
    ctx.fillStyle = '#cc8800';
    ctx.beginPath();
    ctx.ellipse(26, 10, 3.5, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Amber iris gradient
    const eyeGrad = ctx.createRadialGradient(26, 10, 0, 26, 10, 3.5);
    eyeGrad.addColorStop(0, '#ffaa00');
    eyeGrad.addColorStop(0.5, '#cc7700');
    eyeGrad.addColorStop(1, '#884400');
    ctx.fillStyle = eyeGrad;
    ctx.beginPath();
    ctx.ellipse(26, 10, 3.5, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Slit pupil
    ctx.fillStyle = '#111100';
    ctx.beginPath();
    ctx.ellipse(26, 10, 1.2, 2.8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eye highlight
    ctx.fillStyle = 'rgba(255,255,200,0.6)';
    ctx.beginPath();
    ctx.ellipse(27.5, 8.5, 1, 0.8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Heavy brow ridge over eye
    ctx.fillStyle = darkAccent;
    ctx.beginPath();
    ctx.moveTo(22, 7);
    ctx.bezierCurveTo(24, 5, 28, 5, 30, 7);
    ctx.bezierCurveTo(28, 6, 24, 6, 22, 7);
    ctx.fill();

    // --- NOSTRIL ---
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.ellipse(4, 8, 1.5, 1, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // --- HEAD SCALE TEXTURE ---
    ctx.fillStyle = 'rgba(74,90,42,0.15)';
    for (let i = 0; i < 8; i++) {
      const hx = 8 + i * 3;
      const hy = 5 + Math.sin(i) * 2;
      ctx.beginPath();
      ctx.ellipse(hx, hy, 1.5, 1, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Lower jaw detail / ridges
    ctx.strokeStyle = 'rgba(74,90,42,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(6, 22);
    ctx.quadraticCurveTo(16, 25, 28, 22);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(8, 24);
    ctx.quadraticCurveTo(16, 27, 26, 24);
    ctx.stroke();

    // --- NECK MUSCLE LINES ---
    ctx.strokeStyle = 'rgba(74,90,42,0.25)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(34, 20);
    ctx.quadraticCurveTo(40, 28, 48, 35);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(30, 24);
    ctx.quadraticCurveTo(36, 32, 44, 38);
    ctx.stroke();

    // --- DORSAL RIDGE (small bumps along spine) ---
    ctx.fillStyle = '#1e2e12';
    for (let i = 0; i < 10; i++) {
      let rx: number, ry: number;
      if (i < 3) {
        // Along neck
        rx = 32 + i * 5;
        ry = 10 + i * 6;
      } else if (i < 7) {
        // Along back
        rx = 52 + (i - 3) * 10;
        ry = 22 + (i - 3) * 2;
      } else {
        // Along tail
        rx = 92 + (i - 7) * 12;
        ry = 40 + (i - 7) * 2;
      }
      ctx.beginPath();
      ctx.moveTo(rx - 2, ry + 2);
      ctx.lineTo(rx, ry - 2);
      ctx.lineTo(rx + 2, ry + 2);
      ctx.closePath();
      ctx.fill();
    }

    refresh();
  }

  private makePlatform(): void {
    const W = 120, H = 16;
    const { ctx, refresh } = this.canvas('platform', W, H);

    // Stone platform with gradient
    const platGrad = ctx.createLinearGradient(0, 0, 0, H);
    platGrad.addColorStop(0, '#8a8070');
    platGrad.addColorStop(0.3, '#7a7060');
    platGrad.addColorStop(1, '#5a5040');
    ctx.fillStyle = platGrad;

    // Slightly rounded shape
    ctx.beginPath();
    ctx.moveTo(4, 0);
    ctx.lineTo(W - 4, 0);
    ctx.quadraticCurveTo(W, 0, W, 4);
    ctx.lineTo(W, H - 2);
    ctx.quadraticCurveTo(W, H, W - 2, H);
    ctx.lineTo(2, H);
    ctx.quadraticCurveTo(0, H, 0, H - 2);
    ctx.lineTo(0, 4);
    ctx.quadraticCurveTo(0, 0, 4, 0);
    ctx.closePath();
    ctx.fill();

    // Top surface (lighter)
    ctx.fillStyle = 'rgba(160, 150, 130, 0.3)';
    ctx.fillRect(2, 0, W - 4, 4);

    // Cracks and texture
    ctx.strokeStyle = 'rgba(60, 50, 40, 0.3)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(30, 2); ctx.lineTo(34, 10); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(70, 3); ctx.lineTo(74, 8); ctx.lineTo(68, 12); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(100, 1); ctx.lineTo(96, 7); ctx.stroke();

    // Moss spots
    ctx.fillStyle = 'rgba(60, 100, 40, 0.3)';
    ctx.beginPath();
    ctx.arc(20, 3, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath();
    ctx.arc(85, 2, 3, 0, Math.PI * 2); ctx.fill();

    // Bottom shadow
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(4, H - 2, W - 8, 2);

    refresh();
  }

  // ================================================================
  private makeHeart(): void {
    const { ctx, refresh } = this.canvas('heart', 20, 20);

    // Heart shape using bezier curves
    const heartGrad = ctx.createRadialGradient(10, 8, 1, 10, 10, 10);
    heartGrad.addColorStop(0, '#ff4444');
    heartGrad.addColorStop(0.6, '#cc2222');
    heartGrad.addColorStop(1, '#991111');
    ctx.fillStyle = heartGrad;

    ctx.beginPath();
    ctx.moveTo(10, 18); // bottom point
    ctx.bezierCurveTo(0, 12, -2, 4, 4, 2);
    ctx.bezierCurveTo(8, 0, 10, 4, 10, 6);
    ctx.bezierCurveTo(10, 4, 12, 0, 16, 2);
    ctx.bezierCurveTo(22, 4, 20, 12, 10, 18);
    ctx.fill();

    // Shine
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.ellipse(6, 6, 2.5, 3, -0.5, 0, Math.PI * 2);
    ctx.fill();

    refresh();
  }

}
