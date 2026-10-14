import React, { useState, useEffect } from 'react';
import {
  Search,
  FileText,
  Download,
  Eye,
  Database,
  RefreshCw,
  Code2,
  Copy,
  Check,
  X,
  File,
  FileSpreadsheet,
  FileImage,
  FolderOpen,
  HardDrive,
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

// ---- Cấu hình Storage ----
const BUCKET = 'KhoTaiLieuTinHocThiThu';
const FOLDER = 'DeThiThu';
// true  = bucket Public  -> dùng getPublicUrl
// false = bucket Private -> dùng signed URL (tự hết hạn)
const IS_PUBLIC_BUCKET = true;
const SIGNED_URL_TTL = 3600; // giây (chỉ dùng khi bucket private)
// Loại file có thể xem trực tiếp trên trình duyệt
const PREVIEWABLE = ['pdf', 'png', 'jpg', 'jpeg', 'webp', 'gif'];

// Icon and color based on file extension
const getFileIcon = (type) => {
  const t = (type || '').toLowerCase();
  if (t === 'pdf') return { icon: FileText, color: '#DC2626', bg: '#FEE2E2', label: 'PDF' };
  if (t === 'docx' || t === 'doc') return { icon: File, color: '#2563EB', bg: '#DBEAFE', label: 'DOCX' };
  if (t === 'xlsx' || t === 'xls') return { icon: FileSpreadsheet, color: '#16A34A', bg: '#DCFCE7', label: 'XLSX' };
  if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(t)) return { icon: FileImage, color: '#9333EA', bg: '#F3E8FF', label: t.toUpperCase() };
  if (t === 'zip' || t === 'rar') return { icon: FolderOpen, color: '#D97706', bg: '#FEF3C7', label: 'ZIP' };
  return { icon: File, color: '#6B7280', bg: '#F3F4F6', label: t.toUpperCase() || 'FILE' };
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch { return dateStr; }
};

const formatBytes = (bytes) => {
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const extractExt = (filename) => {
  const parts = (filename || '').split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : '';
};

// Tên hiển thị: bỏ đuôi file, đổi - và _ thành khoảng trắng
const prettyName = (filename) =>
  filename.replace(/\.[^/.]+$/, '').replace(/[_]+/g, ' ');

export default function ExamRepoTab() {
  const [docs, setDocs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const [activeFolder, setActiveFolder] = useState(FOLDER);

  // Lấy danh sách file trong bucket/folder (tự động kiểm tra folder con hoặc thư mục gốc)
  const fetchDocs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!supabase) throw new Error('Supabase client chưa được cấu hình.');

      // 1. Thử lấy trong FOLDER ('DeThiThu')
      let targetFolder = FOLDER;
      let { data, error: listError } = await supabase.storage
        .from(BUCKET)
        .list(FOLDER, {
          limit: 200,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (listError) throw listError;

      let files = (data || []).filter(
        (f) => f.id && f.name !== '.emptyFolderPlaceholder'
      );

      // 2. Nếu trong folder không có file, tự động kiểm tra thư mục gốc của bucket
      if (files.length === 0) {
        const rootRes = await supabase.storage
          .from(BUCKET)
          .list('', {
            limit: 200,
            offset: 0,
            sortBy: { column: 'created_at', order: 'desc' }
          });
        
        const rootFiles = (rootRes.data || []).filter(
          (f) => f.id && f.name !== '.emptyFolderPlaceholder'
        );

        if (rootFiles.length > 0) {
          files = rootFiles;
          targetFolder = '';
        }
      }

      setActiveFolder(targetFolder);

      const storage = supabase.storage.from(BUCKET);

      const result = await Promise.all(
        files.map(async (f) => {
          const path = targetFolder ? `${targetFolder}/${f.name}` : f.name;
          let viewUrl = null;
          let downloadUrl = null;

          if (IS_PUBLIC_BUCKET) {
            viewUrl = storage.getPublicUrl(path).data.publicUrl;
            downloadUrl = storage.getPublicUrl(path, { download: f.name }).data.publicUrl;
          } else {
            const [view, dl] = await Promise.all([
              storage.createSignedUrl(path, SIGNED_URL_TTL),
              storage.createSignedUrl(path, SIGNED_URL_TTL, { download: f.name })
            ]);
            viewUrl = view.data?.signedUrl || null;
            downloadUrl = dl.data?.signedUrl || null;
          }

          return {
            id: f.id,
            ten_file: prettyName(f.name),
            file_name: f.name,
            loai_file: extractExt(f.name),
            dung_luong: formatBytes(f.metadata?.size),
            view_url: viewUrl,
            download_url: downloadUrl,
            created_at: f.created_at || f.updated_at || null
          };
        })
      );

      setDocs(result);
    } catch (err) {
      console.warn('Supabase Storage error:', err);
      setError(err.message || 'Không thể kết nối Supabase Storage');
      setDocs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchDocs(); }, []);

  const handleDownload = (doc) => {
    if (doc.download_url) window.open(doc.download_url, '_blank');
  };

  // Filter by search
  const filtered = docs.filter((d) =>
    (d.ten_file || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sqlCode = `-- ====================================================
-- Cho phép đọc (liệt kê + tải) TOÀN BỘ file trong bucket "${BUCKET}"
-- Chạy trong Supabase Dashboard > SQL Editor > New query
-- ====================================================

CREATE POLICY "public_read_${BUCKET.toLowerCase()}"
ON storage.objects
FOR SELECT TO anon, authenticated
USING (bucket_id = '${BUCKET}');

-- Ghi chú:
-- 1) Policy này cho phép hiển thị danh sách file cả trong folder con "${FOLDER}"
--    lẫn ở thư mục gốc của bucket "${BUCKET}".
-- 2) Không cấp quyền INSERT/UPDATE/DELETE cho anon để bảo mật.`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const errorHint = (() => {
    if (!error) return null;
    if (/not found|bucket/i.test(error)) {
      return `Không tìm thấy bucket "${BUCKET}". Kiểm tra lại tên bucket (phân biệt hoa thường).`;
    }
    return error;
  })();

  return (
    <div className="exam-repo-container">

      {/* ── Status bar ── */}
      <div className="doc-status-bar" data-source={error ? 'mock' : 'supabase'}>
        <div className="doc-status-left">
          <Database size={18} />
          <div>
            <div className="doc-status-title">
              {error
                ? '🔴 Không đọc được Supabase Storage'
                : `🟢 Supabase Storage — ${BUCKET}${activeFolder ? '/' + activeFolder : ' (Gốc)'} (${docs.length} tài liệu)`}
            </div>
            {errorHint && <div className="doc-status-error">{errorHint}</div>}
          </div>
        </div>
        <div className="doc-status-actions">
          <button className="doc-btn-secondary" onClick={() => setShowSqlModal(true)}>
            <Code2 size={14} /><span>Policy</span>
          </button>
          <button className="doc-btn-primary" onClick={fetchDocs} disabled={isLoading}>
            <RefreshCw size={14} className={isLoading ? 'spin-icon' : ''} />
            <span>{isLoading ? 'Đang tải...' : 'Làm mới'}</span>
          </button>
        </div>
      </div>

      {/* ── Header + Search ── */}
      <div className="doc-header-section">
        <div>
          <h2 className="doc-page-title">
            <FolderOpen size={24} />
            Kho Tài Liệu Đề Thi Thử
          </h2>
          <p className="doc-page-subtitle">Tải về các đề thi thử, tài liệu ôn tập chuẩn THPTQG mới nhất</p>
        </div>
        <div className="search-input-wrap">
          <Search size={16} />
          <input
            type="text"
            placeholder="Tìm kiếm tài liệu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ── Loading indicator ── */}
      {isLoading && (
        <div className="doc-loading">
          <Loader2 size={28} className="spin-icon" />
          <span>Đang tải danh sách tài liệu...</span>
        </div>
      )}

      {/* ── Documents list ── */}
      {!isLoading && filtered.length > 0 && (
        <div className="doc-list">
          {filtered.map((doc) => {
            const fi = getFileIcon(doc.loai_file);
            const IconComp = fi.icon;
            const canPreview = PREVIEWABLE.includes(doc.loai_file);
            return (
              <div key={doc.id} className="doc-row">
                {/* File type icon */}
                <div className="doc-icon-wrap" style={{ background: fi.bg }}>
                  <IconComp size={22} color={fi.color} />
                </div>

                {/* Info */}
                <div className="doc-info">
                  <div className="doc-filename">{doc.ten_file}</div>
                  <div className="doc-meta">
                    <span className="doc-file-badge" style={{ background: fi.bg, color: fi.color }}>
                      {fi.label}
                    </span>
                    {doc.dung_luong && (
                      <span><HardDrive size={12} /> {doc.dung_luong}</span>
                    )}
                    {doc.created_at && (
                      <span><Clock size={12} /> {formatDate(doc.created_at)}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="doc-actions">
                  {doc.download_url ? (
                    <>
                      {canPreview && doc.view_url && (
                        <a
                          href={doc.view_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="doc-btn-view"
                          title="Xem trước"
                        >
                          <Eye size={16} />
                        </a>
                      )}
                      <button
                        className="doc-btn-download"
                        onClick={() => handleDownload(doc)}
                        title="Tải về"
                      >
                        <Download size={16} />
                        <span>Tải về</span>
                      </button>
                    </>
                  ) : (
                    <span className="doc-no-link">
                      <AlertCircle size={14} />
                      Không tạo được link
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Empty state ── */}
      {!isLoading && filtered.length === 0 && (
        <div className="doc-empty">
          <FolderOpen size={40} strokeWidth={1.5} />
          {docs.length === 0 && !error ? (
            <>
              <p>Chưa có tài liệu nào trong bucket <strong>"{BUCKET}"</strong>.</p>
              <p style={{ fontSize: '0.85rem', maxWidth: '520px', lineHeight: 1.5 }}>
                Nếu bạn đã tải file lên Supabase, nguyên nhân là <strong>chưa có RLS Policy</strong> để cho phép khách đọc file.
              </p>
              <button
                className="doc-btn-primary"
                onClick={() => setShowSqlModal(true)}
                style={{ marginTop: '0.5rem' }}
              >
                <Code2 size={15} />
                <span>Xem & Sao chép mã SQL Policy</span>
              </button>
            </>
          ) : (
            <p>Không tìm thấy tài liệu nào phù hợp.</p>
          )}
        </div>
      )}

      {/* ── Policy modal ── */}
      {showSqlModal && (
        <div className="exam-taker-modal-backdrop" style={{ zIndex: 1100 }}>
          <div className="exam-taker-window" style={{ maxWidth: '720px', maxHeight: '85vh', overflowY: 'auto', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Database size={20} color="var(--color-primary)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-deep)', margin: 0 }}>
                  SQL phân quyền đọc Storage
                </h3>
              </div>
              <button onClick={() => setShowSqlModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
              Mở <strong>Supabase Dashboard → SQL Editor</strong> và chạy đoạn mã bên dưới. Sau đó nhấn <strong>Làm mới</strong> trên giao diện.
            </p>

            <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
              <pre style={{
                background: '#1E293B', color: '#F8FAFC', padding: '1rem', borderRadius: '8px',
                fontSize: '0.78rem', lineHeight: 1.5, overflowX: 'auto', fontFamily: 'Consolas, monospace'
              }}>
                <code>{sqlCode}</code>
              </pre>
              <button onClick={handleCopySql} style={{
                position: 'absolute', top: '10px', right: '10px',
                display: 'flex', alignItems: 'center', gap: '0.35rem',
                background: copiedSql ? '#16A34A' : '#334155', color: '#FFF', border: 'none',
                padding: '0.35rem 0.65rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer'
              }}>
                {copiedSql ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedSql ? 'Đã sao chép!' : 'Sao chép'}</span>
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowSqlModal(false)} style={{
                padding: '0.5rem 1rem', background: 'var(--color-primary)', color: '#FFF',
                border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer'
              }}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
