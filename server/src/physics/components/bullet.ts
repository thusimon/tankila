import * as CANNON from 'cannon-es';
import Tank from './tank';
import { BULLET_SPEED } from '../../../../client/src/utils/constants';

class Bullet {
  world: CANNON.World;
  body: CANNON.Body;
  removeFlag: boolean = false;
  tankId: string;
  bulletExplodeCallback: (id:string, bullet: Bullet) => void
  constructor(world: CANNON.World, tank: Tank, bulletExplodeCb: (id: string, bullet: Bullet) => void) {
    this.world = world;
    this.tankId = tank.tankId;
    this.bulletExplodeCallback = bulletExplodeCb;
    const slipperyMaterial: CANNON.Material = new CANNON.Material('slipperyMaterial');
    slipperyMaterial.friction = 0.15
    slipperyMaterial.restitution = 0.25
    const bulletShape = new CANNON.Sphere(0.08)
    this.body = new CANNON.Body({
        mass: 0.1,
        material: slipperyMaterial,
        type: CANNON.Body.DYNAMIC,
        isTrigger: true
    })
    this.body.addShape(bulletShape)
    const tankBody = tank.body;
    const euler = new CANNON.Vec3();
    tankBody.quaternion.toEuler(euler);
    const eulerY = euler.y;
    const offsetX = BULLET_SPEED * Math.sin(eulerY);
    const offsetZ = BULLET_SPEED * Math.cos(eulerY);
    this.body.position.set(tankBody.position.x + 0.7 * Math.sin(eulerY),
      tankBody.position.y + 0.5,
      tankBody.position.z + 0.7 * Math.cos(eulerY));

    this.body.velocity = new CANNON.Vec3(offsetX, 0, offsetZ);
    world.addBody(this.body)

    this.body.addEventListener('collide', (evt: any) => {
      this.bulletExplodeCallback(this.tankId, this);
      //this.bulletsToRemove.push(this);
      //this.bulletExplode();
    })
  }

  // removeBullet() {
  //   this.world.removeBody(this.bulletBody);
  //   this.scene.remove(this.bulletSphere);
  //   this.removeFlag = true;
  // }

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