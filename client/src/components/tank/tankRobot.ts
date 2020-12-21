import { GameConfigType, TankStatus, Move } from '../data/Types';
import p5 from 'p5';
import Point from '../data/Point';
import Rect from '../data/Rect';
import TankBase from './tankBase';
import { isRectInBound } from '../utils/collision';

class TankRobot extends TankBase {
  lastMoveTime: number;
  minMoveTime: number;
  move: Move;
  constructor(p5: p5, config: GameConfigType, id: string, initStatus?: TankStatus) {
    super(p5, config, id, initStatus);
    this.speedMove = 1;
    this.speedRotate = p5.PI/80;
    this.speedBullet = 2.5;
    this.lastMoveTime = Date.now();
    this.minMoveTime = 3000;
    this.move = {
      forward: 0, 
      rotation: 0
    };
  }
  draw(): void {
    this.randomMove();
    this.p5.stroke(0, 0, 255);
    super.draw();
  }

  randomMove(): void {
    const p5 = this.p5;

    const curTime = Date.now();

    if (curTime < this.lastMoveTime + this.minMoveTime) {
      // still less that last move, do nothing
    } else {
      this.lastMoveTime = curTime;
      // get move status
      this.move.forward = Math.floor(Math.random()*10); // 0-9
      this.move.rotation = Math.floor(Math.random()*10);
    }

    let speed = 0;
    if (this.move.forward <= 1) {
      // don't move
      speed = 0;
    } else if (this.move.forward <= 3){
      // move backword
      speed = -this.speedMove;
    } else {
      // move forward
      speed = this.speedMove;
    }

    let rotation = this.rotation;
    if (this.move.rotation <= 1) {
      // rotate left
      rotation -= this.speedRotate;
    } else if (this.move.rotation <= 3) {
      rotation += this.speedRotate;
    }

    rotation %= 2 * p5.PI;

    const offset = new Point(speed * Math.cos(rotation), speed * Math.sin(rotation));
    let position = new Point(this.position.x, this.position.y);
    position = position.add(offset);

    const body = new Rect(position, rotation, this.size);

    if (isRectInBound(body, this.battleField)) {
      this.position = position;
      this.rotation = rotation;
      this.body = body;
    }
  }
}

export default TankRobot;