import Link from 'next/link'
import Image from 'next/image'
import { FiStar, FiMapPin, FiUsers, FiArrowRight } from 'react-icons/fi'
import universitiesData from '@/data/universities.json'
import { University } from '@/types'
import { formatNumber } from '@/lib/format'

// Функция для расчета приоритета университета
function calculatePriority(uni: University): number {
  let priority = 0

  // Проверяем логотип (есть реальный логотип, не placeholder)
  const hasRealLogo = uni.logo && 
    !uni.logo.includes('placehold.co') && 
    !uni.logo.includes('unsplash.com')
  if (hasRealLogo) priority += 100

  // Проверяем баннер (есть реальный баннер, не placeholder и не unsplash)
  const hasRealCover = uni.cover && 
    !uni.cover.includes('placehold.co') && 
    !uni.cover.includes('unsplash.com')
  if (hasRealCover) priority += 100

  // Количество информации
  if (uni.description && uni.description.length > 200) priority += 20
  if (uni.mission) priority += 10
  if (uni.vision) priority += 10
  if (uni.history) priority += 10
  if (uni.achievements && uni.achievements.length > 0) priority += uni.achievements.length * 2
  if (uni.faculties && Array.isArray(uni.faculties) && uni.faculties.length > 0) priority += uni.faculties.length * 2
  if (uni.partners && Array.isArray(uni.partners) && uni.partners.length > 0) priority += uni.partners.length * 2
  if (uni.researchAreas && uni.researchAreas.length > 0) priority += uni.researchAreas.length * 2
  if (uni.tour3D && uni.tour3D.length > 0) priority += 30
  if (uni.coordinates) priority += 10
  if (uni.worldRank) priority += 15
  if (uni.rankings) priority += 10

  // Бонус за инфраструктуру
  if (uni.infrastructure && typeof uni.infrastructure === 'object') {
    const infra = uni.infrastructure as any
    if (infra.dormitories?.available) priority += 5
    if (infra.library) priority += 5
    if (infra.laboratories?.total > 0) priority += 5
    if (infra.sports) priority += 5
  }

  return priority
}

export default function TopUniversities() {
  const topUniversities = universitiesData
    .sort((a, b) => {
      // Сначала по приоритету (логотипы, баннеры, полная информация)
      const priorityA = calculatePriority(a as University)
      const priorityB = calculatePriority(b as University)
      if (priorityB !== priorityA) {
        return priorityB - priorityA
      }
      // Затем по рейтингу
      return b.rating - a.rating
    })
    .slice(0, 6)

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Топ университеты <span className="gradient-text">Казахстана</span>
          </h2>
          <p className="text-xl text-gray-600">
            Лучшие высшие учебные заведения по рейтингу и качеству образования
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topUniversities.map((uni) => (
            <Link key={uni.id} href={`/universities/${uni.id}`}>
              <div className="glass-effect rounded-2xl overflow-hidden card-hover cursor-pointer h-full">
                <div className="relative h-48 bg-gradient-to-br from-primary-100 to-secondary-100">
                  <Image
                    src={uni.cover}
                    alt={uni.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1">
                    <FiStar className="text-yellow-500" />
                    <span className="font-bold">{uni.rating}</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <Image
                      src={uni.logo}
                      alt={uni.shortName}
                      width={48}
                      height={48}
                      className="rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg">{uni.shortName}</h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-primary-100 text-primary-700">
                          {uni.type === 'national' ? '🏛️' : uni.type === 'state' ? '🏫' : '💼'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <FiMapPin size={12} />
                        <span>{uni.city}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {uni.description}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1 text-gray-500">
                      <FiUsers size={16} />
                      <span>{formatNumber(uni.students)} студентов</span>
                    </div>
                    <div className="text-primary-600 font-semibold flex items-center space-x-1">
                      <span>Узнать больше</span>
                      <FiArrowRight />
                    </div>
                  </div>

                  {uni.worldRank && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        🌍 {uni.worldRank} место в мире
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/universities">
            <button className="px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl hover:shadow-xl transition-all text-lg font-semibold">
              Смотреть все университеты
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}

