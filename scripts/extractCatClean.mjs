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

  // Box starts at rectLeft = 30, rectTop = 84.
  // The cat is in the region x: [2, 55], y: [80, 130].
  // Let's create an exact cat sticker image where anything that is the card background is transparent.
  // Pixels outside the card (x < 30 or y < 84): keep if alpha > 10.
  // Pixels inside the card (x >= 30 and y >= 84):
  // Cat paws have black outline or cat yellow fur (g > 85 or (r < 80 && g < 80 && b < 80)).
  // If r > 180 and g < 75, it is the red-orange box background, so set alpha = 0.
  const catMinX = 2;
  const catMaxX = 54;
  const catMinY = 80;
  const catMaxY = 127;
  const cW = catMaxX - catMinX + 1;
  const cH = catMaxY - catMinY + 1;

  const catRaw = Buffer.alloc(cH * (1 + cW * 4));
  for (let y = 0; y < cH; y++) {
    catRaw[y * (1 + cW * 4)] = 0;
    for (let x = 0; x < cW; x++) {
      const srcX = catMinX + x;
      const srcY = catMinY + y;
      const srcIdx = (srcY * width + srcX) * bpp;
      const destIdx = y * (1 + cW * 4) + 1 + x * 4;

      const r = uncompressed[srcIdx];
      const g = uncompressed[srcIdx + 1];
      const b = uncompressed[srcIdx + 2];
      const a = uncompressed[srcIdx + 3];

      let keep = false;
      if (a > 15) {
        if (srcX < 30 || srcY < 84) {
          keep = true;
        } else {
          // Inside the box area
          const isBlackOutline = (r < 90 && g < 90 && b < 90);
          const isCatFur = (g > 85);
          if (isBlackOutline || isCatFur) {
            keep = true;
          }
        }
      }

      if (keep) {
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

  // Also save the cat with high resolution 2x scaling (nearest/smooth) so it stays sharp on Retina!
  function savePNG(filename, widthPx, heightPx, rawBuffer) {
    const compressed = zlib.deflateSync(rawBuffer);
    const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    const ihdrData = Buffer.alloc(13);
    ihdrData.writeUInt32BE(widthPx, 0);
    ihdrData.writeUInt32BE(heightPx, 4);
    ihdrData[8] = 8; ihdrData[9] = 6; ihdrData[10] = 0; ihdrData[11] = 0; ihdrData[12] = 0;

    const crcTable = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      crcTable[n] = c;
    }
    function crc32(buf) {
      let c = -1;
      for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
      return (c ^ -1);
    }
    function makeChunk(type, data) {
      const len = data.length;
      const b = Buffer.alloc(12 + len);
      b.writeUInt32BE(len, 0);
      b.write(type, 4, 4, 'ascii');
      data.copy(b, 8);
      b.writeInt32BE(crc32(b.subarray(4, 8 + len)), 8 + len);
      return b;
    }
    const png = Buffer.concat([sig, makeChunk('IHDR', ihdrData), makeChunk('IDAT', compressed), makeChunk('IEND', Buffer.alloc(0))]);
    fs.writeFileSync(filename, png);
  }

  savePNG(path.resolve('public', 'hero-corner-cat.png'), cW, cH, catRaw);

  // 2x scaled for high-DPI displays
  const scale = 3;
  const sW = cW * scale;
  const sH = cH * scale;
  const scaledRaw = Buffer.alloc(sH * (1 + sW * 4));
  for (let y = 0; y < sH; y++) {
    scaledRaw[y * (1 + sW * 4)] = 0;
    const srcY = Math.floor(y / scale);
    for (let x = 0; x < sW; x++) {
      const srcX = Math.floor(x / scale);
      const srcIdx = srcY * (1 + cW * 4) + 1 + srcX * 4;
      const destIdx = y * (1 + sW * 4) + 1 + x * 4;
      scaledRaw[destIdx] = catRaw[srcIdx];
      scaledRaw[destIdx + 1] = catRaw[srcIdx + 1];
      scaledRaw[destIdx + 2] = catRaw[srcIdx + 2];
      scaledRaw[destIdx + 3] = catRaw[srcIdx + 3];
    }
  }
  savePNG(path.resolve('public', 'hero-corner-cat-hd.png'), sW, sH, scaledRaw);
}

run();
