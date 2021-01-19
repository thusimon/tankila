import { GameConfig, TankStatus } from '../../data/Types';
import p5 from 'p5';
import Point from '../../data/Point';
import Rect from '../../data/Rect';
import { TankCommands } from '../../data/Types';
import TankBase from './tankBase';
import Bullet from '../bullet/bullet';

class TankPlayer extends TankBase {
  tankCommands: TankCommands
  constructor(p5: p5, config: GameConfig, id: string, initStatus?: TankStatus) {
    super(p5, config, id, initStatus);
    this.tankCommands = {
      fwd: false,
      bwd: false,
      rl: false,
      rr: false,
      blt: false
    };
  }
  updateCommands(tankCommands: TankCommands): void {
    this.tankCommands = {...this.tankCommands, ...tankCommands};
  }
  updateStatus(position: Point, rotation: number): void {
    this.position = position;
    this.rotation = rotation;
    this.body = new Rect(position, rotation, this.size);
  }

  draw(): void {
    const p5 = this.p5;
    const tankCommands = this.tankCommands;
    let rotation = this.rotation;
    let position = new Point(this.position.x, this.position.y);
    // w: 87, s: 83, a:65, d:68
    if (tankCommands.rl) { 
      rotation -= this.speedRotate;
    }
    if (tankCommands.rr) {
      rotation += this.speedRotate;
    }
    rotation %= 2 * p5.PI;
    let speed = 0;
    if (tankCommands.fwd) {
      speed = this.speedMove;
    }
    if (tankCommands.bwd) {
      speed = -this.speedMove;
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

    super.draw(p5.color(0, 0, 255));
  }

  addBullet(x: number, y: number, rotation: number): void {
    const bullet = new Bullet(this.p5, this.id, new Point(x, y), rotation);
    this.bullets.push(bullet);
  }
}

export default TankPlayer;