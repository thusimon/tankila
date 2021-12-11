import * as CANNON from 'cannon-es';
import {UserBody} from '../../types';
import {ARENA_WIDTH, ARENA_HEIGHT} from '../../../../common/constants';

class Arena {
  width: number;
  height: number;
  constructor(world: CANNON.World) {
    this.width = ARENA_WIDTH;
    this.height = ARENA_HEIGHT;
    const groundMaterial: CANNON.Material = new CANNON.Material('groundMaterial');
    const wallMaterial: CANNON.Material = new CANNON.Material('wallMaterial');
    groundMaterial.friction = 0.5
    groundMaterial.restitution = 0.25
    wallMaterial.friction = 0.5
    wallMaterial.restitution = 0.25

    // add ground
    const groundShape = new CANNON.Box(new CANNON.Vec3(ARENA_WIDTH, 1, ARENA_HEIGHT))
    const groundBody: UserBody = new CANNON.Body({
      mass: 0,
      material: groundMaterial,
      type: CANNON.Body.STATIC
    })
    groundBody.addShape(groundShape)
    groundBody.position.x = 0
    groundBody.position.y = -1
    groundBody.position.z = 0
    groundBody.userData = 'ground'
    world.addBody(groundBody)

    // add walls
    // add top wall
    const wallTopShape = new CANNON.Box(new CANNON.Vec3(ARENA_WIDTH, 1, 1))
    const wallTopBody: UserBody = new CANNON.Body({
      mass: 0,
      material: wallMaterial,
      type: CANNON.Body.STATIC
    })
    wallTopBody.addShape(wallTopShape);
    wallTopBody.position.x = 0;
    wallTopBody.position.y = 1;
    wallTopBody.position.z = ARENA_HEIGHT;
    wallTopBody.userData = 'wall-top'
    world.addBody(wallTopBody);

    // add bottom wall
    const wallBottomShape = new CANNON.Box(new CANNON.Vec3(ARENA_WIDTH, 1, 1))
    const wallBottomBody: UserBody = new CANNON.Body({
      mass: 0,
      material: wallMaterial,
      type: CANNON.Body.STATIC
    })
    wallBottomBody.addShape(wallBottomShape);
    wallBottomBody.position.x = 0;
    wallBottomBody.position.y = 1;
    wallBottomBody.position.z = -ARENA_HEIGHT;
    wallBottomBody.userData = 'wall-bottom'
    world.addBody(wallBottomBody);

    // add wall left
    const wallLeftShape = new CANNON.Box(new CANNON.Vec3(1, 1, ARENA_HEIGHT))
    const wallLeftBody: UserBody = new CANNON.Body({
      mass: 0,
      material: wallMaterial,
      type: CANNON.Body.STATIC,
    })
    wallLeftBody.addShape(wallLeftShape);
    wallLeftBody.position.x = -ARENA_WIDTH;
    wallLeftBody.position.y = 1;
    wallLeftBody.position.z = 0;
    wallLeftBody.userData = 'wall-left'
    world.addBody(wallLeftBody);

    // add wall right
    const wallRightShape = new CANNON.Box(new CANNON.Vec3(1, 1, ARENA_HEIGHT))
    const wallRightBody: UserBody = new CANNON.Body({
      mass: 0,
      material: wallMaterial,
      type: CANNON.Body.STATIC
    })
    wallRightBody.addShape(wallRightShape);
    wallRightBody.position.x = ARENA_WIDTH;
    wallRightBody.position.y = 1;
    wallRightBody.position.z = 0;
    wallRightBody.userData = 'wall-right'
    world.addBody(wallRightBody);
  }
}

export default Arena;
