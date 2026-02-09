// TeaSpirit.js
// Player class

class TeaSpirit extends Character {
  constructor(x, y) {
    super(x, y, 40, 50, 10);

    this.waves = [];      // Array of TeaWave
    this.score = 0;

    this.moveDir = createVector(0, 0);

    // shooting state
    this.lastShootTime = 0;
    this.shootCooldown = 250; // ms
    this.rapidFire = false;
    this.rapidFireEndTime = 0;

    // shield power-up
    this.hasShield = false;
    this.shieldEndTime = 0;

    // achievement: survive 5s without being hit
    this.lastHitTime = millis();
    this.achievementShown = false;

    // Processing version set vel = (0,0)
    this.vel = createVector(0, 0);
  }

  // damage handler (respects global godMode and local shield)
  decreaseHealth(dmg) {
    if (typeof godMode !== "undefined" && godMode) return;

    if (this.hasShield) return;

    super.decreaseHealth(dmg);
    this.lastHitTime = millis();
  }

  // WASD movement handling (uses global upPressed/downPressed/leftPressed/rightPressed)
  handleKeys() {
    this.moveDir.set(0, 0);

    if (typeof upPressed !== "undefined" && upPressed) this.moveDir.y -= 1;
    if (typeof downPressed !== "undefined" && downPressed) this.moveDir.y += 1;
    if (typeof leftPressed !== "undefined" && leftPressed) this.moveDir.x -= 1;
    if (typeof rightPressed !== "undefined" && rightPressed) this.moveDir.x += 1;

    if (this.moveDir.mag() > 0) {
      this.moveDir.normalize();
      // move speed = 5 (same as your PDE)
      this.pos.add(p5.Vector.mult(this.moveDir, 5));
    }
  }

  // fire a projectile (uses cooldown unless rapidFire is active)
  shoot() {
    const now = millis();

    if (!this.rapidFire && now - this.lastShootTime < this.shootCooldown) return;

    this.lastShootTime = now;

    const dir = createVector(0, -7);
    // TeaWave constructor must match this signature:
    // new TeaWave(x, y, dirVector, colorValue)
    this.waves.push(new TeaWave(this.pos.x, this.pos.y - this.h / 2, dir, color(180, 255, 180)));
  }

  update() {
    // keep player inside screen
    this.checkWalls();

    // rapid fire expiration
    if (this.rapidFire && millis() > this.rapidFireEndTime) {
      this.rapidFire = false;
    }

    // shield expiration
    if (this.hasShield && millis() > this.shieldEndTime) {
      this.hasShield = false;
    }

    // achievement trigger
    if (!this.achievementShown && millis() - this.lastHitTime > 5000) {
      console.log("✨ Achievement: 5 seconds without being hit by mosquitoes!");
      this.achievementShown = true;
    }

    // update projectiles
    for (let i = this.waves.length - 1; i >= 0; i--) {
      const wv = this.waves[i];
      wv.update();
      if (wv.offScreen()) {
        this.waves.splice(i, 1);
      }
    }
  }

  // collisions between player projectiles and enemies
  checkProjectiles(enemies) {
    for (let i = this.waves.length - 1; i >= 0; i--) {
      const t = this.waves[i];

      for (let j = 0; j < enemies.length; j++) {
        const e = enemies[j];
        if (t.hit(e)) {
          e.decreaseHealth(1);
          this.waves.splice(i, 1);
          this.score++;
          break;
        }
      }
    }
  }

  drawCharacter() {
    // use sprite if available: global imgPlayer
    if (typeof imgPlayer !== "undefined" && imgPlayer) {
      push();
      imageMode(CENTER);
      image(imgPlayer, this.pos.x, this.pos.y, this.w * 1.8, this.h * 1.8);
      pop();
    } else {
      // fallback drawing
      push();
      translate(this.pos.x, this.pos.y);
      noStroke();

      for (let i = 0; i < 20; i++) {
        const f = i / 19.0;
        const c = lerpColor(color(110, 180, 110), color(180, 255, 180), f);
        fill(red(c), green(c), blue(c), 200);
        ellipse(0, 0, this.w - i * 1.1, this.h - i * 1.4);
      }

      // stem
      stroke(90, 60, 40);
      strokeWeight(3);
      line(0, this.h / 2 - 5, 0, this.h / 2 + 12);

      // main vein
      stroke(100, 150, 100, 180);
      strokeWeight(2);
      line(0, -this.h / 2 + 6, 0, this.h / 2 - 6);

      // side veins
      for (let i = -2; i <= 2; i++) {
        const y = i * (this.h * 0.12);
        line(0, y, this.w * 0.25 * (i % 2 === 0 ? 1 : -1), y + 3);
      }

      pop();
    }

    // draw projectiles
    for (let i = 0; i < this.waves.length; i++) {
      this.waves[i].drawProjectile();
    }
  }
}
