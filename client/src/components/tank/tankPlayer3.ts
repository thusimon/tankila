import { TankStatus3 } from '../../data/Types';
import { TankCommands } from '../../data/Types';
import TankBase3 from './tankBase3';
import Message from '../message';
import { Scene } from 'three';

class TankPlayer3 extends TankBase3 {
  tankCommands: TankCommands
  constructor(scene: Scene, id: string, message: Message, initStatus: TankStatus3) {
    super(scene, id, initStatus);
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