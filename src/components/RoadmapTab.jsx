import React, { useState, useEffect } from 'react';
import {
  Link as ChainIcon,
  CheckCircle,
  Lock,
  Play,
  BookOpen,
  X,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Code,
  Flame,
  Check,
  Laptop,
  Cpu,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  Copy,
  CheckCheck,
  FileText,
  Calendar,
  Layers,
  Award
} from 'lucide-react';

import {
  TRACK_TYPES,
  TRACK_INFO,
  csRoadmapStations,
  ictRoadmapStations
} from '../data/roadmap';

export default function RoadmapTab() {
  // 1. Quản lý phân ban: 'cs' (Khoa học máy tính) hoặc 'ict' (Tin học ứng dụng)
  const [activeTrack, setActiveTrack] = useState(() => {
    return localStorage.getItem('tinhoc_selected_track') || TRACK_TYPES.ICT;
  });

  // 2. Trạng thái các bài học đã hoàn thành lưu trong localStorage theo user
  const [completedLessonIds, setCompletedLessonIds] = useState(() => {
    try {
      const saved = localStorage.getItem('tinhoc_completed_lessons');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // 3. Modal xem lý thuyết chặng
  const [selectedStation, setSelectedStation] = useState(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);

  // 4. Trạng thái câu hỏi phản xạ trong bài học đang xem
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // 5. Accordion hiển thị Cấu trúc đề thi & Kế hoạch 12 tuần
  const [showBlueprint, setShowBlueprint] = useState(false);
  const [showTwelveWeekPlan, setShowTwelveWeekPlan] = useState(false);

  const currentTrackData = TRACK_INFO[activeTrack];
  const stations = currentTrackData.stations;

  // Lưu track vào localStorage
  const handleSwitchTrack = (trackId) => {
    setActiveTrack(trackId);
    localStorage.setItem('tinhoc_selected_track', trackId);
    setSelectedStation(null);
  };

  // Tính toán tiến độ học tập của từng chặng dựa trên completedLessonIds
  const getStationProgress = (station) => {
    if (!station.lessons || station.lessons.length === 0) return 0;
    const doneCount = station.lessons.filter((l) => completedLessonIds[l.id]).length;
    return Math.round((doneCount / station.lessons.length) * 100);
  };

  // Tổng số bài học trong lộ trình hiện tại
  const totalLessonsInTrack = stations.reduce(
    (acc, st) => acc + (st.lessons ? st.lessons.length : 0),
    0
  );

  // Tổng số bài học đã hoàn thành trong lộ trình hiện tại
  const completedLessonsInTrack = stations.reduce((acc, st) => {
    if (!st.lessons) return acc;
    const done = st.lessons.filter((l) => completedLessonIds[l.id]).length;
    return acc + done;
  }, 0);

  // Số chặng đạt 100%
  const completedStationsCount = stations.filter(
    (st) => getStationProgress(st) === 100
  ).length;

  // Điểm kinh nghiệm XP ước tính
  const totalEarnedXP = stations.reduce((acc, st) => {
    const progress = getStationProgress(st);
    return acc + Math.round((st.xp * progress) / 100);
  }, 0);

  // Mở modal học lý thuyết chặng
  const handleOpenStationModal = (station, lessonIdx = 0) => {
    setSelectedStation(station);
    setActiveLessonIndex(lessonIdx);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setCopiedCode(false);
  };

  const handleCloseModal = () => {
    setSelectedStation(null);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
  };

  // Chuyển đổi trạng thái đã học / chưa học của một bài
  const handleToggleLessonComplete = (lessonId) => {
    setCompletedLessonIds((prev) => {
      const next = { ...prev, [lessonId]: !prev[lessonId] };
      localStorage.setItem('tinhoc_completed_lessons', JSON.stringify(next));
      return next;
    });
  };

  // Sao chép mã nguồn minh họa
  const handleCopyCode = (codeText) => {
    if (!codeText) return;
    navigator.clipboard.writeText(codeText);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Bài học hiện tại trong Modal
  const currentLesson =
    selectedStation && selectedStation.lessons
      ? selectedStation.lessons[activeLessonIndex]
      : null;

  return (
    <div className="roadmap-container">
      {/* 1. Header Card: Tổng quan & Chuyển đổi 2 Lộ Trình */}
      <div className="roadmap-header-card">
        <div className="roadmap-header-text">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: '#FFFFFF',
              padding: '0.3rem 0.85rem',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: 800,
              color: currentTrackData.badgeColor,
              border: '1.5px solid var(--color-border)',
              marginBottom: '0.65rem'
            }}
          >
            <ChainIcon size={14} />
            <span>KHUNG CHƯƠNG TRÌNH GDPT 2018 — ÔN THI THPTQG 2025 - 2026</span>
          </div>
          <h2>Lộ Trình Học Dây Xích — 2 Định Hướng Chuyên Biệt</h2>
          <p>
            Hệ thống hóa toàn bộ kiến thức SGK Tin học 11 & 12 theo 2 nhánh: <strong>Tin học ứng dụng (ICT)</strong> và{' '}
            <strong>Khoa học máy tính (CS)</strong>. Mỗi chặng liên kết chặt chẽ theo dạng dây xích, bấm vào từng bài để học lý thuyết chuyên sâu!
          </p>

          {/* Gợi ý cho Admin / Chủ website */}
          <div style={{ marginTop: '0.75rem' }}>
            <span className="admin-config-hint" title="Hướng dẫn chỉnh sửa nội dung bài giảng">
              <Lightbulb size={13} color="#EA580C" />
              <span>Config lý thuyết: Sửa tại <strong>src/data/roadmap/{activeTrack === 'cs' ? 'csRoadmap.js' : 'ictRoadmap.js'}</strong></span>
            </span>
          </div>
        </div>

        {/* Thống kê tiến độ */}
        <div className="roadmap-stats-badges">
          <div className="stat-chip">
            <div className="stat-chip-num" style={{ color: currentTrackData.badgeColor }}>
              {completedStationsCount}/{stations.length}
            </div>
            <div className="stat-chip-lbl">Chặng hoàn thành</div>
          </div>
          <div className="stat-chip">
            <div className="stat-chip-num" style={{ color: currentTrackData.badgeColor }}>
              {completedLessonsInTrack}/{totalLessonsInTrack}
            </div>
            <div className="stat-chip-lbl">Bài lý thuyết đã học</div>
          </div>
          <div className="stat-chip">
            <div className="stat-chip-num" style={{ color: '#F59E0B' }}>
              {totalEarnedXP} XP
            </div>
            <div className="stat-chip-lbl">Kinh nghiệm tích lũy</div>
          </div>
        </div>
      </div>

      {/* 2. BỘ CHUYỂN ĐỔI 2 PHÂN BAN (SWITCHER BUTTONS) */}
      <div className="roadmap-track-switcher">
        {/* Nút Phân ban 1: Tin học ứng dụng (ICT / THUD) */}
        <button
          className={`track-switch-btn ${activeTrack === TRACK_TYPES.ICT ? 'active-ict' : ''}`}
          onClick={() => handleSwitchTrack(TRACK_TYPES.ICT)}
        >
          <div className="track-btn-info">
            <div className="track-icon-wrapper">
              <Laptop size={26} />
            </div>
            <div>
              <div className="track-btn-title">
                <span>1. Định Hướng: Tin Học Ứng Dụng (ICT)</span>
                {activeTrack === TRACK_TYPES.ICT && (
                  <CheckCircle size={17} color="#0284C7" />
                )}
              </div>
              <div className="track-btn-subtitle">
                Trọng tâm: Bảng tính Excel nâng cao, Thiết kế web HTML/CSS, Đồ họa & Biên tập video
              </div>
            </div>
          </div>
          <div className="track-active-badge">
            {activeTrack === TRACK_TYPES.ICT ? 'ĐANG CHỌN' : 'CHUYỂN SANG'}
          </div>
        </button>

        {/* Nút Phân ban 2: Khoa học máy tính (CS / KHMT) */}
        <button
          className={`track-switch-btn ${activeTrack === TRACK_TYPES.CS ? 'active-cs' : ''}`}
          onClick={() => handleSwitchTrack(TRACK_TYPES.CS)}
        >
          <div className="track-btn-info">
            <div className="track-icon-wrapper">
              <Cpu size={26} />
            </div>
            <div>
              <div className="track-btn-title">
                <span>2. Định Hướng: Khoa Học Máy Tính (CS)</span>
                {activeTrack === TRACK_TYPES.CS && (
                  <CheckCircle size={17} color="var(--color-primary)" />
                )}
              </div>
              <div className="track-btn-subtitle">
                Trọng tâm: CSDL quan hệ & SQL, Lập trình Python, Thuật toán Sắp xếp/Tìm kiếm, AI/ML
              </div>
            </div>
          </div>
          <div className="track-active-badge">
            {activeTrack === TRACK_TYPES.CS ? 'ĐANG CHỌN' : 'CHUYỂN SANG'}
          </div>
        </button>
      </div>

      {/* 3. Thẻ bổ trợ: Cấu Trúc Đề Thi 22 Câu & Kế Hoạch 12 Tuần Điểm 9-10 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
        {/* Card 1: Cấu trúc đề thi */}
        <div className="blueprint-card">
          <div
            className="blueprint-header-toggle"
            onClick={() => setShowBlueprint(!showBlueprint)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <FileText size={20} color={currentTrackData.badgeColor} />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-deep)', margin: 0 }}>
                  Cấu Trúc Đề Thi THPTQG ({currentTrackData.shortName})
                </h4>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Gồm 22 câu hỏi • Thời gian làm bài 50 phút
                </div>
              </div>
            </div>
            <button style={{ background: 'transparent', color: '#64748B' }}>
              {showBlueprint ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>

          {showBlueprint && (
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {currentTrackData.examStructure.parts.map((p, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '0.8rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: '#F8FAFC',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.85rem', color: currentTrackData.badgeColor }}>
                      {p.part}: {p.format}
                    </span>
                    <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#16A34A', background: '#DCFCE7', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                      {p.points}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-deep)', lineHeight: 1.4 }}>
                    {p.focus}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card 2: Lộ trình 12 tuần chiến lược điểm 9-10 */}
        <div className="blueprint-card">
          <div
            className="blueprint-header-toggle"
            onClick={() => setShowTwelveWeekPlan(!showTwelveWeekPlan)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Calendar size={20} color="#EA580C" />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-deep)', margin: 0 }}>
                  Chiến Lược 12 Tuần Về Đích (Mục tiêu 9 - 10 Điểm)
                </h4>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Phân bổ 3 giai đoạn ôn luyện bứt phá điểm số tối đa
                </div>
              </div>
            </div>
            <button style={{ background: 'transparent', color: '#64748B' }}>
              {showTwelveWeekPlan ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>

          {showTwelveWeekPlan && (
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {currentTrackData.twelveWeekPlan.map((step, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '0.8rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: '#FFF7ED',
                    border: '1px solid #FFEDD5'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--color-primary)' }}>
                      {step.phase} ({step.weeks}): {step.title}
                    </span>
                    <span style={{ fontWeight: 800, fontSize: '0.78rem', color: '#B45309', background: '#FEF3C7', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                      {step.targetScore}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-deep)', lineHeight: 1.4 }}>
                    {step.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. VISUAL CHAINED ROADMAP TRACK (LỘ TRÌNH DÂY XÍCH) */}
      <div className="chain-track">
        {stations.map((station, index) => {
          const progress = getStationProgress(station);
          const isCompleted = progress === 100;
          const isInProgress = progress > 0 && progress < 100;
          const isFresh = progress === 0;

          // Xác định class ưu tiên
          const priorityClass =
            station.priorityBadge === 'extreme'
              ? 'badge-priority-extreme'
              : station.priorityBadge === 'high'
              ? 'badge-priority-high'
              : station.priorityBadge === 'low'
              ? 'badge-priority-low'
              : 'badge-priority-normal';

          return (
            <div key={station.id} className="chain-station-wrapper">
              {/* Khớp nối SVG xích liên hoàn kim loại */}
              {index > 0 && (
                <div className={`chain-link-connector ${isCompleted || isInProgress ? 'unlocked' : 'locked'}`}>
                  <svg viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect
                      x="10"
                      y="4"
                      width="20"
                      height="26"
                      rx="10"
                      stroke={isCompleted ? '#16A34A' : isInProgress ? currentTrackData.badgeColor : '#CBD5E1'}
                      strokeWidth="5"
                    />
                    <rect
                      x="10"
                      y="26"
                      width="20"
                      height="26"
                      rx="10"
                      stroke={isCompleted ? '#22C55E' : isInProgress ? '#F59E0B' : '#94A3B8'}
                      strokeWidth="5"
                    />
                    <circle
                      cx="20"
                      cy="28"
                      r="3.5"
                      fill={isCompleted ? '#16A34A' : isInProgress ? currentTrackData.badgeColor : '#94A3B8'}
                    />
                  </svg>
                </div>
              )}

              {/* Station Node Card */}
              <div
                className={`station-node-card ${isCompleted ? 'completed' : isInProgress ? 'in-progress' : ''}`}
                onClick={() => handleOpenStationModal(station, 0)}
                style={{
                  borderLeft: `5px solid ${
                    isCompleted
                      ? '#22C55E'
                      : station.priorityBadge === 'extreme'
                      ? '#DC2626'
                      : station.priorityBadge === 'high'
                      ? '#EA580C'
                      : currentTrackData.badgeColor
                  }`
                }}
              >
                <div className="node-left-col">
                  {/* Badge số chặng */}
                  <div
                    className="node-badge-icon"
                    style={{
                      background: isCompleted
                        ? 'linear-gradient(135deg, #22C55E, #16A34A)'
                        : isInProgress
                        ? currentTrackData.gradientBg
                        : '#F1F5F9',
                      color: isCompleted || isInProgress ? '#FFFFFF' : '#64748B'
                    }}
                  >
                    {isCompleted ? (
                      <CheckCircle size={28} strokeWidth={2.5} />
                    ) : (
                      <span style={{ fontSize: '1.25rem', fontWeight: 900 }}>{station.stepNumber}</span>
                    )}
                  </div>

                  {/* Nội dung chặng */}
                  <div className="node-text-col">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: currentTrackData.badgeColor, textTransform: 'uppercase' }}>
                        {station.code} • {station.category}
                      </span>

                      {/* Badge mức độ ưu tiên ôn luyện */}
                      <span className={priorityClass}>
                        {station.priorityBadge === 'extreme' && <Flame size={12} />}
                        Mức độ: {station.priority}
                      </span>

                      {/* Dạng câu hỏi */}
                      <span className="badge-exam-format">
                        {station.questionType}
                      </span>
                    </div>

                    <h3>
                      <span>{station.title}</span>
                    </h3>
                    <p className="node-desc">{station.description}</p>

                    {/* Danh sách bài học nhỏ trong chặng */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.5rem' }}>
                      {station.lessons &&
                        station.lessons.map((lesson, lIdx) => {
                          const isLessonDone = !!completedLessonIds[lesson.id];
                          return (
                            <span
                              key={lesson.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenStationModal(station, lIdx);
                              }}
                              style={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                padding: '0.2rem 0.55rem',
                                borderRadius: '6px',
                                background: isLessonDone ? '#DCFCE7' : '#F1F5F9',
                                color: isLessonDone ? '#15803D' : '#475569',
                                border: '1px solid',
                                borderColor: isLessonDone ? '#86EFAC' : '#E2E8F0',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                cursor: 'pointer'
                              }}
                              title="Bấm để xem lý thuyết bài này"
                            >
                              {isLessonDone ? <Check size={11} strokeWidth={3} /> : <BookOpen size={11} />}
                              <span>{lesson.title.split(':')[0]}</span>
                            </span>
                          );
                        })}
                    </div>
                  </div>
                </div>

                {/* Right Column: Tiến độ & Nút học */}
                <div className="node-right-col">
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: isCompleted ? '#16A34A' : 'var(--color-text-muted)' }}>
                    {isCompleted
                      ? '✓ Đã hoàn thành'
                      : progress > 0
                      ? `${progress}% Đang học (${station.lessons.filter((l) => completedLessonIds[l.id]).length}/${station.lessons.length} bài)`
                      : `Chưa học (0/${station.lessons.length} bài)`}
                  </div>

                  <div className="progress-bar-shell">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${progress}%`,
                        background: isCompleted ? '#22C55E' : currentTrackData.gradientBg
                      }}
                    ></div>
                  </div>

                  <button
                    className="btn-open-station"
                    style={{
                      background: isInProgress ? currentTrackData.badgeColor : undefined,
                      color: isInProgress ? '#FFFFFF' : undefined,
                      borderColor: isInProgress ? currentTrackData.badgeColor : undefined
                    }}
                  >
                    <BookOpen size={15} />
                    <span>Học lý thuyết ({station.lessons.length} bài)</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. MODAL HỌC LÝ THUYẾT CHI TIẾT TỪNG BÀI (THEORY VIEWER DRAWER/MODAL) */}
      {selectedStation && currentLesson && (
        <div className="modal-backdrop" onClick={handleCloseModal}>
          <div
            className="exam-taker-window"
            style={{ maxWidth: '1050px', width: '92vw', height: '88vh', padding: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Container: 2 Cột (Sidebar bài học + Nội dung lý thuyết) */}
            <div className="theory-modal-container">
              {/* Sidebar: Danh sách các bài học trong chặng */}
              <div className="theory-modal-sidebar">
                <div className="theory-sidebar-header">
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: currentTrackData.badgeColor, textTransform: 'uppercase' }}>
                    {selectedStation.code} • {currentTrackData.shortName}
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-deep)', margin: '0.25rem 0 0 0', lineHeight: 1.3 }}>
                    {selectedStation.title}
                  </h4>
                </div>

                <div className="theory-lessons-nav">
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', padding: '0.25rem 0.5rem' }}>
                    DANH SÁCH BÀI HỌC ({selectedStation.lessons.length} bài):
                  </div>
                  {selectedStation.lessons.map((lesson, idx) => {
                    const isDone = !!completedLessonIds[lesson.id];
                    const isCurrent = idx === activeLessonIndex;
                    return (
                      <button
                        key={lesson.id}
                        className={`theory-lesson-nav-btn ${isCurrent ? 'active' : ''} ${isCurrent && activeTrack === TRACK_TYPES.ICT ? 'ict-active' : ''}`}
                        onClick={() => {
                          setActiveLessonIndex(idx);
                          setSelectedOption(null);
                          setIsAnswerSubmitted(false);
                          setCopiedCode(false);
                        }}
                      >
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            background: isDone ? '#16A34A' : isCurrent ? currentTrackData.badgeColor : '#E2E8F0',
                            color: '#FFFFFF',
                            flexShrink: 0,
                            marginTop: '2px'
                          }}
                        >
                          {isDone ? <Check size={12} strokeWidth={3} /> : idx + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: isCurrent ? 'var(--color-deep)' : '#475569', lineHeight: 1.3 }}>
                            {lesson.title}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '0.2rem' }}>
                            {lesson.bookRef}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Tiện ích sửa dữ liệu cho Admin */}
                <div style={{ padding: '0.75rem 1rem', background: '#F1F5F9', borderTop: '1px solid var(--color-border)', fontSize: '0.72rem', color: '#64748B' }}>
                  <div style={{ fontWeight: 700, marginBottom: '0.2rem', color: 'var(--color-deep)' }}>
                    🛠️ Dành cho Quản Trị Viên:
                  </div>
                  <div>Sửa nội dung lý thuyết bài này tại:</div>
                  <code style={{ fontSize: '0.68rem', color: '#EA580C', wordBreak: 'break-all' }}>
                    {activeTrack === 'cs' ? 'csRoadmap.js' : 'ictRoadmap.js'}
                  </code>
                </div>
              </div>

              {/* Main: Nội dung lý thuyết chi tiết của bài */}
              <div className="theory-modal-main">
                {/* Header thanh trên của modal */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem 1.75rem',
                    borderBottom: '1.5px solid var(--color-border)',
                    background: '#FFFFFF'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: '999px',
                        background: activeTrack === TRACK_TYPES.CS ? '#FFEDD5' : '#E0F2FE',
                        color: currentTrackData.badgeColor,
                        fontSize: '0.75rem',
                        fontWeight: 800
                      }}
                    >
                      {currentLesson.bookRef}
                    </div>
                    <span className="badge-exam-format">
                      {currentLesson.examFormat}
                    </span>
                  </div>

                  <button
                    onClick={handleCloseModal}
                    style={{
                      background: '#F1F5F9',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '6px',
                      cursor: 'pointer',
                      color: '#64748B'
                    }}
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Body: Cuộn nội dung kiến thức bài giảng */}
                <div className="theory-main-content">
                  {/* Tiêu đề bài học & Tóm tắt */}
                  <div>
                    <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--color-deep)', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                      {currentLesson.title}
                    </h2>
                    <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, background: '#F8FAFC', padding: '0.85rem 1.1rem', borderRadius: 'var(--radius-md)', borderLeft: `4px solid ${currentTrackData.badgeColor}` }}>
                      {currentLesson.summary}
                    </p>
                  </div>

                  {/* Mục tiêu cần đạt */}
                  {currentLesson.theory && currentLesson.theory.objectives && (
                    <div style={{ background: '#FAF5FF', border: '1.5px solid #F3E8FF', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem' }}>
                      <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#7E22CE', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Award size={17} />
                        <span>Mục tiêu cốt lõi cần nắm vững trong đề thi:</span>
                      </h4>
                      <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.86rem', color: '#4C1D95', lineHeight: 1.6 }}>
                        {currentLesson.theory.objectives.map((obj, oIdx) => (
                          <li key={oIdx} style={{ marginBottom: '0.25rem' }}>
                            {obj}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Các phần lý thuyết chuyên sâu (Content Sections) */}
                  {currentLesson.theory && currentLesson.theory.contentSections && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      {currentLesson.theory.contentSections.map((sec, sIdx) => (
                        <div key={sIdx}>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-deep)', marginBottom: '0.45rem' }}>
                            {sec.heading}
                          </h3>
                          {sec.text && (
                            <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.65, marginBottom: '0.5rem' }}>
                              {sec.text}
                            </p>
                          )}
                          {sec.bulletPoints && (
                            <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                              {sec.bulletPoints.map((bp, bIdx) => (
                                <li key={bIdx} style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.55 }}>
                                  {bp}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Khối hiển thị Code / Công thức minh họa (Syntax Editor Box) */}
                  {currentLesson.theory && currentLesson.theory.codeSnippet && (
                    <div className="code-editor-box">
                      <div className="code-editor-topbar">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div className="code-editor-dots">
                            <span className="code-editor-dot" style={{ background: '#EF4444' }}></span>
                            <span className="code-editor-dot" style={{ background: '#F59E0B' }}></span>
                            <span className="code-editor-dot" style={{ background: '#10B981' }}></span>
                          </div>
                          <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 700, fontFamily: 'monospace' }}>
                            {currentLesson.theory.codeSnippet.title || 'Mã nguồn / Công thức minh họa'}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopyCode(currentLesson.theory.codeSnippet.code)}
                          style={{
                            background: '#334155',
                            border: 'none',
                            color: '#F8FAFC',
                            padding: '0.3rem 0.65rem',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            cursor: 'pointer'
                          }}
                        >
                          {copiedCode ? <CheckCheck size={13} color="#4ADE80" /> : <Copy size={13} />}
                          <span>{copiedCode ? 'Đã sao chép' : 'Sao chép'}</span>
                        </button>
                      </div>
                      <pre className="code-editor-pre">
                        <code>{currentLesson.theory.codeSnippet.code}</code>
                      </pre>
                    </div>
                  )}

                  {/* Khối Cạm Bẫy Đề Thi & Mẹo Làm Bài (Exam Tips) */}
                  {currentLesson.theory && currentLesson.theory.examTips && (
                    <div className="exam-trap-box">
                      <AlertTriangle size={22} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#B45309', marginBottom: '0.25rem' }}>
                          CẠM BẪY ĐỀ THI & MẸO TRÁNH MẤT ĐIỂM THPTQG:
                        </div>
                        <div style={{ fontSize: '0.86rem', color: '#78350F', lineHeight: 1.55 }}>
                          {currentLesson.theory.examTips}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Khối Câu Hỏi Phản Xạ Tương Tác (Quick Quiz Checkpoint) */}
                  {currentLesson.quiz && (
                    <div style={{ background: '#F8FAFC', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.35rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <Sparkles size={18} color={currentTrackData.badgeColor} />
                        <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--color-deep)' }}>
                          Câu hỏi phản xạ nhanh (Kiểm tra độ hiểu bài ngay)
                        </span>
                      </div>

                      <p style={{ fontSize: '0.9rem', color: 'var(--color-deep)', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.5 }}>
                        {currentLesson.quiz.question}
                      </p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {currentLesson.quiz.options.map((opt, optIdx) => {
                          const isSelected = selectedOption === optIdx;
                          const isCorrect = currentLesson.quiz.answer === optIdx;
                          let btnBg = '#FFFFFF';
                          let btnBorder = 'var(--color-border)';
                          let btnColor = 'var(--color-deep)';

                          if (isAnswerSubmitted) {
                            if (isCorrect) {
                              btnBg = '#DCFCE7';
                              btnBorder = '#22C55E';
                              btnColor = '#15803D';
                            } else if (isSelected && !isCorrect) {
                              btnBg = '#FEE2E2';
                              btnBorder = '#EF4444';
                              btnColor = '#B91C1C';
                            }
                          } else if (isSelected) {
                            btnBg = '#EFF6FF';
                            btnBorder = '#3B82F6';
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => {
                                setSelectedOption(optIdx);
                                setIsAnswerSubmitted(true);
                              }}
                              style={{
                                padding: '0.75rem 1rem',
                                borderRadius: '8px',
                                border: '1.5px solid',
                                borderColor: btnBorder,
                                background: btnBg,
                                color: btnColor,
                                textAlign: 'left',
                                fontSize: '0.86rem',
                                fontWeight: isSelected || (isAnswerSubmitted && isCorrect) ? 700 : 500,
                                cursor: 'pointer',
                                transition: 'all 0.15s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                              }}
                            >
                              <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                              {isAnswerSubmitted && isCorrect && <CheckCircle size={16} color="#16A34A" />}
                              {isAnswerSubmitted && isSelected && !isCorrect && <X size={16} color="#EF4444" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Lời giải thích khi đã chọn */}
                      {isAnswerSubmitted && (
                        <div
                          style={{
                            marginTop: '1rem',
                            padding: '0.85rem 1rem',
                            borderRadius: '8px',
                            background: selectedOption === currentLesson.quiz.answer ? '#F0FDF4' : '#FEF2F2',
                            border: '1px solid',
                            borderColor: selectedOption === currentLesson.quiz.answer ? '#BBF7D0' : '#FECACA',
                            fontSize: '0.82rem',
                            lineHeight: 1.5,
                            color: selectedOption === currentLesson.quiz.answer ? '#166534' : '#991B1B',
                            fontWeight: 600
                          }}
                        >
                          {selectedOption === currentLesson.quiz.answer ? '🎉 Chính xác tuyệt đối! ' : '❌ Chưa chính xác! '}
                          {currentLesson.quiz.explanation}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Modal: Chuyển bài & Đánh dấu hoàn thành */}
                <div
                  style={{
                    padding: '1rem 1.75rem',
                    background: '#F8FAFC',
                    borderTop: '1.5px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      disabled={activeLessonIndex === 0}
                      onClick={() => {
                        setActiveLessonIndex((prev) => Math.max(0, prev - 1));
                        setSelectedOption(null);
                        setIsAnswerSubmitted(false);
                      }}
                      style={{
                        padding: '0.5rem 0.9rem',
                        borderRadius: '8px',
                        background: '#FFFFFF',
                        border: '1px solid var(--color-border)',
                        color: activeLessonIndex === 0 ? '#94A3B8' : 'var(--color-deep)',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        cursor: activeLessonIndex === 0 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <ChevronLeft size={16} />
                      <span>Bài trước</span>
                    </button>

                    <button
                      disabled={activeLessonIndex === selectedStation.lessons.length - 1}
                      onClick={() => {
                        setActiveLessonIndex((prev) => Math.min(selectedStation.lessons.length - 1, prev + 1));
                        setSelectedOption(null);
                        setIsAnswerSubmitted(false);
                      }}
                      style={{
                        padding: '0.5rem 0.9rem',
                        borderRadius: '8px',
                        background: '#FFFFFF',
                        border: '1px solid var(--color-border)',
                        color: activeLessonIndex === selectedStation.lessons.length - 1 ? '#94A3B8' : 'var(--color-deep)',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        cursor: activeLessonIndex === selectedStation.lessons.length - 1 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <span>Bài tiếp theo</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  {/* Nút Đánh dấu hoàn thành bài học */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button
                      onClick={() => handleToggleLessonComplete(currentLesson.id)}
                      style={{
                        padding: '0.6rem 1.25rem',
                        borderRadius: '8px',
                        fontWeight: 800,
                        fontSize: '0.84rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        background: completedLessonIds[currentLesson.id] ? '#DCFCE7' : currentTrackData.badgeColor,
                        color: completedLessonIds[currentLesson.id] ? '#15803D' : '#FFFFFF',
                        border: '1.5px solid',
                        borderColor: completedLessonIds[currentLesson.id] ? '#86EFAC' : currentTrackData.badgeColor
                      }}
                    >
                      {completedLessonIds[currentLesson.id] ? (
                        <>
                          <CheckCircle size={16} />
                          <span>Đã hoàn thành bài này</span>
                        </>
                      ) : (
                        <>
                          <Check size={16} />
                          <span>Đánh dấu đã hiểu bài</span>
                        </>
                      )}
                    </button>

                    <button
                      className="btn-open-station"
                      onClick={handleCloseModal}
                      style={{ padding: '0.6rem 1rem' }}
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
