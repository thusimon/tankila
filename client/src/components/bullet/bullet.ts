import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import {BULLET_SPEED} from '../../utils/constants';
import { UserBody } from '../../types/Types';
import Explosion from './explosion';
import Tank from '../tank/tank';

class Bullet {
  model: THREE.Mesh;
  scene: THREE.Scene
  //bulletsToRemove: Bullet[];
  //explosions: Explosion[] = [];
  removeFlag: boolean = false;
  constructor(scene: THREE.Scene, x:number, y: number, z: number) {
    this.scene = scene;
    const bulletGeo = new THREE.SphereGeometry(0.1, 8, 8); 
    const bulletMaterial = new THREE.MeshBasicMaterial({ 
      color: new THREE.Color(255, 255, 0)
    });
    this.model = new THREE.Mesh(bulletGeo, bulletMaterial);
    this.model.position.set(x, y, z);
  }

  removeBullet() {
    this.scene.remove(this.model);
    this.removeFlag = true;
  }

  addBullet() {
    this.scene.add(this.model);
    this.removeFlag = false;
  }

  // bulletExplode() {
  //   const explosion = new Explosion(new THREE.Color(0xffff00), this.scene);
  //   this.explosions.push(explosion);
  //   explosion.explode(new THREE.Vector3(this.bulletBody.position.x, this.bulletBody.position.y, this.bulletBody.position.z));
  // }

  // updateSphere() {
  //   this.bulletSphere.position.set(
  //     this.bulletBody.position.x,
  //     this.bulletBody.position.y,
  //     this.bulletBody.position.z
  //   );
  // }
}

export default Bullet;
