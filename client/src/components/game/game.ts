import { GameConfig } from '../../data/Types';
import TankMe from '../tank/tankMe';
import TankPlayer from '../tank/tankPlayer';
import TankRobot from '../tank/tankRobot';
import p5 from 'p5';
import Point from '../../data/Point';
import { TankStatus } from '../../data/Types';
import { isCircleHitRect } from '../utils/collision';
import Circle from '../../data/Circle';
import Messge from '../message';
import Message from '../message';

class Game {
  config: GameConfig;
  p5: p5;
  sketch: p5;
  me: TankMe;
  robots: TankRobot[];
  players: {[key: string]: TankPlayer};
  canvas: p5.Renderer;
  score: {[key: string]: number};
  message: Message;
  id: string;
  constructor(config: GameConfig) {
    this.config = config;
    this.robots = [];
    this.players = {};
    this.id = config.id;
    this.message = new Messge(this.id);
    this.p5 = new p5((sketch) => {
      sketch.setup = () => {
        this.setupGame(sketch);
      };
      sketch.draw = () => {
        this.runGame();
      };
    });
  }

  async setupGame(sketch: p5) {
    this.sketch = sketch;
    // remove the previous canvas
    const curCanvas = document.querySelector(`#${this.config.canvasParentId} canvas`);
    if(curCanvas) {
      curCanvas.remove();
    }
    this.canvas = sketch.createCanvas(this.config.width, this.config.height);
    this.canvas.parent(this.config.canvasParentId);

    const isConnected = await this.message.getConnection();
    if (isConnected) {
      const tankStatus = this.getRandTankStatus();
      this.me = new TankMe(this.p5, this.config, this.id, this.message, tankStatus);
      this.message.listenOnMessage(this.handleMessages.bind(this));
      setInterval(() => {
        this.message.sendMessage(`pos,${this.me.position.x},${this.me.position.y},${this.me.rotation}`);
      }, this.config.syncRate);
    }
  }

  runGame(): void {
    //clear all canvas
    this.sketch.background('#F3F3F3');
    this.drawScore();

    if (this.me) {
      this.me.draw();
    }

    for(const playerId in this.players) {
      const p = this.players[playerId];
      p.draw();
    }
    
    this.checkIfHit();
  }

  drawScore(): void {
    const p5 = this.p5;
    p5.fill(0, 0, 255);
    p5.stroke(0, 0, 255);
    p5.textSize(32);
    Object.keys(this.score).forEach((tankId, idx) => {
      p5.text(`${tankId}: ${this.score[tankId]}`, 20, 40 + 32 * idx);
    });
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
      const playerStatus: TankStatus = {
        position: new Point(+data[0], +data[1]),
        rotation: +data[2]
      };
      const player = this.players[tankId];
      if (player) {
        player.updateStatus(playerStatus.position, playerStatus.rotation);
      } else {
        this.players[tankId] = new TankPlayer(this.p5, this.config, tankId, playerStatus);
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
    const [id, x, y, r] = data.split(',');
    // skip my own bullet
    if (id === this.id) {
      return;
    }
    // add the bullet to the player
    const player = this.players[id];
    if (player) {
      player.addBullet(+x, +y, +r);
    }
  }

  updateExit(id: string): void {
    delete this.players[id];
    delete this.score[id];
  }

  addRobots(): void {
    const enemyCount = this.robots.length;
    this.robots.push(new TankRobot(this.p5, this.config, `robot${enemyCount}`, this.getRandTankStatus()));
  }

  getRandTankStatus(): TankStatus {
    const randPoint = new Point(Math.random()*this.config.width, Math.random()*this.config.height);
    const randStatus = {
      position: randPoint,
      rotation: Math.random()* 2 * this.p5.PI
    };
    return randStatus;
  }

  checkIfHit(): void {
    const allTanks = {...this.players, [this.id]: this.me};

    for (const tankId in allTanks) {
      const tank = allTanks[tankId];
      if (!tank) {
        continue;
      }
      for (const tb of tank.bullets) {
        if (tb.isHit) {
          continue;
        }
        const tbCircle = new Circle(tb.position, tb.radius);
        for (const playerId in allTanks) {
          if (playerId != tankId){
            // never check if hit self
            const enemy = allTanks[playerId];
            if (isCircleHitRect(tbCircle, enemy.body)) {
              console.log(`tank ${tankId} bullet hits tank ${playerId}`);
              if (tankId == this.id) {
                this.message.sendMessage(`hit,${this.id}`);
              }
              tb.isHit = true;
            }
          }
        }
      }
      tank.bullets = tank.bullets.filter(tb => !tb.isHit);
    }
  }
}

export default Game;