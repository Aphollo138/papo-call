export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { type, userId, username, content } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';

  const forbiddenWords = ['porra', 'caralho', 'buceta', 'foda', 'puta', 'merda', 'cacete', 'foder', 'cuzão', 'arrombado'];
  
  let infractionDetected = false;
  let reason = '';

  if (type === 'chat') {
    const lowerContent = (content || '').toLowerCase();
    for (const word of forbiddenWords) {
      if (lowerContent.includes(word)) {
        infractionDetected = true;
        reason = 'Linguagem ofensiva';
        break;
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
    
    // Send to Telegram
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (token && chatId) {
      try {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: alertMessage,
            parse_mode: 'HTML'
          })
        });
      } catch (err) {
        console.error("Erro ao enviar pro Telegram: ", err);
      }
    }
    
    return res.status(403).json({ blocked: true, reason });
  } else {
    return res.json({ blocked: false });
  }
}
