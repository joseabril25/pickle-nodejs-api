import fs from 'fs'
import path from 'path'

enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

class Logger {
  private logLevel: LogLevel
  private logDir: string

  constructor() {
    this.logLevel = this.getLogLevel()
    this.logDir = path.join(process.cwd(), 'logs')
    this.ensureLogDirectory()
  }

  private getLogLevel(): LogLevel {
    const level = process.env.LOG_LEVEL?.toUpperCase()
    return LogLevel[level as keyof typeof LogLevel] ?? LogLevel.INFO
  }

  private ensureLogDirectory(): void {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true })
    }
  }

  private formatMessage(level: string, message: string, meta?: any): string {
    const timestamp = new Date().toISOString()
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : ''
    return `[${timestamp}] [${level}] ${message}${metaStr}`
  }

  private writeToFile(level: string, message: string, meta?: any): void {
    const formattedMessage = this.formatMessage(level, message, meta)
    const logFile = path.join(this.logDir, `${level.toLowerCase()}.log`)
    const combinedLogFile = path.join(this.logDir, 'combined.log')
    
    fs.appendFileSync(logFile, formattedMessage + '\n')
    fs.appendFileSync(combinedLogFile, formattedMessage + '\n')
  }

  private log(level: LogLevel, levelName: string, message: string, meta?: any): void {
    if (level > this.logLevel) return

    const timestamp = new Date().toISOString()
    const levelStr = levelName.padEnd(5)
    const formattedMessage = `[${timestamp}] [${levelStr}] ${message}`
    
    console.log(formattedMessage)
    if (meta) {
      console.log(JSON.stringify(meta, null, 2))
    }

    this.writeToFile(levelName, message, meta)
  }

  error(message: string, error?: Error | any): void {
    const meta = error instanceof Error ? { 
      name: error.name,
      message: error.message,
      stack: error.stack 
    } : error
    
    this.log(LogLevel.ERROR, 'ERROR', message, meta)
  }

  warn(message: string, meta?: any): void {
    this.log(LogLevel.WARN, 'WARN', message, meta)
  }

  info(message: string, meta?: any): void {
    this.log(LogLevel.INFO, 'INFO', message, meta)
  }

  debug(message: string, meta?: any): void {
    this.log(LogLevel.DEBUG, 'DEBUG', message, meta)
  }

  http(message: string): void {
    this.log(LogLevel.INFO, 'HTTP', message.trim())
  }
}

const logger = new Logger()

export const stream = {
  write: (message: string) => logger.http(message),
}

export default logger