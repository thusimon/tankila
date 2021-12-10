import WebSocket from 'ws';
import { RewardType, RewardStatus } from '../../../common/types';
import Bullet from '../components/bullet/bullet';
import Tank from '../components/tank/tank';

export interface BulletsType {
  [key:string]: {[key:string]: Bullet}
}

export interface TankStatus {
  n: string,
  x: number,
  y: number,
  z: number,
  r: number,
  b: BulletPosition[],
  e: BulletPosition[],
  w: RewardStatus
}

export interface BulletPosition {
  x: number,
  y: number,
  z: number,
  i: number,
}

export interface TanksStatus {
  [key: string]: TankStatus
}

export interface Tanks {
  [key: string]: Tank
}

export interface ScoreData {
  n: string,
  s: number,
  h: number
}

export interface ScoresData {
  [key: string]: ScoreData
}

export interface MessageListener {
  (type: string, data: string[] | TanksStatus | ScoresData | RewardType[] | [RewardType, number, number, number][]): void;
}

export interface BulletinType {
  updatedAt: string;
  name: string;
  credit: number;
}

export interface WSClients {
  [key: string]: WebSocket;
}
