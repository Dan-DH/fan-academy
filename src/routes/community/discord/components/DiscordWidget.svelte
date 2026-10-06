<script lang="ts">
  import InfoCard from '$lib/components/InfoCard.svelte';

  interface Props {
    serverId?: string;
    inviteUrl?: string;
  }

  let {
    serverId = '1389533142892675165',
    inviteUrl = 'https://discord.gg/yp45DkUeX'
  }: Props = $props();

  let showConfigHelp = $state(false);
</script>

<InfoCard
  title="Live Discord Server"
  icon="icon-[akar-icons--discord-fill]"
  class="h-full shadow-xl border-amber-500/30"
>
  {#snippet headerRight()}
    <div class="flex items-center gap-2">
      <span class="relative flex h-2 w-2">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <span class="text-xs font-semibold text-emerald-400">Live Status</span>
    </div>
  {/snippet}

  <div class="flex flex-col gap-3 flex-1 min-h-0">
    <!-- Embedded Official Discord Widget -->
    <div class="relative w-full rounded-xl overflow-hidden bg-stone-950 border border-stone-800">
      <iframe
        src="https://discord.com/widget?id={serverId}&theme=dark"
        title="Fan Academy Discord Server Widget"
        class="w-full h-[440px] sm:h-[480px] border-0"
        allowtransparency={true}
        frameborder="0"
        sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
      ></iframe>
    </div>

    <!-- Quick info / Setup note -->
    <div class="flex items-center justify-between text-xs text-stone-400 px-1 pt-1">
      <span class="flex items-center gap-1.5 text-stone-300">
        <span class="icon-[material-symbols--shield-outline] text-amber-400 text-sm"></span>
        Official Fan Academy Server
      </span>

      <button
        type="button"
        onclick={() => (showConfigHelp = !showConfigHelp)}
        class="text-amber-400/80 hover:text-amber-300 transition-colors cursor-pointer text-xs underline underline-offset-2"
      >
        {showConfigHelp ? 'Hide Widget Info' : 'Widget Setup'}
      </button>
    </div>

    {#if showConfigHelp}
      <div class="p-3 bg-stone-950/90 rounded-lg border border-amber-500/20 text-xs text-stone-300 space-y-1.5 transition-all">
        <p class="font-semibold text-amber-300">How Discord Widget Works:</p>
        <p class="text-stone-400 leading-relaxed">
          To display your members in this iframe, ensure <strong class="text-stone-200">Enable Server Widget</strong> is toggled on in your Discord <em>Server Settings → Widget</em>.
        </p>
      </div>
    {/if}
  </div>

  {#snippet footer()}
    <a
      href={inviteUrl}
      target="_blank"
      rel="noopener noreferrer"
      class="w-full py-3.5 px-5 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-300 bg-stone-950/80 hover:bg-amber-500 hover:text-stone-950 transition-all cursor-pointer group"
    >
      <span class="icon-[akar-icons--discord-fill] text-base"></span>
      <span>Join Discord Server</span>
      <span
        class="icon-[material-symbols--arrow-forward-rounded] text-base group-hover:translate-x-1 transition-transform"
      ></span>
    </a>
  {/snippet}
</InfoCard>
