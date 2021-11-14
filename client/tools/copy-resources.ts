import fs from 'fs-extra';
import path from 'path';

const staticResources = [
  'models',
  'textures',
  'fonts',
  'sounds',
  'favicon.ico'
]

staticResources.forEach(resource => {
  fs.copy(path.resolve(__dirname, `../static/${resource}`), path.resolve(__dirname, `../build/${resource}`));
});
