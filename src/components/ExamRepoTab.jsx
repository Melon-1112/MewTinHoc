import React, { useState, useEffect } from 'react';
import {
  Search,
  FileText,
  Download,
  Eye,
  RefreshCw,
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
  const [activeFolder, setActiveFolder] = useState(FOLDER);

  // Lấy danh sách file trong bucket/folder (tự động kiểm tra folder con hoặc thư mục gốc)
  const fetchDocs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!supabase) throw new Error('Lỗi cấu hình!');

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

  const errorHint = (() => {
    if (!error) return null;
    if (/not found|bucket/i.test(error)) {
      return `Không tìm thấy bucket "${BUCKET}". Kiểm tra lại tên bucket (phân biệt hoa thường).`;
    }
    return error;
  })();

  return (
    <div className="exam-repo-container">

      {/* ── Header + Search + Refresh ── */}
      <div className="doc-header-section">
        <div>
          <h2 className="doc-page-title">
            <FolderOpen size={24} />
            Kho Tài Liệu Đề Thi Thử
          </h2>
          <p className="doc-page-subtitle">
            Tải về các đề thi thử, tài liệu ôn tập chuẩn THPTQG mới nhất
            {!isLoading && docs.length > 0 && (
              <span className="doc-count-badge">{docs.length} tài liệu</span>
            )}
          </p>
        </div>
        <div className="doc-header-actions">
          <div className="search-input-wrap">
            <Search size={16} />
            <input
              type="text"
              placeholder="Tìm kiếm tài liệu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="doc-btn-refresh" onClick={fetchDocs} disabled={isLoading} title="Làm mới danh sách">
            <RefreshCw size={16} className={isLoading ? 'spin-icon' : ''} />
          </button>
        </div>
      </div>

      {/* ── Error banner (chỉ hiện khi có lỗi) ── */}
      {errorHint && (
        <div className="doc-error-banner">
          <AlertCircle size={16} />
          <span>{errorHint}</span>
        </div>
      )}

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
                Nếu bạn đã tải file lên Supabase, hãy kiểm tra <strong>RLS Policy</strong> cho phép đọc file công khai, hoặc nhấn <strong>Làm mới</strong> để thử lại.
              </p>
              <button
                className="doc-btn-primary"
                onClick={fetchDocs}
                style={{ marginTop: '0.5rem' }}
              >
                <RefreshCw size={15} />
                <span>Thử tải lại</span>
              </button>
            </>
          ) : (
            <p>Không tìm thấy tài liệu nào phù hợp.</p>
          )}
        </div>
      )}

    </div>
  );
}
