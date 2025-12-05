import { NextRequest, NextResponse } from 'next/server'
import universitiesData from '@/data/universities.json'
import programsData from '@/data/programs.json'
import { UserPortfolio, AdmissionChance } from '@/types'

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

    // Расчет шансов поступления
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
  if (portfolio.entScore && program.requirements.minENT) {
    const entRatio = portfolio.entScore / program.requirements.minENT
    factors.entScore = Math.min(100, entRatio * 100)
  }

  // Фактор GPA (20% веса)
  if (portfolio.gpa) {
    factors.gpa = (portfolio.gpa / 5.0) * 100
  }

  // Фактор достижений (30% веса)
  let achievementScore = 0
  achievementScore += portfolio.achievements.length * 5
  achievementScore += portfolio.olympiads.length * 10
  portfolio.olympiads.forEach(ol => {
    if (ol.level === 'international') achievementScore += 20
    else if (ol.level === 'republican') achievementScore += 15
    else achievementScore += 10
  })
  factors.achievements = Math.min(100, achievementScore)

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
  
  if (portfolio.entScore && portfolio.entScore < program.requirements.minENT) {
    recommendations.push(`Повысить балл ЕНТ до ${program.requirements.minENT}+`)
  }
  
  if (portfolio.gpa && portfolio.gpa < 4.0) {
    recommendations.push('Улучшить средний балл аттестата')
  }
  
  if (portfolio.olympiads.length === 0) {
    recommendations.push('Участвовать в олимпиадах для повышения шансов')
  }
  
  if (portfolio.achievements.length < 3) {
    recommendations.push('Добавить больше достижений в портфолио')
  }

  if (chance < 50) {
    recommendations.push('Рассмотреть альтернативные программы или университеты')
  }

  return {
    universityId: university.id,
    programId: program.id,
    chance: Math.round(chance),
    factors,
    recommendations: recommendations.length > 0 ? recommendations : ['Ваш профиль соответствует требованиям!']
  }
}

