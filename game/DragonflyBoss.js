// e_DragonflyBoss.js
// Boss enemy: dragonfly

class DragonflyBoss extends Mosquito {
  constructor(x, y) {
    super(x, y);

    // 6–8 hits to defeat
    this.health = int(random(6, 9));
    this.w = 60;
    this.h = 60;

    // slow drifting
    this.vel = createVector(random(-0.8, 0.8), random(-0.8, 0.8));

    // boss projectiles
    this.poison = [];
    this.lastShot = millis();

    // optional fields kept (not required but matches your original)
    this.announced = false;
    this.deathTime = -1;
  }

  update(player) {
    this.moveCharacter();
    this.checkWalls();

    if (this.health > 0) {
      // collision with player
      if (this.hitCharacter(player)) {
        player.decreaseHealth(1);
        this.vel.mult(-1);
      }

      // shoot every 2 seconds
      if (millis() - this.lastShot > 2000) {
        this.shootAtPlayer(player);
        this.lastShot = millis();
      }
    } else {
      // record time of death once
      if (this.deathTime < 0) this.deathTime = millis();
    }

    // update boss projectiles
    for (let i = this.poison.length - 1; i >= 0; i--) {
      const pw = this.poison[i];
      pw.update();

      if (pw.hit(player)) {
        player.decreaseHealth(1);
        this.poison.splice(i, 1);
      } else if (pw.offScreen()) {
        this.poison.splice(i, 1);
      }
    }
  }

  shootAtPlayer(player) {
    // bullet 1: toward player
    const dir = p5.Vector.sub(player.pos, this.pos).normalize().mult(4);
    const bossColor = color(160, 120, 60);

    this.poison.push(new TeaWave(this.pos.x, this.pos.y, dir, bossColor));

    // bullet 2: slightly rotated
    const dir2 = dir.copy().rotate(0.3);
    this.poison.push(new TeaWave(this.pos.x, this.pos.y, dir2, bossColor));
  }

  drawCharacter() {
    if (typeof imgBoss !== "undefined" && imgBoss) {
      push();
      imageMode(CENTER);

      if (this.health <= 0) tint(180);
      image(imgBoss, this.pos.x, this.pos.y, this.w * 2.0, this.h * 2.0);
      noTint();

      pop();
    } else {
      // fallback vector dragonfly
      push();
      translate(this.pos.x, this.pos.y);
      noStroke();

      if (this.health <= 0) fill(140, 110, 160, 190);
      else fill(100, 80, 200);

      // body
      const bodyW = this.w * 0.35;
      const bodyH = this.h * 1.0;
      ellipse(0, 0, bodyW, bodyH);

      // head
      const headR = this.w * 0.5;
      ellipse(0, -bodyH * 0.45, headR, headR);

      // wings flap only when alive
      if (this.health > 0) {
        fill(255, 255, 255, 110);
        const flap = sin(frameCount * 0.3) * 6;

        // upper-left wing
        push();
        rotate(radians(-25));
        ellipse(-bodyW * 1.6, -bodyH * 0.15 + flap, bodyW * 2.5, bodyH * 0.45);
        pop();

        // lower-left wing
        push();
        rotate(radians(25));
        ellipse(-bodyW * 1.6, bodyH * 0.15 + flap, bodyW * 2.5, bodyH * 0.45);
        pop();

        // upper-right wing
        push();
        rotate(radians(25));
        ellipse(bodyW * 1.6, -bodyH * 0.15 + flap, bodyW * 2.5, bodyH * 0.45);
        pop();

        // lower-right wing
        push();
        rotate(radians(-25));
        ellipse(bodyW * 1.6, bodyH * 0.15 + flap, bodyW * 2.5, bodyH * 0.45);
        pop();
      }

      pop();
    }

    // draw boss projectiles
    for (const pw of this.poison) {
      pw.drawProjectile();
    }
  }

  deadTooLong() {
    return this.deathTime > 0 && (millis() - this.deathTime > 3000);
  }
}
