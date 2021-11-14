import dotenv from 'dotenv'
import path from 'path';
import express from 'express';
import WebSocket from 'ws';
import mongoose from 'mongoose';
import {Euler, Vector3} from 'three';
import Bullet3 from './Bullet3';
import { BulletData, MessageType, MoveStatus } from '../../client/src/types/Types';
import * as CANNON from 'cannon-es'
import {getQueryFromUrl} from './utils/url'
import World from './physics/world';
import {TankilaScore} from './db/scores';
import {updateOne} from './db/utils';
import {router} from './routes';

dotenv.config({
  path: path.join(__dirname, '../../.env')
});

const CONNECTION_URI = process.env.MONGODB_URI!;

/* ------interface------- */
// enum MessageType {
//   pos='pos',
//   fwd='fwd',
//   bwd='bwd',
//   rl='rl',
//   rr='rr',
//   blt='blt',
//   hit='hit',
//   ext='ext',
//   //Engine version
//   st3='st3', // start
//   bon='bon', // boundary
//   stup='stup', // setup speed
//   dir='dir', // move forward, backward or stop
//   rot='rot', // rotate left, right or stop
//   blt3='blt3',
//   pos3='pos3', // send all tank position
//   scor='scor',
//   hit3='hit3',
// }

interface Position {
  x: number,
  y: number,
  r: number
}

interface TankData {
  [key: string]: string
}

interface Command {
  cmd: string,
  stmp: number
}

interface TankData3 {
  stmp: number;
  scor: number;
}

interface TanksData3 {
  [key: string]: TankData3
}

interface ScoreData {
  [key: string]: number
}

/* ------db------ */
const connectToDb = () => {
  return mongoose.connect(CONNECTION_URI).then(async () => {
    console.log(`Connected to mongoDB to ${CONNECTION_URI}`);
    return Promise.resolve();
  });
};

/* ------server------- */
const app = express();

const PORT = process.env.PORT;

const clientBuildPath = path.join(__dirname, '../../client/build');
app.use(express.static(clientBuildPath));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build/index.html'));
});

app.use(router);

const server = app.listen(PORT, () => {
  connectToDb().then(() => {
    console.log(`Successfully started server on port ${PORT}`);
  });
});

/* ------websocket------ */
const wss = new WebSocket.Server({
  server,
  path: '/websockets'
});

const broadcastMessage = (message: string): void => {
  wss.clients.forEach(client => {
    client.send(message);
  });
}

/* ------physics------ */
const world = new World(broadcastMessage);

wss.on('connection', (ws, req) => {
  const id = getQueryFromUrl('id', req.url!);
  const name = getQueryFromUrl('name', req.url!);
  console.log(`${id}-${name} tank enters`);
  if(id && name) {
    world.addTank(id, name);
    broadcastMessage(`${MessageType.CHAT_RECEIVE},["System","${name} entered the arena!"]`);
    broadcastMessage(`${MessageType.SCORE_UPDATE},${JSON.stringify(world.scores)}`);
    broadcastMessage(`${MessageType.TANK_JOINED},["${id}"]`);
    ws.on('close', () => {
      console.log(`${id}-${name} tank exits`);
      const tankScore = world.scores[id];
      if (tankScore && tankScore.s && tankScore.n) {
        console.log(`saving bulletin ${tankScore.n}: ${tankScore.s}`);
        updateOne(TankilaScore, {name: tankScore.n}, {name: tankScore.n, credit: tankScore.s});
      }
      world.removeTank(id);
      broadcastMessage(`${MessageType.TANK_EXIT},["${id}"]`);
      broadcastMessage(`${MessageType.SCORE_UPDATE},${JSON.stringify(world.scores)}`);
      broadcastMessage(`${MessageType.CHAT_RECEIVE},["System","${name} left the arena..."]`);
    });
    ws.on('message', msg => {
      handleMessage(id, msg.toString());
    });
  }
});

const tanks: TankData = {};
const tanks3: TanksData3 = {};

const extractTanksMessage = () => {
  const tanks = world.tanks;
  const bullets = world.bullets;
  const bullestToRemove = world.bulletsToRemove;
  const tanksMessage: {[key: string]: object} = {};
  for (const tankId in tanks) {
    const tank = tanks[tankId];
    const tankBullets = bullets[tankId] || [];
    const tankBulletsToRmove = bullestToRemove[tankId] || [];
    const tankBulletsMessage = tankBullets.map(blt => ({
      x: blt.body.position.x,
      y: blt.body.position.y,
      z: blt.body.position.z
    }));
    const tankBulletsToRemoveMessage = tankBulletsToRmove.map(blt => {
      // remove bullet from world
      world.world.removeBody(blt.body);
      return {
        x: blt.body.position.x,
        y: blt.body.position.y,
        z: blt.body.position.z
      }
    });
    const euler = new CANNON.Vec3();
    tank.body.quaternion.toEuler(euler);
    const tankMessage = {
      n: tank.tankName,
      x: tank.body.position.x,
      y: tank.body.position.y,
      z: tank.body.position.z,
      r: euler.y,
      b: tankBulletsMessage,
      e: tankBulletsToRemoveMessage,
    }
    tanksMessage[tankId] = tankMessage;
    world.bulletsToRemove[tankId] = [];
  }
  return tanksMessage;
}

const updateRate = 1000 / 100;
const worldStep = updateRate / 1000;
setInterval(() => {
  world.updateTanksPosition();
  world.world.step(worldStep);
  const tanksMessage = extractTanksMessage();
  broadcastMessage(`${MessageType.TANK_POS},${JSON.stringify(tanksMessage)}`);
}, updateRate);

const handleTankCommand = (id: string, commandType: string, command: string) => {
  broadcastMessage(`${commandType},${id},${command}`);
}

const handleTanksPosition = (id: string, x: string, y: string, r: string) => {
  tanks[id] = `${x},${y},${r}`;
}

// const handleBulletPosition = (id: string, x: string, y: string, r: string) => {
//   broadcastMessage(`${MessageType.blt},${id},${x},${y},${r}`);
// }

const handleMessage = (id: string, message: string): void => {
  const messageType = message.substring(0, 2);
  switch (messageType) {
    case MessageType.TANK_MOVE_FORWARD: {
      const keyActive = message.substring(3);
      const newMoveStatus: MoveStatus = {keyW: keyActive};
      world.updateTankStatus(id, newMoveStatus);
      break;
    }
    case MessageType.TANK_MOVE_BACKWARD: {
      const keyActive = message.substring(3);
      const newMoveStatus: MoveStatus = {keyS: keyActive};
      world.updateTankStatus(id, newMoveStatus);
      break;
    }
    case MessageType.TANK_ROTATE_LEFT: {
      const keyActive = message.substring(3);
      const newMoveStatus: MoveStatus = {keyA: keyActive};
      world.updateTankStatus(id, newMoveStatus);
      break;
    }
    case MessageType.TANK_ROTATE_RIGHT: {
      const keyActive = message.substring(3);
      const newMoveStatus: MoveStatus = {keyD: keyActive};
      world.updateTankStatus(id, newMoveStatus);
      break;
    }
    case MessageType.TANK_SHOOT: {
      world.shootBullet(id);
      break;
    }
    case MessageType.CHAT_SEND: {
      const chatContent = message.substring(3);
      const tank = world.tanks[id];
      if (tank && tank.tankName) {
        broadcastMessage(`${MessageType.CHAT_RECEIVE},["${tank.tankName}","${chatContent}"]`);
      }
    }
    default:
      break;
  }
}
