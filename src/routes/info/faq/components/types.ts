import type { FaqCategory } from '$lib/types/InfoType';

export interface FaqCategoryTab {
  id: FaqCategory;
  label: string;
  icon: string;
}

export const FAQ_CATEGORIES: FaqCategoryTab[] = [
  { id: 'general', label: 'General & Rules', icon: 'icon-[material-symbols--rule-rounded]' },
  { id: 'combat', label: 'Combat & Crystals', icon: 'icon-[akar-icons--double-sword]' },
  { id: 'factions', label: 'Factions & Heroes', icon: 'icon-[material-symbols--shield-person-outline]' },
  { id: 'matchmaking', label: 'Matchmaking & Community', icon: 'icon-[material-symbols--trophy-outline]' }
];
