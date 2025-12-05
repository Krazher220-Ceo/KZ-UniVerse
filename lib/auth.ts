// Простая система аутентификации через localStorage (для MVP)

export interface User {
  id: string
  email: string
  name: string
  password?: string // Хеш пароля (в production использовать bcrypt)
  avatar?: string
  createdAt: Date
  telegramId?: number
  telegramUsername?: string
  source?: 'web' | 'telegram'
}

interface UserData {
  email: string
  password: string // Хеш пароля
}

// Простая функция хеширования (в production использовать bcrypt)
function hashPassword(password: string): string {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash.toString(36)
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

// Регистрация нового пользователя
export function register(email: string, name: string, password: string): User {
  // Проверяем, существует ли уже пользователь с таким email
  const usersData = getUsersData()
  if (usersData.find(u => u.email === email)) {
    throw new Error('Пользователь с таким email уже существует')
  }
  
  const hashedPassword = hashPassword(password)
  const user: User = {
    id: `user_${Date.now()}`,
    email,
    name,
    password: hashedPassword,
    createdAt: new Date(),
    source: 'web'
  }
  
  // Сохраняем данные пользователя
  usersData.push({ email, password: hashedPassword })
  localStorage.setItem('kz_universe_users', JSON.stringify(usersData))
  
  // Сохраняем текущего пользователя
  const { password: _, ...userWithoutPassword } = user
  localStorage.setItem('kz_universe_user', JSON.stringify(userWithoutPassword))
  
  return user
}

// Вход по email и паролю
export function login(email: string, password: string): User {
  const usersData = getUsersData()
  const userData = usersData.find(u => u.email === email)
  
  if (!userData) {
    throw new Error('Неверный email или пароль')
  }
  
  const hashedPassword = hashPassword(password)
  if (userData.password !== hashedPassword) {
    throw new Error('Неверный email или пароль')
  }
  
  // Получаем полную информацию о пользователе
  const userStr = localStorage.getItem(`kz_universe_user_${email}`)
  let user: User
  
  if (userStr) {
    user = JSON.parse(userStr)
    user.createdAt = new Date(user.createdAt)
  } else {
    // Создаем нового пользователя, если данных нет
    user = {
      id: `user_${Date.now()}`,
      email,
      name: email.split('@')[0],
      createdAt: new Date(),
      source: 'web'
    }
  }
  
  // Сохраняем текущего пользователя (без пароля)
  const { password: _, ...userWithoutPassword } = user
  localStorage.setItem('kz_universe_user', JSON.stringify(userWithoutPassword))
  localStorage.setItem(`kz_universe_user_${email}`, JSON.stringify(user))
  
  return user
}

// Вход через Telegram (без пароля)
export function loginTelegram(email: string, name: string, telegramId: number, telegramUsername?: string): User {
  const user: User = {
    id: `tg_${telegramId}`,
    email,
    name,
    createdAt: new Date(),
    telegramId,
    telegramUsername,
    source: 'telegram'
  }
  const { password: _, ...userWithoutPassword } = user
  localStorage.setItem('kz_universe_user', JSON.stringify(userWithoutPassword))
  return user
}

// Получение всех пользователей (для проверки email)
function getUsersData(): UserData[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem('kz_universe_users')
  return data ? JSON.parse(data) : []
}

export function logout(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('kz_universe_user')
}

export function updateUser(user: Partial<User>): User | null {
  const current = getCurrentUser()
  if (!current) return null
  const updated = { ...current, ...user }
  const { password: _, ...userWithoutPassword } = updated
  localStorage.setItem('kz_universe_user', JSON.stringify(userWithoutPassword))
  if (current.email) {
    localStorage.setItem(`kz_universe_user_${current.email}`, JSON.stringify(updated))
  }
  return updated
}

// Смена пароля
export function changePassword(oldPassword: string, newPassword: string): boolean {
  const current = getCurrentUser()
  if (!current || !current.email) return false
  
  const usersData = getUsersData()
  const userData = usersData.find(u => u.email === current.email)
  
  if (!userData) return false
  
  const hashedOldPassword = hashPassword(oldPassword)
  if (userData.password !== hashedOldPassword) {
    throw new Error('Неверный текущий пароль')
  }
  
  const hashedNewPassword = hashPassword(newPassword)
  userData.password = hashedNewPassword
  localStorage.setItem('kz_universe_users', JSON.stringify(usersData))
  
  return true
}

