import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function processImage() {
  const inputPath = path.resolve('public', 'Không Có Tiêu Đề14_20261022003951.png');
  if (!fs.existsSync(inputPath)) return;
  const buf = fs.readFileSync(inputPath);
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  const colorType = buf[25];
  const bpp = colorType === 6 ? 4 : (colorType === 2 ? 3 : 4);
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

  // Find tight bounding box of alpha > 10
  let minX = width, maxX = 0, minY = height, maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * bpp;
      if (uncompressed[idx + 3] > 10) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  // Find the orange rectangle bounds:
  const midX = Math.floor(width / 2);
  let rectTop = -1, rectBottom = -1;
  for (let y = 0; y < height; y++) {
    const idx = (y * width + midX) * bpp;
    if (uncompressed[idx + 3] > 100) {
      if (rectTop === -1) rectTop = y;
      rectBottom = y;
    }
  }

  const midY = Math.floor((rectTop + rectBottom) / 2);
  let rectLeft = -1, rectRight = -1;
  for (let x = 0; x < width; x++) {
    const idx = (midY * width + x) * bpp;
    if (uncompressed[idx + 3] > 100) {
      if (rectLeft === -1) rectLeft = x;
      rectRight = x;
    }
  }

  // Sample colors from the rectangle
  const colorLeft = [
    uncompressed[(midY * width + rectLeft + 50) * bpp],
    uncompressed[(midY * width + rectLeft + 50) * bpp + 1],
    uncompressed[(midY * width + rectLeft + 50) * bpp + 2]
  ];
  const colorRight = [
    uncompressed[(midY * width + rectRight - 50) * bpp],
    uncompressed[(midY * width + rectRight - 50) * bpp + 1],
    uncompressed[(midY * width + rectRight - 50) * bpp + 2]
  ];
  const colorGlow = [
    uncompressed[((rectTop + 50) * width + rectRight - 50) * bpp],
    uncompressed[((rectTop + 50) * width + rectRight - 50) * bpp + 1],
    uncompressed[((rectTop + 50) * width + rectRight - 50) * bpp + 2]
  ];

  fs.writeFileSync(path.resolve('scripts', 'banner_info.json'), JSON.stringify({
    width, height, minX, maxX, minY, maxY,
    rectTop, rectBottom, rectLeft, rectRight,
    colorLeft: `rgb(${colorLeft.join(',')})`,
    colorRight: `rgb(${colorRight.join(',')})`,
    colorGlow: `rgb(${colorGlow.join(',')})`
  }, null, 2));

  function encodePNG(sX, sY, cW, cH) {
    const rawData = Buffer.alloc(cH * (1 + cW * 4));
    for (let y = 0; y < cH; y++) {
      rawData[y * (1 + cW * 4)] = 0;
      for (let x = 0; x < cW; x++) {
        const srcX = sX + x;
        const srcY = sY + y;
        const srcIdx = (srcY * width + srcX) * bpp;
        const destIdx = y * (1 + cW * 4) + 1 + x * 4;
        rawData[destIdx] = uncompressed[srcIdx];
        rawData[destIdx + 1] = uncompressed[srcIdx + 1];
        rawData[destIdx + 2] = uncompressed[srcIdx + 2];
        rawData[destIdx + 3] = bpp === 4 ? uncompressed[srcIdx + 3] : 255;
      }
    }
    const compressed = zlib.deflateSync(rawData);
    const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    const ihdrData = Buffer.alloc(13);
    ihdrData.writeUInt32BE(cW, 0);
    ihdrData.writeUInt32BE(cH, 4);
    ihdrData[8] = 8;
    ihdrData[9] = 6;
    ihdrData[10] = 0; ihdrData[11] = 0; ihdrData[12] = 0;
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
    return Buffer.concat([sig, makeChunk('IHDR', ihdrData), makeChunk('IDAT', compressed), makeChunk('IEND', Buffer.alloc(0))]);
  }

  // 1. Save cropped banner frame (exact orange rectangle + cat)
  const exactBanner = encodePNG(2, 80, 338 - 2 + 1, 206 - 80 + 1);
  fs.writeFileSync(path.resolve('public', 'hero-welcome-frame.png'), exactBanner);

  // 2. Also save pure cat sticker
  // Cat bounds: from x=2 to x=32 (body) and paws up to x=52 at y<=88, down to y=125 (tail)
  // Let's create a transparent sticker of JUST the cat
  const catCW = 55;
  const catCH = 48; // from y=80 to y=128
  const catRaw = Buffer.alloc(catCH * (1 + catCW * 4));
  for (let y = 0; y < catCH; y++) {
    catRaw[y * (1 + catCW * 4)] = 0;
    for (let x = 0; x < catCW; x++) {
      const srcX = 2 + x;
      const srcY = 80 + y;
      const srcIdx = (srcY * width + srcX) * bpp;
      const destIdx = y * (1 + catCW * 4) + 1 + x * 4;

      // If x >= 28 and y >= 86, this is inside the orange card body (below cat paws)
      // Check if pixel is part of cat (black outline or cat fur) or just the card background
      const r = uncompressed[srcIdx];
      const g = uncompressed[srcIdx + 1];
      const b = uncompressed[srcIdx + 2];
      const a = uncompressed[srcIdx + 3];

      let isCat = true;
      if (srcX >= 28 && srcY >= 88) {
        // Inside orange card body
        // Cat paws: check if outline or orange cat fur vs card gradient
        // Card is uniform orange (around 200, 60, 3)
        // Black outline has r < 80, g < 80, b < 80
        // Cat yellow/gold highlights have g > 90
        if (r > 150 && g < 80 && b < 30) {
          isCat = false; // it's the card background
        }
      }

      if (isCat && a > 10) {
        catRaw[destIdx] = r;
        catRaw[destIdx + 1] = g;
        catRaw[destIdx + 2] = b;
        catRaw[destIdx + 3] = a;
      } else {
        catRaw[destIdx] = 0;
        catRaw[destIdx + 1] = 0;
        catRaw[destIdx + 2] = 0;
        catRaw[destIdx + 3] = 0;
      }
    }
  }
  const compressedCat = zlib.deflateSync(catRaw);
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(catCW, 0);
  ihdrData.writeUInt32BE(catCH, 4);
  ihdrData[8] = 8; ihdrData[9] = 6; ihdrData[10] = 0; ihdrData[11] = 0; ihdrData[12] = 0;
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
  const catPNG = Buffer.concat([sig, makeChunk('IHDR', ihdrData), makeChunk('IDAT', compressedCat), makeChunk('IEND', Buffer.alloc(0))]);
  fs.writeFileSync(path.resolve('public', 'banner-cat-sticker.png'), catPNG);
}

// CRC32 implementation
const crcTable = new Int32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}
function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ -1);
}

try {
  processImage();
} catch (e) {
  console.error('Error processing banner:', e);
}
