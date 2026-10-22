// Hero background on Canvas 2D: a Fibonacci sphere with neighbour links, a tilted particle ring and
// floating dust. The mouse tilts the sphere and drives the cursor glow and parallax via CSS variables.
// Ported from design-reference/Main.dc.html.
import { finePointer, reducedMotion } from './motion';

interface Dust { x: number; y: number; z: number; vx: number; vy: number; ph: number }

class HeroScene {
  private ctx: CanvasRenderingContext2D;
  private fine = finePointer();
  private reduced = reducedMotion();
  private pts: Float32Array;
  private proj: Float32Array;
  private edges: Uint16Array;
  private ring: Float32Array;
  private dust: Dust[] = [];
  private cw = 1; private ch = 1; private dpr = 1;
  private mx = 0; private my = 0; private tx = 0; private ty = 0;
  private gx = 0; private gy = 0; private tgx = 0; private tgy = 0;
  private rot = 0.6; private ringRot = 0; private last = 0;
  private raf = 0;
  private visible = true;
  private lastKey = '';

  constructor(private cv: HTMLCanvasElement, private hero: HTMLElement) {
    this.ctx = cv.getContext('2d')!;
    const N = this.fine ? 230 : 130;
    const pts = new Float32Array(N * 3);
    const ga = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), t = i * ga;
      pts[i * 3] = Math.cos(t) * r; pts[i * 3 + 1] = y; pts[i * 3 + 2] = Math.sin(t) * r;
    }
    const T = this.fine ? 0.26 : 0.34, T2 = T * T, edges: number[] = [];
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
      const dx = pts[i * 3] - pts[j * 3], dy = pts[i * 3 + 1] - pts[j * 3 + 1], dz = pts[i * 3 + 2] - pts[j * 3 + 2];
      if (dx * dx + dy * dy + dz * dz < T2) edges.push(i, j);
    }
    this.pts = pts;
    this.edges = new Uint16Array(edges);
    this.proj = new Float32Array(N * 3);

    const M = this.fine ? 120 : 70;
    this.ring = new Float32Array(M * 2);
    for (let k = 0; k < M; k++) {
      this.ring[k * 2] = (k / M) * Math.PI * 2;
      this.ring[k * 2 + 1] = 1.36 + (Math.random() - 0.5) * 0.05;
    }
    const P = this.fine ? 34 : 16;
    for (let p = 0; p < P; p++) {
      this.dust.push({ x: Math.random(), y: Math.random(), z: 0.3 + Math.random() * 0.7, vx: (Math.random() - 0.5) * 0.000012, vy: -(0.000006 + Math.random() * 0.000016), ph: Math.random() * 6.283 });
    }

    this.fit();
    new ResizeObserver(() => this.fit()).observe(cv);
    if (this.reduced) return;

    new IntersectionObserver((entries) => {
      this.visible = entries[0].isIntersecting;
      this.kick();
    }).observe(hero);
    document.addEventListener('visibilitychange', () => this.kick());
    if (this.fine) {
      hero.addEventListener('mousemove', (e) => this.onMove(e));
      hero.addEventListener('mouseleave', () => this.onLeave());
    }
    this.kick();
  }

  private fit() {
    const r = this.cv.getBoundingClientRect();
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    this.cw = Math.max(1, r.width); this.ch = Math.max(1, r.height);
    this.cv.width = Math.round(this.cw * this.dpr); this.cv.height = Math.round(this.ch * this.dpr);
    if (!this.gx) { this.gx = this.tgx = this.cw * 0.7; this.gy = this.tgy = this.ch * 0.42; }
    if (!this.raf) this.draw(0, 0);
  }

  private kick() {
    const run = this.visible && !document.hidden;
    if (run && !this.raf) {
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.frame);
    } else if (!run && this.raf) {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    }
  }

  private frame = (t: number) => {
    const dt = Math.min(64, Math.max(0, t - this.last)); this.last = t;
    this.rot += dt * 0.00011; this.ringRot -= dt * 0.00006;
    this.mx += (this.tx - this.mx) * 0.05; this.my += (this.ty - this.my) * 0.05;
    this.gx += (this.tgx - this.gx) * 0.075; this.gy += (this.tgy - this.gy) * 0.075;
    if (this.fine) {
      const key = `${this.mx.toFixed(3)}|${this.my.toFixed(3)}|${this.gx.toFixed(0)}|${this.gy.toFixed(0)}`;
      if (key !== this.lastKey) {
        this.lastKey = key;
        const s = this.hero.style;
        s.setProperty('--mx', this.mx.toFixed(3)); s.setProperty('--my', this.my.toFixed(3));
        s.setProperty('--gx', `${this.gx.toFixed(0)}px`); s.setProperty('--gy', `${this.gy.toFixed(0)}px`);
      }
    }
    this.draw(t, dt);
    this.raf = requestAnimationFrame(this.frame);
  };

  private onMove(e: MouseEvent) {
    const r = this.hero.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    this.tx = (x / r.width) * 2 - 1; this.ty = (y / r.height) * 2 - 1;
    this.tgx = x; this.tgy = y;
  }

  private onLeave() {
    this.tx = 0; this.ty = 0;
    this.tgx = this.cw * 0.7; this.tgy = this.ch * 0.42;
  }

  private draw(t: number, dt: number) {
    const ctx = this.ctx, w = this.cw, h = this.ch;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    // On narrow screens the sphere moves to the top right corner at half strength.
    const narrow = w < 820;
    const cx = narrow ? w * 0.8 : w * 0.745 - this.mx * 14;
    const cy = narrow ? Math.min(h * 0.2, 190) : h * 0.43 - this.my * 10;
    const R = narrow ? Math.min(w * 0.44, 210) : Math.min(w * 0.235, h * 0.36, 380);
    const ak = narrow ? 0.5 : 1;

    const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.55);
    halo.addColorStop(0, `rgba(70,105,255,${(0.2 * ak).toFixed(3)})`);
    halo.addColorStop(0.55, `rgba(110,80,255,${(0.06 * ak).toFixed(3)})`);
    halo.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = halo; ctx.fillRect(cx - R * 1.6, cy - R * 1.6, R * 3.2, R * 3.2);

    const ry = this.rot + this.mx * 0.5, rx = -0.32 + this.my * 0.28;
    const cY = Math.cos(ry), sY = Math.sin(ry), cX = Math.cos(rx), sX = Math.sin(rx), F = 3.2;
    const P = this.pts, Q = this.proj, N = P.length / 3;
    for (let i = 0; i < N; i++) {
      const x = P[i * 3], y = P[i * 3 + 1], z = P[i * 3 + 2];
      const x1 = x * cY + z * sY, z1 = -x * sY + z * cY;
      const y1 = y * cX - z1 * sX, z2 = y * sX + z1 * cX;
      const k = F / (F - z2);
      Q[i * 3] = cx + x1 * R * k; Q[i * 3 + 1] = cy + y1 * R * k; Q[i * 3 + 2] = (z2 + 1) * 0.5;
    }

    // Links, batched by depth so the back of the sphere stays dim.
    const E = this.edges;
    ctx.lineWidth = 1;
    for (let b = 0; b < 4; b++) {
      const lo = b / 4, hi = (b + 1) / 4;
      ctx.beginPath();
      for (let e = 0; e < E.length; e += 2) {
        const a = E[e], c = E[e + 1], d = (Q[a * 3 + 2] + Q[c * 3 + 2]) * 0.5;
        if (d < lo || d >= hi) continue;
        ctx.moveTo(Q[a * 3], Q[a * 3 + 1]); ctx.lineTo(Q[c * 3], Q[c * 3 + 1]);
      }
      ctx.strokeStyle = `rgba(112,150,255,${((0.03 + ((b + 0.5) / 4) * 0.2) * ak).toFixed(3)})`;
      ctx.stroke();
    }

    const fills = [`rgba(105,125,255,${(0.3 * ak).toFixed(2)})`, `rgba(140,175,255,${(0.6 * ak).toFixed(2)})`, `rgba(200,228,255,${(0.95 * ak).toFixed(2)})`];
    for (let b = 0; b < 3; b++) {
      const lo = b / 3, hi = (b + 1) / 3;
      ctx.beginPath();
      for (let i = 0; i < N; i++) {
        const d = Q[i * 3 + 2];
        if (d < lo || d >= hi) continue;
        const s = 0.6 + d * 1.5, px = Q[i * 3], py = Q[i * 3 + 1];
        ctx.moveTo(px + s, py); ctx.arc(px, py, s, 0, 6.2832);
      }
      ctx.fillStyle = fills[b]; ctx.fill();
    }

    const RG = this.ring, M = RG.length / 2, tX = 1.2, tZ = -0.36;
    const cTX = Math.cos(tX), sTX = Math.sin(tX), cTZ = Math.cos(tZ), sTZ = Math.sin(tZ);
    for (let k = 0; k < M; k++) {
      const a = RG[k * 2] + this.ringRot, rr = RG[k * 2 + 1];
      const x0 = Math.cos(a) * rr, z0 = Math.sin(a) * rr;
      const y1 = -z0 * sTX, z1 = z0 * cTX;
      const x2 = x0 * cTZ - y1 * sTZ, y2 = x0 * sTZ + y1 * cTZ;
      const kk = F / (F - z1), px = cx + x2 * R * kk, py = cy + y2 * R * kk;
      const front = z1 > 0, dd = (z1 / rr + 1) * 0.5;
      const al = (front ? 0.25 + dd * 0.6 : 0.08 + dd * 0.15) * ak;
      ctx.fillStyle = `${k % 3 === 0 ? 'rgba(80,215,255,' : 'rgba(165,130,255,'}${al.toFixed(3)})`;
      const s = front ? 1.4 : 0.9;
      ctx.fillRect(px - s / 2, py - s / 2, s, s);
    }

    for (const q of this.dust) {
      q.x += q.vx * dt; q.y += q.vy * dt;
      if (q.y < -0.02) { q.y = 1.02; q.x = Math.random(); }
      if (q.x < -0.02) q.x = 1.02; else if (q.x > 1.02) q.x = -0.02;
      const tw = 0.5 + 0.5 * Math.sin(t * 0.0011 + q.ph);
      const px = q.x * w - this.mx * 26 * q.z, py = q.y * h - this.my * 18 * q.z;
      ctx.fillStyle = `rgba(170,200,255,${((0.12 + 0.45 * tw) * q.z).toFixed(3)})`;
      const s = 0.8 + q.z * 1.4;
      ctx.beginPath(); ctx.arc(px, py, s, 0, 6.2832); ctx.fill();
    }
  }
}

const cv = document.querySelector<HTMLCanvasElement>('.hero-cv');
const hero = document.querySelector<HTMLElement>('.hero');
if (cv && hero && cv.getContext('2d')) new HeroScene(cv, hero);
