import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import {GRAVITY, BULLET_SPEED} from '../../utils/constants';
import Arena from './arena';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {updateMoveStatus} from '../../utils/tankStatus';
import { PerspectiveCamera, Scene, WebGLRenderer, Clock, Vector3, DirectionalLight, AmbientLight, Color, MathUtils } from 'three';
import { DebugInfo, GameConfig, TankData3, TankStatus3, BulletsType } from '../../types/Types';
// import Debug from '../info/debug';
import Tank from '../tank/tank';
import Bullet from '../bullet/bullet';
import TankMe3 from '../tank/tankMe3';
import TankBase3 from '../tank/tankBase3';
import Message from '../message';

class Game {
  scene: THREE.Scene;
  world: CANNON.World;
  camera: THREE.PerspectiveCamera;
  arena: Arena;
  renderer: THREE.WebGLRenderer;
  bullets: BulletsType = {};
  tanks: Tank[] = [];
  cameraRotationXZOffset: number = 0;
  cameraRotationYOffset: number = 0;
  width: number = 1;
  height: number = 1;
  constructor(renderer: THREE.WebGLRenderer) {
    this.renderer = renderer;
    this.scene = new THREE.Scene();
    const light = new THREE.AmbientLight()
    this.scene.add(light)
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    this.camera.position.y = 1.5
    this.camera.position.x = -2
    this.camera.lookAt(new THREE.Vector3(10, 0, 0));
    this.world = new CANNON.World()
    this.world.gravity.set(0, GRAVITY, 0)
    this.arena = new Arena(this.scene, this.world);
    this.width = this.renderer.domElement.width;
    this.height = this.renderer.domElement.height;
    this.onWindowResize.bind(this);
    this.onDocumentMouseMove.bind(this);
    this.onKeyDown.bind(this);
    this.onKeyUp.bind(this);
    this.onKeyPress.bind(this);
    window.addEventListener('resize', () => this.onWindowResize(), false)
  }

  async addTank(tankId: string, tankName: string) {
    const loader = new GLTFLoader();
    return new Promise<Tank>(resolve => {
      loader.load('./models/styled_tank/tank.glb', (gltf) => {
        const tankModel = gltf.scene.children[0];
        tankModel.scale.set(0.3,0.3,0.3);
        const tank = new Tank(tankModel, tankId, tankName);
        this.scene.add(tank.model);
        this.world.addBody(tank.body);
        this.registerUserInteraction(tank);
        if (!this.bullets[tankId]) {
          this.bullets[tankId] = [];
        }
        this.tanks.push(tank);
        resolve(tank);
      });
    });
  }

  registerUserInteraction(tank: Tank) {
    document.addEventListener('keydown', evt => this.onKeyDown(evt, tank), false);
    document.addEventListener('keyup', evt => this.onKeyUp(evt, tank), false);
    document.addEventListener('keypress', evt => this.onKeyPress(evt, tank), false);
    document.addEventListener('mousemove', evt => this.onDocumentMouseMove(evt), false);
  }

  onKeyDown (event: KeyboardEvent, tank: Tank) {
    switch (event.code) {
      case 'KeyW': {
        tank.moveStatus = updateMoveStatus(tank.moveStatus, {keyW: 1});
        break
      }
      case 'KeyA': {
        tank.moveStatus = updateMoveStatus(tank.moveStatus, {keyA: 1});
        break
      }
      case 'KeyS': {
        tank.moveStatus = updateMoveStatus(tank.moveStatus, {keyS: 1});
        break;
      }
      case 'KeyD': {
        tank.moveStatus = updateMoveStatus(tank.moveStatus, {keyD: 1});
        break
      }
    }
  }

  onKeyUp(event: KeyboardEvent, tank: Tank) {
    switch (event.code) {
      case 'KeyW': {
        tank.moveStatus = updateMoveStatus(tank.moveStatus, {keyW: 0});
        break
      }
      case 'KeyA': {
        tank.moveStatus = updateMoveStatus(tank.moveStatus, {keyA: 0});
        break
      }
      case 'KeyS': {
        tank.moveStatus = updateMoveStatus(tank.moveStatus, {keyS: 0});
        break;
      }
      case 'KeyD': {
        tank.moveStatus = updateMoveStatus(tank.moveStatus, {keyD: 0});
        break
      }
    }
  }

  onKeyPress(event: KeyboardEvent, tank: Tank) {
    switch (event.code) {
      case 'Space':
        const bullet = new Bullet(this.scene, this.world, tank);
        this.bullets[tank.tankId].push(bullet);
        break;
    }
  }

  onDocumentMouseMove(event: MouseEvent) {
    const {x, y} = event;
    this.cameraRotationXZOffset = (x / this.width - 0.5) * Math.PI / 2;
    this.cameraRotationYOffset = (y / this.height - 0.5) * Math.PI / 2;
  }

  onWindowResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }
}

export default Game;
