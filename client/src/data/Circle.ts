import Point from './Point';
import { Bound } from '../types/Types';

class Circle {
  center: Point;
  radius: number;

  constructor(center: Point, radius: number) {
    this.center = center;
    this.radius = radius;
  }

  getBound(): Bound {
    return {
      top: this.center.y - this.radius,
      right: this.center.x + this.radius,
      bottom: this.center.y + this.radius,
      left: this.center.x - this.radius
    };
  }
}

export default Circle;