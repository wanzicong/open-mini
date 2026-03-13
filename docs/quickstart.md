# 快速开始

本指南将帮助你快速上手 Open Mini。

## 前提条件

### 1. 安装 Bun

Open Mini 使用 Bun 作为运行时。

```bash
# macOS/Linux
curl -fsSL https://bun.sh/install | bash

# Windows (PowerShell)
irm bun.sh | iex
```

### 2. 克隆项目

```bash
git clone https://github.com/wanzicong/open-mini.git
cd open-mini
```

### 3. 安装依赖

```bash
bun install
```

## 配置

### 获取 API Key

1. 访问 [MiniMax 开放平台](https://platform.minimaxi.com)
2. 注册账号
3. 获取 API Key

### 配置 API Key

在项目根目录创建 `.env` 文件：

```
MINIMAX_API_KEY=你的API密钥
```

## 运行

### 方式一：单次任务

```bash
# 计算
bun run src/cli/index.ts "计算 123 + 456"

# 回答问题
bun run src/cli/index.ts "用一句话介绍 TypeScript"

# 创建文件
bun run src/cli/index.ts "创建 hello.txt，内容为 Hello World"
```

### 方式二：交互式对话

```bash
bun run src/cli/index.ts
```

输入你的问题，按 Enter 发送。

## 下一步

- 阅读 [使用指南](./使用指南.md) 了解更多功能
- 查看 [模型配置](./model-config.md) 了解如何选择模型
- 查看 [技术方案](./technical-design.md) 了解项目架构
