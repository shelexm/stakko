// Screenshot viewer: Esc closes, arrows page through, focus moves to the close button and back to the
// thumbnail that opened it. Images load only when opened.
const dialog = document.querySelector<HTMLDialogElement>('dialog.lb');
const shots = [...document.querySelectorAll<HTMLButtonElement>('[data-shot]')].sort(
  (a, b) => Number(a.dataset.shot) - Number(b.dataset.shot),
);

if (dialog && shots.length) {
  const frame = dialog.querySelector<HTMLElement>('.lb-frame')!;
  const title = dialog.querySelector<HTMLElement>('.lb-title')!;
  const count = dialog.querySelector<HTMLElement>('.lb-count')!;
  const close = dialog.querySelector<HTMLButtonElement>('.lb-x')!;
  let current = 0;
  let trigger: HTMLElement | null = null;

  const show = (i: number) => {
    current = (i + shots.length) % shots.length;
    const s = shots[current].dataset;
    title.textContent = s.label ?? '';
    count.textContent = `${current + 1} / ${shots.length}`;
    frame.className = `lb-frame r-${s.ratio}`;
    frame.replaceChildren();
    if (s.full) {
      const img = document.createElement('img');
      img.src = s.full;
      img.alt = s.label ?? '';
      frame.append(img);
    } else {
      const ph = document.createElement('div');
      ph.className = `ph r-${s.ratio}`;
      ph.setAttribute('role', 'img');
      ph.setAttribute('aria-label', s.label ?? '');
      const b = document.createElement('b');
      b.textContent = s.label ?? '';
      const note = document.createElement('span');
      note.className = 'mono';
      note.textContent = `${s.size} · ${dialog.dataset.replace}`;
      ph.append(b, note);
      frame.append(ph);
    }
  };

  shots.forEach((btn, i) =>
    btn.addEventListener('click', () => {
      trigger = btn;
      show(i);
      dialog.showModal();
      close.focus();
    }),
  );
  close.addEventListener('click', () => dialog.close());
  dialog.querySelector('.lb-prev')!.addEventListener('click', () => show(current - 1));
  dialog.querySelector('.lb-next')!.addEventListener('click', () => show(current + 1));
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); show(current + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); show(current - 1); }
  });
  // A click on the dimmed area outside the box closes the viewer.
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.documentElement.style.overflow = '';
    trigger?.focus();
  });
  dialog.addEventListener('toggle', () => {
    if (dialog.open) document.documentElement.style.overflow = 'hidden';
  });
}
