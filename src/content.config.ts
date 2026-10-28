import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    author: z.string().default('Lu Yong'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(true),
    source: z.object({ name: z.string(), url: z.string().url() }).optional(),
  }).refine((post) => !post.updated || post.updated >= post.date, {
    message: 'updated 不能早于原始发表时间 date',
    path: ['updated'],
  }),
});

export const collections = { writing };
