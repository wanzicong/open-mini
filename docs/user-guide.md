# Open Mini User Guide

## 1. Project Overview

**Open Mini** is a minimalist AI coding assistant that fully supports MiniMax Code Plan CN.

### Core Features

- 🤖 Single Model Focus - Only supports MiniMax Code Plan CN
- 💻 Cross-Platform - Windows, Linux, macOS
- 🔧 6 Built-in Tools - Read, Write, Edit, Bash, Glob, Grep
- 💬 Interactive Chat - Command line chat mode
- ⚡ Lightweight - Minimal dependencies, fast startup

---

## 2. Environment Setup

### 1. Install Bun

Open Mini uses Bun as runtime.

```bash
# macOS/Linux
curl -fsSL https://bun.sh/install | bash

# Windows (PowerShell)
irm bun.sh | iex
```

### 2. Clone Project

```bash
git clone https://github.com/wanzicong/open-mini.git
cd open-mini
```

### 3. Install Dependencies

```bash
bun install
```

### 4. Configure API Key

Create `.env` file in project root:

```
MINIMAX_API_KEY=your_api_key_here
```

> 📝 **Note**: `.env` file is already in `.gitignore`, won't be pushed to GitHub

---

## 3. Quick Start

### Mode 1: Single Task

```bash
# Calculate
bun run src/cli/index.ts "Calculate 123 + 456"

# Answer question
bun run src/cli/index.ts "Introduce TypeScript in one sentence"

# Create file
bun run src/cli/index.ts "Create hello.txt with content 'Hello World'"

# Read file
bun run src/cli/index.ts "Read package.json"

# Search files
bun run src/cli/index.ts "Find all .ts files in current directory"
```

### Mode 2: Interactive Chat

```bash
bun run src/cli/index.ts
# or
bun run src/cli/index.ts -i
```

Interactive commands:
- `exit` / `quit` - Exit program
- `clear` - Clear chat history

---

## 4. Command Line Arguments

| Argument | Short | Description | Example |
|----------|-------|-------------|---------|
| `--help` | `-h` | Show help | `bun run src/cli/index.ts --help` |
| `--version` | `-v` | Show version | `bun run src/cli/index.ts -v` |
| `--interactive` | `-i` | Interactive mode | `bun run src/cli/index.ts -i` |
| `--project` | - | Set project directory | `bun run src/cli/index.ts --project /path/to/project "task"` |
| `--model` | - | Set model | `bun run src/cli/index.ts --model MiniMax-M2.5-highspeed "task"` |
| `--max-iterations` | - | Max iterations | `bun run src/cli/index.ts --max-iterations 10 "task"` |

---

## 5. Configuration Files

### .open-mini.json

Create `.open-mini.json` in project root:

```json
{
  "model": "MiniMax-M2.5-highspeed",
  "temperature": 0.7,
  "maxTokens": 8192,
  "baseURL": "https://api.minimaxi.com/anthropic/v1"
}
```

### Available Config Options

| Config | Type | Default | Description |
|--------|------|---------|-------------|
| `model` | string | MiniMax-M2.5-highspeed | Model name |
| `temperature` | number | 0.7 | Temperature |
| `maxTokens` | number | 8192 | Max output tokens |
| `baseURL` | string | API URL | MiniMax API URL |

---

## 6. Available Models

| Model Name | Description | Context Window |
|------------|-------------|----------------|
| `MiniMax-M2.5-highspeed` | M2.5 Highspeed (default) | 200K |
| `MiniMax-Text-01` | Text 01 | 128K |
| `MiniMax-Code-Plan-Preview` | Code Plan Preview | 200K |

---

## 7. Tools Guide

### 1. read - Read File

Read content of specified file.

```
Parameters: filePath
Example: Read package.json
```

### 2. write - Write File

Create new file or overwrite existing file.

```
Parameters: filePath, content
Example: Create config.json
```

### 3. edit - Edit File

Precisely replace text in file.

```
Parameters: filePath, oldString, newString
Example: Modify specific text in file
```

### 4. bash - Execute Command

Execute command line commands.

```
Parameters: command
Example: Run npm install
```

### 5. glob - Search Files

Search files by pattern.

```
Parameters: pattern (e.g., **/*.ts)
Example: Find all TypeScript files
```

### 6. grep - Search Content

Search text content in files.

```
Parameters: pattern, filePattern
Example: Search for "function" in files
```

---

## 8. Usage Examples

### Example 1: Create Project

```
👤 You: Create a React project structure
👤 You: 
my-react-app/
├── src/
│   ├── App.jsx
│   └── index.jsx
├── public/
│   └── index.html
└── package.json
```

### Example 2: Code Review

```
👤 You: Read src/index.ts and review the code
```

### Example 3: Search Code

```
👤 You: Search all files containing "TODO"
```

### Example 4: Execute Command

```
👤 You: Run npm install to install dependencies
```

---

## 9. FAQ

### Q1: "MINIMAX_API_KEY not set" error

Create `.env` file and configure API Key:

```bash
echo MINIMAX_API_KEY=your_key > .env
```

### Q2: Command execution failed on Windows

AI model will automatically detect OS and generate appropriate commands. If issues occur, specify OS in your task.

### Q3: Tool executed multiple times

If AI keeps calling tools without returning results:
1. Try `--max-iterations 5` to limit iterations
2. Describe your requirements more clearly in the task

### Q4: Chat history too long

Use `clear` command or use single task mode.

---

## 10. Development

### Type Check

```bash
bun run typecheck
```

### Project Structure

```
open-mini/
├── src/
│   ├── agent/           # Agent core logic
│   ├── cli/            # CLI entry
│   ├── config/         # Configuration
│   ├── provider/       # MiniMax integration
│   ├── tool/           # Tools
│   └── util/           # Utilities
├── .env                # API Key (not committed)
├── .gitignore
├── package.json
└── README.md
```

---

## 11. License

MIT License

---

## 12. Contributing

Issues and Pull Requests are welcome!

- GitHub: https://github.com/wanzicong/open-mini
- Issues: https://github.com/wanzicong/open-mini/issues
