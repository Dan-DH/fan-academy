<script lang="ts">
	import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools";
  import "../app.css";
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
	import Navbar from "$lib/components/Navbar.svelte";
  let { children } = $props();

  const queryClient = new QueryClient({})
</script>

<QueryClientProvider client={queryClient}>

  <div
    class="fixed inset-0 -z-10 pointer-events-none bg-[url('/banner.webp')] bg-cover bg-center bg-no-repeat"
    aria-hidden="true"
  >
    <div class="absolute inset-0 bg-black/40"></div>
  </div>

  <div class="min-h-screen relative flex flex-col text-base-content selection:bg-primary selection:text-primary-content">
    <Navbar/>
    <main class="flex-1 w-full">
      <section class="min-h-screen w-full md:mx-auto my-5 p-1">
      <div class="relative max-w-7xl mx-auto px-4 py-6 md:py-10 text-base-content flex flex-col gap-10">
        {@render children()}
      </div>
      </section>
    </main>
  </div>

  <SvelteQueryDevtools />

</QueryClientProvider>
