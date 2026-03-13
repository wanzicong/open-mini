# Open Mini

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
  <img src="https://img.shields.io/badge/typescript-5.7+-3178c6" alt="TypeScript">
  <img src="https://img.shields.io/badge/bun-1.3+-f9f1ed" alt="Bun">
</p>

> 极简版 AI 编程助手 - 只支持 MiniMax Code Plan CN

[English](./docs/user-guide.md) | [中文](./docs/使用指南.md)

## 特性

- 🤖 **单一模型专注** - 只支持 MiniMax Code Plan CN 模型
- 💻 **跨平台** - 支持 Windows、Linux、macOS
- 🔧 **6 个内置工具** - Read、Write、Edit，Bash、Glob、Grep
- 💬 **交互式对话** - 支持命令行交互模式
- ⚡ **快速启动** - 轻量级，依赖少

## 快速开始

```bash
# 克隆项目
git clone https://github.com/wanzicong/open-mini.git
cd open-mini

# 安装依赖
bun install

# 配置 API Key (见文档: docs/model-config.md)
echo MINIMAX_API_KEY=你的密钥 > .env

# 运行
bun run src/cli/index.ts "计算 1+1"
```

## 文档

| 文档 | 说明 |
|------|------|
| [使用指南](./docs/使用指南.md) | 完整使用教程 (中文) |
| [User Guide](./docs/user-guide.md) | Complete usage tutorial (English) |
| [模型配置指南](./docs/model-config.md) | 模型配置说明 (中文) |
| [Model Config Guide](./docs/model-config-en.md) | Model configuration (English) |

## 支持的工具

| 工具 | 功能 |
|------|------|
| `read` | 读取文件 |
| `write` | 写入文件 |
| `edit` | 编辑文件 |
| `bash` | 执行命令 |
| `glob` | 搜索文件 |
| `grep` | 搜索内容 |

## 许可证

MIT License

## 相关链接

- [GitHub](https://github.com/wanzicong/open-mini)
- [MiniMax 开放平台](https://platform.minimaxi.com)
