import * as THREE from 'three';
import { TankStatus3, BulletData, TankTransformStatus } from '../../data/Types';
import Bullet3 from '../bullet/bullet3';
import { BoxGeometry, Color, CylinderGeometry, Mesh, MeshBasicMaterial, Scene, Vector3, Euler, Texture, SpriteMaterial, Sprite } from 'three';

class TankBase3 {
  speedMove: number;
  speedRotate: number;
  speedBullet: number;
  id: string;
  bullets: {[key: string]: Bullet3};
  allowShoot = true;
  debug: boolean;
  isLive = true;
  bodyGeometry: BoxGeometry;
  towerGeometry: CylinderGeometry;
  cannonGeometry: CylinderGeometry;
  material: MeshBasicMaterial;
  mesh: Mesh;
  scene: Scene;
  color: Color;
  bltColor: Color;
  transformStatus: TankTransformStatus;
  boundary: Vector3;
  score: number;
  texture: Texture;
  spriteMaterial: SpriteMaterial;
  textSprite: Sprite;
  constructor(scene: Scene, id: string, initStatus: TankStatus3) {
    this.scene = scene;
    this.id = id;
    this.score = 0;
    this.color = initStatus.color;
    this.bltColor = initStatus.bltColor;
    this.bullets = {};
    this.transformStatus = {
      direction: 0,
      rotation: 0
    };
    this.boundary = new Vector3(0, 0, 0);
    this.material = new THREE.MeshPhongMaterial( {color: this.color} );

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

    this.makeTextSprite(this.id);
    this.scene.add(this.textSprite);
  }
  
  updateTextSprite(): void {
    if (this.textSprite) {
      const meshPos = this.mesh.position;
      this.textSprite.position.set(meshPos.x, meshPos.y + 10, meshPos.z + 2);
      this.textSprite.scale.set(10,5,1);
    }
  }
  isMovingForward(): boolean {
    return this.transformStatus.direction === 1;
  }

  moveForward(): void {
    this.transformStatus.direction = 1;
  }

  isMovingBackward(): boolean {
    return this.transformStatus.direction === -1;
  }

  moveBackward(): void {
    this.transformStatus.direction = -1;
  }

  stopMoving(): void {
    this.transformStatus.direction = 0;
  }

  isMovingStop(): boolean {
    return this.transformStatus.direction === 0;
  }

  rotateRight(): void {
    this.transformStatus.rotation = -1;
  }

  isRotatingRight(): boolean {
    return this.transformStatus.rotation === -1;
  }

  rotateLeft(): void {
    this.transformStatus.rotation = 1;
  }

  isRotatingLeft(): boolean {
    return this.transformStatus.rotation === 1;
  }

  stopRotating(): void {
    this.transformStatus.rotation = 0;
  }

  isRotatingStop(): boolean {
    return this.transformStatus.rotation === 0;
  }

  updatePosByServer(x: number, y: number, r: number): void {
    this.mesh.rotation.z = r;
    this.mesh.position.x = x;
    this.mesh.position.y = y;
    this.updateTextSprite();
  }

  updateBulletsByServer(bltsServer: BulletData[], tankId: string): void {
    // update client bullets with the bltsServer array
    bltsServer.forEach(bltServer => {
      const bltClient = this.bullets[bltServer.idx];
      if (bltClient) {
        // there is already this bullet on the client
        if (bltServer.hit) {
          // destory bullet
          bltClient.destory();
          delete this.bullets[bltServer.idx];
          console.log(`Tank ${tankId}'s bullet ${bltServer.idx} destoried`);
        } else {
          // update bullet
          bltClient.mesh.position.set(bltServer.pos.x, bltServer.pos.y, bltServer.pos.z);
        }
      } else {
        // there is no such bullet, need to create one
        const bulletPos = new Vector3(bltServer.pos.x, bltServer.pos.y, bltServer.pos.z);
        const bulletRot = new Euler(0, 0, bltServer.rot);
        const bullet = new Bullet3(this.scene, this.id, bulletPos, bulletRot, this.speedBullet, bltServer.idx, this.bltColor);
        this.bullets[bltServer.idx] = bullet; 
      }
    });
  }

  destory(): void {
    this.bodyGeometry.dispose();
    this.towerGeometry.dispose();
    this.cannonGeometry.dispose();
    this.material.dispose();
    this.scene.remove(this.mesh);
    for(const bltIdx in this.bullets) {
      this.bullets[bltIdx].destory();
    }
    this.texture.dispose();
    this.spriteMaterial.dispose();
    this.scene.remove(this.textSprite);
  }

  makeTextSprite(message: string): Sprite {
    const fontface = 'Arial';
    const fontsize = 96;
    const backgroundColor = { r:255, g:255, b:255, a: 0};
    const borderThickness = 2;
    
    const textCanvas = document.createElement('canvas');
    const context = textCanvas.getContext('2d')!;
    context.font = `bold ${fontsize}px ${fontface}`;
    context.textAlign = 'center';
  
    // background color
    context.fillStyle   = `rgba(${backgroundColor.r},${backgroundColor.g},${backgroundColor.b},${backgroundColor.a})`;
    
    context.lineWidth = borderThickness;
  
    // text color
    context.fillStyle = 'rgba(25,25,25,1.0)';
    context.fillText( message, borderThickness, fontsize + borderThickness);
  
    // canvas contents will be used for a texture
    this.texture = new Texture(textCanvas);
    this.texture.needsUpdate = true;

    this.spriteMaterial = new SpriteMaterial({map: this.texture, color: this.color});
    this.textSprite = new Sprite(this.spriteMaterial);
    return this.textSprite;  
  }
}

export default TankBase3;