<script lang="ts">
  import { onMount } from 'svelte';

  type Theme = 'light' | 'dark';

  let { className = '', style = '' }: { className?: string; style?: string } = $props();

  let theme = $state<Theme>('light');
  let mounted = $state(false);

  function apply(t: Theme) {
    theme = t;
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
  }

  onMount(() => {
    mounted = true;
    const stored = localStorage.getItem('theme') as Theme | null;
    const initial: Theme =
      stored ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    apply(initial);
  });

  function toggle() {
    apply(theme === 'light' ? 'dark' : 'light');
  }

  let isLight = $derived(theme === 'light');
</script>

{#if mounted}
  <button
    onclick={toggle}
    aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
    class="card card-paper tilt-r {className}"
    style="width: 100%; padding: 14px 16px; min-height: 78px; background: var(--card-2); cursor: pointer; display: block; {style}"
  >
    <div
      style="position: relative; width: 100%; height: 46px; background: var(--card); border: 1.5px solid var(--ink); border-radius: 4px; overflow: hidden;"
    >
      <span
        aria-hidden="true"
        style="position: absolute; left: 25%; top: 50%; transform: translate(-50%, -50%); font-size: 18px; color: var(--ink); opacity: {isLight
          ? 0
          : 0.55}; transition: opacity 0.2s ease; pointer-events: none;"
      >
        ☀
      </span>
      <span
        aria-hidden="true"
        style="position: absolute; left: 75%; top: 50%; transform: translate(-50%, -50%); font-size: 18px; color: var(--ink); opacity: {isLight
          ? 0.55
          : 0}; transition: opacity 0.2s ease; pointer-events: none;"
      >
        ☾
      </span>
      <div
        aria-hidden="true"
        style="position: absolute; top: 3px; bottom: 3px; left: {isLight
          ? '3px'
          : 'calc(50% + 0px)'}; width: calc(50% - 3px); background: var(--ink); border-radius: 2px; transition: left 0.3s cubic-bezier(0.5, 1.7, 0.4, 0.9); display: flex; align-items: center; justify-content: center; color: var(--card); font-size: 18px; box-shadow: 1px 1px 0 0 var(--pencil);"
      >
        {isLight ? '☀' : '☾'}
      </div>
    </div>
  </button>
{/if}
