import Rect from '../data/Rect';
import Circle from '../data/Circle';
import Point from '../data/Point';

export const isRectInBound = (rect1: Rect, rect2: Rect): boolean => {
  const b1 = rect1.getBound();
  const b2 = rect2.getBound();

  return b1.top >= b2.top && b1.right <= b2.right && b1.bottom <= b2.bottom && b1.left >= b2.left;
};

export const isCircleInBound = (circle: Circle, rect: Rect): boolean => {
  const cb = circle.getBound();
  const rb = rect.getBound();
  
  return cb.top >= rb.top && cb.right <= rb.right && cb.bottom <= rb.bottom && cb.left >= rb.left;
};

export const getTriangleArea = (pa: Point, pb: Point, pc: Point): number => {
  return Math.abs((pb.x*pa.y-pa.x*pb.y)+(pc.x*pb.y-pb.x*pc.y)+(pa.x*pc.y-pc.x*pa.y)) / 2;
};

export const isCircleHitRect = (circle: Circle, rect: Rect): boolean => {
  // TODO need to extend the rect because circle has radius
  const [p1, p2, p3, p4] = rect.getVertexes();
  const cp = circle.center;
  const rectArea = rect.size.w * rect.size.h;
  const area = getTriangleArea(p1, p2, cp) + getTriangleArea(p2, p3, cp) + getTriangleArea(p3, p4, cp) + getTriangleArea(p4, p1, cp);
  return area <= rectArea;
};

export const isColideWith = (userData: string, namePrefix: string): boolean => {
  return userData.startsWith(namePrefix);
}
