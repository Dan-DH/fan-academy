<script lang="ts">
  import MainBanner from '$lib/components/MainBanner.svelte';
  import HeroTitle from '$lib/components/HeroTitle.svelte';
  import SecondaryTitle from '$lib/components/SecondaryTitle.svelte';
  import InfoCard from '$lib/components/InfoCard.svelte';
  import { patchNotes } from '$lib/data/placeholder';
</script>

<svelte:head>
  <title>Patch Notes | Fan Academy</title>
  <meta
    name="description"
    content="Check out all the patch notes, updates, balance changes, and improvements in Fan Academy."
  />
</svelte:head>

<MainBanner>
  <HeroTitle>PATCH NOTES</HeroTitle>
  <SecondaryTitle>
    Check out the latest updates, balance changes, and improvements in Fan Academy.
  </SecondaryTitle>
</MainBanner>

<div class="max-w-6xl mx-auto w-full px-4 sm:px-6 pb-20">
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
    {#each patchNotes as patch}
      <InfoCard
        title="v{patch.version}"
        icon="icon-[material-symbols--history-edu]"
        class="w-full min-h-80"
      >
        {#snippet headerRight()}
          <div class="flex items-center gap-2">
            {#if patch.isLatest}
              <span class="badge badge-warning badge-xs uppercase font-bold px-1.5 py-0.5">
                Latest
              </span>
            {/if}
            <span class="text-xs text-stone-400 font-mono">{patch.date}</span>
          </div>
        {/snippet}

        <div class="flex-1 flex flex-col space-y-3">
          {#if patch.title}
            <h4 class="text-xs sm:text-sm font-bold text-amber-300 tracking-wide">
              {patch.title}
            </h4>
          {/if}

          <ul class="space-y-2 flex-1">
            {#each patch.description as item}
              <li class="text-xs text-stone-300 flex items-start gap-2">
                <span class="icon-[material-symbols--check-circle-outline-rounded] text-amber-400/80 text-sm shrink-0 mt-0.5"></span>
                <span class="leading-relaxed">{item}</span>
              </li>
            {/each}
          </ul>
        </div>
      </InfoCard>
    {/each}
  </div>
</div>
