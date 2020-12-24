import Point from './Point';

export interface GameConfigType {
  width: number;
  height: number;
  canvasParentId: string;
}

export interface Bound {
  top: number,
  right: number,
  bottom: number,
  left: number
}

export interface TankStatus {
  position: Point,
  rotation: number
}

export interface Move {
  forward: number, // 1 forward, 0 stale, -1 backword
  rotation: number // 1 right, 0 stale, -1 left
}

export interface MessageListener {
  (data: string): void;
}