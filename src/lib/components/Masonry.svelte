<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';
  import { onMount } from 'svelte';

  let {
    items,
    breakpoints,
    item,
    columnClass = 'masonry-col',
    gridClass = 'masonry-grid'
  }: {
    items: T[];
    breakpoints: Record<number | 'default', number>;
    item: Snippet<[T, number]>;
    columnClass?: string;
    gridClass?: string;
  } = $props();

  let width = $state(typeof window !== 'undefined' ? window.innerWidth : 1280);

  onMount(() => {
    const onResize = () => (width = window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  });

  let cols = $derived.by(() => {
    const entries = Object.entries(breakpoints)
      .filter(([k]) => k !== 'default')
      .map(([k, v]) => [Number(k), v] as [number, number])
      .sort((a, b) => a[0] - b[0]);
    let n = breakpoints.default ?? 3;
    for (const [bp, count] of entries) {
      if (width <= bp) {
        n = count;
        break;
      }
    }
    return n;
  });

  let columns = $derived.by(() => {
    const out: { item: T; index: number }[][] = Array.from({ length: cols }, () => []);
    items.forEach((it, i) => out[i % cols].push({ item: it, index: i }));
    return out;
  });
</script>

<div class={gridClass}>
  {#each columns as col}
    <div class={columnClass}>
      {#each col as { item: it, index } (index)}
        {@render item(it, index)}
      {/each}
    </div>
  {/each}
</div>
