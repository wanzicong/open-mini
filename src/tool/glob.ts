import { z } from "zod"
import { minimatch } from "minimatch"
import { readdir, stat } from "fs/promises"
import { join, relative } from "path"
import type { ToolDefinition, ToolContext, ToolResult } from "./tool"
import { log } from "../util/log"

export const globParams = z.object({
  pattern: z.string().describe("文件匹配模式，如 **/*.ts"),
  path: z.string().optional().describe("搜索目录，默认为当前目录"),
})

async function globRecursive(
  dir: string,
  pattern: string,
  maxDepth: number = 10,
  currentDepth: number = 0
): Promise<string[]> {
  if (currentDepth > maxDepth) return []

  const results: string[] = []

  try {
    const entries = await readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = join(dir, entry.name)
      const relativePath = relative(process.cwd(), fullPath)

      if (minimatch(relativePath, pattern) || minimatch(relativePath, pattern.replace(/\*\*/g, "*"))) {
        results.push(fullPath)
      }

      if (entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "node_modules") {
        const subResults = await globRecursive(fullPath, pattern, maxDepth, currentDepth + 1)
        results.push(...subResults)
      }
    }
  } catch {
    // 忽略权限错误
  }

  return results
}

export async function executeGlob(
  params: z.infer<typeof globParams>,
  context: ToolContext
): Promise<ToolResult> {
  try {
    const searchPath = params.path || context.workingDir

    log.debug(`搜索文件: ${params.pattern} 在 ${searchPath}`)

    const results = await globRecursive(searchPath, params.pattern)

    if (results.length === 0) {
      return {
        success: true,
        content: "未找到匹配的文件",
      }
    }

    return {
      success: true,
      content: results.join("\n"),
    }
  } catch (error: any) {
    return {
      success: false,
      content: "",
      error: `搜索文件失败: ${error.message}`,
    }
  }
}

export const globTool: ToolDefinition = {
  name: "glob",
  description: "根据模式搜索文件。",
  parameters: globParams,
  execute: executeGlob,
}
