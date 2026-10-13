import React, { useState } from 'react';
import {
  Link as ChainIcon,
  CheckCircle,
  Lock,
  Play,
  Award,
  BookOpen,
  X,
  Sparkles,
  ChevronRight,
  Code,
  Flame,
  Check
} from 'lucide-react';
import { ROADMAP_STATIONS } from '../mockData';

export default function RoadmapTab() {
  const [stations, setStations] = useState(ROADMAP_STATIONS);
  const [selectedStation, setSelectedStation] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const completedCount = stations.filter((s) => s.status === 'completed').length;
  const totalXP = stations.reduce((acc, s) => acc + (s.status === 'completed' ? s.xp : 0), 0);

  const handleOpenStation = (station) => {
    setSelectedStation(station);
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  const handleCloseModal = () => {
    setSelectedStation(null);
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  const toggleLessonDone = (lessonId) => {
    if (!selectedStation) return;
    const updatedLessons = selectedStation.lessons.map((l) =>
      l.id === lessonId ? { ...l, done: !l.done } : l
    );
    const updatedStation = { ...selectedStation, lessons: updatedLessons };
    setSelectedStation(updatedStation);

    setStations((prev) =>
      prev.map((s) => (s.id === selectedStation.id ? updatedStation : s))
    );
  };

  return (
    <div className="roadmap-container">
      {/* Roadmap Header Summary */}
      <div className="roadmap-header-card">
        <div className="roadmap-header-text">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#FFFFFF', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', border: '1px solid var(--color-border)', marginBottom: '0.6rem' }}>
            <ChainIcon size={14} />
            <span>Dây xích liên hoàn kiến thức chuẩn Bộ GD&ĐT 2025</span>
          </div>
          <h2>Lộ Trình Học — Dây Xích Trực Quan</h2>
          <p>
            Mỗi mắt xích liên kết chặt chẽ với nhau theo thứ tự sư phạm. Hoàn thành 100% mắt xích hiện tại để bẻ khóa (unlock) mắt xích tiếp theo và tiến thẳng tới mốc 10 điểm Tin học THPTQG!
          </p>
        </div>

        <div className="roadmap-stats-badges">
          <div className="stat-chip">
            <div className="stat-chip-num">{completedCount}/{stations.length}</div>
            <div className="stat-chip-lbl">Mắt xích đã mở</div>
          </div>
          <div className="stat-chip">
            <div className="stat-chip-num">{totalXP}</div>
            <div className="stat-chip-lbl">Điểm XP Tích Lũy</div>
          </div>
        </div>
      </div>

      {/* Visual Chained Roadmap Track */}
      <div className="chain-track">
        {stations.map((station, index) => {
          const isCompleted = station.status === 'completed';
          const isInProgress = station.status === 'in-progress';
          const isLocked = station.status === 'locked';

          return (
            <div key={station.id} className="chain-station-wrapper">
              {/* If not first node, render visual interlocking SVG Chain link */}
              {index > 0 && (
                <div className={`chain-link-connector ${isLocked ? 'locked' : 'unlocked'}`}>
                  {/* High visual fidelity Interlocking Chain Links */}
                  <svg viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Upper Chain Loop */}
                    <rect
                      x="10"
                      y="4"
                      width="20"
                      height="26"
                      rx="10"
                      stroke={isLocked ? '#CBD5E1' : '#EA580C'}
                      strokeWidth="5"
                    />
                    {/* Lower Interlocking Chain Loop */}
                    <rect
                      x="10"
                      y="26"
                      width="20"
                      height="26"
                      rx="10"
                      stroke={isLocked ? '#94A3B8' : '#FBBF24'}
                      strokeWidth="5"
                    />
                    {/* Metallic highlight */}
                    <circle cx="20" cy="28" r="3" fill={isLocked ? '#94A3B8' : '#EA580C'} />
                  </svg>
                </div>
              )}

              {/* Station Card */}
              <div
                className={`station-node-card ${station.status}`}
                onClick={() => handleOpenStation(station)}
                title={isLocked ? 'Mắt xích này đang khóa. Hoàn thành mắt xích trước để mở khóa!' : 'Bấm để vào trạm học'}
              >
                <div className="node-left-col">
                  {/* Badge Icon */}
                  <div className="node-badge-icon">
                    {isCompleted ? (
                      <CheckCircle size={30} strokeWidth={2.5} />
                    ) : isInProgress ? (
                      <Flame size={32} />
                    ) : (
                      <Lock size={26} />
                    )}
                  </div>

                  {/* Title & Info */}
                  <div className="node-text-col">
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: isCompleted ? '#16A34A' : isInProgress ? 'var(--color-primary)' : '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Chặng {station.stepNumber} • {station.category}
                    </div>
                    <h3>
                      <span>{station.title}</span>
                    </h3>
                    <p className="node-desc">{station.description}</p>
                    <div className="node-tags-row">
                      {station.skills.map((skill, sIdx) => (
                        <span key={sIdx} className="node-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Progress & Action */}
                <div className="node-right-col">
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>
                    {isCompleted ? '100% Hoàn thành' : isInProgress ? `${station.progress}% Đang học` : 'Đang khóa bằng xích'}
                  </div>

                  <div className="progress-bar-shell">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${station.progress}%`,
                        background: isCompleted ? '#22C55E' : 'linear-gradient(90deg, #FBBF24, #EA580C)'
                      }}
                    ></div>
                  </div>

                  <button
                    className="btn-open-station"
                    style={{
                      background: isInProgress ? 'var(--color-primary)' : undefined,
                      color: isInProgress ? '#FFFFFF' : undefined
                    }}
                  >
                    {isCompleted ? (
                      <>
                        <Check size={16} />
                        <span>Ôn tập lại</span>
                      </>
                    ) : isInProgress ? (
                      <>
                        <Play size={16} />
                        <span>Tiếp tục học</span>
                      </>
                    ) : (
                      <>
                        <Lock size={15} />
                        <span>Xem chi tiết</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Station Learning Drawer / Modal */}
      {selectedStation && (
        <div className="modal-backdrop" onClick={handleCloseModal}>
          <div
            className="exam-taker-window"
            style={{ maxWidth: '820px', maxHeight: '85vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="exam-taker-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    background: selectedStation.status === 'completed' ? '#DCFCE7' : '#FFF1D6',
                    color: selectedStation.status === 'completed' ? '#16A34A' : '#EA580C',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <ChainIcon size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                    Mắt xích {selectedStation.stepNumber} • {selectedStation.category}
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-deep)' }}>
                    {selectedStation.title}
                  </h3>
                </div>
              </div>

              <button onClick={handleCloseModal} style={{ color: '#9CA3AF', padding: '6px' }}>
                <X size={22} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '1.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Overview & XP banner */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFDF9', border: '1.5px solid var(--color-border)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-deep)' }}>
                    Tổng quan bài học & thực hành
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                    Gồm {selectedStation.lessonsCount} bài lý thuyết, {selectedStation.exerciseCount} câu trắc nghiệm thực chiến
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--color-cream)', padding: '0.4rem 0.8rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                  <Sparkles size={16} />
                  <span>+{selectedStation.xp} XP Hoàn thành</span>
                </div>
              </div>

              {/* Lesson checklist */}
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-deep)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <BookOpen size={17} color="var(--color-primary)" />
                  <span>Danh sách bài giảng trong mắt xích này:</span>
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {selectedStation.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      onClick={() => toggleLessonDone(lesson.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid',
                        borderColor: lesson.done ? '#86EFAC' : 'var(--color-border-subtle)',
                        background: lesson.done ? '#F0FDF4' : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '22px',
                            height: '22px',
                            borderRadius: '50%',
                            border: '2px solid',
                            borderColor: lesson.done ? '#16A34A' : '#D1D5DB',
                            background: lesson.done ? '#16A34A' : 'transparent',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.7rem',
                            fontWeight: 800
                          }}
                        >
                          {lesson.done && <Check size={14} />}
                        </div>
                        <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-deep)' }}>
                          {lesson.name}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: lesson.done ? '#16A34A' : '#9CA3AF' }}>
                        {lesson.done ? 'Đã học' : 'Chưa học'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mini Quiz Checkpoint */}
              <div style={{ background: '#FFF7ED', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                  <Sparkles size={18} color="var(--color-primary)" />
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-deep)' }}>
                    Câu hỏi phản xạ nhanh (Kiểm tra mở mắt xích)
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-deep)', marginBottom: '0.85rem', fontWeight: 600 }}>
                  Câu hỏi: Trong Python, kết quả của biểu thức <code>len("THPTQG 2025".split())</code> là bao nhiêu?
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {['1', '2', '8', '9'].map((val) => {
                    const isSelected = quizAnswers['q1'] === val;
                    const isCorrect = val === '2';
                    return (
                      <button
                        key={val}
                        onClick={() => {
                          setQuizAnswers({ ...quizAnswers, q1: val });
                          setQuizSubmitted(true);
                        }}
                        style={{
                          padding: '0.5rem 1.2rem',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          background: isSelected
                            ? isCorrect
                              ? '#DCFCE7'
                              : '#FEE2E2'
                            : '#FFFFFF',
                          color: isSelected
                            ? isCorrect
                              ? '#15803D'
                              : '#DC2626'
                            : 'var(--color-deep)',
                          border: '1.5px solid',
                          borderColor: isSelected
                            ? isCorrect
                              ? '#22C55E'
                              : '#EF4444'
                            : 'var(--color-border)'
                        }}
                      >
                        Đáp án: {val}
                      </button>
                    );
                  })}
                </div>
                {quizSubmitted && (
                  <div style={{ marginTop: '0.8rem', fontSize: '0.8rem', color: quizAnswers['q1'] === '2' ? '#15803D' : '#DC2626', fontWeight: 700 }}>
                    {quizAnswers['q1'] === '2'
                      ? '🎉 Chính xác! .split() tách xâu theo khoảng trắng thành list 2 phần tử ["THPTQG", "2025"], do đó độ dài len = 2.'
                      : '❌ Chưa chính xác. Hàm split() mặc định tách theo khoảng trắng thành 2 xâu con! Hãy thử lại.'}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '1rem 1.5rem', background: '#FFFDF9', borderTop: '1.5px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                className="btn-open-station"
                onClick={handleCloseModal}
              >
                Đóng
              </button>
              <button
                className="btn-primary-glow"
                style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}
                onClick={() => {
                  alert('Bắt đầu bài học tương tác!');
                  handleCloseModal();
                }}
              >
                Bắt đầu học bài giảng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
