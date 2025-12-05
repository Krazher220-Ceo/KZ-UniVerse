'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiMapPin, FiStar, FiUsers, FiExternalLink, FiFilter, FiX } from 'react-icons/fi'

interface UniversityMapData {
  id: string
  name: string
  shortName: string
  city: string
  region: string
  rating: number
  students: number
  type: 'national' | 'state' | 'private'
  logo: string
  coordinates: {
    lat: number
    lng: number
  }
}

// Данные университетов с координатами
const UNIVERSITIES_MAP_DATA: UniversityMapData[] = [
  { id: 'nu', name: 'Nazarbayev University', shortName: 'NU', city: 'Астана', region: 'Астана', rating: 4.9, students: 7089, type: 'national', logo: 'https://placehold.co/100x100/0066FF/white?text=NU', coordinates: { lat: 51.0905, lng: 71.3977 } },
  { id: 'aitu', name: 'Astana IT University', shortName: 'AITU', city: 'Астана', region: 'Астана', rating: 4.6, students: 3500, type: 'state', logo: 'https://placehold.co/100x100/00C9A7/white?text=AITU', coordinates: { lat: 51.1284, lng: 71.4306 } },
  { id: 'enu', name: 'ЕНУ им. Гумилева', shortName: 'ЕНУ', city: 'Астана', region: 'Астана', rating: 4.5, students: 20000, type: 'national', logo: 'https://placehold.co/100x100/FFD700/333?text=ENU', coordinates: { lat: 51.1605, lng: 71.4704 } },
  { id: 'kaznu', name: 'КазНУ им. аль-Фараби', shortName: 'КазНУ', city: 'Алматы', region: 'Алматы', rating: 4.7, students: 25000, type: 'national', logo: 'https://placehold.co/100x100/DC143C/white?text=KazNU', coordinates: { lat: 43.2220, lng: 76.9280 } },
  { id: 'kbtu', name: 'КБТУ', shortName: 'КБТУ', city: 'Алматы', region: 'Алматы', rating: 4.5, students: 5000, type: 'state', logo: 'https://placehold.co/100x100/003366/white?text=KBTU', coordinates: { lat: 43.2380, lng: 76.9455 } },
  { id: 'kimep', name: 'KIMEP University', shortName: 'KIMEP', city: 'Алматы', region: 'Алматы', rating: 4.6, students: 3000, type: 'private', logo: 'https://placehold.co/100x100/8B0000/white?text=KIMEP', coordinates: { lat: 43.2330, lng: 76.9560 } },
  { id: 'iitu', name: 'МУИТ', shortName: 'МУИТ', city: 'Алматы', region: 'Алматы', rating: 4.4, students: 6000, type: 'state', logo: 'https://placehold.co/100x100/4169E1/white?text=IITU', coordinates: { lat: 43.2100, lng: 76.8700 } },
  { id: 'sdu', name: 'SDU', shortName: 'SDU', city: 'Алматы', region: 'Алматы', rating: 4.4, students: 8000, type: 'private', logo: 'https://placehold.co/100x100/228B22/white?text=SDU', coordinates: { lat: 43.1950, lng: 76.8930 } },
  { id: 'narxoz', name: 'Narxoz University', shortName: 'Narxoz', city: 'Алматы', region: 'Алматы', rating: 4.3, students: 7000, type: 'private', logo: 'https://placehold.co/100x100/FF6B35/white?text=NRX', coordinates: { lat: 43.2280, lng: 76.9100 } },
  { id: 'kstu', name: 'КарТУ', shortName: 'КарТУ', city: 'Караганда', region: 'Карагандинская область', rating: 4.2, students: 12000, type: 'state', logo: 'https://placehold.co/100x100/2F4F4F/white?text=KSTU', coordinates: { lat: 49.8047, lng: 73.1094 } },
  { id: 'aktobe', name: 'АРУ им. Жубанова', shortName: 'АРУ', city: 'Актобе', region: 'Актюбинская область', rating: 4.1, students: 8000, type: 'state', logo: 'https://placehold.co/100x100/8B4513/white?text=ARU', coordinates: { lat: 50.2839, lng: 57.1670 } },
  { id: 'atyrau', name: 'АГУ им. Досмухамедова', shortName: 'АГУ', city: 'Атырау', region: 'Атырауская область', rating: 4.0, students: 6000, type: 'state', logo: 'https://placehold.co/100x100/006400/white?text=AGU', coordinates: { lat: 46.7516, lng: 51.8800 } },
  { id: 'shymkent', name: 'ЮКГУ им. Ауэзова', shortName: 'ЮКГУ', city: 'Шымкент', region: 'Туркестанская область', rating: 4.2, students: 18000, type: 'state', logo: 'https://placehold.co/100x100/800080/white?text=SKSU', coordinates: { lat: 42.3417, lng: 69.5901 } },
  { id: 'pavlodar', name: 'ПГУ им. Торайгырова', shortName: 'ПГУ', city: 'Павлодар', region: 'Павлодарская область', rating: 4.1, students: 10000, type: 'state', logo: 'https://placehold.co/100x100/4682B4/white?text=PSU', coordinates: { lat: 52.2873, lng: 76.9674 } },
  { id: 'semey', name: 'СГУ им. Шакарима', shortName: 'СГУ', city: 'Семей', region: 'Абайская область', rating: 4.0, students: 9000, type: 'state', logo: 'https://placehold.co/100x100/CD853F/white?text=SSU', coordinates: { lat: 50.4111, lng: 80.2275 } },
]

// Регионы Казахстана с координатами центров
const REGIONS = [
  { id: 'astana', name: 'Астана', center: { lat: 51.1605, lng: 71.4704 } },
  { id: 'almaty', name: 'Алматы', center: { lat: 43.2220, lng: 76.9280 } },
  { id: 'karaganda', name: 'Караганда', center: { lat: 49.8047, lng: 73.1094 } },
  { id: 'shymkent', name: 'Шымкент', center: { lat: 42.3417, lng: 69.5901 } },
  { id: 'aktobe', name: 'Актобе', center: { lat: 50.2839, lng: 57.1670 } },
  { id: 'atyrau', name: 'Атырау', center: { lat: 46.7516, lng: 51.8800 } },
  { id: 'pavlodar', name: 'Павлодар', center: { lat: 52.2873, lng: 76.9674 } },
  { id: 'semey', name: 'Семей', center: { lat: 50.4111, lng: 80.2275 } },
]

export default function UniversityMap() {
  const [selectedCity, setSelectedCity] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedUniversity, setSelectedUniversity] = useState<UniversityMapData | null>(null)
  const [hoveredUniversity, setHoveredUniversity] = useState<string | null>(null)

  const filteredUniversities = UNIVERSITIES_MAP_DATA.filter(uni => {
    if (selectedCity !== 'all' && uni.city !== selectedCity) return false
    if (selectedType !== 'all' && uni.type !== selectedType) return false
    return true
  })

  const cities = [...new Set(UNIVERSITIES_MAP_DATA.map(u => u.city))]

  // Преобразование координат в позицию на карте (упрощенная проекция)
  const getMapPosition = (lat: number, lng: number) => {
    // Границы Казахстана (примерные)
    const minLat = 40.5, maxLat = 55.5
    const minLng = 46.5, maxLng = 87.5
    
    const x = ((lng - minLng) / (maxLng - minLng)) * 100
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100
    
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'national': return 'bg-amber-500'
      case 'state': return 'bg-blue-500'
      case 'private': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'national': return 'Национальный'
      case 'state': return 'Государственный'
      case 'private': return 'Частный'
      default: return type
    }
  }

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
            <FiMapPin className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">🗺️ Карта университетов</h2>
            <p className="text-gray-600">Интерактивная карта вузов Казахстана</p>
          </div>
        </div>
      </div>

      {/* Фильтры */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2">
          <FiFilter className="text-gray-500" />
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
          >
            <option value="all">Все города</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
        >
          <option value="all">Все типы</option>
          <option value="national">Национальные</option>
          <option value="state">Государственные</option>
          <option value="private">Частные</option>
        </select>
        
        {/* Легенда */}
        <div className="flex items-center gap-4 ml-auto text-sm">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span>Национальный</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Государственный</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span>Частный</span>
          </div>
        </div>
      </div>

      {/* Карта */}
      <div className="relative bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl overflow-hidden" style={{ height: '500px' }}>
        {/* Фоновое изображение карты Казахстана (упрощенное) */}
        <div className="absolute inset-0 opacity-30">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Упрощенный контур Казахстана */}
            <path
              d="M10,30 Q20,20 35,25 L50,20 Q65,15 80,25 L90,35 Q95,45 90,55 L85,65 Q75,75 60,70 L45,75 Q30,80 20,70 L15,55 Q5,45 10,30 Z"
              fill="none"
              stroke="#059669"
              strokeWidth="0.5"
              opacity="0.5"
            />
          </svg>
        </div>

        {/* Маркеры университетов */}
        {filteredUniversities.map((uni) => {
          const pos = getMapPosition(uni.coordinates.lat, uni.coordinates.lng)
          const isHovered = hoveredUniversity === uni.id
          const isSelected = selectedUniversity?.id === uni.id
          
          return (
            <div
              key={uni.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-10 ${
                isHovered || isSelected ? 'scale-125 z-20' : ''
              }`}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onMouseEnter={() => setHoveredUniversity(uni.id)}
              onMouseLeave={() => setHoveredUniversity(null)}
              onClick={() => setSelectedUniversity(uni)}
            >
              <div className={`w-8 h-8 ${getTypeColor(uni.type)} rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 border-white`}>
                {uni.shortName.slice(0, 2)}
              </div>
              
              {/* Tooltip при наведении */}
              {isHovered && !isSelected && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white rounded-lg shadow-xl p-3 min-w-[200px] z-30">
                  <h4 className="font-bold text-sm">{uni.shortName}</h4>
                  <p className="text-xs text-gray-600">{uni.city}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <span className="flex items-center gap-1">
                      <FiStar className="text-yellow-500" /> {uni.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiUsers /> {uni.students.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {/* Названия городов */}
        {REGIONS.map(region => {
          const pos = getMapPosition(region.center.lat, region.center.lng)
          const hasUniversities = filteredUniversities.some(u => u.city === region.name)
          
          if (!hasUniversities) return null
          
          return (
            <div
              key={region.id}
              className="absolute transform -translate-x-1/2 text-emerald-800 text-xs font-medium pointer-events-none"
              style={{ left: `${pos.x}%`, top: `${pos.y + 5}%` }}
            >
              {region.name}
            </div>
          )
        })}

        {/* Панель выбранного университета */}
        {selectedUniversity && (
          <div className="absolute top-4 right-4 bg-white rounded-xl shadow-2xl p-4 w-72 z-30">
            <button
              onClick={() => setSelectedUniversity(null)}
              className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full"
            >
              <FiX />
            </button>
            
            <div className="flex items-center gap-3 mb-3">
              <Image
                src={selectedUniversity.logo}
                alt={selectedUniversity.shortName}
                width={48}
                height={48}
                className="rounded-lg"
              />
              <div>
                <h3 className="font-bold">{selectedUniversity.shortName}</h3>
                <p className="text-sm text-gray-600">{selectedUniversity.name}</p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm mb-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Город:</span>
                <span className="font-medium">{selectedUniversity.city}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Тип:</span>
                <span className={`px-2 py-0.5 rounded-full text-xs text-white ${getTypeColor(selectedUniversity.type)}`}>
                  {getTypeLabel(selectedUniversity.type)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Рейтинг:</span>
                <span className="flex items-center gap-1 font-medium">
                  <FiStar className="text-yellow-500" /> {selectedUniversity.rating}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Студентов:</span>
                <span className="font-medium">{selectedUniversity.students.toLocaleString()}</span>
              </div>
            </div>
            
            <Link
              href={`/universities/${selectedUniversity.id}`}
              className="flex items-center justify-center gap-2 w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
            >
              <span>Подробнее</span>
              <FiExternalLink />
            </Link>
          </div>
        )}
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-emerald-600">{filteredUniversities.length}</div>
          <div className="text-sm text-gray-600">Университетов на карте</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-teal-600">{cities.length}</div>
          <div className="text-sm text-gray-600">Городов</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-cyan-600">
            {filteredUniversities.reduce((sum, u) => sum + u.students, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Студентов</div>
        </div>
      </div>
    </div>
  )
}

