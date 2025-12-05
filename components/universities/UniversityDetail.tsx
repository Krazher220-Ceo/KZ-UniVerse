'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FiStar, FiMapPin, FiUsers, FiGlobe, FiPhone, FiMail, FiExternalLink, FiHeart, FiShare2 } from 'react-icons/fi'
import { University, Program } from '@/types'

interface Props {
  university: University
  programs: Program[]
}

type TabType = 'about' | 'programs' | 'international' | 'admission' | 'tour'

export default function UniversityDetail({ university, programs }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>('about')
  const [isFavorite, setIsFavorite] = useState(false)

  const tabs = [
    { id: 'about', label: '📖 О университете', icon: '📖' },
    { id: 'programs', label: '📚 Программы', icon: '📚' },
    { id: 'international', label: '🌍 Международное сотрудничество', icon: '🌍' },
    { id: 'admission', label: '📝 Поступление', icon: '📝' },
    { id: 'tour', label: '🏛️ 3D-тур', icon: '🏛️' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover image */}
      <div className="relative h-[400px] bg-gradient-to-br from-primary-600 to-secondary-600">
        <Image
          src={university.cover}
          alt={university.name}
          fill
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-8">
          <div className="flex items-end space-x-6">
            <Image
              src={university.logo}
              alt={university.shortName}
              width={120}
              height={120}
              className="rounded-2xl border-4 border-white shadow-xl"
            />
            <div className="flex-1 text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{university.name}</h1>
              <p className="text-xl text-gray-200 mb-4">{university.nameKz}</p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <FiStar className="text-yellow-400" />
                  <span className="font-bold">{university.rating}</span>
                  <span>рейтинг</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <span className="font-bold">
                    {university.type === 'national' ? '🏛️ Национальный' : 
                     university.type === 'state' ? '🏫 Государственный' : 
                     '💼 Частный'}
                  </span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <FiMapPin />
                  <span>{university.city}</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <FiUsers />
                  <span>{university.students.toLocaleString()} студентов</span>
                </div>
                {university.worldRank && (
                  <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <FiGlobe />
                    <span>#{university.worldRank} в мире</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions bar */}
      <div className="sticky top-0 z-40 glass-effect border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex space-x-2 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-3 rounded-lg transition-all ${
                  isFavorite ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FiHeart className={isFavorite ? 'fill-current' : ''} />
              </button>
              <button className="p-3 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all">
                <FiShare2 />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {activeTab === 'about' && <AboutTab university={university} />}
            {activeTab === 'programs' && <ProgramsTab programs={programs} university={university} />}
            {activeTab === 'international' && <InternationalTab university={university} />}
            {activeTab === 'admission' && <AdmissionTab university={university} />}
            {activeTab === 'tour' && <TourTab university={university} />}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar university={university} />
          </div>
        </div>
      </div>
    </div>
  )
}

function AboutTab({ university }: { university: University }) {
  return (
    <div className="glass-effect rounded-2xl p-8 space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">О университете</h2>
        <p className="text-gray-700 leading-relaxed">{university.description}</p>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-3">Миссия</h3>
        <p className="text-gray-700 leading-relaxed">{university.mission}</p>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-3">Достижения</h3>
        <ul className="space-y-2">
          {university.achievements.map((achievement, i) => (
            <li key={i} className="flex items-start space-x-3">
              <span className="text-primary-500 mt-1">✓</span>
              <span className="text-gray-700">{achievement}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-3">Инфраструктура</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {university.infrastructure.map((item, i) => (
            <div key={i} className="flex items-start space-x-2 p-3 bg-gray-50 rounded-lg">
              <span className="text-secondary-500">●</span>
              <span className="text-gray-700 text-sm">{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-3">Основные факты</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-primary-50 rounded-lg">
            <div className="text-3xl font-bold text-primary-600">{university.founded}</div>
            <div className="text-sm text-gray-600">Год основания</div>
          </div>
          <div className="p-4 bg-secondary-50 rounded-lg">
            <div className="text-3xl font-bold text-secondary-600">{university.students.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Студентов</div>
          </div>
          <div className="p-4 bg-accent-50 rounded-lg">
            <div className="text-3xl font-bold text-accent-600">{university.internationalStudents}%</div>
            <div className="text-sm text-gray-600">Иностранные студенты</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">{university.rating}</div>
            <div className="text-sm text-gray-600">Рейтинг</div>
          </div>
        </div>
      </section>
    </div>
  )
}

function ProgramsTab({ programs, university }: { programs: Program[], university: University }) {
  const [selectedField, setSelectedField] = useState<string>('all')
  
  const fields = Array.from(new Set(programs.map(p => p.field)))
  const filteredPrograms = selectedField === 'all' 
    ? programs 
    : programs.filter(p => p.field === selectedField)

  return (
    <div className="glass-effect rounded-2xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Академические программы</h2>
        <select
          value={selectedField}
          onChange={(e) => setSelectedField(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg"
        >
          <option value="all">Все направления</option>
          {fields.map(field => (
            <option key={field} value={field}>{field}</option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {filteredPrograms.map(program => (
          <div key={program.id} className="p-6 bg-white rounded-xl border border-gray-100 hover:border-primary-200 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold">{program.nameRu}</h3>
                <p className="text-sm text-gray-500">{program.name}</p>
              </div>
              <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
                {program.field}
              </span>
            </div>

            <p className="text-gray-600 text-sm mb-4">{program.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Степень:</span>
                <p className="font-semibold">{program.degree}</p>
              </div>
              <div>
                <span className="text-gray-500">Длительность:</span>
                <p className="font-semibold">{program.duration} года</p>
              </div>
              <div>
                <span className="text-gray-500">Стоимость:</span>
                <p className="font-semibold text-primary-600">
                  {(program.tuitionPerYear / 1000000).toFixed(1)}M₸/год
                </p>
              </div>
              <div>
                <span className="text-gray-500">Трудоустройство:</span>
                <p className="font-semibold text-green-600">{program.employmentRate}%</p>
              </div>
            </div>

            {program.scholarship && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <span className="text-xs text-green-600">✓ Доступна стипендия</span>
                {program.grantAvailable && <span className="text-xs text-green-600 ml-3">✓ Доступны гранты</span>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function InternationalTab({ university }: { university: University }) {
  return (
    <div className="glass-effect rounded-2xl p-8">
      <h2 className="text-2xl font-bold mb-6">Международное сотрудничество</h2>
      
      <section className="mb-8">
        <h3 className="text-xl font-bold mb-4">Партнерские программы</h3>
        <p className="text-gray-700 mb-4">
          {university.name} активно сотрудничает с ведущими университетами мира, предлагая студентам уникальные возможности для международного обмена и получения двойных дипломов.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-bold mb-2">🔄 Программы обмена</h4>
            <p className="text-sm text-gray-600">Семестровые и годовые программы в партнерских университетах</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-bold mb-2">🎓 Двойные дипломы</h4>
            <p className="text-sm text-gray-600">Получите степень сразу двух университетов</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-bold mb-2">🔬 Совместные исследования</h4>
            <p className="text-sm text-gray-600">Участвуйте в международных научных проектах</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <h4 className="font-bold mb-2">☀️ Летние школы</h4>
            <p className="text-sm text-gray-600">Краткосрочные программы в ведущих вузах мира</p>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-4">Процент иностранных студентов</h3>
        <div className="p-6 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-4xl font-bold text-primary-600">{university.internationalStudents}%</span>
            <span className="text-gray-600">международных студентов</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full"
              style={{ width: `${university.internationalStudents}%` }}
            ></div>
          </div>
        </div>
      </section>
    </div>
  )
}

function AdmissionTab({ university }: { university: University }) {
  return (
    <div className="glass-effect rounded-2xl p-8">
      <h2 className="text-2xl font-bold mb-6">Поступление</h2>
      
      <section className="mb-8">
        <h3 className="text-xl font-bold mb-4">Процесс поступления</h3>
        <div className="space-y-4">
          {[
            { step: 1, title: 'Подготовка к ЕНТ', desc: 'Сдайте Единое Национальное Тестирование (обычно в июне-июле)' },
            { step: 2, title: 'Сбор документов', desc: 'Подготовьте аттестат, удостоверение личности, фотографии' },
            { step: 3, title: 'Подача заявления', desc: 'Подайте документы онлайн или лично в приемную комиссию' },
            { step: 4, title: 'Собеседование', desc: 'Пройдите собеседование (для некоторых специальностей)' },
            { step: 5, title: 'Зачисление', desc: 'Получите результаты и оформите документы для зачисления' },
          ].map(item => (
            <div key={item.step} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                {item.step}
              </div>
              <div>
                <h4 className="font-bold mb-1">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-bold mb-4">Важные даты</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border-l-4 border-primary-500 bg-gray-50">
            <div className="text-sm text-gray-500">Прием документов</div>
            <div className="font-bold">1 июля - 20 августа</div>
          </div>
          <div className="p-4 border-l-4 border-secondary-500 bg-gray-50">
            <div className="text-sm text-gray-500">Зачисление</div>
            <div className="font-bold">25 августа</div>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-4">Контакты приемной комиссии</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <FiPhone className="text-primary-500" size={24} />
            <div>
              <div className="text-sm text-gray-500">Телефон</div>
              <a href={`tel:${university.phone}`} className="font-semibold hover:text-primary-600">
                {university.phone}
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <FiMail className="text-primary-500" size={24} />
            <div>
              <div className="text-sm text-gray-500">Email</div>
              <a href={`mailto:${university.email}`} className="font-semibold hover:text-primary-600">
                {university.email}
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <FiMapPin className="text-primary-500" size={24} />
            <div>
              <div className="text-sm text-gray-500">Адрес</div>
              <div className="font-semibold">{university.address}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function TourTab({ university }: { university: University }) {
  return (
    <div className="glass-effect rounded-2xl p-8">
      <h2 className="text-2xl font-bold mb-6">3D-тур по кампусу</h2>
      
      {university.tour3D ? (
        <div className="space-y-6">
          <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden">
            <iframe
              src={university.tour3D}
              className="w-full h-full"
              allow="fullscreen; gyroscope; accelerometer"
            />
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              💡 <strong>Совет:</strong> Используйте мышь или сенсорный экран для навигации по кампусу. 
              Нажмите на точки интереса, чтобы узнать больше о помещениях и инфраструктуре.
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🏛️</div>
          <h3 className="text-2xl font-bold mb-2">3D-тур скоро будет доступен</h3>
          <p className="text-gray-600 mb-6">
            Мы работаем над созданием интерактивного тура по кампусу {university.shortName}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-gray-50 rounded-xl">
              <h4 className="font-bold mb-2">📸 Фотогалерея</h4>
              <p className="text-sm text-gray-600">Смотрите фотографии кампуса на официальном сайте</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl">
              <h4 className="font-bold mb-2">📅 Экскурсия</h4>
              <p className="text-sm text-gray-600">Запишитесь на очную экскурсию по университету</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Sidebar({ university }: { university: University }) {
  return (
    <div className="space-y-6 sticky top-32">
      {/* Quick info */}
      <div className="glass-effect rounded-2xl p-6">
        <h3 className="font-bold mb-4">Быстрая информация</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Стоимость от:</span>
            <span className="font-bold text-primary-600">
              {(university.tuitionRange.min / 1000000).toFixed(1)}M₸
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Общежитие:</span>
            <span className="font-bold">{university.dormitory ? 'Есть' : 'Нет'}</span>
          </div>
          {university.dormitory && university.dormitoryCost && (
            <div className="flex justify-between">
              <span className="text-gray-500">Стоимость общежития:</span>
              <span className="font-bold">{university.dormitoryCost.toLocaleString()}₸/мес</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="glass-effect rounded-2xl p-6 space-y-3">
        <a href={university.website} target="_blank" rel="noopener noreferrer">
          <button className="w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center space-x-2">
            <span>Официальный сайт</span>
            <FiExternalLink />
          </button>
        </a>
        <Link href="/compare">
          <button className="w-full px-6 py-3 border-2 border-primary-500 text-primary-600 rounded-lg hover:bg-primary-50 transition-all">
            Добавить к сравнению
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div className="glass-effect rounded-2xl p-6">
        <h3 className="font-bold mb-4">Статистика просмотров</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Просмотры:</span>
            <span className="font-bold">{university.stats.views.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Избранное:</span>
            <span className="font-bold">{university.stats.favorites.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">3D-тур:</span>
            <span className="font-bold">{university.stats.tour3DClicks.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Social */}
      {Object.keys(university.socialMedia).length > 0 && (
        <div className="glass-effect rounded-2xl p-6">
          <h3 className="font-bold mb-4">Социальные сети</h3>
          <div className="flex space-x-3">
            {university.socialMedia.facebook && (
              <a href={university.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:shadow-lg transition-all">
                f
              </a>
            )}
            {university.socialMedia.instagram && (
              <a href={university.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-lg flex items-center justify-center hover:shadow-lg transition-all">
                IG
              </a>
            )}
            {university.socialMedia.youtube && (
              <a href={university.socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-red-600 text-white rounded-lg flex items-center justify-center hover:shadow-lg transition-all">
                YT
              </a>
            )}
            {university.socialMedia.telegram && (
              <a href={university.socialMedia.telegram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:shadow-lg transition-all">
                TG
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

