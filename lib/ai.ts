// Единый AI модуль для всего проекта
// Приоритет: Ollama (локально) → Gemini (облако) → Fallback

import { checkOllamaAvailable, generateWithOllama } from './ollama'
import { generateContent as generateGeminiContent } from './gemini'

// Системный промпт для университетов Казахстана
const SYSTEM_CONTEXT = `Ты AI-помощник платформы KZ UniVerse для абитуриентов Казахстана.

ТВОИ ЗНАНИЯ:
- Университеты: NU (Nazarbayev University), AITU, КазНУ, КБТУ, KIMEP, МУИТ, SDU, ЕНУ
- ЕНТ: максимум 140 баллов, для гранта нужно 100+, для топ-вузов 110-120+
- Гранты: государственные через egov.kz, распределяются по баллам ЕНТ
- Сроки: ЕНТ в июне, подача документов июль-август, учёба с сентября
- IELTS: нужен для англоязычных программ (NU, KIMEP), минимум 5.5-6.5

УНИВЕРСИТЕТЫ:
1. Nazarbayev University (NU) - Астана, рейтинг 4.9, $7-9K/год, топ-300 мира
2. AITU - Астана, рейтинг 4.6, 1.8-2.2M₸/год, специализация IT
3. КазНУ - Алматы, рейтинг 4.7, 0.6-1.8M₸/год, крупнейший вуз РК
4. КБТУ - Алматы, рейтинг 4.5, 1.5-2.5M₸/год, британские стандарты
5. KIMEP - Алматы, рейтинг 4.6, 2.2-3.5M₸/год, бизнес-школа
6. МУИТ - Алматы, рейтинг 4.4, 1.6-2M₸/год, IT
7. SDU - Алматы, рейтинг 4.4, 1.4-2.8M₸/год, турецкий стандарт
8. ЕНУ - Астана, рейтинг 4.5, 0.55-1.2M₸/год, классический

ПРАВИЛА:
- Отвечай на русском языке
- Будь кратким и полезным
- Давай конкретные советы с цифрами
- Используй эмодзи для структуры`

// Проверка статуса AI
export async function getAIStatus(): Promise<{
  ollama: boolean
  gemini: boolean
  activeProvider: 'ollama' | 'gemini' | 'fallback'
}> {
  const ollamaAvailable = await checkOllamaAvailable()
  
  return {
    ollama: ollamaAvailable,
    gemini: true, // Gemini всегда доступен если есть интернет
    activeProvider: ollamaAvailable ? 'ollama' : 'gemini'
  }
}

// Основная функция генерации
export async function generateAIResponse(
  prompt: string, 
  options?: {
    context?: string
    maxTokens?: number
    temperature?: number
  }
): Promise<string> {
  const { context = '', maxTokens = 500, temperature = 0.7 } = options || {}
  
  // 1. Пробуем Ollama (локально)
  try {
    const ollamaAvailable = await checkOllamaAvailable()
    if (ollamaAvailable) {
      console.log('🦙 Using Ollama (local AI)')
      const response = await generateWithOllama(prompt, context || SYSTEM_CONTEXT)
      if (response && response.trim().length > 10) {
        return response.trim()
      }
    }
  } catch (error: any) {
    console.warn('Ollama failed:', error.message)
  }
  
  // 2. Пробуем Gemini (облако)
  try {
    console.log('☁️ Using Gemini API')
    const fullPrompt = context 
      ? `${SYSTEM_CONTEXT}\n\nКОНТЕКСТ:\n${context}\n\nВОПРОС: ${prompt}`
      : `${SYSTEM_CONTEXT}\n\nВОПРОС: ${prompt}`
    
    const response = await generateGeminiContent(fullPrompt)
    if (response && response.trim().length > 10) {
      return response.trim()
    }
  } catch (error: any) {
    console.warn('Gemini failed:', error.message)
  }
  
  // 3. Fallback - локальная логика
  console.log('📋 Using local fallback')
  return getLocalResponse(prompt)
}

// Локальный fallback
function getLocalResponse(prompt: string): string {
  const lower = prompt.toLowerCase()
  
  if (lower.includes('привет') || lower.includes('здравствуй')) {
    return `👋 Привет! Я AI-помощник KZ UniVerse.

Могу помочь с:
• 🏛️ Информацией о университетах Казахстана
• 📚 Выбором программы обучения
• 💰 Грантами и стипендиями
• 📝 Процессом поступления

Задайте вопрос, и я помогу!`
  }
  
  if (lower.includes('it') || lower.includes('программирование') || lower.includes('айти')) {
    return `💻 Лучшие IT-университеты Казахстана:

1. **AITU** (Астана) - специализированный IT-вуз
   • 1.8-2.2M ₸/год
   • Партнёр Google, Microsoft
   • 99% трудоустройство

2. **Nazarbayev University** (Астана)
   • $7-9K/год
   • Топ-300 мира
   • Английский язык

3. **КБТУ** (Алматы)
   • 1.5-2.5M ₸/год
   • Британские стандарты
   
4. **МУИТ** (Алматы)
   • 1.6-2M ₸/год
   • Практико-ориентированный`
  }
  
  if (lower.includes('грант') || lower.includes('стипенди')) {
    return `💰 Гранты в Казахстане:

📌 **Государственный грант:**
• Подача через egov.kz в июле
• Нужен балл ЕНТ от 100+
• Чем выше балл - больше шансов

📌 **Требования по направлениям:**
• IT: от 90 баллов
• Медицина: от 110 баллов
• Инженерия: от 85 баллов

📌 **Альтернативы:**
• Именные стипендии вузов
• Скидки от университетов
• Образовательные кредиты`
  }
  
  if (lower.includes('ент') || lower.includes('тестирование')) {
    return `📝 ЕНТ (Единое Национальное Тестирование):

📅 **Сроки:**
• Регистрация: апрель
• Основной ЕНТ: июнь (20-25)
• Дополнительный: август

📊 **Баллы:**
• Максимум: 140
• Для гранта: от 100
• Для топ-вузов: от 110-120

📚 **Предметы:**
• Обязательные: математика, история КЗ, грамотность
• Профильные: по выбору`
  }
  
  if (lower.includes('nu') || lower.includes('назарбаев')) {
    return `🏛️ Nazarbayev University (NU):

📍 Астана
⭐ Рейтинг: 4.9/5.0
🌍 Топ-295 в мире (QS)

💰 **Стоимость:** $7,000-9,000/год
🎓 **Язык:** 100% английский
📚 **Программы:** IT, Engineering, Business, Medicine, Law

✅ **Преимущества:**
• Партнёрство с MIT, Cambridge, Stanford
• 98% трудоустройство
• Современный кампус

📝 **Поступление:**
• Собственный экзамен (не только ЕНТ)
• IELTS 6.5+
• Мотивационное письмо`
  }
  
  return `🤖 Я AI-помощник KZ UniVerse.

Понял ваш вопрос: "${prompt}"

Могу помочь с:
• 🏛️ Университетами Казахстана
• 📚 Программами обучения
• 💰 Грантами и стипендиями
• 📝 ЕНТ и поступлением

Попробуйте спросить:
• "Расскажи про AITU"
• "Как получить грант?"
• "Лучшие IT программы"`
}

// Анализ шансов поступления
export async function analyzeAdmissionChance(data: {
  entScore?: number
  gpa?: number
  ielts?: number
  achievements?: string[]
  targetUniversity: string
  targetProgram?: string
}): Promise<{
  chance: number
  factors: { name: string; score: number; max: number }[]
  recommendations: string[]
  summary: string
}> {
  const { entScore = 0, gpa = 0, ielts = 0, achievements = [], targetUniversity, targetProgram } = data
  
  // Минимальные требования по вузам
  const requirements: { [key: string]: { minENT: number; ielts?: number } } = {
    'nu': { minENT: 120, ielts: 6.5 },
    'aitu': { minENT: 90 },
    'kaznu': { minENT: 85 },
    'kbtu': { minENT: 90 },
    'kimep': { minENT: 85, ielts: 5.5 },
    'iitu': { minENT: 80 },
    'sdu': { minENT: 80 },
    'enu': { minENT: 75 }
  }
  
  const req = requirements[targetUniversity.toLowerCase()] || { minENT: 80 }
  
  // Расчёт факторов
  const factors = []
  let totalScore = 0
  
  // ЕНТ (40%)
  const entFactor = entScore ? Math.min(100, (entScore / req.minENT) * 100) : 0
  factors.push({ name: 'Балл ЕНТ', score: Math.round(entFactor), max: 100 })
  totalScore += entFactor * 0.4
  
  // GPA (20%)
  const gpaFactor = gpa ? (gpa / 5.0) * 100 : 0
  factors.push({ name: 'GPA', score: Math.round(gpaFactor), max: 100 })
  totalScore += gpaFactor * 0.2
  
  // IELTS (20% если требуется)
  if (req.ielts) {
    const ieltsFactor = ielts ? Math.min(100, (ielts / req.ielts) * 100) : 0
    factors.push({ name: 'IELTS', score: Math.round(ieltsFactor), max: 100 })
    totalScore += ieltsFactor * 0.2
  } else {
    totalScore += 20 // Бонус если IELTS не требуется
  }
  
  // Достижения (20%)
  const achievementsFactor = Math.min(100, achievements.length * 20)
  factors.push({ name: 'Достижения', score: achievementsFactor, max: 100 })
  totalScore += achievementsFactor * 0.2
  
  const chance = Math.round(Math.min(100, totalScore))
  
  // Рекомендации
  const recommendations: string[] = []
  
  if (entScore < req.minENT) {
    recommendations.push(`Повысить ЕНТ до ${req.minENT}+ баллов (текущий: ${entScore || 'не указан'})`)
  }
  if (req.ielts && (!ielts || ielts < req.ielts)) {
    recommendations.push(`Подготовить IELTS ${req.ielts}+ (текущий: ${ielts || 'не указан'})`)
  }
  if (gpa && gpa < 4.0) {
    recommendations.push('Улучшить средний балл до 4.0+')
  }
  if (achievements.length < 3) {
    recommendations.push('Добавить достижения (олимпиады, конкурсы, проекты)')
  }
  if (chance >= 70) {
    recommendations.push('Ваш профиль соответствует требованиям! Подготовьте документы.')
  }
  
  // Резюме
  let summary = ''
  if (chance >= 80) {
    summary = '🟢 Высокие шансы! Ваш профиль отлично подходит.'
  } else if (chance >= 60) {
    summary = '🟡 Хорошие шансы. Есть области для улучшения.'
  } else if (chance >= 40) {
    summary = '🟠 Средние шансы. Рекомендуем усилить подготовку.'
  } else {
    summary = '🔴 Низкие шансы. Нужна серьёзная подготовка или альтернативные варианты.'
  }
  
  return { chance, factors, recommendations, summary }
}

// Подбор университетов
export async function matchUniversities(preferences: {
  interests: string[]
  city: string
  budget: string
  entScore: number
  language: string
}): Promise<{
  universityId: string
  name: string
  matchScore: number
  reasons: string[]
}[]> {
  const universities = [
    { id: 'nu', name: 'Nazarbayev University', city: 'астана', budget: 'high', tags: ['it', 'engineering', 'medicine', 'business', 'english'], minENT: 120 },
    { id: 'aitu', name: 'AITU', city: 'астана', budget: 'medium', tags: ['it', 'ai', 'data-science'], minENT: 90 },
    { id: 'kaznu', name: 'КазНУ', city: 'алматы', budget: 'low', tags: ['it', 'science', 'humanities', 'economics'], minENT: 85 },
    { id: 'kbtu', name: 'КБТУ', city: 'алматы', budget: 'medium', tags: ['it', 'engineering', 'petroleum'], minENT: 90 },
    { id: 'kimep', name: 'KIMEP', city: 'алматы', budget: 'high', tags: ['business', 'finance', 'law', 'english'], minENT: 85 },
    { id: 'iitu', name: 'МУИТ', city: 'алматы', budget: 'medium', tags: ['it', 'programming'], minENT: 80 },
    { id: 'sdu', name: 'SDU', city: 'алматы', budget: 'medium', tags: ['medicine', 'engineering'], minENT: 80 },
    { id: 'enu', name: 'ЕНУ', city: 'астана', budget: 'low', tags: ['humanities', 'science', 'law'], minENT: 75 }
  ]
  
  const results = universities.map(uni => {
    let score = 0
    const reasons: string[] = []
    
    // Интересы (40%)
    const interestMatch = preferences.interests.filter(i => uni.tags.includes(i)).length
    score += (interestMatch / Math.max(preferences.interests.length, 1)) * 40
    if (interestMatch > 0) reasons.push(`${interestMatch} совпадений по интересам`)
    
    // Город (15%)
    if (preferences.city === 'any' || preferences.city === uni.city) {
      score += 15
      if (preferences.city !== 'any') reasons.push(`Город: ${uni.city}`)
    }
    
    // Бюджет (20%)
    if (preferences.budget === 'any' || preferences.budget === uni.budget) {
      score += 20
      reasons.push('Подходит по бюджету')
    }
    
    // ЕНТ (15%)
    if (preferences.entScore >= uni.minENT) {
      score += 15
      reasons.push(`ЕНТ выше минимума (${uni.minENT})`)
    }
    
    // Язык (10%)
    if (preferences.language === 'english' && uni.tags.includes('english')) {
      score += 10
      reasons.push('Обучение на английском')
    } else if (preferences.language !== 'english') {
      score += 10
    }
    
    return {
      universityId: uni.id,
      name: uni.name,
      matchScore: Math.min(100, Math.round(score)),
      reasons
    }
  })
  
  return results.sort((a, b) => b.matchScore - a.matchScore).slice(0, 5)
}

// Прогноз карьеры
export async function predictCareer(field: string): Promise<{
  careers: { title: string; salary: string; demand: string; growth: number }[]
  skills: string[]
  timeline: { year: number; milestone: string }[]
}> {
  const careerData: { [key: string]: any } = {
    'it': {
      careers: [
        { title: 'Software Engineer', salary: '800K - 2M ₸/мес', demand: 'Высокий', growth: 25 },
        { title: 'Data Scientist', salary: '700K - 1.8M ₸/мес', demand: 'Высокий', growth: 35 },
        { title: 'DevOps Engineer', salary: '600K - 1.5M ₸/мес', demand: 'Высокий', growth: 30 },
        { title: 'AI/ML Engineer', salary: '900K - 2.5M ₸/мес', demand: 'Высокий', growth: 40 }
      ],
      skills: ['Python', 'JavaScript', 'SQL', 'Machine Learning', 'Cloud', 'Git'],
      timeline: [
        { year: 1, milestone: 'Junior Developer' },
        { year: 2, milestone: 'Middle Developer' },
        { year: 4, milestone: 'Senior Developer' },
        { year: 6, milestone: 'Tech Lead' }
      ]
    },
    'business': {
      careers: [
        { title: 'Business Analyst', salary: '500K - 1.2M ₸/мес', demand: 'Высокий', growth: 20 },
        { title: 'Product Manager', salary: '700K - 1.8M ₸/мес', demand: 'Высокий', growth: 25 },
        { title: 'Financial Analyst', salary: '500K - 1.5M ₸/мес', demand: 'Высокий', growth: 18 }
      ],
      skills: ['Excel', 'Financial Modeling', 'Data Analysis', 'Presentation', 'Strategy'],
      timeline: [
        { year: 1, milestone: 'Analyst' },
        { year: 3, milestone: 'Senior Analyst' },
        { year: 5, milestone: 'Manager' },
        { year: 8, milestone: 'Director' }
      ]
    }
  }
  
  return careerData[field] || careerData['it']
}

