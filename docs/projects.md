# 项目预览维护

首页和 `/projects/` 共用 `src/components/ProjectList.astro`。
采用 `docs/demo/projects-layout.html` 中的方案 B：桌面端三列小卡片，700px 及以下改为左侧文字、右侧缩略图的单列紧凑卡片。
在 `src/data/projects.ts` 中维护项目名称、官网链接、职责短语和预览图；职责保持简短，例如“产品设计、研发”。

预览图保存在 `src/assets/projects/`，由 Astro 在构建时生成响应式图片，页面不依赖外站图片请求。
替换时建议保持 1440 × 754（约 1.91:1）的比例，并同步更新图片说明。

当前素材是 2026-10-30 使用中文浏览器、1440 × 754 视口截取的官网首屏，非产品操作界面截图：

| 文件 | 来源 |
| --- | --- |
| `agentflow.png` | https://agentflow.geili.ai/ |
| `ddnsto.png` | https://www.ddnsto.com/ （跳转至 https://web.ddnsto.com/） |
| `linkease.png` | https://www.linkease.com/ |

截图中的品牌和页面内容归对应项目所有。官网变化时可手动更新截图；没有运行时抓取或自动同步。
