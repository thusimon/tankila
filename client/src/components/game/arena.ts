import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import {UserBody} from '../../types/Types'
import {isColideWith} from '../../utils/collision'

class Arena {
  constructor(scene: THREE.Scene, world: CANNON.World) {
    const groundMaterial: CANNON.Material = new CANNON.Material('groundMaterial');
    const wallMaterial: CANNON.Material = new CANNON.Material('wallMaterial');
    groundMaterial.friction = 0.5
    groundMaterial.restitution = 0.25
    wallMaterial.friction = 0.5
    wallMaterial.restitution = 0.25

    // add ground
    const groundShape = new CANNON.Box(new CANNON.Vec3(100, 1, 100))
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
    const wallTopShape = new CANNON.Box(new CANNON.Vec3(100, 1, 1))
    const wallTopBody: UserBody = new CANNON.Body({
      mass: 0,
      material: wallMaterial,
      type: CANNON.Body.STATIC
    })
    wallTopBody.addShape(wallTopShape);
    wallTopBody.position.x = 0;
    wallTopBody.position.y = 1;
    wallTopBody.position.z = 100;
    wallTopBody.userData = 'wall-top'
    world.addBody(wallTopBody);

    // add bottom wall
    const wallBottomShape = new CANNON.Box(new CANNON.Vec3(100, 1, 1))
    const wallBottomBody: UserBody = new CANNON.Body({
      mass: 0,
      material: wallMaterial,
      type: CANNON.Body.STATIC
    })
    wallBottomBody.addShape(wallBottomShape);
    wallBottomBody.position.x = 0;
    wallBottomBody.position.y = 1;
    wallBottomBody.position.z = -100;
    wallBottomBody.userData = 'wall-bottom'
    world.addBody(wallBottomBody);

    // add wall left
    const wallLeftShape = new CANNON.Box(new CANNON.Vec3(1, 1, 100))
    const wallLeftBody: UserBody = new CANNON.Body({
      mass: 0,
      material: wallMaterial,
      type: CANNON.Body.STATIC,
    })
    wallLeftBody.addShape(wallLeftShape);
    wallLeftBody.position.x = -100;
    wallLeftBody.position.y = 1;
    wallLeftBody.position.z = 0;
    wallLeftBody.userData = 'wall-left'
    world.addBody(wallLeftBody);

    // add wall right
    const wallRightShape = new CANNON.Box(new CANNON.Vec3(1, 1, 100))
    const wallRightBody: UserBody = new CANNON.Body({
      mass: 0,
      material: wallMaterial,
      type: CANNON.Body.STATIC
    })
    wallRightBody.addShape(wallRightShape);
    wallRightBody.position.x = 100;
    wallRightBody.position.y = 1;
    wallRightBody.position.z = 0;
    wallRightBody.userData = 'wall-right'
    world.addBody(wallRightBody);

    const groundTexture = new THREE.TextureLoader().load('./textures/grass_ground.jpg')
    const material = new THREE.MeshBasicMaterial({
      map: groundTexture
    });

    const planeGeometry = new THREE.PlaneGeometry(200, 200, 50, 50)

    const plane = new THREE.Mesh(planeGeometry, material)

    groundTexture.minFilter = THREE.NearestMipmapLinearFilter
    groundTexture.magFilter = THREE.NearestMipmapLinearFilter
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(32, 32); 

    plane.rotateX(-Math.PI / 2)
    scene.add(plane)

    const skyGeo = new THREE.SphereGeometry(200, 20, 20); 
    const skySphereLoader  = new THREE.TextureLoader()
    const skyTexture = skySphereLoader.load('./textures/sky.jpg');
    const skyMaterial = new THREE.MeshPhongMaterial({ 
      map: skyTexture,
    });
    const sky = new THREE.Mesh(skyGeo, skyMaterial);
    sky.material.side = THREE.BackSide;
    sky.position.y = -2
    scene.add(sky);
  }
}

export default Arena;
