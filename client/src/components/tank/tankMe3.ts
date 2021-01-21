import { BulletData, GameConfig, TankStatus, TankTransformStatus } from '../../data/Types';
import * as THREE from 'three';
import TankBase3 from './tankBase3';
import Bullet3 from '../bullet/bullet3';
import Message from '../message';
import { Euler, Scene, Vector3 } from 'three';

class TankMe3 extends TankBase3 {

  message: Message;
  transformStatus: TankTransformStatus;
  headDirection: Vector3;
  boundary: Vector3;
  constructor(scene: Scene, config: GameConfig, message: Message, boundary: Vector3, initStatus?: TankStatus) {
    super(scene, config, initStatus);
    this.message = message;
    this.transformStatus = {direction: 0, rotation: 0};
    this.boundary = boundary;
    this.speedMove = 20;
    this.speedRotate = 1;
    this.speedBullet = 80;
    this.bullets = [];
    this.debug = false;
    this.headDirection = new Vector3(1, 0, 0);
  }

  moveForward(): void {
    if (this.transformStatus.direction != 1) {
      // direction changes
      this.message.sendMessage(`dir,1,${Date.now()}`);
    }
    this.transformStatus.direction = 1;
  }

  isMovingForward(): boolean {
    return this.transformStatus.direction === 1;
  }

  moveBackward(): void {
    if (this.transformStatus.direction != -1) {
      // direction changes
      this.message.sendMessage(`dir,-1,${Date.now()}`);
    }
    this.transformStatus.direction = -1;
  }

  isMovingBackward(): boolean {
    return this.transformStatus.direction === -1;
  }

  stopMoving(): void {
    if (this.transformStatus.direction != 0) {
      // direction changes
      this.message.sendMessage(`dir,0,${Date.now()}`);
    }
    this.transformStatus.direction = 0;
  }

  isMovingStop(): boolean {
    return this.transformStatus.direction === 0;
  }

  rotateRight(): void {
    if (this.transformStatus.rotation != -1) {
      // rotation changes
      this.message.sendMessage(`rot,-1,${Date.now()}`);
    }
    this.transformStatus.rotation = -1;
  }

  isRotatingRight(): boolean {
    return this.transformStatus.rotation === -1;
  }

  rotateLeft(): void {
    if (this.transformStatus.rotation != 1) {
      // rotation changes
      this.message.sendMessage(`rot,1,${Date.now()}`);
    }
    this.transformStatus.rotation = 1;
  }

  isRotatingLeft(): boolean {
    return this.transformStatus.rotation === 1;
  }

  stopRotating(): void {
    if (this.transformStatus.rotation != 0) {
      // rotation changes
      this.message.sendMessage(`rot,0,${Date.now()}`);
    }
    this.transformStatus.rotation = 0;
  }

  isRotatingStop(): boolean {
    return this.transformStatus.rotation === 0;
  }

  shoot(): void {
    this.message.sendMessage(`blt3,${Date.now()}`);
    //const cannonPos = this.mesh.position.clone().add(new Vector3(10, 0, 1.1).applyEuler(this.mesh.rotation));
    //const bullet = new Bullet3(this.scene, this.id, cannonPos, this.mesh.rotation, this.speedBullet);
    //this.bullets.push(bullet);
  }

  update(deltaTime: number): void {
    // if (this.transformStatus.rotation != 0) {
    //   const rotationDelta = this.transformStatus.rotation * this.speedRotate * deltaTime;
    //   this.mesh.rotateZ(rotationDelta);
    // }
    // if (this.transformStatus.direction != 0) {
    //   const speed = this.transformStatus.direction * this.speedMove * deltaTime;
    //   const axis = new THREE.Vector3(1, 0, 0);
    //   const lastPosition = this.mesh.position.clone();
    //   this.mesh.translateOnAxis(axis, speed);
    //   if (!this.isTankInBoundary()) {
    //     this.mesh.position.set(lastPosition.x, lastPosition.y, lastPosition.z);
    //   }
    // }
    // this.bullets.forEach(bullet => {
    //   bullet.update(deltaTime, this.boundary);
    // });
    // this.bullets = this.bullets.filter(bullet => !bullet.isHit);
  }

  updatePosByServer(x: number, y: number, r: number) {
    this.mesh.rotation.z = r;
    this.mesh.position.x = x;
    this.mesh.position.y = y;
  }

  updateBulletsByServer(bullets: BulletData[]) {
    // destory all the current bullets
    this.bullets.forEach(b => {
      b.destory();
    });
    this.bullets = [];
    bullets.forEach(blt => {
      const bulletPos = new Vector3(blt.pos.x, blt.pos.y, blt.pos.z);
      const bulletRot = new Euler(0, 0, blt.rot);
      const bullet = new Bullet3(this.scene, this.id, bulletPos, bulletRot, this.speedBullet);
      this.bullets.push(bullet);
    });
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