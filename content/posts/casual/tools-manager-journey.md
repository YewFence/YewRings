---
title: "我的开发工具管理器变迁史：从官网下载到 mise 一统天下"
date: "2026-04-20"
description: "从官网手动下载安装包，到 pip / npm，再到 uv / pnpm，再到 scoop、fnm、brew，最后落脚到全平台的 mise——一段关于「环境管理」的折腾史。"
category: "casual"
---

> YewFence：你不会还在官网下载安装包吧？

来聊聊我这几个月在开发工具管理器上的折腾经历吧。

---

## 第一阶段：官网下载，下一步下一步

刚开始学编程的时候，装环境的方式非常朴素：

- 想用 Python？去 [python.org](https://www.python.org) 下个 installer，双击运行，一路下一步。
- 想用 Node？去 [nodejs.org](https://nodejs.org) 下个 LTS，双击运行，一路下一步。

装完之后再自己配一个环境变量，`pip install` 和 `npm install` 就能跑了，世界是美好的。

直到有一天我想升级 Python，发现新版本装上去之后，`python` 命令指向的还是旧的；又有一天我想换个 Node 版本试试新特性，结果项目跑挂了。

**问题来了**：版本切换全靠手动卸载重装，多个项目想用不同版本？做梦。

---

## 第二阶段：pip 与 npm，原生但缓慢

工具链上手之后，`pip` 和 `npm` 成了日常。它们能用，但也仅仅是「能用」：

- 在装了越来越多的工具之后， `pip list` 的列表直接堆积如山
- `npm install` 装一次 `node_modules` 要跑一万年。

在这阶段最大的进步是知道了「虚拟环境」这件事——`venv`，每个项目隔离起来，不再互相污染。但速度依然是个槽点。而且激活 `venv` 的过程也很蠢，`venv\scripts\activate.ps1`，每次都得记得激活。

---

## 第三阶段：uv 和 pnpm，速度的觉醒

后来 Rust 写的工具开始席卷一切，我先后换上了：

- **[uv](https://github.com/astral-sh/uv)**：Python 的依赖解析与安装，速度比 pip 快一个数量级。`uv pip install`、`uv venv`、`uv sync`，体验丝滑。
- **[pnpm](https://pnpm.io)**：通过硬链接 + 全局存储的方案，`node_modules` 不再是「世界上最重的物体」，装包速度也远超 npm。

这一阶段我意识到一件事：**慢，是可以被解决的**。

但新问题随之而来——下次换机器，我都要把 uv、pnpm、Node、Python、Git、各种 CLI 工具一个个重新装一遍，痛苦。

**「可迁移性」** 这个词第一次出现在我的脑海里。

---

## 第四阶段：Scoop 一统 Windows

在 Windows 上，我找到的答案是 **[Scoop](https://scoop.sh)**。

它的理念非常对我胃口：所有 CLI 工具都丢进 `~/scoop` 目录里，不污染系统、不要管理员权限、不写注册表。换机器只要装个 Scoop，然后：

```powershell
scoop install git fnm uv node python
```

一条命令，全副武装。

这个阶段我顺便做了一次「各语言的版本管理器」的拆分：

- **Node** 用 [fnm](https://github.com/Schniz/fnm)：快、轻量、支持 `.nvmrc` 自动切换。
- **Python** 用 uv：自带版本管理（`uv python install 3.12`），不用再装 pyenv。

这样终于解决了这个项目要 `Node 22` ，那个项目要 `Node 20` 的奇妙问题

这套组合在 Windows 上接近完美。

---

## 第五阶段：跨进 macOS / Linux，Brew 来了

后来我在机缘巧合下开始尝试在 macOS 和 Linux 上开发， **[Homebrew](https://brew.sh)** 自然成了新世界的 Scoop。

```bash
brew install git fnm uv node python
```

熟悉的配方，熟悉的味道。但问题也很明显，Windows 上是 Scoop 的语法，macOS / Linux 上是 Brew 的语法，`scoop update` vs `brew upgrade`。我可以轻松从 Windows 迁移到另一台 Windows，从 Mac / Linux 迁移到另一台 Mac / Linux，但跨平台迁移就麻烦了。

每次加新工具，我都要在两边各自安装，维护两套环境配置，我用管理器就是为了解决这个问题的，现在它在另一个角度又回来找我了。

---

## 第六阶段：mise，一个就够了

直到我遇到了 **[mise](https://mise.jdx.dev)** 。

mise 做的事情说起来很简单：用**一个**工具，在 **Windows / macOS / Linux** 上统一管理所有语言的版本和很多 CLI 工具。

三个平台，原生支持，统一的配置文件，统一的命令行工具，统一的语法：

```bash
mise use --global node@22 python@3.12 go@1.23
mise use --global pnpm uv ripgrep fd
```

它有好几个让我心动的点

1. **全平台一致**：同样的 `mise.toml`，在三个系统上都能用。
2. **项目级配置**：在项目根目录放一个 `mise.toml`，进入目录自动切换到对应版本，离开自动恢复。比 fnm 更通用——它管的不只是 Node。
3. **速度够快**：底层用 Rust 重写过，启动几乎无感。
4. **更多功能**：`mise run` 任务管理，我在写 Go 的时候终于不用怀念 `pnpm run test` 了；`mise env` 环境变量管理...

现在我的工具管理变成了：

- 系统级工具（git、neovim、wezterm 这种 GUI/底层工具）：还是交给 Scoop / Brew。
- 开发语言运行时 + 轻量 CLI：全部 mise。
- 一份 `~/.config/mise/config.toml` 走天下。

### 多后端原生支持

不仅如此，我之前想要发布一个自己的 CLI 工具，或者安装一个小众的 CLI 工具，要么就是把它塞进自己的 [scoop bucket](https://github.com/YewFence/YewNursery)，要么就是用第三方 `homebrew tap`，或者干脆使用开发者提供的安装脚本放在 GitHub 上让别人 `curl | sh`，虽然也不是不能用，但是很痛苦，我要维护三个源的工具，每个工具的升级都要在三个源上更新一遍。如果是别人的工具，我还得祈祷他们能同时维护三个源。

幸运的是，这一切都结束了，mise 支持大多数你想得到的源，和你想不到的源。

想要安装 Github 的 CLI 吗？

```bash
# 原生支持，直接从 Github Release 中下载并解析可执行文件，放到 PATH
# https://github.com/YewFence/ssh-config-manager
mise use -g github:YewFence/ssh-config-manager
```

或者那位开发者更喜欢 Node / Python / Rust / Go 生态？完全 OK

```bash
# https://github.com/abhigyanpatwari/GitNexus
mise use -g npm:gitnexus
# https://github.com/AptS-1547/gcop-rs
mise use -g cargo:gcop-rs
# https://github.com/goreleaser/goreleaser
mise use -g go:github.com/goreleaser/goreleaser/v2
# https://github.com/ansible/ansible
mise use -g pipx:ansible
```

还有[更多](https://mise.jdx.dev/dev-tools/backends)，mise 的开发者真的是天才

> 我前几天还在想它不支持 [forgejo](https://forgejo.org) 的 release，我还在认真思考我的那些仓库要不要干脆迁移到 Gitlab 好了，然后今天我写这篇文章的时刻，它已经支持了，传奇可扩展 Backends 设计。

---

## 总结

回头看这条路，其实每一步都不是「之前的工具不能用了」，而是「我对工具的需求变高了」：

| 阶段 | 我在追求什么 |
| --- | --- |
| 官网安装 | 能用就行 |
| pip / npm | 标准化工作流 |
| uv / pnpm | 速度 |
| Scoop / fnm | 可迁移性、不污染系统，多版本管理 |
| Brew | 跨到新平台后的「同款体验」 |
| mise | 跨平台、跨语言的统一抽象 |

折腾这些工具本身并不创造价值，但它让我每次换机器、换项目、换语言时少花一点时间在「环境怎么又坏了」上，多花一点时间在「我到底要写什么」上。

如果你也在 Scoop / Brew / nvm / pyenv / rbenv 之间反复横跳，不妨试试 mise——也许它就是你的终点站。

> 当然，下一个让我心动的工具出现之前是这样。
