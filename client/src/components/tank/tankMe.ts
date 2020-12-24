import { GameConfigType, TankStatus } from '../data/Types';
import p5 from 'p5';
import Point from '../data/Point';
import Rect from '../data/Rect';
import Bullet from '../bullet';
import TankBase from './tankBase';
import Message from '../message';
import { isRectInBound } from '../utils/collision';

class TankMe extends TankBase {
  message: Message;
  constructor(p5: p5, config: GameConfigType, id: string, message: Message, initStatus?: TankStatus) {
    super(p5, config, id, initStatus);
    this.message = message;
  }
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
      const bullet = new Bullet(this.p5, this.id, this.position.add(offset), this.rotation);
      this.message.sendMessage(`blt,${bullet.position.x},${bullet.position.y},${bullet.rotation}`);
      this.bullets.push(bullet);
    }

    p5.keyReleased = () => {
      if (p5.keyCode == 32) {
        this.allowFire = true;
      }
    };
    p5.stroke(255, 0, 0);
    this.message.sendMessage(`pos,${this.position.x},${this.position.y},${this.rotation}`);
    super.draw();
  }
}

export default TankMe;