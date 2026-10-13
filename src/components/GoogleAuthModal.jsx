import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, User } from 'lucide-react';
import { GOOGLE_DEMO_ACCOUNTS } from '../mockData';

export default function GoogleAuthModal({ isOpen, onClose, onSelectAccount, currentUser }) {
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');

  if (!isOpen) return null;

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
          <button onClick={onClose} style={{ color: '#9CA3AF', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        <div className="google-auth-header">
          {/* Official Google 'G' Logo SVG */}
          <svg className="google-logo-svg" viewBox="0 0 24 24">
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
          <h2 className="google-auth-title">Đăng nhập với Google</h2>
          <p className="google-auth-subtitle">
            Hệ thống sẽ đồng bộ họ tên tài khoản Google vào hồ sơ học viên TinHocPro THPTQG
          </p>
        </div>

        {/* List of fast Google Accounts */}
        <div>
          <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-deep)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Chọn tài khoản Google sẵn có:
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
                      alt={acc.name}
                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }}></div>
          <span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 600 }}>Hoặc nhập tên tài khoản Google</span>
          <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }}></div>
        </div>

        {/* Custom Google account input form */}
        <form onSubmit={handleCustomLogin} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div className="custom-input-group">
            <label>Họ và tên Google của bạn:</label>
            <input
              type="text"
              placeholder="VD: Jax Tin Học, Hoàng Minh..."
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              required
            />
          </div>
          <div className="custom-input-group">
            <label>Email Google (tùy chọn):</label>
            <input
              type="email"
              placeholder="VD: jax.dev@gmail.com"
              value={customEmail}
              onChange={(e) => setCustomEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn-primary-glow"
            style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', marginTop: '0.5rem' }}
          >
            Đăng nhập tài khoản này
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center', fontSize: '0.72rem', color: '#9CA3AF' }}>
          <ShieldCheck size={14} color="#16A34A" />
          <span>Bảo mật OAuth 2.0 xác thực thông qua Google API</span>
        </div>
      </div>
    </div>
  );
}
