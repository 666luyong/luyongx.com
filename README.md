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

`wrangler.jsonc` 中的 assets 指向 `dist`。域名须先在 Cloudflare 中激活，随后在 Worker 设置中添加 `luyongx.com` 与 `www.luyongx.com` 自定义域名。首次发布后再验证两者的 HTTPS。

如使用 Cloudflare Git 构建，构建命令 `npm run build`，部署命令 `npx wrangler deploy`。

## 内容边界

项目页当前为探索方向，不代表已交付成果。发布具体能力、数据与演示前需核实；不放入私人联系方式、公司内部信息或密钥。
