import * as CANNON from 'cannon-es'
import Bullet from '../components/bullet/bullet';
import Tank from '../components/tank/tank';

export interface BulletsType {
  [key:string]: Bullet[]
}

export interface UserBody extends CANNON.Body {
  userData?: string;
}

export interface TankPosition {
  n: string,
  x: number,
  y: number,
  z: number,
  r: number,
  b: BulletPosition[],
  e: BulletPosition[],
}

export interface BulletPosition {
  x: number,
  y: number,
  z: number,
}

export interface PositionQueue {
  pos: THREE.Vector3;
  time: number;
}

export interface TankPositions {
  [key: string]: TankPosition
}

export interface Tanks {
  [key: string]: Tank
}

export interface ScoresData {
  [key: string]: {
    n: string,
    s: number,
    h: number,
  }
}

export interface MoveStatus {
  keyW?: string, // 1 active, 0 non-active
  keyS?: string,
  keyA?: string,
  keyD?: string,
  keySpace?: string,
  forward?: number, // 1 forward, 0 stop, -1 backward
  rotation?: number, // 1 right, 0 stop, -1 left
  speed?: number,
  direction?: number
}

export interface MessageListener {
  (type: string, data: object): void;
}

export enum MessageType {
  TANK_START = '00',
  TANK_JOINED = '01',
  TANK_POS = '02',
  TANK_EXIT = '03',
  TANK_MOVE_FORWARD = '04',
  TANK_MOVE_BACKWARD = '05',
  TANK_ROTATE_LEFT = '06',
  TANK_ROTATE_RIGHT = '07',
  TANK_SHOOT = '08',
  CHAT_SEND = '09',
  CHAT_RECEIVE = '10',
  SCORE_UPDATE = '11',
};

export interface BulletinType {
  updatedAt: string;
  name: string;
  credit: number;
};
