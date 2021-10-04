import fs from 'fs-extra';
import path from 'path';

fs.copy(path.resolve(__dirname, '../static/models'), path.resolve(__dirname, '../build/models'));
fs.copy(path.resolve(__dirname, '../static/favicon.ico'), path.resolve(__dirname, '../build/favicon.ico'));
