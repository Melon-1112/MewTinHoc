import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Link as ChainIcon,
  CheckCircle,
  Play,
  BookOpen,
  X,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Flame,
  Check,
  Laptop,
  Cpu,
  AlertTriangle,
  Copy,
  CheckCheck,
  FileText,
  Calendar,
  Layers,
  Award,
  Maximize2,
  Minimize2,
  RefreshCw,
  Cloud,
  Database,
  Download,
  ExternalLink
} from 'lucide-react';

import {
  TRACK_TYPES,
  TRACK_INFO
} from '../data/roadmap';

import {
  fetchRemoteRoadmap,
  downloadRoadmapJSON,
  fetchRemoteRoadmapRaw,
  saveRoadmapToSupabase
} from '../lib/roadmapStorage';

import AdminTheoryEditor from './AdminTheoryEditor';

export default function RoadmapTab({
  completedLessonIds: propCompletedLessonIds,
  onToggleLesson,
  onUpdateMastery,
  user
}) {
  const { track } = useParams();
  const navigate = useNavigate();

  const validTrack = (track && [TRACK_TYPES.ICT, TRACK_TYPES.CS].includes(track.toLowerCase()))
    ? track.toLowerCase()
    : null;

  // 1. Quản lý phân ban: 'cs' (Khoa học máy tính) hoặc 'ict' (Tin học ứng dụng)
  const [activeTrack, setActiveTrack] = useState(() => {
    if (validTrack) return validTrack;
    return localStorage.getItem('tinhoc_selected_track') || TRACK_TYPES.ICT;
  });

  // Tự động đồng bộ khi URL thay đổi (VD người dùng nhấn Back/Forward)
  useEffect(() => {
    if (validTrack && validTrack !== activeTrack) {
      setActiveTrack(validTrack);
      localStorage.setItem('tinhoc_selected_track', validTrack);
    }
  }, [validTrack]);

  // 2. Trạng thái các bài học đã hoàn thành: ưu tiên từ Supabase Realtime prop, fallback localStorage
  const [internalCompletedLessonIds, setInternalCompletedLessonIds] = useState(() => {
    try {
      const saved = localStorage.getItem('tinhoc_completed_lessons');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const completedLessonIds = propCompletedLessonIds || internalCompletedLessonIds;

  // 3. Modal xem lý thuyết chặng

  const [selectedStation, setSelectedStation] = useState(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);

  // Chế độ hiển thị trong modal: 'pdf' (Stream tài liệu PDF) hoặc 'theory' (Học từng bài)
  const [modalTab, setModalTab] = useState('pdf');

  // Chế độ học tập trung (Study Focus Mode)
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fontSizeLevel, setFontSizeLevel] = useState(1); // 0: 0.94rem, 1: 1.03rem, 2: 1.15rem

  // 4. Trạng thái câu hỏi phản xạ trong bài học đang xem
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // 5. Accordion hiển thị Cấu trúc đề thi & Kế hoạch 12 tuần
  const [showBlueprint, setShowBlueprint] = useState(false);
  const [showTwelveWeekPlan, setShowTwelveWeekPlan] = useState(false);

  // 6. Dữ liệu lộ trình tải từ Supabase Storage (KhoTaiLieuTinHocThiThu/LoTrinhDayXich)
  const [remoteTrackData, setRemoteTrackData] = useState({});
  const [syncStatus, setSyncStatus] = useState({});
  const [isSyncing, setIsSyncing] = useState(false);

  // 7. Trình soạn thảo lý thuyết trực tiếp cho Admin (đồng bộ ngược lên Supabase Storage)
  const [isEditingTheory, setIsEditingTheory] = useState(false);
  const [isSavingTheory, setIsSavingTheory] = useState(false);
  const [theorySaveStatus, setTheorySaveStatus] = useState(null);
  const [rawRoadmapCache, setRawRoadmapCache] = useState({});

  // Tải dữ liệu lộ trình từ Supabase Storage
  const loadRoadmapFromSupabase = async (trackToLoad = activeTrack) => {
    setIsSyncing(true);
    try {
      const res = await fetchRemoteRoadmap(trackToLoad);
      setSyncStatus((prev) => ({
        ...prev,
        [trackToLoad]: {
          source: res.source, // 'supabase' | 'local'
          message: res.message,
          updatedAt: res.updatedAt || new Date().toLocaleTimeString('vi-VN'),
          success: res.success
        }
      }));
      if (res.success && res.data) {
        setRemoteTrackData((prev) => ({
          ...prev,
          [trackToLoad]: res.data
        }));
      }
    } catch (e) {
      console.warn('Lỗi khi tải dữ liệu lộ trình từ Supabase:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  // Tự động tải từ Supabase khi mở trang hoặc khi đổi phân ban
  useEffect(() => {
    loadRoadmapFromSupabase(activeTrack);
  }, [activeTrack]);

  const baseTrackData = TRACK_INFO[activeTrack] || TRACK_INFO[TRACK_TYPES.ICT];
  const dynamicTrackData = remoteTrackData[activeTrack];

  const currentTrackData = {
    ...baseTrackData,
    ...(dynamicTrackData ? {
      stations: dynamicTrackData.stations || baseTrackData.stations,
      examStructure: dynamicTrackData.examStructure || baseTrackData.examStructure,
      twelveWeekPlan: dynamicTrackData.twelveWeekPlan || baseTrackData.twelveWeekPlan
    } : {})
  };

  const stations = currentTrackData.stations;
  const currentSync = syncStatus[activeTrack];
  const isCloudSynced = currentSync?.source === 'supabase';

  // Khi stations cập nhật từ Supabase, đồng bộ lại selectedStation nếu đang mở modal
  useEffect(() => {
    if (selectedStation) {
      const refreshed = stations.find((st) => st.id === selectedStation.id);
      if (refreshed) {
        setSelectedStation(refreshed);
      }
    }
  }, [stations]);

  // Lưu track vào localStorage và cập nhật đường dẫn URL rẽ nhánh
  const handleSwitchTrack = (trackId) => {
    setActiveTrack(trackId);
    localStorage.setItem('tinhoc_selected_track', trackId);
    setSelectedStation(null);
    navigate(`/roadmap/${trackId}`);
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

  // Mở modal học lý thuyết chặng hoặc stream PDF trực tiếp
  const handleOpenStationModal = (station, lessonIdx = 0, startImmediately = false, preferredTab = null) => {
    setSelectedStation(station);
    setActiveLessonIndex(lessonIdx);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setCopiedCode(false);
    setIsEditingTheory(false);
    setTheorySaveStatus(null);

    // Nếu chỉ định preferredTab, dùng preferredTab; nếu có pdfUrl thì ưu tiên stream PDF trực tiếp!
    if (preferredTab) {
      setModalTab(preferredTab);
    } else if (station?.pdfUrl) {
      setModalTab('pdf');
    } else {
      setModalTab('theory');
    }

    if (startImmediately) {
      setIsStudyMode(true);
      setIsSidebarCollapsed(true);
    } else {
      setIsStudyMode(false);
      setIsSidebarCollapsed(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedStation(null);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setIsStudyMode(false);
    setIsSidebarCollapsed(false);
    setIsFullScreen(false);
    setIsEditingTheory(false);
    setTheorySaveStatus(null);
    setModalTab('pdf');
  };

  // Chuyển đổi trạng thái đã học / chưa học của một bài (đồng bộ CSDL Supabase Realtime)
  const handleToggleLessonComplete = async (lessonId) => {
    if (onToggleLesson) {
      await onToggleLesson(lessonId, activeTrack);
    } else {
      setInternalCompletedLessonIds((prev) => {
        const next = { ...prev, [lessonId]: !prev[lessonId] };
        localStorage.setItem('tinhoc_completed_lessons', JSON.stringify(next));
        return next;
      });
    }

    // Tự động gia tăng mức độ làm chủ khối kiến thức tương ứng nếu đang học chặng này
    if (onUpdateMastery && selectedStation) {
      const text = ((selectedStation.title || '') + ' ' + (selectedStation.domain || '') + ' ' + (selectedStation.subTitle || '')).toLowerCase();
      if (text.includes('python') || text.includes('thuật toán') || text.includes('lập trình')) {
        // block python: tăng nhẹ tiến độ nếu chưa 100
        onUpdateMastery('python', (prev) => Math.min(100, (prev || 88) + 2));
      } else if (text.includes('sql') || text.includes('cơ sở dữ liệu') || text.includes('csdl') || text.includes('database')) {
        onUpdateMastery('sql', (prev) => Math.min(100, (prev || 65) + 3));
      } else if (text.includes('mạng') || text.includes('internet') || text.includes('ip') || text.includes('network')) {
        onUpdateMastery('network', (prev) => Math.min(100, (prev || 45) + 3));
      } else if (text.includes('an toàn') || text.includes('đạo đức') || text.includes('pháp luật') || text.includes('bảo mật') || text.includes('safety')) {
        onUpdateMastery('safety', (prev) => Math.min(100, (prev || 80) + 2));
      }
    }
  };


  // Sao chép mã nguồn minh họa
  const handleCopyCode = (codeText) => {
    if (!codeText) return;
    navigator.clipboard.writeText(codeText);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // ====== TÍNH NĂNG QUẢN TRỊ: CHỈNH SỬA LÝ THUYẾT TRỰC TIẾP ======

  // Nạp bản ghi roadmap gốc (raw) từ Supabase để Admin soạn thảo
  const loadRawRoadmap = async (trackToLoad = activeTrack) => {
    const res = await fetchRemoteRoadmapRaw(trackToLoad);
    if (res?.raw) {
      setRawRoadmapCache((prev) => ({ ...prev, [trackToLoad]: res.raw }));
      return res.raw;
    }
    return null;
  };

  // Bắt đầu chỉnh sửa bài học đang mở trong modal
  const handleStartEditTheory = async () => {
    setTheorySaveStatus(null);
    setIsEditingTheory(true);
    if (!rawRoadmapCache[activeTrack]) {
      await loadRawRoadmap(activeTrack);
    }
  };

  const handleCancelEditTheory = () => {
    setIsEditingTheory(false);
    setTheorySaveStatus(null);
  };

  // Lưu thay đổi: cập nhật lesson vào đúng chặng -> upload toàn bộ JSON lên Supabase -> refresh UI
  const handleSaveTheory = async (updatedLesson) => {
    setIsSavingTheory(true);
    setTheorySaveStatus(null);
    try {
      let baseRaw = rawRoadmapCache[activeTrack];
      if (!baseRaw) baseRaw = await loadRawRoadmap(activeTrack);
      if (!baseRaw || !Array.isArray(baseRaw.stations)) {
        throw new Error('Không tải được dữ liệu lộ trình gốc từ Supabase.');
      }

      // Ghi đè bài học vừa sửa vào đúng vị trí trong cây dữ liệu
      const newStations = baseRaw.stations.map((st) => ({
        ...st,
        lessons: (st.lessons || []).map((l) =>
          l.id === updatedLesson.id ? { ...l, ...updatedLesson } : l
        )
      }));

      const payload = { ...baseRaw, stations: newStations };
      const result = await saveRoadmapToSupabase(activeTrack, payload);

      if (!result?.success) {
        throw new Error(result?.error || 'Upload lên Supabase thất bại.');
      }

      // Cập nhật cache + giao diện ngay lập tức (không cần tải lại trang)
      setRawRoadmapCache((prev) => ({ ...prev, [activeTrack]: payload }));
      setRemoteTrackData((prev) => ({ ...prev, [activeTrack]: payload }));
      setSelectedStation((prev) =>
        prev ? newStations.find((st) => st.id === prev.id) || prev : prev
      );

      setTheorySaveStatus({
        type: 'success',
        msg: `Đã lưu & đồng bộ lên Supabase Storage (${
          activeTrack === TRACK_TYPES.CS ? 'csRoadmap.json' : 'ictRoadmap.json'
        }). Học viên sẽ nhận nội dung mới ngay lập tức.`
      });
      setIsEditingTheory(false);
    } catch (e) {
      setTheorySaveStatus({
        type: 'error',
        msg: 'Lỗi khi đồng bộ lên Supabase: ' + (e?.message || 'Không xác định')
      });
    } finally {
      setIsSavingTheory(false);
    }
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

          {/* Thanh trạng thái đồng bộ Supabase Cloud & Tiện ích Admin (Chỉ hiển thị cho người công ty có quyền Admin) */}
          {user?.isAdmin && (
            <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  padding: '0.35rem 0.75rem',
                  borderRadius: '8px',
                  background: isCloudSynced ? '#DCFCE7' : '#FEF3C7',
                  color: isCloudSynced ? '#15803D' : '#B45309',
                  border: `1px solid ${isCloudSynced ? '#86EFAC' : '#FDE68A'}`
                }}
                title={
                  isCloudSynced
                    ? `Đang dùng dữ liệu trực tiếp từ Supabase Storage: KhoTaiLieuTinHocThiThu/LoTrinhDayXich/${activeTrack === 'cs' ? 'csRoadmap.json' : 'ictRoadmap.json'}`
                    : `Chưa tìm thấy file trên Supabase Storage. Đang dùng dữ liệu cục bộ mặc định.`
                }
              >
                {isCloudSynced ? <Cloud size={14} color="#16A34A" /> : <Database size={14} color="#D97706" />}
                <span>
                  {isCloudSynced
                    ? `Supabase Live: ${activeTrack === 'cs' ? 'csRoadmap.json' : 'ictRoadmap.json'} (${currentSync.updatedAt})`
                    : `Dữ liệu nội bộ (Chưa có trên Supabase)`}
                </span>
              </div>

              {/* Nút Làm mới / Refresh từ Supabase */}
              <button
                onClick={() => loadRoadmapFromSupabase(activeTrack)}
                disabled={isSyncing}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  padding: '0.35rem 0.65rem',
                  borderRadius: '8px',
                  background: '#FFFFFF',
                  color: 'var(--color-deep)',
                  border: '1px solid var(--color-border)',
                  cursor: isSyncing ? 'not-allowed' : 'pointer'
                }}
                title="Tải lại nội dung mới nhất từ Supabase Storage mà không bị cache"
              >
                <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
                <span>{isSyncing ? 'Đang đồng bộ...' : 'Làm mới'}</span>
              </button>

              {/* Nút Tải file JSON mẫu về máy */}
              <button
                onClick={() => downloadRoadmapJSON(activeTrack)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  padding: '0.35rem 0.65rem',
                  borderRadius: '8px',
                  background: '#FFFFFF',
                  color: '#EA580C',
                  border: '1px solid #FED7AA',
                  cursor: 'pointer'
                }}
                title="Tải file JSON chuẩn của phân ban này về máy để kéo thả vào Supabase Storage"
              >
                <Download size={13} />
                <span>Tải file {activeTrack === 'cs' ? 'csRoadmap.json' : 'ictRoadmap.json'}</span>
              </button>
            </div>
          )}
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
                <div
                  className={`chain-link-connector ${isCompleted || isInProgress ? 'unlocked' : 'locked'}`}
                  onClick={() => handleOpenStationModal(station, 0, false, station.pdfUrl ? 'pdf' : 'theory')}
                  style={{ cursor: 'pointer' }}
                  title={station.pdfUrl ? `Bấm vào mắt xích để stream tài liệu PDF: ${station.title}` : `Bấm vào mắt xích để mở chặng: ${station.title}`}
                >
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
                onClick={() => handleOpenStationModal(station, 0, false, station.pdfUrl ? 'pdf' : 'theory')}
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

                      {/* Badge báo có PDF stream trực tiếp */}
                      {station.pdfUrl && (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            padding: '0.15rem 0.55rem',
                            borderRadius: '6px',
                            background: '#FEF2F2',
                            color: '#DC2626',
                            border: '1px solid #FECACA'
                          }}
                        >
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#EF4444' }} />
                          PDF LIVE
                        </span>
                      )}

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
                                handleOpenStationModal(station, lIdx, true, 'theory');
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

                  {/* Nút stream PDF trực tiếp nếu chặng có PDF đính kèm */}
                  {station.pdfUrl && (
                    <button
                      className="btn-stream-pdf"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenStationModal(station, 0, false, 'pdf');
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.45rem',
                        width: '100%',
                        padding: '0.55rem 0.85rem',
                        borderRadius: 'var(--radius-md)',
                        background: activeTrack === TRACK_TYPES.CS
                          ? 'linear-gradient(135deg, #EA580C, #C2410C)'
                          : 'linear-gradient(135deg, #0284C7, #0369A1)',
                        color: '#FFFFFF',
                        fontWeight: 800,
                        fontSize: '0.82rem',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                        transition: 'all 0.15s ease',
                        marginBottom: '0.45rem'
                      }}
                      title={`Stream trực tiếp tài liệu PDF của ${station.title} trên web`}
                    >
                      <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: '#4ADE80' }} />
                      <FileText size={15} />
                      <span>Stream PDF Trực Tiếp</span>
                    </button>
                  )}

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
            className={`exam-taker-window ${isStudyMode || modalTab === 'pdf' ? 'study-focus-mode' : ''} ${isFullScreen ? 'full-screen-mode' : ''}`}
            style={{
              maxWidth: isFullScreen ? '100vw' : (isStudyMode || modalTab === 'pdf') ? '1400px' : '1050px',
              width: isFullScreen ? '100vw' : (isStudyMode || modalTab === 'pdf') ? '96vw' : '92vw',
              height: isFullScreen ? '100vh' : (isStudyMode || modalTab === 'pdf') ? '94vh' : '88vh',
              padding: 0
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Container: 2 Cột (Sidebar bài học + Nội dung lý thuyết) */}
            <div className={`theory-modal-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
              {/* Sidebar: Danh sách các bài học trong chặng */}
              <div className={`theory-modal-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
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
                    const isCurrent = idx === activeLessonIndex && modalTab === 'theory';
                    return (
                      <button
                        key={lesson.id}
                        className={`theory-lesson-nav-btn ${isCurrent ? 'active' : ''} ${isCurrent && activeTrack === TRACK_TYPES.ICT ? 'ict-active' : ''}`}
                        onClick={() => {
                          setActiveLessonIndex(idx);
                          setSelectedOption(null);
                          setIsAnswerSubmitted(false);
                          setCopiedCode(false);
                          setModalTab('theory');
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

                {/* Nút xem tài liệu PDF đính kèm (nếu có) */}
                {selectedStation.pdfUrl && (
                  <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--color-border)' }}>
                    <button
                      onClick={() => setModalTab('pdf')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '8px',
                        background: modalTab === 'pdf'
                          ? (activeTrack === TRACK_TYPES.CS ? 'linear-gradient(135deg, #FFF7ED, #FFEDD5)' : 'linear-gradient(135deg, #EFF6FF, #DBEAFE)')
                          : '#FFFFFF',
                        border: `1.5px solid ${modalTab === 'pdf' ? currentTrackData.badgeColor : 'var(--color-border)'}`,
                        color: modalTab === 'pdf' ? currentTrackData.badgeColor : 'var(--color-deep)',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      title={`Stream trực tiếp tài liệu ôn tập PDF của ${selectedStation.title}`}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FileText size={16} color={currentTrackData.badgeColor} />
                        <span>📄 Stream PDF Trực Tiếp</span>
                      </div>
                      <span
                        style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          backgroundColor: modalTab === 'pdf' ? '#22C55E' : '#CBD5E1'
                        }}
                      />
                    </button>
                  </div>
                )}

                {/* Tiện ích Quản trị viên chỉ hiển thị cho người có quyền Admin */}
                {!isStudyMode && user?.isAdmin && (
                  <div style={{ padding: '0.75rem 1rem', background: '#F1F5F9', borderTop: '1px solid var(--color-border)', fontSize: '0.72rem', color: '#64748B' }}>
                    <div style={{ fontWeight: 700, marginBottom: '0.2rem', color: 'var(--color-deep)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Cloud size={13} color={isCloudSynced ? '#16A34A' : '#EA580C'} />
                      <span>Nguồn dữ liệu: {isCloudSynced ? 'Đám mây Supabase Live' : 'Cục bộ (Dự phòng)'}</span>
                    </div>
                    <div>Sửa dữ liệu tại:</div>
                    <code style={{ fontSize: '0.68rem', color: '#EA580C', wordBreak: 'break-all' }}>
                      {isCloudSynced
                        ? `Supabase Storage: KhoTaiLieuTinHocThiThu/LoTrinhDayXich/${activeTrack === 'cs' ? 'csRoadmap.json' : 'ictRoadmap.json'}`
                        : `src/data/roadmap/${activeTrack === 'cs' ? 'csRoadmap.js' : 'ictRoadmap.js'}`}
                    </code>
                  </div>
                )}
              </div>

              {/* Main: Nội dung lý thuyết chi tiết của bài */}
              <div className="theory-modal-main">
                {/* Header thanh trên của modal */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1.5rem',
                    borderBottom: '1.5px solid var(--color-border)',
                    background: '#FFFFFF',
                    gap: '0.75rem',
                    flexWrap: 'wrap'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                    {/* Nút bật/tắt Sidebar mục lục trong chế độ học */}
                    {isStudyMode && modalTab === 'theory' && (
                      <button
                        className="theory-toolbar-btn"
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        title={isSidebarCollapsed ? "Mở danh sách bài học" : "Thu gọn mục lục bài học"}
                      >
                        <Layers size={15} />
                        <span>{isSidebarCollapsed ? `Mục lục (${selectedStation.lessons.length} bài)` : 'Thu gọn'}</span>
                      </button>
                    )}

                    {/* Bộ chuyển đổi Tab: PDF Stream vs Lý thuyết bài học */}
                    {selectedStation.pdfUrl && (
                      <div style={{ display: 'inline-flex', padding: '3px', background: '#F1F5F9', borderRadius: '10px', gap: '4px' }}>
                        <button
                          onClick={() => setModalTab('pdf')}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.35rem 0.85rem',
                            borderRadius: '7px',
                            fontSize: '0.78rem',
                            fontWeight: 800,
                            border: 'none',
                            cursor: 'pointer',
                            background: modalTab === 'pdf' ? (activeTrack === TRACK_TYPES.CS ? '#EA580C' : '#0284C7') : 'transparent',
                            color: modalTab === 'pdf' ? '#FFFFFF' : '#64748B',
                            boxShadow: modalTab === 'pdf' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span style={{
                            display: 'inline-block',
                            width: '7px',
                            height: '7px',
                            borderRadius: '50%',
                            backgroundColor: modalTab === 'pdf' ? '#4ADE80' : '#94A3B8'
                          }} />
                          <FileText size={14} />
                          <span>Stream PDF Trực Tiếp</span>
                        </button>
                        <button
                          onClick={() => setModalTab('theory')}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.35rem 0.85rem',
                            borderRadius: '7px',
                            fontSize: '0.78rem',
                            fontWeight: 800,
                            border: 'none',
                            cursor: 'pointer',
                            background: modalTab === 'theory' ? (activeTrack === TRACK_TYPES.CS ? '#EA580C' : '#0284C7') : 'transparent',
                            color: modalTab === 'theory' ? '#FFFFFF' : '#64748B',
                            boxShadow: modalTab === 'theory' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <BookOpen size={14} />
                          <span>Lý Thuyết & Câu Hỏi ({selectedStation.lessons?.length || 0} bài)</span>
                        </button>
                      </div>
                    )}

                    {modalTab === 'theory' && (
                      <>
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

                        {/* Nút Chỉnh sửa trực tiếp: chỉ hiển thị với tài khoản Admin */}
                        {user?.isAdmin && (
                          isEditingTheory ? (
                            <button
                              onClick={handleCancelEditTheory}
                              className="theory-toolbar-btn"
                              style={{ borderColor: '#FCA5A5', background: '#FEF2F2', color: '#DC2626', fontWeight: 800 }}
                              title="Thoát chế độ chỉnh sửa"
                            >
                              <X size={14} />
                              <span>Đang chỉnh sửa</span>
                            </button>
                          ) : (
                            <button
                              onClick={handleStartEditTheory}
                              className="theory-toolbar-btn"
                              style={{ borderColor: '#FDBA74', background: '#FFF7ED', color: '#C2410C', fontWeight: 800 }}
                              title="Bật chế độ chỉnh sửa lý thuyết bài này (Admin)"
                            >
                              <FileText size={14} />
                              <span>Chỉnh sửa nội dung</span>
                            </button>
                          )
                        )}
                      </>
                    )}
                  </div>

                  {/* Thanh công cụ phụ trợ (Cỡ chữ, Toàn màn hình, Thoát) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {modalTab === 'theory' && isStudyMode && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <button
                          className="theory-toolbar-btn"
                          onClick={() => setFontSizeLevel((prev) => Math.max(0, prev - 1))}
                          title="Giảm cỡ chữ"
                        >
                          A-
                        </button>
                        <button
                          className="theory-toolbar-btn"
                          onClick={() => setFontSizeLevel((prev) => Math.min(2, prev + 1))}
                          title="Tăng cỡ chữ"
                        >
                          A+
                        </button>
                      </div>
                    )}

                    <button
                      className="theory-toolbar-btn"
                      onClick={() => setIsFullScreen(!isFullScreen)}
                      title={isFullScreen ? "Thu nhỏ cửa sổ" : "Phóng to toàn màn hình"}
                    >
                      {isFullScreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                    </button>

                    <button
                      onClick={handleCloseModal}
                      style={{
                        background: '#F1F5F9',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '6px',
                        cursor: 'pointer',
                        color: '#64748B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Đóng cửa sổ"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {/* Body: Stream PDF trực tiếp hoặc Cuộn nội dung kiến thức bài giảng */}
                {modalTab === 'pdf' && selectedStation.pdfUrl ? (
                  <div
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      height: '100%',
                      width: '100%',
                      background: '#0F172A',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Thanh điều khiển mini của PDF Stream */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.55rem 1.25rem',
                        background: '#1E293B',
                        color: '#E2E8F0',
                        borderBottom: '1px solid #334155',
                        fontSize: '0.78rem',
                        flexWrap: 'wrap',
                        gap: '0.6rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.2rem 0.65rem',
                            borderRadius: '999px',
                            background: 'rgba(34, 197, 94, 0.2)',
                            color: '#4ADE80',
                            fontWeight: 800,
                            fontSize: '0.72rem',
                            border: '1px solid rgba(74, 222, 128, 0.35)'
                          }}
                        >
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ADE80' }} />
                          LIVE STREAM TỪ SUPABASE
                        </span>
                        <span style={{ fontWeight: 700, color: '#F8FAFC', fontSize: '0.82rem' }}>
                          {selectedStation.code}: {selectedStation.title} — Tài Liệu Ôn Thi PDF Gốc
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <a
                          href={selectedStation.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.32rem 0.75rem',
                            borderRadius: '7px',
                            background: '#334155',
                            color: '#F8FAFC',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            textDecoration: 'none',
                            transition: 'background 0.15s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#475569'}
                          onMouseLeave={(e) => e.currentTarget.style.background = '#334155'}
                          title="Mở tài liệu PDF trong tab riêng của trình duyệt"
                        >
                          <ExternalLink size={13} />
                          <span>Mở Tab Riêng</span>
                        </a>

                        <a
                          href={selectedStation.pdfUrl}
                          download
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.32rem 0.75rem',
                            borderRadius: '7px',
                            background: '#334155',
                            color: '#F8FAFC',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            textDecoration: 'none',
                            transition: 'background 0.15s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#475569'}
                          onMouseLeave={(e) => e.currentTarget.style.background = '#334155'}
                          title="Tải file PDF về máy"
                        >
                          <Download size={13} />
                          <span>Tải PDF</span>
                        </a>

                        <button
                          onClick={() => setIsFullScreen(!isFullScreen)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.32rem 0.75rem',
                            borderRadius: '7px',
                            background: activeTrack === TRACK_TYPES.CS ? '#EA580C' : '#0284C7',
                            color: '#FFFFFF',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'opacity 0.15s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
                          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                          title={isFullScreen ? "Thu nhỏ cửa sổ" : "Phóng to toàn màn hình"}
                        >
                          {isFullScreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                          <span>{isFullScreen ? 'Thu nhỏ' : 'Toàn màn hình'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Iframe trực tiếp stream PDF */}
                    <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%', minHeight: '500px' }}>
                      <iframe
                        src={`${selectedStation.pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                        title={`${selectedStation.title} - Tài liệu ôn thi`}
                        style={{
                          width: '100%',
                          height: '100%',
                          border: 'none',
                          display: 'block',
                          backgroundColor: '#525659'
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Body: Cuộn nội dung kiến thức bài giảng */}
                    <div
                  className="theory-main-content"
                  style={{
                    fontSize: fontSizeLevel === 0 ? '0.94rem' : fontSizeLevel === 2 ? '1.14rem' : '1.03rem'
                  }}
                >
                  {/* Banner kết quả lưu lý thuyết (Admin) */}
                  {user?.isAdmin && theorySaveStatus?.msg && !isEditingTheory && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.55rem',
                        padding: '0.85rem 1.1rem',
                        marginBottom: '1rem',
                        borderRadius: '10px',
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        background: theorySaveStatus.type === 'success' ? '#F0FDF4' : '#FEF2F2',
                        border: `1.5px solid ${theorySaveStatus.type === 'success' ? '#BBF7D0' : '#FECACA'}`,
                        color: theorySaveStatus.type === 'success' ? '#166534' : '#991B1B'
                      }}
                    >
                      {theorySaveStatus.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
                      <span style={{ flex: 1 }}>{theorySaveStatus.msg}</span>
                      <button
                        onClick={() => setTheorySaveStatus(null)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex' }}
                        title="Đóng thông báo"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}

                  {isEditingTheory && user?.isAdmin ? (
                    /* TRÌNH SOẠN THẢO LÝ THUYẾT TRỰC TIẾP (ADMIN) */
                    <AdminTheoryEditor
                      key={currentLesson.id}
                      lesson={currentLesson}
                      isSaving={isSavingTheory}
                      status={theorySaveStatus}
                      onSave={handleSaveTheory}
                      onCancel={handleCancelEditTheory}
                    />
                  ) : !isStudyMode ? (
                    /* MÀN HÌNH PREVIEW & NÚT BẮT ĐẦU HỌC TO RÕ RÀNG */
                    <div className="lesson-preview-card">
                      <div
                        style={{
                          display: 'inline-flex',
                          padding: '1.25rem',
                          borderRadius: '50%',
                          background: activeTrack === TRACK_TYPES.ICT ? '#E0F2FE' : '#FFEDD5',
                          color: currentTrackData.badgeColor
                        }}
                      >
                        <BookOpen size={42} strokeWidth={2.2} />
                      </div>

                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: currentTrackData.badgeColor, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                          {selectedStation.code} • {currentLesson.bookRef}
                        </div>
                        <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--color-deep)', marginBottom: '0.65rem', lineHeight: 1.3 }}>
                          {currentLesson.title}
                        </h2>
                        <p className="theory-summary-text" style={{ fontSize: '0.98rem', color: '#475569', lineHeight: 1.65, maxWidth: '640px', margin: '0 auto', textAlign: 'left' }}>
                          {currentLesson.summary}
                        </p>
                      </div>

                      {/* Mục tiêu cốt lõi xem trước */}
                      {currentLesson.theory && currentLesson.theory.objectives && (
                        <div style={{ textAlign: 'left', width: '100%', background: '#FAF5FF', border: '1.5px solid #F3E8FF', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                          <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#7E22CE', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Award size={18} />
                            <span>Mục tiêu cốt lõi cần nắm vững trong bài:</span>
                          </h4>
                          <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.9rem', color: '#4C1D95', lineHeight: 1.6 }}>
                            {currentLesson.theory.objectives.map((obj, oIdx) => (
                              <li key={oIdx} className="theory-objective-item" style={{ marginBottom: '0.35rem' }}>
                                {obj}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* NÚT BẮT ĐẦU HỌC */}
                      <button
                        className={`btn-start-learning ${activeTrack === TRACK_TYPES.ICT ? 'ict' : ''}`}
                        style={{ background: currentTrackData.gradientBg, marginTop: '0.5rem' }}
                        onClick={() => {
                          setIsStudyMode(true);
                          setIsSidebarCollapsed(true);
                        }}
                      >
                        <Play size={22} fill="#FFFFFF" />
                        <span>BẮT ĐẦU HỌC BÀI NÀY</span>
                        <ChevronRight size={22} />
                      </button>

                      <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                        💡 Sau khi bấm, toàn bộ bài học sẽ phóng to toàn màn hình và thu nhỏ các thanh tiện ích để bạn dễ dàng ghi chép.
                      </div>
                    </div>
                  ) : (
                    /* CHẾ ĐỘ HỌC PHÓNG TO & ĐỌC LÝ THUYẾT CHI TIẾT */
                    <div className="theory-reading-container">
                      {/* Tiêu đề bài học & Tóm tắt */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: currentTrackData.badgeColor, textTransform: 'uppercase' }}>
                            {selectedStation.code} • {currentLesson.bookRef}
                          </span>
                        </div>
                        <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--color-deep)', marginBottom: '0.75rem', lineHeight: 1.3 }}>
                          {currentLesson.title}
                        </h1>
                        <p className="theory-summary-text" style={{ fontSize: '1.02rem', color: '#475569', lineHeight: 1.7, background: '#F8FAFC', padding: '1rem 1.35rem', borderRadius: 'var(--radius-md)', borderLeft: `5px solid ${currentTrackData.badgeColor}`, margin: 0 }}>
                          {currentLesson.summary}
                        </p>
                      </div>

                      {/* Mục tiêu cần đạt */}
                      {currentLesson.theory && currentLesson.theory.objectives && (
                        <div style={{ background: '#FAF5FF', border: '1.5px solid #F3E8FF', borderRadius: 'var(--radius-md)', padding: '1.25rem 1.5rem' }}>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#7E22CE', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                            <Award size={19} />
                            <span>Mục tiêu cốt lõi cần nắm vững & ghi chép:</span>
                          </h4>
                          <ul style={{ margin: 0, paddingLeft: '1.35rem', fontSize: '0.95rem', color: '#4C1D95', lineHeight: 1.7 }}>
                            {currentLesson.theory.objectives.map((obj, oIdx) => (
                              <li key={oIdx} className="theory-objective-item" style={{ marginBottom: '0.35rem' }}>
                                {obj}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* CÁC PHẦN LÝ THUYẾT CHUYÊN SÂU */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <BookOpen size={20} color={currentTrackData.badgeColor} />
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-deep)', margin: 0 }}>
                            Nội Dung Lý Thuyết Chi Tiết:
                          </h3>
                        </div>

                        {currentLesson.theory && currentLesson.theory.contentSections && currentLesson.theory.contentSections.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {currentLesson.theory.contentSections.map((sec, sIdx) => (
                              <div key={sIdx} className="theory-section-box">
                                {sec.heading && (
                                  <h3 className="theory-section-title">
                                    <span>{sec.heading}</span>
                                  </h3>
                                )}
                                {sec.text && (
                                  <p className="theory-section-text">
                                    {sec.text}
                                  </p>
                                )}
                                {sec.bulletPoints && (
                                  <ul className="theory-bullet-list">
                                    {sec.bulletPoints.map((bp, bIdx) => (
                                      <li key={bIdx} className="theory-bullet-item">
                                        {bp}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="theory-section-box" style={{ textAlign: 'center', padding: '2.5rem 1.5rem', background: '#F8FAFC', border: '1.5px dashed #CBD5E1' }}>
                            <BookOpen size={36} color="#94A3B8" style={{ margin: '0 auto 0.75rem auto', display: 'block' }} />
                            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-deep)', marginBottom: '0.4rem' }}>
                              {user?.isAdmin ? '* Chưa thiết lập nội dung lý thuyết cho bài này' : 'Nội dung lý thuyết đang được cập nhật'}
                            </h4>
                            <p style={{ fontSize: '0.9rem', color: '#64748B', maxWidth: '540px', margin: '0 auto', lineHeight: 1.6 }}>
                              {user?.isAdmin ? (
                                <>Phần lý thuyết có thể chỉnh sửa trực tiếp trên Supabase Storage tại: <code style={{ color: '#EA580C', fontWeight: 700 }}>KhoTaiLieuTinHocThiThu/LoTrinhDayXich/{activeTrack === 'cs' ? 'csRoadmap.json' : 'ictRoadmap.json'}</code>.</>
                              ) : (
                                'Bài học lý thuyết chi tiết này đang được đội ngũ giáo viên hoàn thiện và sẽ sớm cập nhật đầy đủ.'
                              )}
                            </p>
                          </div>
                        )}
                      </div>

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
                              <span style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: 700, fontFamily: 'monospace' }}>
                                {currentLesson.theory.codeSnippet.title || 'Mã nguồn / Công thức minh họa'}
                              </span>
                            </div>
                            <button
                              onClick={() => handleCopyCode(currentLesson.theory.codeSnippet.code)}
                              style={{
                                background: '#334155',
                                border: 'none',
                                color: '#F8FAFC',
                                padding: '0.35rem 0.75rem',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                cursor: 'pointer'
                              }}
                            >
                              {copiedCode ? <CheckCheck size={14} color="#4ADE80" /> : <Copy size={14} />}
                              <span>{copiedCode ? 'Đã sao chép' : 'Sao chép'}</span>
                            </button>
                          </div>
                          <pre className="code-editor-pre" style={{ fontSize: '0.92rem', lineHeight: 1.6 }}>
                            <code>{currentLesson.theory.codeSnippet.code}</code>
                          </pre>
                        </div>
                      )}

                      {/* ========================================================================= */}
                      {/* PHẦN CẠM BẪY VÀ CÂU HỎI PHẢN XẠ Ở CUỐI TRANG LÝ THUYẾT (THEO ĐÚNG YÊU CẦU) */}
                      {/* ========================================================================= */}
                      <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* 1. Khối Cạm Bẫy Đề Thi & Mẹo Làm Bài (Exam Tips) */}
                        <div className="exam-trap-box" style={{ padding: '1.25rem 1.5rem' }}>
                          <AlertTriangle size={26} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#B45309', marginBottom: '0.35rem' }}>
                              ⚠️ CẠM BẪY ĐỀ THI & MẸO TRÁNH MẤT ĐIỂM THPTQG:
                            </div>
                            <div className="theory-exam-tips-text" style={{ fontSize: '0.94rem', color: '#78350F', lineHeight: 1.65 }}>
                              {currentLesson.theory && currentLesson.theory.examTips ? (
                                currentLesson.theory.examTips
                              ) : (
                                <span style={{ fontStyle: 'italic', color: '#92400E' }}>
                                  * Chưa thiết lập mẹo làm bài riêng cho bài học này. Hãy ôn kỹ các khái niệm cốt lõi để tránh bẫy câu hỏi trắc nghiệm!
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* 2. Khối Câu Hỏi Phản Xạ Tương Tác (Quick Quiz Checkpoint) */}
                        <div style={{ background: '#F8FAFC', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem 1.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                            <Sparkles size={20} color={currentTrackData.badgeColor} />
                            <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-deep)' }}>
                              Câu hỏi phản xạ nhanh (Tự kiểm tra kiến thức vừa ghi chép)
                            </span>
                          </div>

                          {currentLesson.quiz ? (
                            <>
                              <p style={{ fontSize: '0.96rem', color: 'var(--color-deep)', fontWeight: 700, marginBottom: '1.15rem', lineHeight: 1.55 }}>
                                {currentLesson.quiz.question}
                              </p>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
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
                                        padding: '0.85rem 1.15rem',
                                        borderRadius: '8px',
                                        border: '1.5px solid',
                                        borderColor: btnBorder,
                                        background: btnBg,
                                        color: btnColor,
                                        textAlign: 'left',
                                        fontSize: '0.92rem',
                                        fontWeight: isSelected || (isAnswerSubmitted && isCorrect) ? 700 : 500,
                                        cursor: 'pointer',
                                        transition: 'all 0.15s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                      }}
                                    >
                                      <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                                      {isAnswerSubmitted && isCorrect && <CheckCircle size={18} color="#16A34A" />}
                                      {isAnswerSubmitted && isSelected && !isCorrect && <X size={18} color="#EF4444" />}
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Lời giải thích khi đã chọn */}
                              {isAnswerSubmitted && (
                                <div
                                  style={{
                                    marginTop: '1.15rem',
                                    padding: '1rem 1.25rem',
                                    borderRadius: '8px',
                                    background: selectedOption === currentLesson.quiz.answer ? '#F0FDF4' : '#FEF2F2',
                                    border: '1px solid',
                                    borderColor: selectedOption === currentLesson.quiz.answer ? '#BBF7D0' : '#FECACA',
                                    fontSize: '0.9rem',
                                    lineHeight: 1.6,
                                    color: selectedOption === currentLesson.quiz.answer ? '#166534' : '#991B1B',
                                    fontWeight: 600
                                  }}
                                >
                                  {selectedOption === currentLesson.quiz.answer ? '🎉 Chính xác tuyệt đối! ' : '❌ Chưa chính xác! '}
                                  {currentLesson.quiz.explanation}
                                </div>
                              )}
                            </>
                          ) : (
                            <div style={{ padding: '1rem', textAlign: 'center', color: '#64748B', fontStyle: 'italic', fontSize: '0.9rem' }}>
                              * Chưa thiết lập câu hỏi phản xạ nhanh cho bài học này.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Modal: Chuyển bài & Đánh dấu hoàn thành (ẩn khi đang chỉnh sửa) */}
                {!isEditingTheory && (
                <div
                  style={{
                    padding: '0.9rem 1.75rem',
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
                        padding: '0.55rem 1rem',
                        borderRadius: '8px',
                        background: '#FFFFFF',
                        border: '1px solid var(--color-border)',
                        color: activeLessonIndex === 0 ? '#94A3B8' : 'var(--color-deep)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
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
                        padding: '0.55rem 1rem',
                        borderRadius: '8px',
                        background: '#FFFFFF',
                        border: '1px solid var(--color-border)',
                        color: activeLessonIndex === selectedStation.lessons.length - 1 ? '#94A3B8' : 'var(--color-deep)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
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
                        padding: '0.65rem 1.35rem',
                        borderRadius: '8px',
                        fontWeight: 800,
                        fontSize: '0.88rem',
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
                          <CheckCircle size={17} />
                          <span>Đã hoàn thành bài này</span>
                        </>
                      ) : (
                        <>
                          <Check size={17} />
                          <span>Đánh dấu đã hiểu bài</span>
                        </>
                      )}
                    </button>

                    <button
                      className="btn-open-station"
                      onClick={handleCloseModal}
                      style={{ padding: '0.65rem 1.15rem' }}
                    >
                      Đóng
                    </button>
                  </div>
                </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )}
    </div>
  );
}
