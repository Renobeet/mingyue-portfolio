let bg;

function preload() {
  // 注意：从 game/ 里访问 assets/，要返回上一层
  bg = loadImage('../assets/Background.PNG');
}

function setup() {
  createCanvas(900, 700);
}

function draw() {
  background(220);
  if (bg) image(bg, 0, 0, width, height);
}




--

// ================================
// TeaGardenGame — main sketch (p5.js)
// ================================

// === Game state constants ===
const STATE_MENU = 0;          // main menu
const STATE_INTRO = 1;         // story + controls screen
const STATE_PLAYING = 2;       // normal gameplay
const STATE_BOSS_CUTSCENE = 3; // boss intro cutscene
const STATE_BOSSFIGHT = 4;     // actual boss fight
const STATE_GAMEOVER = 5;      // game over screen
const STATE_WIN = 6;           // win screen

let gameState = STATE_MENU;
let currentWave = 1; // 1 = mosquitoes, 2 = beetles, 3 = wasps, 4 = boss

// === Image assets ===
let imgBackground;
let imgPlayer;
let imgMosquito;
let imgBeetle;
let imgWasp;
let imgBoss;

// player, enemies, boss, and visual particles
let player;
let enemies = [];
let boss = null;
let aroma = [];

// particles used for boss death explosion effect
let bossExplosion = [];
let bossDeadExplosionStarted = false;

// power-up items
let powerups = [];

// boss spawn flag
let bossAppeared = false;

// keyboard state for WASD movement
let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;

// difficulty scaling
const SPEED_SCALE = 1.02;
let lastSpeedScore = 0;

// global god mode flag
let godMode = true;


// ======================================================
// preload (images must be loaded here in p5.js)
// ======================================================
function preload() {
  // NOTE: adjust paths if your assets are in /assets
  // If this sketch is inside /game and assets is at repo root:
  // use "../assets/Background.PNG"
  imgBackground = loadImage("../assets/Background.PNG");
  imgPlayer     = loadImage("../assets/Character.PNG");
  imgMosquito   = loadImage("../assets/Mosquito.PNG");
  imgBeetle     = loadImage("../assets/BeetleTank.PNG");
  imgWasp       = loadImage("../assets/WaspShooter.PNG");
  imgBoss       = loadImage("../assets/DragonflyBoss.PNG");
}


// ======================================================
// setup + game reset
// ======================================================
function setup() {
  createCanvas(1200, 800);
  smooth();
  textFont("Arial");
  textSize(16);

  resetGame();
  gameState = STATE_MENU;
}

function resetGame() {
  // TeaSpirit class must exist in JS
  player = new TeaSpirit(width / 2, height - 60);

  enemies = [];
  aroma = [];
  powerups = [];
  bossExplosion = [];

  boss = null;
  bossAppeared = false;
  bossDeadExplosionStarted = false;
  lastSpeedScore = 0;
  currentWave = 1;

  // wave 1: basic mosquitoes only
  for (let i = 0; i < 6; i++) {
    enemies.push(new Mosquito(random(width), random(height / 2)));
  }

  // reset player buff state
  player.rapidFire = false;
  player.hasShield = false;
}


// ======================================================
// main loop
// ======================================================
function draw() {

  // -------- main menu state --------
  if (gameState === STATE_MENU) {
    background(255, 244, 204);
    fill(80, 50, 20);
    textAlign(CENTER);
    textSize(40);
    text("Tea Garden Guardian", width / 2, height / 2 - 120);

    textSize(24);
    text("1. Start Game", width / 2, height / 2 - 20);
    text("2. View Controls", width / 2, height / 2 + 20);
    text("3. Exit", width / 2, height / 2 + 60);
    return;
  }

  // -------- intro / controls screen --------
  if (gameState === STATE_INTRO) {
    background(255, 244, 204);
    fill(50, 30, 15);
    textAlign(CENTER);
    textSize(26);
    text(
      "You are the tea spirit of the teahouse,\n" +
      "protecting the peace of the tea garden\n" +
      "from mosquitoes, beetles and wasps.",
      width / 2, height / 2 - 80
    );

    textSize(18);
    text(
      "Controls:\n" +
      "W/A/S/D  - Move\n" +
      "SPACE    - Shoot tea waves\n" +
      "G        - Toggle God Mode\n\n" +
      "Pick up golden leaves (Rapid Fire),\n" +
      "red potions (Health), and blue shields (Invincibility).",
      width / 2, height / 2 + 10
    );

    text("\nPress ENTER to begin.", width / 2, height - 80);
    return;
  }

  // -------- game over screen --------
  if (gameState === STATE_GAMEOVER) {
    background(0, 120);
    fill(255);
    textAlign(CENTER);
    textSize(30);
    text("Game Over", width / 2, height / 2 - 20);
    textSize(18);
    text("Final Score: " + player.score, width / 2, height / 2 + 10);
    text("Press R to Restart  |  Press M for Menu", width / 2, height / 2 + 40);
    return;
  }

  // -------- win screen --------
  if (gameState === STATE_WIN) {
    background(0, 120);
    fill(255);
    textAlign(CENTER);
    textSize(30);
    text("Peace Returns to the Tea Garden", width / 2, height / 2 - 20);
    textSize(18);
    text("Final Score: " + player.score, width / 2, height / 2 + 20);
    text("Press R to Restart  |  Press M for Menu", width / 2, height / 2 + 50);
    return;
  }

  // -------- background rendering --------
  drawBackgroundWoodAndWall();

  // -------- aroma / eco particles behind player --------
  if (frameCount % 4 === 0) {
    aroma.push(
      new AromaParticle(
        player.pos.x - player.moveDir.x * 14 + random(-3, 3),
        player.pos.y - player.moveDir.y * 14 + random(-3, 3),
        player.moveDir.copy().mult(-1)
      )
    );
  }

  for (let i = aroma.length - 1; i >= 0; i--) {
    const a = aroma[i];
    a.update();
    a.draw();
    if (a.dead()) aroma.splice(i, 1);
  }

  // -------- boss cutscene state --------
  if (gameState === STATE_BOSS_CUTSCENE) {
    if (boss != null) {
      boss.pos.y += 2;
      boss.drawCharacter();
    }

    fill(0);
    textAlign(CENTER);
    textSize(22);
    text(
      "“It seems you’re quite strong — you defeated my underlings,\n" +
      " but defeating ME won’t be that easy.”",
      width / 2, height / 2
    );

    textSize(16);
    text("Press any key to continue", width / 2, height - 60);
    return;
  }

  // -------- player --------
  player.handleKeys();
  player.update();
  player.drawCharacter();

  // -------- power-up items --------
  for (let i = powerups.length - 1; i >= 0; i--) {
    const pu = powerups[i];
    pu.update();
    pu.draw();
    if (pu.collectedBy(player)) {
      pu.applyTo(player);
      powerups.splice(i, 1);
    }
  }

  // -------- enemies loop --------
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];

    // NOTE: JS has no "instanceof" for classes that don't exist yet.
    // Once you translate classes, these checks will work.
    if (e instanceof Mosquito && !(e instanceof DragonflyBoss)) {
      e.update(player);
      if (e.dying && e.deadTooLong()) {
        dropItems(e.pos.x, e.pos.y);
        enemies.splice(i, 1);
        continue;
      }
    } else if (e instanceof BeetleTank) {
      e.update(player);
      if (e.health <= 0) {
        dropItems(e.pos.x, e.pos.y);
        enemies.splice(i, 1);
        continue;
      }
    } else if (e instanceof WaspShooter) {
      e.update(player);
      if (e.health <= 0) {
        dropItems(e.pos.x, e.pos.y);
        enemies.splice(i, 1);
        continue;
      }
    } else if (e instanceof DragonflyBoss) {
      e.update(player);
    }

    e.drawCharacter();
  }

  // -------- wave progression --------
  if (enemies.length === 0) {
    if (!bossAppeared) {
      if (currentWave === 1) {
        console.log("Wave 2: Beetle Tanks!");
        enemies.push(new BeetleTank(width * 0.30, height * 0.45));
        enemies.push(new BeetleTank(width * 0.70, height * 0.45));
        currentWave = 2;
      } else if (currentWave === 2) {
        console.log("Wave 3: Wasp Shooters!");
        enemies.push(new WaspShooter(width * 0.25, height * 0.35));
        enemies.push(new WaspShooter(width * 0.75, height * 0.35));
        currentWave = 3;
      } else if (currentWave === 3) {
        console.log("Boss incoming!");
        boss = new DragonflyBoss(width / 2, -100);
        enemies.push(boss);
        bossAppeared = true;
        currentWave = 4;
        gameState = STATE_BOSS_CUTSCENE;
      }
    }
  }

  // -------- projectile / hit detection --------
  player.checkProjectiles(enemies);

  // -------- difficulty scaling --------
  if (player.score >= lastSpeedScore + 5) {
    lastSpeedScore = player.score;
    for (const e of enemies) {
      if (e instanceof Mosquito && !(e instanceof DragonflyBoss)) {
        e.vel.mult(SPEED_SCALE);
      }
    }
  }

  // -------- HUD --------
  drawHUD();

  // -------- player death --------
  if (player.health <= 0 && gameState !== STATE_GAMEOVER) {
    gameState = STATE_GAMEOVER;
    return;
  }

  // -------- boss death explosion -> win --------
  if (bossAppeared && boss != null && boss.health <= 0) {
    if (!bossDeadExplosionStarted) {
      bossDeadExplosionStarted = true;
      for (let i = 0; i < 80; i++) {
        const v = p5.Vector.random2D().mult(random(2, 6));
        bossExplosion.push(new AromaParticle(boss.pos.x, boss.pos.y, v));
      }
    }

    for (let i = bossExplosion.length - 1; i >= 0; i--) {
      const ap = bossExplosion[i];
      ap.update();
      ap.draw();
      if (ap.dead()) bossExplosion.splice(i, 1);
    }

    if (bossExplosion.length === 0) {
      gameState = STATE_WIN;
    }
  }
}


// ======================================================
// HUD drawing
// ======================================================
function drawHUD() {
  textAlign(LEFT);
  fill(60, 40, 20);

  textSize(16);
  text("Score: " + player.score, 20, 20);

  const maxHealth = 10.0;
  const barX = 20;
  const barY = 35;
  const barWidth = 200;
  const barHeight = 18;

  let ratio = player.health / maxHealth;
  ratio = constrain(ratio, 0, 1);
  const currentW = barWidth * ratio;

  let barColor = color(60, 190, 90);
  if (player.health <= 4) barColor = color(220, 70, 70);

  noFill();
  stroke(40, 40, 40);
  rect(barX, barY, barWidth, barHeight);

  noStroke();
  fill(barColor);
  rect(barX, barY, currentW, barHeight);

  fill(0);
  textAlign(CENTER, CENTER);
  text("HP: " + player.health + " / 10", barX + barWidth / 2, barY + barHeight / 2);

  textAlign(LEFT);
  if (godMode) {
    fill(0, 150, 60);
    text("God Mode: ON", 20, barY + barHeight + 25);
  } else {
    fill(120);
    text("God Mode: OFF", 20, barY + barHeight + 25);
  }

  fill(60, 40, 20);
  let tokenLine = "Tokens: ";

  if (player.rapidFire) {
    const rfSec = max(0, (player.rapidFireEndTime - millis()) / 1000.0);
    tokenLine += `[Rapid Fire ${nf(rfSec, 0, 1)}s] `;
  }

  if (player.hasShield) {
    const shSec = max(0, (player.shieldEndTime - millis()) / 1000.0);
    tokenLine += `[Shield ${nf(shSec, 0, 1)}s] `;
  }

  textAlign(LEFT);
  text(tokenLine, 20, barY + barHeight + 45);

  if (player.hasShield) {
    noStroke();
    fill(80, 130, 255, 200);
    rect(20, barY + barHeight + 55, 20, 24, 5);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(10);
    text("S", 30, barY + barHeight + 67);
    textSize(16);
    textAlign(LEFT);
  }
}


// ======================================================
// Background drawing
// ======================================================
function drawBackgroundWoodAndWall() {
  if (imgBackground != null) {
    imageMode(CORNER);
    image(imgBackground, 0, 0, width, height);
    return;
  }

  const mid = height * 0.55;

  noStroke();
  fill(255, 244, 204);
  rect(0, 0, width, mid);

  fill(255);
  rect(0, mid - 6, width, 12);

  fill(150, 95, 50);
  rect(0, mid, width, height - mid);

  const plankH = 24;
  for (let y = mid; y < height; y += plankH) {
    const jitter = random(-10, 10);
    fill(150 + jitter * 0.3, 95 + jitter * 0.2, 50 + jitter * 0.1);
    rect(0, y, width, plankH);
    stroke(110, 70, 40, 180);
    line(0, y, width, y);
  }

  stroke(120, 80, 45, 90);
  const seams = 8;
  for (let i = 1; i < seams; i++) {
    const x = i * (width / seams);
    line(x, mid, x, height);
  }

  noStroke();
}


// ======================================================
// Item drop logic
// ======================================================
function dropItems(x, y) {
  if (currentWave === 1) {
    if (random(1) < 0.4) powerups.push(new HealthPotion(x, y));
  } else if (currentWave === 2) {
    powerups.push(new GoldenLeaf(x, y));
  } else if (currentWave === 3) {
    powerups.push(new ShieldToken(x, y));
  } else {
    if (random(1) < 0.5) powerups.push(new HealthPotion(x, y));
    if (random(1) < 0.5) powerups.push(new GoldenLeaf(x, y));
    if (random(1) < 0.3) powerups.push(new ShieldToken(x, y));
  }
}


// ======================================================
// Keyboard input handling (p5.js uses keyPressed/keyReleased)
// ======================================================
function keyPressed() {
  // menu input handling
  if (gameState === STATE_MENU) {
    if (key === '1') {
      gameState = STATE_INTRO;
    } else if (key === '2') {
      gameState = STATE_INTRO;
    } else if (key === '3') {
      // no "exit()" on web; you can redirect or do nothing
      // window.close() usually blocked; so we just go back to menu
      // or show message
    }
    return;
  }

  // intro -> start game
  if (gameState === STATE_INTRO) {
    if (keyCode === ENTER || keyCode === RETURN) {
      resetGame();
      gameState = STATE_PLAYING;
    }
    return;
  }

  // any key to skip boss cutscene and start boss fight
  if (gameState === STATE_BOSS_CUTSCENE) {
    gameState = STATE_BOSSFIGHT;
    return;
  }

  // restart / return to menu from end screens
  if (gameState === STATE_GAMEOVER || gameState === STATE_WIN) {
    if (key === 'r' || key === 'R') {
      resetGame();
      gameState = STATE_PLAYING;
    } else if (key === 'm' || key === 'M') {
      resetGame();
      gameState = STATE_MENU;
    }
    return;
  }

  // in-game movement keys
  if (key === 'w' || key === 'W') upPressed = true;
  if (key === 's' || key === 'S') downPressed = true;
  if (key === 'a' || key === 'A') leftPressed = true;
  if (key === 'd' || key === 'D') rightPressed = true;

  // shoot
  if (key === ' ') player.shoot();

  // toggle global god mode
  if (key === 'g' || key === 'G') {
    godMode = !godMode;
    console.log("God Mode = " + godMode);
  }
}

function keyReleased() {
  if (key === 'w' || key === 'W') upPressed = false;
  if (key === 's' || key === 'S') downPressed = false;
  if (key === 'a' || key === 'A') leftPressed = false;
  if (key === 'd' || key === 'D') rightPressed = false;
}
