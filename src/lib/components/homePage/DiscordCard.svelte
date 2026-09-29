<script lang="ts">
  import InfoCard from '../InfoCard.svelte';
</script>

<InfoCard title="Community" icon="icon-[akar-icons--discord-fill]" class="w-80 sm:w-96 min-h-96">
  <div class="flex-1 flex flex-col justify-center items-center gap-4 py-4 text-center">
    <div class="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
      <span class="icon-[logos--discord-icon] text-6xl"></span>
    </div>

    <p class="text-sm text-stone-300 max-w-xs leading-relaxed">
      Find rivals, discuss strategies, participate in events, and share tactical battlefield guides.
    </p>
  </div>

  {#snippet footer()}
    <div class="flex items-center justify-center">
      <a
        href="https://discord.gg"
        target="_blank"
        rel="noopener noreferrer"
        class="btn btn-ghost btn-xs text-amber-300 hover:text-white gap-1.5"
      >
        <span class="icon-[akar-icons--discord-fill] text-sm"></span>
        Join Discord
      </a>
    </div>
  {/snippet}
</InfoCard>
