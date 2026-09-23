<script lang="ts">
let {title, children} = $props();
</script>

<div class=" aura aura-gold ">
    <article class=" card w-96 bg-base-100 flex flex-col justify-start h-96 items-center text-white">
        <div class="flex w-full items-center justify-center bg-base-300 border-b rounded-t-3xl border-amber-200 min-h-20">
            <h1 class="text-xl font-medium">{title}</h1>
        </div>
        {@render children()}
    </article>
</div>
