'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { FiSend } from 'react-icons/fi'
import { loginTelegram, isAuthenticated } from '@/lib/auth'
import { saveTelegramUser, getTelegramUser } from '@/lib/telegram'

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initData: string
        initDataUnsafe: {
          user?: {
            id: number
            first_name: string
            last_name?: string
            username?: string
            photo_url?: string
          }
          auth_date: number
          hash: string
        }
        ready: () => void
        expand: () => void
        close: () => void
      }
    }
    onTelegramAuth?: (user: TelegramAuthUser) => void
  }
}

interface TelegramAuthUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  auth_date: number
  hash: string
}

// Имя бота без @
const TELEGRAM_BOT_USERNAME = 'KZUniVerse_bot'

export default function TelegramLogin() {
  const router = useRouter()
  const [isTelegram, setIsTelegram] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showWidget, setShowWidget] = useState(false)
  const widgetContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Проверяем, запущено ли в Telegram WebApp
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      setIsTelegram(true)
      window.Telegram.WebApp.ready()
      window.Telegram.WebApp.expand()
      
      // Автоматический вход если есть данные
      const initData = window.Telegram.WebApp.initDataUnsafe
      if (initData.user) {
        handleTelegramUserData(initData.user, initData.auth_date, initData.hash)
      }
    } else {
      setShowWidget(true)
    }
  }, [])

  // Загружаем Telegram Widget скрипт
  useEffect(() => {
    if (showWidget && widgetContainerRef.current) {
      // Очищаем контейнер
      widgetContainerRef.current.innerHTML = ''
      
      // Создаём callback функцию
      window.onTelegramAuth = (user: TelegramAuthUser) => {
        handleTelegramUserData(user, user.auth_date, user.hash)
      }

      // Создаём скрипт виджета
      const script = document.createElement('script')
      script.src = 'https://telegram.org/js/telegram-widget.js?22'
      script.setAttribute('data-telegram-login', TELEGRAM_BOT_USERNAME)
      script.setAttribute('data-size', 'large')
      script.setAttribute('data-radius', '8')
      script.setAttribute('data-onauth', 'onTelegramAuth(user)')
      script.setAttribute('data-request-access', 'write')
      script.async = true
      
      widgetContainerRef.current.appendChild(script)
    }

    return () => {
      if (typeof window !== 'undefined') {
        delete window.onTelegramAuth
      }
    }
  }, [showWidget])

  const handleTelegramUserData = async (
    user: { id: number; first_name: string; last_name?: string; username?: string; photo_url?: string },
    authDate: number,
    hash: string
  ) => {
    setIsLoading(true)

    try {
      // Сохраняем Telegram данные
      saveTelegramUser({
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username,
        photoUrl: user.photo_url,
        authDate: authDate,
        hash: hash
      })

      // Создаем пользователя в системе
      const email = user.username 
        ? `${user.username}@telegram.user` 
        : `user${user.id}@telegram.user`
      
      const fullName = user.last_name 
        ? `${user.first_name} ${user.last_name}` 
        : user.first_name

      loginTelegram(email, fullName, user.id, user.username)

      router.push('/profile')
    } catch (error) {
      console.error('Telegram auth error:', error)
      alert('Ошибка при авторизации через Telegram. Попробуйте ещё раз.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTelegramAuth = async () => {
    if (!window.Telegram?.WebApp) {
      alert('Эта функция доступна только в Telegram')
      return
    }

    setIsLoading(true)

    try {
      const initData = window.Telegram.WebApp.initDataUnsafe
      
      if (!initData.user) {
        alert('Не удалось получить данные пользователя')
        return
      }

      await handleTelegramUserData(initData.user, initData.auth_date, initData.hash)
    } catch (error) {
      console.error('Telegram auth error:', error)
      alert('Ошибка при авторизации')
    } finally {
      setIsLoading(false)
    }
  }

  // Для Telegram WebApp - показываем кнопку
  if (isTelegram) {
    return (
      <div className="mt-6 pt-6 border-t border-gray-200">
        <button
          onClick={handleTelegramAuth}
          disabled={isLoading}
          className="w-full px-6 py-3 bg-[#0088cc] text-white rounded-lg hover:bg-[#0077b5] transition-all font-semibold flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <FiSend />
          <span>{isLoading ? 'Вход...' : 'Войти через Telegram'}</span>
        </button>
        <p className="text-xs text-gray-500 text-center mt-2">
          Быстрый вход через ваш Telegram аккаунт
        </p>
      </div>
    )
  }

  // Для браузера - показываем виджет Telegram Login
  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <p className="text-sm text-gray-600 text-center mb-4">
        Или войдите через Telegram
      </p>
      
      <div className="flex justify-center" ref={widgetContainerRef}>
        {/* Telegram Widget будет добавлен сюда */}
      </div>

      {isLoading && (
        <div className="flex justify-center mt-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0088cc]"></div>
        </div>
      )}

      <div className="mt-4 text-center">
        <a
          href={`https://t.me/${TELEGRAM_BOT_USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 text-[#0088cc] hover:text-[#0077b5] transition-colors"
        >
          <FiSend />
          <span>Открыть бота @{TELEGRAM_BOT_USERNAME}</span>
        </a>
      </div>

      <p className="text-xs text-gray-500 text-center mt-2">
        Нажмите на кнопку выше для входа через Telegram
      </p>
    </div>
  )
}
