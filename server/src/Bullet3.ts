import { Euler, Vector3 } from 'three';

class Bullet3 {
  position: Vector3;
  rotation: Euler;
  speed: number;
  isHit = false;
  idx: number;
  constructor(p0: Vector3, r0: Euler, spd: number, idx: number) {
    this.speed = spd;
    this.position = p0.clone();
    this.rotation = r0.clone();
    this.idx = idx;
  }
}

export default Bullet3;