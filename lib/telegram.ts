// Telegram интеграция для KZ UniVerse

export interface TelegramUser {
  id: number
  firstName: string
  lastName?: string
  username?: string
  photoUrl?: string
  authDate: number
  hash: string
}

export function validateTelegramAuth(data: TelegramUser, botToken: string): boolean {
  // Упрощенная валидация для MVP
  // В production нужно использовать правильную валидацию от Telegram
  return !!data.id && !!data.firstName && !!data.hash
}

export function getTelegramUserFromData(data: any): TelegramUser | null {
  try {
    return {
      id: parseInt(data.id),
      firstName: data.first_name,
      lastName: data.last_name,
      username: data.username,
      photoUrl: data.photo_url,
      authDate: parseInt(data.auth_date),
      hash: data.hash
    }
  } catch {
    return null
  }
}

export function saveTelegramUser(user: TelegramUser): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('kz_universe_telegram_user', JSON.stringify(user))
}

export function getTelegramUser(): TelegramUser | null {
  if (typeof window === 'undefined') return null
  const userStr = localStorage.getItem('kz_universe_telegram_user')
  if (!userStr) return null
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export function clearTelegramUser(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('kz_universe_telegram_user')
}





