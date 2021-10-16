import {MAX_FORWARD_SPEED, MAX_BACKWARD_SPEED, FORWARD_ACC, BACKWARD_ACC, ROTATE_SPEED} from './constants';
import { MoveStatus } from '../types/Types';


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
  if (currentMoveStatus.forwardStatus === 1) {
    currentMoveStatus.speed = accelerate(currentSpeed);
  } else if (currentMoveStatus.forwardStatus === -1) {
    currentMoveStatus.speed = deaccelerate(currentSpeed);
  } else {
    currentMoveStatus.speed = stop(currentSpeed);
  }
}

export const updateMoveRotation = (currentMoveStatus: MoveStatus) => {
  const currentRotation = currentMoveStatus.rotation || 0;
  if (currentMoveStatus.rotationstatus === 1) {
    currentMoveStatus.rotation = currentRotation - ROTATE_SPEED;
  } else if (currentMoveStatus.rotationstatus === -1) {
    currentMoveStatus.rotation = currentRotation + ROTATE_SPEED;
  } else {
    // do nothing
  }
}

export const updateMoveStatus = (currentMoveStatus: MoveStatus, newMoveStatus: MoveStatus) => {
  if (Number.isInteger(newMoveStatus.keyW)) {
    if (newMoveStatus.keyW) {
      // keyW pressed
      currentMoveStatus.forwardStatus = 1;
    } else {
      // keyW released
      if (currentMoveStatus.keyS) {
        currentMoveStatus.forwardStatus = -1;
      } else {
        currentMoveStatus.forwardStatus = 0;
      }
    }
    currentMoveStatus.keyW = newMoveStatus.keyW
  }

  if (Number.isInteger(newMoveStatus.keyS)) {
    if (newMoveStatus.keyS) {
      // keyS pressed
      currentMoveStatus.forwardStatus = -1;
    } else {
      // keyS released
      if (currentMoveStatus.keyW) {
        currentMoveStatus.forwardStatus = 1;
      } else {
        currentMoveStatus.forwardStatus = 0;
      }
    }
    currentMoveStatus.keyS = newMoveStatus.keyS
  }

  const currentRotation = currentMoveStatus.rotation || 0;
  if (Number.isInteger(newMoveStatus.keyA)) {
    if (newMoveStatus.keyA) {
      // keyA pressed
      currentMoveStatus.rotationstatus = -1;
    } else {
      // keyA released
      if (currentMoveStatus.keyD) {
        currentMoveStatus.rotationstatus = 1;
      } else {
        currentMoveStatus.rotationstatus = 0;
      }
    }
    currentMoveStatus.keyA = newMoveStatus.keyA
  }

  if (Number.isInteger(newMoveStatus.keyD)) {
    if (newMoveStatus.keyD) {
      // keyD pressed
      currentMoveStatus.rotationstatus = 1;
    } else {
      // keyD released
      if (currentMoveStatus.keyA) {
        currentMoveStatus.rotationstatus = -1;
      } else {
        currentMoveStatus.rotationstatus = 0;
      }
    }
    currentMoveStatus.keyD = newMoveStatus.keyD
  }

  return currentMoveStatus;
}
