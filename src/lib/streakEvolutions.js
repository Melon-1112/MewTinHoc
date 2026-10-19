// ============================================================
// BỘ SƯU TẬP HÌNH DẠNG STREAK (Streak Evolutions)
// ------------------------------------------------------------
// Càng duy trì chuỗi streak lâu, học viên càng mở khoá nhiều
// hình dạng mới. Cấp tối đa: 3 tháng (90 ngày).
//
// Ngưỡng mở khoá tính theo SỐ NGÀY STREAK hiện có (>= minDays):
//   Cấp 1 - 0  ngày : Ngọn Lửa Khởi Đầu
//   Cấp 2 - 14 ngày : Tinh Linh Lửa Đỏ
//   Cấp 3 - 30 ngày : Ngọn Lửa Tím
//   Cấp 4 - 45 ngày : Tinh Linh Lửa Tím
//   Cấp 5 - 60 ngày : Rồng Lửa Tím - Đỏ
//   Cấp 6 - 90 ngày : Đại Cổ Thụ Cam   (cấp tối đa)
//
// Mỗi cấp chỉ mô tả 1 lần duy nhất tại đây. UI (thẻ streak, bộ sưu
// tập) chỉ đọc dữ liệu từ mảng này để tránh lệch nội dung.
// Hình vẽ nằm ở components/StreakEvolutionArt.jsx, tra theo `id`.
// ============================================================

export const STREAK_EVOLUTION_MAX_DAYS = 90;

export const STREAK_EVOLUTIONS = [
  {
    id: 'ngon-lua',
    tier: 1,
    tierLabel: 'Cấp 1',
    name: 'Ngọn Lửa Khởi Đầu',
    minDays: 0,
    dateLabel: '0 ngày',
    accent: '#F97316',
    secondary: '#FB923C',
    titleColor: '#C2410C',
    glow: 'rgba(249, 115, 22, 0.45)',
    aura: 'radial-gradient(circle at 50% 50%, #FFEDD5 0%, #FFF7ED 78%)',
    card: { bg: 'linear-gradient(180deg, #FFFBF5 0%, #FFF3E4 100%)', border: '#FDBA74' },
    badge: { from: '#FB923C', to: '#F97316', text: '#FFFFFF' },
    description: 'Bắt đầu hành trình thay đổi bản thân.'
  },
  {
    id: 'tinh-linh-do',
    tier: 2,
    tierLabel: 'Cấp 2',
    name: 'Tinh Linh Lửa Đỏ',
    shortName: 'Tinh Linh Lửa Đỏ',
    minDays: 14,
    dateLabel: '14 ngày (2 tuần)',
    accent: '#EF4444',
    secondary: '#F87171',
    titleColor: '#DC2626',
    glow: 'rgba(239, 68, 68, 0.5)',
    aura: 'radial-gradient(circle at 50% 50%, #FEE2E2 0%, #FFF1F2 78%)',
    card: { bg: 'linear-gradient(180deg, #FFF5F5 0%, #FFE9E9 100%)', border: '#FCA5A5' },
    badge: { from: '#F87171', to: '#DC2626', text: '#FFFFFF' },
    description: 'Ngọn lửa trong bạn đã bắt đầu bùng cháy.'
  },
  {
    id: 'lua-tim',
    tier: 3,
    tierLabel: 'Cấp 3',
    name: 'Ngọn Lửa Tím',
    minDays: 30,
    dateLabel: '30 ngày (1 tháng)',
    accent: '#8B5CF6',
    secondary: '#C4B5FD',
    titleColor: '#7C3AED',
    glow: 'rgba(139, 92, 246, 0.5)',
    aura: 'radial-gradient(circle at 50% 50%, #EDE9FE 0%, #F5F3FF 78%)',
    card: { bg: 'linear-gradient(180deg, #FAF8FF 0%, #F0EAFF 100%)', border: '#C4B5FD' },
    badge: { from: '#A78BFA', to: '#8B5CF6', text: '#FFFFFF' },
    description: 'Bạn đã tạo được thói quen tốt.'
  },
  {
    id: 'tinh-linh-tim',
    tier: 4,
    tierLabel: 'Cấp 4',
    name: 'Tinh Linh Lửa Tím',
    shortName: 'Tinh Linh Lửa Tím',
    minDays: 45,
    dateLabel: '45 ngày (1 tháng 2 tuần)',
    accent: '#A855F7',
    secondary: '#C084FC',
    titleColor: '#9333EA',
    glow: 'rgba(168, 85, 247, 0.55)',
    aura: 'radial-gradient(circle at 50% 50%, #F3E8FF 0%, #FAF5FF 78%)',
    card: { bg: 'linear-gradient(180deg, #FCF8FF 0%, #F4E9FF 100%)', border: '#D8B4FE' },
    badge: { from: '#C084FC', to: '#A855F7', text: '#FFFFFF' },
    description: 'Sức mạnh nội tại đang lớn dần.'
  },
  {
    id: 'rong-lua',
    tier: 5,
    tierLabel: 'Cấp 5',
    name: 'Rồng Lửa Tím - Đỏ',
    shortName: 'Rồng Lửa Tím - Đỏ',
    minDays: 60,
    dateLabel: '60 ngày (2 tháng)',
    accent: '#DB2777',
    secondary: '#A855F7',
    titleColor: '#DB2777',
    glow: 'rgba(219, 39, 119, 0.5)',
    aura: 'radial-gradient(circle at 50% 50%, #FCE7F3 0%, #FDF2F8 78%)',
    card: { bg: 'linear-gradient(180deg, #FFF6FB 0%, #FBE9F5 100%)', border: '#F9A8D4' },
    badge: { from: '#F472B6', to: '#DB2777', text: '#FFFFFF' },
    description: 'Bạn không còn là người cũ nữa!'
  },
  {
    id: 'dai-co-thu',
    tier: 6,
    tierLabel: 'Cấp 6',
    name: 'Đại Cổ Thụ Cam',
    minDays: 90,
    dateLabel: '90 ngày (3 tháng)',
    accent: '#F59E0B',
    secondary: '#FBBF24',
    titleColor: '#D97706',
    glow: 'rgba(245, 158, 11, 0.55)',
    aura: 'radial-gradient(circle at 50% 50%, #FEF3C7 0%, #FFFBEB 78%)',
    card: { bg: 'linear-gradient(180deg, #FFFCF0 0%, #FEF4D8 100%)', border: '#FCD34D' },
    badge: { from: '#FBBF24', to: '#F59E0B', text: '#FFFFFF' },
    maxBadge: 'CẤP TỐI ĐA',
    description: 'Bạn đã chinh phục được kỷ luật và ý chí!'
  }
];

/** Trả về cấp tiến hoá tương ứng với số ngày streak hiện có. */
export const getEvolutionByDays = (days) => {
  const d = Number(days) || 0;
  let result = STREAK_EVOLUTIONS[0];
  for (const evo of STREAK_EVOLUTIONS) {
    if (d >= evo.minDays) result = evo;
  }
  return result;
};

/** Chỉ số (0-based) của cấp hiện tại trong mảng STREAK_EVOLUTIONS. */
export const getEvolutionIndexByDays = (days) =>
  STREAK_EVOLUTIONS.findIndex((e) => e.id === getEvolutionByDays(days).id);

/** Cấp kế tiếp cần mở khoá, hoặc null nếu đã đạt cấp tối đa. */
export const getNextEvolutionByDays = (days) => {
  const idx = getEvolutionIndexByDays(days);
  return STREAK_EVOLUTIONS[idx + 1] || null;
};

/**
 * Tiến độ mở khoá cấp kế tiếp.
 * @returns {{ current: object, next: object|null, percent: number, daysToNext: number }}
 */
export const getEvolutionProgress = (days) => {
  const d = Math.max(0, Number(days) || 0);
  const current = getEvolutionByDays(d);
  const next = getNextEvolutionByDays(d);

  if (!next) {
    // Đã đạt cấp tối đa, nhưng vẫn cho phép streak tiếp tục tăng
    // Thanh tiến trình sẽ luôn hiển thị 100%
    return { current, next: null, percent: 100, daysToNext: 0 };
  }

  const span = next.minDays - current.minDays;
  const gained = d - current.minDays;
  const percent = span > 0
    ? Math.max(0, Math.min(100, Math.round((gained / span) * 100)))
    : 100;

  return { current, next, percent, daysToNext: Math.max(0, next.minDays - d) };
};
