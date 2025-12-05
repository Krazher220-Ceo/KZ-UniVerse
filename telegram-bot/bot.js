// Telegram Bot для KZ UniVerse
// Использование: node bot.js

const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN';
const API_URL = process.env.API_URL || 'http://localhost:3000';

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Команды
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `👋 Добро пожаловать в KZ UniVerse Bot!

Я помогу вам:
🎓 Найти подходящий университет
📊 Рассчитать шансы поступления
💬 Получить консультацию по выбору вуза

Команды:
/universities - Список университетов
/search <название> - Поиск университета
/chances - Рассчитать шансы поступления
/help - Помощь

Или просто задайте вопрос!`);
});

bot.onText(/\/universities/, async (msg) => {
  const chatId = msg.chat.id;
  
  try {
    const response = await fetch(`${API_URL}/api/universities`);
    const universities = await response.json();
    
    let text = '🏛️ **Топ университетов Казахстана:**\n\n';
    universities.slice(0, 10).forEach((uni, index) => {
      text += `${index + 1}. ${uni.shortName} - ${uni.name}\n`;
      text += `   Рейтинг: ${uni.rating}/5.0\n`;
      text += `   Город: ${uni.city}\n\n`;
    });
    
    bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
  } catch (error) {
    bot.sendMessage(chatId, 'Ошибка при загрузке данных');
  }
});

bot.onText(/\/search (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const query = match[1];
  
  try {
    const response = await fetch(`${API_URL}/api/universities?q=${encodeURIComponent(query)}`);
    const universities = await response.json();
    
    if (universities.length === 0) {
      bot.sendMessage(chatId, 'Университеты не найдены');
      return;
    }
    
    let text = `🔍 **Результаты поиска:**\n\n`;
    universities.slice(0, 5).forEach(uni => {
      text += `🏛️ ${uni.shortName}\n`;
      text += `   ${uni.name}\n`;
      text += `   Рейтинг: ${uni.rating}/5.0\n`;
      text += `   Город: ${uni.city}\n\n`;
    });
    
    bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
  } catch (error) {
    bot.sendMessage(chatId, 'Ошибка при поиске');
  }
});

bot.onText(/\/chances/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `📊 Для расчета шансов поступления:

1. Укажите ваш балл ЕНТ
2. Выберите университет
3. Выберите программу

Или используйте веб-версию: ${API_URL}/profile`);
});

// Обработка текстовых сообщений (AI чат)
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  
  // Пропускаем команды
  if (text?.startsWith('/')) return;
  
  if (!text) return;
  
  try {
    // Отправляем в AI API
    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        history: []
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      bot.sendMessage(chatId, data.response || 'Не удалось получить ответ');
    } else {
      bot.sendMessage(chatId, 'Ошибка при обработке запроса');
    }
  } catch (error) {
    bot.sendMessage(chatId, 'Произошла ошибка. Попробуйте позже.');
  }
});

console.log('🤖 Telegram Bot запущен!');

