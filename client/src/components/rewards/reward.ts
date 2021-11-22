import * as THREE from 'three';
import { RewardType } from '../../types/Types';

class Reward {
  id: number;
  type: RewardType
  model: THREE.Object3D;
  constructor(id: number, type: RewardType, position: THREE.Vector3) {
    this.id = id;
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
    ctx.fillStyle = this.getColor();
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#FFF';
    ctx.font = '220px serif';
    const content = this.getText();
    ctx.fillText(content, 10, 190);
    return new THREE.CanvasTexture(ctx.canvas);
  }
  getColor() {
    switch (this.type) {
      case RewardType.TANK_SWIFT: {
        return '#FF00FF';
      }
      case RewardType.TANK_SAMLL: {
        return '#FFC400';
      }
      case RewardType.TANK_INVULNERABLE: {
        return '#99004C';
      }
      case RewardType.BULLTET_LARGE: {
        return '#0000FF';
      }
      case RewardType.BULLET_POWER: {
        return '#FF0000';
      }
      default: {
        return '#000000';
      }
    }
  }
  getText() {
    switch (this.type) {
      case RewardType.TANK_SWIFT: {
        return '🚀';
      }
      case RewardType.TANK_SAMLL: {
        return '🐁';
      }
      case RewardType.TANK_INVULNERABLE: {
        return '🛡️';
      }
      case RewardType.BULLTET_LARGE: {
        return '⚔️';
      }
      case RewardType.BULLET_POWER: {
        return '🔥';
      }
      default: {
        return '';
      }
    }
  }
}

export default Reward;
