import * as CANNON from 'cannon-es';
import { RewardType } from '../../../../client/src/types/Types';

class Reward {
  id: number = 0;
  body: CANNON.Body;
  type: RewardType;
  rewardHitCallback: (reward: Reward, collisionTo: string) => void
  constructor(id: number, type: RewardType, rewardHitCb: (reward: Reward, collisionTo: string) => void) {
    this.id = id;
    this.type = type;
    this.rewardHitCallback = rewardHitCb;
    const slipperyMaterial: CANNON.Material = new CANNON.Material('slipperyMaterial');
    slipperyMaterial.friction = 0.15;
    slipperyMaterial.restitution = 0.25;
    const rewardShape = new CANNON.Sphere(0.5);
    this.body = new CANNON.Body({
        mass: 0.1,
        material: slipperyMaterial,
        type: CANNON.Body.DYNAMIC,
        isTrigger: true
    });
    this.body.addShape(rewardShape);

    this.body.addEventListener('collide', (evt: any) => {
      const collisionTo = evt.body.userData as string;
      this.rewardHitCallback(this, collisionTo);
    });
  }
}

export default Reward;
