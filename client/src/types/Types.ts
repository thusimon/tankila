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

export type RewardHitData = [string, RewardType, number];

export type RewardPositionData = [RewardType, number, number, number];

export type MessageListenerData = string[] | TanksStatus | ScoresData | RewardType[] | RewardHitData | RewardPositionData[];

export interface MessageListener {
  (type: string, data: MessageListenerData): void;
}

export interface BulletinType {
  updatedAt: string;
  name: string;
  credit: number;
}
