import * as CANNON from 'cannon-es';
import WebSocket from 'ws';

export interface TankMessageType {
  [key: string]: unknown
}

export interface UserBody extends CANNON.Body {
  userData?: string
}

export interface CollisionEvent {
  body: UserBody
}

export interface WSClients {
  [key: string]: WebSocket;
}
