import React, { useState } from 'react';
import {
  Sparkles,
  Cpu,
  BrainCircuit,
  Sliders,
  Send,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  TrendingUp,
  FileQuestion,
  RefreshCw,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AiExamTab({ user }) {
  // Config state
  const [subject, setSubject] = useState('full'); // full | python | sql | network
  const [difficulty, setDifficulty] = useState('high'); // medium | high | perfect
  const [questionCount, setQuestionCount] = useState(20);
  const [language, setLanguage] = useState('python');

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [generatedExam, setGeneratedExam] = useState(() => {
    try {
      const saved = sessionStorage.getItem('tinhoc_generated_exam');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  React.useEffect(() => {
    if (generatedExam) {
      sessionStorage.setItem('tinhoc_generated_exam', JSON.stringify(generatedExam));
    }
  }, [generatedExam]);

  // AI Chat state
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: `Xin chào ${user?.name || 'bạn'}! Tôi là Trợ Lý Gia Sư AI môn Tin Học THPTQG. Hãy tạo đề thi thử theo năng lực hoặc đặt bất kỳ câu hỏi nào về lý thuyết Python, SQL hay Mạng máy tính nhé!`
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const generationStepsText = [
    'Phân tích ma trận đề thi tốt nghiệp THPT năm 2025 của Bộ GD&ĐT...',
    'Tạo câu hỏi phân hóa lập trình Python và bẫy cú pháp cắt xâu...',
    'Thiết kế 4 ý trắc nghiệm Đúng/Sai cho chuyên đề CSDL quan hệ SQL...',
    'Kiểm duyệt độ chính xác đáp án và tạo thang chấm điểm bằng AI...',
    'Đề thi thử đã sẵn sàng!'
  ];

  const handleGenerateAiExam = () => {
    setIsGenerating(true);
    setGenerationStep(0);
    setGeneratedExam(null);

    const stepInterval = setInterval(() => {
      setGenerationStep((prev) => {
        if (prev >= 3) {
          clearInterval(stepInterval);
          setIsGenerating(false);
          setGeneratedExam({
            title: `Đề Thi Thử Phân Hóa AI — ${subject === 'python' ? 'Chuyên Sâu Python' : subject === 'sql' ? 'Chuyên Sâu SQL' : 'Chuẩn Cấu Trúc Bộ GD&ĐT 2025'}`,
            questions: questionCount,
            difficulty: difficulty === 'perfect' ? 'Điểm 9.5 - 10.0' : difficulty === 'high' ? 'Khá - Giỏi (8.0+)' : 'Cơ bản (7.0+)',
            estimatedScore: 8.8
          });
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#EA580C', '#FBBF24', '#7C2D12']
          });
          return 4;
        }
        return prev + 1;
      });
    }, 600);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    const newChat = [...chatMessages, { sender: 'user', text: userText }];
    setChatMessages(newChat);
    setInputMessage('');

    // AI Mentor smart response
    setTimeout(() => {
      let reply = '';
      const lower = userText.toLowerCase();

      if (lower.includes('having') || lower.includes('where')) {
        reply = `💡 Trong SQL: Mệnh đề WHERE được thực thi trước để lọc từng dòng dữ liệu cá thể; mệnh đề HAVING thực thi sau khi đã gom nhóm (GROUP BY) để lọc trên các giá trị hàm tổng hợp như COUNT(), SUM(), AVG(). Vì vậy bạn KHÔNG thể dùng COUNT(*) trong WHERE mà bắt buộc phải dùng HAVING nhé!`;
      } else if (lower.includes('slice') || lower.includes('cắt xâu') || lower.includes('python')) {
        reply = `🐍 Cú pháp cắt xâu trong Python là s[start:stop:step]. Bẫy lớn nhất trong đề THPTQG là cận 'stop' luôn không bao gồm trong kết quả (lấy đến stop - 1). Ngoài ra s[::-1] sẽ đảo ngược xâu cực nhanh!`;
      } else if (lower.includes('streak') || lower.includes('điểm danh')) {
        reply = `🔥 Hãy chăm chỉ bấm 'Điểm danh' mỗi ngày tại Trang Chủ nhé! Nếu qua 1 ngày không học và điểm danh, chuỗi streak sẽ bị mất và trở về 0 theo đúng cơ chế rèn luyện kỷ luật.`;
      } else {
        reply = `✨ Nhận định rất hay! Dựa trên ma trận đề thi 2025, câu hỏi này thuộc mức độ Vận dụng. Bạn nên chú ý đến cấu trúc đề mới: Phần II trắc nghiệm Đúng/Sai nếu đúng cả 4 ý mới được trọn vẹn 1 điểm của câu hỏi!`;
      }

      setChatMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
    }, 700);
  };

  return (
    <div className="ai-exam-container">
      {/* Banner */}
      <div className="ai-banner-card">
        <div className="ai-banner-content">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(251, 191, 36, 0.2)', border: '1px solid rgba(251, 191, 36, 0.4)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-amber)', marginBottom: '0.6rem' }}>
            <BrainCircuit size={14} />
            <span>AI Đánh Giá Năng Lực & Dự Đoán Điểm Số 2025</span>
          </div>
          <h2>Tạo Bài Thi Thử Cá Nhân Hóa & Đánh Giá Bằng AI</h2>
          <p>
            Hệ thống AI phân tích điểm mạnh, điểm yếu và tự động lắp ráp bộ đề thi trắc nghiệm chuẩn cấu trúc 3 phần mới nhất của Bộ GD&ĐT để bạn bứt phá phong độ.
          </p>
        </div>

        <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: 'linear-gradient(135deg, var(--color-amber), var(--color-primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-deep)', boxShadow: '0 8px 24px rgba(234, 88, 12, 0.4)', flexShrink: 0 }}>
          <Sparkles size={44} />
        </div>
      </div>

      {/* Generator & Configuration Row */}
      <div className="ai-generator-grid">
        {/* Left Card: Exam Generator Settings */}
        <div className="config-card">
          <div className="config-group-title">
            <Sliders size={18} color="var(--color-primary)" />
            <span>1. Tùy Chọn Ma Trận Đề Thi Thử AI</span>
          </div>

          {/* Subject options */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-deep)', display: 'block', marginBottom: '0.5rem' }}>
              Chuyên đề trọng tâm:
            </label>
            <div className="selection-grid">
              <div
                className={`choice-box ${subject === 'full' ? 'selected' : ''}`}
                onClick={() => setSubject('full')}
              >
                <div className="choice-box-title">Tổng hợp Chuẩn Bộ GD&ĐT</div>
                <div className="choice-box-sub">Đầy đủ 4 mảng kiến thức</div>
              </div>
              <div
                className={`choice-box ${subject === 'python' ? 'selected' : ''}`}
                onClick={() => setSubject('python')}
              >
                <div className="choice-box-title">Lập trình Python</div>
                <div className="choice-box-sub">Cú pháp, xâu & thuật toán</div>
              </div>
              <div
                className={`choice-box ${subject === 'sql' ? 'selected' : ''}`}
                onClick={() => setSubject('sql')}
              >
                <div className="choice-box-title">Cơ sở dữ liệu & SQL</div>
                <div className="choice-box-sub">Khóa, JOIN, GROUP BY</div>
              </div>
              <div
                className={`choice-box ${subject === 'network' ? 'selected' : ''}`}
                onClick={() => setSubject('network')}
              >
                <div className="choice-box-title">Mạng & An Toàn Số</div>
                <div className="choice-box-sub">Giao thức IP, Bảo mật</div>
              </div>
            </div>
          </div>

          {/* Difficulty Target */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-deep)', display: 'block', marginBottom: '0.5rem' }}>
              Mục tiêu điểm số & Độ phân hóa:
            </label>
            <div className="selection-grid selection-grid-3">
              <div
                className={`choice-box ${difficulty === 'medium' ? 'selected' : ''}`}
                onClick={() => setDifficulty('medium')}
              >
                <div className="choice-box-title">Cơ bản 7.0+</div>
                <div className="choice-box-sub">Nhận biết & Thông hiểu</div>
              </div>
              <div
                className={`choice-box ${difficulty === 'high' ? 'selected' : ''}`}
                onClick={() => setDifficulty('high')}
              >
                <div className="choice-box-title">Khá Giỏi 8.5+</div>
                <div className="choice-box-sub">Vận dụng chuẩn đề</div>
              </div>
              <div
                className={`choice-box ${difficulty === 'perfect' ? 'selected' : ''}`}
                onClick={() => setDifficulty('perfect')}
              >
                <div className="choice-box-title">Điểm 10 Tuyệt Đối</div>
                <div className="choice-box-sub">Vận dụng cao thử thách</div>
              </div>
            </div>
          </div>

          {/* Question Count */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-deep)', display: 'block', marginBottom: '0.5rem' }}>
              Quy mô bài thi:
            </label>
            <div className="exam-scale-btn-group">
              {[
                { count: 10, label: '10 câu (Siêu tốc 15p)' },
                { count: 20, label: '20 câu (Tiêu chuẩn 30p)' },
                { count: 40, label: '40 câu (Chuẩn Bộ 50p)' }
              ].map((item) => (
                <button
                  key={item.count}
                  type="button"
                  onClick={() => setQuestionCount(item.count)}
                  style={{
                    flex: 1,
                    padding: '0.6rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    border: '1.5px solid',
                    borderColor: questionCount === item.count ? 'var(--color-primary)' : 'var(--color-border-subtle)',
                    background: questionCount === item.count ? '#FFF7ED' : '#FFFFFF',
                    color: questionCount === item.count ? 'var(--color-deep)' : 'var(--color-text-muted)'
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            className="btn-primary-glow"
            style={{ width: '100%', justifyContent: 'center', padding: '0.9rem' }}
            onClick={handleGenerateAiExam}
            disabled={isGenerating}
            id="btn-tao-de-ai"
          >
            {isGenerating ? (
              <>
                <RefreshCw size={18} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                <span>Đang Khởi Tạo Đề Thi Với AI...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Khởi Tạo Đề Thi Thử Bằng AI</span>
              </>
            )}
          </button>

          {/* Loading Animation Steps */}
          {isGenerating && (
            <div style={{ background: '#FFFDF9', border: '1px dashed var(--color-primary)', padding: '0.85rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-deep)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-primary)' }}></span>
                <span>{generationStepsText[generationStep]}</span>
              </div>
            </div>
          )}

          {/* Generated Exam Success Box */}
          {generatedExam && (
            <div style={{ background: '#F0FDF4', border: '1.5px solid #86EFAC', borderRadius: 'var(--radius-md)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#16A34A', fontWeight: 800, fontSize: '0.9rem' }}>
                <CheckCircle size={18} />
                <span>Đề thi đã khởi tạo thành công!</span>
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--color-deep)' }}>
                {generatedExam.title}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                Quy mô: <strong>{generatedExam.questions} câu hỏi</strong> • Cấp độ: <strong>{generatedExam.difficulty}</strong>
              </div>
              <button
                className="btn-primary-glow"
                style={{ justifyContent: 'center', padding: '0.65rem' }}
                onClick={() => alert('Chuyển sang chế độ phòng thi giải đề AI!')}
              >
                <span>Bắt đầu giải đề AI ngay</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Right Card: AI Diagnostic Report & Performance Forecast */}
        <div className="ai-report-card">
          <div className="config-group-title">
            <TrendingUp size={18} color="var(--color-primary)" />
            <span>2. Báo Cáo Đánh Giá Năng Lực Học Viên (AI Diagnostic)</span>
          </div>

          {/* Score Showcase */}
          <div className="score-showcase">
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Dự đoán điểm THPTQG
              </div>
              <div className="big-score-digit">9.2</div>
              <div style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: 700 }}>
                ▲ Tăng +0.4 so với tuần trước
              </div>
            </div>

            <div style={{ width: '1px', height: '60px', background: 'var(--color-border)' }}></div>

            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Xác suất đạt mục tiêu 9.5+
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-deep)' }}>
                86.5%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 700 }}>
                Khả quan rất cao
              </div>
            </div>
          </div>

          {/* AI Coach Diagnostic Advice */}
          <div className="ai-coach-bubble">
            <div className="ai-avatar-icon">
              <BrainCircuit size={22} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--color-deep)' }}>
                Nhận xét chuyên sâu từ Gia Sư AI:
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-text-deep)', lineHeight: 1.5 }}>
                • <strong>Điểm mạnh:</strong> Học viên {user?.name || ''} xử lý cực kỳ chuẩn xác các câu hỏi lập trình Python về hàm, lát cắt xâu và mảng 1 chiều (Độ chính xác: 94%).
                <br />
                • <strong>Lỗ hổng cần khắc phục:</strong> Hay bị mất điểm ở Phần II (Trắc nghiệm Đúng/Sai 4 ý) của chuyên đề CSDL quan hệ SQL, đặc biệt là sự khác biệt giữa WHERE và HAVING khi gom nhóm GROUP BY.
              </div>
            </div>
          </div>

          {/* AI Mentor Interactive Chat */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-deep)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MessageSquare size={16} color="var(--color-primary)" />
              <span>Hỏi đáp giải thích câu hỏi cùng AI Mentor:</span>
            </div>

            <div style={{ height: '180px', overflowY: 'auto', background: '#FFFDF9', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    background: msg.sender === 'user' ? 'var(--color-deep)' : '#FFF1D6',
                    color: msg.sender === 'user' ? '#FFFFFF' : 'var(--color-deep)',
                    padding: '0.55rem 0.85rem',
                    borderRadius: '12px',
                    maxWidth: '85%',
                    fontSize: '0.8rem',
                    lineHeight: 1.4
                  }}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="Hỏi AI: 'Giải thích sự khác nhau giữa WHERE và HAVING'..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.55rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--color-border)',
                  fontSize: '0.82rem',
                  outline: 'none',
                  background: '#FFFFFF'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '0.55rem 1rem',
                  background: 'var(--color-primary)',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
