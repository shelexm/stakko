import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n';

/** Entry ids are `<lang>/<slug>`, taken from the file path. */
export type Project = CollectionEntry<'projects'>['data'] & { slug: string };

export async function getProjects(lang: Lang): Promise<Project[]> {
  const all = await getCollection('projects', (e) => e.data.lang === lang);
  return all
    .map((e) => ({ ...e.data, slug: e.id.split('/').pop()! }))
    .sort((a, b) => a.order - b.order);
}

export const caseHref = (lang: Lang, slug: string) => `/${lang}/projects/${slug}/`;
