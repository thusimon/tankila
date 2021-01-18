import { GameConfig, TankStatus, TankTransformStatus } from '../../data/Types';
import * as THREE from 'three';
import p5 from 'p5';
import Point from '../../data/Point';
import Rect from '../../data/Rect';
import Bullet from '../bullet';
import TankBase3 from './tankBase3';
import Message from '../message';
import { isRectInBound } from '../utils/collision';
import { Clock, Scene, Vector3 } from 'three';

class TankMe3 extends TankBase3 {

  message: Message;
  transformStatus: TankTransformStatus;
  headDirection: Vector3;
  constructor(scene: Scene, config: GameConfig, message: Message, clock: Clock, initStatus?: TankStatus) {
    super(scene, config, clock, initStatus);
    this.message = message;
    this.transformStatus = {direction: 0, rotation: 0};
    this.speedMove = 80;
    this.speedRotate = 1;
    this.speedBullet = 500;
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

  moveForward() {
    this.transformStatus.direction = 1;
  }

  isMovingForward() {
    return this.transformStatus.direction === 1;
  }

  moveBackward() {
    this.transformStatus.direction = -1;
  }

  isMovingBackward() {
    return this.transformStatus.direction === -1;
  }

  stopMoving() {
    this.transformStatus.direction = 0;
  }

  isMovingStop() {
    return this.transformStatus.direction === 0;
  }

  rotateRight() {
    this.transformStatus.rotation = -1;
  }

  isRotatingRight() {
    return this.transformStatus.rotation === -1;
  }

  rotateLeft() {
    this.transformStatus.rotation = 1;
  }

  isRotatingLeft() {
    return this.transformStatus.rotation === 1;
  }

  stopRotating() {
    this.transformStatus.rotation = 0;
  }

  isRotatingStop() {
    return this.transformStatus.rotation === 0;
  }

  update() {
    const deltaTime = this.clock.getDelta();
    const rotationDelta = this.transformStatus.rotation * this.speedRotate * deltaTime;
    this.body.rotateZ(rotationDelta);
    const speed = this.transformStatus.direction * this.speedMove * deltaTime;
    const axis = new THREE.Vector3(1, 0, 0);
    this.body.translateOnAxis(axis, speed);
  }

}

export default TankMe3;