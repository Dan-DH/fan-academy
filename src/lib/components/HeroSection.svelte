<script lang="ts">

</script>

<div class="relative max-w-7xl mx-auto w-full">
  <!-- Outer Glow Effect -->
  <div class="absolute w-full -inset-1 rounded-2xl bg-linear-to-b from-amber-400/40 via-amber-600/20 to-amber-900/40 blur-md -z-10"></div>

  <!-- Main Card Container -->
  <div class="relative w-full bg-stone-900/90 bg-[url('game_board.webp')] bg-cover bg-center bg-no-repeat bg-blend-multiply
         backdrop-blur-md text-base-content selection:bg-primary selection:text-primary-content rounded-xl p-8 border-2 border-amber-500 shadow-[inset_0_0_20px_rgba(0,0,0,0.8),0_10px_30px_rgba(0,0,0,0.7)]">

    <!-- Inner Inset Gold Line -->
    <div class="pointer-events-none absolute inset-1.5 rounded-lg border border-amber-400/30"></div>

    <!-- 4 Decorative Corner Rivets / Gems -->
    <div class="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-linear-to-br from-amber-200 to-amber-600 border border-stone-900 rotate-45 shadow-sm"></div>
    <div class="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-linear-to-br from-amber-200 to-amber-600 border border-stone-900 rotate-45 shadow-sm"></div>
    <div class="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-linear-to-br from-amber-200 to-amber-600 border border-stone-900 rotate-45 shadow-sm"></div>
    <div class="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-linear-to-br from-amber-200 to-amber-600 border border-stone-900 rotate-45 shadow-sm"></div>

    <!-- Your Hero Content Goes Here -->
    <div class="relative z-10 flex flex-col items-center gap-5">

    <div class="w-11/12 mx-auto flex sm:col justify-center items-center gap-10">
      <div class="hidden md:inline-grid md:hover-3d">
        <figure class="w-48 aspect-square">
          <img src="paladin.webp" alt="paladin" class="w-90 aspect-square">
        </figure>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>

        <div class="text-center sm:text-left space-y-1">
          <h1 class="md:text-4xl sm:text-md text-center font-black tracking-wide text-transparent bg-clip-text bg-linear-to-b from-amber-100 via-amber-300 to-amber-600 drop-shadow">
            MASTER THE GRID
          </h1>
          <h1 class="md:text-2xl sm:text-md text-center font-black tracking-wide text-transparent bg-clip-text bg-linear-to-b from-amber-100 via-amber-300 to-amber-600 drop-shadow">
            DEFEAT THE RIVALS
          </h1>
        </div>

        <div class="hidden md:inline-grid md:hover-3d">
          <figure class="w-48 aspect-square -scale-x-100">
            <img src="/gunner.webp" alt="gunner" class="w-90 aspect-square">
          </figure>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>

    </div>

    <a href="/auth"
      class="btn btn-xl shrink-0 px-6 py-5 font-extrabold tracking-wider uppercase
              text-amber-950 bg-linear-to-b from-amber-400 to-amber-600
              rounded-lg border border-amber-300 shadow-lg md:text-2xl sm:text-lg
              hover:from-amber-300 hover:to-amber-500 hover:scale-105 active:scale-95 transition-all"
    >
    <span class="icon-[akar-icons--double-sword] text-3xl"></span>
      Battle Now
    </a>
    </div>
    </div>

</div>



