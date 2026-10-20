import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Navbar, { TABS } from './components/Navbar';
import HomeTab from './components/HomeTab';
import RoadmapTab from './components/RoadmapTab';
import ExamRepoTab from './components/ExamRepoTab';
import AiExamTab from './components/AiExamTab';
import LoginPage from './components/LoginPage';
import LoadingScreen from './components/LoadingScreen';
import { DEFAULT_USER } from './mockData';
import { Flame, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import AdminPage from './components/AdminPage';
import { supabase } from './supabase';
import { useUserProgress } from './lib/userProgress';
import { resolveUserRole, syncUserRoleToSupabase } from './lib/roleService';
import BotpressChatBubble from './components/BotpressChatBubble';

export default function App() {
  const [activeTab, setActiveTab] = useState(TABS.HOME);
  const [toastMessage, setToastMessage] = useState(null);

  // Màn hình Loading lúc khởi động app (lần đầu mở web / refresh)
  // Hiển thị tối thiểu ~700ms để tránh "flash" gây khó chịu, đồng thời mask quá trình rehydrate state.
  const [appBooting, setAppBooting] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setAppBooting(false), 800);
    return () => clearTimeout(t);
  }, []);

  // User state: null = not logged in, object = logged in
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('tinhoc_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return resolveUserRole(parsed);
      } catch (e) { /* ignore */ }
    }
    return null; // Start as guest → shows Login page
  });

  // Tích hợp dữ liệu Realtime Database (Streak, Mastery 4 khối, Lộ trình, Lịch sử điểm danh)
  const {
    progress,
    mastery,
    completedLessons,
    streak,
    dbStatus,
    isRealtimeActive,
    checkIn,
    updateMastery,
    toggleLesson,
    recordExamResult,
    simulateNextDay,
    simulateMissedDays,
    resetSimulation
  } = useUserProgress(user);

  // Helper to show toasts
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('tinhoc_user', JSON.stringify(user));
  }, [user]);


  // Sync Supabase Auth User to App User state
  const syncSupabaseAuthUser = async (authUser) => {
    if (!authUser) return;
    const meta = authUser.user_metadata || {};
    const identities = authUser.identities || [];
    const googleIdentity = identities.find(id => id.provider === 'google') || identities[0];
    const identityData = googleIdentity?.identity_data || {};

    const name = meta.full_name || meta.name || identityData.full_name || identityData.name || meta.user_name || authUser.email?.split('@')[0] || 'Học viên';
    const email = authUser.email || identityData.email || '';
    const avatar = meta.avatar_url || meta.picture || identityData.avatar_url || identityData.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ea580c&color=ffffff&bold=true`;

    const rawUser = {
      id: authUser.id,
      name,
      email,
      avatar,
      grade: 'Lớp 12 — Ôn thi THPTQG',
      provider: authUser.app_metadata?.provider || 'google'
    };

    // Tự động kiểm tra và đồng bộ quyền hạn thực tế từ Supabase profiles
    const syncedUser = await syncUserRoleToSupabase(rawUser);
    setUser(syncedUser);
    localStorage.setItem('tinhoc_user', JSON.stringify(syncedUser));

    // Xóa hash hoặc query OAuth khỏi URL cho gọn gàng
    if (window.location.hash.includes('access_token=') || window.location.search.includes('code=')) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  // Lắng nghe đăng nhập Google OAuth qua Supabase
  useEffect(() => {
    if (!supabase) return;

    // 1. Kiểm tra session hiện có
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        syncSupabaseAuthUser(session.user);
      }
    });

    // 2. Lắng nghe thay đổi auth (khi redirect từ Google OAuth về, đăng nhập, đăng xuất)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        syncSupabaseAuthUser(session.user);
        showToast(`🎉 Đăng nhập thành công! Chào mừng ${session.user.user_metadata?.full_name || session.user.email}!`);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('tinhoc_user');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Handle login from LoginPage
  const handleLogin = async (googleAccount) => {
    const rawUser = {
      ...(user || DEFAULT_USER),
      name: googleAccount.name,
      email: googleAccount.email,
      avatar: googleAccount.avatar || DEFAULT_USER.avatar,
      grade: googleAccount.grade || DEFAULT_USER.grade
    };
    const syncedUser = await syncUserRoleToSupabase(rawUser);
    setUser(syncedUser);
    localStorage.setItem('tinhoc_user', JSON.stringify(syncedUser));
    showToast(`🎉 Chào mừng ${googleAccount.name}! Bắt đầu luyện thi thôi!`);
  };

  // Handle logout → back to Login page
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Sign out error:', e);
    }
    setUser(null);
    localStorage.removeItem('tinhoc_user');
    showToast('Đã đăng xuất tài khoản Google.');
  };

  // Google OAuth selection (from modal inside app)
  const handleSelectGoogleAccount = (googleAccount) => {
    const updated = {
      ...(user || DEFAULT_USER),
      name: googleAccount.name,
      email: googleAccount.email,
      avatar: googleAccount.avatar || DEFAULT_USER.avatar,
      grade: googleAccount.grade || DEFAULT_USER.grade
    };
    setUser(updated);
    showToast(`Đổi tài khoản thành công! Tên học viên: ${googleAccount.name}`);
  };

  // Streak Check-in: +1 streak với Supabase Realtime
  const handleCheckIn = async () => {
    const res = await checkIn();
    if (res?.message) {
      showToast(res.message);
    }
  };

  // Simulation: Tua nhanh 1 ngày (Hôm sau - cho phép điểm danh tiếp)
  const handleSimulateNextDay = () => {
    const msg = simulateNextDay();
    showToast(msg);
  };

  // Simulation: Bỏ lỡ 2 ngày không học -> mất streak về 0
  const handleSimulateMissedDays = async () => {
    const msg = await simulateMissedDays();
    showToast(msg);
  };

  // Simulation: Quay về ngày thực tế
  const handleResetSimulation = () => {
    showToast(resetSimulation());
  };

  const navigate = useNavigate();
  const location = useLocation();

  const isAdminRoute = location.pathname.endsWith('/admin') || window.location.hash === '#admin';

  if (isAdminRoute) {
    return <AdminPage currentUser={user} />;
  }

  // Show Login page if not logged in (and not on admin)
  if (!user) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        {toastMessage && (
          <div className="toast-notice">
            <Flame size={18} color="var(--color-amber)" />
            <span>{toastMessage}</span>
          </div>
        )}
      </>
    );
  }

  if (appBooting) {
    return <LoadingScreen text="Đang khởi động MewTinHoc" fullScreen />;
  }

  return (
    <div className="app-container">
      {/* Horizontal Nav Sidebar (Thanh sidebar ngang) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        streak={streak}
        onLogout={handleLogout}
        onOpenStreakDetails={() => {
          navigate('/');
          setTimeout(() => {
            const el = document.getElementById('streak-card-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
      />

      {/* Main Content View with URL Routes */}
      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <HomeTab
                user={user}
                streak={streak}
                progress={progress}
                mastery={mastery}
                onUpdateMastery={updateMastery}
                dbStatus={dbStatus}
                isRealtimeActive={isRealtimeActive}
                onCheckIn={handleCheckIn}
                onSimulateNextDay={handleSimulateNextDay}
                onSimulateMissedDays={handleSimulateMissedDays}
                onResetSimulation={handleResetSimulation}
                onNavigateTab={(tabKey) => {
                  if (tabKey === TABS.ROADMAP) navigate('/roadmap');
                  else if (tabKey === TABS.EXAMS) navigate('/exams');
                  else if (tabKey === TABS.AI_EXAM) navigate('/ai-exam');
                  else navigate('/');
                }}
              />
            }
          />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route
            path="/roadmap"
            element={
              <RoadmapTab
                user={user}
                completedLessonIds={completedLessons}
                onToggleLesson={toggleLesson}
                onUpdateMastery={updateMastery}
              />
            }
          />
          <Route
            path="/roadmap/:track"
            element={
              <RoadmapTab
                user={user}
                completedLessonIds={completedLessons}
                onToggleLesson={toggleLesson}
                onUpdateMastery={updateMastery}
              />
            }
          />
          <Route path="/exams" element={<ExamRepoTab user={user} onRecordExamResult={recordExamResult} />} />
          <Route path="/ai-exam" element={<AiExamTab user={user} onRecordExamResult={recordExamResult} />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>


      {/* Footer */}
      <footer style={{ borderTop: '1.5px solid var(--color-border)', background: '#FFF9F2', padding: '2rem 1.5rem', textAlign: 'center', marginTop: 'auto' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-deep)' }}>
            <span>TinHocPro THPTQG</span>
            <span style={{ fontSize: '0.75rem', background: 'var(--color-cream)', color: 'var(--color-primary)', padding: '2px 8px', borderRadius: '999px', border: '1px solid var(--color-border)' }}>
              Energy Orange Edition
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', maxWidth: '650px' }}>
            Nền tảng luyện thi Tin học tốt nghiệp THPT chuẩn cấu trúc mới của Bộ Giáo dục & Đào tạo. Lộ trình dây xích trực quan, kho đề thi chuyên sâu và đánh giá phân hóa bằng trí tuệ nhân tạo (AI).
          </p>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
            <span>© 2025 TinHocPro. Bảo lưu mọi quyền.</span>
            <span>Tài khoản Google đang kết nối: <strong>{user?.name}</strong></span>
          </div>
        </div>
      </footer>

      {/* Botpress Cloud Floating AI Chat Bubble */}
      <BotpressChatBubble user={user} />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notice">
          <Flame size={18} color="var(--color-amber)" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
