import { supabase } from '../supabase';
import { TRACK_TYPES, TRACK_INFO } from '../data/roadmap';

export const ROADMAP_STORAGE_CONFIG = {
  bucket: 'KhoTaiLieuTinHocThiThu',
  folder: 'LoTrinhDayXich',
  files: {
    [TRACK_TYPES.CS]: 'csRoadmap.json',
    [TRACK_TYPES.ICT]: 'ictRoadmap.json'
  }
};

/**
 * Lấy dữ liệu lộ trình từ Supabase Storage Bucket KhoTaiLieuTinHocThiThu/LoTrinhDayXich/
 * Tự động thêm timestamp cache-busting để đảm bảo khi sửa trên Supabase, web sẽ cập nhật ngay.
 * Nếu chưa có file hoặc lỗi mạng, tự động fallback về dữ liệu mặc định trong code (TRACK_INFO).
 */
export async function fetchRemoteRoadmap(trackType) {
  const track = trackType?.toLowerCase() || TRACK_TYPES.ICT;
  const fileName = ROADMAP_STORAGE_CONFIG.files[track] || 'ictRoadmap.json';
  const filePath = `${ROADMAP_STORAGE_CONFIG.folder}/${fileName}`;
  const defaultTrackData = TRACK_INFO[track] || TRACK_INFO[TRACK_TYPES.ICT];

  try {
    if (!supabase) {
      return {
        success: false,
        source: 'local',
        data: defaultTrackData,
        message: 'Chưa khởi tạo Supabase Client'
      };
    }

    // 1. Lấy public URL từ Supabase Storage
    const { data: urlData } = supabase.storage
      .from(ROADMAP_STORAGE_CONFIG.bucket)
      .getPublicUrl(filePath);

    if (!urlData || !urlData.publicUrl) {
      return {
        success: false,
        source: 'local',
        data: defaultTrackData,
        message: 'Không tìm thấy Public URL'
      };
    }

    // Cache-busting query param để không bị trình duyệt cache file cũ
    const fetchUrl = `${urlData.publicUrl}?t=${Date.now()}`;

    const res = await fetch(fetchUrl, {
      cache: 'no-cache',
      headers: {
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache'
      }
    });

    if (!res.ok) {
      // 404 hoặc file chưa được upload lên bucket
      return {
        success: false,
        source: 'local',
        data: defaultTrackData,
        message: `File ${fileName} chưa được tạo trên Supabase (HTTP ${res.status})`
      };
    }

    const json = await res.json();

    // 2. Chuẩn hóa dữ liệu trả về (hỗ trợ cả dạng object full lẫn dạng array stations)
    let stations = null;
    let examStructure = defaultTrackData.examStructure;
    let twelveWeekPlan = defaultTrackData.twelveWeekPlan;

    if (Array.isArray(json)) {
      stations = json;
    } else if (json && typeof json === 'object') {
      if (Array.isArray(json.stations)) {
        stations = json.stations;
      }
      if (json.examStructure) {
        examStructure = json.examStructure;
      }
      if (json.twelveWeekPlan) {
        twelveWeekPlan = json.twelveWeekPlan;
      }
    }

    if (!stations || stations.length === 0) {
      return {
        success: false,
        source: 'local',
        data: defaultTrackData,
        message: 'Dữ liệu JSON trên Supabase không chứa danh sách chặng stations hợp lệ'
      };
    }

    return {
      success: true,
      source: 'supabase',
      data: {
        ...defaultTrackData,
        stations,
        examStructure,
        twelveWeekPlan
      },
      updatedAt: new Date().toLocaleTimeString('vi-VN')
    };
  } catch (err) {
    console.warn(`[RoadmapStorage] Lỗi tải ${fileName} từ Supabase Storage:`, err);
    return {
      success: false,
      source: 'local',
      data: defaultTrackData,
      message: err.message || 'Lỗi mạng khi tải từ Supabase'
    };
  }
}

/**
 * Tải file JSON xuống máy tính để người dùng dễ dàng kéo thả vào Supabase Dashboard
 */
export function downloadRoadmapJSON(trackType) {
  const track = trackType?.toLowerCase() || TRACK_TYPES.ICT;
  const fileName = ROADMAP_STORAGE_CONFIG.files[track] || 'ictRoadmap.json';
  const data = TRACK_INFO[track] || TRACK_INFO[TRACK_TYPES.ICT];

  const exportPayload = {
    examStructure: data.examStructure,
    twelveWeekPlan: data.twelveWeekPlan,
    stations: data.stations
  };

  const jsonStr = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Thử đẩy trực tiếp từ Web lên Supabase Storage (nếu Storage có mở quyền INSERT/UPDATE policy)
 */
export async function uploadRoadmapToSupabase(trackType, jsonData) {
  const track = trackType?.toLowerCase() || TRACK_TYPES.ICT;
  const fileName = ROADMAP_STORAGE_CONFIG.files[track] || 'ictRoadmap.json';
  const filePath = `${ROADMAP_STORAGE_CONFIG.folder}/${fileName}`;

  if (!supabase) {
    return { success: false, error: 'Chưa cấu hình Supabase Client' };
  }

  const payload = typeof jsonData === 'string' ? jsonData : JSON.stringify(jsonData, null, 2);
  const blob = new Blob([payload], { type: 'application/json' });

  const { data, error } = await supabase.storage
    .from(ROADMAP_STORAGE_CONFIG.bucket)
    .upload(filePath, blob, {
      contentType: 'application/json',
      upsert: true
    });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}
