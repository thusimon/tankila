import * as THREE from 'three';
import { GameConfig, TankStatus, TankCommands } from '../../data/Types';
import Bullet3 from '../bullet/bullet3';
import { BoxGeometry, CylinderGeometry, Mesh, MeshBasicMaterial, Scene, Vector3 } from 'three';

class TankBase3 {
  config: GameConfig;
  speedMove: number;
  speedRotate: number;
  speedBullet: number;
  id: string;
  bullets: Bullet3[];
  allowShoot = true;
  debug: boolean;
  isLive = true;
  bodyGeometry: BoxGeometry;
  towerGeometry: CylinderGeometry;
  cannonGeometry: CylinderGeometry;
  material: MeshBasicMaterial;
  mesh: Mesh;
  tankCommands: TankCommands;
  scene: Scene;
  constructor(scene: Scene, config: GameConfig, initStatus?: TankStatus) {
    this.scene = scene;
    this.config = config;
    this.id = config.id;
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
    this.bodyGeometry = new BoxGeometry(8, 6, 1.2);
    this.towerGeometry = new CylinderGeometry(2, 2, 1, 16);
    this.towerGeometry.rotateX(Math.PI / 2);
    this.towerGeometry.translate(0, 0, 1.1);
    this.cannonGeometry = new CylinderGeometry(0.5, 0.25, 8, 16);
    this.cannonGeometry.rotateZ(Math.PI / 2);
    this.cannonGeometry.translate(5, 0, 1.1);
    this.bodyGeometry.merge(this.towerGeometry);
    this.bodyGeometry.merge(this.cannonGeometry);

    this.mesh = new Mesh(this.bodyGeometry, this.material);

    this.scene.add(this.mesh);
  }

  shoot(): void {
    const cannonPos = this.mesh.position.clone().add(new Vector3(10, 0, 1.1).applyEuler(this.mesh.rotation));
    const bullet = new Bullet3(this.scene, this.id, cannonPos, this.mesh.rotation, this.speedBullet);
    this.bullets.push(bullet);
  }
}

export default TankBase3;