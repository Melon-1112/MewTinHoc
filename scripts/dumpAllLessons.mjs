import fs from 'fs';
import path from 'path';
import { csRoadmapStations } from '../src/data/roadmap/csRoadmap.js';
import { ictRoadmapStations } from '../src/data/roadmap/ictRoadmap.js';

let out = '';
out += '=== CS ROADMAP ===\n';
csRoadmapStations.forEach((s) => {
  out += `\n[Station: ${s.id}] Code: ${s.code} - ${s.title}\n`;
  (s.lessons || []).forEach((l) => {
    out += `   - [${l.id}] ${l.title} (${l.bookRef || ''})\n`;
  });
});

out += '\n=== ICT ROADMAP ===\n';
ictRoadmapStations.forEach((s) => {
  out += `\n[Station: ${s.id}] Code: ${s.code} - ${s.title}\n`;
  (s.lessons || []).forEach((l) => {
    out += `   - [${l.id}] ${l.title} (${l.bookRef || ''})\n`;
  });
});

fs.writeFileSync(path.resolve('scripts', 'all_lessons_map.txt'), out, 'utf-8');
