// Простая система аутентификации через localStorage (для MVP)

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: Date
  telegramId?: number
  telegramUsername?: string
  source?: 'web' | 'telegram'
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return !!localStorage.getItem('kz_universe_user')
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null
  const userStr = localStorage.getItem('kz_universe_user')
  if (!userStr) return null
  try {
    const user = JSON.parse(userStr)
    return {
      ...user,
      createdAt: new Date(user.createdAt)
    }
  } catch {
    return null
  }
}

export function login(email: string, name: string, telegramId?: number, telegramUsername?: string): User {
  const user: User = {
    id: telegramId ? `tg_${telegramId}` : `user_${Date.now()}`,
    email,
    name,
    createdAt: new Date(),
    telegramId,
    telegramUsername,
    source: telegramId ? 'telegram' : 'web'
  }
  localStorage.setItem('kz_universe_user', JSON.stringify(user))
  return user
}

export function logout(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('kz_universe_user')
}

export function updateUser(user: Partial<User>): User | null {
  const current = getCurrentUser()
  if (!current) return null
  const updated = { ...current, ...user }
  localStorage.setItem('kz_universe_user', JSON.stringify(updated))
  return updated
}

