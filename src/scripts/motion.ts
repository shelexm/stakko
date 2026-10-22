const mm = (q: string) => window.matchMedia(q).matches;

export const reducedMotion = () => mm('(prefers-reduced-motion: reduce)');

/** Mouse-driven effects run only with a real pointer and without reduced motion. */
export const finePointer = () => mm('(hover: hover) and (pointer: fine)') && !reducedMotion();
