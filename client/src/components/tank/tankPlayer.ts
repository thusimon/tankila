import Point from '../data/Point';
import Rect from '../data/Rect';
import TankBase from './tankBase';
import Bullet from '../bullet';

class TankPlayer extends TankBase {
  updateStatus(position: Point, rotation: number): void {
    this.position = position;
    this.rotation = rotation;
    this.body = new Rect(position, rotation, this.size);
  }

  draw(): void {
    this.p5.stroke(0, 0, 255);
    super.draw();
  }

  addBullet(x: number, y: number, rotation: number): void {
    const bullet = new Bullet(this.p5, this.id, new Point(x, y), rotation);
    this.bullets.push(bullet);
  }
}

export default TankPlayer;