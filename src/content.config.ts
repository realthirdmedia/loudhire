import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * News & Projects
 * ---------------
 * One collection, one entry per article or project, one canonical URL:
 *   /news-and-projects/<filename-without-extension>/
 *
 * Every entry is a Markdown file in src/content/news-and-projects/.
 * Set `type` to "project", "news" or "both". Project fields are optional and
 * only rendered when present. "Latest" sections everywhere are driven by `date`.
 * See README.md for the editing guide and a template entry.
 */
export const SERVICES = ['sound', 'lighting', 'staging', 'video', 'power'] as const;
export type Service = (typeof SERVICES)[number];

const newsAndProjects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news-and-projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      type: z.enum(['project', 'news', 'both']),
      summary: z.string().max(220),
      services: z.array(z.enum(SERVICES)).default([]),
      cover: image(),
      coverAlt: z.string(),
      /** Optional project fields */
      client: z.string().optional(),
      location: z.string().optional(),
      eventType: z.string().optional(),
      brief: z.string().optional(),
      servicesDelivered: z.array(z.string()).optional(),
      gallery: z
        .array(
          z.object({
            src: image(),
            alt: z.string(),
            caption: z.string().optional(),
          }),
        )
        .optional(),
      testimonial: z
        .object({
          quote: z.string(),
          name: z.string(),
        })
        .optional(),
      /** Eligible for the homepage "selected projects" block (most recent featured projects win). */
      featured: z.boolean().default(false),
      /** Hide the date on legacy entries where only the year is known. */
      hideDate: z.boolean().default(false),
      /** Drafts are excluded from the build. */
      draft: z.boolean().default(false),
    }),
});

export const collections = { newsAndProjects };
