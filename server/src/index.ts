import dotenv from 'dotenv'
import path from 'path';
import express from 'express';
import WebSocket from 'ws';
import mongoose from 'mongoose';
import {Euler, Vector3} from 'three';
import Bullet3 from './Bullet3';
import { BulletData } from '../../client/src/types/Types';
import * as CANNON from 'cannon-es'
import {getQueryFromUrl} from './utils/url'

dotenv.config({
  path: path.join(__dirname, '../../.env')
});

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
  bon='bon', // boundary
  stup='stup', // setup speed
  dir='dir', // move forward, backward or stop
  rot='rot', // rotate left, right or stop
  blt3='blt3',
  pos3='pos3', // send all tank position
  scor='scor',
  hit3='hit3',
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
    return res.status(400).json({err: e})
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
    return res.status(400).json({err: e});
  }
});

const clientBuildPath = path.join(__dirname, '../../client/build');
app.use(express.static(clientBuildPath));

const otherClientPath = path.join(__dirname, '../../client/static');

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
  const name = getQueryFromUrl('name', req.url!);
  console.log(`${id}-${name} tank enters`);
  if(id && name) {
    score[id] = 0;
    broadcastMessage(`${MessageType.hit},${JSON.stringify(score)}`);
    ws.on('close', () => {
      console.log(`${id} tank exits`);
      delete tanks3[id];
      delete score[id];
      broadcastMessage(`${MessageType.ext},${id}`);
    });
    ws.on('message', msg => {
      handleMessage(id, msg as Buffer[]);
    });
  }
});

const tanks: TankData = {};
const tanks3: TanksData3 = {};
const score: ScoreData = {};

// const extractTanksMessage = () => {
//   const tanksMessage: {[key: string]: object} = {};
//   for (const tankId in tanks3) {
//     const tank = tanks3[tankId];
//     const tankBlts: BulletData[] = Object.values(tank.tank.bullets).map(blt => {
//       return {
//         pos: blt.position,
//         rot: blt.rotation.z,
//         hit: blt.isHit,
//         idx: blt.idx
//       }
//     });
//     const tankMessage = {
//       pos: {
//         x: tank.tank.position.x,
//         y: tank.tank.position.y,
//         r: tank.tank.rotation.z
//       },
//       blt: tankBlts,
//       scor: tank.scor
//     }
//     tanksMessage[tankId] = tankMessage;
//   }
//   return tanksMessage;
// }

// physics
const world = new CANNON.World()
const bodies: { [id: string]: CANNON.Body } = {}
const groundMaterial: CANNON.Material = new CANNON.Material('groundMaterial');
const slipperyMaterial: CANNON.Material = new CANNON.Material('slipperyMaterial');
groundMaterial.friction = 0.15
groundMaterial.restitution = 0.25
slipperyMaterial.friction = 0.15
slipperyMaterial.restitution = 0.25

world.gravity.set(0, -9.8, 0)

const groundShape = new CANNON.Box(new CANNON.Vec3(100, 1, 100))
const groundBody = new CANNON.Body({
    mass: 0,
    material: groundMaterial,
})
groundBody.addShape(groundShape)
groundBody.position.x = 0
groundBody.position.y = -1
groundBody.position.z = 0
world.addBody(groundBody)

const createPlayerTankSphere = (id: string, pos: CANNON.Vec3, dir: CANNON.Vec3) => {
  const sphereShape = new CANNON.Sphere(1)
  const sphereBody = new CANNON.Body({
      mass: 1,
      material: slipperyMaterial,
  }) //, angularDamping: .9 })
  sphereBody.addShape(sphereShape)
  sphereBody.addEventListener('collide', (e: any) => {
    console.log(e);
  })
  sphereBody.position.x = pos.x
  sphereBody.position.y = pos.y
  sphereBody.position.z = pos.z
  world.addBody(sphereBody)

  bodies[id] = sphereBody

  return sphereBody.id
}

const updateRate = 1000 / 50;
setInterval(() => {
  //updateTanks3Position();
  // const tanksMessage = extractTanksMessage();
  // broadcastMessage(`${MessageType.pos3},${JSON.stringify(tanksMessage)}`);
  // postProcessTanksAndBults();
}, updateRate);

// const updateTanks3Position = () => {
//   const tanksArr = Object.values(tanks3);
//   tanksArr.forEach(tank => {
//     updatePosByStatus(tank, tanksArr);
//   });
// }

// const postProcessTanksAndBults = () => {
//   const tanksArr = Object.values(tanks3);
//   tanksArr.forEach(tank => {
//     filterHitBullets(tank);
//   });
// }

// const updatePosByStatus = (tankData: TankData3, tanksData: TankData3[]) => {
//   const curTime = Date.now();
//   const deltaTime = (curTime - tankData.stmp) / 1000;
//   const tankId = tankData.tank.id;
//   const tank = tankData.tank;
//   const boundary = tank.boundary;
//   const {direction, rotation} = tank.transformStatus;
//   tank.rotation.z += rotation * tank.speedRotate * deltaTime;
  
//   const pos = tank.position;
//   const rot = tank.rotation;

//   const offset = direction * tank.speedMove * deltaTime;
//   const offsetBlt = tank.speedBullet * deltaTime;
//   const boundX = boundary.x;
//   const boundY = boundary.y;
//   const predictX = pos.x + Math.cos(rot.z) * offset;
//   const predictY = pos.y + Math.sin(rot.z) * offset;
//   if (predictX < boundX && predictX > -boundX) {
//     pos.x = predictX;
//   }
//   if (predictY < boundY && predictY > -boundY) {
//     pos.y = predictY;
//   }
//   // update tank bullets
//   const tankBullets = tank.bullets;
  
//   for (const bltIdx in tankBullets) {
//     const b = tankBullets[bltIdx], bpos = b.position, brot = b.rotation;
//     // check if bullet hit other tanks
//     if (b.isHit) {
//       continue;
//     }
//     const bdir = [Math.cos(brot.z), Math.sin(brot.z)];
//     const predictBltX = bpos.x + bdir[0] * offsetBlt;
//     const predictBltY = bpos.y + bdir[1] * offsetBlt;
    
//     // check if bullet exceed boundary
//     if (predictBltX > boundX || predictBltX < -boundX || predictBltY > boundY || predictBltY < -boundY) {
//       // exceed boundary
//       b.isHit = true;
//     } else {
//       b.position.x = predictBltX;
//       b.position.y = predictBltY;
//     }
//   }
//   tankData.stmp = curTime;
// }

// const filterHitBullets = (tankData: TankData3) => {
//   const tankBlts = tankData.tank.bullets;
//   for (const bltIdx in tankBlts) {
//     if (tankBlts[bltIdx].isHit) {
//       delete tankBlts[bltIdx];
//     }
//   }
//   tankData.tank.bullets = tankBlts;
// }

const handleTankCommand = (id: string, commandType: string, command: string) => {
  broadcastMessage(`${commandType},${id},${command}`);
}

// const createNewTank = (id: string, x: number, y: number, r: number): TankData3 => {
//   if (!tanks3[id]) {
//     tanks3[id] = {
//       tank: new TankBase3(id, new Vector3(x, y, 0), new Euler(0, 0, r)),
//       stmp: Date.now(),
//       scor: 0
//     }
//   }
//   return tanks3[id];
// }

// const handleTankCommand3 = (id: string, commandType: string, command: Array<string>) => {
//   switch (commandType) {
//     case MessageType.st3: {
//       // tank start, command=x,y,r,speed move,speed rotate,bullet speed,timestamp
//       console.log(`tank start with ${command.join(',')}`);
//       createNewTank(id, parseFloat(command[0]), parseFloat(command[1]), parseFloat(command[2]));
//       break;
//     }
//     case MessageType.bon: {
//       tanks3[id].tank.boundary = new Vector3(parseFloat(command[0]), parseFloat(command[1]), 0);
//       break;
//     }
//     case MessageType.stup: {
//       const tk = tanks3[id];
//       tk.tank.speedMove = parseFloat(command[0]);
//       tk.tank.speedRotate = parseFloat(command[1]);
//       tk.tank.speedBullet = parseFloat(command[2]);
//       break;
//     }
//     case MessageType.dir: {
//       // tank move
//       tanks3[id].tank.transformStatus.direction = parseInt(command[0]);
//       break;
//     }
//     case MessageType.rot: {
//       // tank rotate
//       tanks3[id].tank.transformStatus.rotation = parseInt(command[0]);
//       break;
//     }
//     case MessageType.blt3: {
//       // tank shoot bullet
//       const tk = tanks3[id];
//       const tkPos = tk.tank.position;
//       const tkRot = tk.tank.rotation;
//       const bltInitPos = new Vector3(tkPos.x, tkPos.y, 0).add(new Vector3(10, 0, 1.1).applyEuler(new Euler(0, 0, tkRot.z)));
//       const currentBlts = Object.values(tk.tank.bullets);
//       const maxBltIdx = currentBlts.length > 0 ? Math.max.apply(null, currentBlts.map(blt => blt.idx)) : 0;
//       tk.tank.bullets[maxBltIdx + 1] = new Bullet3(bltInitPos, tkRot, tk.tank.speedBullet, maxBltIdx + 1);
//       break;
//     }
//     case MessageType.hit3: {
//       // tank hit another tanker
//       const tk = tanks3[id];
//       const bltId = parseInt(command[0]);
//       tk.scor++;
//       tk.tank.bullets[bltId].isHit = true;
//       break;
//     }
//     default:
//       break;
//   }
// }

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

const handleMessage = (id: string, message: Buffer[]): void => {
  const messageData = message.toString().split(',');
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
    case MessageType.bon:
    case MessageType.dir:
    case MessageType.rot:
    case MessageType.blt3:
    case MessageType.stup:
    case MessageType.hit3:
      //handleTankCommand3(id, messageType, messageData)
      break;
    default:
      break;
  }
}
