# Open-Mini 项目结构文档

## 项目概述

- **项目名称**: open-mini
- **版本**: 1.0.0
- **描述**: 极简版 AI 编程助手 - 只支持 MiniMax Code Plan CN
- **技术栈**: TypeScript / Bun / AI SDK

---

## 目录结构

```
open-mini/
├── .env                        # 环境变量配置
├── .gitignore                  # Git 忽略配置
├── .open-mini.json             # Open Mini 配置文件
├── package.json                # 项目依赖配置
├── tsconfig.json               # TypeScript 配置
├── bun.lock                    # Bun 锁文件
├── 技术方案.md                  # 技术方案文档
├── node_modules/               # 依赖包目录
└── src/
    ├── index.ts                # 项目入口文件
    ├── agent/                  # Agent 核心模块
    │   ├── index.ts            # Agent 模块导出
    │   └── agent.ts            # Agent 核心逻辑实现
    ├── cli/                    # CLI 命令行工具
    │   └── index.ts            # CLI 主入口
    ├── config/                 # 配置管理模块
    │   ├── index.ts            # 配置模块导出
    │   └── config.ts           # 配置加载和处理逻辑
    ├── provider/               # AI 提供商模块
    │   ├── index.ts            # Provider 模块导出
    │   └── minimax.ts          # MiniMax API 集成
    ├── tool/                   # 工具函数模块
    │   ├── index.ts            # 工具模块导出
    │   ├── tool.ts             # 工具基类定义
    │   ├── bash.ts             # Bash 命令执行工具
    │   ├── edit.ts             # 文件编辑工具
    │   ├── glob.ts             # 文件搜索工具
    │   ├── grep.ts             # 文本搜索工具
    │   ├── read.ts             # 文件读取工具
    │   └── write.ts            # 文件写入工具
    └── util/                   # 工具函数库
        ├── index.ts            # 工具函数导出
        ├── file.ts             # 文件操作工具
        └── log.ts              # 日志工具
```

---

## 模块说明

### 1. agent/ - Agent 核心模块
负责 AI Agent 的核心逻辑，包括任务规划、工具调用编排等功能。

### 2. cli/ - 命令行工具
提供交互式命令行界面，处理用户输入并调用 Agent 执行任务。

### 3. config/ - 配置管理
- 管理项目配置
- 加载 .open-mini.json 配置文件
- 处理环境变量

### 4. provider/ - AI 提供商
- **minimax.ts**: 集成 MiniMax API 的适配器
- 支持模型: MiniMax-M2.5-highspeed
- 支持自定义温度和最大 Token 数

### 5. tool/ - 工具集
提供 AI Agent 可调用的工具函数：

| 工具名称 | 功能描述 |
|---------|---------|
| bash | 执行终端命令 |
| edit | 编辑文件内容 |
| glob | 根据模式搜索文件 |
| grep | 在文件中搜索文本 |
| read | 读取文件内容 |
| write | 创建或覆盖文件 |

### 6. util/ - 工具函数库
- **file.ts**: 文件操作辅助函数
- **log.ts**: 日志输出工具

---

## 配置文件说明

### .open-mini.json
```json
{
  "model": "MiniMax-M2.5-highspeed",
  "temperature": 0.7,
  "maxTokens": 8192,
  "baseURL": "https://api.minimaxi.com/anthropic/v1"
}
```

### package.json 关键信息
- **入口文件**: src/index.ts
- **CLI 入口**: src/cli/index.ts
- **运行命令**: `bun run dev`
- **构建命令**: `bun build`

---

## 依赖关系

```
ai-sdk (核心 AI 框架)
  ├── @ai-sdk/openai-compatible (适配器)
  ├── zod (数据验证)
  ├── minimatch (文件匹配)
  ├── chokidar (文件监听)
  ├── fuzzysort (模糊搜索)
  ├── @clack/prompts (交互提示)
  └── picocolors (颜色输出)
```

---

## 注意事项

1. 本项目仅支持 MiniMax Code Plan CN
2. 需要在 .env 文件中配置 API Key
3. 使用 Bun 作为运行时和构建工具
4. 项目使用 ES Modules (type: "module")

---

*文档生成时间: 2024*
