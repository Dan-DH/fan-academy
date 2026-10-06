<script lang="ts">
  function closePopovers(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.closest('a')) {
      document.querySelectorAll<HTMLElement>('[popover]').forEach((popover) => {
        if (popover.matches(':popover-open')) {
          popover.hidePopover();
        }
      });
    }
  }
</script>

<div class="navbar bg-base-300 shadow-sm px-5 sticky top-0 left-0 right-0 z-50">
  <div class="navbar-start">
    <a class="btn btn-ghost text-lg" href="/">Fan Academy</a>
  </div>
  <div class="navbar-center">
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="megamenu max-sm:megamenu-vertical max-sm:min-w-64 max-sm:p-3 p-2 border border-base-300 shadow-xl"
      id="my-megamenu-4"
      popover
      onclick={closePopovers}
    >
      <a class="btn btn-ghost max-sm:w-full max-sm:justify-start max-sm:text-left font-semibold" href="/leaderboard">
        Leaderboard
      </a>
      <span class="megamenu-active"></span>
      <button
        popovertarget="d2"
        class="btn btn-ghost max-sm:w-full max-sm:justify-start max-sm:text-left font-semibold"
      >
        Info
      </button>
      <div id="d2" popover class="min-w-48 p-2 bg-base-200 border border-stone-800 rounded-xl shadow-2xl">
        <div class="flex max-sm:flex-col items-start w-full">
          <ul class="menu md:menu-horizontal w-full p-0">
            <li class="w-full flex flex-col gap-1.5">
              <a
                class="btn btn-wide btn-soft w-full justify-start text-left gap-3 px-3.5 font-medium hover:text-amber-300"
                href="/info/guide"
              >
                <span class="icon-[material-symbols--developer-guide-outline] text-lg text-amber-400 shrink-0"></span>
                <span>Guide</span>
              </a>
              <a
                class="btn btn-wide btn-soft w-full justify-start text-left gap-3 px-3.5 font-medium hover:text-amber-300"
                href="/info/faq"
              >
                <span class="icon-[akar-icons--chat-question] text-lg text-amber-400 shrink-0"></span>
                <span>FAQ</span>
              </a>
              <a
                class="btn btn-wide btn-soft w-full justify-start text-left gap-3 px-3.5 font-medium hover:text-amber-300"
                href="/info/patch-notes"
              >
                <span class="icon-[material-symbols--history-edu] text-lg text-amber-400 shrink-0"></span>
                <span>Patch Notes</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <button
        popovertarget="d3"
        class="btn btn-ghost max-sm:w-full max-sm:justify-start max-sm:text-left font-semibold"
      >
        Community
      </button>
      <div id="d3" popover class="min-w-48 p-2 bg-base-200 border border-stone-800 rounded-xl shadow-2xl">
        <div class="flex max-sm:flex-col items-start w-full">
          <ul class="menu md:menu-horizontal w-full p-0">
            <li class="w-full flex flex-col gap-1.5">
              <a
                class="btn btn-wide btn-soft w-full justify-start text-left gap-3 px-3.5 font-medium hover:text-amber-300"
                href="/community/discord"
              >
                <span class="icon-[akar-icons--discord-fill] text-lg text-amber-400 shrink-0"></span>
                <span>Discord</span>
              </a>
              <a
                class="btn btn-wide btn-soft w-full justify-start text-left gap-3 px-3.5 font-medium hover:text-amber-300"
                href="/community/videos"
              >
                <span class="icon-[bxs--videos] text-lg text-amber-400 shrink-0"></span>
                <span>Videos</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="max-sm:block hidden pt-2 mt-1 border-t border-base-300 w-full">
        <a
          href="/auth"
          class="btn btn-block font-extrabold tracking-wider uppercase text-amber-950 bg-linear-to-b from-amber-400 to-amber-600 rounded-lg border border-amber-300 shadow-md hover:from-amber-300 hover:to-amber-500 gap-1.5 text-xs"
        >
          <span class="icon-[akar-icons--double-sword] text-base"></span>
          Battle Now!
        </a>
      </div>
    </div>
  </div>
  <div class="navbar-end gap-2">
    <a
      href="/auth"
      class="hidden sm:inline-flex btn btn-sm sm:btn-md font-extrabold tracking-wider uppercase text-amber-950 bg-linear-to-b from-amber-400 to-amber-600 rounded-lg border border-amber-300 shadow-md hover:from-amber-300 hover:to-amber-500 hover:scale-105 active:scale-95 transition-all gap-1.5 text-xs sm:text-sm"
    >
      <span class="icon-[akar-icons--double-sword] text-base sm:text-lg"></span>
      Battle Now!
    </a>
    <button class="btn sm:hidden" popovertarget="my-megamenu-4" aria-label="hamburger-menu">
      <span class="icon-[charm--menu-hamburger]"></span>
    </button>
  </div>
</div>
