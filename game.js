// Music Wars: Classical vs Rap
// Vampire Survivors-style game

// Global game state
let charType = 0; // 0=classical, 1=rock, 2=electronic

// Power-up definitions
const POWERUP_TYPES = [
  { id: 0, name: 'BOOM!', desc: 'All enemies explode', color: 0xff0000 },
  { id: 1, name: 'MAGNET', desc: 'Collect all XP', color: 0xffff00 },
  { id: 2, name: 'BOSS!', desc: 'Clear + spawn BOSS', color: 0xff00ff },
  { id: 3, name: 'SLOW', desc: 'Slow enemies 50%', color: 0x00ffff },
  { id: 4, name: 'SHIELD', desc: 'Block damage 5s', color: 0x00ff00 },
  { id: 5, name: '2X XP', desc: '2x XP gain 10s', color: 0xffa500 }
];

// Canon in D music data
const TEMPO = 140;
const BEAT_LENGTH = 60 / TEMPO;
const notes = {
  'D2': 73.42, 'E2': 82.41, 'F#2': 92.50, 'G2': 98.00, 'A2': 110.00, 'B2': 123.47,
  'C#3': 138.59, 'D3': 146.83, 'E3': 164.81, 'F#3': 185.00, 'G3': 196.00, 'A3': 220.00,
  'B3': 246.94, 'C#4': 277.18, 'D4': 293.66, 'E4': 329.63, 'F#4': 369.99, 'G4': 392.00,
  'A4': 440.00, 'B4': 493.88, 'C#5': 554.37, 'D5': 587.33, 'E5': 659.25,
  'F#5': 739.99, 'G5': 783.99, 'A5': 880.00
};
const bassLine = ['D2', 'A2', 'B2', 'F#2', 'G2', 'D2', 'G2', 'A2'];
const variation1 = [
  ['F#4', 'E4'], ['D4', 'C#4'], ['D4', 'E4'], ['F#4', 'G4'],
  ['F#4', 'G4'], ['A4', 'F#4'], ['D4', 'F#4'], ['E4', 'D4']
];
const variation2 = [
  ['D4', 'F#4', 'A4', 'G4'], ['F#4', 'D4', 'F#4', 'E4'],
  ['D4', 'B3', 'D4', 'A4'], ['G4', 'B4', 'A4', 'G4'],
  ['F#4', 'G4', 'A4', 'B4'], ['G4', 'B4', 'A4', 'G4'],
  ['F#4', 'E4', 'F#4', 'E4'], ['D4', 'C#4', 'D4', 'E4']
];

// Character Selection Scene
class SelectScene extends Phaser.Scene {
  constructor() { super('SelectScene'); }

  create() {
    this.add.text(400, 100, 'MUSIC WARS', {
      fontSize: '48px', color: '#fff', fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.add.text(400, 160, 'Choose Your Genre', {
      fontSize: '24px', color: '#aaa', fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Keyboard hint
    this.add.text(400, 520, 'A/D to navigate • SPACE to select', {
      fontSize: '16px', color: '#888', fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Classical choice
    const classicalBox = this.add.rectangle(200, 350, 180, 250, 0x3333ff, 0.3);
    classicalBox.setStrokeStyle(3, 0x5555ff);

    this.add.circle(200, 300, 35, 0x5555ff);
    this.add.text(200, 300, '♪', { fontSize: '42px', color: '#fff' }).setOrigin(0.5);
    this.add.text(200, 375, 'CLASSICAL', {
      fontSize: '18px', color: '#fff', fontFamily: 'Arial'
    }).setOrigin(0.5);
    this.add.text(200, 400, 'Orbital Notes', {
      fontSize: '12px', color: '#aaa', fontFamily: 'Arial'
    }).setOrigin(0.5);
    this.add.text(200, 420, '25 HP, 33 Speed', {
      fontSize: '12px', color: '#aaa', fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Electronic choice
    const electronicBox = this.add.rectangle(400, 350, 180, 250, 0x33ff33, 0.3);
    electronicBox.setStrokeStyle(3, 0x55ff55);

    this.add.circle(400, 300, 35, 0x55ff55);
    this.add.text(400, 300, '⚡', { fontSize: '42px', color: '#fff' }).setOrigin(0.5);
    this.add.text(400, 375, 'ELECTRONIC', {
      fontSize: '18px', color: '#fff', fontFamily: 'Arial'
    }).setOrigin(0.5);
    this.add.text(400, 400, 'Chain Lightning', {
      fontSize: '12px', color: '#aaa', fontFamily: 'Arial'
    }).setOrigin(0.5);
    this.add.text(400, 420, '10 HP, 46 Speed', {
      fontSize: '12px', color: '#aaa', fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Rock choice
    const rockBox = this.add.rectangle(600, 350, 180, 250, 0xff3333, 0.3);
    rockBox.setStrokeStyle(3, 0xff5555);

    this.add.circle(600, 300, 35, 0xff5555);
    this.add.text(600, 300, '♫', { fontSize: '42px', color: '#fff' }).setOrigin(0.5);
    this.add.text(600, 375, 'ROCK', {
      fontSize: '18px', color: '#fff', fontFamily: 'Arial'
    }).setOrigin(0.5);
    this.add.text(600, 400, 'Sound Waves', {
      fontSize: '12px', color: '#aaa', fontFamily: 'Arial'
    }).setOrigin(0.5);
    this.add.text(600, 420, '25 HP, 40 Speed', {
      fontSize: '12px', color: '#aaa', fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Store boxes for keyboard navigation
    this.boxes = [classicalBox, electronicBox, rockBox];
    this.boxColors = [0x5555ff, 0x55ff55, 0xff5555];
    this.selectedIndex = 0;

    // Update visual selection
    const updateSelection = () => {
      this.boxes.forEach((box, i) => {
        if (i === this.selectedIndex) {
          box.setStrokeStyle(6, this.boxColors[i]);
        } else {
          box.setStrokeStyle(3, this.boxColors[i]);
        }
      });
    };

    updateSelection(); // Set initial selection

    // Keyboard navigation
    this.input.keyboard.on('keydown-A', () => {
      this.selectedIndex = (this.selectedIndex - 1 + 3) % 3;
      updateSelection();
    });

    this.input.keyboard.on('keydown-D', () => {
      this.selectedIndex = (this.selectedIndex + 1) % 3;
      updateSelection();
    });

    this.input.keyboard.on('keydown-SPACE', () => {
      // Map selectedIndex to charType: 0=Classical, 1=Electronic, 2=Rock
      const charMap = [0, 2, 1]; // Classical, Electronic, Rock
      charType = charMap[this.selectedIndex];
      this.scene.start('GameScene');
    });
  }
}

// Main Game Scene
class GameScene extends Phaser.Scene {
  constructor() { super('GameScene'); }

  create() {
    this.gfx = this.add.graphics();

    // Player setup
    const playerHp = charType === 0 ? 25 : (charType === 1 ? 25 : 10); // Classical:25, Rock:25, Electronic:10
    const playerSpd = charType === 0 ? 36.3 : (charType === 1 ? 44 : 50.6); // Classical:36.3, Rock:44, Electronic:50.6 (+10% speed)
    this.player = {
      x: 400, y: 300,
      hp: playerHp,
      maxHp: playerHp,
      spd: playerSpd,
      rad: 15,
      vx: 0, // Velocity for ice sliding effect
      vy: 0,
      knockbackCooldown: 0, // Prevent multiple knockbacks at once
      iframeTimer: 0, // Invulnerability frames after taking damage
      frozen: false, // Is player frozen?
      frozenTimer: 0, // Time remaining frozen (ms)
      freezeImmunityTimer: 0 // Immunity to freeze after being frozen (ms)
    };

    // Game state
    this.enemies = [];
    this.gems = [];
    this.healthPickups = [];
    this.projectiles = [];
    this.orbitalNotes = [];
    this.xp = 0;
    this.xpToLevel = 10;
    this.level = 1;
    this.score = 0;
    // Safe localStorage access for sandboxed environment
    try {
      this.bestScore = parseInt(localStorage.getItem('musicWarsBest') || '0');
    } catch (e) {
      this.bestScore = 0; // Fallback for sandboxed environment
    }
    this.time = 0;

    // Ultimate ability system
    this.ultCharge = 0;
    this.ultMaxCharge = 30000; // 30 seconds
    this.ultReady = false;
    this.gameOver = false;
    this.paused = false;

    // Weapon stats
    this.weaponDmg = charType === 1 ? 30 : 15; // Rock starts with triple damage
    this.weaponSpd = 1;
    this.atkTimer = 0;
    this.atkDelay = 1000;
    this.baseOrbitalSpeed = 0.002; // Base rotation speed for classical
    this.orbitalSpeed = 0.002; // Current rotation speed for classical
    this.orbitalNoteSize = 8; // Orbital note size (scales with speed: 8px → 16px)
    this.noHitTimer = 0; // Track time without taking damage (Classical speed buildup)
    this.electronicNoHitTimer = 0; // Track time without damage for Electronic chain buildup
    this.electronicBaseChains = 2; // Starting chain count for Electronic
    this.electronicMaxChainCap = 10; // Maximum chains when no-hit for Electronic
    this.pickupRadius = 30; // Base XP collection radius
    this.magnetLevel = 0; // Track magnet upgrade level (max 4)

    // Weapon Evolution system
    this.weaponUpgradeCount = 0; // Track total weapon upgrades
    this.weaponEvolved = false; // Has weapon evolved?
    this.evolutionThreshold = 5; // Evolve after 5 upgrades

    // New upgrade systems
    this.lifestealPercent = 0; // Lifesteal healing percent
    this.critChance = 0.15; // Base crit chance (15%)
    this.projectileSizeMultiplier = 1.0; // Projectile size scaling

    // Rock character projectile system
    this.rockProjectileCount = 2; // Main projectiles fired (starts at 2)
    this.rockExplosionCount = 3; // Projectiles per enemy explosion (starts at 3)
    this.chainExplosion = false; // Whether explosions can chain (upgrade-locked)
    this.useVerticalPair = true; // Alternating pattern: true = vertical (up/down), false = horizontal (left/right)

    // Electronic character chain lightning system
    this.chainLightning = []; // Active chain lightning effects
    this.maxChains = charType === 2 ? 2 : 4; // Electronic starts at 2, others at 4
    this.chainDamageMultiplier = 1.0; // Multiplier for chain damage
    this.overchargeActive = false; // Is Overcharge ultimate active?
    this.overchargeTimer = 0; // Overcharge duration (5s)

    // Power-up system
    this.powerUps = []; // Active power-ups on floor
    this.powerUpSpawnTimer = 0;
    this.nextPowerUpSpawn = 30000 + Math.random() * 20000; // 30-50s random
    this.powerUpActive = false; // Is countdown/effect active?
    this.powerUpCountdown = 0; // Countdown timer
    this.powerUpType = null; // Which power-up was picked
    // Duration-based power-ups (timers in ms, 0 = inactive)
    this.timeSlowTimer = 0; // Time Slow (5s) - slows enemies 50%
    this.shieldTimer = 0; // Shield (5s) - blocks all damage
    this.doubleXpTimer = 0; // Double XP (10s) - 2x XP gain
    this.boss = null; // Boss enemy reference
    this.bossFireTimer = 0; // Boss attack timer
    this.eliteProjectiles = []; // Elite enemy freeze projectiles (boss and miniboss)
    this.bossPhase = 1; // Boss phase (1 or 2)
    this.bossPhaseTriggered = false; // Has phase 2 been triggered?

    // Spawn timer
    this.spawnTimer = 0;
    this.spawnRate = 2000;

    // Difficulty scaling system
    this.difficultyTier = 0;
    this.difficultyTimer = 0;
    this.hpMultiplier = 1.0;
    this.spdMultiplier = 1.0;
    this.dmgMultiplier = 1.0;

    // Slow pools (from Splat enemies)
    this.slowPools = [];

    // Particles for death effects
    this.particles = [];

    // Floating text effects (crits, etc)
    this.floatingTexts = [];

    // Near Death Bonus system
    this.nearDeath = false; // Track if player is in near-death state
    this.nearDeathThreshold = 0.3; // Activate below 30% HP

    // Revenge Bullets system
    this.revengeEnabled = false; // Unlocked via upgrade
    this.revengeCharge = 0; // Charges when taking damage (max 3)

    // Combo system
    this.combo = 0;
    this.comboTimer = 0;
    this.comboTimeWindow = 2000; // 2 seconds to maintain combo

    // Spawn wave system
    this.waveTimer = 0;
    this.waveInterval = 20000; // 20 seconds
    this.waveCount = 0;
    this.waveTextTimer = 0;

    // Mini-boss system
    this.miniBossTimer = 0;
    this.miniBossInterval = 90000; // 90 seconds
    this.bossWarningTimer = 0;
    this.bossWarningActive = false;

    // UI
    this.hpBar = this.add.rectangle(100, 30, 200, 20, 0x00ff00).setOrigin(0, 0.5);
    this.hpBarBg = this.add.rectangle(100, 30, 200, 20).setStrokeStyle(2, 0xffffff).setOrigin(0, 0.5);

    this.xpBar = this.add.rectangle(100, 55, 200, 15, 0xffff00).setOrigin(0, 0.5);
    this.xpBarBg = this.add.rectangle(100, 55, 200, 15).setStrokeStyle(2, 0xffffff).setOrigin(0, 0.5);

    this.ultBar = this.add.rectangle(100, 75, 200, 10, 0x00ffff).setOrigin(0, 0.5);
    this.ultBarBg = this.add.rectangle(100, 75, 200, 10).setStrokeStyle(2, 0xffffff).setOrigin(0, 0.5);

    this.timerTxt = this.add.text(400, 20, '0:00', {
      fontSize: '24px', color: '#fff', fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.scoreTxt = this.add.text(700, 20, 'Score: 0', {
      fontSize: '18px', color: '#fff', fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.levelTxt = this.add.text(700, 50, 'Lvl: 1', {
      fontSize: '18px', color: '#fff', fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Difficulty indicator (bottom right corner)
    this.difficultyTxt = this.add.text(750, 580, 'VERY EASY', {
      fontSize: '14px', color: '#00ff00', fontFamily: 'Arial', fontStyle: 'bold'
    }).setOrigin(1, 1);

    // Electronic chain display (only visible for Electronic character)
    this.chainDisplayTxt = this.add.text(100, 95, '', {
      fontSize: '16px',
      color: '#00ffff',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0, 0.5).setVisible(charType === 2);

    this.comboTxt = this.add.text(400, 80, '', {
      fontSize: '32px', color: '#ffaa00', fontFamily: 'Arial', fontStyle: 'bold'
    }).setOrigin(0.5).setVisible(false);

    this.waveText = this.add.text(400, 120, '', {
      fontSize: '48px', color: '#ffaa00', fontFamily: 'Arial', fontStyle: 'bold'
    }).setOrigin(0.5).setVisible(false);

    this.bossWarningText = this.add.text(400, 200, '', {
      fontSize: '40px', color: '#ff0000', fontFamily: 'Arial', fontStyle: 'bold'
    }).setOrigin(0.5).setVisible(false);

    this.defeatText = this.add.text(400, 250, '', {
      fontSize: '48px', color: '#ffdd00', fontFamily: 'Arial', fontStyle: 'bold'
    }).setOrigin(0.5).setVisible(false);
    this.defeatTextTimer = 0;

    // Countdown UI elements (hidden by default)
    this.countdownTxt = this.add.text(400, 250, '', {
      fontSize: '120px', color: '#fff', fontFamily: 'Arial'
    }).setOrigin(0.5).setVisible(false);

    this.powerUpNameTxt = this.add.text(400, 150, '', {
      fontSize: '48px', color: '#ffff00', fontFamily: 'Arial'
    }).setOrigin(0.5).setVisible(false);

    this.powerUpDescTxt = this.add.text(400, 370, '', {
      fontSize: '24px', color: '#aaa', fontFamily: 'Arial'
    }).setOrigin(0.5).setVisible(false);

    // Input
    this.keys = this.input.keyboard.addKeys({
      up: 'W', down: 'S', left: 'A', right: 'D',
      up2: 'UP', down2: 'DOWN', left2: 'LEFT', right2: 'RIGHT'
    });

    // Initialize orbital notes for classical
    if (charType === 0) {
      for (let i = 0; i < 2; i++) {
        this.orbitalNotes.push({
          angle: (Math.PI * 2 / 2) * i,
          dist: 50
        });
      }
    }

    this.playTone(440, 0.1);

    // Music setup
    this.musicNotes = [];
    this.musicEffects = null;
    this.musicStarted = false;
    this.musicLoopTimeout = null; // Track setTimeout ID for cleanup

    // Start background music after game is fully loaded (using setTimeout)
    setTimeout(() => {
      if (!this.gameOver) {
        this.initMusicSystem();
        this.playCanonMusic();
      }
    }, 3000);
  }

  update(time, delta) {
    if (this.gameOver || this.paused) return;

    this.time += delta;
    const mins = Math.floor(this.time / 60000);
    const secs = Math.floor((this.time % 60000) / 1000);
    this.timerTxt.setText(mins + ':' + (secs < 10 ? '0' : '') + secs);

    // Update difficulty indicator
    const timeInSeconds = this.time / 1000;
    if (timeInSeconds < 60) {
      this.difficultyTxt.setText('VERY EASY');
      this.difficultyTxt.setColor('#00ff00');
    } else if (timeInSeconds < 90) {
      this.difficultyTxt.setText('EASY');
      this.difficultyTxt.setColor('#88ff00');
    } else if (timeInSeconds < 120) {
      this.difficultyTxt.setText('MEDIUM');
      this.difficultyTxt.setColor('#ffff00');
    } else if (timeInSeconds < 180) {
      this.difficultyTxt.setText('HARD');
      this.difficultyTxt.setColor('#ff8800');
    } else {
      this.difficultyTxt.setText('LETHAL');
      this.difficultyTxt.setColor('#ff0000');
    }

    // Handle power-up countdown (pauses game)
    if (this.powerUpActive) {
      this.powerUpCountdown -= delta;
      if (this.powerUpCountdown <= 0) {
        this.executePowerUp();
        this.powerUpActive = false;
      }
      this.draw(); // Still draw during pause
      return; // Pause game during countdown
    }

    // Update duration-based power-up timers
    if (this.timeSlowTimer > 0) {
      this.timeSlowTimer = Math.max(0, this.timeSlowTimer - delta);
    }
    if (this.shieldTimer > 0) {
      this.shieldTimer = Math.max(0, this.shieldTimer - delta);
    }
    if (this.doubleXpTimer > 0) {
      this.doubleXpTimer = Math.max(0, this.doubleXpTimer - delta);
    }

    // Increase difficulty over time
    if (Math.floor(this.time / 30000) > Math.floor((this.time - delta) / 30000)) {
      this.spawnRate = Math.max(500, this.spawnRate - 200);
    }

    // Difficulty scaling every 40 seconds
    this.difficultyTimer += delta;
    if (this.difficultyTimer >= 40000) {
      this.difficultyTimer = 0;
      this.difficultyTier++;
      this.hpMultiplier *= 1.2;    // +20% health
      this.spdMultiplier *= 1.15;  // +15% speed
      this.dmgMultiplier *= 3.00;  // +200% damage
      this.playTone(1400, 0.15); // Difficulty increase sound
    }

    // Update slow pools
    for (let i = this.slowPools.length - 1; i >= 0; i--) {
      const pool = this.slowPools[i];
      pool.life -= delta;
      if (pool.life <= 0) {
        if (pool.txt) pool.txt.destroy();
        this.slowPools.splice(i, 1);
      }
    }

    // Update combo timer
    if (this.combo > 0) {
      this.comboTimer += delta;
      if (this.comboTimer >= this.comboTimeWindow) {
        this.combo = 0;
        this.comboTimer = 0;
        this.comboTxt.setVisible(false);
      } else {
        // Update combo text
        const multiplier = Math.max(1, this.combo);
        let dmgBonus = '';
        if (this.combo >= 30) dmgBonus = ' [+50% DMG]';
        else if (this.combo >= 20) dmgBonus = ' [+30% DMG]';
        else if (this.combo >= 10) dmgBonus = ' [+10% DMG]';
        this.comboTxt.setText(multiplier + 'x COMBO' + dmgBonus);
        this.comboTxt.setVisible(true);
      }
    }

    // Spawn wave system (every 45s)
    this.waveTimer += delta;
    if (this.waveTimer >= this.waveInterval) {
      this.waveTimer = 0;
      this.spawnWave();
    }

    // Mini-boss system (every 90s)
    if (!this.bossWarningActive) {
      this.miniBossTimer += delta;
      if (this.miniBossTimer >= this.miniBossInterval) {
        // Start boss warning countdown
        this.bossWarningActive = true;
        this.bossWarningTimer = 3000; // 3 seconds
        this.playTone(1600, 0.2);
      }
    } else {
      // Update warning countdown
      this.bossWarningTimer -= delta;
      const countdown = Math.ceil(this.bossWarningTimer / 1000);

      // Flash warning text
      const flash = Math.floor(this.bossWarningTimer / 500) % 2 === 0;
      if (flash && countdown > 0) {
        this.bossWarningText.setText('WARNING: MINI BOSS IN ' + countdown + '!');
        this.bossWarningText.setVisible(true);
      } else {
        this.bossWarningText.setVisible(false);
      }

      // Spawn boss when timer expires
      if (this.bossWarningTimer <= 0) {
        this.bossWarningActive = false;
        this.miniBossTimer = 0;
        this.bossWarningText.setVisible(false);
        this.spawnMiniBoss();
      }
    }

    // Wave text timer
    if (this.waveTextTimer > 0) {
      this.waveTextTimer -= delta;
      if (this.waveTextTimer <= 0) {
        this.waveText.setVisible(false);
      }
    }

    // Defeat text timer
    if (this.defeatTextTimer > 0) {
      this.defeatTextTimer -= delta;
      if (this.defeatTextTimer <= 0) {
        this.defeatText.setVisible(false);
      }
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * delta / 1000;
      p.y += p.vy * delta / 1000;
      p.life -= delta;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Update floating texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.txt.y += ft.vy * delta / 1000;
      ft.life -= delta;
      const alpha = ft.life / ft.maxLife; // Fade out
      ft.txt.setAlpha(alpha);
      if (ft.life <= 0) {
        ft.txt.destroy();
        this.floatingTexts.splice(i, 1);
      }
    }

    // Update chain lightning visual effects
    for (let i = this.chainLightning.length - 1; i >= 0; i--) {
      this.chainLightning[i].life -= delta;
      if (this.chainLightning[i].life <= 0) {
        this.chainLightning.splice(i, 1);
      }
    }

    // Update Overcharge timer
    if (this.overchargeTimer > 0) {
      this.overchargeTimer -= delta;
      if (this.overchargeTimer <= 0) {
        this.overchargeActive = false;
      }
    }

    // Player movement input
    let inputX = 0, inputY = 0;
    if (this.keys.left.isDown || this.keys.left2.isDown) inputX = -1;
    if (this.keys.right.isDown || this.keys.right2.isDown) inputX = 1;
    if (this.keys.up.isDown || this.keys.up2.isDown) inputY = -1;
    if (this.keys.down.isDown || this.keys.down2.isDown) inputY = 1;

    if (inputX !== 0 && inputY !== 0) {
      inputX *= 0.707;
      inputY *= 0.707;
    }

    // Check if player is in a slow pool
    let inSlowPool = false;
    for (let pool of this.slowPools) {
      const dist = Math.sqrt((this.player.x - pool.x) ** 2 + (this.player.y - pool.y) ** 2);
      if (dist < pool.rad) {
        inSlowPool = true;
        break;
      }
    }

    // Apply slow effect
    if (inSlowPool) {
      inputX *= 0.15; // 85% slower
      inputY *= 0.15;
    }

    // Apply input to velocity (with Near Death Bonus) - but not when frozen
    if (!this.player.frozen) {
      const spdBonus = this.nearDeath ? 1.2 : 1.0;
      this.player.vx += inputX * this.player.spd * spdBonus * delta / 1000;
      this.player.vy += inputY * this.player.spd * spdBonus * delta / 1000;
    } else {
      // Frozen - stop all velocity
      this.player.vx = 0;
      this.player.vy = 0;
    }

    // Apply friction (ice sliding effect)
    const friction = 0.85;
    this.player.vx *= friction;
    this.player.vy *= friction;

    // Update position with velocity
    this.player.x += this.player.vx;
    this.player.y += this.player.vy;

    // Clamp position
    this.player.x = Phaser.Math.Clamp(this.player.x, 20, 780);
    this.player.y = Phaser.Math.Clamp(this.player.y, 80, 580);

    // Near Death Bonus check
    const hpPercent = this.player.hp / this.player.maxHp;
    this.nearDeath = hpPercent < this.nearDeathThreshold && this.player.hp > 0;

    // Player movement trail (spawn every few frames when moving)
    const speed = Math.sqrt(this.player.vx ** 2 + this.player.vy ** 2);
    if (speed > 2 && Math.random() < 0.3) {
      const trailColor = charType === 0 ? 0x5555ff : 0xff5555;
      this.particles.push({
        x: this.player.x,
        y: this.player.y,
        vx: -this.player.vx * 0.2,
        vy: -this.player.vy * 0.2,
        color: trailColor,
        life: 200,
        maxLife: 200
      });
    }

    // Update knockback cooldown
    if (this.player.knockbackCooldown > 0) {
      this.player.knockbackCooldown -= delta;
    }

    // Update invulnerability frames
    if (this.player.iframeTimer > 0) {
      this.player.iframeTimer -= delta;
    }

    // Weapon system
    this.atkTimer += delta;
    if (charType === 1 && this.atkTimer >= this.atkDelay) {
      this.atkTimer = 0;

      // Determine firing angles based on projectile count
      let angles = [];

      if (this.rockProjectileCount === 2) {
        // Alternate between vertical (up/down) and horizontal (left/right)
        if (this.useVerticalPair) {
          angles = [-Math.PI / 2, Math.PI / 2]; // Up and Down
        } else {
          angles = [Math.PI, 0]; // Left and Right
        }
        this.useVerticalPair = !this.useVerticalPair; // Toggle for next shot
      } else if (this.rockProjectileCount === 4) {
        // All cardinal directions
        angles = [0, Math.PI / 2, Math.PI, -Math.PI / 2]; // Right, Down, Left, Up
      } else if (this.rockProjectileCount === 6) {
        // 4 cardinal + 2 diagonals (alternating pairs)
        if (this.useVerticalPair) {
          angles = [0, Math.PI / 2, Math.PI, -Math.PI / 2, Math.PI / 4, -3 * Math.PI / 4]; // Cardinal + NE, SW
        } else {
          angles = [0, Math.PI / 2, Math.PI, -Math.PI / 2, -Math.PI / 4, 3 * Math.PI / 4]; // Cardinal + SE, NW
        }
        this.useVerticalPair = !this.useVerticalPair; // Toggle for next shot
      } else if (this.rockProjectileCount >= 8) {
        // All 8 directions (cardinal + diagonals)
        angles = [0, Math.PI / 4, Math.PI / 2, 3 * Math.PI / 4, Math.PI, -3 * Math.PI / 4, -Math.PI / 2, -Math.PI / 4];
      }

      // Fire projectiles at calculated angles
      for (let angle of angles) {
        const isCrit = Math.random() < this.critChance;
        const proj = {
          x: this.player.x,
          y: this.player.y,
          vx: Math.cos(angle) * 300,
          vy: Math.sin(angle) * 300,
          dmg: this.getEffectiveDamage(),
          rad: 5 * this.projectileSizeMultiplier,
          canExplode: true, // Mark as player-fired, can trigger explosions
          isCrit: isCrit
        };
        // Add bounce for evolved Rock character
        if (charType === 1 && this.weaponEvolved) {
          proj.bounceCount = 0;
        }
        this.projectiles.push(proj);
      }

      this.playTone(800, 0.05);
    }

    // Electronic: Chain lightning projectiles
    if (charType === 2 && this.atkTimer >= this.atkDelay) {
      this.atkTimer = 0;

      // Find nearest enemy or boss to target
      let nearestEnemy = null;
      let nearestDist = Infinity;

      // Check regular enemies
      for (let e of this.enemies) {
        const dx = e.x - this.player.x;
        const dy = e.y - this.player.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearestEnemy = e;
        }
      }

      // Check boss
      if (this.boss) {
        const dx = this.boss.x - this.player.x;
        const dy = this.boss.y - this.player.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearestEnemy = this.boss;
        }
      }

      // Fire toward nearest enemy/boss (or forward if no target)
      const targetAngle = nearestEnemy ? Math.atan2(nearestEnemy.y - this.player.y, nearestEnemy.x - this.player.x) : 0;
      const isCrit = (charType === 2 && this.weaponEvolved) ? true : (Math.random() < this.critChance);
      const chainDmg = this.overchargeActive ? this.getEffectiveDamage() * 3 : this.getEffectiveDamage();

      const proj = {
        x: this.player.x,
        y: this.player.y,
        vx: Math.cos(targetAngle) * 350,
        vy: Math.sin(targetAngle) * 350,
        dmg: chainDmg,
        rad: 6 * this.projectileSizeMultiplier,
        canExplode: false, // Don't explode (chains instead)
        isChainLightning: true, // Mark for chaining logic
        isCrit: isCrit
      };
      this.projectiles.push(proj);
      this.playTone(1200, 0.03);
    }

    // Update orbital notes
    // Classical: No-hit speed buildup (1x to 10x over 5 seconds)
    if (charType === 0) {
      this.noHitTimer += delta;
      const speedMultiplier = Math.min(1 + (this.noHitTimer / 5000) * 9, 10);
      this.orbitalSpeed = this.baseOrbitalSpeed * speedMultiplier;
      // Scale size from 8px to 16px based on speed
      this.orbitalNoteSize = 8 + ((speedMultiplier - 1) / 9) * 8;
    }

    // Electronic: No-hit chain buildup (2 chains to 10 chains over 10 seconds)
    if (charType === 2) {
      this.electronicNoHitTimer += delta;
      // Formula: 2 chains at 0s, 10 chains at 10s (linear growth)
      const chainBonus = Math.floor((this.electronicNoHitTimer / 10000) * 8); // 0 to 8 bonus
      this.maxChains = Math.min(this.electronicBaseChains + chainBonus, this.electronicMaxChainCap);

      // Update chain display text
      const chainColor = this.weaponEvolved ? '#ffff00' : '#00ffff'; // Yellow if evolved
      this.chainDisplayTxt.setText('Chain: ' + this.maxChains + 'x');
      this.chainDisplayTxt.setColor(chainColor);
    }

    for (let note of this.orbitalNotes) {
      note.angle += delta * this.orbitalSpeed;
    }

    // Update projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.x += p.vx * delta / 1000;
      p.y += p.vy * delta / 1000;

      // Add trail particles for critical projectiles
      if (p.isCrit && Math.random() < 0.4) {
        this.particles.push({
          x: p.x,
          y: p.y,
          vx: 0,
          vy: 0,
          color: 0xffdd00,
          life: 200,
          maxLife: 200
        });
      }

      if (p.x < 0 || p.x > 800 || p.y < 0 || p.y > 600) {
        this.projectiles.splice(i, 1);
      }
    }

    // Spawn enemies
    this.spawnTimer += delta;
    if (this.spawnTimer >= this.spawnRate) {
      this.spawnTimer = 0;
      this.spawnEnemy();
    }

    // Update enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      if (!e) continue; // Safety check - enemy may have been removed by chain lightning

      // Calculate distance to player
      const dx = this.player.x - e.x;
      const dy = this.player.y - e.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Update ghost timer
      if (e.isGhost) {
        e.ghostTimer -= delta;

        // Spawn ethereal particles around ghost
        if (Math.random() < 0.15) {
          const angle = Math.random() * Math.PI * 2;
          const offset = e.rad + 5;
          this.particles.push({
            x: e.x + Math.cos(angle) * offset,
            y: e.y + Math.sin(angle) * offset,
            vx: Math.cos(angle) * 30,
            vy: Math.sin(angle) * 30,
            color: 0xaaaaff,
            life: 300,
            maxLife: 300
          });
        }

        if (e.ghostTimer <= 0) {
          // Ghost expires, remove enemy
          this.enemies.splice(i, 1);
          this.playTone(600, 0.05);
          continue;
        }
      }

      // Enrage mechanic: enemies move faster and turn red when HP < 25%
      if (!e.maxHp) e.maxHp = e.hp; // Store max HP on first update
      const isEnraged = e.hp < e.maxHp * 0.15;
      if (isEnraged && !e.wasEnraged) {
        e.wasEnraged = true;
        e.color = 0xff0000; // Turn red
      }

      // Move towards player
      if (dist > 0) {
        let speedMultiplier = isEnraged ? 1.5 : 1; // 50% faster when enraged
        if (this.timeSlowTimer > 0) speedMultiplier *= 0.5; // Time Slow: 50% slower
        const moveSpd = e.spd * speedMultiplier * delta / 1000;
        e.x += (dx / dist) * moveSpd;
        e.y += (dy / dist) * moveSpd;
      }

      // Mini-boss fires freezing projectiles
      if (e.isMiniBoss) {
        e.fireTimer += delta;
        if (e.fireTimer >= 1000) { // Fire every 1 second
          e.fireTimer = 0;
          // Fire 2 ice projectiles aimed at player
          const baseAngle = Math.atan2(dy, dx);
          const spread = Math.PI / 8; // 22.5 degree spread
          const angles = [baseAngle - spread, baseAngle + spread];
          const speed = 150;

          for (let angle of angles) {
            this.eliteProjectiles.push({
              x: e.x,
              y: e.y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              rad: 8,
              lifeTimer: 0,
              maxLife: 5000
            });
          }
          this.playTone(500, 0.15);
        }
      }

      // Check collision with player
      const playerDist = Math.sqrt(
        (e.x - this.player.x) ** 2 + (e.y - this.player.y) ** 2
      );
      if (playerDist < this.player.rad + e.rad && this.player.iframeTimer <= 0) {
        if (this.shieldTimer <= 0) { // Shield blocks all damage
          this.player.hp -= e.dmg * delta / 1000;
          this.player.iframeTimer = 1200; // 1.2 seconds of invulnerability (only when damage taken)

          // Reset no-hit timers (only when damage taken)
          if (charType === 0) {
            this.noHitTimer = 0;
          } else if (charType === 2) {
            this.electronicNoHitTimer = 0;
          }
        }

        // Revenge Bullets charge
        if (this.revengeEnabled) {
          this.revengeCharge++;
          if (this.revengeCharge >= 3) {
            // Fire 8 revenge projectiles
            for (let i = 0; i < 8; i++) {
              const angle = (Math.PI / 4) * i;
              const proj = {
                x: this.player.x, y: this.player.y,
                vx: Math.cos(angle) * 400, vy: Math.sin(angle) * 400,
                dmg: this.getEffectiveDamage() * 2, rad: 8 * this.projectileSizeMultiplier,
                canExplode: true, isCrit: true
              };
              if (charType === 1 && this.weaponEvolved) proj.bounceCount = 0;
              this.projectiles.push(proj);
            }
            this.revengeCharge = 0;
            this.cameras.main.flash(200, 255, 0, 0, 0.5);
            this.playTone(1800, 0.15);
          }
        }

        // Small screen shake on damage
        this.cameras.main.shake(100, 0.005);
        this.cameras.main.flash(100, 150, 0, 0); // Subtle red flash

        // Apply knockback to player (ice sliding effect)
        if (this.player.knockbackCooldown <= 0) {
          const angle = Math.atan2(this.player.y - e.y, this.player.x - e.x);
          const knockbackForce = 12;
          this.player.vx += Math.cos(angle) * knockbackForce;
          this.player.vy += Math.sin(angle) * knockbackForce;
          this.player.knockbackCooldown = 300; // 300ms cooldown
          this.playTone(300, 0.1); // Hit sound
        }

        if (this.player.hp <= 0) {
          this.endGame();
        }
      }

      // Check collision with projectiles (skip if ghost)
      if (!e.isGhost) {
        for (let j = this.projectiles.length - 1; j >= 0; j--) {
          const p = this.projectiles[j];
          const projDist = Math.sqrt((e.x - p.x) ** 2 + (e.y - p.y) ** 2);
          if (projDist < e.rad + p.rad) {
            const damage = p.isCrit ? p.dmg * 2 : p.dmg; // 2x damage on crit
            e.hp -= damage;

            // Lifesteal healing
            if (this.lifestealPercent > 0) {
              const healAmount = damage * this.lifestealPercent;
              this.player.hp = Math.min(this.player.maxHp, this.player.hp + healAmount);

              // Visual feedback for lifesteal
              const healText = this.add.text(e.x, e.y - 20, '+' + healAmount.toFixed(1) + ' HP', {
                fontSize: '14px',
                color: '#00ff00',
                fontStyle: 'bold'
              }).setOrigin(0.5).setDepth(100);
              this.floatingTexts.push({
                txt: healText,
                life: 400,
                maxLife: 400,
                vy: -100
              });
            }

            const canExplode = p.canExplode || false; // Track if this projectile can cause explosions

            // Chain Lightning (Electronic character)
            if (p.isChainLightning && charType === 2) {
              try {
                // Track chained targets with their positions
                const chained = [{ target: e, x: e.x, y: e.y }];
                const chainRange = 225; // Reduced by 50% from 450
                const maxChainAttempts = Math.min(this.maxChains, 8); // Hard cap at 8

                for (let chainCount = 1; chainCount < maxChainAttempts && chained.length < maxChainAttempts; chainCount++) {
                  const lastChained = chained[chained.length - 1];

                  // Safety check - make sure lastChained has valid coordinates
                  if (!lastChained || typeof lastChained.x !== 'number' || typeof lastChained.y !== 'number') {
                    break;
                  }

                  let closestTarget = null;
                  let closestDist = Infinity;

                // Check all enemies (limit search to prevent performance issues)
                const enemyCount = Math.min(this.enemies.length, 30); // Only check 30 enemies max
                for (let targetIdx = 0; targetIdx < enemyCount; targetIdx++) {
                  const target = this.enemies[targetIdx];
                  if (!target) continue; // Safety check

                  // Skip if already chained, marked for death, or dead
                  if (chained.some(c => c.target === target) || target.markedForDeath || target.hp <= 0) continue;

                  const dx = target.x - lastChained.x;
                  const dy = target.y - lastChained.y;
                  const dist = Math.sqrt(dx * dx + dy * dy);
                  if (dist < chainRange && dist < closestDist) {
                    closestDist = dist;
                    closestTarget = target;
                  }
                }

                // Check boss
                if (this.boss && !chained.some(c => c.target === this.boss) && this.boss.hp > 0) {
                  const dx = this.boss.x - lastChained.x;
                  const dy = this.boss.y - lastChained.y;
                  const dist = Math.sqrt(dx * dx + dy * dy);
                  if (dist < chainRange && dist < closestDist) {
                    closestDist = dist;
                    closestTarget = this.boss;
                  }
                }

                if (closestTarget) {
                  // Store target position now (in case it gets removed later)
                  const targetX = closestTarget.x;
                  const targetY = closestTarget.y;

                  // Apply chain damage
                  const chainDamage = p.isCrit ? p.dmg * 2 : p.dmg;
                  closestTarget.hp -= chainDamage;

                  // Lifesteal from chain
                  if (this.lifestealPercent > 0) {
                    const healAmount = chainDamage * this.lifestealPercent;
                    this.player.hp = Math.min(this.player.maxHp, this.player.hp + healAmount);

                    // Visual feedback for chain lifesteal
                    const healText = this.add.text(targetX, targetY - 30, '+' + healAmount.toFixed(1) + ' HP', {
                      fontSize: '14px',
                      color: '#00ff00',
                      fontStyle: 'bold'
                    }).setOrigin(0.5).setDepth(100);
                    this.floatingTexts.push({
                      txt: healText,
                      life: 400,
                      maxLife: 400,
                      vy: -100
                    });
                  }

                  // Show chain damage numbers
                  if (p.isCrit) {
                    const critText = this.add.text(targetX, targetY - 20, 'CHAIN!', {
                      fontSize: '20px',
                      color: '#00ffff',
                      fontStyle: 'bold'
                    }).setOrigin(0.5).setDepth(100);
                    this.floatingTexts.push({
                      txt: critText,
                      life: 400,
                      maxLife: 400,
                      vy: -100
                    });
                  } else {
                    const dmgText = this.add.text(targetX, targetY - 10, '-' + Math.floor(chainDamage), {
                      fontSize: '12px',
                      color: '#00ffff'
                    }).setOrigin(0.5).setDepth(100);
                    this.floatingTexts.push({
                      txt: dmgText,
                      life: 400,
                      maxLife: 400,
                      vy: -80
                    });
                  }

                  // Create visual chain effect
                  this.chainLightning.push({
                    fromX: lastChained.x,
                    fromY: lastChained.y,
                    toX: targetX,
                    toY: targetY,
                    life: 150
                  });

                  // Check if enemy died from chain (but don't process death yet - just mark it)
                  if (closestTarget.hp <= 0 && closestTarget !== this.boss) {
                    closestTarget.markedForDeath = true;
                  }

                  // Store with position snapshot
                  chained.push({ target: closestTarget, x: targetX, y: targetY });
                }
              }

              // Check if boss died from chain
              if (this.boss && this.boss.hp <= 0) {
                this.defeatElite(this.boss, true);
              }

                this.projectiles.splice(j, 1);
                this.playTone(p.isCrit ? 1400 : 1200, 0.04);
              } catch (error) {
                // Silently handle chain errors to prevent crashes
                console.warn('Chain lightning error:', error);
                this.projectiles.splice(j, 1);
              }
            } else {
              // Check for bounce mechanic
              const bounced = p.bounceCount === 0;
              if (bounced) {
                // Bounce in random direction
                const randomAngle = Math.random() * Math.PI * 2;
                p.vx = Math.cos(randomAngle) * 300;
                p.vy = Math.sin(randomAngle) * 300;
                p.bounceCount = 1;
                this.playTone(1100, 0.04); // Bounce sound
              } else {
                // No bounce available, remove projectile
                this.projectiles.splice(j, 1);
                // Hit sound effect (higher pitch for crits)
                this.playTone(p.isCrit ? 1200 : 700, 0.03);
              }
            }

            // Show damage numbers
            if (p.isCrit) {
              const critText = this.add.text(e.x, e.y - 20, 'CRIT!', {
                fontSize: '24px',
                color: '#ffdd00',
                fontStyle: 'bold'
              }).setOrigin(0.5).setDepth(100);
              this.floatingTexts.push({
                txt: critText,
                life: 500,
                maxLife: 500,
                vy: -100
              });
            } else {
              // Normal damage number
              const dmgText = this.add.text(e.x, e.y - 10, '-' + Math.floor(damage), {
                fontSize: '14px',
                color: '#aaaaaa'
              }).setOrigin(0.5).setDepth(100);
              this.floatingTexts.push({
                txt: dmgText,
                life: 400,
                maxLife: 400,
                vy: -60
              });
            }

            // Knockback away from player
            const angle = Math.atan2(e.y - this.player.y, e.x - this.player.x);
            e.x += Math.cos(angle) * 15;
            e.y += Math.sin(angle) * 15;

            if (e.hp <= 0) {
              // 10% chance to turn into ghost instead of dying
              if (!e.isGhost && Math.random() < 0.1) {
                e.isGhost = true;
                e.ghostTimer = 5000; // 5 seconds
                e.hp = 1; // Keep alive
                e.color = 0xffffff; // White ghost color
                this.playTone(900, 0.1); // Ghost mode sound
              } else {
                this.killEnemy(i, e, canExplode);
              }
            }
            break;
          }
        }
      }

      // Check collision with orbital notes
      if (charType === 0 && !e.isGhost) {
        for (let note of this.orbitalNotes) {
          const nx = this.player.x + Math.cos(note.angle) * note.dist;
          const ny = this.player.y + Math.sin(note.angle) * note.dist;
          const noteDist = Math.sqrt((e.x - nx) ** 2 + (e.y - ny) ** 2);

          if (noteDist < e.rad + this.orbitalNoteSize) {
            // Only damage if cooldown expired (prevent continuous push)
            if (!e.hitCooldown || e.hitCooldown <= 0) {
              const effectiveDmg = this.getEffectiveDamage();
              e.hp -= effectiveDmg;
              e.hitCooldown = 200; // 200ms cooldown

              // Lifesteal healing
              if (this.lifestealPercent > 0) {
                const healAmount = effectiveDmg * this.lifestealPercent;
                this.player.hp = Math.min(this.player.maxHp, this.player.hp + healAmount);

                // Visual feedback for orbital note lifesteal
                const healText = this.add.text(e.x, e.y - 25, '+' + healAmount.toFixed(1) + ' HP', {
                  fontSize: '14px',
                  color: '#00ff00',
                  fontStyle: 'bold'
                }).setOrigin(0.5).setDepth(100);
                this.floatingTexts.push({
                  txt: healText,
                  life: 400,
                  maxLife: 400,
                  vy: -100
                });
              }

              // Hit sound effect
              this.playTone(700, 0.03);

              // Show damage number
              const dmgText = this.add.text(e.x, e.y - 10, '-' + Math.floor(effectiveDmg), {
                fontSize: '14px',
                color: '#aaaaaa'
              }).setOrigin(0.5).setDepth(100);
              this.floatingTexts.push({
                txt: dmgText,
                life: 400,
                maxLife: 400,
                vy: -60
              });

              // Knockback away from player
              const angle = Math.atan2(e.y - this.player.y, e.x - this.player.x);
              e.x += Math.cos(angle) * 15;
              e.y += Math.sin(angle) * 15;

              if (e.hp <= 0) {
                // 10% chance to turn into ghost instead of dying
                if (!e.isGhost && Math.random() < 0.1) {
                  e.isGhost = true;
                  e.ghostTimer = 5000; // 5 seconds
                  e.hp = 1; // Keep alive
                  e.color = 0xffffff; // White ghost color
                  this.playTone(900, 0.1); // Ghost mode sound
                } else {
                  this.killEnemy(i, e, false); // Orbital notes don't cause explosions
                }
                break;
              }
            }
          }
        }
      }

      // Update hit cooldown
      if (e.hitCooldown > 0) {
        e.hitCooldown -= delta;
      }
    }

    // Process enemies that died from chain lightning (AFTER enemy loop to avoid array modification issues)
    let processedDeaths = 0;
    const maxDeathsPerFrame = 20; // Increased limit since we're outside the loop now
    for (let k = this.enemies.length - 1; k >= 0 && processedDeaths < maxDeathsPerFrame; k--) {
      const chainedEnemy = this.enemies[k];
      if (chainedEnemy && chainedEnemy.markedForDeath) {
        this.killEnemy(k, chainedEnemy, false);
        processedDeaths++;
      }
    }

    // Update boss
    if (this.boss) {
      // Move toward player
      const dx = this.player.x - this.boss.x;
      const dy = this.player.y - this.boss.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 0) {
        let bossSpdMult = this.timeSlowTimer > 0 ? 0.5 : 1; // Time Slow: 50% slower
        const moveSpd = this.boss.spd * bossSpdMult * delta / 1000;
        this.boss.x += (dx / dist) * moveSpd;
        this.boss.y += (dy / dist) * moveSpd;
      }

      // Fire freeze projectile every 1.5s (phase 1) or 0.7s (phase 2)
      this.bossFireTimer += delta;
      const fireInterval = this.bossPhase === 2 ? 700 : 1500;
      if (this.bossFireTimer >= fireInterval) {
        this.bossFireTimer = 0;
        // Aim at player
        const dx = this.player.x - this.boss.x;
        const dy = this.player.y - this.boss.y;
        const baseAngle = Math.atan2(dy, dx);
        const speed = 150;

        if (this.bossPhase === 2) {
          // Phase 2: Fire 8 projectiles in all directions (full circle)
          for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 / 8) * i; // 360° / 8 = 45° spacing
            this.eliteProjectiles.push({
              x: this.boss.x,
              y: this.boss.y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              rad: 10,
              lifeTimer: 0,
              maxLife: 5000
            });
          }
        } else {
          // Phase 1: Fire 4 projectiles in cardinal directions
          const angles = [0, Math.PI / 2, Math.PI, -Math.PI / 2]; // Right, Down, Left, Up
          for (let angle of angles) {
            this.eliteProjectiles.push({
              x: this.boss.x,
              y: this.boss.y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              rad: 10,
              lifeTimer: 0,
              maxLife: 5000
            });
          }
        }
        this.playTone(400, 0.2);
      }

      // Scale size based on HP (40 to 20)
      this.boss.rad = 20 + (this.boss.hp / this.boss.maxHp) * 20;

      // Phase 2 transition at 50% HP
      if (!this.bossPhaseTriggered && this.boss.hp <= this.boss.maxHp * 0.5) {
        this.bossPhaseTriggered = true;
        this.bossPhase = 2;
        this.boss.spd *= 1.5; // 50% faster
        this.cameras.main.flash(300, 200, 0, 200, 0.5); // Purple flash
        this.cameras.main.shake(500, 0.03);
        this.playTone(250, 0.4);
      }

      // Check collision with player
      const playerDist = Math.sqrt(
        (this.boss.x - this.player.x) ** 2 + (this.boss.y - this.player.y) ** 2
      );
      if (playerDist < this.player.rad + this.boss.rad && this.player.iframeTimer <= 0) {
        if (this.shieldTimer <= 0) { // Shield blocks all damage
          this.player.hp -= this.boss.dmg * delta / 1000;
          this.player.iframeTimer = 1200; // 1.2 seconds of invulnerability (only when damage taken)
          this.cameras.main.flash(100, 150, 0, 0); // Subtle red flash

          // Reset no-hit timers (only when damage taken)
          if (charType === 0) {
            this.noHitTimer = 0;
          } else if (charType === 2) {
            this.electronicNoHitTimer = 0;
          }
        }

        // Apply knockback to player
        if (this.player.knockbackCooldown <= 0) {
          const angle = Math.atan2(this.player.y - this.boss.y, this.player.x - this.boss.x);
          const knockbackForce = 15;
          this.player.vx += Math.cos(angle) * knockbackForce;
          this.player.vy += Math.sin(angle) * knockbackForce;
          this.player.knockbackCooldown = 300;
          this.playTone(250, 0.1);
        }

        if (this.player.hp <= 0) {
          this.endGame();
        }
      }

      // Check collision with player projectiles
      for (let j = this.projectiles.length - 1; j >= 0; j--) {
        const p = this.projectiles[j];
        const projDist = Math.sqrt((this.boss.x - p.x) ** 2 + (this.boss.y - p.y) ** 2);
        if (projDist < this.boss.rad + p.rad) {
          this.boss.hp -= p.dmg;

          // Lifesteal healing
          if (this.lifestealPercent > 0) {
            const healAmount = p.dmg * this.lifestealPercent;
            this.player.hp = Math.min(this.player.maxHp, this.player.hp + healAmount);

            // Visual feedback for boss lifesteal
            const healText = this.add.text(this.boss.x, this.boss.y - 50, '+' + healAmount.toFixed(1) + ' HP', {
              fontSize: '14px',
              color: '#00ff00',
              fontStyle: 'bold'
            }).setOrigin(0.5).setDepth(100);
            this.floatingTexts.push({
              txt: healText,
              life: 400,
              maxLife: 400,
              vy: -100
            });
          }

          // Chain Lightning - chain from boss to 1 nearby enemy
          if (p.isChainLightning && charType === 2 && this.enemies.length > 0) {
            let near = this.enemies[0], nDist = 999;
            for (let e of this.enemies) {
              const d = Math.sqrt((e.x - this.boss.x) ** 2 + (e.y - this.boss.y) ** 2);
              if (d < nDist && d < 450) { near = e; nDist = d; }
            }
            if (nDist < 450) {
              near.hp -= p.dmg;
              if (near.hp <= 0) near.markedForDeath = true;
              this.chainLightning.push({fromX: this.boss.x, fromY: this.boss.y, toX: near.x, toY: near.y, life: 150});
            }
          }

          this.projectiles.splice(j, 1);

          // Hit sound
          this.playTone(p.isChainLightning ? 1200 : 700, 0.03);

          if (this.boss.hp <= 0) {
            this.defeatElite(this.boss, true);
          }
          break;
        }
      }

      // Check collision with orbital notes
      if (charType === 0) {
        for (let note of this.orbitalNotes) {
          const nx = this.player.x + Math.cos(note.angle) * note.dist;
          const ny = this.player.y + Math.sin(note.angle) * note.dist;
          const noteDist = Math.sqrt((this.boss.x - nx) ** 2 + (this.boss.y - ny) ** 2);

          if (noteDist < this.boss.rad + this.orbitalNoteSize) {
            const effectiveDmg = this.getEffectiveDamage();
            this.boss.hp -= effectiveDmg;

            // Lifesteal healing
            if (this.lifestealPercent > 0) {
              const healAmount = effectiveDmg * this.lifestealPercent;
              this.player.hp = Math.min(this.player.maxHp, this.player.hp + healAmount);

              // Visual feedback for orbital note lifesteal on boss
              const healText = this.add.text(this.boss.x, this.boss.y - 60, '+' + healAmount.toFixed(1) + ' HP', {
                fontSize: '14px',
                color: '#00ff00',
                fontStyle: 'bold'
              }).setOrigin(0.5).setDepth(100);
              this.floatingTexts.push({
                txt: healText,
                life: 400,
                maxLife: 400,
                vy: -100
              });
            }

            // Hit sound
            this.playTone(700, 0.03);

            if (this.boss.hp <= 0) {
              this.defeatElite(this.boss, true);
              break;
            }
          }
        }
      }
    }

    // Update boss freeze projectiles
    for (let i = this.eliteProjectiles.length - 1; i >= 0; i--) {
      const ice = this.eliteProjectiles[i];
      ice.x += ice.vx * delta / 1000;
      ice.y += ice.vy * delta / 1000;
      ice.lifeTimer += delta;

      // Remove if out of bounds or lifetime expired
      if (ice.x < 0 || ice.x > 800 || ice.y < 0 || ice.y > 600 || ice.lifeTimer >= ice.maxLife) {
        this.eliteProjectiles.splice(i, 1);
      } else {
        // Check collision with player
        const iceDist = Math.sqrt((ice.x - this.player.x) ** 2 + (ice.y - this.player.y) ** 2);
        if (iceDist < ice.rad + this.player.rad && !this.player.frozen && this.player.freezeImmunityTimer <= 0) {
          // Freeze player for 2 seconds
          this.player.frozen = true;
          this.player.frozenTimer = 2000;
          this.eliteProjectiles.splice(i, 1);
          this.cameras.main.flash(200, 100, 200, 255, 0.5); // Blue flash
          this.playTone(600, 0.2);

          // Show FROZEN text
          const frozenText = this.add.text(this.player.x, this.player.y - 30, 'FROZEN!', {
            fontSize: '28px',
            color: '#87CEEB',
            fontStyle: 'bold'
          }).setOrigin(0.5).setDepth(100);
          this.floatingTexts.push({
            txt: frozenText,
            life: 800,
            maxLife: 800,
            vy: -50
          });
        }
      }
    }

    // Update frozen player state
    if (this.player.frozen) {
      this.player.frozenTimer -= delta;
      if (this.player.frozenTimer <= 0) {
        this.player.frozen = false;
        this.player.frozenTimer = 0;
        this.player.freezeImmunityTimer = 2000; // 2 seconds immunity after freeze ends
      }
    }

    // Update freeze immunity timer
    if (this.player.freezeImmunityTimer > 0) {
      this.player.freezeImmunityTimer -= delta;
      if (this.player.freezeImmunityTimer < 0) {
        this.player.freezeImmunityTimer = 0;
      }
    }

    // Update gems
    for (let i = this.gems.length - 1; i >= 0; i--) {
      const g = this.gems[i];
      const dx = this.player.x - g.x;
      const dy = this.player.y - g.y;
      const gDist = Math.sqrt(dx * dx + dy * dy);

      // Magnet effect - pull gems towards player if within pickup radius
      if (gDist < this.pickupRadius && gDist > 20) {
        const pullSpeed = 200 * delta / 1000;
        g.x += (dx / gDist) * pullSpeed;
        g.y += (dy / gDist) * pullSpeed;
      }

      // Collect gem when close enough
      if (gDist < 20) {
        const xpGain = this.doubleXpTimer > 0 ? g.val * 2 : g.val; // Double XP power-up
        this.xp += xpGain;

        // Show floating +XP text
        let xpText = '+' + xpGain + ' EXP';
        let xpColor = this.doubleXpTimer > 0 ? '#ffa500' : '#ffff00'; // Orange for double XP

        // Show combo multiplier if active
        if (this.combo >= 10) {
          const mult = this.combo >= 20 ? '3x' : '2x';
          xpText = '+' + xpGain + ' EXP (' + mult + ')';
          xpColor = '#ff8800';
        }

        const txt = this.add.text(g.x, g.y, xpText, {
          fontSize: '12px',
          color: xpColor,
          fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(100);

        this.floatingTexts.push({
          txt: txt,
          life: 600,
          maxLife: 600,
          vy: -80
        });

        this.gems.splice(i, 1);
        this.playTone(1000, 0.05);

        if (this.xp >= this.xpToLevel) {
          this.levelUp();
        }
      }
    }

    // Update health pickups
    for (let i = this.healthPickups.length - 1; i >= 0; i--) {
      const h = this.healthPickups[i];
      const dx = this.player.x - h.x;
      const dy = this.player.y - h.y;
      const hDist = Math.sqrt(dx * dx + dy * dy);

      // Collect when close
      if (hDist < 25) {
        const healAmount = 2; // Fixed 2 HP for all
        this.player.hp = Math.min(this.player.maxHp, this.player.hp + healAmount);
        this.healthPickups.splice(i, 1);
        this.playTone(800, 0.1);
        this.cameras.main.flash(200, 0, 150, 0, 0.3); // Green flash
      }
    }

    // Power-up spawning
    this.powerUpSpawnTimer += delta;
    if (this.powerUpSpawnTimer >= this.nextPowerUpSpawn) {
      this.spawnPowerUp();
      this.powerUpSpawnTimer = 0;
      this.nextPowerUpSpawn = 30000 + Math.random() * 20000; // Next: 30-50s
    }

    // Update power-ups (despawn after 20s)
    for (let i = this.powerUps.length - 1; i >= 0; i--) {
      const pu = this.powerUps[i];
      pu.life += delta;
      if (pu.life > 20000) {
        this.powerUps.splice(i, 1);
      }
    }

    // Check power-up pickup
    if (!this.powerUpActive) {
      for (let i = this.powerUps.length - 1; i >= 0; i--) {
        const pu = this.powerUps[i];
        const dist = Math.sqrt((pu.x - this.player.x) ** 2 + (pu.y - this.player.y) ** 2);
        if (dist < 25) {
          this.activatePowerUp(pu.type);
          this.powerUps.splice(i, 1);
          // Medium screen shake on power-up collection
          this.cameras.main.shake(200, 0.01);
          break;
        }
      }
    }

    // Ultimate ability charge
    if (!this.ultReady && this.ultCharge < this.ultMaxCharge) {
      this.ultCharge += delta;
      if (this.ultCharge >= this.ultMaxCharge) {
        this.ultReady = true;
        this.playTone(1800, 0.3);
        this.cameras.main.flash(300, 0, 150, 150, 0.3); // Cyan flash
      }
    }

    // SPACE key - activate ultimate
    if (this.input.keyboard.addKey('SPACE').isDown && this.ultReady) {
      this.ultReady = false;
      this.ultCharge = 0;
      this.activateUltimate();
    }

    // Update UI
    this.hpBar.width = (this.player.hp / this.player.maxHp) * 200;
    this.xpBar.width = (this.xp / this.xpToLevel) * 200;
    this.ultBar.width = (this.ultCharge / this.ultMaxCharge) * 200;

    // Flash ultimate bar when ready
    if (this.ultReady) {
      const flash = Math.floor(Date.now() / 300) % 2 === 0;
      this.ultBar.setFillStyle(flash ? 0x00ffff : 0x888888);
    } else {
      this.ultBar.setFillStyle(0x00ffff);
    }

    this.draw();
  }

  draw() {
    this.gfx.clear();

    // Draw grid background
    this.gfx.lineStyle(1, 0x222222, 0.3);
    for (let i = 0; i < 800; i += 40) {
      this.gfx.lineBetween(i, 0, i, 600);
    }
    for (let i = 0; i < 600; i += 40) {
      this.gfx.lineBetween(0, i, 800, i);
    }

    // Draw XP magnet range indicator (only if gems exist)
    if (this.gems.length > 0) {
      const pulse = Math.sin(Date.now() / 400) * 0.1 + 0.15; // Gentle pulse
      this.gfx.lineStyle(2, 0xffff00, pulse);
      this.gfx.strokeCircle(this.player.x, this.player.y, this.pickupRadius);
    }

    // Draw player
    let pColor = charType === 0 ? 0x5555ff : (charType === 1 ? 0xff5555 : 0x55ff55); // Blue, Red, Green
    let pAlpha = 1;

    // Sky blue when frozen
    if (this.player.frozen) {
      pColor = 0x87CEEB; // Sky blue
    } else if (this.player.iframeTimer > 0) {
      // Flash white during invulnerability frames
      const flash = Math.floor(this.player.iframeTimer / 100) % 2 === 0;
      if (flash) {
        pColor = 0xffffff;
        pAlpha = 0.7;
      }
    }

    this.gfx.fillStyle(pColor, pAlpha);
    this.gfx.fillCircle(this.player.x, this.player.y, this.player.rad);
    this.gfx.lineStyle(2, 0xffffff);
    this.gfx.strokeCircle(this.player.x, this.player.y, this.player.rad);

    // Draw Near Death Bonus indicator
    if (this.nearDeath) {
      const pulse = Math.sin(Date.now() / 200) * 0.3 + 0.6; // Fast red pulse
      this.gfx.lineStyle(3, 0xff0000, pulse);
      this.gfx.strokeCircle(this.player.x, this.player.y, this.player.rad + 5);
    }

    // Power-up visual indicators
    if (this.shieldTimer > 0) {
      // Green shield bubble
      const shieldPulse = Math.sin(Date.now() / 150) * 0.2 + 0.6;
      this.gfx.fillStyle(0x00ff00, 0.2);
      this.gfx.fillCircle(this.player.x, this.player.y, this.player.rad + 8);
      this.gfx.lineStyle(3, 0x00ff00, shieldPulse);
      this.gfx.strokeCircle(this.player.x, this.player.y, this.player.rad + 8);
    }
    if (this.timeSlowTimer > 0) {
      // Cyan time slow aura
      const slowPulse = Math.sin(Date.now() / 180) * 0.3 + 0.5;
      this.gfx.lineStyle(2, 0x00ffff, slowPulse);
      this.gfx.strokeCircle(this.player.x, this.player.y, this.player.rad + 10);
    }
    if (this.doubleXpTimer > 0) {
      // Orange XP glow
      const xpPulse = Math.sin(Date.now() / 200) * 0.3 + 0.4;
      this.gfx.fillStyle(0xffa500, xpPulse * 0.3);
      this.gfx.fillCircle(this.player.x, this.player.y, this.player.rad + 12);
    }
    if (this.overchargeActive && charType === 2) {
      // Electric sparks for Overcharge
      const sparkPulse = Math.sin(Date.now() / 100) * 0.4 + 0.6;
      this.gfx.lineStyle(4, 0x00ffff, sparkPulse);
      this.gfx.strokeCircle(this.player.x, this.player.y, this.player.rad + 14);
      this.gfx.lineStyle(2, 0xffffff, sparkPulse * 0.7);
      this.gfx.strokeCircle(this.player.x, this.player.y, this.player.rad + 16);
    }

    // Draw orbital notes
    if (charType === 0) {
      // Gold color if evolved, yellow otherwise
      const noteColor = this.weaponEvolved ? 0xffd700 : 0xffff00;
      this.gfx.fillStyle(noteColor, 1);
      for (let note of this.orbitalNotes) {
        const nx = this.player.x + Math.cos(note.angle) * note.dist;
        const ny = this.player.y + Math.sin(note.angle) * note.dist;
        this.gfx.fillCircle(nx, ny, this.orbitalNoteSize);
        // Add glow effect if evolved
        if (this.weaponEvolved) {
          const pulse = Math.sin(Date.now() / 300) * 0.3 + 0.4;
          this.gfx.lineStyle(2, 0xffd700, pulse);
          this.gfx.strokeCircle(nx, ny, this.orbitalNoteSize * 1.5);
        }
      }
    }

    // Draw projectiles
    for (let p of this.projectiles) {
      // Gold for evolved+crits, yellow for crits, orange for evolved, magenta for normal
      let pColor = p.isCrit ? 0xffdd00 : 0xff00ff;
      if (this.weaponEvolved && !p.isCrit) pColor = 0xff8800;
      else if (this.weaponEvolved && p.isCrit) pColor = 0xffd700;

      // Draw motion trail for evolved projectiles
      if (this.weaponEvolved && p.bounceCount !== undefined) {
        this.gfx.fillStyle(pColor, 0.3);
        this.gfx.fillCircle(p.x - p.vx * 0.02, p.y - p.vy * 0.02, p.rad * 0.8);
        this.gfx.fillStyle(pColor, 0.15);
        this.gfx.fillCircle(p.x - p.vx * 0.04, p.y - p.vy * 0.04, p.rad * 0.6);
      }

      this.gfx.fillStyle(pColor, 1);
      this.gfx.fillCircle(p.x, p.y, p.rad);
    }

    // Draw chain lightning effects
    for (let chain of this.chainLightning) {
      const alpha = chain.life / 150; // Fade out over 150ms
      // Yellow glow if Electronic is evolved, cyan otherwise
      const chainColor = (charType === 2 && this.weaponEvolved) ? 0xffff00 : 0x00ffff;
      this.gfx.lineStyle(3, chainColor, alpha * 0.8);
      this.gfx.beginPath();
      this.gfx.moveTo(chain.fromX, chain.fromY);
      this.gfx.lineTo(chain.toX, chain.toY);
      this.gfx.strokePath();
      // Add glow
      this.gfx.lineStyle(1, 0xffffff, alpha);
      this.gfx.beginPath();
      this.gfx.moveTo(chain.fromX, chain.fromY);
      this.gfx.lineTo(chain.toX, chain.toY);
      this.gfx.strokePath();
    }

    // Draw boss freeze projectiles
    for (let ice of this.eliteProjectiles) {
      // Ice trail (sky blue)
      this.gfx.fillStyle(0x87CEEB, 0.4);
      this.gfx.fillCircle(ice.x - ice.vx * 0.03, ice.y - ice.vy * 0.03, ice.rad * 0.8);
      this.gfx.fillStyle(0x87CEEB, 0.2);
      this.gfx.fillCircle(ice.x - ice.vx * 0.06, ice.y - ice.vy * 0.06, ice.rad * 0.6);
      // Red danger shockwave
      const pulse = Math.sin(Date.now() / 150) * 0.3 + 0.5;
      this.gfx.lineStyle(3, 0xff0000, pulse);
      this.gfx.strokeCircle(ice.x, ice.y, ice.rad + 5);
      // Main ice projectile
      this.gfx.fillStyle(0x87CEEB, 1);
      this.gfx.fillCircle(ice.x, ice.y, ice.rad);
      this.gfx.lineStyle(2, 0xffffff, 0.8);
      this.gfx.strokeCircle(ice.x, ice.y, ice.rad);
    }

    // Draw particles (death effects)
    for (let p of this.particles) {
      const alpha = p.life / p.maxLife; // Fade out over time
      this.gfx.fillStyle(p.color, alpha);
      this.gfx.fillCircle(p.x, p.y, 3);
    }

    // Draw slow pools (behind enemies)
    for (let pool of this.slowPools) {
      const pulse = Math.sin(Date.now() / 300) * 0.2 + 0.6;
      this.gfx.fillStyle(0xff6600, pulse * 0.4);
      this.gfx.fillCircle(pool.x, pool.y, pool.rad);
      this.gfx.lineStyle(3, 0xff3300, pulse);
      this.gfx.strokeCircle(pool.x, pool.y, pool.rad);

      // Update text position
      if (pool.txt) {
        pool.txt.setPosition(pool.x, pool.y);
      }
    }

    // Draw enemies
    for (let e of this.enemies) {
      // Ghosts have flickering transparency
      const alpha = e.isGhost ? (Math.sin(Date.now() / 100) * 0.15 + 0.55) : 1;
      this.gfx.fillStyle(e.color, alpha);

      if (e.type === 0) { // Basic MC - square
        this.gfx.fillRect(e.x - e.rad, e.y - e.rad, e.rad * 2, e.rad * 2);
      } else if (e.type === 1) { // Speed - triangle (pointing up)
        this.gfx.fillTriangle(
          e.x, e.y - e.rad,
          e.x - e.rad, e.y + e.rad,
          e.x + e.rad, e.y + e.rad
        );
      } else if (e.type === 2) { // Heavy - big circle
        this.gfx.fillCircle(e.x, e.y, e.rad);
      } else if (e.type === 11) { // Splat - octagon
        this.gfx.beginPath();
        for (let i = 0; i < 8; i++) {
          const angle = (Math.PI * 2 / 8) * i;
          const px = e.x + Math.cos(angle) * e.rad;
          const py = e.y + Math.sin(angle) * e.rad;
          if (i === 0) this.gfx.moveTo(px, py);
          else this.gfx.lineTo(px, py);
        }
        this.gfx.closePath();
        this.gfx.fillPath();
      } else {
        // Default - circle
        this.gfx.fillCircle(e.x, e.y, e.rad);
      }

      // Draw MINI BOSS label
      if (e.isMiniBoss) {
        if (!e.label) {
          e.label = this.add.text(e.x, e.y - e.rad - 20, 'MINI BOSS', {
            fontSize: '16px', color: '#ff00aa', fontFamily: 'Arial', fontStyle: 'bold'
          }).setOrigin(0.5);
        }
        e.label.setPosition(e.x, e.y - e.rad - 20);
      }
    }

    // Draw gems
    this.gfx.fillStyle(0xffff00, 1);
    for (let g of this.gems) {
      this.gfx.fillCircle(g.x, g.y, 2.5);
    }

    // Draw health pickups (green pulsing crosses)
    for (let h of this.healthPickups) {
      const pulse = Math.sin(Date.now() / 200) * 0.5 + 0.5; // 0 to 1
      const lineWidth = 3 + pulse * 3; // 3px to 6px
      const opacity = 0.7 + pulse * 0.3; // 0.7 to 1.0

      this.gfx.lineStyle(lineWidth, 0x00ff00, opacity);
      this.gfx.beginPath();
      this.gfx.moveTo(h.x - 8, h.y);
      this.gfx.lineTo(h.x + 8, h.y);
      this.gfx.moveTo(h.x, h.y - 8);
      this.gfx.lineTo(h.x, h.y + 8);
      this.gfx.strokePath();
    }

    // Draw power-ups (pulsing circles)
    for (let pu of this.powerUps) {
      const pulse = Math.sin(Date.now() / 200) * 0.3 + 0.7;
      this.gfx.fillStyle(pu.type.color, pulse);
      this.gfx.fillCircle(pu.x, pu.y, 15);
      this.gfx.lineStyle(3, 0xffffff);
      this.gfx.strokeCircle(pu.x, pu.y, 15);
    }

    // Draw boss
    if (this.boss) {
      // Phase 2 visual effects: darker color + red aura
      const bossColor = this.bossPhase === 2 ? 0xC71585 : this.boss.color;

      if (this.bossPhase === 2) {
        // Pulsing red aura for phase 2
        const auraPulse = Math.sin(Date.now() / 200) * 0.3 + 0.5;
        this.gfx.fillStyle(0xff0000, auraPulse * 0.3);
        this.gfx.fillCircle(this.boss.x, this.boss.y, this.boss.rad + 8);
      }

      this.gfx.fillStyle(bossColor, 1);
      this.gfx.fillCircle(this.boss.x, this.boss.y, this.boss.rad);
      this.gfx.lineStyle(3, 0xffffff);
      this.gfx.strokeCircle(this.boss.x, this.boss.y, this.boss.rad);

      // Boss HP bar
      const hpBarWidth = this.boss.rad * 2;
      const hpWidth = (this.boss.hp / this.boss.maxHp) * hpBarWidth;
      this.gfx.fillStyle(0xff0000, 1);
      this.gfx.fillRect(this.boss.x - this.boss.rad, this.boss.y - this.boss.rad - 10, hpWidth, 5);
      this.gfx.lineStyle(1, 0xffffff);
      this.gfx.strokeRect(this.boss.x - this.boss.rad, this.boss.y - this.boss.rad - 10, hpBarWidth, 5);

      // Draw BOSS label
      if (!this.boss.label) {
        this.boss.label = this.add.text(this.boss.x, this.boss.y - this.boss.rad - 30, 'BOSS', {
          fontSize: '20px', color: '#ff00ff', fontFamily: 'Arial', fontStyle: 'bold'
        }).setOrigin(0.5);
      }
      this.boss.label.setPosition(this.boss.x, this.boss.y - this.boss.rad - 30);
    }

    // Danger indicator (HP < 30%)
    if (this.player.hp < this.player.maxHp * 0.3) {
      const pulse = Math.sin(Date.now() / 150) * 0.3 + 0.3; // Fast pulse
      this.gfx.lineStyle(8, 0xff0000, pulse);
      this.gfx.strokeRect(5, 5, 790, 590);
    }

    // Draw revenge charge UI
    if (this.revengeEnabled) {
      for (let i = 0; i < this.revengeCharge; i++) {
        this.gfx.fillStyle(0xff0000, 1);
        this.gfx.fillCircle(720 + i * 15, 20, 5);
      }
    }

    // Draw countdown overlay
    if (this.powerUpActive && this.powerUpType) {
      // Dark overlay
      this.gfx.fillStyle(0x000000, 0.8);
      this.gfx.fillRect(0, 0, 800, 600);

      // Update and show countdown text
      const countSec = Math.ceil(this.powerUpCountdown / 1000);
      const countText = countSec > 0 ? countSec.toString() : 'GO!';
      this.countdownTxt.setText(countText);
      this.countdownTxt.setVisible(true);

      // Show power-up info
      this.powerUpNameTxt.setText(this.powerUpType.name);
      this.powerUpNameTxt.setVisible(true);
      this.powerUpDescTxt.setText(this.powerUpType.desc);
      this.powerUpDescTxt.setVisible(true);
    } else {
      // Hide countdown UI
      this.countdownTxt.setVisible(false);
      this.powerUpNameTxt.setVisible(false);
      this.powerUpDescTxt.setVisible(false);
    }
  }

  spawnPowerUp() {
    // Random position (not near edges)
    const x = 100 + Math.random() * 600;
    const y = 150 + Math.random() * 400;

    // Random type
    const type = POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)];

    this.powerUps.push({
      x: x,
      y: y,
      type: type,
      life: 0
    });

    // Spawn animation - particle burst
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 / 12) * i;
      const speed = 150 + Math.random() * 50;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: type.color,
        life: 400,
        maxLife: 400
      });
    }

    this.cameras.main.flash(200, type.color >> 16, (type.color >> 8) & 0xff, type.color & 0xff, 0.3);
    this.playTone(500, 0.1);
  }

  activatePowerUp(type) {
    this.powerUpActive = true;
    this.powerUpCountdown = 2000; // 2 seconds
    this.powerUpType = type;
    this.playTone(1000, 0.2);
  }

  executePowerUp() {
    if (!this.powerUpType) return;

    if (this.powerUpType.id === 0) {
      this.boomAllEnemies();
    } else if (this.powerUpType.id === 1) {
      this.magnetAllXP();
    } else if (this.powerUpType.id === 2) {
      this.spawnBoss();
    } else if (this.powerUpType.id === 3) {
      // Time Slow - 5 seconds
      this.timeSlowTimer = 5000;
    } else if (this.powerUpType.id === 4) {
      // Shield - 5 seconds
      this.shieldTimer = 5000;
    } else if (this.powerUpType.id === 5) {
      // Double XP - 10 seconds
      this.doubleXpTimer = 10000;
    }

    this.powerUpType = null;
  }

  boomAllEnemies() {
    // Make all enemies explode into X pattern projectiles
    for (let e of this.enemies) {
      // 4 projectiles in X pattern (diagonals)
      const diagonals = [Math.PI / 4, 3 * Math.PI / 4, -3 * Math.PI / 4, -Math.PI / 4];
      for (let angle of diagonals) {
        const isCrit = Math.random() < this.critChance;
        const proj = {
          x: e.x,
          y: e.y,
          vx: Math.cos(angle) * 250,
          vy: Math.sin(angle) * 250,
          dmg: this.getEffectiveDamage(),
          rad: 5 * this.projectileSizeMultiplier,
          canExplode: false, // Prevent feedback loops
          isCrit: isCrit
        };
        // Add bounce for evolved Rock character
        if (charType === 1 && this.weaponEvolved) {
          proj.bounceCount = 0;
        }
        this.projectiles.push(proj);
      }
    }

    // Clear all enemies and their labels
    for (let e of this.enemies) {
      if (e.label) e.label.destroy();
    }
    this.enemies = [];

    this.playTone(400, 0.3);
  }

  magnetAllXP() {
    // Collect all XP gems instantly
    for (let g of this.gems) {
      const xpGain = this.doubleXpTimer > 0 ? g.val * 2 : g.val; // Double XP power-up
      this.xp += xpGain;
    }

    // Clear gems
    this.gems = [];

    // Check for level up
    while (this.xp >= this.xpToLevel) {
      this.levelUp();
    }

    this.playTone(1200, 0.2);
  }

  defeatElite(elite, isBoss) {
    const x = elite.x;
    const y = elite.y;

    if (isBoss) {
      // Boss defeated
      this.score += 100;
      this.scoreTxt.setText('Score: ' + this.score);

      // Drop lots of XP
      for (let i = 0; i < 20; i++) {
        this.gems.push({
          x: x + (Math.random() - 0.5) * 40,
          y: y + (Math.random() - 0.5) * 40,
          val: 1
        });
      }

      // Show defeat announcement
      this.defeatText.setText('BOSS DEFEATED!');
      this.defeatText.setVisible(true);
      this.defeatTextTimer = 2000;

      // Clean up boss label if it exists
      if (elite.label) elite.label.destroy();
      this.boss = null;

      // 3 waves of circular projectiles
      this.bossExplosionWave(x, y, 0, 12);
      this.bossExplosionWave(x, y, 200, 16);
      this.bossExplosionWave(x, y, 400, 20);

      // Large screen shake on boss death
      this.cameras.main.shake(400, 0.02);

      this.playTone(1500, 0.3);
    } else {
      // Miniboss defeated
      this.defeatText.setText('MINI BOSS DEFEATED!');
      this.defeatText.setVisible(true);
      this.defeatTextTimer = 2000;

      // Large shake for mini-boss
      this.cameras.main.shake(80, 0.015);

      // Deep sound
      this.playTone(300, 0.15);
    }
  }

  bossExplosionWave(x, y, delay, count) {
    setTimeout(() => {
      if (this.gameOver) return;

      // Create full circle of projectiles
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 / count) * i;
        const isCrit = Math.random() < this.critChance;
        const proj = {
          x: x,
          y: y,
          vx: Math.cos(angle) * 300,
          vy: Math.sin(angle) * 300,
          dmg: this.getEffectiveDamage(),
          rad: 5 * this.projectileSizeMultiplier,
          canExplode: true, // Can kill enemies and trigger explosions
          isCrit: isCrit
        };
        // Add bounce for evolved Rock character
        if (charType === 1 && this.weaponEvolved) {
          proj.bounceCount = 0;
        }
        this.projectiles.push(proj);
      }

      this.playTone(800 + (delay / 2), 0.08); // Rising pitch per wave
    }, delay);
  }

  spawnWave() {
    // Increment and display wave counter
    this.waveCount++;
    this.waveText.setText('WAVE ' + this.waveCount);
    this.waveText.setVisible(true);
    this.waveTextTimer = 2000; // Show for 2 seconds

    // Warning sound
    this.playTone(1000, 0.2);

    // Spawn 15-22 enemies in circle around screen edge (50% increase)
    const count = 25 + Math.floor(Math.random() * 8); // 15-22 enemies
    const angleStep = (Math.PI * 2) / count;

    for (let i = 0; i < count; i++) {
      const angle = angleStep * i;
      // Spawn at screen edge (400px from center)
      const x = 400 + Math.cos(angle) * 500;
      const y = 300 + Math.sin(angle) * 400;
      this.spawnEnemyAt(x, y);
    }
  }

  spawnMiniBoss() {
    // Warning sound and message
    this.playTone(800, 0.3);

    // Spawn mini-boss enemy (type 5 is already a gold boss-like enemy)
    // Create a super buffed enemy at a random edge
    const side = Math.floor(Math.random() * 4);
    let x, y;
    if (side === 0) { x = -20; y = 300; }
    else if (side === 1) { x = 820; y = 300; }
    else if (side === 2) { x = 400; y = -20; }
    else { x = 400; y = 620; }

    // Create mini-boss with higher stats
    this.enemies.push({
      x, y,
      type: 5, // Gold boss type for visual distinction
      hp: Math.floor(400 * this.hpMultiplier), // 200 HP base
      spd: Math.floor(70 * this.spdMultiplier),
      dmg: Math.floor(15 * this.dmgMultiplier),
      rad: 25, // Bigger than normal
      color: 0xff00aa, // Pink/magenta mini-boss
      xpVal: 15, // Drops 3x normal XP
      isMiniBoss: true,
      fireTimer: 0 // For shooting ice projectiles
    });
  }

  spawnBoss() {
    // Clear all enemies and their labels
    for (let e of this.enemies) {
      if (e.label) e.label.destroy();
    }
    this.enemies = [];

    // Create boss
    this.boss = {
      x: 400,
      y: 300,
      hp: 900, // 50% more HP
      maxHp: 900,
      spd: 91,
      dmg: 20,
      rad: 40,
      type: 'boss',
      color: 0xff00ff
    };

    this.bossFireTimer = 0;
    this.eliteProjectiles = [];
    this.bossPhase = 1;
    this.bossPhaseTriggered = false;
    this.playTone(200, 0.5);
  }

  activateUltimate() {
    if (charType === 0) {
      // Pop: Screen-wide explosion - all enemies set to 1 HP
      for (let e of this.enemies) {
        e.hp = 1;
      }
      this.cameras.main.shake(400, 0.02);
      this.cameras.main.flash(300, 180, 180, 0, 0.3); // Yellow flash
      this.playTone(300, 0.5);
    } else if (charType === 1) {
      // Rock: Spawn 20 explosion projectiles
      for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const isCrit = Math.random() < 0.15;
        const proj = {
          x: this.player.x,
          y: this.player.y,
          vx: Math.cos(angle) * 300,
          vy: Math.sin(angle) * 300,
          dmg: this.getEffectiveDamage() * 2,
          rad: 7 * this.projectileSizeMultiplier,
          canExplode: true,
          isCrit: isCrit
        };
        // Add bounce for evolved Rock character
        if (this.weaponEvolved) {
          proj.bounceCount = 0;
        }
        this.projectiles.push(proj);
      }
      this.cameras.main.shake(300, 0.015);
      this.playTone(250, 0.4);
    } else if (charType === 2) {
      // Ultra Chain: Chain to ALL enemies, leaving each at 1 HP (no kills)
      const enemyTargets = [...this.enemies];
      if (this.boss) enemyTargets.push(this.boss);

      // Create visual chain effects connecting all enemies
      for (let i = 0; i < enemyTargets.length; i++) {
        const target = enemyTargets[i];
        const fromX = i === 0 ? this.player.x : enemyTargets[i-1].x;
        const fromY = i === 0 ? this.player.y : enemyTargets[i-1].y;

        // Visual chain effect
        this.chainLightning.push({
          fromX: fromX,
          fromY: fromY,
          toX: target.x,
          toY: target.y,
          life: 800 // Longer visual duration
        });

        // Reduce HP to 1 (don't kill)
        if (target.hp > 1) {
          target.hp = 1;
        }
      }

      this.cameras.main.flash(500, 0, 255, 255, 0.6); // Longer cyan flash
      this.playTone(1800, 0.5);
      this.cameras.main.shake(300, 0.005); // Screen shake for impact
    }
  }

  getEffectiveDamage() {
    // Apply Near Death Bonus (+50% damage)
    let dmg = this.weaponDmg * (this.nearDeath ? 1.5 : 1.0);

    // Apply Combo Damage Multiplier
    if (this.combo >= 30) dmg *= 1.5;      // +50% at 30 combo
    else if (this.combo >= 20) dmg *= 1.3; // +30% at 20 combo
    else if (this.combo >= 10) dmg *= 1.1; // +10% at 10 combo

    return dmg;
  }

  spawnEnemyAt(x, y) {
    // Select enemy type based on time
    const timeSec = Math.floor(this.time / 1000);
    const availableTypes = [];
    availableTypes.push(0, 0, 0, 0, 1, 1, 2, 2, 3, 4, 5, 6);
    if (timeSec >= 45) availableTypes.push(11, 11);
    const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];

    // Base stats for each type
    let hp, spd, dmg, rad, color;
    if (type === 0) { hp = 20; spd = 70; dmg = 10; rad = 10; color = 0xff3333; }
    else if (type === 1) { hp = 10; spd = 140; dmg = 3; rad = 8; color = 0xffff33; }
    else if (type === 2) { hp = 30; spd = 45; dmg = 15; rad = 15; color = 0xff33ff; }
    else if (type === 3) { hp = 15; spd = 94; dmg = 10; rad = 10; color = 0x33ff33; }
    else if (type === 4) { hp = 25; spd = 104; dmg = 12; rad = 10; color = 0x33ffff; }
    else if (type === 5) { hp = 100; spd = 62; dmg = 20; rad = 20; color = 0xffaa00; }
    else if (type === 6) { hp = 15; spd = 84; dmg = 10; rad = 10; color = 0xff8833; }
    else if (type === 11) { hp = 35; spd = 76; dmg = 11; rad = 11; color = 0xff6600; }
    else { hp = 20; spd = 70; dmg = 10; rad = 10; color = 0xff3333; }

    // Apply difficulty multipliers
    hp = Math.floor(hp * this.hpMultiplier);
    spd = Math.floor(spd * this.spdMultiplier);
    dmg = Math.floor(dmg * this.dmgMultiplier);

    // 5% chance for golden enemy (faster, more XP)
    const isGolden = Math.random() < 0.05;
    if (isGolden) {
      color = 0xffd700; // Bright gold
      spd *= 1.3; // 30% faster
    }

    // Create enemy
    this.enemies.push({
      x, y, type, hp, spd, dmg, rad, color,
      xpVal: isGolden ? 5 : (type === 5 ? 10 : (type === 3 ? 2 : 1)),
      isGolden: isGolden
    });

    // Duo spawns a second enemy
    if (type === 3) {
      this.enemies.push({
        x: x + 20, y: y + 20, type, hp, spd, dmg, rad, color, xpVal: 2
      });
    }
  }

  spawnEnemy() {
    const side = Math.floor(Math.random() * 4);
    let x, y;

    if (side === 0) { x = -20; y = Math.random() * 600; }
    else if (side === 1) { x = 820; y = Math.random() * 600; }
    else if (side === 2) { x = Math.random() * 800; y = -20; }
    else { x = Math.random() * 800; y = 620; }

    this.spawnEnemyAt(x, y);
  }

  killEnemy(idx, enemy, canExplode = false) {
    // Create particle burst
    const particleCount = 4 + Math.floor(Math.random() * 3); // 4-6 particles
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 / particleCount) * i + Math.random() * 0.5;
      const speed = 100 + Math.random() * 100;
      this.particles.push({
        x: enemy.x,
        y: enemy.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: enemy.color,
        life: 300, // 300ms lifespan
        maxLife: 300
      });
    }

    // Combo system
    this.combo++;
    this.comboTimer = 0; // Reset timer
    const multiplier = Math.max(1, this.combo);

    // Apply scoring with permanent 1.5x multiplier
    const points = 15 * multiplier;

    this.score += Math.floor(points);
    this.scoreTxt.setText('Score: ' + this.score);

    // Drop XP gem with combo bonus
    let xpMultiplier = 1;
    if (this.combo >= 20) xpMultiplier = 3;
    else if (this.combo >= 10) xpMultiplier = 2;
    const totalXP = enemy.xpVal * xpMultiplier;

    for (let i = 0; i < totalXP; i++) {
      this.gems.push({
        x: enemy.x + (Math.random() - 0.5) * 20,
        y: enemy.y + (Math.random() - 0.5) * 20,
        val: 1
      });
    }

    // 2.5% chance to drop health pickup (2 per 80 enemies)
    if (Math.random() < 0.025) {
      this.healthPickups.push({
        x: enemy.x,
        y: enemy.y
      });
    }

    // Splat enemy leaves slow pool on death
    if (enemy.type === 11) {
      const poolTxt = this.add.text(enemy.x, enemy.y, 'SLOW', {
        fontSize: '24px',
        color: '#ff3300',
        fontStyle: 'bold'
      }).setOrigin(0.5).setDepth(5);

      this.slowPools.push({
        x: enemy.x,
        y: enemy.y,
        life: 12000, // 12 seconds
        rad: 84, // 20% larger
        txt: poolTxt
      });
      this.playTone(350, 0.15); // Splat sound
    }

    // Spawn explosion projectiles for rock character
    if (charType === 1 && canExplode) {
      for (let i = 0; i < this.rockExplosionCount; i++) {
        const randomAngle = Math.random() * Math.PI * 2;
        const isCrit = Math.random() < this.critChance;
        const proj = {
          x: enemy.x,
          y: enemy.y,
          vx: Math.cos(randomAngle) * 250,
          vy: Math.sin(randomAngle) * 250,
          dmg: this.getEffectiveDamage(),
          rad: 5 * this.projectileSizeMultiplier,
          canExplode: this.chainExplosion, // Only explode if chain upgrade is active
          isCrit: isCrit
        };
        // Add bounce for evolved Rock character
        if (this.weaponEvolved) {
          proj.bounceCount = 0;
        }
        this.projectiles.push(proj);
      }
      this.playTone(900, 0.08); // Explosion sound
    }

    // Handle miniboss defeat
    if (enemy.isMiniBoss) {
      this.defeatElite(enemy, false);
    } else {
      // Regular enemy defeat effects
      // Screen shake intensity scales with enemy size/type
      let shakeIntensity = 0.002; // Base
      if (enemy.rad >= 15) {
        shakeIntensity = 0.006; // Medium shake for large enemies
      } else if (enemy.rad >= 12) {
        shakeIntensity = 0.004; // Small-medium shake
      }
      this.cameras.main.shake(80, shakeIntensity);
    }

    // Clean up label if it exists
    if (enemy.label) enemy.label.destroy();
    this.enemies.splice(idx, 1);

    // Sound variations by enemy type and size (miniboss handled in defeatElite)
    let freq = 600;
    let duration = 0.05;

    if (!enemy.isMiniBoss) {
      if (enemy.type === 5) {
        freq = 400; // Deep sound
        duration = 0.1;
      } else if (enemy.isGolden) {
        freq = 1500; // High ching
        duration = 0.08;
      } else if (enemy.rad >= 15) {
        freq = 450; // Big enemy - low thunk
        duration = 0.08;
      } else if (enemy.rad <= 8) {
        freq = 900; // Small enemy - high pop
        duration = 0.04;
      } else if (enemy.type === 1) {
        freq = 800; // Speed - quick pop
        duration = 0.04;
      }
      this.playTone(freq, duration);
    }
  }

  levelUp() {
    this.xp -= this.xpToLevel;
    this.level++;
    this.xpToLevel = Math.floor(this.xpToLevel * 1.5);
    this.levelTxt.setText('Lvl: ' + this.level);
    this.paused = true;

    // Heal 30% HP on level up
    this.player.hp = Math.min(this.player.maxHp, this.player.hp + this.player.maxHp * 0.3);

    // Level-up flash effect
    this.cameras.main.flash(300, 150, 150, 150, 0.3);
    this.playTone(1200, 0.2);

    // Track all UI elements for cleanup
    const uiElements = [];

    // Show upgrade choices
    const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.8);
    uiElements.push(overlay);

    const title = this.add.text(400, 150, 'LEVEL UP!', {
      fontSize: '48px', color: '#ffff00', fontFamily: 'Arial'
    }).setOrigin(0.5);
    uiElements.push(title);

    // Keyboard hint
    const hint = this.add.text(400, 500, 'A/D to navigate • SPACE to select', {
      fontSize: '16px', color: '#888', fontFamily: 'Arial'
    }).setOrigin(0.5);
    uiElements.push(hint);

    const upgrades = this.getRandomUpgrades();
    const boxes = [];
    let selectedUpgradeIndex = 1; // Start with middle card selected

    for (let i = 0; i < 3; i++) {
      const box = this.add.rectangle(200 + i * 200, 350, 150, 200, 0x333333);
      box.setStrokeStyle(3, 0xffffff);
      boxes.push(box);
      uiElements.push(box);

      const txt = this.add.text(200 + i * 200, 320, upgrades[i].name, {
        fontSize: '16px', color: '#fff', fontFamily: 'Arial', align: 'center', wordWrap: { width: 130 }
      }).setOrigin(0.5);
      uiElements.push(txt);

      // Add description text
      const descTxt = this.add.text(200 + i * 200, 380, upgrades[i].desc, {
        fontSize: '12px', color: '#aaaaaa', fontFamily: 'Arial', align: 'center', wordWrap: { width: 130 }
      }).setOrigin(0.5);
      uiElements.push(descTxt);
    }

    // Update visual selection
    const updateSelection = () => {
      boxes.forEach((box, i) => {
        if (i === selectedUpgradeIndex) {
          box.setStrokeStyle(5, 0xffff00);
        } else {
          box.setStrokeStyle(3, 0xffffff);
        }
      });
    };

    updateSelection(); // Set initial selection

    // Cleanup function
    const cleanupAndApply = (index) => {
      this.applyUpgrade(upgrades[index]);

      // Remove keyboard listeners
      this.input.keyboard.off('keydown-A', navLeft);
      this.input.keyboard.off('keydown-D', navRight);
      this.input.keyboard.off('keydown-SPACE', selectUpgrade);

      // Destroy all UI elements
      uiElements.forEach(el => {
        if (el && el.destroy) {
          el.destroy();
        }
      });

      this.paused = false;
    };

    // Keyboard navigation handlers
    const navLeft = () => {
      selectedUpgradeIndex = (selectedUpgradeIndex - 1 + 3) % 3;
      updateSelection();
    };

    const navRight = () => {
      selectedUpgradeIndex = (selectedUpgradeIndex + 1) % 3;
      updateSelection();
    };

    const selectUpgrade = () => {
      cleanupAndApply(selectedUpgradeIndex);
    };

    this.input.keyboard.on('keydown-A', navLeft);
    this.input.keyboard.on('keydown-D', navRight);
    this.input.keyboard.on('keydown-SPACE', selectUpgrade);
  }

  getRandomUpgrades() {
    // Check if next weapon upgrade triggers evolution
    const isEvolutionUpgrade = !this.weaponEvolved && this.weaponUpgradeCount === this.evolutionThreshold - 1;

    const allUpgrades = [
      {
        name: isEvolutionUpgrade ? '⚡ WEAPON EVOLUTION ⚡' : 'Damage +10',
        type: 'dmg',
        desc: isEvolutionUpgrade ? 'Unlock ultimate power!' : 'Deal more damage'
      },
      {
        name: isEvolutionUpgrade ? '⚡ WEAPON EVOLUTION ⚡' : 'Attack Speed +20%',
        type: 'aspd',
        desc: isEvolutionUpgrade ? 'Unlock ultimate power!' : charType === 0 ? 'Faster orbit speed' : 'Shoot faster'
      },
      {
        name: 'Move Speed +20%',
        type: 'mspd',
        desc: 'Move faster'
      },
      {
        name: 'Max HP +20',
        type: 'hp',
        desc: 'Increase max health'
      }
    ];

    // Add "More Projectiles" only if not maxed (8 for both characters)
    const notMaxedProjectiles = (charType === 0 && this.orbitalNotes.length < 8) || (charType === 1 && this.rockProjectileCount < 8);
    if (notMaxedProjectiles) {
      allUpgrades.push({
        name: isEvolutionUpgrade ? '⚡ WEAPON EVOLUTION ⚡' : 'More Projectiles',
        type: 'proj',
        desc: isEvolutionUpgrade ? 'Unlock ultimate power!' : charType === 0 ? 'Add orbital note' : 'Fire more shots'
      });
    }

    // Add magnet only if not maxed (level 4)
    if (this.magnetLevel < 4) {
      allUpgrades.push({
        name: 'XP Magnet +50%',
        type: 'magnet',
        desc: 'Attract XP from farther'
      });
    }

    // Add chain explosion for rock character only, if not yet unlocked
    if (charType === 1 && !this.chainExplosion) {
      allUpgrades.push({
        name: 'Chain Explosion',
        type: 'chain',
        desc: 'Enemies explode on death'
      });
    }

    // Add revenge bullets if not yet unlocked
    if (!this.revengeEnabled) {
      allUpgrades.push({
        name: 'Revenge Bullets',
        type: 'revenge',
        desc: 'Fire burst when hit 3x'
      });
    }

    // Add new upgrade options
    allUpgrades.push({
      name: 'Lifesteal 1%',
      type: 'lifesteal',
      desc: 'Heal 1% of damage dealt'
    });
    allUpgrades.push({
      name: 'Critical Chance +10%',
      type: 'crit',
      desc: 'More critical hits'
    });

    const selected = [];
    const copy = [...allUpgrades];

    for (let i = 0; i < 3; i++) {
      if (copy.length === 0) break;
      const idx = Math.floor(Math.random() * copy.length);
      selected.push(copy[idx]);
      copy.splice(idx, 1);
    }

    return selected;
  }

  applyUpgrade(upgrade) {
    if (upgrade.type === 'dmg') {
      this.weaponDmg += 10;
      this.weaponUpgradeCount++;
    } else if (upgrade.type === 'aspd') {
      if (charType === 0) {
        // Classical: increase base orbital rotation speed
        this.baseOrbitalSpeed *= 1.25;
      } else {
        // Rock: decrease projectile delay
        this.atkDelay *= 0.8;
      }
      this.weaponUpgradeCount++;
    } else if (upgrade.type === 'mspd') {
      this.player.spd *= 1.2;
    } else if (upgrade.type === 'hp') {
      this.player.maxHp += 20;
      this.player.hp += 20;
    } else if (upgrade.type === 'proj') {
      if (charType === 0 && this.orbitalNotes.length < 8) {
        // Add new orbital note and redistribute all evenly in clockwise pattern
        // Use same distance as existing notes (in case evolution changed it)
        const currentDist = this.orbitalNotes.length > 0 ? this.orbitalNotes[0].dist : 50;
        this.orbitalNotes.push({ angle: 0, dist: currentDist });
        const total = this.orbitalNotes.length;
        for (let i = 0; i < total; i++) {
          this.orbitalNotes[i].angle = (Math.PI * 2 / total) * i;
        }
      } else if (charType === 1 && this.rockProjectileCount < 8) {
        // Rock: Increase main projectile count and explosion count by 2 (cap at 8)
        this.rockProjectileCount += 2;
        this.rockExplosionCount += 2;
      }
      this.weaponUpgradeCount++;
    } else if (upgrade.type === 'chain') {
      // Chain explosion upgrade (rock only)
      this.chainExplosion = true;
    } else if (upgrade.type === 'magnet') {
      // Increase pickup radius by 50%
      this.pickupRadius *= 1.5;
      this.magnetLevel++;
    } else if (upgrade.type === 'revenge') {
      // Revenge Bullets upgrade
      this.revengeEnabled = true;
    } else if (upgrade.type === 'lifesteal') {
      // Lifesteal upgrade (max 5%)
      if (this.lifestealPercent < 0.05) {
        this.lifestealPercent += 0.01;
      }
    } else if (upgrade.type === 'crit') {
      // Critical Chance upgrade
      this.critChance += 0.1;
    }

    // Check for weapon evolution
    if (!this.weaponEvolved && this.weaponUpgradeCount >= this.evolutionThreshold) {
      this.weaponEvolved = true;
      this.cameras.main.flash(500, 255, 215, 0, 0.5); // Gold flash
      this.cameras.main.shake(600, 0.025);
      this.playTone(1500, 0.4);
      // Evolution bonuses based on character type
      if (charType === 0) {
        // Classical: "Symphony Aura" - Double base orbital speed, larger range
        this.baseOrbitalSpeed *= 2;
        for (let note of this.orbitalNotes) {
          note.dist *= 1.5;
        }
      } else if (charType === 1) {
        // Rock: "Cannon Barrage" - Projectiles bounce once + 2x damage
        this.weaponDmg *= 2;
      } else if (charType === 2) {
        // Electronic: "Lightning Storm" - Always crit, yellow glow
        // (maxChains now controlled by no-hit timer system)
      }
    }
  }

  initMusicSystem() {
    if (this.musicEffects) return;

    const ctx = this.sound.context;

    this.musicEffects = {
      masterComp: ctx.createDynamicsCompressor(),
      delay: ctx.createDelay(),
      delayFb: ctx.createGain(),
      delayFilt: ctx.createBiquadFilter(),
      reverb: ctx.createDelay(),
      reverbGain: ctx.createGain()
    };

    const fx = this.musicEffects;

    fx.masterComp.threshold.value = -20;
    fx.masterComp.knee.value = 10;
    fx.masterComp.ratio.value = 4;
    fx.masterComp.attack.value = 0.003;
    fx.masterComp.release.value = 0.25;
    fx.masterComp.connect(ctx.destination);

    fx.delay.delayTime.value = BEAT_LENGTH * 0.5;
    fx.delayFb.gain.value = 0.3;
    fx.delayFilt.type = 'lowpass';
    fx.delayFilt.frequency.value = 2000;

    fx.delay.connect(fx.delayFb);
    fx.delayFb.connect(fx.delayFilt);
    fx.delayFilt.connect(fx.delay);
    fx.delay.connect(fx.masterComp);

    fx.reverb.delayTime.value = 0.03;
    fx.reverbGain.gain.value = 0.05;
    fx.reverb.connect(fx.reverbGain);
    fx.reverbGain.connect(fx.masterComp);
  }

  playBass(freq, startTime, dur) {
    const ctx = this.sound.context;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const filt = ctx.createBiquadFilter();

    osc1.type = 'square';
    osc1.frequency.setValueAtTime(freq, startTime);
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(freq * 0.5, startTime);

    filt.type = 'lowpass';
    filt.frequency.value = 200;
    filt.Q.value = 5;

    gain.gain.setValueAtTime(0.015, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + dur);

    osc1.connect(filt);
    osc2.connect(filt);
    filt.connect(gain);
    gain.connect(this.musicEffects.masterComp);
    gain.connect(this.musicEffects.reverb);

    osc1.start(startTime);
    osc1.stop(startTime + dur);
    osc2.start(startTime);
    osc2.stop(startTime + dur);

    this.musicNotes.push(osc1, osc2);
  }

  playMelody(freq, startTime, dur) {
    const ctx = this.sound.context;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filt = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.06, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + dur);

    filt.type = 'lowpass';
    filt.frequency.value = 3000;

    osc.connect(filt);
    filt.connect(gain);

    const dry = ctx.createGain();
    const wet = ctx.createGain();
    dry.gain.value = 0.2;
    wet.gain.value = 0.1;

    gain.connect(dry);
    gain.connect(wet);

    dry.connect(this.musicEffects.masterComp);
    dry.connect(this.musicEffects.reverb);
    wet.connect(this.musicEffects.delay);

    osc.start(startTime);
    osc.stop(startTime + dur);

    this.musicNotes.push(osc);
  }

  playCanonMusic() {
    if (!this.musicEffects || this.musicStarted) return;

    this.musicStarted = true;
    const ctx = this.sound.context;
    const startTime = ctx.currentTime + 0.1;
    let currentTime = startTime;

    // Play 3 cycles with all variations
    for (let cycle = 0; cycle < 3; cycle++) {
      // Variation 1
      variation1.forEach((pair, idx) => {
        const bassNote = bassLine[idx];
        const bassTime = currentTime + (idx * BEAT_LENGTH * 2);

        this.playBass(notes[bassNote], bassTime, BEAT_LENGTH * 2);

        pair.forEach((note, i) => {
          const noteTime = bassTime + (i * BEAT_LENGTH);
          this.playMelody(notes[note], noteTime, BEAT_LENGTH * 1.5);
        });
      });
      currentTime += BEAT_LENGTH * 16;

      // Variation 2
      variation2.forEach((group, idx) => {
        const bassNote = bassLine[idx];
        const bassTime = currentTime + (idx * BEAT_LENGTH * 2);

        this.playBass(notes[bassNote], bassTime, BEAT_LENGTH * 2);

        group.forEach((note, i) => {
          const noteTime = bassTime + (i * BEAT_LENGTH * 0.5);
          this.playMelody(notes[note], noteTime, BEAT_LENGTH * 0.7);
        });
      });
      currentTime += BEAT_LENGTH * 16;
    }

    // Canon voices (2nd and 3rd)
    const delay2nd = BEAT_LENGTH * 4;
    const delay3rd = BEAT_LENGTH * 8;

    for (let cycle = 0; cycle < 2; cycle++) {
      let cycleStart = startTime + (cycle * BEAT_LENGTH * 48);

      variation1.forEach((pair, idx) => {
        pair.forEach((note, i) => {
          const noteTime = cycleStart + delay2nd + (idx * BEAT_LENGTH * 2) + (i * BEAT_LENGTH);
          this.playMelody(notes[note], noteTime, BEAT_LENGTH * 1.5);
        });
      });

      variation1.forEach((pair, idx) => {
        pair.forEach((note, i) => {
          const noteTime = cycleStart + delay3rd + (idx * BEAT_LENGTH * 2) + (i * BEAT_LENGTH);
          this.playMelody(notes[note], noteTime, BEAT_LENGTH * 1.5);
        });
      });
    }

    // Loop after it finishes
    const duration = (currentTime - startTime) * 1000;
    this.musicLoopTimeout = setTimeout(() => {
      if (!this.gameOver) {
        this.musicStarted = false;
        this.musicNotes = [];
        this.playCanonMusic();
      }
    }, duration);
  }

  endGame() {
    this.gameOver = true;

    // Cancel pending music loop timeout
    if (this.musicLoopTimeout) {
      clearTimeout(this.musicLoopTimeout);
      this.musicLoopTimeout = null;
    }

    // Stop all music
    if (this.musicNotes) {
      this.musicNotes.forEach(osc => {
        try { osc.stop(); } catch(e) {}
      });
      this.musicNotes = [];
    }

    this.playTone(220, 0.5);

    const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.85);

    this.add.text(400, 200, 'GAME OVER', {
      fontSize: '64px', color: '#ff0000', fontFamily: 'Arial'
    }).setOrigin(0.5);

    const mins = Math.floor(this.time / 60000);
    const secs = Math.floor((this.time % 60000) / 1000);

    this.add.text(400, 300, 'Survived: ' + mins + ':' + (secs < 10 ? '0' : '') + secs, {
      fontSize: '32px', color: '#fff', fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Check for new record
    const isNewRecord = this.score > this.bestScore;
    if (isNewRecord) {
      this.bestScore = this.score;
      // Safe localStorage access for sandboxed environment
      try {
        localStorage.setItem('musicWarsBest', this.bestScore.toString());
      } catch (e) {
        // Silently fail in sandboxed environment - best score still tracked in memory
      }
    }

    this.add.text(400, 350, 'Score: ' + this.score, {
      fontSize: '32px', color: '#fff', fontFamily: 'Arial'
    }).setOrigin(0.5);

    if (isNewRecord) {
      this.add.text(400, 390, 'NEW RECORD!', {
        fontSize: '28px', color: '#ffdd00', fontFamily: 'Arial', fontStyle: 'bold'
      }).setOrigin(0.5);
    } else {
      this.add.text(400, 390, 'Best: ' + this.bestScore, {
        fontSize: '24px', color: '#aaaaaa', fontFamily: 'Arial'
      }).setOrigin(0.5);
    }

    this.add.text(400, 430, 'Level: ' + this.level, {
      fontSize: '32px', color: '#fff', fontFamily: 'Arial'
    }).setOrigin(0.5);

    const restartTxt = this.add.text(400, 500, 'Press SPACE to Restart', {
      fontSize: '24px', color: '#ffff00', fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.tweens.add({
      targets: restartTxt,
      alpha: { from: 1, to: 0.3 },
      duration: 600,
      yoyo: true,
      repeat: -1
    });

    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('SelectScene');
    });
  }

  playTone(freq, dur) {
    const ctx = this.sound.context;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.value = freq;
    osc.type = 'square';

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + dur);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + dur);
  }
}

// Initialize game
const cfg = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#0a0a0a',
  physics: { default: 'arcade', arcade: { debug: false } },
  scene: [SelectScene, GameScene]
};

new Phaser.Game(cfg);
