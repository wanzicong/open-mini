import { z } from "zod"
import type { ToolDefinition, ToolContext, ToolResult } from "./tool"
import { writeFileContent, fileExists } from "../util/file"
import { log } from "../util/log"

export const writeParams = z.object({
  filePath: z.string().optional().describe("文件的绝对路径或相对路径"),
  file: z.string().optional().describe("文件的绝对路径或相对路径"),
  path: z.string().optional().describe("文件的绝对路径或相对路径"),
  content: z.string().describe("文件内容"),
})

export async function executeWrite(
  params: z.infer<typeof writeParams>,
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
    if (exists) {
      log.debug(`覆盖文件: ${fullPath}`)
    } else {
      log.debug(`创建文件: ${fullPath}`)
    }

    await writeFileContent(fullPath, params.content)

    return {
      success: true,
      content: `文件已写入: ${fullPath}`,
    }
  } catch (error: any) {
    return {
      success: false,
      content: "",
      error: `写入文件失败: ${error.message}`,
    }
  }
}

export const writeTool: ToolDefinition = {
  name: "write",
  description: "创建新文件或覆盖已有文件的内容。",
  parameters: writeParams,
  execute: executeWrite,
}
