export { readTool, readParams } from "./read"
export { writeTool, writeParams } from "./write"
export { editTool, editParams } from "./edit"
export { bashTool, bashParams } from "./bash"
export { globTool, globParams } from "./glob"
export { grepTool, grepParams } from "./grep"
export type { ToolDefinition, ToolContext, ToolResult } from "./tool"

import { readTool } from "./read"
import { writeTool } from "./write"
import { editTool } from "./edit"
import { bashTool } from "./bash"
import { globTool } from "./glob"
import { grepTool } from "./grep"

export const allTools = [
  readTool,
  writeTool,
  editTool,
  bashTool,
  globTool,
  grepTool,
]
