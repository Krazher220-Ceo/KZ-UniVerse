// Интеграция с Ollama для локального AI
// Работает полностью офлайн, быстро и бесплатно

const OLLAMA_URL = 'http://localhost:11434'
const MODEL = 'llama3.2:1b'

// Системный промпт для контекста университетов Казахстана
const SYSTEM_PROMPT = `Ты - AI-помощник платформы KZ UniVerse для абитуриентов Казахстана.

ТВОИ ЗНАНИЯ:
- Университеты: Nazarbayev University (NU), AITU, КазНУ, КБТУ, KIMEP, МУИТ, SDU, ЕНУ и др.
- ЕНТ: максимум 140 баллов, для гранта нужно 100+, для топ-вузов 110-120+
- Гранты: государственные через egov.kz, распределяются по баллам ЕНТ
- Сроки: ЕНТ в июне, подача документов июль-август, учёба с сентября
- IELTS: нужен для англоязычных программ (NU, KIMEP), минимум 5.5-6.5

ПРАВИЛА:
- Отвечай на русском языке
- Будь кратким и полезным
- Давай конкретные советы
- Если не знаешь точный ответ, скажи об этом честно`

interface OllamaResponse {
  model: string
  created_at: string
  response: string
  done: boolean
}

// Проверка доступности Ollama
export async function checkOllamaAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`, {
      method: 'GET',
      signal: AbortSignal.timeout(2000)
    })
    return response.ok
  } catch {
    return false
  }
}

// Генерация ответа через Ollama
export async function generateWithOllama(prompt: string, context?: string): Promise<string> {
  try {
    const fullPrompt = context 
      ? `${SYSTEM_PROMPT}\n\nКОНТЕКСТ:\n${context}\n\nВОПРОС: ${prompt}`
      : `${SYSTEM_PROMPT}\n\nВОПРОС: ${prompt}`

    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        prompt: fullPrompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          num_predict: 500
        }
      }),
      signal: AbortSignal.timeout(30000) // 30 секунд таймаут
    })

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status}`)
    }

    const data: OllamaResponse = await response.json()
    return data.response.trim()
  } catch (error: any) {
    console.error('Ollama generation error:', error)
    throw error
  }
}

// Стриминг ответа через Ollama
export async function streamWithOllama(
  prompt: string, 
  onChunk: (text: string) => void,
  context?: string
): Promise<void> {
  const fullPrompt = context 
    ? `${SYSTEM_PROMPT}\n\nКОНТЕКСТ:\n${context}\n\nВОПРОС: ${prompt}`
    : `${SYSTEM_PROMPT}\n\nВОПРОС: ${prompt}`

  const response = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      prompt: fullPrompt,
      stream: true,
      options: {
        temperature: 0.7,
        top_p: 0.9,
        num_predict: 500
      }
    })
  })

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.status}`)
  }

  const reader = response.body?.getReader()
  if (!reader) throw new Error('No reader available')

  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value)
    const lines = chunk.split('\n').filter(line => line.trim())

    for (const line of lines) {
      try {
        const data = JSON.parse(line)
        if (data.response) {
          onChunk(data.response)
        }
      } catch {
        // Игнорируем некорректные JSON
      }
    }
  }
}

// Анализ шансов поступления
export async function analyzeAdmissionChance(
  entScore: number,
  targetUniversity: string,
  targetProgram: string
): Promise<string> {
  const prompt = `Оцени шансы поступления:
- Балл ЕНТ: ${entScore}
- Университет: ${targetUniversity}
- Программа: ${targetProgram}

Дай краткую оценку шансов (высокие/средние/низкие) и 2-3 совета.`

  return generateWithOllama(prompt)
}

// Подбор университетов
export async function recommendUniversities(
  entScore: number,
  field: string,
  city: string,
  budget: string
): Promise<string> {
  const prompt = `Подбери университеты для абитуриента:
- Балл ЕНТ: ${entScore}
- Направление: ${field}
- Город: ${city}
- Бюджет: ${budget}

Рекомендуй 3-4 подходящих университета с кратким объяснением.`

  return generateWithOllama(prompt)
}

// Ответ на вопрос о поступлении
export async function answerAdmissionQuestion(question: string): Promise<string> {
  return generateWithOllama(question)
}

