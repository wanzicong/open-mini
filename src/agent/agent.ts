import { generateText } from "ai"
import type { LanguageModel } from "ai"
import type { ToolDefinition, ToolContext } from "../tool"
import { log } from "../util/log"

export interface AgentOptions {
  model: LanguageModel
  tools: ToolDefinition[]
  systemPrompt?: string
  maxIterations?: number
  workingDir?: string
}

interface ToolCallMatch {
  tool: string
  args: Record<string, any>
}

export class Agent {
  private model: LanguageModel
  private tools: ToolDefinition[]
  private systemPrompt: string
  private maxIterations: number
  private workingDir: string

  constructor(options: AgentOptions) {
    this.model = options.model
    this.tools = options.tools
    this.systemPrompt = options.systemPrompt || DEFAULT_SYSTEM_PROMPT
    this.maxIterations = options.maxIterations || 20
    this.workingDir = options.workingDir || process.cwd()
  }

  async run(prompt: string): Promise<string> {
    let conversationHistory: string[] = []

    let iterations = 0

    while (iterations < this.maxIterations) {
      iterations++
      log.info(`第 ${iterations} 轮对话`)

      const tools = this.createTools() as any

      let userMessage = prompt
      if (conversationHistory.length > 0) {
        userMessage = `之前的对话历史:\n${conversationHistory.join("\n")}\n\n用户新请求: ${prompt}`
      }

      try {
        const result = await generateText({
          model: this.model,
          messages: [
            { role: "system", content: this.systemPrompt },
            { role: "user", content: userMessage },
          ],
          tools,
        } as any)

        const responseText = result.text
        const toolCalls = this.parseToolCalls(responseText)

        if (toolCalls.length === 0) {
          return responseText
        }

        conversationHistory.push(`用户: ${userMessage}`)
        conversationHistory.push(`助手: ${responseText}`)

        for (const call of toolCalls) {
          const tool = this.tools.find(t => t.name === call.tool)
          
          if (!tool) {
            log.error(`未找到工具: ${call.tool}`)
            conversationHistory.push(`工具错误: 未找到工具 ${call.tool}`)
            continue
          }

          log.info(`执行工具: ${tool.name}`, call.args)

          try {
            const context: ToolContext = { workingDir: this.workingDir }
            const toolResult = await tool.execute(call.args, context)

            if (toolResult.success) {
              log.success(`工具执行成功: ${tool.name}`)
              conversationHistory.push(`工具 ${tool.name} 执行结果: ${toolResult.content}`)
            } else {
              log.error(`工具执行失败: ${toolResult.error}`)
              conversationHistory.push(`工具 ${tool.name} 执行失败: ${toolResult.error}`)
            }
          } catch (error: any) {
            log.error(`工具执行异常: ${error.message}`)
            conversationHistory.push(`工具 ${tool.name} 执行异常: ${error.message}`)
          }
        }
      } catch (error: any) {
        log.error(`生成失败: ${error.message}`)
        return `执行出错: ${error.message}`
      }
    }

    log.warn("达到最大迭代次数")
    return "达到最大迭代次数"
  }

  private parseToolCalls(text: string): ToolCallMatch[] {
    const results: ToolCallMatch[] = []
    const regex = /<tool_call>\s*\{([\s\S]*?)\}\s*<\/tool_call>/g
    let match

    while ((match = regex.exec(text)) !== null) {
      try {
        const toolJson = "{" + match[1] + "}"
        const parsed = JSON.parse(toolJson)
        if (parsed.tool && parsed.args) {
          results.push({
            tool: parsed.tool,
            args: parsed.args,
          })
        }
      } catch (e) {
        log.debug(`解析工具调用失败: ${match[0]}`)
      }
    }

    if (results.length === 0) {
      const jsonMatch = text.match(/\{[\s\S]*"tool"\s*:\s*"\w+"[\s\S]*\}/)
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0])
          if (parsed.tool && parsed.args) {
            results.push({
              tool: parsed.tool,
              args: parsed.args,
            })
          }
        } catch (e) {}
      }
    }

    return results
  }

  private createTools() {
    const tools: Record<string, any> = {}

    for (const tool of this.tools) {
      tools[tool.name] = {
        description: tool.description,
        parameters: tool.parameters,
        execute: async ({ args }: { args: Record<string, any> }) => {
          const context: ToolContext = { workingDir: this.workingDir }
          const result = await tool.execute(args, context)
          return result.success ? result.content : `错误: ${result.error}`
        },
      }
    }

    return tools
  }
}

const DEFAULT_SYSTEM_PROMPT = `你是一个专业的 AI 编程助手，专注于帮助用户完成编程任务。

你可以通过以下工具来完成任务：

1. read - 读取文件内容，参数: filePath
2. write - 创建或覆盖文件，参数: filePath, content  
3. edit - 编辑文件内容，参数: filePath, oldString, newString
4. bash - 执行命令行命令，参数: command
5. glob - 根据模式搜索文件，参数: pattern
6. grep - 在文件中搜索文本，参数: pattern

重要提示：
- 你必须使用工具来完成任务，不能只是返回文本
- 在执行任何可能产生副作用的操作前（如修改文件、执行命令），先确认这是必要的
- 使用以下 XML 格式调用工具，不要使用代码块：
<tool_call>
{"tool": "工具名", "args": {"参数1": "值1", "参数2": "值2"}}
</tool_call>

操作系统判断：
- 如果用户使用的是 Windows 系统，使用 Windows 命令（如 dir, type, findstr）
- 如果用户使用的是 Linux/Mac 系统，使用 Unix 命令（如 ls, cat, grep）
- 禁止在 Windows 上使用 Linux 命令（如 find, grep）

请用中文回复。`
