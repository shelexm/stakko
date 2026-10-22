// Desktop marquee eases down to a quarter of its speed on hover and back on leave (WAAPI playbackRate).
import { finePointer } from './motion';

const mq = document.querySelector<HTMLElement>('.mq');
const track = mq?.querySelector<HTMLElement>('.mq-view .mq-track');

if (mq && track && finePointer() && track.getAnimations) {
  let raf = 0;
  const ease = (target: number) => {
    const anim = track.getAnimations()[0];
    if (!anim) return;
    cancelAnimationFrame(raf);
    const step = () => {
      const r = anim.playbackRate + (target - anim.playbackRate) * 0.1;
      if (Math.abs(target - r) < 0.01) {
        anim.playbackRate = target;
        return;
      }
      anim.playbackRate = r;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  };
  mq.addEventListener('mouseenter', () => ease(0.25));
  mq.addEventListener('mouseleave', () => ease(1));
}
