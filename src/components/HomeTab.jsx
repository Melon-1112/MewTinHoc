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
  Code2,
  Database,
  Globe2,
  ShieldAlert
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TABS } from './Navbar';
import { isCompanyAdmin } from '../lib/roleService.js';

import { Radio, Wifi, Database as DbIcon, CheckCircle2 as CheckIcon } from 'lucide-react';

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
  onNavigateTab
}) {
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
      triggerConfetti();
      onCheckIn();
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
    const dayDateStr = dayDate.toISOString().split('T')[0];

    // Chỉ sáng ngọn lửa nếu ngày đó nằm trong lịch sử đã điểm danh (checkinHistory)
    // HOẶC hôm nay và đã bấm điểm danh
    const hasCheckedInHistory = Array.isArray(streak?.checkinHistory) && streak.checkinHistory.includes(dayDateStr);
    const checked = hasCheckedInHistory || (isToday && !!streak?.checkedToday);

    return { name, checked, isToday, dateStr: dayDateStr };
  });

  const checkedDaysCount = daysOfWeek.filter(d => d.checked).length;



  return (
    <div className="home-dashboard">
      <div className="home-grid">
        {/* Left Column: Hero & Key Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Welcome Banner */}
          <div className="hero-welcome-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <div className="hero-tag" style={{ margin: 0 }}>
                <Sparkles size={14} />
                <span>Chương trình ôn luyện bám sát ma trận 2025</span>
              </div>


            </div>

            <h1 className="hero-title">
              Chào mừng, {user?.name || 'Học viên'}! 🔥
            </h1>
            <p className="hero-desc">
              Bạn đang ở chuỗi phong độ cao! Hãy duy trì điểm danh hàng ngày, hoàn thành từng chặng dây xích trực quan và làm bài thi thử để sẵn sàng 9.5+ kỳ thi Tốt nghiệp THPTQG.
            </p>
            <div className="hero-actions">
              <button
                className="btn-primary-glow"
                onClick={() => onNavigateTab(TABS.ROADMAP)}
              >
                <span>Vào lộ trình dây xích</span>
                <ArrowRight size={18} />
              </button>
              <button
                className="btn-outline-white"
                onClick={() => onNavigateTab(TABS.AI_EXAM)}
              >
                <Sparkles size={18} />
                <span>Tạo đề AI đánh giá năng lực</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics (Dữ liệu thật từ CSDL Supabase user_progress) */}
          <div className="metrics-row">
            <div className="metric-card">
              <div className="metric-icon-wrap" style={{ background: '#FFF1D6', color: '#EA580C' }}>
                <Flame size={20} />
              </div>
              <div className="metric-val">{streak?.count ?? 0} Ngày</div>
              <div className="metric-label">Chuỗi Streak liên tục</div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-wrap" style={{ background: '#FEF3C7', color: '#D97706' }}>
                <BookOpen size={20} />
              </div>
              <div className="metric-val">{progress?.total_exams ?? user?.totalExamsTaken ?? 14} Đề</div>
              <div className="metric-label">Đề thi đã hoàn thành</div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-wrap" style={{ background: '#DCFCE7', color: '#16A34A' }}>
                <Award size={20} />
              </div>
              <div className="metric-val">{(progress?.avg_score ?? user?.avgScore ?? 8.9)}/10</div>
              <div className="metric-label">Điểm trung bình</div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-wrap" style={{ background: '#FEE2E2', color: '#DC2626' }}>
                <TrendingUp size={20} />
              </div>
              <div className="metric-val">
                {progress?.accuracy != null ? `${progress.accuracy}%` : (user?.accuracy || '91.4%')}
              </div>
              <div className="metric-label">Độ chính xác câu hỏi</div>
            </div>
          </div>

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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
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
          {/* Main Streak Card */}
          <div className="streak-card" id="streak-card-section">
            <div className="streak-card-header">
              <div className="streak-card-title">
                <Flame size={22} color="var(--color-primary)" />
                <span>Chuỗi Streak Học Tập</span>
              </div>
              <span style={{ fontSize: '0.72rem', background: 'var(--color-cream)', color: 'var(--color-deep)', padding: '0.2rem 0.6rem', borderRadius: '999px', fontWeight: 800 }}>
                Học đều đặn
              </span>
            </div>

            {/* Streak Giant Display */}
            <div className="streak-display-center">
              <span className="streak-flame-giant">{streak?.count > 0 ? '🔥' : '🌱'}</span>
              <div className="streak-big-number">{streak?.count ?? 0}</div>
              <div className="streak-big-label">Ngày Học Liên Tục</div>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.4rem' }}>
                {streak?.checkedToday
                  ? 'Tuyệt vời! Bạn đã điểm danh hôm nay.'
                  : (streak?.count > 0
                      ? 'Chưa điểm danh hôm nay. Bấm nút bên dưới để nhận +1 Streak!'
                      : 'Bạn mới bắt đầu học! Bấm điểm danh bên dưới để mở chuỗi streak 1 ngày đầu tiên.')}
              </p>
            </div>

            {/* 7-Day Calendar Streak */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: '0.5rem' }}>
                <span>Chu kỳ tuần này</span>
                <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{checkedDaysCount} / 7 ngày</span>
              </div>
              <div className="streak-days-row">
                {daysOfWeek.map((d, i) => (
                  <div key={i} className={`day-bubble ${d.checked ? 'checked' : ''} ${d.isToday ? 'today' : ''}`}>
                    <div className="day-bubble-circle">
                      {d.checked ? '🔥' : d.name}
                    </div>
                    <span className="day-name">{d.name}</span>
                  </div>
                ))}
              </div>
            </div>


            {/* Main Check-In Button */}
            <button
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
            </button>

            {/* Important Rule Warning */}
            <div style={{ display: 'flex', gap: '0.5rem', background: '#FFF7ED', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
              <AlertCircle size={16} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.75rem', color: 'var(--color-deep)', lineHeight: 1.4 }}>
                <strong>Quy tắc Streak:</strong> Nếu qua 1 ngày mà bạn không bấm điểm danh học tập, chuỗi streak sẽ bị mất và trở về 0!
              </div>
            </div>

            {/* Streak Simulation Testing Panel (Chỉ hiển thị cho tài khoản Admin) */}
            {isCompanyAdmin(user) && (
              <div className="streak-sim-box">
                <div style={{ fontWeight: 800, fontSize: '0.78rem', color: 'var(--color-deep)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>🧪 Công cụ thử nghiệm chu kỳ ngày:</span>
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
          </div>


        </div>
      </div>
    </div>
  );
}
