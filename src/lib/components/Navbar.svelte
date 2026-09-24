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

<div class="navbar bg-base-300 shadow-sm px-5 sticky top-0 left-0 right-0 z-10">
  <div class="navbar-start">
    <a class="btn btn-ghost text-lg" href="/">Fan Academy</a>
  </div>
  <div class="navbar-center">
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="megamenu max-sm:megamenu-vertical p-2 border border-base-300" id="my-megamenu-4" popover onclick={closePopovers}>
      <a class="btn btn-ghost" href="/leaderboard">Leaderboard</a>
      <span class="megamenu-active"></span>
      <button popovertarget="d2" class="btn btn-ghost" >Info</button>
      <div id="d2" popover class="min-w-40">
        <div class="flex max-sm:flex-col items-start">
          <ul class="menu md:menu-horizontal w-full">
            <li class="w-full flex flex-col gap-2">
              <a class="btn btn-wide btn-soft w-full" href="/info/guide">
              <span class="icon-[material-symbols--developer-guide-outline]"></span>
                Guide
              </a>
              <a class="btn btn-wide btn-soft w-full" href="/info/faq">
              <span class="icon-[akar-icons--chat-question]"></span>
                FAQ
              </a>
            </li>
          </ul>
        </div>
      </div>
      <button popovertarget="d3" class="btn btn-ghost">Community</button>
      <div id="d3" popover class="min-w-40">
        <div class="flex max-sm:flex-col items-start">
          <ul class="menu md:menu-horizontal w-full">
            <li class="w-full flex flex-col gap-2">
              <a class="btn btn-wide btn-soft w-full" href="/community/discord">
                <span class="icon-[akar-icons--discord-fill]"></span>
                Discord
              </a>
              <a class="btn btn-wide btn-soft w-full" href="/community/videos">
                <span class="icon-[bxs--videos]"></span>
                Videos
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <div class="navbar-end gap-2">
    <a class="btn btn-accent" href="/auth">
      <span class="icon-[akar-icons--double-sword] text-xl"></span>
      Battle Now!
    </a>
    <button class="btn sm:hidden" popovertarget="my-megamenu-4" aria-label="hamburger-menu">
      <span class="icon-[charm--menu-hamburger]"></span>
    </button>
  </div>
</div>
