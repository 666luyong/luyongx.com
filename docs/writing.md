# 博客维护与迁移

本站以本地 Markdown 为内容源，Astro Content Collections 负责校验和生成页面。文章不存进数据库，不依赖微信公众号接口，也不在构建时抓取原站。

## 选型与约定

采用成熟静态博客的共同做法：Markdown 正文、YAML front matter、固定 slug、本地图片、Git 版本记录。Astro 提供内容集合的类型与字段校验；Hugo、Jekyll 同样支持 Markdown 与 front matter，迁移时主要适配字段和路由，而不是重新抽取正文。

| 方案 | 当前选择 |
| --- | --- |
| Astro Content Collections + Markdown | 直接复用现有站点；内容和布局分开；构建时检查字段。 |
| Hugo / Jekyll | 借鉴 Markdown、front matter、日期与草稿管理约定；以后可迁移，但不必为本次改版重建站点。 |
| 托管 CMS / 无头 CMS | 适合多人协作、浏览器编辑和复杂媒体管理；目前文章少、作者单一，暂不增加账号、数据库、接口和导出依赖。 |
| MDX | 仅在文章需要嵌入交互组件时再考虑；普通文章坚持标准 Markdown，避免正文绑定框架。 |

参考：[Astro 内容集合](https://docs.astro.build/en/guides/content-collections/)、[Hugo front matter](https://gohugo.io/content-management/front-matter/)、[Jekyll front matter](https://jekyllrb.com/docs/front-matter/)。这些系统的元数据字段并非完全相同，本方案保证正文与资源可搬走，不承诺无需配置就能直接运行。

## 文件结构

```text
src/content/writing/
  starting-small.md
  niseko-trip/
    index.md
    images/
      01.jpg
      ...
src/content.config.ts          # 内容字段校验
src/lib/writing.ts             # 发布过滤、排序、日期与阅读时间
src/components/PostList.astro  # 首页和归档共用列表
src/pages/writing/[slug].astro # 所有文章共用的详情页
src/pages/rss.xml.ts           # 自动生成摘要订阅源
src/pages/sitemap.xml.ts       # 自动收录静态页面和已发布文章
```

图片与文章放在一起，Markdown 用 `![图片说明](./images/photo.jpg)` 引用。保留原始文件，Astro 只在构建产物中生成优化图片和尺寸信息。迁移时复制文章目录即可，不要从 `dist/_astro/` 取压缩后的文件作为原稿。

## 新建文章

在项目根目录执行：

```sh
npm run post:new -- my-new-post "文章标题"
```

命令创建 `src/content/writing/my-new-post/index.md`，默认是草稿，不覆盖已有文章。slug 只允许小写英文字母、数字和连字符。也可以手工复制 `templates/post.md`，填写占位字段后使用；模板位于内容集合之外，不会被发布。

```yaml
---
title: "文章标题"
slug: "my-new-post"
description: "一句话概括文章内容，用于列表、SEO 和 RSS。"
date: "2026-10-28T20:00:00+08:00"
author: "Lu Yong"
tags: ["产品", "实践"]
draft: true
---
```

正文使用普通 Markdown，可以在 VS Code、Obsidian 等本地编辑器中编辑，也可以直接在 GitHub 修改文本。正文不要包含 Astro/React 组件、内联脚本或布局样式。

### 字段含义

| 字段 | 规则 |
| --- | --- |
| `title` | 必填，文章标题。 |
| `slug` | 必填且全站唯一，永久地址为 `/writing/<slug>/`，与文件名和日期分开。发布后保持不变。 |
| `description` | 必填，手写摘要，不自动截取微信的页面描述。 |
| `date` | 必填，原始发表时间，建议完整 ISO 8601，明确 `+08:00` 时区。不要把搬迁日期写成发表日期。 |
| `updated` | 可选，正文有实质修改时记录；不能早于 `date`，不会改变归档顺序。 |
| `author` | 默认 Lu Yong，历史文章保留当时署名。 |
| `tags` | 字符串列表，用于文章元信息和 RSS；目前不额外生成空分类页面。 |
| `draft` | 默认 `true`，准备发布时显式改为 `false`。 |
| `source` | 可选，历史转载的来源名称与原文 URL，不用于站内 canonical。 |

来源示例：

```yaml
source:
  name: "微信公众号「日常BBB」"
  url: "https://mp.weixin.qq.com/s/原文ID"
```

列表按 `date` 降序排列，年份和日期统一以北京时间显示；RSS 使用标准 UTC 时间。阅读时间是根据正文估算，界面会标明“约”。

## 预览、发布与更新

1. 写 Markdown，把图片放进同目录的 `images/`，并写清楚图片说明。
2. 准备查看完整页面时设置 `draft: false`；保持 `date` 不晚于当前时间。草稿和未来文章不会出现在首页、归档、详情路由、RSS 或 sitemap 中。
3. 在本机运行 `npm run dev`，或启动 it-runner 的 `dev-preview`，访问 http://192.168.9.33:6166/ 。Markdown 修改会热更新。该局域网服务可被其他能访问主机的人看到，不要放未公开资料。
4. 检查标题、段落、手机显示、所有图片、原文链接和发表日期，执行 `npm run build`。需要检查生产输出时再运行 `npm run preview`。
5. 只提交文章、原始图片及必要代码，推送 `main` 后按当前 Cloudflare Git 集成自动部署，在部署记录确认成功。

构建不会在后台发布草稿。未来日期只是过滤条件，没有定时发布调度；到了时间还需要重新构建并部署。不要为了预览把敏感草稿改成公开后推送 `main`。

文章更正时保留 `slug` 和 `date`，按需添加 `updated`。纯排版或错别字修正通常不必更新日期。既有 `/writing/starting-small/` 地址保持不变。

若确实需要改 slug，在 `public/_redirects` 中添加旧地址到新地址的 301 规则，并核对 Cloudflare Static Assets 的重定向行为，再更新站内链接和站点地图。不要直接删除旧地址。

## 从微信公众号补录

本轮已将三个公开页面的标题、作者、正文和原始时间提取成本地内容，并保留原文链接：

| 原始日期（北京时间） | 文章 | 站内地址 |
| --- | --- | --- |
| 2019-02-07 00:07:57 | 记一下二世古之旅 | `/writing/niseko-trip/` |
| 2020-01-27 22:45:54 | 5X5初体验 | `/writing/first-5x5-training/` |
| 2025-02-04 22:11:41 | 健身房团购谈判指北（一） | `/writing/gym-group-buying-negotiation-1/` |

原始时间取自微信页面的 `ct` Unix 时间戳，与页面日期核对；历史署名为 `3B`，公众号为「日常BBB」。正文只转换格式，不改写原文表达；标题、列表、段落保留，图片补充描述。二世古文章的 17 张 JPEG 已本地保存，合计约 2.36 MB。

后续补录流程：

1. 先核对公开原文的标题、日期、作者，无法读取时向作者获取正文/导出文件，不猜日期、不生成替代内容。
2. 只提取文章正文，去掉微信的导航、广告、推荐、追踪和样式脚本。下载正文图片并确认文件确为图片，禁止直接保留微信图片热链。
3. 转换为 Markdown，填写 `source`，本地逐段核对文字与图片顺序，保留原文中的历史信息，不替作者“修订”观点。
4. 在本站预览、构建、提交。原始抓取 HTML 和转换临时文件不进入仓库。

不采用运行时抓取或自动重写微信公众号文章：公开页面可能有访问限制，图片链接可能失效，历史内容也不应随原站变动而无审查覆盖。

## 将来迁移

- 完整复制 `src/content/writing/`，包括所有本地图片，Git 仓库另做备份。
- 映射 `date`、`updated`、`draft`、`tags`、`author`、`source` 等 front matter 字段；例如 Hugo 的更新时间字段通常映射为 `lastmod`。
- 在新系统继续生成 `/writing/<slug>/`，不要将导入日期放进 URL；确实改路由时建立永久重定向表。
- 检查 Markdown 相对图片路径、中文排版、列表、代码块、原文链接和 canonical。RSS 的文章 GUID 保持原来的永久地址，避免订阅器把历史文章当作新文章。
- 如果以后接入 CMS，要求它提供完整 Markdown/JSON 和原始媒体导出；CMS 只做编辑入口，保留定期导出/备份机制。

## 项目介绍维护

首页与 Projects 列表共用 `src/data/projects.ts`。ddnsto、Agentflow 当前仅有明确的图文占位，未编造项目成果、指标或职责细节。补充时同步修改对应的 `src/pages/projects/<slug>.astro`，图片可以使用项目内相对资源或 `public/` 静态资源。

本轮仍使用 Astro 静态输出与原有 Cloudflare 部署，不迁移 Vinext。
