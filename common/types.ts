export interface MoveStatus {
  keyW?: string, // 1 active, 0 non-active
  keyS?: string,
  keyA?: string,
  keyD?: string,
  keySpace?: string,
  forward?: number, // 1 forward, 0 stop, -1 backward
  rotation?: number, // 1 right, 0 stop, -1 left
  rotationSpeed?: number,
  speed?: number,
  direction?: number
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
  REWARD_ADD = '12',
  REWARD_HIT = '13',
  REWARD_UPDATE = '14'
}

export enum RewardType {
  TANK_SWIFT,
  TANK_SAMLL,
  TANK_INVULNERABLE,
  BULLTET_LARGE,
  BULLET_POWER,
}

export type RewardStatus = {
  [key in RewardType]: number;
}
