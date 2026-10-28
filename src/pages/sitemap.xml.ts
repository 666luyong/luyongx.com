import type { APIRoute } from 'astro';
import { getPosts, postUrl } from '../lib/writing';
import { escapeXml } from '../lib/xml';

export const GET: APIRoute = async ({ site }) => {
  if (!site) throw new Error('Sitemap 需要在 astro.config.mjs 中设置 site');
  const pages = Object.keys(import.meta.glob('./**/*.astro'))
    .filter((path) => !path.includes('[') && path !== './404.astro')
    .map((path) => path.replace(/^\./, '').replace(/(?:\/index)?\.astro$/, '/'));
  const posts = await getPosts();
  const routes = [
    ...pages.map((path) => ({ path, updated: undefined as Date | undefined })),
    ...posts.map((post) => ({ path: postUrl(post), updated: post.data.updated ?? post.data.date })),
  ];
  const urls = routes.map(({ path, updated }) => `<url><loc>${escapeXml(new URL(path, site).href)}</loc>${updated ? `<lastmod>${updated.toISOString()}</lastmod>` : ''}</url>`);
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
