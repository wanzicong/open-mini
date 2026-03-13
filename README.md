# Open Mini

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
  <img src="https://img.shields.io/badge/typescript-5.7+-3178c6" alt="TypeScript">
  <img src="https://img.shields.io/badge/bun-1.3+-f9f1ed" alt="Bun">
</p>

> 极简版 AI 编程助手 - 只支持 MiniMax Code Plan CN

## 特性

- 🤖 **单一模型专注** - 只支持 MiniMax Code Plan CN 模型
- 💻 **跨平台** - 支持 Windows、Linux、macOS
- 🔧 **6 个内置工具** - Read、Write、Edit、Bash、Glob、Grep
- 💬 **交互式对话** - 支持命令行交互模式
- ⚡ **快速启动** - 轻量级，依赖少

## 安装

```bash
# 克隆项目
git clone https://github.com/your-username/open-mini.git
cd open-mini

# 安装依赖
bun install
```

## 配置

### 1. 创建 .env 文件

在项目根目录创建 `.env` 文件：

```
MINIMAX_API_KEY=your_api_key_here
```

### 2. 可选配置文件

创建 `.open-mini.json` 配置文件：

```json
{
  "model": "MiniMax-M2.5-highspeed",
  "temperature": 0.7,
  "maxTokens": 8192,
  "baseURL": "https://api.minimaxi.com/anthropic/v1"
}
```

## 使用

### 命令行模式

```bash
# 计算
bun run src/cli/index.ts "计算 123 + 456"

# 回答问题
bun run src/cli/index.ts "用一句话介绍 TypeScript"

# 创建文件
bun run src/cli/index.ts "在当前目录创建 hello.txt，内容为 Hello World"

# 读取文件
bun run src/cli/index.ts "读取 package.json 文件"
```

### 交互式对话模式

```bash
# 启动交互式对话
bun run src/cli/index.ts

# 或使用 -i 参数
bun run src/cli/index.ts -i
```

交互式命令：
- `exit` / `quit` - 退出
- `clear` - 清除对话历史

### 命令行选项

```
-h, --help              显示帮助信息
-v, --version           显示版本号
-i, --interactive       交互式对话模式
--project <path>        指定项目目录
--model <model>         指定模型名称
--max-iterations <n>   最大迭代次数 (默认: 20)
```

## 支持的工具

| 工具 | 功能 | 示例 |
|------|------|------|
| `read` | 读取文件 | 读取 package.json |
| `write` | 写入文件 | 创建新文件 |
| `edit` | 编辑文件 | 修改文件内容 |
| `bash` | 执行命令 | 运行 npm install |
| `glob` | 搜索文件 | 查找 *.ts 文件 |
| `grep` | 搜索内容 | 在文件中搜索关键词 |

## 可用模型

| 模型名称 | 说明 |
|----------|------|
| `MiniMax-M2.5-highspeed` | MiniMax M2.5 高速版 (默认) |
| `MiniMax-Text-01` | MiniMax Text 01 |
| `MiniMax-Code-Plan-Preview` | MiniMax Code Plan 预览版 |

## 项目结构

```
open-mini/
├── src/
│   ├── agent/           # Agent 核心逻辑
│   ├── cli/             # CLI 入口
│   ├── config/          # 配置管理
│   ├── provider/       # MiniMax 集成
│   ├── tool/           # 工具集
│   └── util/            # 基础工具
├── .env                 # 环境变量 (不上传)
├── .gitignore          # Git 忽略配置
├── package.json
└── tsconfig.json
```

## 开发

```bash
# 类型检查
bun run typecheck

# 开发模式
bun run dev
```

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！
