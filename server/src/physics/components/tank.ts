import * as CANNON from 'cannon-es';
import { MoveStatus, UserBody } from '../../../../client/src/types/Types';

class Tank {
  body: UserBody;
  moveStatus: MoveStatus;
  tankId: string;
  tankName: string;
  constructor(tankId: string, tankName: string) {
    this.moveStatus = {
      forward: 0,
      rotation: 0,
      speed: 0,
      direction: 0
    }
    const sphereShape = new CANNON.Sphere(0.5)
    const slipperyMaterial: CANNON.Material = new CANNON.Material('slipperyMaterial');
    slipperyMaterial.friction = 0.15
    slipperyMaterial.restitution = 0.25
    this.body = new CANNON.Body({
        mass: 1,
        material: slipperyMaterial,
        type: CANNON.Body.DYNAMIC
    })
    this.body.addShape(sphereShape)
    this.body.userData = `tank_${tankId}_${tankName}`;
    
    this.tankId = tankId;
    this.tankName = tankName;
  }
}

export default Tank;
