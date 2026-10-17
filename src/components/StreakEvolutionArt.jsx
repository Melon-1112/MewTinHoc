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

import ngonLua from '../assets/streak/ngon-lua.png';
import tinhLinhDo from '../assets/streak/tinh-linh-do.png';
import luaTim from '../assets/streak/lua-tim.png';
import tinhLinhTim from '../assets/streak/tinh-linh-tim.png';
import rongLua from '../assets/streak/rong-lua.png';
import daiCoThu from '../assets/streak/dai-co-thu.png';

const ART = {
  'ngon-lua': ngonLua,
  'tinh-linh-do': tinhLinhDo,
  'lua-tim': luaTim,
  'tinh-linh-tim': tinhLinhTim,
  'rong-lua': rongLua,
  'dai-co-thu': daiCoThu
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
