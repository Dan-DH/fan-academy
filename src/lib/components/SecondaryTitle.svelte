<script lang="ts">
    let { children } = $props();
</script>

<p class="text-stone-300 text-sm sm:text-base md:text-lg leading-relaxed font-medium">
    {@render children()}
</p>
