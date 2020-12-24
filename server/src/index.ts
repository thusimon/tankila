require('dotenv').config();
import path from 'path';
import express from 'express';
import WebSocket from "ws"

/* ------interface------- */
enum MessageType {
  pos='pos',
  blt='blt',
  ext='ext'
}

interface Position {
  x: number,
  y: number,
  r: number
}

interface TanksData {
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

const tanks: TanksData = {};
const bullets: BulletsData = {};

const boradcastMessage = (message: string): void => {
  wss.clients.forEach(client => {
    client.send(message);
  });
}
wss.on('connection', (ws, req) => {
  const id = getQueryFromUrl('id', req.url!);
  if(id) {
    ws.on('close', () => {
      console.log(`${id} tank exits`);
      delete tanks[id];
      boradcastMessage(`ext,${id}`);
    });
    ws.on('message', msg => {
      handleMessage(id, msg as string);
    });
  }
});

const updateRate = 20;
setInterval(() => {
  boradcastMessage(`${MessageType.pos},${JSON.stringify(tanks)}`);
}, updateRate);

const handleTankPosition = (id: string, x: string, y: string, r: string) => {
  tanks[id] = `${x},${y},${r}`;
}

const handleBulletPosition = (id: string, x: string, y: string, r: string) => {
  const bulletMessage = `${MessageType.blt},${id},${x},${y},${r}`;
  wss.clients.forEach(client => {
    client.send(bulletMessage);
  });
}

const handleMessage = (id: string, message: string): void => {
  const messageParts = message.split(',');
  const messageType = messageParts[0]
  switch (messageType) {
    case MessageType.pos:
      handleTankPosition(id, messageParts[1], messageParts[2], messageParts[3]);
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
