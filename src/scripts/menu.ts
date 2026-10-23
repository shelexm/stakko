// Mobile menu: toggles the panel under the header, closes after navigation, on Escape and on resize to desktop.
const burger = document.querySelector<HTMLButtonElement>('.burger');
const panel = document.getElementById('mnav');
const scrim = document.querySelector<HTMLElement>('.mscrim');

if (burger && panel) {
  const set = (open: boolean) => {
    panel.hidden = !open;
    if (scrim) scrim.hidden = !open;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', (open ? burger.dataset.labelClose : burger.dataset.labelOpen) ?? '');
  };

  burger.addEventListener('click', () => set(!!panel.hidden));
  panel.addEventListener('click', (e) => {
    if ((e.target as Element).closest('a')) set(false);
  });
  scrim?.addEventListener('click', () => set(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden) {
      set(false);
      burger.focus();
    }
  });
  window.matchMedia('(min-width: 901px)').addEventListener('change', (e) => {
    if (e.matches) set(false);
  });
}
