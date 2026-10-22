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

  // Find the exact right boundary of the cat outline for each row y:
  // Cat is in y: 4..55, x: 2..40
  // For each row y, find the rightmost black outline pixel in x: 25..42
  const rightBoundary = new Int32Array(height);
  for (let y = 0; y < height; y++) {
    rightBoundary[y] = -1;
    for (let x = 42; x >= 0; x--) {
      const idx = (y * width + x) * 4;
      const r = uncompressed[idx], g = uncompressed[idx+1], b = uncompressed[idx+2], a = uncompressed[idx+3];
      // black outline: r, g, b < 90 and a > 100
      if (a > 100 && r < 90 && g < 90 && b < 90) {
        rightBoundary[y] = x;
        break;
      }
    }
  }

  // Cat bounding box:
  const catMinX = 2;
  const catMaxX = 40;
  const catMinY = 4;
  const catMaxY = 55;
  const cW = catMaxX - catMinX + 1; // 39
  const cH = catMaxY - catMinY + 1; // 52

  // Create 3x upscaled PNG with bilinear smoothing
  const scale = 4;
  const sW = cW * scale;
  const sH = cH * scale;
  const scaledBuf = Buffer.alloc(sH * (1 + sW * 4));

  for (let dy = 0; dy < sH; dy++) {
    scaledBuf[dy * (1 + sW * 4)] = 0; // Filter 0
    const gy = catMinY + (dy / scale);
    const iy = Math.min(Math.floor(gy), height - 1);

    for (let dx = 0; dx < sW; dx++) {
      const gx = catMinX + (dx / scale);
      const ix = Math.min(Math.floor(gx), width - 1);

      // Check if (gx, gy) is inside the cat (x <= rightBoundary[iy] + 0.5)
      const rBound = rightBoundary[iy];
      let isInsideCat = false;
      if (rBound > 0 && gx <= rBound + 0.8) {
        isInsideCat = true;
      }

      const outIdx = dy * (1 + sW * 4) + 1 + dx * 4;
      if (isInsideCat) {
        const x0 = Math.floor(gx), x1 = Math.min(x0 + 1, width - 1);
        const y0 = Math.floor(gy), y1 = Math.min(y0 + 1, height - 1);
        const fx = gx - x0, fy = gy - y0;

        for (let c = 0; c < 4; c++) {
          const v00 = uncompressed[(y0 * width + x0) * 4 + c];
          const v10 = uncompressed[(y0 * width + x1) * 4 + c];
          const v01 = uncompressed[(y1 * width + x0) * 4 + c];
          const v11 = uncompressed[(y1 * width + x1) * 4 + c];
          const val = Math.round((v00 * (1 - fx) + v10 * fx) * (1 - fy) + (v01 * (1 - fx) + v11 * fx) * fy);
          scaledBuf[outIdx + c] = val;
        }
      } else {
        scaledBuf[outIdx] = 0;
        scaledBuf[outIdx + 1] = 0;
        scaledBuf[outIdx + 2] = 0;
        scaledBuf[outIdx + 3] = 0;
      }
    }
  }

  // PNG encoder
  const compressed = zlib.deflateSync(scaledBuf);
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(sW, 0);
  ihdrData.writeUInt32BE(sH, 4);
  ihdrData[8] = 8; ihdrData[9] = 6; ihdrData[10] = 0; ihdrData[11] = 0; ihdrData[12] = 0;

  const crcTable = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    crcTable[n] = c;
  }
  function crc32(b) {
    let c = -1;
    for (let i = 0; i < b.length; i++) c = crcTable[(c ^ b[i]) & 0xff] ^ (c >>> 8);
    return (c ^ -1);
  }
  function makeChunk(type, data) {
    const len = data.length;
    const b = Buffer.alloc(12 + len);
    b.writeUInt32BE(len, 0);
    b.write(type, 4, 4, 'ascii');
    data.copy(b, 8);
    const crc = crc32(b.subarray(4, 8 + len));
    b.writeInt32BE(crc, 8 + len);
    return b;
  }

  const png = Buffer.concat([sig, makeChunk('IHDR', ihdrData), makeChunk('IDAT', compressed), makeChunk('IEND', Buffer.alloc(0))]);
  fs.writeFileSync(path.resolve('public', 'cat-hanging-full.png'), png);
  fs.writeFileSync(path.resolve('src', 'assets', 'cat-hanging-full.png'), png);
  console.log(`Saved cat-hanging-full.png (${sW}x${sH})`);
}

run();
