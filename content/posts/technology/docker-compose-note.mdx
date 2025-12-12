---
title: "Docker Compose 基本用法"
date: "2025-11-04"
description: "告别冗长的 docker run 命令！本文介绍 Docker Compose 的配置文件写法、核心命令和常用操作流程，适合有 Docker 基础的初学者快速上手。"
category: "technology"
---

> YewFence：你每一次都非得敲这么长一段命令吗？

来使用`docker compose`吧！
> 首先，你需要了解Docker的基础知识  
> 推荐阅读[Docker 入门指南](https://www.esaps.net/working-with-docker-first-encounter/)，实际上网上也有很多入门教程，在此不过多赘述  
> 接下来我**不会**涉及一些Docker的基础知识  
> 另外，我也只是初学者，这些更多是笔记性质，如有错误欢迎提出  

## Docker compose是什么？
`docker compose`是用于定义和运行多容器 Docker 应用程序的工具。通过一个 `docker-compose.yml` 配置文件，你就可以用一个命令来创建和启动多个**服务**。
> 实际上你可以理解为，把`docker run`的那一长串命令打包进了一个文件

---

## 常用配置

既然说它把那一长串 `docker run` 收纳到了一个文件里，那这个文件到底长啥样？来一个常见的“家常版”：

```yaml
# docker-compose.yml
services:
    web:
        build: 
            context: .
            dockerfile: Dockerfile
        image: my-web:latest
        container_name: my-web
        ports:
            - "3000:3000"         # 主机:容器
        environment:
            - NODE_ENV=production
            - API_BASE=https://api.example.com
            - API_KEY=${API_KEY}   # 从 .env 或系统环境变量替换 
        volumes:
            - ./:/app             # 把代码挂进容器（开发用）
            - ./node_modules:/app/node_modules
        depends_on:
            - db                  # 先等等数据库
        restart: unless-stopped

    db:
        image: postgres:16
        container_name: my-db
        environment:
            POSTGRES_DB: appdb
            POSTGRES_USER: appuser
            POSTGRES_PASSWORD: supersecret
        volumes:
            # 把数据直接挂载到当前目录的data文件夹下
            - ./data:/var/lib/postgresql/data 
        ports:
            - "5432:5432"
        restart: unless-stopped
networks:
    default:
        name: my-net
```

很长？没事，让我们慢慢拆解：

- `services`: 你要跑的每个服务都写这里，像 `web`、`db`，它们每一个都是一个容器
- `build`/`image`: 两种来源，要么用代码现编，要么从网上拉镜像下来用。
  - `build`：指定构建镜像的上下文和Dockerfile路径
  - `image`：指定要使用的镜像名称和标签
- `container_name`：想要给自己的容器起个好名字吗？ `container_name` 字段如你所愿
- `ports`: 端口映射，格式是 `宿主:容器`，网络访问容器内服务的方便方法
- `environment`: 环境变量，支持 `KEY=value` 或映射两种写法。想保密？把它写在项目根目录的 `.env`，再用 `${VAR_NAME}` 做变量替换。
- `volumes`: 数据要命，对于初学者，这边建议使用挂载卷而不是命名卷，这样就可以直接打包带走你的所有数据，也能在容器外方便地管理你的数据
- `depends_on`: 只是“先后顺序”，不是“准备好了”。真的要等另一个服务可用的话，请在应用里加重试或健康检查。
- `restart`: 贴心的“自动重启”。开发用 `no`，生产建议 `unless-stopped` 或 `always`。
- `networks`: 给容器一个局域网；默认一个 `default` 就够用，可以直接省略，进阶一点也可以连上其他 docker compose 的网络实现通信，在此不多赘述。

> 想知道进阶的网络通信的使用场景，请参考文章后记
> 想要了解healthcheck配置，请参考[官方文档](https://docs.docker.com/compose/compose-file/compose-file-v3/#healthcheck) ~~主要是健康检查好长会很占位置~~

#### 自定义配置
有些时候项目可能会有默认的docker-compose配置，但你想在本地开发时覆盖一些设置，比如挂载卷、端口映射等。这时你可以创建一个 `docker-compose.override.yml` 文件，Docker Compose 会自动加载它并覆盖对应的默认配置。

还是拿刚才的例子来说，你可以创建一个 `docker-compose.override.yml` 文件，内容如下：

```yaml
services:
    web:
        volumes:
            - ./data/:/app/data   # 挂载不同位置的数据文件夹
        ports:
            - "3001:3000"         # 自定义映射端口
```

#### 最后，一点生产环境注意事项

- 镜像版本请固定（比如 `postgres:16.3`），不要无脑 `latest`
- 记得备份你的数据卷
- 敏感信息一定要放进 `.env`
- 健康检查很重要，不然你每次都得自己检查，很烦的

---------

## 常用命令
### 🚀 核心命令

启动！ / 停止

* **`docker compose up`**
    * **功能：** 这是最核心的命令。它会根据 `docker-compose.yml` 文件**创建并启动**所有的服务（容器）、网络和卷。
    * **常用选项：**
        * `-d` (detached): 在后台（分离模式）运行容器，这样你的终端就不会被日志占满。
        * `--build`: 在启动容器之前强制重新构建镜像，即使本地已有镜像。
> 请注意，当Dockerfile变更时千万记得添加`--build`，不要问为什么 ~~三个小时的教训~~

* **`docker compose down`**
    * **功能：** **停止并移除**由 `up` 命令创建的所有容器、网络。
    * **常用选项：**
        * `-v` (volumes): 同时移除在 `volumes` 配置中定义的命名卷（**注意：这会导致数据丢失**）。
        * `--rmi all`: 移除所有服务使用的镜像。

---

### ⏱️ 状态与日志

当启动完了之后你肯定得看看它啥情况吧：

* **`docker compose ps`**
    * **功能：** 列出**当前** Compose 项目中所有正在运行的容器及其状态。

* **`docker compose logs`**
    * **功能：** 查看所有服务（或指定服务）的日志输出。
    * **常用选项：**
        * `-f` (follow): 实时跟踪并输出新日志。
        * `[SERVICE_NAME]`: 只查看特定服务的日志，例如 `docker compose logs web`。

---

### 🛠️ 服务管理

如果你只是想控制其中的几个服务也很简单：

* **`docker compose start [SERVICE_NAME]`**
    * **功能：** 启动一个或多个已经存在但已停止的服务。如果省略服务名，则启动所有服务。

* **`docker compose stop [SERVICE_NAME]`**
    * **功能：** 停止一个或多个正在运行的服务，但**不会移除**它们。

* **`docker compose restart [SERVICE_NAME]`**
    * **功能：** 重启一个或多个服务。

* **`docker compose pause [SERVICE_NAME]`**
    * **功能：** 暂停一个或多个正在运行的服务。

* **`docker compose unpause [SERVICE_NAME]`**
    * **功能：** 恢复被暂停的服务。

---

### 📦 关于镜像

与普通Docker命令类似的，对于镜像：

* **`docker compose build [SERVICE_NAME]`**
    * **功能：** 根据 `docker-compose.yml` 中的 `build` 配置来构建或重新构建服务的镜像。

* **`docker compose pull [SERVICE_NAME]`**
    * **功能：** 拉取服务所需的所有镜像（或指定服务的镜像），通常用于更新到最新版本。

### 😢 调试

对于调试也是：

* **`docker compose exec [SERVICE_NAME] [COMMAND]`**
    * **功能：** 在一个**已经运行**的服务容器内部执行一个命令。
    * **示例：**
        * `docker compose exec web /bin/sh`: 在名为 `web` 的服务容器中启动一个 `sh` shell，让你能进入容器内部进行交互。
        * `docker compose exec db psql -U user -d dbname`: 在 `db` 服务中执行 `psql` 命令。

* **`docker compose run [SERVICE_NAME] [COMMAND]`**
    * **功能：** 为服务**启动一个新的实例**来运行一次性命令。这通常用于执行测试、数据库迁移等任务。它不会启动在 `docker-compose.yml` 中定义的依赖服务（除非你添加 `--service-ports` 或 `--use-aliases` 等参数）。

---

### 📋 检查配置

~~还没试过这个说是~~

* **`docker compose config`**
    * **功能：** 验证并显示最终解析好的 `docker-compose.yml` 配置。这在你有多个 Compose 文件或使用环境变量时非常有用，可以检查配置是否正确合并。

### 💡 总结一个常用流程

1.  **首次启动/开发：** `docker compose up --build -d`（构建镜像并在后台启动）
2.  **查看状态：** `docker compose ps`（看是否都跑起来了）
3.  **查看日志：** `docker compose logs -f web`（实时看 `web` 服务的日志）
4.  **进入容器：** `docker compose exec web /bin/bash`（进入 `web` 容器调试）
5.  **停止并清理：** `docker compose down`（下班了，关掉所有东西）

希望这对你有用

> ##### 后记  
> 我为什么要写这篇呢？那当然是因为某位学姐在写完第一篇 Docker 入门篇就一直不更新，你不更新我更新😡。   
> 如果有想要进阶的读者/想要应用这些知识的读者建议阅读：[两年Docker折腾记](https://www.esaps.net/docker-architecture-evolution-two-years/)  
> 我对这篇“拓展阅读”标题的人话翻译：如何用docker compose组织多个容器并管理你的服务器