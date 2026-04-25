<script lang="ts" module>
  export type PinColor = 'red' | 'yellow' | 'blue' | 'ink';
  export type Tilt = 'l' | 'r' | 's' | 'none';
  export type BgToken = 'card' | 'card-2' | 'card-3' | 'yellow' | 'mustard';
  const BG_TOKENS = new Set(['card', 'card-2', 'card-3', 'yellow', 'mustard']);
  export function resolveBg(bg?: string) {
    if (!bg) return 'var(--card)';
    return BG_TOKENS.has(bg) ? `var(--${bg})` : bg;
  }
</script>

<script lang="ts">
  import type { Snippet } from 'svelte';
  import Pin from './Pin.svelte';

  let {
    children,
    tilt = 's',
    bg,
    pin,
    tape = false,
    padding = '16px 18px',
    minHeight,
    className = '',
    id,
    style = '',
    onclick,
    href
  }: {
    children: Snippet;
    tilt?: Tilt;
    bg?: BgToken | string;
    pin?: PinColor;
    tape?: boolean;
    padding?: string;
    minHeight?: number | string;
    className?: string;
    id?: string;
    style?: string;
    onclick?: () => void;
    href?: string;
  } = $props();

  let tiltClass = $derived(tilt === 'none' ? '' : `tilt-${tilt}`);
  let clickable = $derived(Boolean(onclick || href));
  let pinnedClass = $derived(pin ? 'card-pinned' : '');
  let classes = $derived(
    `card card-paper ${tiltClass} ${pinnedClass} ${clickable ? 'clickable' : ''} relative ${className}`.trim()
  );

  let mergedStyle = $derived(
    [
      `padding: ${padding}`,
      `background: ${resolveBg(bg)}`,
      minHeight != null
        ? `min-height: ${typeof minHeight === 'number' ? `${minHeight}px` : minHeight}`
        : '',
      style
    ]
      .filter(Boolean)
      .join('; ')
  );
</script>

{#snippet inner()}
  {#if pin}
    <div class="card-pin absolute -top-2 left-1/2 z-10 -translate-x-1/2">
      <Pin color={pin} size={20} />
    </div>
  {/if}
  {#if tape}
    <div
      aria-hidden="true"
      class="absolute"
      style="top: -8px; right: 30px; width: 80px; height: 22px; background: rgba(244, 215, 61, 0.68); border-top: 1px dashed rgba(255,255,255,0.3); border-bottom: 1px dashed rgba(26,23,18,0.15); transform: rotate(6deg); box-shadow: 0 1px 2px rgba(0,0,0,0.08);"
    ></div>
  {/if}
  {@render children()}
{/snippet}

{#if href}
  <a {id} {href} class="{classes} block no-underline" style={mergedStyle}>
    {@render inner()}
  </a>
{:else}
  {#if onclick}
    <div
      {id}
      class={classes}
      style={mergedStyle}
      {onclick}
      onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && onclick?.()}
      role="button"
      tabindex="0"
    >
      {@render inner()}
    </div>
  {:else}
    <div {id} class={classes} style={mergedStyle}>
      {@render inner()}
    </div>
  {/if}
{/if}
