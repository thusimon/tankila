import Point from './Point';
import Size from './Size';
import { Bound } from './Types';

class Rect {
  position: Point;
  rotation: number;
  size: Size;

  constructor(position: Point, rotation: number, size: Size) {
    this.position = position;
    this.rotation = rotation;
    this.size = size;
  }

  getVertexes():Point[] {
    const hw = this.size.w / 2;
    const hh = this.size.h / 2; 
  
    return [
      new Point(-hw, -hh).rotate(this.rotation).add(this.position), // top left
      new Point(hw, -hh).rotate(this.rotation).add(this.position), // top right
      new Point(-hw, hh).rotate(this.rotation).add(this.position), // bottom left
      new Point(hw, hh).rotate(this.rotation).add(this.position) // bottom right
    ];
  }

  getBound(): Bound {
    const vertexes: Point[] = this.getVertexes();
    const vertexesY: number[] = vertexes.map(p => p.y);
    const vertexesX: number[] = vertexes.map(p => p.x);
    return {
      top: Math.min(...vertexesY),
      right: Math.max(...vertexesX),
      bottom: Math.max(...vertexesY),
      left: Math.min(...vertexesX)
    };
  }
}

export default Rect;