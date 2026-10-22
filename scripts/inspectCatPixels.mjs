import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function run() {
  const buf = fs.readFileSync(path.resolve('public', 'raw-corner-crop.png'));
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  
  let pos = 8;
  const idatChunks = [];
  while (pos < buf.length) {
    const length = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    if (type === 'IDAT') idatChunks.push(buf.subarray(pos + 8, pos + 8 + length));
    pos += 12 + length;
  }
  const decompressed = zlib.inflateSync(Buffer.concat(idatChunks));
  const bpp = 4;
  const stride = 1 + width * bpp;
  const uncompressed = Buffer.alloc(width * height * bpp);

  for (let y = 0; y < height; y++) {
    const filter = decompressed[y * stride];
    const rowStart = y * stride + 1;
    const outRowStart = y * width * bpp;
    for (let x = 0; x < width * bpp; x++) {
      const raw = decompressed[rowStart + x];
      let left = x >= bpp ? uncompressed[outRowStart + x - bpp] : 0;
      let up = y > 0 ? uncompressed[outRowStart - width * bpp + x] : 0;
      let upLeft = (y > 0 && x >= bpp) ? uncompressed[outRowStart - width * bpp + x - bpp] : 0;
      let val = raw;
      if (filter === 1) val = (raw + left) & 0xff;
      else if (filter === 2) val = (raw + up) & 0xff;
      else if (filter === 3) val = (raw + Math.floor((left + up) / 2)) & 0xff;
      else if (filter === 4) {
        const p = left + up - upLeft;
        const pa = Math.abs(p - left), pb = Math.abs(p - up), pc = Math.abs(p - upLeft);
        let pr = left;
        if (pb < pa && pb <= pc) pr = up;
        else if (pc < pa && pc < pb) pr = upLeft;
        val = (raw + pr) & 0xff;
      }
      uncompressed[outRowStart + x] = val;
    }
  }

  // Look at lines y = 15 to 45 (the cat body), print out x positions where pixel is outline or fur
  console.log(`Image size: ${width}x${height}`);
  const lines = [];
  for (let y = 0; y < height; y += 2) {
    let row = `y=${y.toString().padStart(2)}: `;
    for (let x = 0; x < Math.min(50, width); x++) {
      const idx = (y * width + x) * 4;
      const r = uncompressed[idx], g = uncompressed[idx+1], b = uncompressed[idx+2], a = uncompressed[idx+3];
      if (a < 50) row += ' ';
      else if (r < 80 && g < 80 && b < 80) row += '#'; // outline
      else if (g > 85) row += 'C'; // cat fur
      else row += '.'; // orange box
    }
    lines.push(row);
  }
  fs.writeFileSync(path.resolve('scripts', 'cat_ascii.txt'), lines.join('\n'));
}

run();
