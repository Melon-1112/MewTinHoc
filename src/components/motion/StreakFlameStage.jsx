import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import StreakEvolutionArt from '../StreakEvolutionArt';
import { SPRINGS } from '../../variants';

/**
 * Sân khấu hiển thị Ngọn lửa Streak với:
 * - Lung linh nhẹ: scale 1 ↔ 1.04, xoay ±2°, chu kỳ 2.5s
 * - 3 tia lấp lánh nhỏ phát sáng luân phiên chậm
 * - Bùng nổ cảm xúc khi vừa bấm điểm danh: scale 1.15 → 1 nảy spring
 */
export default function StreakFlameStage({
  currentEvolution,
  hasStarted,
  isMaxEvo,
  displayStreak,
  daysToNext,
  progressPercent,
  isFlaring = false,
  evoVars
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className={`streak-evo-stage ${isMaxEvo ? 'is-max' : ''}`}
      style={evoVars}
    >
      <div
        className="streak-flame-wrapper"
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* 3 tia sáng lấp lánh nhỏ quanh ngọn lửa luân phiên chậm */}
        {!prefersReducedMotion && (
          <>
            {/* Tia 1: Phía trên bên phải */}
            <motion.div
              style={{
                position: 'absolute',
                top: '-6px',
                right: '-12px',
                color: 'var(--evo-accent, #EA580C)',
                pointerEvents: 'none',
                zIndex: 3
              }}
              animate={{
                scale: [0.6, 1.1, 0.6],
                opacity: [0.35, 1, 0.35],
                rotate: [0, 15, 0]
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0
              }}
            >
              <Sparkles size={16} />
            </motion.div>

            {/* Tia 2: Phía dưới bên trái */}
            <motion.div
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '-16px',
                color: 'var(--evo-secondary, #F59E0B)',
                pointerEvents: 'none',
                zIndex: 3
              }}
              animate={{
                scale: [0.5, 1, 0.5],
                opacity: [0.25, 0.9, 0.25],
                rotate: [0, -12, 0]
              }}
              transition={{
                duration: 2.7,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.9
              }}
            >
              <Sparkles size={14} />
            </motion.div>

            {/* Tia 3: Phía trên bên trái */}
            <motion.div
              style={{
                position: 'absolute',
                top: '16px',
                left: '-10px',
                color: '#FED7AA',
                pointerEvents: 'none',
                zIndex: 3
              }}
              animate={{
                scale: [0.45, 0.95, 0.45],
                opacity: [0.2, 0.85, 0.2]
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1.7
              }}
            >
              <Sparkles size={12} />
            </motion.div>
          </>
        )}

        {/* Ngọn lửa / Linh thú chính */}
        <motion.div
          className="streak-evo-glyph"
          title={hasStarted ? currentEvolution.name : 'Chưa mở khoá'}
          style={{ willChange: 'transform' }}
          animate={
            prefersReducedMotion
              ? {}
              : isFlaring
              ? {
                  scale: [1, 1.18, 1],
                  rotate: [0, -3, 3, 0],
                  filter: [
                    'drop-shadow(0 4px 12px rgba(234, 88, 12, 0.3))',
                    'drop-shadow(0 8px 24px rgba(234, 88, 12, 0.65))',
                    'drop-shadow(0 4px 12px rgba(234, 88, 12, 0.3))'
                  ]
                }
              : {
                  scale: [1, 1.04, 1],
                  rotate: [-2, 2, -2]
                }
          }
          transition={
            isFlaring
              ? SPRINGS.rewardPop
              : {
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }
          }
        >
          <StreakEvolutionArt
            id={currentEvolution.id}
            mono={!hasStarted}
            size={118}
          />
        </motion.div>
      </div>

      <span className="streak-evo-name">
        {displayStreak > 0 ? currentEvolution.name : 'Chưa Bắt Đầu'}
      </span>

      {daysToNext ? (
        <span className="streak-evo-next">
          Học thêm <strong>{daysToNext} ngày</strong> nữa để mở khoá một hình dạng mới 🔒
        </span>
      ) : displayStreak > 0 ? (
        <span className="streak-evo-next">
          🎉 Cấp tối đa! Đã học <strong>{displayStreak} ngày</strong> liên tục
        </span>
      ) : (
        <span className="streak-evo-next">
          Bắt đầu chuỗi học tập để thức tỉnh ngọn lửa đầu tiên!
        </span>
      )}

      {/* Thanh tiến độ chạy từ 0 → giá trị hiện tại trong 900ms ease-out */}
      <div className="streak-evo-progress">
        <motion.div
          className="streak-evo-progress-fill"
          initial={{ width: '0%' }}
          animate={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          transition={{
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1]
          }}
        />
      </div>
    </div>
  );
}
