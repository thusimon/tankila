import * as CANNON from 'cannon-es';
import { RewardType, UserBody } from '../../../../client/src/types/Types';

class Reward {
  world: CANNON.World;
  body: UserBody;
  type: RewardType;
  rewardHitCallback: (reward: Reward, collisionTo: string) => void
  constructor(world: CANNON.World, type: RewardType, rewardHitCb: (reward: Reward, collisionTo: string) => void) {
    this.world = world;
    this.type = type;
    this.rewardHitCallback = rewardHitCb;
    const rewardShape = new CANNON.Sphere(0.5);
    this.body = new CANNON.Body({
        isTrigger: true
    });
    this.body.addShape(rewardShape);
    this.body.userData = `reward_`;

    this.collideCallBack = this.collideCallBack.bind(this);
    this.body.addEventListener('collide', this.collideCallBack);
  }

  collideCallBack(evt: any) {
    const collisionTo = evt.body.userData as string;
    this.rewardHitCallback(this, collisionTo);
  }

  remove() {
    this.body.removeEventListener('collide', this.collideCallBack);
    this.world.removeBody(this.body);
  }
}

export default Reward;