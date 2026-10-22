import fs from 'fs';
import path from 'path';

// Import existing data
import { csRoadmapStations, CS_EXAM_STRUCTURE, CS_12_WEEK_PLAN } from '../src/data/roadmap/csRoadmap.js';
import { ictRoadmapStations, ICT_EXAM_STRUCTURE, ICT_12_WEEK_PLAN } from '../src/data/roadmap/ictRoadmap.js';

// Index lessons by id for quick lookup
const csLessonMap = {};
csRoadmapStations.forEach(s => (s.lessons || []).forEach(l => { csLessonMap[l.id] = l; }));

const ictLessonMap = {};
ictRoadmapStations.forEach(s => (s.lessons || []).forEach(l => { ictLessonMap[l.id] = l; }));

// Helper to clone and update lesson
function getLesson(sourceMap, id, overrides = {}) {
  const orig = sourceMap[id];
  if (!orig) return null;
  return {
    ...JSON.parse(JSON.stringify(orig)),
    ...overrides
  };
}

// -------------------------------------------------------------
// REBUILD CS ROADMAP STATIONS (9 STATIONS)
// -------------------------------------------------------------
const newCsStations = [
  // 1. Chủ đề 1. Giới thiệu Trí tuệ nhân tạo (Trang 4)
  {
    id: "cs_station_1",
    stepNumber: "01",
    code: "Chủ đề 1",
    title: "Giới thiệu Trí tuệ nhân tạo",
    category: "Kiến thức chung",
    priority: "Cao",
    priorityBadge: "high",
    questionType: "Trắc nghiệm Phần I (2 - 3 câu)",
    bookRef: "Trang 4 - 9",
    description: "Khái niệm Trí tuệ nhân tạo (AI), phép thử Turing, lịch sử phát triển, phân loại AI hẹp (ANI) vs AI tổng quát (AGI), tác động của AI trong đời sống và kinh tế tri thức.",
    skills: [
      "Khái niệm & Lịch sử phát triển AI",
      "Phép thử Turing (Turing Test)",
      "Phân loại AI hẹp (ANI) vs AGI",
      "Tác động xã hội & Đạo đức AI"
    ],
    xp: 260,
    lessons: [
      getLesson(csLessonMap, 'cs_a_3', {
        title: "Bài 1: Khái niệm & Lịch sử phát triển AI",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề 1 (Trang 4)"
      }),
      getLesson(csLessonMap, 'cs_a_4', {
        title: "Bài 2: AI trong đời sống & Kinh tế tri thức",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề 1 (Trang 7)"
      })
    ].filter(Boolean)
  },

  // 2. Chủ đề 2. Mạng máy tính và Internet (Trang 10)
  {
    id: "cs_station_2",
    stepNumber: "02",
    code: "Chủ đề 2",
    title: "Mạng máy tính và Internet",
    category: "Kiến thức chung",
    priority: "Trung bình",
    priorityBadge: "normal",
    questionType: "Trắc nghiệm Phần I (2 câu)",
    bookRef: "Trang 10 - 19",
    description: "Thiết bị mạng Switch, Router, Access Point; mạng cục bộ LAN; giao thức mạng TCP/IP; địa chỉ IPv4/IPv6; mạng không dây Wi-Fi và Điện toán đám mây (IaaS, PaaS, SaaS).",
    skills: [
      "Switch, Router & Access Point",
      "Giao thức TCP/IP & Địa chỉ IP/DNS",
      "Mạng không dây Wi-Fi",
      "Điện toán đám mây (Cloud Computing)"
    ],
    xp: 280,
    lessons: [
      getLesson(csLessonMap, 'cs_b_1', {
        title: "Bài 1: Thiết bị mạng & Mạng cục bộ LAN",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề 2 (Trang 10)"
      }),
      getLesson(csLessonMap, 'cs_b_2', {
        title: "Bài 2: Dịch vụ mạng & Giao thức IP/TCP",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề 2 (Trang 13)"
      }),
      getLesson(csLessonMap, 'cs_b_3', {
        title: "Bài 3: Thiết bị kết nối Switch/Router nâng cao",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề 2 (Trang 15)"
      }),
      getLesson(csLessonMap, 'cs_b_4', {
        title: "Bài 4: Mạng không dây Wi-Fi & Điện toán đám mây",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề 2 (Trang 17)"
      })
    ].filter(Boolean)
  },

  // 3. Chủ đề 3. Đạo đức, pháp luật và văn hoá trong môi trường số (Trang 20)
  {
    id: "cs_station_3",
    stepNumber: "03",
    code: "Chủ đề 3",
    title: "Đạo đức, pháp luật và văn hoá trong môi trường số",
    category: "Kiến thức chung",
    priority: "Trung bình",
    priorityBadge: "normal",
    questionType: "Trắc nghiệm Phần I (1 - 2 câu)",
    bookRef: "Trang 20 - 24",
    description: "Bản quyền phần mềm, sở hữu trí tuệ, giấy phép phần mềm mã nguồn mở (GPL, Apache, MIT), Luật An ninh mạng và văn hóa ứng xử, bảo vệ dữ liệu cá nhân trên không gian số.",
    skills: [
      "Bản quyền phần mềm & Tác quyền số",
      "Giấy phép mã nguồn mở (GPL, MIT)",
      "Luật An ninh mạng Việt Nam",
      "Văn hóa ứng xử & An toàn số"
    ],
    xp: 220,
    lessons: [
      getLesson(csLessonMap, 'cs_d_1', {
        title: "Bài 1: Bản quyền phần mềm & Giấy phép nguồn mở",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề 3 (Trang 20)"
      }),
      getLesson(csLessonMap, 'cs_d_2', {
        title: "Bài 2: Luật An ninh mạng & Giữ an toàn số",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề 3 (Trang 22)"
      })
    ].filter(Boolean)
  },

  // 4. Chủ đề 4. Giới thiệu các hệ Cơ sở dữ liệu (Trang 25)
  {
    id: "cs_station_4",
    stepNumber: "04",
    code: "Chủ đề 4",
    title: "Giới thiệu các hệ Cơ sở dữ liệu",
    category: "Kiến thức chung",
    priority: "Rất cao",
    priorityBadge: "high",
    questionType: "Trắc nghiệm Phần I & II",
    bookRef: "Trang 25 - 39",
    description: "Khái niệm CSDL & Hệ Quản trị CSDL (DBMS), mô hình CSDL quan hệ, bảng dữ liệu, khóa chính (Primary Key), khóa ngoại (Foreign Key), liên kết bảng và ngôn ngữ truy vấn SQL.",
    skills: [
      "Khái niệm CSDL & Hệ QTCSDL",
      "Bảng dữ liệu & Khóa chính (PK)",
      "Khóa ngoại & Mối quan hệ liên kết bảng",
      "Ngôn ngữ SQL (SELECT, JOIN, UPDATE)"
    ],
    xp: 350,
    lessons: [
      getLesson(csLessonMap, 'cs_c_1', {
        title: "Bài 1: Giới thiệu CSDL & Hệ QTCSDL",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề 4 (Trang 25)"
      }),
      getLesson(csLessonMap, 'cs_c_2', {
        title: "Bài 2: Mô hình CSDL Quan hệ & Khóa chính",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề 4 (Trang 28)"
      }),
      getLesson(csLessonMap, 'cs_c_3', {
        title: "Bài 3: Khóa ngoại & Liên kết bảng",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề 4 (Trang 31)"
      }),
      getLesson(csLessonMap, 'cs_c_4', {
        title: "Bài 4: Ngôn ngữ SQL & Lệnh truy vấn SELECT",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề 4 (Trang 34)"
      }),
      getLesson(csLessonMap, 'cs_c_5', {
        title: "Bài 5: Truy vấn SQL liên kết đa bảng & Gom nhóm",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề 4 (Trang 36)"
      }),
      getLesson(csLessonMap, 'cs_c_6', {
        title: "Bài 6: Cập nhật dữ liệu INSERT, UPDATE, DELETE",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề 4 (Trang 38)"
      })
    ].filter(Boolean)
  },

  // 5. Chủ đề 5. Tạo trang web với HTML và CSS (Trang 40)
  {
    id: "cs_station_5",
    stepNumber: "05",
    code: "Chủ đề 5",
    title: "Tạo trang web với HTML và CSS",
    category: "Kiến thức chung",
    priority: "Cao",
    priorityBadge: "high",
    questionType: "Trắc nghiệm Phần I (2 - 3 câu)",
    bookRef: "Trang 40 - 74",
    description: "Cấu trúc văn bản siêu liên kết HTML, các thẻ định dạng, chèn hình ảnh, tạo bảng (table), biểu mẫu (form), danh sách, siêu liên kết và ngôn ngữ định kiểu CSS.",
    skills: [
      "Cấu trúc tài liệu HTML",
      "Thẻ định dạng, Bảng (table) & Form",
      "Thẻ liên kết (a) & Danh sách (ul, ol)",
      "Định kiểu CSS (Color, Font, Box Model)"
    ],
    xp: 320,
    lessons: [
      getLesson(ictLessonMap, 'ict_e_1', {
        id: 'cs_web_1',
        title: "Bài 1: Giới thiệu HTML & Cấu trúc trang Web",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề 5 (Trang 40)"
      }),
      getLesson(ictLessonMap, 'ict_e_2', {
        id: 'cs_web_2',
        title: "Bài 2: Các thẻ định dạng văn bản & Thẻ ảnh",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề 5 (Trang 46)"
      }),
      getLesson(ictLessonMap, 'ict_e_3', {
        id: 'cs_web_3',
        title: "Bài 3: Thẻ tạo Bảng Table & Form nhập liệu",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề 5 (Trang 52)"
      }),
      getLesson(ictLessonMap, 'ict_e_4', {
        id: 'cs_web_4',
        title: "Bài 4: Thẻ liên kết a & Danh sách ul, ol",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề 5 (Trang 58)"
      }),
      getLesson(ictLessonMap, 'ict_e_5', {
        id: 'cs_web_5',
        title: "Bài 5: Ngôn ngữ CSS & Nhúng CSS vào HTML",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề 5 (Trang 64)"
      }),
      getLesson(ictLessonMap, 'ict_e_6', {
        id: 'cs_web_6',
        title: "Bài 6: Thuộc tính CSS cơ bản (Color, Font, Margin)",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề 5 (Trang 70)"
      })
    ].filter(Boolean)
  },

  // 6. Chủ đề 6. Hướng nghiệp với tin học (Trang 75)
  {
    id: "cs_station_6",
    stepNumber: "06",
    code: "Chủ đề 6",
    title: "Hướng nghiệp với tin học",
    category: "Kiến thức chung",
    priority: "Thấp",
    priorityBadge: "low",
    questionType: "Trắc nghiệm Phần I (1 câu)",
    bookRef: "Trang 75 - 80",
    description: "Các nhóm ngành nghề trong lĩnh vực Công nghệ thông tin, yêu cầu năng lực, phẩm chất kỷ nguyên số, cơ hội nghề nghiệp trong Khoa học dữ liệu, AI và kỹ sư phần mềm.",
    skills: [
      "Nhóm ngành nghề CNTT",
      "Năng lực & Phẩm chất người làm nghề",
      "Định hướng nghề AI & Khoa học dữ liệu",
      "Kỷ nguyên số & Xu hướng việc làm"
    ],
    xp: 200,
    lessons: [
      getLesson(csLessonMap, 'cs_g_1', {
        title: "Bài 1: Các nhóm nghề thuộc ngành CNTT",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề 6 (Trang 75)"
      }),
      getLesson(csLessonMap, 'cs_g_2', {
        title: "Bài 2: Hướng nghiệp Khoa học dữ liệu & Trí tuệ nhân tạo",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề 6 (Trang 78)"
      })
    ].filter(Boolean)
  },

  // 7. Chủ đề CS 1. Kĩ thuật lập trình (Trang 81)
  {
    id: "cs_station_7",
    stepNumber: "07",
    code: "Chủ đề CS 1",
    title: "Kĩ thuật lập trình",
    category: "Chuyên sâu Khoa học máy tính",
    priority: "Cực kỳ quan trọng",
    priorityBadge: "extreme",
    questionType: "Trắc nghiệm Đúng/Sai Phần II (Câu 3 - 4)",
    bookRef: "Trang 81 - 95",
    description: "Kĩ thuật lập trình Python nâng cao: Thuật toán tìm kiếm (Tuyến tính, Nhị phân), thuật toán sắp xếp (Nổi bọt, Chọn, Chèn, QuickSort), kỹ thuật Chia để trị, hàm đệ quy và cấu trúc dữ liệu mảng.",
    skills: [
      "Tìm kiếm Tuyến tính & Nhị phân",
      "Sắp xếp Nổi bọt, Chọn, Chèn, QuickSort",
      "Kỹ thuật Chia để trị & Đệ quy",
      "Đọc hiểu & Truy vết mã nguồn Python"
    ],
    xp: 400,
    lessons: [
      getLesson(csLessonMap, 'cs_f_1', {
        title: "Bài 1: Thuật toán tìm kiếm Tuyến tính & Nhị phân",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề CS 1 (Trang 81)"
      }),
      getLesson(csLessonMap, 'cs_f_2', {
        title: "Bài 2: Thuật toán sắp xếp Nổi bọt & Chọn",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề CS 1 (Trang 84)"
      }),
      getLesson(csLessonMap, 'cs_f_3', {
        title: "Bài 3: Thuật toán sắp xếp Chèn & QuickSort",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề CS 1 (Trang 88)"
      }),
      getLesson(csLessonMap, 'cs_f_4', {
        title: "Bài 4: Kỹ thuật Chia để trị & Đồ thị",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề CS 1 (Trang 91)"
      }),
      getLesson(csLessonMap, 'cs_f_8', {
        title: "Bài 5: Viết kịch bản Python nâng cao & Xử lý mảng",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề CS 1 (Trang 93)"
      })
    ].filter(Boolean)
  },

  // 8. Chủ đề CS 2. Học máy và Khoa học dữ liệu (Trang 96)
  {
    id: "cs_station_8",
    stepNumber: "08",
    code: "Chủ đề CS 2",
    title: "Học máy và Khoa học dữ liệu",
    category: "Chuyên sâu Khoa học máy tính",
    priority: "Rất cao",
    priorityBadge: "extreme",
    questionType: "Trắc nghiệm Đúng/Sai Phần II",
    bookRef: "Trang 96 - 130",
    description: "Tổng quan Học máy (Machine Learning) có giám sát (Supervised) vs không giám sát (Unsupervised), thuật toán phân loại K-láng giềng gần nhất (KNN), thuật toán phân cụm K-Means và quy trình Khoa học dữ liệu.",
    skills: [
      "Học máy có giám sát & Không giám sát",
      "Thuật toán phân loại KNN",
      "Thuật toán phân cụm K-Means",
      "Quy trình xử lý & Phân tích dữ liệu"
    ],
    xp: 380,
    lessons: [
      getLesson(csLessonMap, 'cs_f_5', {
        title: "Bài 1: Thuật toán Học máy Supervised & Unsupervised",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề CS 2 (Trang 96)"
      }),
      getLesson(csLessonMap, 'cs_f_6', {
        title: "Bài 2: Thuật toán Phân loại Classification & KNN",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề CS 2 (Trang 104)"
      }),
      getLesson(csLessonMap, 'cs_f_7', {
        title: "Bài 3: Thuật toán Phân cụm K-Means",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề CS 2 (Trang 115)"
      })
    ].filter(Boolean)
  },

  // 9. Phần II. Đề ôn tập (Trang 131)
  {
    id: "cs_station_9",
    stepNumber: "09",
    code: "Phần II",
    title: "Đề ôn tập & Bảng ma trận năng lực",
    category: "Luyện đề thi THPTQG",
    priority: "Về đích",
    priorityBadge: "extreme",
    questionType: "Tổng hợp 22 câu (Phần I + II)",
    bookRef: "Trang 131 - 180",
    description: "Bảng năng lực và cấp độ tư duy đề ôn tập (Nhận biết, Thông hiểu, Vận dụng), chiến thuật phân bổ 50 phút cho 22 câu thi và các bộ đề ôn tập chuẩn cấu trúc đề thi Tốt nghiệp THPT Bộ GD&ĐT.",
    skills: [
      "Ma trận năng lực & Cấp độ tư duy",
      "Chiến thuật xử lý câu Đúng/Sai lũy tiến",
      "Phân bổ thời gian 50 phút tối ưu",
      "Luyện đề thi thử bứt phá 9.5+ CS"
    ],
    xp: 500,
    lessons: [
      {
        id: "cs_exam_matrix",
        title: "Bài 1: Bảng năng lực và cấp độ tư duy đề ôn tập",
        bookRef: "Tài liệu ôn tập Tin 12 — Phần II (Trang 131)",
        priority: "Cực kỳ quan trọng",
        examFormat: "Cấu trúc ma trận đề thi 2025",
        summary: "Phân tích bảng năng lực Tin học, tỷ lệ câu hỏi Nhận biết (40%), Thông hiểu (30%), Vận dụng (30%), cấu trúc 18 câu trắc nghiệm 4 lựa chọn và 4 câu Đúng/Sai.",
        theory: {
          objectives: [
            "Nắm vững 3 cấp độ tư duy: Nhận biết, Thông hiểu và Vận dụng trong đề thi Tin học THPTQG.",
            "Hiểu quy tắc tính điểm lũy tiến Phần II (Đúng/Sai): Đúng 1 ý: 0.1đ; 2 ý: 0.25đ; 3 ý: 0.5đ; 4 ý: 1.0đ.",
            "Xác định trọng tâm kiến thức: Chủ đề 1 đến 6 (Phần I) và Chủ đề CS 1, CS 2 (Phần II)."
          ],
          contentSections: [],
          examTips: "🎯 Mẹo chiến thuật: Phần I chiếm 4.5 điểm (18 câu), cần hoàn thành trong 15-18 phút. Dành 30-32 phút còn lại cho 4 câu Đúng/Sai Phần II (4.0 điểm), đọc kỹ từng mệnh đề a, b, c, d."
        },
        quiz: {
          question: "Trong đề thi Tốt nghiệp THPT môn Tin học (định hướng CS), Phần II gồm bao nhiêu câu hỏi và thang điểm tối đa là bao nhiêu?",
          options: [
            " gồm 18 câu hỏi, tối đa 4.5 điểm.",
            " gồm 4 câu hỏi trắc nghiệm Đúng/Sai, tối đa 4.0 điểm.",
            " gồm 6 câu hỏi tự luận, tối đa 5.0 điểm.",
            " gồm 28 câu hỏi trắc nghiệm, tối đa 7.0 điểm."
          ],
          answer: 1,
          explanation: "Phần II gồm 4 câu trắc nghiệm Đúng/Sai, mỗi câu có 4 ý (a, b, c, d), điểm tối đa cho mỗi câu là 1.0 điểm (tổng cộng 4.0 điểm)."
        }
      },
      getLesson(csLessonMap, 'cs_boss_1', {
        title: "Bài 2: Các đề ôn tập & Chiến thuật làm bài thi",
        bookRef: "Tài liệu ôn tập Tin 12 — Phần II (Trang 132)"
      })
    ].filter(Boolean)
  }
];

// -------------------------------------------------------------
// REBUILD ICT ROADMAP STATIONS (9 STATIONS)
// -------------------------------------------------------------
const newIctStations = [
  // 1. Chủ đề 1. Giới thiệu Trí tuệ nhân tạo (Trang 4)
  {
    id: "ict_station_1",
    stepNumber: "01",
    code: "Chủ đề 1",
    title: "Giới thiệu Trí tuệ nhân tạo",
    category: "Kiến thức chung",
    priority: "Cao",
    priorityBadge: "high",
    questionType: "Trắc nghiệm Phần I (2 - 3 câu)",
    bookRef: "Trang 4 - 9",
    description: "Khái niệm Trí tuệ nhân tạo (AI), các ứng dụng thực tế trong công việc văn phòng, truyền thông, kinh tế số và tác động xã hội của AI.",
    skills: [
      "Khái niệm & Ứng dụng thực tế của AI",
      "Phân loại AI hẹp trong đời sống",
      "AI tạo sinh & Trợ lý thông minh",
      "Tác động của AI đối với nghề nghiệp"
    ],
    xp: 260,
    lessons: [
      getLesson(ictLessonMap, 'ict_a_3', {
        title: "Bài 1: Khái niệm & Ứng dụng thực tế của AI",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề 1 (Trang 4)"
      }),
      getLesson(ictLessonMap, 'ict_a_4', {
        title: "Bài 2: AI trong đời sống xã hội & Công việc số",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề 1 (Trang 7)"
      })
    ].filter(Boolean)
  },

  // 2. Chủ đề 2. Mạng máy tính và Internet (Trang 10)
  {
    id: "ict_station_2",
    stepNumber: "02",
    code: "Chủ đề 2",
    title: "Mạng máy tính và Internet",
    category: "Kiến thức chung",
    priority: "Trung bình",
    priorityBadge: "normal",
    questionType: "Trắc nghiệm Phần I (2 câu)",
    bookRef: "Trang 10 - 19",
    description: "Mạng cục bộ LAN, thiết bị mạng Switch/Router/Access Point, dịch vụ Internet, kết nối mạng Wi-Fi và dịch vụ lưu trữ đám mây (Google Drive, OneDrive).",
    skills: [
      "Mạng cục bộ LAN & Thiết bị kết nối",
      "Dịch vụ Internet & Web",
      "Mạng Wi-Fi an toàn",
      "Lưu trữ đám mây (Cloud Storage)"
    ],
    xp: 280,
    lessons: [
      getLesson(ictLessonMap, 'ict_b_1', {
        title: "Bài 1: Mạng cục bộ LAN & Thiết bị kết nối",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề 2 (Trang 10)"
      }),
      getLesson(ictLessonMap, 'ict_b_2', {
        title: "Bài 2: Khái niệm & Dịch vụ trên Internet",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề 2 (Trang 13)"
      }),
      getLesson(ictLessonMap, 'ict_b_3', {
        title: "Bài 3: Kết nối thiết bị mạng Switch, Router, AP",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề 2 (Trang 15)"
      }),
      getLesson(ictLessonMap, 'ict_b_4', {
        title: "Bài 4: Mạng Wi-Fi & Dịch vụ Lưu trữ đám mây",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề 2 (Trang 17)"
      })
    ].filter(Boolean)
  },

  // 3. Chủ đề 3. Đạo đức, pháp luật và văn hoá trong môi trường số (Trang 20)
  {
    id: "ict_station_3",
    stepNumber: "03",
    code: "Chủ đề 3",
    title: "Đạo đức, pháp luật và văn hoá trong môi trường số",
    category: "Kiến thức chung",
    priority: "Trung bình",
    priorityBadge: "normal",
    questionType: "Trắc nghiệm Phần I (1 - 2 câu)",
    bookRef: "Trang 20 - 24",
    description: "Bản quyền phần mềm, sở hữu trí tuệ, tác quyền số, an toàn thông tin, Luật An ninh mạng và văn hóa ứng xử trên mạng xã hội.",
    skills: [
      "Bản quyền phần mềm & Tác quyền số",
      "Luật An ninh mạng & Bảo vệ dữ liệu",
      "Văn hóa ứng xử trên không gian mạng",
      "Phòng tránh lừa đảo & Rủi ro số"
    ],
    xp: 220,
    lessons: [
      getLesson(ictLessonMap, 'ict_d_1', {
        title: "Bài 1: Bản quyền phần mềm & Tác quyền số",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề 3 (Trang 20)"
      }),
      getLesson(ictLessonMap, 'ict_d_2', {
        title: "Bài 2: An toàn thông tin & Văn hóa mạng",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề 3 (Trang 22)"
      })
    ].filter(Boolean)
  },

  // 4. Chủ đề 4. Giới thiệu các hệ Cơ sở dữ liệu (Trang 25)
  {
    id: "ict_station_4",
    stepNumber: "04",
    code: "Chủ đề 4",
    title: "Giới thiệu các hệ Cơ sở dữ liệu",
    category: "Kiến thức chung",
    priority: "Cao",
    priorityBadge: "high",
    questionType: "Trắc nghiệm Phần I (2 - 3 câu)",
    bookRef: "Trang 25 - 39",
    description: "Khái niệm CSDL & Hệ Quản trị CSDL (DBMS), mô hình quan hệ, bảng dữ liệu, khóa chính (Primary Key), khóa ngoại (Foreign Key) và truy vấn dữ liệu SQL căn bản.",
    skills: [
      "Khái niệm CSDL & Hệ QTCSDL",
      "Bảng dữ liệu & Khóa chính",
      "Khóa ngoại & Liên kết bảng",
      "Truy vấn SQL cơ bản"
    ],
    xp: 320,
    lessons: [
      getLesson(csLessonMap, 'cs_c_1', {
        id: 'ict_db_1',
        title: "Bài 1: Giới thiệu CSDL & Hệ QTCSDL",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề 4 (Trang 25)"
      }),
      getLesson(csLessonMap, 'cs_c_2', {
        id: 'ict_db_2',
        title: "Bài 2: Mô hình CSDL Quan hệ & Khóa chính",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề 4 (Trang 28)"
      }),
      getLesson(csLessonMap, 'cs_c_3', {
        id: 'ict_db_3',
        title: "Bài 3: Khóa ngoại & Liên kết bảng",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề 4 (Trang 31)"
      }),
      getLesson(csLessonMap, 'cs_c_4', {
        id: 'ict_db_4',
        title: "Bài 4: Ngôn ngữ SQL & Lệnh truy vấn SELECT",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề 4 (Trang 34)"
      })
    ].filter(Boolean)
  },

  // 5. Chủ đề 5. Tạo trang web với HTML và CSS (Trang 40)
  {
    id: "ict_station_5",
    stepNumber: "05",
    code: "Chủ đề 5",
    title: "Tạo trang web với HTML và CSS",
    category: "Kiến thức chung",
    priority: "Cao",
    priorityBadge: "high",
    questionType: "Trắc nghiệm Phần I (2 - 3 câu)",
    bookRef: "Trang 40 - 74",
    description: "Cấu trúc văn bản siêu liên kết HTML, các thẻ định dạng, chèn hình ảnh, tạo bảng (table), biểu mẫu (form), danh sách, siêu liên kết và ngôn ngữ CSS định kiểu trang web.",
    skills: [
      "Cấu trúc trang web HTML",
      "Thẻ Bảng (table) & Form nhập liệu",
      "Thẻ liên kết (a) & Danh sách (ul, ol)",
      "Định kiểu CSS (Color, Font, Box Model)"
    ],
    xp: 350,
    lessons: [
      getLesson(ictLessonMap, 'ict_e_1', {
        title: "Bài 1: Giới thiệu HTML & Cấu trúc trang Web",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề 5 (Trang 40)"
      }),
      getLesson(ictLessonMap, 'ict_e_2', {
        title: "Bài 2: Các thẻ định dạng văn bản & Thẻ ảnh",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề 5 (Trang 46)"
      }),
      getLesson(ictLessonMap, 'ict_e_3', {
        title: "Bài 3: Thẻ tạo Bảng Table & Form nhập liệu",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề 5 (Trang 52)"
      }),
      getLesson(ictLessonMap, 'ict_e_4', {
        title: "Bài 4: Thẻ liên kết a & Danh sách ul, ol",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề 5 (Trang 58)"
      }),
      getLesson(ictLessonMap, 'ict_e_5', {
        title: "Bài 5: Ngôn ngữ CSS & Nhúng CSS vào HTML",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề 5 (Trang 64)"
      }),
      getLesson(ictLessonMap, 'ict_e_6', {
        title: "Bài 6: Thuộc tính CSS cơ bản (Color, Font, Margin)",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề 5 (Trang 70)"
      })
    ].filter(Boolean)
  },

  // 6. Chủ đề 6. Hướng nghiệp với tin học (Trang 75)
  {
    id: "ict_station_6",
    stepNumber: "06",
    code: "Chủ đề 6",
    title: "Hướng nghiệp với tin học",
    category: "Kiến thức chung",
    priority: "Thấp",
    priorityBadge: "low",
    questionType: "Trắc nghiệm Phần I (1 câu)",
    bookRef: "Trang 75 - 80",
    description: "Các nhóm ngành nghề ứng dụng CNTT trong doanh nghiệp, quản trị web, truyền thông đa phương tiện, thiết kế đồ họa và định hướng phát triển nghề nghiệp số.",
    skills: [
      "Nhóm ngành nghề ứng dụng CNTT",
      "Nghề quản trị Website & Đồ họa số",
      "Yêu cầu năng lực & Xu hướng số",
      "Định hướng nghề nghiệp tương lai"
    ],
    xp: 200,
    lessons: [
      getLesson(ictLessonMap, 'ict_g_1', {
        title: "Bài 1: Các ngành nghề ứng dụng CNTT",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề 6 (Trang 75)"
      }),
      getLesson(ictLessonMap, 'ict_g_2', {
        title: "Bài 2: Hướng nghiệp Quản trị Web & Thiết kế đồ họa",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề 6 (Trang 78)"
      })
    ].filter(Boolean)
  },

  // 7. Chủ đề ICT 1. Thực hành tạo và khai thác Cơ sở dữ liệu (Trang 114)
  {
    id: "ict_station_7",
    stepNumber: "07",
    code: "Chủ đề ICT 1",
    title: "Thực hành tạo và khai thác Cơ sở dữ liệu",
    category: "Chuyên sâu Tin học ứng dụng",
    priority: "Cực kỳ quan trọng",
    priorityBadge: "extreme",
    questionType: "Trắc nghiệm Đúng/Sai Phần II (Câu 3 - 4)",
    bookRef: "Trang 114 - 121",
    description: "Thực hành tạo bảng dữ liệu, khóa chính, liên kết bảng, xử lý dữ liệu bảng tính nâng cao, các hàm Logic (IF, AND, OR), hàm tra cứu (VLOOKUP, HLOOKUP), thống kê có điều kiện (SUMIF, COUNTIF), Pivot Table và trích lọc dữ liệu.",
    skills: [
      "Tạo bảng CSDL & Khóa chính",
      "Hàm Logic (IF, AND, OR) & VLOOKUP",
      "Hàm thống kê (SUMIF, COUNTIF)",
      "Pivot Table & Lọc dữ liệu nâng cao"
    ],
    xp: 400,
    lessons: [
      getLesson(ictLessonMap, 'ict_c_1', {
        title: "Bài 1: Bảng tính Excel & Địa chỉ ô tuyệt đối/tương đối",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề ICT 1 (Trang 114)"
      }),
      getLesson(ictLessonMap, 'ict_c_2', {
        title: "Bài 2: Các hàm Logic IF, AND, OR trong bảng tính",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề ICT 1 (Trang 116)"
      }),
      getLesson(ictLessonMap, 'ict_c_3', {
        title: "Bài 3: Các hàm tìm kiếm VLOOKUP, HLOOKUP",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề ICT 1 (Trang 118)"
      }),
      getLesson(ictLessonMap, 'ict_c_4', {
        title: "Bài 4: Hàm thống kê điều kiện SUMIF, COUNTIF",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề ICT 1 (Trang 119)"
      }),
      getLesson(ictLessonMap, 'ict_c_5', {
        title: "Bài 5: Kỹ thuật Pivot Table & Báo cáo thống kê",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề ICT 1 (Trang 120)"
      }),
      getLesson(ictLessonMap, 'ict_c_6', {
        title: "Bài 6: Biểu đồ & Lọc dữ liệu Advanced Filter",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề ICT 1 (Trang 121)"
      })
    ].filter(Boolean)
  },

  // 8. Chủ đề ICT 2. Sử dụng phần mềm tạo trang web (Trang 122)
  {
    id: "ict_station_8",
    stepNumber: "08",
    code: "Chủ đề ICT 2",
    title: "Sử dụng phần mềm tạo trang web",
    category: "Chuyên sâu Tin học ứng dụng",
    priority: "Rất cao",
    priorityBadge: "extreme",
    questionType: "Trắc nghiệm Đúng/Sai Phần II",
    bookRef: "Trang 122 - 130",
    description: "Sử dụng phần mềm thiết kế và biên tập trang web trực quan, thiết kế bố cục giao diện đa phương tiện, tích hợp hình ảnh lớp (Layer), video clip, đóng gói và xuất bản website lên Internet.",
    skills: [
      "Phần mềm tạo trang web trực quan",
      "Thiết kế bố cục & Cây trang web",
      "Đồ họa đa phương tiện & Video cho Web",
      "Kiểm thử & Xuất bản Website"
    ],
    xp: 380,
    lessons: [
      getLesson(ictLessonMap, 'ict_e_7', {
        id: 'ict_sw_1',
        title: "Bài 1: Cây cấu trúc Website & Phần mềm tạo trang Web",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề ICT 2 (Trang 122)"
      }),
      getLesson(ictLessonMap, 'ict_e_8', {
        id: 'ict_sw_2',
        title: "Bài 2: Chỉnh sửa ảnh lớp (Layer) & Đồ họa cho Web",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề ICT 2 (Trang 125)"
      }),
      getLesson(ictLessonMap, 'ict_e_9', {
        id: 'ict_sw_3',
        title: "Bài 3: Biên tập & Chèn Video clip vào trang Web",
        bookRef: "Tài liệu ôn tập Tin 12 — Chủ đề ICT 2 (Trang 128)"
      })
    ].filter(Boolean)
  },

  // 9. Phần II. Đề ôn tập (Trang 131)
  {
    id: "ict_station_9",
    stepNumber: "09",
    code: "Phần II",
    title: "Đề ôn tập & Bảng ma trận năng lực",
    category: "Luyện đề thi THPTQG",
    priority: "Về đích",
    priorityBadge: "extreme",
    questionType: "Tổng hợp 22 câu (Phần I + II)",
    bookRef: "Trang 131 - 180",
    description: "Bảng năng lực và cấp độ tư duy đề ôn tập (Nhận biết, Thông hiểu, Vận dụng), chiến thuật phân bổ 50 phút cho 22 câu thi và các bộ đề ôn tập chuẩn cấu trúc đề thi Tốt nghiệp THPT Bộ GD&ĐT.",
    skills: [
      "Ma trận năng lực & Cấp độ tư duy",
      "Chiến thuật xử lý câu Đúng/Sai lũy tiến",
      "Phân bổ thời gian 50 phút tối ưu",
      "Luyện đề thi thử bứt phá 9.5+ ICT"
    ],
    xp: 500,
    lessons: [
      {
        id: "ict_exam_matrix",
        title: "Bài 1: Bảng năng lực và cấp độ tư duy đề ôn tập",
        bookRef: "Tài liệu ôn tập Tin 12 — Phần II (Trang 131)",
        priority: "Cực kỳ quan trọng",
        examFormat: "Cấu trúc ma trận đề thi 2025",
        summary: "Phân tích bảng năng lực Tin học định hướng Tin học ứng dụng (ICT), tỷ lệ câu hỏi Nhận biết (40%), Thông hiểu (30%), Vận dụng (30%), chiến thuật 18 câu trắc nghiệm và 4 câu Đúng/Sai.",
        theory: {
          objectives: [
            "Nắm vững 3 cấp độ tư duy: Nhận biết, Thông hiểu và Vận dụng trong đề thi Tin học ứng dụng THPTQG.",
            "Quy tắc chấm điểm lũy tiến Phần II Đúng/Sai: 0.1đ, 0.25đ, 0.5đ và 1.0đ cho mỗi câu 4 ý.",
            "Xác định trọng tâm kiến thức: Chủ đề 1 đến 6 (Phần I) và Chủ đề ICT 1, ICT 2 (Phần II)."
          ],
          contentSections: [],
          examTips: "🎯 Mẹo chiến thuật: Phần I gồm 18 câu trắc nghiệm (4.5 điểm), giải quyết nhanh và chắc chắn. Dành thời gian suy luận kỹ cho câu hỏi bảng tính Excel, CSDL và Web ở Phần II."
        },
        quiz: {
          question: "Trong đề thi Tốt nghiệp THPT môn Tin học (định hướng ICT), Phần I có tổng cộng bao nhiêu câu hỏi?",
          options: [
            "12 câu hỏi trắc nghiệm.",
            "18 câu hỏi trắc nghiệm 4 lựa chọn (chọn 1 đáp án đúng).",
            "20 câu hỏi trắc nghiệm.",
            "24 câu hỏi trắc nghiệm."
          ],
          answer: 1,
          explanation: "Phần I đề thi Tin học gồm 18 câu hỏi trắc nghiệm 4 lựa chọn (mỗi câu 0.25 điểm, tổng 4.5 điểm)."
        }
      },
      getLesson(ictLessonMap, 'ict_exam_strategy', {
        title: "Bài 2: Các đề ôn tập & Chiến thuật làm bài thi",
        bookRef: "Tài liệu ôn tập Tin 12 — Phần II (Trang 132)"
      })
    ].filter(Boolean)
  }
];

// Helper to write file as clean JavaScript code
function writeJsFile(filePath, varName, data, examStructure, twelveWeekPlan) {
  const content = `/**
 * ==============================================================================
 * DỮ LIỆU LỘ TRÌNH DÂY XÍCH & BÀI GIẢNG LÝ THUYẾT (CHUẨN 2025)
 * BÁM SÁT MỤC LỤC TÀI LIỆU ÔN TẬP THEO CHỦ ĐỀ VÀ ĐỀ ÔN TẬP
 * ==============================================================================
 */

export const ${varName === 'csRoadmapStations' ? 'CS_EXAM_STRUCTURE' : 'ICT_EXAM_STRUCTURE'} = ${JSON.stringify(examStructure, null, 2)};

export const ${varName === 'csRoadmapStations' ? 'CS_12_WEEK_PLAN' : 'ICT_12_WEEK_PLAN'} = ${JSON.stringify(twelveWeekPlan, null, 2)};

export const ${varName} = ${JSON.stringify(data, null, 2)};
`;
  fs.writeFileSync(filePath, content, 'utf-8');
}

// Write to src/data/roadmap/
const projectRoot = path.resolve('.');
const csJsPath = path.join(projectRoot, 'src', 'data', 'roadmap', 'csRoadmap.js');
const ictJsPath = path.join(projectRoot, 'src', 'data', 'roadmap', 'ictRoadmap.js');

writeJsFile(csJsPath, 'csRoadmapStations', newCsStations, CS_EXAM_STRUCTURE, CS_12_WEEK_PLAN);
writeJsFile(ictJsPath, 'ictRoadmapStations', newIctStations, ICT_EXAM_STRUCTURE, ICT_12_WEEK_PLAN);
console.log('✅ Đã cập nhật thành công src/data/roadmap/csRoadmap.js');
console.log('✅ Đã cập nhật thành công src/data/roadmap/ictRoadmap.js');

// Export to JSON for LoTrinhDayXich and public/LoTrinhDayXich
const csData = {
  examStructure: CS_EXAM_STRUCTURE,
  twelveWeekPlan: CS_12_WEEK_PLAN,
  stations: newCsStations
};

const ictData = {
  examStructure: ICT_EXAM_STRUCTURE,
  twelveWeekPlan: ICT_12_WEEK_PLAN,
  stations: newIctStations
};

const jsonDirs = [
  path.join(projectRoot, 'LoTrinhDayXich'),
  path.join(projectRoot, 'public', 'LoTrinhDayXich')
];

jsonDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'csRoadmap.json'), JSON.stringify(csData, null, 2), 'utf-8');
  fs.writeFileSync(path.join(dir, 'ictRoadmap.json'), JSON.stringify(ictData, null, 2), 'utf-8');
});

console.log('✅ Đã đồng bộ tất cả file JSON lộ trình dây xích!');
