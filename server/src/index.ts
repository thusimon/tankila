require('dotenv').config();
import path from 'path';
import express from 'express';
import WebSocket from 'ws';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
const CONNECTION_URI = process.env.MONGODB_URI!;

/* ------interface------- */
enum MessageType {
  pos='pos',
  fwd='fwd',
  bwd='bwd',
  rl='rl',
  rr='rr',
  blt='blt',
  hit='hit',
  ext='ext',
  //Engine version
  st3='st3', // start
  dir='dir', // move forward, backward or stop
  rot='rot', // rotate left, right or stop
  pos3='pos3' // send all tank position
}

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
  pos: Position,
  spd: number[], // 0 move speed, 1 rotate speed 2 bullet speed
  sat: number[] // 0: dir, 1: rotate
  stmp: number
}

interface TanksData3 {
  [key: string]: TankData3
}

interface ScoreData {
  [key: string]: number
}

interface BulletsData {
  [key: string]: Position[]
}

/* ------db------ */
const connectToDb = () => {
  return mongoose.connect(CONNECTION_URI, {
    useNewUrlParser: true,
    useCreateIndex: true
  }).then(async () => {
    console.log(`Connected to mongoDB to ${CONNECTION_URI}`);
    return Promise.resolve();
  });
};

const LaserScoreSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  credit: {
    type: Number,
    required: true
  }
}, {
  timestamps:true
});

const LaserScore = mongoose.model('LaserScore', LaserScoreSchema);
/* ------server------- */
const app = express();

const PORT = process.env.PORT;

const router = express.Router();

router.get('/api/lasercredits', async (req, res) => {
  try {
    const laserScores = await LaserScore.find({}, {_id: 0, updatedAt: 0, createdAt: 0, __v: 0}).sort({credit: -1});
    return res.status(200).json({credits: laserScores});
  } catch (e) {
    return res.status(400).json({err: e.message})
  }
});

router.get('/api/lasercredit', async (req, res) => {
  const {name, credit} = req.query;
  if (!name || !credit) {
    return res.status(400).json({err: 'missing param'});
  }
  const creditInt = Number.parseInt(credit as string);
  try {
    const updateResult = await LaserScore.findOneAndUpdate({name}, {name, credit: creditInt}, {new: true, upsert: true});
    return res.status(200).json({credit: updateResult});
  } catch (e) {
    return res.status(400).json({err: e.message});
  }
});

app.use(express.static(path.join(__dirname, '../../client/build')));
app.use('/laserdefender', express.static(path.join(__dirname, '../../client/static/laserDefender')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build/index.html'));
});

app.use(router);

const server = app.listen(PORT, () => {
  connectToDb().then(() => {
    console.log(`Successfully started server on port ${PORT}`);
  });
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
    score[id] = 0;
    broadcastMessage(`${MessageType.hit},${JSON.stringify(score)}`);
    ws.on('close', () => {
      console.log(`${id} tank exits`);
      delete tanks[id];
      delete score[id];
      broadcastMessage(`${MessageType.ext},${id}`);
    });
    ws.on('message', msg => {
      handleMessage(id, msg as string);
    });
  }
});

const tanks: TankData = {};
const tanks3: TanksData3 = {};
const score: ScoreData = {};

const updateRate = 1000 / 50;
setInterval(() => {
  broadcastMessage(`${MessageType.pos},${JSON.stringify(tanks)}`);
  updateTanks3Position();
  broadcastMessage(`${MessageType.pos3}, ${JSON.stringify(tanks3)}`);
}, updateRate);

const updateTanks3Position = () => {
  for (let tankId in tanks3) {
    const tankData = tanks3[tankId];
    updatePosByStatus(tankData);
  }
}

const updatePosByStatus = (tankData: TankData3) => {
  const curTime = Date.now();
  const deltaTime = (curTime - tankData.stmp) / 1000;
  const [mvSpd, rtSpd, bltSpd] = tankData.spd;
  const pos = tankData.pos;
  const [dir, rot] = tankData.sat;

  pos.r += rot * rtSpd * deltaTime;
  const offSet = dir * mvSpd * deltaTime;
  pos.x += Math.cos(pos.r) * offSet;
  pos.y += Math.sin(pos.r) * offSet;
  tankData.stmp = curTime;
}

const handleTankCommand = (id: string, commandType: string, command: string) => {
  broadcastMessage(`${commandType},${id},${command}`);
}

const handleTankCommand3 = (id: string, commandType: string, command: Array<string>) => {
  switch (commandType) {
    case MessageType.st3:
      // tank start, command=x,y,r,speed move,speed rotate,bullet speed,timestamp
      console.log(`tank start with ${command.join(',')}`);
      tanks3[id] = {
        pos: {x: parseFloat(command[0]), y: parseFloat(command[1]), r: parseFloat(command[2])},
        spd: [parseFloat(command[3]), parseFloat(command[4]), parseFloat(command[5])],
        sat: [0,0],
        stmp: Date.now()
      };
      break;
    case MessageType.dir:
      // tank move
      console.log(`tank move ${command[0]} at ${command[1]}`);
      tanks3[id].sat[0] = parseInt(command[0]);
      break;
    case MessageType.rot:
      // tank rotate
      console.log(`tank rotate ${command[0]} at ${command[1]}`);
      tanks3[id].sat[1] = parseInt(command[0]);
      break;
  }
}

const handleScoreUpdate = (id: string) => {
  score[id]++;
  broadcastMessage(`${MessageType.hit},${JSON.stringify(score)}`);
}

const handleTanksPosition = (id: string, x: string, y: string, r: string) => {
  tanks[id] = `${x},${y},${r}`;
}

const handleBulletPosition = (id: string, x: string, y: string, r: string) => {
  broadcastMessage(`${MessageType.blt},${id},${x},${y},${r}`);
}

const handleMessage = (id: string, message: string): void => {
  const messageData = message.split(',');
  const messageType = messageData.shift();
  switch (messageType) {
    case MessageType.pos:
      handleTanksPosition(id, messageData[0], messageData[1], messageData[2])
      break;
    case MessageType.fwd:
    case MessageType.bwd:
    case MessageType.rl:
    case MessageType.rr:
      handleTankCommand(id, messageType, messageData[0]);
      break;
    case MessageType.hit:
      handleScoreUpdate(id);
      break;
    case MessageType.blt:
      handleBulletPosition(id, messageData[0], messageData[1], messageData[2]);
      break;
    // Engine version
    case MessageType.st3:
    case MessageType.dir:
    case MessageType.rot:
      handleTankCommand3(id, messageType, messageData)
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
