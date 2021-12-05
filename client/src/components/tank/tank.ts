import * as THREE from 'three';
import Shield from './shield';
import { MoveStatus, RewardStatus, RewardType } from '../../types/Types';

class Tank {
  model: THREE.Object3D;
  moveStatus: MoveStatus;
  tankId: string;
  tankName: string;
  tankNameMesh: THREE.Mesh;
  offsetY: number = 0.5;
  ready: boolean = false;
  curPos: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  curDir: number = 0;
  hits: number = 0;
  rewards: RewardStatus;
  shield: Shield;
  shieldOffsetY: number = 0.6;
  constructor(tankModel: THREE.Object3D, tankId: string, tankName: string) {
    this.model = tankModel;
    this.moveStatus = {
      forward: 0,
      direction: 0,
      speed: 0,
      rotation: 0
    }
    this.rewards = {
      [RewardType.TANK_SWIFT]: 0,
      [RewardType.TANK_SAMLL]: 0,
      [RewardType.TANK_INVULNERABLE]: 0,
      [RewardType.BULLTET_LARGE]: 0,
      [RewardType.BULLET_POWER]: 0,
    };
    this.tankId = tankId;
    this.tankName = tankName;
    this.tankNameMesh = new THREE.Mesh();
    this.shield = new Shield();
  }

  updateShield() {
    this.shield.updateTransparency(this.rewards[RewardType.TANK_INVULNERABLE]!);
  }

  small() {
    if (this.model.scale.length() > 0.5) {
      this.model.scale.set(0.15, 0.15, 0.15);
      this.shieldOffsetY = 0.3;
      this.offsetY = 0.25;
    }
  }

  normal() {
    if (this.model.scale.length() < 0.5) {
      this.model.scale.set(0.3, 0.3, 0.3);
      this.shieldOffsetY = 0.6;
      this.offsetY = 0.5;
    }
  }

  updateSize() {
    if (this.rewards[RewardType.TANK_SAMLL]! > 0) {
      this.small();
      this.shield.small();
    } else {
      this.normal();
      this.shield.normal()
    }
  }
}

export default Tank;
