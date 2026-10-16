import { csRoadmapStations, CS_EXAM_STRUCTURE, CS_12_WEEK_PLAN } from './csRoadmap';
import { ictRoadmapStations, ICT_EXAM_STRUCTURE, ICT_12_WEEK_PLAN } from './ictRoadmap';

export const TRACK_TYPES = {
  ICT: 'ict', // Tin học ứng dụng
  CS: 'cs'    // Khoa học máy tính
};

export const TRACK_INFO = {
  [TRACK_TYPES.ICT]: {
    id: TRACK_TYPES.ICT,
    shortName: 'THUD (ICT)',
    fullName: 'Tin Học Ứng Dụng',
    englishName: 'Information & Communications Technology (ICT)',
    badgeColor: '#0284C7',
    gradientBg: 'linear-gradient(135deg, #0284C7, #0369A1)',
    examStructure: ICT_EXAM_STRUCTURE,
    twelveWeekPlan: ICT_12_WEEK_PLAN,
    stations: ictRoadmapStations,
    highlights: ['Bảng tính Excel Nâng Cao', 'Thiết Kế Web HTML/CSS', 'Đồ Họa & Biên Tập Video', 'Lý Thuyết A, B, D, G']
  },
  [TRACK_TYPES.CS]: {
    id: TRACK_TYPES.CS,
    shortName: 'KHMT (CS)',
    fullName: 'Khoa Học Máy Tính',
    englishName: 'Computer Science (CS)',
    badgeColor: '#EA580C',
    gradientBg: 'linear-gradient(135deg, #EA580C, #C2410C)',
    examStructure: CS_EXAM_STRUCTURE,
    twelveWeekPlan: CS_12_WEEK_PLAN,
    stations: csRoadmapStations,
    highlights: ['Cơ Sở Dữ Liệu & Ngôn Ngữ SQL', 'Giải Thuật & Lập Trình Python', 'Trí Tuệ Nhân Tạo & Học Máy', 'Cấu Trúc Bảng & Khóa Chính/Ngoại']
  }
};

export {
  csRoadmapStations,
  CS_EXAM_STRUCTURE,
  CS_12_WEEK_PLAN,
  ictRoadmapStations,
  ICT_EXAM_STRUCTURE,
  ICT_12_WEEK_PLAN
};
