<script lang="ts">
  interface Props {
    inviteUrl?: string;
  }

  let { inviteUrl = 'https://discord.gg/yp45DkUeX' }: Props = $props();

  let copied = $state(false);

  function copyInvite() {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(inviteUrl);
      copied = true;
      setTimeout(() => {
        copied = false;
      }, 2000);
    }
  }
</script>

<div
  class="bg-stone-950/80 backdrop-blur-md p-4 sm:p-5 border border-amber-500/30 rounded-xl shadow-xl w-full max-w-2xl"
>
  <!-- Main Action & Invite Row -->
  <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
    <!-- Primary Join Button -->
    <a
      href={inviteUrl}
      target="_blank"
      rel="noopener noreferrer"
      class="flex-1 py-3 px-6 rounded-lg bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer group"
    >
      <span class="icon-[akar-icons--discord-fill] text-xl"></span>
      <span>Join Discord Server</span>
      <span
        class="icon-[material-symbols--arrow-forward-rounded] text-lg group-hover:translate-x-1 transition-transform"
      ></span>
    </a>

    <!-- Copy Invite Button -->
    <button
      type="button"
      onclick={copyInvite}
      class="py-3 px-5 rounded-lg bg-stone-900 border border-stone-800 hover:border-amber-500/40 text-stone-300 hover:text-white font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
    >
      {#if copied}
        <span class="icon-[material-symbols--check-circle-outline-rounded] text-emerald-400 text-lg"></span>
        <span class="text-emerald-400 font-bold">Invite Copied!</span>
      {:else}
        <span class="icon-[material-symbols--content-copy-outline] text-amber-400 text-lg"></span>
        <span>Copy Invite Link</span>
      {/if}
    </button>
  </div>
</div>
