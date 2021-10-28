import * as THREE from 'three';
import { MoveStatus } from '../../types/Types';

class Tank {
  model: THREE.Object3D;
  moveStatus: MoveStatus;
  tankId: string;
  tankName: string;
  ready: boolean = false;
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
    this.tankId = tankId;
    this.tankName = tankName;
  }
}

export default Tank;
