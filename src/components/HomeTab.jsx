import React from 'react';
import {
  Flame,
  CheckCircle2,
  Calendar,
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
import { DAILY_QUESTS } from '../mockData';
import { TABS } from './Navbar';

export default function HomeTab({
  user,
  streak,
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

  const daysOfWeek = [
    { name: 'T2', checked: true },
    { name: 'T3', checked: true },
    { name: 'T4', checked: true },
    { name: 'T5', checked: true },
    { name: 'T6', checked: true },
    { name: 'T7', checked: true },
    { name: 'CN', checked: streak.checkedToday, isToday: true }
  ];

  return (
    <div className="home-dashboard">
      <div className="home-grid">
        {/* Left Column: Hero & Key Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Welcome Banner */}
          <div className="hero-welcome-card">
            <div className="hero-tag">
              <Sparkles size={14} />
              <span>Chương trình ôn luyện bám sát ma trận 2025</span>
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

          {/* Quick Metrics */}
          <div className="metrics-row">
            <div className="metric-card">
              <div className="metric-icon-wrap" style={{ background: '#FFF1D6', color: '#EA580C' }}>
                <Flame size={20} />
              </div>
              <div className="metric-val">{streak.count} Ngày</div>
              <div className="metric-label">Chuỗi Streak liên tục</div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-wrap" style={{ background: '#FEF3C7', color: '#D97706' }}>
                <BookOpen size={20} />
              </div>
              <div className="metric-val">{user?.totalExamsTaken || 14} Đề</div>
              <div className="metric-label">Đề thi đã hoàn thành</div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-wrap" style={{ background: '#DCFCE7', color: '#16A34A' }}>
                <Award size={20} />
              </div>
              <div className="metric-val">{user?.avgScore || 8.9}/10</div>
              <div className="metric-label">Điểm trung bình</div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-wrap" style={{ background: '#FEE2E2', color: '#DC2626' }}>
                <TrendingUp size={20} />
              </div>
              <div className="metric-val">{user?.accuracy || '91.4%'}</div>
              <div className="metric-label">Độ chính xác câu hỏi</div>
            </div>
          </div>

          {/* Ma trận kiến thức THPTQG & Độ thành thục */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--color-border)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div className="section-title" style={{ fontSize: '1.15rem', margin: 0 }}>
                <Zap size={20} color="var(--color-primary)" />
                <span>Mức độ làm chủ 4 khối kiến thức đề thi Bộ GD&ĐT</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Cập nhật hôm nay</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: '#FFFDF9', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
                  <Code2 size={18} color="var(--color-primary)" />
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-deep)' }}>Lập trình & Thuật toán Python</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Tiến độ</span>
                  <span style={{ color: 'var(--color-primary)' }}>88%</span>
                </div>
                <div className="progress-bar-shell" style={{ width: '100%', height: '7px' }}>
                  <div className="progress-bar-fill" style={{ width: '88%' }}></div>
                </div>
              </div>

              <div style={{ padding: '1rem', background: '#FFFDF9', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
                  <Database size={18} color="#D97706" />
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-deep)' }}>Cơ sở dữ liệu & SQL</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Tiến độ</span>
                  <span style={{ color: '#D97706' }}>65%</span>
                </div>
                <div className="progress-bar-shell" style={{ width: '100%', height: '7px' }}>
                  <div className="progress-bar-fill" style={{ width: '65%', background: '#D97706' }}></div>
                </div>
              </div>

              <div style={{ padding: '1rem', background: '#FFFDF9', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
                  <Globe2 size={18} color="var(--color-deep)" />
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-deep)' }}>Mạng Máy Tính & Internet</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Tiến độ</span>
                  <span style={{ color: 'var(--color-deep)' }}>45%</span>
                </div>
                <div className="progress-bar-shell" style={{ width: '100%', height: '7px' }}>
                  <div className="progress-bar-fill" style={{ width: '45%', background: 'var(--color-deep)' }}></div>
                </div>
              </div>

              <div style={{ padding: '1rem', background: '#FFFDF9', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
                  <ShieldAlert size={18} color="#16A34A" />
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-deep)' }}>An toàn số & Đạo đức ICT</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Tiến độ</span>
                  <span style={{ color: '#16A34A' }}>80%</span>
                </div>
                <div className="progress-bar-shell" style={{ width: '100%', height: '7px' }}>
                  <div className="progress-bar-fill" style={{ width: '80%', background: '#16A34A' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Quests */}
          <div>
            <div className="section-title-wrap" style={{ marginTop: 0 }}>
              <div className="section-title">
                <Calendar size={20} color="var(--color-primary)" />
                <span>Nhiệm vụ rèn luyện trong ngày</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Hoàn thành nhận XP thưởng</span>
            </div>

            <div className="daily-quests-list">
              {DAILY_QUESTS.map((quest) => {
                const isCheckinQuest = quest.id === 'q1';
                const isDone = isCheckinQuest ? streak.checkedToday : quest.completed;
                return (
                  <div
                    key={quest.id}
                    className={`quest-item ${isDone ? 'completed' : ''}`}
                  >
                    <div className="quest-left">
                      <div className="quest-check-icon">
                        <CheckCircle2 size={16} />
                      </div>
                      <div>
                        <div className="quest-title">{quest.title}</div>
                        <div className="quest-sub">
                          {isDone ? 'Đã hoàn tất ngày hôm nay' : 'Đang chờ thực hiện'}
                        </div>
                      </div>
                    </div>
                    <div className="quest-reward">
                      <Sparkles size={14} />
                      <span>{quest.reward}</span>
                    </div>
                  </div>
                );
              })}
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
              <span className="streak-flame-giant">🔥</span>
              <div className="streak-big-number">{streak.count}</div>
              <div className="streak-big-label">Ngày Học Liên Tục</div>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.4rem' }}>
                {streak.checkedToday
                  ? 'Tuyệt vời! Bạn đã điểm danh hôm nay.'
                  : 'Chưa điểm danh hôm nay. Bấm nút bên dưới để nhận +1 Streak!'}
              </p>
            </div>

            {/* 7-Day Calendar Streak */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: '0.5rem' }}>
                <span>Chu kỳ tuần này</span>
                <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{streak.count} / 7 ngày</span>
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

            {/* Streak Simulation Testing Panel (Giúp người dùng kiểm chứng yêu cầu "qua 1 ngày thì mất streak") */}
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
          </div>

          {/* Target Countdown Card */}
          <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Award size={18} color="var(--color-amber-dark)" />
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-deep)' }}>Mục tiêu THPTQG 2025</span>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
              Điểm số mục tiêu cá nhân: <strong style={{ color: 'var(--color-primary)', fontSize: '0.95rem' }}>9.8 Điểm</strong>
            </div>
            <div style={{ fontSize: '0.75rem', background: 'var(--color-cream)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', color: 'var(--color-deep)' }}>
              💡 Lời khuyên: Tập trung vào 4 câu trắc nghiệm Đúng/Sai ở chuyên đề CSDL SQL để không bị mất điểm phân hóa!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
