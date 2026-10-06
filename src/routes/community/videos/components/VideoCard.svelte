<script lang="ts">
  import type { HeroAcademyVideo, VideoCategory } from '$lib/data/placeholder';
  import InfoCard from '$lib/components/InfoCard.svelte';

  interface Props {
    video: HeroAcademyVideo;
    onSelect: (video: HeroAcademyVideo) => void;
  }

  let { video, onSelect }: Props = $props();

  const categoryIconMap: Record<VideoCategory, string> = {
    guide: 'icon-[material-symbols--menu-book-outline]',
    tactics: 'icon-[akar-icons--double-sword]',
    'faction-guide': 'icon-[material-symbols--shield]',
    'match-commentary': 'icon-[material-symbols--trophy-outline]',
    gameplay: 'icon-[material-symbols--sports-esports-outline]',
    showcase: 'icon-[material-symbols--movie-outline]'
  };

  const categoryIcon = $derived(
    categoryIconMap[video.category] ?? 'icon-[material-symbols--play-circle-outline]'
  );
</script>

<InfoCard
  title={video.categoryLabel}
  icon={categoryIcon}
  class="h-full hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-200 group"
>
  {#snippet headerRight()}
    {#if video.duration}
      <span
        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-950/80 text-stone-300 text-xs font-mono font-medium border border-stone-800"
      >
        <span class="icon-[material-symbols--schedule-outline] text-xs text-amber-400/80"></span>
        {video.duration}
      </span>
    {/if}
  {/snippet}

  <!-- Video Thumbnail -->
  <div
    class="relative aspect-video w-full rounded-xl overflow-hidden bg-stone-950 shrink-0 border border-stone-800/80"
  >
    <img
      src={video.thumbnailUrl}
      alt={video.title}
      loading="lazy"
      onerror={(e) => {
        (e.currentTarget as HTMLImageElement).src = '/game_board.webp';
      }}
      class="w-full h-full object-cover"
    />
  </div>

  <!-- Clean Video Details -->
  <div class="space-y-2 flex-1 flex flex-col justify-between">
    <div class="space-y-1.5">
      <div class="flex items-center gap-1.5 text-xs text-amber-400/90 font-medium">
        <span class="icon-[material-symbols--person] text-sm shrink-0"></span>
        <span class="truncate">{video.channelTitle}</span>
      </div>

      <h3
        class="text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug"
      >
        {video.title}
      </h3>
    </div>

    <p class="text-xs text-stone-300 line-clamp-2 leading-relaxed">
      {video.description}
    </p>
  </div>

  {#snippet footer()}
    <button
      type="button"
      onclick={() => onSelect(video)}
      class="w-full py-3.5 px-5 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-300 bg-stone-950/80 hover:bg-amber-500 hover:text-stone-950 transition-all cursor-pointer group/btn"
    >
      <span class="icon-[material-symbols--play-circle-outline] text-base"></span>
      <span>Watch Video</span>
      <span
        class="icon-[material-symbols--arrow-forward-rounded] text-base group-hover/btn:translate-x-1 transition-transform"
      ></span>
    </button>
  {/snippet}
</InfoCard>
