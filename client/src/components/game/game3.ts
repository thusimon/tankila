import * as THREE from 'three';
import { Mesh, PerspectiveCamera, Scene, WebGLRenderer, OrthographicCamera, Clock } from 'three';
import { GameConfig } from '../../data/Types';
import TankMe3 from '../tank/tankMe3';
import Message from '../message';

class Game {
  config: GameConfig;
  score: {[key: string]: number};
  message: Message;
  id: string;
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  player: TankMe3;
  clock: Clock;
  constructor(config: GameConfig) {
    this.config = config;
    this.id = config.id;
    this.score = {};
    this.message = new Message(this.id);
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xACDF87);
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    //this.camera = new THREE.OrthographicCamera( -window.innerWidth / 2, window.innerWidth / 2, window.innerHeight / 2, -window.innerHeight / 2, 1, 1000 );
    this.camera.position.z = 800;
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementById(config.canvasParentId)!.appendChild(this.renderer.domElement);
    this.registerEvents();
    this.clock = new THREE.Clock();
    // add a tank
    this.player = new TankMe3(this.scene, config, this.message, this.clock);
    this.animate();
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.renderer.render(this.scene, this.camera);
    this.player.update();
  }

  registerEvents() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize( window.innerWidth, window.innerHeight );
    });
    window.addEventListener('keydown', this.keydownListener.bind(this));
    window.addEventListener('keyup', this.keyupListener.bind(this));
  }

  keydownListener(evt: KeyboardEvent) {
    if (evt.key === 'w') {
      this.player.moveForward();
    }
    if (evt.key === 's') {
      this.player.moveBackward();
    }
    if (evt.key === 'a') {
      this.player.rotateLeft();
    }
    if (evt.key === 'd') {
      this.player.rotateRight();
    }
  }

  keyupListener(evt: KeyboardEvent) {
    if (evt.key === 'w' && this.player.isMovingForward()) {
      this.player.stopMoving();
    }
    if (evt.key === 's' && this.player.isMovingBackward()) {
      this.player.stopMoving();
    }
    if (evt.key === 'a' && this.player.isRotatingLeft()) {
      this.player.stopRotating();
    }
    if (evt.key === 'd' && this.player.isRotatingRight()) {
      this.player.stopRotating();
    }
  }

  handleMessages(data: string): void {
    const typeIdx = data.indexOf(',');
    const messageType = data.substring(0, typeIdx);
    const messageData = data.substring(typeIdx + 1);
    switch (messageType) {
      case 'pos':
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
      const data = tanksData[tankId].split(',');
      if (tankId === this.id) {
        // no need to create myself
        continue;
      }
    }
  }

  updatePlayer(commandType: string, commandData: string): void {
    const data = commandData.split(',');
    const id = data[0];
    const commandValue = +data[1];
  }

  updateScore(scoreData: string): void {
    this.score = JSON.parse(scoreData);
  }

  updateBullets(data: string): void {
    const [id, x, y, r] = data.split(',');
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

export default Game;