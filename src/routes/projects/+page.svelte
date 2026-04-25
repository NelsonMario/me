<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import Header from '$lib/components/Header.svelte';
  import Card from '$lib/components/Card.svelte';
  import Label from '$lib/components/Label.svelte';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import { projects } from '$lib/data';

  const tilts = ['s', 'r', 'l'] as const;
  const featured = projects[0];
  const rest = projects.slice(1);

  onMount(() => {
    gsap.fromTo(
      '[data-bento-card]',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, stagger: 0.06, ease: 'power3.out', delay: 0.1 }
    );
  });
</script>

<Header />
<main class="min-h-screen pb-16">
  <!-- Page title -->
  <section class="px-4 sm:px-6 pt-4 pb-6 flex items-start justify-between gap-4">
    <div>
      <p class="label mb-2">Case files · 2022 — now</p>
      <h1
        class="handwritten text-ink"
        style="font-size: clamp(2.6rem, 6vw, 4.4rem); line-height: 0.95; font-weight: 700;"
      >
        <span class="crayon-underline">Projects.</span>
      </h1>
      <a
        href="/"
        class="handwritten text-red hover:text-ink transition-colors inline-block mt-3"
        style="font-size: 18px;"
      >
        ← back home
      </a>
    </div>
    <div style="width: 200px; flex-shrink: 0;">
      <ThemeToggle />
    </div>
  </section>

  <!-- Bento grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 px-4 sm:px-6">
    <!-- Featured -->
    <div data-bento-card class="md:col-span-2 lg:row-span-2">
      <Card tilt="s" pin="red" tape={true} bg="yellow" padding="24px 24px 22px" minHeight={280}>
        {#snippet children()}
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <span
                class="w-2.5 h-2.5 rounded-full border border-ink"
                style="background-color: {featured.langColor};"
              ></span>
              <Label>{#snippet children()}{featured.language}{/snippet}</Label>
            </div>
            <span class="handwritten text-red" style="font-size: 16px;">featured</span>
          </div>

          <h2
            class="handwritten text-ink"
            style="font-size: clamp(2.2rem, 4vw, 3rem); line-height: 0.95; font-weight: 700;"
          >
            {featured.name}.
          </h2>

          <p class="text-ink mt-4" style="font-size: 14px; line-height: 1.7; max-width: 520px;">
            {featured.description}
          </p>

          <div
            class="mt-6 pt-4 flex flex-wrap items-center gap-x-5 gap-y-2"
            style="border-top: 1px dashed var(--graphite);"
          >
            {#if featured.liveUrl}
              <a
                href={featured.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                class="handwritten text-red hover:text-ink transition-colors"
                style="font-size: 18px; font-weight: 700;"
              >
                → visit {featured.liveUrl.replace(/^https?:\/\//, '')}
              </a>
            {/if}
            <a
              href={featured.url}
              target="_blank"
              rel="noopener noreferrer"
              class="font-mono text-ink hover:text-red transition-colors"
              style="font-size: 12px;"
            >
              github ↗
            </a>
          </div>
        {/snippet}
      </Card>
    </div>

    <!-- Rest -->
    {#each rest as p, i (p.name)}
      <div data-bento-card>
        <Card
          tilt={tilts[i % 3]}
          bg={i % 2 ? 'card-2' : 'card'}
          padding="18px 20px"
          minHeight={180}
        >
          {#snippet children()}
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <span
                  class="w-2 h-2 rounded-full border border-ink"
                  style="background-color: {p.langColor};"
                ></span>
                <Label>{#snippet children()}{p.language}{/snippet}</Label>
              </div>
              <span class="font-mono text-pencil" style="font-size: 10px;">
                #{String(i + 2).padStart(2, '0')}
              </span>
            </div>

            <h3
              class="handwritten text-ink"
              style="font-size: clamp(1.5rem, 2.5vw, 1.9rem); line-height: 1; font-weight: 700;"
            >
              {p.name}
            </h3>

            <p class="text-ink mt-2.5" style="font-size: 12.5px; line-height: 1.65;">
              {p.description}
            </p>

            <div
              class="mt-4 pt-3 flex items-center justify-between"
              style="border-top: 1px dashed var(--graphite);"
            >
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                class="handwritten text-red hover:text-ink transition-colors"
                style="font-size: 15px;"
              >
                view on github ↗
              </a>
            </div>
          {/snippet}
        </Card>
      </div>
    {/each}
  </div>
</main>
