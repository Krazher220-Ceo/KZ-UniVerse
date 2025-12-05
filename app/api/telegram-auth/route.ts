import { NextRequest, NextResponse } from 'next/server'
import { validateTelegramAuth, getTelegramUserFromData } from '@/lib/telegram'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const telegramUser = getTelegramUserFromData(data)
    if (!telegramUser) {
      return NextResponse.json(
        { error: 'Invalid Telegram data' },
        { status: 400 }
      )
    }

    // Валидация (упрощенная для MVP)
    if (!validateTelegramAuth(telegramUser, BOT_TOKEN)) {
      return NextResponse.json(
        { error: 'Invalid authentication' },
        { status: 401 }
      )
    }

    // Создаем или обновляем пользователя
    const user = {
      id: `tg_${telegramUser.id}`,
      email: telegramUser.username ? `${telegramUser.username}@telegram` : `user${telegramUser.id}@telegram`,
      name: `${telegramUser.firstName} ${telegramUser.lastName || ''}`.trim(),
      avatar: telegramUser.photoUrl,
      telegramId: telegramUser.id,
      telegramUsername: telegramUser.username,
      createdAt: new Date(),
      source: 'telegram'
    }

    return NextResponse.json({ user, telegramUser })
  } catch (error) {
    console.error('Telegram auth error:', error)
    return NextResponse.json(
      { error: 'Failed to authenticate' },
      { status: 500 }
    )
  }
}

