import * as CANNON from 'cannon-es'
import Arena from './components/arena';
import Tank from './components/tank';
import Bullet from './components/bullet';
import Reward from './components/reward';
import { generateRandomPosition, randomEnum } from '../utils/dynamics';
import { MoveStatus, MessageType, RewardType } from '../../../client/src/types/Types';
import {updateMoveStatus, updateMoveSpeed, updateMoveRotation, getRewardName, updateTankRewardStatus} from '../utils/tankStatus';
import { REWARD_DURATION } from '../constants';

class World {
  world: CANNON.World;
  arena: Arena;
  tanks: {[key: string]: Tank} = {};
  bullets: {[key: string]: Bullet[]} = {};
  bulletsToRemove: {[key: string]: Bullet[]} = {};
  scores: {[key: string]: {n: string, s: number, h: number}} = {};
  rewards: Reward[] = [];
  rewardsToRemove: Reward[] = [];
  messager: (msg: string) => void;
  rewardChecked: number = 10;
  REWARD_INTERVAL: number = 1;
  constructor(messager: (msg: string) => void) {
    this.world = new CANNON.World();
    this.world.gravity.set(0, -0.25, 0)
    this.arena = new Arena(this.world);
    this.messager = messager;
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
    this.bullets[id] = [];
    this.bulletsToRemove[id] = [];
    this.scores[id] = {n: name, s: 0, h: 0};
    this.world.addBody(tank.body);
  }

  removeTank(id: string) {
    const tank = this.tanks[id];
    if (tank) {
      this.world.removeBody(tank.body);
    }
    // TODO clean the bullets
    delete this.tanks[id];
    delete this.scores[id];
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
      const rewardStatus = tank.rewards;
      updateMoveSpeed(moveStatus, rewardStatus);
      updateMoveRotation(moveStatus);
      const direction = moveStatus.direction || 0;
      const body = tank.body;
      body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), direction);
      const euler = new CANNON.Vec3();
      body.quaternion.toEuler(euler);
      const eulerY = euler.y;
      const speed = moveStatus.speed || 0;
      const offsetX = speed * Math.sin(eulerY);
      const offsetZ = speed * Math.cos(eulerY);
      body.velocity = new CANNON.Vec3(offsetX, 0, offsetZ);
    }
  }

  updateRewardStatus() {
    const stepTime = this.world.dt;
    for (const tankId in this.tanks) {
      updateTankRewardStatus(this.tanks[tankId], stepTime);
    }
  }

  shootBullet(tankId: string) {
    const tank = this.tanks[tankId];
    if (!tank) {
      // no tank found, bail
      return;
    }
    const tankBullets = this.bullets[tankId];
    const bullet = new Bullet(this.world, tank, tankBullets.length, this.bulletExplode.bind(this));
    tankBullets.push(bullet);
  }

  bulletExplode(tankId: string, bullet: Bullet, collisionTo: string) {
    this.bulletsToRemove[tankId].push(bullet);
    const tanksBullet = this.bullets[tankId];
    this.bullets[tankId] = tanksBullet.filter(blt => blt != bullet);
    if (this.scores[tankId] && collisionTo && collisionTo.startsWith('tank_')) {
      const hitTankId = collisionTo.split('_')[1];
      this.scores[tankId].s += 1;
      this.scores[hitTankId].h += 1;
    }
    this.messager(`${MessageType.SCORE_UPDATE},${JSON.stringify(this.scores)}`);
  }

  rewardHit(reward: Reward, collisionTo: string) {
    if (!collisionTo.startsWith('tank_')) {
      // not hit by tank, bail
      return;
    }
    const tankId = collisionTo.split('_')[1];
    if (!tankId || !this.tanks[tankId]) {
      return;
    }
    const tank = this.tanks[tankId];
    tank.rewards[reward.type] = REWARD_DURATION;
    // delete rewards
    this.rewardsToRemove.push(reward);
    const rewardIdx = this.rewards.indexOf(reward);
    this.rewards.splice(rewardIdx, 1);
    this.messager(`${MessageType.REWARD_HIT},${JSON.stringify([tankId, reward.type, rewardIdx])}`);
  }

  addRewards() {
    // if no tank, skip adding
    if (Object.keys(this.tanks).length < 1) {
      return;
    }
    // only allow 5 rewards at most
    if (this.rewards.length > 20) {
      return;
    }
    // reward should be added at least with 10s interval
    if (this.rewardChecked + this.REWARD_INTERVAL > this.world.time) {
      return;
    }
    this.rewardChecked = this.world.time;
    // use a random number to check if needs to add reward
    if (Math.random() < 0) {
      return;
    }
    const lowerBound = new CANNON.Vec3(-this.arena.width + 20, 0, -this.arena.height + 20);
    const upperBound = new CANNON.Vec3(this.arena.width - 20, 0, this.arena.height - 20);
    const initPosition = generateRandomPosition(lowerBound, upperBound);
    const rewardType = randomEnum(RewardType);
    const reward = new Reward(this.world, rewardType, this.rewardHit.bind(this));
    reward.body.position.set(initPosition.x, initPosition.y, initPosition.z);
    this.world.addBody(reward.body);
    this.rewards.push(reward);
    this.messager(`${MessageType.REWARD_ADD},${JSON.stringify([reward.type, initPosition.x, initPosition.y, initPosition.z])}`);
    this.messager(`${MessageType.CHAT_RECEIVE},["System","${getRewardName(reward.type)} reward showed up, go for it!"]`);
  }
}

export default World;
