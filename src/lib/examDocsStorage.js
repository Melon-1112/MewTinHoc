import { supabase } from '../supabase';

/**
 * Cấu hình kho tài liệu (Kho đề thi) trên Supabase Storage.
 * Bucket dùng chung với lộ trình dạy xích, nhưng tách thư mục riêng cho đề thi.
 */
export const EXAM_DOCS_CONFIG = {
  bucket: 'KhoTaiLieuTinHocThiThu',
  folder: 'DeThiThu'
};

/**
 * Hai "loại tài liệu" (tag) của kho đề thi.
 *
 * Lưu ý: trên Supabase tên thư mục không đổi được theo yêu cầu nghiệp vụ,
 * nên tên hiển thị trên web do mình quyết định ở đây:
 *   - thư mục "Chung"  -> hiển thị "Chung"
 *   - thư mục "DeSo"   -> hiển thị "Đề sở"
 *
 * `aliases` dùng để khớp tên thư mục thật trên Storage (bỏ dấu, bỏ khoảng
 * trắng, không phân biệt hoa thường) -> tránh hardcode chết nếu Admin
 * đặt tên khác trên dashboard.
 */
export const DOC_TYPES = [
  {
    id: 'chung',
    label: 'Chung',
    storageName: 'Chung',
    aliases: ['chung', 'tai lieu chung'],
    description: 'Tài liệu dùng chung cho mọi môn và mọi khối thi.',
    accent: 'amber'
  },
  {
    id: 'deso',
    label: 'Đề sở',
    storageName: 'DeSo',
    aliases: ['deso', 'de so', 'đề sở', 'de thi so'],
    description: 'Đề thi của trường (đề sở) theo từng năm học.',
    accent: 'deep'
  }
];

/** Chuẩn hóa tên thư mục để so khớp: bỏ dấu, khoảng trắng, ký tự lạ */
export const normalizeFolderKey = (name) =>
  String(name || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .toLowerCase();

/**
 * Gắn mỗi thư mục con tìm được trên Storage về đúng "loại tài liệu".
 * Thư mục nào không khớp alias nào sẽ trả về null (không hiện ra web).
 */
export const resolveDocTypes = (folders) => {
  const list = Array.isArray(folders) ? folders : [];
  return DOC_TYPES.map((type) => {
    const hit = list.find((f) => type.aliases.includes(normalizeFolderKey(f.name)));
    return hit ? { ...type, folderName: hit.name, path: hit.path } : null;
  }).filter(Boolean);
};

/** Tìm 1 loại tài liệu theo id */
export const findDocType = (id) => DOC_TYPES.find((t) => t.id === id) || null;

/** Giới hạn dung lượng 1 file: 20MB (Storage mặc định của Supabase) */
export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

/** Đuôi file được phép tải lên kho đề thi */
export const ALLOWED_EXTENSIONS = [
  'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
  'txt', 'csv', 'zip', 'rar', 'png', 'jpg', 'jpeg', 'webp', 'gif'
];

/** Supabase chèn placeholder này để đánh dấu thư mục rỗng -> phải ẩn khỏi UI */
const FOLDER_PLACEHOLDER = '.emptyFolderPlaceholder';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

export const extractExt = (filename) => {
  const parts = String(filename || '').split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : '';
};

/** Tên hiển thị: bỏ đuôi file, đổi _ thành khoảng trắng */
export const prettyName = (filename) =>
  String(filename || '').replace(/\.[^/.]+$/, '').replace(/[_]+/g, ' ');

export const sanitizeFileName = (name) => {
  const base = String(name || '')
    .replace(/[\\/]/g, '-')      // không cho tạo đường dẫn con
    .replace(/[\u0000-\u001f<>:"|?*]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  // Bỏ dấu chấm/gạch ở đầu để tránh tên ẩn và tên bắt đầu bằng "-"
  return base.replace(/^[.\-\s]+/, '').slice(0, 180);
};

/** Ghép đường dẫn trong bucket, tự xử lý trường hợp đang ở thư mục gốc '' */
export const joinPath = (folder, name) =>
  folder ? `${folder}/${name}` : String(name || '');

/**
 * Trả về tên file chưa tồn tại, thêm hậu tố (1), (2)... nếu bị trùng.
 * Tránh việc tải lên vô tình ghi đè tài liệu đang có.
 */
export const uniqueFileName = (desired, takenNames) => {
  const taken = new Set((takenNames || []).map((n) => String(n).toLowerCase()));
  const safe = sanitizeFileName(desired);
  if (!safe) return '';
  if (!taken.has(safe.toLowerCase())) return safe;

  // Tách đuôi từ chính tên đã làm sạch để GIỮ NGUYÊN kiểu chữ (vd: .PDF)
  const dotIndex = safe.lastIndexOf('.');
  const hasExt = dotIndex > 0;
  const base = hasExt ? safe.slice(0, dotIndex) : safe;
  const ext = hasExt ? safe.slice(dotIndex) : '';

  for (let i = 1; i < 500; i += 1) {
    const candidate = `${base} (${i})${ext}`;
    if (!taken.has(candidate.toLowerCase())) return candidate;
  }
  return `${base}-${Date.now()}${ext}`;
};

/** Chuyển lỗi Supabase (thường là RLS 403) sang tiếng Việt dễ hiểu cho Admin */
const describeError = (error, action) => {
  const raw = error?.message || 'Không xác định';
  const status = error?.statusCode || error?.status || null;
  const isRls =
    /row-level security|violates|Unauthorized|AccessDenied|403/i.test(raw) ||
    Number(status) === 403;

  if (isRls) {
    return (
      `Supabase Storage đang chặn quyền ${action} (RLS). ` +
      'Hãy vào trang /admin, bấm "Kiểm tra quyền ghi Storage", ' +
      'rồi chạy đoạn SQL mở quyền ở mục "Xem câu lệnh SQL Supabase" (phần số 5).'
    );
  }
  return raw;
};

const isAuthError = (error) =>
  /jwt|token|not authenticated|anonymous/i.test(error?.message || '');

/* ------------------------------------------------------------------ */
/* Đọc dữ liệu                                                         */
/* ------------------------------------------------------------------ */

/**
 * Liệt kê toàn bộ thư mục con + tài liệu trong một thư mục của kho đề thi.
 * @param {string} folderPath đường dẫn thư mục trong bucket ('' = gốc)
 */
export async function listExamDocs(folderPath = EXAM_DOCS_CONFIG.folder) {
  if (!supabase) {
    return { success: false, error: 'Chưa khởi tạo Supabase Client.', docs: [], folders: [] };
  }

  try {
    const { data, error } = await supabase.storage
      .from(EXAM_DOCS_CONFIG.bucket)
      .list(folderPath, {
        limit: 300,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      });

    if (error) throw error;

    const entries = (data || []).filter((f) => f.name !== FOLDER_PLACEHOLDER);

    // Supabase trả về `id === null` cho thư mục con -> dùng để phân biệt
    const folders = entries
      .filter((f) => !f.id)
      .map((f) => ({ name: f.name, path: joinPath(folderPath, f.name) }));
    const files = entries.filter((f) => f.id);

    const storage = supabase.storage.from(EXAM_DOCS_CONFIG.bucket);

    // Hỗ trợ Private Bucket: tạo Signed URLs hàng loạt
    const paths = files.map((f) => joinPath(folderPath, f.name));
    let signedUrlsMap = {};
    try {
      if (paths.length > 0 && typeof storage.createSignedUrls === 'function') {
        const { data: signedData } = await storage.createSignedUrls(paths, 86400);
        if (Array.isArray(signedData)) {
          signedData.forEach((item) => {
            if (item?.path && item?.signedUrl) {
              signedUrlsMap[item.path] = item.signedUrl;
            }
          });
        }
      }
    } catch (e) {
      // Bỏ qua lỗi batch signed urls để fallback
    }

    const docs = files.map((f) => {
      const path = joinPath(folderPath, f.name);
      const ext = extractExt(f.name);
      const viewUrl = signedUrlsMap[path] || storage.getPublicUrl(path).data?.publicUrl || null;
      const downloadUrl = viewUrl || storage.getPublicUrl(path, { download: f.name }).data?.publicUrl || null;

      return {
        id: f.id,
        file_name: f.name,
        storage_path: path,
        ten_file: prettyName(f.name),
        loai_file: ext,
        size: f.metadata?.size ?? null,
        view_url: viewUrl,
        download_url: downloadUrl,
        created_at: f.created_at || f.updated_at || null
      };
    });

    return { success: true, path: folderPath, folders, docs };
  } catch (err) {
    return {
      success: false,
      error: describeError(err, 'đọc'),
      docs: [],
      folders: []
    };
  }
}

/* ------------------------------------------------------------------ */
/* Ghi dữ liệu (chỉ Admin)                                             */
/* ------------------------------------------------------------------ */

/**
 * Tải 1 file tài liệu mới lên kho đề thi.
 * Tự chống trùng tên (thêm hậu tố) để không ghi đè tài liệu đang có.
 */
export async function uploadExamDocument(file, folderPath = EXAM_DOCS_CONFIG.folder) {
  if (!supabase) return { success: false, error: 'Chưa khởi tạo Supabase Client.' };
  if (!file) return { success: false, error: 'Bạn chưa chọn file nào.' };

  const ext = extractExt(file.name);
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return {
      success: false,
      error: `Định dạng ".${ext || '?'}" không được hỗ trợ. Chỉ nhận: ${ALLOWED_EXTENSIONS.join(', ')}.`
    };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return {
      success: false,
      error: `File "${file.name}" nặng ${(file.size / 1024 / 1024).toFixed(1)}MB, vượt giới hạn 20MB.`
    };
  }
  if (file.size === 0) {
    return { success: false, error: `File "${file.name}" rỗng, không thể tải lên.` };
  }

  try {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) {
      return {
        success: false,
        error: 'Bạn cần đăng nhập bằng tài khoản Google trước khi tải tài liệu lên (Storage yêu cầu phiên đăng nhập thật).'
      };
    }

    // Lấy danh sách tên hiện có để tránh ghi đè
    const { data: existing, error: listErr } = await supabase.storage
      .from(EXAM_DOCS_CONFIG.bucket)
      .list(folderPath, { limit: 300 });
    if (listErr) throw listErr;

    const finalName = uniqueFileName(file.name, (existing || []).map((f) => f.name));
    if (!finalName) return { success: false, error: 'Tên file không hợp lệ.' };

    const path = joinPath(folderPath, finalName);

    const { error } = await supabase.storage
      .from(EXAM_DOCS_CONFIG.bucket)
      .upload(path, file, {
        contentType: file.type || 'application/octet-stream',
        upsert: false
      });

    if (error) throw error;

    return {
      success: true,
      file_name: finalName,
      storage_path: path,
      renamed: finalName !== sanitizeFileName(file.name)
    };
  } catch (err) {
    return {
      success: false,
      error: isAuthError(err)
        ? 'Phiên đăng nhập đã hết hạn. Hãy đăng xuất rồi đăng nhập lại bằng Google, sau đó thử tải lên lại.'
        : describeError(err, 'ghi')
    };
  }
}

/**
 * Đổi tên tài liệu trực tiếp trên Supabase Storage.
 * Giữ nguyên đuôi file gốc; chặn ghi đè nếu tên mới đã tồn tại.
 */
export async function renameExamDocument(doc, newBaseName) {
  if (!supabase) return { success: false, error: 'Chưa khởi tạo Supabase Client.' };
  if (!doc?.storage_path) return { success: false, error: 'Không xác định được file gốc.' };

  const ext = extractExt(doc.file_name);
  const cleanBase = sanitizeFileName(newBaseName);
  if (!cleanBase) return { success: false, error: 'Tên tài liệu không được để trống.' };

  const newName = ext ? `${cleanBase}.${ext}` : cleanBase;
  const folder = doc.storage_path.includes('/')
    ? doc.storage_path.slice(0, doc.storage_path.lastIndexOf('/'))
    : '';
  const newPath = joinPath(folder, newName);

  if (newName === doc.file_name) {
    return { success: true, unchanged: true, file_name: newName, storage_path: newPath };
  }

  try {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) {
      return { success: false, error: 'Bạn cần đăng nhập trước khi đổi tên tài liệu.' };
    }

    const { data: existing, error: listErr } = await supabase.storage
      .from(EXAM_DOCS_CONFIG.bucket)
      .list(folder, { limit: 300 });
    if (listErr) throw listErr;

    const clashed = (existing || []).some(
      (f) => f.name !== doc.file_name && f.name.toLowerCase() === newName.toLowerCase()
    );
    if (clashed) {
      return { success: false, error: `Đã có tài liệu tên "${newName}" trong thư mục này. Hãy chọn tên khác.` };
    }

    const { error } = await supabase.storage
      .from(EXAM_DOCS_CONFIG.bucket)
      .move(doc.storage_path, newPath);

    if (error) throw error;

    return { success: true, file_name: newName, storage_path: newPath };
  } catch (err) {
    return {
      success: false,
      error: describeError(err, 'đổi tên')
    };
  }
}

/** Xóa 1 tài liệu khỏi kho đề thi */
export async function deleteExamDocument(doc) {
  if (!supabase) return { success: false, error: 'Chưa khởi tạo Supabase Client.' };
  if (!doc?.storage_path) return { success: false, error: 'Không xác định được file cần xóa.' };

  try {
    const { error } = await supabase.storage
      .from(EXAM_DOCS_CONFIG.bucket)
      .remove([doc.storage_path]);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    return { success: false, error: describeError(err, 'xóa') };
  }
}

/** Tạo thư mục rỗng trong kho đề thi (dùng placeholder chuẩn của Supabase) */
export async function createExamFolder(folderName, parentPath = EXAM_DOCS_CONFIG.folder) {
  if (!supabase) return { success: false, error: 'Chưa khởi tạo Supabase Client.' };

  const clean = sanitizeFileName(folderName);
  if (!clean) return { success: false, error: 'Tên thư mục không hợp lệ.' };

  const path = joinPath(parentPath, `${clean}/${FOLDER_PLACEHOLDER}`);

  try {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) return { success: false, error: 'Bạn cần đăng nhập trước khi tạo thư mục.' };

    const { error } = await supabase.storage
      .from(EXAM_DOCS_CONFIG.bucket)
      .upload(path, new Blob([''], { type: 'text/plain' }), { upsert: false });

    if (error) throw error;
    return { success: true, folder: clean };
  } catch (err) {
    return { success: false, error: describeError(err, 'tạo thư mục') };
  }
}

/**
 * Bảo đảm thư mục của 1 "loại tài liệu" tồn tại trên Storage.
 * Nếu thư mục đã có sẵn thì không làm gì (không lỗi).
 */
export async function ensureDocTypeFolder(folderPath) {
  if (!supabase) return { success: false, error: 'Chưa khởi tạo Supabase Client.' };
  if (!folderPath) return { success: false, error: 'Thiếu đường dẫn thư mục.' };

  try {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) return { success: false, error: 'Bạn cần đăng nhập trước khi tạo thư mục.' };

    const { error } = await supabase.storage
      .from(EXAM_DOCS_CONFIG.bucket)
      .upload(joinPath(folderPath, FOLDER_PLACEHOLDER), new Blob([''], { type: 'text/plain' }), {
        upsert: true
      });

    if (error) throw error;
    return { success: true };
  } catch (err) {
    return { success: false, error: describeError(err, 'tạo thư mục') };
  }
}
