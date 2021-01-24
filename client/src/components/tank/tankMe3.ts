import { TankStatus3 } from '../../data/Types';
import TankBase3 from './tankBase3';
import Message from '../message';
import { Scene, Vector3 } from 'three';

class TankMe3 extends TankBase3 {

  message: Message;
  headDirection: Vector3;
  constructor(scene: Scene, id: string, message: Message, boundary: Vector3, initStatus: TankStatus3) {
    super(scene, id, initStatus);
    this.message = message;
    this.boundary = boundary;
    this.speedMove = 20;
    this.speedRotate = 1;
    this.speedBullet = 80;
    this.debug = false;
    this.headDirection = new Vector3(1, 0, 0);
  }

  moveForward(): void {
    if (this.transformStatus.direction != 1) {
      // direction changes
      this.message.sendMessage(`dir,1,${Date.now()}`);
    }
    super.moveForward();
  }

  moveBackward(): void {
    if (this.transformStatus.direction != -1) {
      // direction changes
      this.message.sendMessage(`dir,-1,${Date.now()}`);
    }
    super.moveBackward();
  }

  stopMoving(): void {
    if (this.transformStatus.direction != 0) {
      // direction changes
      this.message.sendMessage(`dir,0,${Date.now()}`);
    }
    super.stopMoving();
  }

  rotateRight(): void {
    if (this.transformStatus.rotation != -1) {
      // rotation changes
      this.message.sendMessage(`rot,-1,${Date.now()}`);
    }
    super.rotateRight();
  }

  rotateLeft(): void {
    if (this.transformStatus.rotation != 1) {
      // rotation changes
      this.message.sendMessage(`rot,1,${Date.now()}`);
    }
    super.rotateLeft();
  }

  stopRotating(): void {
    if (this.transformStatus.rotation != 0) {
      // rotation changes
      this.message.sendMessage(`rot,0,${Date.now()}`);
    }
    super.stopRotating();
  }

  shoot(): void {
    this.message.sendMessage(`blt3,${Date.now()}`);
  }

  isTankInBoundary(): boolean {
    return this.mesh.position.x < this.boundary.x && this.mesh.position.x > -this.boundary.x
      && this.mesh.position.y < this.boundary.y && this.mesh.position.y > -this.boundary.y;
  }

  updateBoundary(boundary: Vector3): void {
    this.boundary = boundary;
  }

}

export default TankMe3;