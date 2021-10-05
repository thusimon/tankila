import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'

const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(5))

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

const sensitivity = 0.002;
let cameraRotationXZOffset = 0
let cameraRotationYOffset = 0
let rotation = 0;
const radis = 4;

const menuPanel = document.getElementById('menuPanel') as HTMLDivElement
const startButton = document.getElementById('startButton') as HTMLInputElement
startButton.addEventListener(
  'click',
  function () {
    //controls.lock()
    menuPanel.style.display = 'none'
    renderer.domElement.addEventListener(
      'mousemove',
      onDocumentMouseMove,
      false)
  },
  false
)

const {width, height} = renderer.domElement;
const hw = width / 2;
const hh = height / 2;
function onDocumentMouseMove(event: MouseEvent) {
  //console.log(event.movementX, event.movementY);
  const {x, y} = event;
  const tank = scene.children[3] as THREE.Object3D;
  //cameraRotationXZOffset += sensitivity * event.movementX;
  //cameraRotationYOffset += sensitivity * event.movementY;
  cameraRotationXZOffset = x / width - 0.5;
  cameraRotationYOffset = y / height - 0.5;
  //cameraRotationYOffset = Math.max(Math.min(cameraRotationYOffset, 2.5), -2.5)

  camera.lookAt(
    camera.position.x + Math.cos(cameraRotationXZOffset),
    camera.position.y - Math.atan(cameraRotationYOffset),
    camera.position.z + Math.sin(cameraRotationXZOffset))
  //console.log(camera.rotation.x, camera.rotation.y,camera.rotation.z)
}

//const controls = new PointerLockControls(camera, renderer.domElement)
//controls.addEventListener('change', () => console.log("Controls Change"))
//controls.addEventListener('lock', () => (menuPanel.style.display = 'none'))
//controls.addEventListener('unlock', () => (menuPanel.style.display = 'block'))

const planeGeometry = new THREE.PlaneGeometry(100, 100, 50, 50)
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true,
})
const plane = new THREE.Mesh(planeGeometry, material)
plane.rotateX(-Math.PI / 2)
scene.add(plane)

const onKeyDown = function (event: KeyboardEvent) {
  const tank = scene.children[3] as THREE.Object3D;
  switch (event.code) {
    case 'KeyW':
      //controls.moveForward(0.1);
      tank.position.x += 0.1;
      camera.position.x += 0.1;
      break
    case 'KeyA':
      //controls.moveRight(-0.1)
      rotation += 0.02
      //tank.quaternion.setFromAxisAngle( new THREE.Vector3(0, 0, 1), rotation);
      tank.rotation.z += 0.02;
      camera.lookAt(
        camera.position.x + Math.cos(cameraRotationXZOffset),
        camera.position.y - Math.atan(cameraRotationYOffset),
        camera.position.z + Math.sin(cameraRotationXZOffset + tank.rotation.z - Math.PI / 2))
      break
    case 'KeyS':
      //controls.moveForward(-0.1)
      tank.position.x -= 0.1;
      camera.position.x -= 0.1
      break
    case 'KeyD':
      //controls.moveRight(0.1)
      rotation -= 0.02
      //tank.quaternion.setFromAxisAngle( new THREE.Vector3(0, 0, 1), rotation);
      tank.rotation.z -= 0.02;
      console.log(110, cameraRotationXZOffset, tank.rotation.z % Math.PI, Math.sin(cameraRotationXZOffset + tank.rotation.z % Math.PI))
      camera.lookAt(
        camera.position.x + Math.cos(cameraRotationXZOffset),
        camera.position.y - Math.atan(cameraRotationYOffset),
        camera.position.z + Math.sin(cameraRotationXZOffset + tank.rotation.z - Math.PI / 2))
      break
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
  //tank.quaternion.setFromAxisAngle( new THREE.Vector3(1, 0, 0), -Math.PI / 2);
  tank.rotation.z += Math.PI / 2;
  scene.add(tank);
  console.log(scene);
  document.addEventListener('keydown', onKeyDown, false)
});

function animate() {
  requestAnimationFrame(animate)

  //controls.update()

  render()

  stats.update()
}

function render() {
  renderer.render(scene, camera)
}

animate()
