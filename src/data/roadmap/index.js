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
    highlights: ['Trí Tuệ Nhân Tạo & Internet', 'Tạo Trang Web HTML/CSS', 'Thực Hành CSDL & Bảng Tính', 'Luyện Đề Thi THPTQG Chuẩn 2025']
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
    highlights: ['Trí Tuệ Nhân Tạo & Hệ CSDL', 'Kĩ Thuật Lập Trình Python', 'Học Máy & Khoa Học Dữ Liệu', 'Luyện Đề Thi THPTQG Chuẩn 2025']
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
