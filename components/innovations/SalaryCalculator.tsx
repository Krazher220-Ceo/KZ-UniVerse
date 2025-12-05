'use client'

import { useState } from 'react'
import { FiDollarSign, FiTrendingUp, FiBarChart2, FiAward, FiMapPin } from 'react-icons/fi'
import { formatNumber } from '@/lib/format'

interface SalaryData {
  field: string
  entryLevel: number
  midLevel: number
  seniorLevel: number
  topLevel: number
  growth: number
  demand: 'high' | 'medium' | 'low'
}

const SALARY_DATA: { [key: string]: SalaryData } = {
  'software-engineering': {
    field: 'Программная инженерия',
    entryLevel: 350000,
    midLevel: 800000,
    seniorLevel: 1500000,
    topLevel: 2500000,
    growth: 25,
    demand: 'high'
  },
  'data-science': {
    field: 'Data Science / AI',
    entryLevel: 400000,
    midLevel: 900000,
    seniorLevel: 1800000,
    topLevel: 3000000,
    growth: 35,
    demand: 'high'
  },
  'cybersecurity': {
    field: 'Кибербезопасность',
    entryLevel: 380000,
    midLevel: 850000,
    seniorLevel: 1600000,
    topLevel: 2800000,
    growth: 30,
    demand: 'high'
  },
  'finance': {
    field: 'Финансы и банкинг',
    entryLevel: 300000,
    midLevel: 700000,
    seniorLevel: 1400000,
    topLevel: 3500000,
    growth: 15,
    demand: 'high'
  },
  'marketing': {
    field: 'Маркетинг и PR',
    entryLevel: 250000,
    midLevel: 500000,
    seniorLevel: 900000,
    topLevel: 1500000,
    growth: 12,
    demand: 'medium'
  },
  'petroleum': {
    field: 'Нефтегазовая отрасль',
    entryLevel: 450000,
    midLevel: 1000000,
    seniorLevel: 2000000,
    topLevel: 4000000,
    growth: 8,
    demand: 'medium'
  },
  'medicine': {
    field: 'Медицина',
    entryLevel: 200000,
    midLevel: 450000,
    seniorLevel: 800000,
    topLevel: 1500000,
    growth: 15,
    demand: 'high'
  },
  'law': {
    field: 'Юриспруденция',
    entryLevel: 250000,
    midLevel: 550000,
    seniorLevel: 1200000,
    topLevel: 3000000,
    growth: 10,
    demand: 'medium'
  },
  'education': {
    field: 'Образование',
    entryLevel: 180000,
    midLevel: 300000,
    seniorLevel: 500000,
    topLevel: 800000,
    growth: 5,
    demand: 'medium'
  },
  'civil-engineering': {
    field: 'Строительство',
    entryLevel: 300000,
    midLevel: 600000,
    seniorLevel: 1100000,
    topLevel: 2000000,
    growth: 12,
    demand: 'medium'
  }
}

const CITIES = [
  { id: 'astana', name: 'Астана', multiplier: 1.15 },
  { id: 'almaty', name: 'Алматы', multiplier: 1.2 },
  { id: 'atyrau', name: 'Атырау', multiplier: 1.3 },
  { id: 'aktau', name: 'Актау', multiplier: 1.25 },
  { id: 'shymkent', name: 'Шымкент', multiplier: 0.9 },
  { id: 'karaganda', name: 'Караганда', multiplier: 0.95 },
  { id: 'other', name: 'Другой город', multiplier: 0.85 }
]

export default function SalaryCalculator() {
  const [selectedField, setSelectedField] = useState<string>('')
  const [selectedCity, setSelectedCity] = useState<string>('almaty')
  const [experience, setExperience] = useState<number>(0)
  const [showResults, setShowResults] = useState(false)

  const calculateSalary = () => {
    if (!selectedField) return null
    
    const data = SALARY_DATA[selectedField]
    const cityMultiplier = CITIES.find(c => c.id === selectedCity)?.multiplier || 1
    
    let baseSalary: number
    let level: string
    
    if (experience === 0) {
      baseSalary = data.entryLevel
      level = 'Junior'
    } else if (experience <= 2) {
      baseSalary = data.entryLevel + (data.midLevel - data.entryLevel) * (experience / 2)
      level = 'Junior → Middle'
    } else if (experience <= 5) {
      baseSalary = data.midLevel + (data.seniorLevel - data.midLevel) * ((experience - 2) / 3)
      level = 'Middle → Senior'
    } else if (experience <= 10) {
      baseSalary = data.seniorLevel + (data.topLevel - data.seniorLevel) * ((experience - 5) / 5)
      level = 'Senior → Lead'
    } else {
      baseSalary = data.topLevel
      level = 'Expert / Director'
    }
    
    const adjustedSalary = Math.round(baseSalary * cityMultiplier)
    
    // Прогноз на 5 лет
    const futureExperience = experience + 5
    let futureSalary: number
    
    if (futureExperience <= 2) {
      futureSalary = data.midLevel
    } else if (futureExperience <= 5) {
      futureSalary = data.seniorLevel
    } else {
      futureSalary = data.topLevel
    }
    
    futureSalary = Math.round(futureSalary * cityMultiplier * (1 + data.growth / 100))
    
    return {
      current: adjustedSalary,
      future: futureSalary,
      level,
      growth: data.growth,
      demand: data.demand,
      field: data.field
    }
  }

  const result = calculateSalary()

  const getDemandColor = (demand: 'high' | 'medium' | 'low') => {
    switch (demand) {
      case 'high': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-red-600 bg-red-100'
    }
  }

  const getDemandLabel = (demand: 'high' | 'medium' | 'low') => {
    switch (demand) {
      case 'high': return 'Высокий спрос'
      case 'medium': return 'Средний спрос'
      case 'low': return 'Низкий спрос'
    }
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
          <FiDollarSign className="text-white text-2xl" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">💰 Калькулятор зарплат</h2>
          <p className="text-gray-600">Узнайте ожидаемую зарплату по специальности</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {/* Выбор специальности */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Выберите специальность:
          </label>
          <select
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 bg-white"
          >
            <option value="">Выберите направление</option>
            {Object.entries(SALARY_DATA).map(([key, data]) => (
              <option key={key} value={key}>{data.field}</option>
            ))}
          </select>
        </div>

        {/* Выбор города */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Город работы:
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {CITIES.slice(0, 4).map(city => (
              <button
                key={city.id}
                onClick={() => setSelectedCity(city.id)}
                className={`p-2 rounded-lg border transition-all text-sm ${
                  selectedCity === city.id
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 bg-white hover:border-green-300'
                }`}
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>

        {/* Опыт работы */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Опыт работы: <span className="text-green-600 font-bold">{experience} лет</span>
          </label>
          <input
            type="range"
            min="0"
            max="15"
            value={experience}
            onChange={(e) => setExperience(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Без опыта</span>
            <span>5 лет</span>
            <span>10 лет</span>
            <span>15+ лет</span>
          </div>
        </div>
      </div>

      {/* Результаты */}
      {selectedField && result && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500">Ожидаемая зарплата</p>
                <h3 className="text-3xl font-bold text-green-600">
                  {formatNumber(result.current)} ₸
                </h3>
                <p className="text-sm text-gray-500">в месяц</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDemandColor(result.demand)}`}>
                  {getDemandLabel(result.demand)}
                </span>
                <p className="text-sm text-gray-500 mt-2">Уровень: {result.level}</p>
              </div>
            </div>

            {/* Сравнение с будущим */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Сейчас</p>
                <p className="font-bold text-gray-900">{formatNumber(result.current)} ₸</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Через 5 лет</p>
                <p className="font-bold text-green-600">{formatNumber(result.future)} ₸</p>
                <p className="text-xs text-green-500">+{Math.round((result.future / result.current - 1) * 100)}%</p>
              </div>
            </div>
          </div>

          {/* Дополнительная информация */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-lg p-3 text-center">
              <FiTrendingUp className="mx-auto text-green-500 mb-1" />
              <p className="text-lg font-bold text-gray-900">+{result.growth}%</p>
              <p className="text-xs text-gray-500">Рост рынка</p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <FiBarChart2 className="mx-auto text-blue-500 mb-1" />
              <p className="text-lg font-bold text-gray-900">{formatNumber(result.current * 12)}</p>
              <p className="text-xs text-gray-500">₸ в год</p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <FiMapPin className="mx-auto text-purple-500 mb-1" />
              <p className="text-lg font-bold text-gray-900">
                {CITIES.find(c => c.id === selectedCity)?.name}
              </p>
              <p className="text-xs text-gray-500">Регион</p>
            </div>
          </div>

          {/* Совет */}
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <FiAward className="text-green-600 mt-1 flex-shrink-0" />
              <div className="text-sm text-gray-700">
                <strong>Совет:</strong> Для увеличения зарплаты в сфере "{result.field}" рекомендуем получить международные сертификаты и развивать навыки в смежных областях. Выпускники топовых вузов (NU, AITU, KBTU) получают на 20-30% больше.
              </div>
            </div>
          </div>
        </div>
      )}

      {!selectedField && (
        <div className="text-center py-8 text-gray-500">
          <FiDollarSign size={48} className="mx-auto mb-3 opacity-30" />
          <p>Выберите специальность для расчёта зарплаты</p>
        </div>
      )}
    </div>
  )
}

