import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';

const app = express();
const PORT = 3000;

app.use(express.json());

// Profanity list
const forbiddenWords = ['porra', 'caralho', 'buceta', 'foda', 'puta', 'merda', 'cacete', 'foder', 'cuzão', 'arrombado'];

async function sendTelegramAlert(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn("TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not configured.");
    return;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    });
    if (!response.ok) {
      console.error("Failed to send Telegram message", await response.text());
    }
  } catch (error) {
    console.error("Error sending Telegram message", error);
  }
}

// Rate limiting for spam detection (messages per active session/IP)
const messageCounts = new Map<string, { count: number, resetTime: number }>();

app.post('/api/moderate', (req, res) => {
  const { type, userId, username, content } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
  const userKey = userId || ip; // Use user ID or fallback to IP

  let infractionDetected = false;
  let reason = '';

  const now = Date.now();
  if (type === 'chat') {
    // Spam Detection: Max 5 messages per 10 seconds
    const userLimits = messageCounts.get(userKey) || { count: 0, resetTime: now + 10000 };
    if (now > userLimits.resetTime) {
      userLimits.count = 1;
      userLimits.resetTime = now + 10000;
    } else {
      userLimits.count++;
    }
    messageCounts.set(userKey, userLimits);

    if (userLimits.count > 5) {
      infractionDetected = true;
      reason = 'Spam/Flood detectado (Muitas mensagens em poucos segundos)';
    } else {
      // Content moderation
      const lowerContent = (content || '').toLowerCase();
      for (const word of forbiddenWords) {
        if (lowerContent.includes(word)) {
          infractionDetected = true;
          reason = 'Linguagem ofensiva';
          break;
        }
      }
    }
  } else if (type === 'spam') {
    infractionDetected = true;
    reason = 'Spam/Flood detectado';
  } else if (type === 'devtools') {
    infractionDetected = true;
    reason = 'Comportamento Suspeito (DevTools/DOM Manipulation)';
  }

  if (infractionDetected) {
    const alertMessage = `🚨 <b>ALERTA DE MODERAÇÃO</b> 🚨\n\n<b>Usuário:</b> ${username || 'Desconhecido'}\n<b>ID:</b> ${userId || 'Desconhecido'}\n<b>IP:</b> ${ip}\n\n<b>Motivo:</b> ${reason}\n<b>Ação/Conteúdo:</b> "${content || 'N/A'}"\n\n<b>Horário:</b> ${new Date().toLocaleString('pt-BR')}`;
    sendTelegramAlert(alertMessage);
    
    // Send 403 back so the client knows it was blocked
    res.status(403).json({ blocked: true, reason });
  } else {
    res.json({ blocked: false });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
