import * as CANNON from 'cannon-es'
import Arena from './components/arena';
import Tank from './components/tank';
import {generateRandomPosition} from '../utils/dynamics';
import { MoveStatus } from '../../../client/src/types/Types';
import {updateMoveStatus, updateMoveSpeed, updateMoveRotation} from './utils/tankStatus';

class World {
  world: CANNON.World;
  arena: Arena;
  tanks: {[key: string]: Tank} = {};
  constructor() {
    this.world = new CANNON.World();
    this.world.gravity.set(0, -1, 0)
    this.arena = new Arena(this.world);
  }

  addTank(id: string, name: string) {
    const lowerBound = new CANNON.Vec3(-this.arena.width + 10, 0, -this.arena.height + 10);
    const upperBound = new CANNON.Vec3(this.arena.width - 10, 0, this.arena.height - 10);
    const initPosition = generateRandomPosition(lowerBound, upperBound);
    const initDirection = (Math.random() * 2 - 1) * Math.PI
    const tank = new Tank(id, name);
    tank.body.position.set(initPosition.x, initPosition.y, initPosition.z);
    tank.body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), initDirection);
    tank.moveStatus.direction = initDirection;
    this.tanks[id] = tank;
    this.world.addBody(tank.body);
  }

  removeTank(id: string) {
    const tank = this.tanks[id];
    if (tank) {
      this.world.removeBody(tank.body);
      delete this.tanks[id];
    }
  }

  updateTankStatus(id: string, newMoveStatus: MoveStatus) {
    const tank = this.tanks[id];
    if (tank) {
      const currentTankStatus = tank.moveStatus;
      updateMoveStatus(currentTankStatus, newMoveStatus);
    }
  }

  updateTanksPosition() {
    for (const tankId in this.tanks) {
      const tank = this.tanks[tankId];
      const moveStatus = tank.moveStatus;
      updateMoveSpeed(moveStatus);
      updateMoveRotation(moveStatus);
      const rotation = moveStatus.rotation || 0;
      const body = tank.body;
      body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), rotation);
      const euler = new CANNON.Vec3();
      body.quaternion.toEuler(euler);
      const eulerY = euler.y;
      const speed = moveStatus.speed || 0;
      const offsetX = speed * Math.sin(eulerY);
      const offsetZ = speed * Math.cos(eulerY);
      body.velocity = new CANNON.Vec3(offsetX, 0, offsetZ);
    }
  }
}

export default World;
