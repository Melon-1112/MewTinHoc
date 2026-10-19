import React from 'react';

// ============================================================
// HÌNH VẼ 6 CẤP TIẾN HOÁ STREAK
// ------------------------------------------------------------
// Ảnh được cắt trực tiếp từ bảng thiết kế gốc nên giống hệt bản vẽ.
//  - Cấp ĐÃ mở khoá : hiện ảnh màu đầy đủ.
//  - Cấp CHƯA mở khoá: chỉ hiện đúng dáng hình, TÔ ĐEN TOÀN BỘ
//    bằng filter brightness(0) — giữ nguyên độ trong suốt của ảnh
//    nên ra một cái "bóng" đen, không lộ chi tiết lẫn màu sắc.
// ============================================================

const BASE_PATH = import.meta.env.BASE_URL || '/';

const ART = {
  'ngon-lua': `${BASE_PATH}img/StreakLevel/1.png`,
  'tinh-linh-do': `${BASE_PATH}img/StreakLevel/2.png`,
  'lua-tim': `${BASE_PATH}img/StreakLevel/3.png`,
  'tinh-linh-tim': `${BASE_PATH}img/StreakLevel/4.png`,
  'rong-lua': `${BASE_PATH}img/StreakLevel/5.png`,
  'dai-co-thu': `${BASE_PATH}img/StreakLevel/6.png`
};

/**
 * Hình vẽ một cấp tiến hoá streak.
 * @param {string}  id    - mã cấp ('ngon-lua', 'lua-tim', ...)
 * @param {boolean} mono  - true = bóng đen toàn bộ (dùng cho cấp chưa mở khoá)
 * @param {number}  size  - chiều cao khung chứa (px)
 */
export default function StreakEvolutionArt({ id, mono = false, size = 64, style, className }) {
  const src = ART[id] || ART['ngon-lua'];

  return (
    <span
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: size,
        ...style
      }}
    >
      <img
        src={src}
        alt=""
        aria-hidden="true"
        draggable={false}
        style={{
          height: '100%',
          width: 'auto',
          maxWidth: '100%',
          objectFit: 'contain',
          display: 'block',
          userSelect: 'none',
          // Chưa mở khoá -> đổ đen toàn bộ, giữ nguyên alpha => thành cái bóng
          filter: mono ? 'brightness(0)' : 'none'
        }}
      />
    </span>
  );
}
