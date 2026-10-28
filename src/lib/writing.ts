import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'writing'>;

export async function getPosts() {
  const now = Date.now();
  const posts = await getCollection('writing', ({ data }) => !data.draft && data.date.getTime() <= now);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime() || a.id.localeCompare(b.id));
}

export const postUrl = (post: Post) => `/writing/${post.data.slug}/`;

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Shanghai',
  }).format(date).replaceAll('/', '.');
}

export function postYear(post: Post) {
  return new Intl.DateTimeFormat('en', { year: 'numeric', timeZone: 'Asia/Shanghai' }).format(post.data.date);
}

export function readingMinutes(post: Post) {
  // Exclude image URLs, then count Chinese characters and other words separately.
  const text = (post.body ?? '').replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
  const chinese = text.match(/[\p{Script=Han}]/gu)?.length ?? 0;
  const words = text.replace(/[\p{Script=Han}]/gu, '').match(/[\p{L}\p{N}]+/gu)?.length ?? 0;
  return Math.max(1, Math.ceil(chinese / 350 + words / 200));
}
