// Gemini AI клиент с использованием @google/genai

import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = 'AIzaSyCIhH-3VKldhugzLWxf4UWQ6tCrcksrjdA';

// Создаем экземпляр AI клиента
let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  }
  return aiClient;
}

export async function generateContent(prompt: string): Promise<string> {
  try {
    const ai = getAIClient();
    
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
    });

    return response.text || 'Не удалось получить ответ';
  } catch (error: any) {
    console.error('Gemini API error:', error?.message || error);
    throw error;
  }
}

export async function generateContentStream(prompt: string, onChunk: (text: string) => void): Promise<void> {
  try {
    const ai = getAIClient();
    
    const response = await ai.models.generateContentStream({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
    });

    for await (const chunk of response.stream) {
      const text = chunk.text || '';
      if (text) {
        onChunk(text);
      }
    }
  } catch (error: any) {
    console.error('Gemini Stream error:', error?.message || error);
    throw error;
  }
}

