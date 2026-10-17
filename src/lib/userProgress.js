import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../supabase';
import { getEvolutionByDays, getEvolutionProgress } from './streakEvolutions';

// Khối kiến thức chuẩn trong ma trận Bộ GD&ĐT
export const MASTERY_BLOCKS = {
  PYTHON: 'python',
  SQL: 'sql',
  NETWORK: 'network',
  SAFETY: 'safety'
};

export const MASTERY_META = {
  python: { label: 'Lập trình & Thuật toán Python', color: 'var(--color-primary)', defaultProgress: 88 },
  sql: { label: 'Cơ sở dữ liệu & SQL', color: '#D97706', defaultProgress: 65 },
  network: { label: 'Mạng Máy Tính & Internet', color: 'var(--color-deep)', defaultProgress: 45 },
  safety: { label: 'An toàn số & Đạo đức ICT', color: '#16A34A', defaultProgress: 80 }
};

const DEFAULT_PROGRESS = {
  streak_count: 0, // Mới tạo tài khoản bắt đầu từ 0 ngày
  streak_last_date: null,
  total_exams: 0,
  avg_score: 0,
  accuracy: 0,
  xp_total: 0
};

const DEFAULT_MASTERY = {
  python: 0,
  sql: 0,
  network: 0,
  safety: 0
};

/**
 * Quy tắc Streak: khoảng cách TỐI ĐA giữa hai lần điểm danh là 3 NGÀY.
 * - Cách nhau 1..3 ngày (nghỉ 0..2 ngày trắng): chuỗi vẫn giữ, điểm danh lại vẫn +1.
 * - Để trống đủ 3 ngày liên tiếp (tức cách nhau 4 ngày): MẤT streak, trở về 0.
 * Đây là NGUỒN DUY NHẤT cho cả logic lẫn phần chữ hiển thị.
 */
export const STREAK_GRACE_DAYS = 3;

// Helper: định dạng một đối tượng Date thành 'YYYY-MM-DD' theo GIỜ ĐỊA PHƯƠNG.
// Không dùng toISOString() vì hàm đó quy đổi sang UTC -> bị lệch 1 ngày vào
// khoảng 00:00-06:59 giờ Việt Nam (UTC+7).
export const formatLocalDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// Helper: lấy ngày hôm nay (hoặc ngày đã dịch bởi dayOffset) theo giờ địa phương
export const getEffectiveDate = (dayOffset = 0) => {
  const d = new Date();
  if (dayOffset !== 0) {
    d.setDate(d.getDate() + dayOffset);
  }
  return formatLocalDate(d);
};

// Helper: quy đổi 'YYYY-MM-DD' thành số ngày tuyệt đối (múi giờ độc lập)
const toDayNumber = (dateStr) => {
  const [y, m, d] = String(dateStr).split('-').map(Number);
  if (!y || !m || !d) return NaN;
  return Math.floor(Date.UTC(y, m - 1, d) / 86400000);
};

/**
 * Helper: khoảng cách ngày CÓ DẤU giữa 2 chuỗi 'YYYY-MM-DD'.
 * - > 0 : dateStr2 ở tương lai so với dateStr1 (bình thường là 1)
 * - = 0 : cùng ngày
 * - < 0 : dateStr2 ở quá khứ (dữ liệu cũ / đồng hồ lệch)
 * Trả về 999 nếu thiếu dữ liệu.
 */
export const getDayDiff = (dateStr1, dateStr2) => {
  if (!dateStr1 || !dateStr2) return 999;
  const n1 = toDayNumber(dateStr1);
  const n2 = toDayNumber(dateStr2);
  if (Number.isNaN(n1) || Number.isNaN(n2)) return 999;
  return n2 - n1;
};

/**
 * Hook quản lý toàn bộ User Progress với Supabase Database + Realtime & LocalStorage Fallback
 */
export function useUserProgress(user) {
  const userId = user?.id || 'guest';
  const progressKey = `tinhoc_user_progress_${userId}`;
  const masteryKey = `tinhoc_mastery_progress_${userId}`;
  const lessonsKey = `tinhoc_completed_lessons_${userId}`;
  const checkinKey = `tinhoc_checkin_history_${userId}`;

  // Chế độ MÔ PHỎNG NGÀY chỉ tồn tại trong phiên làm việc hiện tại.
  // Cố ý KHÔNG lưu vào localStorage để khi F5 luôn quay về ngày thật.
  const [dayOffset, setDayOffset] = useState(0);

  const effectiveToday = getEffectiveDate(dayOffset);
  const isSimulating = dayOffset !== 0;

  // 1. Tiến độ tổng quan (Streak bắt đầu từ 0 ngày khi tạo tài khoản)
  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem(progressKey) || localStorage.getItem('tinhoc_user_progress');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Xóa giá trị mock 7 hoặc 8 cũ nếu tài khoản chưa từng điểm danh thực tế
        if (!parsed.streak_last_date && parsed.streak_count > 0) {
          parsed.streak_count = 0;
        }
        return parsed;
      }
    } catch {}
    return { ...DEFAULT_PROGRESS };
  });

  // 2. Mức độ làm chủ 4 khối
  const [mastery, setMastery] = useState(() => {
    try {
      const saved = localStorage.getItem(masteryKey) || localStorage.getItem('tinhoc_mastery_progress');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { ...DEFAULT_MASTERY };
  });

  // 3. Danh sách bài học hoàn thành trong lộ trình
  const [completedLessons, setCompletedLessons] = useState(() => {
    try {
      const saved = localStorage.getItem(lessonsKey) || localStorage.getItem('tinhoc_completed_lessons');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  // 4. Lịch sử các ngày đã điểm danh
  const [checkinHistory, setCheckinHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(checkinKey) || localStorage.getItem('tinhoc_checkin_history');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // Reset/reload khi user đăng nhập tài khoản khác
  useEffect(() => {
    try {
      const saved = localStorage.getItem(progressKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.streak_last_date && parsed.streak_count > 0) {
          parsed.streak_count = 0;
        }
        setProgress(parsed);
      } else {
        setProgress({ ...DEFAULT_PROGRESS });
      }
    } catch {
      setProgress({ ...DEFAULT_PROGRESS });
    }

    try {
      const savedHist = localStorage.getItem(checkinKey);
      setCheckinHistory(savedHist ? JSON.parse(savedHist) : []);
    } catch {
      setCheckinHistory([]);
    }
  }, [progressKey, checkinKey]);


  // Trạng thái kết nối DB: 'checking' | 'connected' | 'fallback'
  const [dbStatus, setDbStatus] = useState('checking');
  const [isRealtimeActive, setIsRealtimeActive] = useState(false);
  const realtimeChannelRef = useRef(null);

  // Tính checkedToday theo effectiveToday
  const checkedToday = progress.streak_last_date === effectiveToday;

  // Dọn khoá mô phỏng cũ (nếu phiên bản trước đã lỡ lưu) để F5 luôn về ngày thật
  useEffect(() => {
    try {
      localStorage.removeItem('tinhoc_day_offset');
    } catch { /* ignore */ }
  }, []);

  // TỰ ĐỘNG HẾT HẠN STREAK: nếu đã bỏ lỡ >= 2 ngày thì chuỗi về 0.
  // Chỉ chạy với ngày THỰC (bỏ qua khi đang mô phỏng) để không đụng dữ liệu Supabase.
  const lastExpiredRef = useRef(null);
  useEffect(() => {
    if (isSimulating) return;

    const last = progress.streak_last_date;
    if (!last) return;

    const diff = getDayDiff(last, effectiveToday);
    // Còn trong thời gian ân hạn -> chuỗi chưa đứt, không làm gì cả.
    if (diff <= STREAK_GRACE_DAYS) return;

    const count = progress.streak_count || 0;

    // Chỉ cần ghi Supabase 1 lần cho mỗi cặp (ngày điểm danh cuối, số streak)
    const signature = `${last}|${count}`;
    if (lastExpiredRef.current === signature) return;
    lastExpiredRef.current = signature;

    if (count > 0) {
      setProgress(prev => ({ ...prev, streak_count: 0 }));

      if (user?.id && supabase) {
        supabase
          .from('user_progress')
          .upsert({ id: user.id, streak_count: 0, updated_at: new Date().toISOString() })
          .then(() => {}, (e) => console.warn('Lỗi đồng bộ streak hết hạn:', e?.message));
      }
    }
  }, [isSimulating, progress.streak_last_date, progress.streak_count, effectiveToday, user?.id]);
  // Lưu cache LocalStorage mỗi khi state đổi — nhưng BỎ QUA khi đang mô phỏng,
  // để dữ liệu giả không dính vào bộ nhớ trình duyệt và sống sót qua F5.
  useEffect(() => {
    if (isSimulating) return;

    localStorage.setItem(progressKey, JSON.stringify(progress));
    localStorage.setItem('tinhoc_user_progress', JSON.stringify(progress));
    // Giữ tương thích với tinhoc_streak cũ của App.jsx
    localStorage.setItem('tinhoc_streak', JSON.stringify({
      count: progress.streak_count,
      checkedToday: progress.streak_last_date === effectiveToday,
      lastCheckInDate: progress.streak_last_date,
      dayOffset,
      checkinHistory
    }));
  }, [progress, effectiveToday, dayOffset, progressKey, checkinHistory, isSimulating]);

  useEffect(() => {
    localStorage.setItem(masteryKey, JSON.stringify(mastery));
    localStorage.setItem('tinhoc_mastery_progress', JSON.stringify(mastery));
  }, [mastery, masteryKey]);

  useEffect(() => {
    localStorage.setItem(lessonsKey, JSON.stringify(completedLessons));
    localStorage.setItem('tinhoc_completed_lessons', JSON.stringify(completedLessons));
  }, [completedLessons, lessonsKey]);

  useEffect(() => {
    if (isSimulating) return;

    localStorage.setItem(checkinKey, JSON.stringify(checkinHistory));
    localStorage.setItem('tinhoc_checkin_history', JSON.stringify(checkinHistory));
  }, [checkinHistory, checkinKey, isSimulating]);


  // Tải dữ liệu ban đầu từ Supabase (nếu user đăng nhập)
  const loadUserDataFromSupabase = useCallback(async (userId) => {
    if (!userId || !supabase) {
      setDbStatus('fallback');
      return;
    }

    try {
      // 1. Tải user_progress
      const { data: progData, error: progErr } = await supabase
        .from('user_progress')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (progErr) {
        // Có thể bảng chưa được tạo trên Supabase -> fallback
        console.warn('Supabase user_progress warning:', progErr.message);
        setDbStatus('fallback');
        return;
      }

      setDbStatus('connected');

      if (progData) {
        setProgress(prev => ({
          ...prev,
          streak_count: progData.streak_count ?? prev.streak_count,
          streak_last_date: progData.streak_last_date ?? prev.streak_last_date,
          total_exams: progData.total_exams ?? prev.total_exams,
          avg_score: progData.avg_score != null ? parseFloat(progData.avg_score) : prev.avg_score,
          accuracy: progData.accuracy != null ? parseFloat(progData.accuracy) : prev.accuracy,
          xp_total: progData.xp_total ?? prev.xp_total
        }));
      } else {
        // Người dùng mới -> tự tạo dòng mặc định
        const { error: seedProgErr } = await supabase.from('user_progress').upsert({
          id: userId,
          streak_count: DEFAULT_PROGRESS.streak_count,
          streak_last_date: null,
          total_exams: DEFAULT_PROGRESS.total_exams,
          avg_score: DEFAULT_PROGRESS.avg_score,
          accuracy: DEFAULT_PROGRESS.accuracy,
          xp_total: DEFAULT_PROGRESS.xp_total
        });
        if (seedProgErr) console.warn('Không tạo được user_progress mặc định:', seedProgErr.message);
      }

      // 2. Tải mastery_progress
      const { data: mastData, error: mastErr } = await supabase
        .from('mastery_progress')
        .select('block_key, progress')
        .eq('user_id', userId);

      if (!mastErr && mastData && mastData.length > 0) {
        const loadedMastery = { ...DEFAULT_MASTERY };
        mastData.forEach(row => {
          if (row.block_key) loadedMastery[row.block_key] = row.progress;
        });
        setMastery(loadedMastery);
      } else if (!mastErr && (!mastData || mastData.length === 0)) {
        // Seed default mastery cho user
        const initialRows = Object.entries(DEFAULT_MASTERY).map(([block_key, prog]) => ({
          user_id: userId,
          block_key,
          progress: prog
        }));
        const { error: seedMastErr } = await supabase.from('mastery_progress').upsert(initialRows);
        if (seedMastErr) console.warn('Không seed được mastery mặc định:', seedMastErr.message);
      }

      // 3. Tải roadmap_lessons
      const { data: lessonData, error: lessonErr } = await supabase
        .from('roadmap_lessons')
        .select('lesson_id, completed')
        .eq('user_id', userId);

      if (!lessonErr && lessonData) {
        const loadedLessons = {};
        lessonData.forEach(row => {
          if (row.lesson_id) loadedLessons[row.lesson_id] = !!row.completed;
        });
        setCompletedLessons(loadedLessons);
      }

      // 4. Tải daily_checkins
      const { data: checkinData, error: checkinErr } = await supabase
        .from('daily_checkins')
        .select('checkin_date')
        .eq('user_id', userId)
        .order('checkin_date', { ascending: false })
        .limit(30);

      if (!checkinErr && checkinData) {
        setCheckinHistory(checkinData.map(r => r.checkin_date));
      }

    } catch (err) {
      console.warn('Lỗi kết nối Supabase, chuyển sang Offline LocalStorage:', err);
      setDbStatus('fallback');
    }
  }, []);

  // Thiết lập Supabase Realtime Subscription
  useEffect(() => {
    const userId = user?.id;
    if (!userId || !supabase) {
      setDbStatus('fallback');
      setIsRealtimeActive(false);
      return;
    }

    loadUserDataFromSupabase(userId);

    // Dọn dẹp subscription cũ
    if (realtimeChannelRef.current) {
      supabase.removeChannel(realtimeChannelRef.current);
    }

    try {
      const channel = supabase
        .channel(`realtime:user_progress:${userId}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'user_progress', filter: `id=eq.${userId}` },
          (payload) => {
            if (payload.new) {
              setProgress(prev => ({
                ...prev,
                streak_count: payload.new.streak_count ?? prev.streak_count,
                streak_last_date: payload.new.streak_last_date ?? prev.streak_last_date,
                total_exams: payload.new.total_exams ?? prev.total_exams,
                avg_score: payload.new.avg_score != null ? parseFloat(payload.new.avg_score) : prev.avg_score,
                accuracy: payload.new.accuracy != null ? parseFloat(payload.new.accuracy) : prev.accuracy,
                xp_total: payload.new.xp_total ?? prev.xp_total
              }));
            }
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'mastery_progress', filter: `user_id=eq.${userId}` },
          (payload) => {
            if (payload.new && payload.new.block_key) {
              setMastery(prev => ({
                ...prev,
                [payload.new.block_key]: payload.new.progress
              }));
            }
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'roadmap_lessons', filter: `user_id=eq.${userId}` },
          (payload) => {
            if (payload.new && payload.new.lesson_id) {
              setCompletedLessons(prev => ({
                ...prev,
                [payload.new.lesson_id]: !!payload.new.completed
              }));
            }
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'daily_checkins', filter: `user_id=eq.${userId}` },
          (payload) => {
            if (payload.eventType === 'INSERT' && payload.new?.checkin_date) {
              setCheckinHistory(prev => {
                if (prev.includes(payload.new.checkin_date)) return prev;
                return [payload.new.checkin_date, ...prev];
              });
            }
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            setIsRealtimeActive(true);
          } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
            setIsRealtimeActive(false);
          }
        });

      realtimeChannelRef.current = channel;
    } catch (e) {
      console.warn('Realtime subscription error:', e);
      setIsRealtimeActive(false);
    }

    return () => {
      if (realtimeChannelRef.current) {
        supabase.removeChannel(realtimeChannelRef.current);
      }
    };
  }, [user?.id, loadUserDataFromSupabase]);

  // Hành động: Điểm danh (Check-In)
  const checkIn = useCallback(async () => {
    const today = effectiveToday;
    if (progress.streak_last_date === today) {
      return { success: false, message: 'Hôm nay bạn đã điểm danh rồi!' };
    }

    let newStreak = 1;
    if (progress.streak_last_date) {
      const diff = getDayDiff(progress.streak_last_date, today);
      if (diff >= 1 && diff <= STREAK_GRACE_DAYS) {
        // Vẫn trong thời gian ân hạn (nghỉ 1..3 ngày) -> chuỗi tiếp tục tăng
        newStreak = progress.streak_count + 1;
      } else {
        // Nghỉ quá lâu (hoặc dữ liệu lệch) -> chuỗi đứt, bắt đầu lại từ 1
        newStreak = 1;
      }
    } else {
      newStreak = (progress.streak_count || 0) + 1;
    }

    const newXp = (progress.xp_total || 0) + 50;

    // Cập nhật State tức thì (Optimistic UI) — luôn an toàn cho cả chế độ mô phỏng
    setProgress(prev => ({
      ...prev,
      streak_count: newStreak,
      streak_last_date: today,
      xp_total: newXp
    }));

    setCheckinHistory(prev => (prev.includes(today) ? prev : [today, ...prev]));

    // Gửi lên Supabase — CHỈ khi dùng NGÀY THẬT.
    // Khi Admin đang mô phỏng ngày thì tuyệt đối không ghi ngày ảo vào CSDL.
    if (!isSimulating && user?.id && supabase) {
      try {
        await supabase.from('daily_checkins').upsert({
          user_id: user.id,
          checkin_date: today
        }, { onConflict: 'user_id,checkin_date' });

        await supabase.from('user_progress').upsert({
          id: user.id,
          streak_count: newStreak,
          streak_last_date: today,
          xp_total: newXp,
          updated_at: new Date().toISOString()
        });
      } catch (e) {
        console.warn('Lỗi ghi Supabase khi check-in (đã lưu offline):', e);
      }
    }

    return {
      success: true,
      newStreak,
      message: `🔥 Điểm danh thành công! Chuỗi Streak đạt ${newStreak} ngày liên tục (+50 XP).`
    };
  }, [effectiveToday, progress, user?.id, isSimulating]);

  // Hành động: Cập nhật mức độ làm chủ khối kiến thức (hỗ trợ số hoặc function updater)
  const updateMastery = useCallback(async (blockKey, valOrFn) => {
    let resolvedValue;
    setMastery(prev => {
      const current = prev[blockKey] ?? DEFAULT_MASTERY[blockKey] ?? 50;
      const target = typeof valOrFn === 'function' ? valOrFn(current) : valOrFn;
      resolvedValue = Math.max(0, Math.min(100, Math.round(target)));
      return {
        ...prev,
        [blockKey]: resolvedValue
      };
    });

    if (user?.id && supabase && resolvedValue !== undefined) {
      try {
        await supabase.from('mastery_progress').upsert({
          user_id: user.id,
          block_key: blockKey,
          progress: resolvedValue,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,block_key' });
      } catch (e) {
        console.warn('Lỗi cập nhật mastery lên Supabase:', e);
      }
    }
  }, [user?.id]);


  // Hành động: Đánh dấu bài học hoàn thành trong lộ trình
  const toggleLesson = useCallback(async (lessonId, track = 'ict') => {
    const newStatus = !completedLessons[lessonId];

    setCompletedLessons(prev => ({
      ...prev,
      [lessonId]: newStatus
    }));

    // Thưởng XP khi hoàn thành bài
    if (newStatus) {
      setProgress(prev => ({
        ...prev,
        xp_total: (prev.xp_total || 0) + 30
      }));
    }

    if (user?.id && supabase) {
      try {
        await supabase.from('roadmap_lessons').upsert({
          user_id: user.id,
          track: track.toLowerCase(),
          lesson_id: lessonId,
          completed: newStatus,
          completed_at: newStatus ? new Date().toISOString() : null
        }, { onConflict: 'user_id,track,lesson_id' });

        if (newStatus) {
          await supabase.from('user_progress').upsert({
            id: user.id,
            xp_total: (progress.xp_total || 0) + 30,
            updated_at: new Date().toISOString()
          });
        }
      } catch (e) {
        console.warn('Lỗi ghi bài học lên Supabase:', e);
      }
    }

    return newStatus;
  }, [completedLessons, user?.id, progress.xp_total]);

  // Hành động: Ghi nhận kết quả làm bài thi thử
  const recordExamResult = useCallback(async (score, accuracy) => {
    setProgress(prev => {
      const currentTotal = prev.total_exams || 0;
      const newTotal = currentTotal + 1;
      const newAvg = Number((((prev.avg_score || 0) * currentTotal + score) / newTotal).toFixed(2));
      const newAcc = accuracy !== undefined ? Number(accuracy.toFixed(1)) : prev.accuracy;
      const newXp = (prev.xp_total || 0) + 100;

      const updated = {
        ...prev,
        total_exams: newTotal,
        avg_score: newAvg,
        accuracy: newAcc,
        xp_total: newXp
      };

      if (user?.id && supabase) {
        supabase
          .from('user_progress')
          .upsert({
            id: user.id,
            total_exams: newTotal,
            avg_score: newAvg,
            accuracy: newAcc,
            xp_total: newXp,
            updated_at: new Date().toISOString()
          })
          .then(
            () => {},
            (err) => console.warn('Lỗi ghi kết quả thi lên Supabase:', err?.message)
          );
      }

      return updated;
    });
  }, [user?.id]);

  // Công cụ kiểm thử (CHỈ ADMIN): Giả lập qua ngày mai (+1 ngày)
  // Chỉ đổi state trong RAM, KHÔNG ghi gì lên Supabase.
  const simulateNextDay = useCallback(() => {
    setDayOffset(prev => prev + 1);
    return '📅 Đã mô phỏng sang ngày tiếp theo! Nội dung này chỉ có tác dụng tạm thời — nhấn F5 sẽ quay về hôm nay.';
  }, []);

  // Công cụ kiểm thử (CHỈ ADMIN): Bỏ trống đủ 3 ngày liên tiếp -> mất streak.
  // Với quy tắc khoảng cách tối đa 3 ngày, phải nhảy tới 4 ngày mới đủ điều kiện đứt chuỗi.
  // Cũng chỉ diễn ra trong RAM. Việc ghi streak = 0 lên Supabase để cho
  // useEffect "tự động hết hạn" đảm nhiệm khi ngày thật sự trôi qua.
  const simulateMissedDays = useCallback(() => {
    setDayOffset(prev => prev + (STREAK_GRACE_DAYS + 1));
    setProgress(prev => ({
      ...prev,
      streak_count: 0
    }));
    return `⚠️ Mô phỏng: đã bỏ trống ${STREAK_GRACE_DAYS} ngày liên tiếp nên chuỗi streak về 0. Nhấn F5 để khôi phục trạng thái thật.`;
  }, []);

  // Thoát chế độ mô phỏng, quay về trạng thái THẬT ngay lập tức.
  // Vì trong lúc mô phỏng ta cố tình không ghi localStorage, bộ nhớ vẫn đang
  // giữ nguyên dữ liệu thật -> chỉ cần nạp lại từ đó.
  const resetSimulation = useCallback(() => {
    setDayOffset(0);

    try {
      const savedProg = localStorage.getItem(progressKey) || localStorage.getItem('tinhoc_user_progress');
      if (savedProg) setProgress(JSON.parse(savedProg));

      const savedHist = localStorage.getItem(checkinKey) || localStorage.getItem('tinhoc_checkin_history');
      if (savedHist) setCheckinHistory(JSON.parse(savedHist));
    } catch { /* ignore */ }

    return '🔄 Đã quay về ngày thực tế.';
  }, [progressKey, checkinKey]);

  // Đối tượng streak format tương thích với Navbar và HomeTab
  const streakCompatible = {
    count: progress.streak_count,
    checkedToday,
    lastCheckInDate: progress.streak_last_date,
    dayOffset,
    checkinHistory,
    graceDays: STREAK_GRACE_DAYS,
    currentEvolution: getEvolutionByDays(progress.streak_count),
    evolutionProgress: getEvolutionProgress(progress.streak_count)
  };

  return {
    progress,
    mastery,
    completedLessons,
    checkinHistory,
    streak: streakCompatible,
    checkedToday,
    dbStatus,
    isRealtimeActive,
    effectiveToday,
    dayOffset,
    isSimulating,
    checkIn,
    updateMastery,
    toggleLesson,
    recordExamResult,
    simulateNextDay,
    simulateMissedDays,
    resetSimulation,
    refreshUserData: () => loadUserDataFromSupabase(user?.id)
  };
}
