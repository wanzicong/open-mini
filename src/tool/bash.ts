import { z } from "zod"
import { spawn } from "child_process"
import type { ToolDefinition, ToolContext, ToolResult } from "./tool"
import { log } from "../util/log"

export const bashParams = z.object({
  command: z.string().optional().describe("要执行的命令"),
  cmd: z.string().optional().describe("要执行的命令"),
  description: z.string().optional().describe("命令的简短描述"),
})

export async function executeBash(
  params: z.infer<typeof bashParams>,
  context: ToolContext
): Promise<ToolResult> {
  const cmd = params.command || params.cmd
  
  if (!cmd) {
    return {
      success: false,
      content: "",
      error: "未提供命令",
    }
  }

  return new Promise((resolve) => {
    log.debug(`执行命令: ${cmd}`)

    const isWindows = process.platform === "win32"
    const shell = isWindows ? "cmd.exe" : "/bin/sh"
    const shellArgs = isWindows ? ["/c", cmd] : ["-c", cmd]

    const child = spawn(shell, shellArgs, {
      cwd: context.workingDir,
      env: { ...process.env },
      stdio: ["pipe", "pipe", "pipe"],
    })

    let stdout = ""
    let stderr = ""

    child.stdout?.on("data", (data) => {
      stdout += data.toString()
    })

    child.stderr?.on("data", (data) => {
      stderr += data.toString()
    })

    child.on("close", (code) => {
      if (code === 0) {
        resolve({
          success: true,
          content: stdout.trim() || "(命令执行成功，无输出)",
        })
      } else {
        resolve({
          success: false,
          content: stdout.trim(),
          error: stderr.trim() || `命令执行失败，退出码: ${code}`,
        })
      }
    })

    child.on("error", (error) => {
      resolve({
        success: false,
        content: "",
        error: `命令执行失败: ${error.message}`,
      })
    })

    setTimeout(() => {
      child.kill()
      resolve({
        success: false,
        content: stdout.trim(),
        error: "命令执行超时",
      })
    }, 120000)
  })
}

export const bashTool: ToolDefinition = {
  name: "bash",
  description: "在终端执行命令行命令。用于安装依赖、运行脚本、git操作等。",
  parameters: bashParams,
  execute: executeBash,
}
