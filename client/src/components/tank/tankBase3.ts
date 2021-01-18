import * as THREE from 'three';
import { GameConfig, TankStatus } from '../../data/Types';
import p5 from 'p5';
import Point from '../../data/Point';
import Size from '../../data/Size';
import Rect from '../../data/Rect';
import Circle from '../../data/Circle';
import Bullet from '../bullet';
import { isCircleInBound } from '../utils/collision';
import { BoxGeometry, Clock, CylinderGeometry, Mesh, MeshBasicMaterial, Scene, PolyhedronGeometry } from 'three';

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
  towerGeometry: CylinderGeometry;
  cannonGeometry: CylinderGeometry;
  material: MeshBasicMaterial;
  body: Mesh;
  clock: Clock;
  constructor(scene: Scene, config: GameConfig, clock: Clock, initStatus?: TankStatus) {
    this.clock = clock;
    this.material = new THREE.MeshPhongMaterial( { color: 0xffff00 } );

    // const verticesOfCube = [
    //   -4,-3, 2,         4,-3, 2,        4, 3, 2,        -4, 3, 2,
    //   -3.3,-2.5, 0,     3.3,-2.5, 0,    3.3, 2.5, 0,    -3.3, 2.5, 0,
    // ];
  
    // const indicesOfFaces = [
    //   2,1,0,    0,3,2,
    //   0,4,7,    7,3,0,
    //   0,1,5,    5,4,0,
    //   1,2,6,    6,5,1,
    //   2,3,7,    7,6,2,
    //   4,5,6,    6,7,4
    // ];
    //this.bodyGeometry = new THREE.PolyhedronGeometry(verticesOfCube, indicesOfFaces, 6, 2);
    //this.bodyGeometry = new THREE.CylinderGeometry(8, 6, 2, 4, 1);
    //this.bodyGeometry.rotateX(Math.PI / 2);
    this.bodyGeometry = new THREE.BoxGeometry(8, 6, 1.2);
    this.towerGeometry = new THREE.CylinderGeometry(2, 2, 1, 16);
    this.towerGeometry.rotateX(Math.PI / 2);
    this.towerGeometry.translate(0, 0, 1.1);
    this.cannonGeometry = new THREE.CylinderGeometry(0.5, 0.25, 8, 16);
    this.cannonGeometry.rotateZ(Math.PI / 2);
    this.cannonGeometry.translate(5, 0, 1.1);

    this.bodyGeometry.merge(this.towerGeometry);
    this.bodyGeometry.merge(this.cannonGeometry);

    this.body = new THREE.Mesh(this.bodyGeometry, this.material);

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