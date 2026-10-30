// ============================================================
//  NGÂN HÀNG CÂU HỎI ÔN TẬP - CHỦ ĐỀ 4: CƠ SỞ DỮ LIỆU VÀ SQL
//  Nguồn: Cau_Hoi_On_Tap_Chu_De_4_Co_So_Du_Lieu.txt
// ============================================================

export const CHUONG_4_QUIZ = {
  stationId: 'cs_station_4',
  code: 'Chủ đề 4',
  title: 'Giới thiệu các hệ cơ sở dữ liệu',
  totalMcq: 20,
  totalTf: 4,
  totalItems: 36,
  mcq: [
    { id: 'c4_mcq_1', q: 'Cơ sở dữ liệu (CSDL - Database) là gì?', opts: ['Tập hợp phần mềm dùng để quản lý máy tính.', 'Tập hợp dữ liệu có liên quan với nhau, được lưu trữ có tổ chức trên các thiết bị nhớ của máy tính.', 'Chương trình bảng tính dùng để tính toán điểm số.', 'Tập hợp các trang web được liên kết trên Internet.'], ans: 1, exp: 'CSDL là tập hợp dữ liệu liên quan, được tổ chức để lưu trữ và khai thác.' },
    { id: 'c4_mcq_2', q: 'Hệ quản trị cơ sở dữ liệu (DBMS) là gì?', opts: ['Tập hợp dữ liệu được lưu trong ổ cứng.', 'Thiết bị phần cứng kết nối các máy tính trong mạng.', 'Phần mềm cung cấp môi trường để tạo lập, lưu trữ, cập nhật và khai thác CSDL.', 'Quy trình sao lưu dữ liệu định kỳ trên máy chủ.'], ans: 2, exp: 'DBMS là phần mềm trung gian giữa người dùng hoặc ứng dụng và dữ liệu lưu trữ.' },
    { id: 'c4_mcq_3', q: 'Trong mô hình CSDL quan hệ, thuật ngữ "Bản ghi" (Record/Tuple) tương ứng với thành phần nào của bảng?', opts: ['Cột của bảng.', 'Hàng của bảng.', 'Tên của bảng.', 'Kiểu dữ liệu của cột.'], ans: 1, exp: 'Mỗi hàng biểu diễn một bản ghi, còn cột biểu diễn trường hoặc thuộc tính.' },
    { id: 'c4_mcq_4', q: 'Đặc điểm bắt buộc của Khóa chính (Primary Key) trong một bảng quan hệ là gì?', opts: ['Có thể chứa NULL và trùng giữa các bản ghi.', 'Có giá trị duy nhất và không được để rỗng.', 'Phải có kiểu dữ liệu văn bản.', 'Phải bao gồm tất cả các cột của bảng.'], ans: 1, exp: 'Khóa chính phân biệt duy nhất từng bản ghi nên phải UNIQUE và NOT NULL.' },
    { id: 'c4_mcq_5', q: 'Khóa ngoài (Foreign Key) trong CSDL quan hệ có vai trò chính là gì?', opts: ['Tăng tốc độ khởi động DBMS.', 'Tạo liên kết giữa các bảng và đảm bảo tính vẹn toàn tham chiếu.', 'Tự động mã hóa mật khẩu người dùng.', 'Chuyển đổi bảng thành tệp ảnh.'], ans: 1, exp: 'Khóa ngoài tham chiếu khóa chính của bảng khác để duy trì liên kết logic.' },
    { id: 'c4_mcq_6', q: 'Ưu điểm nổi bật của hệ CSDL quan hệ so với lưu trữ Excel hoặc tệp văn bản thông thường là gì?', opts: ['Không cần dùng RAM khi chạy.', 'Giảm dư thừa dữ liệu, đảm bảo tính nhất quán và hỗ trợ nhiều người dùng truy cập đồng thời.', 'Không thể bị virus tấn công.', 'Dung lượng luôn nhỏ hơn 1MB.'], ans: 1, exp: 'CSDL quan hệ hỗ trợ chuẩn hóa, kiểm soát nhất quán, phân quyền và truy cập đồng thời.' },
    { id: 'c4_mcq_7', q: 'Mệnh đề nào trong SQL dùng để lọc các bản ghi thỏa điều kiện xác định?', opts: ['FROM', 'WHERE', 'SELECT', 'GROUP BY'], ans: 1, exp: 'WHERE đặt điều kiện lọc bản ghi trong truy vấn SQL.' },
    { id: 'c4_mcq_8', q: 'Trong SQL, mệnh đề ORDER BY được dùng để làm gì?', opts: ['Nhóm các bản ghi cùng giá trị.', 'Giới hạn số bản ghi trả về.', 'Sắp xếp kết quả truy vấn theo ASC hoặc DESC.', 'Xóa các hàng dữ liệu trùng lặp.'], ans: 2, exp: 'ORDER BY sắp xếp danh sách kết quả, mặc định là tăng dần nếu không ghi rõ.' },
    { id: 'c4_mcq_9', q: 'Khác biệt căn bản giữa WHERE và HAVING trong SQL là gì?', opts: ['WHERE dùng cho chuỗi, HAVING dùng cho số.', 'WHERE lọc từng bản ghi trước khi nhóm, HAVING lọc nhóm sau GROUP BY.', 'WHERE phải đứng sau HAVING.', 'WHERE xóa bảng, HAVING tạo bảng.'], ans: 1, exp: 'WHERE lọc ở mức dòng trước khi nhóm, HAVING lọc kết quả tổng hợp ở mức nhóm.' },
    { id: 'c4_mcq_10', q: 'Để chọn tất cả cột và tất cả hàng từ bảng HOC_SINH, ký hiệu nào dùng sau SELECT?', opts: ['%', '#', '*', '&'], ans: 2, exp: 'SELECT * FROM HOC_SINH trả về toàn bộ các cột của bảng.' },
    { id: 'c4_mcq_11', q: 'Hàm tổng hợp nào trong SQL dùng để tính trung bình cộng giá trị của một cột số?', opts: ['COUNT()', 'SUM()', 'AVG()', 'MAX()'], ans: 2, exp: 'AVG() tính giá trị trung bình của cột số.' },
    { id: 'c4_mcq_12', q: 'Lệnh SQL nào thuộc nhóm DML dùng để thêm bản ghi mới vào bảng?', opts: ['CREATE TABLE', 'INSERT INTO', 'ALTER TABLE', 'DROP TABLE'], ans: 1, exp: 'INSERT INTO là thao tác thêm dòng dữ liệu mới, thuộc DML.' },
    { id: 'c4_mcq_13', q: 'Cú pháp SQL nào dùng để xóa toàn bộ học sinh có DiemTB < 5 khỏi bảng HOC_SINH?', opts: ['REMOVE FROM HOC_SINH WHERE DiemTB < 5;', 'DELETE FROM HOC_SINH WHERE DiemTB < 5;', 'DROP HOC_SINH WHERE DiemTB < 5;', 'CLEAR HOC_SINH IF DiemTB < 5;'], ans: 1, exp: 'DELETE FROM tên_bảng WHERE điều_kiện dùng để xóa các bản ghi thỏa điều kiện.' },
    { id: 'c4_mcq_14', q: 'Phép nối INNER JOIN trong SQL thực hiện chức năng gì?', opts: ['Trả về mọi hàng từ hai bảng bất kể có khớp hay không.', 'Chỉ trả về các hàng có giá trị cột kết nối giữa hai bảng khớp điều kiện.', 'Chỉ giữ lại dữ liệu bảng bên trái.', 'Xóa dữ liệu trùng ở hai bảng.'], ans: 1, exp: 'INNER JOIN chỉ kết hợp các bản ghi có giá trị khớp ở cột nối.' },
    { id: 'c4_mcq_15', q: 'Quy trình đúng khi xây dựng một CSDL quan hệ thực tế gồm các bước nào?', opts: ['Nhập dữ liệu ngay, thiết kế giao diện, xóa bảng cũ.', 'Khảo sát thực tế, thiết kế mô hình CSDL, tạo lập CSDL trên DBMS, cập nhật và khai thác.', 'Lập trình giao diện, mua máy mới, viết báo cáo.', 'Viết SQL, khảo sát thực tế, cài phần mềm.'], ans: 1, exp: 'Cần khảo sát bài toán, thiết kế cấu trúc, tạo lập CSDL, rồi cập nhật và khai thác.' },
    { id: 'c4_mcq_16', q: 'Trong một bảng CSDL quan hệ, khẳng định nào đúng về Khóa chính?', opts: ['Một bảng có thể có nhiều Khóa chính khác nhau.', 'Một bảng chỉ có tối đa một Khóa chính, nhưng khóa đó có thể gồm nhiều cột.', 'Khóa chính không được chứa số.', 'Khóa chính tự xóa khi có dữ liệu mới.'], ans: 1, exp: 'Mỗi bảng có một primary key, có thể là khóa phức hợp gồm nhiều cột.' },
    { id: 'c4_mcq_17', q: 'Để thay đổi dữ liệu của các bản ghi đã có trong bảng, dùng câu lệnh SQL nào?', opts: ['CHANGE', 'MODIFY', 'UPDATE ... SET ...', 'REPLACE'], ans: 2, exp: 'UPDATE ... SET ... WHERE ... được dùng để sửa các bản ghi hiện có.' },
    { id: 'c4_mcq_18', q: 'Thứ tự đúng của các mệnh đề trong một câu lệnh truy vấn SQL chuẩn là gì?', opts: ['SELECT, WHERE, FROM, GROUP BY, ORDER BY', 'SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY', 'FROM, SELECT, WHERE, ORDER BY, GROUP BY', 'SELECT, GROUP BY, HAVING, FROM, WHERE'], ans: 1, exp: 'Thứ tự viết truy vấn là SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY.' },
    { id: 'c4_mcq_19', q: 'Lệnh SQL ALTER TABLE thuộc nhóm chức năng nào?', opts: ['DML', 'DDL', 'DCL', 'Lập lịch tự động'], ans: 1, exp: 'ALTER TABLE thay đổi cấu trúc bảng, thuộc Data Definition Language.' },
    { id: 'c4_mcq_20', q: 'SQL là viết tắt của cụm từ tiếng Anh nào?', opts: ['Structured Query Language', 'Simple Query Logic', 'System Quality Language', 'Standard Question List'], ans: 0, exp: 'SQL là Structured Query Language, ngôn ngữ truy vấn có cấu trúc.' }
  ],
  tf: [
    { id: 'c4_tf_1', ctx: 'CSDL quản lý học sinh gồm LOP(MaLop, TenLop, GVCN), MaLop là khóa chính, và HOC_SINH(MaHS, HoTen, NgaySinh, GioiTinh, DiemTB, MaLop), MaHS là khóa chính, MaLop là khóa ngoài tham chiếu LOP.', items: [
      { s: 'MaLop trong bảng HOC_SINH giúp thiết lập liên kết giữa học sinh và lớp học tương ứng.', ans: true, exp: 'MaLop là khóa ngoài tham chiếu MaLop của LOP, tạo quan hệ một-nhiều.' },
      { s: 'Cột MaHS có thể có hai bản ghi trùng giá trị nếu hai học sinh trùng họ tên.', ans: false, exp: 'MaHS là khóa chính nên bắt buộc duy nhất.' },
      { s: "Không thể thêm học sinh có MaLop = '12A5' nếu giá trị này chưa tồn tại trong bảng LOP.", ans: true, exp: 'Khóa ngoài phải tham chiếu tới giá trị đã tồn tại ở bảng khóa chính.' },
      { s: 'Để lấy Họ tên, Điểm TB và Tên lớp, phải JOIN HOC_SINH với LOP.', ans: true, exp: 'Các thông tin cần lấy nằm ở hai bảng khác nhau và được kết nối qua MaLop.' }
    ] },
    { id: 'c4_tf_2', ctx: 'CSDL bán hàng gồm SAN_PHAM(MaSP, TenSP, DonGia, LoaiSP) và CHI_TIET_HD(MaHD, MaSP, SoLuong). Truy vấn dùng INNER JOIN qua MaSP, GROUP BY LoaiSP, HAVING SUM(SoLuong) >= 100 và ORDER BY TongSoLuong DESC.', items: [
      { s: 'Truy vấn dùng INNER JOIN để kết hợp thông tin sản phẩm và chi tiết hóa đơn dựa trên MaSP.', ans: true, exp: 'INNER JOIN nối hai bảng qua giá trị MaSP trùng khớp.' },
      { s: 'GROUP BY SAN_PHAM.LoaiSP gom các sản phẩm cùng loại để tính tổng số lượng bán.', ans: true, exp: 'GROUP BY tạo nhóm cho hàm SUM tính trên từng loại.' },
      { s: 'Thay HAVING bằng WHERE thì truy vấn vẫn chạy đúng và hoàn toàn tương tự.', ans: false, exp: 'HAVING dùng để lọc kết quả tổng hợp sau GROUP BY.' },
      { s: 'Kết quả hiển thị tất cả loại sản phẩm, kể cả loại có tổng số lượng bán dưới 100.', ans: false, exp: 'Điều kiện HAVING loại các nhóm có tổng dưới 100.' }
    ] },
    { id: 'c4_tf_3', ctx: 'Một thủ thư tạo một bảng QUAN_LY duy nhất gồm MaDocGia, TenDocGia, MaSach, TenSach, NgayMuon, NgayTra để quản lý mượn trả sách.', items: [
      { s: 'Thiết kế tất cả thông tin trong một bảng có thể gây dư thừa dữ liệu.', ans: true, exp: 'Tên độc giả và tên sách có thể lặp lại nhiều lần ở các lượt mượn khác nhau.' },
      { s: 'Phương án tối ưu là tách thành DOC_GIA, SACH và MUON_TRA liên kết qua khóa chính, khóa ngoài.', ans: true, exp: 'Tách bảng giúp chuẩn hóa và giảm dư thừa dữ liệu.' },
      { s: 'NgayMuon có thể được chọn làm khóa chính của bảng MUON_TRA.', ans: false, exp: 'Nhiều lượt mượn có thể xảy ra cùng ngày nên NgayMuon không đảm bảo duy nhất.' },
      { s: 'Khi độc giả trả sách, cập nhật NgayTra dùng UPDATE ... SET NgayTra = ... WHERE ....', ans: true, exp: 'UPDATE dùng để sửa dữ liệu hiện có trong bản ghi lượt mượn.' }
    ] },
    { id: 'c4_tf_4', ctx: 'Bệnh viện có hệ CSDL hồ sơ bệnh án điện tử, với nhiều bác sĩ, y sĩ, dược sĩ và thu ngân cùng truy cập hằng ngày.', items: [
      { s: 'Tất cả nhân viên nên dùng chung tài khoản Admin để thuận tiện chỉnh sửa dữ liệu.', ans: false, exp: 'Cần phân quyền theo vai trò để giảm rủi ro rò rỉ hoặc phá hoại dữ liệu.' },
      { s: 'Bác sĩ điều trị cần quyền SELECT và UPDATE hồ sơ bệnh án, còn thu ngân chỉ nên xem thông tin chi phí.', ans: true, exp: 'Phân quyền theo vai trò bảo vệ tính riêng tư và an toàn dữ liệu.' },
      { s: 'Hệ CSDL bệnh viện cần sao lưu dự phòng định kỳ để phòng hỏng ổ cứng hoặc tấn công mã độc.', ans: true, exp: 'Backup giúp duy trì khả năng khôi phục dữ liệu khi xảy ra sự cố.' },
      { s: 'Lưu System Log ghi lịch sử đăng nhập và sửa dữ liệu là không cần thiết vì tốn dung lượng.', ans: false, exp: 'Nhật ký rất quan trọng để truy vết sự cố, kiểm toán và phát hiện truy cập trái phép.' }
    ] }
  ]
};
