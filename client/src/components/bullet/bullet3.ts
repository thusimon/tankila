import * as THREE from 'three';
import { Euler, Vector3, MeshBasicMaterial, MeshPhongMaterial, SphereGeometry, Mesh, Scene } from 'three';

class Bullet3 {
  id: string;
  radius: number;
  position: Vector3;
  rotation: Euler;
  speed: number;
  isHit = false;
  material: MeshBasicMaterial;
  geo: SphereGeometry;
  mesh: Mesh;
  scene: Scene
  constructor(scene: Scene, id: string, p0: Vector3, r0: Euler, spd: number) {
    this.scene = scene;
    this.radius = 0.5;
    this.speed = spd;
    this.id = id;
    this.position = p0.clone();
    this.rotation = r0.clone(); 
    this.material = new MeshPhongMaterial({ color: 0xff0000 });
    this.geo = new SphereGeometry( this.radius, 8, 8 );
    this.mesh = new Mesh(this.geo, this.material);
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    this.mesh.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
    this.scene.add(this.mesh);
  }

  update(deltaTime: number, boundary: Vector3): void {
    const speed = this.speed * deltaTime;
    this.mesh.translateOnAxis(new Vector3(1, 0, 0), speed);
    if (this.isBulletOutSideBoundary(boundary)) {
      this.destory();
      this.isHit = true;
    }
  }

  isBulletOutSideBoundary(boundary: Vector3): boolean {
    return this.mesh.position.x > boundary.x || this.mesh.position.x < -boundary.x ||
      this.mesh.position.y > boundary.y || this.mesh.position.y < -boundary.y;
  }

  destory(): void {
    this.geo.dispose();
    this.material.dispose();
    this.scene.remove(this.mesh);
    console.log('destory bullet');
  }
}

export default Bullet3;