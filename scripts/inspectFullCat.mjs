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

  // Let's print out what is around x: [0, 80], y: [75, 135]
  // In this region, find every pixel that is NOT transparent.
  // Let's save a crop of x: [0, 80], y: [75, 135] EXACTLY AS IS from the original image!
  const minX = 0;
  const maxX = 80;
  const minY = 75;
  const maxY = 135;
  const cW = maxX - minX + 1;
  const cH = maxY - minY + 1;

  const rawData = Buffer.alloc(cH * (1 + cW * 4));
  for (let y = 0; y < cH; y++) {
    rawData[y * (1 + cW * 4)] = 0;
    for (let x = 0; x < cW; x++) {
      const srcX = minX + x;
      const srcY = minY + y;
      const srcIdx = (srcY * width + srcX) * bpp;
      const destIdx = y * (1 + cW * 4) + 1 + x * 4;
      rawData[destIdx] = uncompressed[srcIdx];
      rawData[destIdx + 1] = uncompressed[srcIdx + 1];
      rawData[destIdx + 2] = uncompressed[srcIdx + 2];
      rawData[destIdx + 3] = uncompressed[srcIdx + 3];
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(cW, 0);
  ihdrData.writeUInt32BE(cH, 4);
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
  fs.writeFileSync(path.resolve('public', 'raw-corner-crop.png'), png);
  console.log('Saved public/raw-corner-crop.png');
}

run();
