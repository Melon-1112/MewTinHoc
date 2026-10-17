import { supabase } from '../supabase.js';

/**
 * Kiểm tra quyền Admin của một tài khoản:
 * Quyền Admin được xác định DUY NHẤT dựa trên trường `is_admin` trong hồ sơ Supabase.
 * Tuyệt đối không hardcode tài khoản mẫu nào.
 */
export function isCompanyAdmin(user) {
  if (!user) return false;
  return user.isAdmin === true || user.is_admin === true;
}

/**
 * Phân quyền cho đối tượng user:
 * Giữ nguyên trạng thái is_admin thực tế từ Supabase (mặc định là false nếu chưa được cấp).
 */
export function resolveUserRole(rawUser) {
  if (!rawUser) return null;

  const isAdmin = rawUser.isAdmin === true || rawUser.is_admin === true;

  return {
    ...rawUser,
    isAdmin,
    is_admin: isAdmin,
    role: isAdmin ? 'admin' : 'user'
  };
}

/**
 * Tra cứu quyền Admin chính xác từ bảng `profiles` trên Supabase
 */
export async function fetchUserAdminStatusFromSupabase(userId, email) {
  if (!supabase || (!userId && !email)) return false;

  try {
    let query = supabase.from('profiles').select('is_admin');
    if (userId && email) {
      query = query.or(`id.eq.${userId},email.eq.${email}`);
    } else if (userId) {
      query = query.eq('id', userId);
    } else {
      query = query.eq('email', email);
    }

    const { data, error } = await query.maybeSingle();
    if (error || !data) return false;
    return !!data.is_admin;
  } catch {
    return false;
  }
}

/**
 * Đồng bộ người dùng vào bảng `profiles` trên Supabase khi đăng nhập:
 * - Nếu người dùng ĐÃ CÓ trong profiles: Giữ nguyên quyền `is_admin` hiện có của họ.
 * - Nếu là người dùng MỚI toanh: Tự động gán `is_admin: false` (Người dùng phổ thông).
 */
export async function syncUserRoleToSupabase(user) {
  if (!user || !supabase || !user.id) return user;

  const email = user.email || '';
  const userId = email ? email.split('@')[0] : String(user.id).slice(0, 8);

  try {
    // 1. Kiểm tra xem tài khoản này đã có hồ sơ trong bảng profiles chưa
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .maybeSingle();

    let finalIsAdmin = false;

    if (existingProfile) {
      // Đã có hồ sơ -> giữ nguyên quyền admin trên Supabase
      finalIsAdmin = !!existingProfile.is_admin;
    } else {
      // Người dùng mới đăng ký -> Mặc định là FALSE (Người dùng phổ thông)
      finalIsAdmin = false;
      await supabase.from('profiles').insert({
        id: user.id,
        userid: userId,
        username: user.name || 'Học viên',
        email: email,
        is_admin: false
      });
    }

    return {
      ...user,
      isAdmin: finalIsAdmin,
      is_admin: finalIsAdmin,
      role: finalIsAdmin ? 'admin' : 'user'
    };
  } catch (err) {
    console.warn('[RoleService] Không thể đồng bộ profiles:', err?.message);
    return user;
  }
}
