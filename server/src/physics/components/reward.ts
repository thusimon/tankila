import * as CANNON from 'cannon-es';
import { RewardType } from '../../../../common/types';
import { UserBody, CollisionEvent } from '../../types'; 

class Reward {
  world: CANNON.World;
  body: UserBody;
  type: RewardType;
  rewardShape: CANNON.Sphere;
  rewardHitCallback: (reward: Reward, collisionTo: string) => void
  constructor(world: CANNON.World, type: RewardType, rewardHitCb: (reward: Reward, collisionTo: string) => void) {
    this.world = world;
    this.type = type;
    this.rewardHitCallback = rewardHitCb;
    this.rewardShape = new CANNON.Sphere(0.5);
    this.body = new CANNON.Body({
        isTrigger: true
    });
    this.body.addShape(this.rewardShape);
    this.body.userData = `reward_`;

    this.collideCallBack = this.collideCallBack.bind(this);
    this.body.addEventListener('collide', this.collideCallBack);
  }

  collideCallBack(evt: CollisionEvent): void {
    const collisionTo = evt.body.userData as string;
    this.rewardHitCallback(this, collisionTo);
  }

  remove(): void {
    this.body.removeShape(this.rewardShape);
    this.body.removeEventListener('collide', this.collideCallBack);
    this.world.removeBody(this.body);
  }
}

export default Reward;
