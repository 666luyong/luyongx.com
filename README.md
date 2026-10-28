# luyongx.com

Lu Yong 的个人网站，记录项目经历、写作与生活。Astro 静态输出，文章使用 Markdown 内容集合，无运行时服务与追踪脚本。

## 本地

```sh
npm ci
npm run dev
npm run build
npm run preview
```

### it-runner 局域网开发预览

需要 Node.js ≥ 22.22.0。使用 nvm 时，先执行 `nvm install`、`nvm use`（版本由 `.nvmrc` 指定），任务也会自动加载 nvm。
首次使用先运行 `npm ci`，然后在 Agentflow 的 it-runner 中刷新本项目任务，启动 `dev-preview`。
访问 http://192.168.9.33:6166/ 查看页面；修改 `.astro`、Markdown 或样式文件后会自动更新，无需重新构建。
任务监听 `0.0.0.0:6166`，电脑或手机需要能访问该主机的局域网地址。

在 it-runner 中可以启动、重启或停止任务。任务启动后，也可以在项目根目录用状态文件控制：

```sh
# 重启
mkdir -p .it-runner/states
echo "RESTART $(date +%s)" > .it-runner/states/dev-preview.STATE
# 停止
echo "STOP $(date +%s)" > .it-runner/states/dev-preview.STATE
```

运行日志位于 `.it-runner/logs/`，日志、缓存和状态文件不纳入 Git。

## 维护文章

```sh
npm run post:new -- my-post "文章标题"
```

在生成的 `src/content/writing/my-post/index.md` 中编辑 Markdown，图片放同目录 `images/`。完成后将 `draft` 改为 `false`，核对原始发表时间，再预览、构建并提交。文章列表、阅读时间、RSS（`/rss.xml`）和 sitemap 自动生成，不再手动修改列表页。

完整的字段、历史文章导入、日常更新与迁移方案见 [博客维护文档](docs/writing.md)。首页项目入口维护在 `src/data/projects.ts`，详情页在 `src/pages/projects/`。

## Cloudflare Workers Static Assets

```sh
npx wrangler login
npm run deploy
```

`wrangler.jsonc` 中的 assets 指向 `dist`。域名须先在 Cloudflare 中激活。`wrangler.jsonc` 已声明 `luyongx.com` 与 `www.luyongx.com` 自定义域名，首次发布后需验证两者的 HTTPS。

Cloudflare Git 自动构建已连接 `666luyong/luyongx.com`，生产分支为 `main`，根目录为 `/`，构建命令 `npm run build`，部署命令 `npx wrangler deploy`。非生产分支的预览构建已关闭。

## 内容边界

ddnsto、Agentflow 项目经历的详细图文待补充；智能组网和 Home Lab 保留为探索方向。发布具体职责、能力、数据与演示前需核实；不放入私人联系方式、公司内部信息或密钥。

## 首次发布记录

2026-10-20：通过 Cloudflare 控制台上传 dist 构建产物，创建 Worker `luyongx-com`。临时地址为 https://luyongx-com.badboybenly.workers.dev/ 。已在控制台绑定根域名和 www；名称服务器已切换至 eleanor.ns.cloudflare.com 与 koa.ns.cloudflare.com。正式域名激活及 HTTPS 需单独验证。

日常更新：修改源文件并本机预览后，将提交推送到 GitHub 的 `main` 分支，Cloudflare 将自动安装依赖、构建并部署。请在 Worker 的部署记录中确认本次构建成功；构建失败时，检查日志并修复后重新推送。上方 deploy 命令可用于手动发布。
