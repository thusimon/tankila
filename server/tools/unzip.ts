import fs from 'fs';
import unzipper from 'unzipper';

export const unzipToFolder = (zipPath: string, output: string) => {
  fs.createReadStream(zipPath)
  .pipe(unzipper.Extract({ path: output }));
}