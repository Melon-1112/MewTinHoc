import React, { useState, useEffect } from 'react';
import Navbar, { TABS } from './components/Navbar';
import HomeTab from './components/HomeTab';
import RoadmapTab from './components/RoadmapTab';
import ExamRepoTab from './components/ExamRepoTab';
import AiExamTab from './components/AiExamTab';
import GoogleAuthModal from './components/GoogleAuthModal';
import LoginPage from './components/LoginPage';
import { DEFAULT_USER } from './mockData';
import { Flame, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import AdminPage from './components/AdminPage';
import { supabase } from './supabase';

export default function App() {
  const [activeTab, setActiveTab] = useState(TABS.HOME);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // User state: null = not logged in, object = logged in
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('tinhoc_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return null; // Start as guest → shows Login page
  });

  // Streak state: count, checkedToday, lastCheckInDate, virtualDateOffset
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('tinhoc_streak');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      count: 7,
      checkedToday: false,
      lastCheckInDate: null,
      dayOffset: 0 // Virtual day offset for testing "qua 1 ngày"
    };
  });

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

  useEffect(() => {
    localStorage.setItem('tinhoc_streak', JSON.stringify(streak));
  }, [streak]);

  // Sync Supabase Auth User to App User state
  const syncSupabaseAuthUser = async (authUser) => {
    if (!authUser) return;
    const meta = authUser.user_metadata || {};
    const name = meta.full_name || meta.name || meta.user_name || authUser.email?.split('@')[0] || 'Học viên';
    const email = authUser.email || '';
    const avatar = meta.avatar_url || meta.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(authUser.id)}`;

    const newUser = {
      id: authUser.id,
      name,
      email,
      avatar,
      grade: 'Lớp 12 — Ôn thi THPTQG',
      provider: authUser.app_metadata?.provider || 'google'
    };

    setUser(newUser);
    localStorage.setItem('tinhoc_user', JSON.stringify(newUser));

    // Xóa hash hoặc query OAuth khỏi URL cho gọn gàng
    if (window.location.hash.includes('access_token=') || window.location.search.includes('code=')) {
      window.history.replaceState(null, '', window.location.pathname);
    }

    // Tự động đồng bộ/upsert vào bảng profiles (nếu có)
    try {
      await supabase.from('profiles').upsert({
        id: authUser.id,
        userid: email ? email.split('@')[0] : authUser.id.slice(0, 8),
        username: name,
        email: email,
      }, { onConflict: 'id' });
    } catch (e) {
      // ignore
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
  const handleLogin = (googleAccount) => {
    const newUser = {
      ...(user || DEFAULT_USER),
      name: googleAccount.name,
      email: googleAccount.email,
      avatar: googleAccount.avatar || DEFAULT_USER.avatar,
      grade: googleAccount.grade || DEFAULT_USER.grade
    };
    setUser(newUser);
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

  // Streak Check-in: +1 streak
  const handleCheckIn = () => {
    if (streak.checkedToday) {
      showToast('Hôm nay bạn đã điểm danh rồi!');
      return;
    }

    const newCount = streak.count + 1;
    setStreak((prev) => ({
      ...prev,
      count: newCount,
      checkedToday: true,
      lastCheckInDate: new Date().toISOString().split('T')[0]
    }));

    showToast(`🔥 Điểm danh thành công! Chuỗi Streak tăng lên ${newCount} ngày.`);
  };

  // Simulation: Tua nhanh 1 ngày (Hôm sau - cho phép điểm danh tiếp)
  const handleSimulateNextDay = () => {
    setStreak((prev) => ({
      ...prev,
      dayOffset: prev.dayOffset + 1,
      checkedToday: false // Qua ngày mới thì chưa điểm danh
    }));
    showToast('📅 Đã mô phỏng sang ngày hôm sau! Bạn có thể điểm danh tiếp để duy trì streak.');
  };

  // Simulation: Bỏ lỡ 2 ngày không học -> mất streak về 0
  const handleSimulateMissedDays = () => {
    setStreak((prev) => ({
      ...prev,
      dayOffset: prev.dayOffset + 2,
      count: 0, // Mất streak
      checkedToday: false
    }));
    showToast('⚠️ Bạn đã bỏ lỡ 2 ngày không điểm danh! Chuỗi streak đã bị tắt về 0 ngày.');
  };

  const [isAdminView, setIsAdminView] = useState(() => {
    const p = window.location.pathname.replace(/\/+$/, '');
    return p.endsWith('/admin') || window.location.hash === '#admin';
  });

  useEffect(() => {
    const checkAdmin = () => {
      const p = window.location.pathname.replace(/\/+$/, '');
      setIsAdminView(p.endsWith('/admin') || window.location.hash === '#admin');
    };
    window.addEventListener('hashchange', checkAdmin);
    window.addEventListener('popstate', checkAdmin);
    return () => {
      window.removeEventListener('hashchange', checkAdmin);
      window.removeEventListener('popstate', checkAdmin);
    };
  }, []);

  if (isAdminView) {
    return <AdminPage />;
  }

  // Show Login page if not logged in
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

  return (
    <div className="app-container">
      {/* Horizontal Nav Sidebar (Thanh sidebar ngang) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        streak={streak}
        onOpenGoogleLogin={() => setIsGoogleModalOpen(true)}
        onLogout={handleLogout}
        onOpenStreakDetails={() => {
          setActiveTab(TABS.HOME);
          const el = document.getElementById('streak-card-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main Content View */}
      <main className="main-content">
        {activeTab === TABS.HOME && (
          <HomeTab
            user={user}
            streak={streak}
            onCheckIn={handleCheckIn}
            onSimulateNextDay={handleSimulateNextDay}
            onSimulateMissedDays={handleSimulateMissedDays}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === TABS.ROADMAP && <RoadmapTab />}

        {activeTab === TABS.EXAMS && <ExamRepoTab />}

        {activeTab === TABS.AI_EXAM && <AiExamTab user={user} />}
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

      {/* Google OAuth Login Modal */}
      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSelectAccount={handleSelectGoogleAccount}
        currentUser={user}
      />

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
