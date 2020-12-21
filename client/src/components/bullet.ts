import p5 from 'p5';
import Point from './data/Point';

class Bullet {
  p5: p5;
  id: string;
  radius: number;
  position: Point;
  rotation: number;
  speed: number;
  isHit = false;

  constructor(p5: p5, id: string, p0: Point, rotation: number) {
    this.p5 = p5;
    this.id = id;
    this.radius = 5;
    this.position = new Point(p0.x, p0.y);
    this.rotation = rotation;
    this.speed = 10;
  }

  draw(): void {
    const p5 = this.p5;
    const offset = new Point(this.speed * Math.cos(this.rotation), this.speed * Math.sin(this.rotation));
    this.position = this.position.add(offset);

    p5.circle(this.position.x, this.position.y, this.radius);
  }
}

export default Bullet;