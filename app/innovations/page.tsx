import { Suspense } from 'react'
import AdmissionJourney from '@/components/innovations/AdmissionJourney'
import Link from 'next/link'

export const metadata = {
  title: 'Путь абитуриента | KZ UniVerse',
  description: 'Интегрированная система подготовки к поступлению: диагностика, планировщик, анализ рисков, документы',
}

export default function InnovationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full text-indigo-700 text-sm font-medium mb-4">
            <span>🎓</span>
            <span>Интегрированная система поступления</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Путь абитуриента</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Единая экосистема для подготовки к поступлению. Все модули связаны между собой: 
            диагностика выявляет проблемы → анализ рисков предлагает решения → 
            планировщик следит за дедлайнами → трекер показывает прогресс.
          </p>
        </div>

        {/* Проблемы которые решаем */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center mb-6">❓ Какие проблемы мы решаем</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-red-100">
              <div className="text-3xl mb-3">😰</div>
              <h3 className="font-bold text-gray-900 mb-2">Не знаю с чего начать</h3>
              <p className="text-sm text-gray-600">
                Диагностика оценит вашу готовность и покажет первые шаги
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-yellow-100">
              <div className="text-3xl mb-3">📅</div>
              <h3 className="font-bold text-gray-900 mb-2">Пропускаю дедлайны</h3>
              <p className="text-sm text-gray-600">
                Планировщик напомнит о важных датах заранее
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-blue-100">
              <div className="text-3xl mb-3">📄</div>
              <h3 className="font-bold text-gray-900 mb-2">Какие документы нужны?</h3>
              <p className="text-sm text-gray-600">
                Чек-лист документов с подсказками что и где получить
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-green-100">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-bold text-gray-900 mb-2">Хватит ли баллов?</h3>
              <p className="text-sm text-gray-600">
                Анализ рисков покажет ваши шансы и как их улучшить
              </p>
            </div>
          </div>
        </div>

        {/* Как это работает */}
        <div className="mb-8 bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-center mb-6">🔄 Как модули связаны между собой</h2>
          <div className="flex flex-wrap justify-center items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-xl">🔍</span>
              </div>
              <span className="font-medium">Диагностика</span>
            </div>
            <span className="text-2xl text-gray-300">→</span>
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-xl">⚠️</span>
              </div>
              <span className="font-medium">Выявление рисков</span>
            </div>
            <span className="text-2xl text-gray-300">→</span>
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-xl">📅</span>
              </div>
              <span className="font-medium">Планирование</span>
            </div>
            <span className="text-2xl text-gray-300">→</span>
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-xl">📄</span>
              </div>
              <span className="font-medium">Документы</span>
            </div>
            <span className="text-2xl text-gray-300">→</span>
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
              <span className="font-medium">Трекер</span>
            </div>
          </div>
          <p className="text-center text-gray-500 text-sm mt-4">
            Данные из одного модуля автоматически используются в других. 
            Например, ваш балл ЕНТ влияет на рекомендации университетов и анализ рисков.
          </p>
        </div>

        {/* Main Content - Admission Journey */}
        <Suspense fallback={
          <div className="animate-pulse bg-gray-200 h-[600px] rounded-2xl"></div>
        }>
          <AdmissionJourney />
        </Suspense>

        {/* Дополнительные ресурсы */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/universities" className="block">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white hover:shadow-xl transition-all">
              <div className="text-3xl mb-3">🏛️</div>
              <h3 className="text-xl font-bold mb-2">Каталог университетов</h3>
              <p className="text-blue-100 text-sm">
                Изучите все вузы Казахстана с фильтрами и сравнением
              </p>
            </div>
          </Link>
          
          <Link href="/compare" className="block">
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white hover:shadow-xl transition-all">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="text-xl font-bold mb-2">Сравнение вузов</h3>
              <p className="text-purple-100 text-sm">
                Сравните до 3 университетов по всем параметрам
              </p>
            </div>
          </Link>
          
          <Link href="/profile" className="block">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white hover:shadow-xl transition-all">
              <div className="text-3xl mb-3">👤</div>
              <h3 className="text-xl font-bold mb-2">Мой профиль</h3>
              <p className="text-green-100 text-sm">
                Заполните портфолио для персонализированных рекомендаций
              </p>
            </div>
          </Link>
        </div>

        {/* FAQ */}
        <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-center mb-6">❓ Частые вопросы</h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            <details className="group">
              <summary className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <span className="font-medium">Как получить государственный грант?</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="p-4 text-gray-600">
                Для получения гранта нужно: 1) Сдать ЕНТ с высоким баллом (обычно от 100+), 
                2) Подать заявку через egov.kz в июле, 3) Выбрать специальность из списка грантовых. 
                Гранты распределяются по конкурсу — чем выше балл, тем больше шансов.
              </div>
            </details>
            
            <details className="group">
              <summary className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <span className="font-medium">Когда сдавать ЕНТ?</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="p-4 text-gray-600">
                Основной ЕНТ проводится в июне (обычно 20-25 июня). 
                Регистрация открывается в апреле через testcenter.kz. 
                Также есть дополнительные волны в августе.
              </div>
            </details>
            
            <details className="group">
              <summary className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <span className="font-medium">Нужен ли IELTS для поступления?</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="p-4 text-gray-600">
                IELTS обязателен для англоязычных программ (NU, KIMEP, некоторые программы AITU и КБТУ). 
                Минимальный балл обычно 5.5-6.5 в зависимости от вуза. 
                Для программ на русском/казахском IELTS не требуется.
              </div>
            </details>
            
            <details className="group">
              <summary className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <span className="font-medium">Можно ли поступить без ЕНТ?</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="p-4 text-gray-600">
                Некоторые вузы (NU, KIMEP, частично AITU) проводят собственные вступительные экзамены. 
                Также освобождаются победители республиканских олимпиад. 
                Для большинства государственных вузов ЕНТ обязателен.
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  )
}
