<script lang="ts">
  import type { FaqItem } from '$lib/types/InfoType';

  interface Props {
    faqs: FaqItem[];
  }

  let { faqs }: Props = $props();

  let openId = $state<string | null>(faqs[0]?.id ?? null);

  // Keep open item in sync when faqs array changes
  $effect(() => {
    if (faqs.length > 0) {
      if (!openId || !faqs.some((f) => f.id === openId)) {
        openId = faqs[0].id;
      }
    } else {
      openId = null;
    }
  });

  function toggleFaq(id: string) {
    openId = openId === id ? null : id;
  }
</script>

<div class="faq-accordion-container w-full border border-stone-800 rounded-2xl shadow-xl overflow-hidden divide-y divide-stone-800/80 bg-base-200/90">
  {#each faqs as faq (faq.id)}
    {@const isOpen = openId === faq.id}
    <div
      class="collapse collapse-arrow bg-base-200/60 hover:bg-base-200/90 transition-colors border-none {isOpen ? 'collapse-open' : 'collapse-close'}"
    >
      <button
        type="button"
        onclick={() => toggleFaq(faq.id)}
        aria-expanded={isOpen}
        aria-controls={'faq-answer-' + faq.id}
        class="collapse-title text-base sm:text-lg font-bold text-stone-100 flex items-center pr-12 gap-3 py-4 sm:py-5 text-left cursor-pointer border-none bg-transparent hover:bg-stone-800/40 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400/50"
      >
        <span class="icon-[akar-icons--chat-question] text-amber-400 text-lg sm:text-xl shrink-0"></span>
        <span class="leading-snug">{faq.question}</span>
      </button>

      <!-- Accordion Content -->
      <div
        id={'faq-answer-' + faq.id}
        role="region"
        class="collapse-content text-sm sm:text-base text-stone-300 leading-relaxed pb-5 pl-11 sm:pl-12 pr-6"
      >
        <div class="border-l-2 border-amber-500/60 bg-stone-900/50 rounded-r-xl p-4 text-stone-200 text-sm sm:text-base leading-relaxed">
          <p>{faq.answer}</p>
        </div>
      </div>
    </div>
  {/each}
</div>

<style>
  /* Eliminate the DaisyUI content-visibility delay and flicker */
  :global(.faq-accordion-container .collapse) {
    outline: none !important;
    outline-offset: 0 !important;
    box-shadow: none !important;
    transition: grid-template-rows 220ms cubic-bezier(0.4, 0, 0.2, 1) !important;
  }

  :global(.faq-accordion-container .collapse.collapse-close) {
    grid-template-rows: max-content 0fr !important;
  }

  :global(.faq-accordion-container .collapse.collapse-open) {
    grid-template-rows: max-content 1fr !important;
  }

  :global(.faq-accordion-container .collapse-content) {
    content-visibility: visible !important;
    visibility: visible !important;
    overflow: hidden !important;
    min-height: 0 !important;
    transition: none !important;
  }

  :global(.faq-accordion-container .collapse-title:after) {
    transition: transform 220ms cubic-bezier(0.4, 0, 0.2, 1) !important;
  }
</style>
