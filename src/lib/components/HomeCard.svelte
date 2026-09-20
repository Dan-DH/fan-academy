<script lang="ts">
let {title, children} = $props();
</script>

<article class="md:w-1/3 min-w-72 w-full rounded-lg bg-slate-600/50 flex flex-col justify-start h-96 items-center text-white">
    <div class="flex w-full items-center justify-center bg-slate-500 border-b rounded-t-lg border-amber-200 min-h-20">
        <h1 class="text-xl font-medium">{title}</h1>
    </div>
    {@render children()}
</article>
