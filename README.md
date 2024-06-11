# flowmit

[![npm version][npm-version-badge]][npm-version-href]
[![install size][install-size-badge]][install-size-href]
[![jsdocs][jsdocs-badge]][jsdocs-href]
[![license][license-badge]][license-href]

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

You can configure `flowmit` by adding a `flowmit.config.ts`/`flowmit.config.js` file ~~in the root of~~ everywhere within your project. It means that, if you are in a monorepo, you can have multiple `flowmit.config.ts`/`flowmit.config.js` files in different packages to customize the commit message for each package.

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

<!-- Badge -->
[npm-version-badge]: https://img.shields.io/npm/v/flowmit?style=flat&color=ddd&labelColor=444
[npm-version-href]: https://www.npmjs.com/package/flowmit
[install-size-badge]: https://img.shields.io/badge/dynamic/json?url=https://packagephobia.com/v2/api.json?p=flowmit&query=$.install.pretty&label=install%20size&style=flat&color=ddd&labelColor=444
[install-size-href]: https://bundlephobia.com/result?p=flowmit
[jsdocs-badge]: https://img.shields.io/badge/jsDocs-reference-ddd?style=flat&color=ddd&labelColor=444
[jsdocs-href]: https://www.jsdocs.io/package/flowmit
[license-badge]: https://img.shields.io/github/license/Lu-Jiejie/flowmit?style=flat&color=ddd&labelColor=444
[license-href]: https://github.com/Lu-Jiejie/flowmit/blob/main/LICENSE
