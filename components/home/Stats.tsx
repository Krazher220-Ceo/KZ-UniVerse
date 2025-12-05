'use client'

import { useEffect, useState } from 'react'
import { FiBook, FiUsers, FiGlobe, FiTrendingUp } from 'react-icons/fi'
import { formatNumber } from '@/lib/format'

const stats = [
  {
    icon: FiBook,
    value: 10,
    suffix: '+',
    label: 'Университетов',
    color: 'text-primary-500'
  },
  {
    icon: FiUsers,
    value: 100000,
    suffix: '+',
    label: 'Студентов',
    color: 'text-secondary-500'
  },
  {
    icon: FiGlobe,
    value: 200,
    suffix: '+',
    label: 'Программ обучения',
    color: 'text-accent-500'
  },
  {
    icon: FiTrendingUp,
    value: 92,
    suffix: '%',
    label: 'Трудоустройство',
    color: 'text-green-500'
  }
]

export default function Stats() {
  const [counts, setCounts] = useState(stats.map(() => 0))
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    
    if (!isVisible) return

    stats.forEach((stat, index) => {
      const duration = 2000
      const steps = 60
      const increment = stat.value / steps
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= stat.value) {
          current = stat.value
          clearInterval(timer)
        }
        setCounts(prev => {
          const newCounts = [...prev]
          newCounts[index] = Math.floor(current)
          return newCounts
        })
      }, duration / steps)
    })
  }, [isVisible])

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 ${stat.color} bg-gray-50 rounded-2xl mb-4`}>
                <stat.icon size={32} />
              </div>
              <div className={`text-4xl md:text-5xl font-bold mb-2 ${stat.color}`}>
                {formatNumber(counts[index])}{stat.suffix}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

