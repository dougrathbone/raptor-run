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

    // Deep earth gradient
    const dirtGrad = ctx.createLinearGradient(0, 10, 0, h);
    dirtGrad.addColorStop(0, '#6b4423');
    dirtGrad.addColorStop(0.3, '#7a5232');
    dirtGrad.addColorStop(0.7, '#6a4020');
    dirtGrad.addColorStop(1, '#5a3518');
    ctx.fillStyle = dirtGrad;
    ctx.fillRect(0, 0, w, h);

    // Dirt texture (scattered marks)
    ctx.fillStyle = 'rgba(90, 60, 30, 0.3)';
    for (let i = 0; i < 20; i++) {
      const dx = (i * 37 + 13) % w;
      const dy = 16 + (i * 23 + 7) % (h - 20);
      const dr = 1 + (i % 3);
      ctx.beginPath();
      ctx.arc(dx, dy, dr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Root / crack lines
    ctx.strokeStyle = 'rgba(50, 30, 15, 0.25)';
    ctx.lineWidth = 0.8;
    for (let i = 0; i < 6; i++) {
      const rx = (i * 43 + 5) % w;
      const ry = 18 + (i * 31) % (h - 24);
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.quadraticCurveTo(rx + 8, ry + 3, rx + 18, ry - 1);
      ctx.stroke();
    }

    // Pebbles with highlights
    const pebbles = [
      { x: 15, y: 30, r: 3.5 }, { x: 55, y: 45, r: 2.5 },
      { x: 90, y: 35, r: 3 }, { x: 35, y: 60, r: 4 },
      { x: 110, y: 55, r: 2.5 }, { x: 75, y: 65, r: 3 },
    ];
    for (const p of pebbles) {
      ctx.fillStyle = '#8a7a68';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(160, 140, 120, 0.4)';
      ctx.beginPath();
      ctx.arc(p.x - p.r * 0.3, p.y - p.r * 0.3, p.r * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Grass layer — gradient base
    const grassGrad = ctx.createLinearGradient(0, 0, 0, 14);
    grassGrad.addColorStop(0, '#4a8f3f');
    grassGrad.addColorStop(1, '#3d7030');
    ctx.fillStyle = grassGrad;
    ctx.fillRect(0, 0, w, 12);

    // Individual grass blades (varying heights)
    for (let x = 0; x < w; x += 2) {
      const bladeH = 6 + Math.sin(x * 0.7) * 4 + Math.sin(x * 1.3) * 2;
      const lean = Math.sin(x * 0.4) * 2;

      // Dark blade
      ctx.strokeStyle = `rgba(${40 + (x % 20)}, ${100 + (x % 30)}, ${30 + (x % 15)}, 0.7)`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x, 12);
      ctx.quadraticCurveTo(x + lean * 0.5, 12 - bladeH * 0.6, x + lean, 12 - bladeH);
      ctx.stroke();

      // Occasional bright blade
      if (x % 6 === 0) {
        ctx.strokeStyle = 'rgba(90, 160, 60, 0.5)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(x + 1, 12);
        ctx.quadraticCurveTo(x + 1 + lean * 0.3, 12 - bladeH * 0.4, x + 1 + lean * 0.6, 12 - bladeH * 0.7);
        ctx.stroke();
      }
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

    // Distant ridge — dark blue-green
    const ridge1 = ctx.createLinearGradient(0, 50, 0, h);
    ridge1.addColorStop(0, '#3a6a5a');
    ridge1.addColorStop(1, '#4a7a66');
    ctx.fillStyle = ridge1;
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, 120);
    ctx.bezierCurveTo(40, 70, 80, 90, 120, 60);
    ctx.bezierCurveTo(160, 40, 200, 80, 240, 70);
    ctx.bezierCurveTo(280, 55, 320, 85, 360, 50);
    ctx.bezierCurveTo(400, 30, 440, 70, 480, 55);
    ctx.bezierCurveTo(500, 48, 510, 60, 512, 70);
    ctx.lineTo(512, h);
    ctx.closePath();
    ctx.fill();

    // Closer ridge — lighter
    const ridge2 = ctx.createLinearGradient(0, 90, 0, h);
    ridge2.addColorStop(0, '#4a8060');
    ridge2.addColorStop(1, '#5a9070');
    ctx.fillStyle = ridge2;
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, 140);
    ctx.bezierCurveTo(50, 110, 100, 130, 160, 100);
    ctx.bezierCurveTo(200, 85, 260, 120, 320, 105);
    ctx.bezierCurveTo(380, 90, 420, 115, 460, 100);
    ctx.bezierCurveTo(490, 92, 510, 105, 512, 110);
    ctx.lineTo(512, h);
    ctx.closePath();
    ctx.fill();

    // Atmospheric haze (fade to sky at bottom)
    const haze = ctx.createLinearGradient(0, 140, 0, h);
    haze.addColorStop(0, 'rgba(135, 206, 235, 0)');
    haze.addColorStop(1, 'rgba(135, 206, 235, 0.25)');
    ctx.fillStyle = haze;
    ctx.fillRect(0, 140, w, 60);

    refresh();
    // Alias so existing code referencing 'bg-hills-far' still works
    (this.textures.get('hills-far-jungle') as Phaser.Textures.CanvasTexture).canvas &&
      this.textures.addCanvas('bg-hills-far', (this.textures.get('hills-far-jungle') as Phaser.Textures.CanvasTexture).canvas);
  }

  private makeHillsNear(): void {
    const w = 512, h = 250;
    const { ctx, refresh } = this.canvas('hills-near-jungle', w, h);

    // Dense foliage ridgeline
    const foliage = ctx.createLinearGradient(0, 80, 0, h);
    foliage.addColorStop(0, '#2d5a1e');
    foliage.addColorStop(0.5, '#3a6a2c');
    foliage.addColorStop(1, '#4a7a3a');
    ctx.fillStyle = foliage;
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, 160);
    ctx.bezierCurveTo(40, 130, 80, 150, 120, 120);
    ctx.bezierCurveTo(160, 100, 200, 135, 250, 115);
    ctx.bezierCurveTo(300, 95, 340, 130, 380, 110);
    ctx.bezierCurveTo(420, 90, 460, 120, 500, 105);
    ctx.lineTo(512, 110);
    ctx.lineTo(512, h);
    ctx.closePath();
    ctx.fill();

    // Lighter foliage layer
    ctx.fillStyle = 'rgba(60, 110, 40, 0.5)';
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, 175);
    ctx.bezierCurveTo(60, 145, 120, 165, 180, 140);
    ctx.bezierCurveTo(240, 125, 300, 155, 360, 135);
    ctx.bezierCurveTo(420, 120, 470, 148, 512, 140);
    ctx.lineTo(512, h);
    ctx.closePath();
    ctx.fill();

    // Tree trunks
    const treeX = [85, 200, 340, 460];
    for (const tx of treeX) {
      const treeH = 65 + Math.sin(tx) * 15;
      const trunkGrad = ctx.createLinearGradient(tx, h - treeH, tx, h);
      trunkGrad.addColorStop(0, '#4a3020');
      trunkGrad.addColorStop(1, '#3a2515');
      ctx.fillStyle = trunkGrad;
      ctx.fillRect(tx - 3, h - treeH, 7, treeH);

      // Bark texture
      ctx.strokeStyle = 'rgba(30, 20, 10, 0.3)';
      ctx.lineWidth = 0.5;
      for (let by = h - treeH + 5; by < h; by += 6) {
        ctx.beginPath();
        ctx.moveTo(tx - 2, by);
        ctx.lineTo(tx + 3, by + 2);
        ctx.stroke();
      }

      // Canopy (layered circles)
      const cy = h - treeH - 15;
      const canopyGrad = ctx.createRadialGradient(tx, cy, 0, tx, cy, 30);
      canopyGrad.addColorStop(0, '#3a7a2a');
      canopyGrad.addColorStop(0.6, '#2d5a1e');
      canopyGrad.addColorStop(1, 'rgba(35, 70, 22, 0)');
      ctx.fillStyle = canopyGrad;
      ctx.beginPath();
      ctx.arc(tx, cy, 30, 0, Math.PI * 2);
      ctx.fill();
      // Inner lighter area
      ctx.fillStyle = 'rgba(80, 140, 50, 0.3)';
      ctx.beginPath();
      ctx.arc(tx - 5, cy - 5, 14, 0, Math.PI * 2);
      ctx.fill();
    }

    // Hanging vines
    ctx.strokeStyle = 'rgba(30, 60, 20, 0.4)';
    ctx.lineWidth = 1.5;
    for (const tx of [85, 340]) {
      ctx.beginPath();
      ctx.moveTo(tx + 10, h - 60);
      ctx.quadraticCurveTo(tx + 14, h - 35, tx + 8, h - 15);
      ctx.stroke();
    }

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
