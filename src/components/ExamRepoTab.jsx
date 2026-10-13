import React, { useState, useEffect } from 'react';
import {
  Search,
  BookOpen,
  Clock,
  HelpCircle,
  Award,
  Users,
  Star,
  Play,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MOCK_EXAM_LIST, SAMPLE_EXAM_QUESTIONS } from '../mockData';

export default function ExamRepoTab() {
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeExam, setActiveExam] = useState(null); // When exam runner modal is active

  // Exam runner state
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { qId: answer }
  const [userTfAnswers, setUserTfAnswers] = useState({}); // { `${qId}_${subId}`: bool }
  const [userShortAnswers, setUserShortAnswers] = useState({}); // { qId: string }
  const [timeLeft, setTimeLeft] = useState(50 * 60); // 50 mins in seconds
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);

  // Timer countdown
  useEffect(() => {
    let timer = null;
    if (activeExam && !isSubmitted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeExam, isSubmitted, timeLeft]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartExam = (exam) => {
    setActiveExam(exam);
    setCurrentQIndex(0);
    setUserAnswers({});
    setUserTfAnswers({});
    setUserShortAnswers({});
    setTimeLeft(exam.durationMinutes * 60);
    setIsSubmitted(false);
    setScoreResult(null);
  };

  const handleCloseExam = () => {
    if (!isSubmitted) {
      if (window.confirm('Bạn có chắc muốn thoát bài thi? Tiến trình làm bài sẽ không được lưu.')) {
        setActiveExam(null);
      }
    } else {
      setActiveExam(null);
    }
  };

  const handleSelectOption = (qId, optionKey) => {
    if (isSubmitted) return;
    setUserAnswers({ ...userAnswers, [qId]: optionKey });
  };

  const handleSelectTF = (qId, subId, val) => {
    if (isSubmitted) return;
    setUserTfAnswers({ ...userTfAnswers, [`${qId}_${subId}`]: val });
  };

  const handleShortAnswerChange = (qId, val) => {
    if (isSubmitted) return;
    setUserShortAnswers({ ...userShortAnswers, [qId]: val });
  };

  const handleSubmitExam = () => {
    // Grade exam based on SAMPLE_EXAM_QUESTIONS
    let correctCount = 0;
    const totalQuestions = SAMPLE_EXAM_QUESTIONS.length;

    SAMPLE_EXAM_QUESTIONS.forEach((q) => {
      if (q.type === 'single_choice') {
        if (userAnswers[q.id] === q.correctAnswer) correctCount++;
      } else if (q.type === 'true_false') {
        // All 4 sub-items must be correct or weighted
        let tfCorrect = 0;
        q.subQuestions.forEach((sub) => {
          if (userTfAnswers[`${q.id}_${sub.id}`] === sub.isTrue) {
            tfCorrect++;
          }
        });
        if (tfCorrect === q.subQuestions.length) correctCount++;
        else if (tfCorrect >= 3) correctCount += 0.5;
      } else if (q.type === 'short_answer') {
        const userAns = (userShortAnswers[q.id] || '').trim();
        if (userAns === q.correctAnswer) correctCount++;
      }
    });

    const calculatedScore = ((correctCount / totalQuestions) * 10).toFixed(2);
    setScoreResult({
      score: calculatedScore,
      correctCount,
      totalQuestions
    });
    setIsSubmitted(true);

    if (calculatedScore >= 7) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#EA580C', '#FBBF24', '#22C55E']
      });
    }
  };

  // Filter exams
  const filteredExams = MOCK_EXAM_LIST.filter((exam) => {
    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'bo' && exam.type.includes('Bộ GD&ĐT')) ||
      (filterType === 'chuyen' && (exam.type.includes('Chuyên KHTN') || exam.type.includes('Chuyên Sư Phạm'))) ||
      (filterType === 'topic' && exam.type.includes('Chuyên đề'));

    const matchesSearch =
      exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.source.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const currentQ = SAMPLE_EXAM_QUESTIONS[currentQIndex];

  return (
    <div className="exam-repo-container">
      {/* Top Filter Bar */}
      <div className="exam-filters-bar">
        <div className="filter-pills">
          <button
            className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            Tất cả đề thi ({MOCK_EXAM_LIST.length})
          </button>
          <button
            className={`filter-btn ${filterType === 'bo' ? 'active' : ''}`}
            onClick={() => setFilterType('bo')}
          >
            Đề minh họa Bộ GD&ĐT
          </button>
          <button
            className={`filter-btn ${filterType === 'chuyen' ? 'active' : ''}`}
            onClick={() => setFilterType('chuyen')}
          >
            Các trường Chuyên
          </button>
          <button
            className={`filter-btn ${filterType === 'topic' ? 'active' : ''}`}
            onClick={() => setFilterType('topic')}
          >
            Đề theo chuyên đề trọng tâm
          </button>
        </div>

        {/* Search */}
        <div className="search-input-wrap">
          <Search size={16} />
          <input
            type="text"
            placeholder="Tìm kiếm đề thi, trường ra đề..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Exam Cards Grid */}
      <div className="exams-grid">
        {filteredExams.map((exam) => (
          <div key={exam.id} className="exam-card">
            <div>
              <div className="exam-badge-top">
                <span
                  className="exam-type-tag"
                  style={{
                    background: exam.tagColor === 'orange' ? 'var(--color-cream)' : '#FEF3C7',
                    color: 'var(--color-deep)',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  {exam.type}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-amber-dark)' }}>
                  <Star size={14} fill="var(--color-amber)" stroke="none" />
                  {exam.rating}
                </span>
              </div>

              <h3 className="exam-card-title">{exam.title}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
                Nguồn: <strong>{exam.source}</strong>
              </p>

              <div className="exam-card-meta">
                <span>
                  <Clock size={14} color="var(--color-primary)" />
                  {exam.durationMinutes} phút
                </span>
                <span>
                  <HelpCircle size={14} color="var(--color-deep)" />
                  {exam.questionCount} câu hỏi
                </span>
                <span>
                  <Users size={14} />
                  {exam.participants.toLocaleString()} lượt thi
                </span>
              </div>

              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.75rem', lineHeight: 1.4 }}>
                {exam.description}
              </p>
            </div>

            <button
              className="exam-btn-start"
              onClick={() => handleStartExam(exam)}
            >
              <Play size={16} />
              <span>Làm bài thi ngay</span>
            </button>
          </div>
        ))}
      </div>

      {/* FULLSCREEN EXAM TAKER MODAL */}
      {activeExam && (
        <div className="exam-taker-modal-backdrop">
          <div className="exam-taker-window">
            {/* Exam Runner Header */}
            <div className="exam-taker-header">
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                  {activeExam.type}
                </span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-deep)' }}>
                  {activeExam.title}
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className="exam-timer-chip">
                  <Clock size={16} />
                  <span>{formatTimer(timeLeft)}</span>
                </div>
                <button onClick={handleCloseExam} style={{ color: '#6B7280', padding: '6px' }}>
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Exam Runner Body */}
            <div className="exam-taker-body">
              {/* Question Area */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Result Announcement if submitted */}
                {isSubmitted && scoreResult && (
                  <div style={{ background: '#FFF7ED', border: '2px solid var(--color-primary)', borderRadius: 'var(--radius-md)', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-deep)', textTransform: 'uppercase' }}>
                        Kết quả bài thi của bạn
                      </div>
                      <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-primary)' }}>
                        {scoreResult.score} / 10.0 Điểm
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        Đúng {scoreResult.correctCount}/{scoreResult.totalQuestions} câu hỏi chuẩn cấu trúc THPTQG
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.8rem', background: '#DCFCE7', color: '#15803D', padding: '0.3rem 0.8rem', borderRadius: '999px', fontWeight: 700 }}>
                        {scoreResult.score >= 8 ? '🎉 Đạt yêu cầu xuất sắc!' : '⚠️ Cần củng cố thêm kiến thức'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Question Box */}
                {currentQ && (
                  <div className="question-box">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', background: 'var(--color-cream)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                        {currentQ.part}
                      </span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-deep)' }}>
                        Câu {currentQ.id} / {SAMPLE_EXAM_QUESTIONS.length}
                      </span>
                    </div>

                    <div className="question-text">{currentQ.question}</div>

                    {currentQ.code && (
                      <pre className="code-snippet">
                        <code>{currentQ.code}</code>
                      </pre>
                    )}

                    {/* Question Type: Single Choice */}
                    {currentQ.type === 'single_choice' && (
                      <div className="options-list">
                        {currentQ.options.map((opt) => {
                          const isSelected = userAnswers[currentQ.id] === opt.key;
                          const isCorrect = isSubmitted && currentQ.correctAnswer === opt.key;
                          const isWrong = isSubmitted && isSelected && !isCorrect;

                          return (
                            <button
                              key={opt.key}
                              className={`option-btn ${isSelected ? 'selected' : ''}`}
                              onClick={() => handleSelectOption(currentQ.id, opt.key)}
                              style={{
                                background: isCorrect ? '#DCFCE7' : isWrong ? '#FEE2E2' : undefined,
                                borderColor: isCorrect ? '#22C55E' : isWrong ? '#EF4444' : undefined
                              }}
                            >
                              <div className="option-key">{opt.key}</div>
                              <span style={{ flex: 1 }}>{opt.text}</span>
                              {isCorrect && <CheckCircle2 size={18} color="#16A34A" />}
                              {isWrong && <XCircle size={18} color="#DC2626" />}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Question Type: True / False */}
                    {currentQ.type === 'true_false' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {currentQ.subQuestions.map((sub) => {
                          const userVal = userTfAnswers[`${currentQ.id}_${sub.id}`];
                          return (
                            <div
                              key={sub.id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0.75rem 1rem',
                                background: '#FFFFFF',
                                border: '1.5px solid var(--color-border-subtle)',
                                borderRadius: 'var(--radius-md)',
                                gap: '1rem'
                              }}
                            >
                              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-deep)' }}>
                                <strong>Ý {sub.id})</strong> {sub.text}
                              </div>
                              <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                                <button
                                  onClick={() => handleSelectTF(currentQ.id, sub.id, true)}
                                  disabled={isSubmitted}
                                  style={{
                                    padding: '0.35rem 0.85rem',
                                    borderRadius: '6px',
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    background: userVal === true ? '#22C55E' : '#F3F4F6',
                                    color: userVal === true ? '#FFFFFF' : '#4B5563'
                                  }}
                                >
                                  ĐÚNG
                                </button>
                                <button
                                  onClick={() => handleSelectTF(currentQ.id, sub.id, false)}
                                  disabled={isSubmitted}
                                  style={{
                                    padding: '0.35rem 0.85rem',
                                    borderRadius: '6px',
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    background: userVal === false ? '#EF4444' : '#F3F4F6',
                                    color: userVal === false ? '#FFFFFF' : '#4B5563'
                                  }}
                                >
                                  SAI
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Question Type: Short Answer */}
                    {currentQ.type === 'short_answer' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-deep)' }}>
                          Nhập kết quả giá trị (số nguyên):
                        </label>
                        <input
                          type="text"
                          disabled={isSubmitted}
                          placeholder="Điền kết quả..."
                          value={userShortAnswers[currentQ.id] || ''}
                          onChange={(e) => handleShortAnswerChange(currentQ.id, e.target.value)}
                          style={{
                            padding: '0.75rem 1rem',
                            borderRadius: '8px',
                            border: '1.5px solid var(--color-border)',
                            fontSize: '1rem',
                            fontWeight: 700,
                            fontFamily: 'var(--font-code)',
                            width: '240px',
                            outline: 'none'
                          }}
                        />
                      </div>
                    )}

                    {/* Explanation when submitted */}
                    {isSubmitted && (
                      <div style={{ marginTop: '1rem', background: '#FFFDF9', borderLeft: '4px solid var(--color-primary)', padding: '0.85rem 1rem', borderRadius: '0 8px 8px 0' }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-deep)', marginBottom: '0.25rem' }}>
                          💡 Giải thích chi tiết câu hỏi:
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                          {currentQ.explanation}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Question Navigation Sidebar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--color-deep)' }}>
                  Danh sách câu hỏi:
                </div>

                <div className="question-nav-grid">
                  {SAMPLE_EXAM_QUESTIONS.map((q, idx) => {
                    const isAnswered =
                      userAnswers[q.id] !== undefined ||
                      userShortAnswers[q.id] !== undefined ||
                      userTfAnswers[`${q.id}_a`] !== undefined;
                    const isCurrent = idx === currentQIndex;

                    return (
                      <button
                        key={q.id}
                        className={`q-nav-cell ${isAnswered ? 'answered' : ''} ${isCurrent ? 'current' : ''}`}
                        onClick={() => setCurrentQIndex(idx)}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <div style={{ height: '1px', background: '#E5E7EB', margin: '0.5rem 0' }}></div>

                {!isSubmitted ? (
                  <button
                    className="btn-checkin-streak"
                    style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-deep))' }}
                    onClick={handleSubmitExam}
                  >
                    <span>Nộp bài & Chấm điểm</span>
                  </button>
                ) : (
                  <button
                    className="btn-open-station"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => handleStartExam(activeExam)}
                  >
                    <RotateCcw size={16} />
                    <span>Làm lại đề này</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
