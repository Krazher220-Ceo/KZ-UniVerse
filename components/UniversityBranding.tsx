'use client'

import React from 'react'

// Цвета университетов (официальные или близкие к ним)
export const UNIVERSITY_COLORS: { [key: string]: { primary: string; secondary: string; accent: string } } = {
  'nu': { primary: '#0066FF', secondary: '#003399', accent: '#FFD700' },
  'kaznu': { primary: '#DC143C', secondary: '#8B0000', accent: '#FFD700' },
  'kbtu': { primary: '#003366', secondary: '#001a33', accent: '#00CED1' },
  'aitu': { primary: '#00C9A7', secondary: '#008B73', accent: '#FF6B35' },
  'kimep': { primary: '#8B0000', secondary: '#5C0000', accent: '#FFD700' },
  'sdu': { primary: '#0047AB', secondary: '#002D6B', accent: '#FF4500' },
  'keu': { primary: '#228B22', secondary: '#145214', accent: '#FFD700' },
  'enu': { primary: '#FFD700', secondary: '#B8860B', accent: '#0066FF' },
  'kstu': { primary: '#FF8C00', secondary: '#CC7000', accent: '#FFFFFF' },
  'iitu': { primary: '#4169E1', secondary: '#2850B8', accent: '#00FF7F' },
  'mgimo-astana': { primary: '#1E3A8A', secondary: '#0F1D45', accent: '#FFD700' },
  'msu-kz': { primary: '#0039A6', secondary: '#001D53', accent: '#FFD700' },
  'synergy-astana': { primary: '#FF6B35', secondary: '#CC5529', accent: '#FFFFFF' },
  'esil-university': { primary: '#8B4513', secondary: '#5C2E0D', accent: '#FFD700' },
  'mnarikbayev': { primary: '#2E8B57', secondary: '#1D5939', accent: '#FFD700' }
}

// Компонент логотипа университета
export function UniversityLogo({ 
  universityId, 
  shortName, 
  size = 'md' 
}: { 
  universityId: string; 
  shortName: string; 
  size?: 'sm' | 'md' | 'lg' | 'xl' 
}) {
  const colors = UNIVERSITY_COLORS[universityId] || { primary: '#0066FF', secondary: '#003399', accent: '#FFD700' }
  
  const sizeClasses = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-16 h-16 text-sm',
    lg: 'w-24 h-24 text-lg',
    xl: 'w-32 h-32 text-xl'
  }

  // Специальные логотипы для топовых университетов
  const getLogoContent = () => {
    switch (universityId) {
      case 'nu':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl"></div>
            <div className="relative z-10 flex flex-col items-center">
              <span className="font-bold text-white tracking-wider">NU</span>
              <div className="w-6 h-0.5 bg-yellow-400 mt-1 rounded"></div>
            </div>
          </div>
        )
      case 'kaznu':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-red-700 to-red-900 rounded-xl"></div>
            <div className="relative z-10 flex flex-col items-center">
              <span className="font-bold text-white">КазНУ</span>
              <span className="text-yellow-400 text-[8px]">1934</span>
            </div>
          </div>
        )
      case 'aitu':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl"></div>
            <div className="relative z-10 flex flex-col items-center">
              <span className="font-bold text-white">AITU</span>
              <span className="text-orange-400 text-[8px]">IT</span>
            </div>
          </div>
        )
      case 'kbtu':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-blue-950 rounded-xl"></div>
            <div className="relative z-10 flex flex-col items-center">
              <span className="font-bold text-white">КБТУ</span>
              <div className="flex gap-0.5 mt-1">
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
              </div>
            </div>
          </div>
        )
      case 'kimep':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-red-800 to-red-950 rounded-xl"></div>
            <div className="relative z-10 flex flex-col items-center">
              <span className="font-bold text-white">KIMEP</span>
              <span className="text-yellow-400 text-[8px]">AACSB</span>
            </div>
          </div>
        )
      default:
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div 
              className="absolute inset-0 rounded-xl"
              style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
            ></div>
            <span className="relative z-10 font-bold text-white">{shortName}</span>
          </div>
        )
    }
  }

  return (
    <div className={`${sizeClasses[size]} rounded-xl shadow-lg overflow-hidden`}>
      {getLogoContent()}
    </div>
  )
}

// Компонент баннера университета
export function UniversityBanner({ 
  universityId, 
  name, 
  shortName,
  city,
  type 
}: { 
  universityId: string; 
  name: string; 
  shortName: string;
  city: string;
  type: 'national' | 'state' | 'private';
}) {
  const colors = UNIVERSITY_COLORS[universityId] || { primary: '#0066FF', secondary: '#003399', accent: '#FFD700' }
  
  const getPattern = () => {
    switch (universityId) {
      case 'nu':
        return (
          <>
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-400/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            <div className="absolute top-1/2 left-1/2 w-96 h-96 border border-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          </>
        )
      case 'kaznu':
        return (
          <>
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-4 left-4 w-20 h-20 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-4 right-4 w-32 h-32 border-2 border-yellow-400 rounded-full"></div>
            </div>
          </>
        )
      case 'aitu':
        return (
          <>
            <div className="absolute inset-0 opacity-10">
              <div className="grid grid-cols-8 gap-4 p-8">
                {Array(16).fill(0).map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-white rounded-full"></div>
                ))}
              </div>
            </div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/20 rounded-bl-full"></div>
          </>
        )
      case 'kbtu':
        return (
          <>
            <div className="absolute bottom-0 right-0 w-64 h-32 bg-cyan-500/10 rounded-tl-full"></div>
            <div className="absolute top-0 left-1/4 w-1 h-full bg-white/5"></div>
            <div className="absolute top-0 left-2/4 w-1 h-full bg-white/5"></div>
            <div className="absolute top-0 left-3/4 w-1 h-full bg-white/5"></div>
          </>
        )
      default:
        return (
          <>
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          </>
        )
    }
  }

  const typeLabels = {
    national: { label: 'Национальный', emoji: '🏛️' },
    state: { label: 'Государственный', emoji: '🏫' },
    private: { label: 'Частный', emoji: '💼' }
  }

  return (
    <div 
      className="relative h-[400px] rounded-2xl overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
    >
      {/* Паттерн */}
      {getPattern()}
      
      {/* Контент */}
      <div className="absolute inset-0 flex flex-col justify-end p-8">
        <div className="flex items-end gap-6">
          <UniversityLogo universityId={universityId} shortName={shortName} size="xl" />
          <div className="flex-1">
            <div 
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm mb-3"
              style={{ backgroundColor: `${colors.accent}20`, color: colors.accent }}
            >
              <span>{typeLabels[type].emoji}</span>
              <span>{typeLabels[type].label}</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">{name}</h1>
            <p className="text-white/80 text-lg flex items-center gap-2">
              <span>📍</span> {city}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Карточка университета с кастомным дизайном
export function UniversityCard({ 
  university 
}: { 
  university: {
    id: string;
    name: string;
    shortName: string;
    city: string;
    rating: number;
    type: 'national' | 'state' | 'private';
    tuitionRange: { min: number; max: number };
  }
}) {
  const colors = UNIVERSITY_COLORS[university.id] || { primary: '#0066FF', secondary: '#003399', accent: '#FFD700' }
  
  const typeLabels = {
    national: { label: 'Нац.', emoji: '🏛️' },
    state: { label: 'Гос.', emoji: '🏫' },
    private: { label: 'Част.', emoji: '💼' }
  }

  const formatTuition = (min: number, max: number) => {
    if (min >= 1000000) {
      return `${(min/1000000).toFixed(1)}-${(max/1000000).toFixed(1)}M₸`
    }
    if (min >= 1000) {
      return `$${(min/1000).toFixed(0)}-${(max/1000).toFixed(0)}K`
    }
    return `${min.toLocaleString()}-${max.toLocaleString()}₸`
  }

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Верхняя полоса с цветом университета */}
      <div 
        className="h-2"
        style={{ background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})` }}
      ></div>
      
      <div className="p-6">
        <div className="flex items-start gap-4">
          <UniversityLogo universityId={university.id} shortName={university.shortName} size="md" />
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm" title={typeLabels[university.type].label}>
                {typeLabels[university.type].emoji}
              </span>
              <span className="text-xs text-gray-500">{typeLabels[university.type].label}</span>
            </div>
            
            <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
              {university.shortName}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-1">{university.name}</p>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">⭐</span>
            <span className="font-bold">{university.rating}</span>
          </div>
          <div className="text-sm text-gray-500">
            📍 {university.city}
          </div>
          <div className="text-sm font-medium" style={{ color: colors.primary }}>
            {formatTuition(university.tuitionRange.min, university.tuitionRange.max)}
          </div>
        </div>
      </div>
    </div>
  )
}

