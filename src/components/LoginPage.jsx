import React, { useState, useEffect } from 'react';
import { ShieldCheck, BookOpen, Brain, ArrowRight, Trophy } from 'lucide-react';
import { supabase } from '../supabase';
import logoMeoCam from '../../img/logomeocam.png';

const FEATURES = [
  { icon: BookOpen, label: 'Kho đề thi chuẩn cấu trúc mới của Bộ GD&ĐT', color: '#EA580C' },
  { icon: Brain, label: 'AI ra đề thích nghi và chấm điểm phân hóa', color: '#FBBF24' },
  //{ icon: Trophy, label: 'Giúp bạn đạt thành tích cao trong kì thi', color: '#16A34A' }, //
];

const STATS = [
  //{ value: '1,200+', label: 'Câu hỏi chuẩn Bộ' },
  //{ value: '98%', label: 'Học viên đạt ≥8' },
  //{ value: 'AI', label: 'Đề thích nghi' },
];

function GoogleGLogo({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
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
  );
}

export default function LoginPage({ onLogin }) {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [floatAnim, setFloatAnim] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setFloatAnim(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Kiểm tra lỗi OAuth trả về từ URL nếu có
  useEffect(() => {
    const hash = window.location.hash;
    const search = window.location.search;
    if (hash.includes('error=') || search.includes('error=')) {
      const params = new URLSearchParams(hash.replace(/^#/, '?') || search);
      const desc = params.get('error_description') || params.get('error');
      if (desc) {
        setError(`Đăng nhập Google không thành công: ${decodeURIComponent(desc)}`);
      }
    }
  }, []);

  // ĐĂNG NHẬP GOOGLE OAUTH QUA SUPABASE
  const handleGoogleLogin = async () => {
    setError('');
    setSuccess('');

    if (!supabase) {
      setError('Chưa cấu hình Supabase Client. Vui lòng kiểm tra lại cấu hình.');
      return;
    }

    setIsGoogleLoading(true);
    try {
      // URL redirect về ứng dụng (hoạt động tốt cả trên localhost lẫn GitHub Pages)
      const redirectUrl = window.location.origin + window.location.pathname;

      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      });

      if (oauthError) throw oauthError;
      // Trình duyệt sẽ tự động chuyển hướng sang trang đăng nhập Google
    } catch (err) {
      setIsGoogleLoading(false);
      setError(err?.message || 'Không thể kết nối đến Google OAuth. Vui lòng thử lại sau.');
    }
  };

  return (
    <div className="login-page-root">
      <div className="login-blob login-blob-1" />
      <div className="login-blob login-blob-2" />
      <div className="login-blob login-blob-3" />

      <div className={`login-split-layout ${floatAnim ? 'login-float-in' : ''}`}>
        {/* LEFT — Branding */}
        <div className="login-brand-panel">
          <div className="login-brand-inner">
            <div className="login-logo-group">
              <div className="login-logo-icon">
                <img src={logoMeoCam} alt="MewTinHoc" className="login-logo-img" />
              </div>
              <div>
                <div className="login-logo-name">MewTinHoc</div>
                <div className="login-logo-sub">Đồng hành cùng bạn vượt qua kì thi</div>
              </div>
            </div>

            <h1 className="login-brand-headline">
              Chinh phục
              <span className="login-brand-highlight"> Tin học </span>
              <br /> THPTQG
            </h1>

            <div className="login-features-list">
              {FEATURES.map(({ icon: Icon, label, color }) => (
                <div className="login-feature-row" key={label}>
                  <div className="login-feature-icon" style={{ background: `${color}18`, color }}>
                    <Icon size={16} />
                  </div>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            <div className="login-stats-row">
              {STATS.map((s) => (
                <div className="login-stat-item" key={s.label}>
                  <div className="login-stat-value">{s.value}</div>
                  <div className="login-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Auth */}
        <div className="login-auth-panel">
          <div className="login-auth-card">
            <div className="login-auth-inner">
              <div className="login-auth-header">
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: '#FFFFFF',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.25rem',
                  border: '1px solid #F3F4F6'
                }}>
                  <GoogleGLogo size={32} />
                </div>
                <h2 className="login-auth-title">Đăng nhập vào MewTinHoc</h2>
                <p className="login-auth-subtitle">
                  Sử dụng tài khoản Google để đồng bộ lộ trình học tập và lưu kết quả thi thử trên đám mây
                </p>
              </div>

              {/* Thông báo lỗi / thành công */}
              {error && (
                <div role="alert" style={{
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  background: '#FEE2E2',
                  border: '1px solid #FCA5A5',
                  color: '#DC2626',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  lineHeight: 1.4
                }}>
                  {error}
                </div>
              )}
              {success && (
                <div role="status" style={{
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  background: '#DCFCE7',
                  border: '1px solid #86EFAC',
                  color: '#16A34A',
                  fontSize: '0.84rem',
                  fontWeight: 600
                }}>
                  {success}
                </div>
              )}

              {/* NÚT CHÍNH: ĐĂNG NHẬP GOOGLE OAUTH */}
              <button
                type="button"
                className="login-google-btn"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
                aria-busy={isGoogleLoading}
                style={{
                  padding: '0.85rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  background: '#FFFFFF',
                  border: '2px solid #E5E7EB',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: '#1F2937',
                  cursor: isGoogleLoading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
              >
                {isGoogleLoading ? (
                  <>
                    <div className="login-spinner" />
                    <span>Đang kết nối Google...</span>
                  </>
                ) : (
                  <>
                    <GoogleGLogo size={22} />
                    <span>Tiếp tục với Google</span>
                    <ArrowRight size={18} className="login-btn-arrow" />
                  </>
                )}
              </button>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                fontSize: '0.75rem',
                color: '#15803D',
                background: '#F0FDF4',
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid #DCFCE7'
              }}>
                <ShieldCheck size={14} color="#16A34A" />
                <span>Xác thực qua Google an toàn</span>
              </div>

              <div className="login-security-note">
                <ShieldCheck size={14} color="#16A34A" />
                <span>Không lưu mật khẩu · Dữ liệu được mã hóa an toàn</span>
              </div>
            </div>
          </div>

          <p className="login-footer-note">
            Bằng cách đăng nhập, bạn đồng ý với{' '}
            <a href="#terms" className="login-footer-link">Điều khoản sử dụng</a> và{' '}
            <a href="#privacy" className="login-footer-link">Chính sách bảo mật</a> của MewTinHoc.
          </p>
        </div>
      </div>
    </div>
  );
}