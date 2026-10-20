# luyongx.com

Lu Yong的个人网站：AI 产品实践者 / 创业探索者。Astro 静态输出，无运行时服务与追踪脚本。

## 本地

```sh
npm ci
npm run dev
npm run build
npm run preview
```

## Cloudflare Workers Static Assets

```sh
npx wrangler login
npm run deploy
```

`wrangler.jsonc` 中的 assets 指向 `dist`。域名须先在 Cloudflare 中激活。`wrangler.jsonc` 已声明 `luyongx.com` 与 `www.luyongx.com` 自定义域名，首次发布后需验证两者的 HTTPS。

Cloudflare Git 自动构建已连接 `666luyong/luyongx.com`，生产分支为 `main`，根目录为 `/`，构建命令 `npm run build`，部署命令 `npx wrangler deploy`。非生产分支的预览构建已关闭。

## 内容边界

项目页当前为探索方向，不代表已交付成果。发布具体能力、数据与演示前需核实；不放入私人联系方式、公司内部信息或密钥。

## 首次发布记录

2026-10-20：通过 Cloudflare 控制台上传 dist 构建产物，创建 Worker `luyongx-com`。临时地址为 https://luyongx-com.badboybenly.workers.dev/ 。已在控制台绑定根域名和 www；名称服务器已切换至 eleanor.ns.cloudflare.com 与 koa.ns.cloudflare.com。正式域名激活及 HTTPS 需单独验证。

日常更新：修改源文件并本机预览后，将提交推送到 GitHub 的 `main` 分支，Cloudflare 将自动安装依赖、构建并部署。请在 Worker 的部署记录中确认本次构建成功；构建失败时，检查日志并修复后重新推送。上方 deploy 命令可用于手动发布。
