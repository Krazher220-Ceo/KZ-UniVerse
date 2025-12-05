'use client'

import Link from 'next/link'
import { useState } from 'react'
import { FiMenu, FiX, FiHome, FiBook, FiCompass, FiBarChart2, FiUser } from 'react-icons/fi'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 glass-effect">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">KZ</span>
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">KZ UniVerse</h1>
              <p className="text-xs text-gray-500">DataHub ВУЗов РК</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors">
              <FiHome />
              <span>Главная</span>
            </Link>
            <Link href="/universities" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors">
              <FiBook />
              <span>Университеты</span>
            </Link>
            <Link href="/compare" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors">
              <FiCompass />
              <span>Сравнить</span>
            </Link>
            <Link href="/analytics" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors">
              <FiBarChart2 />
              <span>Аналитика</span>
            </Link>
            <Link href="/profile" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors">
              <FiUser />
              <span>Профиль</span>
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="px-6 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:shadow-lg transition-all">
              Подобрать ВУЗ
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <Link href="/" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors">
              <FiHome />
              <span>Главная</span>
            </Link>
            <Link href="/universities" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors">
              <FiBook />
              <span>Университеты</span>
            </Link>
            <Link href="/compare" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors">
              <FiCompass />
              <span>Сравнить</span>
            </Link>
            <Link href="/analytics" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors">
              <FiBarChart2 />
              <span>Аналитика</span>
            </Link>
            <button className="w-full px-6 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg">
              Подобрать ВУЗ
            </button>
          </div>
        )}
      </nav>
    </header>
  )
}

