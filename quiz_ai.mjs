// ============================================================
//  BÀI LÀM ÔN TẬP - CHỦ ĐỀ 1: GIỚI THIỆU TRÍ TUỆ NHÂN TẠO (AI)
//  Chạy:  node quiz_ai.mjs        (cần Node.js 16+)
//  Gồm: Phần I (20 câu trắc nghiệm A/B/C/D) + Phần II (4 câu Đúng/Sai, mỗi câu 4 ý)
//  Làm xong sẽ tự chấm điểm, liệt kê câu sai kèm giải thích.
// ============================================================
import readline from "node:readline";

// ---------- DỮ LIỆU CÂU HỎI (lấy từ file .docx) ----------
export const DATA = {
 "mcq": [
  {
   "q": "Phương án nào sau đây nêu đúng nhất khái niệm về Trí tuệ nhân tạo (AI)?",
   "opts": [
    "Một lĩnh vực khoa học nhằm chế tạo ra các máy móc thông minh hoạt động hoàn toàn độc lập với con người.",
    "Hệ thống được xây dựng và lập trình bởi con người để máy tính có khả năng thực hiện các hành vi thông minh tương tự như con người.",
    "Một loại phần mềm giúp máy tính tự động hóa các công việc cơ học đơn giản.",
    "Thuật toán tính toán siêu tốc giúp máy tính lưu trữ lượng dữ liệu khổng lồ."
   ],
   "ans": 1,
   "exp": "Theo tài liệu hướng dẫn ôn thi THPTQG và SGK Tin học 12, AI là hệ thống được xây dựng và lập trình bởi con người để máy tính thực hiện các hành vi thông minh như đọc văn bản, hiểu tiếng nói, nhận biết môi trường và ra quyết định."
  },
  {
   "q": "Khả năng nào sau đây KHÔNG phải là một trong 5 đặc trưng cơ bản của AI?",
   "opts": [
    "Khả năng suy luận.",
    "Khả năng học.",
    "Khả năng cảm nhận mùi vị.",
    "Khả năng nhận thức."
   ],
   "ans": 2,
   "exp": "5 đặc trưng cơ bản của AI gồm: Khả năng Học, Suy luận, Nhận thức, Hiểu ngôn ngữ tự nhiên và Giải quyết vấn đề. AI không có khả năng cảm nhận vị giác/mùi vị tự nhiên như con người."
  },
  {
   "q": "Phương án nào dưới đây liệt kê hai phân loại chính của Trí tuệ nhân tạo (AI)?",
   "opts": [
    "AI Hẹp (ANI) và AI Siêu thông minh (ASI).",
    "AI Hẹp (ANI) và AI Tổng quát (AGI).",
    "AI Tổng quát (AGI) và AI Tự học (ALI).",
    "AI Tổng quát (AGI) và AI Siêu thông minh (ASI)."
   ],
   "ans": 1,
   "exp": "Theo chuẩn kiến thức GDPT 2018, AI được phân thành 2 loại chính theo phạm vi năng lực: AI Hẹp (ANI - Artificial Narrow Intelligence) và AI Tổng quát (AGI - Artificial General Intelligence)."
  },
  {
   "q": "Phát biểu nào dưới đây mô tả chính xác nhất về Trí tuệ nhân tạo hẹp (ANI)?",
   "opts": [
    "Có khả năng tự chuyển đổi linh hoạt để giải quyết mọi nhiệm vụ khác nhau như con người.",
    "Có khả năng cảm nhận cảm xúc và bày tỏ sự thấu hiểu tâm lý con người.",
    "Được thiết kế để giải quyết nhiệm vụ cụ thể theo những gì đã được huấn luyện.",
    "Hoạt động hoàn toàn không cần dữ liệu đầu vào từ con người."
   ],
   "ans": 2,
   "exp": "AI hẹp (yếu) được xây dựng để thực hiện một hoặc một số nhiệm vụ cụ thể giới hạn trong lĩnh vực được huấn luyện (như chơi cờ, nhận diện khuôn mặt, lọc thư rác)."
  },
  {
   "q": "Đặc trưng 'Khả năng suy luận' của AI được thể hiện rõ nhất qua hành vi nào dưới đây?",
   "opts": [
    "Trích xuất thông tin từ dữ liệu để tích lũy tri thức mới.",
    "Sử dụng cảm biến để đo nhiệt độ và khoảng cách vật thể xung quanh.",
    "Vận dụng logic và tri thức sẵn có để đưa ra quyết định hoặc kết luận.",
    "Đọc và dịch chính xác một đoạn văn bản tiếng Anh sang tiếng Việt."
   ],
   "ans": 2,
   "exp": "Khả năng suy luận là việc hệ thống vận dụng tri thức và logic để phân tích dữ liệu, từ đó đưa ra quyết định hoặc chẩn đoán (ví dụ: hệ thống chẩn đoán y tế chẩn đoán bệnh dựa trên triệu chứng)."
  },
  {
   "q": "Hệ thống khuyến nghị video trên YouTube sử dụng đặc trưng nào của AI để đề xuất các video phù hợp với người dùng?",
   "opts": [
    "Khả năng vận động cơ học.",
    "Khả năng học từ lịch sử xem và tương tác của người dùng.",
    "Khả năng tự sửa lỗi phần cứng máy tính.",
    "Khả năng nhận biết mùi vị thực phẩm."
   ],
   "ans": 1,
   "exp": "Hệ thống khuyến nghị áp dụng khả năng học từ dữ liệu hành vi quá khứ của người dùng để điều chỉnh và gợi ý danh sách nội dung phù hợp nhất."
  },
  {
   "q": "Thiết bị nào sau đây thường xuyên được tích hợp trợ lý ảo (Virtual Assistant)?",
   "opts": [
    "Máy rút tiền tự động ATM.",
    "Điện thoại thông minh (Smartphone).",
    "Chuông báo cháy tự động.",
    "Máy quét mã vạch siêu thị."
   ],
   "ans": 1,
   "exp": "Trợ lý ảo (như Siri, Google Assistant, Bixby) là phần mềm AI được tích hợp phổ biến trên điện thoại thông minh, máy tính bảng và loa thông minh."
  },
  {
   "q": "Ứng dụng nào sau đây KHÔNG phải là một ví dụ về AI hẹp (ANI)?",
   "opts": [
    "Chương trình chơi cờ AlphaGo của DeepMind.",
    "Phần mềm quản lý điểm học sinh bằng sổ điểm điện tử Excel.",
    "Hệ thống chấm công bằng công nghệ nhận diện khuôn mặt.",
    "Hệ chuyên gia y tế MYCIN tư vấn kê đơn thuốc."
   ],
   "ans": 1,
   "exp": "Sổ điểm điện tử thông thường chỉ là phần mềm quản lý dữ liệu lập trình theo quy tắc cố định, không có các đặc trưng tự học hay suy luận của AI."
  },
  {
   "q": "Sự kiện lịch sử nào đánh dấu cột mốc chính thức ra đời của thuật ngữ 'Trí tuệ nhân tạo' (Artificial Intelligence)?",
   "opts": [
    "Phép thử Turing được công bố năm 1950.",
    "Hội thảo khoa học tại Đại học Dartmouth năm 1956.",
    "Sự ra đời của hệ chuyên gia MYCIN năm 1972.",
    "Trận đấu cờ vua giữa Deep Blue và Kasparov năm 1997."
   ],
   "ans": 1,
   "exp": "Hội thảo Dartmouth năm 1956 do John McCarthy và các nhà khoa học tổ chức là sự kiện chính thức khai sinh thuật ngữ Trí tuệ nhân tạo (AI)."
  },
  {
   "q": "Robot Asimo của tập đoàn Honda là ví dụ điển hình về ứng dụng AI trong lĩnh vực nào?",
   "opts": [
    "Quản trị cơ sở dữ liệu quan hệ.",
    "Robot thông minh và kỹ thuật điều khiển tự động.",
    "Thiết kế đồ họa trang web HTML/CSS.",
    "Chế tạo linh kiện vi xử lý."
   ],
   "ans": 1,
   "exp": "Robot Asimo (ra mắt năm 1986/2000) kết hợp AI trong thị giác máy tính và nhận dạng giọng nói để điều khiển chuyển động và tương tác với con người."
  },
  {
   "q": "Khái niệm 'Hộp đen' (Black Box) khi nói về nguy cơ của AI phản ánh thách thức nào?",
   "opts": [
    "Máy tính có màu đen gây mất thẩm mỹ.",
    "Sự thiếu minh bạch trong quy trình ra quyết định của các mô hình AI phức tạp, gây khó khăn cho việc giải trình.",
    "Dữ liệu bị rò rỉ ra ngoài qua cổng mạng USB.",
    "AI bị mất nguồn điện đột ngột khi đang vận hành."
   ],
   "ans": 1,
   "exp": "Tính chất 'hộp đen' của AI nghĩa là các thuật toán học sâu xử lý hàng triệu tham số bên trong khiến con người khó giải thích được lý do cụ thể vì sao AI đưa ra kết luận đó."
  },
  {
   "q": "Công nghệ AI tạo sinh (Generative AI - như ChatGPT) tập trung chính vào khả năng nào?",
   "opts": [
    "Tự động sửa chữa phần cứng đĩa cứng HDD.",
    "Tạo ra các nội dung mới như văn bản, hình ảnh, âm thanh hoặc đoạn mã lập trình dựa trên dữ liệu huấn luyện.",
    "Tăng tốc độ đường truyền mạng cáp quang.",
    "Cài đặt hệ điều hành cho máy tính cá nhân."
   ],
   "ans": 1,
   "exp": "AI tạo sinh (Generative AI) sử dụng các mô hình học sâu để sáng tạo ra dữ liệu mới (văn bản, tranh vẽ, nhạc, code) dựa trên các mẫu đã học."
  },
  {
   "q": "Sự phát triển nhanh chóng của AI kéo theo nguy cơ nào đối với thị trường lao động?",
   "opts": [
    "Làm tăng tỷ lệ thiếu hụt nhân lực trong các công việc thủ công đơn giản.",
    "Gây áp lực thất nghiệp do AI và robot tự động hóa có thể thay thế con người trong các công việc lặp đi lặp lại.",
    "Tăng chi phí lương cho tất cả các ngành nghề truyền thống.",
    "Bắt buộc tất cả công nhân phải nghỉ hưu sớm."
   ],
   "ans": 1,
   "exp": "AI có khả năng tự động hóa cao nên dễ dàng thay thế con người ở các vị trí công việc có tính chất lặp lại, định hình theo quy tắc cố định."
  },
  {
   "q": "Loại hình lừa đảo công nghệ cao nào dưới đây sử dụng AI để giả mạo khuôn mặt và giọng nói của người thân nhằm mục đích chiếm đoạt tài sản?",
   "opts": [
    "Virus Ransomware mã hóa tệp.",
    "Công nghệ Deepfake.",
    "Dịch vụ lưu trữ đám mây Cloud.",
    "Thẻ nhớ SD dung lượng cao."
   ],
   "ans": 1,
   "exp": "Deepfake sử dụng kỹ thuật học sâu AI để tạo ra hình ảnh, video hoặc âm thanh giả mạo giống hệt người thật để lừa đảo."
  },
  {
   "q": "Phát biểu nào sau đây đúng khi so sánh giữa AI và Hệ thống tự động hóa truyền thống?",
   "opts": [
    "Hệ thống tự động hóa truyền thống có khả năng tự học từ dữ liệu mới.",
    "AI chỉ hoạt động dựa trên rơ-le cơ học ngắt mở.",
    "Tự động hóa truyền thống hoạt động theo quy tắc cố định được lập trình sẵn, trong khi AI kết hợp các đặc trưng trí tuệ (như tự học, suy luận) để xử lý tình huống phức tạp.",
    "Cả hai đều có khả năng hiểu ngôn ngữ tự nhiên như nhau."
   ],
   "ans": 2,
   "exp": "Hệ thống tự động hóa (như ấm đun nước tự ngắt) chỉ vận hành theo kịch bản cứng, còn AI có khả năng học hỏi và ứng biến linh hoạt dựa trên dữ liệu."
  },
  {
   "q": "Trợ lý ảo Siri là sản phẩm do công ty công nghệ nào phát triển?",
   "opts": [
    "Microsoft.",
    "Google.",
    "Apple.",
    "Samsung."
   ],
   "ans": 2,
   "exp": "Siri là trợ lý ảo tích hợp trên các thiết bị hệ điều hành iOS/macOS thuộc Apple."
  },
  {
   "q": "Yếu tố nào sau đây là nguyên nhân chính có thể dẫn đến hiện tượng 'Thành kiến/Thiên lệch' (Bias) trong kết quả chẩn đoán của một hệ thống AI y tế?",
   "opts": [
    "Mạng Internet bị ngắt kết nối trong lúc vận hành.",
    "Dữ liệu huấn luyện ban đầu thiếu tính đa dạng, chỉ tập trung vào một nhóm sắc tộc hoặc độ tuổi nhất định.",
    "Máy tính bị thiếu dung lượng bộ nhớ RAM.",
    "Bác sĩ không bật camera khi làm việc."
   ],
   "ans": 1,
   "exp": "AI học hoàn toàn từ dữ liệu. Nếu dữ liệu huấn luyện thiên lệch hoặc không bao quát, mô hình sẽ đưa ra các dự đoán mang tính thiên lệch đối với các nhóm đối tượng thiếu dữ liệu."
  },
  {
   "q": "Hệ chuyên gia MYCIN ra đời năm 1972 tại Đại học Stanford được ứng dụng trong lĩnh vực nào?",
   "opts": [
    "Dự báo thời tiết và thiên tai.",
    "Tư vấn chẩn đoán các bệnh nhiễm trùng máu và đề xuất liều lượng kháng sinh trong y tế.",
    "Lập kịch bản chơi trò chơi điện tử.",
    "Định tuyến luồng xe giao thông."
   ],
   "ans": 1,
   "exp": "MYCIN là hệ chuyên gia điển hình sử dụng khoảng 600 luật suy diễn để hỗ trợ bác sĩ chẩn đoán vi khuẩn gây nhiễm trùng máu."
  },
  {
   "q": "Thẻ nhận dạng vân tay hoặc khuôn mặt dùng để mở khóa điện thoại thông minh là ứng dụng của AI trong lĩnh vực nào?",
   "opts": [
    "Xử lý ngôn ngữ tự nhiên.",
    "Thị giác máy tính và nhận dạng sinh trắc học.",
    "Quản lý kho hàng siêu thị.",
    "Lập lịch sản xuất công nghiệp."
   ],
   "ans": 1,
   "exp": "Nhận dạng khuôn mặt/vân tay áp dụng kỹ thuật Thị giác máy tính (Computer Vision) để phân tích đặc trưng hình ảnh sinh trắc học."
  },
  {
   "q": "Phát biểu nào sau đây nêu đúng về tương lai phát triển của AI đối với công việc con người?",
   "opts": [
    "AI sẽ thay thế hoàn toàn con người trong tất cả mọi ngành nghề sản xuất.",
    "AI sẽ lấy đi một số công việc lặp đi lặp lại nhưng đồng thời mở ra các cơ hội việc làm mới đòi hỏi kỹ năng cao hơn.",
    "AI không có bất kỳ ảnh hưởng nào đến cấu trúc lao động xã hội.",
    "AI làm giảm nhu cầu học tập kiến thức CNTT của học sinh."
   ],
   "ans": 1,
   "exp": "AI giúp tự động hóa công việc đơn giản, đồng thời thúc đẩy sự xuất hiện của các ngành nghề mới liên quan đến phát triển, quản lý và kiểm soát AI."
  }
 ],
 "tf": [
  {
   "ctx": "Một bệnh viện đa khoa triển khai ứng dụng hệ thống Trí tuệ nhân tạo (AI) nhằm hỗ trợ công tác chẩn đoán và điều trị bệnh cho bệnh nhân. Hệ thống được tích hợp thuật toán phân tích ảnh y khoa (X-quang, MRI) và mô hình chatbot tư vấn sức khỏe ban đầu.",
   "items": [
    {
     "s": "Hệ thống AI có thể hỗ trợ phân tích tổn thương trên ảnh X-quang giúp bác sĩ chẩn đoán bệnh chính xác và nhanh chóng hơn.",
     "ans": true,
     "exp": "AI hỗ trợ xử lý hình ảnh y khoa xuất sắc giúp nâng cao hiệu quả chẩn đoán."
    },
    {
     "s": "Hệ thống AI có thể hoàn toàn tự động kê đơn thuốc đặc trị và tiến hành phẫu thuật mà không cần bất kỳ sự giám sát nào của bác sĩ chuyên khoa.",
     "ans": false,
     "exp": "AI hiện nay chỉ đóng vai trò hỗ trợ, quyết định y tế sinh mạng bắt buộc phải do bác sĩ con người chịu trách nhiệm."
    },
    {
     "s": "Chatbot tư vấn y tế có thể trả lời các thắc mắc ban đầu của bệnh nhân nhờ áp dụng khả năng hiểu ngôn ngữ tự nhiên (NLP).",
     "ans": true,
     "exp": "Chatbot ứng dụng NLP để hiểu văn bản/tiếng nói và đưa ra phản hồi phù hợp."
    },
    {
     "s": "Nếu dữ liệu huấn luyện AI chỉ thu thập từ bệnh nhân nam giới, mô hình có thể đưa ra kết quả thiếu chính xác đối với bệnh nhân nữ giới do thách thức thiên lệch dữ liệu (Bias).",
     "ans": true,
     "exp": "Dữ liệu huấn luyện không đa dạng sẽ gây ra hiện tượng thiên lệch kết quả đối với các nhóm đối tượng bị thiếu dữ liệu."
    }
   ]
  },
  {
   "ctx": "Trong buổi thảo luận chuyên đề 'Sự phát triển của AI và tác động xã hội', các bạn học sinh lớp 12 đưa ra một số nhận định về đặc trưng, phân loại và nguy cơ tiềm ẩn của Trí tuệ nhân tạo.",
   "items": [
    {
     "s": "Trợ lý ảo trên điện thoại thông minh là một ví dụ điển hình về AI hẹp (ANI) vì nó chỉ hoạt động trong phạm vi các tác vụ được thiết lập sẵn.",
     "ans": true,
     "exp": "Trợ lý ảo hiện nay thuộc nhóm AI hẹp."
    },
    {
     "s": "Sự phát triển của AI không gây ra bất kỳ rò rỉ hay rủi ro nào đối với quyền riêng tư cá nhân của người dùng trên Internet.",
     "ans": false,
     "exp": "AI hoạt động dựa trên thu thập lượng lớn dữ liệu cá nhân nên tiềm ẩn rủi ro xâm phạm quyền riêng tư nghiêm trọng."
    },
    {
     "s": "Công nghệ Deepfake tạo hình ảnh và giọng nói giả mạo là một ví dụ về mặt trái của ứng dụng AI trong an toàn thông tin.",
     "ans": true,
     "exp": "Deepfake bị lạm dụng để giả mạo lừa đảo gây mất an ninh mạng."
    },
    {
     "s": "Trong tương lai gần, AI hẹp có khả năng tự động bộc lộ cảm xúc vui buồn và biết yêu thương như con người.",
     "ans": false,
     "exp": "AI không có cảm xúc tự nhiên; biểu hiện cảm xúc nghệ thuật là đặc trưng trí tuệ con người mà AI chưa thể thực hiện."
    }
   ]
  },
  {
   "ctx": "Năm 1997, siêu máy tính Deep Blue của IBM đánh bại đại kiện tướng cờ vua thế giới Garry Kasparov. Năm 2016, chương trình AlphaGo của Google tiếp tục đánh bại nhà vô địch cờ đao Lee Sedol.",
   "items": [
    {
     "s": "AlphaGo và Deep Blue là minh chứng cho thấy máy tính có khả năng suy luận và học hỏi để xử lý các bài toán đòi hỏi trí tuệ cao.",
     "ans": true,
     "exp": "Các chương trình chơi cờ ứng dụng thuật toán tìm kiếm, suy luận và học máy."
    },
    {
     "s": "AlphaGo có thể tự động chuyển sang chẩn đoán bệnh ung thư hoặc lái xe ô tô mà không cần huấn luyện lại từ đầu.",
     "ans": false,
     "exp": "AlphaGo là AI hẹp, chỉ giải quyết bài toán chơi cờ thố, không tự chuyển sang lĩnh vực khác."
    },
    {
     "s": "Chiến thắng của AlphaGo dựa trên việc phân tích hàng triệu nước đi lịch sử và tự đấu với chính nó để tích lũy tri thức.",
     "ans": true,
     "exp": "AlphaGo áp dụng học máy và học tăng cường từ dữ liệu trận đấu."
    },
    {
     "s": "Việc máy tính thắng con người trong chơi cờ khẳng định máy tính đã đạt tới trình độ AI siêu thông minh (ASI) hoàn chỉnh.",
     "ans": false,
     "exp": "Thắng cờ chỉ là thành tựu của AI hẹp trong một lĩnh vực hẹp cụ thể."
    }
   ]
  },
  {
   "ctx": "Một trường THPT tổ chức khảo sát việc ứng dụng phần mềm AI trong học tập. Học sinh sử dụng các công cụ như ChatGPT để tìm kiếm tài liệu, tóm tắt bài giảng và hỗ trợ viết đoạn mã lập trình Python.",
   "items": [
    {
     "s": "ChatGPT sử dụng mô hình ngôn ngữ lớn có khả năng hiểu ngữ cảnh và hội thoại tương tác tự nhiên với học sinh.",
     "ans": true,
     "exp": "ChatGPT là ứng dụng NLP tiên tiến có tương tác hội thoại cao."
    },
    {
     "s": "Học sinh có thể hoàn toàn tin tưởng 100% vào mọi câu trả lời của ChatGPT mà không cần kiểm chứng lại thông tin.",
     "ans": false,
     "exp": "AI có thể đưa ra thông tin sai lệch hoặc bị hiện tượng 'ảo giác' (hallucination) nên cần kiểm chứng."
    },
    {
     "s": "Sử dụng ChatGPT để tạo văn bản giả mạo hoặc gian lận trong thi cử là hành vi vi phạm đạo đức học thuật.",
     "ans": true,
     "exp": "Lạm dụng AI gian lận vi phạm đạo đức và quy chế học đường."
    },
    {
     "s": "ChatGPT có khả năng đọc hiểu mã nguồn Python và phát hiện lỗi cú pháp để gợi ý sửa lỗi cho học sinh.",
     "ans": true,
     "exp": "ChatGPT hỗ trợ lập trình, giải thích và sửa lỗi mã nguồn hiệu quả."
    }
   ]
  }
 ]
};

// ---------- MÀU TERMINAL ----------
const c = (code) => (s) => `\x1b[${code}m${s}\x1b[0m`;
const xanh = c(32), do_ = c(31), vang = c(33), lam = c(36), dam = c(1), mo = c(2);

// ---------- NHẬP LIỆU ----------
let rl = null, dong = null;
function getInterface() {
  if (!rl) {
    rl = readline.createInterface({ input: process.stdin, terminal: false });
    dong = rl[Symbol.asyncIterator]();
  }
  return { rl, dong };
}
async function hoi(prompt) {
  const { dong } = getInterface();
  process.stdout.write(prompt);
  const { value, done } = await dong.next();
  return done ? null : value.trim();
}

// ---------- LÀM BÀI ----------
async function lamPhan1() {
  console.log(dam(lam("\n===== PHẦN I: TRẮC NGHIỆM (chọn A/B/C/D, Enter = bỏ qua) =====")));
  const traLoi = [];
  for (let i = 0; i < DATA.mcq.length; i++) {
    const q = DATA.mcq[i];
    console.log(`\n${dam(`Câu ${i + 1}:`)} ${q.q}`);
    q.opts.forEach((o, k) => console.log(`  ${"ABCD"[k]}. ${o}`));
    let chon = null;
    while (true) {
      const s = await hoi("Đáp án của bạn: ");
      if (s === null) { chon = null; break; }         // hết input
      const u = s.toUpperCase();
      if (u === "") { chon = null; break; }            // bỏ qua
      if ("ABCD".includes(u) && u.length === 1) { chon = "ABCD".indexOf(u); break; }
      console.log(vang("  → Chỉ nhập A, B, C hoặc D."));
    }
    traLoi.push(chon);
  }
  return traLoi;
}

// nhận: d / đ / t / true / đúng  => true ;  s / f / sai => false
function docDS(s) {
  const u = s.toLowerCase();
  if (["d", "đ", "t", "đúng", "dung", "true"].includes(u)) return true;
  if (["s", "f", "sai", "false"].includes(u)) return false;
  return undefined;
}

async function lamPhan2() {
  console.log(dam(lam("\n===== PHẦN II: ĐÚNG / SAI (nhập Đ hoặc S, Enter = bỏ qua) =====")));
  const traLoi = [];
  for (let i = 0; i < DATA.tf.length; i++) {
    const q = DATA.tf[i];
    console.log(`\n${dam(`Câu ${i + 1}:`)} ${q.ctx}`);
    const ds = [];
    for (let k = 0; k < q.items.length; k++) {
      console.log(`  ${"abcd"[k]}) ${q.items[k].s}`);
      let chon = null;
      while (true) {
        const s = await hoi("     Đúng hay Sai? (Đ/S): ");
        if (s === null || s === "") { chon = null; break; }
        const v = docDS(s);
        if (v !== undefined) { chon = v; break; }
        console.log(vang("     → Chỉ nhập Đ (đúng) hoặc S (sai)."));
      }
      ds.push(chon);
    }
    traLoi.push(ds);
  }
  return traLoi;
}

// ---------- CHẤM ĐIỂM ----------
// Mỗi câu trắc nghiệm = 1 điểm, mỗi ý Đúng/Sai = 1 điểm  → quy về thang 10.
export function chamDiem(tl1, tl2) {
  const sai1 = [], sai2 = [];
  let dung = 0, tong = 0;

  DATA.mcq.forEach((q, i) => {
    tong++;
    if (tl1[i] === q.ans) dung++;
    else sai1.push({ so: i + 1, q, chon: tl1[i] });
  });

  DATA.tf.forEach((q, i) => {
    q.items.forEach((it, k) => {
      tong++;
      if (tl2[i][k] === it.ans) dung++;
      else sai2.push({ cau: i + 1, y: "abcd"[k], it, chon: tl2[i][k] });
    });
  });

  return { dung, tong, diem10: Math.round((dung / tong) * 100) / 10, sai1, sai2 };
}

// ---------- HIỂN THỊ KẾT QUẢ ----------
const tenDS = (v) => (v === null ? "bỏ trống" : v ? "ĐÚNG" : "SAI");

function inKetQua(kq) {
  console.log(dam(lam("\n==================== KẾT QUẢ ====================")));
  console.log(`Số câu/ý đúng: ${dam(`${kq.dung}/${kq.tong}`)}`);
  const mau = kq.diem10 >= 8 ? xanh : kq.diem10 >= 5 ? vang : do_;
  console.log(`Điểm (thang 10): ${dam(mau(kq.diem10.toFixed(1)))}`);

  if (!kq.sai1.length && !kq.sai2.length) {
    console.log(xanh(dam("\n🎉 Tuyệt vời! Bạn làm đúng toàn bộ.")));
    return;
  }

  console.log(dam(do_(`\n----- CÁC CÂU SAI (${kq.sai1.length + kq.sai2.length}) VÀ GIẢI THÍCH -----`)));

  for (const s of kq.sai1) {
    console.log(`\n${dam(`[Phần I - Câu ${s.so}]`)} ${s.q.q}`);
    console.log(`  Bạn chọn : ${do_(s.chon === null ? "bỏ trống" : "ABCD"[s.chon] + ". " + s.q.opts[s.chon])}`);
    console.log(`  Đáp án   : ${xanh("ABCD"[s.q.ans] + ". " + s.q.opts[s.q.ans])}`);
    console.log(`  Giải thích: ${s.q.exp}`);
  }

  for (const s of kq.sai2) {
    console.log(`\n${dam(`[Phần II - Câu ${s.cau}, ý ${s.y})]`)} ${s.it.s}`);
    console.log(`  Bạn chọn : ${do_(tenDS(s.chon))}`);
    console.log(`  Đáp án   : ${xanh(tenDS(s.it.ans))}`);
    console.log(`  Giải thích: ${s.it.exp}`);
  }
}

// ---------- CHẠY ----------
async function main() {
  console.log(dam("ÔN TẬP CHỦ ĐỀ 1: GIỚI THIỆU TRÍ TUỆ NHÂN TẠO (AI)"));
  console.log(mo("Phần I: 20 câu trắc nghiệm | Phần II: 4 câu Đúng/Sai (16 ý). Làm xong tự chấm điểm."));
  const tl1 = await lamPhan1();
  const tl2 = await lamPhan2();
  inKetQua(chamDiem(tl1, tl2));
  rl.close();
}

// Chỉ chạy main khi được gọi trực tiếp qua dòng lệnh: node quiz_ai.mjs
if (process.argv[1] && process.argv[1].endsWith('quiz_ai.mjs')) {
  main();
}
