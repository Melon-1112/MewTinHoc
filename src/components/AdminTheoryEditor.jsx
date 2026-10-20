import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Save,
  X,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  Code,
  HelpCircle,
  Target,
  Lightbulb
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Helpers: chuyển đổi giữa dữ liệu bài học và bản nháp đang chỉnh sửa  */
/* ------------------------------------------------------------------ */

// Mảng chuỗi -> văn bản nhiều dòng (mỗi dòng 1 phần tử)
const toLines = (arr) => (Array.isArray(arr) ? arr.join('\n') : '');

// Văn bản nhiều dòng -> mảng chuỗi (bỏ dòng trống, giữ nguyên nội dung)
const fromLines = (str) =>
  (str || '')
    .split('\n')
    .map((s) => s.replace(/\s+$/, ''))
    .filter((s) => s.trim() !== '');

export function buildLessonDraft(lesson) {
  const theory = lesson?.theory || {};
  const quiz = lesson?.quiz || null;

  return {
    title: lesson?.title || '',
    bookRef: lesson?.bookRef || '',
    examFormat: lesson?.examFormat || '',
    summary: lesson?.summary || '',
    objectives: Array.isArray(theory.objectives) ? [...theory.objectives] : [],
    contentSections: Array.isArray(theory.contentSections)
      ? theory.contentSections.map((s) => ({
          heading: s?.heading || '',
          text: s?.text || '',
          bulletPoints: Array.isArray(s?.bulletPoints) ? [...s.bulletPoints] : []
        }))
      : [],
    examTips: theory.examTips || '',
    codeSnippet: theory.codeSnippet
      ? { title: theory.codeSnippet.title || '', code: theory.codeSnippet.code || '' }
      : null,
    quiz: quiz
      ? {
          question: quiz.question || '',
          options: Array.isArray(quiz.options)
            ? [...quiz.options, '', '', '', ''].slice(0, Math.max(4, quiz.options.length))
            : ['', '', '', ''],
          answer: typeof quiz.answer === 'number' ? quiz.answer : 0,
          explanation: quiz.explanation || ''
        }
      : null
  };
}

export function applyDraftToLesson(draft, original) {
  const baseTheory = original?.theory || {};

  const theory = {
    ...baseTheory,
    objectives: draft.objectives.map((o) => o.trim()).filter(Boolean),
    contentSections: draft.contentSections
      .map((s) => ({
        heading: (s.heading || '').trim(),
        text: (s.text || '').trim(),
        bulletPoints: (s.bulletPoints || []).map((b) => b.trim()).filter(Boolean)
      }))
      .filter((s) => s.heading || s.text || s.bulletPoints.length > 0),
    examTips: (draft.examTips || '').trim()
  };

  // Chỉ ghi codeSnippet khi Admin có nhập nội dung -> tránh tạo field rỗng
  if (draft.codeSnippet && (draft.codeSnippet.code.trim() || draft.codeSnippet.title.trim())) {
    theory.codeSnippet = {
      title: draft.codeSnippet.title.trim() || 'Mã nguồn / Công thức minh họa',
      code: draft.codeSnippet.code
    };
  } else {
    delete theory.codeSnippet;
  }

  const updated = {
    ...(original || {}),
    title: draft.title.trim() || original?.title || '',
    bookRef: draft.bookRef.trim(),
    examFormat: draft.examFormat.trim(),
    summary: draft.summary.trim(),
    theory
  };

  if (draft.quiz && (draft.quiz.question.trim() || draft.quiz.options.some((o) => o.trim()))) {
    updated.quiz = {
      question: draft.quiz.question.trim(),
      options: draft.quiz.options.map((o) => o.trim()).filter(Boolean),
      answer: Math.max(0, Math.min(draft.quiz.answer, draft.quiz.options.filter((o) => o.trim()).length - 1)),
      explanation: draft.quiz.explanation.trim()
    };
  } else {
    delete updated.quiz;
  }

  return updated;
}

/* ------------------------------- Styles ------------------------------- */

const labelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
  fontSize: '0.78rem',
  fontWeight: 800,
  color: '#334155',
  textTransform: 'uppercase',
  letterSpacing: '0.02em',
  marginBottom: '0.4rem'
};

const inputStyle = {
  width: '100%',
  padding: '0.65rem 0.85rem',
  borderRadius: '8px',
  border: '1.5px solid #CBD5E1',
  fontSize: '0.95rem',
  color: '#0F172A',
  background: '#FFFFFF',
  outline: 'none',
  fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
  lineHeight: 1.65,
  whiteSpace: 'pre-wrap'  // Giữ nguyên xuống dòng + các khoảng trắng đặc biệt WYSIWYG
};

// Style riêng cho textarea — KHÔNG dùng font monospace, KHÔNG xuống dòng tự động
// nhằm đảm bảo những gì Admin gõ ($ * # ...) sẽ hiển thị y hệt ngoài giao diện học viên.
const textareaStyle = {
  ...inputStyle,
  resize: 'vertical',
  minHeight: '60px',
  wordBreak: 'break-word',
  overflowWrap: 'anywhere'
};

const codeEditorTextareaStyle = {
  ...inputStyle,
  fontFamily:
    "'JetBrains Mono', 'Fira Code', Consolas, 'Courier New', monospace",
  fontSize: '0.88rem',
  lineHeight: 1.6,
  whiteSpace: 'pre'
};

const boxStyle = {
  background: '#FFFFFF',
  border: '1.5px solid #E2E8F0',
  borderRadius: '12px',
  padding: '1rem 1.15rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.8rem'
};

const hintStyle = { fontSize: '0.72rem', color: '#94A3B8', marginTop: '0.3rem', fontStyle: 'italic' };

/* ----------------------------- Component ----------------------------- */

export default function AdminTheoryEditor({ lesson, isSaving, status, onSave, onCancel }) {
  const [draft, setDraft] = useState(() => buildLessonDraft(lesson));

  const patch = (partial) => setDraft((d) => ({ ...d, ...partial }));

  const updateSection = (idx, field, value) =>
    setDraft((d) => ({
      ...d,
      contentSections: d.contentSections.map((s, i) => (i === idx ? { ...s, [field]: value } : s))
    }));

  const addSection = () =>
    setDraft((d) => ({
      ...d,
      contentSections: [...d.contentSections, { heading: '', text: '', bulletPoints: [] }]
    }));

  const removeSection = (idx) =>
    setDraft((d) => ({ ...d, contentSections: d.contentSections.filter((_, i) => i !== idx) }));

  const updateQuizOption = (idx, value) =>
    setDraft((d) => ({
      ...d,
      quiz: { ...d.quiz, options: d.quiz.options.map((o, i) => (i === idx ? value : o)) }
    }));

  const handleSave = () => onSave(applyDraftToLesson(draft, lesson));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', paddingBottom: '0.5rem' }}>
      {/* Thanh trạng thái của trình soạn thảo */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          flexWrap: 'wrap',
          padding: '0.85rem 1.15rem',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #1E293B, #0F172A)',
          color: '#F8FAFC'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #F97316, #EA580C)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <BookOpen size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>Chế độ chỉnh sửa lý thuyết (Admin)</div>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
              Admin gõ <strong style={{ color: '#FDBA74' }}>gì</strong> thì sau khi Lưu sẽ hiển thị{' '}
              <strong style={{ color: '#FDBA74' }}>y như vậy</strong> cho học viên — không escape, không tự ý thay đổi ký tự <code style={{ color: '#FDBA74' }}>$ * # _</code>...
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.6rem 1.1rem',
            borderRadius: '9px',
            border: 'none',
            background: isSaving ? '#64748B' : 'linear-gradient(135deg, #22C55E, #16A34A)',
            color: '#FFFFFF',
            fontSize: '0.85rem',
            fontWeight: 800,
            cursor: isSaving ? 'not-allowed' : 'pointer',
            boxShadow: '0 6px 16px -6px rgba(34,197,94,0.7)'
          }}
        >
          <Save size={16} />
          <span>{isSaving ? 'Đang đồng bộ...' : 'Lưu & Đồng bộ Supabase'}</span>
        </button>
      </div>

      {/* Thông báo kết quả lưu */}
      {status?.msg && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            fontSize: '0.86rem',
            fontWeight: 700,
            background: status.type === 'success' ? '#F0FDF4' : '#FEF2F2',
            border: `1.5px solid ${status.type === 'success' ? '#BBF7D0' : '#FECACA'}`,
            color: status.type === 'success' ? '#166534' : '#991B1B'
          }}
        >
          {status.type === 'success' ? <CheckCircle size={17} /> : <AlertTriangle size={17} />}
          <span>{status.msg}</span>
        </div>
      )}

      {/* 1. Thông tin chung của bài */}
      <div style={boxStyle}>
        <div style={labelStyle}>
          <BookOpen size={14} /> Thông tin chung
        </div>

        <div>
          <label style={{ ...labelStyle, color: '#64748B' }}>Tiêu đề bài học</label>
          <input
            type="text"
            style={inputStyle}
            value={draft.title}
            onChange={(e) => patch({ title: e.target.value })}
            placeholder="VD: Bài 12: Thuật toán tìm kiếm Tuyến tính & Nhị phân"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.8rem' }}>
          <div>
            <label style={{ ...labelStyle, color: '#64748B' }}>Nguồn SGK (bookRef)</label>
            <input
              type="text"
              style={inputStyle}
              value={draft.bookRef}
              onChange={(e) => patch({ bookRef: e.target.value })}
              placeholder="SGK KNTT Tin 11 CS - Trang 90"
            />
          </div>
          <div>
            <label style={{ ...labelStyle, color: '#64748B' }}>Dạng câu hỏi (examFormat)</label>
            <input
              type="text"
              style={inputStyle}
              value={draft.examFormat}
              onChange={(e) => patch({ examFormat: e.target.value })}
              placeholder="Trắc nghiệm Phần I & II"
            />
          </div>
        </div>

        <div>
          <label style={{ ...labelStyle, color: '#64748B' }}>Tóm tắt bài học</label>
          <textarea
            rows={3}
            style={textareaStyle}
            value={draft.summary}
            onChange={(e) => patch({ summary: e.target.value })}
            placeholder="Tóm tắt ngắn gọn nội dung trọng tâm của bài..."
          />
        </div>
      </div>

      {/* 2. Mục tiêu cốt lõi */}
      <div style={boxStyle}>
        <div style={labelStyle}>
          <Target size={14} /> Mục tiêu cốt lõi cần nắm vững
        </div>
        <textarea
          rows={4}
          style={textareaStyle}
          value={toLines(draft.objectives)}
          onChange={(e) => patch({ objectives: fromLines(e.target.value) })}
          placeholder={'Hiểu bản chất thuật toán tìm kiếm tuyến tính...\nĐọc hiểu đoạn mã Python cài đặt tìm kiếm nhị phân...'}
        />
        <div style={hintStyle}>Mỗi dòng là một mục tiêu. Dòng trống sẽ tự động được bỏ qua.</div>
      </div>

      {/* 3. Nội dung lý thuyết chi tiết */}
      <div style={boxStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ ...labelStyle, marginBottom: 0 }}>
            <BookOpen size={14} /> Nội dung lý thuyết chi tiết ({draft.contentSections.length} phần)
          </div>
          <button
            onClick={addSection}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.42rem 0.8rem',
              borderRadius: '8px',
              border: '1.5px solid #FDBA74',
              background: '#FFF7ED',
              color: '#C2410C',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            <Plus size={14} /> Thêm phần lý thuyết
          </button>
        </div>

        {draft.contentSections.length === 0 && (
          <div
            style={{
              padding: '1.5rem 1rem',
              textAlign: 'center',
              borderRadius: '10px',
              border: '1.5px dashed #CBD5E1',
              background: '#F8FAFC',
              color: '#64748B',
              fontSize: '0.86rem'
            }}
          >
            Bài học này chưa có phần lý thuyết chi tiết. Bấm <strong>Thêm phần lý thuyết</strong> để bắt đầu soạn nội dung.
          </div>
        )}

        {draft.contentSections.map((sec, idx) => (
          <div
            key={idx}
            style={{ border: '1.5px solid #E2E8F0', borderRadius: '10px', padding: '0.9rem 1rem', background: '#FCFDFF', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0EA5E9' }}>PHẦN {idx + 1}</span>
              <button
                onClick={() => removeSection(idx)}
                title="Xoá phần lý thuyết này"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '0.3rem 0.6rem',
                  borderRadius: '7px',
                  border: '1.5px solid #FCA5A5',
                  background: '#FEF2F2',
                  color: '#DC2626',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                <Trash2 size={13} /> Xoá
              </button>
            </div>

            <input
              type="text"
              style={inputStyle}
              value={sec.heading}
              onChange={(e) => updateSection(idx, 'heading', e.target.value)}
              placeholder="Tiêu đề phần (VD: 1. Khái niệm tìm kiếm nhị phân)"
            />

            <textarea
              rows={4}
              style={textareaStyle}
              value={sec.text}
              onChange={(e) => updateSection(idx, 'text', e.target.value)}
              placeholder="Đoạn văn giải thích lý thuyết..."
            />

            <textarea
              rows={3}
              style={textareaStyle}
              value={toLines(sec.bulletPoints)}
              onChange={(e) => updateSection(idx, 'bulletPoints', fromLines(e.target.value))}
              placeholder={'Gạch đầu dòng 1\nGạch đầu dòng 2'}
            />
            <div style={hintStyle}>Mỗi dòng là một gạch đầu dòng.</div>
          </div>
        ))}
      </div>

      {/* 4. Cạm bẫy đề thi */}
      <div style={boxStyle}>
        <div style={labelStyle}>
          <Lightbulb size={14} /> Cạm bẫy đề thi &amp; Mẹo làm bài (examTips)
        </div>
        <textarea
          rows={3}
          style={textareaStyle}
          value={draft.examTips}
          onChange={(e) => patch({ examTips: e.target.value })}
          placeholder="⚠️ Bẫy đề: Không thể áp dụng tìm kiếm nhị phân cho danh sách chưa sắp xếp..."
        />
      </div>

      {/* 5. Code minh hoạ */}
      <div style={boxStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ ...labelStyle, marginBottom: 0 }}>
            <Code size={14} /> Mã nguồn / Công thức minh hoạ
          </div>
          <button
            onClick={() =>
              patch(
                draft.codeSnippet ? { codeSnippet: null } : { codeSnippet: { title: '', code: '' } }
              )
            }
            style={{
              padding: '0.38rem 0.75rem',
              borderRadius: '8px',
              border: `1.5px solid ${draft.codeSnippet ? '#FCA5A5' : '#86EFAC'}`,
              background: draft.codeSnippet ? '#FEF2F2' : '#F0FDF4',
              color: draft.codeSnippet ? '#DC2626' : '#16A34A',
              fontSize: '0.76rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            {draft.codeSnippet ? 'Xoá khối code' : '+ Thêm khối code'}
          </button>
        </div>

        {draft.codeSnippet && (
          <>
            <input
              type="text"
              style={inputStyle}
              value={draft.codeSnippet.title}
              onChange={(e) => patch({ codeSnippet: { ...draft.codeSnippet, title: e.target.value } })}
              placeholder="Tiêu đề khối code (VD: Cài đặt tìm kiếm nhị phân bằng Python)"
            />
            <textarea
              rows={7}
              style={codeEditorTextareaStyle}
              value={draft.codeSnippet.code}
              onChange={(e) => patch({ codeSnippet: { ...draft.codeSnippet, code: e.target.value } })}
              placeholder={'def binary_search(a, x):\n    lo, hi = 0, len(a) - 1\n    ...'}
            />
          </>
        )}
      </div>

      {/* 6. Câu hỏi phản xạ */}
      <div style={boxStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ ...labelStyle, marginBottom: 0 }}>
            <HelpCircle size={14} /> Câu hỏi phản xạ nhanh (quiz)
          </div>
          <button
            onClick={() => patch({ quiz: draft.quiz ? null : { question: '', options: ['', '', '', ''], answer: 0, explanation: '' } })}
            style={{
              padding: '0.38rem 0.75rem',
              borderRadius: '8px',
              border: `1.5px solid ${draft.quiz ? '#FCA5A5' : '#86EFAC'}`,
              background: draft.quiz ? '#FEF2F2' : '#F0FDF4',
              color: draft.quiz ? '#DC2626' : '#16A34A',
              fontSize: '0.76rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            {draft.quiz ? 'Xoá câu hỏi' : '+ Thêm câu hỏi'}
          </button>
        </div>

        {draft.quiz && (
          <>
            <textarea
              rows={2}
              style={textareaStyle}
              value={draft.quiz.question}
              onChange={(e) => patch({ quiz: { ...draft.quiz, question: e.target.value } })}
              placeholder="Nội dung câu hỏi trắc nghiệm..."
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {draft.quiz.options.map((opt, oIdx) => (
                <div key={oIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    onClick={() => patch({ quiz: { ...draft.quiz, answer: oIdx } })}
                    title="Chọn làm đáp án đúng"
                    style={{
                      width: '30px',
                      height: '30px',
                      flexShrink: 0,
                      borderRadius: '50%',
                      border: '1.5px solid',
                      borderColor: draft.quiz.answer === oIdx ? '#16A34A' : '#CBD5E1',
                      background: draft.quiz.answer === oIdx ? '#22C55E' : '#FFFFFF',
                      color: draft.quiz.answer === oIdx ? '#FFFFFF' : '#64748B',
                      fontWeight: 900,
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    {String.fromCharCode(65 + oIdx)}
                  </button>
                  <input
                    type="text"
                    style={inputStyle}
                    value={opt}
                    onChange={(e) => updateQuizOption(oIdx, e.target.value)}
                    placeholder={`Nội dung đáp án ${String.fromCharCode(65 + oIdx)}`}
                  />
                  {draft.quiz.options.length > 2 && (
                    <button
                      onClick={() =>
                        patch({
                          quiz: {
                            ...draft.quiz,
                            options: draft.quiz.options.filter((_, i) => i !== oIdx),
                            answer: draft.quiz.answer >= oIdx ? Math.max(0, draft.quiz.answer - 1) : draft.quiz.answer
                          }
                        })
                      }
                      title="Xoá đáp án này"
                      style={{
                        padding: '0.45rem',
                        borderRadius: '7px',
                        border: '1.5px solid #FCA5A5',
                        background: '#FEF2F2',
                        color: '#DC2626',
                        cursor: 'pointer',
                        display: 'flex',
                        flexShrink: 0
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              ))}

              <button
                onClick={() =>
                  patch({ quiz: { ...draft.quiz, options: [...draft.quiz.options, ''] } })
                }
                style={{
                  alignSelf: 'flex-start',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.38rem 0.75rem',
                  borderRadius: '8px',
                  border: '1.5px solid #BFDBFE',
                  background: '#EFF6FF',
                  color: '#1D4ED8',
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                <Plus size={13} /> Thêm đáp án
              </button>
            </div>
            <div style={hintStyle}>Bấm vào chữ cái A/B/C/D để chọn đáp án đúng (đang chọn: {String.fromCharCode(65 + draft.quiz.answer)}).</div>

            <textarea
              rows={3}
              style={textareaStyle}
              value={draft.quiz.explanation}
              onChange={(e) => patch({ quiz: { ...draft.quiz, explanation: e.target.value } })}
              placeholder="Lời giải thích chi tiết cho đáp án đúng..."
            />
          </>
        )}
      </div>

      {/* Footer: Huỷ & Lưu */}
      <div
        style={{
          position: 'sticky',
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '0.65rem',
          padding: '0.85rem 1rem',
          borderRadius: '12px',
          background: 'rgba(248,250,252,0.96)',
          border: '1.5px solid var(--color-border)',
          backdropFilter: 'blur(8px)'
        }}
      >
        <button
          onClick={onCancel}
          disabled={isSaving}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.6rem 1.1rem',
            borderRadius: '9px',
            border: '1.5px solid #CBD5E1',
            background: '#FFFFFF',
            color: '#475569',
            fontSize: '0.85rem',
            fontWeight: 800,
            cursor: isSaving ? 'not-allowed' : 'pointer'
          }}
        >
          <X size={16} /> Huỷ thay đổi
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.6rem 1.3rem',
            borderRadius: '9px',
            border: 'none',
            background: isSaving ? '#64748B' : 'linear-gradient(135deg, #EA580C, #C2410C)',
            color: '#FFFFFF',
            fontSize: '0.85rem',
            fontWeight: 800,
            cursor: isSaving ? 'not-allowed' : 'pointer',
            boxShadow: '0 6px 16px -6px rgba(234,88,12,0.7)'
          }}
        >
          <Save size={16} />
          <span>{isSaving ? 'Đang đồng bộ...' : 'Lưu & Đồng bộ Supabase'}</span>
        </button>
      </div>
    </div>
  );
}
