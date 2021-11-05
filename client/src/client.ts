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

function updateAndTweenScene(deltaTime: number) {
  const tanks = game.tanks;
  for (const tankId in tanks) {
    const tank = tanks[tankId];
    const model = tank.model;
    new TWEEN.Tween(model.position)
      .to(tank.curPos, deltaTime)
      .easing(TWEEN.Easing.Linear.None)
      .start();
    new TWEEN.Tween(model.rotation)
      .to({z: tank.curDir}, deltaTime)
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
