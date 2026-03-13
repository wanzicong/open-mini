import { generateText, type LanguageModel } from "ai"

export interface MiniMaxModel {
  id: string
  name: string
  contextWindow: number
}

export const MODELS: Record<string, MiniMaxModel> = {
  "MiniMax-M2.5-highspeed": {
    id: "MiniMax-M2.5-highspeed",
    name: "MiniMax M2.5 Highspeed",
    contextWindow: 200000,
  },
  "MiniMax-Text-01": {
    id: "MiniMax-Text-01",
    name: "MiniMax Text 01",
    contextWindow: 128000,
  },
  "MiniMax-Code-Plan-Preview": {
    id: "MiniMax-Code-Plan-Preview",
    name: "MiniMax Code Plan Preview",
    contextWindow: 200000,
  },
}

export interface CreateMiniMaxOptions {
  apiKey: string
  model?: string
  baseURL?: string
}

export function createMiniMaxProvider(options: CreateMiniMaxOptions): LanguageModel {
  const model = options.model || "MiniMax-M2.5-highspeed"
  const baseURL = options.baseURL || "https://api.minimaxi.com/anthropic/v1"

  const modelInstance = {
    specificationVersion: "v2",
    provider: "minimax",
    modelId: model,
    supportedUrls: Promise.resolve({}),
    async doGenerate(opts: any) {
      const prompt = opts.prompt || []
      const messages = prompt.map((msg: any) => {
        if (msg.role === "system") {
          return { role: "user", content: msg.content }
        }
        return msg
      })

      const response = await fetch(`${baseURL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": options.apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model,
          max_tokens: 4096,
          messages,
        }),
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(`API Error: ${response.status} ${text}`)
      }

      const data: any = await response.json()
      
      const textContent = data.content?.find((c: any) => c.type === "text")
      const rawText = textContent?.text || ""
      
      const toolCallMatch = rawText.match(/<tool_call>\s*\{[\s\S]*?\}\s*<\/tool_call>/g)
      const hasToolCalls = toolCallMatch && toolCallMatch.length > 0
      
      return {
        content: [{ type: "text", text: rawText }],
        finishReason: hasToolCalls ? "tool_use" : (data.stop_reason || "stop"),
        usage: {
          promptTokens: data.usage?.input_tokens || 0,
          completionTokens: data.usage?.output_tokens || 0,
        },
        warnings: [],
      }
    },
    async doStream(opts: any) {
      throw new Error("Streaming not supported yet")
    },
  }

  return modelInstance as unknown as LanguageModel
}

export function getModel(modelId: string): MiniMaxModel | undefined {
  return MODELS[modelId]
}
