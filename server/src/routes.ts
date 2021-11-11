import express from 'express';
import {LaserScore, TankilaScore} from './db/scores';
import {getAll, updateOne} from './db/utils';

const router = express.Router();

router.get('/api/lasercredits', async (req, res) => {
  try {
    const laserScores = await getAll(LaserScore);
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
    const updateResult = await updateOne(LaserScore, {name}, {name, credit: creditInt});
    return res.status(200).json({credit: updateResult});
  } catch (e) {
    return res.status(400).json({err: e});
  }
});

router.get('/api/tankilabulletins', async (req, res) => {
  try {
    console.log(32);
    const tankilaScores = await getAll(TankilaScore) || [];
    console.log(34)
    return res.status(200).json(tankilaScores);
  } catch (e) {
    console.log(e)
    return res.status(400).json({err: e})
  }
});

export {
  router
};
