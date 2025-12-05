'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FiUser, FiAward, FiBook, FiBriefcase, FiGlobe, FiTrendingUp, FiSave } from 'react-icons/fi'
import { UserPortfolio, AdmissionChance } from '@/types'
import { isAuthenticated, getCurrentUser } from '@/lib/auth'
import { getPortfolio, savePortfolio } from '@/lib/portfolio'

export default function ProfilePage() {
  const router = useRouter()
  const [portfolio, setPortfolio] = useState<UserPortfolio>({
    entScore: undefined,
    ieltsScore: undefined,
    toeflScore: undefined,
    gpa: undefined,
    achievements: [],
    olympiads: [],
    volunteerWork: [],
    workExperience: [],
    languages: []
  })

  const [admissionChances, setAdmissionChances] = useState<AdmissionChance[]>([])
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login?redirect=/profile')
      return
    }

    // Загружаем сохраненное портфолио
    const saved = getPortfolio()
    if (saved) {
      setPortfolio(saved)
    }
  }, [router])

  const handleSave = () => {
    setIsSaving(true)
    savePortfolio(portfolio)
    setTimeout(() => {
      setIsSaving(false)
      alert('Портфолио сохранено!')
    }, 500)
  }

  const calculateChances = async () => {
    if (!portfolio.entScore && !portfolio.gpa) {
      alert('Заполните хотя бы балл ЕНТ или GPA для расчета шансов')
      return
    }

    try {
      // Пример расчета для NU Computer Science
      const response = await fetch('/api/admission-chance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          portfolio,
          universityId: 'nu',
          programId: 'cs-nu'
        })
      })

      if (response.ok) {
        const data = await response.json()
        setAdmissionChances([data.chance])
      } else {
        // Fallback на локальный расчет
        const mockChance: AdmissionChance = {
          universityId: 'nu',
          programId: 'cs-nu',
          chance: portfolio.entScore ? Math.min(95, (portfolio.entScore / 140) * 100) : 50,
          factors: {
            entScore: portfolio.entScore ? (portfolio.entScore / 140) * 100 : 0,
            gpa: portfolio.gpa ? (portfolio.gpa / 5.0) * 100 : 0,
            achievements: Math.min(100, portfolio.achievements.length * 10 + portfolio.olympiads.length * 15),
            competition: 70
          },
          recommendations: [
            portfolio.entScore && portfolio.entScore < 125 ? 'Повысить балл ЕНТ до 125+' : 'Балл ЕНТ соответствует требованиям',
            portfolio.olympiads.length === 0 ? 'Участвовать в олимпиадах' : 'Отличные достижения!',
            'Подготовить портфолио проектов'
          ]
        }
        setAdmissionChances([mockChance])
      }
    } catch (error) {
      console.error('Error calculating chances:', error)
      alert('Ошибка при расчете шансов. Попробуйте позже.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Мой профиль</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Основная информация */}
          <div className="lg:col-span-2 space-y-6">
            {/* Оценки */}
            <div className="glass-effect rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
                <FiTrendingUp />
                <span>Оценки и тесты</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Балл ЕНТ</label>
                  <input
                    type="number"
                    value={portfolio.entScore || ''}
                    onChange={(e) => setPortfolio({ ...portfolio, entScore: parseInt(e.target.value) || undefined })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    placeholder="0-140"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">GPA (средний балл)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={portfolio.gpa || ''}
                    onChange={(e) => setPortfolio({ ...portfolio, gpa: parseFloat(e.target.value) || undefined })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    placeholder="0.00-5.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">IELTS</label>
                  <input
                    type="number"
                    step="0.5"
                    value={portfolio.ieltsScore || ''}
                    onChange={(e) => setPortfolio({ ...portfolio, ieltsScore: parseFloat(e.target.value) || undefined })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    placeholder="0.0-9.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">TOEFL</label>
                  <input
                    type="number"
                    value={portfolio.toeflScore || ''}
                    onChange={(e) => setPortfolio({ ...portfolio, toeflScore: parseInt(e.target.value) || undefined })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    placeholder="0-120"
                  />
                </div>
              </div>
            </div>

            {/* Достижения */}
            <div className="glass-effect rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
                <FiAward />
                <span>Достижения</span>
              </h2>
              <textarea
                placeholder="Опишите ваши достижения, награды, участие в конкурсах..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg min-h-[100px]"
                onChange={(e) => {
                  const achievements = e.target.value.split('\n').filter(a => a.trim())
                  setPortfolio({ ...portfolio, achievements })
                }}
              />
            </div>

            {/* Олимпиады */}
            <div className="glass-effect rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
                <FiBook />
                <span>Олимпиады</span>
              </h2>
              <button
                onClick={() => setPortfolio({
                  ...portfolio,
                  olympiads: [...portfolio.olympiads, { name: '', level: 'regional', year: new Date().getFullYear() }]
                })}
                className="mb-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                + Добавить олимпиаду
              </button>
              {portfolio.olympiads.map((olympiad, index) => (
                <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    placeholder="Название олимпиады"
                    value={olympiad.name}
                    onChange={(e) => {
                      const newOlympiads = [...portfolio.olympiads]
                      newOlympiads[index].name = e.target.value
                      setPortfolio({ ...portfolio, olympiads: newOlympiads })
                    }}
                    className="w-full mb-2 px-4 py-2 border border-gray-200 rounded-lg"
                  />
                  <select
                    value={olympiad.level}
                    onChange={(e) => {
                      const newOlympiads = [...portfolio.olympiads]
                      newOlympiads[index].level = e.target.value as any
                      setPortfolio({ ...portfolio, olympiads: newOlympiads })
                    }}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  >
                    <option value="regional">Региональная</option>
                    <option value="republican">Республиканская</option>
                    <option value="international">Международная</option>
                  </select>
                </div>
              ))}
            </div>

            {/* Языки */}
            <div className="glass-effect rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
                <FiGlobe />
                <span>Языки</span>
              </h2>
              <button
                onClick={() => setPortfolio({
                  ...portfolio,
                  languages: [...portfolio.languages, { language: '', level: 'intermediate' }]
                })}
                className="mb-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                + Добавить язык
              </button>
              {portfolio.languages.map((lang, index) => (
                <div key={index} className="mb-4 flex gap-2">
                  <input
                    type="text"
                    placeholder="Язык"
                    value={lang.language}
                    onChange={(e) => {
                      const newLangs = [...portfolio.languages]
                      newLangs[index].language = e.target.value
                      setPortfolio({ ...portfolio, languages: newLangs })
                    }}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
                  />
                  <select
                    value={lang.level}
                    onChange={(e) => {
                      const newLangs = [...portfolio.languages]
                      newLangs[index].level = e.target.value as any
                      setPortfolio({ ...portfolio, languages: newLangs })
                    }}
                    className="px-4 py-2 border border-gray-200 rounded-lg"
                  >
                    <option value="basic">Базовый</option>
                    <option value="intermediate">Средний</option>
                    <option value="advanced">Продвинутый</option>
                    <option value="native">Родной</option>
                  </select>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 px-6 py-4 border-2 border-primary-500 text-primary-600 rounded-xl hover:bg-primary-50 transition-all text-lg font-semibold flex items-center justify-center space-x-2"
              >
                <FiSave />
                <span>{isSaving ? 'Сохранение...' : 'Сохранить'}</span>
              </button>
              <button
                onClick={calculateChances}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl hover:shadow-xl transition-all text-lg font-semibold flex items-center justify-center space-x-2"
              >
                <FiTrendingUp />
                <span>Рассчитать шансы</span>
              </button>
            </div>
          </div>

          {/* Шансы поступления */}
          <div className="lg:col-span-1">
            <div className="glass-effect rounded-2xl p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-4">Шансы поступления</h2>
              {admissionChances.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Заполните профиль и нажмите "Рассчитать шансы"
                </p>
              ) : (
                <div className="space-y-4">
                  {admissionChances.map((chance, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-3xl font-bold text-primary-600 mb-2">
                        {chance.chance}%
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        Шанс поступления
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>ЕНТ: {chance.factors.entScore}%</div>
                        <div>GPA: {chance.factors.gpa}%</div>
                        <div>Достижения: {chance.factors.achievements}%</div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="text-xs font-semibold mb-2">Рекомендации:</div>
                        <ul className="text-xs space-y-1">
                          {chance.recommendations.map((rec, i) => (
                            <li key={i}>• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

