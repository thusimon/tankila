import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {MoveStatus} from './types/Types'
import * as CANNON from 'cannon-es'
import CannonUtils from './utils/cannon'
import CannonDebugRenderer from './utils/cannon-debug-render'
import {updateMoveStatus, updateMoveSpeed} from './utils/tankStatus'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min'

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
    webSocket = new WebSocket(`${protocol}://${window.location.hostname}${port}/websockets?id=test&name=lu`)
    const loader = new GLTFLoader();
    loader.load('./models/styled_tank/tank.glb', function(gltf){
      const tank = gltf.scene.children[0];
      tank.scale.set(0.3,0.3,0.3);
      scene.add(tank);
      document.addEventListener('keydown', onKeyDown, false)
      document.addEventListener('keyup', onKeyUp, false)
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
const bodies: { [id: string]: CANNON.Body } = {}
const groundMaterial: CANNON.Material = new CANNON.Material('groundMaterial');
const slipperyMaterial: CANNON.Material = new CANNON.Material('slipperyMaterial');
groundMaterial.friction = 0.15
groundMaterial.restitution = 0.25
slipperyMaterial.friction = 0.15
slipperyMaterial.restitution = 0.25

world.gravity.set(0, -9.8, 0)

const groundShape = new CANNON.Box(new CANNON.Vec3(100, 1, 100))
const groundBody = new CANNON.Body({
    mass: 0,
    material: groundMaterial,
})
groundBody.addShape(groundShape)
groundBody.position.x = 0
groundBody.position.y = -1
groundBody.position.z = 0
world.addBody(groundBody)

const sphereShape = new CANNON.Sphere(0.5)
const sphereBody = new CANNON.Body({
    mass: 1,
    material: slipperyMaterial,
}) //, angularDamping: .9 })
sphereBody.addShape(sphereShape)
sphereBody.addEventListener('collide', (e: any) => {
  console.log(e);
})
sphereBody.position.x = 0
sphereBody.position.y = 0.6
sphereBody.position.z = 0
world.addBody(sphereBody)

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
  cannonDebugRenderer.update()
  render()
  stats.update()
}

function render() {
  const rotation = tankStatus.rotation || 0;
  sphereBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), rotation);
  // Copy coordinates from Cannon to Three.js
  const tank = getTank() as THREE.Object3D;
  if (tank) {
    updateMoveSpeed(tankStatus);
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
