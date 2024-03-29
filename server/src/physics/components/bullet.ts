import * as CANNON from 'cannon-es';
import Tank from './tank';
import { BULLET_SPEED } from '../../../../common/constants';
import {UserBody, CollisionEvent} from '../../types';

class Bullet {
  world: CANNON.World;
  body: UserBody;
  tankId: string;
  id = 0;
  bulletShape: CANNON.Sphere;
  bulletExplodeCallback: (id:string, bullet: Bullet, collisionTo: string) => void
  constructor(world: CANNON.World, tank: Tank, id: number, radius: number, bulletExplodeCb: (id: string, bullet: Bullet, collisionTo: string) => void) {
    this.world = world;
    this.tankId = tank.tankId;
    this.id = id;
    this.bulletExplodeCallback = bulletExplodeCb;
    this.bulletShape = new CANNON.Sphere(radius);
    this.body = new CANNON.Body({
        mass: 0.1,
        type: CANNON.Body.DYNAMIC,
        isTrigger: true
    })
    this.body.addShape(this.bulletShape)
    const tankBody = tank.body;
    const euler = new CANNON.Vec3();
    tankBody.quaternion.toEuler(euler);
    const eulerY = euler.y;
    const offsetX = BULLET_SPEED * Math.sin(eulerY);
    const offsetZ = BULLET_SPEED * Math.cos(eulerY);
    this.body.position.set(tankBody.position.x + 0.7 * Math.sin(eulerY),
      tankBody.position.y + 0.1,
      tankBody.position.z + 0.7 * Math.cos(eulerY));

    this.body.velocity = new CANNON.Vec3(offsetX, 0, offsetZ);
    this.body.userData = `bullet_${this.tankId}_${this.id}`;
    world.addBody(this.body)
    this.collideCallback = this.collideCallback.bind(this);
    this.body.addEventListener('collide', this.collideCallback);
  }

  collideCallback(evt: CollisionEvent): void {
    const collisionTo = evt.body.userData as string;
    this.bulletExplodeCallback(this.tankId, this, collisionTo);
  }

  remove(): void {
    this.body.removeShape(this.bulletShape);
    this.body.removeEventListener('collide', this.collideCallback);
    this.world.removeBody(this.body);
  }
}

export default Bullet;
