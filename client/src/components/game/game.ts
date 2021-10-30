import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import {GRAVITY, BULLET_SPEED} from '../../utils/constants';
import Arena from './arena';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {updateMoveStatus} from '../../../../server/src/physics/utils/tankStatus';
import { PerspectiveCamera, Scene, WebGLRenderer, Clock, Vector3, DirectionalLight, AmbientLight, Color, MathUtils } from 'three';
import { DebugInfo, GameConfig, TankData3, TankStatus3, BulletsType, MessageType, TankPosition, TankPositions, MoveStatus } from '../../types/Types';
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
  moveStatus: MoveStatus = {
    keyW: '0',
    keyS: '0',
    keyA: '0',
    keyD: '0',
    forward: 0,
    rotation: 0,
    speed: 0,
    direction: 0
  }
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
    this.camera.position.y = 2
    this.camera.position.x = -2
    this.camera.lookAt(new THREE.Vector3(10, 0, 0));
    this.world = new CANNON.World()
    this.world.gravity.set(0, GRAVITY, 0)
    this.arena = new Arena(this.scene, this.world);
    this.width = this.renderer.domElement.width;
    this.height = this.renderer.domElement.height;
    this.registerUserInteraction.bind(this);
    this.messageHandler.bind(this);
    this.connectToServer.bind(this);
    this.addTank.bind(this);
    this.updateTankPosition.bind(this);
    this.updateCamera.bind(this);
    window.addEventListener('resize', this.onWindowResize.bind(this), true);
  }

  async connectToServer(tankId: string, tankName: string) {
    this.tankId = tankId;
    this.tankName = tankName;
    const connected = await this.messager.getConnection(tankId, tankName);
    if (connected) {
      this.messager.listenOnMessage(this.messageHandler.bind(this));
      this.messager.sendMessage(`${MessageType.TANK_START}`);
      this.registerUserInteraction();
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
        if (!this.bullets[tankId]) {
          this.bullets[tankId] = [];
        }
        this.tanks[tankId] = tank;
        resolve(tank);
      });
    });
  }

  registerUserInteraction() {
    document.addEventListener('keydown', this.onKeyDown.bind(this), true);
    document.addEventListener('keyup', this.onKeyUp.bind(this), true);
    document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), true);
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
          model.rotation.z = data.r;
        }
        if (tank.tankId === this.tankId) {
          // this is my tank
          this.updateCamera(tank);
        }
      }
    }
  }

  updateCamera(myTank: Tank) {
    const {position, rotation} = myTank.model;

    this.camera.position.x = position.x - 2 * Math.sin(rotation.z);
    this.camera.position.z = position.z - 2 * Math.cos(rotation.z);
    this.camera.lookAt(
      position.x + 10 * Math.sin(rotation.z - this.cameraRotationXZOffset),
      -10 * Math.atan(this.cameraRotationYOffset),
      position.z + 10 * Math.cos(rotation.z - this.cameraRotationXZOffset));
  }

  onKeyDown (event: KeyboardEvent) {
    switch (event.code) {
      case 'KeyW': {
        if (this.moveStatus.keyW != '1') {
          this.messager.sendMessage(`${MessageType.TANK_MOVE_FORWARD},1`);
        }
        this.moveStatus.keyW = '1';
        break
      }
      case 'KeyA': {
        if (this.moveStatus.keyA != '1') {
          this.messager.sendMessage(`${MessageType.TANK_ROTATE_LEFT},1`);
        }
        this.moveStatus.keyA = '1';
        break
      }
      case 'KeyS': {
        if (this.moveStatus.keyS != '1') {
          this.messager.sendMessage(`${MessageType.TANK_MOVE_BACKWARD},1`);
        }
        this.moveStatus.keyS = '1';
        break;
      }
      case 'KeyD': {
        if (this.moveStatus.keyD != '1') {
          this.messager.sendMessage(`${MessageType.TANK_ROTATE_RIGHT},1`);
        }
        this.moveStatus.keyD = '1';
        break
      }
    }
  }

  onKeyUp(event: KeyboardEvent) {
    switch (event.code) {
      case 'KeyW': {
        if (this.moveStatus.keyW != '0') {
          this.messager.sendMessage(`${MessageType.TANK_MOVE_FORWARD},0`);
        }
        this.moveStatus.keyW = '0';
        break
      }
      case 'KeyA': {
        if (this.moveStatus.keyA != '0') {
          this.messager.sendMessage(`${MessageType.TANK_ROTATE_LEFT},0`);
        }
        this.moveStatus.keyA = '0';
        break
      }
      case 'KeyS': {
        if (this.moveStatus.keyS != '0') {
          this.messager.sendMessage(`${MessageType.TANK_MOVE_BACKWARD},0`);
        }
        this.moveStatus.keyS = '0';
        break;
      }
      case 'KeyD': {
        if (this.moveStatus.keyD != '0') {
          this.messager.sendMessage(`${MessageType.TANK_ROTATE_RIGHT},0`);
        }
        this.moveStatus.keyD = '0';
        break
      }
      case 'Space':
        this.messager.sendMessage(MessageType.TANK_SHOOT);
        // const bullet = new Bullet(this.scene, this.world, tank, this.bulletsToRemove, this.explosions);
        // this.bullets[tank.tankId].push(bullet);
        // break;
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
