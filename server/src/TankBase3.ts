import { TankTransformStatus } from '../../client/src/data/Types';
import Bullet3 from './Bullet3';
import { Vector3, Euler } from 'three';

class TankBase3 {
  speedMove: number = 0;
  speedRotate: number = 0;
  speedBullet: number = 0;
  id: string;
  bullets: {[key: string]: Bullet3};
  transformStatus: TankTransformStatus;
  boundary: Vector3;
  position: Vector3;
  rotation: Euler;
  constructor(id: string, pos: Vector3, rot: Euler) {
    this.id = id;
    this.bullets = {};
    this.transformStatus = {
      direction: 0,
      rotation: 0
    }
    this.boundary = new Vector3(0, 0, 0);
    this.position = pos;
    this.rotation = rot;
  }
  
  isMovingForward(): boolean {
    return this.transformStatus.direction === 1;
  }

  moveForward(): void {
    this.transformStatus.direction = 1;
  }

  isMovingBackward(): boolean {
    return this.transformStatus.direction === -1;
  }

  moveBackward(): void {
    this.transformStatus.direction = -1;
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
}

export default TankBase3;