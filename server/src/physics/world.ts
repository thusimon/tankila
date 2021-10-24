import * as CANNON from 'cannon-es'
import Arena from './components/arena';
import Tank from './components/tank';
import {generateRandomPosition} from '../utils/dynamics';

class World {
  world: CANNON.World;
  arena: Arena;
  tanks: {[key: string]: Tank} = {};
  constructor() {
    this.world = new CANNON.World();
    this.arena = new Arena(this.world);
  }

  addTank(id: string, name: string) {
    const lowerBound = new CANNON.Vec3(-this.arena.width + 10, 0, -this.arena.height + 10);
    const upperBound = new CANNON.Vec3(this.arena.width - 10, 0, this.arena.height - 10);
    const initPosition = generateRandomPosition(lowerBound, upperBound);
    const tank = new Tank(id, name, initPosition);
    this.tanks[id] = tank;
  }

  removeTank(id: string) {
    delete this.tanks[id];
  }
}

export default World;
