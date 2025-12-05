'use client'

import { useState, useRef, useEffect } from 'react'
import { FiMic, FiMicOff, FiVolume2, FiLoader, FiX } from 'react-icons/fi'

interface VoiceAssistantProps {
  onCommand?: (command: string) => void
}

export default function VoiceAssistant({ onCommand }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [response, setResponse] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const [showWidget, setShowWidget] = useState(false)
  
  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  useEffect(() => {
    // Проверяем поддержку Web Speech API
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      
      if (!SpeechRecognition) {
        setIsSupported(false)
        return
      }
      
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'ru-RU'
      
      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex
        const result = event.results[current]
        const text = result[0].transcript
        
        setTranscript(text)
        
        if (result.isFinal) {
          processCommand(text)
        }
      }
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }
      
      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
      
      synthRef.current = window.speechSynthesis
    }
  }, [])

  const startListening = () => {
    if (!recognitionRef.current) return
    
    setTranscript('')
    setResponse('')
    setIsListening(true)
    recognitionRef.current.start()
  }

  const stopListening = () => {
    if (!recognitionRef.current) return
    
    recognitionRef.current.stop()
    setIsListening(false)
  }

  const processCommand = async (text: string) => {
    setIsProcessing(true)
    
    try {
      // Используем AI для генерации ответа
      const aiModule = await import('@/lib/ai')
      const responseText = await aiModule.generateAIResponse(text)
      
      setResponse(responseText)
      
      // Проверяем команды навигации
      const lowerText = text.toLowerCase()
      if (lowerText.includes('найди') && (lowerText.includes('университет') || lowerText.includes('вуз'))) {
        onCommand?.('navigate:/universities')
      } else if (lowerText.includes('сравни')) {
        onCommand?.('navigate:/compare')
      }
      
      // Озвучиваем ответ (сокращаем для голоса)
      const shortResponse = responseText.split('\n').slice(0, 3).join(' ').replace(/[*#]/g, '')
      speak(shortResponse.slice(0, 300))
    } catch (error) {
      console.error('AI error:', error)
      const fallbackResponse = 'Извините, произошла ошибка. Попробуйте ещё раз.'
      setResponse(fallbackResponse)
      speak(fallbackResponse)
    } finally {
      setIsProcessing(false)
    }
  }

  const speak = (text: string) => {
    if (!synthRef.current) return
    
    // Останавливаем предыдущее воспроизведение
    synthRef.current.cancel()
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'ru-RU'
    utterance.rate = 1.0
    utterance.pitch = 1.0
    
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    
    synthRef.current.speak(utterance)
  }

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setIsSpeaking(false)
    }
  }

  if (!isSupported) {
    return null // Не показываем виджет если браузер не поддерживает
  }

  return (
    <>
      {/* Кнопка голосового помощника */}
      <button
        onClick={() => setShowWidget(!showWidget)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all z-40 flex items-center justify-center"
        title="Голосовой помощник"
      >
        <FiMic size={24} />
      </button>

      {/* Виджет голосового помощника */}
      {showWidget && (
        <div className="fixed bottom-44 right-6 w-80 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-500 to-purple-600 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <FiMic size={20} />
                </div>
                <div>
                  <h3 className="font-bold">Голосовой помощник</h3>
                  <p className="text-xs text-violet-200">Говорите на русском</p>
                </div>
              </div>
              <button
                onClick={() => setShowWidget(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Визуализация голоса */}
            <div className="flex items-center justify-center mb-4">
              <div className={`relative w-24 h-24 rounded-full flex items-center justify-center ${
                isListening 
                  ? 'bg-gradient-to-r from-violet-500 to-purple-600 animate-pulse' 
                  : 'bg-gray-100'
              }`}>
                {isListening && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-violet-500 animate-ping opacity-25"></div>
                    <div className="absolute inset-2 rounded-full bg-violet-400 animate-ping opacity-25" style={{ animationDelay: '0.2s' }}></div>
                  </>
                )}
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                    isListening 
                      ? 'bg-white text-violet-600' 
                      : 'bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:shadow-lg'
                  }`}
                >
                  {isProcessing ? (
                    <FiLoader className="animate-spin" size={28} />
                  ) : isListening ? (
                    <FiMicOff size={28} />
                  ) : (
                    <FiMic size={28} />
                  )}
                </button>
              </div>
            </div>

            {/* Transcript */}
            {transcript && (
              <div className="mb-4 p-3 bg-violet-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Вы сказали:</p>
                <p className="text-gray-900">{transcript}</p>
              </div>
            )}

            {/* Response */}
            {response && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm text-gray-500">Ответ:</p>
                  {isSpeaking && (
                    <button
                      onClick={stopSpeaking}
                      className="p-1 text-violet-600 hover:bg-violet-100 rounded"
                    >
                      <FiVolume2 size={16} className="animate-pulse" />
                    </button>
                  )}
                </div>
                <p className="text-gray-900 text-sm">{response}</p>
              </div>
            )}

            {/* Instructions */}
            {!transcript && !response && (
              <div className="text-center text-gray-500 text-sm">
                <p className="mb-2">Нажмите на микрофон и скажите:</p>
                <div className="space-y-1 text-xs">
                  <p className="bg-gray-100 rounded px-2 py-1">"Найди IT университеты"</p>
                  <p className="bg-gray-100 rounded px-2 py-1">"Расскажи о грантах"</p>
                  <p className="bg-gray-100 rounded px-2 py-1">"Сравни университеты"</p>
                </div>
              </div>
            )}

            {/* Status */}
            <div className="text-center text-xs text-gray-400 mt-4">
              {isListening ? '🎤 Слушаю...' : isProcessing ? '🤔 Обрабатываю...' : isSpeaking ? '🔊 Говорю...' : '🎙️ Готов к работе'}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

