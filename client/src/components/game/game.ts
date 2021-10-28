import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import {GRAVITY, BULLET_SPEED} from '../../utils/constants';
import Arena from './arena';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {updateMoveStatus} from '../../utils/tankStatus';
import { PerspectiveCamera, Scene, WebGLRenderer, Clock, Vector3, DirectionalLight, AmbientLight, Color, MathUtils } from 'three';
import { DebugInfo, GameConfig, TankData3, TankStatus3, BulletsType, MessageType, TankPosition, TankPositions } from '../../types/Types';
// import Debug from '../info/debug';
import Tank from '../tank/tank';
import Bullet from '../bullet/bullet';
import Explosion from '../bullet/explosion';
import TankMe3 from '../tank/tankMe3';
import TankBase3 from '../tank/tankBase3';
import Message from './message';

class Game {
  scene: THREE.Scene;
  world: CANNON.World;
  camera: THREE.PerspectiveCamera;
  arena: Arena;
  renderer: THREE.WebGLRenderer;
  bullets: BulletsType = {};
  bulletsToRemove: Bullet[] = [];
  explosions: Explosion[] =[];
  tanks: {[key: string]: Tank} = {};
  cameraRotationXZOffset: number = 0;
  cameraRotationYOffset: number = 0;
  width: number = 1;
  height: number = 1;
  production: string;
  port: string;
  messager: Message;
  tankId: string = '';
  tankName: string = '';
  constructor(renderer: THREE.WebGLRenderer, production: string, port: string) {
    this.renderer = renderer;
    this.scene = new THREE.Scene();
    this.production = production;
    this.port = port;
    this.messager = new Message(production, port);
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
    this.registerUserInteraction.bind(this);
    this.onDocumentMouseMove.bind(this);
    this.onKeyDown.bind(this);
    this.onKeyUp.bind(this);
    this.onKeyPress.bind(this);
    this.messageHandler.bind(this);
    this.connectToServer.bind(this);
    this.addTank.bind(this);
    this.updateTankPosition.bind(this);
    this.updateCamera.bind(this);
    window.addEventListener('resize', () => this.onWindowResize(), true);
  }

  async connectToServer(tankId: string, tankName: string) {
    this.tankId = tankId;
    this.tankName = tankName;
    const connected = await this.messager.getConnection(tankId, tankName);
    if (connected) {
      this.messager.listenOnMessage(this.messageHandler.bind(this));
      this.messager.sendMessage(`${MessageType.TANK_START}`);
    } else {
      console.log('failed to open web socket');
    }
  }

  messageHandler(type:string, data: object) {
    switch (type) {
      case MessageType.TANK_POS: {
        const tankPositionData = data as TankPositions;
        this.updateTankPosition(tankPositionData);
        break;
      }
      default: {
        console.log('unknown message type');
        break;
      }
    }
  }

  async addTank(tankId: string, tankName: string) {
    const loader = new GLTFLoader();
    return new Promise<Tank>(resolve => {
      loader.load('./models/styled_tank/tank.glb', (gltf) => {
        const tankModel = gltf.scene.children[0];
        tankModel.scale.set(0.3,0.3,0.3);
        const tank = new Tank(tankModel, tankId, tankName);
        tank.ready = true;
        this.scene.add(tank.model);
        this.registerUserInteraction(tank);
        if (!this.bullets[tankId]) {
          this.bullets[tankId] = [];
        }
        this.tanks[tankId] = tank;
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


  updateTankPosition(tankData: TankPositions) {
    for (const tankId in tankData) {
      if (!this.tanks[tankId]) {
        // use a fake tank to hold the place, just in case the same tank is added multiple times 
        this.tanks[tankId] = new Tank(new THREE.Object3D(), this.tankId, this.tankName);
        this.addTank(this.tankId, this.tankName)
        .then(() => {
          console.log(`tank ${this.tankName} added`);
        });
      } else {
        const tank = this.tanks[tankId];
        const data = tankData[tankId];
        if (tank.ready) {
          const model = tank.model;
          model.position.set(data.x, data.y, data.z);
        }
        if (tank.tankId === this.tankId) {
          // this is my tank
          this.updateCamera(tank);
        }
      }
    }
  }

  updateCamera(myTank: Tank) {
    const model = myTank.model;
    this.camera.position.x = model.position.x
    this.camera.position.z = model.position.z - 2;
    this.camera.lookAt(
      //model.position.x + 10 * Math.sin(eulerY - cameraRotationXZOffset),
      //-10 * Math.atan(cameraRotationYOffset),
      //model.position.z + 10 * Math.cos(eulerY - cameraRotationXZOffset)
      model.position.x,
      0,
      model.position.z + 10
    )
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
        const bullet = new Bullet(this.scene, this.world, tank, this.bulletsToRemove, this.explosions);
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
