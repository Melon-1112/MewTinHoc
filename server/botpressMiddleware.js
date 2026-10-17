import { getBotpressConfig, listBotpressFiles, processChatMessage, resetSession } from './botpressService.js';

// Hàm helper phân tích body JSON
function parseJsonBody(req) {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(raw || '{}'));
      } catch {
        resolve({});
      }
    });
    req.on('error', () => {
      resolve({});
    });
  });
}

// Hàm helper gửi phản hồi JSON chuẩn
function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(data));
}

// Middleware xử lý các API Botpress Backend
export async function botpressMiddleware(req, res, next) {
  const url = req.url?.split('?')[0] || '';
  const method = req.method?.toUpperCase();

  // Bật CORS cho môi trường dev nếu cần
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  try {
    // 1. Kiểm tra trạng thái cấu hình Backend
    if (url === '/status' || url === '/api/botpress/status') {
      const config = getBotpressConfig();
      return sendJson(res, 200, {
        success: true,
        configured: config.isConfigured,
        maskedToken: config.maskedToken,
        maskedBotId: config.maskedBotId
      });
    }

    // 2. Lấy danh sách Files qua Botpress Cloud Files API
    if (url === '/files' || url === '/api/botpress/files') {
      const result = await listBotpressFiles();
      return sendJson(res, result.status === 'error' ? 500 : 200, result);
    }

    // 3. Gửi tin nhắn Chat (duy trì conversationId)
    if (url === '/chat' || url === '/api/botpress/chat') {
      if (method !== 'POST') {
        return sendJson(res, 405, { error: 'Method Not Allowed' });
      }

      const body = await parseJsonBody(req);
      const message = body.message || body.text || '';
      const userId = body.userId || 'student_user';
      const conversationId = body.conversationId || null;

      const chatRes = await processChatMessage({ message, userId, conversationId });
      return sendJson(res, 200, chatRes);
    }

    // 4. Reset phiên hội thoại (khi tắt cửa sổ chat hoặc bấm reset)
    if (url === '/reset' || url === '/api/botpress/reset') {
      if (method !== 'POST') {
        return sendJson(res, 405, { error: 'Method Not Allowed' });
      }

      const body = await parseJsonBody(req);
      const userId = body.userId || 'student_user';
      resetSession(userId);
      return sendJson(res, 200, { success: true, message: 'Đã reset ngữ cảnh hội thoại' });
    }

    if (typeof next === 'function') {
      return next();
    }

    sendJson(res, 404, { error: 'Botpress endpoint not found' });
  } catch (err) {
    console.error('[Botpress Middleware Error]:', err);
    sendJson(res, 500, {
      error: 'Lỗi máy chủ nội bộ khi xử lý Botpress API',
      details: err.message
    });
  }
}
