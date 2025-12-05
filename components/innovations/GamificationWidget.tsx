'use client'

import { useState, useEffect } from 'react'
import { FiAward, FiTarget, FiTrendingUp, FiStar, FiCheckCircle, FiGift, FiZap } from 'react-icons/fi'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  points: number
  unlocked: boolean
  unlockedAt?: Date
  category: 'exploration' | 'profile' | 'social' | 'special'
}

interface UserProgress {
  level: number
  xp: number
  xpToNextLevel: number
  streak: number
  totalPoints: number
  achievements: Achievement[]
  rank: string
  rankIcon: string
}

const ACHIEVEMENTS: Achievement[] = [
  // Exploration
  { id: 'first-visit', title: 'Первые шаги', description: 'Посетите свой первый университет', icon: '👣', points: 10, unlocked: false, category: 'exploration' },
  { id: 'explorer', title: 'Исследователь', description: 'Просмотрите 5 университетов', icon: '🔍', points: 25, unlocked: false, category: 'exploration' },
  { id: 'tour-master', title: 'Мастер туров', description: 'Пройдите 3D-тур 3 университетов', icon: '🏛️', points: 50, unlocked: false, category: 'exploration' },
  { id: 'compare-pro', title: 'Аналитик', description: 'Сравните 3 университета', icon: '📊', points: 30, unlocked: false, category: 'exploration' },
  
  // Profile
  { id: 'profile-complete', title: 'Полный профиль', description: 'Заполните все поля профиля', icon: '📝', points: 40, unlocked: false, category: 'profile' },
  { id: 'ent-added', title: 'ЕНТ записан', description: 'Добавьте балл ЕНТ в профиль', icon: '📈', points: 20, unlocked: false, category: 'profile' },
  { id: 'olympiad-hero', title: 'Олимпиадник', description: 'Добавьте олимпиаду в достижения', icon: '🏆', points: 35, unlocked: false, category: 'profile' },
  
  // Social
  { id: 'first-chat', title: 'Первый диалог', description: 'Задайте вопрос AI-помощнику', icon: '💬', points: 15, unlocked: false, category: 'social' },
  { id: 'share-master', title: 'Делитесь знаниями', description: 'Поделитесь университетом с друзьями', icon: '📤', points: 20, unlocked: false, category: 'social' },
  
  // Special
  { id: 'night-owl', title: 'Ночная сова', description: 'Используйте платформу после полуночи', icon: '🦉', points: 15, unlocked: false, category: 'special' },
  { id: 'early-bird', title: 'Ранняя пташка', description: 'Используйте платформу до 7 утра', icon: '🐦', points: 15, unlocked: false, category: 'special' },
  { id: 'dedicated', title: 'Преданный пользователь', description: '7-дневный streak посещений', icon: '🔥', points: 100, unlocked: false, category: 'special' },
]

const RANKS = [
  { level: 1, name: 'Абитуриент', icon: '🎒', minXp: 0 },
  { level: 5, name: 'Исследователь', icon: '🔍', minXp: 200 },
  { level: 10, name: 'Знаток', icon: '📚', minXp: 500 },
  { level: 15, name: 'Эксперт', icon: '🎓', minXp: 1000 },
  { level: 20, name: 'Мастер', icon: '👑', minXp: 2000 },
  { level: 25, name: 'Легенда', icon: '⭐', minXp: 5000 },
]

export default function GamificationWidget() {
  const [progress, setProgress] = useState<UserProgress>({
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    streak: 0,
    totalPoints: 0,
    achievements: ACHIEVEMENTS,
    rank: 'Абитуриент',
    rankIcon: '🎒'
  })
  const [showAchievements, setShowAchievements] = useState(false)
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)

  useEffect(() => {
    // Загружаем прогресс из localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kz-universe-progress')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setProgress(parsed)
        } catch (e) {
          console.error('Failed to parse progress:', e)
        }
      }
      
      // Проверяем время для специальных достижений
      const hour = new Date().getHours()
      if (hour >= 0 && hour < 5) {
        unlockAchievement('night-owl')
      } else if (hour >= 5 && hour < 7) {
        unlockAchievement('early-bird')
      }
      
      // Обновляем streak
      updateStreak()
    }
  }, [])

  const saveProgress = (newProgress: UserProgress) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kz-universe-progress', JSON.stringify(newProgress))
    }
  }

  const updateStreak = () => {
    const lastVisit = localStorage.getItem('kz-universe-last-visit')
    const today = new Date().toDateString()
    
    if (lastVisit !== today) {
      localStorage.setItem('kz-universe-last-visit', today)
      
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (lastVisit === yesterday.toDateString()) {
        setProgress(prev => {
          const newStreak = prev.streak + 1
          const newProgress = { ...prev, streak: newStreak }
          
          if (newStreak >= 7) {
            unlockAchievement('dedicated')
          }
          
          saveProgress(newProgress)
          return newProgress
        })
      } else if (lastVisit !== today) {
        setProgress(prev => {
          const newProgress = { ...prev, streak: 1 }
          saveProgress(newProgress)
          return newProgress
        })
      }
    }
  }

  const addXP = (amount: number) => {
    setProgress(prev => {
      let newXp = prev.xp + amount
      let newLevel = prev.level
      let newXpToNext = prev.xpToNextLevel
      
      while (newXp >= newXpToNext) {
        newXp -= newXpToNext
        newLevel++
        newXpToNext = Math.floor(100 * Math.pow(1.2, newLevel - 1))
      }
      
      // Определяем новый ранг
      const newRank = RANKS.filter(r => r.level <= newLevel).pop() || RANKS[0]
      
      const newProgress = {
        ...prev,
        xp: newXp,
        level: newLevel,
        xpToNextLevel: newXpToNext,
        totalPoints: prev.totalPoints + amount,
        rank: newRank.name,
        rankIcon: newRank.icon
      }
      
      saveProgress(newProgress)
      return newProgress
    })
  }

  const unlockAchievement = (id: string) => {
    setProgress(prev => {
      const achievement = prev.achievements.find(a => a.id === id)
      if (!achievement || achievement.unlocked) return prev
      
      const updatedAchievements = prev.achievements.map(a => 
        a.id === id ? { ...a, unlocked: true, unlockedAt: new Date() } : a
      )
      
      const unlockedAchievement = updatedAchievements.find(a => a.id === id)!
      setNewAchievement(unlockedAchievement)
      
      setTimeout(() => setNewAchievement(null), 4000)
      
      const newProgress = {
        ...prev,
        achievements: updatedAchievements
      }
      
      saveProgress(newProgress)
      addXP(unlockedAchievement.points)
      
      return newProgress
    })
  }

  const unlockedCount = progress.achievements.filter(a => a.unlocked).length
  const totalAchievements = progress.achievements.length

  return (
    <>
      {/* Виджет прогресса */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
              {progress.rankIcon}
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{progress.rank}</h3>
              <p className="text-sm text-gray-600">Уровень {progress.level}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-amber-600">
              <FiZap />
              <span className="font-bold">{progress.streak} дней</span>
            </div>
            <p className="text-xs text-gray-500">streak</p>
          </div>
        </div>

        {/* XP Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Прогресс</span>
            <span className="font-medium">{progress.xp} / {progress.xpToNextLevel} XP</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${(progress.xp / progress.xpToNextLevel) * 100}%` }}
            />
          </div>
        </div>

        {/* Достижения preview */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FiAward className="text-amber-600" />
            <span className="text-sm font-medium">{unlockedCount}/{totalAchievements} достижений</span>
          </div>
          <button
            onClick={() => setShowAchievements(!showAchievements)}
            className="text-sm text-amber-600 hover:text-amber-700 font-medium"
          >
            {showAchievements ? 'Скрыть' : 'Показать все'}
          </button>
        </div>

        {/* Последние достижения */}
        <div className="flex gap-2 flex-wrap">
          {progress.achievements.filter(a => a.unlocked).slice(0, 5).map(achievement => (
            <div
              key={achievement.id}
              className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl shadow-sm border border-amber-100 hover:scale-110 transition-transform cursor-pointer"
              title={achievement.title}
            >
              {achievement.icon}
            </div>
          ))}
          {progress.achievements.filter(a => !a.unlocked).slice(0, 3).map(achievement => (
            <div
              key={achievement.id}
              className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl opacity-40 cursor-pointer"
              title={`${achievement.title} (заблокировано)`}
            >
              🔒
            </div>
          ))}
        </div>

        {/* Полный список достижений */}
        {showAchievements && (
          <div className="mt-4 pt-4 border-t border-amber-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
              {progress.achievements.map(achievement => (
                <div
                  key={achievement.id}
                  className={`p-3 rounded-lg border transition-all ${
                    achievement.unlocked 
                      ? 'bg-white border-amber-200 shadow-sm' 
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
                      achievement.unlocked ? 'bg-amber-100' : 'bg-gray-100'
                    }`}>
                      {achievement.unlocked ? achievement.icon : '🔒'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm truncate">{achievement.title}</h4>
                        <span className="text-xs text-amber-600 font-medium">+{achievement.points} XP</span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{achievement.description}</p>
                    </div>
                    {achievement.unlocked && (
                      <FiCheckCircle className="text-green-500 flex-shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ежедневные задания */}
        <div className="mt-4 pt-4 border-t border-amber-200">
          <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
            <FiTarget className="text-amber-600" />
            Ежедневные задания
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-white rounded-lg">
              <div className="flex items-center gap-2">
                <span>🔍</span>
                <span className="text-sm">Просмотреть 2 университета</span>
              </div>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">+20 XP</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-white rounded-lg">
              <div className="flex items-center gap-2">
                <span>💬</span>
                <span className="text-sm">Задать вопрос AI</span>
              </div>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">+15 XP</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-white rounded-lg">
              <div className="flex items-center gap-2">
                <span>📊</span>
                <span className="text-sm">Сравнить университеты</span>
              </div>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">+25 XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Popup нового достижения */}
      {newAchievement && (
        <div className="fixed bottom-24 right-6 z-50 animate-slide-up">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 rounded-xl shadow-2xl flex items-center gap-4 max-w-sm">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-3xl">
              {newAchievement.icon}
            </div>
            <div>
              <p className="text-xs text-amber-100">Новое достижение!</p>
              <h4 className="font-bold">{newAchievement.title}</h4>
              <p className="text-sm text-amber-100">+{newAchievement.points} XP</p>
            </div>
            <FiGift className="text-2xl animate-bounce" />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
      `}</style>
    </>
  )
}

