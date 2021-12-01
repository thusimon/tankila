import * as THREE from 'three';
import { REWARD_DURATION } from '../../../../server/src/constants';

class Shield {
  model: THREE.Mesh;
  scale: number = 1;
  constructor() {
    const geo = new THREE.SphereGeometry(0.6, 32, 32);
    this.model = new THREE.Mesh(geo);
  }
  updateTransparency(timeLeft: number) {
    this.model.material = new THREE.MeshBasicMaterial({
      color: 0x99004C,
      opacity: timeLeft / REWARD_DURATION * 0.5,
      transparent: true
    });
  }
}

export default Shield;
