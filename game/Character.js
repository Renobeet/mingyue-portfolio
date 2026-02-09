// Character.js
// Base class for all characters (player, enemies, boss)

class Character {
  /**
   * @param {number} x - initial x position
   * @param {number} y - initial y position
   * @param {number} w - width (or diameter)
   * @param {number} h - height (or diameter)
   * @param {number} health - hit points
   */
  constructor(x, y, w, h, health) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-2, 2), random(-2, 2));
    this.w = w;
    this.h = h;
    this.health = health;
  }

  // === basic movement ===
  moveCharacter() {
    this.pos.add(this.vel);
  }

  // === optional acceleration (for tracking / boss logic) ===
  accelerate(acc) {
    this.vel.add(acc);
  }

  // === circle-based collision with another Character ===
  hitCharacter(other) {
    let d = dist(
      this.pos.x, this.pos.y,
      other.pos.x, other.pos.y
    );
    return d < (this.w / 2 + other.w / 2);
  }

  // === decrease health ===
  decreaseHealth(dmg) {
    this.health -= dmg;
    if (this.health < 0) this.health = 0;
  }

  // === screen boundary check with bounce ===
  checkWalls() {
    // horizontal bounds
    if (this.pos.x < this.w / 2 || this.pos.x > width - this.w / 2) {
      this.vel.x *= -1;
      this.pos.x = constrain(this.pos.x, this.w / 2, width - this.w / 2);
    }

    // vertical bounds
    if (this.pos.y < this.h / 2 || this.pos.y > height - this.h / 2) {
      this.vel.y *= -1;
      this.pos.y = constrain(this.pos.y, this.h / 2, height - this.h / 2);
    }
  }

  // === per-frame update ===
  update() {
    this.moveCharacter();
    this.checkWalls();
  }

  // === default drawing (placeholder) ===
  drawCharacter() {
    fill(200);
    ellipse(this.pos.x, this.pos.y, this.w, this.h);
  }
}
