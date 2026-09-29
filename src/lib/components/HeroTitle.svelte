<script lang="ts">
    let { children } = $props();
</script>

<h1 class="text-3xl sm:text-5xl md:text-6xl font-black tracking-wide text-transparent bg-clip-text bg-linear-to-b from-amber-100 via-amber-300 to-amber-600 drop-shadow-md">
    {@render children()}
</h1>
