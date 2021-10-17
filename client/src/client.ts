import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {MoveStatus, Bullet, Bullets, UserBody} from './types/Types'
import * as CANNON from 'cannon-es'
import CannonUtils from './utils/cannon'
import CannonDebugRenderer from './utils/cannon-debug-render'
import {updateMoveStatus, updateMoveSpeed, updateMoveRotation} from './utils/tankStatus'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min'
import {GRAVITY, BULLET_SPEED} from './utils/constants';
import Explosion from './components/bullet/explosion';

declare var PRODUCTION: string;
declare var PORT: string;

const scene = new THREE.Scene()

const light = new THREE.AmbientLight()
scene.add(light)

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

camera.position.y = 1.5
camera.position.x = -2
camera.lookAt(new THREE.Vector3(10, 0, 0));

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const menuPanel = document.getElementById('menuPanel') as HTMLDivElement
const startButton = document.getElementById('startButton') as HTMLInputElement

let webSocket: WebSocket;
const tank_id = 'TEST_1';
startButton.addEventListener(
  'click',
  function () {
    menuPanel.style.display = 'none'
    let protocol = 'wss';
    let port = '';
    if (!PRODUCTION) {
      protocol = 'ws';
      port = `:${PORT}`;
    }
    webSocket = new WebSocket(`${protocol}://${window.location.hostname}${port}/websockets?id=${tank_id}&name=lu`)
    const loader = new GLTFLoader();
    loader.load('./models/styled_tank/tank.glb', function(gltf){
      const tank = gltf.scene.children[0];
      tank.scale.set(0.3,0.3,0.3);
      scene.add(tank);
      document.addEventListener('keydown', onKeyDown, false)
      document.addEventListener('keyup', onKeyUp, false)
      document.addEventListener('keypress', onKeyPress, false)
      renderer.domElement.addEventListener(
        'mousemove',
        onDocumentMouseMove,
        false);
      webSocket.send(`st3,${tank.position.x},${tank.position.y},${tank.position.z},${tank.rotation.x},${tank.rotation.y},${tank.rotation.z}`);
    });
  },
  false
)

// physics
const world = new CANNON.World()
const bullets: Bullets = {}
const explosions: Explosion[] = [
  new Explosion(new THREE.Color(0xffff00), scene)
];
let bulletIdx = 0;
const groundMaterial: CANNON.Material = new CANNON.Material('groundMaterial');
const wallMaterial: CANNON.Material = new CANNON.Material('wallMaterial');
const slipperyMaterial: CANNON.Material = new CANNON.Material('slipperyMaterial');
groundMaterial.friction = 0.5
groundMaterial.restitution = 0.25
wallMaterial.friction = 0.5
wallMaterial.restitution = 0.25
slipperyMaterial.friction = 0.15
slipperyMaterial.restitution = 0.25

world.gravity.set(0, GRAVITY, 0)

if (!bullets[tank_id]) {
  bullets[tank_id] = [];
}

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

const wallLeftShape = new CANNON.Box(new CANNON.Vec3(1, 1, 100))
const wallLeftBody: UserBody = new CANNON.Body({
  mass: 0,
  material: wallMaterial,
  type: CANNON.Body.STATIC
})
wallLeftBody.addShape(wallLeftShape);
wallLeftBody.position.x = -100;
wallLeftBody.position.y = 1;
wallLeftBody.position.z = 0;
wallLeftBody.userData = 'wall-left'
world.addBody(wallLeftBody);

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

const sphereShape = new CANNON.Sphere(0.5)
const sphereBody: UserBody = new CANNON.Body({
    mass: 1,
    material: slipperyMaterial,
    type: CANNON.Body.DYNAMIC
})
sphereBody.addShape(sphereShape)
sphereBody.userData = 'tank_sphere'

sphereBody.position.x = 0
sphereBody.position.y = 0.5
sphereBody.position.z = 0
world.addBody(sphereBody)

const createBullet = function(tank: THREE.Object3D) {
  const eulerY = tank.rotation.z;
  const offsetX = BULLET_SPEED * Math.sin(eulerY);
  const offsetZ = BULLET_SPEED * Math.cos(eulerY);
  const bulletShape = new CANNON.Sphere(0.08)
  const bulletBody: UserBody = new CANNON.Body({
      mass: 0.1,
      material: slipperyMaterial,
      type: CANNON.Body.DYNAMIC
  })
  //bulletBody.tankId = tank_id;
  //bulletBody.bulletIdx = bulletIdx;
  bulletBody.userData = `tank_bullet_${tank_id}`;
  bulletBody.addShape(bulletShape)
  bulletBody.position.x = tank.position.x + 0.7 * Math.sin(eulerY)
  bulletBody.position.y = tank.position.y + 0.5
  bulletBody.position.z = tank.position.z + 0.7 * Math.cos(eulerY)

  bulletBody.velocity = new CANNON.Vec3(offsetX, 0, offsetZ);
  world.addBody(bulletBody)

  const bulletGeo = new THREE.SphereGeometry(0.1, 8, 8); 
  const bulletMaterial = new THREE.MeshBasicMaterial({ 
    color: new THREE.Color(255, 255, 0)
  });
  const bulletSphere = new THREE.Mesh(bulletGeo, bulletMaterial);

  bullets[tank_id].push({
    idx: bulletIdx,
    body: bulletBody,
    sphere: bulletSphere
  });
  bulletIdx++;
  scene.add(bulletSphere);

  bulletBody.addEventListener('collide', (evt: any) => {
    console.log('bullet', evt);
    explosions.forEach((explosion) => {
      explosion.explode(new THREE.Vector3(evt.body.position.x, evt.body.position.y, evt.body.position.z))
    })
  })
}

const updateBullets = (bullets: Bullets) => {
  for (const tank in bullets) {
    const tankBullets = bullets[tank];
    tankBullets.forEach(bullet => {
      bullet.sphere.position.set(
        bullet.body.position.x,
        bullet.body.position.y,
        bullet.body.position.z
      );
    })
  }
}

let {width, height} = renderer.domElement;
let cameraRotationXZOffset = 0;
let cameraRotationYOffset = 0;

let tankStatus: MoveStatus = {
  forwardStatus: 0,
  rotationstatus: 0,
  keyW: 0,
  keyS: 0,
  keyA: 0,
  keyD: 0,
  speed: 0,
  rotation: 0
}

function onDocumentMouseMove(event: MouseEvent) {
  const {x, y} = event;
  cameraRotationXZOffset = (x / width - 0.5) * Math.PI / 2;
  cameraRotationYOffset = (y / height - 0.5) * Math.PI / 2;
}

const groundTexture = new THREE.TextureLoader().load('textures/grass_ground.jpg')
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
const skyTexture = skySphereLoader.load('textures/sky.jpg');
const skyMaterial = new THREE.MeshPhongMaterial({ 
  map: skyTexture,
});
const sky = new THREE.Mesh(skyGeo, skyMaterial);
sky.material.side = THREE.BackSide;
sky.position.y = -2
scene.add(sky);

const getTank = () => {
  return scene.children.find(obj => obj.name === 'tank');
}

const onKeyDown = function (event: KeyboardEvent) {
  switch (event.code) {
    case 'KeyW': {
      tankStatus = updateMoveStatus(tankStatus, {keyW: 1});
      break
    }
    case 'KeyA': {
      tankStatus = updateMoveStatus(tankStatus, {keyA: 1});
      break
    }
    case 'KeyS': {
      tankStatus = updateMoveStatus(tankStatus, {keyS: 1});
      break;
    }
    case 'KeyD': {
      tankStatus = updateMoveStatus(tankStatus, {keyD: 1});
      break
    }
  }
}

const onKeyUp = function(event: KeyboardEvent) {
  switch (event.code) {
    case 'KeyW': {
      tankStatus = updateMoveStatus(tankStatus, {keyW: 0});
      break
    }
    case 'KeyA': {
      tankStatus = updateMoveStatus(tankStatus, {keyA: 0});
      break
    }
    case 'KeyS': {
      tankStatus = updateMoveStatus(tankStatus, {keyS: 0});
      break;
    }
    case 'KeyD': {
      tankStatus = updateMoveStatus(tankStatus, {keyD: 0});
      break
    }
  }
}

const onKeyPress = function(event: KeyboardEvent) {
  const tank = getTank() as THREE.Object3D;
  switch (event.code) {
    case 'Space':
      createBullet(tank);
      break;
  }
}

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
  width = window.innerWidth;
  height = window.innerHeight;
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
  render()
}

const stats = Stats()
document.body.appendChild(stats.dom)

const clock = new THREE.Clock()
let delta;
const cannonDebugRenderer = new CannonDebugRenderer(scene, world)
function animate() {
  requestAnimationFrame(animate)
  
  delta = Math.min(clock.getDelta(), 0.1)
  world.step(delta)
  render()
  stats.update()
}

function render() {
  cannonDebugRenderer.update()
  const tank = getTank() as THREE.Object3D;
  if (tank) {
    updateMoveSpeed(tankStatus);
    updateMoveRotation(tankStatus);
    updateBullets(bullets);
    const rotation = tankStatus.rotation || 0;
    sphereBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), rotation);
    // Copy coordinates from Cannon to Three.js
    const euler = new CANNON.Vec3();
    sphereBody.quaternion.toEuler(euler);
    const eulerY = euler.y;
    tank.rotation.z = eulerY;
    const speed = tankStatus.speed || 0;
    const offsetX = speed * Math.sin(eulerY);
    const offsetZ = speed * Math.cos(eulerY);
    sphereBody.velocity = new CANNON.Vec3(offsetX, 0, offsetZ);
    tank.position.set(
      sphereBody.position.x,
      sphereBody.position.y - 0.5,
      sphereBody.position.z)
    camera.position.x = tank.position.x - 2 * Math.sin(eulerY);
    camera.position.z = tank.position.z - 2 * Math.cos(eulerY);
    camera.lookAt(
      tank.position.x + 10 * Math.sin(eulerY - cameraRotationXZOffset),
      -10 * Math.atan(cameraRotationYOffset),
      tank.position.z + 10 * Math.cos(eulerY - cameraRotationXZOffset))
  }
  renderer.render(scene, camera)
}

animate()
