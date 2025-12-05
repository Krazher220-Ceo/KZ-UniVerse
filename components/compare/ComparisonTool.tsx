'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FiX, FiCheck } from 'react-icons/fi'
import universitiesData from '@/data/universities.json'
import { University } from '@/types'

export default function ComparisonTool() {
  const [selectedUniversities, setSelectedUniversities] = useState<University[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const availableUniversities = universitiesData.filter(
    uni => !selectedUniversities.find(s => s.id === uni.id)
  )

  const filteredUniversities = searchQuery
    ? availableUniversities.filter(uni =>
        uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uni.city.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : availableUniversities

  const addUniversity = (uni: University) => {
    if (selectedUniversities.length < 3) {
      setSelectedUniversities([...selectedUniversities, uni as University])
      setSearchQuery('')
    }
  }

  const removeUniversity = (id: string) => {
    setSelectedUniversities(selectedUniversities.filter(u => u.id !== id))
  }

  const comparisonCriteria: Array<{
    key: string
    label: string
    format: (v: any) => string
  }> = [
    { key: 'rating', label: 'Рейтинг', format: (v: number) => v.toFixed(1) },
    { key: 'worldRank', label: 'Место в мире', format: (v?: number) => v ? `#${v}` : 'N/A' },
    { key: 'founded', label: 'Год основания', format: (v: number) => v.toString() },
    { key: 'students', label: 'Студентов', format: (v: number) => v.toLocaleString() },
    { key: 'city', label: 'Город', format: (v: string) => v },
    { key: 'tuitionMin', label: 'Стоимость от', format: (v: number) => `${(v / 1000000).toFixed(1)}M₸` },
    { key: 'tuitionMax', label: 'Стоимость до', format: (v: number) => `${(v / 1000000).toFixed(1)}M₸` },
    { key: 'dormitory', label: 'Общежитие', format: (v: boolean) => v ? 'Есть' : 'Нет' },
    { key: 'dormitoryCost', label: 'Стоимость общежития', format: (v?: number) => v ? `${v.toLocaleString()}₸/мес` : 'N/A' },
    { key: 'internationalStudents', label: 'Иностранные студенты', format: (v: number) => `${v}%` },
  ]

  const getValue = (uni: University, key: string): any => {
    if (key === 'tuitionMin') return uni.tuitionRange.min
    if (key === 'tuitionMax') return uni.tuitionRange.max
    return (uni as any)[key]
  }

  return (
    <div className="space-y-8">
      {/* Selection area */}
      {selectedUniversities.length < 3 && (
        <div className="glass-effect rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">
            Добавить университет ({selectedUniversities.length}/3)
          </h2>
          
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск университета..."
            className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-primary-500 mb-4"
          />

          {searchQuery && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {filteredUniversities.map(uni => (
                <button
                  key={uni.id}
                  onClick={() => addUniversity(uni as University)}
                  className="flex items-center space-x-3 p-4 bg-white rounded-lg hover:bg-primary-50 transition-all text-left border border-gray-100"
                >
                  <Image
                    src={uni.logo}
                    alt={uni.shortName}
                    width={48}
                    height={48}
                    className="rounded-lg"
                  />
                  <div>
                    <h3 className="font-bold">{uni.shortName}</h3>
                    <p className="text-sm text-gray-500">{uni.city}</p>
                  </div>
                </button>
              ))}
              {filteredUniversities.length === 0 && (
                <div className="col-span-3 text-center py-8 text-gray-500">
                  Ничего не найдено
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Comparison table */}
      {selectedUniversities.length > 0 && (
        <div className="glass-effect rounded-2xl p-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-4 border-b-2 border-gray-200 font-bold">
                  Критерий
                </th>
                {selectedUniversities.map(uni => (
                  <th key={uni.id} className="p-4 border-b-2 border-gray-200">
                    <div className="flex flex-col items-center space-y-2">
                      <button
                        onClick={() => removeUniversity(uni.id)}
                        className="ml-auto p-1 hover:bg-red-100 rounded-full text-red-600"
                      >
                        <FiX size={20} />
                      </button>
                      <Image
                        src={uni.logo}
                        alt={uni.shortName}
                        width={64}
                        height={64}
                        className="rounded-lg"
                      />
                      <div className="text-center">
                        <h3 className="font-bold">{uni.shortName}</h3>
                        <p className="text-sm text-gray-500">{uni.city}</p>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonCriteria.map((criterion, index) => {
                const values = selectedUniversities.map(uni => getValue(uni, criterion.key))
                let bestIndexes: number[] = []

                // Determine best value(s)
                if (criterion.key === 'rating') {
                  const max = Math.max(...values)
                  bestIndexes = values.map((v, i) => v === max ? i : -1).filter(i => i !== -1)
                } else if (criterion.key === 'worldRank') {
                  const validValues = values.filter(v => v !== undefined)
                  if (validValues.length > 0) {
                    const min = Math.min(...validValues)
                    bestIndexes = values.map((v, i) => v === min ? i : -1).filter(i => i !== -1)
                  }
                } else if (criterion.key === 'tuitionMin') {
                  const min = Math.min(...values)
                  bestIndexes = values.map((v, i) => v === min ? i : -1).filter(i => i !== -1)
                }

                return (
                  <tr key={criterion.key} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="p-4 font-medium text-gray-700">
                      {criterion.label}
                    </td>
                    {values.map((value, i) => (
                      <td key={i} className="p-4 text-center">
                        <div className={`inline-flex items-center space-x-2 ${bestIndexes.includes(i) ? 'text-green-600 font-bold' : ''}`}>
                          {bestIndexes.includes(i) && <FiCheck />}
                          <span>{criterion.format(value as any)}</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* AI Recommendation */}
      {selectedUniversities.length >= 2 && (
        <div className="glass-effect rounded-2xl p-6 bg-gradient-to-br from-primary-50 to-secondary-50">
          <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <span>🤖</span>
            <span>Рекомендация AI</span>
          </h2>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700">
              {generateAIRecommendation(selectedUniversities)}
            </p>
          </div>
        </div>
      )}

      {selectedUniversities.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold mb-2">Начните сравнение</h3>
          <p className="text-gray-600">
            Выберите университеты для сравнения, используя поиск выше
          </p>
        </div>
      )}
    </div>
  )
}

function generateAIRecommendation(universities: University[]): string {
  if (universities.length < 2) return ''

  const [uni1, uni2, uni3] = universities
  let recommendation = ''

  // Compare ratings
  const sortedByRating = [...universities].sort((a, b) => b.rating - a.rating)
  recommendation += `**По рейтингу**: ${sortedByRating[0].shortName} (${sortedByRating[0].rating}) лидирует среди выбранных университетов.\n\n`

  // Compare costs
  const sortedByCost = [...universities].sort((a, b) => a.tuitionRange.min - b.tuitionRange.min)
  recommendation += `**По стоимости**: Наиболее доступный вариант - ${sortedByCost[0].shortName} (от ${(sortedByCost[0].tuitionRange.min / 1000000).toFixed(1)}M₸/год).\n\n`

  // Specific recommendations
  if (universities.some(u => u.city === 'Астана')) {
    const astanaUnis = universities.filter(u => u.city === 'Астана')
    recommendation += `**Для тех, кто хочет учиться в столице**: ${astanaUnis.map(u => u.shortName).join(', ')}.\n\n`
  }

  if (universities.some(u => u.internationalStudents > 10)) {
    const internationalUnis = universities.filter(u => u.internationalStudents > 10)
    recommendation += `**Для международного опыта**: ${internationalUnis[0].shortName} имеет ${internationalUnis[0].internationalStudents}% иностранных студентов.\n\n`
  }

  recommendation += '💡 **Совет**: Выбор зависит от ваших приоритетов - престиж, стоимость, локация или специализация. Рекомендуем также посетить 3D-туры и изучить отзывы студентов.'

  return recommendation
}

