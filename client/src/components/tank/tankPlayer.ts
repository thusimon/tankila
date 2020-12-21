import Point from '../data/Point';
import Rect from '../data/Rect';
import Bullet from '../bullet';
import TankBase from './tankBase';
import { isRectInBound } from '../utils/collision';

class TankPlayer extends TankBase {
  draw(): void {
    const p5 = this.p5;
    let rotation = this.rotation;
    let position = new Point(this.position.x, this.position.y);
    // w: 87, s: 83, a:65, d:68
    if (p5.keyIsDown(65)) {
      rotation -= this.speedRotate;
    }
    if (p5.keyIsDown(68)) {
      rotation += this.speedRotate;
    }
    rotation %= 2 * p5.PI;
    let speed = 0;
    if (p5.keyIsDown(87)) {
      speed = this.speedMove;
    }
    if (p5.keyIsDown(83)) {
      speed = -this.speedMove;
    }

    rotation %= 2 * p5.PI;

    const offset = new Point(speed * Math.cos(rotation), speed * Math.sin(rotation));
    position = position.add(offset);

    const body = new Rect(position, rotation, this.size);

    if (isRectInBound(body, this.battleField)) {
      this.position = position;
      this.rotation = rotation;
      this.body = body;
    }

    if (p5.keyIsDown(32) && this.allowFire) {
      // fire a bullet
      this.allowFire = false;
      const offset = new Point(this.size.w * Math.cos(this.rotation), this.size.w * Math.sin(this.rotation));
      this.bullets.push(new Bullet(this.p5, this.id, this.position.add(offset), this.rotation));
    }

    p5.keyReleased = () => {
      if (p5.keyCode == 32) {
        this.allowFire = true;
      }
    };
    this.p5.stroke(255, 0, 0);
    super.draw();
  }
}

export default TankPlayer;