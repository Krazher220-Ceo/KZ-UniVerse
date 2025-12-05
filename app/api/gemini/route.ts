import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = 'AIzaSyCIhH-3VKldhugzLWxf4UWQ6tCrcksrjdA'
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'

export async function POST(request: NextRequest) {
  try {
    const { prompt, portfolio, program, university } = await request.json()

    // Формируем промпт для Gemini
    const fullPrompt = buildPrompt(prompt, portfolio, program, university)

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }]
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Gemini API error:', error)
      throw new Error('Gemini API error')
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Не удалось получить ответ'

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error('Gemini API error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

function buildPrompt(prompt: string, portfolio?: any, program?: any, university?: any): string {
  let fullPrompt = `Ты AI-помощник платформы KZ UniVerse. Помогаешь студентам выбрать университет в Казахстане.

${prompt}

`

  if (portfolio) {
    fullPrompt += `Портфолио студента:
- ЕНТ: ${portfolio.entScore || 'не указано'}
- GPA: ${portfolio.gpa || 'не указано'}
- Достижения: ${portfolio.achievements?.length || 0}
- Олимпиады: ${portfolio.olympiads?.length || 0}

`
  }

  if (program) {
    fullPrompt += `Программа: ${program.nameRu}
Требования: ЕНТ ${program.requirements?.minENT || 'N/A'}

`
  }

  if (university) {
    fullPrompt += `УНИВЕРСИТЕТ:
- Название: ${university.name}
- Рейтинг: ${university.rating}/5.0
${university.worldRank ? `- Мировое место: #${university.worldRank}` : ''}
- Город: ${university.city}
- Тип: ${university.type === 'national' ? 'Национальный' : university.type === 'state' ? 'Государственный' : 'Частный'}
${university.employmentRate ? `- Трудоустройство: ${university.employmentRate}%` : ''}
${university.faculties?.length > 0 ? `- Факультеты: ${university.faculties.join(', ')}` : ''}
${university.researchAreas?.length > 0 ? `- Области исследований: ${university.researchAreas.join(', ')}` : ''}

`
  }

  fullPrompt += `Отвечай на русском языке, будь дружелюбным и конкретным.`

  return fullPrompt
}

