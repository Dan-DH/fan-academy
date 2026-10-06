<script lang="ts">
  import InfoCard from '../InfoCard.svelte';
</script>

<InfoCard title="Community" icon="icon-[akar-icons--discord-fill]" class="w-80 sm:w-96 h-96">
  <div class="flex-1 flex flex-col justify-center items-center gap-4 py-4 text-center">
    <div class="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
      <span class="icon-[logos--discord-icon] text-6xl"></span>
    </div>

    <p class="text-sm text-stone-300 max-w-xs leading-relaxed">
      Find rivals, discuss strategies, participate in events, and share tactical battlefield guides.
    </p>
  </div>

  {#snippet footer()}
    <a
      href="https://discord.gg/yp45DkUeX"
      target="_blank"
      rel="noopener noreferrer"
      class="w-full py-3.5 px-5 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-300 bg-stone-950/80 hover:bg-amber-500 hover:text-stone-950 transition-all cursor-pointer group"
    >
      <span class="icon-[akar-icons--discord-fill] text-base"></span>
      <span>Join Discord</span>
      <span
        class="icon-[material-symbols--arrow-forward-rounded] text-base group-hover:translate-x-1 transition-transform"
      ></span>
    </a>
  {/snippet}
</InfoCard>
