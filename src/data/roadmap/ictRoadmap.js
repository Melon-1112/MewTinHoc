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
    "pdfUrl": "https://vxqvjffssebnuxtslghp.supabase.co/storage/v1/object/public/KhoTaiLieuTinHocThiThu/Chuong%201/Tai_Lieu_On_Thi_Chu_De_1_Gioi_Thieu_AI%20(1).pdf",
    "description": "Khái niệm Trí tuệ nhân tạo (AI), các ứng dụng thực tế trong công việc văn phòng, truyền thông, kinh tế số và tác động xã hội của AI.",
    "skills": [
      "Khái niệm & Ứng dụng thực tế của AI",
      "Phân loại AI hẹp trong đời sống",
      "AI tạo sinh & Trợ lý thông minh",
      "Tác động của AI đối với nghề nghiệp"
    ],
    "xp": 260,
    "lessons": [
      {
        "id": "ict_a_3",
        "title": "Bài 1: Khái niệm & Ứng dụng thực tế của AI",
        "bookRef": "Tài liệu ôn tập Tin 12 — Chủ đề 1 (Trang 4)",
        "priority": "Trung bình",
        "examFormat": "Trắc nghiệm Phần I",
        "summary": "Khái niệm Trí tuệ nhân tạo (AI), trợ lý ảo cá nhân (Siri, Google Assistant), nhận dạng khuôn mặt (FaceID) và phân loại hình ảnh số.",
        "theory": {
          "objectives": [
            "Hiểu định nghĩa Trí tuệ nhân tạo (AI) và cách thức AI hỗ trợ tự động hóa trong đời sống.",
            "Nhận biết công nghệ thị giác máy tính (Computer Vision) và xử lý ngôn ngữ tự nhiên (NLP)."
          ],
          "contentSections": [],
          "examTips": "⚠️ Bẫy thi THPTQG: Mở khóa bằng khuôn mặt (FaceID) hay camera đọc biển số xe là ứng dụng của công nghệ \"Thị giác máy tính\" (Computer Vision), không phải là công nghệ xử lý âm thanh."
        },
        "quiz": {
          "question": "Tính năng mở khóa điện thoại bằng khuôn mặt (FaceID) ứng dụng công nghệ then chốt nào của Trí tuệ nhân tạo?",
          "options": [
            "Thị giác máy tính (Computer Vision)",
            "Xử lý âm thanh tương tự",
            "Biên dịch mã nguồn",
            "Nén dữ liệu mất thông tin"
          ],
          "answer": 0,
          "explanation": "Nhận dạng khuôn mặt là ứng dụng điển hình của Thị giác máy tính (Computer Vision)."
        }
      },
      {
        "id": "ict_a_4",
        "title": "Bài 2: AI trong đời sống xã hội & Công việc số",
        "bookRef": "Tài liệu ôn tập Tin 12 — Chủ đề 1 (Trang 7)",
        "priority": "Trung bình",
        "examFormat": "Trắc nghiệm Phần I",
        "summary": "Tác động của AI đối với việc làm số, các công cụ sinh văn bản/hình ảnh tự động, và trách nhiệm đạo đức số khi sử dụng AI.",
        "theory": {
          "objectives": [
            "Nhận thức về đạo đức sử dụng AI: Tránh đạo văn số, không tạo và phát tán tin giả mạo (Deepfake).",
            "Biết khai thác các công cụ AI tạo sinh (Generative AI) để phục vụ học tập một cách minh bạch và an toàn."
          ],
          "contentSections": [],
          "examTips": "⚠️ Chú ý câu hỏi Đạo đức & Pháp luật số: Hành vi tạo video Deepfake giả mạo danh tính để lừa đảo là vi phạm pháp luật nghiêm trọng, không thể coi là \"trò đùa công nghệ\"."
        },
        "quiz": {
          "question": "Hành vi nào sau đây vi phạm chuẩn mực đạo đức khi sử dụng công cụ AI tạo sinh?",
          "options": [
            "Dùng AI để dịch một đoạn văn bản tiếng Anh sang tiếng Việt để tham khảo",
            "Sử dụng công cụ AI tạo video Deepfake giả mạo khuôn mặt người khác nhằm lừa đảo chiếm đoạt tài sản",
            "Nhờ AI gợi ý ý tưởng đề cương ôn tập môn học",
            "Dùng AI tạo ảnh minh họa cho bài thuyết trình cá nhân"
          ],
          "answer": 1,
          "explanation": "Tạo video Deepfake giả mạo danh tính để lừa đảo là hành vi vi phạm pháp luật và đạo đức nghiêm trọng."
        }
      }
    ]
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
    "description": "Mạng cục bộ LAN, thiết bị mạng Switch/Router/Access Point, dịch vụ Internet, kết nối mạng Wi-Fi và dịch vụ lưu trữ đám mây (Google Drive, OneDrive).",
    "skills": [
      "Mạng cục bộ LAN & Thiết bị kết nối",
      "Dịch vụ Internet & Web",
      "Mạng Wi-Fi an toàn",
      "Lưu trữ đám mây (Cloud Storage)"
    ],
    "xp": 280,
    "lessons": [
      {
        "id": "ict_b_1",
        "title": "Bài 1: Mạng cục bộ LAN & Thiết bị kết nối",
        "bookRef": "Tài liệu ôn tập Tin 12 — Chủ đề 2 (Trang 10)",
        "priority": "Trung bình",
        "examFormat": "Trắc nghiệm Phần I",
        "summary": "Mô hình kết nối mạng LAN, chức năng của Switch, Router, Access Point và cách chia sẻ thư mục/máy in trong mạng nội bộ.",
        "theory": {
          "objectives": [
            "Biết các bước chia sẻ thư mục và máy in dùng chung trong mạng cục bộ LAN.",
            "Nắm chắc vai trò của Switch trong việc chuyển tiếp khung dữ liệu nội bộ."
          ],
          "contentSections": [],
          "examTips": "⚠️ Bẫy đề: Để in tài liệu từ nhiều máy tính qua mạng LAN, người quản trị dùng tính năng \"Printer Sharing\" (Chia sẻ máy in) chứ không cần phải cắm dây thủ công vào từng máy."
        },
        "quiz": {
          "question": "Trong mạng văn phòng, để nhiều máy tính có thể in ấn trên cùng một máy in vật lý qua mạng LAN, người quản trị cần làm gì?",
          "options": [
            "Cắm dây máy in luân phiên vào từng máy tính",
            "Chia sẻ máy in (Printer Sharing) trên mạng nội bộ hoặc dùng máy in có gắn card mạng LAN/Wi-Fi",
            "Cài đặt lại toàn bộ hệ điều hành",
            "Thay thế toàn bộ cáp mạng"
          ],
          "answer": 1,
          "explanation": "Chia sẻ máy in trên mạng nội bộ cho phép mọi máy tính được cấp quyền trong LAN gửi lệnh in trực tiếp."
        }
      },
      {
        "id": "ict_b_2",
        "title": "Bài 2: Khái niệm & Dịch vụ trên Internet",
        "bookRef": "Tài liệu ôn tập Tin 12 — Chủ đề 2 (Trang 13)",
        "priority": "Trung bình",
        "examFormat": "Trắc nghiệm Phần I",
        "summary": "Các dịch vụ cốt lõi: Web (WWW), Thư điện tử (Email), Công cụ tìm kiếm (Search Engine), Hội nghị truyền hình trực tuyến.",
        "theory": {
          "objectives": [
            "Nắm các giao thức ứng dụng phổ biến: HTTP, HTTPS, FTP, SMTP, POP3/IMAP.",
            "Hiểu cơ chế hoạt động của World Wide Web và thư điện tử số."
          ],
          "contentSections": [],
          "examTips": "⚠️ Phân biệt HTTP và HTTPS: Chữ \"S\" trong HTTPS là viết tắt của \"Secure\". Dữ liệu truyền qua HTTPS được mã hóa bảo mật, chống nghe lén thông tin."
        },
        "quiz": {
          "question": "Giao thức nào đảm bảo truyền tải dữ liệu trang web được mã hóa an toàn giữa trình duyệt người dùng và máy chủ?",
          "options": [
            "HTTP",
            "HTTPS",
            "FTP",
            "Telnet"
          ],
          "answer": 1,
          "explanation": "HTTPS (Hypertext Transfer Protocol Secure) sử dụng chứng chỉ SSL/TLS để mã hóa dữ liệu truyền tải."
        }
      },
      {
        "id": "ict_b_3",
        "title": "Bài 3: Kết nối thiết bị mạng Switch, Router, AP",
        "bookRef": "Tài liệu ôn tập Tin 12 — Chủ đề 2 (Trang 15)",
        "priority": "Trung bình",
        "examFormat": "Trắc nghiệm Phần I",
        "summary": "Các bước thiết lập mạng nội bộ cho văn phòng nhỏ: Gắn cáp RJ45, cấu hình DHCP cấp phát IP tự động, đặt mật khẩu Wi-Fi.",
        "theory": {
          "objectives": [
            "Hiểu vai trò của giao thức DHCP trong việc tự động cấp phát địa chỉ IP cho thiết bị kết nối.",
            "Nắm các bước cơ bản cấu hình mạng Wi-Fi an toàn."
          ],
          "contentSections": [],
          "examTips": "⚠️ Ghi nhớ thuật ngữ viết tắt: DHCP = Tự động cấp địa chỉ IP. DNS = Phân giải tên miền (google.com) thành địa chỉ IP."
        },
        "quiz": {
          "question": "Dịch vụ mạng nào có nhiệm vụ tự động gán địa chỉ IP cho các máy tính khi kết nối vào mạng LAN?",
          "options": [
            "DNS",
            "DHCP",
            "HTTP",
            "SNMP"
          ],
          "answer": 1,
          "explanation": "DHCP (Dynamic Host Configuration Protocol) tự động cấu hình và cấp phát địa chỉ IP cho các thiết bị trong mạng."
        }
      },
      {
        "id": "ict_b_4",
        "title": "Bài 4: Mạng Wi-Fi & Dịch vụ Lưu trữ đám mây",
        "bookRef": "Tài liệu ôn tập Tin 12 — Chủ đề 2 (Trang 17)",
        "priority": "Trung bình",
        "examFormat": "Trắc nghiệm Phần I",
        "summary": "Cơ chế chia sẻ tệp tin, phân quyền (Chỉ xem, Nhận xét, Chỉnh sửa) trên Google Drive và Microsoft OneDrive.",
        "theory": {
          "objectives": [
            "Hiểu các mức độ phân quyền tài liệu khi chia sẻ qua đường liên kết (Link sharing).",
            "Nắm nguyên tắc đồng bộ hóa dữ liệu thời gian thực trên đám mây."
          ],
          "contentSections": [],
          "examTips": "⚠️ Bẫy đề thi phân quyền: Quyền \"Viewer\" tuyệt đối không được phép chỉnh sửa nội dung tài liệu gốc của chủ sở hữu."
        },
        "quiz": {
          "question": "Khi chia sẻ tệp trên Google Drive cho người khác với quyền \"Viewer\" (Người xem), người được chia sẻ có thể làm gì?",
          "options": [
            "Chỉnh sửa nội dung và xóa tệp vĩnh viễn",
            "Chỉ có thể xem hoặc tải tệp về, không thể sửa đổi nội dung tệp gốc",
            "Đổi quyền sở hữu tệp sang tài khoản của mình",
            "Thay đổi phân quyền của những người dùng khác"
          ],
          "answer": 1,
          "explanation": "Quyền Viewer chỉ cho phép đọc dữ liệu, không có quyền chỉnh sửa tài liệu gốc của chủ sở hữu."
        }
      }
    ]
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
    "description": "Bản quyền phần mềm, sở hữu trí tuệ, tác quyền số, an toàn thông tin, Luật An ninh mạng và văn hóa ứng xử trên mạng xã hội.",
    "skills": [
      "Bản quyền phần mềm & Tác quyền số",
      "Luật An ninh mạng & Bảo vệ dữ liệu",
      "Văn hóa ứng xử trên không gian mạng",
      "Phòng tránh lừa đảo & Rủi ro số"
    ],
    "xp": 220,
    "lessons": [
      {
        "id": "ict_d_1",
        "title": "Bài 1: Bản quyền phần mềm & Tác quyền số",
        "bookRef": "Tài liệu ôn tập Tin 12 — Chủ đề 3 (Trang 20)",
        "priority": "Trung bình",
        "examFormat": "Trắc nghiệm Phần I",
        "summary": "Các loại giấy phép Creative Commons (CC), quyền tác giả đối với hình ảnh, video số trên Internet.",
        "theory": {
          "objectives": [
            "Nhận biết các hành vi vi phạm tác quyền khi sử dụng tài nguyên số tải từ Internet.",
            "Hiểu các ký hiệu giấy phép bản quyền mở Creative Commons (CC BY, CC SA, CC NC, CC ND)."
          ],
          "contentSections": [],
          "examTips": "⚠️ Bẫy đề thi: \"CC BY-SA\" đòi hỏi: Ghi danh tác giả gốc (BY) và chia sẻ tác phẩm phát sinh cùng giấy phép (SA)."
        },
        "quiz": {
          "question": "Khi sử dụng một hình ảnh tải trên mạng có giấy phép \"CC BY-SA\", người sử dụng bắt buộc phải tuân thủ điều kiện gì?",
          "options": [
            "Không được phép sử dụng trong bất kỳ trường hợp nào",
            "Ghi nhận công lao tác giả gốc (BY) và chia sẻ tác phẩm phái sinh theo giấy phép tương tự (SA)",
            "Phải trả phí bản quyền bằng tiền mặt cho tác giả",
            "Chỉ được dùng cho các tổ chức phi chính phủ"
          ],
          "answer": 1,
          "explanation": "CC BY-SA yêu cầu ghi nhận tác giả (BY) và phát hành tác phẩm sửa đổi cùng giấy phép tương tự (Share-Alike)."
        }
      },
      {
        "id": "ict_d_2",
        "title": "Bài 2: An toàn thông tin & Văn hóa mạng",
        "bookRef": "Tài liệu ôn tập Tin 12 — Chủ đề 3 (Trang 22)",
        "priority": "Trung bình",
        "examFormat": "Trắc nghiệm Phần I",
        "summary": "Bảo vệ mật khẩu, phòng chống lừa đảo mạo danh trên mạng xã hội, văn hóa ứng xử văn minh trên không gian số.",
        "theory": {
          "objectives": [
            "Nắm chắc quy tắc bảo mật thông tin tài khoản cá nhân và phòng tránh bẫy mã độc, lừa đảo trực tuyến (Phishing).",
            "Tuân thủ Luật An ninh mạng và các chuẩn mực ứng xử trên mạng xã hội."
          ],
          "contentSections": [],
          "examTips": "⚠️ Biện pháp an toàn nhất: Bật xác thực 2 yếu tố (2FA) ngăn chặn kẻ xấu chiếm quyền điều khiển tài khoản ngay cả khi mật khẩu đã bị lộ."
        },
        "quiz": {
          "question": "Để bảo vệ tài khoản mạng xã hội cá nhân khỏi nguy cơ bị chiếm đoạt, biện pháp nào sau đây là hiệu quả nhất?",
          "options": [
            "Đặt mật khẩu ngắn dễ nhớ như 123456",
            "Bật tính năng xác thực hai yếu tố (2FA) và không nhấp vào liên kết lạ nghi ngờ giả mạo",
            "Dùng chung một mật khẩu cho mọi trang web và tài khoản ngân hàng",
            "Chia sẻ thông tin đăng nhập cho bạn bè cùng quản lý"
          ],
          "answer": 1,
          "explanation": "Bật xác thực 2 yếu tố (2FA) ngăn chặn kẻ xấu đăng nhập ngay cả khi bị lộ mật khẩu."
        }
      }
    ]
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
    "description": "Khái niệm CSDL & Hệ Quản trị CSDL (DBMS), mô hình quan hệ, bảng dữ liệu, khóa chính (Primary Key), khóa ngoại (Foreign Key) và truy vấn dữ liệu SQL căn bản.",
    "skills": [
      "Khái niệm CSDL & Hệ QTCSDL",
      "Bảng dữ liệu & Khóa chính",
      "Khóa ngoại & Liên kết bảng",
      "Truy vấn SQL cơ bản"
    ],
    "xp": 320,
    "lessons": [
      {
        "id": "ict_db_1",
        "title": "Bài 1: Giới thiệu CSDL & Hệ QTCSDL",
        "bookRef": "Tài liệu ôn tập Tin 12 — Chủ đề 4 (Trang 25)",
        "priority": "Rất cao",
        "examFormat": "Trắc nghiệm Phần I & II",
        "summary": "Khái niệm CSDL, Hệ quản trị CSDL (DBMS), các đặc trưng an toàn, tính toàn vẹn và độc lập dữ liệu.",
        "theory": {
          "objectives": [
            "Phân biệt được CSDL (Database) và Hệ quản trị CSDL (DBMS).",
            "Nắm vai trò tránh dư thừa dữ liệu và đảm bảo nhất quán."
          ],
          "contentSections": [],
          "examTips": "CSDL là dữ liệu; DBMS là phần mềm quản lý dữ liệu đó."
        },
        "quiz": {
          "question": "Phần mềm nào sau đây là Hệ quản trị cơ sở dữ liệu (DBMS)?",
          "options": [
            "Python",
            "MySQL",
            "Visual Studio Code",
            "Git"
          ],
          "answer": 1,
          "explanation": "MySQL là một Hệ quản trị cơ sở dữ liệu quan hệ (RDBMS) rất phổ biến."
        }
      },
      {
        "id": "ict_db_2",
        "title": "Bài 2: Mô hình CSDL Quan hệ & Khóa chính",
        "bookRef": "Tài liệu ôn tập Tin 12 — Chủ đề 4 (Trang 28)",
        "priority": "Rất cao",
        "examFormat": "Trắc nghiệm Phần I & II",
        "summary": "Cấu trúc bảng, bản ghi (dòng), thuộc tính (cột), khái niệm Khóa chính (Primary Key) và tính duy nhất, khác NULL.",
        "theory": {
          "objectives": [
            "Hiểu định nghĩa Khóa chính (Primary Key).",
            "Nắm hai điều kiện bắt buộc của Khóa chính: DUY NHẤT (Unique) và KHÔNG ĐƯỢC RỖNG (NOT NULL)."
          ],
          "contentSections": [],
          "examTips": "⚠️ Bẫy đề Đúng/Sai Phần II: \"Một bảng có thể có nhiều khóa chính\" -> SAI (chỉ có duy nhất 1 khóa chính, nhưng có thể gồm nhiều thuộc tính kết hợp)."
        },
        "quiz": {
          "question": "Hai tính chất bắt buộc của một Khóa chính (Primary Key) trong bảng quan hệ là:",
          "options": [
            "Giá trị phải là số nguyên và tự động tăng",
            "Giá trị phải mang tính DUY NHẤT và KHÔNG ĐƯỢC RỖNG (NOT NULL)",
            "Giá trị có thể trùng nhau nhưng không được rỗng",
            "Chỉ áp dụng cho trường văn bản"
          ],
          "answer": 1,
          "explanation": "Khóa chính bắt buộc phải duy nhất trên toàn bảng và không được mang giá trị NULL."
        }
      },
      {
        "id": "ict_db_3",
        "title": "Bài 3: Khóa ngoại & Liên kết bảng",
        "bookRef": "Tài liệu ôn tập Tin 12 — Chủ đề 4 (Trang 31)",
        "priority": "Rất cao",
        "examFormat": "Trắc nghiệm Phần I & II",
        "summary": "Khái niệm Khóa ngoại (Foreign Key), ràng buộc toàn vẹn tham chiếu, liên kết quan hệ 1 - 1, 1 - N, N - N.",
        "theory": {
          "objectives": [
            "Hiểu Khóa ngoại là cầu nối tham chiếu đến Khóa chính của bảng khác.",
            "Nắm quy tắc toàn vẹn tham chiếu: Giá trị khóa ngoại phải tồn tại ở bảng cha hoặc mang giá trị NULL."
          ],
          "contentSections": [],
          "examTips": "⚠️ Bẫy xóa dữ liệu: Không thể xóa một dòng ở bảng cha (chứa khóa chính) nếu đang có dòng ở bảng con (chứa khóa ngoại) tham chiếu tới nó (trừ khi có thiết lập ON DELETE CASCADE)."
        },
        "quiz": {
          "question": "Ràng buộc toàn vẹn tham chiếu của Khóa ngoại (Foreign Key) quy định điều gì?",
          "options": [
            "Giá trị khóa ngoại luôn luôn bằng 0",
            "Giá trị khóa ngoại phải tồn tại trong tập giá trị khóa chính của bảng được tham chiếu (hoặc là NULL)",
            "Bảng chứa khóa ngoại bắt buộc phải có ít hơn 10 cột",
            "Khóa ngoại không được phép trùng lặp trong bảng của nó"
          ],
          "answer": 1,
          "explanation": "Toàn vẹn tham chiếu đảm bảo không có bản ghi \"mồ côi\" tham chiếu tới một đối tượng không tồn tại ở bảng cha."
        }
      },
      {
        "id": "ict_db_4",
        "title": "Bài 4: Ngôn ngữ SQL & Lệnh truy vấn SELECT",
        "bookRef": "Tài liệu ôn tập Tin 12 — Chủ đề 4 (Trang 34)",
        "priority": "Rất cao",
        "examFormat": "Trắc nghiệm Phần I & II",
        "summary": "Cú pháp câu lệnh SELECT căn bản, lọc dữ liệu với WHERE, toán tử so sánh, LIKE, BETWEEN, ORDER BY sắp xếp.",
        "theory": {
          "objectives": [
            "Viết đúng thứ tự các mệnh đề SQL: SELECT ... FROM ... WHERE ... ORDER BY ...",
            "Sử dụng thành thạo toán tử LIKE với ký tự đại diện % và _."
          ],
          "contentSections": [],
          "examTips": "⚠️ Trật tự thực thi trong SQL: FROM -> WHERE -> SELECT -> ORDER BY. Do đó không thể dùng bí danh (Alias) đặt trong SELECT để lọc ở WHERE."
        },
        "quiz": {
          "question": "Để lọc các học sinh có tên bắt đầu bằng chữ cái \"N\" trong bảng HOC_SINH, mệnh đề WHERE nào sau đây là chính xác?",
          "options": [
            "WHERE HoTen = 'N*'",
            "WHERE HoTen LIKE 'N%'",
            "WHERE HoTen IN ('N')",
            "WHERE HoTen CONTAINS 'N'"
          ],
          "answer": 1,
          "explanation": "Trong chuẩn SQL, toán tử LIKE kết hợp với ký tự '%' đại diện cho chuỗi ký tự bất kỳ."
        }
      }
    ]
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
    "description": "Cấu trúc văn bản siêu liên kết HTML, các thẻ định dạng, chèn hình ảnh, tạo bảng (table), biểu mẫu (form), danh sách, siêu liên kết và ngôn ngữ CSS định kiểu trang web.",
    "skills": [
      "Cấu trúc trang web HTML",
      "Thẻ Bảng (table) & Form nhập liệu",
      "Thẻ liên kết (a) & Danh sách (ul, ol)",
      "Định kiểu CSS (Color, Font, Box Model)"
    ],
    "xp": 350,
    "lessons": [
      {
        "id": "ict_e_1",
        "title": "Bài 1: Giới thiệu HTML & Cấu trúc trang Web",
        "bookRef": "Tài liệu ôn tập Tin 12 — Chủ đề 5 (Trang 40)",
        "priority": "Cực kỳ cao",
        "examFormat": "Trọng tâm Phần II Đúng/Sai",
        "summary": "Cấu trúc tài liệu chuẩn: <!DOCTYPE html>, <html>, <head>, <title>, <body>; sự khác biệt giữa phần tử khối và nội dòng.",
        "theory": {
          "objectives": [
            "Nhận biết cấu trúc khung xương của một tệp HTML chuẩn đề thi.",
            "Phân biệt rõ ràng nội dung trong thẻ <head> (thông tin cấu hình) và nội dung trong <body> (vùng hiển thị cho người xem)."
          ],
          "contentSections": [],
          "examTips": "⚠️ Bẫy đề thi Đúng/Sai: \"Nội dung thẻ <title> được hiển thị trực tiếp trong vùng nội dung bài viết của trang web\" -> SAI! Thẻ <title> nằm trong <head> và chỉ hiển thị trên thanh tiêu đề hoặc tab của trình duyệt web."
        },
        "quiz": {
          "question": "Phần tử nào trong tài liệu HTML chứa nội dung sẽ được hiển thị trực tiếp lên vùng hiển thị của trình duyệt web?",
          "options": [
            "<head>",
            "<body>",
            "<title>",
            "<meta>"
          ],
          "answer": 1,
          "explanation": "Thẻ <body> chứa toàn bộ các văn bản, hình ảnh, liên kết và thành phần đồ họa hiển thị trên trang web."
        }
      },
      {
        "id": "ict_e_2",
        "title": "Bài 2: Các thẻ định dạng văn bản & Thẻ ảnh",
        "bookRef": "Tài liệu ôn tập Tin 12 — Chủ đề 5 (Trang 46)",
        "priority": "Cực kỳ cao",
        "examFormat": "Trọng tâm Phần II Đúng/Sai",
        "summary": "Các thẻ tiêu đề <h1> đến <h6>, thẻ đoạn văn <p>, in đậm <b>, in nghiêng <i>; thẻ chèn ảnh <img src=\"...\" alt=\"...\">.",
        "theory": {
          "objectives": [
            "Nắm các thuộc tính bắt buộc của thẻ ảnh <img>: src (đường dẫn nguồn) và alt (văn bản thay thế khi lỗi ảnh).",
            "Lưu ý thẻ <img> là thẻ đơn (thẻ rỗng - không cần thẻ đóng </img>)."
          ],
          "contentSections": [],
          "examTips": "⚠️ Bẫy thẻ đơn HTML: Thẻ <img>, <br>, <hr>, <input> là các thẻ đơn (void element), không có thẻ đóng tương ứng như </img>."
        },
        "quiz": {
          "question": "Cú pháp chèn hình ảnh nào sau đây là ĐÚNG trong chuẩn ngôn ngữ HTML?",
          "options": [
            "<image src=\"logo.png\" alt=\"Logo\">",
            "<img src=\"logo.png\" alt=\"Logo\" />",
            "<img href=\"logo.png\" title=\"Logo\"></img>",
            "<picture url=\"logo.png\">"
          ],
          "answer": 1,
          "explanation": "Thẻ HTML chuẩn là <img> với thuộc tính bắt buộc src chỉ định đường dẫn hình ảnh."
        }
      },
      {
        "id": "ict_e_3",
        "title": "Bài 3: Thẻ tạo Bảng Table & Form nhập liệu",
        "bookRef": "Tài liệu ôn tập Tin 12 — Chủ đề 5 (Trang 52)",
        "priority": "Cực kỳ cao",
        "examFormat": "Trọng tâm Phần II Đúng/Sai",
        "summary": "Thẻ <table>, <tr> (dòng), <th> (tiêu đề cột), <td> (ô dữ liệu); Thuộc tính gộp ô rowspan, colspan; Thẻ <form>, <input type=\"text|password|radio|checkbox|submit\">.",
        "theory": {
          "objectives": [
            "Phân biệt: rowspan gộp nhiều DÒNG; colspan gộp nhiều CỘT.",
            "Đọc hiểu và truy vết chính xác các trường trong biểu mẫu form nhập liệu."
          ],
          "contentSections": [],
          "examTips": "⚠️ Bẫy đề Đúng/Sai kinh điển: \"colspan=2 gộp 2 dòng lại với nhau\" -> SAI hoàn toàn! Nhớ quy tắc: COLspan = gộp CỘT (ngang); ROWspan = gộp DÒNG (dọc)."
        },
        "quiz": {
          "question": "Để gộp 3 ô trên cùng một HÀNG ngang thành một ô duy nhất trong bảng HTML, ta dùng thuộc tính nào cho thẻ <td> hoặc <th>?",
          "options": [
            "rowspan=\"3\"",
            "colspan=\"3\"",
            "mergerow=\"3\"",
            "span=\"3\""
          ],
          "answer": 1,
          "explanation": "Thuộc tính colspan (Column Span) dùng để gộp các ô theo chiều ngang của các cột."
        }
      },
      {
        "id": "ict_e_4",
        "title": "Bài 4: Thẻ liên kết a & Danh sách ul, ol",
        "bookRef": "Tài liệu ôn tập Tin 12 — Chủ đề 5 (Trang 58)",
        "priority": "Cực kỳ cao",
        "examFormat": "Trọng tâm Phần II Đúng/Sai",
        "summary": "Thẻ tạo siêu liên kết <a href=\"...\" target=\"_blank\">; Danh sách không có thứ tự <ul><li> và danh sách có thứ tự <ol><li>.",
        "theory": {
          "objectives": [
            "Thuộc tính href chỉ định địa chỉ liên kết đích.",
            "Thuộc tính target=\"_blank\" mở liên kết trong một tab hoặc cửa sổ mới."
          ],
          "contentSections": [],
          "examTips": "⚠️ Bẫy đề thi: \"Mặc định nếu không chỉ định target, trình duyệt sẽ mở liên kết ở một tab mới\" -> SAI! Mặc định là target=\"_self\" (mở ngay tại tab hiện tại)."
        },
        "quiz": {
          "question": "Thuộc tính nào của thẻ <a> quy định việc mở trang web liên kết trong một tab trình duyệt mới?",
          "options": [
            "target=\"_blank\"",
            "target=\"_self\"",
            "window=\"new\"",
            "href=\"_new\""
          ],
          "answer": 0,
          "explanation": "Thuộc tính target=\"_blank\" điều khiển trình duyệt mở liên kết ở một tab hoặc cửa sổ mới."
        }
      },
      {
        "id": "ict_e_5",
        "title": "Bài 5: Ngôn ngữ CSS & Nhúng CSS vào HTML",
        "bookRef": "Tài liệu ôn tập Tin 12 — Chủ đề 5 (Trang 64)",
        "priority": "Cực kỳ cao",
        "examFormat": "Trọng tâm Phần II Đúng/Sai",
        "summary": "Ba cách nhúng CSS: Inline (trong thẻ), Internal (thẻ <style> trong <head>), External (tệp .css qua thẻ <link>); Cú pháp bộ chọn selector (tag, .class, #id).",
        "theory": {
          "objectives": [
            "Phân biệt: Dấu chấm (.) đại diện cho bộ chọn class; Dấu thăng (#) đại diện cho bộ chọn id.",
            "Hiểu thứ tự ưu tiên áp dụng style khi có xung đột định dạng CSS."
          ],
          "contentSections": [],
          "examTips": "⚠️ Bẫy đề thi: Dấu chấm (.) là chọn theo CLASS; Dấu thăng (#) là chọn theo ID. Nếu đề bài cho <p class=\"chu-do\"> thì trong CSS phải viết là .chu-do chứ không phải #chu-do."
        },
        "quiz": {
          "question": "Để áp dụng định dạng CSS cho tất cả các phần tử có thuộc tính class=\"highlight\", bộ chọn (selector) nào được sử dụng?",
          "options": [
            "#highlight",
            ".highlight",
            "highlight",
            "*highlight"
          ],
          "answer": 1,
          "explanation": "Trong CSS, dấu chấm (.) đứng trước tên để định danh cho bộ chọn lớp (class selector)."
        }
      },
      {
        "id": "ict_e_6",
        "title": "Bài 6: Thuộc tính CSS cơ bản (Color, Font, Margin)",
        "bookRef": "Tài liệu ôn tập Tin 12 — Chủ đề 5 (Trang 70)",
        "priority": "Cực kỳ cao",
        "examFormat": "Trọng tâm Phần II Đúng/Sai",
        "summary": "Mô hình hộp (Box Model): Content -> Padding -> Border -> Margin; Các thuộc tính font-family, font-size, background-color.",
        "theory": {
          "objectives": [
            "Phân biệt rõ ràng: Padding là khoảng đệm BÊN TRONG đường viền; Margin là khoảng cách BÊN NGOÀI đường viền.",
            "Nắm chắc các thuộc tính định dạng chữ font và màu sắc."
          ],
          "contentSections": [],
          "examTips": "⚠️ Bẫy Box Model kinh điển: \"Margin là khoảng cách nằm giữa nội dung và đường viền\" -> SAI! Khoảng giữa nội dung và đường viền là PADDING. Margin là khoảng cách BÊN NGOÀI đường viền."
        },
        "quiz": {
          "question": "Trong mô hình hộp (Box Model) của CSS, vùng khoảng cách nằm giữa nội dung (content) và đường viền (border) được gọi là:",
          "options": [
            "Margin",
            "Padding",
            "Outline",
            "Spacing"
          ],
          "answer": 1,
          "explanation": "Padding là khoảng đệm nằm bên trong bao quanh nội dung cho tới mép đường viền (Border)."
        }
      }
    ]
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
    "description": "Các nhóm ngành nghề ứng dụng CNTT trong doanh nghiệp, quản trị web, truyền thông đa phương tiện, thiết kế đồ họa và định hướng phát triển nghề nghiệp số.",
    "skills": [
      "Nhóm ngành nghề ứng dụng CNTT",
      "Nghề quản trị Website & Đồ họa số",
      "Yêu cầu năng lực & Xu hướng số",
      "Định hướng nghề nghiệp tương lai"
    ],
    "xp": 200,
    "lessons": [
      {
        "id": "ict_g_1",
        "title": "Bài 1: Các ngành nghề ứng dụng CNTT",
        "bookRef": "Tài liệu ôn tập Tin 12 — Chủ đề 6 (Trang 75)",
        "priority": "Thấp",
        "examFormat": "Trắc nghiệm Phần I",
        "summary": "Tổng quan các vị trí việc làm trong xã hội hiện đại có ứng dụng công nghệ thông tin và kỹ năng số cần trang bị.",
        "theory": {
          "objectives": [
            "Hiểu các vị trí công việc phổ biến yêu cầu kỹ năng Tin học ứng dụng.",
            "Nắm chắc các yêu cầu đạo đức nghề nghiệp và tinh thần tự học công nghệ mới."
          ],
          "contentSections": [],
          "examTips": "⚠️ Câu hỏi nhận biết: Quản trị viên website có nhiệm vụ bảo trì và cập nhật hệ thống web, không nhất thiết phải là người viết toàn bộ mã nguồn ban đầu."
        },
        "quiz": {
          "question": "Người chịu trách nhiệm theo dõi, bảo trì tính liên tục và cập nhật nội dung cho trang web của một cơ quan được gọi là:",
          "options": [
            "Chuyên viên kiểm thử",
            "Quản trị viên website (Webmaster)",
            "Kỹ sư phần cứng máy tính",
            "Lập trình viên nhân hệ điều hành"
          ],
          "answer": 1,
          "explanation": "Webmaster (Quản trị viên website) chịu trách nhiệm vận hành, bảo dưỡng và cập nhật trang web hàng ngày."
        }
      },
      {
        "id": "ict_g_2",
        "title": "Bài 2: Hướng nghiệp Quản trị Web & Thiết kế đồ họa",
        "bookRef": "Tài liệu ôn tập Tin 12 — Chủ đề 6 (Trang 78)",
        "priority": "Thấp",
        "examFormat": "Trắc nghiệm Phần I",
        "summary": "Yêu cầu năng lực số, chứng chỉ nghề nghiệp quốc tế (MOS, Adobe Certified) và cơ hội học tập tại các trường đại học/cao đẳng.",
        "theory": {
          "objectives": [
            "Xác định được lộ trình học tập và tích lũy kỹ năng để theo đuổi các ngành nghề công nghệ ứng dụng."
          ],
          "contentSections": [],
          "examTips": "⚠️ Ghi nhớ: Kỹ năng tự học và cập nhật công nghệ mới liên tục là yếu tố quan trọng hàng đầu trong ngành CNTT."
        },
        "quiz": {
          "question": "Chứng chỉ quốc tế nào sau đây đánh giá trình độ sử dụng thành thạo bộ ứng dụng văn phòng của Microsoft?",
          "options": [
            "CCNA",
            "MOS (Microsoft Office Specialist)",
            "CEH",
            "AWS Cloud Practitioner"
          ],
          "answer": 1,
          "explanation": "MOS (Microsoft Office Specialist) là chứng chỉ tin học văn phòng quốc tế chuẩn của Microsoft."
        }
      }
    ]
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
    "description": "Thực hành tạo bảng dữ liệu, khóa chính, liên kết bảng, xử lý dữ liệu bảng tính nâng cao, các hàm Logic (IF, AND, OR), hàm tra cứu (VLOOKUP, HLOOKUP), thống kê có điều kiện (SUMIF, COUNTIF), Pivot Table và trích lọc dữ liệu.",
    "skills": [
      "Tạo bảng CSDL & Khóa chính",
      "Hàm Logic (IF, AND, OR) & VLOOKUP",
      "Hàm thống kê (SUMIF, COUNTIF)",
      "Pivot Table & Lọc dữ liệu nâng cao"
    ],
    "xp": 400,
    "lessons": [
      {
        "id": "ict_c_1",
        "title": "Bài 1: Bảng tính Excel & Địa chỉ ô tuyệt đối/tương đối",
        "bookRef": "Tài liệu ôn tập Tin 12 — Chủ đề ICT 1 (Trang 114)",
        "priority": "Cực kỳ cao",
        "examFormat": "Trắc nghiệm Phần I & II",
        "summary": "Phân biệt địa chỉ tương đối (A1), tuyệt đối ($A$1) và hỗn hợp ($A1, A$1); sự biến đổi địa chỉ khi sao chép công thức.",
        "theory": {
          "objectives": [
            "Nắm chắc quy tắc: Dấu $ đứng trước thành phần nào thì thành phần đó CỐ ĐỊNH khi sao chép công thức.",
            "Tính toán chính xác kết quả ô tính sau khi kéo fill-handle sang dòng/cột khác."
          ],
          "contentSections": [],
          "examTips": "⚠️ Bẫy đề thi THPTQG: Đề bài cho công thức ô B2 là =$A1*B$1, hỏi khi sao chép sang C4 công thức trở thành gì? Nhớ: Cột A có $ nên cố định A, dòng 1 có $ nên cố định 1! -> Kết quả tại C4 là =$A3*C$1."
        },
        "quiz": {
          "question": "Tại ô C2 có công thức: = $A$1 + B2. Khi sao chép công thức này sang ô D3, công thức tại ô D3 sẽ trở thành:",
          "options": [
            "= $B$2 + C3",
            "= $A$1 + C3",
            "= $A$2 + B3",
            "= $A$1 + B2"
          ],
          "answer": 1,
          "explanation": "Địa chỉ $A$1 giữ nguyên. Địa chỉ tương đối B2 dịch sang phải 1 cột và xuống 1 dòng nên trở thành C3. Vậy công thức là =$A$1 + C3."
        }
      },
      {
        "id": "ict_c_2",
        "title": "Bài 2: Các hàm Logic IF, AND, OR trong bảng tính",
        "bookRef": "Tài liệu ôn tập Tin 12 — Chủ đề ICT 1 (Trang 116)",
        "priority": "Cực kỳ cao",
        "examFormat": "Trọng tâm Phần II Đúng/Sai",
        "summary": "Cú pháp hàm IF lồng nhau kết hợp AND(...), OR(...) để xếp loại học sinh, tính phụ cấp lương, tính tiền thưởng.",
        "theory": {
          "objectives": [
            "Cú pháp chuẩn: =IF(DieuKien, GiaTriNeuDung, GiaTriNeuSai).",
            "Biết cách lồng ghép các điều kiện logic phức hợp với AND và OR."
          ],
          "contentSections": [],
          "examTips": "⚠️ Bẫy đề Đúng/Sai: Lệnh =AND(5>3, 2>4) trả về FALSE vì 2>4 là sai. Lệnh =OR(5>3, 2>4) trả về TRUE vì 5>3 đã đúng!"
        },
        "quiz": {
          "question": "Biểu thức Excel sau trả về kết quả gì: =IF(AND(10>5, 3>8), \"Đạt\", \"Hỏng\")?",
          "options": [
            "Đạt",
            "Hỏng",
            "#VALUE!",
            "#NAME?"
          ],
          "answer": 1,
          "explanation": "Hàm AND(10>5, 3>8) có điều kiện 3>8 là SAI, do đó hàm AND trả về FALSE. Hàm IF nhận FALSE nên trả về giá trị thứ 3 là \"Hỏng\"."
        }
      },
      {
        "id": "ict_c_3",
        "title": "Bài 3: Các hàm tìm kiếm VLOOKUP, HLOOKUP",
        "bookRef": "Tài liệu ôn tập Tin 12 — Chủ đề ICT 1 (Trang 118)",
        "priority": "Cực kỳ cao",
        "examFormat": "Trọng tâm Phần II Đúng/Sai",
        "summary": "Cú pháp tìm kiếm cột VLOOKUP và dòng HLOOKUP; ý nghĩa tham số tìm kiếm chính xác (0 / FALSE) vs tương đối (1 / TRUE).",
        "theory": {
          "objectives": [
            "Cú pháp: =VLOOKUP(Lookup_value, Table_array, Col_index_num, [Range_lookup]).",
            "Hiểu rõ nguyên lý: Cột đầu tiên trong Table_array phải chứa giá trị cần tìm."
          ],
          "contentSections": [],
          "examTips": "⚠️ Bẫy đề kinh điển: Quên khóa tuyệt đối bảng tham chiếu! Nếu viết =VLOOKUP(A2, F2:H10, 2, 0) khi sao chép công thức xuống hàng dưới, bảng F2:H10 sẽ trôi thành F3:H11 dẫn đến lỗi #N/A."
        },
        "quiz": {
          "question": "Khi sử dụng hàm VLOOKUP, tham số Range_lookup nhận giá trị bằng 0 (hoặc FALSE) có ý nghĩa gì?",
          "options": [
            "Tìm kiếm xấp xỉ theo khoảng giá trị",
            "Tìm kiếm chính xác tuyệt đối",
            "Trả về kết quả là số 0",
            "Không tìm kiếm mà bỏ qua"
          ],
          "answer": 1,
          "explanation": "Tham số Range_lookup = 0 hoặc FALSE quy định chế độ tìm kiếm chính xác tuyệt đối từng ký tự."
        }
      },
      {
        "id": "ict_c_4",
        "title": "Bài 4: Hàm thống kê điều kiện SUMIF, COUNTIF",
        "bookRef": "Tài liệu ôn tập Tin 12 — Chủ đề ICT 1 (Trang 119)",
        "priority": "Cực kỳ cao",
        "examFormat": "Trọng tâm Phần II Đúng/Sai",
        "summary": "Cú pháp đếm có điều kiện COUNTIF(vung, dieu_kien) và tính tổng có điều kiện SUMIF(vung_dieu_kien, dieu_kien, vung_tinh_tong).",
        "theory": {
          "objectives": [
            "Cú pháp hàm COUNTIF: Đếm số ô thỏa mãn tiêu chí xác định.",
            "Cú pháp hàm SUMIF: Tính tổng các số trong vùng tính tổng ứng với các ô thỏa mãn điều kiện."
          ],
          "contentSections": [],
          "examTips": "⚠️ Lưu ý cú pháp điều kiện: Điều kiện dạng so sánh số học như lớn hơn hoặc bằng 500 PHẢI đặt trong dấu ngoặc kép, ví dụ: \">=500\", nếu viết >=500 không có ngoặc kép sẽ bị lỗi cú pháp."
        },
        "quiz": {
          "question": "Công thức nào sau đây đếm số lượng học sinh có điểm trung bình (ở cột D từ D2 đến D30) lớn hơn hoặc bằng 8.0?",
          "options": [
            "=COUNTIF(D2:D30, >=8.0)",
            "=COUNTIF(D2:D30, \">=8.0\")",
            "=SUMIF(D2:D30, \">=8.0\")",
            "=COUNT(D2:D30, \">=8.0\")"
          ],
          "answer": 1,
          "explanation": "Hàm COUNTIF đếm theo điều kiện, và điều kiện so sánh phải được bao bọc trong cặp dấu nháy kép: \">=8.0\"."
        }
      },
      {
        "id": "ict_c_5",
        "title": "Bài 5: Kỹ thuật Pivot Table & Báo cáo thống kê",
        "bookRef": "Tài liệu ôn tập Tin 12 — Chủ đề ICT 1 (Trang 120)",
        "priority": "Cực kỳ cao",
        "examFormat": "Trọng tâm Phần II Đúng/Sai",
        "summary": "Tạo bảng tổng hợp dữ liệu động Pivot Table: Vùng Rows, Columns, Values, Filters; cách đổi hàm tính từ SUM sang COUNT/AVERAGE.",
        "theory": {
          "objectives": [
            "Hiểu chức năng của 4 vùng cấu hình Pivot Table: Filters, Columns, Rows và Values.",
            "Biết cách làm mới dữ liệu (Refresh) khi dữ liệu nguồn thay đổi."
          ],
          "contentSections": [],
          "examTips": "⚠️ Bẫy đề thi Đúng/Sai: Khi bảng dữ liệu gốc thay đổi, báo cáo Pivot Table KHÔNG tự động cập nhật ngay lập tức mà người dùng phải bấm chuột phải chọn \"Refresh\" (Làm mới)."
        },
        "quiz": {
          "question": "Khi dữ liệu trong bảng nguồn ban đầu bị chỉnh sửa, muốn báo cáo Pivot Table cập nhật kết quả mới nhất ta cần làm gì?",
          "options": [
            "Xóa Pivot Table và tạo lại từ đầu",
            "Nhấp chuột phải vào Pivot Table và chọn \"Refresh\"",
            "Lưu tệp Excel và khởi động lại máy tính",
            "Pivot Table sẽ tự động xóa các dữ liệu cũ"
          ],
          "answer": 1,
          "explanation": "Nhấp chuột phải chọn \"Refresh\" để làm mới dữ liệu Pivot Table theo bảng dữ liệu nguồn mới."
        }
      },
      {
        "id": "ict_c_6",
        "title": "Bài 6: Biểu đồ & Lọc dữ liệu Advanced Filter",
        "bookRef": "Tài liệu ôn tập Tin 12 — Chủ đề ICT 1 (Trang 121)",
        "priority": "Cực kỳ cao",
        "examFormat": "Trọng tâm Phần II Đúng/Sai",
        "summary": "Các loại biểu đồ Column, Line, Pie; Kỹ thuật trích lọc dữ liệu nâng cao (Advanced Filter) với bảng tiêu chuẩn điều kiện.",
        "theory": {
          "objectives": [
            "Chọn loại biểu đồ phù hợp với mục đích trực quan hóa dữ liệu.",
            "Nắm nguyên tắc thiết lập vùng tiêu chuẩn (Criteria Range) trong Advanced Filter."
          ],
          "contentSections": [],
          "examTips": "⚠️ Bẫy Advanced Filter: Điều kiện cùng hàng là AND; điều kiện khác hàng là OR. Đây là câu hỏi kinh điển trong đề thi THPTQG phần II."
        },
        "quiz": {
          "question": "Để biểu diễn trực quan tỉ lệ phần trăm đóng góp của các nguồn năng lượng trong tổng sản lượng điện quốc gia, loại biểu đồ nào thích hợp nhất?",
          "options": [
            "Biểu đồ đường (Line Chart)",
            "Biểu đồ tròn (Pie Chart)",
            "Biểu đồ phân tán (Scatter)",
            "Biểu đồ radar"
          ],
          "answer": 1,
          "explanation": "Biểu đồ tròn (Pie Chart) chuyên dùng để mô tả tỉ lệ cơ cấu thành phần so với tổng thể 100%."
        }
      }
    ]
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
    "description": "Sử dụng phần mềm thiết kế và biên tập trang web trực quan, thiết kế bố cục giao diện đa phương tiện, tích hợp hình ảnh lớp (Layer), video clip, đóng gói và xuất bản website lên Internet.",
    "skills": [
      "Phần mềm tạo trang web trực quan",
      "Thiết kế bố cục & Cây trang web",
      "Đồ họa đa phương tiện & Video cho Web",
      "Kiểm thử & Xuất bản Website"
    ],
    "xp": 380,
    "lessons": [
      {
        "id": "ict_sw_1",
        "title": "Bài 1: Cây cấu trúc Website & Phần mềm tạo trang Web",
        "bookRef": "Tài liệu ôn tập Tin 12 — Chủ đề ICT 2 (Trang 122)",
        "priority": "Cực kỳ cao",
        "examFormat": "Trọng tâm Phần II Đúng/Sai",
        "summary": "Cây thư mục trang web (root, css/, images/, js/), đường dẫn tương đối (./, ../) và quy trình đưa website lên Hosting/Server.",
        "theory": {
          "objectives": [
            "Biết cách tham chiếu đường dẫn ../ để quay lại thư mục cha.",
            "Tệp trang chủ mặc định trên máy chủ luôn đặt tên là index.html."
          ],
          "contentSections": [],
          "examTips": "⚠️ Bẫy tên tệp trang chủ: Tệp trang chủ mặc định luôn là index.html, không phải home.html hay default.html."
        },
        "quiz": {
          "question": "Theo chuẩn thiết kế website, tệp tin nào sau đây thường được các máy chủ web cấu hình làm trang chủ mặc định khi người dùng truy cập vào thư mục gốc?",
          "options": [
            "home.html",
            "main.html",
            "index.html",
            "default.html"
          ],
          "answer": 2,
          "explanation": "index.html là tên tệp trang chủ mặc định chuẩn của hầu hết các web server."
        }
      },
      {
        "id": "ict_sw_2",
        "title": "Bài 2: Chỉnh sửa ảnh lớp (Layer) & Đồ họa cho Web",
        "bookRef": "Tài liệu ôn tập Tin 12 — Chủ đề ICT 2 (Trang 125)",
        "priority": "Cực kỳ cao",
        "examFormat": "Trắc nghiệm Phần I & II",
        "summary": "Khái niệm Lớp (Layer), vùng chọn (Selection), chỉnh độ sáng tối, xóa phông nền và xuất ảnh định dạng JPG/PNG.",
        "theory": {
          "objectives": [
            "Hiểu nguyên lý xếp chồng các layer trong phần mềm đồ họa (GIMP, Photoshop).",
            "Phân biệt định dạng PNG (hỗ trợ nền trong suốt) vs JPG (nén mất dữ liệu)."
          ],
          "contentSections": [],
          "examTips": "⚠️ Bẫy định dạng ảnh: Muốn lưu ảnh có nền trong suốt (không có phông nền trắng) thì BẮT BUỘC phải xuất ra định dạng PNG hoặc GIF, định dạng JPG không hỗ trợ nền trong suốt."
        },
        "quiz": {
          "question": "Định dạng hình ảnh nào sau đây hỗ trợ kênh độ trong suốt (Transparency), rất thích hợp để xuất logo chèn lên trang web?",
          "options": [
            "BMP",
            "JPG",
            "PNG",
            "TIFF"
          ],
          "answer": 2,
          "explanation": "Định dạng PNG hỗ trợ kênh Alpha (nền trong suốt), rất tối ưu cho các thành phần đồ họa web."
        }
      },
      {
        "id": "ict_sw_3",
        "title": "Bài 3: Biên tập & Chèn Video clip vào trang Web",
        "bookRef": "Tài liệu ôn tập Tin 12 — Chủ đề ICT 2 (Trang 128)",
        "priority": "Cao",
        "examFormat": "Trắc nghiệm Phần I",
        "summary": "Dòng thời gian (Timeline), kỹ thuật cắt ghép (Cut/Split), hiệu ứng chuyển cảnh (Transition) và xuất video định dạng MP4.",
        "theory": {
          "objectives": [
            "Nắm các thao tác cơ bản trên thanh dòng thời gian Timeline của phần mềm biên tập video.",
            "Hiểu vai trò của hiệu ứng chuyển cảnh Transition và chèn phụ đề, âm thanh nền."
          ],
          "contentSections": [],
          "examTips": "⚠️ Lưu ý trắc nghiệm: MP4 là định dạng video phổ biến nhất, tương thích tốt với mọi trình duyệt web và thiết bị di động."
        },
        "quiz": {
          "question": "Trong phần mềm dựng video, thành phần nào là nơi người biên tập sắp xếp các đoạn phim, âm thanh và hiệu ứng theo trình tự thời gian?",
          "options": [
            "Hộp công cụ ToolBox",
            "Dòng thời gian (Timeline)",
            "Cửa sổ Preview",
            "Bảng thuộc tính Properties"
          ],
          "answer": 1,
          "explanation": "Timeline (Dòng thời gian) là không gian làm việc chính để sắp đặt các track hình ảnh và âm thanh nối tiếp nhau."
        }
      }
    ]
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
    "description": "Bảng năng lực và cấp độ tư duy đề ôn tập (Nhận biết, Thông hiểu, Vận dụng), chiến thuật phân bổ 50 phút cho 22 câu thi và các bộ đề ôn tập chuẩn cấu trúc đề thi Tốt nghiệp THPT Bộ GD&ĐT.",
    "skills": [
      "Ma trận năng lực & Cấp độ tư duy",
      "Chiến thuật xử lý câu Đúng/Sai lũy tiến",
      "Phân bổ thời gian 50 phút tối ưu",
      "Luyện đề thi thử bứt phá 9.5+ ICT"
    ],
    "xp": 500,
    "lessons": [
      {
        "id": "ict_exam_matrix",
        "title": "Bài 1: Bảng năng lực và cấp độ tư duy đề ôn tập",
        "bookRef": "Tài liệu ôn tập Tin 12 — Phần II (Trang 131)",
        "priority": "Cực kỳ quan trọng",
        "examFormat": "Cấu trúc ma trận đề thi 2025",
        "summary": "Phân tích bảng năng lực Tin học định hướng Tin học ứng dụng (ICT), tỷ lệ câu hỏi Nhận biết (40%), Thông hiểu (30%), Vận dụng (30%), chiến thuật 18 câu trắc nghiệm và 4 câu Đúng/Sai.",
        "theory": {
          "objectives": [
            "Nắm vững 3 cấp độ tư duy: Nhận biết, Thông hiểu và Vận dụng trong đề thi Tin học ứng dụng THPTQG.",
            "Quy tắc chấm điểm lũy tiến Phần II Đúng/Sai: 0.1đ, 0.25đ, 0.5đ và 1.0đ cho mỗi câu 4 ý.",
            "Xác định trọng tâm kiến thức: Chủ đề 1 đến 6 (Phần I) và Chủ đề ICT 1, ICT 2 (Phần II)."
          ],
          "contentSections": [],
          "examTips": "🎯 Mẹo chiến thuật: Phần I gồm 18 câu trắc nghiệm (4.5 điểm), giải quyết nhanh và chắc chắn. Dành thời gian suy luận kỹ cho câu hỏi bảng tính Excel, CSDL và Web ở Phần II."
        },
        "quiz": {
          "question": "Trong đề thi Tốt nghiệp THPT môn Tin học (định hướng ICT), Phần I có tổng cộng bao nhiêu câu hỏi?",
          "options": [
            "12 câu hỏi trắc nghiệm.",
            "18 câu hỏi trắc nghiệm 4 lựa chọn (chọn 1 đáp án đúng).",
            "20 câu hỏi trắc nghiệm.",
            "24 câu hỏi trắc nghiệm."
          ],
          "answer": 1,
          "explanation": "Phần I đề thi Tin học gồm 18 câu hỏi trắc nghiệm 4 lựa chọn (mỗi câu 0.25 điểm, tổng 4.5 điểm)."
        }
      },
      {
        "id": "ict_exam_strategy",
        "title": "Bài 2: Các đề ôn tập & Chiến thuật làm bài thi",
        "bookRef": "Tài liệu ôn tập Tin 12 — Phần II (Trang 132)",
        "priority": "Cực kỳ cao",
        "examFormat": "Toàn bộ đề thi",
        "summary": "Mẹo tối ưu điểm số lũy tiến Phần II, cách kiểm tra công thức Excel và cú pháp thẻ HTML/CSS mà không được dùng máy tính trong phòng thi.",
        "theory": {
          "objectives": [
            "Nắm chắc thang điểm lũy tiến Phần II: Đúng 1 ý = 0.1đ; 2 ý = 0.25đ; 3 ý = 0.5đ; 4 ý = 1.0đ.",
            "Luyện phản xạ đọc nhanh cú pháp lệnh trên giấy thi."
          ],
          "contentSections": [],
          "examTips": "⚠️ Mẹo tối ưu điểm lũy tiến: Trong Phần II, cố gắng phán đoán chính xác cả 4 ý a, b, c, d của từng câu để nhận trọn vẹn 1.0 điểm/câu, thay vì làm rời rạc mỗi câu 1 ý chỉ được 0.1đ."
        },
        "quiz": {
          "question": "Trong cấu trúc đề thi THPTQG môn Tin học, nếu thí sinh trả lời đúng được 3 trên 4 ý trong một câu hỏi Đúng/Sai (Phần II), thí sinh sẽ nhận được bao nhiêu điểm cho câu đó?",
          "options": [
            "0.25 điểm",
            "0.5 điểm",
            "0.75 điểm",
            "1.0 điểm"
          ],
          "answer": 1,
          "explanation": "Theo thang điểm lũy tiến chính thức của Bộ GD&ĐT: Đúng 1 ý = 0.1đ; Đúng 2 ý = 0.25đ; Đúng 3 ý = 0.5đ; Đúng cả 4 ý = 1.0đ."
        }
      }
    ]
  }
];
