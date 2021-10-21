import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { MoveStatus } from '../../types/Types';
import {updateMoveStatus} from '../../utils/tankStatus';
import {UserBody} from '../../types/Types';

class Tank {
  model: THREE.Object3D;
  body: UserBody;
  moveStatus: MoveStatus;
  tankId: string;
  tankName: string;
  constructor(tankModel: THREE.Object3D, tankId: string, tankName: string) {
    this.model = tankModel;
    this.moveStatus = {
      forwardStatus: 0,
      rotationstatus: 0,
      keyW: 0,
      keyS: 0,
      keyA: 0,
      keyD: 0,
      speed: 0,
      rotation: 0
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
    this.body.userData = 'tank_body'
    this.body.position.x = 0
    this.body.position.y = 0.5
    this.body.position.z = 0
    
    this.tankId = tankId;
    this.tankName = tankName;
  }
}

export default Tank;
