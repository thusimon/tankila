import { GameConfigType } from './data/Types';
import TankMe from './tank/tankMe';
import TankPlayer from './tank/tankPlayer';
import TankRobot from './tank/tankRobot';
import p5 from 'p5';
import Point from './data/Point';
import { TankStatus } from './data/Types';
import { isCircleHitRect } from './utils/collision';
import { getRandomNumber } from './utils/urls';
import Circle from './data/Circle';
import Messge from './message';
import Message from './message';

class Game {
  config: GameConfigType;
  p5: p5;
  sketch: p5;
  me: TankMe;
  enemies: TankRobot[];
  players: {[key: string]: TankPlayer};
  canvas: p5.Renderer;
  score: number;
  message: Message;
  id: string;
  constructor(config: GameConfigType) {
    this.config = config;
    this.p5 = new p5((sketch) => {
      sketch.setup = () => {
        this.setupGame(sketch);
      };
      sketch.draw = () => {
        this.runGame();
      };
    });
    this.enemies = [];
    this.players = {};
    this.id = getRandomNumber();
    this.message = new Messge(this.id);
    this.score = 0;
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
      this.me = new TankMe(this.p5, this.config, this.id, this.message, this.getRandTankStatus());
      this.message.listenOnMessage(this.handleMessages.bind(this));
    }
  }

  runGame(): void {
    //clear all canvas
    this.sketch.background('#F3F3F3');
    const p5 = this.p5;
    p5.fill(0, 0, 255);
    p5.stroke(0, 0, 255);
    p5.textSize(32);
    this.p5.text(`Score: ${this.score}`, 20, 40);

    if (this.me) {
      this.me.draw();
    }

    for(const playerId in this.players) {
      const p = this.players[playerId];
      p.draw();
    }
    
    this.checkIfHit();
  }

  handleMessages(data: string): void {
    const typeIdx = data.indexOf(',');
    const messageType = data.substring(0, typeIdx);
    const messageData = data.substring(typeIdx + 1);
    switch (messageType) {
      case 'pos':
        this.updatePlayers(messageData);
        break;
      case 'blt':
        this.updateBullets(messageData);
        break;
      case 'ext':
        this.updateExit(messageData);
        break;
      default:
        break;
    }
  }
  updatePlayers(data: string): void {
    const dataParse = JSON.parse(data);
    // remove my own tank
    delete dataParse[this.id];
    for (const playerId in dataParse) {
      const playerTankData = dataParse[playerId].split(',');
      const position = new Point(+playerTankData[0], +playerTankData[1]);
      const rotation = +playerTankData[2];
      const player = this.players[playerId];
      if (player) {
        player.updateStatus(position, rotation);
      } else {
        const playerTank = new TankPlayer(this.p5, this.config, playerId);
        playerTank.updateStatus(position, rotation);
        this.players[playerId] = playerTank;
      }
    }
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
  }

  addEnemy(): void {
    const enemyCount = this.enemies.length;
    this.enemies.push(new TankRobot(this.p5, this.config, `robot${enemyCount}`, this.getRandTankStatus()));
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
                this.score++;
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