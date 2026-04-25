<script lang="ts">
  type PinColor = 'red' | 'yellow' | 'blue' | 'ink';

  let {
    color = 'red',
    size = 14,
    className = ''
  }: { color?: PinColor; size?: number; className?: string } = $props();

  const palette = {
    red: { fill: '#c13a2b', shine: '#f5b3a8' },
    yellow: { fill: '#d4a236', shine: '#f5e3a8' },
    blue: { fill: '#3e6b8a', shine: '#a8c8d5' },
    ink: { fill: '#1a1712', shine: '#6b5c44' }
  } as const;

  let p = $derived(palette[color]);
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 16 16"
  class={className}
  aria-hidden="true"
  style="display: inline-block"
>
  <ellipse cx="9" cy="10" rx="5.5" ry="1.5" fill="rgba(26,23,18,0.22)" />
  <circle cx="7.5" cy="7.5" r="6.2" fill={p.fill} stroke="#1a1712" stroke-width="1" />
  <ellipse cx="5.6" cy="5.5" rx="1.8" ry="1.3" fill={p.shine} opacity="0.65" />
</svg>
