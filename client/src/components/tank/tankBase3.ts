import * as THREE from 'three';
import { GameConfig, TankStatus } from '../../data/Types';
import p5 from 'p5';
import Point from '../../data/Point';
import Size from '../../data/Size';
import Rect from '../../data/Rect';
import Circle from '../../data/Circle';
import Bullet from '../bullet';
import { isCircleInBound } from '../utils/collision';
import { BoxGeometry, Clock, Mesh, MeshBasicMaterial, Scene } from 'three';

class Tank {
  p5: p5;
  config: GameConfig;
  size: Size;
  halfSize: Size;
  position: Point;
  rotation: number;
  speedMove: number;
  speedRotate: number;
  speedBullet: number;
  battleField: Rect;
  id: string;
  bullets: Bullet[];
  allowFire = true;
  debug: boolean;
  isLive = true;
  bodyGeometry: BoxGeometry;
  bodyMaterial: MeshBasicMaterial;
  body: Mesh;
  clock: Clock;
  constructor(scene: Scene, config: GameConfig, clock: Clock, initStatus?: TankStatus) {
    this.clock = clock;
    this.bodyGeometry = new THREE.BoxGeometry(24, 15, 0);
    this.bodyMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    this.body = new THREE.Mesh(this.bodyGeometry, this.bodyMaterial);

    scene.add(this.body);
  }

  debugInfo(): void {
    const p5 = this.p5;
    const rect = new Rect(this.position, this.rotation, this.size);
    const boundingP = rect.getVertexes();
    boundingP.forEach(p => {
      p5.text(p.toString(1), p.x, p.y);
    });
  }

  drawBullets(): void {
    this.bullets.forEach(b => {
      b.draw();
    });
    this.bullets = this.bullets.filter(b => {
      const circle = new Circle(b.position, b.radius);
      return isCircleInBound(circle, this.battleField);
    });
  }

  nomalizePostion(p: Point): Point {
    return new Point(p.x/this.config.width, p.y/this.config.height);
  }

  denomalizePosition(p: Point): Point {
    return new Point(p.x*this.config.width, p.y*this.config.height);
  }
}

export default Tank;