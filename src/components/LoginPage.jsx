import React, { useState, useEffect } from 'react';
import { ShieldCheck, Sparkles, BookOpen, Trophy, Brain, ArrowRight, CheckCircle } from 'lucide-react';
import { GOOGLE_DEMO_ACCOUNTS } from '../mockData';

const FEATURES = [
  { icon: BookOpen, label: 'Kho đề thi chuẩn cấu trúc mới', color: '#EA580C' },
  { icon: Brain, label: 'AI ra đề thích nghi năng lực', color: '#FBBF24' },
  { icon: Trophy, label: 'Lộ trình dây xích trực quan', color: '#16A34A' },
];

export default function LoginPage({ onLogin }) {
  const [step, setStep] = useState('landing'); // 'landing' | 'chooser' | 'custom'
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAccount, setLoadingAccount] = useState(null);
  const [floatAnim, setFloatAnim] = useState(false);

  // Subtle float animation trigger
  useEffect(() => {
    const t = setTimeout(() => setFloatAnim(true), 100);
    return () => clearTimeout(t);
  }, []);

  const simulateOAuth = (account, callback) => {
    setIsLoading(true);
    setLoadingAccount(account.name);
    setTimeout(() => {
      setIsLoading(false);
      setLoadingAccount(null);
      callback(account);
    }, 1600);
  };

  const handleSelectAccount = (acc) => {
    simulateOAuth(acc, onLogin);
  };

  const handleCustomLogin = (e) => {
    e.preventDefault();
    if (!customName.trim()) return;
    const account = {
      name: customName.trim(),
      email: customEmail.trim() || `${customName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(customName)}`,
      grade: 'Lớp 12 — Ôn thi THPTQG',
    };
    simulateOAuth(account, onLogin);
  };

  return (
    <div className="login-page-root">
      {/* Background blobs */}
      <div className="login-blob login-blob-1" />
      <div className="login-blob login-blob-2" />
      <div className="login-blob login-blob-3" />

      <div className={`login-split-layout ${floatAnim ? 'login-float-in' : ''}`}>
        {/* LEFT — Branding panel */}
        <div className="login-brand-panel">
          <div className="login-brand-inner">
            {/* Logo */}
            <div className="login-logo-group">
              <div className="login-logo-icon">
                <Sparkles size={28} color="#EA580C" />
              </div>
              <div>
                <div className="login-logo-name">TinHocPro</div>
                <div className="login-logo-sub">THPTQG 2025</div>
              </div>
            </div>

            <h1 className="login-brand-headline">
              Chinh phục
              <span className="login-brand-highlight"> Tin học</span>
              <br />cùng AI giáo viên ảo
            </h1>
            <p className="login-brand-desc">
              Nền tảng luyện thi Tin học THPTQG duy nhất với AI ra đề thích nghi, lộ trình dây xích và kho đề 1000+ câu chuẩn Bộ GD&ĐT.
            </p>

            {/* Feature pills */}
            <div className="login-features-list">
              {FEATURES.map((f) => (
                <div className="login-feature-row" key={f.label}>
                  <div className="login-feature-icon" style={{ background: `${f.color}18`, color: f.color }}>
                    <f.icon size={16} />
                  </div>
                  <span>{f.label}</span>
                </div>
              ))}
            </div>

            {/* Stats row */}
            <div className="login-stats-row">
              {[
                { value: '1,200+', label: 'Câu hỏi' },
                { value: '98%', label: 'Học viên đạt ≥8' },
                { value: 'AI', label: 'Đề thích nghi' },
              ].map((s) => (
                <div className="login-stat-item" key={s.label}>
                  <div className="login-stat-value">{s.value}</div>
                  <div className="login-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Auth panel */}
        <div className="login-auth-panel">
          <div className="login-auth-card">
            {/* Watermark Google G */}
            <div className="login-g-watermark">
              <GoogleGLogo size={64} opacity={0.06} />
            </div>

            {step === 'landing' && (
              <div className="login-auth-inner">
                <div className="login-auth-header">
                  <GoogleGLogo size={44} />
                  <h2 className="login-auth-title">Đăng nhập vào TinHocPro</h2>
                  <p className="login-auth-subtitle">
                    Sử dụng tài khoản Google của bạn để bắt đầu hành trình luyện thi
                  </p>
                </div>

                {/* Main CTA */}
                <button
                  className="login-google-btn"
                  onClick={() => setStep('chooser')}
                  disabled={isLoading}
                >
                  <GoogleGLogo size={22} />
                  <span>Tiếp tục với Google</span>
                  <ArrowRight size={18} className="login-btn-arrow" />
                </button>

                <div className="login-divider">
                  <span>hoặc</span>
                </div>

                <button
                  className="login-custom-btn"
                  onClick={() => setStep('custom')}
                >
                  Nhập tên tài khoản thủ công
                </button>

                <div className="login-security-note">
                  <ShieldCheck size={14} color="#16A34A" />
                  <span>Bảo mật qua OAuth 2.0 · Không lưu mật khẩu</span>
                </div>
              </div>
            )}

            {step === 'chooser' && (
              <div className="login-auth-inner">
                <button className="login-back-btn" onClick={() => setStep('landing')}>
                  ← Quay lại
                </button>
                <div className="login-auth-header">
                  <GoogleGLogo size={40} />
                  <h2 className="login-auth-title">Chọn tài khoản</h2>
                  <p className="login-auth-subtitle">
                    Chọn tài khoản Google để đăng nhập vào TinHocPro
                  </p>
                </div>

                <div className="login-account-list">
                  {GOOGLE_DEMO_ACCOUNTS.map((acc, i) => (
                    <button
                      key={i}
                      className="login-account-item"
                      onClick={() => handleSelectAccount(acc)}
                      disabled={isLoading}
                    >
                      <img src={acc.avatar} alt={acc.name} className="login-account-avatar" />
                      <div className="login-account-info">
                        <div className="login-account-name">{acc.name}</div>
                        <div className="login-account-email">{acc.email}</div>
                      </div>
                      {isLoading && loadingAccount === acc.name ? (
                        <div className="login-spinner" />
                      ) : (
                        <ArrowRight size={16} className="login-account-arrow" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="login-divider">
                  <span>hoặc dùng tài khoản khác</span>
                </div>
                <button className="login-custom-btn" onClick={() => setStep('custom')}>
                  + Thêm tài khoản Google khác
                </button>

                <div className="login-security-note">
                  <ShieldCheck size={14} color="#16A34A" />
                  <span>Bảo mật qua OAuth 2.0 · Không lưu mật khẩu</span>
                </div>
              </div>
            )}

            {step === 'custom' && (
              <div className="login-auth-inner">
                <button className="login-back-btn" onClick={() => setStep('chooser')}>
                  ← Quay lại
                </button>
                <div className="login-auth-header">
                  <GoogleGLogo size={40} />
                  <h2 className="login-auth-title">Nhập tài khoản Google</h2>
                  <p className="login-auth-subtitle">
                    Nhập thông tin tài khoản Google để kết nối với hồ sơ học viên
                  </p>
                </div>

                <form onSubmit={handleCustomLogin} className="login-custom-form">
                  <div className="login-field-group">
                    <label>Họ và tên Google <span className="login-required">*</span></label>
                    <input
                      type="text"
                      placeholder="VD: Nguyễn Văn A"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      required
                      className="login-input"
                    />
                  </div>
                  <div className="login-field-group">
                    <label>Email Google <span className="login-optional">(tùy chọn)</span></label>
                    <input
                      type="email"
                      placeholder="VD: nguyenvana@gmail.com"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      className="login-input"
                    />
                  </div>
                  <button
                    type="submit"
                    className="login-google-btn"
                    disabled={isLoading || !customName.trim()}
                    style={{ marginTop: '0.5rem' }}
                  >
                    {isLoading ? (
                      <>
                        <div className="login-spinner login-spinner-white" />
                        <span>Đang kết nối...</span>
                      </>
                    ) : (
                      <>
                        <GoogleGLogo size={20} />
                        <span>Đăng nhập với tên này</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="login-security-note">
                  <ShieldCheck size={14} color="#16A34A" />
                  <span>Bảo mật qua OAuth 2.0 · Không lưu mật khẩu</span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom disclaimer */}
          <p className="login-footer-note">
            Bằng cách đăng nhập, bạn đồng ý với{' '}
            <a href="#" className="login-footer-link">Điều khoản sử dụng</a> và{' '}
            <a href="#" className="login-footer-link">Chính sách bảo mật</a> của TinHocPro.
          </p>
        </div>
      </div>
    </div>
  );
}

/** Google "G" Logo SVG inline */
function GoogleGLogo({ size = 24, opacity = 1 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ flexShrink: 0, opacity }}
    >
      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12c0 1.97.45 3.82 1.25 5.42l4.03-3.15z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
    </svg>
  );
}
