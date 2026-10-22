import fs from 'fs';
import path from 'path';

fs.copyFileSync(
  path.resolve('public', 'hero-corner-cat-hd.png'),
  path.resolve('src', 'assets', 'hero-corner-cat-hd.png')
);
fs.copyFileSync(
  path.resolve('public', 'hero-welcome-frame.png'),
  path.resolve('src', 'assets', 'hero-welcome-frame.png')
);
console.log('Copied assets to src/assets/');
