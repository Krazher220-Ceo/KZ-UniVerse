'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiSend } from 'react-icons/fi'
import { login, isAuthenticated } from '@/lib/auth'
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
  }
}

export default function TelegramLogin() {
  const router = useRouter()
  const [isTelegram, setIsTelegram] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Проверяем, запущено ли в Telegram WebApp
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      setIsTelegram(true)
      window.Telegram.WebApp.ready()
      window.Telegram.WebApp.expand()
    }
  }, [])

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

      // Отправляем данные на сервер для валидации
      const response = await fetch('/api/telegram-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: initData.user.id,
          first_name: initData.user.first_name,
          last_name: initData.user.last_name,
          username: initData.user.username,
          photo_url: initData.user.photo_url,
          auth_date: initData.auth_date,
          hash: initData.hash
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        // Сохраняем Telegram данные
        saveTelegramUser({
          id: initData.user.id,
          firstName: initData.user.first_name,
          lastName: initData.user.last_name,
          username: initData.user.username,
          photoUrl: initData.user.photo_url,
          authDate: initData.auth_date,
          hash: initData.hash
        })

        // Создаем пользователя в системе
        const user = login(
          data.user.email,
          data.user.name,
          initData.user.id,
          initData.user.username
        )

        router.push('/profile')
      } else {
        alert('Ошибка авторизации через Telegram')
      }
    } catch (error) {
      console.error('Telegram auth error:', error)
      alert('Ошибка при авторизации')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isTelegram) {
    return null
  }

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

