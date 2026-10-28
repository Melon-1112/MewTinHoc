import React, { useCallback, useEffect, useState } from 'react';
import { Megaphone, Send, Trash2, Eye, EyeOff, Copy, Check, Loader2, Star } from 'lucide-react';
import {
  ANNOUNCEMENT_TYPES,
  ANNOUNCEMENT_LIMITS,
  ANNOUNCEMENTS_SQL,
  fetchAllAnnouncements,
  createAnnouncement,
  setAnnouncementActive,
  deleteAnnouncement
} from '../lib/announcementService.js';

const cardStyle = {
  background: '#FFFFFF',
  border: '1px solid #E5E7EB',
  borderRadius: '12px',
  padding: '1.25rem',
  marginBottom: '1.5rem',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
};

const inputStyle = {
  width: '100%',
  padding: '0.6rem 0.75rem',
  border: '1.5px solid #D1D5DB',
  borderRadius: '8px',
  fontSize: '0.875rem',
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box'
};

const labelStyle = { display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: '0.3rem' };

const smallBtn = (color, bg, border) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.3rem',
  padding: '0.3rem 0.65rem',
  borderRadius: '6px',
  border: `1px solid ${border}`,
  background: bg,
  color,
  fontSize: '0.74rem',
  fontWeight: 700,
  cursor: 'pointer'
});

export default function AdminAnnouncementsPanel() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [missingTable, setMissingTable] = useState(false);
  const [feedback, setFeedback] = useState(null); // { ok: boolean, text: string }
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('info');
  const [isImportant, setIsImportant] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetchAllAnnouncements();
    setRows(res.rows);
    setMissingTable(res.missingTable);
    if (res.error) setFeedback({ ok: false, text: res.error });
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);
    const res = await createAnnouncement({ title, message, type, isImportant });
    setSubmitting(false);
    if (!res.success) {
      setFeedback({ ok: false, text: res.error });
      return;
    }
    setRows((prev) => [res.data, ...prev]);
    setTitle('');
    setMessage('');
    setType('info');
    setIsImportant(false);
    setFeedback({ ok: true, text: 'Đã đăng thông báo. Mọi người truy cập web sẽ thấy ngay.' });
  };

  const handleToggle = async (row) => {
    const next = !row.is_active;
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, is_active: next } : r)));
    const res = await setAnnouncementActive(row.id, next);
    if (!res.success) {
      setFeedback({ ok: false, text: res.error });
      load();
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Xoá vĩnh viễn thông báo "${row.title}"?`)) return;
    const res = await deleteAnnouncement(row.id);
    if (!res.success) {
      setFeedback({ ok: false, text: res.error });
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== row.id));
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(ANNOUNCEMENTS_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #C2410C, #EA580C)',
            color: '#FFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Megaphone size={20} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827', margin: 0 }}>Thông báo cho học viên</h2>
          <p style={{ fontSize: '0.78rem', color: '#6B7280', margin: '2px 0 0 0' }}>
            Hiển thị cho mọi người truy cập web. Học viên tick &ldquo;Không hiển thị lại&rdquo; thì thông báo đó sẽ không hiện nữa trên trình duyệt của họ.
          </p>
        </div>
      </div>

      {feedback && (
        <div
          role="status"
          style={{
            padding: '0.65rem 0.9rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '0.82rem',
            fontWeight: 600,
            background: feedback.ok ? '#F0FDF4' : '#FEF2F2',
            border: `1px solid ${feedback.ok ? '#BBF7D0' : '#FECACA'}`,
            color: feedback.ok ? '#166534' : '#991B1B'
          }}
        >
          {feedback.text}
        </div>
      )}

      {missingTable && (
        <div style={{ background: '#0F172A', borderRadius: '10px', padding: '1rem', marginBottom: '1rem', color: '#F8FAFC' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#38BDF8' }}>
              Chạy SQL này trong Supabase → SQL Editor để tạo bảng thông báo
            </span>
            <button type="button" onClick={handleCopySql} style={smallBtn('#FFFFFF', '#2563EB', '#2563EB')}>
              {copied ? <Check size={13} color="#4ADE80" /> : <Copy size={13} />}
              {copied ? 'Đã sao chép' : 'Sao chép SQL'}
            </button>
          </div>
          <pre style={{ margin: 0, fontSize: '0.74rem', lineHeight: 1.5, color: '#E2E8F0', background: '#1E293B', padding: '0.85rem', borderRadius: '8px', overflowX: 'auto', fontFamily: 'monospace' }}>
            {ANNOUNCEMENTS_SQL}
          </pre>
          <button type="button" onClick={load} style={{ ...smallBtn('#E2E8F0', 'transparent', '#475569'), marginTop: '0.6rem' }}>
            Đã chạy xong, tải lại
          </button>
        </div>
      )}

      {!missingTable && (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.85rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
            <div style={{ gridColumn: 'span 2', minWidth: 0 }}>
              <label htmlFor="ann-title" style={labelStyle}>
                Tiêu đề ({title.length}/{ANNOUNCEMENT_LIMITS.title})
              </label>
              <input
                id="ann-title"
                type="text"
                required
                maxLength={ANNOUNCEMENT_LIMITS.title}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Cập nhật đề thi mới"
                style={inputStyle}
              />
            </div>
            <div style={{ minWidth: 0 }}>
              <label htmlFor="ann-type" style={labelStyle}>Loại thông báo</label>
              <select id="ann-type" value={type} onChange={(e) => setType(e.target.value)} style={inputStyle}>
                {Object.entries(ANNOUNCEMENT_TYPES).map(([key, v]) => (
                  <option key={key} value={key}>{v.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="ann-message" style={labelStyle}>
              Nội dung ({message.length}/{ANNOUNCEMENT_LIMITS.message})
            </label>
            <textarea
              id="ann-message"
              required
              rows={3}
              maxLength={ANNOUNCEMENT_LIMITS.message}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nội dung ngắn gọn gửi tới học viên..."
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <label
            htmlFor="ann-important"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.6rem',
              padding: '0.7rem 0.85rem',
              borderRadius: '10px',
              cursor: 'pointer',
              background: isImportant ? 'linear-gradient(135deg, #FEF2F2, #FFF1F2)' : '#F9FAFB',
              border: `1.5px solid ${isImportant ? '#FCA5A5' : '#E5E7EB'}`,
              transition: 'all 0.18s ease'
            }}
          >
            <input
              id="ann-important"
              type="checkbox"
              checked={isImportant}
              onChange={(e) => setIsImportant(e.target.checked)}
              style={{ width: 18, height: 18, marginTop: 2, accentColor: '#DC2626', flexShrink: 0, cursor: 'pointer' }}
            />
            <span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', fontWeight: 800, color: isImportant ? '#B91C1C' : '#374151' }}>
                <Star size={14} fill={isImportant ? '#DC2626' : 'none'} />
                Tag QUAN TRỌNG
              </span>
              <span style={{ display: 'block', fontSize: '0.76rem', color: '#6B7280', marginTop: '2px' }}>
                Thông báo hiện ở chính giữa màn hình và làm mờ nền phía sau để học viên không bỏ lỡ.
              </span>
            </span>
          </label>

          <div>
            <button
              type="submit"
              disabled={submitting || !title.trim() || !message.trim()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.6rem 1.1rem',
                background: '#EA580C',
                color: '#FFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 700,
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting || !title.trim() || !message.trim() ? 0.6 : 1
              }}
            >
              {submitting ? <Loader2 size={15} className="spin-icon" /> : <Send size={15} />}
              {submitting ? 'Đang đăng...' : 'Đăng thông báo'}
            </button>
          </div>
        </form>
      )}

      {!missingTable && (
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#374151', marginBottom: '0.5rem' }}>
            Thông báo đã đăng ({rows.length})
          </div>
          {rows.length === 0 ? (
            <div style={{ padding: '1.25rem', textAlign: 'center', color: '#9CA3AF', fontSize: '0.85rem', border: '1px dashed #E5E7EB', borderRadius: '8px' }}>
              {loading ? 'Đang tải...' : 'Chưa có thông báo nào.'}
            </div>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: '0.5rem' }}>
              {rows.map((r) => (
                <li
                  key={r.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    flexWrap: 'wrap',
                    padding: '0.65rem 0.85rem',
                    border: '1px solid #F3F4F6',
                    borderRadius: '8px',
                    background: r.is_active ? '#FFFDF8' : '#F9FAFB',
                    opacity: r.is_active ? 1 : 0.7
                  }}
                >
                  <div style={{ minWidth: 0, flex: '1 1 260px' }}>
                    <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#111827', overflowWrap: 'anywhere' }}>
                      {r.title}
                      <span style={{ marginLeft: '0.5rem', fontSize: '0.68rem', fontWeight: 700, color: '#9A3412', background: '#FFEDD5', padding: '2px 8px', borderRadius: '999px' }}>
                        {ANNOUNCEMENT_TYPES[r.type]?.label || 'Thông tin'}
                      </span>
                      {r.is_important && (
                        <span style={{ marginLeft: '0.35rem', display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.68rem', fontWeight: 800, color: '#FFFFFF', background: 'linear-gradient(135deg, #B91C1C, #DC2626)', padding: '2px 8px', borderRadius: '999px' }}>
                          <Star size={10} fill="#FFFFFF" /> QUAN TRỌNG
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#6B7280', marginTop: '2px', overflowWrap: 'anywhere' }}>
                      {r.message.length > 120 ? `${r.message.slice(0, 120)}…` : r.message}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#9CA3AF', marginTop: '2px' }}>
                      {new Date(r.created_at).toLocaleString('vi-VN')}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button type="button" onClick={() => handleToggle(r)} style={smallBtn('#374151', '#FFFFFF', '#D1D5DB')}>
                      {r.is_active ? <EyeOff size={13} /> : <Eye size={13} />}
                      {r.is_active ? 'Tắt' : 'Bật lại'}
                    </button>
                    <button type="button" onClick={() => handleDelete(r)} style={smallBtn('#DC2626', '#FEF2F2', '#FCA5A5')}>
                      <Trash2 size={13} />
                      Xoá
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
