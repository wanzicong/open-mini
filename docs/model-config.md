# 模型配置指南

本文档详细介绍如何配置和使用 MiniMax 模型。

## 目录

1. [获取 API Key](#1-获取-api-key)
2. [配置方式](#2-配置方式)
3. [可用模型](#3-可用模型)
4. [配置示例](#4-配置示例)
5. [常见问题](#5-常见问题)

---

## 1. 获取 API Key

### 方式一：通过环境变量

在项目根目录创建 `.env` 文件：

```
MINIMAX_API_KEY=你的API密钥
```

### 方式二：配置文件

在 `.open-mini.json` 中配置：

```json
{
  "apiKey": "你的API密钥"
}
```

> ⚠️ **安全建议**：建议使用 `.env` 文件方式，因为 `.gitignore` 已配置不会上传

---

## 2. 配置方式

### 方式一：.env 文件（推荐）

在项目根目录创建 `.env` 文件：

```bash
# Windows
echo MINIMAX_API_KEY=你的密钥 > .env

# Linux/Mac
touch .env
echo "MINIMAX_API_KEY=你的密钥" > .env
```

### 方式二：.open-mini.json 配置文件

```json
{
  "apiKey": "你的API密钥",
  "model": "MiniMax-M2.5-highspeed",
  "baseURL": "https://api.minimaxi.com/anthropic/v1"
}
```

### 方式三：环境变量

```bash
# Windows (PowerShell)
$env:MINIMAX_API_KEY="你的密钥"

# Windows (CMD)
set MINIMAX_API_KEY=你的密钥

# Linux/Mac
export MINIMAX_API_KEY=你的密钥
```

---

## 3. 可用模型

| 模型名称 | 描述 | Context Window | 推荐场景 |
|----------|------|---------------|----------|
| `MiniMax-M2.5-highspeed` | M2.5 高速版 (默认) | 200K | 日常编程任务 |
| `MiniMax-Text-01` | Text 01 | 128K | 文本处理 |
| `MiniMax-Code-Plan-Preview` | Code Plan 预览版 | 200K | 代码生成 |

### 模型选择建议

- **日常编程**: 使用 `MiniMax-M2.5-highspeed`（默认）
- **复杂代码任务**: 使用 `MiniMax-Code-Plan-Preview`
- **文本处理**: 使用 `MiniMax-Text-01`

---

## 4. 配置示例

### 示例 1：基础配置

`.env` 文件：
```
MINIMAX_API_KEY=sk-xxx
```

### 示例 2：完整配置

`.open-mini.json` 文件：
```json
{
  "model": "MiniMax-M2.5-highspeed",
  "temperature": 0.7,
  "maxTokens": 8192,
  "baseURL": "https://api.minimaxi.com/anthropic/v1"
}
```

### 示例 3：命令行指定模型

```bash
bun run src/cli/index.ts --model MiniMax-Code-Plan-Preview "帮我写一个排序算法"
```

---

## 5. 常见问题

### Q1: 如何获取 MiniMax API Key？

访问 [MiniMax 开放平台](https://platform.minimaxi.com) 注册账号并获取 API Key。

### Q2: API Key 多少钱？

MiniMax 提供免费额度，具体费用请查看官方定价页面。

### Q3: 模型响应速度慢怎么办？

尝试使用 `MiniMax-M2.5-highspeed` 模型，它专门针对速度优化。

### Q4: 输出被截断怎么办？

在配置中增加 `maxTokens` 值：

```json
{
  "maxTokens": 16384
}
```

### Q5: 回答不够创意怎么办？

调整 `temperature` 参数：

```json
{
  "temperature": 0.9
}
```

| temperature 值 | 效果 |
|---------------|------|
| 0.1-0.3 | 更确定，更保守 |
| 0.7 | 平衡（默认） |
| 0.9-1.0 | 更随机，更有创意 |

---

## 相关链接

- MiniMax 官网: https://platform.minimaxi.com
- 项目 GitHub: https://github.com/wanzicong/open-mini
