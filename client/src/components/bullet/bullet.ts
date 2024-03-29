import * as THREE from 'three';

class Bullet {
  model: THREE.Mesh;
  scene: THREE.Scene;
  position: THREE.Vector3 = new THREE.Vector3();
  id = 0;
  constructor(scene: THREE.Scene, x:number, y: number, z: number, id: number, radius = 0.1, color: THREE.Color = new THREE.Color(255, 255, 0)) {
    this.scene = scene;
    this.id = id;
    const bulletGeo = new THREE.SphereGeometry(radius, 8, 8); 
    const bulletMaterial = new THREE.MeshBasicMaterial({ 
      color
    });
    this.model = new THREE.Mesh(bulletGeo, bulletMaterial);
    this.updatePosition(x, y, z);
  }

  updatePosition(x: number, y: number, z: number): void {
    this.position.copy(new THREE.Vector3(x, y, z));
  }

  removeBullet(): void {
    this.scene.remove(this.model);
  }

  addBullet(): void {
    this.scene.add(this.model);
  }
}

export default Bullet;
