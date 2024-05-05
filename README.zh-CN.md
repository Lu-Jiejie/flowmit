# flowmit

[![NPM Version](https://img.shields.io/npm/v/flowmit?style=flat&label=%20)](https://www.npmjs.com/package/flowmit)

[English](./README.md) | 简体中文

~~*git commit -m "🦄"*~~

在 Git 中像水流一样提交。🌊

这是一个 CLI 工具，可以帮助你在一个流程中暂存更改、生成提交消息并提交它们。

## 安装

```bash
npm install -g flowmit

// 或者在你的项目中安装：
npm install -D flowmit
```

## 使用

只需在终端中运行别名 `fm`，然后按照提示操作即可！

```bash
fm
```

如果你在你的项目中安装了它，你可以这样运行：

```bash
npx flowmit
```
或者将其添加到你的 `package.json` 脚本中：

```json
{
  "scripts": {
    "commit": "flowmit"
  }
}
```

## 选项

### --dry

如果你只想生成提交消息而不提交它，你可以使用 `--dry` 选项。

```bash
fm --dry
```

## 配置

你可以通过在你的项目根目录中添加一个 `flowmit.config.ts`/`flowmit.config.js` 文件来配置 `flowmit`。

```ts
// flowmit.config.ts
import { defineConfig } from './src/config'

export default defineConfig({
  // the types of commit messages you can choose from
  types: [
    { title: 'feat', value: 'feat', description: 'new features' },
    { title: 'fix', value: 'fix', description: 'fix a bug' },
  ],
  // the scopes of the commit messages you can choose from
  scopes: [
    'core',
    'cli',
  ],
  // like --dry option
  dry: true,
})
```

## 为什么叫 flowmit？

flow + commit = flowmit

一个简单的等式命名了一个工具！😎
