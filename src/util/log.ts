import picocolors from "picocolors"

type LogLevel = "debug" | "info" | "warn" | "error"

class Logger {
  private level: LogLevel = "info"
  private prefix = "open-mini"

  setLevel(level: LogLevel) {
    this.level = level
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ["debug", "info", "warn", "error"]
    return levels.indexOf(level) >= levels.indexOf(this.level)
  }

  private format(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString().split("T")[1].split(".")[0]
    const levelStr = level.toUpperCase().padEnd(5)
    const colorFn = this.getColor(level)
    return `${picocolors.gray(timestamp)} ${colorFn(levelStr)} ${picocolors.gray(this.prefix)} ${message}`
  }

  private getColor(level: LogLevel): (s: string) => string {
    switch (level) {
      case "debug": return picocolors.gray
      case "info": return picocolors.blue
      case "warn": return picocolors.yellow
      case "error": return picocolors.red
    }
  }

  debug(message: string, ...args: any[]) {
    if (this.shouldLog("debug")) {
      console.log(this.format("debug", message), ...args)
    }
  }

  info(message: string, ...args: any[]) {
    if (this.shouldLog("info")) {
      console.log(this.format("info", message), ...args)
    }
  }

  warn(message: string, ...args: any[]) {
    if (this.shouldLog("warn")) {
      console.warn(this.format("warn", message), ...args)
    }
  }

  error(message: string, ...args: any[]) {
    if (this.shouldLog("error")) {
      console.error(this.format("error", message), ...args)
    }
  }

  success(message: string, ...args: any[]) {
    if (this.shouldLog("info")) {
      console.log(picocolors.green("✓ " + message), ...args)
    }
  }
}

export const log = new Logger()
