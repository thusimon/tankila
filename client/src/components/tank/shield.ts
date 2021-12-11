import * as THREE from 'three';
import { REWARD_DURATION } from '../../../../common/constants';

const QUARTER_DURATION = REWARD_DURATION / 4;

class Shield {
  model: THREE.Mesh;
  constructor() {
    const geo = new THREE.SphereGeometry(0.6, 32, 32);
    this.model = new THREE.Mesh(geo);
  }

  updateTransparency(timeLeft: number): void {
    const leftCap = (timeLeft < QUARTER_DURATION && timeLeft > 0) ? QUARTER_DURATION : timeLeft; 
    this.model.material = new THREE.MeshBasicMaterial({
      color: 0x99004C,
      opacity: leftCap / REWARD_DURATION * 0.5,
      transparent: true
    });
  }

  small(): void {
    if (this.model.scale.length() > 1) {
      this.model.scale.set(0.5, 0.5, 0.5);
    }
  }

  normal(): void {
    if (this.model.scale.length() < 1) {
      this.model.scale.set(1, 1, 1);
    }
  }

}

export default Shield;
