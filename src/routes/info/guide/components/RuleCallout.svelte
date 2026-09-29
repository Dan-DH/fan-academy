<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    icon = '',
    title = '',
    description = '',
    variant = 'default',
    children
  }: {
    icon?: string;
    title?: string;
    description?: string;
    variant?: 'default' | 'danger' | 'warning';
    children?: Snippet;
  } = $props();

  const variantStyles = {
    default: 'bg-stone-950/70 border-stone-800 text-stone-300',
    danger: 'bg-rose-950/30 border-rose-500/40 text-rose-200',
    warning: 'bg-amber-950/30 border-amber-500/30 text-amber-200'
  };

  const iconColors = {
    default: 'text-amber-400',
    danger: 'text-rose-400',
    warning: 'text-amber-400'
  };

  const titleColors = {
    default: 'text-amber-300',
    danger: 'text-rose-300',
    warning: 'text-amber-300'
  };
</script>

<div class="p-3.5 rounded-xl border {variantStyles[variant]} flex items-start gap-3">
  {#if icon}
    <span class="{icon} text-2xl shrink-0 mt-0.5 {iconColors[variant]}"></span>
  {/if}
  <div class="space-y-1 w-full text-xs leading-relaxed">
    {#if title}
      <h4 class="font-bold text-sm {titleColors[variant]} flex items-center gap-1.5">
        {title}
      </h4>
    {/if}
    {#if description}
      <p class="text-stone-300 leading-relaxed">{description}</p>
    {/if}
    {#if children}
      {@render children()}
    {/if}
  </div>
</div>
