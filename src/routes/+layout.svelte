<script lang="ts">
	import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools";
  import "../app.css";
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
	import Navbar from "$lib/components/Navbar.svelte";
  let { children } = $props();

  const queryClient = new QueryClient({})
</script>

<QueryClientProvider client={queryClient}>

  <Navbar/>
  <div class="min-h-screen flex flex-col bg-base-100 text-base-content selection:bg-primary selection:text-primary-content">
    <main class="flex-1 flex flex-col">
      {@render children()}
    </main>
  </div>

  <SvelteQueryDevtools />

</QueryClientProvider>
