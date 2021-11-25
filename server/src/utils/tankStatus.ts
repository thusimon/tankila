import {MAX_FORWARD_SPEED, MAX_BACKWARD_SPEED, FORWARD_ACC, BACKWARD_ACC, ROTATE_SPEED} from '../../../client/src/utils/constants';
import { MoveStatus, RewardType } from '../../../client/src/types/Types';


export const accelerate = (speed: number) => {
  speed += FORWARD_ACC;
  if (speed > MAX_FORWARD_SPEED) {
    return MAX_FORWARD_SPEED;
  } else {
    return speed;
  }
}

export const deaccelerate = (speed: number) => {
  speed += BACKWARD_ACC;
  if (speed < MAX_BACKWARD_SPEED) {
    return MAX_BACKWARD_SPEED;
  } else {
    return speed;
  }
}

export const stop = (speed: number) => {
  if (speed > Math.abs(BACKWARD_ACC)) {
    speed += BACKWARD_ACC;
  } else if (speed < -Math.abs(FORWARD_ACC)) {
    speed += FORWARD_ACC
  } else {
    speed = 0;
  }
  return speed;
}

export const updateMoveSpeed = (currentMoveStatus: MoveStatus) => {
  const currentSpeed = currentMoveStatus.speed || 0;
  if (currentMoveStatus.forward === 1) {
    currentMoveStatus.speed = accelerate(currentSpeed);
  } else if (currentMoveStatus.forward === -1) {
    currentMoveStatus.speed = deaccelerate(currentSpeed);
  } else {
    currentMoveStatus.speed = stop(currentSpeed);
  }
}

export const updateMoveRotation = (currentMoveStatus: MoveStatus) => {
  const currentDirection = currentMoveStatus.direction || 0;
  if (currentMoveStatus.rotation === 1) {
    currentMoveStatus.direction = currentDirection - ROTATE_SPEED;
  } else if (currentMoveStatus.rotation === -1) {
    currentMoveStatus.direction = currentDirection + ROTATE_SPEED;
  } else {
    // do nothing
  }
}

export const updateMoveStatus = (currentMoveStatus: MoveStatus, newMoveStatus: MoveStatus) => {
  if (newMoveStatus.keyW) {
    if (newMoveStatus.keyW === '1') {
      // keyW pressed
      currentMoveStatus.forward = 1;
    } else {
      // keyW released
      if (currentMoveStatus.keyS === '1') {
        currentMoveStatus.forward = -1;
      } else {
        currentMoveStatus.forward = 0;
      }
    }
    currentMoveStatus.keyW = newMoveStatus.keyW
  }

  if (newMoveStatus.keyS) {
    if (newMoveStatus.keyS === '1') {
      // keyS pressed
      currentMoveStatus.forward = -1;
    } else {
      // keyS released
      if (currentMoveStatus.keyW === '1') {
        currentMoveStatus.forward = 1;
      } else {
        currentMoveStatus.forward = 0;
      }
    }
    currentMoveStatus.keyS = newMoveStatus.keyS
  }

  if (newMoveStatus.keyA) {
    if (newMoveStatus.keyA === '1') {
      // keyA pressed
      currentMoveStatus.rotation = -1;
    } else {
      // keyA released
      if (currentMoveStatus.keyD === '1') {
        currentMoveStatus.rotation = 1;
      } else {
        currentMoveStatus.rotation = 0;
      }
    }
    currentMoveStatus.keyA = newMoveStatus.keyA
  }

  if (newMoveStatus.keyD) {
    if (newMoveStatus.keyD === '1') {
      // keyD pressed
      currentMoveStatus.rotation = 1;
    } else {
      // keyD released
      if (currentMoveStatus.keyA === '1') {
        currentMoveStatus.rotation = -1;
      } else {
        currentMoveStatus.rotation = 0;
      }
    }
    currentMoveStatus.keyD = newMoveStatus.keyD
  }

  return currentMoveStatus;
}

export const getRewardName = (type: RewardType) => {
  switch (type) {
    case RewardType.TANK_SWIFT:
      return 'Acceleration';
    case RewardType.TANK_SAMLL:
      return 'Shrink';
    case RewardType.TANK_INVULNERABLE:
      return 'Invulnerable';
    case RewardType.BULLET_POWER:
      return 'Damage';
    case RewardType.BULLTET_LARGE:
      return 'Power';
    default:
      return 'Unknown';
  }
};
