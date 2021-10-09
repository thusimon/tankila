import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'

const scene = new THREE.Scene()

const light = new THREE.AmbientLight()
scene.add(light)

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

camera.position.y = 1.5
camera.position.x = -2
camera.lookAt(new THREE.Vector3(10, 0, 0));

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const menuPanel = document.getElementById('menuPanel') as HTMLDivElement
const startButton = document.getElementById('startButton') as HTMLInputElement

startButton.addEventListener(
  'click',
  function () {
    menuPanel.style.display = 'none'
    renderer.domElement.addEventListener(
      'mousemove',
      onDocumentMouseMove,
      false)
  },
  false
)

const {width, height} = renderer.domElement;
let cameraRotationXZOffset = 0;
let cameraRotationYOffset = 0;
function onDocumentMouseMove(event: MouseEvent) {
  const {x, y} = event;
  const tank = scene.children[2] as THREE.Object3D;
  cameraRotationXZOffset = (x / width - 0.5) * Math.PI / 2;
  cameraRotationYOffset = (y / height - 0.5) * Math.PI / 2;

  const zr = tank.rotation.z - cameraRotationXZOffset - Math.PI / 2;
  camera.lookAt(
    tank.position.x + 10 * Math.cos(zr),
    -10 * Math.atan(cameraRotationYOffset),
    tank.position.z - 10 * Math.sin(zr))
}

const ground_texture = new THREE.TextureLoader().load('textures/grass_ground.jpg')
const material = new THREE.MeshBasicMaterial({
  map: ground_texture
});

const planeGeometry = new THREE.PlaneGeometry(100, 100, 50, 50)

const plane = new THREE.Mesh(planeGeometry, material)

ground_texture.minFilter = THREE.NearestMipmapLinearFilter
ground_texture.magFilter = THREE.NearestMipmapLinearFilter
ground_texture.wrapS = THREE.RepeatWrapping;
ground_texture.wrapT = THREE.RepeatWrapping;
ground_texture.repeat.set(16, 16); 

plane.rotateX(-Math.PI / 2)
scene.add(plane)

const onKeyDown = function (event: KeyboardEvent) {
  const tank = scene.children[2] as THREE.Object3D;
  switch (event.code) {
    case 'KeyW': {
      const zr = tank.rotation.z - Math.PI / 2
      const offsetX = 0.1 * Math.cos(zr);
      const offsetZ = 0.1 * Math.sin(zr);
      tank.position.x += offsetX;
      tank.position.z -= offsetZ;
      camera.position.x += offsetX;
      camera.position.z -= offsetZ
      break
    }
    case 'KeyA': {
      tank.rotation.z += 0.02
      const zr = tank.rotation.z - Math.PI / 2
      camera.position.x = tank.position.x - 2 * Math.cos(zr);
      camera.position.z = tank.position.z + 2 * Math.sin(zr);
      camera.lookAt(
        tank.position.x + 10 * Math.cos(zr - cameraRotationXZOffset),
        -10 * Math.atan(cameraRotationYOffset),
        tank.position.z - 10 * Math.sin(zr - cameraRotationXZOffset))
      break
    }
    case 'KeyS': {
      const zr = tank.rotation.z - Math.PI / 2
      const offsetX = -0.1 * Math.cos(zr);
      const offsetZ = -0.1 * Math.sin(zr);
      tank.position.x += offsetX;
      tank.position.z -= offsetZ;
      camera.position.x += offsetX;
      camera.position.z -= offsetZ
      break;
    }
    case 'KeyD': {
      tank.rotation.z -= 0.02
      const zr = tank.rotation.z - Math.PI / 2
      camera.position.x = tank.position.x - 2 * Math.cos(zr);
      camera.position.z = tank.position.z + 2 * Math.sin(zr);
      camera.lookAt(
        tank.position.x + 10 * Math.cos(zr - cameraRotationXZOffset),
        -10 * Math.atan(cameraRotationYOffset),
        tank.position.z - 10 * Math.sin(zr - cameraRotationXZOffset))
      break
    }
  }
}

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  render()
}

const stats = Stats()
document.body.appendChild(stats.dom)

const loader = new GLTFLoader();
loader.load('./models/styled_tank/tank.glb', function(gltf){
  const tank = gltf.scene.children[0];
  tank.scale.set(0.3,0.3,0.3);
  tank.rotation.z += Math.PI / 2;
  scene.add(tank);
  document.addEventListener('keydown', onKeyDown, false)
});

function animate() {
  requestAnimationFrame(animate)
  render()
  stats.update()
}

function render() {
  renderer.render(scene, camera)
}

animate()
