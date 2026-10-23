// Service descriptions start open (readable without JS). On phones they fold to a "What's included"
// toggle; on wider screens the toggle is hidden and the text stays visible.
const phone = window.matchMedia('(max-width: 700px)');
const items = document.querySelectorAll<HTMLDetailsElement>('details[data-fold-mobile]');

const apply = () => items.forEach((el) => { el.open = !phone.matches; });
apply();
phone.addEventListener('change', apply);
