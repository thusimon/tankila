class Point {
  x: number;
  y: number;
  constructor(x:number, y:number) {
    this.x = x;
    this.y = y;
  }

  add(p:Point):Point {
    return new Point(this.x + p.x, this.y + p.y);
  }

  sub(p:Point):Point {
    return new Point(this.x - p.x, this.y - p.y);
  }

  rotate(angle: number): Point {
    const x1 = this.x * Math.cos(angle) - this.y * Math.sin(angle);
    const y1 = this.x * Math.sin(angle) + this.y * Math.cos(angle);
    return new Point(x1, y1);
  }

  toString(floatDigit: number): string {
    return `${this.x.toFixed(floatDigit)},\n${this.y.toFixed(floatDigit)}`;
  }
}

export default Point;