// Gemini AI клиент - использует прямой fetch для надежности

const GEMINI_API_KEY = 'AQ.Ab8RN6I6fN37ba1DTn4XeUB4uw3cwBJAuce0U6wh9MwjXypUbA';

// Используем стабильную модель вместо экспериментальной
const GEMINI_MODEL = 'gemini-1.5-flash';

export async function generateContent(prompt: string): Promise<string> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
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

    const data = await response.json();
    
    // Проверяем наличие блокировок безопасности
    if (data.promptFeedback?.blockReason) {
      console.warn('Content blocked:', data.promptFeedback.blockReason);
      throw new Error(`Content blocked: ${data.promptFeedback.blockReason}`);
    }
    
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      console.error('No text in response:', JSON.stringify(data, null, 2));
      throw new Error('No text in response');
    }

    return text;
  } catch (error: any) {
    console.error('Gemini API error:', error?.message || error);
    throw error;
  }
}

