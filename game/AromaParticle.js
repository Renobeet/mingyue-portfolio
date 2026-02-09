// g_AromaParticle.js
// Aroma particle used for trail and boss explosion effects

class AromaParticle {
  constructor(x, y, v) {
    this.pos = createVector(x, y);     // position
    this.vel = v.copy().mult(0.5);     // slower movement
    this.life = 50;                    // lifetime in frames
  }

  update() {
    this.pos.add(this.vel);
    this.life--;
  }

  draw() {
    noStroke();
    // alpha fades out as life decreases
    let alpha = map(this.life, 0, 50, 0, 120);
    fill(255, 255, 255, alpha);
    ellipse(this.pos.x, this.pos.y, 6, 6);
  }

  dead() {
    return this.life <= 0;
  }
}
