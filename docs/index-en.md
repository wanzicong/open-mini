# Open Mini

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
  <img src="https://img.shields.io/badge/typescript-5.7+-3178c6" alt="TypeScript">
  <img src="https://img.shields.io/badge/bun-1.3+-f9f1ed" alt="Bun">
</p>

> A minimalist AI coding assistant - supports MiniMax Code Plan CN only

[English](./docs/index-en.md) | [中文](./docs/index.md)

## Features

- 🤖 **Single Model Focus** - Only supports MiniMax Code Plan CN
- 💻 **Cross-Platform** - Windows, Linux, macOS
- 🔧 **6 Built-in Tools** - Read, Write, Edit, Bash, Glob, Grep
- 💬 **Interactive Chat** - Command line chat mode
- ⚡ **Fast Startup** - Lightweight, minimal dependencies

## Quick Start

```bash
# Clone project
git clone https://github.com/wanzicong/open-mini.git
cd open-mini

# Install dependencies
bun install

# Configure API Key (see: docs/model-config-en.md)
echo MINIMAX_API_KEY=your_key > .env

# Run
bun run src/cli/index.ts "Calculate 1+1"
```

## Documentation

| Document | Description |
|----------|-------------|
| [Quick Start](./docs/quickstart-en.md) | Quick start guide |
| [User Guide](./docs/user-guide.md) | Complete usage tutorial |
| [使用指南](./docs/使用指南.md) | 完整使用教程 (Chinese) |
| [Model Config](./docs/model-config-en.md) | Model configuration |
| [模型配置](./docs/model-config.md) | 模型配置说明 |
| [Technical Design](./docs/technical-design.md) | Technical design doc |

## Supported Tools

| Tool | Function |
|------|----------|
| `read` | Read file |
| `write` | Write file |
| `edit` | Edit file |
| `bash` | Execute command |
| `glob` | Search files |
| `grep` | Search content |

## License

MIT License

## Related Links

- [GitHub](https://github.com/wanzicong/open-mini)
- [MiniMax Open Platform](https://platform.minimaxi.com)
