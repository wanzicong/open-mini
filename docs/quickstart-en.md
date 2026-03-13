# Quick Start

This guide will help you get started with Open Mini quickly.

## Prerequisites

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

## Configuration

### Get API Key

1. Visit [MiniMax Open Platform](https://platform.minimaxi.com)
2. Register an account
3. Get your API Key

### Configure API Key

Create `.env` file in project root:

```
MINIMAX_API_KEY=your_api_key
```

## Run

### Mode 1: Single Task

```bash
# Calculate
bun run src/cli/index.ts "Calculate 123 + 456"

# Answer question
bun run src/cli/index.ts "Introduce TypeScript in one sentence"

# Create file
bun run src/cli/index.ts "Create hello.txt with content Hello World"
```

### Mode 2: Interactive Chat

```bash
bun run src/cli/index.ts
```

Type your question and press Enter to send.

## Next Steps

- Read [User Guide](./user-guide.md) for more features
- Check [Model Config](./model-config-en.md) for model selection
- Check [Technical Design](./technical-design.md) for project architecture
