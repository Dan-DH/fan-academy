<script lang="ts">
  let {
    icon,
    title,
    subtitle
  }: {
    icon: string;
    title: string;
    subtitle: string;
  } = $props();
</script>

<div class="flex items-center justify-between border-b border-amber-500/30 pb-3 flex-wrap gap-4">
  <div class="flex items-center gap-3">
    <span class="{icon} text-3xl text-amber-400"></span>
    <div>
      <h2 class="text-2xl sm:text-3xl font-extrabold text-amber-300">{title}</h2>
      <p class="text-stone-400 text-sm">{subtitle}</p>
    </div>
  </div>
</div>
