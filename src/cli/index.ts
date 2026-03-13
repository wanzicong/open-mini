#!/usr/bin/env bun

import { parseArgs } from "util"
import { readFileSync, existsSync } from "fs"
import { createInterface } from "readline"
import picocolors from "picocolors"
import { loadConfig, getApiKey } from "../config/config"
import { createMiniMaxProvider } from "../provider/minimax"
import { Agent } from "../agent/agent"
import { allTools } from "../tool"
import { log } from "../util/log"

// 加载 .env 文件
function loadEnvFile() {
  const envPath = ".env"
  if (existsSync(envPath)) {
    const content = readFileSync(envPath, "utf-8")
    for (const line of content.split("\n")) {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith("#")) {
        const [key, ...valueParts] = trimmed.split("=")
        if (key && valueParts.length > 0) {
          process.env[key.trim()] = valueParts.join("=").trim()
        }
      }
    }
  }
}

loadEnvFile()

const HELP = `
${picocolors.bold(picocolors.blue("Open Mini"))} - 极简版 AI 编程助手

${picocolors.underline("用法:")}
  open-mini [选项] [任务描述]

${picocolors.underline("选项:")}
  -h, --help              显示帮助信息
  -v, --version           显示版本号
  -i, --interactive       交互式对话模式
  --project <path>        指定项目目录
  --model <model>         指定模型名称
  --max-iterations <n>   最大迭代次数 (默认: 20)

${picocolors.underline("环境变量:")}
  MINIMAX_API_KEY         MiniMax API Key (.env 文件)
  MINIMAX_MODEL           模型名称
  MINIMAX_BASE_URL        API 地址

${picocolors.underline("示例:")}
  open-mini "帮我写一个 Hello World"
  open-mini -i                           # 交互式对话
  open-mini --project /path/to/project "帮我重构这段代码"
  open-mini --model MiniMax-M2.5-highspeed "计算 1+1"
  open-mini --help
`

const VERSION = "1.0.0"

async function main() {
  try {
    const { values, positionals } = parseArgs({
      options: {
        help: { type: "boolean", short: "h", default: false },
        version: { type: "boolean", short: "v", default: false },
        interactive: { type: "boolean", short: "i", default: false },
        project: { type: "string", default: "" },
        model: { type: "string", default: "" },
        "max-iterations": { type: "string", default: "20" },
      },
      allowPositionals: true,
    })

    if (values.help) {
      console.log(HELP)
      process.exit(0)
    }

    if (values.version) {
      console.log(`open-mini v${VERSION}`)
      process.exit(0)
    }

    const config = await loadConfig()
    let apiKey = config.apiKey || getApiKey()
    if (!apiKey) {
      console.error(picocolors.red("❌ 错误: 未设置 MINIMAX_API_KEY"))
      console.log(picocolors.gray("\n请创建 .env 文件:"))
      console.log(picocolors.cyan("  echo MINIMAX_API_KEY=your_key > .env"))
      process.exit(1)
    }

    const modelName = values.model || config.model || "MiniMax-M2.5-highspeed"
    const workingDir = values.project || process.cwd()
    const maxIterations = parseInt(values["max-iterations"] || "20", 10)

    const model = createMiniMaxProvider({
      apiKey,
      model: modelName,
      baseURL: config.baseURL,
    })

    const task = positionals[0]

    // 交互式模式 (无参数 或 -i 选项)
    if (!task || values.interactive) {
      await startInteractiveMode(model, workingDir, maxIterations)
    } else {
      // 单次任务模式
      await runTask(model, workingDir, maxIterations, task)
    }

  } catch (error: any) {
    console.error()
    console.error(picocolors.red(`❌ 错误: ${error.message}`))
    log.error(error.stack || "")
    process.exit(1)
  }
}

async function runTask(model: any, workingDir: string, maxIterations: number, task: string) {
  console.log(picocolors.bold(picocolors.blue("\n🚀 Open Mini - AI 编程助手\n")))

  console.log(picocolors.gray("─".repeat(50)))
  console.log(picocolors.gray("📁 工作目录: ") + picocolors.white(workingDir))
  console.log(picocolors.gray("🤖 使用模型: ") + picocolors.cyan(model.modelId))
  console.log(picocolors.gray("🔄 最大迭代: ") + picocolors.white(maxIterations.toString()))
  console.log(picocolors.gray("─".repeat(50)))
  console.log()

  const agent = new Agent({
    model,
    tools: allTools,
    workingDir,
    maxIterations,
  })

  console.log(picocolors.yellow("📝 任务: ") + picocolors.white(task))
  console.log(picocolors.gray("─".repeat(50)))
  console.log()

  const startTime = Date.now()
  const result = await agent.run(task)
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)

  console.log()
  console.log(picocolors.gray("─".repeat(50)))
  console.log(picocolors.green("✅ 任务完成 (") + picocolors.gray(`${elapsed}s)`))
  console.log(picocolors.gray("─".repeat(50)))
  console.log()
  console.log(picocolors.white(result))
}

async function startInteractiveMode(model: any, workingDir: string, maxIterations: number) {
  console.log(picocolors.bold(picocolors.blue("\n🚀 Open Mini - 交互式对话模式\n")))

  console.log(picocolors.gray("─".repeat(50)))
  console.log(picocolors.gray("📁 工作目录: ") + picocolors.white(workingDir))
  console.log(picocolors.gray("🤖 使用模型: ") + picocolors.cyan(model.modelId))
  console.log(picocolors.gray("🔄 最大迭代: ") + picocolors.white(maxIterations.toString()))
  console.log(picocolors.gray("─".repeat(50)))
  console.log()
  console.log(picocolors.gray("💡 输入您的问题或任务，按 Enter 发送"))
  console.log(picocolors.gray("💡 输入 ") + picocolors.cyan("exit") + picocolors.gray(" 或 ") + picocolors.cyan("quit") + picocolors.gray(" 退出"))
  console.log(picocolors.gray("💡 输入 ") + picocolors.cyan("clear") + picocolors.gray(" 清除对话历史"))
  console.log()

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  const agent = new Agent({
    model,
    tools: allTools,
    workingDir,
    maxIterations,
  })

  const ask = () => {
    rl.question(
      picocolors.cyan("\n👤 你: "),
      async (input) => {
        const message = input.trim()

        if (!message) {
          ask()
          return
        }

        if (message.toLowerCase() === "exit" || message.toLowerCase() === "quit") {
          console.log(picocolors.green("\n👋 再见！"))
          rl.close()
          return
        }

        if (message.toLowerCase() === "clear") {
          console.log(picocolors.gray("\n🧹 对话历史已清除"))
          ask()
          return
        }

        console.log(picocolors.gray("\n🤖 助手: "))
        const startTime = Date.now()

        try {
          const result = await agent.run(message)
          const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
          console.log()
          console.log(picocolors.white(result))
          console.log()
          console.log(picocolors.gray(`⏱️ 用时: ${elapsed}s`))
        } catch (error: any) {
          console.error(picocolors.red(`\n❌ 错误: ${error.message}`))
        }

        try {
          ask()
        } catch (e) {
          // readline 已关闭
        }
      }
    )
  }

  ask()
}

main()
