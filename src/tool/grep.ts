import { z } from "zod"
import { readdir, stat } from "fs/promises"
import { join, relative } from "path"
import { readFileContent } from "../util/file"
import type { ToolDefinition, ToolContext, ToolResult } from "./tool"
import { log } from "../util/log"

export const grepParams = z.object({
  pattern: z.string().describe("要搜索的正则表达式或文本"),
  path: z.string().optional().describe("搜索目录，默认为当前目录"),
  filePattern: z.string().optional().describe("文件类型过滤，如 *.ts"),
})

async function grepRecursive(
  dir: string,
  pattern: string,
  filePattern?: string,
  maxDepth: number = 10,
  currentDepth: number = 0
): Promise<string[]> {
  if (currentDepth > maxDepth) return []

  const results: string[] = []

  try {
    const entries = await readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = join(dir, entry.name)

      if (entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "node_modules") {
        const subResults = await grepRecursive(fullPath, pattern, filePattern, maxDepth, currentDepth + 1)
        results.push(...subResults)
      } else if (entry.isFile()) {
        if (filePattern && !entry.name.match(new RegExp(filePattern.replace(/\*/g, ".*")))) {
          continue
        }

        try {
          const content = await readFileContent(fullPath)
          const lines = content.split("\n")
          const regex = new RegExp(pattern, "gi")

          for (let i = 0; i < lines.length; i++) {
            if (regex.test(lines[i])) {
              const relativePath = relative(process.cwd(), fullPath)
              results.push(`${relativePath}:${i + 1}: ${lines[i].trim()}`)
            }
          }
        } catch {
          // 忽略读取错误
        }
      }
    }
  } catch {
    // 忽略权限错误
  }

  return results
}

export async function executeGrep(
  params: z.infer<typeof grepParams>,
  context: ToolContext
): Promise<ToolResult> {
  try {
    const searchPath = params.path || context.workingDir

    log.debug(`搜索内容: ${params.pattern} 在 ${searchPath}`)

    const results = await grepRecursive(searchPath, params.pattern, params.filePattern)

    if (results.length === 0) {
      return {
        success: true,
        content: "未找到匹配的内容",
      }
    }

    return {
      success: true,
      content: results.slice(0, 100).join("\n"),
    }
  } catch (error: any) {
    return {
      success: false,
      content: "",
      error: `搜索内容失败: ${error.message}`,
    }
  }
}

export const grepTool: ToolDefinition = {
  name: "grep",
  description: "在文件中搜索文本内容。",
  parameters: grepParams,
  execute: executeGrep,
}
