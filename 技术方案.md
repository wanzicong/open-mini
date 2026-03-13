# Open Mini 技术方案

## 1. 项目概述

**项目名称**: Open Mini  
**项目定位**: 极简版 AI 编程助手，只支持 MiniMax Code Plan CN 模型  
**核心理念**: 简化、专注、可扩展

## 2. 技术架构

### 2.1 系统架构图

```
┌─────────────────────────────────────────────────────────┐
│                      CLI 层                              │
│                  (命令行交互入口)                          │
├─────────────────────────────────────────────────────────┤
│                      Agent 层                            │
│              (核心Agent逻辑 + 工具编排)                    │
├─────────────────────────────────────────────────────────┤
│                    Provider 层                           │
│              (MiniMax Code Plan CN 集成)                 │
├─────────────────────────────────────────────────────────┤
│                     Tool 层                              │
│       (Read/Edit/Write/Bash/Glob/Grep 等基础工具)         │
├─────────────────────────────────────────────────────────┤
│                     Util 层                              │
│           (配置、文件操作、日志等基础工具)                  │
└─────────────────────────────────────────────────────────┘
```

### 2.2 技术栈

- **运行时**: Bun (与 OpenCode 保持一致)
- **语言**: TypeScript
- **AI SDK**: Vercel AI SDK (`ai` 包)
- **模型集成**: OpenAI Compatible 模式调用 MiniMax API

### 2.3 目录结构

```
open-mini/
├── src/
│   ├── cli/
│   │   └── index.ts          # CLI 入口
│   ├── agent/
│   │   ├── agent.ts         # Agent 核心逻辑
│   │   └── prompt.ts        # System Prompt
│   ├── provider/
│   │   └── minimax.ts       # MiniMax Provider 实现
│   ├── tool/
│   │   ├── tool.ts          # 工具基类定义
│   │   ├── read.ts          # 读取文件
│   │   ├── edit.ts          # 编辑文件
│   │   ├── write.ts         # 写入文件
│   │   ├── bash.ts          # 执行命令
│   │   ├── glob.ts          # 文件搜索
│   │   └── grep.ts          # 内容搜索
│   ├── config/
│   │   └── config.ts        # 配置管理
│   └── util/
│       ├── log.ts           # 日志
│       └── file.ts          # 文件操作
├── package.json
└── tsconfig.json
```

## 3. 核心模块设计

### 3.1 Provider 模块 (MiniMax 集成)

```typescript
// src/provider/minimax.ts
import { createOpenAICompatible } from "@ai-sdk/openai-compatible"

export const MiniMaxProvider = createOpenAICompatible({
  name: "minimax",
  baseURL: "https://api.minimax.chat/v1",
  apiKey: process.env.MINIMAX_API_KEY,
  headers: {
    "Content-Type": "application/json",
  },
})

// 支持的模型
export const MODELS = {
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
```

### 3.2 Tool 模块

```typescript
// 工具定义规范
interface Tool {
  name: string
  description: string
  schema: z.ZodSchema
  execute: (params: z.infer<typeof schema>) => Promise<ToolResult>
}

// 核心工具列表
export const TOOLS = [
  {
    name: "read",
    description: "读取文件内容",
    schema: z.object({
      filePath: z.string(),
      offset: z.number().optional(),
      limit: z.number().optional(),
    }),
    execute: async ({ filePath }) => { ... }
  },
  {
    name: "edit",
    description: "编辑文件内容",
    schema: z.object({
      filePath: z.string(),
      oldString: z.string(),
      newString: z.string(),
    }),
    execute: async ({ filePath, oldString, newString }) => { ... }
  },
  // ... 其他工具
]
```

### 3.3 Agent 模块

```typescript
// Agent 核心逻辑
class Agent {
  private model: LanguageModel
  private tools: Tool[]
  
  async run(prompt: string): Promise<string> {
    // 1. 构建消息
    const messages: Message[] = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: prompt }
    ]
    
    // 2. 循环调用模型 + 工具
    while (true) {
      const response = await this.model.doGenerate({
        messages,
        tools: this.tools.map(toolSchema),
      })
      
      const { toolCalls, content } = response
      
      if (!toolCalls || toolCalls.length === 0) {
        return content
      }
      
      // 执行工具
      for (const call of toolCalls) {
        const result = await this.executeTool(call)
        messages.push(
          { role: "assistant", toolCalls: [call] },
          { role: "tool", toolCallId: call.id, content: result }
        )
      }
    }
  }
}
```

## 4. 配置设计

### 4.1 环境变量

```bash
# MiniMax 配置
MINIMAX_API_KEY=your_api_key
MINIMAX_MODEL=MiniMax-Code-Plan-Preview
```

### 4.2 配置文件 (open-mini.json)

```json
{
  "model": "MiniMax-Code-Plan-Preview",
  "temperature": 0.7,
  "maxTokens": 8192
}
```

## 5. CLI 设计

### 5.1 命令行接口

```bash
# 交互式模式
open-mini

# 指定任务模式
open-mini "帮我写一个 Hello World"

# 指定项目目录
open-mini --project /path/to/project "帮我重构这段代码"

# 查看版本
open-mini --version
```

## 6. 与 OpenCode 的对比

| 特性 | OpenCode | Open Mini |
|------|----------|-----------|
| 支持模型数 | 75+ | 1 (MiniMax) |
| 支持 MCP | 是 | 否 |
| 多会话 | 是 | 否 |
| LSP 集成 | 是 | 简化版 |
| 插件系统 | 是 | 否 |
| 数据库 | SQLite | 无 |
| 复杂度 | 高 | 低 |

## 7. 实现优先级

### Phase 1: 核心功能
1. 项目初始化
2. MiniMax Provider 集成
3. 基础工具 (Read/Edit/Write/Bash)
4. CLI 入口

### Phase 2: 增强功能
1. Glob/Grep 工具
2. 交互式模式
3. 配置管理

### Phase 3: 优化
1. 流式输出
2. 错误处理优化
3. 单元测试

## 8. 依赖精简

相比 OpenCode 的 100+ 依赖，Open Mini 只需要：

```json
{
  "dependencies": {
    "ai": "latest",
    "@ai-sdk/openai-compatible": "latest",
    "zod": "latest",
    "minimatch": "latest",
    "chokidar": "latest",
    "fuzzysort": "latest",
    "clack": "latest"
  }
}
```

## 9. 扩展性设计

虽然当前只支持 MiniMax，但架构上预留了多提供商支持：

```typescript
// 未来可扩展
interface Provider {
  name: string
  create: (config: ProviderConfig) => LanguageModel
}

const PROVIDERS: Record<string, Provider> = {
  minimax: { name: "minimax", create: createMiniMax },
  // future: { name: "anthropic", create: createAnthropic },
}
```

## 10. 总结

Open Mini 是一个极简化的 AI 编程助手，核心特性：
- 单一模型专注 (MiniMax Code Plan CN)
- 精简的代码结构 (约 2000 行 vs OpenCode 50000+ 行)
- 快速启动和开发
- 保留核心 Agent 能力 (工具调用 + 推理)
- 易于维护和扩展
