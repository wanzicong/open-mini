import { z } from "zod"
import type { ToolDefinition, ToolContext, ToolResult } from "./tool"
import { readFileContent, fileExists } from "../util/file"
import { log } from "../util/log"

export const readParams = z.object({
  filePath: z.string().optional().describe("文件的绝对路径或相对路径"),
  file: z.string().optional().describe("文件的绝对路径或相对路径"),
  path: z.string().optional().describe("文件的绝对路径或相对路径"),
  offset: z.number().optional().describe("起始行号 (1-based)"),
  limit: z.number().optional().describe("读取行数限制"),
})

export async function executeRead(
  params: z.infer<typeof readParams>,
  context: ToolContext
): Promise<ToolResult> {
  try {
    const fullPath = params.filePath || params.file || params.path || ""
    
    if (!fullPath) {
      return {
        success: false,
        content: "",
        error: "未提供文件路径",
      }
    }

    const exists = await fileExists(fullPath)

    if (!exists) {
      return {
        success: false,
        content: "",
        error: `文件不存在: ${fullPath}`,
      }
    }

    const content = await readFileContent(fullPath)
    const lines = content.split("\n")

    let result = lines
    if (params.offset !== undefined) {
      const start = Math.max(0, params.offset - 1)
      if (params.limit !== undefined) {
        result = lines.slice(start, start + params.limit)
      } else {
        result = lines.slice(start)
      }
    } else if (params.limit !== undefined) {
      result = lines.slice(0, params.limit)
    }

    const displayContent = result.join("\n")
    const lineInfo = params.offset
      ? ` (行 ${params.offset}-${params.offset + result.length - 1})`
      : ""

    log.debug(`读取文件: ${fullPath}${lineInfo}, ${result.length} 行`)

    return {
      success: true,
      content: displayContent || "(空文件)",
    }
  } catch (error: any) {
    return {
      success: false,
      content: "",
      error: `读取文件失败: ${error.message}`,
    }
  }
}

export const readTool: ToolDefinition = {
  name: "read",
  description: "读取文件的指定内容。适用于查看代码、配置文件等。",
  parameters: readParams,
  execute: executeRead,
}
