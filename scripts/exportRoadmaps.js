import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

async function exportRoadmaps() {
  console.log('🔄 Đang xuất dữ liệu lộ trình học sang JSON...');

  const cs = await import('../src/data/roadmap/csRoadmap.js');
  const ict = await import('../src/data/roadmap/ictRoadmap.js');

  const csData = {
    examStructure: cs.CS_EXAM_STRUCTURE,
    twelveWeekPlan: cs.CS_12_WEEK_PLAN,
    stations: cs.csRoadmapStations
  };

  const ictData = {
    examStructure: ict.ICT_EXAM_STRUCTURE,
    twelveWeekPlan: ict.ICT_12_WEEK_PLAN,
    stations: ict.ictRoadmapStations
  };

  // Các thư mục xuất ra
  const targetDirs = [
    path.join(projectRoot, 'LoTrinhDayXich'),
    path.join(projectRoot, 'public', 'LoTrinhDayXich')
  ];

  targetDirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(path.join(dir, 'csRoadmap.json'), JSON.stringify(csData, null, 2), 'utf-8');
    fs.writeFileSync(path.join(dir, 'ictRoadmap.json'), JSON.stringify(ictData, null, 2), 'utf-8');
  });

  console.log('✅ Đã xuất thành công:');
  console.log('   - LoTrinhDayXich/csRoadmap.json');
  console.log('   - LoTrinhDayXich/ictRoadmap.json');
  console.log('   - public/LoTrinhDayXich/csRoadmap.json');
  console.log('   - public/LoTrinhDayXich/ictRoadmap.json');
}

exportRoadmaps().catch((err) => {
  console.error('❌ Lỗi xuất file:', err);
  process.exit(1);
});
