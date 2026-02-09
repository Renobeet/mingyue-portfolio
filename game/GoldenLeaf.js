// I_GoldenLeaf.js

class GoldenLeaf extends PowerUp {
  constructor(x, y) {
    super(x, y);
  }

  draw() {
    noStroke();
    fill(255, 215, 0);
    ellipse(this.pos.x, this.pos.y, 22, 22);
  }

  applyTo(player) {
    player.rapidFire = true;
    player.rapidFireEndTime = millis() + 10000; // 10 seconds
  }
}
