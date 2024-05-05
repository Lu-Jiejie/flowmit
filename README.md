# flowmit

[![NPM Version](https://img.shields.io/npm/v/flowmit?style=flat&label=%20)](https://www.npmjs.com/package/flowmit)

English | [简体中文](./README.zh-CN.md)

~~*git commit -m "🦄"*~~

Commit like the flow in Git. 🌊

This is a CLI tool that helps you stage changes, generate the commit message in a flow, and commit them in one go.

## Installation

```bash
npm install -g flowmit

// or install in your project:
npm install -D flowmit
```

## Usage

Just run the alias `fm` in your terminal, then follow the instructions and you're good to go!

```bash
fm
```

If you installed it in your project, you can run it with:

```bash
npx flowmit
```
Or add it to your `package.json` scripts:

```json
{
  "scripts": {
    "commit": "flowmit"
  }
}
```

## Options

### --dry

If you only want to see the commit message without committing it, you can use the `--dry` option.

```bash
fm --dry
```

## Configuration

You can configure `flowmit` by adding a `flowmit.config.ts`/`flowmit.config.js` file in the root of your project.

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

## Why flowmit?

flow + commit = flowmit

A simple equation names a tool! 😎
