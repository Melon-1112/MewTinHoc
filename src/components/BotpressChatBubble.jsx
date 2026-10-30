import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Bot,
  Send,
  X,
  Sparkles,
  Settings,
  RefreshCw,
  RotateCcw,
  Copy,
  Check,
  ShieldCheck,
  Lock
} from 'lucide-react';
import bubbleChatImg from '../../img/BubbleChat.png';

// Hàm render inline markdown: **bold**, *italic*, `code`
function renderInlineMarkdown(text, isUser = false) {
  if (!text) return '';
  const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  let keyIdx = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code key={keyIdx++} className="chat-inline-code">
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={keyIdx++} className="chat-strong">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={keyIdx++} className="chat-em">
          {token.slice(1, -1)}
        </em>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

// Cấu trúc lại tin nhắn! TAO CODE CẤM ĐỤNG!
function FormattedMessage({ text, isUser = false }) {
  if (!text) return null;
  if (isUser) {
    return <span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>;
  }

  const lines = text.split('\n');
  const elements = [];
  let currentList = [];
  let elKey = 0;

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={elKey++} className="chat-bullet-list">
          {currentList.map((item, idx) => (
            <li key={idx} className="chat-bullet-item">
              <span className="chat-bullet-icon">•</span>
              <span className="chat-bullet-text">{renderInlineMarkdown(item, isUser)}</span>
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    // Gạch đầu dòng: - hoặc * hoặc •
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
      const itemContent = trimmed.replace(/^[-*•]\s+/, '');
      currentList.push(itemContent);
      continue;
    }

    // Tiêu đề: ### hoặc ## hoặc #
    if (trimmed.startsWith('#')) {
      flushList();
      const headingText = trimmed.replace(/^#+\s*/, '');
      elements.push(
        <div key={elKey++} className="chat-heading">
          {renderInlineMarkdown(headingText, isUser)}
        </div>
      );
      continue;
    }

    // Dòng thông thường / đoạn văn
    flushList();
    elements.push(
      <p key={elKey++} className="chat-paragraph">
        {renderInlineMarkdown(trimmed, isUser)}
      </p>
    );
  }

  flushList();

  return <div className="botpress-formatted-text">{elements}</div>;
}

export default function BotpressChatBubble({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'backend_status'
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [conversationId, setConversationId] = useState(null);

  // Trạng thái cấu hình từ Backend (được bảo mật, không lộ token)
  const [backendConfig, setBackendConfig] = useState({
    configured: false,
    maskedToken: '(Đang kiểm tra...)',
    maskedBotId: '(Đang kiểm tra...)'
  });

  // State kiểm tra API /files từ Backend
  const [apiTesting, setApiTesting] = useState(false);
  const [apiResult, setApiResult] = useState(null);

  // State tin nhắn chat
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `Xin chào ${user?.name || 'bạn'}! 👋 Tôi là CamCam nhân viên meomeo của website MewTinHoc.Sẵn sàng giải đáp thắc mắc của bạn!!`,
      time: 'Vừa xong'
    }
  ]);

  const messagesEndRef = useRef(null);

  // Hàm gọi API Backend có tính đến base URL
  const fetchBackend = useCallback(async (endpoint, options = {}) => {
    const base = import.meta.env.BASE_URL || '/';
    const cleanBase = base.endsWith('/') ? base : base + '/';
    const primaryUrl = `${cleanBase}api/botpress${endpoint}`;

    try {
      const res = await fetch(primaryUrl, options);
      if (res.status === 404 && cleanBase !== '/') {
        // Fallback về root /api/botpress nếu cần
        return await fetch(`/api/botpress${endpoint}`, options);
      }
      return res;
    } catch {
      return await fetch(`/api/botpress${endpoint}`, options);
    }
  }, []);

  // Kiểm tra trạng thái Backend khi mở component
  const checkBackendStatus = useCallback(async () => {
    try {
      const res = await fetchBackend('/status');
      if (res.ok) {
        const data = await res.json();
        setBackendConfig({
          configured: data.configured,
          maskedToken: data.maskedToken,
          maskedBotId: data.maskedBotId
        });
      }
    } catch (err) {
      console.warn('[Botpress Frontend] Chưa kết nối được Backend:', err.message);
    }
  }, [fetchBackend]);

  useEffect(() => {
    checkBackendStatus();
  }, [checkBackendStatus]);

  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, activeTab]);

  // Lệnh curl tham khảo để kiểm tra trên terminal server
  const curlExample = `# Kiểm tra Botpress Cloud Files API từ Terminal Backend:
curl -H "Authorization: bearer $BOTPRESS_TOKEN" -H "x-bot-id: $BOTPRESS_BOT_ID" https://api.botpress.cloud/v1/files`;

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlExample);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  // Kiểm tra gọi API Botpress Cloud Files thông qua Backend an toàn
  const handleTestBotpressFilesApi = async () => {
    setApiTesting(true);
    setApiResult(null);

    try {
      const res = await fetchBackend('/files');
      const data = await res.json().catch(() => null);

      if (!res.ok || data?.status === 'error') {
        setApiResult({
          status: 'error',
          code: res.status,
          message: data?.message || `Lỗi HTTP ${res.status}: Không thể lấy danh sách files`,
          raw: data
        });
      } else if (data?.status === 'demo') {
        setApiResult({
          status: 'demo',
          message: data.message
        });
      } else {
        setApiResult({
          status: 'success',
          code: 200,
          message: 'Đã kết nối thành công',
          files: data?.files || []
        });
      }
    } catch (err) {
      setApiResult({
        status: 'error',
        message: err.message || 'Không thể kết nối'
      });
    } finally {
      setApiTesting(false);
      checkBackendStatus();
    }
  };

  // Reset phiên hội thoại khi tắt cửa sổ chat hoặc bấm nút làm mới
  const handleResetChat = async () => {
    setConversationId(null);
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: 'Đã làm mới đoạn chat! Bạn có thể đặt câu hỏi mới cho CamCam nhé 😺',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    try {
      await fetchBackend('/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id || 'student_user' })
      });
    } catch {
      // ignore
    }
  };

  const handleCloseChat = async () => {
    setIsOpen(false);
    // Sau khi tắt cửa sổ chat thì reset memory đoạn tin nhắn mới
    setConversationId(null);
    setMessages([
      {
        id: 1,
        sender: 'bot',
        text: `Xin chào ${user?.name || 'bạn'}! 👋 Tôi là CamCam nhân viên meomeo của website MewTinHoc.Sẵn sàng giải đáp thắc mắc của bạn!!`,
        time: 'Vừa xong'
      }
    ]);
    try {
      await fetchBackend('/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id || 'student_user' })
      });
    } catch {
      // ignore
    }
  };

  // Xử lý gửi tin nhắn Chat thông qua Backend an toàn và duy trì conversationId
  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isTyping) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const res = await fetchBackend('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          userId: user?.id || 'student_user',
          conversationId: conversationId
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.conversationId) {
          setConversationId(data.conversationId);
        }
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            text: data.reply || 'Đã nhận phản hồi từ CamCam.',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isLive: data.source === 'botpress_live'
          }
        ]);
      } else {
        throw new Error('Lỗi phản hồi từ backend');
      }
    } catch (err) {
      console.warn('[Botpress Chat Error]:', err.message);
      // Fallback phản hồi nếu mất kết nối server
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: `Tôi đã nhận được câu hỏi "${text}". Hãy kiểm tra kết nối với Backend Botpress để nhận phản hồi trực tiếp từ AI.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Mascot Button (Mặt con mèo PNG đã xóa nền) */}
      <div className="botpress-floating-bubble-wrap">
        {!isOpen && (
          <button
            className="botpress-mascot-btn"
            onClick={() => setIsOpen(true)}
            aria-label="Mở CamCam AI"
            title="Nhấn để trò chuyện cùng CamCam."
          >
            <div className="botpress-mascot-inner">
              <img
                src={bubbleChatImg}
                alt="CamCam AI"
                className="botpress-mascot-img"
              />
              <span className="botpress-mascot-ping"></span>
            </div>
            {/* Tooltip bong bóng nhỏ nhắn mời chat */}
            <div className="botpress-mascot-tooltip">
              <span>Hỏi CamCam nè! 😺</span>
            </div>
          </button>
        )}
      </div>

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="botpress-chat-window">
          {/* Header */}
          <div className="botpress-header">
            <div className="botpress-header-left">
              <div className="botpress-avatar">
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFF' }}>
                  <img src={bubbleChatImg} alt="CamCam" className="botpress-avatar-img" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                <span className="botpress-status-dot"></span>
              </div>
              <div className="botpress-header-info">
                <div className="botpress-title">
                  <span>CamCam giải đáp</span>
                </div>
                <div className="botpress-subtitle">
                  {backendConfig.configured ? 'Connected to Botpress' : ''}
                </div>
              </div>
            </div>

            <div className="botpress-header-actions">
              <button
                className="botpress-header-btn"
                onClick={handleResetChat}
                title="Bắt đầu đoạn chat mới (xóa ngữ cảnh cũ)"
              >
                <RotateCcw size={15} />
              </button>
              <button
                className={`botpress-header-btn ${activeTab === 'backend_status' ? 'active' : ''}`}
                onClick={() => setActiveTab(activeTab === 'backend_status' ? 'chat' : 'backend_status')}
                title="Bảo mật & Trạng thái Backend"
              >
                <Settings size={17} />
              </button>
              <button
                className="botpress-header-btn"
                onClick={handleCloseChat}
                title="Đóng cửa sổ chat (sẽ reset ngữ cảnh khi mở lại)"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Tab 1: Backend Security & API Tools */}
          {activeTab === 'backend_status' && (
            <div className="botpress-settings-panel">
              <div className="botpress-settings-header">
                <ShieldCheck size={18} color="#10B981" />
                <strong>Bảo mật Botpress API qua Backend</strong>
              </div>

              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 'var(--radius-sm)', padding: '0.65rem 0.85rem', fontSize: '0.74rem', color: '#065F46', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <Lock size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Bảo mật 100%:</strong> Toàn bộ <code>BOTPRESS_TOKEN</code> và <code>BOTPRESS_BOT_ID</code> được xử lý độc quyền ở phía máy chủ (Backend), không hề bị lộ ra trình duyệt hay DevTools Network của người dùng.
                </div>
              </div>

              {/* Thông tin cấu hình hiện tại ở Backend */}
              <div style={{ background: '#FFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Trạng thái kết nối:</span>
                  <span style={{ fontWeight: 700, color: backendConfig.configured ? '#059669' : '#D97706' }}>
                    {backendConfig.configured ? '🟢 Đã cấu hình trên Backend' : '🟡 Chờ Token trong .env.local'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Token (đã mã hóa):</span>
                  <code style={{ background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>{backendConfig.maskedToken}</code>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Bot ID (đã mã hóa):</span>
                  <code style={{ background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>{backendConfig.maskedBotId}</code>
                </div>
              </div>

              {/* Hướng dẫn cấu hình Backend */}
              <div style={{ fontSize: '0.73rem', color: 'var(--color-text-muted)', lineHeight: 1.45 }}>
                Để cập nhật Token thật, chỉnh sửa file <strong>.env.local</strong> trên server:
                <pre style={{ background: '#1E1E2E', color: '#A5B4FC', padding: '0.5rem 0.75rem', borderRadius: '6px', marginTop: '0.35rem', fontFamily: 'var(--font-code)', fontSize: '0.7rem' }}>
                  {`BOTPRESS_TOKEN=bp_pat_your_token_here
BOTPRESS_BOT_ID=your_bot_id_here`}
                </pre>
              </div>

              {/* cURL Display Box */}
              <div className="botpress-curl-box">
                <div className="botpress-curl-header">
                  <span># cURL kiểm tra danh sách Files (/v1/files)</span>
                  <button className="botpress-btn-copy" onClick={handleCopyCurl}>
                    {copiedCurl ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                    <span>{copiedCurl ? 'Đã chép' : 'Copy cURL'}</span>
                  </button>
                </div>
                <pre className="botpress-curl-code">{curlExample}</pre>
              </div>

              {/* Nút kiểm tra API từ Backend */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  className="botpress-btn-test"
                  onClick={handleTestBotpressFilesApi}
                  disabled={apiTesting}
                >
                  <RefreshCw size={14} className={apiTesting ? 'spin-icon' : ''} />
                  <span>{apiTesting ? 'Đang gọi Backend...' : 'Kiểm tra API /v1/files qua Backend'}</span>
                </button>

                <button
                  className="botpress-btn-back"
                  onClick={() => setActiveTab('chat')}
                >
                  Quay lại Chat
                </button>
              </div>

              {/* Kết quả kiểm tra */}
              {apiResult && (
                <div className={`botpress-test-result ${apiResult.status}`}>
                  <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>
                    {apiResult.status === 'success' ? '✅ Thành công' : (apiResult.status === 'demo' ? '💡 Chế độ Demo' : '⚠️ Thông báo:')}
                  </div>
                  <div>{apiResult.message}</div>
                  {apiResult.files && (
                    <div style={{ fontSize: '0.72rem', marginTop: '0.35rem' }}>
                      Số lượng files tìm thấy trên Botpress: {Array.isArray(apiResult.files) ? apiResult.files.length : 0}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Chat Messages */}
          {activeTab === 'chat' && (
            <>
              {!backendConfig.configured && (
                <div className="botpress-demo-banner">
                  <span>💡 Backend đang chạy chế độ mô phỏng an toàn. Bấm ⚙️ để xem trạng thái bảo mật hoặc cấu hình Token thật.</span>
                </div>
              )}

              <div className="botpress-messages-area">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`botpress-msg-bubble ${m.sender === 'user' ? 'user-msg' : 'bot-msg'}`}
                  >
                    {m.sender === 'bot' && (
                      <img
                        src={bubbleChatImg}
                        alt="CamCam"
                        className="botpress-msg-avatar"
                        style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                      />
                    )}
                    <div className="botpress-msg-content">
                      <div className="botpress-msg-text">
                        <FormattedMessage text={m.text} isUser={m.sender === 'user'} />
                      </div>
                      <div className="botpress-msg-time">{m.time}</div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="botpress-msg-bubble bot-msg">
                    <img
                      src={bubbleChatImg}
                      alt="CamCam"
                      className="botpress-msg-avatar"
                      style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                    />
                    <div className="botpress-typing-dots">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Box */}
              <div className="botpress-input-box">
                <input
                  type="text"
                  placeholder="Đặt câu hỏi."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                  className="botpress-chat-input"
                />
                <button
                  className="botpress-send-btn"
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim()}
                  title="Gửi câu hỏi"
                >
                  <Send size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
