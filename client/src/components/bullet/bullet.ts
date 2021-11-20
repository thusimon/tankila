import * as THREE from 'three';

class Bullet {
  model: THREE.Mesh;
  scene: THREE.Scene;
  id: number = 0;
  position: THREE.Vector3 = new THREE.Vector3();
  constructor(scene: THREE.Scene, x:number, y: number, z: number, id: number) {
    this.scene = scene;
    this.id = id;
    const bulletGeo = new THREE.SphereGeometry(0.1, 8, 8); 
    const bulletMaterial = new THREE.MeshBasicMaterial({ 
      color: new THREE.Color(255, 255, 0)
    });
    this.model = new THREE.Mesh(bulletGeo, bulletMaterial);
    this.updatePosition(x, y, z);
  }

  updatePosition(x: number, y: number, z: number) {
    this.position.copy(new THREE.Vector3(x, y, z));
  }

  removeBullet() {
    this.scene.remove(this.model);
  }

  addBullet() {
    this.scene.add(this.model);
  }
}

export default Bullet;
