import type { APIRoute } from 'astro';
import { getPosts, postUrl } from '../lib/writing';
import { escapeXml } from '../lib/xml';

export const GET: APIRoute = async ({ site }) => {
  if (!site) throw new Error('RSS 需要在 astro.config.mjs 中设置 site');
  const posts = await getPosts();
  const items = posts.map((post) => {
    const url = escapeXml(new URL(postUrl(post), site).href);
    return `<item><title>${escapeXml(post.data.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><description>${escapeXml(post.data.description)}</description><pubDate>${post.data.date.toUTCString()}</pubDate>${post.data.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join('')}</item>`;
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Lu Yong · 产品、实践与生活</title><link>${escapeXml(site.href)}</link><description>Lu Yong 的项目实践与生活记录。</description><language>zh-CN</language><atom:link href="${escapeXml(new URL('/rss.xml', site).href)}" rel="self" type="application/rss+xml"/>${items.join('')}</channel></rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
