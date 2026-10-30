import React from 'react';
import {
  Flame,
  CheckCircle2,
  Zap,

  TrendingUp,
  Award,
  BookOpen,
  ArrowRight,
  Sparkles,
  AlertCircle,
  RotateCcw,
  FastForward,
  Undo2,
  Code2,
  Database,
  Globe2,
  ShieldAlert,
  Lock,
  Trophy,
  CalendarClock,
  CalendarDays
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TABS } from './Navbar';
import { isCompanyAdmin } from '../lib/roleService.js';

import { Radio, Wifi, Database as DbIcon, CheckCircle2 as CheckIcon } from 'lucide-react';
import { formatLocalDate } from '../lib/userProgress';
import {
  STREAK_EVOLUTIONS,
  STREAK_EVOLUTION_MAX_DAYS,
  getEvolutionByDays,
  getEvolutionProgress
} from '../lib/streakEvolutions';
import StreakEvolutionArt from './StreakEvolutionArt';
import { motion, useReducedMotion } from 'framer-motion';
import {
  bannerContainerVariants,
  bannerItemVariants,
  statsRowVariants,
  statCardVariants,
  streakCardVariants,
  iconHoverVariants,
  reducedMotionVariants
} from '../variants';
import CountUpNumber from './motion/CountUpNumber';
import MascotHeroCat from './motion/MascotHeroCat';
import HeroBannerBackground from './motion/HeroBannerBackground';
import StreakFlameStage from './motion/StreakFlameStage';

export default function HomeTab({
  user,
  streak,
  progress,
  mastery,
  onUpdateMastery,
  dbStatus,
  isRealtimeActive,
  onCheckIn,
  onSimulateNextDay,
  onSimulateMissedDays,
  onResetSimulation,
  onNavigateTab
}) {
  const [showAllEvolutions, setShowAllEvolutions] = React.useState(false);
  const [adminPreviewMode, setAdminPreviewMode] = React.useState(false);
  const [adminPreviewStreak, setAdminPreviewStreak] = React.useState(null);
  const [isFlaring, setIsFlaring] = React.useState(false);
  const prefersReducedMotion = useReducedMotion();

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#EA580C', '#FBBF24', '#7C2D12', '#FED7AA']
    });
  };

  const handleCheckInClick = () => {
    if (!streak.checkedToday) {
      setIsFlaring(true);
      triggerConfetti();
      onCheckIn();
      setTimeout(() => {
        setIsFlaring(false);
      }, 1000);
    }
  };

  // Tính toán trạng thái các thứ trong tuần hiện tại theo lịch sử điểm danh thực tế
  const now = new Date();
  if (streak?.dayOffset) {
    now.setDate(now.getDate() + streak.dayOffset);
  }
  const currentDayOfWeek = (now.getDay() + 6) % 7; // 0: Thứ 2 ... 6: Chủ Nhật

  const dayLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const daysOfWeek = dayLabels.map((name, index) => {
    const isToday = index === currentDayOfWeek;
    const dayDate = new Date(now);
    dayDate.setDate(now.getDate() - (currentDayOfWeek - index));
    const dayDateStr = formatLocalDate(dayDate);

    // Chỉ sáng ngọn lửa nếu ngày đó nằm trong lịch sử đã điểm danh (checkinHistory)
    // HOẶC hôm nay và đã bấm điểm danh
    const hasCheckedInHistory = Array.isArray(streak?.checkinHistory) && streak.checkinHistory.includes(dayDateStr);
    const checked = hasCheckedInHistory || (isToday && !!streak?.checkedToday);

    return { name, checked, isToday, dateStr: dayDateStr };
  });

  const checkedDaysCount = daysOfWeek.filter(d => d.checked).length;

  // ---- Tiến hoá hình dạng Streak (Bộ sưu tập) ----
  const streakCount = streak?.count || 0;
  const curEvo = streak?.currentEvolution || getEvolutionByDays(streakCount);
  const evoProg = streak?.evolutionProgress || getEvolutionProgress(streakCount);
  const nextEvo = evoProg.next;
  const isMaxEvo = !nextEvo && streakCount > 0;
  const curEvoIndex = STREAK_EVOLUTIONS.findIndex(e => e.id === curEvo.id);
  // Chưa điểm danh ngày nào thì coi như chưa sở hữu hình dạng nào cả (0/6).
  const hasStarted = streakCount > 0;
  const unlockedCount = hasStarted ? curEvoIndex + 1 : 0;
  const graceDays = streak?.graceDays ?? 3;

  // Admin preview: override streak display
  const displayStreak = adminPreviewStreak !== null && isCompanyAdmin(user) ? adminPreviewStreak : streakCount;
  const displayEvo = adminPreviewStreak !== null && isCompanyAdmin(user) 
    ? getEvolutionByDays(adminPreviewStreak) 
    : curEvo;
  const displayEvoProg = adminPreviewStreak !== null && isCompanyAdmin(user)
    ? getEvolutionProgress(adminPreviewStreak)
    : evoProg;
  const displayNextEvo = displayEvoProg.next;
  const displayIsMaxEvo = !displayNextEvo && displayStreak > 0;
  const displayHasStarted = displayStreak > 0 || (adminPreviewStreak !== null && isCompanyAdmin(user));
  
  // Admin preview: fill all 7 days with fire
  const displayDaysOfWeek = adminPreviewStreak !== null && isCompanyAdmin(user)
    ? dayLabels.map((name, index) => ({
        name,
        checked: true,
        isToday: index === currentDayOfWeek,
        dateStr: ''
      }))
    : daysOfWeek;
  const displayCheckedDaysCount = adminPreviewStreak !== null && isCompanyAdmin(user) ? 7 : checkedDaysCount;

  // Biến CSS để "nhuộm" màu theo cấp tiến hoá đang sở hữu
  const evoVars = {
    '--evo-accent': displayEvo.accent,
    '--evo-secondary': displayEvo.secondary,
    '--evo-glow': displayEvo.glow,
    '--evo-aura': displayEvo.aura
  };



  return (
    <div className="home-dashboard">
      <div className="home-grid">
        {/* Left Column: Hero & Key Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Welcome Banner */}
          <motion.div
            variants={prefersReducedMotion ? reducedMotionVariants : bannerContainerVariants}
            initial="hidden"
            animate="visible"
            className="hero-welcome-card"
          >
            {/* Lớp nền trôi nhẹ và đốm sáng mờ ambient */}
            <HeroBannerBackground />

            {/* Chú mèo đu trên khung banner (trạng thái thở 4s, nghiêng đầu, bong bóng thoại) */}
            <MascotHeroCat />

            <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.85rem' }}>
                <motion.div variants={bannerItemVariants} className="hero-tag" style={{ margin: 0 }}>
                  <Sparkles size={14} />
                  <span>Chương trình ôn luyện bám sát ma trận 2025</span>
                </motion.div>
              </div>

              <motion.h1 variants={bannerItemVariants} className="hero-title">
                Chào mừng, {user?.name || 'Học viên'}! 🔥
              </motion.h1>
              <motion.p variants={bannerItemVariants} className="hero-desc">
                Bạn đang ở chuỗi phong độ cao! Hãy duy trì điểm danh hàng ngày, hoàn thành từng chặng trực quan và làm bài thi thử để sẵn sàng 9.5+ kỳ thi Tốt nghiệp THPTQG.
              </motion.p>
              <motion.div variants={bannerItemVariants} className="hero-actions">
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary-glow"
                  onClick={() => onNavigateTab(TABS.ROADMAP)}
                >
                  <span>Vào lộ trình học</span>
                  <ArrowRight size={18} />
                </motion.button>
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-outline-white"
                  onClick={() => onNavigateTab(TABS.AI_EXAM)}
                >
                  <Sparkles size={18} />
                  <span>Tạo đề AI đánh giá năng lực</span>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>

          {/* Quick Metrics: Stagger trái sang phải 90ms + CountUp 900ms + Hover lift 4px */}
          <motion.div
            variants={statsRowVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="metrics-row"
          >
            <motion.div variants={statCardVariants} whileHover="hover" className="metric-card">
              <motion.div variants={iconHoverVariants} className="metric-icon-wrap" style={{ background: '#FFF1D6', color: '#EA580C' }}>
                <Flame size={20} />
              </motion.div>
              <div className="metric-val">
                <CountUpNumber end={streak?.count ?? 0} suffix=" Ngày" />
              </div>
              <div className="metric-label">Chuỗi Streak liên tục</div>
            </motion.div>

            <motion.div variants={statCardVariants} whileHover="hover" className="metric-card">
              <motion.div variants={iconHoverVariants} className="metric-icon-wrap" style={{ background: '#FEF3C7', color: '#D97706' }}>
                <BookOpen size={20} />
              </motion.div>
              <div className="metric-val">
                <CountUpNumber end={progress?.total_exams ?? user?.totalExamsTaken ?? 14} suffix=" Đề" />
              </div>
              <div className="metric-label">Đề thi đã hoàn thành</div>
            </motion.div>

            <motion.div variants={statCardVariants} whileHover="hover" className="metric-card">
              <motion.div variants={iconHoverVariants} className="metric-icon-wrap" style={{ background: '#DCFCE7', color: '#16A34A' }}>
                <Award size={20} />
              </motion.div>
              <div className="metric-val">
                <CountUpNumber end={progress?.avg_score ?? user?.avgScore ?? 8.9} decimals={1} suffix="/10" />
              </div>
              <div className="metric-label">Điểm trung bình</div>
            </motion.div>

            <motion.div variants={statCardVariants} whileHover="hover" className="metric-card">
              <motion.div variants={iconHoverVariants} className="metric-icon-wrap" style={{ background: '#FEE2E2', color: '#DC2626' }}>
                <TrendingUp size={20} />
              </motion.div>
              <div className="metric-val">
                <CountUpNumber
                  end={progress?.accuracy != null ? progress.accuracy : (user?.accuracy ? parseFloat(user.accuracy) : 91.4)}
                  decimals={1}
                  suffix="%"
                />
              </div>
              <div className="metric-label">Độ chính xác câu hỏi</div>
            </motion.div>
          </motion.div>

          {/* Ma trận kiến thức THPTQG & Độ thành thục (Dữ liệu thật từ bảng mastery_progress) */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--color-border)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div className="section-title" style={{ fontSize: '1.15rem', margin: 0 }}>
                <Zap size={20} color="var(--color-primary)" />
                <span>Mức độ làm chủ 4 khối kiến thức đề thi Bộ GD&ĐT</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }}></span>
                <span>Realtime Sync</span>
              </div>
            </div>

            <div className="knowledge-matrix-grid">
              {/* Khối Python */}
              <div style={{ padding: '1rem', background: '#FFFDF9', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
                  <Code2 size={18} color="var(--color-primary)" />
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-deep)' }}>Lập trình & Thuật toán Python</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Tiến độ</span>
                  <span style={{ color: 'var(--color-primary)' }}>{mastery?.python ?? 88}%</span>
                </div>
                <div className="progress-bar-shell" style={{ width: '100%', height: '7px' }}>
                  <div className="progress-bar-fill" style={{ width: `${mastery?.python ?? 88}%` }}></div>
                </div>
                {onUpdateMastery && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.3rem', marginTop: '0.5rem' }}>
                    <button
                      onClick={() => onUpdateMastery('python', Math.max(0, (mastery?.python ?? 88) - 5))}
                      style={{ padding: '2px 6px', fontSize: '0.7rem', border: '1px solid var(--color-border)', borderRadius: '4px', background: '#FFF', cursor: 'pointer' }}
                      title="Giảm 5% để thử nghiệm"
                    >-5%</button>
                    <button
                      onClick={() => onUpdateMastery('python', Math.min(100, (mastery?.python ?? 88) + 5))}
                      style={{ padding: '2px 6px', fontSize: '0.7rem', border: '1px solid var(--color-border)', borderRadius: '4px', background: '#FFF', cursor: 'pointer', color: 'var(--color-primary)', fontWeight: 700 }}
                      title="Tăng 5% để thử nghiệm"
                    >+5%</button>
                  </div>
                )}
              </div>

              {/* Khối CSDL & SQL */}
              <div style={{ padding: '1rem', background: '#FFFDF9', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
                  <Database size={18} color="#D97706" />
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-deep)' }}>Cơ sở dữ liệu & SQL</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Tiến độ</span>
                  <span style={{ color: '#D97706' }}>{mastery?.sql ?? 65}%</span>
                </div>
                <div className="progress-bar-shell" style={{ width: '100%', height: '7px' }}>
                  <div className="progress-bar-fill" style={{ width: `${mastery?.sql ?? 65}%`, background: '#D97706' }}></div>
                </div>
                {onUpdateMastery && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.3rem', marginTop: '0.5rem' }}>
                    <button
                      onClick={() => onUpdateMastery('sql', Math.max(0, (mastery?.sql ?? 65) - 5))}
                      style={{ padding: '2px 6px', fontSize: '0.7rem', border: '1px solid var(--color-border)', borderRadius: '4px', background: '#FFF', cursor: 'pointer' }}
                      title="Giảm 5% để thử nghiệm"
                    >-5%</button>
                    <button
                      onClick={() => onUpdateMastery('sql', Math.min(100, (mastery?.sql ?? 65) + 5))}
                      style={{ padding: '2px 6px', fontSize: '0.7rem', border: '1px solid var(--color-border)', borderRadius: '4px', background: '#FFF', cursor: 'pointer', color: '#D97706', fontWeight: 700 }}
                      title="Tăng 5% để thử nghiệm"
                    >+5%</button>
                  </div>
                )}
              </div>

              {/* Khối Mạng máy tính */}
              <div style={{ padding: '1rem', background: '#FFFDF9', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
                  <Globe2 size={18} color="var(--color-deep)" />
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-deep)' }}>Mạng Máy Tính & Internet</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Tiến độ</span>
                  <span style={{ color: 'var(--color-deep)' }}>{mastery?.network ?? 45}%</span>
                </div>
                <div className="progress-bar-shell" style={{ width: '100%', height: '7px' }}>
                  <div className="progress-bar-fill" style={{ width: `${mastery?.network ?? 45}%`, background: 'var(--color-deep)' }}></div>
                </div>
                {onUpdateMastery && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.3rem', marginTop: '0.5rem' }}>
                    <button
                      onClick={() => onUpdateMastery('network', Math.max(0, (mastery?.network ?? 45) - 5))}
                      style={{ padding: '2px 6px', fontSize: '0.7rem', border: '1px solid var(--color-border)', borderRadius: '4px', background: '#FFF', cursor: 'pointer' }}
                      title="Giảm 5% để thử nghiệm"
                    >-5%</button>
                    <button
                      onClick={() => onUpdateMastery('network', Math.min(100, (mastery?.network ?? 45) + 5))}
                      style={{ padding: '2px 6px', fontSize: '0.7rem', border: '1px solid var(--color-border)', borderRadius: '4px', background: '#FFF', cursor: 'pointer', color: 'var(--color-deep)', fontWeight: 700 }}
                      title="Tăng 5% để thử nghiệm"
                    >+5%</button>
                  </div>
                )}
              </div>

              {/* Khối An toàn số */}
              <div style={{ padding: '1rem', background: '#FFFDF9', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
                  <ShieldAlert size={18} color="#16A34A" />
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-deep)' }}>An toàn số & Đạo đức ICT</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Tiến độ</span>
                  <span style={{ color: '#16A34A' }}>{mastery?.safety ?? 80}%</span>
                </div>
                <div className="progress-bar-shell" style={{ width: '100%', height: '7px' }}>
                  <div className="progress-bar-fill" style={{ width: `${mastery?.safety ?? 80}%`, background: '#16A34A' }}></div>
                </div>
                {onUpdateMastery && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.3rem', marginTop: '0.5rem' }}>
                    <button
                      onClick={() => onUpdateMastery('safety', Math.max(0, (mastery?.safety ?? 80) - 5))}
                      style={{ padding: '2px 6px', fontSize: '0.7rem', border: '1px solid var(--color-border)', borderRadius: '4px', background: '#FFF', cursor: 'pointer' }}
                      title="Giảm 5% để thử nghiệm"
                    >-5%</button>
                    <button
                      onClick={() => onUpdateMastery('safety', Math.min(100, (mastery?.safety ?? 80) + 5))}
                      style={{ padding: '2px 6px', fontSize: '0.7rem', border: '1px solid var(--color-border)', borderRadius: '4px', background: '#FFF', cursor: 'pointer', color: '#16A34A', fontWeight: 700 }}
                      title="Tăng 5% để thử nghiệm"
                    >+5%</button>
                  </div>
                )}
              </div>
            </div>
          </div>



        </div>

        {/* Right Column: Chức năng Streak Học Tập (Feature Highlights) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Main Streak Card: Trượt vào từ phải 24px + fade */}
          <motion.div
            variants={prefersReducedMotion ? reducedMotionVariants : streakCardVariants}
            initial="hidden"
            animate="visible"
            className="streak-card"
            id="streak-card-section"
          >
            <div className="streak-card-header">
              <div className="streak-card-title">
                <Flame size={22} color="var(--color-primary)" />
                <span>Chuỗi Streak Học Tập</span>
              </div>
              <span style={{ fontSize: '0.72rem', background: 'var(--color-cream)', color: 'var(--color-deep)', padding: '0.2rem 0.6rem', borderRadius: '999px', fontWeight: 800 }}>
                Học đều đặn
              </span>
            </div>

            {/* Streak Giant Display + sân khấu ngọn lửa tiến hoá */}
            <div className="streak-display-center">
              {adminPreviewStreak !== null && isCompanyAdmin(user) && (
                <div style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  zIndex: 10
                }}>
                  <button
                    onClick={() => setAdminPreviewStreak(null)}
                    style={{
                      padding: '0.3rem 0.6rem',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      background: '#DC2626',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '999px',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                    }}
                    title="Tắt chế độ xem trước Admin"
                  >
                    ✕ TẮT PREVIEW
                  </button>
                </div>
              )}

              {/* Sân khấu ngọn lửa chuyển động cảm xúc (lung linh 2.5s, 3 tia sáng, flare-up khi điểm danh) */}
              <StreakFlameStage
                currentEvolution={displayEvo}
                hasStarted={displayHasStarted}
                isMaxEvo={displayIsMaxEvo}
                displayStreak={displayStreak}
                daysToNext={displayNextEvo ? displayEvoProg.daysToNext : null}
                progressPercent={displayEvoProg.percent}
                isFlaring={isFlaring}
                evoVars={evoVars}
              />

              <div className="streak-big-number">
                <CountUpNumber end={displayStreak} />
              </div>
              <div className="streak-big-label">Ngày Học Liên Tục</div>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.4rem' }}>
                {adminPreviewStreak !== null && isCompanyAdmin(user) ? (
                  <strong style={{ color: '#10B981' }}>🧪 Chế độ xem trước Admin đang bật</strong>
                ) : (
                  streak?.checkedToday
                    ? 'Tuyệt vời! Bạn đã điểm danh hôm nay.'
                    : (streak?.count > 0
                      ? 'Chưa điểm danh hôm nay. Bấm nút bên dưới để nhận +1 Streak!'
                      : 'Bạn mới bắt đầu học! Bấm điểm danh bên dưới để mở chuỗi streak 1 ngày đầu tiên.')
                )}
              </p>
            </div>

            {/* 7-Day Calendar Streak: Ngày hôm nay có vòng sáng nhấp nhịp nhẹ (pulse 2s) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: '0.5rem' }}>
                <span>Chu kỳ tuần này</span>
                <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{displayCheckedDaysCount} / 7 ngày</span>
              </div>
              <div className="streak-days-row">
                {displayDaysOfWeek.map((d, i) => (
                  <div key={i} className={`day-bubble ${d.checked ? 'checked' : ''} ${d.isToday ? 'today' : ''}`}>
                    <div className="day-bubble-circle">
                      {d.checked ? '🔥' : d.name}
                    </div>
                    <span className="day-name">{d.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Check-In Button: Nâng lên 2px khi hover, active scale 0.97, bùng nổ confetti & lửa */}
            <motion.button
              whileHover={!streak.checkedToday ? { y: -2 } : {}}
              whileTap={!streak.checkedToday ? { scale: 0.97 } : {}}
              className="btn-checkin-streak"
              onClick={handleCheckInClick}
              disabled={streak.checkedToday}
              id="btn-diem-danh-streak"
            >
              {streak.checkedToday ? (
                <>
                  <CheckCircle2 size={20} />
                  <span>Đã Điểm Danh Hôm Nay!</span>
                </>
              ) : (
                <>
                  <Flame size={20} />
                  <span>Điểm Danh Ngay (+1 Streak)</span>
                </>
              )}
            </motion.button>

            {/* Important Rule Warning — quy tắc ân hạn 3 ngày */}
            <div style={{ display: 'flex', gap: '0.5rem', background: '#FFF7ED', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
              <AlertCircle size={16} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.75rem', color: 'var(--color-deep)', lineHeight: 1.4 }}>
                <strong>Quy tắc Streak:</strong> bạn được phép nghỉ tối đa <strong>{graceDays - 1} ngày</strong>. Nếu bỏ trống <strong>{graceDays} ngày liên tiếp</strong> mà không bấm điểm danh, chuỗi streak sẽ bị mất và trở về 0.
              </div>
            </div>

            {/* Streak Evolution Collection - Expandable Panel */}
            <div style={{ 
              borderTop: '1px solid var(--color-border)', 
              paddingTop: '0.75rem',
              marginTop: '0.5rem'
            }}>
              <button
                onClick={() => setShowAllEvolutions(!showAllEvolutions)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.6rem 0.75rem',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: 'var(--color-deep)',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = 'var(--color-cream)'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Trophy size={16} color="var(--color-primary)" />
                  <span>Bộ sưu tập ({unlockedCount}/{STREAK_EVOLUTIONS.length})</span>
                </div>
                <span style={{ 
                  transform: showAllEvolutions ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s',
                  display: 'inline-block',
                  fontSize: '0.7rem'
                }}>
                  ▼
                </span>
              </button>

              {showAllEvolutions && (
                <div style={{ marginTop: '0.5rem' }}>
                  {/* Admin Preview Mode Toggle */}
                  {isCompanyAdmin(user) && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: '0.5rem',
                      marginBottom: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      background: '#FFF7ED',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border)'
                    }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-deep)', fontWeight: 600 }}>
                        🧪 Xem tất cả hình thái (Admin):
                      </span>
                      <button
                        onClick={() => setAdminPreviewMode(!adminPreviewMode)}
                        style={{
                          padding: '0.25rem 0.6rem',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          border: '1px solid var(--color-primary)',
                          borderRadius: '999px',
                          background: adminPreviewMode ? 'var(--color-primary)' : '#FFFFFF',
                          color: adminPreviewMode ? '#FFFFFF' : 'var(--color-primary)',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        {adminPreviewMode ? 'BẬT ✓' : 'TẮT'}
                      </button>
                    </div>
                  )}

                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    background: 'var(--color-cream)',
                    borderRadius: 'var(--radius-md)'
                  }}>
                    {STREAK_EVOLUTIONS.map((evo, index) => {
                      const isUnlocked = (hasStarted && index <= curEvoIndex) || (isCompanyAdmin(user) && adminPreviewMode);
                      const isCurrent = hasStarted && evo.id === curEvo.id;
                      const isPreviewActive = adminPreviewStreak === evo.minDays && isCompanyAdmin(user);
                      
                      return (
                        <div
                          key={evo.id}
                          onClick={() => {
                            if (isCompanyAdmin(user)) {
                              setAdminPreviewStreak(isPreviewActive ? null : evo.minDays);
                            }
                          }}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            padding: '0.75rem',
                            background: isPreviewActive ? '#DCFCE7' : (isCurrent ? evo.aura : '#FFFFFF'),
                            borderRadius: 'var(--radius-md)',
                            border: isPreviewActive ? '2px solid #10B981' : (isCurrent ? `2px solid ${evo.accent}` : '1px solid var(--color-border-subtle)'),
                            position: 'relative',
                            transition: 'all 0.2s',
                            boxShadow: isPreviewActive ? '0 2px 8px rgba(16, 185, 129, 0.4)' : (isCurrent ? `0 2px 8px ${evo.glow}` : 'none'),
                            cursor: isCompanyAdmin(user) ? 'pointer' : 'default',
                            transform: isPreviewActive ? 'scale(1.05)' : 'scale(1)'
                          }}
                          onMouseEnter={(e) => {
                            if (isCompanyAdmin(user)) {
                              e.currentTarget.style.transform = 'scale(1.05)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (isCompanyAdmin(user) && !isPreviewActive) {
                              e.currentTarget.style.transform = 'scale(1)';
                            }
                          }}
                        >
                          {isCurrent && !isPreviewActive && (
                            <div style={{
                              position: 'absolute',
                              top: '-6px',
                              right: '-6px',
                              background: evo.accent,
                              color: '#FFFFFF',
                              fontSize: '0.55rem',
                              fontWeight: 800,
                              padding: '0.15rem 0.4rem',
                              borderRadius: '999px',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                            }}>
                              ✓
                            </div>
                          )}

                          {isPreviewActive && (
                            <div style={{
                              position: 'absolute',
                              top: '-6px',
                              right: '-6px',
                              background: '#10B981',
                              color: '#FFFFFF',
                              fontSize: '0.55rem',
                              fontWeight: 800,
                              padding: '0.15rem 0.4rem',
                              borderRadius: '999px',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                            }}>
                              👁️
                            </div>
                          )}

                          {isCompanyAdmin(user) && adminPreviewMode && !isUnlocked && !isPreviewActive && (
                            <div style={{
                              position: 'absolute',
                              top: '-6px',
                              left: '-6px',
                              background: '#6366F1',
                              color: '#FFFFFF',
                              fontSize: '0.55rem',
                              fontWeight: 800,
                              padding: '0.15rem 0.4rem',
                              borderRadius: '999px',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                            }}>
                              🔓
                            </div>
                          )}

                          <StreakEvolutionArt
                            id={evo.id}
                            mono={!isUnlocked}
                            size={60}
                            style={{ 
                              marginBottom: '0.5rem',
                              opacity: isUnlocked ? 1 : 0.25
                            }}
                          />

                          <div style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            textAlign: 'center',
                            color: isUnlocked ? 'var(--color-deep)' : '#999',
                            marginBottom: '0.2rem',
                            minHeight: '2.1em',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {isUnlocked ? evo.name : '???'}
                          </div>

                          <div style={{
                            fontSize: '0.6rem',
                            color: 'var(--color-text-muted)',
                            textAlign: 'center'
                          }}>
                            {isUnlocked ? evo.dateLabel : `${evo.minDays} ngày`}
                          </div>

                          {isCompanyAdmin(user) && (
                            <div style={{
                              fontSize: '0.55rem',
                              color: '#10B981',
                              textAlign: 'center',
                              marginTop: '0.3rem',
                              fontWeight: 600
                            }}>
                              Click để xem
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Streak Simulation Testing Panel (Chỉ hiển thị cho Admin để tiết kiệm diện tích mobile cho học sinh) */}
            {isCompanyAdmin(user) && (
              <div className="streak-sim-box">
                <div style={{ fontWeight: 800, fontSize: '0.78rem', color: 'var(--color-deep)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>🧪 Công cụ thử nghiệm chu kỳ ngày (Admin):</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                  Bấm các nút dưới đây để kiểm tra việc tăng streak và mất streak khi qua ngày:
                </div>
                <div className="streak-sim-row">
                  <button
                    className="btn-sim"
                    onClick={onSimulateNextDay}
                    title="Giả lập hệ thống sang ngày hôm sau (được phép điểm danh tiếp)"
                  >
                    <FastForward size={13} style={{ verticalAlign: 'middle', marginRight: '3px' }} />
                    Tua tới ngày mai (+1 ngày)
                  </button>
                  <button
                    className="btn-sim"
                    onClick={onSimulateMissedDays}
                    style={{ color: '#DC2626' }}
                    title="Giả lập học sinh bỏ lỡ 2 ngày không học -> mất streak về 0"
                  >
                    <RotateCcw size={13} style={{ verticalAlign: 'middle', marginRight: '3px' }} />
                    Bỏ lỡ 2 ngày (Mất streak)
                  </button>
                </div>
              </div>
            )}
          </motion.div>


        </div>
      </div>
    </div>
  );
}
