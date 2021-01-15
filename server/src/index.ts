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
app.use(express.static(path.join(__dirname, '../../client/static')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build/index.html'));
});

app.get('/laserdefender', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/static/laserDefender/index.html'));
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
const score: ScoreData = {};

const updateRate = 100;
setInterval(() => {
  broadcastMessage(`${MessageType.pos},${JSON.stringify(tanks)}`);
}, updateRate);

const handleTankCommand = (id: string, commandType: string, command: string) => {
  broadcastMessage(`${commandType},${id},${command}`);
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
    case MessageType.hit:
      handleScoreUpdate(id);
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
