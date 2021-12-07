import * as THREE from 'three';

class Arena {
  constructor(scene: THREE.Scene) {
    const wallTexture = new THREE.TextureLoader().load('./textures/brickwallmoss.jpg');
    wallTexture.minFilter = THREE.NearestMipmapLinearFilter;
    wallTexture.magFilter = THREE.NearestMipmapLinearFilter;
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(100, 1);
    const wallMaterial = new THREE.MeshBasicMaterial({
      map: wallTexture
    });

    // add walls
    const wallGeo = new THREE.PlaneGeometry(200, 2);
    // add top wall
    const wallTopMesh = new THREE.Mesh(wallGeo, wallMaterial)
    wallTopMesh.position.set(0, 1, -100);
    scene.add(wallTopMesh);
    // add bottom wall
    const wallBottomMesh = new THREE.Mesh(wallGeo, wallMaterial)
    wallBottomMesh.position.set(0, 1, 100);
    wallBottomMesh.rotateY(Math.PI)
    scene.add(wallBottomMesh);
    // add wall left
    const wallLeftMesh = new THREE.Mesh(wallGeo, wallMaterial)
    wallLeftMesh.rotateY(Math.PI / 2);
    wallLeftMesh.position.set(-100, 1, 0);
    scene.add(wallLeftMesh);
    // add wall right
    const wallRightMesh = new THREE.Mesh(wallGeo, wallMaterial)
    wallRightMesh.rotateY(-Math.PI / 2);
    wallRightMesh.position.set(100, 1, 0);
    scene.add(wallRightMesh);

    // add ground
    const groundTexture = new THREE.TextureLoader().load('./textures/grass_ground.jpg');
    groundTexture.minFilter = THREE.NearestMipmapLinearFilter
    groundTexture.magFilter = THREE.NearestMipmapLinearFilter
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(32, 32);
    const groundMaterial = new THREE.MeshBasicMaterial({
      map: groundTexture
    });
    const groundGeo = new THREE.PlaneGeometry(200, 200)
    const ground = new THREE.Mesh(groundGeo, groundMaterial)
    ground.rotateX(-Math.PI / 2)
    scene.add(ground)

    // add sky
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
