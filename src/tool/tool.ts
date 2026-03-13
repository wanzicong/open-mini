import { z } from "zod"

export interface ToolDefinition {
  name: string
  description: string
  parameters: z.ZodSchema
  execute: (params: any, context: ToolContext) => Promise<ToolResult>
}

export interface ToolContext {
  workingDir: string
}

export interface ToolResult {
  success: boolean
  content: string
  error?: string
}

export function createToolSchema(tools: ToolDefinition[]) {
  return z.object(
    tools.reduce((acc, tool) => {
      acc[tool.name] = tool.parameters
      return acc
    }, {} as Record<string, z.ZodSchema>)
  )
}

export function createToolsJsonSchema(tools: ToolDefinition[]) {
  return {
    type: "object",
    properties: tools.reduce((acc, tool) => {
      acc[tool.name] = {
        type: "object",
        properties: (tool.parameters as any).shape || {},
        required: Object.keys((tool.parameters as any).shape || {}),
      }
      return acc
    }, {} as Record<string, any>),
  }
}
