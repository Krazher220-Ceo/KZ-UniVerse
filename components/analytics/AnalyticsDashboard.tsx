'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { FiTrendingUp, FiEye, FiHeart, FiUsers } from 'react-icons/fi'
import universitiesData from '@/data/universities.json'
import programsData from '@/data/programs.json'
import { formatNumber } from '@/lib/format'

const COLORS = ['#0066FF', '#00C9A7', '#FF6B35', '#9B59B6', '#F39C12', '#3498DB']

export default function AnalyticsDashboard() {
  const totalViews = useMemo(() => 
    universitiesData.reduce((sum, uni) => sum + uni.stats.views, 0)
  , [])

  const totalFavorites = useMemo(() => 
    universitiesData.reduce((sum, uni) => sum + uni.stats.favorites, 0)
  , [])

  const totalTourClicks = useMemo(() => 
    universitiesData.reduce((sum, uni) => sum + uni.stats.tour3DClicks, 0)
  , [])

  // Top universities by views
  const topUniversities = useMemo(() => 
    [...universitiesData]
      .sort((a, b) => b.stats.views - a.stats.views)
      .slice(0, 10)
      .map(uni => ({
        name: uni.shortName,
        views: uni.stats.views,
        favorites: uni.stats.favorites,
        logo: uni.logo
      }))
  , [])

  // Programs by field
  const programsByField = useMemo(() => {
    const fields: { [key: string]: number } = {}
    programsData.forEach(program => {
      fields[program.field] = (fields[program.field] || 0) + 1
    })
    return Object.entries(fields).map(([name, value]) => ({ name, value }))
  }, [])

  // Universities by city
  const universitiesByCity = useMemo(() => {
    const cities: { [key: string]: number } = {}
    universitiesData.forEach(uni => {
      cities[uni.city] = (cities[uni.city] || 0) + 1
    })
    return Object.entries(cities).map(([name, value]) => ({ name, value }))
  }, [])

  // Average tuition by city
  const avgTuitionByCity = useMemo(() => {
    const cityData: { [key: string]: { sum: number, count: number } } = {}
    universitiesData.forEach(uni => {
      if (!cityData[uni.city]) {
        cityData[uni.city] = { sum: 0, count: 0 }
      }
      cityData[uni.city].sum += uni.tuitionRange.min
      cityData[uni.city].count += 1
    })
    return Object.entries(cityData).map(([name, data]) => ({
      city: name,
      avgTuition: Math.round(data.sum / data.count / 1000000 * 10) / 10
    }))
  }, [])

  return (
    <div className="space-y-8">
      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-effect rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary-100 rounded-lg">
              <FiEye className="text-primary-600" size={24} />
            </div>
            <span className="text-xs text-green-600 flex items-center">
              <FiTrendingUp size={12} className="mr-1" />
              +24%
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {formatNumber(totalViews)}
          </div>
          <div className="text-sm text-gray-600">Всего просмотров</div>
        </div>

        <div className="glass-effect rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-secondary-100 rounded-lg">
              <FiHeart className="text-secondary-600" size={24} />
            </div>
            <span className="text-xs text-green-600 flex items-center">
              <FiTrendingUp size={12} className="mr-1" />
              +18%
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {formatNumber(totalFavorites)}
          </div>
          <div className="text-sm text-gray-600">В избранном</div>
        </div>

        <div className="glass-effect rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-accent-100 rounded-lg">
              <FiUsers className="text-accent-600" size={24} />
            </div>
            <span className="text-xs text-green-600 flex items-center">
              <FiTrendingUp size={12} className="mr-1" />
              +32%
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {formatNumber(totalTourClicks)}
          </div>
          <div className="text-sm text-gray-600">3D-туры</div>
        </div>

        <div className="glass-effect rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-green-600 text-2xl">🎓</span>
            </div>
            <span className="text-xs text-green-600 flex items-center">
              <FiTrendingUp size={12} className="mr-1" />
              +12%
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {universitiesData.length}
          </div>
          <div className="text-sm text-gray-600">Университетов</div>
        </div>
      </div>

      {/* Top universities chart */}
      <div className="glass-effect rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-6">Топ университетов по просмотрам</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={topUniversities}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="views" name="Просмотры" fill="#0066FF" />
            <Bar dataKey="favorites" name="Избранное" fill="#00C9A7" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Programs by field */}
        <div className="glass-effect rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-6">Программы по направлениям</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={programsByField}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {programsByField.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Universities by city */}
        <div className="glass-effect rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-6">Университеты по городам</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={universitiesByCity}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} (${value})`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {universitiesByCity.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Average tuition by city */}
      <div className="glass-effect rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-6">Средняя стоимость обучения по городам</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={avgTuitionByCity}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="city" />
            <YAxis label={{ value: 'млн ₸', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Bar dataKey="avgTuition" name="Средняя стоимость" fill="#FF6B35" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top universities cards */}
      <div className="glass-effect rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-6">Детальная статистика</h2>
        <div className="space-y-4">
          {topUniversities.map((uni, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <Image
                  src={uni.logo}
                  alt={uni.name}
                  width={48}
                  height={48}
                  className="rounded-lg"
                />
                <div>
                  <h3 className="font-bold">{uni.name}</h3>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <div className="font-bold text-primary-600">{formatNumber(uni.views)}</div>
                  <div className="text-gray-500">просмотров</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-secondary-600">{formatNumber(uni.favorites)}</div>
                  <div className="text-gray-500">в избранном</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="glass-effect rounded-2xl p-6 bg-gradient-to-br from-primary-50 to-secondary-50">
        <h2 className="text-2xl font-bold mb-4">🔮 Прогнозы и инсайты</h2>
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-lg">
            <h3 className="font-bold mb-2">📈 Растущий тренд</h3>
            <p className="text-gray-700">IT-программы показывают рост интереса на 45% по сравнению с прошлым годом. AITU и МУИТ лидируют по количеству запросов.</p>
          </div>
          <div className="p-4 bg-white rounded-lg">
            <h3 className="font-bold mb-2">🌍 География</h3>
            <p className="text-gray-700">70% пользователей из Алматы и Астаны. Растет интерес из регионов, особенно из Шымкента и Караганды.</p>
          </div>
          <div className="p-4 bg-white rounded-lg">
            <h3 className="font-bold mb-2">💰 Стоимость</h3>
            <p className="text-gray-700">Средний бюджет студентов составляет 1.5-2 млн₸ в год. Растет интерес к программам с грантами и стипендиями.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

