// k_BeetleTank.js
// BeetleTank enemy (slow, high HP, heavy collision damage)

class BeetleTank extends Character {
  constructor(x, y) {
    super(x, y, 70, 50, 10); // bigger hitbox, higher HP
    this.vel = createVector(random(-1, 1), random(-0.5, 0.5)); // slower movement
  }

  update(player) {
    this.moveCharacter();
    this.checkWalls();

    // collision with player: heavy damage + bounce back
    if (this.hitCharacter(player)) {
      player.decreaseHealth(2);
      this.vel.mult(-1);
    }
  }

  drawCharacter() {
    push();
    translate(this.pos.x, this.pos.y);

    if (typeof imgBeetle !== "undefined" && imgBeetle) {
      imageMode(CENTER);
      image(imgBeetle, 0, 0, this.w * 1.8, this.h * 1.8);
    } else {
      // fallback drawing
      noStroke();
      rectMode(CENTER);

      // main body
      fill(40, 100, 40);
      rect(0, 0, this.w, this.h, 12);

      // turret
      fill(20, 70, 20);
      rect(0, -this.h / 2 + 12, this.w * 0.6, this.h * 0.6, 10);

      // legs
      stroke(10, 40, 10);
      strokeWeight(3);
      line(-this.w / 2,  this.h / 3, -this.w / 2 - 8, this.h / 2 + 4);
      line(-this.w / 4,  this.h / 3, -this.w / 4 - 8, this.h / 2 + 4);
      line( this.w / 4,  this.h / 3,  this.w / 4 + 8, this.h / 2 + 4);
      line( this.w / 2,  this.h / 3,  this.w / 2 + 8, this.h / 2 + 4);
    }

    pop();
  }
}
