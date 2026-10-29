import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase.js';
import {
  ShieldCheck,
  Search,
  RotateCw,
  ArrowLeft,
  Users,
  CheckCircle,
  Clock,
  UserX,
  AlertTriangle,
  Lock,
  Copy,
  Check,
  ShieldAlert,
  Database,
  Wrench,
  ExternalLink,
  Loader2,
  X
} from 'lucide-react';
import { isCompanyAdmin } from '../lib/roleService.js';
import { testRoadmapStorageWrite } from '../lib/roadmapStorage.js';
import LoadingScreen from './LoadingScreen.jsx';
import AdminAnnouncementsPanel from './AdminAnnouncementsPanel.jsx';

export default function AdminPage({ currentUser: propUser }) {
  const [currentUser, setCurrentUser] = useState(() => {
    if (propUser) return propUser;
    try {
      const saved = localStorage.getItem('tinhoc_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [rows, setRows] = useState([]);
  const [q, setQ] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);
  const [showSqlGuide, setShowSqlGuide] = useState(false);
  const [tableExists, setTableExists] = useState(true);
  const [storageTest, setStorageTest] = useState(null);
  const [isTestingStorage, setIsTestingStorage] = useState(false);
  // Demo màn hình Loading (chỉ Admin mới thấy)
  const [isLoadingDemoOpen, setIsLoadingDemoOpen] = useState(false);

  // Người dùng được coi là có quyền quản trị nếu profile có is_admin = true,
  // hoặc trong quá trình khởi tạo ban đầu khi bảng profiles chưa được tạo.
  const isAdmin = isCompanyAdmin(currentUser) || !tableExists || (currentUser && currentUser.isAdmin);

  const load = async () => {
    setIsLoading(true);
    setMsg('Đang tải danh sách hồ sơ từ Supabase...');
    try {
      if (!supabase) {
        setMsg('Chưa cấu hình Supabase Client.');
        setRows([]);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('id, userid, username, email, is_admin, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === 'PGRST205') {
          // Bảng profiles chưa được tạo trên Supabase
          setTableExists(false);
          setShowSqlGuide(true);
          setMsg('Bảng `profiles` chưa được tạo trên Supabase. Vui lòng chạy đoạn SQL bên dưới trong Supabase SQL Editor để cấp quyền Admin cho tất cả hồ sơ hiện có.');
          setRows([]);
        } else {
          setMsg('Lỗi truy vấn bảng profiles: ' + error.message);
          setRows([]);
        }
        return;
      }

      setTableExists(true);
      setRows(data || []);
      if (!data || data.length === 0) {
        setMsg('Bảng `profiles` đang trống. Hãy chạy câu lệnh SQL bên dưới để đổ toàn bộ người dùng từ auth.users sang bảng profiles và cấp quyền Admin.');
        setShowSqlGuide(true);
      } else {
        setMsg('');
      }
    } catch (err) {
      setMsg('Lỗi kết nối Supabase: ' + (err?.message || 'Không xác định'));
      setRows([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleBackHome = () => {
    const baseUrl = import.meta.env.BASE_URL || '/';
    window.location.href = baseUrl;
  };

  const handleToggleAdmin = async (userRecord) => {
    const newStatus = !userRecord.is_admin;

    // Cập nhật giao diện ngay lập tức
    setRows((prev) =>
      prev.map((r) => (r.id === userRecord.id ? { ...r, is_admin: newStatus } : r))
    );

    // Đồng bộ trực tiếp lên Supabase
    if (supabase) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ is_admin: newStatus })
          .eq('id', userRecord.id);

        if (error) {
          alert('Lỗi cập nhật trên Supabase: ' + error.message);
          load(); // Revert
        }
      } catch (e) {
        console.warn('Lỗi cập nhật Supabase:', e);
      }
    }
  };

  // CÂU LỆNH SQL CHUẨN: TẠO BẢNG, ĐỒNG BỘ HỒ SƠ, PHÂN QUYỀN ADMIN VÀ MỞ QUYỀN GHI STORAGE
  const sqlSchemaSnippet = `-- ==============================================================
-- 1. TẠO BẢNG PROFILES (NẾU CHƯA CÓ)
-- ==============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  userid TEXT,
  username TEXT,
  email TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================
-- 2. ĐỔ TOÀN BỘ TÀI KHOẢN GOOGLE HIỆN CÓ SANG BẢNG PROFILES
-- (Người đã có hồ sơ thì GIỮ NGUYÊN quyền hiện tại, không tự phong Admin)
-- ==============================================================
INSERT INTO public.profiles (id, userid, username, email, is_admin, created_at)
SELECT 
  id, 
  COALESCE(raw_user_meta_data->>'user_name', split_part(email, '@', 1)),
  COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', split_part(email, '@', 1)),
  email,
  FALSE, -- <<< MẶC ĐỊNH NGƯỜI DÙNG PHỔ THÔNG (an toàn)
  created_at
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- ==============================================================
-- 2b. CẤP QUYỀN ADMIN CHO ĐÚNG DANH SÁCH EMAIL BÊN DƯỚI
-- (Thêm/bớt email tại đây rồi chạy lại câu lệnh này mỗi khi cần)
-- ==============================================================
UPDATE public.profiles
SET is_admin = TRUE
WHERE email IN (
  'jaxcater1906@gmail.com',
  'thannhi0948@gmail.com',
  'kado30az@gmail.com',
  'killeran72@gmail.com'
);

-- ==============================================================
-- 3. TỰ ĐỘNG: NGƯỜI ĐĂNG KÝ SAU NÀY SẼ LÀ NGƯỜI DÙNG PHỔ THÔNG (is_admin = FALSE)
-- ==============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, userid, username, email, is_admin, created_at)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'user_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    FALSE, -- <<< NGƯỜI MỚI ĐĂNG KÝ SAU NÀY MẶC ĐỊNH LÀ FALSE (HỌC VIÊN PHỔ THÔNG)
    new.created_at
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================================
-- 4. BẬT BẢO MẬT (RLS) & PHÂN QUYỀN CHẶT CHẼ CHO BẢNG PROFILES
-- ==============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Hàm phụ trợ kiểm tra người đang đăng nhập có phải Admin.
-- Dùng SECURITY DEFINER để tránh lỗi "infinite recursion" khi policy truy vấn lại chính bảng profiles.
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT COALESCE((SELECT p.is_admin FROM public.profiles p WHERE p.id = auth.uid()), false);
$$;

-- XÓA các policy cũ đang mở toàn bộ (ai cũng tự phong được Admin cho chính mình)
DROP POLICY IF EXISTS "Cho phép xem profiles" ON public.profiles;
DROP POLICY IF EXISTS "Cho phép cập nhật profiles" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_self" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_admin_only" ON public.profiles;

-- XEM: mỗi người chỉ xem được hồ sơ của mình; riêng Admin xem được TẤT CẢ hồ sơ
CREATE POLICY "profiles_select_own_or_admin" ON public.profiles
  FOR SELECT USING (id = auth.uid() OR public.is_admin_user());

-- THÊM MỚI: chỉ được tạo hồ sơ cho chính mình và KHÔNG được tự nâng quyền Admin
CREATE POLICY "profiles_insert_self" ON public.profiles
  FOR INSERT WITH CHECK (id = auth.uid() AND is_admin = false);

-- CẬP NHẬT: chỉ Admin được đổi quyền (kể cả nâng/hạ quyền của người khác)
CREATE POLICY "profiles_update_admin_only" ON public.profiles
  FOR UPDATE USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());

-- ==============================================================
-- 5. CHO PHÉP ADMIN GHI FILE JSON LÊN SUPABASE STORAGE
-- (BẮT BUỘC phải có, nếu không nút "Lưu & Đồng bộ Supabase" sẽ báo lỗi 403
--  "new row violates row-level security policy")
-- ==============================================================
DROP POLICY IF EXISTS "storage_insert_admin" ON storage.objects;
DROP POLICY IF EXISTS "storage_update_admin" ON storage.objects;
DROP POLICY IF EXISTS "storage_read_admin" ON storage.objects;
DROP POLICY IF EXISTS "storage_delete_admin" ON storage.objects;
DROP POLICY IF EXISTS "storage_read_all" ON storage.objects;

CREATE POLICY "storage_insert_admin" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'KhoTaiLieuTinHocThiThu' AND public.is_admin_user());

-- Đổi tên tài liệu dùng thao tác MOVE -> cần quyền UPDATE
CREATE POLICY "storage_update_admin" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'KhoTaiLieuTinHocThiThu' AND public.is_admin_user())
  WITH CHECK (bucket_id = 'KhoTaiLieuTinHocThiThu' AND public.is_admin_user());

-- Xoá tài liệu trong Kho đề thi -> cần quyền DELETE (khác với INSERT/UPDATE)
CREATE POLICY "storage_delete_admin" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'KhoTaiLieuTinHocThiThu' AND public.is_admin_user());

-- Cho phép đọc tài liệu & tạo Signed URL cho bucket KhoTaiLieuTinHocThiThu (cần thiết khi để Private Bucket)
CREATE POLICY "storage_read_all" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'KhoTaiLieuTinHocThiThu');`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchemaSnippet);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  // ===== CHẨN ĐOÁN: Kiểm tra quyền GHI lên Supabase Storage =====
  const handleTestStorage = async () => {
    setIsTestingStorage(true);
    setStorageTest(null);
    const result = await testRoadmapStorageWrite();
    setStorageTest(result);
    setIsTestingStorage(false);
  };

  // Tài liệu chính thức để cấu hình Storage Policy
  const SUPABASE_STORAGE_POLICY_URL =
    'https://supabase.com/dashboard/project/vxqvjffssebnuxtslghp/storage/buckets/KhoTaiLieuTinHocThiThu';

  // NẾU BẢNG ĐÃ TỒN TẠI VÀ USER ĐĂNG NHẬP KHÔNG PHẢI ADMIN: TỪ CHỐI TRUY CẬP
  if (tableExists && currentUser && !isCompanyAdmin(currentUser) && rows.length > 0) {
    const isUserInAdminRows = rows.some(
      (r) => (r.id === currentUser.id || r.email === currentUser.email) && r.is_admin
    );

    if (!isUserInAdminRows) {
      return (
        <div
          style={{
            minHeight: '100vh',
            background: '#F9FAFB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1.5rem',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
          }}
        >
          <div
            style={{
              maxWidth: '520px',
              width: '100%',
              background: '#FFFFFF',
              border: '1.5px solid #FEE2E2',
              borderRadius: '16px',
              padding: '2.5rem 2rem',
              textAlign: 'center',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#FEE2E2',
                color: '#DC2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto'
              }}
            >
              <Lock size={32} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111827', marginBottom: '0.6rem' }}>
              Không Có Quyền Truy Cập
            </h2>
            <p style={{ fontSize: '0.92rem', color: '#6B7280', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Trang này chỉ dành cho tài khoản có quyền Quản trị viên trên hệ thống Supabase. Tài khoản của bạn (
              <strong>{currentUser?.email || 'Người dùng phổ thông'}</strong>) chưa được cấp quyền Admin.
            </p>
            <button
              onClick={handleBackHome}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: 'var(--color-primary, #EA580C)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={18} />
              <span>Quay về trang ôn luyện</span>
            </button>
          </div>
        </div>
      );
    }
  }

  const shown = (rows || []).filter((r) =>
    `${r?.userid || ''} ${r?.username || ''} ${r?.email || ''}`.toLowerCase().includes(q.toLowerCase())
  );

  const adminCount = rows.filter((r) => r.is_admin).length;
  const standardCount = rows.length - adminCount;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F9FAFB',
        color: '#1F2937',
        padding: '2rem 1.5rem',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.5rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid #E5E7EB'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: '#EA580C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFF'
              }}
            >
              <ShieldCheck size={26} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                Quản Trị Hồ Sơ &amp; Phân Quyền Supabase
              </h1>
              <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: '3px 0 0 0' }}>
                Cấp quyền Admin cho hồ sơ công ty &amp; người dùng phổ thông
              </p>
            </div>
          </div>

          <button
            onClick={handleBackHome}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.6rem 1rem',
              background: '#FFFFFF',
              border: '1.5px solid #D1D5DB',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#374151',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              transition: 'all 0.2s'
            }}
          >
            <ArrowLeft size={16} />
            Quay lại Trang Chủ
          </button>
        </div>

        {/* 3 Metric Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              padding: '1.15rem 1.35rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}
          >
            <div style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 600 }}>TỔNG HỒ SƠ SUPABASE</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#111827', marginTop: '0.2rem' }}>
              {rows.length}
            </div>
          </div>

          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #DCFCE7',
              borderRadius: '12px',
              padding: '1.15rem 1.35rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}
          >
            <div style={{ fontSize: '0.8rem', color: '#15803D', fontWeight: 700 }}>QUẢN TRỊ VIÊN (ADMIN)</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#16A34A', marginTop: '0.2rem' }}>
              {adminCount}
            </div>
          </div>

          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              padding: '1.15rem 1.35rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}
          >
            <div style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 600 }}>HỌC VIÊN PHỔ THÔNG</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#4B5563', marginTop: '0.2rem' }}>
              {standardCount}
            </div>
          </div>
        </div>

        {/* Filter and stats bar */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            padding: '1.15rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}
        >
          <div style={{ position: 'relative', flex: '1 1 300px', maxWidth: '420px' }}>
            <Search size={18} style={{ position: 'absolute', left: 12, top: 12, color: '#9CA3AF' }} />
            <input
              type="text"
              placeholder="Tìm theo email, họ tên..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.75rem 0.65rem 2.5rem',
                border: '1.5px solid #D1D5DB',
                borderRadius: '8px',
                fontSize: '0.875rem',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <button
              onClick={() => setShowSqlGuide(!showSqlGuide)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.6rem 0.9rem',
                background: showSqlGuide ? '#EFF6FF' : '#F1F5F9',
                color: showSqlGuide ? '#1D4ED8' : '#475569',
                border: `1px solid ${showSqlGuide ? '#93C5FD' : '#CBD5E1'}`,
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Database size={15} />
              <span>{showSqlGuide ? 'Ẩn câu lệnh SQL' : 'Xem câu lệnh SQL Supabase'}</span>
            </button>

            <button
              onClick={handleTestStorage}
              disabled={isTestingStorage}
              title="Thử ghi một file kiểm tra lên Supabase Storage để xem quyền RLS đã được mở chưa"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.6rem 0.9rem',
                background: '#F0FDF4',
                color: '#15803D',
                border: '1px solid #BBF7D0',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: isTestingStorage ? 'not-allowed' : 'pointer',
                opacity: isTestingStorage ? 0.7 : 1
              }}
            >
              <Wrench size={15} className={isTestingStorage ? 'spin-icon' : ''} />
              <span>{isTestingStorage ? 'Đang kiểm tra...' : 'Kiểm tra quyền ghi Storage'}</span>
            </button>

            {/* Nút Xem Demo màn hình Loading (chỉ Admin) */}
            <button
              onClick={() => setIsLoadingDemoOpen(true)}
              title="Mở thử màn hình Loading (con mèo cam + @ThanhNhi) để kiểm tra giao diện"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.6rem 0.9rem',
                background: 'linear-gradient(135deg, #FFF7ED, #FFEDD5)',
                color: '#C2410C',
                border: '1px solid #FED7AA',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 6px -2px rgba(234,88,12,0.25)'
              }}
            >
              <Loader2 size={15} className="spin-icon" />
              <span>Xem demo Loading</span>
            </button>

            <button
              onClick={load}
              disabled={isLoading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.6rem 1rem',
                background: '#EA580C',
                color: '#FFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 700,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                transition: 'all 0.2s'
              }}
            >
              <RotateCw size={16} className={isLoading ? 'spin-icon' : ''} />
              Tải lại
            </button>
          </div>
        </div>

        {/* Kết quả chẩn đoán quyền ghi Storage */}
        {storageTest && (
          <div
            style={{
              padding: '1rem 1.25rem',
              borderRadius: '10px',
              marginBottom: '1rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              lineHeight: 1.6,
              background: storageTest.success ? '#F0FDF4' : '#FEF2F2',
              border: `1.5px solid ${storageTest.success ? '#BBF7D0' : '#FECACA'}`,
              color: storageTest.success ? '#166534' : '#991B1B'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, marginBottom: '0.35rem' }}>
              {storageTest.success ? <CheckCircle size={17} /> : <ShieldAlert size={17} />}
              <span>
                {storageTest.success
                  ? 'Quyền ghi Storage: ĐÃ MỞ — nút Lưu sẽ hoạt động'
                  : `Quyền ghi Storage: ĐANG BỊ CHẶN (HTTP ${storageTest.status ?? '?'})`}
              </span>
            </div>
            <div style={{ fontWeight: 500, whiteSpace: 'pre-wrap' }}>{storageTest.message}</div>
            {!storageTest.success && (
              <div style={{ marginTop: '0.6rem', fontWeight: 500 }}>
                ➜ Cách sửa: bấm nút <strong>“Xem câu lệnh SQL Supabase”</strong> phía trên, bấm{' '}
                <strong>“Sao chép câu lệnh SQL”</strong>, rồi dán và bấm <strong>Run</strong> trong{' '}
                Supabase → SQL Editor (phần số 5 mở quyền ghi Storage).
              </div>
            )}
            <button
              onClick={() => setStorageTest(null)}
              style={{
                marginTop: '0.7rem',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'inherit',
                fontFamily: 'inherit',
                fontSize: '0.78rem',
                fontWeight: 700,
                textDecoration: 'underline',
                padding: 0
              }}
            >
              Đóng thông báo
            </button>
          </div>
        )}

        {/* Status Notice */}
        {msg && (
          <div
            style={{
              padding: '0.85rem 1.25rem',
              borderRadius: '8px',
              background: '#EFF6FF',
              color: '#1D4ED8',
              fontSize: '0.875rem',
              fontWeight: 600,
              marginBottom: '1rem',
              border: '1px solid #BFDBFE'
            }}
          >
            💡 {msg}
          </div>
        )}

        {/* SQL Guide Box */}
        {showSqlGuide && (
          <div
            style={{
              background: '#0F172A',
              borderRadius: '12px',
              padding: '1.25rem',
              marginBottom: '1.5rem',
              color: '#F8FAFC',
              border: '1.5px solid #334155'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#38BDF8' }}>
                  ⚡ Câu lệnh SQL: Cấp Admin cho toàn bộ hồ sơ hiện có trên Supabase
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px' }}>
                  Chạy trong: <strong>Supabase Dashboard &gt; SQL Editor &gt; New Query &gt; Run</strong>
                </div>
                <a
                  href={SUPABASE_STORAGE_POLICY_URL}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    marginTop: '0.45rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#38BDF8',
                    textDecoration: 'underline'
                  }}
                >
                  <ExternalLink size={13} />
                  Mở trang Storage của dự án (kiểm tra bucket KhoTaiLieuTinHocThiThu)
                </a>
              </div>

              <button
                onClick={handleCopySql}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.45rem 0.9rem',
                  background: '#2563EB',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {copiedSql ? <Check size={14} color="#4ADE80" /> : <Copy size={14} />}
                <span>{copiedSql ? 'Đã sao chép SQL!' : 'Sao chép câu lệnh SQL'}</span>
              </button>
            </div>
            <pre
              style={{
                margin: 0,
                fontSize: '0.78rem',
                lineHeight: 1.55,
                color: '#E2E8F0',
                fontFamily: 'monospace',
                overflowX: 'auto',
                background: '#1E293B',
                padding: '1rem',
                borderRadius: '8px'
              }}
            >
              {sqlSchemaSnippet}
            </pre>
          </div>
        )}

        {/* Công cụ: Đăng thông báo cho toàn bộ học viên */}
        <AdminAnnouncementsPanel />

        {/* Table */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#374151', width: '45px' }}>#</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#374151' }}>Email</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#374151' }}>Họ và tên</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#374151', textAlign: 'center' }}>
                  Phân quyền
                </th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#374151', textAlign: 'center' }}>
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {shown.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '2.5rem 1rem', textAlign: 'center', color: '#9CA3AF' }}>
                    {isLoading
                      ? 'Đang lấy dữ liệu từ Supabase...'
                      : 'Chưa có hồ sơ nào trong bảng profiles. Hãy chạy câu lệnh SQL ở trên để đồng bộ danh sách người dùng từ Supabase auth.'}
                  </td>
                </tr>
              ) : (
                shown.map((r, i) => (
                  <tr
                    key={r.id || r.email || i}
                    style={{
                      borderBottom: '1px solid #F3F4F6',
                      background: r.is_admin ? '#FFFDF8' : '#FFFFFF',
                      transition: 'background 0.15s'
                    }}
                  >
                    <td style={{ padding: '0.85rem 1rem', color: '#6B7280', fontWeight: 500 }}>{i + 1}</td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#111827' }}>
                      <code>{r.email || r.userid || '—'}</code>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#1F2937' }}>
                      {r.username || '—'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                      {r.is_admin ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            background: '#DCFCE7',
                            color: '#166534',
                            padding: '3px 10px',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: 800
                          }}
                        >
                          <CheckCircle size={13} /> Quản trị viên (Admin)
                        </span>
                      ) : (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            background: '#F1F5F9',
                            color: '#64748B',
                            padding: '3px 10px',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: 700
                          }}
                        >
                          Học viên (Phổ thông)
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                      <button
                        onClick={() => handleToggleAdmin(r)}
                        style={{
                          padding: '0.35rem 0.75rem',
                          borderRadius: '6px',
                          border: `1px solid ${r.is_admin ? '#FCA5A5' : '#86EFAC'}`,
                          background: r.is_admin ? '#FEF2F2' : '#F0FDF4',
                          color: r.is_admin ? '#DC2626' : '#16A34A',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {r.is_admin ? 'Gỡ quyền Admin' : 'Cấp quyền Admin'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================ */}
      {/* DEMO MÀN HÌNH LOADING (chỉ Admin mới thấy) */}
      {/* ============================================================ */}
      {isLoadingDemoOpen && (
        <>
          <LoadingScreen text="Demo Loading - MewTinHoc" fullScreen />
          {/* Nút đóng demo nổi ở góc phải trên cùng */}
          <button
            onClick={() => setIsLoadingDemoOpen(false)}
            title="Đóng demo Loading"
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              zIndex: 10000,
              background: 'rgba(15,23,42,0.92)',
              color: '#FFFFFF',
              border: '1.5px solid rgba(251,191,36,0.6)',
              borderRadius: '999px',
              padding: '8px 18px',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 8px 24px -8px rgba(0,0,0,0.45)',
              fontFamily: 'inherit'
            }}
          >
            <X size={15} />
            Đóng demo
          </button>
        </>
      )}
    </div>
  );
}