// Client-side API клиент для работы с Gemini AI

import { generateContent } from './gemini'

export async function chatAPI(message: string, history: any[], portfolio?: any) {
  try {
    const prompt = buildChatPrompt(message, portfolio)
    const response = await generateContent(prompt)
    return response
  } catch (error) {
    console.error('Chat API error:', error)
    // Fallback на локальную логику
    return getLocalResponse(message)
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
    // Проверяем, что результат валидный
    if (result && result.chance !== undefined) {
      return result
    }
  } catch (error) {
    console.error('Admission API error:', error)
    // Продолжаем к fallback
  }
  
  // Fallback на локальный расчет
  return calculateLocalChance(portfolio, program, university)
}

function buildChatPrompt(message: string, portfolio?: any): string {
  return `Ты AI-помощник платформы KZ UniVerse - единой платформы для выбора университетов в Казахстане.

В базе данных 15 университетов и 18 программ обучения.

Топ университеты:
- NU (Nazarbayev University): рейтинг 4.9/5.0, город Астана, стоимость от 7-9K USD/год
- КазНУ (Al-Farabi Kazakh National University): рейтинг 4.7/5.0, город Алматы, стоимость от 0.6-1.8M₸/год
- AITU (Astana IT University): рейтинг 4.6/5.0, город Астана, стоимость от 1.8-2.2M₸/год
- КБТУ (Kazakh-British Technical University): рейтинг 4.5/5.0, город Алматы, стоимость от 1.5-2.5M₸/год
- KIMEP University: рейтинг 4.4/5.0, город Алматы, стоимость от 2.2-3.5M₸/год

${portfolio ? `ПОРТФОЛИО СТУДЕНТА:
- ЕНТ: ${portfolio.entScore || 'не указано'}
- GPA: ${portfolio.gpa || 'не указано'}
- IELTS: ${portfolio.ieltsScore || 'не указано'}
- Достижения: ${portfolio.achievements?.length || 0}
- Олимпиады: ${portfolio.olympiads?.length || 0}
` : ''}

ВОПРОС ПОЛЬЗОВАТЕЛЯ: ${message}

ИНСТРУКЦИИ:
1. Отвечай на русском языке
2. Будь дружелюбным и профессиональным
3. Используй конкретные данные из базы
4. Давай детальные рекомендации
5. Если спрашивают про конкретный университет - используй данные о нем
6. Предлагай альтернативы если нужно
7. Форматируй ответ с эмодзи и структурированно

ОТВЕТ:`
}

function buildAdmissionPrompt(portfolio: any, program: any, university: any): string {
  return `Рассчитай шансы поступления студента.

ПОРТФОЛИО:
- ЕНТ: ${portfolio.entScore || 'не указано'}
- GPA: ${portfolio.gpa || 'не указано'}

ПРОГРАММА: ${program.nameRu}
УНИВЕРСИТЕТ: ${university.name}
РЕЙТИНГ: ${university.rating}/5.0

Ответ в JSON:
{
  "chance": число_0_100,
  "factors": {
    "entScore": число,
    "gpa": число,
    "achievements": число,
    "competition": число
  },
  "recommendations": ["рекомендация1", "рекомендация2"]
}`
}

function parseAdmissionResponse(text: string, portfolio: any, program: any, university: any): any {
  try {
    // Пытаемся найти JSON в ответе
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      // Проверяем, что есть все необходимые поля
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
  // Возвращаем null, чтобы вызвать fallback в admissionChanceAPI
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

function getLocalResponse(message: string): string {
  const lower = message.toLowerCase()
  if (lower.includes('it') || lower.includes('программирование')) {
    return '💻 Для IT рекомендую: AITU, Nazarbayev University, МУИТ'
  }
  if (lower.includes('бизнес') || lower.includes('экономика')) {
    return '💼 Для бизнеса: KIMEP, Nazarbayev University, КЭУ'
  }
  return 'Я могу помочь с выбором университета. Задайте конкретный вопрос!'
}

