// ShieldToken.js

class ShieldToken extends PowerUp {
  constructor(x, y) {
    super(x, y);
  }

  draw() {
    noStroke();

    // blue circular token
    fill(80, 130, 255, 200);
    ellipse(this.pos.x, this.pos.y, 26, 26);

    // letter
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(12);
    text("S", this.pos.x, this.pos.y);

    // restore defaults
    textAlign(LEFT, BASELINE);
    textSize(16);
  }

  applyTo(player) {
    player.hasShield = true;
    player.shieldEndTime = millis() + 5000; // 5 seconds
  }
}
