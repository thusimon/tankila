import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import {BulletsType} from './types/Types'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min'
import Game from './components/game/game';
import Welcome from './welcome';
import './style/welcome.scss';

declare var PRODUCTION: string;
declare var PORT: string;

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const game = new Game(renderer, PRODUCTION, PORT);

const welcome = new Welcome(game);

const updateBullets = (bullets: BulletsType) => {
  for (const tank in bullets) {
    const tankBullets = bullets[tank];
    tankBullets.forEach(bullet => {
      //bullet.updateSphere();
    })
  }
}

const stats = Stats()
document.body.appendChild(stats.dom)

const clock = new THREE.Clock();
let delta;
function animate() {
  requestAnimationFrame(animate)
  delta = clock.getDelta();
  updateAndTweenScene(delta);
  TWEEN.update();
  stats.update();
}

const MinDistToScale = 4;
function getNameScaleOnDistance(myTankPos: THREE.Vector3, tankPos: THREE.Vector3) {
  const dist = myTankPos.distanceTo(tankPos);
  if (dist < MinDistToScale) {
    return 1;
  } else {
    return 1 + (dist - MinDistToScale)/15;
  }
}
function updateAndTweenScene(deltaTime: number) {
  const tanks = game.tanks;
  const myTank = tanks[game.tankId];
  for (const tankId in tanks) {
    const tank = tanks[tankId];
    const model = tank.model;
    const tankName = tank.tankNameMesh;
    new TWEEN.Tween(model.position)
      .to(tank.curPos, deltaTime)
      .easing(TWEEN.Easing.Linear.None)
      .start();
    new TWEEN.Tween(model.rotation)
      .to({z: tank.curDir}, deltaTime)
      .easing(TWEEN.Easing.Linear.None)
      .start();

    const myTankNameRotation = tankId === game.tankId ? Math.PI : 0;
    let fontScale = 1;
    if (tank.tankId != game.tankId) {
      fontScale = getNameScaleOnDistance(myTank.model.position, model.position);
      tankName.scale.set(fontScale, fontScale, fontScale);
    }
    new TWEEN.Tween(tankName.rotation)
      .to({y: tank.curDir + myTankNameRotation}, deltaTime)
      .easing(TWEEN.Easing.Linear.None)
      .start();
    const fontNamePos = new THREE.Vector3(tank.curPos.x, tank.curPos.y - fontScale + 1, tank.curPos.z);
    new TWEEN.Tween(tankName.position)
      .to(fontNamePos, deltaTime)
      .easing(TWEEN.Easing.Linear.None)
      .start();
  }
  game.updateCamera();
  game.explosions.forEach(explosion => {
    explosion.update();
  });
  render();
}

function render() {
  renderer.render(game.scene, game.camera)
}

animate();

welcome.showPanel();
