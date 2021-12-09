import * as CANNON from 'cannon-es';

export interface TankMessageType {
  [key: string]: unknown
}

export interface UserBody extends CANNON.Body {
  userData?: string
}

export interface CollisionEvent {
  body: UserBody
}
