---
title: "Cloudflare Zero Trust 实战：用 GitHub 登录 (支持 Passkeys) 保护你的个人站点"
date: "2025-12-05"
description: "记录一下我在 Cloudflare Zero Trust 配置 GitHub 登录实现 Passkeys 无感认证的登录我的个人管理站点的过程，帮助大家避开新版 UI 的坑。"
category: "technology"
---

最近我在折腾 Cloudflare Zero Trust，想给我的个人服务（YewFence）加一把锁。我的目标很明确：**既要安全，又要优雅。**

我不想要那种传统的“邮箱账号+验证码”形式，太麻烦。我希望能直接通过 **Passkeys 授权登录**，这样方便得多。虽然非常遗憾，Cloudflare Zero Trust 目前还不支持 Passkeys 登录，但是它支持 **GitHub 授权登录**。那么我就可以“曲线救国”——因为 GitHub 是支持 Passkeys 登录的。这样我就可以利用 **Windows Hello (人脸/指纹)** 或手机作为通行密钥，实现无感秒登。

但在配置过程中，我遇到了新版界面 UI 变动的大坑。为了防止大家走弯路，特此记录全流程。

## 0. 前置准备
* 一个托管在 Cloudflare 上的域名。
* Cloudflare Zero Trust 已经开通（Free Plan 足够用）。
* 一个 GitHub 账号。

## 1. 最大的坑：GitHub 登录选项去哪了？

如果你去搜以前的教程，或者尝试询问AI，它们都会告诉你去 `Settings` -> `Authentication` 添加 Identity Provider。**但在 2024/2025 年的新版 UI 中，这个入口不见了！**

如果你比较独立，想要自己探索这个入口，非常好，说干就干，你尝试在应用里找 **Login methods** 选项卡，发现它不能添加登录方法，只能减少。然后你点击**管理登录方式**，结果跳转到 **Access 设置**页，不是你想要的登陆方法配置，而是奇怪的多用户权限配置。你尝试直接搜索"登录"，但是一无所获。

你甚至怀疑人生，难道 Cloudflare 把这个功能给砍掉了？

答案是它没有砍掉，而是把入口挪到了一个超级隐蔽的位置，起了个超级奇怪的名称，还有超级奇怪的翻译
> 不是，没有任何一个直接的链接指向它，我真服了，我的两个小时啊

如果你的左侧菜单栏有 **Integrations : 集成** 这个选项（通常标着“New”），请直接点它。
然后点击 **Identity Providers : 标识提供程序**

在这里点击 **“Add new”** ，终于，我们见到了熟悉的 **GitHub**。

## 2. 配置 GitHub OAuth（连接“钥匙”）

选中 GitHub 后，Cloudflare 会要求你填 `App ID` 和 `Client Secret`。这时候别关页面，新开一个标签页去 GitHub：

1.  登录 GitHub，进入 **Settings** -> **Developer settings** -> **OAuth Apps**。
2.  点击 **New OAuth App**。
3.  **Application Name**：随便填，比如 `My Cloudflare Access`。
4.  **Homepage URL**：填写你的 Team 域名，这个域名你可以在你的 Zero Trust 面板的设置页面看到，类似 `https://yewyard.cloudflareaccess.com`。
5.  **Authorization callback URL**：这是最关键的一步！回到 Cloudflare 页面，复制它给你的 **Callback URL**，通常长这样：
    `https://<你的Team名>.cloudflareaccess.com/cdn-cgi/access/callback`
6.  注册后，GitHub 会生成 **Client ID** ，然后在下方点击 **Generate a new client secret**，把这个 ID 和密钥复制回 Cloudflare 并保存。

## 3. 绑定应用（安装“门锁”）

回到 Cloudflare Zero Trust 的 **Access** -> **Applications**，找到你要保护的应用，点击 **Configure**。

进入 **Login methods** 选项卡，此时你应该会看到刚才添加的 **GitHub** 选项已经被自动勾选了
> 因为Cloudflare会自动把你在 Identity Providers 里添加的登录方式同步过来。如果没有，手动勾选它。

## 4. 配置安全策略

**一定记得配置这个！**
仅仅添加 GitHub 登录是不够的，默认情况下这只验证了“此人有 GitHub 账号”，但地球上有几千万个 GitHub 账号。你需要限制**只有你**能进。

1.  切换到 **Policies** 选项卡。
2.  点击 **Add a policy**。
3.  **Action** 选 `Allow`。
4.  在 **Configure rules** 里：
    * **Selector**: 选择 `Emails`。
    * **Value**: **填入你自己的 GitHub 邮箱地址**。
5.  保存。

> **注意**：千万不要设置 `Include Everyone`，也不要只选 `GitHub` 而不指定邮箱，否则任何路人都能登录查看你的私有页面。

## 5. 测试登录

现在，当我访问我的受保护页面时：
1.  Cloudflare 拦截请求。
2.  点击 "Log in with GitHub"。
3.  跳转到 GitHub 授权页面，点击 "Sign in with a passkey"。
4.  GitHub 唤起 Windows Hello 进行生物识别（无需输入密码）。
5.  验证通过，自动跳转进入系统。

整个过程只需几秒钟，既满足了 Zero Trust 的安全性，又省心省力。
~~虽然配置这个的过程并非省心省力~~

### 总结：You Are the Key.

通过这种方式，我成功地利用 Cloudflare Zero Trust 和 GitHub 的 Passkeys 功能，为我的个人站点加上了一道坚固而优雅的防线。如果你也想保护你的私人服务，不妨试试这个方法！