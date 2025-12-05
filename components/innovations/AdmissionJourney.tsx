'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { FiTarget, FiCheckCircle, FiClock, FiAlertTriangle, FiArrowRight, FiBook, FiAward, FiFileText, FiCalendar, FiTrendingUp, FiHelpCircle } from 'react-icons/fi'
import Link from 'next/link'

// ============================================
// КОНТЕКСТ ДЛЯ ОБМЕНА ДАННЫМИ МЕЖДУ МОДУЛЯМИ
// ============================================

interface JourneyData {
  // Профиль абитуриента
  profile: {
    entScore: number | null
    gpa: number | null
    ielts: number | null
    olympiads: string[]
    achievements: string[]
    targetField: string
    targetCity: string
    budget: 'low' | 'medium' | 'high' | null
  }
  // Прогресс по этапам
  stages: {
    profileComplete: boolean
    universitiesExplored: number
    documentsReady: boolean
    applicationSent: boolean
    entPassed: boolean
  }
  // Рекомендации AI
  recommendations: {
    universities: string[]
    programs: string[]
    scholarships: string[]
    risks: string[]
    tips: string[]
  }
  // Проблемы и решения
  problems: {
    id: string
    title: string
    severity: 'critical' | 'warning' | 'info'
    solution: string
    resolved: boolean
  }[]
}

const defaultJourneyData: JourneyData = {
  profile: {
    entScore: null,
    gpa: null,
    ielts: null,
    olympiads: [],
    achievements: [],
    targetField: '',
    targetCity: '',
    budget: null
  },
  stages: {
    profileComplete: false,
    universitiesExplored: 0,
    documentsReady: false,
    applicationSent: false,
    entPassed: false
  },
  recommendations: {
    universities: [],
    programs: [],
    scholarships: [],
    risks: [],
    tips: []
  },
  problems: []
}

// ============================================
// ГЛАВНЫЙ КОМПОНЕНТ - ПУТЬ АБИТУРИЕНТА
// ============================================

export default function AdmissionJourney() {
  const [journeyData, setJourneyData] = useState<JourneyData>(defaultJourneyData)
  const [activeModule, setActiveModule] = useState<'diagnostic' | 'planner' | 'risks' | 'documents' | 'tracker'>('diagnostic')
  const [isLoaded, setIsLoaded] = useState(false)

  // Загружаем данные из localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kz-universe-journey')
      if (saved) {
        try {
          setJourneyData(JSON.parse(saved))
        } catch (e) {
          console.error('Failed to parse journey data:', e)
        }
      }
      setIsLoaded(true)
    }
  }, [])

  // Сохраняем при изменении
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('kz-universe-journey', JSON.stringify(journeyData))
    }
  }, [journeyData, isLoaded])

  // Обновление данных
  const updateProfile = (updates: Partial<JourneyData['profile']>) => {
    setJourneyData(prev => ({
      ...prev,
      profile: { ...prev.profile, ...updates }
    }))
  }

  const updateStages = (updates: Partial<JourneyData['stages']>) => {
    setJourneyData(prev => ({
      ...prev,
      stages: { ...prev.stages, ...updates }
    }))
  }

  const addProblem = (problem: JourneyData['problems'][0]) => {
    setJourneyData(prev => ({
      ...prev,
      problems: [...prev.problems.filter(p => p.id !== problem.id), problem]
    }))
  }

  const resolveProblem = (id: string) => {
    setJourneyData(prev => ({
      ...prev,
      problems: prev.problems.map(p => p.id === id ? { ...p, resolved: true } : p)
    }))
  }

  // Расчёт общего прогресса
  const calculateProgress = () => {
    const { stages, profile } = journeyData
    let progress = 0
    let total = 5

    if (profile.entScore && profile.targetField) progress += 1
    if (stages.universitiesExplored >= 3) progress += 1
    if (stages.documentsReady) progress += 1
    if (stages.entPassed) progress += 1
    if (stages.applicationSent) progress += 1

    return Math.round((progress / total) * 100)
  }

  const progress = calculateProgress()
  const unresolvedProblems = journeyData.problems.filter(p => !p.resolved)
  const criticalProblems = unresolvedProblems.filter(p => p.severity === 'critical')

  const modules = [
    { id: 'diagnostic', label: '🔍 Диагностика', icon: FiTarget, desc: 'Оценка готовности' },
    { id: 'planner', label: '📅 Планировщик', icon: FiCalendar, desc: 'Дедлайны и задачи' },
    { id: 'risks', label: '⚠️ Риски', icon: FiAlertTriangle, desc: 'Проблемы и решения' },
    { id: 'documents', label: '📄 Документы', icon: FiFileText, desc: 'Чек-лист документов' },
    { id: 'tracker', label: '📊 Прогресс', icon: FiTrendingUp, desc: 'Отслеживание пути' },
  ]

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl overflow-hidden">
      {/* Header с общим прогрессом */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              🎓 Путь абитуриента
            </h2>
            <p className="text-indigo-200">Интегрированная система подготовки к поступлению</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{progress}%</div>
            <p className="text-indigo-200 text-sm">готовности</p>
          </div>
        </div>

        {/* Прогресс-бар */}
        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-400 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Предупреждения */}
        {criticalProblems.length > 0 && (
          <div className="mt-4 p-3 bg-red-500/20 rounded-lg flex items-center gap-3">
            <FiAlertTriangle className="text-red-300" size={20} />
            <span className="text-red-100">
              {criticalProblems.length} критических проблем требуют внимания!
            </span>
            <button 
              onClick={() => setActiveModule('risks')}
              className="ml-auto px-3 py-1 bg-white/20 rounded-lg text-sm hover:bg-white/30 transition-colors"
            >
              Решить
            </button>
          </div>
        )}
      </div>

      {/* Навигация по модулям */}
      <div className="flex overflow-x-auto border-b border-gray-200 bg-white">
        {modules.map(module => (
          <button
            key={module.id}
            onClick={() => setActiveModule(module.id as any)}
            className={`flex-1 min-w-[140px] p-4 text-center transition-all ${
              activeModule === module.id
                ? 'bg-gradient-to-b from-indigo-50 to-white border-b-2 border-indigo-600'
                : 'hover:bg-gray-50'
            }`}
          >
            <module.icon className={`mx-auto mb-1 ${activeModule === module.id ? 'text-indigo-600' : 'text-gray-400'}`} size={20} />
            <div className={`text-sm font-medium ${activeModule === module.id ? 'text-indigo-600' : 'text-gray-600'}`}>
              {module.label}
            </div>
            <div className="text-xs text-gray-400">{module.desc}</div>
          </button>
        ))}
      </div>

      {/* Контент модулей */}
      <div className="p-6">
        {activeModule === 'diagnostic' && (
          <DiagnosticModule 
            data={journeyData} 
            updateProfile={updateProfile}
            addProblem={addProblem}
          />
        )}
        {activeModule === 'planner' && (
          <PlannerModule 
            data={journeyData}
            updateStages={updateStages}
          />
        )}
        {activeModule === 'risks' && (
          <RisksModule 
            data={journeyData}
            resolveProblem={resolveProblem}
          />
        )}
        {activeModule === 'documents' && (
          <DocumentsModule 
            data={journeyData}
            updateStages={updateStages}
          />
        )}
        {activeModule === 'tracker' && (
          <TrackerModule data={journeyData} />
        )}
      </div>
    </div>
  )
}

// ============================================
// МОДУЛЬ 1: ДИАГНОСТИКА ГОТОВНОСТИ
// ============================================

function DiagnosticModule({ 
  data, 
  updateProfile,
  addProblem 
}: { 
  data: JourneyData
  updateProfile: (updates: Partial<JourneyData['profile']>) => void
  addProblem: (problem: JourneyData['problems'][0]) => void
}) {
  const [localData, setLocalData] = useState({
    entScore: data.profile.entScore?.toString() || '',
    gpa: data.profile.gpa?.toString() || '',
    ielts: data.profile.ielts?.toString() || '',
    targetField: data.profile.targetField || '',
    targetCity: data.profile.targetCity || '',
    budget: data.profile.budget || ''
  })

  const fields = [
    { id: 'it', label: '💻 IT / Программирование' },
    { id: 'business', label: '💼 Бизнес / Экономика' },
    { id: 'engineering', label: '⚙️ Инженерия' },
    { id: 'medicine', label: '🏥 Медицина' },
    { id: 'law', label: '⚖️ Юриспруденция' },
    { id: 'humanities', label: '📚 Гуманитарные науки' },
  ]

  const cities = [
    { id: 'astana', label: '🏙️ Астана' },
    { id: 'almaty', label: '🌆 Алматы' },
    { id: 'any', label: '🗺️ Любой город' },
  ]

  const budgets = [
    { id: 'low', label: '💵 До 1.5M ₸/год', desc: 'Грант или бюджет' },
    { id: 'medium', label: '💰 1.5-3M ₸/год', desc: 'Средний сегмент' },
    { id: 'high', label: '💎 От 3M ₸/год', desc: 'Премиум' },
  ]

  const handleSave = () => {
    const entScore = parseInt(localData.entScore) || null
    const gpa = parseFloat(localData.gpa) || null
    const ielts = parseFloat(localData.ielts) || null

    updateProfile({
      entScore,
      gpa,
      ielts,
      targetField: localData.targetField,
      targetCity: localData.targetCity,
      budget: localData.budget as any
    })

    // Анализируем проблемы
    if (entScore && entScore < 80) {
      addProblem({
        id: 'low-ent',
        title: 'Низкий балл ЕНТ',
        severity: 'critical',
        solution: 'Рекомендуем интенсивную подготовку. Рассмотрите репетиторов или онлайн-курсы. Минимум для гранта обычно 100+ баллов.',
        resolved: false
      })
    }

    if (localData.targetField === 'medicine' && (!entScore || entScore < 110)) {
      addProblem({
        id: 'medicine-ent',
        title: 'Медицина требует высокий балл',
        severity: 'warning',
        solution: 'Для поступления на медицину нужен балл ЕНТ от 110. Усильте подготовку по биологии и химии.',
        resolved: false
      })
    }

    if (!ielts && (localData.targetField === 'it' || localData.targetCity === 'astana')) {
      addProblem({
        id: 'no-ielts',
        title: 'Нет IELTS для англоязычных программ',
        severity: 'warning',
        solution: 'Многие топовые программы в Астане требуют IELTS 6.0+. Запишитесь на курсы английского.',
        resolved: false
      })
    }

    if (localData.budget === 'low' && (!entScore || entScore < 100)) {
      addProblem({
        id: 'budget-grant',
        title: 'Грант требует высокий балл',
        severity: 'warning',
        solution: 'Для получения гранта нужен балл ЕНТ от 100. Рассмотрите также именные стипендии и скидки от вузов.',
        resolved: false
      })
    }
  }

  // Расчёт совместимости с вузами
  const getCompatibility = () => {
    const ent = parseInt(localData.entScore) || 0
    const results = []

    if (ent >= 120) results.push({ uni: 'Nazarbayev University', chance: 'Высокий', color: 'text-green-600' })
    if (ent >= 100) results.push({ uni: 'AITU', chance: 'Высокий', color: 'text-green-600' })
    if (ent >= 90) results.push({ uni: 'КБТУ', chance: 'Средний', color: 'text-yellow-600' })
    if (ent >= 85) results.push({ uni: 'КазНУ', chance: 'Высокий', color: 'text-green-600' })
    if (ent >= 75) results.push({ uni: 'ЕНУ', chance: 'Высокий', color: 'text-green-600' })
    if (ent < 75) results.push({ uni: 'Региональные вузы', chance: 'Средний', color: 'text-yellow-600' })

    return results.slice(0, 4)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
          <FiTarget className="text-indigo-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold">Диагностика готовности</h3>
          <p className="text-sm text-gray-500">Заполните данные для персонализированного анализа</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Левая колонка - ввод данных */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Балл ЕНТ (или ожидаемый)</label>
            <input
              type="number"
              value={localData.entScore}
              onChange={(e) => setLocalData(prev => ({ ...prev, entScore: e.target.value }))}
              placeholder="Например: 110"
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
              max={140}
            />
            <p className="text-xs text-gray-400 mt-1">Максимум: 140 баллов</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GPA (средний балл аттестата)</label>
            <input
              type="number"
              step="0.1"
              value={localData.gpa}
              onChange={(e) => setLocalData(prev => ({ ...prev, gpa: e.target.value }))}
              placeholder="Например: 4.5"
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
              max={5}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">IELTS (если есть)</label>
            <input
              type="number"
              step="0.5"
              value={localData.ielts}
              onChange={(e) => setLocalData(prev => ({ ...prev, ielts: e.target.value }))}
              placeholder="Например: 6.5"
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
              max={9}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Направление</label>
            <div className="grid grid-cols-2 gap-2">
              {fields.map(field => (
                <button
                  key={field.id}
                  onClick={() => setLocalData(prev => ({ ...prev, targetField: field.id }))}
                  className={`p-2 rounded-lg border text-sm text-left transition-all ${
                    localData.targetField === field.id
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  {field.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Город</label>
            <div className="grid grid-cols-3 gap-2">
              {cities.map(city => (
                <button
                  key={city.id}
                  onClick={() => setLocalData(prev => ({ ...prev, targetCity: city.id }))}
                  className={`p-2 rounded-lg border text-sm transition-all ${
                    localData.targetCity === city.id
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  {city.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Бюджет</label>
            <div className="space-y-2">
              {budgets.map(budget => (
                <button
                  key={budget.id}
                  onClick={() => setLocalData(prev => ({ ...prev, budget: budget.id }))}
                  className={`w-full p-3 rounded-lg border text-left transition-all ${
                    localData.budget === budget.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="font-medium">{budget.label}</div>
                  <div className="text-xs text-gray-500">{budget.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
          >
            Сохранить и проанализировать
          </button>
        </div>

        {/* Правая колонка - результаты */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h4 className="font-bold mb-3 flex items-center gap-2">
              <FiTrendingUp className="text-indigo-600" />
              Совместимость с вузами
            </h4>
            {localData.entScore ? (
              <div className="space-y-2">
                {getCompatibility().map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="font-medium">{item.uni}</span>
                    <span className={`text-sm font-medium ${item.color}`}>{item.chance}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Введите балл ЕНТ для расчёта</p>
            )}
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h4 className="font-bold mb-3 flex items-center gap-2">
              <FiHelpCircle className="text-purple-600" />
              Рекомендации
            </h4>
            <div className="space-y-2 text-sm">
              {parseInt(localData.entScore) < 100 && (
                <div className="p-2 bg-yellow-50 rounded-lg text-yellow-800">
                  💡 Для гранта нужен балл от 100. Усильте подготовку!
                </div>
              )}
              {localData.targetField === 'it' && (
                <div className="p-2 bg-blue-50 rounded-lg text-blue-800">
                  💻 IT: рассмотрите AITU, NU, КБТУ, МУИТ
                </div>
              )}
              {localData.targetCity === 'astana' && !localData.ielts && (
                <div className="p-2 bg-purple-50 rounded-lg text-purple-800">
                  🌍 В Астане много англоязычных программ. Подготовьте IELTS!
                </div>
              )}
              {localData.budget === 'low' && (
                <div className="p-2 bg-green-50 rounded-lg text-green-800">
                  💰 Изучите государственные гранты и именные стипендии
                </div>
              )}
            </div>
          </div>

          <Link href="/universities" className="block">
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-indigo-800">Подобрать университеты</h4>
                  <p className="text-sm text-indigo-600">На основе ваших данных</p>
                </div>
                <FiArrowRight className="text-indigo-600" size={24} />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

// ============================================
// МОДУЛЬ 2: ПЛАНИРОВЩИК ДЕДЛАЙНОВ
// ============================================

function PlannerModule({ 
  data,
  updateStages 
}: { 
  data: JourneyData
  updateStages: (updates: Partial<JourneyData['stages']>) => void
}) {
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  // Определяем учебный год
  const academicYear = currentMonth >= 6 ? currentYear + 1 : currentYear

  const deadlines = [
    {
      id: 'ent-registration',
      title: 'Регистрация на ЕНТ',
      date: new Date(academicYear, 3, 1), // Апрель
      description: 'Зарегистрируйтесь на ЕНТ через портал testcenter.kz',
      category: 'exam',
      icon: '📝'
    },
    {
      id: 'ent-main',
      title: 'Основной ЕНТ',
      date: new Date(academicYear, 5, 20), // Июнь
      description: 'Сдача Единого Национального Тестирования',
      category: 'exam',
      icon: '🎯'
    },
    {
      id: 'documents-prep',
      title: 'Подготовка документов',
      date: new Date(academicYear, 5, 25), // Июнь
      description: 'Аттестат, удостоверение, фото 3x4, медсправка',
      category: 'documents',
      icon: '📄'
    },
    {
      id: 'grant-application',
      title: 'Подача на грант',
      date: new Date(academicYear, 6, 1), // Июль
      description: 'Подайте заявку на государственный грант через egov.kz',
      category: 'application',
      icon: '🎓'
    },
    {
      id: 'university-application',
      title: 'Подача документов в вуз',
      date: new Date(academicYear, 6, 20), // Июль
      description: 'Подайте документы в выбранные университеты',
      category: 'application',
      icon: '🏛️'
    },
    {
      id: 'enrollment',
      title: 'Зачисление',
      date: new Date(academicYear, 7, 25), // Август
      description: 'Получение приказа о зачислении',
      category: 'result',
      icon: '✅'
    },
    {
      id: 'study-start',
      title: 'Начало учёбы',
      date: new Date(academicYear, 8, 1), // Сентябрь
      description: 'Первый учебный день',
      category: 'result',
      icon: '🎉'
    }
  ]

  const getDaysUntil = (date: Date) => {
    const diff = date.getTime() - today.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  const getStatusColor = (daysUntil: number) => {
    if (daysUntil < 0) return 'bg-gray-100 text-gray-500'
    if (daysUntil <= 7) return 'bg-red-100 text-red-700'
    if (daysUntil <= 30) return 'bg-yellow-100 text-yellow-700'
    return 'bg-green-100 text-green-700'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <FiCalendar className="text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold">Планировщик поступления {academicYear}</h3>
          <p className="text-sm text-gray-500">Важные даты и дедлайны</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        <div className="space-y-4">
          {deadlines.map((deadline, index) => {
            const daysUntil = getDaysUntil(deadline.date)
            const isPast = daysUntil < 0
            
            return (
              <div key={deadline.id} className="relative flex gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl z-10 ${
                  isPast ? 'bg-gray-200' : 'bg-white border-2 border-purple-500'
                }`}>
                  {deadline.icon}
                </div>
                
                <div className={`flex-1 p-4 rounded-xl ${isPast ? 'bg-gray-50' : 'bg-white shadow-sm border border-gray-100'}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className={`font-bold ${isPast ? 'text-gray-400' : 'text-gray-900'}`}>
                        {deadline.title}
                      </h4>
                      <p className={`text-sm ${isPast ? 'text-gray-400' : 'text-gray-600'}`}>
                        {deadline.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(daysUntil)}`}>
                        {isPast ? 'Прошло' : daysUntil === 0 ? 'Сегодня!' : `${daysUntil} дней`}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {deadline.date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Ближайшие задачи */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-5">
        <h4 className="font-bold mb-3">📌 Ближайшие задачи</h4>
        <div className="space-y-2">
          {deadlines
            .filter(d => getDaysUntil(d.date) >= 0 && getDaysUntil(d.date) <= 60)
            .slice(0, 3)
            .map(d => (
              <div key={d.id} className="flex items-center justify-between p-2 bg-white rounded-lg">
                <span className="flex items-center gap-2">
                  <span>{d.icon}</span>
                  <span className="font-medium">{d.title}</span>
                </span>
                <span className="text-sm text-purple-600">{getDaysUntil(d.date)} дней</span>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

// ============================================
// МОДУЛЬ 3: АНАЛИЗ РИСКОВ
// ============================================

function RisksModule({ 
  data,
  resolveProblem 
}: { 
  data: JourneyData
  resolveProblem: (id: string) => void
}) {
  const problems = data.problems.filter(p => !p.resolved)
  const resolved = data.problems.filter(p => p.resolved)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 border-red-300 text-red-800'
      case 'warning': return 'bg-yellow-100 border-yellow-300 text-yellow-800'
      case 'info': return 'bg-blue-100 border-blue-300 text-blue-800'
      default: return 'bg-gray-100 border-gray-300 text-gray-800'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return '🚨'
      case 'warning': return '⚠️'
      case 'info': return 'ℹ️'
      default: return '📌'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
          <FiAlertTriangle className="text-red-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold">Анализ рисков</h3>
          <p className="text-sm text-gray-500">Проблемы и их решения</p>
        </div>
      </div>

      {problems.length === 0 ? (
        <div className="text-center py-12 bg-green-50 rounded-xl">
          <div className="text-5xl mb-3">✅</div>
          <h4 className="text-xl font-bold text-green-800">Проблем не обнаружено!</h4>
          <p className="text-green-600">Заполните диагностику для анализа рисков</p>
        </div>
      ) : (
        <div className="space-y-4">
          {problems.map(problem => (
            <div 
              key={problem.id} 
              className={`p-5 rounded-xl border-2 ${getSeverityColor(problem.severity)}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{getSeverityIcon(problem.severity)}</span>
                <div className="flex-1">
                  <h4 className="font-bold mb-1">{problem.title}</h4>
                  <p className="text-sm opacity-80 mb-3">{problem.solution}</p>
                  <button
                    onClick={() => resolveProblem(problem.id)}
                    className="px-4 py-2 bg-white rounded-lg text-sm font-medium hover:shadow-md transition-all"
                  >
                    ✓ Отметить как решённое
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {resolved.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium text-gray-500 mb-3">Решённые проблемы ({resolved.length})</h4>
          <div className="space-y-2">
            {resolved.map(problem => (
              <div key={problem.id} className="p-3 bg-gray-50 rounded-lg flex items-center gap-3 opacity-60">
                <FiCheckCircle className="text-green-500" />
                <span className="line-through">{problem.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// МОДУЛЬ 4: ЧЕК-ЛИСТ ДОКУМЕНТОВ
// ============================================

function DocumentsModule({ 
  data,
  updateStages 
}: { 
  data: JourneyData
  updateStages: (updates: Partial<JourneyData['stages']>) => void
}) {
  const [checkedDocs, setCheckedDocs] = useState<string[]>([])

  const documents = [
    { id: 'attestat', name: 'Аттестат о среднем образовании', required: true, desc: 'Оригинал + 2 копии' },
    { id: 'id', name: 'Удостоверение личности', required: true, desc: 'Оригинал + 2 копии' },
    { id: 'photo', name: 'Фотографии 3x4', required: true, desc: '6 штук' },
    { id: 'med', name: 'Медицинская справка 086-У', required: true, desc: 'Из поликлиники' },
    { id: 'ent', name: 'Сертификат ЕНТ', required: true, desc: 'После сдачи ЕНТ' },
    { id: 'application', name: 'Заявление на поступление', required: true, desc: 'Бланк из приёмной комиссии' },
    { id: 'ielts', name: 'Сертификат IELTS/TOEFL', required: false, desc: 'Для англоязычных программ' },
    { id: 'olympiad', name: 'Дипломы олимпиад', required: false, desc: 'Республиканские, международные' },
    { id: 'portfolio', name: 'Портфолио достижений', required: false, desc: 'Грамоты, сертификаты' },
    { id: 'recommendation', name: 'Рекомендательные письма', required: false, desc: 'От учителей' },
  ]

  const toggleDoc = (id: string) => {
    setCheckedDocs(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    )
  }

  const requiredDocs = documents.filter(d => d.required)
  const optionalDocs = documents.filter(d => !d.required)
  const requiredComplete = requiredDocs.every(d => checkedDocs.includes(d.id))

  useEffect(() => {
    updateStages({ documentsReady: requiredComplete })
  }, [requiredComplete])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <FiFileText className="text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold">Чек-лист документов</h3>
          <p className="text-sm text-gray-500">
            Собрано: {checkedDocs.length} из {documents.length}
          </p>
        </div>
      </div>

      {/* Прогресс */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex justify-between text-sm mb-2">
          <span>Обязательные документы</span>
          <span className="font-medium">
            {checkedDocs.filter(id => requiredDocs.find(d => d.id === id)).length} / {requiredDocs.length}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all"
            style={{ width: `${(checkedDocs.filter(id => requiredDocs.find(d => d.id === id)).length / requiredDocs.length) * 100}%` }}
          />
        </div>
        {requiredComplete && (
          <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
            <FiCheckCircle /> Все обязательные документы собраны!
          </p>
        )}
      </div>

      {/* Обязательные */}
      <div>
        <h4 className="font-bold mb-3 text-red-600">🔴 Обязательные</h4>
        <div className="space-y-2">
          {requiredDocs.map(doc => (
            <label 
              key={doc.id}
              className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                checkedDocs.includes(doc.id) ? 'bg-green-50 border border-green-200' : 'bg-white border border-gray-200 hover:border-green-300'
              }`}
            >
              <input
                type="checkbox"
                checked={checkedDocs.includes(doc.id)}
                onChange={() => toggleDoc(doc.id)}
                className="mt-1 w-5 h-5 text-green-600 rounded"
              />
              <div className="flex-1">
                <div className={`font-medium ${checkedDocs.includes(doc.id) ? 'line-through text-gray-400' : ''}`}>
                  {doc.name}
                </div>
                <div className="text-sm text-gray-500">{doc.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Дополнительные */}
      <div>
        <h4 className="font-bold mb-3 text-blue-600">🔵 Дополнительные (для преимущества)</h4>
        <div className="space-y-2">
          {optionalDocs.map(doc => (
            <label 
              key={doc.id}
              className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                checkedDocs.includes(doc.id) ? 'bg-blue-50 border border-blue-200' : 'bg-white border border-gray-200 hover:border-blue-300'
              }`}
            >
              <input
                type="checkbox"
                checked={checkedDocs.includes(doc.id)}
                onChange={() => toggleDoc(doc.id)}
                className="mt-1 w-5 h-5 text-blue-600 rounded"
              />
              <div className="flex-1">
                <div className={`font-medium ${checkedDocs.includes(doc.id) ? 'line-through text-gray-400' : ''}`}>
                  {doc.name}
                </div>
                <div className="text-sm text-gray-500">{doc.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================
// МОДУЛЬ 5: ТРЕКЕР ПРОГРЕССА
// ============================================

function TrackerModule({ data }: { data: JourneyData }) {
  const stages = [
    { 
      id: 'profile', 
      title: 'Профиль заполнен', 
      done: !!(data.profile.entScore && data.profile.targetField),
      icon: '👤'
    },
    { 
      id: 'universities', 
      title: 'Изучены университеты', 
      done: data.stages.universitiesExplored >= 3,
      icon: '🏛️',
      progress: `${data.stages.universitiesExplored}/3`
    },
    { 
      id: 'documents', 
      title: 'Документы собраны', 
      done: data.stages.documentsReady,
      icon: '📄'
    },
    { 
      id: 'ent', 
      title: 'ЕНТ сдан', 
      done: data.stages.entPassed,
      icon: '🎯'
    },
    { 
      id: 'application', 
      title: 'Заявка подана', 
      done: data.stages.applicationSent,
      icon: '📨'
    },
  ]

  const completedStages = stages.filter(s => s.done).length
  const problems = data.problems.filter(p => !p.resolved)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <FiTrendingUp className="text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold">Трекер прогресса</h3>
          <p className="text-sm text-gray-500">Ваш путь к поступлению</p>
        </div>
      </div>

      {/* Общая статистика */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
          <div className="text-3xl font-bold text-blue-600">{completedStages}/{stages.length}</div>
          <div className="text-sm text-gray-500">Этапов пройдено</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
          <div className="text-3xl font-bold text-green-600">{data.profile.entScore || '—'}</div>
          <div className="text-sm text-gray-500">Балл ЕНТ</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
          <div className="text-3xl font-bold text-red-600">{problems.length}</div>
          <div className="text-sm text-gray-500">Проблем</div>
        </div>
      </div>

      {/* Этапы */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h4 className="font-bold mb-4">Этапы поступления</h4>
        <div className="space-y-3">
          {stages.map((stage, index) => (
            <div key={stage.id} className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                stage.done ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                {stage.done ? '✅' : stage.icon}
              </div>
              <div className="flex-1">
                <div className={`font-medium ${stage.done ? 'text-green-700' : 'text-gray-700'}`}>
                  {stage.title}
                </div>
                {stage.progress && !stage.done && (
                  <div className="text-sm text-gray-400">{stage.progress}</div>
                )}
              </div>
              {stage.done && <FiCheckCircle className="text-green-500" />}
            </div>
          ))}
        </div>
      </div>

      {/* Профиль */}
      <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl p-5">
        <h4 className="font-bold mb-3">📋 Ваш профиль</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-white rounded-lg p-3">
            <div className="text-gray-500">Направление</div>
            <div className="font-medium">{data.profile.targetField || 'Не указано'}</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="text-gray-500">Город</div>
            <div className="font-medium">{data.profile.targetCity || 'Не указан'}</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="text-gray-500">ЕНТ</div>
            <div className="font-medium">{data.profile.entScore || 'Не указан'}</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="text-gray-500">Бюджет</div>
            <div className="font-medium">{data.profile.budget || 'Не указан'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

