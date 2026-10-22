// Case hero: the glow follows the cursor with a lag and the blobs shift slightly (CSS variables, rAF).
import { finePointer } from './motion';

const hero = document.querySelector<HTMLElement>('.chero');

if (hero && finePointer()) {
  let tx = 0, ty = 0, mx = 0, my = 0;
  let tgx = 0, tgy = 0, gx = 0, gy = 0;
  let raf = 0;

  const rest = () => {
    const r = hero.getBoundingClientRect();
    tgx = r.width * 0.72; tgy = r.height * 0.3; tx = 0; ty = 0;
  };
  rest();
  gx = tgx; gy = tgy;

  const tick = () => {
    mx += (tx - mx) * 0.05; my += (ty - my) * 0.05;
    gx += (tgx - gx) * 0.075; gy += (tgy - gy) * 0.075;
    const s = hero.style;
    s.setProperty('--mx', mx.toFixed(3)); s.setProperty('--my', my.toFixed(3));
    s.setProperty('--gx', `${gx.toFixed(0)}px`); s.setProperty('--gy', `${gy.toFixed(0)}px`);
    const settled = Math.abs(tx - mx) < 0.001 && Math.abs(ty - my) < 0.001 && Math.abs(tgx - gx) < 0.5 && Math.abs(tgy - gy) < 0.5;
    raf = settled ? 0 : requestAnimationFrame(tick);
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };

  hero.addEventListener('mousemove', (e) => {
    const r = hero.getBoundingClientRect();
    tgx = e.clientX - r.left; tgy = e.clientY - r.top;
    tx = (tgx / r.width) * 2 - 1; ty = (tgy / r.height) * 2 - 1;
    kick();
  });
  hero.addEventListener('mouseleave', () => { rest(); kick(); });
  kick();
}
