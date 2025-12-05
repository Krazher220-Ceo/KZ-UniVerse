// Централизованный модуль для работы с AI провайдерами
// Использует реальные данные из базы для контекста

import { generateContent as generateGeminiContent } from './gemini';

type AIType = 'chat' | 'admission';

// Загружаем данные университетов и программ для контекста
async function loadKnowledgeBase() {
  try {
    const [universitiesModule, programsModule] = await Promise.all([
      import('@/data/universities.json'),
      import('@/data/programs.json')
    ]);
    
    return {
      universities: universitiesModule.default,
      programs: programsModule.default
    };
  } catch (error) {
    console.error('Failed to load knowledge base:', error);
    return { universities: [], programs: [] };
  }
}

// Формируем детальный контекст из базы данных
function buildKnowledgeContext(universities: any[], programs: any[]): string {
  // Формируем структурированную информацию о каждом университете
  const universitiesInfo = universities.map(uni => {
    const uniPrograms = programs.filter(p => p.universityId === uni.id);
    
    return `
УНИВЕРСИТЕТ: ${uni.name} (${uni.shortName})
ID: ${uni.id}
Город: ${uni.city}
Рейтинг: ${uni.rating}/5.0
${uni.worldRank ? `Мировой рейтинг: ${uni.worldRank}` : ''}
Тип: ${uni.type === 'national' ? 'Национальный' : uni.type === 'state' ? 'Государственный' : 'Частный'}
Основан: ${uni.founded}
Студентов: ${uni.students}
Международных студентов: ${uni.internationalStudents}%
Стоимость обучения: ${uni.tuitionRange.min === 7000 ? `$${uni.tuitionRange.min}-${uni.tuitionRange.max}/год` : `${uni.tuitionRange.min.toLocaleString()}-${uni.tuitionRange.max.toLocaleString()} ₸/год`}
Общежитие: ${uni.dormitory ? `Да, ${uni.dormitoryCost.toLocaleString()} ₸/год` : 'Нет'}
Трудоустройство: ${uni.employmentRate}%

Описание: ${uni.description}
Миссия: ${uni.mission}

Факультеты:
${uni.faculties?.map((f: string) => `- ${f}`).join('\n') || 'Не указано'}

Направления исследований:
${uni.researchAreas?.map((r: string) => `- ${r}`).join('\n') || 'Не указано'}

Партнеры:
${uni.partners?.map((p: string) => `- ${p}`).join('\n') || 'Не указано'}

Достижения:
${uni.achievements?.map((a: string) => `- ${a}`).join('\n') || 'Не указано'}

Инфраструктура:
${uni.infrastructure?.map((i: string) => `- ${i}`).join('\n') || 'Не указано'}

Выпускники:
${uni.alumni?.map((a: string) => `- ${a}`).join('\n') || 'Не указано'}

Программы обучения (${uniPrograms.length}):
${uniPrograms.map(p => `  - ${p.nameRu || p.name} (${p.field}): ${p.tuitionPerYear === 8000 ? `$${p.tuitionPerYear}/год` : `${p.tuitionPerYear.toLocaleString()} ₸/год`}, ЕНТ: ${p.requirements?.minENT || 'не указано'}, Трудоустройство: ${p.employmentRate}%`).join('\n')}

Контакты:
Телефон: ${uni.phone}
Email: ${uni.email}
Сайт: ${uni.website}
Адрес: ${uni.address}
`.trim();
  }).join('\n\n' + '='.repeat(80) + '\n\n');

  // Формируем информацию о программах
  const programsInfo = programs.map(prog => {
    const uni = universities.find(u => u.id === prog.universityId);
    return `
ПРОГРАММА: ${prog.nameRu || prog.name}
ID: ${prog.id}
Университет: ${uni?.name || 'Неизвестно'} (${uni?.shortName || ''})
Направление: ${prog.field}
Степень: ${prog.degree}
Длительность: ${prog.duration} лет
Языки: ${prog.language.join(', ')}
Стоимость: ${prog.tuitionPerYear === 8000 ? `$${prog.tuitionPerYear}/год` : `${prog.tuitionPerYear.toLocaleString()} ₸/год`}
Грант: ${prog.grantAvailable ? 'Доступен' : 'Недоступен'}
Стипендия: ${prog.scholarship ? 'Доступна' : 'Недоступна'}
Популярность: ${prog.popularity}%
Трудоустройство: ${prog.employmentRate}%

Описание: ${prog.description}

Требования:
- Минимальный ЕНТ: ${prog.requirements?.minENT || 'не указано'}
- IELTS: ${prog.requirements?.minIELTS || 'не требуется'}
- Предметы: ${prog.requirements?.requiredSubjects?.join(', ') || 'не указано'}
- Портфолио: ${prog.requirements?.portfolio ? 'Требуется' : 'Не требуется'}
- Собеседование: ${prog.requirements?.interview ? 'Требуется' : 'Не требуется'}
${prog.requirements?.additionalExams ? `- Доп. экзамены: ${prog.requirements.additionalExams.join(', ')}` : ''}

Курсы:
${prog.courses?.map((c: string) => `- ${c}`).join('\n') || 'Не указано'}

Карьерные пути:
${prog.careerPaths?.map((cp: string) => `- ${cp}`).join('\n') || 'Не указано'}
`.trim();
  }).join('\n\n' + '-'.repeat(80) + '\n\n');

  return `
=== БАЗА ЗНАНИЙ: УНИВЕРСИТЕТЫ И ПРОГРАММЫ КАЗАХСТАНА ===

${universitiesInfo}

=== ПРОГРАММЫ ОБУЧЕНИЯ ===

${programsInfo}

=== КОНЕЦ БАЗЫ ЗНАНИЙ ===
`.trim();
}

export async function getAIResponse(prompt: string, type: AIType): Promise<string> {
  let response = '';
  let errorMessages: string[] = [];

  // Загружаем базу знаний
  const { universities, programs } = await loadKnowledgeBase();
  const knowledgeContext = buildKnowledgeContext(universities, programs);

  // Формируем полный промпт с контекстом
  const fullPrompt = type === 'chat' 
    ? buildChatPrompt(prompt, knowledgeContext)
    : buildAdmissionPrompt(prompt, knowledgeContext);

  // 1. Try Gemini
  try {
    response = await generateGeminiContent(fullPrompt);
    if (response && response.trim().length > 10) {
      return response;
    }
  } catch (error: any) {
    console.error('Gemini API failed:', error.message);
    errorMessages.push(`Gemini failed: ${error.message}`);
  }

  // 2. Fallback to local logic with real data
  console.warn('All external AI providers failed. Falling back to local logic with real data.');
  return getLocalFallbackResponse(prompt, type, errorMessages, universities, programs);
}

function buildChatPrompt(userMessage: string, knowledgeContext: string): string {
  return `Ты AI-помощник платформы KZ UniVerse - единой платформы для выбора университетов в Казахстане.

ТВОЯ ЗАДАЧА: Отвечать на вопросы пользователей, используя ТОЛЬКО информацию из базы знаний ниже. НЕ придумывай данные, НЕ используй общие фразы. Используй КОНКРЕТНЫЕ цифры, факты и названия из базы.

${knowledgeContext}

ВОПРОС ПОЛЬЗОВАТЕЛЯ: ${userMessage}

ИНСТРУКЦИИ:
1. Отвечай ТОЛЬКО на русском языке
2. Используй ТОЛЬКО данные из базы знаний выше - конкретные названия, цифры, факты
3. Если спрашивают про конкретный университет - дай ПОЛНУЮ информацию из базы (стоимость, рейтинг, программы, требования)
4. Если спрашивают про программы - укажи конкретные университеты, стоимость, требования к поступлению
5. Если сравнивают университеты - используй реальные данные из базы (рейтинги, стоимость, программы)
6. Будь дружелюбным, но профессиональным
7. Форматируй ответ структурированно с эмодзи
8. Если информации нет в базе - честно скажи об этом
9. НЕ придумывай данные, которых нет в базе
10. Всегда указывай конкретные цифры (стоимость, рейтинг, проходной балл)

ОТВЕТ (используй только данные из базы знаний):`;
}

function buildAdmissionPrompt(userMessage: string, knowledgeContext: string): string {
  return `Ты AI-помощник для расчета шансов поступления в университеты Казахстана.

${knowledgeContext}

ВОПРОС/ДАННЫЕ ПОЛЬЗОВАТЕЛЯ: ${userMessage}

ИНСТРУКЦИИ:
1. Используй ТОЛЬКО данные из базы знаний выше
2. Рассчитай шансы поступления на основе реальных требований программ
3. Сравни данные пользователя с требованиями программ
4. Дай конкретные рекомендации на основе реальных данных
5. Укажи конкретные программы и университеты из базы

ОТВЕТ (в формате JSON или структурированного текста):`;
}

function getLocalFallbackResponse(
  prompt: string, 
  type: AIType, 
  errors: string[], 
  universities: any[], 
  programs: any[]
): string {
  const lowerPrompt = prompt.toLowerCase();
  
  if (type === 'chat') {
    // Поиск конкретного университета
    for (const uni of universities) {
      if (lowerPrompt.includes(uni.shortName.toLowerCase()) || 
          lowerPrompt.includes(uni.name.toLowerCase()) ||
          lowerPrompt.includes(uni.id.toLowerCase())) {
        const uniPrograms = programs.filter(p => p.universityId === uni.id);
        return `🏛️ *${uni.name}* (${uni.shortName})

📍 Город: ${uni.city}
⭐ Рейтинг: ${uni.rating}/5.0${uni.worldRank ? ` | 🌍 Мировой: ${uni.worldRank}` : ''}
📅 Основан: ${uni.founded}
👥 Студентов: ${uni.students.toLocaleString()}
💰 Стоимость: ${uni.tuitionRange.min === 7000 ? `$${uni.tuitionRange.min}-${uni.tuitionRange.max}/год` : `${uni.tuitionRange.min.toLocaleString()}-${uni.tuitionRange.max.toLocaleString()} ₸/год`}
${uni.dormitory ? `🏠 Общежитие: ${uni.dormitoryCost.toLocaleString()} ₸/год` : ''}
💼 Трудоустройство: ${uni.employmentRate}%

📝 *Описание:*
${uni.description}

🎓 *Программы (${uniPrograms.length}):*
${uniPrograms.slice(0, 5).map(p => `• ${p.nameRu || p.name} - ${p.tuitionPerYear === 8000 ? `$${p.tuitionPerYear}/год` : `${p.tuitionPerYear.toLocaleString()} ₸/год`}, ЕНТ: ${p.requirements?.minENT || 'не указано'}`).join('\n')}
${uniPrograms.length > 5 ? `\n... и ещё ${uniPrograms.length - 5} программ` : ''}

🏆 *Достижения:*
${uni.achievements?.slice(0, 3).map(a => `✅ ${a}`).join('\n') || 'Не указано'}

📞 *Контакты:*
📱 ${uni.phone}
📧 ${uni.email}
🌐 ${uni.website}`;
      }
    }

    // IT программы
    if (lowerPrompt.includes('it') || lowerPrompt.includes('программирование') || lowerPrompt.includes('айти')) {
      const itPrograms = programs.filter(p => p.field === 'IT');
      const itUnis = [...new Set(itPrograms.map(p => p.universityId))].map(id => universities.find(u => u.id === id)).filter(Boolean);
      
      return `💻 *IT-программы в Казахстане:*

${itUnis.slice(0, 5).map(uni => {
  const uniPrograms = itPrograms.filter(p => p.universityId === uni.id);
  return `*${uni.shortName}* - ${uni.name}
  📍 ${uni.city} | ⭐ ${uni.rating}/5.0
  💰 ${uni.tuitionRange.min === 7000 ? `$${uni.tuitionRange.min}-${uni.tuitionRange.max}/год` : `${uni.tuitionRange.min.toLocaleString()}-${uni.tuitionRange.max.toLocaleString()} ₸/год`}
  🎓 Программы: ${uniPrograms.map(p => p.nameRu || p.name).join(', ')}
  💼 Трудоустройство: ${uni.employmentRate}%`;
}).join('\n\n')}

💡 *Рекомендация:* Для IT лучше всего подходят AITU (специализированный IT-вуз), NU (мировой уровень) или МУИТ (практико-ориентированный).`;
    }

    // Бизнес
    if (lowerPrompt.includes('бизнес') || lowerPrompt.includes('экономика')) {
      const businessPrograms = programs.filter(p => p.field === 'Business');
      const businessUnis = [...new Set(businessPrograms.map(p => p.universityId))].map(id => universities.find(u => u.id === id)).filter(Boolean);
      
      return `💼 *Бизнес-программы:*

${businessUnis.slice(0, 3).map(uni => {
  const uniPrograms = businessPrograms.filter(p => p.universityId === uni.id);
  return `*${uni.shortName}* - ${uni.name}
  💰 ${uni.tuitionRange.min === 7000 ? `$${uni.tuitionRange.min}-${uni.tuitionRange.max}/год` : `${uni.tuitionRange.min.toLocaleString()}-${uni.tuitionRange.max.toLocaleString()} ₸/год`}
  🎓 ${uniPrograms.map(p => p.nameRu || p.name).join(', ')}`;
}).join('\n\n')}

💡 *Совет:* KIMEP - единственная бизнес-школа в ЦА с аккредитацией AACSB!`;
    }

    // Дефолтный ответ
    return `👋 Привет! Я AI-помощник KZ UniVerse.

🎓 Могу помочь с:
• Информацией о ${universities.length} университетах Казахстана
• ${programs.length} программами обучения
• Сравнением вузов по рейтингу, стоимости, программам
• Грантами и стипендиями
• Процессом поступления

📝 *Примеры вопросов:*
• "Расскажи про Nazarbayev University"
• "Какие IT программы в Астане?"
• "Сравни NU и AITU"
• "Как поступить в KIMEP?"

Задайте конкретный вопрос, и я дам детальный ответ на основе базы данных! 😊`;
  }
  
  return `Извините, AI-помощник временно недоступен. (Ошибки: ${errors.join('; ')})`;
}

