import { GameConfig, TankStatus } from '../../data/Types';
import { TankCommands } from '../../data/Types';
import TankBase3 from './tankBase3';
import Message from '../message';
import Bullet from '../bullet/bullet';
import { Scene } from 'three';

class TankPlayer3 extends TankBase3 {
  tankCommands: TankCommands
  constructor(scene: Scene, config: GameConfig, id: string, message: Message, initStatus?: TankStatus) {
    super(scene, config, initStatus);
    this.tankCommands = {
      fwd: false,
      bwd: false,
      rl: false,
      rr: false,
      blt: false
    };
  }
}

export default TankPlayer3;