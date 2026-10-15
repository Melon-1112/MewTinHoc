import React, { useState, useEffect } from 'react';
import { ShieldCheck, BookOpen, Trophy, Brain, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import logoMeoCam from '../../img/logomeocam.png';

const FEATURES = [
  { icon: BookOpen, label: 'Kho đề thi chuẩn cấu trúc mới', color: '#EA580C' },
  { icon: Brain, label: 'AI ra đề thích nghi năng lực', color: '#FBBF24' },
  { icon: Trophy, label: 'Lộ trình dây xích trực quan', color: '#16A34A' },
];

const STATS = [
  { value: '1,200+', label: 'Câu hỏi' },
  { value: '98%', label: 'Học viên đạt ≥8' },
  { value: 'AI', label: 'Đề thích nghi' },
];

// Supabase Auth bắt buộc có email, nên ta tạo email "ảo" từ userid.
// Người dùng chỉ thấy và nhập userid, không cần biết email này.
const toEmail = (userid) => `${userid.toLowerCase()}@tinhocpro.app`;

const USERID_REGEX = /^[a-z0-9_]{4,20}$/;

/** Ô mật khẩu có nút con mắt */
function PasswordInput({ id, value, onChange, placeholder, autoComplete }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <input
        id={id}
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        minLength={6}
        autoComplete={autoComplete}
        className="login-input"
        style={{ paddingRight: '2.6rem', width: '100%' }}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
        style={{
          position: 'absolute',
          right: '0.6rem',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#6B7280',
          display: 'flex',
        }}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

export default function LoginPage({ onLogin }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [username, setUsername] = useState('');
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [floatAnim, setFloatAnim] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setFloatAnim(true), 100);
    return () => clearTimeout(t);
  }, []);

  const switchMode = (m) => {
    setMode(m);
    setError('');
    setSuccess('');
    setPassword('');
  };

  // ---------- ĐĂNG KÝ ----------
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const id = userid.trim().toLowerCase();
    if (!USERID_REGEX.test(id)) {
      setError('User ID gồm 4-20 ký tự: chữ thường, số hoặc dấu gạch dưới.');
      return;
    }

    if (!supabase) {
      setError('Chưa cấu hình kết nối Supabase.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Tạo tài khoản trong Supabase Auth (password được băm tự động)
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: toEmail(id),
        password,
      });

      if (signUpError) {
        setIsLoading(false);
        setError(
          signUpError.message.includes('already registered')
            ? 'User ID này đã có người dùng.'
            : signUpError.message
        );
        return;
      }

      if (!data?.user) {
        setIsLoading(false);
        setError('Đăng ký không thành công. Vui lòng thử lại.');
        return;
      }

      // 2. Lưu username + userid vào bảng profiles (nếu bảng tồn tại)
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        userid: id,
        username: username.trim(),
      });

      setIsLoading(false);

      if (profileError) {
        // Ghi nhận cảnh báo nếu bảng profiles bị lỗi RLS/chưa tạo, nhưng tài khoản auth đã tạo thành công
        console.warn('Lỗi lưu profile:', profileError.message);
      }

      setSuccess('Đăng ký thành công! Hãy đăng nhập.');
      await supabase.auth.signOut();
      setMode('login');
      setPassword('');
    } catch (err) {
      setIsLoading(false);
      setError(err?.message || 'Có lỗi xảy ra khi đăng ký.');
    }
  };

  // ---------- ĐĂNG NHẬP ----------
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!supabase) {
      setError('Chưa cấu hình kết nối Supabase.');
      return;
    }

    setIsLoading(true);

    const id = userid.trim().toLowerCase();

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: toEmail(id),
        password,
      });

      if (signInError) {
        setIsLoading(false);
        setError('Sai User ID hoặc mật khẩu.');
        return;
      }

      // Truy vấn bảng profiles để lấy username (dùng maybeSingle để tránh lỗi nếu chưa có row)
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, userid')
        .eq('id', data.user.id)
        .maybeSingle();

      setIsLoading(false);

      onLogin({
        id: data.user.id,
        name: profile?.username || id,
        userid: profile?.userid || id,
        email: data.user.email || '',
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(id)}`,
        grade: 'Ôn thi THPTQG',
      });
    } catch (err) {
      setIsLoading(false);
      setError(err?.message || 'Có lỗi xảy ra khi đăng nhập.');
    }
  };

  const isRegister = mode === 'register';

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
                <img src={logoMeoCam} alt="TinHocVui Logo" className="login-logo-img" />
              </div>
              <div>
                <div className="login-logo-name">TinHocVui</div>
                <div className="login-logo-sub">Đồng hành cùng bạn vượt qua kì thi</div>
              </div>
            </div>

            <h1 className="login-brand-headline">
              Chinh phục
              <span className="login-brand-highlight"> Tin học </span>
              <br /> THPTQG
            </h1>
            <p className="login-brand-desc">

            </p>

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
                <h2 className="login-auth-title">
                  {isRegister ? 'Tạo tài khoản' : 'Đăng nhập vào TinHocPro'}
                </h2>
                <p className="login-auth-subtitle">
                  {isRegister
                    ? 'Điền thông tin để bắt đầu hành trình luyện thi'
                    : 'Nhập User ID và mật khẩu của bạn'}
                </p>
              </div>

              <form onSubmit={isRegister ? handleRegister : handleLogin} className="login-custom-form">
                {isRegister && (
                  <div className="login-field-group">
                    <label htmlFor="username">
                      Tên hiển thị <span className="login-required">*</span>
                    </label>
                    <input
                      id="username"
                      type="text"
                      placeholder="VD: Nguyễn Văn A"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      maxLength={40}
                      className="login-input"
                    />
                  </div>
                )}

                <div className="login-field-group">
                  <label htmlFor="userid">
                    User ID <span className="login-required">*</span>
                  </label>
                  <input
                    id="userid"
                    type="text"
                    placeholder="nguyenvana01"
                    value={userid}
                    onChange={(e) => setUserid(e.target.value)}
                    required
                    autoComplete="username"
                    className="login-input"
                  />
                </div>

                <div className="login-field-group">
                  <label htmlFor="password">
                    Mật khẩu <span className="login-required">*</span>
                  </label>
                  <PasswordInput
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ít nhất 6 ký tự"
                    autoComplete={isRegister ? 'new-password' : 'current-password'}
                  />
                </div>

                {error && (
                  <p role="alert" style={{ color: '#DC2626', fontSize: '0.85rem', margin: '0.25rem 0' }}>
                    {error}
                  </p>
                )}
                {success && (
                  <p role="status" style={{ color: '#16A34A', fontSize: '0.85rem', margin: '0.25rem 0' }}>
                    {success}
                  </p>
                )}

                <button
                  type="submit"
                  className="login-google-btn"
                  disabled={isLoading}
                  aria-busy={isLoading}
                  style={{ marginTop: '0.5rem' }}
                >
                  {isLoading ? (
                    <>
                      <div className="login-spinner login-spinner-white" />
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <span>{isRegister ? 'Tạo tài khoản' : 'Đăng nhập'}</span>
                      <ArrowRight size={18} className="login-btn-arrow" />
                    </>
                  )}
                </button>
              </form>

              <div className="login-divider">
                <span>{isRegister ? 'đã có tài khoản?' : 'chưa có tài khoản?'}</span>
              </div>

              <button
                type="button"
                className="login-custom-btn"
                onClick={() => switchMode(isRegister ? 'login' : 'register')}
              >
                {isRegister ? 'Quay lại đăng nhập' : 'Tạo tài khoản mới'}
              </button>

              <div className="login-security-note">
                <ShieldCheck size={14} color="#16A34A" />
                <span>Mật khẩu được mã hóa, không ai đọc lại được</span>
              </div>
            </div>
          </div>

          <p className="login-footer-note">
            Bằng cách đăng nhập, bạn đồng ý với{' '}
            <a href="/terms" className="login-footer-link">Điều khoản sử dụng</a> và{' '}
            <a href="/privacy" className="login-footer-link">Chính sách bảo mật</a> của TinHocPro.
          </p>
        </div>
      </div>
    </div>
  );
}