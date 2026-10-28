import React, { useEffect, useState, useRef } from 'react';

/**
 * Hàm Easing cubic-bezier(0.22, 1, 0.36, 1) chuẩn hóa
 * Giúp số tăng nhanh trong 300ms đầu rồi chầm chậm dừng lại ở giá trị đích.
 */
function easeOutQuint(t) {
  return 1 - Math.pow(1 - t, 5);
}

/**
 * Component CountUpNumber
 * @param {number|string} end - Giá trị đích cần đếm tới
 * @param {number} duration - Thời gian chạy (mặc định 900ms theo thiết kế)
 * @param {string} prefix - Tiền tố (ví dụ: "")
 * @param {string} suffix - Hậu tố (ví dụ: "%", " Ngày", " Đề", "/10")
 * @param {number} decimals - Số chữ số thập phân (tự động nhận diện nếu end là số thực)
 */
export default function CountUpNumber({
  end = 0,
  duration = 900,
  prefix = '',
  suffix = '',
  decimals = null,
  className = ''
}) {
  // Tách giá trị số từ chuỗi nếu người dùng truyền chuỗi (ví dụ: "91.4%" hay 8.9)
  let numericTarget = 0;
  if (typeof end === 'number') {
    numericTarget = end;
  } else if (typeof end === 'string') {
    const matched = end.match(/[-+]?[0-9]*\.?[0-9]+/);
    numericTarget = matched ? parseFloat(matched[0]) : 0;
  }

  // Tự động phát hiện số thập phân nếu không chỉ định rõ
  const decimalPlaces = decimals !== null
    ? decimals
    : (numericTarget.toString().split('.')[1] || '').length;

  const [currentVal, setCurrentVal] = useState(0);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    // 1. Tôn trọng prefers-reduced-motion: Bỏ qua đếm số nếu người dùng giảm chuyển động
    const prefersReducedMotion = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || duration <= 0) {
      setCurrentVal(numericTarget);
      return;
    }

    // 2. Chạy đếm số tăng dần với requestAnimationFrame mượt 60fps
    const startVal = 0;
    const diff = numericTarget - startVal;

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuint(progress);

      const nextVal = startVal + diff * easedProgress;
      setCurrentVal(nextVal);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setCurrentVal(numericTarget);
      }
    };

    startTimeRef.current = null;
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [numericTarget, duration]);

  // Format số theo định dạng đẹp
  const formattedNumber = decimalPlaces > 0
    ? currentVal.toFixed(decimalPlaces)
    : Math.round(currentVal).toString();

  return (
    <span className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {prefix}{formattedNumber}{suffix}
    </span>
  );
}
