import { CHUONG_1_QUIZ } from '../questions/chuong1.js';
/**
 * ==============================================================================
 * DỮ LIỆU LỘ TRÌNH HỌC & BÀI GIẢNG LÝ THUYẾT (CHUẨN 2025)
 * BÁM SÁT MỤC LỤC TÀI LIỆU ÔN TẬP THEO CHỦ ĐỀ VÀ ĐỀ ÔN TẬP
 * ==============================================================================
 */

export const CS_EXAM_STRUCTURE = {
  "title": "Cấu Trúc Đề Thi THPTQG Môn Tin Học — Định Hướng Khoa Học Máy Tính (CS)",
  "duration": "50 phút",
  "totalQuestions": "22 câu hỏi",
  "parts": [
    {
      "part": "Phần I",
      "format": "18 câu trắc nghiệm 4 lựa chọn (Câu 1 đến 18)",
      "focus": "Lý thuyết nền tảng dùng chung (Chủ đề A, B, D, G) + CSDL cơ bản + Thuật toán tổng quát",
      "points": "4.5 điểm (0.25đ / câu)"
    },
    {
      "part": "Phần II",
      "format": "4 câu trắc nghiệm Đúng/Sai (Câu 1 đến 4, mỗi câu 4 lệnh a, b, c, d)",
      "focus": "Chuyên sâu CS (Câu 3 & 4): Đọc mã Python, Thuật toán sắp xếp/tìm kiếm, CSDL & SQL, Trí tuệ nhân tạo (AI/Machine Learning)",
      "points": "4.0 điểm (Lũy tiến max 1.0đ / câu)"
    }
  ]
};

export const CS_12_WEEK_PLAN = [
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
    "title": "Cày sâu CSDL, SQL & Lập trình Python (Chuyên sâu CS)",
    "targetScore": "7.5 - 8.5 điểm",
    "content": "Tập trung giải các bài tập trắc nghiệm Đúng/Sai Phần II dành riêng cho CS: Đọc thuộc và truy vết chính xác các truy vấn SQL nâng cao (JOIN, GROUP BY, Subquery) và kịch bản Python (xử lý xâu, mảng 2 chiều, hàm đệ quy, thuật toán sắp xếp/tìm kiếm, AI/Machine Learning)."
  },
  {
    "phase": "Giai đoạn 3",
    "weeks": "Tuần 10 - 12",
    "title": "Luyện đề Tổng hợp 50 phút & Tối ưu bài thi Đúng/Sai",
    "targetScore": "9.0 - 10.0 điểm tuyệt đối",
    "content": "Luyện đề thi thử tổng hợp 50 phút. Áp dụng chiến thuật đánh câu Đúng/Sai lũy tiến: Đọc kỹ từng ý a, b, c, d để giành trọn 1.0 điểm cho mỗi câu hỏi Phần II."
  }
];

export const csRoadmapStations = [
  {
    "id": "cs_station_1",
    "stepNumber": "01",
    "code": "Chủ đề 1",
    "title": "Giới thiệu Trí tuệ nhân tạo",
    "category": "Kiến thức chung",
    "priority": "Cao",
    "priorityBadge": "high",
    "questionType": "Trắc nghiệm Phần I (2 - 3 câu)",
    "bookRef": "Trang 4 - 9",
    "pdfUrl": "https://vxqvjffssebnuxtslghp.supabase.co/storage/v1/object/sign/KhoTaiLieuTinHocThiThu/Chuong%201/Tai_Lieu_On_Thi_Chu_De_1_Gioi_Thieu_AI%20(1).pdf?token=eyJraWQiOiIzMmIzYzRjYi0yYTZjLTRmYjUtOTJkNS0yNzIwNDk0NzJjOTUiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJLaG9UYWlMaWV1VGluSG9jVGhpVGh1L0NodW9uZyAxL1RhaV9MaWV1X09uX1RoaV9DaHVfRGVfMV9HaW9pX1RoaWV1X0FJICgxKS5wZGYiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzkzMjUyMTM5LCJleHAiOjQ5MTUzMTYxMzl9.YZNQe7ENpJlcU_CrttppDjNoAeKybC9utIlw4kbTdUXzHmKjFOZcM03k7MVJTs_EFKdWaqwrGfach-TdL0yZlg",
    "description": "Khái niệm Trí tuệ nhân tạo (AI), phép thử Turing, lịch sử phát triển, phân loại AI hẹp (ANI) vs AI tổng quát (AGI), tác động của AI trong đời sống và kinh tế tri thức.",
    "skills": [
      "Khái niệm & Lịch sử phát triển AI",
      "Phép thử Turing (Turing Test)",
      "Phân loại AI hẹp (ANI) vs AGI",
      "Tác động xã hội & Đạo đức AI"
    ],
    "xp": 260,
    "quiz": CHUONG_1_QUIZ
  },
  {
    "id": "cs_station_2",
    "stepNumber": "02",
    "code": "Chủ đề 2",
    "title": "Mạng máy tính và Internet",
    "category": "Kiến thức chung",
    "priority": "Trung bình",
    "priorityBadge": "normal",
    "questionType": "Trắc nghiệm Phần I (2 câu)",
    "bookRef": "Trang 10 - 19",
    "pdfUrl": "https://vxqvjffssebnuxtslghp.supabase.co/storage/v1/object/sign/KhoTaiLieuTinHocThiThu/Chuong%202/Tai_Lieu_On_Thi_Chu_De_2_Mang_May_Tinh_Va_Internet.pdf?token=eyJraWQiOiIzMmIzYzRjYi0yYTZjLTRmYjUtOTJkNS0yNzIwNDk0NzJjOTUiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJLaG9UYWlMaWV1VGluSG9jVGhpVGh1L0NodW9uZyAyL1RhaV9MaWV1X09uX1RoaV9DaHVfRGVfMl9NYW5nX01heV9UaW5oX1ZhX0ludGVybmV0LnBkZiIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3OTMyNTIyMDMsImV4cCI6NDkxNTMxNjIwM30.pGq-Pc8FnoCSvNBh8yaNMS5Wk83d5AIr65dszz_vgXnYWJlWbsNVI02tJ62ORF7HucKTCanlq_zbc5BhPyKQTA",
    "description": "Thiết bị mạng Switch, Router, Access Point; mạng cục bộ LAN; giao thức mạng TCP/IP; địa chỉ IPv4/IPv6; mạng không dây Wi-Fi và Điện toán đám mây (IaaS, PaaS, SaaS).",
    "skills": [
      "Switch, Router & Access Point",
      "Giao thức TCP/IP & Địa chỉ IP/DNS",
      "Mạng không dây Wi-Fi",
      "Điện toán đám mây (Cloud Computing)"
    ],
    "xp": 280
  },
  {
    "id": "cs_station_3",
    "stepNumber": "03",
    "code": "Chủ đề 3",
    "title": "Đạo đức, pháp luật và văn hoá trong môi trường số",
    "category": "Kiến thức chung",
    "priority": "Trung bình",
    "priorityBadge": "normal",
    "questionType": "Trắc nghiệm Phần I (1 - 2 câu)",
    "bookRef": "Trang 20 - 24",
    "pdfUrl": "https://vxqvjffssebnuxtslghp.supabase.co/storage/v1/object/sign/KhoTaiLieuTinHocThiThu/Chuong%203/Tai_Lieu_On_Thi_THPTQG_Tin_Hoc_Chu_De_3_Dao_Duc_Phap_Luat_V%20(1).pdf?token=eyJraWQiOiIzMmIzYzRjYi0yYTZjLTRmYjUtOTJkNS0yNzIwNDk0NzJjOTUiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJLaG9UYWlMaWV1VGluSG9jVGhpVGh1L0NodW9uZyAzL1RhaV9MaWV1X09uX1RoaV9USFBUUUdfVGluX0hvY19DaHVfRGVfM19EYW9fRHVjX1BoYXBfTHVhdF9WICgxKS5wZGYiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzkzMjUyMjMwLCJleHAiOjQ5MTUzMTYyMzB9.zjfZuqln89O7LoqOpuUrWsAPZnMAZgA3mlq4km4iZcuO8cqIZgSofeCTuL27kKmNwIP3x3q6wkW0LzuDM9Ewmw",
    "description": "Bản quyền phần mềm, sở hữu trí tuệ, giấy phép phần mềm mã nguồn mở (GPL, Apache, MIT), Luật An ninh mạng và văn hóa ứng xử, bảo vệ dữ liệu cá nhân trên không gian số.",
    "skills": [
      "Bản quyền phần mềm & Tác quyền số",
      "Giấy phép mã nguồn mở (GPL, MIT)",
      "Luật An ninh mạng Việt Nam",
      "Văn hóa ứng xử & An toàn số"
    ],
    "xp": 220
  },
  {
    "id": "cs_station_4",
    "stepNumber": "04",
    "code": "Chủ đề 4",
    "title": "Giới thiệu các hệ Cơ sở dữ liệu",
    "category": "Kiến thức chung",
    "priority": "Rất cao",
    "priorityBadge": "high",
    "questionType": "Trắc nghiệm Phần I & II",
    "bookRef": "Trang 25 - 39",
    "pdfUrl": "https://vxqvjffssebnuxtslghp.supabase.co/storage/v1/object/sign/KhoTaiLieuTinHocThiThu/Chuong%204/Tai_Lieu_On_Thi_THPTQG_Tin_Hoc_Chu_De_4_Gioi_Thieu_Cac_He_C.pdf?token=eyJraWQiOiIzMmIzYzRjYi0yYTZjLTRmYjUtOTJkNS0yNzIwNDk0NzJjOTUiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJLaG9UYWlMaWV1VGluSG9jVGhpVGh1L0NodW9uZyA0L1RhaV9MaWV1X09uX1RoaV9USFBUUUdfVGluX0hvY19DaHVfRGVfNF9HaW9pX1RoaWV1X0NhY19IZV9DLnBkZiIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3OTMyNTIyODQsImV4cCI6NDkxNTMxNjI4NH0.enU92Pcle1wbbBLluhyrumI_eDHR_ISiDaZLW6l2lS_EdC7l4GaEGzWU-9PXE-ajrXnKKONB5u26qQGDkhFn-A",
    "description": "Khái niệm CSDL & Hệ Quản trị CSDL (DBMS), mô hình CSDL quan hệ, bảng dữ liệu, khóa chính (Primary Key), khóa ngoại (Foreign Key), liên kết bảng và ngôn ngữ truy vấn SQL.",
    "skills": [
      "Khái niệm CSDL & Hệ QTCSDL",
      "Bảng dữ liệu & Khóa chính (PK)",
      "Khóa ngoại & Mối quan hệ liên kết bảng",
      "Ngôn ngữ SQL (SELECT, JOIN, UPDATE)"
    ],
    "xp": 350
  },
  {
    "id": "cs_station_5",
    "stepNumber": "05",
    "code": "Chủ đề 5",
    "title": "Tạo trang web với HTML và CSS",
    "category": "Kiến thức chung",
    "priority": "Cao",
    "priorityBadge": "high",
    "questionType": "Trắc nghiệm Phần I (2 - 3 câu)",
    "bookRef": "Trang 40 - 74",
    "pdfUrl": "https://vxqvjffssebnuxtslghp.supabase.co/storage/v1/object/sign/KhoTaiLieuTinHocThiThu/Chuong%205/Tai_Lieu_On_Thi_THPTQG_Tin_Hoc_Chu_De_5_Tao_Trang_Web_HTML_.pdf?token=eyJraWQiOiIzMmIzYzRjYi0yYTZjLTRmYjUtOTJkNS0yNzIwNDk0NzJjOTUiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJLaG9UYWlMaWV1VGluSG9jVGhpVGh1L0NodW9uZyA1L1RhaV9MaWV1X09uX1RoaV9USFBUUUdfVGluX0hvY19DaHVfRGVfNV9UYW9fVHJhbmdfV2ViX0hUTUxfLnBkZiIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3OTMyNTIzMjgsImV4cCI6NDkxNTMxNjMyOH0.wTMG6EcLtofMwtfauGiXNuOCK9CKDIy2M9izl7eItPUOwoee3PhBCLSEswH8E82peV3naBiY1TACgi7Y2Lz9iQ",
    "description": "Cấu trúc văn bản siêu liên kết HTML, các thẻ định dạng, chèn hình ảnh, tạo bảng (table), biểu mẫu (form), danh sách, siêu liên kết và ngôn ngữ định kiểu CSS.",
    "skills": [
      "Cấu trúc tài liệu HTML",
      "Thẻ định dạng, Bảng (table) & Form",
      "Thẻ liên kết (a) & Danh sách (ul, ol)",
      "Định kiểu CSS (Color, Font, Box Model)"
    ],
    "xp": 320
  },
  {
    "id": "cs_station_6",
    "stepNumber": "06",
    "code": "Chủ đề 6",
    "title": "Hướng nghiệp với tin học",
    "category": "Kiến thức chung",
    "priority": "Thấp",
    "priorityBadge": "low",
    "questionType": "Trắc nghiệm Phần I (1 câu)",
    "bookRef": "Trang 75 - 80",
    "pdfUrl": "https://vxqvjffssebnuxtslghp.supabase.co/storage/v1/object/sign/KhoTaiLieuTinHocThiThu/Chuong%206/Tai_Lieu_On_Thi_THPTQG_Tin_Hoc_Chu_De_6_Huong_Nghiep_Voi_Ti.pdf?token=eyJraWQiOiIzMmIzYzRjYi0yYTZjLTRmYjUtOTJkNS0yNzIwNDk0NzJjOTUiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJLaG9UYWlMaWV1VGluSG9jVGhpVGh1L0NodW9uZyA2L1RhaV9MaWV1X09uX1RoaV9USFBUUUdfVGluX0hvY19DaHVfRGVfNl9IdW9uZ19OZ2hpZXBfVm9pX1RpLnBkZiIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3OTMyNTIzNDcsImV4cCI6NDkxNTMxNjM0N30.WBvqvoYgL2dNX0QVuk8DTo1kbMrDRAJeUWLoemNjDuHNT8gsXo6QzUbZE2W5DsVafqgd8SOH4FHnRgUOF_MNlQ",
    "description": "Các nhóm ngành nghề trong lĩnh vực Công nghệ thông tin, yêu cầu năng lực, phẩm chất kỷ nguyên số, cơ hội nghề nghiệp trong Khoa học dữ liệu, AI và kỹ sư phần mềm.",
    "skills": [
      "Nhóm ngành nghề CNTT",
      "Năng lực & Phẩm chất người làm nghề",
      "Định hướng nghề AI & Khoa học dữ liệu",
      "Kỷ nguyên số & Xu hướng việc làm"
    ],
    "xp": 200
  },
  {
    "id": "cs_station_7",
    "stepNumber": "07",
    "code": "Chủ đề CS 1",
    "title": "Kĩ thuật lập trình",
    "category": "Chuyên sâu Khoa học máy tính",
    "priority": "Cực kỳ quan trọng",
    "priorityBadge": "extreme",
    "questionType": "Trắc nghiệm Đúng/Sai Phần II (Câu 3 - 4)",
    "bookRef": "Trang 81 - 95",
    "pdfUrl": "https://vxqvjffssebnuxtslghp.supabase.co/storage/v1/object/sign/KhoTaiLieuTinHocThiThu/Chuong%20lap%20trinh%20CS%20AND%20ICT/Tai_Lieu_On_Thi_TN_THPT_Tin_Hoc_CS_Ki_Thuat_Lap_Trinh.pdf?token=eyJraWQiOiIzMmIzYzRjYi0yYTZjLTRmYjUtOTJkNS0yNzIwNDk0NzJjOTUiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJLaG9UYWlMaWV1VGluSG9jVGhpVGh1L0NodW9uZyBsYXAgdHJpbmggQ1MgQU5EIElDVC9UYWlfTGlldV9Pbl9UaGlfVE5fVEhQVF9UaW5fSG9jX0NTX0tpX1RodWF0X0xhcF9UcmluaC5wZGYiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzkzMjg2NTYwLCJleHAiOjQ5MTUzNTA1NjB9.eSauX_6RQ8HvM3cc5IWuyQCMqSp_7A17B_ez7GKnMmuV524wSKavA9tweNTqJO4SFTkvTr8Ldcq7qH9T35LjRA",
    "description": "Kĩ thuật lập trình Python nâng cao: Thuật toán tìm kiếm (Tuyến tính, Nhị phân), thuật toán sắp xếp (Nổi bọt, Chọn, Chèn, QuickSort), kỹ thuật Chia để trị, hàm đệ quy và cấu trúc dữ liệu mảng.",
    "skills": [
      "Tìm kiếm Tuyến tính & Nhị phân",
      "Sắp xếp Nổi bọt, Chọn, Chèn, QuickSort",
      "Kỹ thuật Chia để trị & Đệ quy",
      "Đọc hiểu & Truy vết mã nguồn Python"
    ],
    "xp": 400
  },
  {
    "id": "cs_station_8",
    "stepNumber": "08",
    "code": "Chủ đề CS 2",
    "title": "Học máy và Khoa học dữ liệu",
    "category": "Chuyên sâu Khoa học máy tính",
    "priority": "Rất cao",
    "priorityBadge": "extreme",
    "questionType": "Trắc nghiệm Đúng/Sai Phần II",
    "bookRef": "Trang 96 - 130",
    "pdfUrl": "https://vxqvjffssebnuxtslghp.supabase.co/storage/v1/object/sign/KhoTaiLieuTinHocThiThu/Chuong%20lap%20trinh%20CS%20AND%20ICT/Tai_Lieu_On_Thi_TN_THPT_Tin_Hoc_CS_Hoc_May_Khoa_Hoc_Du_Lieu.pdf?token=eyJraWQiOiIzMmIzYzRjYi0yYTZjLTRmYjUtOTJkNS0yNzIwNDk0NzJjOTUiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJLaG9UYWlMaWV1VGluSG9jVGhpVGh1L0NodW9uZyBsYXAgdHJpbmggQ1MgQU5EIElDVC9UYWlfTGlldV9Pbl9UaGlfVE5fVEhQVF9UaW5fSG9jX0NTX0hvY19NYXlfS2hvYV9Ib2NfRHVfTGlldS5wZGYiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzkzMjg2NDE4LCJleHAiOjQ5MTUzNTA0MTh9.jQ3NydSg0beLZz-sl6O_tu81xxr1GJ5D6wWWxEL3MFDzggZnAkuHwhP22sMZAkomH-A5D5NQF-iUxr88PXa6Hg",
    "description": "Tổng quan Học máy (Machine Learning) có giám sát (Supervised) vs không giám sát (Unsupervised), thuật toán phân loại K-láng giềng gần nhất (KNN), thuật toán phân cụm K-Means và quy trình Khoa học dữ liệu.",
    "skills": [
      "Học máy có giám sát & Không giám sát",
      "Thuật toán phân loại KNN",
      "Thuật toán phân cụm K-Means",
      "Quy trình xử lý & Phân tích dữ liệu"
    ],
    "xp": 380
  },
  {
    "id": "cs_station_9",
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
      "Luyện đề thi thử bứt phá 9.5+ CS"
    ],
    "xp": 500
  }
];
