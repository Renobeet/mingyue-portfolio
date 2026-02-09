// l_WaspShooter.js

class WaspShooter extends Character {
  constructor(x, y) {
    super(x, y, 40, 40, 4);

    // faster than mosquito
    this.vel = createVector(random(-3, 3), random(-2, 2));

    this.stings = [];
    this.lastShot = 0;
  }

  update(player) {
    this.moveCharacter();
    this.checkWalls();

    // collision with player
    if (this.hitCharacter(player)) {
      player.decreaseHealth(1);
      this.vel.mult(-1);
    }

    // shoot every 1.5 seconds
    if (millis() - this.lastShot > 1500) {
      this.shootAtPlayer(player);
      this.lastShot = millis();
    }

    // update stings
    for (let i = this.stings.length - 1; i >= 0; i--) {
      const w = this.stings[i];
      w.update();

      if (w.hit(player)) {
        player.decreaseHealth(1);
        this.stings.splice(i, 1);
      } else if (w.offScreen()) {
        this.stings.splice(i, 1);
      }
    }
  }

  shootAtPlayer(player) {
    const dir = p5.Vector.sub(player.pos, this.pos).normalize().mult(5);
    const stingColor = color(255, 220, 0);
    this.stings.push(new TeaWave(this.pos.x, this.pos.y, dir, stingColor));
  }

  drawCharacter() {
    if (typeof imgWasp !== "undefined" && imgWasp) {
      push();
      imageMode(CENTER);
      image(imgWasp, this.pos.x, this.pos.y, this.w * 1.8, this.h * 1.8);
      pop();
    } else {
      // fallback vector wasp
      push();
      translate(this.pos.x, this.pos.y);
      noStroke();

      fill(250, 220, 60);
      ellipse(0, 0, this.w, this.h * 0.7);

      fill(40, 40, 40);
      ellipse(-5, 0, this.w * 0.3, this.h * 0.2);
      ellipse( 5, 0, this.w * 0.3, this.h * 0.2);

      fill(255, 255, 255, 140);
      const flap = sin(frameCount * 0.5) * 4;
      ellipse(-this.w * 0.1, -this.h * 0.6 + flap, this.w * 0.5, this.h * 0.4);
      ellipse( this.w * 0.1, -this.h * 0.6 + flap, this.w * 0.5, this.h * 0.4);

      pop();
    }

    // draw stings
    for (const w of this.stings) {
      w.drawProjectile();
    }
  }
}
