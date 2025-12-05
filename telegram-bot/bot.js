// Telegram Bot для KZ UniVerse
// Использование: node bot.js

const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8552407784:AAHHb30Zi5N4Na6AEAoe2S6_7UUHMmiQlA4';
const GEMINI_API_KEY = 'AIzaSyCIhH-3VKldhugzLWxf4UWQ6tCrcksrjdA';
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
    // Показываем индикатор печати
    bot.sendChatAction(chatId, 'typing');
    
    const prompt = `Ты AI-помощник платформы KZ UniVerse - единой платформы для выбора университетов в Казахстане.

В базе данных 15 университетов и 18 программ обучения.

Топ университеты:
- NU (Nazarbayev University): рейтинг 4.9/5.0, город Астана, стоимость от 7-9K USD/год
- КазНУ (Al-Farabi Kazakh National University): рейтинг 4.7/5.0, город Алматы, стоимость от 0.6-1.8M₸/год
- AITU (Astana IT University): рейтинг 4.6/5.0, город Астана, стоимость от 1.8-2.2M₸/год
- КБТУ (Kazakh-British Technical University): рейтинг 4.5/5.0, город Алматы, стоимость от 1.5-2.5M₸/год
- KIMEP University: рейтинг 4.4/5.0, город Алматы, стоимость от 2.2-3.5M₸/год

ВОПРОС ПОЛЬЗОВАТЕЛЯ: ${text}

ИНСТРУКЦИИ:
1. Отвечай на русском языке
2. Будь дружелюбным и профессиональным
3. Используй конкретные данные из базы
4. Давай детальные рекомендации
5. Если спрашивают про конкретный университет - используй данные о нем
6. Предлагай альтернативы если нужно
7. Форматируй ответ с эмодзи и структурированно

ОТВЕТ:`;
    
    // Используем прямой fetch для надежности
    const apiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      }
    );
    
    if (!apiResponse.ok) {
      throw new Error(`API error: ${apiResponse.status}`);
    }
    
    const data = await apiResponse.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Не удалось получить ответ';
    
    // Разбиваем длинные ответы на части (Telegram лимит 4096 символов)
    if (aiResponse.length > 4000) {
      const chunks = aiResponse.match(/.{1,4000}/g) || [];
      for (const chunk of chunks) {
        await bot.sendMessage(chatId, chunk);
      }
    } else {
      await bot.sendMessage(chatId, aiResponse);
    }
  } catch (error) {
    console.error('Bot error:', error);
    bot.sendMessage(chatId, 'Произошла ошибка при обработке запроса. Попробуйте позже или переформулируйте вопрос.');
  }
});

console.log('🤖 Telegram Bot запущен!');

