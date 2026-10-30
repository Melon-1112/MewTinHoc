// ============================================================
//  NGÂN HÀNG CÂU HỎI ÔN TẬP - CHỦ ĐỀ 2: MẠNG MÁY TÍNH VÀ INTERNET
//  Nguồn: Cau_Hoi_On_Tap_Chu_De_2_Mang_May_Tinh.docx
//  Định dạng: 20 câu trắc nghiệm 4 lựa chọn + 4 câu Đúng/Sai
// ============================================================

export const CHUONG_2_QUIZ = {
  stationId: 'cs_station_2',
  code: 'Chủ đề 2',
  title: 'Mạng máy tính và Internet',
  totalMcq: 20,
  totalTf: 4,
  totalItems: 36,
  mcq: [
    { id: 'c2_mcq_1', q: 'Thiết bị mạng nào sau đây có chức năng chính là kết nối các máy tính trong cùng một mạng cục bộ (LAN) và chuyển tiếp dữ liệu dựa trên địa chỉ MAC?', opts: ['Router (Bộ định tuyến).', 'Switch (Bộ chuyển mạch).', 'Modem (Bộ điều chế/giải điều chế).', 'Access Point (Điểm truy cập không dây).'], ans: 1, exp: 'Switch hoạt động ở tầng liên kết dữ liệu, kết nối các thiết bị trong cùng mạng LAN và chuyển tiếp dữ liệu đến cổng đích dựa trên bảng địa chỉ MAC.' },
    { id: 'c2_mcq_2', q: 'Thiết bị nào đóng vai trò chuyển đổi tín hiệu tương tự (analog) từ nhà cung cấp dịch vụ mạng thành tín hiệu số (digital) để máy tính xử lý được?', opts: ['Switch.', 'Router.', 'Modem.', 'Hub.'], ans: 2, exp: 'Modem thực hiện điều chế và giải điều chế, chuyển đổi qua lại giữa tín hiệu trên đường truyền viễn thông và tín hiệu số của thiết bị CNTT.' },
    { id: 'c2_mcq_3', q: 'Trong mạng máy tính, thiết bị Router (Bộ định tuyến) thực hiện chức năng cốt lõi nào sau đây?', opts: ['Cấp nguồn điện qua dây cáp mạng cho các máy trạm.', 'Định tuyến và chuyển tiếp gói dữ liệu giữa các mạng máy tính khác nhau dựa trên địa chỉ IP.', 'Khuếch đại tín hiệu không dây Wi-Fi.', 'Lưu trữ toàn bộ dữ liệu tệp tin của người dùng trong mạng nội bộ.'], ans: 1, exp: 'Router làm việc ở tầng Mạng, tìm đường đi và chuyển tiếp gói dữ liệu giữa các mạng khác nhau dựa vào địa chỉ IP.' },
    { id: 'c2_mcq_4', q: 'Địa chỉ IPv4 dạng chấm gồm bao nhiêu bit nhị phân và được chia thành mấy nhóm (octet)?', opts: ['16 bit nhị phân, chia thành 2 nhóm.', '32 bit nhị phân, chia thành 4 nhóm phân tách bởi dấu chấm.', '48 bit nhị phân, chia thành 6 nhóm.', '128 bit nhị phân, chia thành 8 nhóm.'], ans: 1, exp: 'Địa chỉ IPv4 gồm 32 bit, chia thành 4 octet, mỗi octet 8 bit và có giá trị từ 0 đến 255.' },
    { id: 'c2_mcq_5', q: 'Địa chỉ MAC (Media Access Control) của một card mạng có đặc điểm nào sau đây?', opts: ['Là địa chỉ logic thay đổi mỗi khi máy tính khởi động lại.', 'Là địa chỉ vật lý duy nhất gồm 48 bit (6 byte) được nhà sản xuất gán cố định cho thiết bị.', 'Do dịch vụ DHCP tự động cấp phát qua đường truyền Internet.', 'Có cấu trúc gồm 128 bit biểu diễn dạng số thập phân.'], ans: 1, exp: 'MAC là địa chỉ vật lý 48 bit, thường biểu diễn bằng 6 cặp ký tự hệ mười sáu và được nhà sản xuất nạp cho card mạng.' },
    { id: 'c2_mcq_6', q: 'Địa chỉ IPv4 nào sau đây là KHÔNG hợp lệ?', opts: ['172.16.254.1', '192.168.1.256', '10.0.0.1', '8.8.8.8'], ans: 1, exp: 'Mỗi octet của IPv4 chỉ nhận giá trị từ 0 đến 255. Octet 256 làm cho địa chỉ này không hợp lệ.' },
    { id: 'c2_mcq_7', q: 'Dịch vụ mạng DHCP (Dynamic Host Configuration Protocol) có vai trò chính là gì?', opts: ['Mã hóa dữ liệu truyền dẫn.', 'Tự động cấp phát địa chỉ IP và các thông số cấu hình mạng cho các thiết bị khi kết nối vào mạng.', 'Dịch tên miền trang web thành địa chỉ IP tương ứng.', 'Kiểm tra tốc độ cáp tín hiệu.'], ans: 1, exp: 'DHCP tự động cấp địa chỉ IP, subnet mask, default gateway và các thông số mạng khác cho thiết bị.' },
    { id: 'c2_mcq_8', q: 'Dịch vụ DNS (Domain Name System) trong mạng Internet thực hiện chức năng nào sau đây?', opts: ['Chuyển đổi tên miền như truong.edu.vn thành địa chỉ IP tương ứng và ngược lại.', 'Cấp phát địa chỉ MAC cố định cho máy tính.', 'Quản lý chia sẻ máy in trong LAN.', 'Đo đạc tốc độ truyền cáp.'], ans: 0, exp: 'DNS phân giải tên miền dễ nhớ thành địa chỉ IP để máy tính có thể định tuyến dữ liệu trên Internet.' },
    { id: 'c2_mcq_9', q: 'Giao thức mạng HTTPS khác với HTTP thông thường ở điểm cốt lõi nào?', opts: ['HTTPS có tốc độ truyền nhận chậm hơn.', 'HTTPS bổ sung tầng mã hóa SSL/TLS giúp bảo vệ an toàn thông tin dữ liệu truyền tải.', 'HTTPS chỉ truyền được hình ảnh.', 'HTTPS không cần địa chỉ IP.'], ans: 1, exp: 'HTTPS sử dụng TLS để bảo vệ dữ liệu trao đổi giữa trình duyệt và máy chủ web.' },
    { id: 'c2_mcq_10', q: 'Trong bộ giao thức TCP/IP, giao thức TCP (Transmission Control Protocol) đảm nhận vai trò gì?', opts: ['Định tuyến các gói tin qua các mạng khác nhau.', 'Thiết lập kết nối, phân chia dữ liệu thành các gói tin và đảm bảo truyền dữ liệu tin cậy, đúng thứ tự.', 'Chuyển đổi tín hiệu quang thành tín hiệu điện.', 'Gán địa chỉ vật lý cho card mạng.'], ans: 1, exp: 'TCP là giao thức hướng kết nối ở tầng Giao vận, kiểm soát luồng, đánh số gói tin và đảm bảo dữ liệu đến chính xác.' },
    { id: 'c2_mcq_11', q: 'Giao thức nào chuyên được sử dụng để truyền nhận các tệp tin (file) giữa máy khách và máy chủ qua mạng Internet?', opts: ['SMTP.', 'FTP.', 'POP3.', 'DHCP.'], ans: 1, exp: 'FTP là giao thức chuẩn dùng để tải lên và tải xuống tệp dữ liệu giữa client và server.' },
    { id: 'c2_mcq_12', q: 'Đâu là đặc điểm nổi bật của mạng diện rộng (WAN - Wide Area Network)?', opts: ['Phạm vi địa lý nhỏ hẹp trong một phòng học.', 'Kết nối các máy tính trong phạm vi địa lý rộng lớn như giữa các tỉnh thành, quốc gia hay toàn cầu.', 'Không cần thiết bị định tuyến Router.', 'Tốc độ truyền không bao giờ nghẽn mạng.'], ans: 1, exp: 'WAN liên kết các mạng LAN qua hạ tầng viễn thông trên phạm vi địa lý rộng. Internet là WAN toàn cầu.' },
    { id: 'c2_mcq_13', q: 'Mạng không dây WLAN (Wireless LAN) sử dụng phương thức truyền dẫn nào để kết nối các thiết bị?', opts: ['Cáp xoắn đôi UTP.', 'Cáp sợi quang.', 'Sóng vô tuyến (sóng Wi-Fi theo chuẩn IEEE 802.11).', 'Cáp đồng trục.'], ans: 2, exp: 'WLAN dùng sóng vô tuyến Wi-Fi để kết nối thiết bị người dùng với Access Point.' },
    { id: 'c2_mcq_14', q: 'Khi thực hiện chia sẻ thư mục trong mạng LAN nội bộ, thao tác nào sau đây giúp đảm bảo an toàn thông tin?', opts: ['Cấp quyền Everyone cho tất cả người dùng mà không đặt hạn chế.', 'Phân quyền truy cập cụ thể (Read/Write) cho đúng tài khoản được phép và thiết lập mật khẩu.', 'Tắt tường lửa hệ thống.', 'Rút dây cáp mạng sau khi chia sẻ.'], ans: 1, exp: 'Cần áp dụng nguyên tắc phân quyền tối thiểu, cấp đúng quyền cho đúng tài khoản được phép.' },
    { id: 'c2_mcq_15', q: 'Tính năng Mobile Hotspot trên điện thoại thông minh cho phép thiết bị thực hiện vai trò gì?', opts: ['Trở thành một Modem cáp quang viễn thông.', 'Trở thành một Điểm truy cập Wi-Fi (Access Point) chia sẻ kết nối Internet di động cho các thiết bị xung quanh.', 'Tăng dung lượng bộ nhớ RAM cho máy tính.', 'Thay đổi giao diện hệ điều hành.'], ans: 1, exp: 'Mobile Hotspot biến điện thoại thành điểm phát Wi-Fi tạm thời, chia sẻ kết nối dữ liệu di động cho thiết bị khác.' },
    { id: 'c2_mcq_16', q: 'Khi thiết lập tính năng chia sẻ máy in (Print Sharing) trong mạng LAN, phát biểu nào sau đây là ĐÚNG?', opts: ['Tất cả các máy tính đều phải cắm dây USB trực tiếp vào máy in.', 'Máy tính kết nối trực tiếp với máy in (máy chủ in) phải bật nguồn và duy trì kết nối mạng LAN thì các máy khách mới in được.', 'Máy in không cần cài đặt trình điều khiển Driver.', 'Chỉ có duy nhất một máy tính được phép gửi lệnh in.'], ans: 1, exp: 'Máy kết nối trực tiếp với máy in đóng vai trò print server nên cần duy trì hoạt động và kết nối mạng.' },
    { id: 'c2_mcq_17', q: 'Cáp mạng xoắn đôi UTP sử dụng chuẩn đầu kết nối nào để cắm vào card mạng của máy tính hoặc cổng của Switch?', opts: ['Đầu nối USB Type-C.', 'Đầu nối RJ-45.', 'Đầu nối HDMI.', 'Đầu nối VGA.'], ans: 1, exp: 'RJ-45 là đầu nối 8 chân tiêu chuẩn của cáp Ethernet xoắn đôi UTP.' },
    { id: 'c2_mcq_18', q: 'Dịch vụ Internet gia đình hiện nay chủ yếu sử dụng công nghệ truyền dẫn nào để đạt tốc độ cao và ổn định?', opts: ['Cáp sợi quang (FTTH).', 'Dây cáp điện thoại đồng chuẩn cũ.', 'Tín hiệu hồng ngoại.', 'Sóng Bluetooth.'], ans: 0, exp: 'FTTH truyền tín hiệu ánh sáng qua sợi quang, có băng thông cao, ổn định và ít bị nhiễu điện từ.' },
    { id: 'c2_mcq_19', q: 'Hệ thống tên miền (DNS) mang lại lợi ích gì cho người sử dụng Internet?', opts: ['Tăng tốc độ xử lý phần cứng máy tính.', 'Giúp người dùng dễ dàng truy cập trang web bằng tên chữ thay vì nhớ địa chỉ IP bằng số phức tạp.', 'Tự động nâng cấp hệ điều hành.', 'Tăng dung lượng pin điện thoại.'], ans: 1, exp: 'DNS giúp người dùng dùng tên miền có ý nghĩa thay cho các dãy địa chỉ IP khó nhớ.' },
    { id: 'c2_mcq_20', q: 'Tầng nào trong mô hình TCP/IP chứa các giao thức tương tác trực tiếp với ứng dụng người dùng như HTTP, HTTPS, SMTP, FTP?', opts: ['Tầng Truy cập mạng.', 'Tầng Internet.', 'Tầng Giao vận.', 'Tầng Ứng dụng.'], ans: 3, exp: 'Tầng Ứng dụng định nghĩa các giao thức dịch vụ trực tiếp cho trình duyệt, phần mềm thư điện tử và truyền tệp.' }
  ],
  tf: [
    {
      id: 'c2_tf_1',
      ctx: 'Trường THPT X lắp đặt mạng nội bộ cho phòng máy gồm 40 máy trạm. Kỹ thuật viên dùng Switch 48 cổng kết nối các máy trạm, nối Switch vào Router rồi nối Router với Modem cáp quang. Máy chủ mạng bật dịch vụ DHCP.',
      items: [
        { s: 'Thiết bị Switch có vai trò kết nối 40 máy trạm tạo thành một mạng LAN nội bộ và liên lạc dựa trên địa chỉ MAC.', ans: true, exp: 'Switch hoạt động ở tầng liên kết dữ liệu và chuyển tiếp khung dữ liệu LAN dựa vào bảng MAC.' },
        { s: 'Nếu không có Router, các máy trạm trong phòng máy vẫn có thể truy cập nội dung các trang web trên Internet bình thường.', ans: false, exp: 'Router định tuyến và chuyển tiếp dữ liệu giữa LAN nội bộ với các mạng bên ngoài.' },
        { s: 'Dịch vụ DHCP trên máy chủ giúp tự động cấp phát địa chỉ IP tĩnh cố định vĩnh viễn cho từng máy trạm.', ans: false, exp: 'DHCP chủ yếu cấp phát địa chỉ IP động cùng các cấu hình mạng cần thiết.' },
        { s: 'Mỗi máy trạm trong phòng máy đều có duy nhất một địa chỉ MAC cố định do nhà sản xuất card mạng gán từ trước.', ans: true, exp: 'MAC là địa chỉ vật lý 48 bit được gán cho card mạng.' }
      ]
    },
    {
      id: 'c2_tf_2',
      ctx: 'Học sinh A truy cập cổng thông tin nhà trường. Trình duyệt hiển thị biểu tượng ổ khóa bên cạnh thanh địa chỉ. Trong quá trình truyền nhận dữ liệu, hệ thống sử dụng bộ giao thức TCP/IP.',
      items: [
        { s: 'Tiền tố https và biểu tượng ổ khóa xác nhận dữ liệu trao đổi giữa trình duyệt và máy chủ đã được mã hóa.', ans: true, exp: 'HTTPS dùng TLS để mã hóa dữ liệu truyền tải giữa trình duyệt và máy chủ.' },
        { s: 'Hệ thống DNS có nhiệm vụ dịch tên miền thành địa chỉ MAC của máy tính học sinh A.', ans: false, exp: 'DNS dịch tên miền thành địa chỉ IP của máy chủ, không phải địa chỉ MAC.' },
        { s: 'Giao thức TCP chịu trách nhiệm chia nhỏ dữ liệu thành các gói tin, đánh số thứ tự và đảm bảo truyền đủ gói tin.', ans: true, exp: 'TCP hướng kết nối, kiểm soát thứ tự và độ tin cậy của dữ liệu truyền.' },
        { s: 'Địa chỉ IPv4 của máy chủ trường học chỉ cần dùng 16 bit nhị phân để định danh trên Internet.', ans: false, exp: 'IPv4 có độ dài 32 bit nhị phân.' }
      ]
    },
    {
      id: 'c2_tf_3',
      ctx: 'Phòng làm việc gồm 5 máy tính kết nối chung mạng LAN. Máy tính quản lý kết nối trực tiếp với máy in qua USB, đồng thời bật chia sẻ máy in và thư mục dữ liệu cho nhân viên.',
      items: [
        { s: 'Các máy tính khác chỉ có thể in tài liệu nếu máy tính kết nối trực tiếp máy in đang bật nguồn và kết nối LAN.', ans: true, exp: 'Máy kết nối trực tiếp là máy chủ in. Nếu máy này tắt, các máy trạm không thể dùng máy in chia sẻ.' },
        { s: 'Để quản lý an toàn, người quản lý nên cấp quyền kiểm soát toàn bộ cho tất cả mọi người đối với thư mục chia sẻ.', ans: false, exp: 'Cần phân quyền truy cập phù hợp thay vì cấp toàn quyền cho mọi người.' },
        { s: 'Việc chia sẻ máy in qua mạng LAN giúp tiết kiệm chi phí mua sắm thiết bị mà vẫn đáp ứng nhu cầu in ấn tập trung.', ans: true, exp: 'Chia sẻ tài nguyên phần cứng là một lợi ích quan trọng của mạng máy tính.' },
        { s: 'Các máy trạm khách muốn gửi lệnh in không cần cài đặt đúng trình điều khiển driver của máy in đó.', ans: false, exp: 'Máy trạm cần có driver tương thích để giao tiếp đúng với máy in.' }
      ]
    },
    {
      id: 'c2_tf_4',
      ctx: 'Thầy giáo dùng điện thoại bật dữ liệu di động 4G, kích hoạt Mobile Hotspot, đặt tên Wi-Fi và mật khẩu để học sinh kết nối máy tính bảng tra cứu thông tin.',
      items: [
        { s: 'Điện thoại của thầy giáo đang đóng vai trò như một Access Point không dây chia sẻ kết nối Internet di động.', ans: true, exp: 'Mobile Hotspot biến điện thoại thành điểm phát Wi-Fi cho các thiết bị khác.' },
        { s: 'Máy tính bảng của học sinh muốn kết nối vào Wi-Fi bắt buộc phải cắm thêm cáp mạng UTP vào điện thoại.', ans: false, exp: 'Hotspot dùng sóng vô tuyến Wi-Fi nên không cần cáp UTP.' },
        { s: 'Đặt mật khẩu bảo mật giúp kiểm soát quyền truy cập và bảo vệ dung lượng mạng di động.', ans: true, exp: 'Mật khẩu hạn chế thiết bị không được phép truy cập và sử dụng dữ liệu di động.' },
        { s: 'Tốc độ truy cập Internet của các máy tính bảng kết nối vào Hotspot không phụ thuộc vào chất lượng sóng 4G.', ans: false, exp: 'Tốc độ kết nối phụ thuộc trực tiếp vào chất lượng và tốc độ dữ liệu di động của điện thoại phát.' }
      ]
    }
  ]
};
