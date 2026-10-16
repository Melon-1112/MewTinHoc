import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, User, LogIn, RefreshCw } from 'lucide-react';
import { GOOGLE_DEMO_ACCOUNTS } from '../mockData';
import { supabase } from '../supabase';

export default function GoogleAuthModal({ isOpen, onClose, onSelectAccount, currentUser }) {
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);

  if (!isOpen) return null;

  const handleConnectGoogle = async () => {
    setIsConnectingGoogle(true);
    try {
      const redirectUrl = window.location.origin + window.location.pathname;
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            prompt: 'select_account',
          },
        },
      });
    } catch (err) {
      setIsConnectingGoogle(false);
      console.error('Lỗi kết nối Google OAuth:', err);
    }
  };

  const handleCustomLogin = (e) => {
    e.preventDefault();
    if (!customName.trim()) return;
    const account = {
      name: customName.trim(),
      email: customEmail.trim() || `${customName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(customName)}`,
      grade: 'Lớp 12 — Ôn thi THPTQG'
    };
    onSelectAccount(account);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="google-auth-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ color: '#9CA3AF', padding: '4px', background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div className="google-auth-header">
          {/* Official Google 'G' Logo SVG */}
          <svg className="google-logo-svg" viewBox="0 0 24 24" width={40} height={40}>
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
          <h2 className="google-auth-title">Tài khoản Google</h2>
          <p className="google-auth-subtitle">
            Kết nối tài khoản Google qua Supabase OAuth để đồng bộ tiến độ học tập TinHocPro
          </p>
        </div>

        {/* Nút đăng nhập / đổi tài khoản Google thật qua Supabase OAuth */}
        <button
          onClick={handleConnectGoogle}
          disabled={isConnectingGoogle}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.65rem',
            width: '100%',
            padding: '0.85rem 1rem',
            background: '#FFFFFF',
            border: '2px solid #EA580C',
            borderRadius: '10px',
            color: '#EA580C',
            fontWeight: 700,
            fontSize: '0.92rem',
            cursor: isConnectingGoogle ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 6px rgba(234, 88, 12, 0.15)',
            marginBottom: '1rem',
            transition: 'all 0.2s'
          }}
        >
          <RefreshCw size={18} className={isConnectingGoogle ? 'spin-icon' : ''} />
          <span>{isConnectingGoogle ? 'Đang chuyển hướng Google...' : 'Đăng nhập / Đổi tài khoản Google khác'}</span>
        </button>

        {/* List of fast Google Accounts */}
        <div>
          <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-deep)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Hoặc chọn hồ sơ học viên mẫu:
          </p>
          <div className="account-selector-list">
            {GOOGLE_DEMO_ACCOUNTS.map((acc, index) => {
              const isCurrent = currentUser?.email === acc.email;
              return (
                <div
                  key={index}
                  className="account-select-item"
                  onClick={() => {
                    onSelectAccount(acc);
                    onClose();
                  }}
                >
                  <div className="account-user-meta">
                    <img
                      src={acc.avatar}
                      alt=""
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(acc.name || 'Học viên')}&background=ea580c&color=ffffff&bold=true`;
                      }}
                    />
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1F2937' }}>
                        {acc.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                        {acc.email}
                      </div>
                    </div>
                  </div>
                  {isCurrent ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 700 }}>
                      <CheckCircle size={16} /> Đang dùng
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Chọn</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0.75rem 0' }}>
          <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }}></div>
          <span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 600 }}>Hoặc nhập họ tên hiển thị</span>
          <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }}></div>
        </div>

        {/* Custom Google account input form */}
        <form onSubmit={handleCustomLogin} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div className="custom-input-group">
            <label>Họ và tên của bạn:</label>
            <input
              type="text"
              placeholder="VD: Jax Tin Học, Hoàng Minh..."
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              required
            />
          </div>
          <div className="custom-input-group">
            <label>Email liên kết (tùy chọn):</label>
            <input
              type="email"
              placeholder="VD: hocvien@gmail.com"
              value={customEmail}
              onChange={(e) => setCustomEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn-primary-glow"
            style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', marginTop: '0.25rem' }}
          >
            Lưu và sử dụng tên này
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center', fontSize: '0.72rem', color: '#9CA3AF', marginTop: '0.75rem' }}>
          <ShieldCheck size={14} color="#16A34A" />
          <span>Bảo mật OAuth 2.0 xác thực thông qua Google API & Supabase</span>
        </div>
      </div>
    </div>
  );
}
