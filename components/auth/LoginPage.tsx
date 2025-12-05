'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FiMail, FiUser, FiLock, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi'
import { login, register, isAuthenticated } from '@/lib/auth'
import TelegramLogin from './TelegramLogin'

export default function LoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/profile')
    }
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Введите email')
      return
    }

    if (!password) {
      setError('Введите пароль')
      return
    }

    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов')
      return
    }

    if (!isLogin) {
      if (!name) {
        setError('Введите имя')
        return
      }

      if (password !== confirmPassword) {
        setError('Пароли не совпадают')
        return
      }

      try {
        const user = register(email, name, password)
        router.push('/profile')
      } catch (err: any) {
        setError(err.message || 'Ошибка регистрации. Попробуйте снова.')
      }
    } else {
      try {
        const user = login(email, password)
        router.push('/profile')
      } catch (err: any) {
        setError(err.message || 'Неверный email или пароль.')
      }
    }
  }

  const handleToggleMode = () => {
    setIsLogin(!isLogin)
    setError('')
    setPassword('')
    setConfirmPassword('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="glass-effect rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">KZ</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {isLogin ? 'Вход' : 'Регистрация'}
            </h1>
            <p className="text-gray-600">
              {isLogin 
                ? 'Войдите для получения персонализированных рекомендаций'
                : 'Создайте аккаунт для расчета шансов поступления'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2">Имя</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ваше имя"
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-primary-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Пароль</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isLogin ? 'Введите пароль' : 'Минимум 6 символов'}
                  className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-lg outline-none focus:border-primary-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2">Подтвердите пароль</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Повторите пароль"
                    className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-lg outline-none focus:border-primary-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:shadow-lg transition-all font-semibold flex items-center justify-center space-x-2"
            >
              <span>{isLogin ? 'Войти' : 'Зарегистрироваться'}</span>
              <FiArrowRight />
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={handleToggleMode}
              className="text-primary-600 hover:text-primary-700 text-sm"
            >
              {isLogin 
                ? 'Нет аккаунта? Зарегистрируйтесь'
                : 'Уже есть аккаунт? Войдите'
              }
            </button>
          </div>

          <TelegramLogin />

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              🔒 Ваши данные хранятся локально и не передаются третьим лицам
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

