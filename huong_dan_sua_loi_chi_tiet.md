# Hướng dẫn sửa lỗi — Từng bước một

> [!NOTE]
> Chỉ có **2 lỗi cần bạn tự sửa**, cả hai đều sửa bằng cách **chạy SQL trên Supabase**. Hai lỗi còn lại tôi đã sửa sẵn trong code, bạn không cần làm gì.

| Lỗi | Ai sửa | Mất bao lâu |
|---|---|---|
| **Lỗi 1** — Nút Lưu không hoạt động (Storage chặn ghi) | Bạn (chạy SQL Bước A) | ~3 phút |
| **Lỗi 2** — Học viên tự phong được Admin | Bạn (chạy SQL Bước B) | ~2 phút |
| Lỗi 3 — `.catch()` làm hỏng tiến độ học | ✅ Tôi đã sửa trong code | — |
| Lỗi 4 — Thông báo lỗi tiếng Anh khó hiểu | ✅ Tôi đã sửa trong code | — |

---

# 0. Chuẩn bị (làm 1 lần)

**Bước 0.1** — Mở trang Admin trong app.

- Mở `http://localhost:5173/MewTinHoc/`
- Đăng nhập bằng Google với tài khoản **`jaxcater1906@gmail.com`**
- Bấm nút **`🛡 Admin`** ở góc trên bên phải

> [!WARNING]
> Phải đăng nhập bằng **Google thật**. Nút *"⚡ Vào nhanh trải nghiệm"* tạo tài khoản ảo không có session Supabase nên sẽ không lưu được.

**Bước 0.2** — Trên trang Admin, tìm dòng nút ở khung tìm kiếm. Bạn sẽ thấy nút mới:

```
[ 🗄 Xem câu lệnh SQL Supabase ]  [ 🔧 Kiểm tra quyền ghi Storage ]  [ ↻ Tải lại ]
```

**Bước 0.3** — Bấm **`🔧 Kiểm tra quyền ghi Storage`** để xem tình trạng hiện tại.

Kết quả sẽ hiện ra **khung đỏ** đại loại:

> 🛡 **Quyền ghi Storage: ĐANG BỊ CHẶN (HTTP 403)**
> Supabase đã từ chối vì chưa có policy cho phép ghi (RLS)...

✅ Nếu thấy khung đỏ này → bạn đang gặp **Lỗi 1**, làm tiếp Bước A.
🟢 Nếu thấy khung xanh → Lỗi 1 đã hết, bỏ qua Bước A.

**Bước 0.4** — Lấy SQL. Bấm nút **`🗄 Xem câu lệnh SQL Supabase`** để mở khung SQL màu đen.

---

# 1. Sửa LỖI 1 — Mở quyền ghi Storage (nút Lưu chạy được)

### Bước A.1 — Mở Supabase SQL Editor

Bấm vào link này (hoặc mở thủ công **Supabase → SQL Editor → New query**):

```
https://supabase.com/dashboard/project/vxqvjffssebnuxtslghp/sql/new
```

> [!TIP]
> Trong khung SQL màu đen trên trang Admin cũng có sẵn link **"Mở trang Storage của dự án"** — dùng để kiểm tra bucket sau khi chạy xong.

### Bước A.2 — Dán đoạn SQL này và bấm **Run**

Đây là **phần 1** của bản sửa, chỉ gồm những gì cần để mở khoá nút Lưu:

```sql
-- ==============================================================
-- HÀM PHỤ TRỢ: kiểm tra người đang đăng nhập có phải Admin không
-- (SECURITY DEFINER để tránh lỗi đệ quy vô hạn)
-- ==============================================================
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT COALESCE((SELECT p.is_admin FROM public.profiles p WHERE p.id = auth.uid()), false);
$$;

-- ==============================================================
-- MỞ QUYỀN GHI FILE LÊN STORAGE CHO ADMIN
-- ==============================================================
DROP POLICY IF EXISTS "storage_insert_admin" ON storage.objects;
DROP POLICY IF EXISTS "storage_update_admin" ON storage.objects;
DROP POLICY IF EXISTS "storage_read_admin" ON storage.objects;

CREATE POLICY "storage_insert_admin" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'KhoTaiLieuTinHocThiThu' AND public.is_admin_user());

CREATE POLICY "storage_update_admin" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'KhoTaiLieuTinHocThiThu' AND public.is_admin_user())
  WITH CHECK (bucket_id = 'KhoTaiLieuTinHocThiThu' AND public.is_admin_user());

CREATE POLICY "storage_read_admin" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'KhoTaiLieuTinHocThiThu' AND public.is_admin_user());
```

**Kết quả mong đợi:** Supabase hiện dòng xanh **`Success. No rows returned`**.
Đây là bình thường — câu lệnh `CREATE POLICY` không trả về dòng nào.

### Bước A.3 — Kiểm tra lại

Quay lại trang Admin → bấm **`🔧 Kiểm tra quyền ghi Storage`** lần nữa.

🟢 **Thấy khung xanh** → xong Lỗi 1. Chuyển sang phần 2.
🔴 **Vẫn khung đỏ** → xem phần **Khắc phục sự cố** ở cuối.

### Bước A.4 — Thử lưu thật

1. Vào tab **Lộ trình**
2. Mở một bài bất kỳ
3. Bấm nút **`📄 Chỉnh sửa nội dung`** (màu cam)
4. Sửa thử vài chữ trong ô *Tóm tắt*
5. Bấm **`💾 Lưu & Đồng bộ Supabase`** ở thanh trên cùng

✅ **Banner xanh:** *"Đã lưu & đồng bộ lên Supabase Storage..."* → **Lỗi 1 đã hết hoàn toàn**
❌ **Banner đỏ:** ghi lại nguyên văn dòng chữ và gửi tôi.

---

# 2. Sửa LỖI 2 — Vá bảo mật bảng `profiles`

> [!IMPORTANT]
> Lỗi này **không** làm web hỏng, nhưng là lỗ hổng: vì khoá `anon` nằm công khai trong file JS của web, người lạ mở DevTools có thể tự gán `is_admin = true` cho chính họ rồi vào trang Admin.

### Bước B.1 — Dán đoạn SQL này và bấm **Run**

Vẫn trong Supabase SQL Editor, xoá nội dung cũ (Ctrl+A rồi Delete), dán đoạn sau:

```sql
-- ==============================================================
-- (TÙY CHỌN NHƯNG NÊN LÀM) Cấp Admin cho đúng danh sách email
-- Sửa/thêm/bớt email ở đây rồi chạy lại khi cần
-- ==============================================================
UPDATE public.profiles
SET is_admin = TRUE
WHERE email IN (
  'jaxcater1906@gmail.com',
  'thannhi0948@gmail.com',
  'kado30az@gmail.com',
  'killeran72@gmail.com'
);

-- ==============================================================
-- XOÁ các policy cũ đang mở toàn bộ
-- ==============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Cho phép xem profiles" ON public.profiles;
DROP POLICY IF EXISTS "Cho phép cập nhật profiles" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_self" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_admin_only" ON public.profiles;

-- XEM: mỗi người chỉ xem hồ sơ của mình; Admin xem được TẤT CẢ
CREATE POLICY "profiles_select_own_or_admin" ON public.profiles
  FOR SELECT USING (id = auth.uid() OR public.is_admin_user());

-- THÊM MỚI: chỉ tạo được hồ sơ cho chính mình, KHÔNG tự nâng quyền Admin
CREATE POLICY "profiles_insert_self" ON public.profiles
  FOR INSERT WITH CHECK (id = auth.uid() AND is_admin = false);

-- CẬP NHẬT: chỉ Admin được đổi quyền
CREATE POLICY "profiles_update_admin_only" ON public.profiles
  FOR UPDATE USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());
```

**Kết quả mong đợi:** dòng xanh **`Success. No rows returned`**.

### Bước B.2 — Kiểm tra lại trang Admin

1. Bấm **`↻ Tải lại`**
2. Bảng vẫn phải hiện **đủ 7 tài khoản** (vì bạn là Admin)
3. Thử gạt công tắc **Phân quyền** của một học viên → phải đổi được bình thường

> [!NOTE]
> Nếu bảng **trắng trơn** sau bước này, nghĩa là tài khoản của bạn chưa phải Admin trong CSDL. Chạy lại riêng câu `UPDATE ... WHERE email IN (...)` ở trên.

---

# 3. Hai lỗi đã sửa sẵn — không cần làm gì

### ✅ Lỗi 3 — `.catch()` làm hỏng tiến độ học

**Vấn đề:** [userProgress.js](file:///c:/Users/Jax/Documents/MewTinHoc/src/lib/userProgress.js) có 3 chỗ gọi `.catch()` trên truy vấn Supabase. Thư viện Supabase **không có hàm này**, nên sẽ ném `TypeError` và **đẩy toàn bộ tiến độ học sang chế độ offline** (mất streak, mất bài đã hoàn thành khi tải lại trang).

**Đã sửa:** chuyển sang `await` rồi kiểm tra biến `error`. Bạn không cần làm gì.

### ✅ Lỗi 4 — Thông báo lỗi tiếng Anh khó hiểu

**Vấn đề:** khi bấm Lưu thất bại, app hiện nguyên văn *"new row violates row-level security policy"* — rất khó hiểu.

**Đã sửa:** [roadmapStorage.js](file:///c:/Users/Jax/Documents/MewTinHoc/src/lib/roadmapStorage.js#L262-L281) giờ dịch thành tiếng Việt và chỉ thẳng cách sửa.

---

# 4. Checklist kiểm tra cuối cùng

- [ ] Đăng nhập Google bằng `jaxcater1906@gmail.com`
- [ ] Trang Admin: bấm **Kiểm tra quyền ghi Storage** → 🟢 khung xanh
- [ ] Trang Admin: bảng hiện đủ 7 tài khoản
- [ ] Tab **Lộ trình** → mở 1 bài → thấy nút **Chỉnh sửa nội dung**
- [ ] Sửa chữ → **Lưu & Đồng bộ Supabase** → 🟢 banner xanh
- [ ] Nhấn **Ctrl + F5** → nội dung vẫn là bản vừa sửa
- [ ] Đăng xuất, đăng nhập bằng 1 tài khoản học viên → **không** thấy nút chỉnh sửa

---

# 5. Khắc phục sự cố

### 🔴 Chạy SQL báo lỗi `relation "storage.objects" does not exist`

Bạn đang chạy nhầm database. Kiểm tra thanh trên cùng Supabase đã chọn đúng project `vxqvjffssebnuxtslghp` chưa.

### 🔴 Chạy SQL báo lỗi `permission denied` hoặc `must be owner of table`

SQL Editor đang chạy bằng role không đủ quyền. Vào **Supabase → Project Settings → Database**, kiểm tra bạn đang dùng role `postgres`. Nếu vẫn lỗi, báo tôi.

### 🔴 Vẫn khung đỏ 403 sau khi chạy Bước A

Nguyên nhân thường gặp: **đã đăng nhập bằng nút "Vào nhanh trải nghiệm"** thay vì Google. Nút đó không tạo session Supabase nên `auth.uid()` rỗng → bị chặn.

**Cách xử lý:** Đăng xuất → đăng nhập lại bằng **Google**.

### 🔴 Kiểm tra xanh nhưng bấm Lưu vẫn đỏ

Ghi lại **nguyên văn** dòng chữ trong banner đỏ rồi gửi tôi — thông báo đó giờ đã được dịch sang tiếng Việt nên sẽ chỉ rõ vấn đề.

### ℹ️ Muốn quay lại trạng thái cũ (mở toàn bộ quyền)

Chạy `DROP POLICY` cho 3 policy `storage_*_admin` và tạo lại policy cũ `FOR ALL USING (true)`. **Không khuyến khích** vì mở lại lỗ hổng bảo mật.

---

# 6. Tóm tắt 1 câu

**Vào trang Admin → đăng nhập Google → bấm "Kiểm tra quyền ghi Storage" → nếu khung đỏ thì mở SQL Editor chạy Bước A → kiểm tra lại → rồi chạy Bước B. Xong.**
