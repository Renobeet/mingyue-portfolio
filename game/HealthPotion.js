// J_HealthPotion.js

class HealthPotion extends PowerUp {
  constructor(x, y) {
    super(x, y);
  }

  draw() {
    push();
    translate(this.pos.x, this.pos.y);
    noStroke();
    rectMode(CENTER);

    // red bottle body
    fill(200, 30, 30);
    rect(0, 0, 20, 20, 5);

    // white cross
    fill(255);
    rect(0, 0, 4, 14, 2);
    rect(0, 0, 14, 4, 2);

    rectMode(CORNER);
    pop();
  }

  applyTo(player) {
    player.health = 10;
  }
}
