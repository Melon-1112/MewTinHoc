import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import logoMeoCam from '../../img/logomeocam.png';

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
  const navigate = useNavigate();
  const location = useLocation();

  const isHomeActive = location.pathname === '/' || location.pathname === '/home' || activeTab === TABS.HOME;
  const isRoadmapActive = location.pathname.startsWith('/roadmap') || activeTab === TABS.ROADMAP;
  const isExamsActive = location.pathname.startsWith('/exams') || activeTab === TABS.EXAMS;
  const isAiExamActive = location.pathname.startsWith('/ai-exam') || activeTab === TABS.AI_EXAM;

  const handleNav = (path, tabKey) => {
    if (setActiveTab) setActiveTab(tabKey);
    navigate(path);
  };
  return (
    <header className="horizontal-sidebar">
      {/* Top row: Brand & Student Info (Thông tin học viên ở trên cùng thanh sidebar) */}
      <div className="top-nav-row">
        {/* Left: Brand Logo */}
        <div
          className="brand-section"
          onClick={() => handleNav('/', TABS.HOME)}
          style={{ cursor: 'pointer' }}
          title="Về Trang chủ"
        >
          <div className="brand-logo-icon">
            <img src={logoMeoCam} alt="MewTinHoc" className="brand-logo-img" />
          </div>
          <div>
            <div className="brand-title">
              <span>Mew</span>TinHoc
              <span className="brand-tag">THPTQG</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              Đồng hành cùng bạn vượt qua kì thi
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

          {/* Student Profile & Logout button */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                className="student-profile-chip"
                title={`Học viên: ${user.name}`}
              >
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'Học viên')}&background=ea580c&color=ffffff&bold=true`}
                  alt=""
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  className="student-avatar"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'Học viên')}&background=ea580c&color=ffffff&bold=true`;
                  }}
                />
                <span className="student-name">{user.name}</span>
              </div>

              {/* Logout button */}
              <button
                onClick={onLogout}
                title="Đăng xuất tài khoản"
                className="student-logout-btn"
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
              aria-selected={isHomeActive}
              className={`nav-tab-btn ${isHomeActive ? 'active' : ''}`}
              onClick={() => handleNav('/', TABS.HOME)}
              id="tab-home"
            >
              <Home size={17} />
              <span>Trang chủ</span>
            </button>

            <button
              role="tab"
              aria-selected={isRoadmapActive}
              className={`nav-tab-btn ${isRoadmapActive ? 'active' : ''}`}
              onClick={() => handleNav('/roadmap', TABS.ROADMAP)}
              id="tab-roadmap"
            >
              <GitCommit size={17} />
              <span>Lộ trình học (Dạng dây xích trực quan)</span>
              <span className="tab-badge-hot">Mới</span>
            </button>

            <button
              role="tab"
              aria-selected={isExamsActive}
              className={`nav-tab-btn ${isExamsActive ? 'active' : ''}`}
              onClick={() => handleNav('/exams', TABS.EXAMS)}
              id="tab-exams"
            >
              <BookOpen size={17} />
              <span>Kho đề thi</span>
            </button>

            <button
              role="tab"
              aria-selected={isAiExamActive}
              className={`nav-tab-btn ${isAiExamActive ? 'active' : ''}`}
              onClick={() => handleNav('/ai-exam', TABS.AI_EXAM)}
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
