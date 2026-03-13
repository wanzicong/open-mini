import { z } from "zod"
import type { ToolDefinition, ToolContext, ToolResult } from "./tool"
import { readFileContent, writeFileContent, fileExists } from "../util/file"
import { log } from "../util/log"

export const editParams = z.object({
  filePath: z.string().describe("文件的绝对路径"),
  oldString: z.string().describe("要替换的原始文本"),
  newString: z.string().describe("替换后的新文本"),
})

export async function executeEdit(
  params: z.infer<typeof editParams>,
  context: ToolContext
): Promise<ToolResult> {
  try {
    const fullPath = params.filePath

    const exists = await fileExists(fullPath)
    if (!exists) {
      return {
        success: false,
        content: "",
        error: `文件不存在: ${fullPath}`,
      }
    }

    const content = await readFileContent(fullPath)

    if (!content.includes(params.oldString)) {
      return {
        success: false,
        content: "",
        error: `文件中未找到要替换的文本`,
      }
    }

    const newContent = content.replace(params.oldString, params.newString)
    await writeFileContent(fullPath, newContent)

    log.debug(`编辑文件: ${fullPath}`)

    return {
      success: true,
      content: `文件已修改: ${fullPath}`,
    }
  } catch (error: any) {
    return {
      success: false,
      content: "",
      error: `编辑文件失败: ${error.message}`,
    }
  }
}

export const editTool: ToolDefinition = {
  name: "edit",
  description: "编辑文件中已有的内容。使用精确匹配替换文本。",
  parameters: editParams,
  execute: executeEdit,
}
