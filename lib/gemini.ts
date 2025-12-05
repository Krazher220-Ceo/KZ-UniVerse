// Gemini AI клиент - использует прямой fetch для надежности

const GEMINI_API_KEY = 'AQ.Ab8RN6I6fN37ba1DTn4XeUB4uw3cwBJAuce0U6wh9MwjXypUbA';

// Используем новую модель gemini-2.5-flash-lite
const GEMINI_MODEL = 'gemini-2.5-flash-lite';

export async function generateContent(prompt: string): Promise<string> {
  try {
    // Используем новый эндпоинт aiplatform.googleapis.com
    const response = await fetch(
      `https://aiplatform.googleapis.com/v1/publishers/google/models/${GEMINI_MODEL}:streamGenerateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            role: 'user',
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
          ],
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error response:', response.status, errorText);
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    // Для streamGenerateContent ответ может быть потоком или обычным JSON
    const data = await response.json();
    
    // Проверяем наличие блокировок безопасности
    if (data.promptFeedback?.blockReason) {
      console.warn('Content blocked:', data.promptFeedback.blockReason);
      throw new Error(`Content blocked: ${data.promptFeedback.blockReason}`);
    }
    
    // Обрабатываем stream ответ (может быть массивом chunks)
    let text = '';
    if (Array.isArray(data)) {
      // Если ответ - массив chunks из stream
      text = data
        .map((chunk: any) => chunk.candidates?.[0]?.content?.parts?.[0]?.text || '')
        .filter(Boolean)
        .join('');
    } else {
      // Обычный ответ
      text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    }
    
    if (!text || text.trim().length === 0) {
      console.error('No text in response:', JSON.stringify(data, null, 2));
      throw new Error('No text in response');
    }

    return text.trim();
  } catch (error: any) {
    console.error('Gemini API error:', error?.message || error);
    throw error;
  }
}

