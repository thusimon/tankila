import { MoveStatus } from "../types"

export const getNewMoveStatus = (): MoveStatus => {
  return {
    keyW: '0',
    keyS: '0',
    keyA: '0',
    keyD: '0',
    keySpace: '0',
    forward: 0,
    direction: 0,
    speed: 0,
    rotation: 0,
    rotationSpeed: 0
  };
};
