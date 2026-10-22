import fs from 'fs';
import path from 'path';
import { csRoadmapStations } from '../src/data/roadmap/csRoadmap.js';
import { ictRoadmapStations } from '../src/data/roadmap/ictRoadmap.js';

let out = '--- CS STATIONS ---\n';
csRoadmapStations.forEach((s, i) => {
  out += `${i+1}. [${s.code}] ${s.title} (${s.lessons?.length || 0} bài)\n`;
});

out += '\n--- ICT STATIONS ---\n';
ictRoadmapStations.forEach((s, i) => {
  out += `${i+1}. [${s.code}] ${s.title} (${s.lessons?.length || 0} bài)\n`;
});

fs.writeFileSync(path.resolve('scripts', 'current_stations.txt'), out, 'utf-8');
