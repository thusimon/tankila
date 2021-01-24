import React from 'react';
import ReactDOM from 'react-dom';
import * as THREE from 'three';
/* eslint-disable @typescript-eslint/no-var-requires */
const Stats = require('stats-js');
/* eslint-enable @typescript-eslint/no-var-requires */
import { PerspectiveCamera, Scene, WebGLRenderer, Clock, Vector3, DirectionalLight, AmbientLight, Color, MathUtils } from 'three';
import { DebugInfo, GameConfig, TankData3, TankStatus3 } from '../../data/Types';
// import Debug from '../info/debug';
import Score from '../info/score';
import TankMe3 from '../tank/tankMe3';
import TankBase3 from '../tank/tankBase3';
import Message from '../message';

class Game3 {
  config: GameConfig;
  message: Message;
  id: string;
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  me: TankMe3;
  players: {[key: string]: TankBase3};
  clock: Clock;
  light: DirectionalLight;
  stats: Stats;
  playBoundary: Vector3;
  scoreContainer: HTMLDivElement;
  constructor(config: GameConfig) {
    this.config = config;
    this.id = config.id;
    this.players = {};
    this.message = new Message(this.id);
    this.scene = new Scene();
    this.scene.background = new THREE.Color(0xACDF87);
    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 999);
    
    this.camera.position.set(0, 0, 150);
    this.camera.lookAt(0, 0, -150);
    
    const envLight = new AmbientLight(0xffffff, 0.5);
    this.scene.add(envLight);
    this.light = new DirectionalLight(0xffffff, 1); // soft white light
    this.light.position.set(0, -80, 150);
    this.light.target.position.set(0, 0, 0);
    this.scene.add(this.light);
    this.scene.add(this.light.target);
    
    this.renderer = new WebGLRenderer({antialias: true});
    this.renderer.setSize( window.innerWidth, window.innerHeight );

    this.stats = new Stats();
    this.stats.showPanel(0);

    const scoreJSX = React.createElement(Score, {scores: [], id: this.id});

    const gameContainer = document.getElementById(config.canvasParentId)!;
    const statContainer = document.getElementById('stat-container')!;
    this.scoreContainer = document.createElement('div');
    this.scoreContainer.id = 'score-containter';
    ReactDOM.render(scoreJSX, this.scoreContainer);
    
    gameContainer.appendChild(this.renderer.domElement);
    this.stats.dom.style.removeProperty('position');
    statContainer.appendChild(this.stats.dom);
    gameContainer.appendChild(this.scoreContainer);

    this.registerEvents();
    this.clock = new Clock();
    this.clock.getDelta();

    this.animate();
  }

  async addMe() {
    const isConnected = await this.message.getConnection();
    if (isConnected) {
      this.updatePlayBoundary();
      const initX = MathUtils.randFloat(-this.playBoundary.x, this.playBoundary.x);
      const initY = MathUtils.randFloat(-this.playBoundary.y, this.playBoundary.y);
      const initR = MathUtils.randFloat(0, Math.PI);
      // add a tank
      // this.me = new TankMe3(this.scene, this.config, this.message, this.playBoundary, initStatus);
      this.message.sendMessage(`st3,${initX},${initY},${initR},${Date.now()}`);
      this.message.sendMessage(`bon,${this.playBoundary.x},${this.playBoundary.y}`);
      this.message.listenOnMessage(this.handleMessages.bind(this));
    }
  }

  animate(): void {
    this.stats.begin();
    requestAnimationFrame(this.animate.bind(this));
    this.renderer.render(this.scene, this.camera);
    if (this.me) {
      // this.updateDebugInfo();
      // check bullet hits
      const playersArr = Object.values(this.players).map(p => p.mesh);
      for (const bltIdx in this.me.bullets) {
        const blt = this.me.bullets[bltIdx];
        if (blt.isHit) {
          continue;
        }
        blt.isHit = blt.collisionWithMeshes(playersArr);
        if (blt.isHit) {
          this.message.sendMessage(`hit3,${bltIdx}`);
        }
      }
      this.updateScore();
    }
    this.stats.end();
  }

  updateCamera(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  updatePlayBoundary(): void {
    const vec = new Vector3();
    const pos = new Vector3();
    vec.set(1, 1, 0.5);
    vec.unproject(this.camera);
    vec.sub(this.camera.position).normalize();
    const distance = -this.camera.position.z / vec.z;
    pos.copy(this.camera.position).add(vec.multiplyScalar(distance));
    this.playBoundary = pos;
  }

  updateDebugInfo(): void {
    const debugInfo: DebugInfo = {
      playerPosition: this.me.mesh.position,
      playerRotation: this.me.mesh.rotation
    };
    console.log(debugInfo);
    // const debugJSX = React.createElement(Debug, debugInfo);
    // ReactDOM.render(debugJSX, this.debugContainer);
  }

  updateScore(): void {
    const myScore = {id: this.me.id, score: this.me.score};
    const playerScores = Object.values(this.players).map(player => ({id: player.id, score: player.score}));
    playerScores.push(myScore);
    playerScores.sort((a, b) => b.score - a.score);
    const scoreJSX = React.createElement(Score, {scores: playerScores, id: myScore.id});
    ReactDOM.render(scoreJSX, this.scoreContainer);
  }

  registerEvents(): void {
    window.addEventListener('resize', () => {
      this.updateCamera();
      if (this.me) {
        this.updatePlayBoundary();
        this.message.sendMessage(`bon,${this.playBoundary.x},${this.playBoundary.y}`);
      }
      this.renderer.setSize( window.innerWidth, window.innerHeight );
    });
    window.addEventListener('keydown', this.keydownListener.bind(this));
    window.addEventListener('keyup', this.keyupListener.bind(this));
  }

  keydownListener(evt: KeyboardEvent): void {
    if (!this.me) {
      return;
    }
    if (evt.key === 'w') {
      this.me.moveForward();
    }
    if (evt.key === 's') {
      this.me.moveBackward();
    }
    if (evt.key === 'a') {
      this.me.rotateLeft();
    }
    if (evt.key === 'd') {
      this.me.rotateRight();
    }
    if (evt.key === ' ' && this.me.allowShoot) {
      this.me.allowShoot = false;
      this.me.shoot();
    }
  }

  keyupListener(evt: KeyboardEvent): void {
    if (!this.me) {
      return;
    }
    if (evt.key === 'w' && this.me.isMovingForward()) {
      this.me.stopMoving();
    }
    if (evt.key === 's' && this.me.isMovingBackward()) {
      this.me.stopMoving();
    }
    if (evt.key === 'a' && this.me.isRotatingLeft()) {
      this.me.stopRotating();
    }
    if (evt.key === 'd' && this.me.isRotatingRight()) {
      this.me.stopRotating();
    }
    if (evt.key === ' ') {
      this.me.allowShoot = true;
    }
  }

  handleMessages(data: string): void {
    const typeIdx = data.indexOf(',');
    const messageType = data.substring(0, typeIdx);
    const messageData = data.substring(typeIdx + 1);
    switch (messageType) {
      case 'pos3':
        this.updatePlayersAndBulletsPostion(messageData);
        break;
      case 'blt':
        this.updateBullets(messageData);
        break;
      default:
        break;
    }
  }

  updatePlayersAndBulletsPostion(commandData: string): void {
    const tanksData = JSON.parse(commandData);
    const tanksDataIdxArrServer = Object.keys(tanksData);
    const tanksDataIdxArrLocal = Object.keys(this.players);
    tanksDataIdxArrServer.forEach(tankId => {
      const tankData: TankData3 = tanksData[tankId];
      if (tankId === this.id) {
        if (!this.me) {
          const status: TankStatus3 = {
            color: new Color(0xffff00),
            bltColor: new Color(0xff0000)
          };
          this.me = new TankMe3(this.scene, this.id, this.message, this.playBoundary, status);
          this.message.sendMessage(`stup,${this.me.speedMove},${this.me.speedRotate},${this.me.speedBullet}`);
        }
        this.me.updatePosByServer(tankData.pos.x, tankData.pos.y, tankData.pos.r);
        this.me.updateBulletsByServer(tankData.blt, tankId);
        this.me.score = tankData.scor;
      } else {
        if (!this.players[tankId]) {
          const status: TankStatus3 = {
            color: new Color(0x00ffff),
            bltColor: new Color(0xff0000)
          };
          const player = new TankBase3(this.scene, tankId, status);
          this.players[tankId] = player;
        }
        const player = this.players[tankId];
        player.updatePosByServer(tankData.pos.x, tankData.pos.y, tankData.pos.r);
        player.updateBulletsByServer(tankData.blt, tankId);
        player.score = tankData.scor;
      }
    });

    // find which tank has left the game
    const deletedTanks = tanksDataIdxArrLocal.filter(idxLocal => !tanksDataIdxArrServer.includes(idxLocal));
    deletedTanks.forEach(deletedIdx => {
      this.players[deletedIdx].destory();
      delete this.players[deletedIdx];
      console.log(`player ${deletedIdx} exits`);
    });
  }

  updateBullets(data: string): void {
    const [id] = data.split(',');
    // skip my own bullet
    if (id === this.id) {
      return;
    }
    // add the bullet to the player
  }
}

export default Game3;