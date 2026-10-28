import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

/**
 * ============================================================
 * CẤU HÌNH HIỆU ỨNG DẤU CHÂN MÈO (PAW TAP CONFIG)
 * ============================================================
 * Mọi thông số chuyển động, kích thước, màu sắc được quy tụ tại đây
 * để dễ dàng tinh chỉnh và mở rộng.
 */
export const PAW_CONFIG = {
  // Số lượng dấu chân hiển thị tối đa cùng lúc
  maxPaws: 6,
  // Thời gian chặn (throttle) giữa 2 lần tap liên tiếp (ms)
  throttleMs: 80,
  // Tổng thời lượng chuyển động (giây) ~900ms
  duration: 0.9,
  // Kích thước dấu chân trên Desktop & Mobile (px)
  sizeDesktop: 32,
  sizeMobile: 26,
  // Bảng màu cam nhạt tinh tế
  colorDefault: '#FDBA74',     // Cam nhạt ấm áp tiêu chuẩn
  colorHighlight: '#FB923C',   // Cam sáng rõ hơn khi bấm nút quan trọng
  colorFastTap: '#EA580C',     // Cam đậm khi bấm 3 lần liên tiếp nhanh
  // Độ mờ tối đa
  maxOpacity: 0.55,
  maxOpacityHighlight: 0.82,
  // Góc xoay ngẫu nhiên (-25° đến +25°)
  rotationRange: 25,
  // Khoảng cách trôi lên nhẹ khi mờ dần (px)
  driftY: -6,
  // LocalStorage key để lưu tuỳ chọn bật/tắt
  storageKey: 'paw-tap'
};

/**
 * SVG Dấu Chân Mèo Tinh Tế (1 đệm chính + 4 ngón bo tròn vòng cung)
 */
export function CatPawSvg({
  size = 32,
  fill = PAW_CONFIG.colorDefault,
  style = {}
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', ...style }}
    >
      <g fill={fill}>
        {/* Đệm chân chính: Hình tim/oval bo tròn mềm mại */}
        <path d="M 16 16.5 C 13 14, 7.5 15.5, 7.5 20.5 C 7.5 24.2, 11 26.5, 16 26.5 C 21 26.5, 24.5 24.2, 24.5 20.5 C 24.5 15.5, 19 14, 16 16.5 Z" />

        {/* 4 ngón nhỏ xếp hình vòng cung phía trên */}
        {/* Ngón ngoài cùng bên trái */}
        <ellipse cx="6.8" cy="11.5" rx="2.5" ry="3.3" transform="rotate(-24 6.8 11.5)" />
        {/* Ngón giữa bên trái */}
        <ellipse cx="12.5" cy="7.2" rx="2.6" ry="3.6" transform="rotate(-8 12.5 7.2)" />
        {/* Ngón giữa bên phải */}
        <ellipse cx="19.5" cy="7.2" rx="2.6" ry="3.6" transform="rotate(8 19.5 7.2)" />
        {/* Ngón ngoài cùng bên phải */}
        <ellipse cx="25.2" cy="11.5" rx="2.5" ry="3.3" transform="rotate(24 25.2 11.5)" />
      </g>
    </svg>
  );
}

/**
 * Hook usePawTap
 * Quản lý trạng thái, lắng nghe pointerdown, throttle, lọc vùng loại trừ,
 * phát hiện chuỗi gõ nhanh và trả về danh sách dấu chân cần render.
 */
export function usePawTap(customConfig = {}) {
  const config = { ...PAW_CONFIG, ...customConfig };
  const prefersReducedMotion = useReducedMotion();

  // Đọc tuỳ chọn bật/tắt từ localStorage (mặc định bật)
  const [isEnabled, setIsEnabled] = useState(() => {
    if (typeof window === 'undefined') return true;
    const saved = localStorage.getItem(config.storageKey);
    return saved !== 'false';
  });

  const [paws, setPaws] = useState([]);
  const lastTapTimeRef = useRef(0);
  const isLeftPawRef = useRef(false);
  const tapHistoryRef = useRef([]);
  const fastTapTimerRef = useRef(null);
  const [isFastTapMode, setIsFastTapMode] = useState(false);

  // Lưu trạng thái vào localStorage khi thay đổi
  const toggleEnabled = useCallback((forceVal) => {
    setIsEnabled((prev) => {
      const next = typeof forceVal === 'boolean' ? forceVal : !prev;
      localStorage.setItem(config.storageKey, String(next));
      // Bắn CustomEvent để đồng bộ giữa các component nếu cần
      window.dispatchEvent(new CustomEvent('paw-tap-change', { detail: next }));
      return next;
    });
  }, [config.storageKey]);

  // Lắng nghe sự kiện đổi từ các tab/cửa sổ khác
  useEffect(() => {
    const handleCustomChange = (e) => {
      if (typeof e.detail === 'boolean') {
        setIsEnabled(e.detail);
      }
    };
    window.addEventListener('paw-tap-change', handleCustomChange);
    // Hỗ trợ console debug thuận tiện: window.togglePawTap()
    window.togglePawTap = toggleEnabled;

    return () => {
      window.removeEventListener('paw-tap-change', handleCustomChange);
      delete window.togglePawTap;
    };
  }, [toggleEnabled]);

  // Xoá dấu chân đã hoàn tất animation
  const removePaw = useCallback((id) => {
    setPaws((prev) => prev.filter((p) => p.id !== id));
  }, []);

  useEffect(() => {
    // Tôn trọng prefers-reduced-motion hoặc khi người dùng tắt tính năng
    if (prefersReducedMotion || !isEnabled) {
      if (paws.length > 0) setPaws([]);
      return;
    }

    const handlePointerDown = (e) => {
      // 1. Kiểm tra vùng loại trừ (Input, Textarea, Vùng làm bài thi, Trình soạn thảo lý thuyết)
      const target = e.target;
      if (
        !target ||
        target.closest(
          'input, textarea, select, [contenteditable="true"], .exam-taker-window, .exam-timer-bar, .theory-editor, .monaco-editor, [data-no-paw="true"]'
        )
      ) {
        return;
      }

      const now = performance.now();

      // 2. Throttle 80ms tránh spam click làm rối màn hình
      if (now - lastTapTimeRef.current < config.throttleMs) {
        return;
      }
      lastTapTimeRef.current = now;

      // 3. Nhận diện chuỗi 3 lần click nhanh trong 1 giây
      tapHistoryRef.current = [...tapHistoryRef.current.filter((t) => now - t < 1000), now];
      const isFastTriple = tapHistoryRef.current.length >= 3;
      if (isFastTriple) {
        setIsFastTapMode(true);
        if (fastTapTimerRef.current) clearTimeout(fastTapTimerRef.current);
        fastTapTimerRef.current = setTimeout(() => {
          setIsFastTapMode(false);
          tapHistoryRef.current = [];
        }, 1000);
      }

      // 4. Nhận diện nút quan trọng (Nút chính, Nút điểm danh, v.v.)
      const isHighlight = Boolean(
        target.closest(
          '.btn-primary-glow, .btn-checkin-streak, [data-paw-highlight="true"], #btn-diem-danh-streak'
        )
      );

      // 5. Tính toán thông số cho dấu chân mới
      // Luân phiên chân trái / chân phải (lật trục X) như đang bước đi
      isLeftPawRef.current = !isLeftPawRef.current;
      const isLeft = isLeftPawRef.current;

      // Góc xoay ngẫu nhiên từ -25° đến +25°
      const rotation = (Math.random() * 2 - 1) * config.rotationRange;

      // Kích thước (nhỏ hơn trên mobile)
      const isMobile = window.innerWidth <= 768;
      const size = isMobile ? config.sizeMobile : config.sizeDesktop;

      // Màu sắc và độ trong suốt
      let fill = config.colorDefault;
      let maxOpacity = config.maxOpacity;

      if (isFastTriple || isFastTapMode) {
        fill = config.colorFastTap;
        maxOpacity = config.maxOpacityHighlight;
      } else if (isHighlight) {
        fill = config.colorHighlight;
        maxOpacity = config.maxOpacityHighlight;
      }

      // Tạo các chấm tia sáng nhỏ tỏa ra khi bấm nút quan trọng (Điểm nhấn tinh tế)
      const burstDots = isHighlight
        ? [
            { id: 1, angle: -45, dist: 16 },
            { id: 2, angle: 45, dist: 18 },
            { id: 3, angle: 180, dist: 14 }
          ]
        : [];

      const newPaw = {
        id: `${now}-${Math.random()}`,
        x: e.clientX,
        y: e.clientY,
        size,
        fill,
        maxOpacity,
        rotation,
        isLeft,
        isHighlight,
        burstDots
      };

      // Giới hạn tối đa 6 dấu chân cùng lúc (vượt quá thì bỏ cái cũ nhất)
      setPaws((prev) => {
        const next = [...prev, newPaw];
        if (next.length > config.maxPaws) {
          return next.slice(next.length - config.maxPaws);
        }
        return next;
      });
    };

    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      if (fastTapTimerRef.current) clearTimeout(fastTapTimerRef.current);
    };
  }, [isEnabled, prefersReducedMotion, config, isFastTapMode]);

  return {
    paws,
    removePaw,
    isEnabled,
    toggleEnabled,
    config
  };
}

/**
 * Component Hiển thị Dấu Chân Mèo (Mount một lần ở App root)
 */
export default function PawTapEffect({ customConfig = {} }) {
  const { paws, removePaw, isEnabled, config } = usePawTap(customConfig);
  const prefersReducedMotion = useReducedMotion();

  // Không hiển thị nếu người dùng tắt hoặc prefers-reduced-motion
  if (prefersReducedMotion || !isEnabled) {
    return null;
  }

  return (
    <div
      className="paw-tap-container"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 99999,
        overflow: 'hidden'
      }}
    >
      <AnimatePresence>
        {paws.map((paw) => {
          const halfSize = paw.size / 2;

          return (
            <React.Fragment key={paw.id}>
              {/* Dấu chân mèo chính */}
              <motion.div
                initial={{
                  scale: 0.6,
                  opacity: 0,
                  x: paw.x - halfSize,
                  y: paw.y - halfSize,
                  rotate: paw.rotation
                }}
                animate={{
                  // Chuyển động 3 pha:
                  // 0 -> 120ms: Nảy lên scale 1.1, opacity tăng
                  // 120 -> 250ms: Ấn xuống scale 1.0
                  // 250 -> 900ms: Trôi nhẹ lên 6px, fade về 0, scale 0.95
                  scale: [0.6, 1.1, 1.0, 0.95],
                  opacity: [0, paw.maxOpacity, paw.maxOpacity, 0],
                  y: [paw.y - halfSize, paw.y - halfSize, paw.y - halfSize, paw.y - halfSize + config.driftY]
                }}
                transition={{
                  duration: config.duration,
                  times: [0, 0.13, 0.28, 1],
                  ease: [0.22, 1, 0.36, 1]
                }}
                onAnimationComplete={() => removePaw(paw.id)}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: paw.size,
                  height: paw.size,
                  transformOrigin: 'center center',
                  pointerEvents: 'none',
                  willChange: 'transform, opacity'
                }}
              >
                <CatPawSvg
                  size={paw.size}
                  fill={paw.fill}
                  style={{
                    transform: paw.isLeft ? 'scaleX(-1)' : 'none',
                    transformOrigin: 'center center'
                  }}
                />
              </motion.div>

              {/* Các hạt tia sáng nhỏ bung ra khi bấm nút quan trọng */}
              {paw.burstDots.map((dot) => {
                const rad = (dot.angle * Math.PI) / 180;
                const destX = paw.x + Math.cos(rad) * dot.dist;
                const destY = paw.y + Math.sin(rad) * dot.dist;

                return (
                  <motion.div
                    key={`dot-${paw.id}-${dot.id}`}
                    initial={{
                      x: paw.x - 2.5,
                      y: paw.y - 2.5,
                      scale: 0.4,
                      opacity: 0.7
                    }}
                    animate={{
                      x: destX - 2.5,
                      y: destY - 2.5,
                      scale: [0.4, 1, 0],
                      opacity: [0.7, 0.8, 0]
                    }}
                    transition={{
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: 5,
                      height: 5,
                      borderRadius: '50%',
                      background: paw.fill,
                      pointerEvents: 'none'
                    }}
                  />
                );
              })}
            </React.Fragment>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
