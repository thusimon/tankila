import Point from './Point';

export interface GameConfig {
  width: number;
  height: number;
  canvasParentId: string;
  syncRate: number;
  id: string;
}

export interface GameData {
  id: string;
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
  position: Point,
  rotation: number
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