# Portfolio — SvelteKit port

Svelte 5 / SvelteKit port of the Next.js portfolio (`../me`).

## Stack

- SvelteKit + Svelte 5 (runes)
- TypeScript
- Tailwind CSS
- gsap (kept — framework-agnostic)
- rough-notation (kept — used directly instead of `react-rough-notation`)
- three (kept — framework-agnostic, currently unused in code)

`react-masonry-css` was replaced with a small inline `Masonry.svelte` that
replicates the same column-distribution algorithm.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```
