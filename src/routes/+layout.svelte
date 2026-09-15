<script lang="ts">
  import "../app.css";

  let { children } = $props();
</script>

<div class="min-h-screen flex flex-col bg-base-100 text-base-content selection:bg-primary selection:text-primary-content">

  <main class="flex-1 flex flex-col">
    {@render children()}
  </main>

</div>
