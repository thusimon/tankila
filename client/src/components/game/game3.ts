import React from 'react';
import ReactDOM from 'react-dom';
import * as THREE from 'three';
/* eslint-disable @typescript-eslint/no-var-requires */
const Stats = require('stats-js');
/* eslint-enable @typescript-eslint/no-var-requires */
import { PerspectiveCamera, Scene, WebGLRenderer, Clock, Vector3, Euler, DirectionalLight, AmbientLight } from 'three';
import { DebugInfo, GameConfig, TankData3 } from '../../data/Types';
import Debug from '../debug/debug';
import TankMe3 from '../tank/tankMe3';
import TankBase3 from '../tank/tankBase3';
import Message from '../message';

class Game3 {
  config: GameConfig;
  score: {[key: string]: number};
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
  debugContainer: HTMLDivElement;
  playBoundary: Vector3;
  constructor(config: GameConfig) {
    this.config = config;
    this.id = config.id;
    this.score = {};
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

    this.updatePlayBoundary();

    this.stats = new Stats();
    this.stats.showPanel(0);

    const debugInfo = {playerPosition: new Vector3(0, 0, 0), playerRotation: new Euler(0, 0, 0)};
    const debugJSX = React.createElement(Debug, debugInfo);

    const gameContainer = document.getElementById(config.canvasParentId)!;
    this.debugContainer = document.createElement('div');
    this.debugContainer.id = 'debug-containter';
    ReactDOM.render(debugJSX, this.debugContainer);
    
    gameContainer.appendChild(this.renderer.domElement);
    gameContainer.appendChild(this.stats.dom);
    gameContainer.appendChild(this.debugContainer);

    this.registerEvents();
    this.clock = new Clock();
    this.clock.getDelta();

    this.animate();
  }

  async addMe() {
    const isConnected = await this.message.getConnection();
    if (isConnected) {
      // add a tank
      this.me = new TankMe3(this.scene, this.config, this.message, this.playBoundary);
      this.message.sendMessage(`st3,0,0,0,${this.me.speedMove},${this.me.speedRotate},${this.me.speedBullet},${Date.now()}`);
      this.message.listenOnMessage(this.handleMessages.bind(this));
    }
  }

  animate(): void {
    this.stats.begin();
    const deltaTime = this.clock.getDelta();
    requestAnimationFrame(this.animate.bind(this));
    this.renderer.render(this.scene, this.camera);
    if (this.me) {
      this.me.update(deltaTime);
      this.updateDebugInfo();
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
    const debugJSX = React.createElement(Debug, debugInfo);
    ReactDOM.render(debugJSX, this.debugContainer);
  }

  registerEvents(): void {
    window.addEventListener('resize', () => {
      this.updateCamera();
      this.updatePlayBoundary();
      if (this.me) {
        this.me.updateBoundary(this.playBoundary);
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
        //console.log(185, messageData);
        this.updatePlayersPostion(messageData);
        break;
      case 'fwd':
      case 'bwd':
      case 'rl':
      case 'rr':
        this.updatePlayer(messageType, messageData);
        break;
      case 'blt':
        this.updateBullets(messageData);
        break;
      case 'hit':
        this.updateScore(messageData);
        break;
      case 'ext':
        this.updateExit(messageData);
        break;
      default:
        break;
    }
  }

  updatePlayersPostion(commandData: string): void {
    const tanksData = JSON.parse(commandData);
    for (const tankId in tanksData) {
      if (tankId === this.id) {
        const tankData: TankData3 = tanksData[tankId];
        this.me.updatePosByServer(tankData.pos.x, tankData.pos.y, tankData.pos.r);
      } else {
        //TODO update other tanks data
      }
    }
  }

  updatePlayer(commandType: string, commandData: string): void {
    const data = commandData.split(',');
    const id = data[0];
    const commandValue = +data[1];
    if (id === this.id || !this.players[id]) {
      // no need to update myself or invald player
      return;
    }
    const player = this.players[id];
    const playerCommandUpdate = {[commandType]: !!commandValue};
    player.tankCommands = {...player.tankCommands, ...playerCommandUpdate};
  }

  updateScore(scoreData: string): void {
    this.score = JSON.parse(scoreData);
  }

  updateBullets(data: string): void {
    const [id] = data.split(',');
    // skip my own bullet
    if (id === this.id) {
      return;
    }
    // add the bullet to the player
  }

  updateExit(id: string): void {
    delete this.score[id];
  }

  addRobots(): void {
    console.log(1);
  }

  checkIfHit(): void {
    console.log(1);
  }
}

export default Game3;