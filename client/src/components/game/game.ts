import * as THREE from 'three';
import Arena from './arena';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import { BulletsType, MessageType, Tanks, TankPositions, MoveStatus, ScoresData, RewardType, RewardStatus } from '../../types/Types';
import Tank from '../tank/tank';
import Bullet from '../bullet/bullet';
import Explosion from '../bullet/explosion';
import Message from './message';
import Chat from '../panels/chat';
import Score from '../panels/score';
import Settings from '../panels/settings';
import RewaresPanel from '../panels/rewards';
import Sounds from './sounds';
import Reward from '../rewards/reward';
import { REWARD_DURATION } from '../../../../server/src/constants';

class Game {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  arena: Arena;
  renderer: THREE.WebGLRenderer;
  bullets: BulletsType = {};
  bulletsToRemove: Bullet[] = [];
  explosions: Explosion[] =[];
  rewards: Reward[] = [];
  tanks: Tanks = {};
  cameraRotationXZOffset: number = 0;
  cameraRotationYOffset: number = 0;
  width: number = 1;
  height: number = 1;
  production: string;
  port: string;
  messager: Message;
  tankId: string = '';
  tankName: string = '';
  chat: Chat;
  score: Score;
  settings: Settings;
  rewardsPanel: RewaresPanel;
  chatReady: boolean = false;
  sounds: Sounds;
  moveStatus: MoveStatus = {
    keyW: '0',
    keyS: '0',
    keyA: '0',
    keyD: '0',
    keySpace: '0',
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
    this.sounds = new Sounds();
    this.rewardsPanel = new RewaresPanel();
    this.settings = new Settings(port, this.sounds);
    this.chat = new Chat();
    this.score = new Score();
    const light = new THREE.AmbientLight()
    this.scene.add(light)
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.y = 2
    this.camera.position.x = -2
    this.camera.lookAt(new THREE.Vector3(10, 0, 0));
    this.arena = new Arena(this.scene);
    this.width = this.renderer.domElement.width;
    this.height = this.renderer.domElement.height;
    this.registerUserInteraction.bind(this);
    this.messageHandler.bind(this);
    this.connectToServer.bind(this);
    this.addTank.bind(this);
    this.removeTank.bind(this);
    this.updateTankPosition.bind(this);
    this.updateBullets.bind(this);
    this.updateExplosion.bind(this);
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
      this.chat.showChat();
      this.score.showPanel();
      this.score.showScore();
    } else {
      console.log('failed to open web socket');
    }
  }

  messageHandler(type:string, data: any) {
    switch (type) {
      case MessageType.TANK_JOINED: {
        const tankJoinedData = data as string[];
        const tankId = tankJoinedData[0]
        if (tankId !== this.tankId) {
          // play a welcome audio
          this.sounds.playWelcome();
        }
        break;
      }
      case MessageType.TANK_POS: {
        const tankPositionData = data as TankPositions;
        this.updateTankPosition(tankPositionData);
        this.updateBullets(tankPositionData);
        this.updateExplosion(tankPositionData);
        break;
      }
      case MessageType.TANK_REWARDS: {
        const tankRewardData = data as RewardStatus;
        console.log(tankRewardData);
        break;
      }
      case MessageType.TANK_EXIT: {
        const exitData = data as string[];
        const exitTankId = exitData[0];
        this.removeTank(exitTankId);
        break;
      }
      case MessageType.CHAT_RECEIVE: {
        const chatData = data as Array<string>;
        const [chatName, chatContent] = chatData;
        this.chat.appendChat(chatName, chatContent);
        break;
      }
      case MessageType.SCORE_UPDATE: {
        const scores = data as ScoresData;
        this.score.updateScore(scores);
        this.updateTankHits(scores);
        break;
      }
      case MessageType.REWARD_ADD: {
        const reward = data as Array<any>;
        const rewardType = reward[0] as RewardType;
        const position = new THREE.Vector3(reward[1], reward[2], reward[3]);
        this.addReward(rewardType, position);
        break;
      }
      case MessageType.REWARD_HIT: {
        const rewardHit = data as Array<any>;
        const tankId = rewardHit[0] as string;
        const rewardType = rewardHit[1] as RewardType;
        const rewardIdx = rewardHit[2] as number;
        this.hitReward(tankId, rewardType, rewardIdx);
        break;
      }
      case MessageType.REWARD_UPDATE: {
        const rewards = data as Array<any>;
        rewards.forEach((reward: Array<any>) => {
          const rewardType = reward[0] as RewardType;
          const position = new THREE.Vector3(reward[1], reward[2], reward[3]);
          this.addReward(rewardType, position);
        });
        break;
      }
      default: {
        console.log('unknown message type');
        break;
      }
    }
  }

  async addTank(tankId: string, tankName: string) {
    const tankLoader = new GLTFLoader();
    const fontLoader = new THREE.FontLoader();
    const tankModelPromise = new Promise<Tank>(resolve => {
      tankLoader.load('./models/styled_tank/tank.glb', (gltf) => {
        const tankModel = gltf.scene.children[0];
        tankModel.scale.set(0.3,0.3,0.3);
        const tank = new Tank(tankModel, tankId, tankName);
        tank.ready = true;
        this.scene.add(tank.model);
        if (!this.bullets[tankId]) {
          this.bullets[tankId] = {};
        }
        this.tanks[tankId] = tank;
        resolve(tank);
      });
    });
    const tankNamePromise = new Promise<THREE.Mesh>(resolve => {
      fontLoader.load('./fonts/OpenSans_Bold.json', (font) => {
        const fontGeo = new THREE.TextGeometry(tankName, {
          font,
          size: 0.15,
          height: 0.02
        });
        const fontMesh = new THREE.Mesh(fontGeo, [
          new THREE.MeshBasicMaterial({color: new THREE.Color(0, 1, 0)}),
          new THREE.MeshBasicMaterial({color: new THREE.Color(1, 1, 0)})
        ]);
        const box = new THREE.Box3().setFromObject(fontMesh);
        const fontSizeVec = new THREE.Vector3();
        box.getSize(fontSizeVec);
        fontMesh.geometry.applyMatrix4( new THREE.Matrix4().makeTranslation(-fontSizeVec.x / 2, 1, 0));
        this.scene.add(fontMesh);
        resolve(fontMesh);
      })
    });
    return Promise.all([tankModelPromise, tankNamePromise])
    .then(([tank, fontMesh]) => {
      tank.tankNameMesh = fontMesh;
    });
  }

  removeTank(tankId: string) {
    if (this.tanks[tankId]) {
      const tankToRemove = this.tanks[tankId];
      this.scene.remove(tankToRemove.model);
      this.scene.remove(tankToRemove.tankNameMesh);
      delete this.tanks[tankId];
    }
  }

  getMyTank() {
    return this.tanks[this.tankId];
  }

  updateTankHits(scoreData: ScoresData) {
    for(let id in scoreData) {
      const tank = this.tanks[id];
      if (tank) {
        tank.hits = scoreData[id].h;
        // update tank name mesh material
        const materials = tank.tankNameMesh.material as THREE.MeshBasicMaterial[];
        const capHit = tank.hits > 100 ? 100 : tank.hits;
        materials[0].color = new THREE.Color(capHit / 100, (100 - capHit) / 100, 0);
      }
    }
  }

  addReward(type: RewardType, position: THREE.Vector3) {
    const reward = new Reward(type, position);
    this.rewards.push(reward);
    this.scene.add(reward.model);
  }

  hitReward(tankId: string, type: RewardType, idx: number) {
    if (!this.tanks[tankId]) {
      return;
    }
    const tank = this.tanks[tankId];
    tank.rewards[type] = REWARD_DURATION;
    const reward = this.rewards[idx];
    this.scene.remove(reward.model);
    this.rewards.splice(idx, 1);
    if (tankId === this.tankId) {
      this.sounds.playHappyNotification();
    }
    this.rewardsPanel.updateTimer(tank.rewards);
  }

  registerUserInteraction() {
    document.addEventListener('keydown', this.onKeyDown.bind(this), true);
    document.addEventListener('keyup', this.onKeyUp.bind(this), true);
    document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), true);
    const chatInput = document.getElementById('chat-input');
    const chatInputEnter = document.getElementById('chat-enter-key');
    if (chatInput && chatInputEnter) {
      chatInput.addEventListener('keyup', this.onSendChat.bind(this), true);
      chatInput.addEventListener('focus', this.onActiveChat.bind(this), true);
      chatInput.addEventListener('blur', this.onDeactiveChat.bind(this), true);
      chatInputEnter.addEventListener('click', this.sendChat.bind(this), true);
    }
  }

  updateTankPosition(tankData: TankPositions) {
    for (const tankId in tankData) {
      if (!this.tanks[tankId]) {
        // use a fake tank to hold the place, just in case the same tank is added multiple times 
        const thisTankData = tankData[tankId];
        // TODO no need to send name in every update
        const tankName = thisTankData.n;
        this.tanks[tankId] = new Tank(new THREE.Object3D(), tankId, tankName);
        this.addTank(tankId, tankName)
        .then(() => {
          console.log(`tank ${tankName} added`);
        });
      } else {
        const tank = this.tanks[tankId];
        const data = tankData[tankId];
        if (tank.ready) {
          const targetPos = new THREE.Vector3(data.x, data.y - 0.5, data.z);
          tank.curPos.copy(targetPos);
          tank.curDir = data.r;
          if (tank.tankId === this.tankId) {
            this.rewardsPanel.show();
          }
        }
      }
    }
  }

  updateBullets(tankData: TankPositions) {
    for (const tankId in tankData) {
      const tankBullets = tankData[tankId].b;
      const tankBulletsId = tankBullets.map(tb => tb.i);
      const tankBulletsInScene = this.bullets[tankId] || {};
      tankBullets.forEach(blt => {
        const bulletInScene = tankBulletsInScene[blt.i];
        if (bulletInScene) {
          // bullet still in scene update position
          bulletInScene.updatePosition(blt.x, blt.y, blt.z);
        } else {
          // bullet not in scene, create a new bullet
          const newTankBullet = new Bullet(this.scene, blt.x, blt.y, blt.z, blt.i);
          tankBulletsInScene[blt.i] = newTankBullet;
          newTankBullet.addBullet();
        }
      });
      for(const bltIdx in tankBulletsInScene) {
        if (!tankBulletsId.includes(tankBulletsInScene[bltIdx].id)) {
          tankBulletsInScene[bltIdx].removeBullet();
          delete tankBulletsInScene[bltIdx];
        }
      }
    }
  }

  updateExplosion(tankData: TankPositions) {
    // TODO clear game.explosions array
    for(const tankId in tankData) {
      const explosionsData = tankData[tankId].e;
      explosionsData.forEach(exp => {
        const explosion = new Explosion(new THREE.Color(0xffff00), this.scene);
        this.explosions.push(explosion);
        explosion.explode(new THREE.Vector3(exp.x, exp.y, exp.z));
        return explosion;
      });
    }
  }

  updateCameraToTank(myTank: Tank) {
    const {position, rotation} = myTank.model;

    this.camera.position.x = position.x - 2 * Math.sin(rotation.z);
    this.camera.position.z = position.z - 2 * Math.cos(rotation.z);
    this.camera.lookAt(
      position.x + 10 * Math.sin(rotation.z - this.cameraRotationXZOffset),
      -10 * Math.atan(this.cameraRotationYOffset),
      position.z + 10 * Math.cos(rotation.z - this.cameraRotationXZOffset));
  }

  updateCamera() {
    const myTank = this.getMyTank();
    if (myTank) {
      this.updateCameraToTank(myTank);
    }
  }

  onKeyDown (event: KeyboardEvent) {
    if (this.chatReady) {
      return;
    }
    switch (event.code) {
      case 'KeyW': {
        this.sounds.playEngineRun();
        if (this.moveStatus.keyW != '1') {
          this.messager.sendMessage(`${MessageType.TANK_MOVE_FORWARD},1`);
        }
        this.moveStatus.keyW = '1';
        break
      }
      case 'KeyA': {
        this.sounds.playEngineRun();
        if (this.moveStatus.keyA != '1') {
          this.messager.sendMessage(`${MessageType.TANK_ROTATE_LEFT},1`);
        }
        this.moveStatus.keyA = '1';
        break
      }
      case 'KeyS': {
        this.sounds.playEngineRun();
        if (this.moveStatus.keyS != '1') {
          this.messager.sendMessage(`${MessageType.TANK_MOVE_BACKWARD},1`);
        }
        this.moveStatus.keyS = '1';
        break;
      }
      case 'KeyD': {
        this.sounds.playEngineRun();
        if (this.moveStatus.keyD != '1') {
          this.messager.sendMessage(`${MessageType.TANK_ROTATE_RIGHT},1`);
        }
        this.moveStatus.keyD = '1';
        break
      }
      case 'Space': {
        this.moveStatus.keySpace = '1';
        break;
      }
    }
  }

  onKeyUp(event: KeyboardEvent) {
    if (this.chatReady) {
      return;
    }
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
      case 'Space': {
        this.sounds.playTankShoot();
        if (this.moveStatus.keySpace != '0') {
          this.messager.sendMessage(MessageType.TANK_SHOOT);
        }
        this.moveStatus.keySpace = '0';
        break;
      }
      case 'Escape': {
        this.settings.toggleSetting();
        break;
      }
    }
    if (this.moveStatus.keyW == '0' && this.moveStatus.keyA == '0'
      && this.moveStatus.keyS == '0' && this.moveStatus.keyD == '0') {
        this.sounds.stopEngineRun();
    }
  }

  sendChat() {
    const chatContent = this.chat.getChatInputContent();
    if (!chatContent) {
      return;
    }
    this.messager.sendMessage(`${MessageType.CHAT_SEND},${chatContent}`);
    this.chat.clearChatInputContent();
  }

  onSendChat(event: KeyboardEvent) {
    if (event.code !== 'Enter') {
      return;
    }
    this.sendChat();
  }

  onActiveChat() {
    this.chatReady = true;
  }

  onDeactiveChat() {
    this.chatReady = false;
  }

  onDocumentMouseMove(event: MouseEvent) {
    if (this.settings.settingShown || this.settings.bulletin.bulletinShow) {
      return;
    }
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
