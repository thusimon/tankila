import fs from 'fs';
import path from 'path';
import unzipper from 'unzipper';

const unzipToFolder = (zipPath: string, output: string) => {
  fs.createReadStream(zipPath)
  .pipe(unzipper.Extract({ path: output }));
}

const laserDefenderStatic = path.join(__dirname, '../static');
const buildPath = path.join(__dirname, '../build');
unzipToFolder(path.join(laserDefenderStatic, '/laserDefender.zip'), buildPath);
console.log('successfully unziped laser defender');
