<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { gsap } from 'gsap';
  import { annotate, annotationGroup } from 'rough-notation';
  import type { RoughAnnotation } from 'rough-notation/lib/model';
  import { person, experience, skills, projects } from '$lib/data';
  import Card from './Card.svelte';
  import Label from './Label.svelte';
  import Masonry from './Masonry.svelte';
  import ThemeToggle from './ThemeToggle.svelte';

  type CardId = 'bio' | 'exp' | 'skills';

  let active = $state<CardId | null>(null);
  let overlayEl = $state<HTMLDivElement | null>(null);
  let bodyEl = $state<HTMLDivElement | null>(null);
  let nameEl = $state<HTMLSpanElement | null>(null);

  function open(id: CardId) {
    active = id;
  }

  function close() {
    if (!overlayEl) return;
    gsap.to(overlayEl, {
      opacity: 0,
      y: 14,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        active = null;
      }
    });
  }

  $effect(() => {
    if (active && overlayEl && bodyEl) {
      gsap.fromTo(
        overlayEl,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.28, ease: 'power3.out' }
      );
      gsap.fromTo(
        bodyEl,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.32, delay: 0.08, ease: 'power3.out' }
      );
    }
  });

  onMount(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);

    let group: ReturnType<typeof annotationGroup> | null = null;
    let ann: RoughAnnotation | null = null;
    if (nameEl) {
      const rnRed = getComputedStyle(document.documentElement).getPropertyValue('--rn-red').trim() || '#c13a2b';
      ann = annotate(nameEl, {
        type: 'underline',
        color: rnRed,
        strokeWidth: 3,
        padding: 3,
        animationDuration: 800
      });
      group = annotationGroup([ann]);
      setTimeout(() => group?.show(), 400);
    }

    return () => {
      window.removeEventListener('keydown', onKey);
      group?.hide();
      ann?.remove();
    };
  });

  const breakpoints = { default: 3, 1024: 2, 640: 2 };

  const firstName = person.name.split(' ')[0];
  const lastName = person.name.split(' ')[1];

  let tilts = ['s', 'r', 'l', 's', 'r', 'l', 's', 'r', 'l', 's', 'r'] as const;
</script>

<div class="px-3 pt-4 pb-12">
  <Masonry items={Array.from({ length: 11 })} {breakpoints}>
    {#snippet item(_: unknown, i: number)}
      {#if i === 0}
        <!-- HERO -->
        <Card id="about" tilt="s" pin="red" padding="24px 22px 20px" minHeight={230} style="scroll-margin-top: 4rem;">
          {#snippet children()}
            <Label>{#snippet children()}{person.role} · {person.location}{/snippet}</Label>
            <p class="handwritten text-red mt-3" style="font-size: 30px; line-height: 1;">Hello, I'm</p>
            <h1
              class="font-chinese text-ink mt-1"
              style="font-size: clamp(2.4rem, 5vw, 4.2rem); font-weight: 700; line-height: 0.95; letter-spacing: -0.03em;"
            >
              <span bind:this={nameEl}>{firstName}</span> {lastName}
            </h1>
            <p class="text-pencil mt-4" style="font-size: 12px; letter-spacing: 0.04em;">
              Currently @ <span class="font-semibold text-ink">{experience[0].company}</span>
            </p>
          {/snippet}
        </Card>
      {:else if i === 1}
        <!-- NOW -->
        <Card tilt="r" minHeight={110}>
          {#snippet children()}
            <div class="flex items-center gap-2 mb-2">
              <span class="inline-block w-2 h-2 rounded-full bg-red animate-pulse"></span>
              <Label>{#snippet children()}Now{/snippet}</Label>
            </div>
            <p class="handwritten text-ink" style="font-size: 26px; line-height: 1;">{experience[0].company}.</p>
            <p class="text-pencil mt-1.5" style="font-size: 10px; font-family: monospace;">
              since {experience[0].period.split(' — ')[0]}
            </p>
          {/snippet}
        </Card>
      {:else if i === 2}
        <!-- LOCATION -->
        <Card tilt="l" bg="card-2" minHeight={110}>
          {#snippet children()}
            <Label>{#snippet children()}Based in{/snippet}</Label>
            <p
              class="kalam text-ink font-bold mt-2"
              style="font-size: 44px; line-height: 0.85; letter-spacing: -0.02em;"
            >
              {person.location}
            </p>
            <p class="handwritten text-red mt-0.5" style="font-size: 18px; line-height: 1;">616</p>
          {/snippet}
        </Card>
      {:else if i === 3}
        <!-- BIO -->
        <Card tilt="s" padding="20px 20px" minHeight={160} onclick={() => open('bio')}>
          {#snippet children()}
            <div class="flex items-center justify-between mb-2">
              <Label>{#snippet children()}About me{/snippet}</Label>
              <span class="handwritten text-red" style="font-size: 16px;">↗</span>
            </div>
            <p class="handwritten text-ink" style="font-size: 24px; line-height: 1;">A quick intro.</p>
            <p class="text-ink mt-2.5 line-clamp-4" style="font-size: 12.5px; line-height: 1.65;">
              {person.bio}
            </p>
          {/snippet}
        </Card>
      {:else if i === 4}
        <!-- EXPERIENCE -->
        <Card tilt="r" padding="18px 18px" minHeight={220} onclick={() => open('exp')}>
          {#snippet children()}
            <div class="flex items-center justify-between mb-2">
              <Label>{#snippet children()}Experience{/snippet}</Label>
              <span class="handwritten text-red ink-circle" style="font-size: 15px;">{experience.length}</span>
            </div>
            <p class="handwritten text-ink mb-3" style="font-size: 24px; line-height: 1;">Where.</p>
            <div class="space-y-2.5">
              {#each experience as e, idx (e.company)}
                <div class="flex items-baseline justify-between">
                  <span class="kalam text-ink font-bold" style="font-size: 15px;">
                    {#if idx === 0}
                      <span class="crayon-underline">{e.company}</span>
                    {:else}
                      {e.company}
                    {/if}
                  </span>
                  <span class="font-mono text-pencil" style="font-size: 9.5px;">{e.period}</span>
                </div>
              {/each}
            </div>
          {/snippet}
        </Card>
      {:else if i === 5}
        <!-- SKILLS -->
        <Card tilt="l" bg="card-2" padding="18px 18px" onclick={() => open('skills')}>
          {#snippet children()}
            <Label>{#snippet children()}Skills{/snippet}</Label>
            <p class="handwritten text-ink mt-1.5 mb-2.5" style="font-size: 22px; line-height: 1;">Toolkit.</p>
            <div class="flex flex-wrap gap-1">
              {#each skills.slice(0, 6) as s, idx (s)}
                <span
                  class="px-2 py-0.5 border-[1.2px] border-ink text-ink"
                  style="border-radius: 2px; font-size: 10px; font-weight: 500; background: var(--card); transform: rotate({((idx % 3) - 1) * 0.8}deg);"
                >
                  {s}
                </span>
              {/each}
              {#if skills.length > 6}
                <span class="handwritten text-red" style="font-size: 16px;">+{skills.length - 6}</span>
              {/if}
            </div>
          {/snippet}
        </Card>
      {:else if i === 6}
        <!-- PROJECTS LINK -->
        <Card
          id="projects"
          href="/projects"
          tilt="s"
          pin="red"
          bg="yellow"
          padding="18px 18px"
          minHeight={180}
          style="scroll-margin-top: 4rem;"
        >
          {#snippet children()}
            <div class="flex items-center justify-between mb-2">
              <Label>{#snippet children()}Case files{/snippet}</Label>
              <span class="handwritten text-red" style="font-size: 20px;">↗</span>
            </div>
            <p class="handwritten text-ink" style="font-size: 34px; line-height: 0.95; font-weight: 700;">Projects.</p>
            <p class="text-ink mt-2" style="font-size: 12px; line-height: 1.6;">
              <span class="font-semibold">{projects.length} builds</span> · TS · Go · Python
            </p>
            <ul class="mt-3 space-y-0.5 font-mono text-pencil" style="font-size: 11px;">
              {#each projects.slice(0, 3) as p (p.name)}
                <li>— {p.name}</li>
              {/each}
              <li class="handwritten text-red" style="font-size: 15px;">&amp; more →</li>
            </ul>
          {/snippet}
        </Card>
      {:else if i === 7}
        <!-- QUOTE -->
        <Card tilt="r" bg="card-3" minHeight={120}>
          {#snippet children()}
            <Label>{#snippet children()}I'm not lazy{/snippet}</Label>
            <p class="handwritten text-ink mt-2" style="font-size: 32px; line-height: 1;">
              <span class="highlight-yellow">I'm on</span>,
            </p>
            <p class="handwritten text-ink" style="font-size: 32px; line-height: 1;">energy-saving mode.</p>
          {/snippet}
        </Card>
      {:else if i === 8}
        <!-- THEME SWITCH -->
        <ThemeToggle />
      {:else if i === 9}
        <!-- CONTACT -->
        <Card tilt="l" minHeight={130}>
          {#snippet children()}
            <Label>{#snippet children()}Say hello{/snippet}</Label>
            <p class="handwritten text-ink mt-1.5 mb-2" style="font-size: 22px; line-height: 1;">Reach out.</p>
            <div class="flex flex-col gap-1">
              {#each Object.entries(person.social) as [k, v] (k)}
                <a
                  href={v}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="font-mono text-ink hover:text-red transition-colors"
                  style="font-size: 11px;"
                >
                  → {k}
                </a>
              {/each}
            </div>
          {/snippet}
        </Card>
      {:else if i === 10}
        <!-- DATE STAMP -->
        <Card tilt="r" padding="14px 18px" minHeight={90}>
          {#snippet children()}
            <div
              class="absolute top-2 right-2 border-[1.5px] border-red text-red"
              style="padding: 2px 6px; font-size: 9px; letter-spacing: 0.1em; font-family: monospace; font-weight: 700; transform: rotate(-8deg); text-transform: uppercase; border-radius: 2px;"
            >
              reviewed
            </div>
            <Label>{#snippet children()}Last updated{/snippet}</Label>
            <p
              class="font-mono text-ink mt-2"
              style="font-size: 18px; font-weight: 700; letter-spacing: 0.05em;"
            >
              23 / 04 / '26
            </p>
          {/snippet}
        </Card>
      {/if}
    {/snippet}
  </Masonry>

  <!-- overlay -->
  {#if active}
    <div
      bind:this={overlayEl}
      style="position: fixed; inset: 0; z-index: 50; background: var(--bg); display: flex; flex-direction: column;"
    >
      <div
        class="flex items-center justify-between px-5 sm:px-8 py-4"
        style="border-bottom: 1.5px solid var(--ink);"
      >
        <span class="font-mono text-ink" style="font-size: 11px; letter-spacing: 0.22em;">NM</span>
        <button
          onclick={close}
          class="handwritten text-red hover:text-ink transition-colors"
          style="font-size: 22px; background: none; border: none; cursor: pointer;"
        >
          close ✕
        </button>
      </div>
      <div
        bind:this={bodyEl}
        class="flex-1 overflow-y-auto px-6 sm:px-12 py-10 sm:py-16"
        style="max-width: 720px;"
      >
        {#if active === 'bio'}
          <div>
            <Label>{#snippet children()}About{/snippet}</Label>
            <h2 class="handwritten text-red mt-3" style="font-size: 40px; line-height: 1;">Hello,</h2>
            <p class="text-ink mt-4 max-w-xl" style="font-size: 17px; line-height: 1.75;">{person.bio}</p>
            <div class="flex gap-6 mt-8">
              {#each Object.entries(person.social) as [k, v] (k)}
                <a
                  href={v}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="label text-pencil hover:text-red transition-colors">{k}</a
                >
              {/each}
            </div>
          </div>
        {:else if active === 'exp'}
          <div>
            <Label>{#snippet children()}Experience{/snippet}</Label>
            <h2 class="handwritten text-red mt-3" style="font-size: 40px; line-height: 1;">Where I've been.</h2>
            <div class="mt-8 space-y-7">
              {#each experience as e (e.company)}
                <div class="pl-5 relative" style="border-left: 2px solid var(--ink);">
                  <div
                    class="absolute w-3 h-3 rounded-full"
                    style="left: -7px; top: 6px; background: {e.current
                      ? 'var(--red)'
                      : 'var(--ink)'}; border: {e.current ? '2px solid var(--ink)' : 'none'};"
                  ></div>
                  <p class="font-mono text-pencil" style="font-size: 11px; letter-spacing: 0.05em;">{e.period}</p>
                  <p class="handwritten text-ink mt-0.5" style="font-size: 26px; line-height: 1;">{e.company}</p>
                  <p class="text-pencil mt-1" style="font-size: 13px;">{e.role}</p>
                </div>
              {/each}
            </div>
          </div>
        {:else if active === 'skills'}
          <div>
            <Label>{#snippet children()}Skills &amp; tools{/snippet}</Label>
            <h2 class="handwritten text-red mt-3" style="font-size: 40px; line-height: 1;">What I use.</h2>
            <div class="flex flex-wrap gap-2 mt-8">
              {#each skills as s, idx (s)}
                <span
                  class="px-3 py-1.5 border-[1.5px] border-ink text-ink"
                  style="border-radius: 3px; font-size: 12px; font-weight: 500; background: {idx % 2
                    ? 'var(--card)'
                    : 'var(--card-2)'}; transform: rotate({((idx % 3) - 1) * 0.7}deg);"
                >
                  {s}
                </span>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>
