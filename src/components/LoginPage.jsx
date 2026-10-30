import React, { useState, useEffect } from 'react';
import { ShieldCheck, BookOpen, Brain, ArrowRight, Trophy, X, FileText, Lock, Users, Bot, Scale, AlertTriangle, Mail } from 'lucide-react';
import { supabase } from '../supabase';
import logoMeoCam from '../../img/logomeocam.png';

const FEATURES = [
  { icon: BookOpen, label: 'Kho đề thi chuẩn cấu trúc mới của Bộ GD&ĐT', color: '#EA580C' },
  { icon: Brain, label: 'AI ra đề thích nghi và chấm điểm phân hóa', color: '#FBBF24' },
  //{ icon: Trophy, label: 'Giúp bạn đạt thành tích cao trong kì thi', color: '#16A34A' }, //
];

const STATS = [
  //{ value: '1,200+', label: 'Câu hỏi chuẩn Bộ' },
  //{ value: '98%', label: 'Học viên đạt ≥8' },
  //{ value: 'AI', label: 'Đề thích nghi' },
];

function GoogleGLogo({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12c0 1.97.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

/* ─── Terms & Privacy Modal ─── */
function TermsPrivacyModal({ isOpen, onClose, initialTab = 'terms' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="terms-modal-overlay" onClick={handleBackdropClick}>
      <div className="terms-modal-container">
        {/* Header */}
        <div className="terms-modal-header">
          <div className="terms-modal-header-left">
            <div className="terms-modal-logo">
              <img src={logoMeoCam} alt="MewTinHoc" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
            </div>
            <div>
              <div className="terms-modal-brand">MewTinHoc</div>
              <div className="terms-modal-date">Có hiệu lực từ 30/10/2026</div>
            </div>
          </div>
          <button className="terms-modal-close" onClick={onClose} aria-label="Đóng">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="terms-modal-tabs">
          <button
            className={`terms-modal-tab ${activeTab === 'terms' ? 'active' : ''}`}
            onClick={() => setActiveTab('terms')}
          >
            <FileText size={15} />
            <span>Điều khoản sử dụng</span>
          </button>
          <button
            className={`terms-modal-tab ${activeTab === 'privacy' ? 'active' : ''}`}
            onClick={() => setActiveTab('privacy')}
          >
            <Lock size={15} />
            <span>Chính sách bảo mật</span>
          </button>
        </div>

        {/* Content */}
        <div className="terms-modal-body">
          {activeTab === 'terms' ? <TermsContent /> : <PrivacyContent />}
        </div>

        {/* Footer */}
        <div className="terms-modal-footer">
          <button className="terms-modal-accept-btn" onClick={onClose}>
            Tôi đã đọc và hiểu
          </button>
        </div>
      </div>
    </div>
  );
}

/* Section component for consistent styling */
function Section({ icon: Icon, number, title, children, color = '#EA580C' }) {
  return (
    <div className="terms-section">
      <div className="terms-section-header">
        <div className="terms-section-icon" style={{ background: `${color}14`, color }}>
          <Icon size={16} />
        </div>
        <h3 className="terms-section-title">{number}. {title}</h3>
      </div>
      <div className="terms-section-content">
        {children}
      </div>
    </div>
  );
}

function TermsContent() {
  return (
    <div className="terms-content">
      <div className="terms-intro">
        <p>
          MewTinHoc là website hỗ trợ ôn thi THPTQG môn Tin học (Lộ trình học, Kho đề thi, Tạo bài thi thử và đánh giá bằng AI); khi truy cập hoặc đăng ký tài khoản, bạn đồng ý với các điều khoản dưới đây.
        </p>
      </div>

      <Section icon={FileText} number={1} title="Điều khoản sử dụng" color="#EA580C">
        <p>Bạn chỉ được dùng MewTinHoc để học tập, ôn thi cá nhân và không được dùng sai mục đích dưới đây.</p>

        <div className="terms-subsection">
          <h4>1. Đối tượng</h4>
          <p>Học sinh, giáo viên và người tự học môn Tin học THPTQG. Người dưới 18 tuổi xem thêm Mục 3.</p>
        </div>

        <div className="terms-subsection">
          <h4>2. Tài khoản</h4>
          <p>Bạn cung cấp thông tin đúng, tự bảo mật tài khoản Google dùng để đăng nhập và chịu trách nhiệm về mọi hoạt động trong tài khoản của mình. Hãy báo ngay cho chúng tôi khi nghi ngờ bị lộ tài khoản.</p>
        </div>

        <div className="terms-subsection">
          <h4>3. Hành vi bị cấm</h4>
          <ul>
            <li>Tấn công, dò quét lỗ hổng, can thiệp trái phép vào hệ thống hoặc tài khoản người khác.</li>
            <li>Dùng bot, công cụ cào dữ liệu (crawl/scrape) để sao chép hàng loạt đề thi, câu hỏi hoặc nội dung của website khi chưa được phép bằng văn bản.</li>
            <li>Mua bán, chia sẻ tài khoản; dùng gian lận để lấy lợi thế (ví dụ spam yêu cầu AI, lách giới hạn sử dụng).</li>
            <li>Đăng tải nội dung vi phạm pháp luật, xâm phạm quyền người khác hoặc chứa mã độc.</li>
          </ul>
        </div>

        <div className="terms-subsection">
          <h4>4. Xử lý vi phạm</h4>
          <p>Chúng tôi có quyền cảnh báo, hạn chế hoặc khóa tài khoản vi phạm mà không cần báo trước trong trường hợp nghiêm trọng, và có thể phối hợp với cơ quan chức năng theo quy định pháp luật.</p>
        </div>
      </Section>

      <Section icon={Users} number={3} title="Người dùng dưới 18 tuổi" color="#7C3AED">
        <p>Vì phần lớn người dùng là học sinh, chúng tôi yêu cầu cha mẹ hoặc người giám hộ đồng ý khi người dùng là trẻ em.</p>
        <ul>
          <li>Luật Bảo vệ dữ liệu cá nhân 2025 coi người đại diện theo pháp luật là người thực hiện quyền thay mặt trẻ em; việc công bố dữ liệu cá nhân của trẻ từ 7 tuổi trở lên cần cả sự đồng ý của trẻ và người đại diện.</li>
          <li>Khi đăng ký, người dưới 18 tuổi cần xác nhận đã có sự đồng ý của cha mẹ/người giám hộ (tick xác nhận, hoặc nhập email phụ huynh để xác nhận).</li>
          <li>Chúng tôi không thu thập ảnh giấy tờ tùy thân, địa chỉ nhà hay số điện thoại của học sinh.</li>
          <li>Cha mẹ/người giám hộ có quyền yêu cầu xem, sửa, xóa dữ liệu hoặc rút lại sự đồng ý; khi đó chúng tôi ngừng xử lý dữ liệu của trẻ.</li>
          <li>Không hiển thị công khai tên thật, ảnh hoặc kết quả thi của học sinh (bảng xếp hạng chỉ dùng biệt danh, nếu có).</li>
        </ul>
      </Section>

      <Section icon={Bot} number={4} title="Chức năng AI (tạo bài thi thử và đánh giá)" color="#0891B2">
        <div className="terms-highlight-box terms-highlight-warning">
          AI chỉ là công cụ tham khảo, không thay thế giáo viên, đáp án chính thức hay đề thi của Bộ Giáo dục và Đào tạo.
        </div>
        <ul>
          <li><strong>Kết quả có thể sai:</strong> câu hỏi, đáp án và nhận xét do AI tạo ra có thể thiếu chính xác hoặc không sát cấu trúc đề thi thật. Hãy đối chiếu với sách giáo khoa và tài liệu chính thống.</li>
          <li><strong>Dữ liệu gửi cho AI:</strong> nội dung bài làm bạn nộp sẽ được gửi tới nhà cung cấp dịch vụ AI để xử lý. Không nhập thông tin cá nhân (họ tên, số điện thoại, địa chỉ, số CCCD) vào bài làm hay ô nhập AI.</li>
          <li><strong>Không dùng để huấn luyện:</strong> chúng tôi không bán và không dùng bài làm có thể nhận diện cá nhân để huấn luyện mô hình AI của bên thứ ba khi chưa có sự đồng ý của bạn.</li>
          <li><strong>Đánh giá không phải quyết định pháp lý:</strong> điểm và nhận xét của AI không ảnh hưởng đến quyền lợi hợp pháp của bạn. Bạn có thể yêu cầu xem xét lại bằng cách liên hệ theo Mục 7.</li>
          <li><strong>Giới hạn sử dụng:</strong> chúng tôi có thể đặt hạn mức số lần dùng AI mỗi ngày để bảo đảm hệ thống ổn định.</li>
        </ul>
      </Section>

      <Section icon={Scale} number={5} title="Sở hữu trí tuệ và kho đề thi" color="#D97706">
        <p>Nội dung do MewTinHoc tự biên soạn thuộc quyền của chúng tôi; đề thi và tài liệu của bên thứ ba vẫn thuộc chủ sở hữu của chúng.</p>
        <ul>
          <li>Giao diện, mã nguồn, logo, tên MewTinHoc, lộ trình học và nội dung tự biên soạn được bảo hộ theo Luật Sở hữu trí tuệ. Bạn được dùng cho mục đích học tập cá nhân, không được sao chép, bán lại hoặc đăng tải lại nếu chưa được phép.</li>
          <li>Đề thi chính thức của Bộ Giáo dục và Đào tạo và đề của các trường/sở thuộc quyền của chủ sở hữu. Kho đề chỉ lưu trữ để tham khảo, có ghi nguồn khi xác định được.</li>
          <li>Nếu bạn là chủ sở hữu và cho rằng nội dung trên website xâm phạm quyền của mình, hãy gửi thông báo kèm bằng chứng tới email ở Mục 7; chúng tôi sẽ xem xét và gỡ hoặc chỉnh sửa trong thời gian hợp lý.</li>
          <li>Nội dung bạn đóng góp (nếu có): bạn bảo đảm mình có quyền đăng tải và cho phép MewTinHoc dùng, hiển thị trên website cho mục đích vận hành dịch vụ.</li>
        </ul>
      </Section>

      <Section icon={AlertTriangle} number={6} title="Miễn trừ và giới hạn trách nhiệm" color="#DC2626">
        <div className="terms-highlight-box terms-highlight-info">
          MewTinHoc cung cấp dịch vụ theo hiện trạng và không cam kết kết quả thi của bạn.
        </div>
        <ul>
          <li>Chúng tôi không bảo đảm điểm số hay kết quả đỗ/trượt; nội dung chỉ mang tính hỗ trợ ôn tập và có thể có sai sót hoặc chưa cập nhật theo cấu trúc đề mới nhất.</li>
          <li>Dịch vụ có thể gián đoạn do bảo trì, sự cố kỹ thuật hoặc nguyên nhân bất khả kháng; chúng tôi sẽ cố gắng khắc phục nhanh nhất.</li>
          <li>Chúng tôi không chịu trách nhiệm về thiệt hại phát sinh do bạn tự để lộ thông tin đăng nhập, dùng website sai quy định hoặc do bên thứ ba tấn công ngoài khả năng kiểm soát hợp lý.</li>
          <li>Website có thể chứa liên kết tới trang khác; chúng tôi không chịu trách nhiệm về nội dung của các trang đó.</li>
          <li>Trong phạm vi pháp luật cho phép, trách nhiệm bồi thường của chúng tôi (nếu có) không vượt quá số tiền bạn đã thanh toán cho dịch vụ trong 12 tháng gần nhất. Nội dung này không loại trừ trách nhiệm mà pháp luật không cho phép loại trừ.</li>
        </ul>
      </Section>

      <Section icon={Mail} number={7} title="Thay đổi, luật áp dụng và liên hệ" color="#059669">
        <ul>
          <li><strong>Thay đổi:</strong> chúng tôi có thể cập nhật chính sách này và sẽ thông báo trên website; việc tiếp tục sử dụng sau ngày hiệu lực nghĩa là bạn chấp nhận bản mới. Thay đổi quan trọng về dữ liệu cá nhân sẽ được thông báo riêng và xin lại sự đồng ý khi cần.</li>
          <li><strong>Luật áp dụng:</strong> pháp luật Việt Nam. Tranh chấp được ưu tiên giải quyết bằng thương lượng; nếu không được, giải quyết tại Tòa án có thẩm quyền tại Việt Nam.</li>
          <li><strong>Liên hệ:</strong> [Tên chủ quản website] · Email: [email liên hệ] · Địa chỉ: [địa chỉ] · Ngày có hiệu lực: [dd/mm/yyyy].</li>
        </ul>
        <div className="terms-highlight-box terms-highlight-note">
          <em>Lưu ý: văn bản này là bản mẫu soạn theo pháp luật Việt Nam, chưa phải tư vấn pháp lý chính thức. Hãy điền thông tin trong [ ] và nhờ luật sư kiểm tra trước khi công bố.</em>
        </div>
      </Section>
    </div>
  );
}

function PrivacyContent() {
  return (
    <div className="terms-content">
      <Section icon={Lock} number={2} title="Chính sách bảo mật dữ liệu cá nhân" color="#7C3AED">
        <p>Chúng tôi chỉ thu thập dữ liệu cần thiết để vận hành website, xử lý theo Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 (hiệu lực từ 01/01/2026) và Nghị định 356/2025/NĐ-CP hướng dẫn luật này.</p>

        <div className="terms-table-wrapper">
          <table className="terms-table">
            <thead>
              <tr>
                <th>Nội dung</th>
                <th>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Dữ liệu thu thập</strong></td>
                <td>Tên hiển thị, email và ảnh đại diện từ tài khoản Google (khi bạn đăng nhập bằng Google), lớp/trường (nếu tự nhập), kết quả bài thi thử, lịch sử học, địa chỉ IP, loại thiết bị, cookie</td>
              </tr>
              <tr>
                <td><strong>Mục đích</strong></td>
                <td>Tạo tài khoản, lưu tiến độ, cá nhân hóa lộ trình học, chấm và đánh giá bài thi thử, bảo mật hệ thống, cải thiện chất lượng dịch vụ</td>
              </tr>
              <tr>
                <td><strong>Cơ sở xử lý</strong></td>
                <td>Sự đồng ý của bạn khi đăng ký; nghĩa vụ theo pháp luật</td>
              </tr>
              <tr>
                <td><strong>Thời gian lưu</strong></td>
                <td>Trong thời gian tài khoản còn hoạt động; xóa hoặc ẩn danh khi bạn yêu cầu xóa tài khoản, trừ dữ liệu pháp luật yêu cầu giữ</td>
              </tr>
              <tr>
                <td><strong>Chia sẻ</strong></td>
                <td>Không bán dữ liệu cá nhân. Chỉ chia sẻ với nhà cung cấp hạ tầng (Google đăng nhập, hosting, email, AI) theo hợp đồng bảo mật, hoặc khi cơ quan nhà nước có thẩm quyền yêu cầu</td>
              </tr>
              <tr>
                <td><strong>Bảo mật</strong></td>
                <td>Mã hóa kết nối HTTPS, không lưu mật khẩu của bạn (xác thực do Google xử lý), phân quyền truy cập, sao lưu định kỳ</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section icon={ShieldCheck} number="" title="Đăng nhập bằng Google (OAuth)" color="#4285F4">
        <ul>
          <li>Chúng tôi chỉ xin quyền cơ bản gồm tên, email và ảnh hồ sơ để tạo và nhận diện tài khoản. Chúng tôi <strong>không đọc</strong> Gmail, Google Drive, danh bạ hay dữ liệu Google khác của bạn.</li>
          <li>Mật khẩu Google được nhập trên trang của Google, MewTinHoc <strong>không nhìn thấy và không lưu</strong>.</li>
          <li>Việc Google xử lý dữ liệu đăng nhập tuân theo chính sách quyền riêng tư của Google.</li>
          <li>Bạn có thể thu hồi quyền truy cập của MewTinHoc bất cứ lúc nào tại trang <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" style={{ color: '#EA580C', fontWeight: 600 }}>Quyền truy cập tài khoản Google</a>. Khi đó bạn sẽ không đăng nhập được, và có thể yêu cầu xóa dữ liệu theo Mục 7.</li>
        </ul>
      </Section>

      <Section icon={FileText} number="" title="Quyền của bạn" color="#059669">
        <p>Bạn được biết, đồng ý hoặc rút lại sự đồng ý, truy cập, chỉnh sửa, xóa, hạn chế xử lý và khiếu nại về dữ liệu của mình. Gửi yêu cầu tới email ở Mục 7; chúng tôi phản hồi trong thời hạn luật định.</p>
      </Section>

      <Section icon={FileText} number="" title="Cookie" color="#D97706">
        <p>Website dùng cookie cần thiết để đăng nhập và cookie phân tích để thống kê lượt truy cập. Bạn có thể tắt cookie trong trình duyệt, một số chức năng có thể bị ảnh hưởng.</p>
      </Section>

      <Section icon={AlertTriangle} number="" title="Sự cố lộ lọt dữ liệu" color="#DC2626">
        <p>Nếu xảy ra sự cố lộ lọt dữ liệu, chúng tôi sẽ thông báo cho người bị ảnh hưởng và cơ quan có thẩm quyền theo quy định.</p>
      </Section>
    </div>
  );
}

export default function LoginPage({ onLogin }) {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [floatAnim, setFloatAnim] = useState(false);
  const [termsModal, setTermsModal] = useState({ open: false, tab: 'terms' });

  useEffect(() => {
    const t = setTimeout(() => setFloatAnim(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Kiểm tra lỗi OAuth trả về từ URL nếu có
  useEffect(() => {
    const hash = window.location.hash;
    const search = window.location.search;
    if (hash.includes('error=') || search.includes('error=')) {
      const params = new URLSearchParams(hash.replace(/^#/, '?') || search);
      const desc = params.get('error_description') || params.get('error');
      if (desc) {
        setError(`Đăng nhập Google không thành công: ${decodeURIComponent(desc)}`);
      }
    }
  }, []);

  // ĐĂNG NHẬP GOOGLE OAUTH QUA SUPABASE
  const handleGoogleLogin = async () => {
    setError('');
    setSuccess('');

    if (!supabase) {
      setError('Chưa cấu hình Supabase Client. Vui lòng kiểm tra lại cấu hình.');
      return;
    }

    setIsGoogleLoading(true);
    try {
      // URL redirect về ứng dụng (hoạt động tốt cả trên localhost lẫn GitHub Pages)
      const redirectUrl = window.location.origin + window.location.pathname;

      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      });

      if (oauthError) throw oauthError;
      // Trình duyệt sẽ tự động chuyển hướng sang trang đăng nhập Google
    } catch (err) {
      setIsGoogleLoading(false);
      setError(err?.message || 'Không thể kết nối đến Google OAuth. Vui lòng thử lại sau.');
    }
  };

  const openTerms = (e) => {
    e.preventDefault();
    setTermsModal({ open: true, tab: 'terms' });
  };

  const openPrivacy = (e) => {
    e.preventDefault();
    setTermsModal({ open: true, tab: 'privacy' });
  };

  return (
    <div className="login-page-root">
      <div className="login-blob login-blob-1" />
      <div className="login-blob login-blob-2" />
      <div className="login-blob login-blob-3" />

      <div className={`login-split-layout ${floatAnim ? 'login-float-in' : ''}`}>
        {/* LEFT — Branding */}
        <div className="login-brand-panel">
          <div className="login-brand-inner">
            <div className="login-logo-group">
              <div className="login-logo-icon">
                <img src={logoMeoCam} alt="MewTinHoc" className="login-logo-img" />
              </div>
              <div>
                <div className="login-logo-name">MewTinHoc</div>
                <div className="login-logo-sub">Đồng hành cùng bạn vượt qua kì thi</div>
              </div>
            </div>

            <h1 className="login-brand-headline">
              Chinh phục
              <span className="login-brand-highlight"> Tin học </span>
              <br /> THPTQG
            </h1>

            <div className="login-features-list">
              {FEATURES.map(({ icon: Icon, label, color }) => (
                <div className="login-feature-row" key={label}>
                  <div className="login-feature-icon" style={{ background: `${color}18`, color }}>
                    <Icon size={16} />
                  </div>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            <div className="login-stats-row">
              {STATS.map((s) => (
                <div className="login-stat-item" key={s.label}>
                  <div className="login-stat-value">{s.value}</div>
                  <div className="login-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Auth */}
        <div className="login-auth-panel">
          <div className="login-auth-card">
            <div className="login-auth-inner">
              <div className="login-auth-header">
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: '#FFFFFF',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.25rem',
                  border: '1px solid #F3F4F6'
                }}>
                  <GoogleGLogo size={32} />
                </div>
                <h2 className="login-auth-title">Đăng nhập vào MewTinHoc</h2>
                <p className="login-auth-subtitle">
                  Sử dụng tài khoản Google để đồng bộ lộ trình học tập và lưu kết quả thi thử trên đám mây
                </p>
              </div>

              {/* Thông báo lỗi / thành công */}
              {error && (
                <div role="alert" style={{
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  background: '#FEE2E2',
                  border: '1px solid #FCA5A5',
                  color: '#DC2626',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  lineHeight: 1.4
                }}>
                  {error}
                </div>
              )}
              {success && (
                <div role="status" style={{
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  background: '#DCFCE7',
                  border: '1px solid #86EFAC',
                  color: '#16A34A',
                  fontSize: '0.84rem',
                  fontWeight: 600
                }}>
                  {success}
                </div>
              )}

              {/* NÚT CHÍNH: ĐĂNG NHẬP GOOGLE OAUTH */}
              <button
                type="button"
                className="login-google-btn"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
                aria-busy={isGoogleLoading}
                style={{
                  padding: '0.85rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  background: '#FFFFFF',
                  border: '2px solid #E5E7EB',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: '#1F2937',
                  cursor: isGoogleLoading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
              >
                {isGoogleLoading ? (
                  <>
                    <div className="login-spinner" />
                    <span>Đang kết nối Google...</span>
                  </>
                ) : (
                  <>
                    <GoogleGLogo size={22} />
                    <span>Tiếp tục với Google</span>
                    <ArrowRight size={18} className="login-btn-arrow" />
                  </>
                )}
              </button>

              {/* Hoặc Trải nghiệm nhanh */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0.1rem 0' }}>
                <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }}></div>
                <span style={{ fontSize: '0.72rem', color: '#9CA3AF', fontWeight: 600 }}>HOẶC</span>
                <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }}></div>
              </div>

              <button
                type="button"
                onClick={() => onLogin({
                  id: 'demo-student-id',
                  name: 'Nguyễn Văn An',
                  email: 'an.nguyen@hocvien.edu.vn',
                  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
                  grade: 'Lớp 12 — Ôn thi THPTQG'
                })}
                style={{
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  background: '#FFF9F2',
                  border: '1.5px dashed var(--color-primary)',
                  borderRadius: '10px',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                id="btn-demo-login"
              >
                <span>⚡ Vào nhanh trải nghiệm (Học viên mẫu)</span>
              </button>

              <div style={{

                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                fontSize: '0.75rem',
                color: '#15803D',
                background: '#F0FDF4',
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid #DCFCE7'
              }}>
                <ShieldCheck size={14} color="#16A34A" />
                <span>Xác thực qua Google an toàn</span>
              </div>

              <div className="login-security-note">
                <ShieldCheck size={14} color="#16A34A" />
                <span>Không lưu mật khẩu · Dữ liệu được mã hóa an toàn</span>
              </div>
            </div>
          </div>

          <p className="login-footer-note">
            Bằng cách đăng nhập, bạn đồng ý với{' '}
            <a href="#terms" className="login-footer-link" onClick={openTerms}>Điều khoản sử dụng</a> và{' '}
            <a href="#privacy" className="login-footer-link" onClick={openPrivacy}>Chính sách bảo mật</a> của MewTinHoc.
          </p>
        </div>
      </div>

      {/* Terms & Privacy Modal */}
      <TermsPrivacyModal
        isOpen={termsModal.open}
        onClose={() => setTermsModal({ open: false, tab: 'terms' })}
        initialTab={termsModal.tab}
      />
    </div>
  );
}