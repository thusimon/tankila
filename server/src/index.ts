require('dotenv').config();
import path from 'path';
import express from 'express';
const app = express();

const PORT = process.env.PORT;

app.use(express.static(path.join(__dirname, '../../client/build')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../../client/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Successfully started server on port ${PORT}`);
});