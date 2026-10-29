import { CHUONG_1_QUIZ } from '../questions/chuong1.js';
/**
 * ==============================================================================
 * DỮ LIỆU LỘ TRÌNH DÂY XÍCH & BÀI GIẢNG LÝ THUYẾT (CHUẨN 2025)
 * BÁM SÁT MỤC LỤC TÀI LIỆU ÔN TẬP THEO CHỦ ĐỀ VÀ ĐỀ ÔN TẬP
 * ==============================================================================
 */

export const ICT_EXAM_STRUCTURE = {
  "title": "Cấu Trúc Đề Thi THPTQG Môn Tin Học — Định Hướng Tin Học Ứng Dụng (ICT)",
  "duration": "50 phút",
  "totalQuestions": "22 câu hỏi",
  "parts": [
    {
      "part": "Phần I",
      "format": "18 câu trắc nghiệm 4 lựa chọn (Câu 1 đến 18)",
      "focus": "Lý thuyết nền tảng dùng chung (Chủ đề A, B, D, G) + Kiến thức chung Tin học ứng dụng",
      "points": "4.5 điểm (0.25đ / câu)"
    },
    {
      "part": "Phần II",
      "format": "4 câu trắc nghiệm Đúng/Sai (Câu 1 đến 4, mỗi câu 4 lệnh a, b, c, d)",
      "focus": "Chuyên sâu ICT (Câu 3 & 4): Bảng tính Excel nâng cao (Hàm IF/AND/OR, VLOOKUP, SUMIF, Pivot Table), Thiết kế Web HTML/CSS, Biên tập Đồ họa & Video",
      "points": "4.0 điểm (Lũy tiến max 1.0đ / câu)"
    }
  ]
};

export const ICT_12_WEEK_PLAN = [
  {
    "phase": "Giai đoạn 1",
    "weeks": "Tuần 1 - 4",
    "title": "Ôn chắc 6 Chủ đề chung & Trắc nghiệm Phần I",
    "targetScore": "4.5 - 5.0 điểm nền tảng",
    "content": "Ôn tập toàn bộ 6 chủ đề chung của cả CS và ICT: Chủ đề 1 (Trí tuệ nhân tạo), Chủ đề 2 (Mạng máy tính & Internet), Chủ đề 3 (Đạo đức, pháp luật & văn hóa số), Chủ đề 4 (Giới thiệu CSDL), Chủ đề 5 (Tạo trang web HTML & CSS), Chủ đề 6 (Hướng nghiệp với Tin học). Đảm bảo làm nhanh và chính xác 100% các câu hỏi nhận biết - thông hiểu (Phần I) để nắm chắc 4.5 - 5.0 điểm nền tảng."
  },
  {
    "phase": "Giai đoạn 2",
    "weeks": "Tuần 5 - 9",
    "title": "Luyện sâu Kỹ năng Bảng tính Excel & Thiết kế Web HTML/CSS (Chuyên sâu ICT)",
    "targetScore": "7.5 - 8.5 điểm",
    "content": "Thực hành giải các kịch bản Đúng/Sai Phần II dành riêng cho ICT: Địa chỉ ô tuyệt đối ($A$1), các hàm thống kê và tìm kiếm (IF/AND/OR, VLOOKUP, SUMIF, Pivot Table), cấu trúc thẻ HTML (table, form, input) và định dạng thuộc tính CSS; Biên tập đồ họa & video số."
  },
  {
    "phase": "Giai đoạn 3",
    "weeks": "Tuần 10 - 12",
    "title": "Luyện đề Tổng hợp 50 phút & Bẫy điểm Đúng/Sai",
    "targetScore": "9.0 - 10.0 điểm tuyệt đối",
    "content": "Giải các bộ đề thi thử bám sát định dạng cấu trúc đề minh họa mới nhất. Kiểm soát bẫy câu Đúng/Sai, tối ưu hóa điểm số lũy tiến từng câu hỏi."
  }
];

export const ictRoadmapStations = [
  {
    "id": "ict_station_1",
    "stepNumber": "01",
    "code": "Chủ đề 1",
    "title": "Giới thiệu Trí tuệ nhân tạo",
    "category": "Kiến thức chung",
    "priority": "Cao",
    "priorityBadge": "high",
    "questionType": "Trắc nghiệm Phần I (2 - 3 câu)",
    "bookRef": "Trang 4 - 9",
    "pdfUrl": "https://vxqvjffssebnuxtslghp.supabase.co/storage/v1/object/sign/KhoTaiLieuTinHocThiThu/Chuong%201/Tai_Lieu_On_Thi_Chu_De_1_Gioi_Thieu_AI%20(1).pdf?token=eyJraWQiOiIzMmIzYzRjYi0yYTZjLTRmYjUtOTJkNS0yNzIwNDk0NzJjOTUiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJLaG9UYWlMaWV1VGluSG9jVGhpVGh1L0NodW9uZyAxL1RhaV9MaWV1X09uX1RoaV9DaHVfRGVfMV9HaW9pX1RoaWV1X0FJICgxKS5wZGYiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzkzMjUyMTM5LCJleHAiOjQ5MTUzMTYxMzl9.YZNQe7ENpJlcU_CrttppDjNoAeKybC9utIlw4kbTdUXzHmKjFOZcM03k7MVJTs_EFKdWaqwrGfach-TdL0yZlg",
    "description": "Khái niệm Trí tuệ nhân tạo (AI), các ứng dụng thực tế trong công việc văn phòng, truyền thông, kinh tế số và tác động xã hội của AI.",
    "skills": [
      "Khái niệm & Ứng dụng thực tế của AI",
      "Phân loại AI hẹp trong đời sống",
      "AI tạo sinh & Trợ lý thông minh",
      "Tác động của AI đối với nghề nghiệp"
    ],
    "xp": 260,
    "quiz": CHUONG_1_QUIZ
  },
  {
    "id": "ict_station_2",
    "stepNumber": "02",
    "code": "Chủ đề 2",
    "title": "Mạng máy tính và Internet",
    "category": "Kiến thức chung",
    "priority": "Trung bình",
    "priorityBadge": "normal",
    "questionType": "Trắc nghiệm Phần I (2 câu)",
    "bookRef": "Trang 10 - 19",
    "pdfUrl": "https://vxqvjffssebnuxtslghp.supabase.co/storage/v1/object/sign/KhoTaiLieuTinHocThiThu/Chuong%202/Tai_Lieu_On_Thi_Chu_De_2_Mang_May_Tinh_Va_Internet.pdf?token=eyJraWQiOiIzMmIzYzRjYi0yYTZjLTRmYjUtOTJkNS0yNzIwNDk0NzJjOTUiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJLaG9UYWlMaWV1VGluSG9jVGhpVGh1L0NodW9uZyAyL1RhaV9MaWV1X09uX1RoaV9DaHVfRGVfMl9NYW5nX01heV9UaW5oX1ZhX0ludGVybmV0LnBkZiIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3OTMyNTIyMDMsImV4cCI6NDkxNTMxNjIwM30.pGq-Pc8FnoCSvNBh8yaNMS5Wk83d5AIr65dszz_vgXnYWJlWbsNVI02tJ62ORF7HucKTCanlq_zbc5BhPyKQTA",
    "description": "Mạng cục bộ LAN, thiết bị mạng Switch/Router/Access Point, dịch vụ Internet, kết nối mạng Wi-Fi và dịch vụ lưu trữ đám mây (Google Drive, OneDrive).",
    "skills": [
      "Mạng cục bộ LAN & Thiết bị kết nối",
      "Dịch vụ Internet & Web",
      "Mạng Wi-Fi an toàn",
      "Lưu trữ đám mây (Cloud Storage)"
    ],
    "xp": 280
  },
  {
    "id": "ict_station_3",
    "stepNumber": "03",
    "code": "Chủ đề 3",
    "title": "Đạo đức, pháp luật và văn hoá trong môi trường số",
    "category": "Kiến thức chung",
    "priority": "Trung bình",
    "priorityBadge": "normal",
    "questionType": "Trắc nghiệm Phần I (1 - 2 câu)",
    "bookRef": "Trang 20 - 24",
    "pdfUrl": "https://vxqvjffssebnuxtslghp.supabase.co/storage/v1/object/sign/KhoTaiLieuTinHocThiThu/Chuong%203/Tai_Lieu_On_Thi_THPTQG_Tin_Hoc_Chu_De_3_Dao_Duc_Phap_Luat_V%20(1).pdf?token=eyJraWQiOiIzMmIzYzRjYi0yYTZjLTRmYjUtOTJkNS0yNzIwNDk0NzJjOTUiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJLaG9UYWlMaWV1VGluSG9jVGhpVGh1L0NodW9uZyAzL1RhaV9MaWV1X09uX1RoaV9USFBUUUdfVGluX0hvY19DaHVfRGVfM19EYW9fRHVjX1BoYXBfTHVhdF9WICgxKS5wZGYiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzkzMjUyMjMwLCJleHAiOjQ5MTUzMTYyMzB9.zjfZuqln89O7LoqOpuUrWsAPZnMAZgA3mlq4km4iZcuO8cqIZgSofeCTuL27kKmNwIP3x3q6wkW0LzuDM9Ewmw",
    "description": "Bản quyền phần mềm, sở hữu trí tuệ, tác quyền số, an toàn thông tin, Luật An ninh mạng và văn hóa ứng xử trên mạng xã hội.",
    "skills": [
      "Bản quyền phần mềm & Tác quyền số",
      "Luật An ninh mạng & Bảo vệ dữ liệu",
      "Văn hóa ứng xử trên không gian mạng",
      "Phòng tránh lừa đảo & Rủi ro số"
    ],
    "xp": 220
  },
  {
    "id": "ict_station_4",
    "stepNumber": "04",
    "code": "Chủ đề 4",
    "title": "Giới thiệu các hệ Cơ sở dữ liệu",
    "category": "Kiến thức chung",
    "priority": "Cao",
    "priorityBadge": "high",
    "questionType": "Trắc nghiệm Phần I (2 - 3 câu)",
    "bookRef": "Trang 25 - 39",
    "pdfUrl": "https://vxqvjffssebnuxtslghp.supabase.co/storage/v1/object/sign/KhoTaiLieuTinHocThiThu/Chuong%204/Tai_Lieu_On_Thi_THPTQG_Tin_Hoc_Chu_De_4_Gioi_Thieu_Cac_He_C.pdf?token=eyJraWQiOiIzMmIzYzRjYi0yYTZjLTRmYjUtOTJkNS0yNzIwNDk0NzJjOTUiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJLaG9UYWlMaWV1VGluSG9jVGhpVGh1L0NodW9uZyA0L1RhaV9MaWV1X09uX1RoaV9USFBUUUdfVGluX0hvY19DaHVfRGVfNF9HaW9pX1RoaWV1X0NhY19IZV9DLnBkZiIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3OTMyNTIyODQsImV4cCI6NDkxNTMxNjI4NH0.enU92Pcle1wbbBLluhyrumI_eDHR_ISiDaZLW6l2lS_EdC7l4GaEGzWU-9PXE-ajrXnKKONB5u26qQGDkhFn-A",
    "description": "Khái niệm CSDL & Hệ Quản trị CSDL (DBMS), mô hình quan hệ, bảng dữ liệu, khóa chính (Primary Key), khóa ngoại (Foreign Key) và truy vấn dữ liệu SQL căn bản.",
    "skills": [
      "Khái niệm CSDL & Hệ QTCSDL",
      "Bảng dữ liệu & Khóa chính",
      "Khóa ngoại & Liên kết bảng",
      "Truy vấn SQL cơ bản"
    ],
    "xp": 320
  },
  {
    "id": "ict_station_5",
    "stepNumber": "05",
    "code": "Chủ đề 5",
    "title": "Tạo trang web với HTML và CSS",
    "category": "Kiến thức chung",
    "priority": "Cao",
    "priorityBadge": "high",
    "questionType": "Trắc nghiệm Phần I (2 - 3 câu)",
    "bookRef": "Trang 40 - 74",
    "pdfUrl": "https://vxqvjffssebnuxtslghp.supabase.co/storage/v1/object/sign/KhoTaiLieuTinHocThiThu/Chuong%205/Tai_Lieu_On_Thi_THPTQG_Tin_Hoc_Chu_De_5_Tao_Trang_Web_HTML_.pdf?token=eyJraWQiOiIzMmIzYzRjYi0yYTZjLTRmYjUtOTJkNS0yNzIwNDk0NzJjOTUiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJLaG9UYWlMaWV1VGluSG9jVGhpVGh1L0NodW9uZyA1L1RhaV9MaWV1X09uX1RoaV9USFBUUUdfVGluX0hvY19DaHVfRGVfNV9UYW9fVHJhbmdfV2ViX0hUTUxfLnBkZiIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3OTMyNTIzMjgsImV4cCI6NDkxNTMxNjMyOH0.wTMG6EcLtofMwtfauGiXNuOCK9CKDIy2M9izl7eItPUOwoee3PhBCLSEswH8E82peV3naBiY1TACgi7Y2Lz9iQ",
    "description": "Cấu trúc văn bản siêu liên kết HTML, các thẻ định dạng, chèn hình ảnh, tạo bảng (table), biểu mẫu (form), danh sách, siêu liên kết và ngôn ngữ CSS định kiểu trang web.",
    "skills": [
      "Cấu trúc trang web HTML",
      "Thẻ Bảng (table) & Form nhập liệu",
      "Thẻ liên kết (a) & Danh sách (ul, ol)",
      "Định kiểu CSS (Color, Font, Box Model)"
    ],
    "xp": 350
  },
  {
    "id": "ict_station_6",
    "stepNumber": "06",
    "code": "Chủ đề 6",
    "title": "Hướng nghiệp với tin học",
    "category": "Kiến thức chung",
    "priority": "Thấp",
    "priorityBadge": "low",
    "questionType": "Trắc nghiệm Phần I (1 câu)",
    "bookRef": "Trang 75 - 80",
    "pdfUrl": "https://vxqvjffssebnuxtslghp.supabase.co/storage/v1/object/sign/KhoTaiLieuTinHocThiThu/Chuong%206/Tai_Lieu_On_Thi_THPTQG_Tin_Hoc_Chu_De_6_Huong_Nghiep_Voi_Ti.pdf?token=eyJraWQiOiIzMmIzYzRjYi0yYTZjLTRmYjUtOTJkNS0yNzIwNDk0NzJjOTUiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJLaG9UYWlMaWV1VGluSG9jVGhpVGh1L0NodW9uZyA2L1RhaV9MaWV1X09uX1RoaV9USFBUUUdfVGluX0hvY19DaHVfRGVfNl9IdW9uZ19OZ2hpZXBfVm9pX1RpLnBkZiIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3OTMyNTIzNDcsImV4cCI6NDkxNTMxNjM0N30.WBvqvoYgL2dNX0QVuk8DTo1kbMrDRAJeUWLoemNjDuHNT8gsXo6QzUbZE2W5DsVafqgd8SOH4FHnRgUOF_MNlQ",
    "description": "Các nhóm ngành nghề ứng dụng CNTT trong doanh nghiệp, quản trị web, truyền thông đa phương tiện, thiết kế đồ họa và định hướng phát triển nghề nghiệp số.",
    "skills": [
      "Nhóm ngành nghề ứng dụng CNTT",
      "Nghề quản trị Website & Đồ họa số",
      "Yêu cầu năng lực & Xu hướng số",
      "Định hướng nghề nghiệp tương lai"
    ],
    "xp": 200
  },
  {
    "id": "ict_station_7",
    "stepNumber": "07",
    "code": "Chủ đề ICT 1",
    "title": "Thực hành tạo và khai thác Cơ sở dữ liệu",
    "category": "Chuyên sâu Tin học ứng dụng",
    "priority": "Cực kỳ quan trọng",
    "priorityBadge": "extreme",
    "questionType": "Trắc nghiệm Đúng/Sai Phần II (Câu 3 - 4)",
    "bookRef": "Trang 114 - 121",
    "pdfUrl": "https://vxqvjffssebnuxtslghp.supabase.co/storage/v1/object/sign/KhoTaiLieuTinHocThiThu/Chuong%20lap%20trinh%20CS%20AND%20ICT/Tai_Lieu_On_Thi_TN_THPT_Tin_Hoc_ICT_Thuc_Hanh_CSDL.pdf?token=eyJraWQiOiIzMmIzYzRjYi0yYTZjLTRmYjUtOTJkNS0yNzIwNDk0NzJjOTUiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJLaG9UYWlMaWV1VGluSG9jVGhpVGh1L0NodW9uZyBsYXAgdHJpbmggQ1MgQU5EIElDVC9UYWlfTGlldV9Pbl9UaGlfVE5fVEhQVF9UaW5fSG9jX0lDVF9UaHVjX0hhbmhfQ1NETC5wZGYiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzkzMjg2NjI1LCJleHAiOjQ5MTUzNTA2MjV9.CbIRLw7rWMINowpkOtXsbaHQKkCrfbsfJUfvgc9XPB60AWwow3-Z9Y7ZlGYn153IJa-8jE7miPTdX211yTH2_A",
    "description": "Thực hành tạo bảng dữ liệu, khóa chính, liên kết bảng, xử lý dữ liệu bảng tính nâng cao, các hàm Logic (IF, AND, OR), hàm tra cứu (VLOOKUP, HLOOKUP), thống kê có điều kiện (SUMIF, COUNTIF), Pivot Table và trích lọc dữ liệu.",
    "skills": [
      "Tạo bảng CSDL & Khóa chính",
      "Hàm Logic (IF, AND, OR) & VLOOKUP",
      "Hàm thống kê (SUMIF, COUNTIF)",
      "Pivot Table & Lọc dữ liệu nâng cao"
    ],
    "xp": 400
  },
  {
    "id": "ict_station_8",
    "stepNumber": "08",
    "code": "Chủ đề ICT 2",
    "title": "Sử dụng phần mềm tạo trang web",
    "category": "Chuyên sâu Tin học ứng dụng",
    "priority": "Rất cao",
    "priorityBadge": "extreme",
    "questionType": "Trắc nghiệm Đúng/Sai Phần II",
    "bookRef": "Trang 122 - 130",
    "pdfUrl": "https://vxqvjffssebnuxtslghp.supabase.co/storage/v1/object/sign/KhoTaiLieuTinHocThiThu/Chuong%20lap%20trinh%20CS%20AND%20ICT/Tai_Lieu_On_Thi_TN_THPT_Tin_Hoc_ICT_Tao_Trang_Web.pdf?token=eyJraWQiOiIzMmIzYzRjYi0yYTZjLTRmYjUtOTJkNS0yNzIwNDk0NzJjOTUiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJLaG9UYWlMaWV1VGluSG9jVGhpVGh1L0NodW9uZyBsYXAgdHJpbmggQ1MgQU5EIElDVC9UYWlfTGlldV9Pbl9UaGlfVE5fVEhQVF9UaW5fSG9jX0lDVF9UYW9fVHJhbmdfV2ViLnBkZiIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3OTMyODY2MDIsImV4cCI6NDkxNTM1MDYwMn0.hoPB_p61IsI6e6_sPfQr_FYIdHFW14-ll1CUSb4jQ3wHB4p9RGIx1L3STDN83MDMmdnubwsHdt7gF-nePmzbcQ",
    "description": "Sử dụng phần mềm thiết kế và biên tập trang web trực quan, thiết kế bố cục giao diện đa phương tiện, tích hợp hình ảnh lớp (Layer), video clip, đóng gói và xuất bản website lên Internet.",
    "skills": [
      "Phần mềm tạo trang web trực quan",
      "Thiết kế bố cục & Cây trang web",
      "Đồ họa đa phương tiện & Video cho Web",
      "Kiểm thử & Xuất bản Website"
    ],
    "xp": 380
  },
  {
    "id": "ict_station_9",
    "stepNumber": "09",
    "code": "Phần II",
    "title": "Đề ôn tập & Bảng ma trận năng lực",
    "category": "Luyện đề thi THPTQG",
    "priority": "Về đích",
    "priorityBadge": "extreme",
    "questionType": "Tổng hợp 22 câu (Phần I + II)",
    "bookRef": "Trang 131 - 180",
    "pdfUrl": "",
    "description": "Bảng năng lực và cấp độ tư duy đề ôn tập (Nhận biết, Thông hiểu, Vận dụng), chiến thuật phân bổ 50 phút cho 22 câu thi và các bộ đề ôn tập chuẩn cấu trúc đề thi Tốt nghiệp THPT Bộ GD&ĐT.",
    "skills": [
      "Ma trận năng lực & Cấp độ tư duy",
      "Chiến thuật xử lý câu Đúng/Sai lũy tiến",
      "Phân bổ thời gian 50 phút tối ưu",
      "Luyện đề thi thử bứt phá 9.5+ ICT"
    ],
    "xp": 500
  }
];
