import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  FolderPlus,
  HardDrive,
  Clock,
  AlertCircle,
  CheckCircle,
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  ShieldCheck,
  CloudUpload,
  ChevronRight
} from 'lucide-react';
import { isCompanyAdmin } from '../lib/roleService';
import {
  EXAM_DOCS_CONFIG,
  MAX_UPLOAD_BYTES,
  ALLOWED_EXTENSIONS,
  listExamDocs,
  uploadExamDocument,
  renameExamDocument,
  deleteExamDocument,
  createExamFolder
} from '../lib/examDocsStorage';

const BUCKET = EXAM_DOCS_CONFIG.bucket;
const FOLDER = EXAM_DOCS_CONFIG.folder;
const MAX_MB = Math.round(MAX_UPLOAD_BYTES / 1024 / 1024);

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

export default function ExamRepoTab({ user }) {
  const [docs, setDocs] = useState([]);
  const [subFolders, setSubFolders] = useState([]);
  const [activeFolder, setActiveFolder] = useState(FOLDER);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // ── Trạng thái dành riêng cho Admin ──
  const isAdmin = isCompanyAdmin(user);
  const [editingId, setEditingId] = useState(null);
  const [draftName, setDraftName] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [notice, setNotice] = useState(null); // { type: 'success' | 'error', msg }
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [folderDraft, setFolderDraft] = useState('');

  const fileInputRef = useRef(null);
  const renameInputRef = useRef(null);
  const noticeTimerRef = useRef(null);

  const showNotice = useCallback((type, msg) => {
    setNotice({ type, msg });
    if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
    noticeTimerRef.current = setTimeout(() => setNotice(null), 5000);
  }, []);

  useEffect(() => () => {
    if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
  }, []);

  /* ---------------------------------------------------------------- */
  /* Tải danh sách tài liệu                                            */
  /* ---------------------------------------------------------------- */
  const fetchDocs = useCallback(async (folderPath = FOLDER) => {
    setIsLoading(true);
    setError(null);
    try {
      let res = await listExamDocs(folderPath);

      if (!res.success) throw new Error(res.error || 'Không thể kết nối Supabase Storage');

      // Nếu thư mục mặc định trống hoàn toàn, kiểm tra thư mục gốc của bucket
      // (giữ nguyên hành vi cũ để vẫn thấy tài liệu khi chưa tạo thư mục con).
      if (folderPath === FOLDER && res.docs.length === 0 && res.folders.length === 0) {
        const rootRes = await listExamDocs('');
        if (rootRes.success && (rootRes.docs.length > 0 || rootRes.folders.length > 0)) {
          res = rootRes;
        }
      }

      setActiveFolder(res.path);
      setSubFolders(res.folders || []);
      setDocs(res.docs || []);

      // Dọn sạch trạng thái soạn thảo dở dang sau mỗi lần tải lại danh sách
      // (đổi thư mục, hoặc vừa upload/đổi tên/xoá xong).
      setEditingId(null);
      setDraftName('');
      setConfirmDeleteId(null);
      setIsCreatingFolder(false);
      setFolderDraft('');
    } catch (err) {
      console.warn('Supabase Storage error:', err);
      setError(err.message || 'Không thể kết nối Supabase Storage');
      setDocs([]);
      setSubFolders([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchDocs(FOLDER); }, [fetchDocs]);

  /* ---------------------------------------------------------------- */
  /* Upload (Admin)                                                    */
  /* ---------------------------------------------------------------- */
  const handleFilesChosen = async (fileList) => {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;

    setIsUploading(true);
    let okCount = 0;
    const failures = [];

    for (let i = 0; i < files.length; i += 1) {
      const f = files[i];
      setUploadProgress(`Đang tải lên ${i + 1}/${files.length}: ${f.name}`);
      // eslint-disable-next-line no-await-in-loop
      const res = await uploadExamDocument(f, activeFolder);
      if (res.success) okCount += 1;
      else failures.push(`${f.name}: ${res.error}`);
    }

    setUploadProgress('');
    setIsUploading(false);

    // Gộp cả 2 kết quả vào MỘT thông báo: nếu gọi showNotice 2 lần thì cái sau
    // sẽ ghi đè cái trước, làm Admin không biết file nào đã lên được.
    const parts = [];
    if (okCount > 0) parts.push(`Đã tải lên ${okCount} tài liệu.`);
    if (failures.length > 0) parts.push(`Lỗi ${failures.length} file → ${failures.join(' | ')}`);

    if (parts.length > 0) {
      showNotice(failures.length > 0 ? 'error' : 'success', parts.join(' '));
    }
    if (okCount > 0) {
      await fetchDocs(activeFolder);
    }
  };

  const onPickFiles = (e) => {
    handleFilesChosen(e.target.files);
    e.target.value = ''; // cho phép chọn lại cùng 1 file
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!isAdmin) return;
    handleFilesChosen(e.dataTransfer?.files);
  };

  /* ---------------------------------------------------------------- */
  /* Rename (Admin) — lưu ngay khi nhấn Enter                          */
  /* ---------------------------------------------------------------- */
  const startRename = (doc) => {
    setConfirmDeleteId(null);
    setEditingId(doc.id);
    setDraftName(doc.ten_file);
    setTimeout(() => renameInputRef.current?.focus(), 30);
  };

  const cancelRename = () => {
    setEditingId(null);
    setDraftName('');
  };

  const commitRename = async (doc) => {
    const next = (draftName || '').trim();
    if (!next || next === doc.ten_file) {
      cancelRename();
      return;
    }

    setBusyId(doc.id);
    const res = await renameExamDocument(doc, next);
    setBusyId(null);

    if (!res.success) {
      showNotice('error', `Đổi tên thất bại: ${res.error}`);
      return; // giữ nguyên ô nhập để Admin sửa lại
    }

    cancelRename();
    showNotice(
      'success',
      `Đã đổi tên thành "${next}${doc.loai_file ? `.${doc.loai_file}` : ''}" và đồng bộ lên Supabase.`
    );
    await fetchDocs(activeFolder);
  };

  const onRenameKeyDown = (e, doc) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitRename(doc);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelRename();
    }
  };

  /* ---------------------------------------------------------------- */
  /* Xoá (Admin) — xác nhận 2 bước                                     */
  /* ---------------------------------------------------------------- */
  const handleDelete = async (doc) => {
    if (confirmDeleteId !== doc.id) {
      setConfirmDeleteId(doc.id);
      setEditingId(null);
      return;
    }

    setBusyId(doc.id);
    const res = await deleteExamDocument(doc);
    setBusyId(null);
    setConfirmDeleteId(null);

    if (!res.success) {
      showNotice('error', `Xoá thất bại: ${res.error}`);
      return;
    }
    showNotice('success', `Đã xoá tài liệu "${doc.ten_file}" khỏi Supabase.`);
    await fetchDocs(activeFolder);
  };

  /* ---------------------------------------------------------------- */
  /* Tạo thư mục con (Admin)                                           */
  /* ---------------------------------------------------------------- */
  const commitNewFolder = async () => {
    const name = (folderDraft || '').trim();
    if (!name) { setIsCreatingFolder(false); setFolderDraft(''); return; }

    const res = await createExamFolder(name);
    setIsCreatingFolder(false);
    setFolderDraft('');

    if (!res.success) {
      showNotice('error', `Tạo thư mục thất bại: ${res.error}`);
      return;
    }
    showNotice('success', `Đã tạo thư mục "${name}" trên Supabase.`);
    await fetchDocs(activeFolder);
  };

  /* ---------------------------------------------------------------- */
  /* Tiện ích                                                          */
  /* ---------------------------------------------------------------- */
  const handleDownload = (doc) => {
    if (doc.download_url) window.open(doc.download_url, '_blank');
  };

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

  const totalBytes = docs.reduce((sum, d) => sum + (d.size || 0), 0);

  return (
    <div
      className={`exam-repo-container${isDragOver ? ' drag-over' : ''}`}
      onDragOver={(e) => { if (isAdmin) { e.preventDefault(); setIsDragOver(true); } }}
      onDragLeave={(e) => {
        // Chỉ tắt highlight khi con trỏ THỰC SỰ rời khỏi container,
        // tránh nhấp nháy khi di chuyển qua các phần tử con bên trong.
        if (!e.currentTarget.contains(e.relatedTarget)) setIsDragOver(false);
      }}
      onDrop={onDrop}
    >

      {/* ── Header + Search + Actions ── */}
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
            {!isLoading && totalBytes > 0 && (
              <span className="doc-count-badge">{formatBytes(totalBytes)}</span>
            )}
            {isAdmin && (
              <span className="doc-admin-badge">
                <ShieldCheck size={12} />
                Chế độ Admin
              </span>
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

          {isAdmin && (
            <>
              <button
                type="button"
                className="doc-btn-add"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                title="Thêm tài liệu mới vào kho (tự tải lên Supabase)"
              >
                {isUploading ? <Loader2 size={16} className="spin-icon" /> : <Plus size={16} />}
                <span>{isUploading ? 'Đang tải lên...' : 'Thêm tài liệu'}</span>
              </button>

              <button
                type="button"
                className="doc-btn-refresh"
                onClick={() => setIsCreatingFolder(true)}
                disabled={isUploading}
                title="Tạo thư mục con trong kho"
              >
                <FolderPlus size={16} />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                hidden
                accept={ALLOWED_EXTENSIONS.map((e) => `.${e}`).join(',')}
                onChange={onPickFiles}
              />
            </>
          )}

          <button
            type="button"
            className="doc-btn-refresh"
            onClick={() => fetchDocs(activeFolder)}
            disabled={isLoading}
            title="Làm mới danh sách"
          >
            <RefreshCw size={16} className={isLoading ? 'spin-icon' : ''} />
          </button>
        </div>
      </div>

      {/* ── Ô nhập tên thư mục mới (Admin) ── */}
      {isAdmin && isCreatingFolder && (
        <div className="doc-inline-form">
          <FolderPlus size={16} />
          <input
            type="text"
            autoFocus
            placeholder="Tên thư mục mới, ví dụ: DeThiGiuaKy"
            value={folderDraft}
            onChange={(e) => setFolderDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitNewFolder();
              if (e.key === 'Escape') { setIsCreatingFolder(false); setFolderDraft(''); }
            }}
          />
          <button type="button" className="doc-btn-save" onClick={commitNewFolder}>
            <Check size={15} /> Tạo thư mục
          </button>
          <button
            type="button"
            className="doc-btn-cancel"
            onClick={() => { setIsCreatingFolder(false); setFolderDraft(''); }}
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* ── Khu vực kéo thả (Admin) ── */}
      {isAdmin && (
        <div
          className="doc-dropzone"
          onClick={() => !isUploading && fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') fileInputRef.current?.click(); }}
        >
          <CloudUpload size={22} />
          <div className="doc-dropzone-text">
            {uploadProgress || 'Kéo & thả file vào đây, hoặc bấm để chọn tài liệu'}
          </div>
          <div className="doc-dropzone-hint">
            Hỗ trợ {ALLOWED_EXTENSIONS.join(', ')} — tối đa {MAX_MB}MB/file. Tài liệu được lưu tại{' '}
            <strong>{BUCKET}/{activeFolder || '(gốc)'}</strong>
          </div>
        </div>
      )}

      {/* ── Thông báo kết quả ── */}
      {notice && (
        <div className={`doc-notice doc-notice-${notice.type}`}>
          {notice.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{notice.msg}</span>
          <button type="button" className="doc-notice-close" onClick={() => setNotice(null)}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── Error banner ── */}
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

      {/* ── Đường dẫn thư mục (bấm để quay về thư mục gốc) ── */}
      {!isLoading && activeFolder !== FOLDER && (
        <div className="doc-breadcrumb">
          <button type="button" onClick={() => fetchDocs(FOLDER)}>
            {FOLDER}
          </button>
          <ChevronRight size={14} />
          <span className="doc-breadcrumb-current">
            {activeFolder.startsWith(`${FOLDER}/`)
              ? activeFolder.slice(FOLDER.length + 1)
              : activeFolder || '(gốc)'}
          </span>
        </div>
      )}

      {/* ── Thư mục con ── */}
      {!isLoading && subFolders.length > 0 && (
        <div className="doc-folder-row">
          {subFolders.map((f) => (
            <button
              key={f.path}
              type="button"
              className="doc-folder-chip"
              onClick={() => fetchDocs(f.path)}
            >
              <FolderOpen size={15} />
              {f.name}
            </button>
          ))}
        </div>
      )}

      {/* ── Documents list ── */}
      {!isLoading && filtered.length > 0 && (
        <div className="doc-list">
          {filtered.map((doc) => {
            const fi = getFileIcon(doc.loai_file);
            const IconComp = fi.icon;
            const canPreview = PREVIEWABLE.includes(doc.loai_file);
            const isEditing = editingId === doc.id;
            const isBusy = busyId === doc.id;
            const isConfirmingDelete = confirmDeleteId === doc.id;

            return (
              <div key={doc.id} className={`doc-row${isEditing ? ' editing' : ''}`}>
                {/* File type icon */}
                <div className="doc-icon-wrap" style={{ background: fi.bg }}>
                  <IconComp size={22} color={fi.color} />
                </div>

                {/* Info */}
                <div className="doc-info">
                  {isEditing ? (
                    <div className="doc-rename-row">
                      <input
                        ref={renameInputRef}
                        type="text"
                        className="doc-rename-input"
                        value={draftName}
                        onChange={(e) => setDraftName(e.target.value)}
                        onKeyDown={(e) => onRenameKeyDown(e, doc)}
                        placeholder="Nhập tên tài liệu mới..."
                      />
                      <span className="doc-rename-ext">.{doc.loai_file}</span>
                      <span className="doc-rename-hint">Nhấn Enter để lưu</span>
                    </div>
                  ) : (
                    <div className="doc-filename">{doc.ten_file}</div>
                  )}

                  <div className="doc-meta">
                    <span className="doc-file-badge" style={{ background: fi.bg, color: fi.color }}>
                      {fi.label}
                    </span>
                    {doc.size != null && (
                      <span><HardDrive size={12} /> {formatBytes(doc.size)}</span>
                    )}
                    {doc.created_at && (
                      <span><Clock size={12} /> {formatDate(doc.created_at)}</span>
                    )}
                    {isAdmin && !isEditing && (
                      <span className="doc-path-hint">{doc.storage_path}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="doc-actions">
                  {/* ── Chế độ đang đổi tên ── */}
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        className="doc-btn-save"
                        onClick={() => commitRename(doc)}
                        disabled={isBusy}
                        title="Lưu tên mới (Enter)"
                      >
                        {isBusy ? <Loader2 size={15} className="spin-icon" /> : <Check size={15} />}
                        <span>Lưu</span>
                      </button>
                      <button
                        type="button"
                        className="doc-btn-cancel"
                        onClick={cancelRename}
                        disabled={isBusy}
                        title="Huỷ (Esc)"
                      >
                        <X size={15} />
                      </button>
                    </>
                  ) : (
                    <>
                      {/* ── Xác nhận xoá ── */}
                      {isConfirmingDelete ? (
                        <>
                          <span className="doc-delete-confirm">Xoá tài liệu này?</span>
                          <button
                            type="button"
                            className="doc-btn-danger"
                            onClick={() => handleDelete(doc)}
                            disabled={isBusy}
                          >
                            {isBusy ? <Loader2 size={15} className="spin-icon" /> : <Check size={15} />}
                            <span>Xoá</span>
                          </button>
                          <button
                            type="button"
                            className="doc-btn-cancel"
                            onClick={() => setConfirmDeleteId(null)}
                            disabled={isBusy}
                          >
                            <X size={15} />
                          </button>
                        </>
                      ) : (
                        <>
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
                                type="button"
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

                          {/* ── Công cụ Admin ── */}
                          {isAdmin && (
                            <>
                              <button
                                type="button"
                                className="doc-btn-icon"
                                onClick={() => startRename(doc)}
                                title="Đổi tên tài liệu"
                              >
                                <Pencil size={15} />
                              </button>
                              <button
                                type="button"
                                className="doc-btn-icon doc-btn-icon-danger"
                                onClick={() => handleDelete(doc)}
                                title="Xoá tài liệu"
                              >
                                <Trash2 size={15} />
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </>
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
              <p>Chưa có tài liệu nào trong thư mục <strong>"{activeFolder || BUCKET}"</strong>.</p>
              {isAdmin ? (
                <>
                  <p style={{ fontSize: '0.85rem', maxWidth: '520px', lineHeight: 1.5 }}>
                    Bạn là Admin — bấm nút <strong>Thêm tài liệu</strong> ở trên (hoặc kéo thả file vào khung)
                    để tải tài liệu đầu tiên lên Supabase.
                  </p>
                  <button
                    type="button"
                    className="doc-btn-primary"
                    onClick={() => fileInputRef.current?.click()}
                    style={{ marginTop: '0.5rem' }}
                    disabled={isUploading}
                  >
                    <Plus size={15} />
                    <span>Thêm tài liệu</span>
                  </button>
                </>
              ) : (
                <p style={{ fontSize: '0.85rem', maxWidth: '520px', lineHeight: 1.5 }}>
                  Nếu bạn đã tải file lên Supabase, hãy kiểm tra <strong>RLS Policy</strong> cho phép đọc file
                  công khai, hoặc nhấn <strong>Làm mới</strong> để thử lại.
                </p>
              )}
            </>
          ) : (
            <p>Không tìm thấy tài liệu nào phù hợp.</p>
          )}
        </div>
      )}

    </div>
  );
}
