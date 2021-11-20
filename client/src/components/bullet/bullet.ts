import * as THREE from 'three';

class Bullet {
  model: THREE.Mesh;
  scene: THREE.Scene
  constructor(scene: THREE.Scene, x:number, y: number, z: number) {
    this.scene = scene;
    const bulletGeo = new THREE.SphereGeometry(0.1, 8, 8); 
    const bulletMaterial = new THREE.MeshBasicMaterial({ 
      color: new THREE.Color(255, 255, 0)
    });
    this.model = new THREE.Mesh(bulletGeo, bulletMaterial);
    this.model.position.set(x, y, z);
  }

  removeBullet() {
    this.scene.remove(this.model);
  }

  addBullet() {
    this.scene.add(this.model);
  }
}

export default Bullet;
