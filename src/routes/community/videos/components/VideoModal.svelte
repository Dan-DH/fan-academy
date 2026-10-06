<script lang="ts">
  import type { HeroAcademyVideo } from '$lib/data/placeholder';

  interface Props {
    video: HeroAcademyVideo;
    onClose: () => void;
  }

  let { video, onClose }: Props = $props();

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      onClose();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div
  class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-video-title"
  tabindex="-1"
>
  <!-- Accessible Backdrop with lower opacity -->
  <button
    type="button"
    class="fixed inset-0 w-full h-full bg-black/50 backdrop-blur-sm cursor-pointer border-0"
    onclick={onClose}
    aria-label="Close modal overlay"
    tabindex="-1"
  ></button>

  <div
    class="relative w-full max-w-4xl bg-stone-900 border border-amber-500/40 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] z-10"
  >
    <!-- Modal Header -->
    <div class="flex items-center justify-between px-5 py-4 border-b border-stone-800 bg-stone-950/70">
      <h3 id="modal-video-title" class="text-base sm:text-lg font-bold text-white line-clamp-1 pr-4">
        {video.title}
      </h3>

      <button
        type="button"
        onclick={onClose}
        class="text-stone-400 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-white/10 shrink-0 flex items-center justify-center"
        aria-label="Close modal"
      >
        <span class="icon-[material-symbols--close] text-2xl"></span>
      </button>
    </div>

    <!-- Embedded Video Frame -->
    <div class="aspect-video w-full bg-black">
      <iframe
        src="{video.embedUrl}?autoplay=1"
        title={video.title}
        class="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
    </div>

    <!-- Modal Details -->
    <div class="p-5 sm:p-6 overflow-y-auto space-y-3">
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800/80 pb-3"
      >
        <div class="flex items-center gap-2 flex-wrap text-xs sm:text-sm text-stone-300">
          <span class="flex items-center gap-1.5 font-medium text-amber-300">
            <span class="icon-[material-symbols--person] text-amber-400 text-base"></span>
            {video.channelTitle}
          </span>

          {#if video.duration}
            <span class="text-stone-600">•</span>
            <span class="text-stone-400 font-mono text-xs">{video.duration}</span>
          {/if}

          {#if video.publishedDate}
            <span class="text-stone-600">•</span>
            <span class="text-stone-400">{video.publishedDate}</span>
          {/if}
        </div>

        <a
          href={video.youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold transition-colors"
        >
          Watch on YouTube
          <span class="icon-[material-symbols--open-in-new] text-sm"></span>
        </a>
      </div>

      <p class="text-sm text-stone-300 leading-relaxed">
        {video.description}
      </p>
    </div>
  </div>
</div>
