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

    let json = null;

    // 1. Thử tạo Signed URL trước (chuẩn cho Private Bucket để tránh lỗi NoSuchBucket)
    try {
      const { data: signData, error: signErr } = await supabase.storage
        .from(ROADMAP_STORAGE_CONFIG.bucket)
        .createSignedUrl(filePath, 3600);

      if (!signErr && signData?.signedUrl) {
        const res = await fetch(`${signData.signedUrl}&t=${Date.now()}`, {
          cache: 'no-cache',
          headers: { Pragma: 'no-cache', 'Cache-Control': 'no-cache' }
        });
        if (res.ok) {
          json = await res.json();
        }
      }
    } catch (e) {
      // Bỏ qua lỗi sign để fallback
    }

    // 2. Nếu chưa lấy được, thử tải trực tiếp qua Supabase SDK download()
    if (!json) {
      try {
        const { data: blobData, error: dlErr } = await supabase.storage
          .from(ROADMAP_STORAGE_CONFIG.bucket)
          .download(filePath);

        if (!dlErr && blobData) {
          const text = await blobData.text();
          json = JSON.parse(text);
        }
      } catch (e) {
        // Bỏ qua lỗi download để fallback
      }
    }

    // 3. Nếu vẫn chưa được, thử getPublicUrl nếu bucket còn để Public
    if (!json) {
      try {
        const { data: urlData } = supabase.storage
          .from(ROADMAP_STORAGE_CONFIG.bucket)
          .getPublicUrl(filePath);

        if (urlData?.publicUrl) {
          const res = await fetch(`${urlData.publicUrl}?t=${Date.now()}`, {
            cache: 'no-cache',
            headers: { Pragma: 'no-cache', 'Cache-Control': 'no-cache' }
          });
          if (res.ok) {
            json = await res.json();
          }
        }
      } catch (e) {
        // Fallback
      }
    }

    // Nếu không lấy được JSON từ Supabase (file chưa tạo hoặc quyền private), fallback về dữ liệu mặc định
    if (!json) {
      return {
        success: false,
        source: 'local',
        data: defaultTrackData,
        message: `Đang dùng dữ liệu cục bộ (Chưa tìm thấy ${fileName} trên Supabase)`
      };
    }

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
    return {
      success: false,
      source: 'local',
      data: defaultTrackData,
      message: err.message || 'Lỗi mạng khi tải từ Supabase'
    };
  }
}

/**
 * Lấy dữ liệu roadmap dạng RAW (đúng cấu trúc file JSON: examStructure, twelveWeekPlan, stations)
 * dùng cho màn hình Quản trị của Admin.
 * - Hỗ trợ cả Private Bucket qua createSignedUrl và download()
 */
export async function fetchRemoteRoadmapRaw(trackType) {
  const track = trackType?.toLowerCase() || TRACK_TYPES.ICT;
  const fileName = ROADMAP_STORAGE_CONFIG.files[track] || 'ictRoadmap.json';
  const filePath = `${ROADMAP_STORAGE_CONFIG.folder}/${fileName}`;
  const defaultTrackData = TRACK_INFO[track] || TRACK_INFO[TRACK_TYPES.ICT];

  const buildDefault = (message) => ({
    success: false,
    source: 'local',
    message,
    raw: {
      examStructure: defaultTrackData.examStructure,
      twelveWeekPlan: defaultTrackData.twelveWeekPlan,
      stations: defaultTrackData.stations
    }
  });

  if (!supabase) return buildDefault('Chưa khởi tạo Supabase Client');

  try {
    let json = null;

    // 1. Thử Signed URL (cho Private Bucket)
    try {
      const { data: signData, error: signErr } = await supabase.storage
        .from(ROADMAP_STORAGE_CONFIG.bucket)
        .createSignedUrl(filePath, 3600);

      if (!signErr && signData?.signedUrl) {
        const res = await fetch(`${signData.signedUrl}&t=${Date.now()}`, {
          cache: 'no-cache',
          headers: { Pragma: 'no-cache', 'Cache-Control': 'no-cache' }
        });
        if (res.ok) {
          json = await res.json();
        }
      }
    } catch (e) {
      // Fallback
    }

    // 2. Thử download()
    if (!json) {
      try {
        const { data: blobData, error: dlErr } = await supabase.storage
          .from(ROADMAP_STORAGE_CONFIG.bucket)
          .download(filePath);
        if (!dlErr && blobData) {
          const text = await blobData.text();
          json = JSON.parse(text);
        }
      } catch (e) {
        // Fallback
      }
    }

    // 3. Thử getPublicUrl()
    if (!json) {
      try {
        const { data: urlData } = supabase.storage
          .from(ROADMAP_STORAGE_CONFIG.bucket)
          .getPublicUrl(filePath);

        if (urlData?.publicUrl) {
          const res = await fetch(`${urlData.publicUrl}?t=${Date.now()}`, {
            cache: 'no-cache',
            headers: { Pragma: 'no-cache', 'Cache-Control': 'no-cache' }
          });
          if (res.ok) {
            json = await res.json();
          }
        }
      } catch (e) {
        // Fallback
      }
    }

    if (!json) {
      return buildDefault(`File ${fileName} chưa có trên Supabase`);
    }

    // Hỗ trợ cả 2 dạng: file chuẩn { examStructure, twelveWeekPlan, stations } hoặc mảng stations
    const raw = Array.isArray(json)
      ? { examStructure: defaultTrackData.examStructure, twelveWeekPlan: defaultTrackData.twelveWeekPlan, stations: json }
      : {
          examStructure: json.examStructure || defaultTrackData.examStructure,
          twelveWeekPlan: json.twelveWeekPlan || defaultTrackData.twelveWeekPlan,
          stations: Array.isArray(json.stations) ? json.stations : defaultTrackData.stations
        };

    return {
      success: true,
      source: 'supabase',
      fileName,
      updatedAt: new Date().toLocaleTimeString('vi-VN'),
      raw
    };
  } catch (err) {
    return buildDefault(err.message || 'Lỗi mạng khi tải từ Supabase');
  }
}

/**
 * Chuyển đổi một URL tĩnh (dạng /object/public/...) hoặc relative path
 * sang Signed URL hợp lệ của Supabase Private Bucket.
 * Tránh lỗi 404 NoSuchBucket khi truy cập file trong Private Bucket.
 */
export async function resolveStorageUrl(rawUrlOrPath, expiresInSeconds = 86400) {
  if (!rawUrlOrPath || typeof rawUrlOrPath !== 'string') return null;

  // Nếu đã là Signed URL (có token) hoặc blob/data URL thì giữ nguyên
  if (rawUrlOrPath.includes('token=') || rawUrlOrPath.startsWith('blob:') || rawUrlOrPath.startsWith('data:')) {
    return rawUrlOrPath;
  }

  try {
    if (!supabase) return rawUrlOrPath;

    const bucketName = ROADMAP_STORAGE_CONFIG.bucket;
    let relativePath = rawUrlOrPath.trim();

    // Nếu là URL Supabase Storage (/object/public/KhoTaiLieuTinHocThiThu/... hoặc /object/sign/...)
    if (relativePath.includes(`/${bucketName}/`)) {
      const parts = relativePath.split(`/${bucketName}/`);
      relativePath = decodeURIComponent(parts[1].split('?')[0]);
    } else if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
      // URL bên ngoài Supabase (nếu có)
      return rawUrlOrPath;
    }

    // Tạo Signed URL từ Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(relativePath, expiresInSeconds);

    if (!error && data?.signedUrl) {
      return data.signedUrl;
    }
  } catch (err) {
    // Không làm gián đoạn UI nếu tạo signed URL thất bại
  }

  // Nếu là link Supabase Storage mà không thể tạo Signed URL (file chưa có hoặc chưa cấp quyền),
  // trả về null để tránh việc iframe gọi link /object/public/ bị lỗi NoSuchBucket
  if (rawUrlOrPath.includes(`/${ROADMAP_STORAGE_CONFIG.bucket}/`)) {
    return null;
  }

  return rawUrlOrPath;
}

/**
 * Đóng gói dữ liệu roadmap thành payload chuẩn trước khi upload lên Supabase Storage.
 * Chỉ giữ đúng 3 khoá gốc của file JSON để tránh ghi rác vào file.
 */
export function buildRoadmapPayload(roadmapData) {
  if (!roadmapData) return null;
  return {
    examStructure: roadmapData.examStructure,
    twelveWeekPlan: roadmapData.twelveWeekPlan,
    stations: roadmapData.stations
  };
}

/**
 * Lưu toàn bộ dữ liệu roadmap (đã chỉnh sửa bởi Admin) lên file JSON trên Supabase Storage.
 * Dùng chung cho nút "Lưu & Đồng bộ Supabase".
 */
export async function saveRoadmapToSupabase(trackType, roadmapData) {
  const payload = buildRoadmapPayload(roadmapData);
  if (!payload || !Array.isArray(payload.stations)) {
    return { success: false, error: 'Dữ liệu roadmap không hợp lệ (thiếu danh sách stations).' };
  }

  const result = await uploadRoadmapToSupabase(trackType, payload);
  return result;
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
    // Diễn giải lỗi phổ biến sang tiếng Việt cho Admin dễ xử lý
    const rawMsg = error.message || 'Không xác định';
    const isRlsError =
      /row-level security|violates|Unauthorized|AccessDenied/i.test(rawMsg) ||
      error.statusCode === '403' ||
      error.status === 403;

    if (isRlsError) {
      return {
        success: false,
        error:
          'Supabase Storage đang chặn quyền ghi (RLS). ' +
          'Hãy vào Supabase → SQL Editor và chạy đoạn SQL mở quyền ghi Storage ' +
          'ở mục "Công cụ quản trị" trong trang Admin (phần số 5).'
      };
    }

    return { success: false, error: rawMsg };
  }

  return { success: true, data };
}

/**
 * CHẨN ĐOÁN: Kiểm tra quyền GHI lên Supabase Storage.
 * Ghi 1 file nháp rất nhỏ vào thư mục kiểm tra rồi xóa ngay — KHÔNG đụng tới
 * các file lộ trình thật (csRoadmap.json / ictRoadmap.json).
 */
export async function testRoadmapStorageWrite() {
  if (!supabase) {
    return {
      success: false,
      status: null,
      message: 'Chưa cấu hình Supabase Client.'
    };
  }

  const probePath = `${ROADMAP_STORAGE_CONFIG.folder}/__kiem_tra_quyen_ghi.json`;
  const probeBody = new Blob([JSON.stringify({ test: true, at: new Date().toISOString() })], {
    type: 'application/json'
  });

  try {
    const { error } = await supabase.storage
      .from(ROADMAP_STORAGE_CONFIG.bucket)
      .upload(probePath, probeBody, { contentType: 'application/json', upsert: true });

    if (error) {
      const rawMsg = error.message || 'Không xác định';
      const status = error.statusCode || error.status || null;
      const isRls = /row-level security|violates|Unauthorized|AccessDenied/i.test(rawMsg) || Number(status) === 403;

      return {
        success: false,
        status,
        message: isRls
          ? 'Supabase đã từ chối vì chưa có policy cho phép ghi (RLS).\n' +
            'Đây chính là nguyên nhân nút "Lưu & Đồng bộ Supabase" báo lỗi.\n' +
            'Chi tiết từ Supabase: ' + rawMsg
          : 'Lỗi khác từ Supabase: ' + rawMsg
      };
    }

    // Dọn file nháp để không để lại rác trong bucket
    await supabase.storage.from(ROADMAP_STORAGE_CONFIG.bucket).remove([probePath]);

    return {
      success: true,
      status: 200,
      message: 'Đã ghi và xóa thành công một file kiểm tra.\nBây giờ bạn có thể bấm "Chỉnh sửa nội dung" rồi "Lưu & Đồng bộ Supabase".'
    };
  } catch (err) {
    return {
      success: false,
      status: null,
      message: 'Không gọi được Supabase Storage: ' + (err?.message || 'Lỗi mạng')
    };
  }
}
