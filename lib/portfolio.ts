// Управление портфолио пользователя

import { UserPortfolio } from '@/types'

const PORTFOLIO_KEY = 'kz_universe_portfolio'

export function getPortfolio(): UserPortfolio | null {
  if (typeof window === 'undefined') return null
  const portfolioStr = localStorage.getItem(PORTFOLIO_KEY)
  if (!portfolioStr) return null
  try {
    return JSON.parse(portfolioStr)
  } catch {
    return null
  }
}

export function savePortfolio(portfolio: UserPortfolio): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(portfolio))
}

export function clearPortfolio(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(PORTFOLIO_KEY)
}

