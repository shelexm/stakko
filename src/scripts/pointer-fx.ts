// Card spotlight ([data-spot]) and light magnetic buttons ([data-magnet]).
import { finePointer } from './motion';

if (finePointer()) {
  document.querySelectorAll<HTMLElement>('[data-spot]').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--sx', `${(e.clientX - r.left).toFixed(0)}px`);
      el.style.setProperty('--sy', `${(e.clientY - r.top).toFixed(0)}px`);
    });
  });

  document.querySelectorAll<HTMLElement>('[data-magnet]').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--bx', `${((e.clientX - (r.left + r.width / 2)) * 0.16).toFixed(1)}px`);
      el.style.setProperty('--by', `${((e.clientY - (r.top + r.height / 2)) * 0.26).toFixed(1)}px`);
    });
    el.addEventListener('mouseleave', () => {
      el.style.setProperty('--bx', '0px');
      el.style.setProperty('--by', '0px');
    });
  });
}
