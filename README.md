# STAKKO

Full-stack developer portfolio: [stakko.ru](https://stakko.ru). Static site on Astro, Russian and English versions, hosted on GitHub Pages.

## Run locally

Node.js 22.23 or newer.

```sh
npm ci
npm run dev       # http://localhost:4321
npm run build     # static site in dist/
npm run check     # type check (CI=1 npm run check in a non-interactive shell)
```

## Structure

- `src/pages/`: `/` picks the language, `/ru/` and `/en/` are the home pages, `/<lang>/projects/<slug>/` are case studies.
- `src/content/projects/{ru,en}/<slug>.yaml`: one project in two languages. A project with a `case` block gets its own case study page. Adding a project needs no markup changes.
- `src/i18n/`: interface texts for both languages.
- `src/styles/`: design tokens and styles ported from the design reference.
- `src/scripts/`: small browser scripts (hero sphere, marquee, menu, reveal on scroll, lightbox). All motion is off with `prefers-reduced-motion`.
- `design-reference/`: the agreed design (Claude Design artboards) and the brief.

## Deploy

Every push to `main` builds the site and publishes it to GitHub Pages (`.github/workflows/deploy.yml`). The custom domain is set in `public/CNAME`.

## License

Code and texts are licensed under [PolyForm Noncommercial 1.0.0](LICENSE): you may study, run and modify them for noncommercial purposes. Commercial use needs written permission from the author.
The VÉLOX screenshots show stock photos that keep their own licenses, listed in [velox-detailing/docs/media-sources.md](https://github.com/shelexm/velox-detailing/blob/main/docs/media-sources.md).
