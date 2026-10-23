// "Copy" buttons next to contact details. Hidden without JS; the plain link still works then.
document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((btn) => {
  const label = btn.querySelector<HTMLElement>('.copy-label');
  if (!label) return;
  const idle = label.textContent ?? '';
  let timer = 0;
  btn.hidden = false;
  btn.setAttribute('aria-live', 'polite');
  btn.addEventListener('click', async () => {
    const text = btn.dataset.copy ?? '';
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Older or locked-down browsers: fall back to a hidden textarea.
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.append(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    label.textContent = btn.dataset.copied ?? idle;
    btn.classList.add('is-done');
    clearTimeout(timer);
    timer = window.setTimeout(() => {
      label.textContent = idle;
      btn.classList.remove('is-done');
    }, 2000);
  });
});
