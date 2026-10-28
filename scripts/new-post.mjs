import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const [slug, ...words] = process.argv.slice(2);
const title = words.join(' ').trim();
if (!slug || !title || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error('用法：npm run post:new -- my-post "文章标题"\nslug 仅允许小写字母、数字和单个连字符。');
  process.exit(1);
}
const contentRoot = path.join(root, 'src/content/writing');
const directory = path.join(contentRoot, slug);
for (const existing of [directory, path.join(contentRoot, `${slug}.md`)]) {
  try {
    await access(existing);
  } catch (error) {
    if (error.code === 'ENOENT') continue;
    throw error;
  }
  console.error(`文章已存在，未覆盖：${existing}`);
  process.exit(1);
}
const template = await readFile(path.join(root, 'templates/post.md'), 'utf8');
const values = { TITLE: title, SLUG: slug, DATE: new Date().toISOString() };
const markdown = template.replace(/\{\{(TITLE|SLUG|DATE)\}\}/g, (_, key) => JSON.stringify(values[key]));
await mkdir(directory);
await writeFile(path.join(directory, 'index.md'), markdown, { flag: 'wx' });
console.log(`已创建草稿：src/content/writing/${slug}/index.md\n完成后设置 draft: false，再运行 npm run build 检查。`);
