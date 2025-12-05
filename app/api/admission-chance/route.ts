import { NextRequest, NextResponse } from 'next/server'
import universitiesData from '@/data/universities.json'
import programsData from '@/data/programs.json'
import { UserPortfolio, AdmissionChance } from '@/types'

const GEMINI_API_KEY = 'AIzaSyCIhH-3VKldhugzLWxf4UWQ6tCrcksrjdA'
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'

export async function POST(request: NextRequest) {
  try {
    const { portfolio, universityId, programId } = await request.json()

    const university = universitiesData.find(u => u.id === universityId)
    const program = programsData.find(p => p.id === programId)

    if (!university || !program) {
      return NextResponse.json(
        { error: 'University or program not found' },
        { status: 404 }
      )
    }

    // Используем Gemini API для расчета шансов
    try {
      const prompt = buildGeminiPrompt(portfolio, program, university)
      
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
        const chance = parseGeminiResponse(text, portfolio, program, university)
        return NextResponse.json({ chance })
      }
    } catch (geminiError) {
      console.log('Gemini API fallback to local calculation:', geminiError)
    }

    // Fallback на локальный расчет
    const chance = calculateAdmissionChance(portfolio, program, university)
    return NextResponse.json({ chance })
  } catch (error) {
    console.error('Admission chance API error:', error)
    return NextResponse.json(
      { error: 'Failed to calculate admission chance' },
      { status: 500 }
    )
  }
}

function buildGeminiPrompt(portfolio: UserPortfolio, program: any, university: any): string {
  return `Ты эксперт по поступлению в вузы Казахстана. Рассчитай шансы поступления студента.

ПОРТФОЛИО СТУДЕНТА:
- Балл ЕНТ: ${portfolio.entScore || 'не указано'}
- GPA (средний балл): ${portfolio.gpa || 'не указано'}
- IELTS: ${portfolio.ieltsScore || 'не указано'}
- TOEFL: ${portfolio.toeflScore || 'не указано'}
- Достижения: ${portfolio.achievements?.length || 0}
- Олимпиады: ${portfolio.olympiads?.length || 0}
${portfolio.olympiads?.length > 0 ? `  Уровни: ${portfolio.olympiads.map(o => o.level).join(', ')}` : ''}

ПРОГРАММА:
- Название: ${program.nameRu}
- Университет: ${university.name} (${university.shortName})
- Рейтинг университета: ${university.rating}/5.0
${university.worldRank ? `- Мировое место: #${university.worldRank}` : ''}
- Минимальный ЕНТ: ${program.requirements?.minENT || 'не указано'}
- Предметы: ${program.requirements?.requiredSubjects?.join(', ') || 'не указано'}

ЗАДАЧА:
Рассчитай реалистичный шанс поступления (0-100%) и дай детальный анализ.

ОТВЕТ В ФОРМАТЕ JSON:
{
  "chance": число_от_0_до_100,
  "factors": {
    "entScore": число_от_0_до_100,
    "gpa": число_от_0_до_100,
    "achievements": число_от_0_до_100,
    "competition": число_от_0_до_100
  },
  "recommendations": ["рекомендация1", "рекомендация2", "рекомендация3"]
}

Важно: отвечай ТОЛЬКО валидным JSON, без дополнительного текста.`
}

function parseGeminiResponse(text: string, portfolio: UserPortfolio, program: any, university: any): AdmissionChance {
  try {
    // Пытаемся найти JSON в ответе
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        universityId: university.id,
        programId: program.id,
        chance: Math.max(0, Math.min(100, parsed.chance || 50)),
        factors: parsed.factors || {
          entScore: portfolio.entScore ? (portfolio.entScore / 140) * 100 : 0,
          gpa: portfolio.gpa ? (portfolio.gpa / 5.0) * 100 : 0,
          achievements: Math.min(100, (portfolio.achievements?.length || 0) * 10),
          competition: university.rating * 20
        },
        recommendations: parsed.recommendations || ['Повысить балл ЕНТ', 'Участвовать в олимпиадах']
      }
    }
  } catch (e) {
    console.log('Failed to parse Gemini response:', e)
  }

  // Fallback
  return calculateAdmissionChance(portfolio, program, university)
}

function calculateAdmissionChance(
  portfolio: UserPortfolio,
  program: any,
  university: any
): AdmissionChance {
  const factors = {
    entScore: 0,
    gpa: 0,
    achievements: 0,
    competition: 50 // базовый уровень конкуренции
  }

  // Фактор ЕНТ (40% веса)
  if (portfolio.entScore && program.requirements?.minENT) {
    const minENT = program.requirements.minENT || 50
    const entRatio = portfolio.entScore / minENT
    factors.entScore = Math.min(100, Math.max(0, entRatio * 100))
  } else if (portfolio.entScore) {
    // Если нет требований, используем абсолютную оценку
    factors.entScore = (portfolio.entScore / 140) * 100
  }

  // Фактор GPA (20% веса)
  if (portfolio.gpa) {
    factors.gpa = (portfolio.gpa / 5.0) * 100
  }

  // Фактор достижений (30% веса)
  let achievementScore = 0
  if (portfolio.achievements) {
    achievementScore += portfolio.achievements.length * 5
  }
  if (portfolio.olympiads) {
    achievementScore += portfolio.olympiads.length * 10
    portfolio.olympiads.forEach(ol => {
      if (ol.level === 'international') achievementScore += 20
      else if (ol.level === 'republican') achievementScore += 15
      else achievementScore += 10
    })
  }
  factors.achievements = Math.min(100, Math.max(0, achievementScore))

  // Фактор конкуренции (10% веса)
  // Чем выше рейтинг университета, тем выше конкуренция
  factors.competition = university.rating * 20

  // Общий шанс (взвешенная сумма)
  const totalChance = 
    factors.entScore * 0.4 +
    factors.gpa * 0.2 +
    factors.achievements * 0.3 -
    (factors.competition - 50) * 0.1

  const chance = Math.max(0, Math.min(100, totalChance))

  // Рекомендации
  const recommendations: string[] = []
  
  if (portfolio.entScore && program.requirements?.minENT && portfolio.entScore < program.requirements.minENT) {
    recommendations.push(`Повысить балл ЕНТ до ${program.requirements.minENT}+`)
  } else if (!portfolio.entScore) {
    recommendations.push('Указать балл ЕНТ для более точного расчета')
  }
  
  if (portfolio.gpa && portfolio.gpa < 4.0) {
    recommendations.push('Улучшить средний балл аттестата до 4.0+')
  } else if (!portfolio.gpa) {
    recommendations.push('Указать средний балл аттестата (GPA)')
  }
  
  if (!portfolio.olympiads || portfolio.olympiads.length === 0) {
    recommendations.push('Участвовать в олимпиадах для повышения шансов')
  }
  
  if (!portfolio.achievements || portfolio.achievements.length < 3) {
    recommendations.push('Добавить больше достижений в портфолио')
  }

  if (chance < 50) {
    recommendations.push('Рассмотреть альтернативные программы или университеты')
  } else if (chance >= 70) {
    recommendations.push('Отличные шансы! Продолжайте готовиться к поступлению')
  }

  return {
    universityId: university.id,
    programId: program.id,
    chance: Math.round(chance),
    factors,
    recommendations: recommendations.length > 0 ? recommendations : ['Ваш профиль соответствует требованиям!']
  }
}

