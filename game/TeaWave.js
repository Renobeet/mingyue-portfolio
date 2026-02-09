// TeaWave.js
// Projectile class

class TeaWave {
  constructor(x, y, v, c) {
    this.pos = createVector(x, y);   // position
    this.vel = v.copy();             // velocity (p5.Vector)
    this.c = c;                      // color
    this.r = 8;                      // diameter
  }

  // basic movement
  mov() {
    this.pos.add(this.vel);
  }

  // kept for structure (no logic yet)
  checkWalls() {
    // optional future extension
  }

  // per-frame update
  update() {
    this.mov();
    this.checkWalls();
  }

  // draw projectile
  drawProjectile() {
    noStroke();
    fill(this.c);
    ellipse(this.pos.x, this.pos.y, this.r, this.r);
  }

  // off-screen check
  offScreen() {
    return (
      this.pos.x < -this.r ||
      this.pos.x > width + this.r ||
      this.pos.y < -this.r ||
      this.pos.y > height + this.r
    );
  }

  // collision with Character
  hit(ch) {
    const d = dist(this.pos.x, this.pos.y, ch.pos.x, ch.pos.y);
    return d < (this.r / 2 + ch.w / 2);
  }
}
