import * as CANNON from 'cannon-es';
import { MoveStatus, RewardStatus, RewardType } from '../../../../client/src/types/Types';
import { UserBody } from '../../types';

class Tank {
  body: UserBody;
  geo: CANNON.Sphere;
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
    this.geo = new CANNON.Sphere(0.5);
    this.body = new CANNON.Body({
        mass: 1,
        type: CANNON.Body.DYNAMIC
    });
    this.body.addShape(this.geo);
    this.body.userData = `tank_${tankId}_${tankName}`;
    
    this.tankId = tankId;
    this.tankName = tankName;
  }

  shrink(): void {
    this.body.removeShape(this.geo);
    this.geo.radius = 0.3;
    this.body.addShape(this.geo);
    this.body.position.y = 0.3;
  }

  normal(): void {
    this.body.removeShape(this.geo);
    this.geo.radius = 0.5;
    this.body.addShape(this.geo);
    this.body.position.y = 0.5;
  }
}

export default Tank;
