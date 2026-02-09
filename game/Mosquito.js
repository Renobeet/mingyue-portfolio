// Mosquito.js
// Basic enemy

class Mosquito extends Character {
  constructor(x, y) {
    // health: int(random(2,4)) => 2 or 3
    super(x, y, 25, 25, floor(random(2, 4)));

    this.dying = false;
    this.deathTime = 0;

    // random initial velocity
    this.vel = createVector(random(-2.5, 2.5), random(-2.5, 2.5));
  }

  update(player) {
    // default movement + wall bounce
    super.update();

    // collide with player
    if (!this.dying && this.hitCharacter(player)) {
      player.decreaseHealth(1);
      this.vel.mult(-1);
    }

    // dodge incoming projectiles sometimes
    if (!this.dying) {
      for (let i = 0; i < player.waves.length; i++) {
        const t = player.waves[i];
        const d = dist(t.pos.x, t.pos.y, this.pos.x, this.pos.y);

        if (d < 55 && random(1) < 0.10) {
          const dodgeDir = random(1) < 0.5 ? -1 : 1;
          this.pos.x += dodgeDir * 20;
          this.pos.x = constrain(this.pos.x, this.w / 2, width - this.w / 2);
        }
      }
    }

    // enter dying state once health reaches 0
    if (this.health <= 0 && !this.dying) {
      this.dying = true;
      this.deathTime = millis();
    }
  }

  // dying for more than 1 second?
  deadTooLong() {
    return this.dying && (millis() - this.deathTime > 1000);
  }

  drawCharacter() {
    // sprite
    if (typeof imgMosquito !== "undefined" && imgMosquito) {
      push();
      imageMode(CENTER);

      if (this.dying) {
        tint(150);
      }

      image(imgMosquito, this.pos.x, this.pos.y, this.w * 2.0, this.h * 2.0);

      noTint();
      pop();
      return;
    }

    // fallback vector drawing
    push();
    translate(this.pos.x, this.pos.y);
    noStroke();

    if (this.dying) fill(120);
    else fill(180, 50, 50);

    const bodyR = this.w * 0.65;
    const headR = this.w * 0.45;

    // body + head
    ellipse(0, 0, bodyR, bodyR);
    ellipse(bodyR * 0.45, -bodyR * 0.15, headR, headR);

    // wings (alive only)
    if (!this.dying) {
      const flap = sin(frameCount * 0.4) * 6;
      fill(255, 255, 255, 120);

      // left wing
      push();
      rotate(radians(-20));
      ellipse(-bodyR * 0.6, -bodyR * 0.5 + flap, bodyR * 0.9, bodyR * 0.45);
      pop();

      // right wing
      push();
      rotate(radians(20));
      ellipse(bodyR * 0.3, -bodyR * 0.65 + flap, bodyR * 0.9, bodyR * 0.45);
      pop();
    }

    pop();
  }
}
