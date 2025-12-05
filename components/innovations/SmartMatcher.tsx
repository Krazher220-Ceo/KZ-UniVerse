'use client'

import { useState } from 'react'
import { FiSearch, FiCheck, FiStar, FiMapPin, FiDollarSign } from 'react-icons/fi'
import Link from 'next/link'

interface MatchResult {
  universityId: string;
  name: string;
  shortName: string;
  matchScore: number;
  reasons: string[];
  city: string;
  tuition: string;
  rating: number;
}

// База данных для матчинга
const UNIVERSITIES_FOR_MATCHING = [
  {
    id: 'nu',
    name: 'Nazarbayev University',
    shortName: 'NU',
    city: 'Астана',
    tuition: '$7-9K/год',
    rating: 4.9,
    tags: ['it', 'engineering', 'medicine', 'business', 'english', 'research', 'international', 'top'],
    minENT: 120,
    budget: 'high'
  },
  {
    id: 'aitu',
    name: 'Astana IT University',
    shortName: 'AITU',
    city: 'Астана',
    tuition: '1.8-2.2M₸/год',
    rating: 4.6,
    tags: ['it', 'ai', 'data-science', 'cybersecurity', 'programming', 'tech'],
    minENT: 90,
    budget: 'medium'
  },
  {
    id: 'kaznu',
    name: 'КазНУ им. аль-Фараби',
    shortName: 'КазНУ',
    city: 'Алматы',
    tuition: '0.6-1.8M₸/год',
    rating: 4.7,
    tags: ['it', 'science', 'humanities', 'economics', 'law', 'journalism', 'classic'],
    minENT: 85,
    budget: 'low'
  },
  {
    id: 'kbtu',
    name: 'КБТУ',
    shortName: 'КБТУ',
    city: 'Алматы',
    tuition: '1.5-2.5M₸/год',
    rating: 4.5,
    tags: ['it', 'engineering', 'petroleum', 'british', 'tech'],
    minENT: 90,
    budget: 'medium'
  },
  {
    id: 'kimep',
    name: 'KIMEP University',
    shortName: 'KIMEP',
    city: 'Алматы',
    tuition: '2.2-3.5M₸/год',
    rating: 4.6,
    tags: ['business', 'finance', 'marketing', 'law', 'english', 'international'],
    minENT: 85,
    budget: 'high'
  },
  {
    id: 'iitu',
    name: 'МУИТ',
    shortName: 'МУИТ',
    city: 'Алматы',
    tuition: '1.6-2M₸/год',
    rating: 4.4,
    tags: ['it', 'programming', 'cybersecurity', 'data-science', 'tech'],
    minENT: 80,
    budget: 'medium'
  },
  {
    id: 'sdu',
    name: 'SDU',
    shortName: 'SDU',
    city: 'Алматы',
    tuition: '1.4-2.8M₸/год',
    rating: 4.4,
    tags: ['medicine', 'engineering', 'humanities', 'international'],
    minENT: 80,
    budget: 'medium'
  },
  {
    id: 'enu',
    name: 'ЕНУ им. Гумилева',
    shortName: 'ЕНУ',
    city: 'Астана',
    tuition: '0.55-1.2M₸/год',
    rating: 4.5,
    tags: ['humanities', 'science', 'law', 'economics', 'classic'],
    minENT: 75,
    budget: 'low'
  }
]

export default function SmartMatcher() {
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState({
    interests: [] as string[],
    city: '',
    budget: '',
    entScore: '',
    language: '',
    priority: ''
  })
  const [results, setResults] = useState<MatchResult[]>([])
  const [isCalculating, setIsCalculating] = useState(false)

  const interests = [
    { id: 'it', label: '💻 IT / Программирование', icon: '💻' },
    { id: 'business', label: '💼 Бизнес / Экономика', icon: '💼' },
    { id: 'engineering', label: '⚙️ Инженерия', icon: '⚙️' },
    { id: 'medicine', label: '🏥 Медицина', icon: '🏥' },
    { id: 'law', label: '⚖️ Право', icon: '⚖️' },
    { id: 'humanities', label: '📚 Гуманитарные науки', icon: '📚' },
    { id: 'science', label: '🔬 Естественные науки', icon: '🔬' },
    { id: 'ai', label: '🤖 AI / Data Science', icon: '🤖' }
  ]

  const toggleInterest = (id: string) => {
    setAnswers(prev => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter(i => i !== id)
        : [...prev.interests, id]
    }))
  }

  const calculateMatch = async () => {
    setIsCalculating(true)
    
    try {
      // Используем AI для подбора
      const aiModule = await import('@/lib/ai')
      const aiResults = await aiModule.matchUniversities({
        interests: answers.interests,
        city: answers.city,
        budget: answers.budget,
        entScore: parseInt(answers.entScore) || 0,
        language: answers.language
      })
      
      // Объединяем с локальными данными для полной информации
      const results: MatchResult[] = aiResults.map(aiResult => {
        const uni = UNIVERSITIES_FOR_MATCHING.find(u => u.id === aiResult.universityId)
        return {
          universityId: aiResult.universityId,
          name: aiResult.name,
          shortName: uni?.shortName || aiResult.name,
          matchScore: aiResult.matchScore,
          reasons: aiResult.reasons,
          city: uni?.city || '',
          tuition: uni?.tuition || '',
          rating: uni?.rating || 0
        }
      })
      
      setResults(results)
    } catch (error) {
      console.error('AI matching error:', error)
      
      // Fallback на локальный расчёт
      const results: MatchResult[] = UNIVERSITIES_FOR_MATCHING.map(uni => {
        let score = 0
        const reasons: string[] = []

        const interestMatch = answers.interests.filter(i => uni.tags.includes(i)).length
        score += (interestMatch / Math.max(answers.interests.length, 1)) * 40
        if (interestMatch > 0) reasons.push(`${interestMatch} совпадений`)

        if (answers.city === 'any' || answers.city === uni.city.toLowerCase()) {
          score += 15
          if (answers.city !== 'any') reasons.push(`Город: ${uni.city}`)
        }

        if (answers.budget === 'any' || answers.budget === uni.budget) {
          score += 20
          reasons.push('Подходит по бюджету')
        }

        const entScore = parseInt(answers.entScore) || 0
        if (entScore >= uni.minENT) {
          score += 15
          reasons.push(`ЕНТ ≥ ${uni.minENT}`)
        }

        if (answers.language === 'english' && uni.tags.includes('english')) {
          score += 10
          reasons.push('Английский')
        } else if (answers.language !== 'english') {
          score += 10
        }

        score += (uni.rating - 4) * 5

        return {
          universityId: uni.id,
          name: uni.name,
          shortName: uni.shortName,
          matchScore: Math.min(100, Math.round(score)),
          reasons,
          city: uni.city,
          tuition: uni.tuition,
          rating: uni.rating
        }
      }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 5)
      
      setResults(results)
    } finally {
      setIsCalculating(false)
      setStep(6)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Шаг 1: Ваши интересы</h3>
            <p className="text-gray-600">Выберите направления, которые вас интересуют (можно несколько):</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {interests.map(interest => (
                <button
                  key={interest.id}
                  onClick={() => toggleInterest(interest.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    answers.interests.includes(interest.id)
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 bg-white hover:border-primary-300'
                  }`}
                >
                  <span className="text-2xl block mb-1">{interest.icon}</span>
                  <span className="text-sm font-medium">{interest.label.replace(interest.icon + ' ', '')}</span>
                </button>
              ))}
            </div>
          </div>
        )
      
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Шаг 2: Предпочтительный город</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { id: 'астана', label: '🏙️ Астана' },
                { id: 'алматы', label: '🌆 Алматы' },
                { id: 'any', label: '🗺️ Любой город' }
              ].map(option => (
                <button
                  key={option.id}
                  onClick={() => setAnswers(prev => ({ ...prev, city: option.id }))}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    answers.city === option.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 bg-white hover:border-primary-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Шаг 3: Бюджет на обучение</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { id: 'low', label: '💵 До 1.5M ₸/год', desc: 'Бюджетные варианты' },
                { id: 'medium', label: '💰 1.5-2.5M ₸/год', desc: 'Средний сегмент' },
                { id: 'high', label: '💎 От 2.5M ₸/год', desc: 'Премиум' }
              ].map(option => (
                <button
                  key={option.id}
                  onClick={() => setAnswers(prev => ({ ...prev, budget: option.id }))}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    answers.budget === option.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 bg-white hover:border-primary-300'
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-500">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Шаг 4: Ваш балл ЕНТ</h3>
            <p className="text-gray-600">Введите ваш балл или ожидаемый результат:</p>
            <input
              type="number"
              placeholder="Например: 110"
              value={answers.entScore}
              onChange={(e) => setAnswers(prev => ({ ...prev, entScore: e.target.value }))}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-primary-500 outline-none text-lg"
              min="0"
              max="140"
            />
            <p className="text-sm text-gray-500">Максимальный балл: 140</p>
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Шаг 5: Язык обучения</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { id: 'russian', label: '🇷🇺 Русский' },
                { id: 'english', label: '🇬🇧 Английский' },
                { id: 'any', label: '🌍 Любой' }
              ].map(option => (
                <button
                  key={option.id}
                  onClick={() => {
                    setAnswers(prev => ({ ...prev, language: option.id }))
                    calculateMatch()
                  }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    answers.language === option.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 bg-white hover:border-primary-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">🎯 Ваши идеальные университеты</h3>
              <p className="text-gray-600">На основе ваших предпочтений AI подобрал лучшие варианты</p>
            </div>
            
            <div className="space-y-4">
              {results.map((result, index) => (
                <Link 
                  key={result.universityId}
                  href={`/universities/${result.universityId}`}
                  className="block p-4 bg-white rounded-xl border-2 border-gray-100 hover:border-primary-300 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                      index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-600' :
                      index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-800' :
                      'bg-gradient-to-br from-primary-500 to-secondary-500'
                    }`}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-lg">{result.shortName}</h4>
                        <div className="flex items-center gap-2">
                          <div className="text-2xl font-bold text-primary-600">{result.matchScore}%</div>
                          <span className="text-sm text-gray-500">совпадение</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{result.name}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {result.reasons.map((reason, i) => (
                          <span key={i} className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            <FiCheck className="w-3 h-3" />
                            {reason}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FiMapPin /> {result.city}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiStar className="text-yellow-500" /> {result.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiDollarSign /> {result.tuition}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <button
              onClick={() => {
                setStep(1)
                setAnswers({ interests: [], city: '', budget: '', entScore: '', language: '', priority: '' })
                setResults([])
              }}
              className="w-full py-3 border-2 border-primary-500 text-primary-600 rounded-xl font-medium hover:bg-primary-50 transition-colors"
            >
              Начать заново
            </button>
          </div>
        )
    }
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
          <FiSearch className="text-white text-2xl" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">🎯 Smart Matcher</h2>
          <p className="text-gray-600">AI подберет идеальный университет для вас</p>
        </div>
      </div>

      {/* Прогресс */}
      {step < 6 && (
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Шаг {step} из 5</span>
            <span>{Math.round((step / 5) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all"
              style={{ width: `${(step / 5) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {isCalculating ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-xl font-bold mb-2">AI анализирует ваши предпочтения...</h3>
          <p className="text-gray-600">Подбираем идеальные университеты</p>
        </div>
      ) : (
        renderStep()
      )}

      {/* Навигация */}
      {step < 5 && step > 0 && !isCalculating && (
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setStep(s => s - 1)}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Назад
          </button>
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={
              (step === 1 && answers.interests.length === 0) ||
              (step === 2 && !answers.city) ||
              (step === 3 && !answers.budget) ||
              (step === 4 && !answers.entScore)
            }
            className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Далее
          </button>
        </div>
      )}
    </div>
  )
}

