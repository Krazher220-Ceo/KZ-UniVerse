# 🤖 Настройка AI моделей для KZ UniVerse

## 📋 Обзор

KZ UniVerse использует AI для:
- **AI-помощник** - консультации по выбору университета
- **Предсказание шансов поступления** - на основе портфолио студента
- **Персонализированные рекомендации** - подбор программ под профиль

## 🔧 Текущая реализация

### Базовый режим (без API)
- Использует pattern matching
- Работает без внешних зависимостей
- Быстрые ответы
- Покрывает основные сценарии

### Продвинутый режим (с AI API)

## 🚀 Настройка OpenAI API

### Шаг 1: Получить API ключ

1. Зарегистрируйтесь на https://platform.openai.com
2. Перейдите в раздел API Keys
3. Создайте новый ключ
4. Скопируйте ключ (начинается с `sk-`)

### Шаг 2: Добавить ключ в проект

Создайте файл `.env.local`:

```env
OPENAI_API_KEY=sk-your-key-here
```

### Шаг 3: Обновить API endpoint

Файл: `app/api/chat/route.ts`

```typescript
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  const { message, history } = await request.json()
  
  // Используем OpenAI если ключ есть
  if (process.env.OPENAI_API_KEY) {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Ты AI-помощник платформы KZ UniVerse. Помогаешь студентам выбрать университет в Казахстане."
        },
        ...history,
        { role: "user", content: message }
      ],
      temperature: 0.7,
    })
    
    return NextResponse.json({ 
      response: completion.choices[0].message.content 
    })
  }
  
  // Fallback на pattern matching
  return NextResponse.json({ 
    response: generateEnhancedResponse(message, history, universities, programs) 
  })
}
```

### Шаг 4: Установить библиотеку

```bash
npm install openai
```

## 🎯 Настройка для предсказания шансов поступления

### Модель для анализа портфолио

Создайте файл `app/api/admission-chance/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { UserPortfolio, AdmissionRequirements } from '@/types'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  const { portfolio, program, requirements } = await request.json()
  
  const prompt = `
Проанализируй шансы поступления студента:

Портфолио:
- ЕНТ: ${portfolio.entScore || 'не указано'}
- GPA: ${portfolio.gpa || 'не указано'}
- Достижения: ${portfolio.achievements.length}
- Олимпиады: ${portfolio.olympiads.length}

Требования программы:
- Минимальный ЕНТ: ${requirements.minENT}
- Предметы: ${requirements.requiredSubjects.join(', ')}

Рассчитай шанс поступления (0-100%) и дай рекомендации.
Ответ в формате JSON:
{
  "chance": число,
  "factors": {
    "entScore": число,
    "gpa": число,
    "achievements": число,
    "competition": число
  },
  "recommendations": ["рекомендация1", "рекомендация2"]
}
`

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "Ты эксперт по поступлению в вузы Казахстана." },
      { role: "user", content: prompt }
    ],
    temperature: 0.3,
    response_format: { type: "json_object" }
  })
  
  return NextResponse.json(JSON.parse(completion.choices[0].message.content || '{}'))
}
```

## 💰 Альтернативы OpenAI

### 1. Anthropic Claude

```bash
npm install @anthropic-ai/sdk
```

```typescript
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const message = await anthropic.messages.create({
  model: "claude-3-opus-20240229",
  max_tokens: 1024,
  messages: [{ role: "user", content: prompt }]
})
```

### 2. Google Gemini

```bash
npm install @google/generative-ai
```

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

const result = await model.generateContent(prompt)
```

### 3. Локальные модели (Ollama)

```bash
# Установить Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Загрузить модель
ollama pull llama2
```

```typescript
const response = await fetch('http://localhost:11434/api/generate', {
  method: 'POST',
  body: JSON.stringify({
    model: 'llama2',
    prompt: prompt,
  })
})
```

## 📊 Оптимизация затрат

### 1. Кеширование ответов

```typescript
import { Redis } from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

// Проверяем кеш перед запросом к API
const cacheKey = `ai:${hashMessage(message)}`
const cached = await redis.get(cacheKey)
if (cached) return JSON.parse(cached)

// Сохраняем в кеш
await redis.setex(cacheKey, 3600, JSON.stringify(response))
```

### 2. Использование более дешевых моделей

- GPT-3.5-turbo вместо GPT-4 (в 10 раз дешевле)
- Claude Haiku для простых запросов
- Локальные модели для частых запросов

### 3. Batch processing

Группируйте похожие запросы:

```typescript
const batch = await Promise.all([
  analyzePortfolio(portfolio1),
  analyzePortfolio(portfolio2),
  analyzePortfolio(portfolio3)
])
```

## 🔒 Безопасность

1. **Никогда не коммитьте API ключи**
   - Используйте `.env.local` (в .gitignore)
   - Используйте секреты GitHub Actions для production

2. **Rate limiting**
   ```typescript
   import rateLimit from 'express-rate-limit'
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 минут
     max: 100 // максимум 100 запросов
   })
   ```

3. **Валидация входных данных**
   ```typescript
   if (message.length > 1000) {
     return NextResponse.json({ error: 'Message too long' }, { status: 400 })
   }
   ```

## 📈 Мониторинг

### Отслеживание использования

```typescript
// Логируем каждый запрос
console.log({
  model: 'gpt-4',
  tokens: completion.usage?.total_tokens,
  cost: calculateCost(completion.usage),
  timestamp: new Date()
})
```

### Установка лимитов

```typescript
const DAILY_LIMIT = 1000 // токенов в день
const monthlyUsage = await getMonthlyUsage(userId)

if (monthlyUsage > DAILY_LIMIT) {
  return NextResponse.json({ 
    error: 'Daily limit exceeded' 
  }, { status: 429 })
}
```

## 🎯 Рекомендуемая конфигурация

### Для разработки:
- Используйте базовый режим (pattern matching)
- Или локальные модели (Ollama)

### Для production:
- OpenAI GPT-3.5-turbo для чата
- GPT-4 для анализа портфолио (более точный)
- Кеширование ответов
- Rate limiting

## 📝 Примеры промптов

### Промпт для консультации:

```
Ты AI-помощник платформы KZ UniVerse. 
Помогаешь студентам выбрать университет в Казахстане.

Контекст:
- В базе ${universities.length} университетов
- ${programs.length} программ обучения
- Данные актуальны на 2025 год

Правила:
1. Отвечай на русском или казахском
2. Будь дружелюбным и профессиональным
3. Используй данные из базы
4. Давай конкретные рекомендации
```

### Промпт для анализа шансов:

```
Проанализируй шансы поступления студента в университет.

Портфолио студента:
[данные]

Требования программы:
[данные]

Исторические данные:
- Средний конкурс: 3-5 человек на место
- Проходной балл прошлого года: [данные]

Рассчитай реалистичный шанс (0-100%) и дай 3-5 конкретных рекомендаций.
```

## ✅ Checklist настройки

- [ ] Получен API ключ
- [ ] Добавлен в .env.local
- [ ] Установлена библиотека (openai/anthropic/etc)
- [ ] Обновлен API endpoint
- [ ] Настроен кеширование
- [ ] Добавлен rate limiting
- [ ] Настроен мониторинг
- [ ] Протестировано локально
- [ ] Добавлены секреты в GitHub Actions (для production)

---

**Готово! Теперь AI использует продвинутые модели для более точных ответов.**

