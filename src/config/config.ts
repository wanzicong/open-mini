import { existsSync } from "fs"
import { readFile, writeFile } from "fs/promises"
import { join, dirname } from "path"
import { homedir } from "os"

export interface Config {
  model: string
  temperature: number
  maxTokens: number
  apiKey?: string
  baseURL?: string
}

const DEFAULT_CONFIG: Config = {
  model: "MiniMax-M2.5-highspeed",
  temperature: 0.7,
  maxTokens: 8192,
  baseURL: "https://api.minimaxi.com/anthropic",
}

const CONFIG_FILE = ".open-mini.json"

function getConfigPath(): string {
  return join(process.cwd(), CONFIG_FILE)
}

function getGlobalConfigPath(): string {
  return join(homedir(), CONFIG_FILE)
}

export async function loadConfig(): Promise<Config> {
  const configPath = getConfigPath()
  const globalConfigPath = getGlobalConfigPath()

  let config = { ...DEFAULT_CONFIG }

  if (existsSync(globalConfigPath)) {
    try {
      const content = await readFile(globalConfigPath, "utf-8")
      const globalConfig = JSON.parse(content)
      config = { ...config, ...globalConfig }
    } catch {}
  }

  if (existsSync(configPath)) {
    try {
      const content = await readFile(configPath, "utf-8")
      const localConfig = JSON.parse(content)
      config = { ...config, ...localConfig }
    } catch {}
  }

  if (process.env.MINIMAX_API_KEY) {
    config.apiKey = process.env.MINIMAX_API_KEY
  } else if (!config.apiKey && process.env.ANTHROPIC_AUTH_TOKEN) {
    config.apiKey = process.env.ANTHROPIC_AUTH_TOKEN
  }

  if (process.env.MINIMAX_MODEL) {
    config.model = process.env.MINIMAX_MODEL
  }

  if (process.env.MINIMAX_BASE_URL) {
    config.baseURL = process.env.MINIMAX_BASE_URL
  }

  return config
}

export async function saveConfig(config: Partial<Config>): Promise<void> {
  const configPath = getConfigPath()
  const currentConfig = await loadConfig()
  const newConfig = { ...currentConfig, ...config }
  await writeFile(configPath, JSON.stringify(newConfig, null, 2), "utf-8")
}

export function getApiKey(): string | undefined {
  return process.env.MINIMAX_API_KEY
}
