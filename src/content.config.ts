import { defineCollection, type SchemaContext } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One project = two files: src/content/projects/ru/<slug>.yaml and en/<slug>.yaml.
// Adding a project needs no markup changes.

const projects = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/projects' }),
  schema: ({ image }: SchemaContext) => {
    const shot = z.object({
      image: image().optional(),
      label: z.string(),
      size: z.string(),
      ratio: z.enum(['16x9', '16x10', '9x19']),
    });
    const node = z.object({ k: z.string(), b: z.string(), s: z.string() });

    // A case section is a title plus optional blocks, rendered in a fixed order.
    const section = z.object({
      id: z.string().optional(),
      title: z.string(),
      big: z.string().optional(),
      text: z.string().optional(),
      arch: z
        .object({ aria: z.string(), top: z.array(node).length(3), core: node, db: node, caption: z.string() })
        .optional(),
      flow: z
        .object({ steps: z.array(z.object({ b: z.string(), d: z.string() })), result: z.object({ b: z.string(), d: z.string() }) })
        .optional(),
      after: z.string().optional(),
      list: z.array(z.string()).optional(),
      panels: z.array(z.object({ title: z.string(), items: z.array(z.string()) })).optional(),
      stack: z.array(z.object({ title: z.string(), tags: z.array(z.string()) })).optional(),
      tags: z.array(z.string()).optional(),
      metrics: z.array(z.object({ status: z.string(), value: z.string(), label: z.string(), note: z.string() })).optional(),
      infra: z.array(z.object({ k: z.string(), text: z.string() })).optional(),
      note: z.string().optional(),
      links: z.array(z.object({ k: z.string(), b: z.string(), d: z.string(), href: z.url() })).optional(),
      gallery: z.object({ layout: z.enum(['gal3', 'gal2', 'galp', 'single']), shots: z.array(shot) }).optional(),
    });

    return z.object({
      lang: z.enum(['ru', 'en']),
      order: z.number(),
      featured: z.boolean().default(false),
      title: z.string(),
      // Short name for tight spots such as the hero proof line; falls back to the title.
      short: z.string().optional(),
      category: z.string(),
      role: z.string(),
      description: z.string(),
      chips: z.array(z.string()).default([]),
      tags: z.array(z.string()),
      // Short measured facts shown on the card and, for the featured project, in the hero.
      highlights: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
      preview: z.object({
        kind: z.enum(['shot', 'web', 'dash', 'bot', 'api']),
        image: image().optional(),
        url: z.string().optional(),
        alt: z.string().optional(),
      }),
      links: z.object({
        demo: z.url().optional(),
        github: z.url().optional(),
        bot: z.url().optional(),
      }),
      case: z
        .object({
          seoTitle: z.string(),
          seoDescription: z.string(),
          eyebrow: z.string(),
          titleA: z.string(),
          titleB: z.string(),
          lead: z.string(),
          meta: z.array(z.object({ k: z.string(), v: z.string() })),
          heroUrl: z.string(),
          hero: shot,
          sections: z.array(section),
        })
        .optional(),
    });
  },
});

export const collections = { projects };
