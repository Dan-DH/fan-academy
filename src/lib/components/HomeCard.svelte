<script lang="ts">
  import type { Snippet } from 'svelte';
  import InfoCard from './InfoCard.svelte';

  let {
    title,
    icon,
    footer,
    class: className = 'w-80 sm:w-96 min-h-96',
    children
  }: {
    title?: string;
    icon?: string;
    footer?: string | Snippet;
    class?: string;
    children?: Snippet;
  } = $props();
</script>

<InfoCard {title} {icon} {footer} class="{className}">
  {@render children?.()}
</InfoCard>
