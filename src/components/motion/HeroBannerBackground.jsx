import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function HeroBannerBackground() {
  const prefersReducedMotion = useReducedMotion();
  const [isTabVisible, setIsTabVisible] = useState(true);

  // Tạm dừng chuyển động nền khi người dùng ẩn tab trình duyệt (tiết kiệm CPU/pin)
  useEffect(() => {
    const handleVisibility = () => {
      setIsTabVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  return (
    <div
      className={`hero-animated-bg ${!isTabVisible ? 'is-paused' : ''}`}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        borderRadius: 'inherit',
        pointerEvents: 'none',
        zIndex: 0
      }}
      aria-hidden="true"
    >
      {/* Lớp gradient dịch chuyển chậm chu kỳ 12s */}
      <div className="hero-gradient-layer" />

      {/* 4 đốm sáng mờ (blur lớn 40-50px, opacity 0.15) trôi lơ lửng rất chậm */}
      {!prefersReducedMotion && (
        <>
          {/* Đốm 1: Góc trên phải (ánh vàng kim) */}
          <motion.div
            className="hero-ambient-orb orb-1"
            animate={
              isTabVisible
                ? {
                    x: [0, 18, -10, 0],
                    y: [0, -14, 12, 0],
                    opacity: [0.14, 0.20, 0.15, 0.14]
                  }
                : {}
            }
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            style={{
              position: 'absolute',
              top: '-40px',
              right: '40px',
              width: '260px',
              height: '260px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #FDE68A 0%, rgba(251, 191, 36, 0.6) 50%, transparent 70%)',
              filter: 'blur(50px)',
              willChange: 'transform, opacity'
            }}
          />

          {/* Đốm 2: Phía dưới bên trái (ánh cam đào ấm) */}
          <motion.div
            className="hero-ambient-orb orb-2"
            animate={
              isTabVisible
                ? {
                    x: [0, -16, 12, 0],
                    y: [0, 12, -8, 0],
                    opacity: [0.12, 0.18, 0.13, 0.12]
                  }
                : {}
            }
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1.5
            }}
            style={{
              position: 'absolute',
              bottom: '-30px',
              left: '12%',
              width: '220px',
              height: '220px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #FED7AA 0%, rgba(249, 115, 22, 0.5) 55%, transparent 75%)',
              filter: 'blur(45px)',
              willChange: 'transform, opacity'
            }}
          />

          {/* Đốm 3: Ở giữa chếch trên (ánh hổ phách nhẹ) */}
          <motion.div
            className="hero-ambient-orb orb-3"
            animate={
              isTabVisible
                ? {
                    x: [0, 14, -8, 0],
                    y: [0, -10, 14, 0],
                    opacity: [0.13, 0.17, 0.12, 0.13]
                  }
                : {}
            }
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 3
            }}
            style={{
              position: 'absolute',
              top: '20px',
              left: '45%',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #FEF08A 0%, rgba(245, 158, 11, 0.45) 50%, transparent 70%)',
              filter: 'blur(42px)',
              willChange: 'transform, opacity'
            }}
          />

          {/* Đốm 4: Phía dưới góc phải (ánh trắng kem mờ) */}
          <motion.div
            className="hero-ambient-orb orb-4"
            animate={
              isTabVisible
                ? {
                    x: [0, -10, 14, 0],
                    y: [0, 8, -12, 0],
                    opacity: [0.08, 0.15, 0.10, 0.08]
                  }
                : {}
            }
            transition={{
              duration: 11,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 2
            }}
            style={{
              position: 'absolute',
              bottom: '-20px',
              right: '-20px',
              width: '240px',
              height: '240px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #FFF7ED 0%, rgba(254, 215, 170, 0.4) 50%, transparent 70%)',
              filter: 'blur(52px)',
              willChange: 'transform, opacity'
            }}
          />
        </>
      )}
    </div>
  );
}
