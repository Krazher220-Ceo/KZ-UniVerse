// Client-side API клиент для работы с AI
// Поддерживает Gemini API с умным fallback

import { generateContent } from './gemini'
import { UNIVERSITIES_CONTEXT } from './ai-providers'

export async function chatAPI(message: string, history: any[], portfolio?: any) {
  try {
    const prompt = buildChatPrompt(message, portfolio)
    const response = await generateContent(prompt)
    return response
  } catch (error) {
    console.error('Chat API error:', error)
    // Fallback на локальную логику
    return getSmartLocalResponse(message)
  }
}

export async function admissionChanceAPI(portfolio: any, universityId: string, programId: string) {
  // Импортируем данные
  const universities = await import('@/data/universities.json')
  const programs = await import('@/data/programs.json')
  
  const university = universities.default.find((u: any) => u.id === universityId)
  const program = programs.default.find((p: any) => p.id === programId)
  
  if (!university || !program) {
    return {
      universityId,
      programId,
      chance: 0,
      factors: { entScore: 0, gpa: 0, achievements: 0, competition: 0 },
      recommendations: ['Университет или программа не найдены']
    }
  }

  try {
    // Используем Gemini для расчета
    const prompt = buildAdmissionPrompt(portfolio, program, university)
    const text = await generateContent(prompt)
    const result = parseAdmissionResponse(text, portfolio, program, university)
    if (result && result.chance !== undefined) {
      return result
    }
  } catch (error) {
    console.error('Admission API error:', error)
  }
  
  // Fallback на локальный расчет
  return calculateLocalChance(portfolio, program, university)
}

function buildChatPrompt(message: string, portfolio?: any): string {
  return `Ты AI-помощник платформы KZ UniVerse - единой платформы для выбора университетов в Казахстане.

${UNIVERSITIES_CONTEXT}

${portfolio ? `ПОРТФОЛИО СТУДЕНТА:
- ЕНТ: ${portfolio.entScore || 'не указано'}
- GPA: ${portfolio.gpa || 'не указано'}
- IELTS: ${portfolio.ieltsScore || 'не указано'}
- Достижения: ${portfolio.achievements?.length || 0}
- Олимпиады: ${portfolio.olympiads?.length || 0}
` : ''}

ВОПРОС ПОЛЬЗОВАТЕЛЯ: ${message}

ИНСТРУКЦИИ:
1. Отвечай ТОЛЬКО на русском языке
2. Используй КОНКРЕТНЫЕ данные из базы выше
3. Будь дружелюбным и профессиональным
4. Давай детальные рекомендации с цифрами
5. Если спрашивают про конкретный университет - дай полную информацию
6. Предлагай альтернативы если нужно
7. Форматируй ответ с эмодзи и структурированно

ОТВЕТ:`
}

function buildAdmissionPrompt(portfolio: any, program: any, university: any): string {
  return `Рассчитай шансы поступления студента.

ПОРТФОЛИО:
- ЕНТ: ${portfolio.entScore || 'не указано'}
- GPA: ${portfolio.gpa || 'не указано'}
- Достижения: ${portfolio.achievements?.length || 0}
- Олимпиады: ${portfolio.olympiads?.length || 0}

ПРОГРАММА: ${program.nameRu}
УНИВЕРСИТЕТ: ${university.name}
РЕЙТИНГ: ${university.rating}/5.0
МИНИМАЛЬНЫЙ ЕНТ: ${program.requirements?.minENT || 50}

Ответ СТРОГО в JSON формате:
{
  "chance": число_от_0_до_100,
  "factors": {
    "entScore": число_от_0_до_100,
    "gpa": число_от_0_до_100,
    "achievements": число_от_0_до_100,
    "competition": число_от_0_до_100
  },
  "recommendations": ["рекомендация1", "рекомендация2", "рекомендация3"]
}`
}

function parseAdmissionResponse(text: string, portfolio: any, program: any, university: any): any {
  try {
    // Пытаемся найти JSON в ответе
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      if (parsed.chance !== undefined) {
        return {
          universityId: university.id,
          programId: program.id,
          chance: Math.max(0, Math.min(100, Number(parsed.chance) || 50)),
          factors: {
            entScore: Number(parsed.factors?.entScore) || 0,
            gpa: Number(parsed.factors?.gpa) || 0,
            achievements: Number(parsed.factors?.achievements) || 0,
            competition: Number(parsed.factors?.competition) || 0
          },
          recommendations: Array.isArray(parsed.recommendations) 
            ? parsed.recommendations 
            : ['Улучшить оценки', 'Участвовать в олимпиадах']
        }
      }
    }
    
    // Если не нашли JSON, пытаемся извлечь процент из текста
    const chanceMatch = text.match(/(\d+)%/i)
    if (chanceMatch) {
      const chance = parseInt(chanceMatch[1])
      return {
        universityId: university.id,
        programId: program.id,
        chance: Math.max(0, Math.min(100, chance)),
        factors: {
          entScore: portfolio.entScore ? Math.round((portfolio.entScore / 140) * 100) : 0,
          gpa: portfolio.gpa ? Math.round((portfolio.gpa / 5.0) * 100) : 0,
          achievements: Math.round(Math.min(100, (portfolio.achievements?.length || 0) * 10)),
          competition: Math.round(university.rating * 20)
        },
        recommendations: extractRecommendationsFromText(text)
      }
    }
  } catch (e) {
    console.error('Parse error:', e)
  }
  return null
}

function extractRecommendationsFromText(text: string): string[] {
  const recommendations: string[] = []
  const lines = text.split('\n').filter(l => l.trim())
  
  lines.forEach(line => {
    const lower = line.toLowerCase()
    if (lower.includes('рекоменд') || lower.includes('совет') || lower.includes('улучш')) {
      const clean = line.replace(/[•\-\d\.\*]/g, '').trim()
      if (clean.length > 10 && clean.length < 200) {
        recommendations.push(clean)
      }
    }
  })
  
  return recommendations.length > 0 
    ? recommendations.slice(0, 5) 
    : ['Улучшить оценки', 'Участвовать в олимпиадах', 'Подготовить портфолио']
}

function calculateLocalChance(portfolio: any, program: any, university: any): any {
  // Безопасная обработка данных
  const minENT = program?.requirements?.minENT || 50
  const entScore = portfolio?.entScore 
    ? Math.min(100, Math.max(0, (portfolio.entScore / Math.max(minENT, 1)) * 100))
    : 0
  const gpa = portfolio?.gpa 
    ? Math.min(100, Math.max(0, (portfolio.gpa / 5.0) * 100))
    : 0
  const achievements = Math.min(100, Math.max(0, 
    ((portfolio?.achievements?.length || 0) * 10) + 
    ((portfolio?.olympiads?.length || 0) * 15)
  ))
  const competition = (university?.rating || 0) * 20
  
  // Улучшенная формула расчета
  const baseChance = (entScore * 0.4 + gpa * 0.2 + achievements * 0.3)
  const competitionPenalty = Math.max(0, (competition - 50) * 0.1)
  const chance = Math.max(0, Math.min(100, baseChance - competitionPenalty))

  const recommendations: string[] = []
  
  if (!portfolio?.entScore && !portfolio?.gpa) {
    recommendations.push('Укажите балл ЕНТ или GPA для точного расчета')
  } else {
    if (portfolio?.entScore && portfolio.entScore < minENT) {
      recommendations.push(`Повысить ЕНТ до ${minENT}+ баллов`)
    } else if (portfolio?.entScore) {
      recommendations.push('ЕНТ соответствует требованиям')
    }
    
    if (portfolio?.gpa && portfolio.gpa < 4.0) {
      recommendations.push('Улучшить средний балл до 4.0+')
    }
  }
  
  if (!portfolio?.olympiads || portfolio.olympiads.length === 0) {
    recommendations.push('Участвовать в олимпиадах и конкурсах')
  }
  
  if (!portfolio?.achievements || portfolio.achievements.length === 0) {
    recommendations.push('Подготовить портфолио проектов и достижений')
  }
  
  if (chance < 50) {
    recommendations.push('Рассмотреть альтернативные программы или университеты')
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Ваш профиль соответствует требованиям!')
  }

  return {
    universityId: university?.id || '',
    programId: program?.id || '',
    chance: Math.round(chance),
    factors: { 
      entScore: Math.round(entScore), 
      gpa: Math.round(gpa), 
      achievements: Math.round(achievements), 
      competition: Math.round(competition) 
    },
    recommendations: recommendations.slice(0, 5)
  }
}

// Умный локальный ответ с полной базой данных
function getSmartLocalResponse(message: string): string {
  const lower = message.toLowerCase()

  // IT программы
  if (lower.includes('it') || lower.includes('программирование') || lower.includes('компьютер') || lower.includes('айти')) {
    return `💻 **Лучшие IT-университеты Казахстана:**

1. **AITU** (Astana IT University)
   📍 Астана | ⭐ 4.6/5.0 | 💰 1.8-2.2M₸/год
   🎓 AI, Data Science, Cybersecurity, Software Engineering
   ✅ Партнерство с Google, Microsoft, AWS
   ✅ 99% трудоустройство

2. **Nazarbayev University**
   📍 Астана | ⭐ 4.9/5.0 | 💰 $7-9K/год
   🎓 Computer Science, Engineering
   ✅ Топ-300 мировых рейтингов

3. **МУИТ** (IITU)
   📍 Алматы | ⭐ 4.4/5.0 | 💰 1.6-2M₸/год
   🎓 Software Engineering, Data Science, AI
   ✅ Партнерство с Kaspersky, EPAM

4. **КБТУ**
   📍 Алматы | ⭐ 4.5/5.0 | 💰 1.5-2.5M₸/год
   🎓 IT, Engineering
   ✅ Британские стандарты

💡 **Рекомендация:** Для IT-специальностей лучший выбор - AITU или NU!`
  }

  // Бизнес
  if (lower.includes('бизнес') || lower.includes('экономика') || lower.includes('финанс') || lower.includes('менеджмент')) {
    return `💼 **Лучшие бизнес-программы:**

1. **KIMEP University** - Лучшая бизнес-школа ЦА
   📍 Алматы | ⭐ 4.6/5.0 | 💰 2.2-3.5M₸/год
   ✅ Единственная AACSB аккредитация в ЦА
   ✅ 100% на английском языке

2. **NU Graduate School of Business**
   📍 Астана | ⭐ 4.9/5.0 | 💰 $7-9K/год
   ✅ Международный уровень

3. **КБТУ** - Экономика и бизнес
   📍 Алматы | ⭐ 4.5/5.0 | 💰 1.5-2.5M₸/год
   ✅ Британские стандарты

💡 **Совет:** KIMEP - золотой стандарт бизнес-образования!`
  }

  // Гранты
  if (lower.includes('грант') || lower.includes('стипенди') || lower.includes('бесплатно')) {
    return `🎓 **Гранты и стипендии:**

📋 **Государственные гранты:**
• По результатам ЕНТ
• Покрывают 100% стоимости
• Проходной балл: 110-130

🏛️ **Университетские гранты:**
• NU - полные гранты для топ-абитуриентов
• AITU - гранты до 100% для IT-талантов
• KIMEP - стипендии до 50%

💰 **Стипендии:**
• Государственная: 36,000₸/мес
• NU: до 100,000₸/мес

💡 **Совет:** Набирайте 120+ баллов ЕНТ!`
  }

  // Сравнение
  if (lower.includes('сравн') || lower.includes('лучш') || lower.includes('топ')) {
    return `📊 **Топ университеты Казахстана:**

| Университет | Рейтинг | Город | Стоимость |
|-------------|---------|-------|-----------|
| NU          | 4.9 ⭐  | Астана | $7-9K    |
| КазНУ       | 4.7 ⭐  | Алматы | 0.6-1.8M₸|
| AITU        | 4.6 ⭐  | Астана | 1.8-2.2M₸|
| KIMEP       | 4.6 ⭐  | Алматы | 2.2-3.5M₸|
| КБТУ        | 4.5 ⭐  | Алматы | 1.5-2.5M₸|

🎯 **По направлениям:**
• IT: AITU, МУИТ, NU
• Бизнес: KIMEP, NU
• Инженерия: КБТУ, КазНУ
• Медицина: SDU, NU`
  }

  // Поступление
  if (lower.includes('поступ') || lower.includes('документ') || lower.includes('ент')) {
    return `📝 **Процесс поступления:**

1️⃣ **Сдать ЕНТ** (июнь-июль)
   • Проходной балл: 50-130
   • Для грантов: 110+

2️⃣ **Документы:**
   • Аттестат
   • Удостоверение личности
   • Фото 3x4
   • Сертификат ЕНТ

3️⃣ **Подача заявления:**
   • Онлайн или лично
   • Дедлайн: 10-20 августа

📅 **Важные даты:**
• ЕНТ: июнь-июль
• Прием: 1 июля - 20 августа
• Зачисление: 25 августа`
  }

  // Дефолтный ответ
  return `👋 Привет! Я AI-помощник KZ UniVerse.

🎓 Могу помочь с:
• Информацией о университетах Казахстана
• Выбором программы обучения
• Сравнением вузов
• Грантами и стипендиями
• Процессом поступления

📝 **Примеры вопросов:**
• "Лучшие IT университеты"
• "Как получить грант?"
• "Сравни NU и AITU"
• "Расскажи про KIMEP"

Задайте ваш вопрос! 😊`
}
