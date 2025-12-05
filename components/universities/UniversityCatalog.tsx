'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { FiStar, FiMapPin, FiUsers, FiDollarSign, FiFilter } from 'react-icons/fi'
import universitiesData from '@/data/universities.json'
import { University, SearchFilters } from '@/types'

export default function UniversityCatalog() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const initialField = searchParams.get('field') as any || undefined

  const [filters, setFilters] = useState<SearchFilters>({
    query: initialQuery,
    field: initialField,
    sortBy: 'rating'
  })
  const [showFilters, setShowFilters] = useState(false)

  const filteredUniversities = useMemo(() => {
    let result = [...universitiesData] as University[]

    // Search query
    if (filters.query) {
      const query = filters.query.toLowerCase()
      result = result.filter(uni =>
        uni.name.toLowerCase().includes(query) ||
        uni.nameKz.toLowerCase().includes(query) ||
        uni.city.toLowerCase().includes(query) ||
        uni.description.toLowerCase().includes(query)
      )
    }

    // City filter
    if (filters.city) {
      result = result.filter(uni => uni.city === filters.city)
    }

    // Rating filter
    if (filters.minRating) {
      result = result.filter(uni => uni.rating >= filters.minRating!)
    }

    // Tuition filter
    if (filters.maxTuition) {
      result = result.filter(uni => uni.tuitionRange.min <= filters.maxTuition!)
    }

    // Dormitory filter
    if (filters.hasDormitory) {
      result = result.filter(uni => uni.dormitory)
    }

    // Sorting
    if (filters.sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating)
    } else if (filters.sortBy === 'tuition-asc') {
      result.sort((a, b) => a.tuitionRange.min - b.tuitionRange.min)
    } else if (filters.sortBy === 'tuition-desc') {
      result.sort((a, b) => b.tuitionRange.min - a.tuitionRange.min)
    } else if (filters.sortBy === 'popularity') {
      result.sort((a, b) => b.stats.views - a.stats.views)
    } else if (filters.sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name))
    }

    return result
  }, [filters])

  const cities = Array.from(new Set(universitiesData.map(u => u.city)))

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Filters sidebar */}
      <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
        <div className="glass-effect rounded-2xl p-6 sticky top-24">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center space-x-2">
              <FiFilter />
              <span>Фильтры</span>
            </h2>
            <button
              onClick={() => setFilters({ sortBy: 'rating' })}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Сбросить
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Поиск</label>
            <input
              type="text"
              value={filters.query || ''}
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
              placeholder="Название, город..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-primary-500"
            />
          </div>

          {/* City */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Город</label>
            <select
              value={filters.city || ''}
              onChange={(e) => setFilters({ ...filters, city: e.target.value || undefined })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-primary-500"
            >
              <option value="">Все города</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Rating */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Минимальный рейтинг: {filters.minRating || 0}
            </label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={filters.minRating || 0}
              onChange={(e) => setFilters({ ...filters, minRating: parseFloat(e.target.value) || undefined })}
              className="w-full"
            />
          </div>

          {/* Max Tuition */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Максимальная стоимость: {filters.maxTuition ? `${(filters.maxTuition / 1000000).toFixed(1)}M₸` : 'Любая'}
            </label>
            <input
              type="range"
              min="0"
              max="3500000"
              step="100000"
              value={filters.maxTuition || 3500000}
              onChange={(e) => setFilters({ ...filters, maxTuition: parseInt(e.target.value) || undefined })}
              className="w-full"
            />
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.hasDormitory || false}
                onChange={(e) => setFilters({ ...filters, hasDormitory: e.target.checked || undefined })}
                className="w-4 h-4 text-primary-600"
              />
              <span className="text-sm">Есть общежитие</span>
            </label>
          </div>

          {/* Sort */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <label className="block text-sm font-medium mb-2">Сортировка</label>
            <select
              value={filters.sortBy || 'rating'}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-primary-500"
            >
              <option value="rating">По рейтингу</option>
              <option value="popularity">По популярности</option>
              <option value="tuition-asc">Сначала дешевые</option>
              <option value="tuition-desc">Сначала дорогие</option>
              <option value="name">По названию</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1">
        {/* Mobile filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden w-full mb-4 px-6 py-3 bg-white rounded-lg shadow-md flex items-center justify-center space-x-2"
        >
          <FiFilter />
          <span>Фильтры</span>
        </button>

        {/* Results count */}
        <div className="mb-6 text-gray-600">
          Найдено университетов: <span className="font-bold text-gray-900">{filteredUniversities.length}</span>
        </div>

        {/* University grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredUniversities.map(uni => (
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
                    <div>
                      <h3 className="font-bold text-lg">{uni.shortName}</h3>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <FiMapPin size={12} />
                        <span>{uni.city}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {uni.description}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 flex items-center space-x-1">
                        <FiUsers size={16} />
                        <span>Студентов:</span>
                      </span>
                      <span className="font-semibold">{uni.students.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 flex items-center space-x-1">
                        <FiDollarSign size={16} />
                        <span>От:</span>
                      </span>
                      <span className="font-semibold text-primary-600">
                        {(uni.tuitionRange.min / 1000000).toFixed(1)}M₸/год
                      </span>
                    </div>
                  </div>

                  {uni.worldRank && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
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

        {filteredUniversities.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">Ничего не найдено</h3>
            <p className="text-gray-600 mb-6">Попробуйте изменить параметры фильтров</p>
            <button
              onClick={() => setFilters({ sortBy: 'rating' })}
              className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:shadow-lg transition-all"
            >
              Сбросить фильтры
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

