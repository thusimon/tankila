import Point from './Point';
import { Vector3, Euler, Color } from 'three';

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

export interface TankData3 {
  pos: {x:number, y:number, r:number};
  spd: number[]; // 0 move speed, 1 rotate speed 2 bullet speed
  sat: number[]; // 0: dir, 1: rotate
  blt: BulletData[];
  stmp: number;
  scor: number;
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

export interface Move {
  forward: number, // 1 forward, 0 stale, -1 backword
  rotation: number // 1 right, 0 stale, -1 left
}

export interface MessageListener {
  (data: string): void;
}
