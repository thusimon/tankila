import { MAX_FORWARD_SPEED, MAX_BACKWARD_SPEED, FORWARD_ACC, BACKWARD_ACC, ROTATE_SPEED } from '../../../common/constants';
import { MoveStatus, RewardType, RewardStatus } from '../../../common/types';
import Tank from '../physics/components/tank';


export const accelerate = (speed: number, maxSpeed = MAX_FORWARD_SPEED): number => {
  speed += FORWARD_ACC;
  if (speed > maxSpeed) {
    return maxSpeed;
  } else {
    return speed;
  }
}

export const deaccelerate = (speed: number, maxSpeed = MAX_BACKWARD_SPEED): number => {
  speed += BACKWARD_ACC;
  if (speed < maxSpeed) {
    return maxSpeed;
  } else {
    return speed;
  }
}

export const stop = (speed: number): number => {
  if (speed > Math.abs(BACKWARD_ACC)) {
    speed += BACKWARD_ACC;
  } else if (speed < -Math.abs(FORWARD_ACC)) {
    speed += FORWARD_ACC
  } else {
    speed = 0;
  }
  return speed;
}

export const updateMoveSpeed = (currentMoveStatus: MoveStatus, rewardStatus: RewardStatus): void => {
  const currentSpeed = currentMoveStatus.speed || 0;
  if (currentMoveStatus.forward === 1) {
    const maxSpeed = rewardStatus[RewardType.TANK_SWIFT] > 0 ? MAX_FORWARD_SPEED * 2 : MAX_FORWARD_SPEED;
    currentMoveStatus.speed = accelerate(currentSpeed, maxSpeed);
  } else if (currentMoveStatus.forward === -1) {
    const maxSpeed = rewardStatus[RewardType.TANK_SWIFT] > 0 ? MAX_BACKWARD_SPEED * 2 : MAX_BACKWARD_SPEED;
    currentMoveStatus.speed = deaccelerate(currentSpeed, maxSpeed);
  } else {
    currentMoveStatus.speed = stop(currentSpeed);
  }
}

export const updateMoveRotation = (currentMoveStatus: MoveStatus): void => {
  const currentDirection = currentMoveStatus.direction || 0;
  if (currentMoveStatus.rotation === 1) {
    currentMoveStatus.direction = currentDirection - ROTATE_SPEED;
  } else if (currentMoveStatus.rotation === -1) {
    currentMoveStatus.direction = currentDirection + ROTATE_SPEED;
  } else {
    // do nothing
  }
}

export const updateMoveStatus = (currentMoveStatus: MoveStatus, newMoveStatus: MoveStatus): MoveStatus => {
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

export const updateTankRewardStatus = (tank: Tank, deltaTime: number): void => {
  const rewardStatus = tank.rewards;
  Object.keys(RewardType).forEach(key => {
    const keyParse = parseInt(key);
    if(!Number.isNaN(keyParse)) {
      const type = keyParse as RewardType;
      const updateVal = rewardStatus[type] - deltaTime;
      rewardStatus[type] = updateVal > 0 ? updateVal : 0; 
    }
  });
}

export const updateTankSize = (tank: Tank): void => {
  const smallReward = tank.rewards[RewardType.TANK_SAMLL];
  if (smallReward > 0) {
    tank.shrink();
  } else {
    tank.normal();
  }
}

export const getRewardName = (type: RewardType): string => {
  switch (type) {
    case RewardType.TANK_SWIFT:
      return 'Swift';
    case RewardType.TANK_SAMLL:
      return 'Dodge';
    case RewardType.TANK_INVULNERABLE:
      return 'Invulnerable';
    case RewardType.BULLET_POWER:
      return 'Battle';
    case RewardType.BULLTET_LARGE:
      return 'Power';
    default:
      return 'Unknown';
  }
};
