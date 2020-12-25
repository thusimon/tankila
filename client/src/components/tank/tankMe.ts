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
      this.sendRotateLeft(true);
    }
    if (p5.keyIsDown(68)) {
      rotation += this.speedRotate;
      this.sendRotateRight(true);
    }
    rotation %= 2 * p5.PI;
    let speed = 0;
    if (p5.keyIsDown(87)) {
      speed = this.speedMove;
      this.sendMoveForward(true);
    }
    if (p5.keyIsDown(83)) {
      speed = -this.speedMove;
      this.sendMoveBackword(true);
    }

    const offset = new Point(speed * Math.cos(rotation), speed * Math.sin(rotation));
    position = position.add(offset);

    const body = new Rect(position, rotation, this.size);

    // if (isRectInBound(body, this.battleField)) {
    //   this.position = position;
    //   this.rotation = rotation;
    //   this.body = body;
    // }

    this.position = position;
    this.rotation = rotation;
    this.body = body;

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
      if (p5.keyCode == 65) {
        this.sendRotateLeft(false);
      }
      if (p5.keyCode == 68) {
        this.sendRotateRight(false);
      }
      if (p5.keyCode == 87) {
        this.sendMoveForward(false);
      }
      if (p5.keyCode == 83) {
        this.sendMoveBackword(false);
      }
    };
    p5.stroke(255, 0, 0);
    super.draw();
  }

  sendMoveForward(startFlag: boolean): void {
    this.message.sendMessage(`fwd,${startFlag ? '1' : '0'}`);
  }
  sendMoveBackword(startFlag: boolean): void {
    this.message.sendMessage(`bwd,${startFlag ? '1' : '0'}`);
  }
  sendRotateLeft(startFlag: boolean): void {
    this.message.sendMessage(`rl,${startFlag ? '1' : '0'}`);
  }
  sendRotateRight(startFlag: boolean): void {
    this.message.sendMessage(`rr,${startFlag ? '1' : '0'}`);
  }
}

export default TankMe;