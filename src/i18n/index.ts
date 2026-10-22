import { ru } from './ru';
import { en } from './en';

export const LANGS = ['ru', 'en'] as const;
export type Lang = (typeof LANGS)[number];

const dicts = { ru, en };

export function t(lang: Lang) {
  return dicts[lang];
}

export function otherLang(lang: Lang): Lang {
  return lang === 'ru' ? 'en' : 'ru';
}

/** Same page in the other language: `/ru/projects/velox/` -> `/en/projects/velox/`. */
export function swapLangPath(path: string, to: Lang): string {
  return path.replace(/^\/(ru|en)\//, `/${to}/`);
}

export function langPaths() {
  return LANGS.map((lang) => ({ params: { lang } }));
}
