import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import {BULLET_SPEED} from '../../utils/constants';
import { UserBody } from '../../types/Types';
import Explosion from './explosion';

class Bullet {
  bulletBody: UserBody;
  bulletSphere: THREE.Mesh;
  scene: THREE.Scene
  world: CANNON.World
  constructor(scene: THREE.Scene, world: CANNON.World, tank: THREE.Object3D, tankId: string) {
    this.scene = scene;
    this.world = world;
    const slipperyMaterial: CANNON.Material = new CANNON.Material('slipperyMaterial');
    slipperyMaterial.friction = 0.15
    slipperyMaterial.restitution = 0.25
    const bulletShape = new CANNON.Sphere(0.08)
    this.bulletBody = new CANNON.Body({
        mass: 0.1,
        material: slipperyMaterial,
        type: CANNON.Body.DYNAMIC,
        isTrigger: true
    })
    this.bulletBody.userData = `tank_bullet_${tankId}`;
    this.bulletBody.addShape(bulletShape)
    const eulerY = tank.rotation.z;
    const offsetX = BULLET_SPEED * Math.sin(eulerY);
    const offsetZ = BULLET_SPEED * Math.cos(eulerY);
    this.bulletBody.position.x = tank.position.x + 0.7 * Math.sin(eulerY)
    this.bulletBody.position.y = tank.position.y + 0.5
    this.bulletBody.position.z = tank.position.z + 0.7 * Math.cos(eulerY)

    this.bulletBody.velocity = new CANNON.Vec3(offsetX, 0, offsetZ);
    world.addBody(this.bulletBody)

    const bulletGeo = new THREE.SphereGeometry(0.1, 8, 8); 
    const bulletMaterial = new THREE.MeshBasicMaterial({ 
      color: new THREE.Color(255, 255, 0)
    });
    this.bulletSphere = new THREE.Mesh(bulletGeo, bulletMaterial);

    scene.add(this.bulletSphere);

    this.bulletBody.addEventListener('collide', (evt: any) => {
      console.log(`yoyo clide with ${evt.body.userData}`);
      this.bulletExplode();
      //this.removeBullet();
    })
  }

  removeBullet() {
    this.world.removeBody(this.bulletBody);
    this.scene.remove(this.bulletSphere);
  }

  bulletExplode() {
    const explosions: Explosion[] = [
      new Explosion(new THREE.Color(0xffff00), this.scene)
    ];
    explosions.forEach((explosion) => {
      explosion.explode(new THREE.Vector3(this.bulletBody.position.x, this.bulletBody.position.y, this.bulletBody.position.z))
    })
  }

  updateSphere() {
    this.bulletSphere.position.set(
      this.bulletBody.position.x,
      this.bulletBody.position.y,
      this.bulletBody.position.z
    );
  }
}

export default Bullet;
