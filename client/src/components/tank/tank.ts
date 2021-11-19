import * as THREE from 'three';
import { MoveStatus } from '../../types/Types';

class Tank {
  model: THREE.Object3D;
  moveStatus: MoveStatus;
  tankId: string;
  tankName: string;
  tankNameMesh: THREE.Mesh;
  ready: boolean = false;
  curPos: THREE.Vector3 = new THREE.Vector3(0,0,0);
  curDir: number = 0;
  hits: number = 0;
  constructor(tankModel: THREE.Object3D, tankId: string, tankName: string) {
    this.model = tankModel;
    this.moveStatus = {
      forward: 0,
      direction: 0,
      speed: 0,
      rotation: 0
    }
    this.tankId = tankId;
    this.tankName = tankName;
    this.tankNameMesh = new THREE.Mesh();
  }
}

export default Tank;
