import dotenv from 'dotenv'
import path from 'path';
import express from 'express';
import WebSocket from 'ws';
import mongoose from 'mongoose';
import { MoveStatus, MessageType } from '../../common/types';
import { WSClients } from '../../client/src/types/Types';
import * as CANNON from 'cannon-es'
import { getQueryFromUrl } from './utils/url'
import World from './physics/world';
import { TankilaScore } from './db/scores';
import { updateOne } from './db/utils';
import { router } from './routes';
import { TankMessageType } from './types';

dotenv.config({
  path: path.join(__dirname, '../../.env')
});

const CONNECTION_URI = process.env.MONGODB_URI;

/* ------db------ */
const connectToDb = () => {
  if (!CONNECTION_URI) {
    return Promise.reject('invalid connection url')
  }
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
const wsClients: WSClients = {};

const wss = new WebSocket.Server({
  server,
  path: '/websockets'
});

const broadcastMessage = (message: string): void => {
  wss.clients.forEach(client => {
    client.send(message);
  });
}

const clientMessage = (id: string, message: string): void => {
  const client = wsClients[id];
  if (!client) {
    return;
  }
  client.send(message);
};

const messager = (message: string, id?: string): void => {
  if (id) {
    clientMessage(id, message);
  } else {
    broadcastMessage(message);
  }
}

/* ------physics------ */
const world = new World(messager);

wss.on('connection', (ws, req) => {
  const id = getQueryFromUrl('id', req.url);
  const name = getQueryFromUrl('name', req.url);
  console.log(`${id}-${name} tank enters`);
  if(id && name) {
    wsClients[id] = ws;
    world.addTank(id, name);
    broadcastMessage(`${MessageType.CHAT_RECEIVE},["System","${name} entered the arena!"]`);
    broadcastMessage(`${MessageType.SCORE_UPDATE},${JSON.stringify(world.scores)}`);
    broadcastMessage(`${MessageType.TANK_JOINED},["${id}"]`);
    clientMessage(id, `${MessageType.REWARD_UPDATE},${JSON.stringify(extractRewardMessage())}`);
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
      delete wsClients[id];
    });
    ws.on('message', msg => {
      handleMessage(id, msg.toString());
    });
  }
});

const extractTanksMessage = () => {
  const tanks = world.tanks;
  const bullets = world.bullets;
  const bullestToRemove = world.bulletsToRemove;
  const rewardsToRemove = world.rewardsToRemove;
  const tanksMessage: TankMessageType = {};
  for (const tankId in tanks) {
    const tank = tanks[tankId];
    const tankBullets = bullets[tankId] || [];
    const tankBulletsToRmove = bullestToRemove[tankId] || [];
    const tankBulletsMessage = tankBullets.map(blt => ({
      x: blt.body.position.x,
      y: blt.body.position.y,
      z: blt.body.position.z,
      i: blt.id
    }));
    const tankBulletsToRemoveMessage = tankBulletsToRmove.map(blt => {
      // remove bullet from world
      blt.remove();
      return {
        x: blt.body.position.x,
        y: blt.body.position.y,
        z: blt.body.position.z,
        i: blt.id
      };
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
      w: tank.rewards
    }
    tanksMessage[tankId] = tankMessage;
    world.bulletsToRemove[tankId] = [];
  }
  rewardsToRemove.forEach(reward => {
    reward.remove();
  });
  world.rewardsToRemove = [];
  return tanksMessage;
};

const extractRewardMessage = () => {
  return world.rewards.map(reward => [reward.type, reward.body.position.x, reward.body.position.y, reward.body.position.z])
};

const positionUpdateRate = 1000 / 100;
const rewardUpdateRate = 1000;
const worldStep = positionUpdateRate / 1000;

setInterval(() => {
  world.updateTanksPosition();
  world.world.step(worldStep);
  world.updateRewardStatus(worldStep);
  world.updateTankSize();
  const tanksMessage = extractTanksMessage();
  broadcastMessage(`${MessageType.TANK_POS},${JSON.stringify(tanksMessage)}`);
}, positionUpdateRate);

setInterval(() => {
  world.addRewards();
}, rewardUpdateRate);

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
      break;
    }
    default:
      break;
  }
}
