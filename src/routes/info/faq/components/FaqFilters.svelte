<script lang="ts">
  import FaqNav from './FaqNav.svelte';
  import type { FaqCategory } from '$lib/types/InfoType';

  interface Props {
    searchQuery: string;
    activeCategory: FaqCategory;
    filteredCount?: number;
    onSearchChange: (query: string) => void;
    onCategoryChange: (category: FaqCategory) => void;
  }

  let props: Props = $props();
</script>

<FaqNav {...props} />
