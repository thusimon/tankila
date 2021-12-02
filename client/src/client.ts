import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min'
import Game from './components/game/game';
import Welcome from './components/panels/welcome';
import './client.scss';

declare var PRODUCTION: string;
declare var PORT: string;

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const game = new Game(renderer, PRODUCTION, PORT);

const welcome = new Welcome(game);

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
    return 1 + (dist - MinDistToScale) / 12;
  }
}

function getNameDirection(myTankPos: THREE.Vector3, tankPos: THREE.Vector3, tankDir: number, isMyTank: boolean) {
  if (isMyTank) {
    return tankDir + Math.PI;
  } else {
    const posDiff = new THREE.Vector3().copy(myTankPos).sub(tankPos);
    const posDiffLen = posDiff.length()
    if (posDiffLen === 0) {
      return 0;
    } else {
      if (posDiff.z <= 0) {
        return Math.acos(posDiff.x / posDiffLen) + Math.PI / 2;
      } else {
        return Math.asin(posDiff.x / posDiffLen);
      }
    }
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

    const tankNameYRotation = getNameDirection(myTank.curPos, tank.curPos, tank.curDir, tankId === game.tankId);
    let fontScale = 1;
    const fontNamePos = new THREE.Vector3(tank.curPos.x, tank.curPos.y, tank.curPos.z);
    if (tank.tankId != game.tankId) {
      fontScale = getNameScaleOnDistance(myTank.model.position, model.position);
      fontNamePos.y = fontNamePos.y - fontScale + 1.1;
      tankName.position.copy(fontNamePos);
    } else {
      fontNamePos.addScaledVector(new THREE.Vector3(Math.sin(tank.curDir),0,Math.cos(tank.curDir)), -0.5);
      new TWEEN.Tween(tankName.position)
      .to(fontNamePos, deltaTime)
      .easing(TWEEN.Easing.Linear.None)
      .start();
    }
    tankName.scale.set(fontScale, fontScale, fontScale);
    new TWEEN.Tween(tankName.rotation)
      .to({y: tankNameYRotation}, deltaTime)
      .easing(TWEEN.Easing.Linear.None)
      .start();
    tank.updateShield();
    new TWEEN.Tween(tank.shield.model.position)
      .to({x: tank.curPos.x, y: tank.curPos.y + 0.6, z:tank.curPos.z}, deltaTime)
      .easing(TWEEN.Easing.Linear.None)
      .start();
  }

  const bullets = game.bullets;
  for (const tankId in bullets) {
    const tankBullets = bullets[tankId];
    for (const bulletId in tankBullets) {
      const tankBullet = tankBullets[bulletId];
      new TWEEN.Tween(tankBullet.model.position)
        .to(tankBullet.position, deltaTime)
        .easing(TWEEN.Easing.Linear.None)
        .start();
    }
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
