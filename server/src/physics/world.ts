import * as CANNON from 'cannon-es'
import Arena from './components/arena';
import Tank from './components/tank';
import Bullet from './components/bullet';
import Reward from './components/reward';
import { generateRandomPosition, randomEnum } from '../utils/dynamics';
import { MoveStatus, MessageType, RewardType } from '../../../common/types';
import { updateMoveStatus, updateMoveSpeed, updateMoveRotation, getRewardName, updateTankRewardStatus, updateTankSize } from '../utils/tankStatus';
import { REWARD_DURATION, REWARD_INTERVAL, REWARD_SPAWN_THRESHOLD, REWARD_MAX_NUM } from '../../../common/constants';

class World {
  world: CANNON.World;
  arena: Arena;
  tanks: {[key: string]: Tank} = {};
  bullets: {[key: string]: Bullet[]} = {};
  bulletsToRemove: {[key: string]: Bullet[]} = {};
  scores: {[key: string]: {n: string, s: number, h: number}} = {};
  rewards: Reward[] = [];
  rewardsToRemove: Reward[] = [];
  messager: (msg: string, id?: string) => void;
  rewardChecked = 10;
  constructor(messager: (msg: string, id?: string) => void) {
    this.world = new CANNON.World();
    this.world.gravity.set(0, -0.25, 0)
    this.arena = new Arena(this.world);
    this.messager = messager;
  }

  addTank(id: string, name: string): void {
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

  removeTank(id: string): void {
    const tank = this.tanks[id];
    if (tank) {
      this.world.removeBody(tank.body);
    }
    this.bulletsToRemove[id] = this.bulletsToRemove[id].concat(this.bullets[id]);
    this.bullets[id] = [];
    delete this.tanks[id];
    delete this.scores[id];
  }

  updateTankStatus(id: string, newMoveStatus: MoveStatus): void {
    const tank = this.tanks[id];
    if (tank) {
      const currentTankStatus = tank.moveStatus;
      updateMoveStatus(currentTankStatus, newMoveStatus);
    }
  }

  updateTanksPosition(): void {
    for (const tankId in this.tanks) {
      const tank = this.tanks[tankId];
      const moveStatus = tank.moveStatus;
      const rewardStatus = tank.rewards;
      updateMoveSpeed(moveStatus, rewardStatus);
      updateMoveRotation(moveStatus, rewardStatus);
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

  updateRewardStatus(stepTime: number): void {
    for (const tankId in this.tanks) {
      const tank = this.tanks[tankId];
      updateTankRewardStatus(tank, stepTime);
    }
  }

  updateTankSize(): void {
    for (const tankId in this.tanks) {
      const tank = this.tanks[tankId];
      updateTankSize(tank);
    }
  }

  shootBullet(tankId: string): void {
    const tank = this.tanks[tankId];
    if (!tank) {
      // no tank found, bail
      return;
    }
    const tankBullets = this.bullets[tankId];
    const radius = tank.rewards[RewardType.BULLTET_LARGE] > 0 ? 0.16 : 0.08;
    const bullet = new Bullet(this.world, tank, tankBullets.length, radius, this.bulletExplode.bind(this));
    tankBullets.push(bullet);
  }

  bulletExplode(tankId: string, bullet: Bullet, collisionTo: string): void {
    this.bulletsToRemove[tankId].push(bullet);
    const tanksBullet = this.bullets[tankId];
    const tank = this.tanks[tankId];
    this.bullets[tankId] = tanksBullet.filter(blt => blt != bullet);
    if (this.scores[tankId] && collisionTo && collisionTo.startsWith('tank_')) {
      const hitTankId = collisionTo.split('_')[1];
      const hitTank = this.tanks[hitTankId];
      // check if the hit tank is invulnarable
      if (hitTank.rewards[RewardType.TANK_INVULNERABLE] == 0) {
        const bulletPower = (tank && tank.rewards[RewardType.BULLET_POWER] > 0) ? 3 : 1;
        this.scores[tankId].s += bulletPower;
        this.scores[hitTankId].h += bulletPower;
      }
    }
    this.messager(`${MessageType.SCORE_UPDATE},${JSON.stringify(this.scores)}`);
  }

  rewardHit(reward: Reward, collisionTo: string): void {
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

  addRewards(): void {
    // if no tank, skip adding
    if (Object.keys(this.tanks).length < 1) {
      return;
    }
    // only allow 10 rewards at most
    if (this.rewards.length > REWARD_MAX_NUM) {
      return;
    }
    // reward should be added at least with 10s interval
    if (this.rewardChecked + REWARD_INTERVAL > this.world.time) {
      return;
    }
    this.rewardChecked = this.world.time;
    // use a random number to check if needs to add reward
    if (Math.random() < REWARD_SPAWN_THRESHOLD) {
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
