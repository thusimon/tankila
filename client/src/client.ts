import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'

import * as CANNON from 'cannon-es'
import CannonUtils from './components/utils/cannon'
import CannonDebugRenderer from './components/utils/cannon-debug-render'

declare var PRODUCTION: string;
declare var PORT: string;
console.log(PRODUCTION, PORT);

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
      tank.rotation.z += Math.PI / 2;
      scene.add(tank);
      document.addEventListener('keydown', onKeyDown, false)
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
sphereBody.position.y = 1
sphereBody.position.z = 0
world.addBody(sphereBody)


const createPlayerTankSphere = (id: string, pos: CANNON.Vec3, dir: CANNON.Vec3) => {
  const sphereShape = new CANNON.Sphere(0.5)
  const sphereBody = new CANNON.Body({
      mass: 1,
      material: slipperyMaterial,
  }) //, angularDamping: .9 })
  sphereBody.addShape(sphereShape)
  sphereBody.addEventListener('collide', (e: any) => {
    console.log(e);
  })
  sphereBody.position.x = pos.x
  sphereBody.position.y = pos.y
  sphereBody.position.z = pos.z
  world.addBody(sphereBody)

  bodies[id] = sphereBody

  return sphereBody.id
}

let {width, height} = renderer.domElement;
let cameraRotationXZOffset = 0;
let cameraRotationYOffset = 0;
function onDocumentMouseMove(event: MouseEvent) {
  const {x, y} = event;
  const tank = getTank() as THREE.Object3D;
  cameraRotationXZOffset = (x / width - 0.5) * Math.PI / 2;
  cameraRotationYOffset = (y / height - 0.5) * Math.PI / 2;

  const zr = tank.rotation.z - cameraRotationXZOffset - Math.PI / 2;
  camera.lookAt(
    tank.position.x + 10 * Math.cos(zr),
    -10 * Math.atan(cameraRotationYOffset),
    tank.position.z - 10 * Math.sin(zr))
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
  const tank = getTank() as THREE.Object3D;
  switch (event.code) {
    case 'KeyW': {
      sphereBody.force = new CANNON.Vec3(1,0,0);
      const zr = tank.rotation.z - Math.PI / 2
      const offsetX = 0.1 * Math.cos(zr);
      const offsetZ = 0.1 * Math.sin(zr);
      tank.position.x += offsetX;
      tank.position.z -= offsetZ;
      camera.position.x += offsetX;
      camera.position.z -= offsetZ
      break
    }
    case 'KeyA': {
      console.log(186, sphereBody.angularVelocity)
      tank.rotation.z += 0.02
      const zr = tank.rotation.z - Math.PI / 2
      camera.position.x = tank.position.x - 2 * Math.cos(zr);
      camera.position.z = tank.position.z + 2 * Math.sin(zr);
      camera.lookAt(
        tank.position.x + 10 * Math.cos(zr - cameraRotationXZOffset),
        -10 * Math.atan(cameraRotationYOffset),
        tank.position.z - 10 * Math.sin(zr - cameraRotationXZOffset))
      break
    }
    case 'KeyS': {
      const zr = tank.rotation.z - Math.PI / 2
      const offsetX = -0.1 * Math.cos(zr);
      const offsetZ = -0.1 * Math.sin(zr);
      tank.position.x += offsetX;
      tank.position.z -= offsetZ;
      camera.position.x += offsetX;
      camera.position.z -= offsetZ
      break;
    }
    case 'KeyD': {
      tank.rotation.z -= 0.02
      const zr = tank.rotation.z - Math.PI / 2
      camera.position.x = tank.position.x - 2 * Math.cos(zr);
      camera.position.z = tank.position.z + 2 * Math.sin(zr);
      camera.lookAt(
        tank.position.x + 10 * Math.cos(zr - cameraRotationXZOffset),
        -10 * Math.atan(cameraRotationYOffset),
        tank.position.z - 10 * Math.sin(zr - cameraRotationXZOffset))
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

  // Copy coordinates from Cannon to Three.js
  const tank = getTank() as THREE.Object3D;
  if (tank) {
    // tank.position.set(
    //   sphereBody.position.x,
    //   sphereBody.position.y,
    //   sphereBody.position.z)
    // sphereBody.position.set(
    //   tank.position.x,
    //   tank.position.y,
    //   tank.position.z)
  }
  render()
  stats.update()
}

function render() {
  renderer.render(scene, camera)
}

animate()
