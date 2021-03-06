import { Euler, Vector3, MeshBasicMaterial, MeshPhongMaterial, SphereGeometry, Mesh, Scene, Raycaster, Color } from 'three';

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
  scene: Scene;
  idx: number;
  constructor(scene: Scene, id: string, p0: Vector3, r0: Euler, spd: number, idx: number, color: Color) {
    this.scene = scene;
    this.radius = 0.5;
    this.speed = spd;
    this.id = id;
    this.position = p0.clone();
    this.rotation = r0.clone();
    this.idx = idx;
    this.material = new MeshPhongMaterial({color});
    this.geo = new SphereGeometry( this.radius, 8, 8 );
    this.mesh = new Mesh(this.geo, this.material);
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    this.mesh.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
    this.scene.add(this.mesh);
  }

  collisionWithMeshes(meshes: Mesh[]): boolean {
    const originPoint = this.mesh.position.clone();
    const directionVector = new Vector3(0, 0, -1); // always pointing to the ground
    const ray = new Raycaster(originPoint, directionVector);
    const collisionResults = ray.intersectObjects(meshes);
    if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
      console.log('hit the mesh!');
      return true;
    } else {
      return false;
    }
  }

  destory(): void {
    this.geo.dispose();
    this.material.dispose();
    this.scene.remove(this.mesh);
  }
}

export default Bullet3;