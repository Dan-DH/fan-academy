<script lang="ts">

</script>

<div
      class="w-full flex flex-col items-center justify-between gap-4 p-4 sm:p-5
         bg-slate-950/80 bg-[url('game_board.webp')] bg-cover bg-center bg-no-repeat bg-blend-multiply
         backdrop-blur-md text-base-content selection:bg-primary selection:text-primary-content
         border-2 border-amber-600 rounded-xl shadow-2xl
         ring-1 ring-amber-400/40 my-10 py-10"
    >
    <div class="w-11/12 mx-auto flex sm:col justify-center items-center gap-10">
      <div class="hidden md:inline-grid md:hover-3d">
        <figure class="w-48 aspect-square">
          <img src="paladin.webp" alt="paladin" class="">
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
          <h1 class="md:text-2xl sm:text-md text-center font-black tracking-wide text-transparent bg-clip-text bg-linear-to-b from-amber-100 via-amber-300 to-amber-600 drop-shadow">
            MASTER THE GRID
          </h1>
          <h1 class="md:text-2xl sm:text-md text-center font-black tracking-wide text-transparent bg-clip-text bg-linear-to-b from-amber-100 via-amber-300 to-amber-600 drop-shadow">
            DEFEAT THE RIVALS
          </h1>
        </div>

        <div class="hidden md:inline-grid md:hover-3d">
          <figure class="w-48 aspect-square -scale-x-100">
            <img src="/gunner.webp" alt="gunner">
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
      class="shrink-0 btn px-6 py-5 font-extrabold tracking-wider uppercase
              text-amber-950 bg-linear-to-b from-amber-400 to-amber-600
              rounded-lg border border-amber-300 shadow-lg md:text-2xl sm:text-lg
              hover:from-amber-300 hover:to-amber-500 hover:scale-105 active:scale-95 transition-all"
    >
    <span class="icon-[akar-icons--double-sword] text-3xl"></span>
      Battle Now
    </a>
    </div>
