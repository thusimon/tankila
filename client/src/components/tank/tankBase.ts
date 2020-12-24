import { GameConfigType, TankStatus } from '../data/Types';
import p5 from 'p5';
import Point from '../data/Point';
import Size from '../data/Size';
import Rect from '../data/Rect';
import Circle from '../data/Circle';
import Bullet from '../bullet';
import { isCircleInBound } from '../utils/collision';

class Tank {
  p5: p5;
  config: GameConfigType;
  size: Size;
  halfSize: Size;
  position: Point;
  rotation: number;
  speedMove: number;
  speedRotate: number;
  speedBullet: number;
  body: Rect;
  battleField: Rect;
  id: string;
  bullets: Bullet[];
  allowFire = true;
  debug: boolean;
  isLive = true;
  constructor(p5: p5, config: GameConfigType, id: string, initStatus?: TankStatus) {
    this.p5 = p5;
    this.config = config;
    this.size = {w: 48, h: 32};
    this.halfSize = {w: this.size.w / 2, h: this.size.h / 2};
    if (initStatus) {
      this.position = initStatus.position;
      this.rotation = initStatus.rotation;
    } else {
      this.position = new Point(50, this.config.height-80);
      this.rotation = 0; //0 - 2pi deg
    }
    this.speedMove = 2;
    this.speedRotate = p5.PI/40;
    this.speedBullet = 5;
    this.body = new Rect(this.position, this.rotation, this.size);
    this.battleField = new Rect(new Point(config.width / 2, config.height / 2), 0, new Size(config.width, config.height));
    this.id = id;
    this.bullets = [];
    this.debug = false;
  }

  draw():void {
    const p5 = this.p5;
    p5.textSize(12);

    // plot tank
    p5.push();
    p5.fill(255, 255, 255);
    p5.translate(this.position.x, this.position.y);
    p5.rotate(this.rotation);
    p5.rect(-this.halfSize.w, -this.halfSize.h, this.size.w, this.size.h, 5);
    p5.rect(0 , -this.halfSize.h / 4, this.size.w , this.halfSize.h / 2);

    // plot debug info
    p5.pop();
    // plot bullets
    p5.fill(255, 255, 0);
    this.drawBullets();

    if (this.debug) {
      p5.fill(0, 0, 255);
      this.debugInfo();
    }
  }

  debugInfo(): void {
    const p5 = this.p5;
    const rect = new Rect(this.position, this.rotation, this.size);
    const boundingP = rect.getVertexes();
    boundingP.forEach(p => {
      p5.text(p.toString(1), p.x, p.y);
    });
  }

  drawBullets(): void {
    this.bullets.forEach(b => {
      b.draw();
    });
    this.bullets = this.bullets.filter(b => {
      const circle = new Circle(b.position, b.radius);
      return isCircleInBound(circle, this.battleField);
    });
  }

  nomalizePostion(p: Point): Point {
    return new Point(p.x/this.config.width, p.y/this.config.height);
  }

  denomalizePosition(p: Point): Point {
    return new Point(p.x*this.config.width, p.y*this.config.height);
  }
}

export default Tank;