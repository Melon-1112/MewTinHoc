import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import catHanging from '../../assets/cat-hanging-full.png';
import { SPRINGS } from '../../variants';

const CAT_CHEERS = [
  'Cố lên bạn ơi! 🐾',
  'Học cùng Mew nha! ✨',
  'Mục tiêu 9.5+ Tin Học! 🎯',
  'Chăm chỉ là có 10 điểm! 🐱',
  'Hôm nay bạn siêu lắm! 🔥'
];

export default function MascotHeroCat() {
  const prefersReducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const [speechIndex, setSpeechIndex] = useState(0);
  const [isTilting, setIsTilting] = useState(false);
  const tiltTimerRef = useRef(null);
  const autoHideTimeoutRef = useRef(null);

  // Hiệu ứng nghiêng đầu 5° ngẫu nhiên mỗi 8-12 giây
  useEffect(() => {
    if (prefersReducedMotion) return;

    let isSubscribed = true;

    const scheduleNextTilt = () => {
      const delay = Math.floor(Math.random() * 4000) + 8000;
      tiltTimerRef.current = setTimeout(() => {
        if (!isSubscribed || document.hidden) {
          scheduleNextTilt();
          return;
        }
        setIsTilting(true);
        setTimeout(() => {
          if (isSubscribed) setIsTilting(false);
          scheduleNextTilt();
        }, 650);
      }, delay);
    };

    scheduleNextTilt();

    const handleVisibility = () => {
      if (document.hidden) {
        if (tiltTimerRef.current) clearTimeout(tiltTimerRef.current);
      } else {
        scheduleNextTilt();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      isSubscribed = false;
      if (tiltTimerRef.current) clearTimeout(tiltTimerRef.current);
      if (autoHideTimeoutRef.current) clearTimeout(autoHideTimeoutRef.current);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [prefersReducedMotion]);

  // Xử lý khi hover trên máy tính
  const handleMouseEnter = () => {
    if (autoHideTimeoutRef.current) clearTimeout(autoHideTimeoutRef.current);
    setIsHovered(true);
    setSpeechIndex((prev) => (prev + 1) % CAT_CHEERS.length);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (autoHideTimeoutRef.current) clearTimeout(autoHideTimeoutRef.current);
  };

  // Xử lý khi chạm (touch / click) trên thiết bị di động
  const handleClickOrTouch = (e) => {
    e.stopPropagation();
    setIsHovered(true);
    setSpeechIndex((prev) => (prev + 1) % CAT_CHEERS.length);

    if (autoHideTimeoutRef.current) clearTimeout(autoHideTimeoutRef.current);
    // Tự động đóng bong bóng sau 3.5 giây nếu người dùng không chạm tiếp
    autoHideTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 3500);
  };

  return (
    <div
      className="hero-welcome-cat-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClickOrTouch}
      style={{
        position: 'absolute',
        top: '-18px',
        left: '-24px',
        zIndex: 40,
        cursor: 'pointer',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent'
      }}
      title="Bấm vào Mew để nghe lời khích lệ! 🐱"
    >
      {/* Bong bóng lời thoại khi hover hoặc chạm (đặt bên phải mèo để không bị navbar che khuất) */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: -8, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -4, scale: 0.92, transition: { duration: 0.15 } }}
            transition={SPRINGS.gentle}
            style={{
              position: 'absolute',
              top: '6px',
              left: '58px',
              background: '#FFFFFF',
              color: '#C2410C',
              padding: '0.45rem 0.85rem',
              borderRadius: '16px',
              fontSize: '0.82rem',
              fontWeight: 800,
              whiteSpace: 'nowrap',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2), 0 2px 6px rgba(234, 88, 12, 0.25)',
              border: '1.5px solid #FED7AA',
              pointerEvents: 'none',
              zIndex: 60,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              lineHeight: 1.2
            }}
          >
            <span>{CAT_CHEERS[speechIndex]}</span>

            {/* Đuôi bong bóng thoại hướng sang trái chỉ vào má chú mèo */}
            <div
              style={{
                position: 'absolute',
                left: '-7px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: 0,
                height: 0,
                borderTop: '6px solid transparent',
                borderBottom: '6px solid transparent',
                borderRight: '7px solid #FFFFFF'
              }}
            />
            {/* Viền cho đuôi bong bóng thoại */}
            <div
              style={{
                position: 'absolute',
                left: '-9px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: 0,
                height: 0,
                borderTop: '7px solid transparent',
                borderBottom: '7px solid transparent',
                borderRight: '8px solid #FED7AA',
                zIndex: -1
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chú mèo đu trên khung banner */}
      <motion.img
        src={catHanging}
        alt="Mascot Mew"
        className="hero-welcome-cat-img"
        style={{
          width: '56px',
          height: 'auto',
          display: 'block',
          userSelect: 'none',
          filter: 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.25))',
          transformOrigin: 'top center'
        }}
        // Trạng thái nghỉ: thở nhẹ scale 1 <-> 1.03 chu kỳ 4s
        animate={
          prefersReducedMotion
            ? {}
            : isHovered
            ? { y: -6, scale: 1.08, rotate: -2 }
            : isTilting
            ? { rotate: 5, scale: 1.02 }
            : {
                scale: [1, 1.03, 1],
                rotate: 0,
                y: 0,
                transition: {
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }
              }
        }
        transition={isHovered ? SPRINGS.gentle : { duration: 0.35 }}
      />
    </div>
  );
}
