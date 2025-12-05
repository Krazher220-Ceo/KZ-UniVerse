// Gemini AI клиент - использует прямой fetch для надежности

const GEMINI_API_KEY = 'AIzaSyCIhH-3VKldhugzLWxf4UWQ6tCrcksrjdA';

// Используем стабильную модель вместо экспериментальной
const GEMINI_MODEL = 'gemini-1.5-flash';

export async function generateContent(prompt: string): Promise<string> {
  try {
    // Используем прямой fetch для всех случаев (более надежно)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
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
