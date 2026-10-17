import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { Client } from '@botpress/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Đọc biến môi trường từ .env.local và .env mà không làm lộ ra client
function loadBackendEnv() {
  const envVars = { ...process.env };
  const envFiles = ['.env.local', '.evn.local', '.env'];

  for (const file of envFiles) {
    const fullPath = path.join(rootDir, file);
    if (fs.existsSync(fullPath)) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        for (const line of content.split('\n')) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#')) continue;
          const eqIdx = trimmed.indexOf('=');
          if (eqIdx > 0) {
            const key = trimmed.slice(0, eqIdx).trim();
            const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
            if (!envVars[key]) {
              envVars[key] = val;
            }
          }
        }
      } catch (err) {
        console.warn(`[Botpress Backend] Không thể đọc file ${file}:`, err.message);
      }
    }
  }

  return envVars;
}

// Lấy cấu hình Botpress bí mật từ Backend
export function getBotpressConfig() {
  const env = loadBackendEnv();
  const token = env.BOTPRESS_TOKEN || env.VITE_BOTPRESS_TOKEN || '';
  const botId = env.BOTPRESS_BOT_ID || env.VITE_BOTPRESS_BOT_ID || '';
  const webhookId = env.BOTPRESS_WEBHOOK_ID || '495d4013-89a7-4f9c-ad32-1a623750a35c';
  const encryptionKey = env.BOTPRESS_ENCRYPTION_KEY || 'crackhobomay1cailuonconcho-AnBaoNhi2008';

  const isConfigured = Boolean(
    webhookId &&
    webhookId !== 'your_default_webhook_url' &&
    !webhookId.startsWith('$')
  );

  return {
    token,
    botId,
    webhookId,
    encryptionKey,
    isConfigured,
    maskedToken: token && token !== '$YOUR_BOTPRESS_TOKEN' ? `${token.slice(0, 7)}...${token.slice(-4)}` : '(Tùy chọn cho Chat)',
    maskedBotId: botId && botId !== '$YOUR_BOT_ID' ? `${botId.slice(0, 6)}...${botId.slice(-4)}` : '(Tùy chọn)',
    maskedWebhookId: webhookId ? `${webhookId.slice(0, 8)}...${webhookId.slice(-6)}` : '(Chưa thiết lập)',
    maskedEncryptionKey: encryptionKey ? `${encryptionKey.slice(0, 6)}...${encryptionKey.slice(-4)}` : '(Chưa thiết lập)'
  };
}

// Khởi tạo Botpress Client an toàn ở phía Server
export function getBotpressClient() {
  const { token, botId } = getBotpressConfig();
  if (!token || token === '$YOUR_BOTPRESS_TOKEN' || !botId || botId === '$YOUR_BOT_ID') {
    return null;
  }
  return new Client({ token, botId });
}

// Ký JSON Web Token (HS256) cho header x-user-key khi Botpress cài đặt Encryption Key
function signUserKey(userId, encryptionKey) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ id: userId, iat: Math.floor(Date.now() / 1000) })).toString('base64url');
  const signature = crypto.createHmac('sha256', encryptionKey).update(`${header}.${payload}`).digest('base64url');
  return `${header}.${payload}.${signature}`;
}

// Gọi API lấy danh sách Files từ Botpress Cloud: https://api.botpress.cloud/v1/files
export async function listBotpressFiles() {
  const { token, botId } = getBotpressConfig();

  if (!token || token === '$YOUR_BOTPRESS_TOKEN' || !botId || botId === '$YOUR_BOT_ID') {
    return {
      status: 'demo',
      message: 'Tính năng xem files quản trị cần BOTPRESS_TOKEN trong .env.local. (Chat với CamCam hiện đã hoạt động bình thường qua Webhook ID).',
      files: []
    };
  }

  try {
    const client = getBotpressClient();
    if (client) {
      const response = await client.listFiles({});
      return {
        status: 'success',
        files: response.files || response || []
      };
    }

    const res = await fetch('https://api.botpress.cloud/v1/files', {
      method: 'GET',
      headers: {
        'Authorization': `bearer ${token}`,
        'x-bot-id': botId
      }
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      throw new Error(data?.message || `Lỗi HTTP ${res.status}: ${res.statusText}`);
    }

    return {
      status: 'success',
      files: data?.files || data || []
    };
  } catch (err) {
    return {
      status: 'error',
      message: err.message || 'Lỗi kết nối Botpress Cloud Files API từ backend'
    };
  }
}

// Quản lý phiên hội thoại duy trì ngữ cảnh theo từng học sinh (Session Memory)
// Cấu trúc: userId -> { bpUserUuid, userKey, botpressUserId, conversationId }
const userSessions = new Map();

// Reset phiên khi người dùng tắt cửa sổ chat
export function resetSession(userId = 'student_user') {
  userSessions.delete(userId);
  return { success: true };
}

// Lấy hoặc tạo mới phiên hội thoại (Đảm bảo giữ nguyên conversationId trong suốt cuộc trò chuyện)
async function getOrCreateSession({ userId = 'student_user', conversationId = null, forceNew = false }) {
  const { webhookId, encryptionKey } = getBotpressConfig();
  if (!webhookId) return null;

  if (forceNew) {
    userSessions.delete(userId);
  }

  let session = userSessions.get(userId);

  // 1. Tạo UUID ổn định cho User (Botpress yêu cầu tối thiểu 28 ký tự)
  let bpUserUuid = session?.bpUserUuid;
  if (!bpUserUuid) {
    bpUserUuid = crypto.randomUUID();
  }

  const userKey = signUserKey(bpUserUuid, encryptionKey);

  // 2. Đăng ký người dùng trên Botpress Cloud qua get-or-create
  let botpressUserId = session?.botpressUserId;
  if (!botpressUserId) {
    try {
      const userRes = await fetch(`https://chat.botpress.cloud/${webhookId}/users/get-or-create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-key': userKey
        },
        body: JSON.stringify({ name: userId || 'HocVien' })
      });
      if (userRes.ok) {
        const userData = await userRes.json();
        botpressUserId = userData?.user?.id || bpUserUuid;
      } else {
        botpressUserId = bpUserUuid;
      }
    } catch (err) {
      console.warn('[Botpress getOrCreateUser Warning]:', err.message);
      botpressUserId = bpUserUuid;
    }
  }

  // 3. Giữ nguyên conversationId nếu đang trong cùng 1 phiên chat
  let activeConvId = conversationId || session?.conversationId;
  if (!activeConvId) {
    try {
      const convRes = await fetch(`https://chat.botpress.cloud/${webhookId}/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-key': userKey
        },
        body: JSON.stringify({})
      });
      if (convRes.ok) {
        const convData = await convRes.json();
        activeConvId = convData?.conversation?.id;
      }
    } catch (err) {
      console.warn('[Botpress createConversation Warning]:', err.message);
    }
  }

  session = {
    bpUserUuid,
    userKey,
    botpressUserId,
    conversationId: activeConvId
  };
  userSessions.set(userId, session);
  return session;
}

// Xử lý gửi tin nhắn Chat qua Botpress Backend có duy trì ngữ cảnh
export async function processChatMessage({ message, userId = 'student_user', conversationId = null }) {
  const { webhookId } = getBotpressConfig();
  const text = (message || '').trim();

  if (!text) {
    return { error: 'Tin nhắn không được để trống' };
  }

  let currentSession = null;

  // 1. Gọi trực tiếp Botpress Chat API với Webhook ID và Encryption Key đã ký
  if (webhookId) {
    try {
      currentSession = await getOrCreateSession({ userId, conversationId });

      if (currentSession && currentSession.conversationId) {
        // Gửi tin nhắn của học sinh (createMessage)
        const sendRes = await fetch(`https://chat.botpress.cloud/${webhookId}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-key': currentSession.userKey
          },
          body: JSON.stringify({
            conversationId: currentSession.conversationId,
            payload: {
              type: 'text',
              text
            }
          })
        });

        if (sendRes.ok) {
          const sendData = await sendRes.json();
          const myMsgId = sendData?.message?.id;
          const startTime = Date.now();

          // Thăm dò (polling) nhận câu trả lời thực tế từ bot CamCam (tối đa ~26s)
          for (let attempt = 0; attempt < 22; attempt++) {
            await new Promise((r) => setTimeout(r, 1200));

            const listRes = await fetch(
              `https://chat.botpress.cloud/${webhookId}/conversations/${currentSession.conversationId}/messages`,
              {
                method: 'GET',
                headers: { 'x-user-key': currentSession.userKey }
              }
            );

            if (listRes.ok) {
              const listData = await listRes.json();
              const msgs = listData?.messages || [];

              // Tìm tin nhắn từ CamCam sinh ra sau thời điểm gửi tin nhắn này
              const botMsg = msgs.find(
                (m) =>
                  m.id !== myMsgId &&
                  m.userId !== currentSession.botpressUserId &&
                  m.userId !== currentSession.bpUserUuid &&
                  new Date(m.createdAt).getTime() >= startTime - 3000
              );

              if (botMsg?.payload?.text) {
                return {
                  reply: botMsg.payload.text,
                  source: 'botpress_live',
                  botName: 'CamCam',
                  conversationId: currentSession.conversationId
                };
              }
            }
          }
        }
      }
    } catch (err) {
      console.warn('[Botpress Chat API Warning]:', err.message);
    }
  }

  // 2. Chế độ dự phòng chỉ kích hoạt nếu Botpress Cloud không phản hồi
  const lower = text.toLowerCase();
  let reply = '';

  if (lower.includes('python') || lower.includes('thuật toán') || lower.includes('for') || lower.includes('while')) {
    reply = `Trong Python ôn thi THPTQG, cần lưu ý:
1. Hàm \`range(start, stop, step)\`: Cận \`stop\` luôn không lấy (nửa khoảng mở).
2. Danh sách (List) thao tác chỉ mục từ 0 đến N-1. Cẩn thận lỗi \`IndexError\`.
3. Cấu trúc hàm \`def\` và biến cục bộ/toàn cục (\`global\`).`;
  } else if (lower.includes('sql') || lower.includes('csdl') || lower.includes('join') || lower.includes('where')) {
    reply = `Về CSDL & SQL:
1. \`WHERE\` dùng lọc dòng trước khi gom nhóm (\`GROUP BY\`).
2. \`HAVING\` dùng lọc dữ liệu sau khi gom nhóm (với các hàm tổng hợp như \`COUNT\`, \`SUM\`, \`AVG\`).
3. Khóa chính (Primary Key) định danh duy nhất mỗi bản ghi và không được phép null.`;
  } else if (lower.includes('cấu trúc') || lower.includes('đề thi') || lower.includes('ma trận') || lower.includes('2025')) {
    reply = `Cấu trúc đề thi Tin học THPTQG mới của Bộ GD&ĐT:
- Phần I: 24 câu trắc nghiệm 4 lựa chọn (6.0 điểm).
- Phần II: 4 câu trắc nghiệm Đúng/Sai đa ý phân hóa cao (4.0 điểm).
- Tổng điểm 10.0, thời gian 50 phút.`;
  } else if (lower.includes('mạng') || lower.includes('ip') || lower.includes('tcp') || lower.includes('internet')) {
    reply = `Chuyên đề Mạng máy tính & Internet:
- Địa chỉ IPv4 gồm 32 bit (4 octet), IPv6 gồm 128 bit.
- Giao thức HTTP (cổng 80), HTTPS (cổng 443 mã hóa SSL/TLS).
- Phân biệt thiết bị: Switch (tầng 2 - MAC), Router (tầng 3 - IP).`;
  } else {
    reply = `Chào bạn! Mình là CamCam AI 😺. Bạn có câu hỏi nào về môn Tin học THPTQG (Python, CSDL SQL, Mạng máy tính) hãy gửi cho mình nhé!`;
  }

  return {
    reply,
    source: 'backend_fallback',
    conversationId: currentSession?.conversationId
  };
}
