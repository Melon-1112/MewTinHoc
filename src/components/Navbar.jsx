import React from 'react';
import {
  Flame,
  Home,
  GitCommit,
  BookOpen,
  Sparkles,
  Target,
  LogIn,
  LogOut,
  Layers,
  Award
} from 'lucide-react';

export const TABS = {
  HOME: 'home',
  ROADMAP: 'roadmap',
  EXAMS: 'exams',
  AI_EXAM: 'ai_exam'
};

export default function Navbar({
  activeTab,
  setActiveTab,
  user,
  streak,
  onOpenGoogleLogin,
  onLogout,
  onOpenStreakDetails
}) {
  return (
    <header className="horizontal-sidebar">
      {/* Top row: Brand & Student Info (Thông tin học viên ở trên cùng thanh sidebar) */}
      <div className="top-nav-row">
        {/* Left: Brand Logo */}
        <div className="brand-section">
          <div className="brand-logo-icon">
            <Flame size={26} strokeWidth={2.4} />
          </div>
          <div>
            <div className="brand-title">
              TinHoc<span>Pro</span>
              <span className="brand-tag">THPTQG 2025</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              Cổng Luyện Thi Tin Học Chuẩn Ma Trận Bộ GD&ĐT
            </div>
          </div>
        </div>

        {/* Right: Student Information Widget at top of sidebar */}
        <div className="student-bar-widget">
          {/* Streak pill button */}
          <div
            className="streak-pill"
            onClick={onOpenStreakDetails}
            title="Nhấp để xem chi tiết chuỗi ngày học tập"
          >
            <Flame size={20} className="streak-flame-icon" />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span className="streak-number">{streak.count} Ngày</span>
              <span className="streak-label">{streak.checkedToday ? 'Đã điểm danh' : 'Chưa điểm danh'}</span>
            </div>
          </div>

          {/* Student Profile & Google OAuth button */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                className="student-profile-chip"
                onClick={onOpenGoogleLogin}
                title="Tài khoản Google đang kết nối. Nhấp để chuyển tài khoản."
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="student-avatar"
                />
                <div className="student-info-text">
                  <div className="student-name">
                    {user.name}
                    <span style={{ fontSize: '0.65rem', background: '#DCFCE7', color: '#15803D', padding: '1px 6px', borderRadius: '999px', fontWeight: 700 }}>
                      Google OAuth
                    </span>
                  </div>
                  <div className="student-role">
                    {user.grade || 'Lớp 12'} • 🎯 Mục tiêu: {user.targetScore || 9.5}đ
                  </div>
                </div>
              </div>
              {/* Logout button */}
              <button
                onClick={onLogout}
                title="Đăng xuất"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  background: 'rgba(220,38,38,0.08)',
                  color: '#DC2626',
                  border: '1.5px solid rgba(220,38,38,0.15)',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.18s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.15)'; e.currentTarget.style.borderColor = '#DC2626'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.08)'; e.currentTarget.style.borderColor = 'rgba(220,38,38,0.15)'; }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              className="btn-google-login"
              onClick={onOpenGoogleLogin}
              id="google-login-btn"
            >
              {/* Google G icon */}
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12c0 1.97.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Đăng nhập Google</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Horizontal Dock: Functions grouped in category "LEARNING" */}
      <div className="category-dock-wrapper">
        <div className="category-dock">
          {/* Category Label: LEARNING */}
          <div className="category-badge">
            <Layers size={14} />
            <span>LEARNING</span>
          </div>

          {/* Horizontal Function Tabs */}
          <nav className="category-tabs" role="tablist">
            <button
              role="tab"
              aria-selected={activeTab === TABS.HOME}
              className={`nav-tab-btn ${activeTab === TABS.HOME ? 'active' : ''}`}
              onClick={() => setActiveTab(TABS.HOME)}
              id="tab-home"
            >
              <Home size={17} />
              <span>Trang chủ</span>
            </button>

            <button
              role="tab"
              aria-selected={activeTab === TABS.ROADMAP}
              className={`nav-tab-btn ${activeTab === TABS.ROADMAP ? 'active' : ''}`}
              onClick={() => setActiveTab(TABS.ROADMAP)}
              id="tab-roadmap"
            >
              <GitCommit size={17} />
              <span>Lộ trình học (Dạng dây xích trực quan)</span>
              <span className="tab-badge-hot">Mới</span>
            </button>

            <button
              role="tab"
              aria-selected={activeTab === TABS.EXAMS}
              className={`nav-tab-btn ${activeTab === TABS.EXAMS ? 'active' : ''}`}
              onClick={() => setActiveTab(TABS.EXAMS)}
              id="tab-exams"
            >
              <BookOpen size={17} />
              <span>Kho đề thi</span>
            </button>

            <button
              role="tab"
              aria-selected={activeTab === TABS.AI_EXAM}
              className={`nav-tab-btn ${activeTab === TABS.AI_EXAM ? 'active' : ''}`}
              onClick={() => setActiveTab(TABS.AI_EXAM)}
              id="tab-ai-exam"
            >
              <Sparkles size={17} />
              <span>Tạo bài thi thử & Đánh giá bằng AI</span>
              <span className="tab-badge-hot">AI</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
