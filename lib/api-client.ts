// Client-side API клиент для работы с внешним API
// В production API должен быть на отдельном сервере

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.kzuniverse.com'

export async function chatAPI(message: string, history: any[], portfolio?: any) {
  try {
    // Прямой вызов Gemini API с клиента (для MVP)
    const GEMINI_API_KEY = 'AIzaSyCIhH-3VKldhugzLWxf4UWQ6tCrcksrjdA'
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: buildChatPrompt(message, portfolio)
          }]
        }]
      })
    })

    if (response.ok) {
      const data = await response.json()
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Не удалось получить ответ'
    }
  } catch (error) {
    console.error('Chat API error:', error)
  }
  
  // Fallback на локальную логику
  return getLocalResponse(message)
}

export async function admissionChanceAPI(portfolio: any, universityId: string, programId: string) {
  try {
    // Импортируем данные
    const universities = await import('@/data/universities.json')
    const programs = await import('@/data/programs.json')
    
    const university = universities.default.find((u: any) => u.id === universityId)
    const program = programs.default.find((p: any) => p.id === programId)
    
    if (!university || !program) {
      throw new Error('Not found')
    }

    // Используем Gemini для расчета
    const GEMINI_API_KEY = 'AIzaSyCIhH-3VKldhugzLWxf4UWQ6tCrcksrjdA'
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
    
    const prompt = buildAdmissionPrompt(portfolio, program, university)
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    })

    if (response.ok) {
      const data = await response.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
      return parseAdmissionResponse(text, portfolio, program, university)
    }
  } catch (error) {
    console.error('Admission API error:', error)
  }
  
  // Fallback на локальный расчет
  return calculateLocalChance(portfolio, program, university)
}

function buildChatPrompt(message: string, portfolio?: any): string {
  return `Ты AI-помощник платформы KZ UniVerse. Помогаешь студентам выбрать университет в Казахстане.

${portfolio ? `Портфолио студента:
- ЕНТ: ${portfolio.entScore || 'не указано'}
- GPA: ${portfolio.gpa || 'не указано'}
` : ''}

Вопрос: ${message}

Отвечай на русском языке, будь дружелюбным и конкретным.`
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

