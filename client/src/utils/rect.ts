import Point from '../data/Point';
import Rect from '../data/Rect';
import { Euler, MathUtils, Vector3 } from 'three';
export const getRectPoints = (rect: Rect):Point[] => {
  const {position, rotation, size} = rect;
  const hw = size.w / 2;
  const hh = size.h / 2; 

  return [
    new Point(-hw, -hh).rotate(rotation).add(position), // top left
    new Point(hw, -hh).rotate(rotation).add(position), // top right
    new Point(-hw, hh).rotate(rotation).add(position), // bottom left
    new Point(hw, hh).rotate(rotation).add(position) // bottom right
  ];
};

export const getRandomPositionInBoundary = (width: number, height: number) => {
  const x = MathUtils.randFloat(-width, width);
  const y = MathUtils.randFloat(-height, height);
  const r = MathUtils.randFloat(0, Math.PI);
  return {
    position: new Vector3(x, y, 0),
    rotation: new Euler(0, 0, r)
  };
};