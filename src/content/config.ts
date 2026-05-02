import { defineCollection, z } from 'astro:content';

const writing = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    status: z.enum(['budding', 'evergreen']),
    description: z.string().optional(),
  }),
});

export const collections = { writing };
