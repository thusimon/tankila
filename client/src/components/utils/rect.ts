import Point from '../data/Point';
import Rect from '../data/Rect';

const getRectPoints = (rect: Rect):Point[] => {
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

export default {
  getRectPoints
};