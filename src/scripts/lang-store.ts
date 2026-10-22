// Remembers a manual language choice; the root page reads it before guessing from the browser.
export const LANG_KEY = 'stakko-lang';

document.querySelectorAll<HTMLAnchorElement>('[data-set-lang]').forEach((a) => {
  a.addEventListener('click', () => {
    try {
      localStorage.setItem(LANG_KEY, a.dataset.setLang ?? '');
    } catch {
      // Storage can be blocked; the link still works.
    }
  });
});
