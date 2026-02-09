// h_PowerUp.js
// abstract base class

class PowerUp {
  constructor(x, y) {
    this.pos = createVector(x, y);
  }

  // optional per-frame update
  update() {}

  // subclasses must implement
  draw() {
    // abstract
  }

  // subclasses must implement
  applyTo(player) {
    // abstract
  }

  // pickup detection
  collectedBy(player) {
    return dist(this.pos.x, this.pos.y, player.pos.x, player.pos.y) < 28;
  }
}
