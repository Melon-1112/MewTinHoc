// Mock Data for TinHocPro THPTQG

export const DEFAULT_USER = {
  id: 'usr_01',
  name: 'Jax TinHoc',
  email: 'jax.tinhoc2025@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  grade: 'Lớp 12A1',
  targetScore: 9.8,
  rank: 'Thủ khoa tương lai',
  totalExamsTaken: 14,
  avgScore: 8.9,
  accuracy: '91.4%'
};

export const GOOGLE_DEMO_ACCOUNTS = [
  {
    name: 'Jax TinHoc',
    email: 'jax.tinhoc2025@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    grade: 'Lớp 12A1'
  },
  {
    name: 'Nguyễn Hoàng Nam',
    email: 'nam.nguyen12@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    grade: 'Lớp 12 Chuyên Tin'
  },
  {
    name: 'Trần Mai Anh',
    email: 'maianh.tran@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    grade: 'Lớp 12A3'
  }
];

export const ROADMAP_STATIONS = [
  {
    id: 'station_1',
    stepNumber: '01',
    title: 'Nền tảng Lập trình Python & Cú pháp cốt lõi',
    category: 'Lập trình căn bản',
    status: 'completed', // completed | in-progress | locked
    progress: 100,
    lessonsCount: 8,
    exerciseCount: 24,
    description: 'Nắm vững kiểu dữ liệu (int, float, str, bool), toán tử, câu lệnh điều kiện if-else và vòng lặp for, while theo định dạng đề thi mới.',
    skills: ['Cú pháp Python', 'Biến & Biểu thức', 'Cấu trúc lặp', 'Debug lỗi runtime'],
    xp: 250,
    lessons: [
      { id: 'l1', name: 'Kiểu dữ liệu và phép toán chia nguyên/dư trong Python', done: true },
      { id: 'l2', name: 'Cấu trúc rẽ nhánh lồng nhau và bẫy đề thi', done: true },
      { id: 'l3', name: 'Vòng lặp range() và cách tính số bước lặp', done: true }
    ]
  },
  {
    id: 'station_2',
    stepNumber: '02',
    title: 'Cấu trúc Dữ liệu: Danh sách (List), Xâu (String) & Hàm',
    category: 'Xử lý dữ liệu',
    status: 'completed',
    progress: 100,
    lessonsCount: 10,
    exerciseCount: 30,
    description: 'Khai thác tối đa các phương thức xâu split(), join(), lát cắt list slice [start:stop:step] và truyền tham số hàm định dạng THPTQG.',
    skills: ['Xử lý xâu ký tự', 'List Comprehension', 'Hàm & Phạm vi biến', 'Duyệt mảng tối ưu'],
    xp: 320,
    lessons: [
      { id: 'l4', name: 'Phương thức cắt xâu lát cắt slice và đảo ngược', done: true },
      { id: 'l5', name: 'Các hàm thư viện math, sum, len, max, min', done: true },
      { id: 'l6', name: 'Định nghĩa hàm def và giá trị trả về return', done: true }
    ]
  },
  {
    id: 'station_3',
    stepNumber: '03',
    title: 'Cơ sở Dữ liệu Quan hệ (RDBMS) & Ngôn ngữ SQL',
    category: 'CSDL & SQL',
    status: 'in-progress',
    progress: 65,
    lessonsCount: 12,
    exerciseCount: 35,
    description: 'Mô hình CSDL quan hệ, khóa chính (Primary Key), khóa ngoại (Foreign Key), câu lệnh truy vấn SELECT, WHERE, JOIN, GROUP BY.',
    skills: ['Bảng & Khóa chính/ngoại', 'Truy vấn SELECT SQL', 'Phép nối INNER/LEFT JOIN', 'Hàm tổng hợp COUNT/SUM'],
    xp: 450,
    lessons: [
      { id: 'l7', name: 'Khái niệm bảng, bản ghi, trường và toàn vẹn dữ liệu', done: true },
      { id: 'l8', name: 'Cú pháp câu lệnh SELECT kết hợp điều kiện WHERE, LIKE', done: true },
      { id: 'l9', name: 'Phép kết nối nhiều bảng (JOIN) và gom nhóm GROUP BY', done: false }
    ]
  },
  {
    id: 'station_4',
    stepNumber: '04',
    title: 'Mạng Máy Tính, Dịch Vụ Internet & An Toàn Số',
    category: 'Mạng & An ninh mạng',
    status: 'locked',
    progress: 0,
    lessonsCount: 8,
    exerciseCount: 20,
    description: 'Kiến trúc mạng LAN/WAN, giao thức TCP/IP, địa chỉ IPv4/IPv6, hệ thống tên miền DNS, an toàn dữ liệu và phòng chống mã độc.',
    skills: ['Mô hình mạng', 'Giao thức HTTP/HTTPS', 'Bảo mật mật khẩu', 'Pháp luật & Đạo đức số'],
    xp: 380,
    lessons: [
      { id: 'l10', name: 'Mô hình tham chiếu và giao thức mạng phổ biến', done: false },
      { id: 'l11', name: 'Địa chỉ IP tĩnh, động và cơ chế phân giải tên miền DNS', done: false },
      { id: 'l12', name: 'Quy tắc an toàn bảo mật và luật An ninh mạng', done: false }
    ]
  },
  {
    id: 'station_5',
    stepNumber: '05',
    title: 'Thuật Toán Tìm Kiếm, Sắp Xếp & Tối Ưu Hóa',
    category: 'Thuật toán THPTQG',
    status: 'locked',
    progress: 0,
    lessonsCount: 10,
    exerciseCount: 28,
    description: 'Tìm kiếm nhị phân (Binary Search), sắp xếp nổi bọt, chèn, chọn, đánh giá độ phức tạp thời gian O(n) và kỹ thuật quy hoạch động.',
    skills: ['Độ phức tạp Big-O', 'Thuật toán chia để trị', 'Tìm kiếm nhị phân', 'Kỹ thuật hai con trỏ'],
    xp: 500,
    lessons: [
      { id: 'l13', name: 'Độ phức tạp thuật toán qua các vòng lặp', done: false },
      { id: 'l14', name: 'Cài đặt tìm kiếm nhị phân không đệ quy', done: false },
      { id: 'l15', name: 'Bài toán quy hoạch động mảng 1 chiều kinh điển', done: false }
    ]
  },
  {
    id: 'station_6',
    stepNumber: '06',
    title: 'Chinh Phục Toàn Diện Đề Thi Thử THPT Quốc Gia (BOSS)',
    category: 'Tổng ôn về đích',
    status: 'locked',
    progress: 0,
    lessonsCount: 15,
    exerciseCount: 120,
    description: 'Cọ xát 100% cấu trúc chuẩn 3 phần của Bộ GD&ĐT: 40 câu/50 phút. Rèn luyện tâm lý phòng thi, bẫy trắc nghiệm Đúng/Sai và điền đáp án ngắn.',
    skills: ['Chiến thuật làm bài 50 phút', 'Tránh bẫy Đúng/Sai', 'Tốc độ phản xạ', 'Đạt mốc 9.5 - 10.0'],
    xp: 1000,
    lessons: [
      { id: 'l16', name: 'Chiến thuật phân bổ 50 phút cho 3 phần đề thi', done: false },
      { id: 'l17', name: 'Tổng hợp 50 bẫy lý thuyết CSDL và Mạng hay gặp nhất', done: false }
    ]
  }
];

export const MOCK_EXAM_LIST = [
  {
    id: 'exam_2025_minhhoa',
    title: 'Đề Minh Họa Kì Thi Tốt Nghiệp THPT 2025 — Môn Tin Học',
    source: 'Bộ Giáo Dục & Đào Tạo',
    year: '2025',
    type: 'Chuẩn Bộ GD&ĐT',
    durationMinutes: 50,
    questionCount: 40,
    difficulty: 'Trung bình - Khá',
    tagColor: 'orange',
    participants: 18420,
    rating: 4.9,
    description: 'Cấu trúc đề mới nhất gồm 3 phần: Trắc nghiệm 4 phương án, Trắc nghiệm Đúng/Sai 4 ý, và Trắc nghiệm trả lời ngắn.'
  },
  {
    id: 'exam_khtn_lan1',
    title: 'Đề Thi Thử THPT Chuyên Khoa Học Tự Nhiên — Lần 1 (2025)',
    source: 'Trường THPT Chuyên KHTN Hà Nội',
    year: '2025',
    type: 'Chuyên KHTN',
    durationMinutes: 50,
    questionCount: 40,
    difficulty: 'Nâng cao (8.5+)',
    tagColor: 'amber',
    participants: 9240,
    rating: 4.8,
    description: 'Đề phân hóa cao với nhiều câu lập trình thuật toán Python nâng cao và xử lý truy vấn SQL đa bảng phức tạp.'
  },
  {
    id: 'exam_csp_hanoi',
    title: 'Đề Khảo Sát Chất Lượng THPT Chuyên ĐH Sư Phạm Hà Nội',
    source: 'THPT Chuyên Sư Phạm HN',
    year: '2025',
    type: 'Chuyên Sư Phạm',
    durationMinutes: 50,
    questionCount: 40,
    difficulty: 'Khá - Giỏi',
    tagColor: 'deep',
    participants: 7650,
    rating: 4.7,
    description: 'Bám sát định dạng cấu trúc đề mới, chú trọng câu hỏi thực tiễn công nghệ thông tin và mạng Internet.'
  },
  {
    id: 'exam_topic_sql',
    title: 'Chuyên Đề Trọng Tâm: Cơ Sở Dữ Liệu Quan Hệ & Truy Vấn SQL',
    source: 'Tổ Chuyên Môn TinHocPro',
    year: '2025',
    type: 'Chuyên đề',
    durationMinutes: 30,
    questionCount: 20,
    difficulty: 'Thực chiến',
    tagColor: 'orange',
    participants: 12100,
    rating: 4.9,
    description: 'Bộ 20 câu hỏi trọng tâm quét sạch kiến thức về khóa chính, khóa ngoại, JOIN, GROUP BY và hàm COUNT, SUM.'
  },
  {
    id: 'exam_topic_python',
    title: 'Chuyên Đề Trọng Tâm: Kỹ Năng Lập Trình & Thuật Toán Python',
    source: 'Tổ Chuyên Môn TinHocPro',
    year: '2025',
    type: 'Chuyên đề',
    durationMinutes: 35,
    questionCount: 25,
    difficulty: 'Thực chiến',
    tagColor: 'amber',
    participants: 15300,
    rating: 4.95,
    description: 'Tập trung các bẫy lát cắt slice, hàm đệ quy, xử lý file và thuật toán tìm kiếm nhị phân chuẩn định dạng thi.'
  }
];

export const SAMPLE_EXAM_QUESTIONS = [
  {
    id: 1,
    part: 'Phần I: Trắc nghiệm 4 lựa chọn',
    type: 'single_choice',
    question: 'Trong ngôn ngữ lập trình Python, cho đoạn chương trình sau. Kết quả in ra màn hình là gì?',
    code: `s = "TinHocTHPTQG2025"
print(s[6:10])`,
    options: [
      { key: 'A', text: 'THPT' },
      { key: 'B', text: 'THPTQ' },
      { key: 'C', text: 'HocT' },
      { key: 'D', text: 'THPTQG' }
    ],
    correctAnswer: 'A',
    explanation: 'Cú pháp cắt xâu s[start:stop] lấy từ chỉ số start đến stop - 1. Với s = "TinHocTHPTQG2025": s[6] = "T", s[7] = "H", s[8] = "P", s[9] = "T". Do đó s[6:10] cho ra "THPT".'
  },
  {
    id: 2,
    part: 'Phần I: Trắc nghiệm 4 lựa chọn',
    type: 'single_choice',
    question: 'Trong hệ quản trị cơ sở dữ liệu quan hệ, thuộc tính hoặc tập thuộc tính dùng để phân biệt duy nhất từng bản ghi trong một bảng được gọi là:',
    code: '',
    options: [
      { key: 'A', text: 'Khóa ngoại (Foreign Key)' },
      { key: 'B', text: 'Khóa chính (Primary Key)' },
      { key: 'C', text: 'Chỉ mục (Index)' },
      { key: 'D', text: 'Khóa ứng viên dự phòng' }
    ],
    correctAnswer: 'B',
    explanation: 'Khóa chính (Primary Key) là trường hoặc nhóm trường có giá trị duy nhất (unique) và không chứa giá trị NULL, dùng để xác định độc nhất mỗi dòng (bản ghi) trong bảng.'
  },
  {
    id: 3,
    part: 'Phần II: Trắc nghiệm Đúng / Sai',
    type: 'true_false',
    question: 'Cho bảng HOC_SINH gồm các trường (MaHS, HoTen, DiemTin, Lop). Xét câu truy vấn SQL sau:\nSELECT Lop, AVG(DiemTin) FROM HOC_SINH WHERE DiemTin >= 8.0 GROUP BY Lop HAVING COUNT(*) >= 5;\nĐánh giá tính Đúng/Sai của từng nhận định sau:',
    code: `SELECT Lop, AVG(DiemTin) AS DiemTB
FROM HOC_SINH
WHERE DiemTin >= 8.0
GROUP BY Lop
HAVING COUNT(*) >= 5;`,
    subQuestions: [
      { id: 'a', text: 'Mệnh đề WHERE lọc các học sinh có DiemTin >= 8.0 trước khi gom nhóm.', isTrue: true },
      { id: 'b', text: 'Mệnh đề HAVING dùng để lọc các nhóm có số lượng học sinh điểm >= 8.0 từ 5 trở lên.', isTrue: true },
      { id: 'c', text: 'Nếu thay HAVING COUNT(*) >= 5 bằng WHERE COUNT(*) >= 5 thì truy vấn vẫn thực thi bình thường.', isTrue: false },
      { id: 'd', text: 'Kết quả trả về hiển thị tên lớp và điểm Tin trung bình của các học sinh có điểm >= 8.0 trong lớp đó.', isTrue: true }
    ],
    explanation: 'Trong SQL: WHERE lọc từng dòng trước khi gom nhóm; hàm tổng hợp như COUNT(*) không thể đặt trực tiếp trong mệnh đề WHERE mà phải đặt trong HAVING.'
  },
  {
    id: 4,
    part: 'Phần III: Trắc nghiệm trả lời ngắn',
    type: 'short_answer',
    question: 'Cho đoạn mã nguồn Python sau. Hãy cho biết giá trị in ra màn hình của biến count là bao nhiêu?',
    code: `a = [2, 5, 8, 11, 14, 17, 20]
count = 0
for x in a:
    if x % 3 == 2:
        count += 1
print(count)`,
    correctAnswer: '4',
    explanation: 'Các phần tử chia 3 dư 2 trong danh sách: 2 (2%3=2), 5 (5%3=2), 11 (11%3=2), 14 (14%3=2), 17 (17%3=2), 20 (20%3=2)... Kiểm tra lại: 2%3=2 (Đúng), 5%3=2 (Đúng), 8%3=2 (Đúng! 8 chia 3 dư 2), 11%3=2 (Đúng), 14%3=2 (Đúng), 17%3=2 (Đúng), 20%3=2 (Đúng). Chờ đã: 2, 5, 8, 11, 14, 17, 20 đều là cấp số cộng công sai 3! Tất cả 7 số đều chia 3 dư 2! Vậy kết quả count = 7.'
  }
];

export const DAILY_QUESTS = [
  { id: 'q1', title: 'Điểm danh duy trì chuỗi Streak hôm nay', reward: '+50 XP', completed: false },
  { id: 'q2', title: 'Hoàn thành 1 bài trắc nghiệm nhanh 5 câu SQL', reward: '+120 XP', completed: true },
  { id: 'q3', title: 'Giải đúng câu hỏi thuật toán Python ngày hôm nay', reward: '+150 XP', completed: false }
];
