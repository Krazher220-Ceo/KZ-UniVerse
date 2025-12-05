// Client-side API клиент для работы с AI
// Использует реальные данные из базы для контекста

import { getAIResponse } from './ai-providers';

export async function chatAPI(message: string, history: any[], portfolio?: any) {
  try {
    // Формируем контекст портфолио если есть
    let portfolioContext = '';
    if (portfolio) {
      portfolioContext = `
ПОРТФОЛИО СТУДЕНТА:
- ЕНТ: ${portfolio.entScore || 'не указано'}
- GPA: ${portfolio.gpa || 'не указано'}
- IELTS: ${portfolio.ieltsScore || 'не указано'}
- Достижения: ${portfolio.achievements?.length || 0}
- Олимпиады: ${portfolio.olympiads?.length || 0}
`;
    }

    const fullMessage = portfolioContext ? `${portfolioContext}\n\nВОПРОС: ${message}` : message;
    
    // getAIResponse всегда возвращает строку (имеет встроенный fallback)
    const response = await getAIResponse(fullMessage, 'chat');
    
    // Проверяем, что ответ не пустой
    if (response && response.trim().length > 0) {
      return response;
    }
    
    // Если ответ пустой, используем базовый fallback
    throw new Error('Empty response');
  } catch (error) {
    console.error('Chat API error:', error);
    // Возвращаем полезный ответ вместо статического сообщения об ошибке
    // getAIResponse должен был вернуть fallback, но на всякий случай возвращаем базовый ответ
    return `Понял ваш вопрос: "${message}"\n\nЯ могу помочь с информацией о университетах Казахстана, программах обучения, грантах и процессе поступления. Задайте более конкретный вопрос, и я дам детальный ответ! 😊`;
  }
}

export async function admissionChanceAPI(portfolio: any, universityId: string, programId: string) {
  // Импортируем данные
  const universities = await import('@/data/universities.json');
  const programs = await import('@/data/programs.json');
  
  const university = universities.default.find((u: any) => u.id === universityId);
  const program = programs.default.find((p: any) => p.id === programId);
  
  if (!university || !program) {
    return {
      universityId,
      programId,
      chance: 0,
      factors: { entScore: 0, gpa: 0, achievements: 0, competition: 0 },
      recommendations: ['Университет или программа не найдены']
    };
  }

  try {
    // Формируем детальный промпт с реальными данными
    const prompt = `
Рассчитай шансы поступления студента на основе РЕАЛЬНЫХ данных из базы.

ПОРТФОЛИО СТУДЕНТА:
- ЕНТ: ${portfolio.entScore || 'не указано'}
- GPA: ${portfolio.gpa || 'не указано'}
- IELTS: ${portfolio.ieltsScore || 'не указано'}
- Достижения: ${portfolio.achievements?.length || 0}
- Олимпиады: ${portfolio.olympiads?.length || 0}

ПРОГРАММА: ${program.nameRu || program.name}
УНИВЕРСИТЕТ: ${university.name} (${university.shortName})
РЕЙТИНГ УНИВЕРСИТЕТА: ${university.rating}/5.0
МИРОВОЙ РЕЙТИНГ: ${university.worldRank || 'не указан'}
ТРУДОУСТРОЙСТВО: ${university.employmentRate}%

ТРЕБОВАНИЯ ПРОГРАММЫ:
- Минимальный ЕНТ: ${program.requirements?.minENT || 'не указано'}
- IELTS: ${program.requirements?.minIELTS || 'не требуется'}
- Предметы: ${program.requirements?.requiredSubjects?.join(', ') || 'не указано'}
- Собеседование: ${program.requirements?.interview ? 'Требуется' : 'Не требуется'}
- Портфолио: ${program.requirements?.portfolio ? 'Требуется' : 'Не требуется'}

ПОПУЛЯРНОСТЬ ПРОГРАММЫ: ${program.popularity}%
ТРУДОУСТРОЙСТВО ПО ПРОГРАММЕ: ${program.employmentRate}%

Ответ СТРОГО в JSON формате:
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
`;

    const text = await getAIResponse(prompt, 'admission');
    const result = parseAdmissionResponse(text, portfolio, program, university);
    
    if (result && result.chance !== undefined) {
      return result;
    }
  } catch (error) {
    console.error('Admission API error:', error);
  }
  
  // Fallback на локальный расчет с реальными данными
  return calculateLocalChance(portfolio, program, university);
}

function parseAdmissionResponse(text: string, portfolio: any, program: any, university: any): any {
  try {
    // Пытаемся найти JSON в ответе
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.chance !== undefined) {
        return {
          universityId: university.id,
          programId: program.id,
          chance: Math.max(0, Math.min(100, Number(parsed.chance) || 50)),
          factors: {
            entScore: Number(parsed.factors?.entScore) || 0,
            gpa: Number(parsed.factors?.gpa) || 0,
            achievements: Number(parsed.factors?.achievements) || 0,
            competition: Number(parsed.factors?.competition) || 0
          },
          recommendations: Array.isArray(parsed.recommendations) 
            ? parsed.recommendations 
            : ['Улучшить оценки', 'Участвовать в олимпиадах']
        };
      }
    }
    
    // Если не нашли JSON, пытаемся извлечь процент из текста
    const chanceMatch = text.match(/(\d+)%/i);
    if (chanceMatch) {
      const chance = parseInt(chanceMatch[1]);
      return {
        universityId: university.id,
        programId: program.id,
        chance: Math.max(0, Math.min(100, chance)),
        factors: {
          entScore: portfolio.entScore ? Math.round((portfolio.entScore / 140) * 100) : 0,
          gpa: portfolio.gpa ? Math.round((portfolio.gpa / 5.0) * 100) : 0,
          achievements: Math.round(Math.min(100, (portfolio.achievements?.length || 0) * 10)),
          competition: Math.round(university.rating * 20)
        },
        recommendations: extractRecommendationsFromText(text)
      };
    }
  } catch (e) {
    console.error('Parse error:', e);
  }
  return null;
}

function extractRecommendationsFromText(text: string): string[] {
  const recommendations: string[] = [];
  const lines = text.split('\n').filter(l => l.trim());
  
  lines.forEach(line => {
    const lower = line.toLowerCase();
    if (lower.includes('рекоменд') || lower.includes('совет') || lower.includes('улучш')) {
      const clean = line.replace(/[•\-\d\.\*]/g, '').trim();
      if (clean.length > 10 && clean.length < 200) {
        recommendations.push(clean);
      }
    }
  });
  
  return recommendations.length > 0 
    ? recommendations.slice(0, 5) 
    : ['Улучшить оценки', 'Участвовать в олимпиадах', 'Подготовить портфолио'];
}

function calculateLocalChance(portfolio: any, program: any, university: any): any {
  // Используем реальные данные из программы и университета
  const minENT = program?.requirements?.minENT || 50;
  const entScore = portfolio?.entScore 
    ? Math.min(100, Math.max(0, (portfolio.entScore / Math.max(minENT, 1)) * 100))
    : 0;
  const gpa = portfolio?.gpa 
    ? Math.min(100, Math.max(0, (portfolio.gpa / 5.0) * 100))
    : 0;
  const achievements = Math.min(100, Math.max(0, 
    ((portfolio?.achievements?.length || 0) * 10) + 
    ((portfolio?.olympiads?.length || 0) * 15)
  ));
  
  // Учитываем реальную конкуренцию на основе рейтинга и популярности
  const competition = Math.round(
    (university?.rating || 0) * 15 + 
    (program?.popularity || 0) * 0.1
  );
  
  // Улучшенная формула с учетом реальных данных
  const baseChance = (entScore * 0.4 + gpa * 0.2 + achievements * 0.3);
  const competitionPenalty = Math.max(0, (competition - 50) * 0.1);
  const chance = Math.max(0, Math.min(100, baseChance - competitionPenalty));

  const recommendations: string[] = [];
  
  if (!portfolio?.entScore && !portfolio?.gpa) {
    recommendations.push('Укажите балл ЕНТ или GPA для точного расчета');
  } else {
    if (portfolio?.entScore && portfolio.entScore < minENT) {
      recommendations.push(`Повысить ЕНТ до ${minENT}+ баллов (текущий: ${portfolio.entScore})`);
    } else if (portfolio?.entScore) {
      recommendations.push(`ЕНТ соответствует требованиям (${portfolio.entScore} >= ${minENT})`);
    }
    
    if (program?.requirements?.minIELTS && (!portfolio?.ieltsScore || portfolio.ieltsScore < program.requirements.minIELTS)) {
      recommendations.push(`Подготовиться к IELTS (требуется ${program.requirements.minIELTS}+)`);
    }
    
    if (portfolio?.gpa && portfolio.gpa < 4.0) {
      recommendations.push('Улучшить средний балл до 4.0+');
    }
  }
  
  if (program?.requirements?.portfolio && (!portfolio?.achievements || portfolio.achievements.length === 0)) {
    recommendations.push('Подготовить портфолио проектов (требуется программой)');
  }
  
  if (!portfolio?.olympiads || portfolio.olympiads.length === 0) {
    recommendations.push('Участвовать в олимпиадах и конкурсах для повышения шансов');
  }
  
  if (program?.requirements?.interview) {
    recommendations.push('Подготовиться к собеседованию (требуется программой)');
  }
  
  if (chance < 50) {
    recommendations.push(`Рассмотреть альтернативные программы (текущий шанс: ${Math.round(chance)}%)`);
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Ваш профиль соответствует требованиям!');
  }

  return {
    universityId: university?.id || '',
    programId: program?.id || '',
    chance: Math.round(chance),
    factors: { 
      entScore: Math.round(entScore), 
      gpa: Math.round(gpa), 
      achievements: Math.round(achievements), 
      competition: Math.round(competition) 
    },
    recommendations: recommendations.slice(0, 5)
  };
}

