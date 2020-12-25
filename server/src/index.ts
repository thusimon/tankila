require('dotenv').config();
import path from 'path';
import express from 'express';
import WebSocket from "ws"

/* ------interface------- */
enum MessageType {
  pos='pos',
  fwd='fwd',
  bwd='bwd',
  rl='rl',
  rr='rr',
  blt='blt',
  ext='ext'
}

interface Position {
  x: number,
  y: number,
  r: number
}

interface TankData {
  [key: string]: string
}

interface BulletsData {
  [key: string]: Position[]
}

/* ------server------- */
const app = express();

const PORT = process.env.PORT;

app.use(express.static(path.join(__dirname, '../../client/build')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../../client/build/index.html'));
});

const server = app.listen(PORT, () => {
  console.log(`Successfully started server on port ${PORT}`);
});

/* ------websocket------- */
const wss = new WebSocket.Server({
  server,
  path: '/websockets'
});

const broadcastMessage = (message: string): void => {
  wss.clients.forEach(client => {
    client.send(message);
  });
}

wss.on('connection', (ws, req) => {
  const id = getQueryFromUrl('id', req.url!);
  console.log(`${id} tank enters`);
  if(id) {
    ws.on('close', () => {
      console.log(`${id} tank exits`);
      delete tanks[id];
      broadcastMessage(`${MessageType.ext},${id}`);
    });
    ws.on('message', msg => {
      handleMessage(id, msg as string);
    });
  }
});

const tanks: TankData = {};

const updateRate = 100;
setInterval(() => {
  broadcastMessage(`${MessageType.pos},${JSON.stringify(tanks)}`);
}, updateRate);

const handleTankCommand = (id: string, commandType: string, command: string) => {
  broadcastMessage(`${commandType},${id},${command}`);
}

const handleTanksPosition = (id: string, x: string, y: string, r: string) => {
  tanks[id] = `${x},${y},${r}`;
}

const handleBulletPosition = (id: string, x: string, y: string, r: string) => {
  broadcastMessage(`${MessageType.blt},${id},${x},${y},${r}`);
}

const handleMessage = (id: string, message: string): void => {
  const messageParts = message.split(',');
  const messageType = messageParts[0]
  switch (messageType) {
    case MessageType.pos:
      handleTanksPosition(id, messageParts[1], messageParts[2], messageParts[3])
      break;
    case MessageType.fwd:
    case MessageType.bwd:
    case MessageType.rl:
    case MessageType.rr:
      handleTankCommand(id, messageType, messageParts[1]);
      break;
    case MessageType.blt:
      handleBulletPosition(id, messageParts[1], messageParts[2], messageParts[3]);
      break;
    default:
      break;
  }
}

/* ------utils------- */
const getQueryFromUrl = (name: string, uri: string) => {
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
  results = regex.exec(uri);
  if (!results) return null;
  if (!results[2]) return null;
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};
