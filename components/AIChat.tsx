'use client'

import { useState, useRef, useEffect } from 'react'
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi'
import { AIMessage } from '@/types'

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Привет! 👋 Я AI-помощник KZ UniVerse. Помогу выбрать университет, расскажу о программах и отвечу на вопросы о поступлении. Чем могу помочь?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Получаем портфолио если есть
      let portfolio = null
      if (typeof window !== 'undefined') {
        try {
          const portfolioModule = await import('@/lib/portfolio')
          portfolio = portfolioModule.getPortfolio()
        } catch (e) {
          // Игнорируем ошибку
        }
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input, 
          history: messages,
          portfolio: portfolio
        })
      })

      if (!response.ok) throw new Error('API error')

      const data = await response.json()

      const aiMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'Извините, не удалось получить ответ. Попробуйте позже.',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Chat error:', error)
      // Fallback to simulated response
      const aiMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Извините, произошла ошибка. Попробуйте перезагрузить страницу или задать вопрос позже.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const getSimulatedResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase()

    if (lowerQuery.includes('it') || lowerQuery.includes('программирование') || lowerQuery.includes('компьютер')) {
      return '💻 Для IT-специальностей рекомендую:\n\n1. **AITU** - лучший IT-вуз с AI и Data Science\n2. **Nazarbayev University** - Computer Science мирового уровня\n3. **МУИТ** - специализированный IT-университет\n\nВсе программы на английском языке, стоимость от 1.8 до 2.2 млн₸/год. Хотите узнать подробнее о конкретном университете?'
    }

    if (lowerQuery.includes('бизнес') || lowerQuery.includes('экономика')) {
      return '💼 Для бизнес-образования рекомендую:\n\n1. **KIMEP** - лучшая бизнес-школа с AACSB аккредитацией\n2. **Nazarbayev University** - международная программа\n3. **КЭУ** - доступная цена и качественное образование\n\nВыбор зависит от бюджета и языка обучения. Какой у вас бюджет?'
    }

    if (lowerQuery.includes('грант') || lowerQuery.includes('стипендия')) {
      return '🎓 Гранты и стипендии доступны во всех государственных вузах:\n\n✅ **Образовательный грант** - покрывает 100% стоимости\n✅ **Стипендии** - от 36,000₸ до 100,000₸/мес\n✅ **Международные гранты** - в NU, AITU\n\nДля получения гранта нужно набрать высокий балл на ЕНТ (обычно 110+). Хотите узнать требования конкретного вуза?'
    }

    if (lowerQuery.includes('сравн') || lowerQuery.includes('чем отличается')) {
      return '📊 Отлично! Я помогу сравнить университеты.\n\nПерейдите в раздел [Сравнение](/compare) или назовите 2-3 университета, которые хотите сравнить.\n\nМогу сравнить по:\n- Стоимости\n- Рейтингу\n- Программам\n- Условиям поступления\n- Инфраструктуре'
    }

    if (lowerQuery.includes('поступ') || lowerQuery.includes('как подать')) {
      return '📝 Процесс поступления:\n\n1. **Сдать ЕНТ** (июнь-июль)\n2. **Подать документы** онлайн или лично\n3. **Пройти собеседование** (для некоторых вузов)\n4. **Получить результаты** (август)\n\nДедлайны обычно до 10-20 августа. В какой университет планируете поступать?'
    }

    return `Понял ваш вопрос: "${query}"\n\nЯ могу помочь с:\n• Выбором университета по вашим критериям\n• Информацией о программах и стоимости\n• Условиями поступления и грантами\n• Сравнением разных вузов\n• 3D-турами по кампусам\n\nЗадайте более конкретный вопрос, и я с удовольствием помогу! 😊`
  }

  const quickQuestions = [
    'Лучшие IT программы',
    'Университеты в Алматы',
    'Как получить грант?',
    'Сравнить NU и AITU'
  ]

  return (
    <>
      {/* Chat button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all z-50 flex items-center justify-center animate-float"
        >
          <FiMessageCircle size={28} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></span>
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[400px] h-[600px] glass-effect rounded-2xl shadow-2xl z-50 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
              <div>
                <h3 className="font-bold">AI-помощник</h3>
                <p className="text-xs text-primary-100">Всегда онлайн</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-2xl">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick questions */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">Быстрые вопросы:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(q)}
                    className="text-xs px-3 py-1 bg-gray-100 rounded-full hover:bg-primary-100 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Напишите ваш вопрос..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-primary-500 transition-colors"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSend size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

