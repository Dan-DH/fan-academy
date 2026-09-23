<script lang="ts">
	import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools";
  import "../app.css";
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
	import Navbar from "$lib/components/Navbar.svelte";
  let { children } = $props();

  const queryClient = new QueryClient({})
</script>

<QueryClientProvider client={queryClient}>

  <div class="min-h-screen relative flex flex-col bg-[url('banner.webp')] bg-cover bg-center bg-no-repeat text-base-content selection:bg-primary selection:text-primary-content ">
    <Navbar/>
    <main class="min-h-screen w-full bg-black/40">
      <section class="min-h-screen w-full md:mx-auto my-5 p-1">
        {@render children()}
      </section>
    </main>
  </div>

  <SvelteQueryDevtools />

</QueryClientProvider>
