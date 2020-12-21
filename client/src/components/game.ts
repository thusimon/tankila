import { GameConfigType } from './data/Types';
import TankPlayer from './tank/tankPlayer';
import TankRobot from './tank/tankRobot';
import p5 from 'p5';
import Point from './data/Point';
import { TankStatus } from './data/Types';
import { isCircleHitRect } from './utils/collision';
import Circle from './data/Circle';

class Game {
  config: GameConfigType;
  p5: p5;
  sketch: p5;
  player: TankPlayer;
  enemies: TankRobot[];
  canvas: p5.Renderer;
  score: number;
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
    this.player = new TankPlayer(this.p5, config, 'player', this.getRandTankStatus());
    this.enemies = [];
    this.score = 0;
  }

  setupGame(sketch: p5): void {
    this.sketch = sketch;
    // remove the previous canvas
    const curCanvas = document.querySelector(`#${this.config.canvasParentId} canvas`);
    if(curCanvas) {
      curCanvas.remove();
    }
    this.canvas = sketch.createCanvas(this.config.width, this.config.height);
    this.canvas.parent(this.config.canvasParentId);
  }

  runGame(): void {
    //clear all canvas
    this.sketch.background('#F3F3F3');
    this.player.draw();

    if (this.enemies.length <= 4) {
      this.addEnemy();
    }


    this.enemies.forEach(et => {
      et.draw();
    });

    this.checkIfHit();

    const p5 = this.p5;
    p5.textSize(32);
    this.p5.text(`Score: ${this.score}`, 20, 40);
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
    this.player.bullets.forEach(pb => {
      if (pb.isHit) {
        return;
      }
      const pbCircle = new Circle(pb.position, pb.radius);
      this.enemies.forEach(e => {
        if (isCircleHitRect(pbCircle, e.body) && e.isLive) {
          this.score++;
          e.isLive = false;
          pb.isHit = true;
        }
      });
    });

    this.enemies = this.enemies.filter(e=> e.isLive);
    this.player.bullets = this.player.bullets.filter(pb => !pb.isHit);
  }
}

export default Game;