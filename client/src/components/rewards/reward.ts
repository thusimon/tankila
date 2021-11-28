import * as THREE from 'three';
import { RewardType } from '../../types/Types';
import { getRewardColor, getRewardText } from '../../utils/status';

class Reward {
  type: RewardType
  model: THREE.Object3D;
  constructor(type: RewardType, position: THREE.Vector3) {
    this.type = type;
    const geo = new THREE.BoxGeometry(1, 1, 1);
    const texture = this.getTexture();
    const material = new THREE.MeshBasicMaterial({
      map: texture,
    });
    const rewardModel = new THREE.Mesh(geo, material);
    rewardModel.position.copy(position);
    this.model = rewardModel;
  }
  getTexture() {
    const ctx = document.createElement('canvas').getContext('2d')!;
    ctx.canvas.width = 256;
    ctx.canvas.height = 256;
    ctx.fillStyle = getRewardColor(this.type);
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#FFF';
    ctx.font = '220px serif';
    const content = getRewardText(this.type);
    ctx.fillText(content, 10, 190);
    return new THREE.CanvasTexture(ctx.canvas);
  }
}

export default Reward;
