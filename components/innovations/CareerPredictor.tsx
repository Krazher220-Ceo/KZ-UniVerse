'use client'

import { useState } from 'react'
import { FiTrendingUp, FiDollarSign, FiBriefcase, FiAward, FiTarget } from 'react-icons/fi'

interface CareerPrediction {
  topCareers: {
    title: string;
    salary: string;
    demand: 'high' | 'medium' | 'low';
    growth: number;
    companies: string[];
  }[];
  skills: string[];
  timeline: {
    year: number;
    milestone: string;
  }[];
  salaryProgression: {
    year: number;
    salary: number;
  }[];
}

// Данные о карьерных путях по программам
const CAREER_DATA: { [key: string]: CareerPrediction } = {
  'computer-science': {
    topCareers: [
      { title: 'Software Engineer', salary: '800K - 2M ₸/мес', demand: 'high', growth: 25, companies: ['Google', 'Microsoft', 'Kaspersky', 'EPAM'] },
      { title: 'Data Scientist', salary: '700K - 1.8M ₸/мес', demand: 'high', growth: 35, companies: ['Yandex', 'Kolesa', 'Choco'] },
      { title: 'DevOps Engineer', salary: '600K - 1.5M ₸/мес', demand: 'high', growth: 30, companies: ['Halyk Bank', 'Kaspi', 'Freedom Finance'] },
      { title: 'AI/ML Engineer', salary: '900K - 2.5M ₸/мес', demand: 'high', growth: 40, companies: ['NU Tech Park', 'AITU Lab', 'Международные компании'] }
    ],
    skills: ['Python', 'JavaScript', 'SQL', 'Machine Learning', 'Cloud (AWS/GCP)', 'Git', 'Algorithms'],
    timeline: [
      { year: 1, milestone: 'Junior Developer / Стажер' },
      { year: 2, milestone: 'Middle Developer' },
      { year: 4, milestone: 'Senior Developer' },
      { year: 6, milestone: 'Tech Lead / Architect' },
      { year: 8, milestone: 'Engineering Manager / CTO' }
    ],
    salaryProgression: [
      { year: 0, salary: 300000 },
      { year: 1, salary: 500000 },
      { year: 2, salary: 800000 },
      { year: 4, salary: 1200000 },
      { year: 6, salary: 1800000 },
      { year: 8, salary: 2500000 }
    ]
  },
  'business': {
    topCareers: [
      { title: 'Business Analyst', salary: '500K - 1.2M ₸/мес', demand: 'high', growth: 20, companies: ['Big 4', 'Kaspi', 'Halyk Bank'] },
      { title: 'Product Manager', salary: '700K - 1.8M ₸/мес', demand: 'high', growth: 25, companies: ['Kolesa', 'Choco', 'InDrive'] },
      { title: 'Management Consultant', salary: '600K - 2M ₸/мес', demand: 'medium', growth: 15, companies: ['McKinsey', 'BCG', 'Deloitte'] },
      { title: 'Financial Analyst', salary: '500K - 1.5M ₸/мес', demand: 'high', growth: 18, companies: ['Freedom Finance', 'Halyk Bank', 'Казкоммерцбанк'] }
    ],
    skills: ['Excel', 'Financial Modeling', 'Data Analysis', 'Presentation', 'Strategy', 'Leadership'],
    timeline: [
      { year: 1, milestone: 'Analyst / Associate' },
      { year: 3, milestone: 'Senior Analyst / Manager' },
      { year: 5, milestone: 'Senior Manager / Director' },
      { year: 8, milestone: 'VP / Partner' },
      { year: 12, milestone: 'C-Level Executive' }
    ],
    salaryProgression: [
      { year: 0, salary: 250000 },
      { year: 1, salary: 400000 },
      { year: 3, salary: 700000 },
      { year: 5, salary: 1200000 },
      { year: 8, salary: 2000000 },
      { year: 12, salary: 3500000 }
    ]
  },
  'engineering': {
    topCareers: [
      { title: 'Petroleum Engineer', salary: '800K - 2.5M ₸/мес', demand: 'medium', growth: 10, companies: ['Tengizchevroil', 'KazMunayGas', 'Shell'] },
      { title: 'Civil Engineer', salary: '400K - 1M ₸/мес', demand: 'medium', growth: 12, companies: ['BI Group', 'Bazis-A', 'Государственные проекты'] },
      { title: 'Mechanical Engineer', salary: '450K - 1.2M ₸/мес', demand: 'medium', growth: 8, companies: ['ArcelorMittal', 'КазЦинк', 'Машиностроительные заводы'] },
      { title: 'Chemical Engineer', salary: '500K - 1.5M ₸/мес', demand: 'medium', growth: 15, companies: ['Павлодарский НХЗ', 'Атырауский НПЗ', 'ПНХЗ'] }
    ],
    skills: ['AutoCAD', 'MATLAB', 'Project Management', 'Technical Drawing', 'Safety Standards'],
    timeline: [
      { year: 1, milestone: 'Junior Engineer' },
      { year: 3, milestone: 'Engineer' },
      { year: 5, milestone: 'Senior Engineer' },
      { year: 8, milestone: 'Lead Engineer / Project Manager' },
      { year: 12, milestone: 'Chief Engineer / Director' }
    ],
    salaryProgression: [
      { year: 0, salary: 300000 },
      { year: 1, salary: 450000 },
      { year: 3, salary: 700000 },
      { year: 5, salary: 1000000 },
      { year: 8, salary: 1500000 },
      { year: 12, salary: 2500000 }
    ]
  },
  'medicine': {
    topCareers: [
      { title: 'Врач-терапевт', salary: '300K - 800K ₸/мес', demand: 'high', growth: 15, companies: ['Государственные клиники', 'Частные клиники'] },
      { title: 'Хирург', salary: '500K - 1.5M ₸/мес', demand: 'high', growth: 12, companies: ['Национальные центры', 'Частные госпитали'] },
      { title: 'Стоматолог', salary: '400K - 1.2M ₸/мес', demand: 'high', growth: 20, companies: ['Частные клиники', 'Собственная практика'] },
      { title: 'Фармацевт', salary: '250K - 600K ₸/мес', demand: 'medium', growth: 10, companies: ['Аптечные сети', 'Фармкомпании'] }
    ],
    skills: ['Клинические навыки', 'Диагностика', 'Коммуникация', 'Медицинские технологии'],
    timeline: [
      { year: 1, milestone: 'Интерн' },
      { year: 2, milestone: 'Резидент' },
      { year: 4, milestone: 'Врач-специалист' },
      { year: 8, milestone: 'Заведующий отделением' },
      { year: 15, milestone: 'Главный врач / Профессор' }
    ],
    salaryProgression: [
      { year: 0, salary: 150000 },
      { year: 2, salary: 250000 },
      { year: 4, salary: 400000 },
      { year: 8, salary: 700000 },
      { year: 15, salary: 1200000 }
    ]
  }
}

export default function CareerPredictor() {
  const [selectedField, setSelectedField] = useState<string>('')
  const [prediction, setPrediction] = useState<CareerPrediction | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fields = [
    { id: 'computer-science', name: '💻 IT / Computer Science', icon: '💻' },
    { id: 'business', name: '💼 Бизнес / Экономика', icon: '💼' },
    { id: 'engineering', name: '⚙️ Инженерия', icon: '⚙️' },
    { id: 'medicine', name: '🏥 Медицина', icon: '🏥' }
  ]

  const handlePredict = async () => {
    if (!selectedField) return
    
    setIsLoading(true)
    
    // Имитация загрузки
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setPrediction(CAREER_DATA[selectedField] || null)
    setIsLoading(false)
  }

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
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
          <FiTarget className="text-white text-2xl" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">🚀 AI Прогноз карьеры</h2>
          <p className="text-gray-600">Узнайте, какие карьерные возможности вас ждут</p>
        </div>
      </div>

      {/* Выбор направления */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Выберите направление обучения:
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {fields.map(field => (
            <button
              key={field.id}
              onClick={() => setSelectedField(field.id)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                selectedField === field.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 bg-white hover:border-purple-300'
              }`}
            >
              <span className="text-2xl block mb-1">{field.icon}</span>
              <span className="text-sm font-medium">{field.name.replace(field.icon + ' ', '')}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handlePredict}
        disabled={!selectedField || isLoading}
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>AI анализирует...</span>
          </>
        ) : (
          <>
            <FiTrendingUp />
            <span>Получить прогноз карьеры</span>
          </>
        )}
      </button>

      {/* Результаты */}
      {prediction && (
        <div className="mt-8 space-y-6">
          {/* Топ карьеры */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FiBriefcase className="text-purple-600" />
              Топ карьерные пути
            </h3>
            <div className="space-y-4">
              {prediction.topCareers.map((career, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{career.title}</h4>
                      <p className="text-sm text-gray-600">{career.companies.join(', ')}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDemandColor(career.demand)}`}>
                      {getDemandLabel(career.demand)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <FiDollarSign className="text-green-600" />
                      {career.salary}
                    </span>
                    <span className="flex items-center gap-1 text-purple-600">
                      <FiTrendingUp />
                      +{career.growth}% рост
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ключевые навыки */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FiAward className="text-purple-600" />
              Ключевые навыки для развития
            </h3>
            <div className="flex flex-wrap gap-2">
              {prediction.skills.map((skill, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Timeline карьеры */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4">📈 Карьерный путь</h3>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-purple-200"></div>
              <div className="space-y-4">
                {prediction.timeline.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 relative">
                    <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold z-10">
                      {item.year}
                    </div>
                    <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{item.milestone}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* График зарплаты */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FiDollarSign className="text-green-600" />
              Прогноз роста зарплаты
            </h3>
            <div className="flex items-end gap-2 h-40">
              {prediction.salaryProgression.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all hover:from-green-600 hover:to-green-500"
                    style={{ height: `${(item.salary / 3500000) * 100}%` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2">{item.year}г</span>
                  <span className="text-xs font-medium">{(item.salary / 1000000).toFixed(1)}M</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

