// Sections rise into view on scroll. Without JS or with reduced motion the content is simply visible.
import { reducedMotion } from './motion';

const root = document.querySelector('.site');
const items = document.querySelectorAll('.reveal');

if (root && items.length) {
  if (reducedMotion() || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('in'));
  } else {
    root.classList.add('fx');
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            io.unobserve(en.target);
          }
        }
      },
      { threshold: 0.12 },
    );
    items.forEach((el) => io.observe(el));
  }
}
