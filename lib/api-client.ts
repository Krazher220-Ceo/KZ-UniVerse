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
    return parseAdmissionResponse(text, portfolio, program, university)
  } catch (error) {
    console.error('Admission API error:', error)
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
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        universityId: university.id,
        programId: program.id,
        chance: Math.max(0, Math.min(100, parsed.chance || 50)),
        factors: parsed.factors || {},
        recommendations: parsed.recommendations || []
      }
    }
  } catch (e) {
    console.error('Parse error:', e)
  }
  return calculateLocalChance(portfolio, program, university)
}

function calculateLocalChance(portfolio: any, program: any, university: any): any {
  const minENT = program.requirements?.minENT || 50
  const entScore = portfolio.entScore 
    ? Math.min(100, (portfolio.entScore / minENT) * 100)
    : 0
  const gpa = portfolio.gpa ? (portfolio.gpa / 5.0) * 100 : 0
  const achievements = Math.min(100, (portfolio.achievements?.length || 0) * 10)
  const competition = university.rating * 20
  
  const chance = Math.max(0, Math.min(100, 
    entScore * 0.4 + gpa * 0.2 + achievements * 0.3 - (competition - 50) * 0.1
  ))

  return {
    universityId: university.id,
    programId: program.id,
    chance: Math.round(chance),
    factors: { 
      entScore: Math.round(entScore), 
      gpa: Math.round(gpa), 
      achievements: Math.round(achievements), 
      competition: Math.round(competition) 
    },
    recommendations: [
      portfolio.entScore && portfolio.entScore < minENT 
        ? `Повысить ЕНТ до ${minENT}+` 
        : 'ЕНТ соответствует требованиям',
      'Участвовать в олимпиадах',
      'Подготовить портфолио проектов'
    ]
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

