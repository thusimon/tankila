import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {MoveStatus, BulletType, BulletsType, UserBody} from './types/Types'
import * as CANNON from 'cannon-es'
import CannonUtils from './utils/cannon'
import CannonDebugRenderer from './utils/cannon-debug-render'
import {updateMoveStatus, updateMoveSpeed, updateMoveRotation} from './utils/tankStatus'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min'
import {GRAVITY, BULLET_SPEED} from './utils/constants';
import Arena from './components/game/arena';
import Explosion from './components/bullet/explosion';
import Bullet from './components/bullet/bullet'
import {isColideWith} from './utils/collision'
import Game from './components/game/game';

declare var PRODUCTION: string;
declare var PORT: string;

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const game = new Game(renderer);

const menuPanel = document.getElementById('menuPanel') as HTMLDivElement
const startButton = document.getElementById('startButton') as HTMLInputElement

let webSocket: WebSocket;
const tankId = 'TEST_1';
const tankName = 'Lu';

startButton.addEventListener(
  'click',
  async function () {
    menuPanel.style.display = 'none'
    let protocol = 'wss';
    let port = `:${PORT}`;
    if (!PRODUCTION) {
      protocol = 'ws';
    }
    webSocket = new WebSocket(`${protocol}://${window.location.hostname}${port}/websockets?id=${tankId}&name=${tankName}`)
    const tank = await game.addTank(tankId, tankName);
    const model = tank.model;
    webSocket.send(`st3,${model.position.x},${model.position.y},${model.position.z},${model.rotation.x},${model.rotation.y},${model.rotation.z}`);
  },
  false
)

const updateBullets = (bullets: BulletsType) => {
  for (const tank in bullets) {
    const tankBullets = bullets[tank];
    tankBullets.forEach(bullet => {
      bullet.updateSphere();
    })
  }
}

const stats = Stats()
document.body.appendChild(stats.dom)

const clock = new THREE.Clock()
let delta;
const cannonDebugRenderer = new CannonDebugRenderer(game.scene, game.world)
function animate() {
  requestAnimationFrame(animate)
  
  delta = Math.min(clock.getDelta(), 0.1)
  game.world.step(delta)
  render()
  stats.update()
}

function render() {
  cannonDebugRenderer.update();
  const {cameraRotationXZOffset, cameraRotationYOffset, camera, scene} = game;
  const tank = game.tanks[0];
  if (tank) {
    const {moveStatus, model, body} = tank;
    updateMoveSpeed(moveStatus);
    updateMoveRotation(moveStatus);
    updateBullets(game.bullets);
    const rotation = moveStatus.rotation || 0;
    body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), rotation);
    // Copy coordinates from Cannon to Three.js
    const euler = new CANNON.Vec3();
    body.quaternion.toEuler(euler);
    const eulerY = euler.y;
    model.rotation.z = eulerY;
    const speed = moveStatus.speed || 0;
    const offsetX = speed * Math.sin(eulerY);
    const offsetZ = speed * Math.cos(eulerY);
    body.velocity = new CANNON.Vec3(offsetX, 0, offsetZ);
    model.position.set(
      body.position.x,
      body.position.y - 0.5,
      body.position.z)
    camera.position.x = body.position.x - 2 * Math.sin(eulerY);
    camera.position.z = body.position.z - 2 * Math.cos(eulerY);
    camera.lookAt(
      model.position.x + 10 * Math.sin(eulerY - cameraRotationXZOffset),
      -10 * Math.atan(cameraRotationYOffset),
      model.position.z + 10 * Math.cos(eulerY - cameraRotationXZOffset))
  }
  const bulletsToRemove = game.bulletsToRemove;
  bulletsToRemove.forEach(bullet => {
    bullet.removeBullet();
  })
  
  // TODO need to clean up the explosions array
  game.explosions.forEach(explosion => {
    explosion.update();
  });
  renderer.render(scene, camera)
}

animate()
