import * as CANNON from 'cannon-es';
import { RewardType, UserBody } from '../../../../client/src/types/Types';

class Reward {
  id: number = 0;
  body: UserBody;
  type: RewardType;
  rewardHitCallback: (reward: Reward, collisionTo: string) => void
  constructor(id: number, type: RewardType, rewardHitCb: (reward: Reward, collisionTo: string) => void) {
    this.id = id;
    this.type = type;
    this.rewardHitCallback = rewardHitCb;
    const rewardShape = new CANNON.Sphere(0.5);
    this.body = new CANNON.Body({
        isTrigger: true
    });
    this.body.addShape(rewardShape);
    this.body.userData = `reward_${id}`;

    this.body.addEventListener('collide', (evt: any) => {
      const collisionTo = evt.body.userData as string;
      this.rewardHitCallback(this, collisionTo);
    });
  }
}

export default Reward;
