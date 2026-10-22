import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function run() {
  const inputPath = path.resolve('public', 'Không Có Tiêu Đề14_20261022003951.png');
  const buf = fs.readFileSync(inputPath);
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  const colorType = buf[25];
  const bpp = colorType === 6 ? 4 : 3;
  const stride = 1 + width * bpp;

  let pos = 8;
  const idatChunks = [];
  while (pos < buf.length) {
    const length = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    if (type === 'IDAT') idatChunks.push(buf.subarray(pos + 8, pos + 8 + length));
    pos += 12 + length;
  }
  const decompressed = zlib.inflateSync(Buffer.concat(idatChunks));
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

  // Exact crop bounds:
  // Cat starts at minX = 2, minY = 80
  // Box ends at maxX = 338, maxY = 206
  const sX = 2;
  const sY = 80;
  const cW = 338 - sX + 1; // 337
  const cH = 206 - sY + 1; // 127

  // Upscale by 3x using bilinear interpolation for smooth, crisp rendering on high-DPI displays
  const scale = 3;
  const outW = cW * scale;
  const outH = cH * scale;
  const outBuf = Buffer.alloc(outH * (1 + outW * 4));

  for (let dy = 0; dy < outH; dy++) {
    outBuf[dy * (1 + outW * 4)] = 0; // Filter 0
    const gy = (dy / scale);
    const y0 = Math.min(Math.floor(gy), cH - 1);
    const y1 = Math.min(y0 + 1, cH - 1);
    const fy = gy - y0;

    for (let dx = 0; dx < outW; dx++) {
      const gx = (dx / scale);
      const x0 = Math.min(Math.floor(gx), cW - 1);
      const x1 = Math.min(x0 + 1, cW - 1);
      const fx = gx - x0;

      // 4 neighbors in source
      const idx00 = ((sY + y0) * width + (sX + x0)) * bpp;
      const idx10 = ((sY + y0) * width + (sX + x1)) * bpp;
      const idx01 = ((sY + y1) * width + (sX + x0)) * bpp;
      const idx11 = ((sY + y1) * width + (sX + x1)) * bpp;

      const outIdx = dy * (1 + outW * 4) + 1 + dx * 4;

      for (let c = 0; c < 4; c++) {
        const v00 = bpp === 4 ? uncompressed[idx00 + c] : (c === 3 ? 255 : uncompressed[idx00 + c]);
        const v10 = bpp === 4 ? uncompressed[idx10 + c] : (c === 3 ? 255 : uncompressed[idx10 + c]);
        const v01 = bpp === 4 ? uncompressed[idx01 + c] : (c === 3 ? 255 : uncompressed[idx01 + c]);
        const v11 = bpp === 4 ? uncompressed[idx11 + c] : (c === 3 ? 255 : uncompressed[idx11 + c]);

        const top = v00 * (1 - fx) + v10 * fx;
        const bot = v01 * (1 - fx) + v11 * fx;
        const val = Math.round(top * (1 - fy) + bot * fy);
        outBuf[outIdx + c] = Math.max(0, Math.min(255, val));
      }
    }
  }

  // PNG encoder
  const compressed = zlib.deflateSync(outBuf);
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(outW, 0);
  ihdrData.writeUInt32BE(outH, 4);
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
  fs.writeFileSync(path.resolve('public', 'hero-welcome-frame.png'), png);
  fs.writeFileSync(path.resolve('src', 'assets', 'hero-welcome-frame.png'), png);
  console.log(`Saved hero-welcome-frame.png at ${outW}x${outH} HD`);
}

run();
