<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    title,
    icon,
    footer,
    class: className = '',
    headerRight,
    children
  }: {
    title?: string;
    icon?: string;
    footer?: string | Snippet;
    class?: string;
    headerRight?: Snippet;
    children?: Snippet;
  } = $props();
</script>

<article
  class="card bg-stone-900/90 border border-amber-500/20 rounded-2xl overflow-hidden shadow-md flex flex-col justify-between {className}"
>
  <div class="flex flex-col flex-1">
    {#if title || icon || headerRight}
      <div class="px-5 py-3.5 bg-base-300/80 border-b border-amber-200/20 flex items-center justify-between gap-2.5">
        <div class="flex items-center gap-2.5 min-w-0">
          {#if icon}
            <span class="{icon} text-xl text-amber-400 shrink-0"></span>
          {/if}
          {#if title}
            <h3 class="text-base font-bold text-white truncate">{title}</h3>
          {/if}
        </div>
        {#if headerRight}
          {@render headerRight()}
        {/if}
      </div>
    {/if}

    <div class="p-5 space-y-3 flex-1 flex flex-col">
      {#if children}
        {@render children()}
      {/if}
    </div>
  </div>

  {#if footer}
    <div class="px-5 py-3 border-t border-stone-800 text-xs text-stone-400 bg-stone-950/50">
      {#if typeof footer === 'string'}
        {footer}
      {:else}
        {@render footer()}
      {/if}
    </div>
  {/if}
</article>
