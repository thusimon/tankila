import { GameConfig, TankStatus, TankTransformStatus } from '../../data/Types';
import * as THREE from 'three';
import TankBase3 from './tankBase3';
import Message from '../message';
import { Scene, Vector3 } from 'three';

class TankMe3 extends TankBase3 {

  message: Message;
  transformStatus: TankTransformStatus;
  headDirection: Vector3;
  constructor(scene: Scene, config: GameConfig, message: Message, boundary: Vector3, initStatus?: TankStatus) {
    super(scene, config, boundary, initStatus);
    this.message = message;
    this.transformStatus = {direction: 0, rotation: 0};
    this.speedMove = 20;
    this.speedRotate = 1;
    this.speedBullet = 80;
    this.bullets = [];
    this.debug = false;
    this.headDirection = new Vector3(1, 0, 0);
  }

  sendMoveForward(startFlag: boolean): void {
    this.message.sendMessage(`fwd,${startFlag ? '1' : '0'}`);
  }
  sendMoveBackword(startFlag: boolean): void {
    this.message.sendMessage(`bwd,${startFlag ? '1' : '0'}`);
  }
  sendRotateLeft(startFlag: boolean): void {
    this.message.sendMessage(`rl,${startFlag ? '1' : '0'}`);
  }
  sendRotateRight(startFlag: boolean): void {
    this.message.sendMessage(`rr,${startFlag ? '1' : '0'}`);
  }

  moveForward(): void {
    this.transformStatus.direction = 1;
  }

  isMovingForward(): boolean {
    return this.transformStatus.direction === 1;
  }

  moveBackward(): void {
    this.transformStatus.direction = -1;
  }

  isMovingBackward(): boolean {
    return this.transformStatus.direction === -1;
  }

  stopMoving(): void {
    this.transformStatus.direction = 0;
  }

  isMovingStop(): boolean {
    return this.transformStatus.direction === 0;
  }

  rotateRight(): void {
    this.transformStatus.rotation = -1;
  }

  isRotatingRight(): boolean {
    return this.transformStatus.rotation === -1;
  }

  rotateLeft(): void {
    this.transformStatus.rotation = 1;
  }

  isRotatingLeft(): boolean {
    return this.transformStatus.rotation === 1;
  }

  stopRotating(): void {
    this.transformStatus.rotation = 0;
  }

  isRotatingStop(): boolean {
    return this.transformStatus.rotation === 0;
  }

  update(deltaTime: number): void {
    if (this.transformStatus.rotation != 0) {
      const rotationDelta = this.transformStatus.rotation * this.speedRotate * deltaTime;
      this.mesh.rotateZ(rotationDelta);
    }
    if (this.transformStatus.direction != 0) {
      const speed = this.transformStatus.direction * this.speedMove * deltaTime;
      const axis = new THREE.Vector3(1, 0, 0);
      const lastPosition = this.mesh.position.clone();
      this.mesh.translateOnAxis(axis, speed);
      if (!this.isTankInBoundary()) {
        this.mesh.position.set(lastPosition.x, lastPosition.y, lastPosition.z);
      }
    }
    this.bullets.forEach(bullet => {
      bullet.update(deltaTime, this.boundary);
    });
    this.bullets = this.bullets.filter(bullet => !bullet.isHit);
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