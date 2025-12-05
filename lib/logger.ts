// Система логирования для KZ UniVerse

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  data?: any
  source?: string
}

class Logger {
  private logs: LogEntry[] = []
  private maxLogs = 1000
  private isDevelopment = process.env.NODE_ENV === 'development'

  private formatMessage(level: LogLevel, message: string, data?: any, source?: string): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      source
    }
  }

  private addLog(entry: LogEntry) {
    this.logs.push(entry)
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }

    // В development режиме выводим в консоль
    if (this.isDevelopment || typeof window !== 'undefined') {
      const style = this.getStyle(entry.level)
      console.log(
        `%c[${entry.timestamp}] ${entry.level.toUpperCase()}${entry.source ? ` [${entry.source}]` : ''}: ${entry.message}`,
        style,
        entry.data || ''
      )
    }
  }

  private getStyle(level: LogLevel): string {
    const styles: { [key in LogLevel]: string } = {
      debug: 'color: #888',
      info: 'color: #2196F3',
      warn: 'color: #FF9800',
      error: 'color: #F44336; font-weight: bold'
    }
    return styles[level] || ''
  }

  debug(message: string, data?: any, source?: string) {
    this.addLog(this.formatMessage('debug', message, data, source))
  }

  info(message: string, data?: any, source?: string) {
    this.addLog(this.formatMessage('info', message, data, source))
  }

  warn(message: string, data?: any, source?: string) {
    this.addLog(this.formatMessage('warn', message, data, source))
  }

  error(message: string, data?: any, source?: string) {
    this.addLog(this.formatMessage('error', message, data, source))
  }

  // Получить все логи
  getLogs(level?: LogLevel, source?: string): LogEntry[] {
    let filtered = this.logs
    if (level) {
      filtered = filtered.filter(log => log.level === level)
    }
    if (source) {
      filtered = filtered.filter(log => log.source === source)
    }
    return filtered
  }

  // Очистить логи
  clear() {
    this.logs = []
  }

  // Экспорт логов
  export(): string {
    return JSON.stringify(this.logs, null, 2)
  }

  // Получить статистику
  getStats() {
    const stats = {
      total: this.logs.length,
      byLevel: {
        debug: this.logs.filter(l => l.level === 'debug').length,
        info: this.logs.filter(l => l.level === 'info').length,
        warn: this.logs.filter(l => l.level === 'warn').length,
        error: this.logs.filter(l => l.level === 'error').length
      },
      bySource: {} as { [key: string]: number }
    }

    this.logs.forEach(log => {
      if (log.source) {
        stats.bySource[log.source] = (stats.bySource[log.source] || 0) + 1
      }
    })

    return stats
  }
}

// Создаем singleton экземпляр
export const logger = new Logger()

// Экспортируем удобные функции
export const log = {
  debug: (message: string, data?: any, source?: string) => logger.debug(message, data, source),
  info: (message: string, data?: any, source?: string) => logger.info(message, data, source),
  warn: (message: string, data?: any, source?: string) => logger.warn(message, data, source),
  error: (message: string, data?: any, source?: string) => logger.error(message, data, source),
  getLogs: (level?: LogLevel, source?: string) => logger.getLogs(level, source),
  clear: () => logger.clear(),
  export: () => logger.export(),
  getStats: () => logger.getStats()
}

