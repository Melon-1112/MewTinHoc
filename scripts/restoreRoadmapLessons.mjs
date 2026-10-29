/**
 * ==============================================================================
 * KHÔI PHỤC MẢNG "lessons" CHO CÁC CHẶNG TRONG LỘ TRÌNH DÂY XÍCH
 * ------------------------------------------------------------------------------
 * Lỗi: commit "Chinh sua lo trinh day xich" đã vô tình làm mất mảng "lessons"
 *       của toàn bộ 18 chặng (9 CS + 9 ICT) trong:
 *         - src/data/roadmap/csRoadmap.js
 *         - src/data/roadmap/ictRoadmap.js
 *         - LoTrinhDayXich/*.json  và  public/LoTrinhDayXich/*.json
 *       => RoadmapTab render tại `station.lessons.length` -> TypeError -> trang trắng.
 *
 * Cách sửa: lấy lại nguyên mảng "lessons" của từng chặng từ phiên bản dữ liệu
 *           trước đó (HEAD~1) — vốn đã khớp 1-1 với danh sách chặng hiện tại
 *           (id + title + thứ tự đều không đổi) — rồi ghi lại vào file .js.
 *
 * Chạy: node scripts/restoreRoadmapLessons.mjs
 * ==============================================================================
 */
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

/** Đọc nội dung file JS của một commit cũ ra file tạm để import được. */
async function extractOldStations(fileRelPath, exportName, tmpName) {
  const tmpFile = path.join(projectRoot, tmpName);
  const content = execFileSync('git', ['show', `HEAD~1:${fileRelPath}`], {
    cwd: projectRoot,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024
  });
  fs.writeFileSync(tmpFile, content, 'utf8');
  const mod = await import(`file:///${tmpFile.replace(/\\/g, '/')}`);
  fs.rmSync(tmpFile, { force: true });
  return mod[exportName];
}

const oldCs = await extractOldStations(
  'src/data/roadmap/csRoadmap.js',
  'csRoadmapStations',
  '__restore_old_cs.mjs'
);
const oldIct = await extractOldStations(
  'src/data/roadmap/ictRoadmap.js',
  'ictRoadmapStations',
  '__restore_old_ict.mjs'
);

/** Map stationId -> mảng lessons (lấy nguyên bản từ dữ liệu cũ). */
function buildPlan(oldStations) {
  const plan = {};
  oldStations.forEach((st) => {
    if (Array.isArray(st.lessons) && st.lessons.length > 0) {
      plan[st.id] = st.lessons;
    }
  });
  return plan;
}

const PLAN = { cs: buildPlan(oldCs), ict: buildPlan(oldIct) };

/**
 * Ghi lại file .js: chèn mảng "lessons" vào cuối mỗi khối chặng,
 * ngay trước dấu "}" đóng khối (giữ nguyên mọi thuộc tính khác).
 */
function restoreJsFile(filePath, plan) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const EOL = raw.includes('\r\n') ? '\r\n' : '\n';
  const lines = raw.split(EOL);

  const out = [];
  let currentId = null;
  let buffer = [];
  let restored = 0;
  const missing = [];

  const flush = () => {
    if (!currentId) {
      out.push(...buffer);
      buffer = [];
      return;
    }
    const lessons = plan[currentId];
    if (!lessons || lessons.length === 0) {
      missing.push(currentId);
      out.push(...buffer);
      buffer = [];
      return;
    }
    // Tìm dòng đóng khối chặng: dòng chỉ chứa "}," hoặc "}"
    let closeIdx = -1;
    for (let i = buffer.length - 1; i >= 0; i -= 1) {
      const t = buffer[i].trim();
      if (t === '},' || t === '}') {
        closeIdx = i;
        break;
      }
    }
    if (closeIdx === -1) {
      missing.push(currentId);
      out.push(...buffer);
      buffer = [];
      return;
    }

    // Dòng ngay trước dòng đóng là thuộc tính cuối cùng của chặng.
    // Ta chèn "lessons" vào giữa thuộc tính đó và dấu "}," đóng khối,
    // đồng thời bảo đảm dấu phẩy ở đúng chỗ cho cú pháp JS hợp lệ.
    const lastPropIdx = closeIdx - 1;
    const lastProp = buffer[lastPropIdx];
    const hasComma = lastProp.trimEnd().endsWith(',');
    const lastPropNoComma = hasComma
      ? lastProp.replace(/,\s*$/, '')
      : lastProp;

    const json = JSON.stringify(lessons, null, 2).split('\n').join(EOL + '    ');

    out.push(...buffer.slice(0, lastPropIdx));
    out.push(`${lastPropNoComma},`);
    out.push(`    "lessons": ${json}`);
    out.push(...buffer.slice(closeIdx));
    restored += 1;
    buffer = [];
  };

  for (const line of lines) {
    const idMatch = line.match(/"id":\s*"((?:ict|cs)_station_\d+)"/);
    if (idMatch) {
      flush();
      currentId = idMatch[1];
      buffer.push(line);
    } else {
      buffer.push(line);
    }
  }
  flush();

  if (missing.length > 0) {
    throw new Error(`Thiếu dữ liệu bài học cho các chặng: ${missing.join(', ')}`);
  }

  fs.writeFileSync(filePath, out.join(EOL), 'utf8');
  return restored;
}

const csPath = path.join(projectRoot, 'src', 'data', 'roadmap', 'csRoadmap.js');
const ictPath = path.join(projectRoot, 'src', 'data', 'roadmap', 'ictRoadmap.js');

const csCount = restoreJsFile(csPath, PLAN.cs);
const ictCount = restoreJsFile(ictPath, PLAN.ict);

console.log(`✅ Đã khôi phục "lessons" cho ${csCount} chặng CS và ${ictCount} chặng ICT.`);
