<script lang="ts">
  import { onMount } from 'svelte';

  type Phase = 'init' | 'settled' | 'folding' | 'done';

  let phase = $state<Phase>('init');
  let timers: ReturnType<typeof setTimeout>[] = [];

  onMount(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('loader_seen') === '1') {
      phase = 'done';
      return;
    }
    timers.push(setTimeout(() => (phase = 'settled'), 100));
    timers.push(setTimeout(() => (phase = 'folding'), 1300));
    timers.push(
      setTimeout(() => {
        phase = 'done';
        sessionStorage.setItem('loader_seen', '1');
      }, 2400)
    );
    return () => timers.forEach(clearTimeout);
  });

  $effect(() => {
    if (typeof document === 'undefined') return;
    if (phase !== 'done') document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
  });

  let folding = $derived(phase === 'folding');

  const panelBgImage =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E\")";

  let panelBaseStyle =
    'position: absolute; left: 0; right: 0; height: 50vh; background: var(--bg); display: flex; justify-content: center; overflow: hidden; background-image: ' +
    panelBgImage +
    '; background-blend-mode: multiply;';
</script>

{#if phase !== 'done'}
  <div
    class="fixed inset-0"
    style="z-index: 10000; perspective: 1800px; pointer-events: {folding ? 'none' : 'auto'};"
  >
    <!-- Top half -->
    <div
      style="{panelBaseStyle} top: 0; align-items: flex-end; transform-origin: top center; transform: {folding
        ? 'rotateX(-115deg)'
        : 'rotateX(0deg)'}; transition: transform 1.05s cubic-bezier(0.65, 0, 0.3, 1); box-shadow: {folding
        ? '0 8px 40px rgba(26,23,18,0.25)'
        : 'none'}; border-bottom: 1px dashed #8a7d65;"
    >
      <div class="text-center pb-12 sm:pb-16">
        <p class="label text-pencil mb-2">portfolio · 2026</p>
        <h1
          class="handwritten text-red"
          style="font-size: clamp(3rem, 9vw, 5.5rem); line-height: 1; font-weight: 700;"
        >
          Nelson Mario
        </h1>
      </div>
    </div>

    <!-- Bottom half -->
    <div
      style="{panelBaseStyle} bottom: 0; align-items: flex-start; transform-origin: bottom center; transform: {folding
        ? 'rotateX(115deg)'
        : 'rotateX(0deg)'}; transition: transform 1.05s cubic-bezier(0.65, 0, 0.3, 1); box-shadow: {folding
        ? '0 -8px 40px rgba(26,23,18,0.25)'
        : 'none'}; border-top: 1px dashed #8a7d65;"
    >
      <div class="text-center pt-12 sm:pt-16">
        <span class="handwritten text-ink" style="font-size: 24px;">
          unfolding
          <span class="loading-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </span>
      </div>
    </div>
  </div>
{/if}
