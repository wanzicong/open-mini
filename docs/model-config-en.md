# Model Configuration Guide

This guide explains how to configure and use MiniMax models.

## Table of Contents

1. [Get API Key](#1-get-api-key)
2. [Configuration Methods](#2-configuration-methods)
3. [Available Models](#3-available-models)
4. [Configuration Examples](#4-configuration-examples)
5. [FAQ](#5-faq)

---

## 1. Get API Key

### Method 1: Environment Variable

Create `.env` file in project root:

```
MINIMAX_API_KEY=your_api_key
```

### Method 2: Config File

Configure in `.open-mini.json`:

```json
{
  "apiKey": "your_api_key"
}
```

> ⚠️ **Security Note**: Using `.env` file is recommended as it's already configured in `.gitignore` to prevent uploading

---

## 2. Configuration Methods

### Method 1: .env File (Recommended)

Create `.env` file in project root:

```bash
# Windows
echo MINIMAX_API_KEY=your_key > .env

# Linux/Mac
touch .env
echo "MINIMAX_API_KEY=your_key" > .env
```

### Method 2: .open-mini.json Config File

```json
{
  "apiKey": "your_api_key",
  "model": "MiniMax-M2.5-highspeed",
  "baseURL": "https://api.minimaxi.com/anthropic/v1"
}
```

### Method 3: Environment Variables

```bash
# Windows (PowerShell)
$env:MINIMAX_API_KEY="your_key"

# Windows (CMD)
set MINIMAX_API_KEY=your_key

# Linux/Mac
export MINIMAX_API_KEY=your_key
```

---

## 3. Available Models

| Model Name | Description | Context Window | Recommended For |
|------------|-------------|----------------|-----------------|
| `MiniMax-M2.5-highspeed` | M2.5 Highspeed (default) | 200K | Daily coding tasks |
| `MiniMax-Text-01` | Text 01 | 128K | Text processing |
| `MiniMax-Code-Plan-Preview` | Code Plan Preview | 200K | Code generation |

### Model Selection Guide

- **Daily Coding**: Use `MiniMax-M2.5-highspeed` (default)
- **Complex Code Tasks**: Use `MiniMax-Code-Plan-Preview`
- **Text Processing**: Use `MiniMax-Text-01`

---

## 4. Configuration Examples

### Example 1: Basic Configuration

`.env` file:
```
MINIMAX_API_KEY=sk-xxx
```

### Example 2: Full Configuration

`.open-mini.json` file:
```json
{
  "model": "MiniMax-M2.5-highspeed",
  "temperature": 0.7,
  "maxTokens": 8192,
  "baseURL": "https://api.minimaxi.com/anthropic/v1"
}
```

### Example 3: Specify Model via Command Line

```bash
bun run src/cli/index.ts --model MiniMax-Code-Plan-Preview "Write a sorting algorithm for me"
```

---

## 5. FAQ

### Q1: How to get MiniMax API Key?

Visit [MiniMax Open Platform](https://platform.minimaxi.com) to register and get your API Key.

### Q2: How much does API Key cost?

MiniMax provides free credits. Check the official pricing page for details.

### Q3: Model response is slow?

Try using `MiniMax-M2.5-highspeed` model, which is optimized for speed.

### Q4: Output is truncated?

Increase `maxTokens` in config:

```json
{
  "maxTokens": 16384
}
```

### Q5: Responses not creative enough?

Adjust `temperature` parameter:

```json
{
  "temperature": 0.9
}
```

| Temperature | Effect |
|-------------|--------|
| 0.1-0.3 | More deterministic, conservative |
| 0.7 | Balanced (default) |
| 0.9-1.0 | More random, creative |

---

## Related Links

- MiniMax Official: https://platform.minimaxi.com
- Project GitHub: https://github.com/wanzicong/open-mini
