<script lang="ts">
  import HeroTitle from "./HeroTitle.svelte";
  import MainBanner from "./MainBanner.svelte";
  import SecondaryTitle from "./SecondaryTitle.svelte";
</script>

<MainBanner>
    <div class="w-11/12 mx-auto flex justify-center items-center gap-10">
      <div class="hidden md:inline-grid md:hover-3d">
        <figure class="w-48 aspect-square scale-x-100">
          <img src="/paladin.webp" alt="paladin" class="w-90 aspect-square">
        </figure>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>

      <div class="text-center space-y-3 max-w-xl">
        <HeroTitle>
          MASTER THE GRID
        </HeroTitle>

        <SecondaryTitle>
          Rediscover the legendary turn-based tactical combat of Hero Academy, command iconic factions, and defeat your rivals in strategic PvP battles.
        </SecondaryTitle>
      </div>

      <div class="hidden md:inline-grid md:hover-3d">
        <figure class="w-48 aspect-square -scale-x-100">
          <img src="/gunner.webp" alt="gunner" class="w-90 aspect-square">
        </figure>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>

    <a href="/auth"
      class="btn btn-xl shrink-0 px-6 py-5 font-extrabold tracking-wider uppercase
              text-amber-950 bg-linear-to-b from-amber-400 to-amber-600
              rounded-lg border border-amber-300 shadow-lg md:text-2xl sm:text-lg
              hover:from-amber-300 hover:to-amber-500 hover:scale-105 active:scale-95 transition-all"
    >
      <span class="icon-[akar-icons--double-sword] text-3xl"></span>
      Battle Now
    </a>
</MainBanner>
