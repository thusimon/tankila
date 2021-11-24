import * as CANNON from 'cannon-es';
import { MoveStatus, UserBody, RewardStatus, RewardType } from '../../../../client/src/types/Types';

class Tank {
  body: UserBody;
  moveStatus: MoveStatus;
  tankId: string;
  tankName: string;
  rewards: RewardStatus;
  constructor(tankId: string, tankName: string) {
    this.moveStatus = {
      forward: 0,
      rotation: 0,
      speed: 0,
      direction: 0
    };
    this.rewards = {
      [RewardType.TANK_SWIFT]: 0,
      [RewardType.TANK_SAMLL]: 0,
      [RewardType.TANK_INVULNERABLE]: 0,
      [RewardType.BULLTET_LARGE]: 0,
      [RewardType.BULLET_POWER]: 0,
    };
    const sphereShape = new CANNON.Sphere(0.5);
    this.body = new CANNON.Body({
        mass: 1,
        type: CANNON.Body.DYNAMIC
    });
    this.body.addShape(sphereShape);
    this.body.userData = `tank_${tankId}_${tankName}`;
    
    this.tankId = tankId;
    this.tankName = tankName;
  }
}

export default Tank;
