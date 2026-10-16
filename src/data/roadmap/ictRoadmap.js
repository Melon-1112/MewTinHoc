/**
 * ==============================================================================
 * HƯỚNG DẪN CẤU HÌNH & CHỈNH SỬA DỮ LIỆU LÝ THUYẾT (DÀNH CHO QUẢN TRỊ VIÊN)
 * ==============================================================================
 * File này chứa toàn bộ dữ liệu Lộ trình & Lý thuyết của phân ban:
 * TIN HỌC ỨNG DỤNG (ICT / THUD) - Chuẩn GDPT 2018 & THPTQG 2025-2026.
 *
 * CÁCH THAY ĐỔI DỮ LIỆU BÀI HỌC:
 * 1. Muốn sửa tên bài, số trang SGK, mức độ ưu tiên: Tìm tới `ictRoadmapStations` -> chọn Chặng (station) -> sửa trong mảng `lessons`.
 * 2. Muốn sửa nội dung lý thuyết bài học: Sửa trong thuộc tính `theory` của bài đó:
 *    - `objectives`: Danh sách các mục tiêu kiến thức.
 *    - `contentSections`: Các phần lý thuyết (gồm heading, text, bulletPoints).
 *    - `codeSnippet`: Đoạn công thức/mã nguồn minh họa (Excel/HTML/CSS...), để trống nếu không có.
 *    - `examTips`: Mẹo thi & cạm bẫy hay gặp trong đề thi THPTQG.
 *    - `quiz`: Câu hỏi trắc nghiệm phản xạ nhanh của bài.
 * ==============================================================================
 */

export const ICT_EXAM_STRUCTURE = {
  title: 'Cấu Trúc Đề Thi THPTQG Môn Tin Học — Định Hướng Tin Học Ứng Dụng (ICT)',
  duration: '50 phút',
  totalQuestions: '22 câu hỏi',
  parts: [
    {
      part: 'Phần I',
      format: '18 câu trắc nghiệm 4 lựa chọn (Câu 1 đến 18)',
      focus: 'Lý thuyết nền tảng dùng chung (Chủ đề A, B, D, G) + Bảng tính Excel cơ bản + Khái niệm phần mềm ứng dụng',
      points: '4.5 điểm (0.25đ / câu)'
    },
    {
      part: 'Phần II',
      format: '4 câu trắc nghiệm Đúng/Sai (Câu 1 đến 4, mỗi câu 4 lệnh a, b, c, d)',
      focus: 'Chuyên sâu ICT (Câu 3 & 4): Kịch bản Bảng tính Excel nâng cao, Thiết kế trang web HTML/CSS, Đồ họa & Biên tập Video',
      points: '4.0 điểm (Lũy tiến max 1.0đ / câu)'
    }
  ]
};

export const ICT_12_WEEK_PLAN = [
  {
    phase: 'Giai đoạn 1',
    weeks: 'Tuần 1 - 4',
    title: 'Nắm chắc Lý thuyết & Câu hỏi Phần I',
    targetScore: '4.5 - 5.0 điểm nền tảng',
    content: 'Học thuộc các khái niệm cơ bản thuộc Chủ đề A, B, D, G và các thao tác Excel/Nhiệm vụ ứng dụng cơ bản để đạt trọn vẹn 4.5 điểm trắc nghiệm Phần I.'
  },
  {
    phase: 'Giai đoạn 2',
    weeks: 'Tuần 5 - 9',
    title: 'Luyện kỹ Kịch bản Excel & Mã nguồn HTML/CSS',
    targetScore: '7.5 - 8.5 điểm',
    content: 'Giải các bài tập trắc nghiệm Đúng/Sai liên quan đến Bảng tính Excel (cú pháp hàm IF, VLOOKUP, SUMIF, Pivot Table) và đọc hiểu cấu trúc thẻ HTML/CSS trong thiết kế Website.'
  },
  {
    phase: 'Giai đoạn 3',
    weeks: 'Tuần 10 - 12',
    title: 'Luyện đề tổng hợp & Tối ưu kỹ năng làm bài Đúng/Sai',
    targetScore: '9.0 - 10.0 điểm tuyệt đối',
    content: 'Thực hành đề thi thử 50 phút. Rèn luyện tư duy phân tích từng lệnh a, b, c, d trong các kịch bản ứng dụng thực tế để đạt tối đa 1.0 điểm cho mỗi câu hỏi Phần II.'
  }
];

export const ictRoadmapStations = [
  {
    id: 'ict_station_1',
    stepNumber: '01',
    code: 'Chủ đề A',
    title: 'Máy Tính & Xã Hội Tri Thức',
    category: 'Lý thuyết nền tảng',
    priority: 'Trung bình',
    priorityBadge: 'normal',
    questionType: 'Trắc nghiệm Phần I (2 - 3 câu)',
    description: 'Phần cứng thiết bị số, Phần mềm ứng dụng văn phòng, Hệ điều hành di động/PC, Ứng dụng thực tế của AI trong công việc.',
    skills: ['Thiết bị số thông minh', 'Hệ điều hành di động/PC', 'Phần mềm văn phòng', 'Ứng dụng AI đời sống'],
    xp: 250,
    lessons: [
      {
        id: 'ict_a_1',
        title: 'Bài 1: Thiết bị số & Môi trường làm việc số',
        bookRef: 'SGK Tin 11 - Trang 5',
        priority: 'Trung bình',
        examFormat: 'Trắc nghiệm Phần I',
        summary: 'Các loại thiết bị số cá nhân, thiết bị thông minh (IoT), môi trường làm việc kỹ thuật số và an toàn lao động số.',
        theory: {
          objectives: [
            'Nhận biết các loại thiết bị số và vai trò trong môi trường làm việc hiện đại.',
            'Hiểu các cổng kết nối phổ biến: USB Type-C, HDMI, Thunderbolt, Bluetooth.'
          ],
          contentSections: [
            {
              heading: '1. Thiết bị số & Cổng giao tiếp phổ biến',
              bulletPoints: [
                'USB (Universal Serial Bus): Chuẩn kết nối truyền dữ liệu và cấp nguồn thông dụng nhất (hiện nay phổ biến USB-C với tốc độ cao và đảo chiều cắm).',
                'HDMI & DisplayPort: Cổng truyền tải hình ảnh và âm thanh kỹ thuật số độ nét cao đến màn hình, máy chiếu.',
                'Bluetooth & Wi-Fi: Chuẩn kết nối không dây tầm ngắn và tầm trung.'
              ]
            }
          ],
          examTips: 'Cổng HDMI truyền cả âm thanh và hình ảnh số, khác với chuẩn VGA cũ chỉ truyền tín hiệu hình ảnh tương tự (Analog).'
        },
        quiz: {
          question: 'Chuẩn giao tiếp nào sau đây có khả năng truyền tải đồng thời cả tín hiệu hình ảnh và âm thanh kỹ thuật số chất lượng cao?',
          options: ['VGA', 'DVI-A', 'HDMI', 'PS/2'],
          answer: 2,
          explanation: 'HDMI (High-Definition Multimedia Interface) hỗ trợ truyền tải đồng thời cả video và audio kỹ thuật số chất lượng cao.'
        }
      },
      {
        id: 'ict_a_2',
        title: 'Bài 2: Hệ điều hành thông dụng & Phần mềm',
        bookRef: 'SGK Tin 11 - Trang 12',
        priority: 'Trung bình',
        examFormat: 'Trắc nghiệm Phần I',
        summary: 'Hệ điều hành di động (Android, iOS), HĐH máy tính (Windows, macOS, Linux), phân loại phần mềm ứng dụng.',
        theory: {
          objectives: [
            'Phân biệt hệ điều hành dành cho thiết bị di động và máy tính.',
            'Nắm các bộ phần mềm văn phòng thông dụng (Microsoft Office, Google Workspace, LibreOffice).'
          ]
        },
        quiz: {
          question: 'Hệ điều hành di động nào sau đây phát triển dựa trên nhân Linux và có tính chất mã nguồn mở?',
          options: ['Apple iOS', 'Google Android', 'Windows Phone', 'BlackBerry OS'],
          answer: 1,
          explanation: 'Android là hệ điều hành di động được xây dựng dựa trên nhân Linux và được Google duy trì theo giấy phép nguồn mở.'
        }
      },
      {
        id: 'ict_a_3',
        title: 'Bài 1: Khái niệm & Ứng dụng thực tế của AI',
        bookRef: 'SGK Tin 12 - Trang 5',
        priority: 'Trung bình',
        examFormat: 'Trắc nghiệm Phần I',
        summary: 'Trợ lý ảo (Siri, Google Assistant), Nhận dạng khuôn mặt (FaceID), Chatbot chăm sóc khách hàng tự động.',
        theory: {
          objectives: [
            'Hiểu cách thức các ứng dụng AI hỗ trợ tự động hóa đời sống và dịch vụ.',
            'Nhận biết công nghệ thị giác máy tính và xử lý ngôn ngữ tự nhiên.'
          ]
        },
        quiz: {
          question: 'Tính năng mở khóa điện thoại bằng khuôn mặt (FaceID) ứng dụng công nghệ then chốt nào của Trí tuệ nhân tạo?',
          options: ['Thị giác máy tính (Computer Vision)', 'Xử lý âm thanh tương tự', 'Biên dịch mã nguồn', 'Nén dữ liệu mất thông tin'],
          answer: 0,
          explanation: 'Nhận dạng khuôn mặt là ứng dụng điển hình của Thị giác máy tính (Computer Vision).'
        }
      },
      {
        id: 'ict_a_4',
        title: 'Bài 2: AI trong đời sống xã hội & Công việc số',
        bookRef: 'SGK Tin 12 - Trang 10',
        priority: 'Trung bình',
        examFormat: 'Trắc nghiệm Phần I',
        summary: 'Tác động của AI đối với việc làm số, các công cụ sinh văn bản/hình ảnh tự động, trách nhiệm đạo đức khi dùng AI.',
        theory: {
          objectives: [
            'Nhận thức về đạo đức sử dụng AI: Tránh đạo văn, không tạo tin giả mạo (Deepfake).',
            'Sử dụng các công cụ hỗ trợ công việc một cách thông minh và có trách nhiệm.'
          ]
        },
        quiz: {
          question: 'Hành vi nào sau đây vi phạm chuẩn mực đạo đức khi sử dụng công cụ AI tạo sinh?',
          options: [
            'Dùng AI để dịch một đoạn văn bản tiếng Anh sang tiếng Việt để tham khảo',
            'Sử dụng công cụ AI tạo video Deepfake giả mạo khuôn mặt người khác nhằm lừa đảo chiếm đoạt tài sản',
            'Nhờ AI gợi ý ý tưởng đề cương ôn tập môn học',
            'Dùng AI tạo ảnh minh họa cho bài thuyết trình cá nhân'
          ],
          answer: 1,
          explanation: 'Tạo video Deepfake giả mạo danh tính để lừa đảo là hành vi vi phạm pháp luật và đạo đức nghiêm trọng.'
        }
      }
    ]
  },
  {
    id: 'ict_station_2',
    stepNumber: '02',
    code: 'Chủ đề B',
    title: 'Mạng Máy Tính & Internet',
    category: 'Mạng nội bộ & Dịch vụ số',
    priority: 'Trung bình',
    priorityBadge: 'normal',
    questionType: 'Trắc nghiệm Phần I (2 câu)',
    description: 'Mạng cục bộ LAN, chức năng Router/Switch/AP, cách chia sẻ tài nguyên mạng, các dịch vụ lưu trữ đám mây Google Drive, OneDrive.',
    skills: ['Chia sẻ tài nguyên LAN', 'Router & Switch & AP', 'Lưu trữ Google Drive', 'Cộng tác đám mây'],
    xp: 280,
    lessons: [
      {
        id: 'ict_b_1',
        title: 'Bài 3: Mạng cục bộ LAN & Thiết bị mạng',
        bookRef: 'SGK Tin 11 - Trang 24',
        priority: 'Trung bình',
        examFormat: 'Trắc nghiệm Phần I',
        summary: 'Mô hình kết nối LAN, chức năng của Switch, Router, Access Point và cách chia sẻ thư mục/máy in trong mạng nội bộ.',
        theory: {
          objectives: [
            'Biết các bước chia sẻ thư mục và máy in dùng chung trong mạng LAN.',
            'Nắm chắc vai trò của Switch trong việc kết nối các máy tính.'
          ]
        },
        quiz: {
          question: 'Trong mạng văn phòng, để nhiều máy tính có thể in ấn trên cùng một máy in vật lý qua mạng LAN, người quản trị cần làm gì?',
          options: [
            'Cắm dây máy in luân phiên vào từng máy tính',
            'Chia sẻ máy in (Printer Sharing) trên mạng nội bộ hoặc dùng máy in có gắn card mạng LAN/Wi-Fi',
            'Cài đặt lại toàn bộ hệ điều hành',
            'Thay thế toàn bộ cáp mạng'
          ],
          answer: 1,
          explanation: 'Chia sẻ máy in trên mạng nội bộ cho phép mọi máy tính được cấp quyền trong LAN gửi lệnh in trực tiếp.'
        }
      },
      {
        id: 'ict_b_2',
        title: 'Bài 4: Khái niệm & Dịch vụ trên Internet',
        bookRef: 'SGK Tin 11 - Trang 30',
        priority: 'Trung bình',
        examFormat: 'Trắc nghiệm Phần I',
        summary: 'Các dịch vụ cốt lõi: Web (WWW), Thư điện tử (Email), Công cụ tìm kiếm (Search Engine), Hội nghị truyền hình trực tuyến.',
        theory: {
          objectives: ['Nắm các giao thức ứng dụng phổ biến: HTTP, HTTPS, FTP, SMTP, POP3/IMAP.']
        },
        quiz: {
          question: 'Giao thức nào đảm bảo truyền tải dữ liệu trang web được mã hóa an toàn giữa trình duyệt người dùng và máy chủ?',
          options: ['HTTP', 'HTTPS', 'FTP', 'Telnet'],
          answer: 1,
          explanation: 'HTTPS (Hypertext Transfer Protocol Secure) sử dụng chứng chỉ SSL/TLS để mã hóa dữ liệu truyền tải.'
        }
      },
      {
        id: 'ict_b_3',
        title: 'Bài 3: Kết nối thiết bị mạng Switch, Router, AP',
        bookRef: 'SGK Tin 12 - Trang 14',
        priority: 'Trung bình',
        examFormat: 'Trắc nghiệm Phần I',
        summary: 'Các bước thiết lập mạng nội bộ cho văn phòng nhỏ: Gắn cáp RJ45, cấu hình DHCP cấp phát IP tự động, đặt mật khẩu Wi-Fi.',
        theory: {
          objectives: ['Hiểu vai trò của giao thức DHCP trong việc tự động cấp phát địa chỉ IP cho thiết bị kết nối.']
        },
        quiz: {
          question: 'Dịch vụ mạng nào có nhiệm vụ tự động gán địa chỉ IP cho các máy tính khi kết nối vào mạng LAN?',
          options: ['DNS', 'DHCP', 'HTTP', 'SNMP'],
          answer: 1,
          explanation: 'DHCP (Dynamic Host Configuration Protocol) tự động cấu hình và cấp phát địa chỉ IP cho các thiết bị trong mạng.'
        }
      },
      {
        id: 'ict_b_4',
        title: 'Bài 4: Mạng Wi-Fi & Dịch vụ Lưu trữ đám mây',
        bookRef: 'SGK Tin 12 - Trang 20',
        priority: 'Trung bình',
        examFormat: 'Trắc nghiệm Phần I',
        summary: 'Cơ chế chia sẻ file, phân quyền (Chỉ xem, Nhận xét, Chỉnh sửa) trên Google Drive và Microsoft OneDrive.',
        theory: {
          objectives: [
            'Hiểu các mức độ phân quyền tài liệu khi chia sẻ qua đường liên kết (Link sharing).',
            'Đồng bộ hóa dữ liệu thời gian thực trên đám mây.'
          ]
        },
        quiz: {
          question: 'Khi chia sẻ tệp trên Google Drive cho người khác với quyền "Viewer" (Người xem), người được chia sẻ có thể làm gì?',
          options: [
            'Chỉnh sửa nội dung và xóa tệp vĩnh viễn',
            'Chỉ có thể xem hoặc tải tệp về, không thể sửa đổi nội dung tệp gốc',
            'Đổi quyền sở hữu tệp sang tài khoản của mình',
            'Thay đổi phân quyền của những người dùng khác'
          ],
          answer: 1,
          explanation: 'Quyền Viewer chỉ cho phép đọc dữ liệu, không có quyền chỉnh sửa tài liệu gốc của chủ sở hữu.'
        }
      }
    ]
  },
  {
    id: 'ict_station_3',
    stepNumber: '03',
    code: 'Chủ đề C (ICT)',
    title: 'Bảng Tính Excel Nâng Cao',
    category: 'TRỌNG TÂM CÂU HỎI ĐÚNG/SAI PHẦN II',
    priority: 'Cực kỳ cao',
    priorityBadge: 'extreme',
    questionType: 'Trắc nghiệm Đúng/Sai (Kịch bản Bảng tính Excel)',
    description: 'TRỌNG TÂM LỚN ĐỊNH HƯỚNG ICT! Địa chỉ ô tương đối/tuyệt đối ($A$1), Hàm logic IF, AND, OR lồng nhau, Tìm kiếm VLOOKUP/HLOOKUP, Thống kê có điều kiện SUMIF/COUNTIF, Báo cáo Pivot Table và Lọc nâng cao (Advanced Filter).',
    skills: ['Địa chỉ $A$1 vs A1', 'Hàm IF lồng AND/OR', 'VLOOKUP & HLOOKUP', 'SUMIF, COUNTIF & Pivot Table'],
    xp: 600,
    lessons: [
      {
        id: 'ict_c_1',
        title: 'Bài 5: Bảng tính Excel & Địa chỉ ô tuyệt đối/tương đối',
        bookRef: 'SGK Tin 11 - Trang 49',
        priority: 'Cực kỳ cao',
        examFormat: 'Trắc nghiệm Phần I & II',
        summary: 'Phân biệt địa chỉ tương đối (A1), tuyệt đối ($A$1) và hỗn hợp ($A1, A$1); sự biến đổi địa chỉ khi sao chép công thức.',
        theory: {
          objectives: [
            'Nắm chắc quy tắc: Dấu $ đứng trước thành phần nào thì thành phần đó CỐ ĐỊNH khi sao chép công thức.',
            'Tính toán chính xác kết quả ô tính sau khi kéo fill-handle sang dòng/cột khác.'
          ],
          contentSections: [
            {
              heading: '1. Quy tắc biến đổi địa chỉ khi sao chép',
              bulletPoints: [
                'Địa chỉ tương đối (VD: A1): Khi sao chép xuống dưới k dòng thì chỉ số dòng tăng k; sao chép sang phải m cột thì chữ cái cột tăng m.',
                'Địa chỉ tuyệt đối (VD: $A$1): Luôn giữ nguyên cột A và dòng 1 dù sao chép đi bất kỳ đâu.',
                'Địa chỉ hỗn hợp (VD: $A1 cố định cột A; A$1 cố định dòng 1).'
              ]
            }
          ],
          codeSnippet: {
            lang: 'excel',
            title: 'Ví dụ sao chép công thức kinh điển',
            code: `Giả sử ô B2 có công thức: = A1 * $C$1
Khi sao chép công thức từ B2 sang ô C3:
- A1 biến thành B2 (vì dịch sang phải 1 cột, xuống dưới 1 dòng)
- $C$1 giữ nguyên là $C$1 (do có địa chỉ tuyệt đối)
=> Công thức tại C3 sẽ là: = B2 * $C$1`
          },
          examTips: '⚠️ Bẫy đề: Đề bài cho công thức ô B2 là =$A1*B$1, hỏi khi sao chép sang C4 công thức trở thành gì? Nhớ: Cột A cố định, dòng 1 cố định!'
        },
        quiz: {
          question: 'Tại ô C2 có công thức: = $A$1 + B2. Khi sao chép công thức này sang ô D3, công thức tại ô D3 sẽ trở thành:',
          options: [
            '= $B$2 + C3',
            '= $A$1 + C3',
            '= $A$2 + B3',
            '= $A$1 + B2'
          ],
          answer: 1,
          explanation: 'Địa chỉ $A$1 giữ nguyên. Địa chỉ tương đối B2 dịch sang phải 1 cột và xuống 1 dòng nên trở thành C3. Vậy công thức là =$A$1 + C3.'
        }
      },
      {
        id: 'ict_c_2',
        title: 'Bài 6: Các hàm Logic IF, AND, OR trong Excel',
        bookRef: 'SGK Tin 11 - Trang 58',
        priority: 'Cực kỳ cao',
        examFormat: 'Trọng tâm Phần II Đúng/Sai',
        summary: 'Cú pháp hàm IF lồng nhau kết hợp AND(...), OR(...) để xếp loại học sinh, tính phụ cấp lương, tính tiền thưởng.',
        theory: {
          objectives: [
            'Cú pháp chuẩn: =IF(DieuKien, GiaTriNeuDung, GiaTriNeuSai).',
            'Biết cách lồng ghép các điều kiện logic phức hợp.'
          ],
          codeSnippet: {
            lang: 'excel',
            title: 'Hàm IF lồng AND xếp loại học sinh',
            code: `=IF(AND(D2>=8.0, E2>=8.0), "Giỏi", IF(OR(D2<5.0, E2<5.0), "Yếu", "Khá"))`
          },
          examTips: '⚠️ Hàm AND(A, B) chỉ trả về TRUE khi TẤT CẢ các điều kiện đều đúng. Hàm OR(A, B) trả về TRUE khi CHỈ CẦN ÍT NHẤT MỘT điều kiện đúng.'
        },
        quiz: {
          question: 'Công thức nào sau đây trả về "Đạt" nếu cả ĐiểmToán (ô A2) và ĐiểmTin (ô B2) đều từ 5.0 trở lên, ngược lại trả về "Không đạt"?',
          options: [
            '=IF(OR(A2>=5, B2>=5), "Đạt", "Không đạt")',
            '=IF(AND(A2>=5, B2>=5), "Đạt", "Không đạt")',
            '=IF(A2 AND B2 >= 5, "Đạt", "Không đạt")',
            '=AND(IF(A2>=5), IF(B2>=5), "Đạt")'
          ],
          answer: 1,
          explanation: 'Hàm AND kiểm tra đồng thời cả 2 điều kiện phải thỏa mãn, đặt làm đối số thứ nhất của IF.'
        }
      },
      {
        id: 'ict_c_3',
        title: 'Bài 7: Các hàm tìm kiếm VLOOKUP, HLOOKUP',
        bookRef: 'SGK Tin 11 - Trang 66',
        priority: 'Cực kỳ cao',
        examFormat: 'Trọng tâm Phần II Đúng/Sai',
        summary: 'Cú pháp VLOOKUP(Lookup_value, Table_array, Col_index_num, [Range_lookup]) và HLOOKUP theo hàng.',
        theory: {
          objectives: [
            'Hiểu rõ 4 đối số của hàm VLOOKUP.',
            'Nắm chắc tham số tìm kiếm chính xác (0 hoặc FALSE).'
          ],
          contentSections: [
            {
              heading: '1. Cấu trúc hàm VLOOKUP',
              bulletPoints: [
                'Lookup_value: Giá trị đem đi tìm kiếm (nằm ở cột đầu tiên của bảng phụ).',
                'Table_array: Bảng phụ chứa dữ liệu cần tra cứu (thường cố định bằng dấu $).',
                'Col_index_num: Số thứ tự cột cần lấy giá trị (tính từ 1 ở cột đầu tiên bảng phụ).',
                'Range_lookup: Nhận giá trị 0 (FALSE) để tìm kiếm chính xác 100%.'
              ]
            }
          ],
          codeSnippet: {
            lang: 'excel',
            title: 'Ví dụ tra cứu đơn giá sản phẩm',
            code: `=VLOOKUP(B2, $F$2:$H$10, 3, 0)`
          },
          examTips: '⚠️ Cột đầu tiên của Table_array BẮT BUỘC phải chứa giá trị cần tìm kiếm (Lookup_value). Nếu không sẽ trả về lỗi #N/A.'
        },
        quiz: {
          question: 'Trong hàm =VLOOKUP(A2, $D$2:$G$10, 3, FALSE), số 3 biểu thị điều gì?',
          options: [
            'Lấy giá trị tại dòng thứ 3 của bảng tra cứu',
            'Lấy giá trị tại cột thứ 3 tính từ cột bên trái của vùng dữ liệu $D$2:$G$10 (tức cột F)',
            'Tìm kiếm lặp lại 3 lần',
            'Bỏ qua 3 dòng đầu tiên của bảng'
          ],
          answer: 1,
          explanation: 'Col_index_num = 3 quy định việc lấy kết quả từ cột thứ 3 tính từ cột bắt đầu D của vùng tra cứu.'
        }
      },
      {
        id: 'ict_c_4',
        title: 'Bài 8: Hàm thống kê điều kiện SUMIF, COUNTIF',
        bookRef: 'SGK Tin 11 - Trang 75',
        priority: 'Cực kỳ cao',
        examFormat: 'Trọng tâm Phần II Đúng/Sai',
        summary: 'SUMIF(Range, Criteria, [Sum_range]), COUNTIF(Range, Criteria) và các ký tự đại diện (*, ?).',
        theory: {
          objectives: [
            'Phân biệt: COUNTIF chỉ đếm số lượng ô thỏa mãn; SUMIF tính tổng các ô tương ứng.',
            'Cú pháp điều kiện dạng chuỗi: ">50", "<=100", "Lớp 12A*".'
          ],
          codeSnippet: {
            lang: 'excel',
            title: 'Công thức thống kê điều kiện',
            code: `# Đếm số học sinh xếp loại Giỏi ở cột D:
=COUNTIF(D2:D50, "Giỏi")
# Tính tổng học bổng (cột E) cho học sinh lớp 12A1 (cột C):
=SUMIF(C2:C50, "12A1", E2:E50)`
          }
        },
        quiz: {
          question: 'Công thức nào dùng để tính tổng doanh thu (cột C từ C2 đến C20) của những đơn hàng thuộc mặt hàng "Bút bi" (cột B từ B2 đến B20)?',
          options: [
            '=COUNTIF(B2:B20, "Bút bi", C2:C20)',
            '=SUMIF(B2:B20, "Bút bi", C2:C20)',
            '=SUM(B2:B20="Bút bi", C2:C20)',
            '=TOTALIF(B2:B20, "Bút bi", C2:C20)'
          ],
          answer: 1,
          explanation: 'Cú pháp chuẩn của hàm tính tổng có điều kiện: =SUMIF(vùng_điều_kiện, "tiêu_chí", vùng_tính_tổng).'
        }
      },
      {
        id: 'ict_c_5',
        title: 'Bài 9: Kỹ thuật Pivot Table & Báo cáo thống kê',
        bookRef: 'SGK Tin 11 - Trang 84',
        priority: 'Cực kỳ cao',
        examFormat: 'Trọng tâm Phần II Đúng/Sai',
        summary: 'Kéo thả các trường dữ liệu vào Rows, Columns, Values, Filters để tổng hợp báo cáo đa chiều mà không cần viết công thức phức tạp.',
        theory: {
          objectives: [
            'Đọc hiểu cấu trúc một bảng báo cáo Pivot Table trong đề thi.',
            'Xác định trường nào đặt ở Rows, Columns và cách hàm tổng hợp (Sum of, Count of) hoạt động.'
          ]
        },
        quiz: {
          question: 'Trong công cụ Pivot Table của Excel, khu vực "Values" dùng để chứa trường dữ liệu nào?',
          options: [
            'Chứa trường để lọc dữ liệu cho toàn bộ bảng báo cáo',
            'Chứa trường dùng làm tiêu đề dòng',
            'Chứa trường dữ liệu cần thực hiện tính toán thống kê (như tính tổng SUM, đếm COUNT, trung bình AVERAGE)',
            'Chứa tiêu đề cột của bảng'
          ],
          answer: 2,
          explanation: 'Vùng Values là nơi chứa các giá trị số cần tổng hợp, áp dụng các hàm như Sum, Count, Average.'
        }
      },
      {
        id: 'ict_c_6',
        title: 'Bài 10: Biểu đồ & Lọc dữ liệu Advanced Filter',
        bookRef: 'SGK Tin 11 - Trang 92',
        priority: 'Cực kỳ cao',
        examFormat: 'Trắc nghiệm Phần I & II',
        summary: 'Vẽ biểu đồ cột, tròn; Thiết lập vùng tiêu chí (Criteria Range) để lọc nâng cao với điều kiện AND (cùng dòng) và OR (khác dòng).',
        theory: {
          objectives: [
            'Hiểu quy tắc thiết lập bảng Criteria Range trong Advanced Filter.',
            'Điều kiện viết trên CÙNG MỘT DÒNG tương ứng phép AND; viết trên CÁC DÒNG KHÁC NHAU tương ứng phép OR.'
          ]
        },
        quiz: {
          question: 'Trong tính năng lọc nâng cao (Advanced Filter), khi các tiêu chí điều kiện được đặt trên CÙNG MỘT HÀNG ngang trong vùng tiêu chuẩn, chúng liên kết với nhau bằng phép toán logic nào?',
          options: ['Phép toán HOẶC (OR)', 'Phép toán VÀ (AND)', 'Phép toán PHỦ ĐỊNH (NOT)', 'Phép toán LOẠI TRỪ (XOR)'],
          answer: 1,
          explanation: 'Trên cùng một hàng ngang biểu thị điều kiện đồng thời thỏa mãn (AND). Khác hàng biểu thị điều kiện HOẶC (OR).'
        }
      }
    ]
  },
  {
    id: 'ict_station_4',
    stepNumber: '04',
    code: 'Chủ đề D',
    title: 'Đạo Đức, Pháp Luật & Văn Hóa Số',
    category: 'Văn hóa & Pháp luật số',
    priority: 'Trung bình',
    priorityBadge: 'normal',
    questionType: 'Trắc nghiệm Phần I (1 - 2 câu)',
    description: 'Quy định bản quyền phần mềm, Tác quyền số, Giấy phép Creative Commons (CC), Luật An ninh mạng, Bảo vệ thông tin cá nhân trên mạng xã hội.',
    skills: ['Bản quyền & Tác quyền số', 'Giấy phép Creative Commons', 'Luật An ninh mạng', 'Văn hóa mạng xã hội'],
    xp: 220,
    lessons: [
      {
        id: 'ict_d_1',
        title: 'Bài 11: Bản quyền phần mềm & Tác quyền số',
        bookRef: 'SGK Tin 11 - Trang 38',
        priority: 'Trung bình',
        examFormat: 'Trắc nghiệm Phần I',
        summary: 'Các loại giấy phép Creative Commons (CC), quyền tác giả đối với hình ảnh, video số trên Internet.',
        theory: {
          objectives: ['Nhận biết các hành vi vi phạm tác quyền khi sử dụng tài nguyên số tải từ Internet.']
        },
        quiz: {
          question: 'Khi sử dụng một hình ảnh tải trên mạng có giấy phép "CC BY-SA", người sử dụng bắt buộc phải tuân thủ điều kiện gì?',
          options: [
            'Không được phép sử dụng trong bất kỳ trường hợp nào',
            'Ghi nhận công lao tác giả gốc (BY) và chia sẻ tác phẩm phái sinh theo giấy phép tương tự (SA)',
            'Phải trả phí bản quyền bằng tiền mặt cho tác giả',
            'Chỉ được dùng cho các tổ chức phi chính phủ'
          ],
          answer: 1,
          explanation: 'CC BY-SA yêu cầu ghi nhận tác giả (BY) và phát hành tác phẩm sửa đổi cùng giấy phép tương tự (Share-Alike).'
        }
      },
      {
        id: 'ict_d_2',
        title: 'Bài 5: An toàn thông tin & Văn hóa mạng',
        bookRef: 'SGK Tin 12 - Trang 34',
        priority: 'Trung bình',
        examFormat: 'Trắc nghiệm Phần I',
        summary: 'Bảo vệ mật khẩu, phòng chống lừa đảo mạo danh trên mạng xã hội, văn hóa ứng xử văn minh trên không gian số.',
        theory: {
          objectives: ['Quy tắc bảo mật thông tin tài khoản cá nhân và phòng tránh bẫy mã độc.']
        },
        quiz: {
          question: 'Để bảo vệ tài khoản mạng xã hội cá nhân khỏi nguy cơ bị chiếm đoạt, biện pháp nào sau đây là hiệu quả nhất?',
          options: [
            'Đặt mật khẩu ngắn dễ nhớ như 123456',
            'Bật tính năng xác thực hai yếu tố (2FA) và không nhấp vào liên kết lạ nghi ngờ giả mạo',
            'Dùng chung một mật khẩu cho mọi trang web và tài khoản ngân hàng',
            'Chia sẻ thông tin đăng nhập cho bạn bè cùng quản lý'
          ],
          answer: 1,
          explanation: 'Bật xác thực 2 yếu tố (2FA) ngăn chặn kẻ xấu đăng nhập ngay cả khi bị lộ mật khẩu.'
        }
      }
    ]
  },
  {
    id: 'ict_station_5',
    stepNumber: '05',
    code: 'Chủ đề E (ICT)',
    title: 'Thiết Kế Web (HTML/CSS) & Đồ Họa Đa Phương Tiện',
    category: 'TRỌNG TÂM LỚN NHẤT PHẦN II ĐỊNH HƯỚNG ICT',
    priority: 'Cực kỳ cao',
    priorityBadge: 'extreme',
    questionType: 'Trắc nghiệm Đúng/Sai (Câu 3 & 4 Phần II)',
    description: 'TRỌNG TÂM CAO NHẤT ĐỊNH HƯỚNG ICT! Cấu trúc thẻ HTML (table, tr, td, form, input, link a), Ngôn ngữ CSS (color, font, margin, padding), Cây thư mục website & Xuất bản Hosting, Kỹ thuật cắt ảnh lớp Layer & Biên tập Video clip.',
    skills: ['Thẻ HTML & Form nhập liệu', 'Bảng Table (rowspan, colspan)', 'Thuộc tính CSS & Box Model', 'Biên tập Video & Layer ảnh'],
    xp: 650,
    lessons: [
      {
        id: 'ict_e_1',
        title: 'Bài 12: Giới thiệu HTML & Cấu trúc trang Web',
        bookRef: 'SGK Tin 12 ICT - Trang 39',
        priority: 'Cực kỳ cao',
        examFormat: 'Trọng tâm Phần II Đúng/Sai',
        summary: 'Cấu trúc tài liệu chuẩn: <!DOCTYPE html>, <html>, <head>, <title>, <body>; sự khác biệt giữa phần tử khối và nội dòng.',
        theory: {
          objectives: [
            'Nhận biết cấu trúc khung xương của một tệp HTML chuẩn.',
            'Phân biệt thông tin trong thẻ <head> (không hiển thị trực tiếp) và nội dung trong <body> (hiển thị cho người dùng).'
          ],
          codeSnippet: {
            lang: 'html',
            title: 'Cấu trúc tài liệu HTML chuẩn đề thi',
            code: `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Website Ôn Thi Tin Học</title>
</head>
<body>
    <h1>Chào mừng bạn đến với TinHocPro</h1>
    <p>Nền tảng luyện thi chuẩn Bộ GD&ĐT.</p>
</body>
</html>`
          }
        },
        quiz: {
          question: 'Phần tử nào trong tài liệu HTML chứa nội dung sẽ được hiển thị trực tiếp lên vùng hiển thị của trình duyệt web?',
          options: ['<head>', '<body>', '<title>', '<meta>'],
          answer: 1,
          explanation: 'Thẻ <body> chứa toàn bộ các văn bản, hình ảnh, liên kết và thành phần đồ họa hiển thị trên trang web.'
        }
      },
      {
        id: 'ict_e_2',
        title: 'Bài 13: Các thẻ định dạng văn bản & Thẻ ảnh',
        bookRef: 'SGK Tin 12 ICT - Trang 48',
        priority: 'Cực kỳ cao',
        examFormat: 'Trọng tâm Phần II Đúng/Sai',
        summary: 'Các thẻ tiêu đề <h1> đến <h6>, thẻ đoạn văn <p>, in đậm <b>, in nghiêng <i>; thẻ chèn ảnh <img src="..." alt="...">.',
        theory: {
          objectives: [
            'Nắm các thuộc tính bắt buộc của thẻ ảnh <img>: src (nguồn ảnh) và alt (văn bản thay thế).',
            'Lưu ý thẻ <img> là thẻ đơn (thẻ rỗng - không có thẻ đóng </img>).'
          ]
        },
        quiz: {
          question: 'Cú pháp chèn hình ảnh nào sau đây là ĐÚNG trong chuẩn ngôn ngữ HTML?',
          options: [
            '<image src="logo.png" alt="Logo">',
            '<img src="logo.png" alt="Logo" />',
            '<img href="logo.png" title="Logo"></img>',
            '<picture url="logo.png">'
          ],
          answer: 1,
          explanation: 'Thẻ HTML chuẩn là <img> với thuộc tính bắt buộc src chỉ định đường dẫn hình ảnh.'
        }
      },
      {
        id: 'ict_e_3',
        title: 'Bài 14: Thẻ tạo Bảng Table & Form nhập liệu',
        bookRef: 'SGK Tin 12 ICT - Trang 58',
        priority: 'Cực kỳ cao',
        examFormat: 'Trọng tâm Phần II Đúng/Sai',
        summary: 'Thẻ <table>, <tr> (dòng), <th> (tiêu đề cột), <td> (ô dữ liệu); Thuộc tính gộp ô rowspan, colspan; Thẻ <form>, <input type="text|password|radio|checkbox|submit">.',
        theory: {
          objectives: [
            'Phân biệt: rowspan gộp nhiều dòng; colspan gộp nhiều cột.',
            'Đọc hiểu và truy vết chính xác các trường trong biểu mẫu form nhập liệu.'
          ],
          codeSnippet: {
            lang: 'html',
            title: 'Mẫu Bảng và Form chuẩn đề thi Đúng/Sai',
            code: `<table border="1">
    <tr>
        <th colspan="2">Thông tin học sinh</th>
    </tr>
    <tr>
        <td>Họ và tên:</td>
        <td><input type="text" name="hoten" /></td>
    </tr>
</table>`
          },
          examTips: '⚠️ Bẫy đề Đúng/Sai: "colspan=2 gộp 2 dòng lại với nhau" -> SAI hoàn toàn! (colspan là gộp 2 CỘT, rowspan mới là gộp DÒNG).'
        },
        quiz: {
          question: 'Để gộp 3 ô trên cùng một HÀNG ngang thành một ô duy nhất trong bảng HTML, ta dùng thuộc tính nào cho thẻ <td> hoặc <th>?',
          options: ['rowspan="3"', 'colspan="3"', 'mergerow="3"', 'span="3"'],
          answer: 1,
          explanation: 'Thuộc tính colspan (Column Span) dùng để gộp các ô theo chiều ngang của các cột.'
        }
      },
      {
        id: 'ict_e_4',
        title: 'Bài 15: Thẻ liên kết a & Danh sách ul, ol',
        bookRef: 'SGK Tin 12 ICT - Trang 68',
        priority: 'Cực kỳ cao',
        examFormat: 'Trọng tâm Phần II Đúng/Sai',
        summary: 'Thẻ tạo siêu liên kết <a href="..." target="_blank">; Danh sách không có thứ tự <ul><li> và danh sách có thứ tự <ol><li>.',
        theory: {
          objectives: [
            'Thuộc tính href chỉ định địa chỉ liên kết đích.',
            'Thuộc tính target="_blank" mở liên kết trong một tab/cửa sổ mới.'
          ]
        },
        quiz: {
          question: 'Thuộc tính nào của thẻ <a> quy định việc mở trang web liên kết trong một tab trình duyệt mới?',
          options: ['target="_blank"', 'target="_self"', 'window="new"', 'href="_new"'],
          answer: 0,
          explanation: 'Thuộc tính target="_blank" điều khiển trình duyệt mở liên kết ở một tab hoặc cửa sổ mới.'
        }
      },
      {
        id: 'ict_e_5',
        title: 'Bài 16: Ngôn ngữ CSS & Nhúng CSS vào HTML',
        bookRef: 'SGK Tin 12 ICT - Trang 78',
        priority: 'Cực kỳ cao',
        examFormat: 'Trọng tâm Phần II Đúng/Sai',
        summary: 'Ba cách nhúng CSS: Inline (trong thẻ), Internal (thẻ <style> trong <head>), External (tệp .css qua thẻ <link>); Cú pháp bộ chọn selector (tag, .class, #id).',
        theory: {
          objectives: [
            'Phân biệt: Dấu chấm (.) đại diện cho class; Dấu thăng (#) đại diện cho id.',
            'Hiểu thứ tự ưu tiên áp dụng style khi bị xung đột thuộc tính.'
          ],
          codeSnippet: {
            lang: 'css',
            title: 'Cú pháp CSS chuẩn',
            code: `/* Bộ chọn thẻ */
h1 { color: #EA580C; font-size: 24px; }
/* Bộ chọn lớp (class) */
.btn-primary { background-color: #F97316; padding: 10px; }
/* Bộ chọn định danh (id) */
#header-main { border-bottom: 2px solid #E5E7EB; }`
          }
        },
        quiz: {
          question: 'Để áp dụng định dạng CSS cho tất cả các phần tử có thuộc tính class="highlight", bộ chọn (selector) nào được sử dụng?',
          options: ['#highlight', '.highlight', 'highlight', '*highlight'],
          answer: 1,
          explanation: 'Trong CSS, dấu chấm (.) đứng trước tên để định danh cho bộ chọn lớp (class selector).'
        }
      },
      {
        id: 'ict_e_6',
        title: 'Bài 17: Thuộc tính CSS cơ bản (Color, Font, Margin)',
        bookRef: 'SGK Tin 12 ICT - Trang 88',
        priority: 'Cực kỳ cao',
        examFormat: 'Trọng tâm Phần II Đúng/Sai',
        summary: 'Mô hình hộp (Box Model): Content -> Padding -> Border -> Margin; Các thuộc tính font-family, font-size, background-color.',
        theory: {
          objectives: [
            'Phân biệt rõ ràng: Padding là khoảng đệm BÊN TRONG đường viền; Margin là khoảng cách BÊN NGOÀI đường viền.'
          ]
        },
        quiz: {
          question: 'Trong mô hình hộp (Box Model) của CSS, vùng khoảng cách nằm giữa nội dung (content) và đường viền (border) được gọi là:',
          options: ['Margin', 'Padding', 'Outline', 'Spacing'],
          answer: 1,
          explanation: 'Padding là khoảng đệm nằm bên trong bao quanh nội dung cho tới mép đường viền (Border).'
        }
      },
      {
        id: 'ict_e_7',
        title: 'Bài 18: Cây cấu trúc Website & Xuất bản Web',
        bookRef: 'SGK Tin 12 ICT - Trang 98',
        priority: 'Cực kỳ cao',
        examFormat: 'Trọng tâm Phần II Đúng/Sai',
        summary: 'Cây thư mục trang web (root, css/, images/, js/), đường dẫn tương đối (./, ../) và quy trình đưa website lên Hosting/Server.',
        theory: {
          objectives: [
            'Biết cách tham chiếu đường dẫn ../ để quay lại thư mục cha.',
            'Tệp trang chủ mặc định luôn đặt tên là index.html.'
          ]
        },
        quiz: {
          question: 'Theo chuẩn thiết kế website, tệp tin nào sau đây thường được các máy chủ web cấu hình làm trang chủ mặc định khi người dùng truy cập vào thư mục gốc?',
          options: ['home.html', 'main.html', 'index.html', 'default.html'],
          answer: 2,
          explanation: 'index.html là tên tệp trang chủ mặc định chuẩn của hầu hết các web server.'
        }
      },
      {
        id: 'ict_e_8',
        title: 'Bài 12: Chỉnh sửa ảnh lớp (Layer) & Đồ họa',
        bookRef: 'SGK Tin 11 ICT - Trang 102',
        priority: 'Cực kỳ cao',
        examFormat: 'Trắc nghiệm Phần I & II',
        summary: 'Khái niệm Lớp (Layer), vùng chọn (Selection), chỉnh độ sáng tối, xóa phông nền và xuất ảnh định dạng JPG/PNG.',
        theory: {
          objectives: ['Hiểu nguyên lý xếp chồng các layer và phân biệt định dạng PNG (hỗ trợ nền trong suốt) vs JPG (nén mất dữ liệu).']
        },
        quiz: {
          question: 'Định dạng tệp ảnh nào sau đây hỗ trợ độ trong suốt (transparency/kênh alpha) thích hợp nhất để làm logo hiển thị trên website?',
          options: ['JPG', 'BMP', 'PNG', 'TIFF'],
          answer: 2,
          explanation: 'PNG (Portable Network Graphics) hỗ trợ kênh alpha cho phép lưu hình ảnh có nền trong suốt hoàn hảo.'
        }
      },
      {
        id: 'ict_e_9',
        title: 'Bài 13: Biên tập & Chỉnh sửa Video clip',
        bookRef: 'SGK Tin 11 ICT - Trang 110',
        priority: 'Cực kỳ cao',
        examFormat: 'Trắc nghiệm Phần I & II',
        summary: 'Thanh dòng thời gian (Timeline), track video/audio, cắt ghép, hiệu ứng chuyển cảnh (Transition), xuất video định dạng MP4.',
        theory: {
          objectives: ['Nắm các thao tác cơ bản trong phần mềm biên tập video số: Cắt phân đoạn, lồng nhạc nền, chèn phụ đề.']
        },
        quiz: {
          question: 'Trong các phần mềm biên tập video, thành phần trực quan thể hiện thứ tự xuất hiện và độ dài thời gian của các clip hình ảnh và âm thanh được gọi là:',
          options: ['Bảng màu (Color Palette)', 'Dòng thời gian (Timeline)', 'Hộp công cụ (Toolbox)', 'Trình xem trước (Preview)'],
          answer: 1,
          explanation: 'Timeline (Dòng thời gian) là khu vực sắp xếp các đoạn clip, âm thanh và hiệu ứng theo trình tự thời gian.'
        }
      }
    ]
  },
  {
    id: 'ict_station_6',
    stepNumber: '06',
    code: 'Chủ đề G',
    title: 'Hướng Nghiệp Với Tin Học',
    category: 'Định hướng nghề nghiệp',
    priority: 'Thấp',
    priorityBadge: 'low',
    questionType: 'Trắc nghiệm Phần I (1 câu)',
    description: 'Đặc thù công việc nhóm nghề Tin học ứng dụng: Chuyên viên Thiết kế Web (Web Designer), Quản trị Website, Chuyên viên Đồ họa truyền thông số, Chuyên viên Dữ liệu doanh nghiệp.',
    skills: ['Thiết kế Web (Web Designer)', 'Quản trị trang web', 'Đồ họa truyền thông số'],
    xp: 200,
    lessons: [
      {
        id: 'ict_g_1',
        title: 'Bài 14: Các ngành nghề ứng dụng CNTT',
        bookRef: 'SGK Tin 11 - Trang 115',
        priority: 'Thấp',
        examFormat: 'Trắc nghiệm Phần I',
        summary: 'Ứng dụng CNTT thúc đẩy chuyển đổi số trong tài chính, ngân hàng, giáo dục và truyền thông số.',
        theory: {
          objectives: ['Nhận thức cơ hội nghề nghiệp trong kỷ nguyên chuyển đổi số quốc gia.']
        },
        quiz: {
          question: 'Quá trình ứng dụng công nghệ số vào mọi hoạt động của doanh nghiệp nhằm đổi mới mô hình vận hành và kinh doanh được gọi là:',
          options: ['Tin học hóa thủ công', 'Chuyển đổi số (Digital Transformation)', 'Mở rộng văn phòng số', 'Lắp ráp máy tính'],
          answer: 1,
          explanation: 'Chuyển đổi số là việc tích hợp công nghệ số vào mọi mặt hoạt động để gia tăng giá trị.'
        }
      },
      {
        id: 'ict_g_2',
        title: 'Bài 10: Hướng nghiệp Quản trị Web & Thiết kế đồ họa',
        bookRef: 'SGK Tin 12 - Trang 106',
        priority: 'Thấp',
        examFormat: 'Trắc nghiệm Phần I',
        summary: 'Mô tả vị trí Chuyên viên thiết kế giao diện web (UI/UX Designer), Quản trị viên nội dung và bảo trì hệ thống website.',
        theory: {
          objectives: ['Nắm các kỹ năng cần thiết cho nghề Web Designer và Chuyên viên đồ họa số.']
        },
        quiz: {
          question: 'Vị trí công việc nào chịu trách nhiệm thiết kế bố cục, màu sắc, phông chữ và trải nghiệm tương tác trực quan của người dùng trên trang web?',
          options: ['Chuyên viên thiết kế giao diện web (Web Designer / UI-UX)', 'Kỹ sư cơ khí', 'Kỹ thuật viên mạng cáp quang', 'Kiểm toán viên'],
          answer: 0,
          explanation: 'Web Designer (UI/UX) đảm nhiệm việc thiết kế mỹ thuật, bố cục và tối ưu hóa trải nghiệm trực quan trên website.'
        }
      }
    ]
  },
  {
    id: 'ict_station_7',
    stepNumber: '07',
    code: 'Chặng Boss',
    title: 'Lộ Trình Về Đích 12 Tuần — Chinh Phục Điểm 9-10 ICT',
    category: 'Tổng ôn chiến lược',
    priority: 'Cực kỳ cao',
    priorityBadge: 'extreme',
    questionType: 'Luyện đề 50 phút chuẩn Bộ GD&ĐT',
    description: 'Chiến thuật phòng thi thực chiến: Nắm trọn 4.5 điểm lý thuyết Phần I, xử lý nhanh kịch bản Excel và thẻ HTML/CSS Phần II để đạt 10 điểm tuyệt đối.',
    skills: ['Chiến thuật 50 phút', 'Bẫy công thức Excel', 'Đọc mã thẻ HTML/CSS', 'Bứt phá điểm 10'],
    xp: 800,
    lessons: [
      {
        id: 'ict_boss_1',
        title: 'Chiến thuật phân bổ 50 phút cho 22 câu đề thi ICT',
        bookRef: 'Cẩm nang ôn thi THPTQG 2025-2026',
        priority: 'Cực kỳ cao',
        examFormat: 'Tổng hợp',
        summary: '15 phút hoàn thành 18 câu Phần I; 30 phút rà soát 4 câu kịch bản Excel và mã HTML/CSS Phần II; 5 phút kiểm tra phiếu trả lời.',
        theory: {
          objectives: [
            'Không vội vàng ở các câu Đúng/Sai: Phải tính nhẩm từng đối số của hàm Excel và kiểm tra kỹ tên thẻ HTML.',
            'Nắm chắc nguyên tắc tính điểm lũy tiến của đề thi mới.'
          ]
        },
        quiz: {
          question: 'Trong phòng thi THPTQG môn Tin học, chiến lược phân bổ thời gian hợp lý nhất cho 50 phút làm bài là:',
          options: [
            'Làm Phần II trước trong 40 phút rồi mới làm Phần I',
            'Dành khoảng 12-15 phút làm chắc chắn 18 câu Phần I, 30 phút cẩn thận cho 4 câu Đúng/Sai Phần II, 5 phút soát lại đáp án',
            'Làm mỗi câu trong đúng 2 phút bất kể dài ngắn',
            'Chỉ tập trung làm Phần I để lấy 4.5 điểm'
          ],
          answer: 1,
          explanation: 'Dành 12-15 phút chốt trọn 4.5 điểm lý thuyết Phần I, sau đó dành 30 phút giải quyết 4 câu phân hóa Đúng/Sai là chiến lược tối ưu nhất.'
        }
      }
    ]
  }
];
