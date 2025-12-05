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
    // Импортируем данные напрямую (в production нужно через API)
    const universities = [
      { shortName: 'NU', name: 'Nazarbayev University', rating: 4.9, city: 'Астана' },
      { shortName: 'КазНУ', name: 'Al-Farabi Kazakh National University', rating: 4.7, city: 'Алматы' },
      { shortName: 'AITU', name: 'Astana IT University', rating: 4.6, city: 'Астана' },
      { shortName: 'КБТУ', name: 'Kazakh-British Technical University', rating: 4.5, city: 'Алматы' },
      { shortName: 'KIMEP', name: 'KIMEP University', rating: 4.4, city: 'Алматы' },
      { shortName: 'SDU', name: 'Suleyman Demirel University', rating: 4.3, city: 'Алматы' },
      { shortName: 'МУИТ', name: 'Международный университет информационных технологий', rating: 4.5, city: 'Алматы' },
      { shortName: 'IITU', name: 'International IT University', rating: 4.4, city: 'Алматы' },
      { shortName: 'КЭУ', name: 'Карагандинский экономический университет', rating: 4.2, city: 'Караганда' },
      { shortName: 'КарТУ', name: 'Карагандинский технический университет', rating: 4.1, city: 'Караганда' }
    ];
    
    let text = '🏛️ *Топ университетов Казахстана:*\n\n';
    universities.forEach((uni, index) => {
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
  const query = match[1].toLowerCase();
  
  try {
    const allUniversities = [
      { shortName: 'NU', name: 'Nazarbayev University', rating: 4.9, city: 'Астана' },
      { shortName: 'КазНУ', name: 'Al-Farabi Kazakh National University', rating: 4.7, city: 'Алматы' },
      { shortName: 'AITU', name: 'Astana IT University', rating: 4.6, city: 'Астана' },
      { shortName: 'КБТУ', name: 'Kazakh-British Technical University', rating: 4.5, city: 'Алматы' },
      { shortName: 'KIMEP', name: 'KIMEP University', rating: 4.4, city: 'Алматы' },
      { shortName: 'SDU', name: 'Suleyman Demirel University', rating: 4.3, city: 'Алматы' },
      { shortName: 'МУИТ', name: 'Международный университет информационных технологий', rating: 4.5, city: 'Алматы' },
      { shortName: 'IITU', name: 'International IT University', rating: 4.4, city: 'Алматы' }
    ];
    
    const universities = allUniversities.filter(uni => 
      uni.shortName.toLowerCase().includes(query) ||
      uni.name.toLowerCase().includes(query) ||
      uni.city.toLowerCase().includes(query)
    );
    
    if (universities.length === 0) {
      bot.sendMessage(chatId, 'Университеты не найдены');
      return;
    }
    
    let text = `🔍 *Результаты поиска:*\n\n`;
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

// Обработка текстовых сообщений (AI чат через Gemini)
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  
  // Пропускаем команды
  if (text?.startsWith('/')) return;
  
  if (!text) return;
  
  try {
    // Прямой вызов Gemini API
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCIhH-3VKldhugzLWxf4UWQ6tCrcksrjdA';
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    
    const prompt = `Ты AI-помощник платформы KZ UniVerse. Помогаешь студентам выбрать университет в Казахстане.

Вопрос: ${text}

Отвечай на русском языке, будь дружелюбным и конкретным.`;
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Не удалось получить ответ';
      bot.sendMessage(chatId, aiResponse);
    } else {
      bot.sendMessage(chatId, 'Ошибка при обработке запроса. Попробуйте позже.');
    }
  } catch (error) {
    console.error('Bot error:', error);
    bot.sendMessage(chatId, 'Произошла ошибка. Попробуйте позже.');
  }
});

console.log('🤖 Telegram Bot запущен!');

