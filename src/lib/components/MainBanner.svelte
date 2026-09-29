<script lang="ts">
    let {children} = $props();
</script>

<div class="relative max-w-6xl mx-auto w-full">
    <div class="absolute w-full -inset-1 rounded-2xl bg-linear-to-b from-amber-400/40 via-amber-600/20 to-amber-900/40 blur-md -z-10"></div>

    <div class="relative w-full bg-stone-900/90 bg-[url('/game_board.webp')] bg-cover bg-center bg-no-repeat bg-blend-multiply
         backdrop-blur-md text-base-content selection:bg-primary selection:text-primary-content rounded-xl p-8 py-10 border-2 border-amber-500 shadow-[inset_0_0_20px_rgba(0,0,0,0.8),0_10px_30px_rgba(0,0,0,0.7)]">

        <div class="pointer-events-none absolute inset-1.5 rounded-lg border border-amber-400/30"></div>

        <div class="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-linear-to-br from-amber-200 to-amber-600 border border-stone-900 rotate-45 shadow-sm"></div>
        <div class="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-linear-to-br from-amber-200 to-amber-600 border border-stone-900 rotate-45 shadow-sm"></div>
        <div class="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-linear-to-br from-amber-200 to-amber-600 border border-stone-900 rotate-45 shadow-sm"></div>
        <div class="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-linear-to-br from-amber-200 to-amber-600 border border-stone-900 rotate-45 shadow-sm"></div>

            <div class="relative z-10 flex flex-col items-center gap-5">
                {@render children()}
            </div>
    </div>
</div>
