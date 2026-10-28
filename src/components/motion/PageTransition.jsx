import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { pageTransitionVariants, reducedMotionVariants } from '../../variants';

/**
 * Component bao bọc mỗi trang nội dung khi chuyển Route
 * Đảm bảo: Trang cũ fade-out 150ms, trang mới fade-in + trượt lên 12px trong 300ms
 */
export default function PageTransition({ children, className = '' }) {
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion ? reducedMotionVariants : pageTransitionVariants;

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  );
}
