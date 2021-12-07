import * as THREE from 'three'

class Explosion {
  private particleCount = 30;
  private particles: THREE.Points;
  private scene: THREE.Scene;
  public removeFlag = false;
  constructor(color: THREE.Color, scene: THREE.Scene) {
    this.scene = scene;
    const particleGeometry = new THREE.BufferGeometry();
    const vertices = [];
    for (let i = 0; i < this.particleCount; i++) {
      const vertex = new THREE.Vector3();
      vertices.push(vertex);
    }
    particleGeometry.setFromPoints(vertices);
    const pMaterial = new THREE.PointsMaterial({
      color: color,
      size: 0.08,
    });
    this.particles = new THREE.Points(particleGeometry, pMaterial);
    scene.add(this.particles);
    this.particles.visible = false;
  }

  public explode(position: THREE.Vector3): void {
    this.particles.position.x = position.x;
    this.particles.position.y = position.y;
    this.particles.position.z = position.z;

    const positions = (this.particles.geometry as THREE.BufferGeometry)
      .attributes.position.array as Array<number>;
    for (let i = 0; i < this.particleCount * 3; i = i + 3) {
      const v = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5);
      positions[i] = v.x;
      positions[i + 1] = v.y;
      positions[i + 2] = v.z;
    }
    (this.particles.geometry as THREE.BufferGeometry).attributes.position.needsUpdate = true;
    this.particles.userData.explosionPower = 1.2;
    this.particles.visible = true;
  }

  public update(): void {
    if (!this.particles.visible) {
      return;
    }
    const positions = (this.particles.geometry as THREE.BufferGeometry)
      .attributes.position.array as Array<number>;
    for (let i = 0; i < this.particleCount * 3; i = i + 3) {
      const v = new THREE.Vector3(
        positions[i],
        positions[i + 1],
        positions[i + 2]).multiplyScalar(this.particles.userData.explosionPower);
      positions[i] = v.x;
      positions[i + 1] = v.y;
      positions[i + 2] = v.z;
    }
    if (this.particles.userData.explosionPower > 1.1) {
      this.particles.userData.explosionPower -= 0.004;
      (this.particles.geometry as THREE.BufferGeometry).attributes.position.needsUpdate = true;
    } else {
      this.particles.visible = false;
      this.removeFlag = true;
      (this.particles.geometry as THREE.BufferGeometry).attributes.position.needsUpdate = false;
    }
  }

  public remove(): void {
    this.scene.remove(this.particles);
  }
}

export default Explosion;
