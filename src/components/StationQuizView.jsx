import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle,
  XCircle,
  HelpCircle,
  Award,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Flame,
  Check,
  AlertCircle,
  Lightbulb,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function StationQuizView({
  quizData,
  stationTitle = 'Chủ đề ôn tập',
  stationCode = 'Chủ đề',
  onComplete,
  isAlreadyCompleted = false
}) {
  const mcqList = useMemo(() => quizData?.mcq || [], [quizData]);
  const tfList = useMemo(() => quizData?.tf || [], [quizData]);

  // Tab: 'mcq' (Phần I) hoặc 'tf' (Phần II)
  const [activePart, setActivePart] = useState('mcq');

  // Answers state
  // mcqAnswers: { [questionIndex]: selectedOptionIndex (0-3) }
  const [mcqAnswers, setMcqAnswers] = useState({});

  // tfAnswers: { [qIndex]: { [itemIndex]: boolean (true/false) } }
  const [tfAnswers, setTfAnswers] = useState({});

  // Submitted & result state
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);

  // Jump to specific question
  const [currentMcqIndex, setCurrentMcqIndex] = useState(0);
  const [currentTfIndex, setCurrentTfIndex] = useState(0);

  // Count answered items
  const answeredMcqCount = Object.keys(mcqAnswers).length;
  const answeredTfCount = Object.values(tfAnswers).reduce(
    (acc, qObj) => acc + Object.keys(qObj || {}).length,
    0
  );
  const totalTfItems = tfList.reduce((acc, q) => acc + (q.items?.length || 0), 0);
  const totalItems = mcqList.length + totalTfItems;
  const totalAnswered = answeredMcqCount + answeredTfCount;

  // Handle MCQ selection
  const handleSelectMcq = (qIdx, optIdx) => {
    if (isSubmitted) return;
    setMcqAnswers((prev) => ({
      ...prev,
      [qIdx]: optIdx
    }));
  };

  // Handle TF selection
  const handleSelectTf = (qIdx, itemIdx, val) => {
    if (isSubmitted) return;
    setTfAnswers((prev) => ({
      ...prev,
      [qIdx]: {
        ...(prev[qIdx] || {}),
        [itemIdx]: val
      }
    }));
  };

  // Calculate score and submit
  const handleSubmit = () => {
    let correctCount = 0;
    const wrongMcq = [];
    const wrongTf = [];

    // Grade MCQ (1 point each)
    mcqList.forEach((q, idx) => {
      const userAns = mcqAnswers[idx];
      if (userAns === q.ans) {
        correctCount++;
      } else {
        wrongMcq.push({
          index: idx,
          question: q,
          userAns
        });
      }
    });

    // Grade TF (1 point per sub-item)
    tfList.forEach((q, qIdx) => {
      const qAns = tfAnswers[qIdx] || {};
      q.items.forEach((item, itemIdx) => {
        const userVal = qAns[itemIdx];
        if (userVal === item.ans) {
          correctCount++;
        } else {
          wrongTf.push({
            qIndex: qIdx,
            itemIndex: itemIdx,
            item,
            userVal
          });
        }
      });
    });

    const score10 = Math.round((correctCount / totalItems) * 100) / 10;

    const res = {
      correctCount,
      totalItems,
      score10,
      accuracy: Math.round((correctCount / totalItems) * 100),
      wrongMcq,
      wrongTf
    };

    setScoreResult(res);
    setIsSubmitted(true);

    if (score10 >= 8.0) {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22C55E', '#EAB308', '#F97316', '#3B82F6']
      });
    }

    if (score10 >= 6.5 && onComplete) {
      onComplete();
    }
  };

  // Reset
  const handleReset = () => {
    setMcqAnswers({});
    setTfAnswers({});
    setIsSubmitted(false);
    setScoreResult(null);
    setCurrentMcqIndex(0);
    setCurrentTfIndex(0);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        background: '#0B0F19',
        color: '#F8FAFC',
        overflow: 'hidden',
        fontFamily: 'inherit'
      }}
    >
      {/* 1. Header Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1.25rem',
          background: '#111827',
          borderBottom: '1px solid #1F2937',
          flexWrap: 'wrap',
          gap: '0.75rem',
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              padding: '0.2rem 0.6rem',
              borderRadius: '6px',
              background: '#EA580C',
              color: '#FFFFFF',
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'uppercase'
            }}
          >
            {stationCode}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#F1F5F9' }}>
              {stationTitle}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#94A3B8' }}>
              Phần I: 20 câu trắc nghiệm • Phần II: 4 câu Đúng/Sai (16 ý) • Tổng 36 ý chấm điểm
            </div>
          </div>
        </div>

        {/* Tab switch Part I vs Part II */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            onClick={() => setActivePart('mcq')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: activePart === 'mcq' ? '1.5px solid #EA580C' : '1px solid #374151',
              background: activePart === 'mcq' ? 'rgba(234, 88, 12, 0.2)' : '#1F2937',
              color: activePart === 'mcq' ? '#FDBA74' : '#94A3B8',
              transition: 'all 0.15s ease'
            }}
          >
            <span>Phần I: Trắc nghiệm (20 câu)</span>
            <span
              style={{
                background: '#374151',
                padding: '0.1rem 0.4rem',
                borderRadius: '999px',
                fontSize: '0.7rem'
              }}
            >
              {answeredMcqCount}/20
            </span>
          </button>

          <button
            onClick={() => setActivePart('tf')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: activePart === 'tf' ? '1.5px solid #3B82F6' : '1px solid #374151',
              background: activePart === 'tf' ? 'rgba(59, 130, 246, 0.2)' : '#1F2937',
              color: activePart === 'tf' ? '#93C5FD' : '#94A3B8',
              transition: 'all 0.15s ease'
            }}
          >
            <span>Phần II: Đúng / Sai (4 câu)</span>
            <span
              style={{
                background: '#374151',
                padding: '0.1rem 0.4rem',
                borderRadius: '999px',
                fontSize: '0.7rem'
              }}
            >
              {answeredTfCount}/{totalTfItems}
            </span>
          </button>
        </div>
      </div>

      {/* 2. Score Banner (When Submitted) */}
      {isSubmitted && scoreResult && (
        <div
          style={{
            padding: '1rem 1.25rem',
            background: scoreResult.score10 >= 8.0 ? 'linear-gradient(90deg, #064E3B 0%, #0F172A 100%)' : '#1E293B',
            borderBottom: '2px solid #334155',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: scoreResult.score10 >= 8 ? '#10B981' : scoreResult.score10 >= 5 ? '#F59E0B' : '#EF4444',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1.25rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}
            >
              {scoreResult.score10.toFixed(1)}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {scoreResult.score10 >= 9 ? '🎉 Xuất sắc! Nắm chắc điểm 10 THPTQG' : scoreResult.score10 >= 7 ? '👍 Rất tốt! Đã đạt yêu cầu kiến thức' : '⚠️ Cần củng cố thêm lý thuyết!'}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                Đúng: <strong style={{ color: '#10B981' }}>{scoreResult.correctCount}/{scoreResult.totalItems} ý</strong> (Độ chính xác {scoreResult.accuracy}%) • {scoreResult.wrongMcq.length + scoreResult.wrongTf.length === 0 ? 'Hoàn hảo không sai câu nào!' : `Còn sai ${scoreResult.wrongMcq.length + scoreResult.wrongTf.length} câu/ý`}
              </div>
            </div>
          </div>

          <button
            onClick={handleReset}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              background: '#374151',
              color: '#F9FAFB',
              fontWeight: 700,
              fontSize: '0.82rem',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={15} />
            <span>Làm lại từ đầu</span>
          </button>
        </div>
      )}

      {/* 3. Main Question Container & Sidebar Navigator */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left: Questions Scroll Area */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}
        >
          {activePart === 'mcq' ? (
            /* =================== PHẦN I: TRẮC NGHIỆM =================== */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {mcqList.map((q, idx) => {
                const userChoice = mcqAnswers[idx];
                const isCorrect = userChoice === q.ans;
                const isAnswered = userChoice !== undefined;

                return (
                  <div
                    key={q.id || idx}
                    id={`mcq_card_${idx}`}
                    style={{
                      background: '#131B2E',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      border: isSubmitted
                        ? isCorrect
                          ? '1.5px solid #10B981'
                          : '1.5px solid #EF4444'
                        : isAnswered
                        ? '1px solid #EA580C'
                        : '1px solid #1E293B',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {/* Header câu hỏi */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span
                          style={{
                            background: '#EA580C',
                            color: '#FFFFFF',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            padding: '0.2rem 0.55rem',
                            borderRadius: '6px'
                          }}
                        >
                          Câu {idx + 1}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                          Trắc nghiệm 4 lựa chọn (0.25đ)
                        </span>
                      </div>

                      {isSubmitted && (
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontSize: '0.78rem',
                            fontWeight: 800,
                            color: isCorrect ? '#34D399' : '#F87171'
                          }}
                        >
                          {isCorrect ? (
                            <>
                              <CheckCircle size={15} />
                              <span>Đúng (+0.25đ)</span>
                            </>
                          ) : (
                            <>
                              <XCircle size={15} />
                              <span>Sai (0đ)</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Nội dung câu hỏi */}
                    <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '1rem', lineHeight: 1.5 }}>
                      {q.q}
                    </div>

                    {/* 4 phương án A, B, C, D */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                      {q.opts.map((opt, optIdx) => {
                        const letter = 'ABCD'[optIdx];
                        const isSelected = userChoice === optIdx;
                        const isThisCorrect = q.ans === optIdx;

                        let optBg = '#1E293B';
                        let optBorder = '1px solid #334155';
                        let optColor = '#E2E8F0';

                        if (isSubmitted) {
                          if (isThisCorrect) {
                            optBg = 'rgba(16, 185, 129, 0.18)';
                            optBorder = '2px solid #10B981';
                            optColor = '#34D399';
                          } else if (isSelected && !isThisCorrect) {
                            optBg = 'rgba(239, 68, 68, 0.18)';
                            optBorder = '2px solid #EF4444';
                            optColor = '#F87171';
                          }
                        } else if (isSelected) {
                          optBg = 'rgba(234, 88, 12, 0.18)';
                          optBorder = '2px solid #EA580C';
                          optColor = '#FED7AA';
                        }

                        return (
                          <div
                            key={optIdx}
                            onClick={() => handleSelectMcq(idx, optIdx)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.75rem',
                              padding: '0.75rem 1rem',
                              borderRadius: '8px',
                              background: optBg,
                              border: optBorder,
                              color: optColor,
                              cursor: isSubmitted ? 'default' : 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <span
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 800,
                                fontSize: '0.82rem',
                                background: isSubmitted
                                  ? isThisCorrect
                                    ? '#10B981'
                                    : isSelected
                                    ? '#EF4444'
                                    : '#334155'
                                  : isSelected
                                  ? '#EA580C'
                                  : '#334155',
                                color: '#FFFFFF',
                                flexShrink: 0
                              }}
                            >
                              {letter}
                            </span>
                            <span style={{ fontSize: '0.88rem', lineHeight: 1.4 }}>
                              {opt}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Giải thích sau khi nộp bài */}
                    {isSubmitted && (
                      <div
                        style={{
                          marginTop: '1rem',
                          padding: '0.85rem 1rem',
                          borderRadius: '8px',
                          background: 'rgba(30, 41, 59, 0.8)',
                          border: '1px solid #334155',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.65rem'
                        }}
                      >
                        <Lightbulb size={18} color="#FBBF24" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div style={{ fontSize: '0.82rem', lineHeight: 1.5, color: '#CBD5E1' }}>
                          <strong style={{ color: '#FBBF24' }}>Đáp án đúng: {'ABCD'[q.ans]}.</strong> {q.exp}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* =================== PHẦN II: ĐÚNG / SAI =================== */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {tfList.map((q, qIdx) => {
                const currentAnswers = tfAnswers[qIdx] || {};

                return (
                  <div
                    key={q.id || qIdx}
                    id={`tf_card_${qIdx}`}
                    style={{
                      background: '#131B2E',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      border: '1px solid #1E293B',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)'
                    }}
                  >
                    {/* Header câu hỏi Đúng/Sai */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span
                        style={{
                          background: '#3B82F6',
                          color: '#FFFFFF',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          padding: '0.2rem 0.55rem',
                          borderRadius: '6px'
                        }}
                      >
                        Câu {qIdx + 1} (Phần II)
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                        Trắc nghiệm Đúng/Sai (Mỗi ý 0.25đ • Đúng cả 4 ý đạt 1.0đ)
                      </span>
                    </div>

                    {/* Ngữ cảnh */}
                    <div
                      style={{
                        padding: '0.85rem 1rem',
                        borderRadius: '8px',
                        background: '#1E293B',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        color: '#E2E8F0',
                        marginBottom: '1rem',
                        lineHeight: 1.5,
                        borderLeft: '4px solid #3B82F6'
                      }}
                    >
                      {q.ctx}
                    </div>

                    {/* Danh sách 4 mệnh đề a, b, c, d */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {q.items.map((item, itemIdx) => {
                        const letter = 'abcd'[itemIdx];
                        const userVal = currentAnswers[itemIdx];
                        const isCorrect = userVal === item.ans;

                        return (
                          <div
                            key={itemIdx}
                            style={{
                              background: '#111827',
                              padding: '0.85rem 1rem',
                              borderRadius: '8px',
                              border: isSubmitted
                                ? isCorrect
                                  ? '1px solid #10B981'
                                  : '1px solid #EF4444'
                                : userVal !== undefined
                                ? '1px solid #374151'
                                : '1px solid #1F2937',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.65rem'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                              <div style={{ fontSize: '0.88rem', color: '#F1F5F9', lineHeight: 1.4 }}>
                                <strong style={{ color: '#60A5FA', marginRight: '0.4rem' }}>{letter})</strong>
                                {item.s}
                              </div>

                              {/* Nút bấm chọn Đúng / Sai */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                                <button
                                  type="button"
                                  onClick={() => handleSelectTf(qIdx, itemIdx, true)}
                                  style={{
                                    padding: '0.35rem 0.75rem',
                                    borderRadius: '6px',
                                    fontSize: '0.78rem',
                                    fontWeight: 800,
                                    cursor: isSubmitted ? 'default' : 'pointer',
                                    border: userVal === true ? '1.5px solid #10B981' : '1px solid #374151',
                                    background: userVal === true ? '#10B981' : '#1F2937',
                                    color: userVal === true ? '#FFFFFF' : '#94A3B8',
                                    transition: 'all 0.15s ease'
                                  }}
                                >
                                  ĐÚNG
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleSelectTf(qIdx, itemIdx, false)}
                                  style={{
                                    padding: '0.35rem 0.75rem',
                                    borderRadius: '6px',
                                    fontSize: '0.78rem',
                                    fontWeight: 800,
                                    cursor: isSubmitted ? 'default' : 'pointer',
                                    border: userVal === false ? '1.5px solid #EF4444' : '1px solid #374151',
                                    background: userVal === false ? '#EF4444' : '#1F2937',
                                    color: userVal === false ? '#FFFFFF' : '#94A3B8',
                                    transition: 'all 0.15s ease'
                                  }}
                                >
                                  SAI
                                </button>
                              </div>
                            </div>

                            {/* Lời giải thích khi nộp bài */}
                            {isSubmitted && (
                              <div
                                style={{
                                  fontSize: '0.78rem',
                                  color: isCorrect ? '#34D399' : '#FCA5A5',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.4rem',
                                  paddingTop: '0.4rem',
                                  borderTop: '1px dashed #374151'
                                }}
                              >
                                {isCorrect ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                <span>
                                  Đáp án chuẩn: <strong>{item.ans ? 'ĐÚNG' : 'SAI'}</strong>. {item.exp}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Quick Palette Navigator & Submit Action */}
        <div
          style={{
            width: '260px',
            background: '#111827',
            borderLeft: '1px solid #1F2937',
            padding: '1.25rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flexShrink: 0,
            overflowY: 'auto'
          }}
        >
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#F1F5F9', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
              Danh sách câu hỏi
            </div>

            {/* MCQ Palette (1-20) */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginBottom: '0.4rem', fontWeight: 700 }}>
                Phần I: Trắc nghiệm ({answeredMcqCount}/20)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.35rem' }}>
                {mcqList.map((_, idx) => {
                  const isDone = mcqAnswers[idx] !== undefined;
                  const isCur = activePart === 'mcq' && currentMcqIndex === idx;

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setActivePart('mcq');
                        setCurrentMcqIndex(idx);
                        document.getElementById(`mcq_card_${idx}`)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      style={{
                        padding: '0.45rem 0',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textAlign: 'center',
                        cursor: 'pointer',
                        border: isCur ? '1.5px solid #EA580C' : '1px solid #374151',
                        background: isDone ? '#EA580C' : '#1F2937',
                        color: isDone ? '#FFFFFF' : '#94A3B8',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TF Palette (II.1 -> II.4) */}
            <div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginBottom: '0.4rem', fontWeight: 700 }}>
                Phần II: Đúng / Sai ({answeredTfCount}/{totalTfItems} ý)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.35rem' }}>
                {tfList.map((q, idx) => {
                  const qAns = tfAnswers[idx] || {};
                  const isFull = Object.keys(qAns).length === (q.items?.length || 4);

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setActivePart('tf');
                        setCurrentTfIndex(idx);
                        document.getElementById(`tf_card_${idx}`)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      style={{
                        padding: '0.45rem 0',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textAlign: 'center',
                        cursor: 'pointer',
                        border: activePart === 'tf' && currentTfIndex === idx ? '1.5px solid #3B82F6' : '1px solid #374151',
                        background: isFull ? '#3B82F6' : '#1F2937',
                        color: isFull ? '#FFFFFF' : '#94A3B8',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      C{idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Action Submit Button */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #1F2937' }}>
            <div style={{ fontSize: '0.74rem', color: '#94A3B8', marginBottom: '0.65rem', textAlign: 'center' }}>
              Đã làm: <strong>{totalAnswered}/{totalItems} ý</strong>
            </div>

            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleSubmit}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #EA580C 0%, #C2410C 100%)',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(234, 88, 12, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <Check size={16} />
                <span>Nộp bài & Chấm điểm</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleReset}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  background: '#374151',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <RotateCcw size={16} />
                <span>Làm lại từ đầu</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
