'use client'

import Link from 'next/link'
import { FiSearch, FiArrowRight } from 'react-icons/fi'
import { useState } from 'react'

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    window.location.href = `/universities?q=${encodeURIComponent(searchQuery)}`
  }

  return (
    <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm mb-6 animate-slide-in-up">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm text-gray-700">🎓 10+ университетов Казахстана</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
            Найдите <span className="gradient-text">идеальный</span> университет
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-8 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
            Единая платформа с AI-помощником для выбора образования в Казахстане
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8 animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="glass-effect rounded-2xl p-2 flex items-center">
              <FiSearch className="ml-4 text-gray-400" size={24} />
              <input
                type="text"
                placeholder="Поиск по университетам, программам, городам..."
                className="flex-1 bg-transparent px-4 py-3 outline-none text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all flex items-center space-x-2"
              >
                <span>Найти</span>
                <FiArrowRight />
              </button>
            </div>
          </form>

          {/* Quick actions */}
          <div className="flex flex-wrap justify-center gap-4 animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
            <Link href="/universities?field=IT" className="px-6 py-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-all">
              💻 IT программы
            </Link>
            <Link href="/universities?field=Business" className="px-6 py-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-all">
              💼 Бизнес
            </Link>
            <Link href="/universities?field=Engineering" className="px-6 py-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-all">
              ⚙️ Инженерия
            </Link>
            <Link href="/universities?field=Medicine" className="px-6 py-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-all">
              ⚕️ Медицина
            </Link>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z" fill="white"/>
        </svg>
      </div>
    </section>
  )
}

