import Point from '../data/Point';
import { Vector3, Euler, Color } from 'three';
import * as CANNON from 'cannon-es'
import Bullet from '../components/bullet/bullet';
import Tank from '../components/tank/tank';

export interface GameConfig {
  width: number;
  height: number;
  canvasParentId: string;
  syncRate: number;
  id: string;
}

export interface GameData {
  id: string;
  engine: boolean;
}

export interface BulletData {
  pos: Vector3;
  rot: number;
  hit: boolean;
  idx: number;
}

export interface BulletType {
  idx: number;
  body: CANNON.Body;
  sphere: THREE.Object3D;
}

export interface BulletsType {
  [key:string]: Bullet[]
}

export interface UserBody extends CANNON.Body {
  userData?: string;
}

export interface TankData3 {
  pos: {x:number, y:number, r:number};
  spd: number[]; // 0 move speed, 1 rotate speed 2 bullet speed
  sat: number[]; // 0: dir, 1: rotate
  blt: BulletData[];
  stmp: number;
  scor: number;
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

export interface DebugInfo {
  playerPosition: Vector3;
  playerRotation: Euler;
}

export interface ScoreInfo {
  id: string;
  score: number;
}
export interface ScorePros {
  scores: ScoreInfo[];
  id: string;
}

export interface DebugProps {
  data: DebugInfo,
  update: () => void
}

export interface GameDataContextType {
  gameData: GameData;
  setGameData: (gameData: GameData) => void;
}
export interface Bound {
  top: number,
  right: number,
  bottom: number,
  left: number
}

export interface TankStatus {
  position: Point;
  rotation: number;
}

export interface TankStatus3 {
  color: Color;
  bltColor: Color;
}

export interface TankTransformStatus {
  direction: number; // 1 forward, -1 backward, 0 stop
  rotation: number; // 1 clockwise, -1 counterclockwise, 0 stop
}

export interface TankCommands {
  fwd: boolean,
  bwd: boolean,
  rl: boolean,
  rr: boolean,
  blt: boolean,
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
