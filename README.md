# Open Mini

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
  <img src="https://img.shields.io/badge/typescript-5.7+-3178c6" alt="TypeScript">
  <img src="https://img.shields.io/badge/bun-1.3+-f9f1ed" alt="Bun">
</p>

> 极简版 AI 编程助手 - 只支持 MiniMax Code Plan CN

[English](./docs/index-en.md) | [中文](./docs/index.md)

## 快速开始

```bash
# 克隆项目
git clone https://github.com/wanzicong/open-mini.git
cd open-mini

# 安装依赖
bun install

# 配置 API Key
echo MINIMAX_API_KEY=your_key > .env

# 运行
bun run src/cli/index.ts "计算 1+1"
```

## 文档

| 文档 | 说明 |
|------|------|
| [快速开始](./docs/quickstart.md) | 5分钟快速上手 |
| [使用指南](./docs/使用指南.md) | 完整使用教程 |
| [User Guide](./docs/user-guide.md) | Complete usage tutorial |
| [模型配置](./docs/model-config.md) | 模型配置说明 |
| [Technical Design](./docs/technical-design.md) | 技术方案 |

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
