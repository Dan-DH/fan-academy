export interface UnitGuide {
  name: string;
  count: number;
  role: string;
  hp: number;
  attack: number;
  attackType: 'Physical' | 'Magical';
  range: number;
  move: number;
  physicalResist: number;
  magicalResist: number;
  special: string;
  image: string;
  localFallback?: string;
  tacticalTip?: string;
}

export interface ItemGuide {
  name: string;
  count: number;
  type: 'Upgrade' | 'Consumable';
  target: string;
  effect: string;
  tacticalTip?: string;
}

export interface FactionGuide {
  id: string;
  name: string;
  title: string;
  splashImage: string;
  color: string;
  borderAccent: string;
  badgeClass: string;
  description: string;
  passiveName: string;
  passiveDescription: string;
  units: UnitGuide[];
  items: ItemGuide[];
}

export interface SpecialTileGuide {
  id: string;
  name: string;
  iconName: string;
  colorClass: string;
  badgeColor: string;
  effect: string;
  details: string;
  tacticalTip: string;
}

export interface APActionGuide {
  action: string;
  cost: string;
  icon: string;
  description: string;
}

export interface GameStatusGuide {
  status: string;
  badgeColor: string;
  icon: string;
  description: string;
}

export type GameStatusInfo = GameStatusGuide;

export interface AdvancedTacticGuide {
  title: string;
  icon: string;
  summary: string;
  details: string;
}

export interface AboutSection {
  title: string;
  content: string[];
}

export interface AboutDisclaimer {
  title: string;
  content: string;
}

export interface AboutCitation {
  author: string;
  source: string;
  note: string;
}

export interface AboutData {
  fanAcademy: AboutSection;
  heroAcademy: AboutSection;
  disclaimer: AboutDisclaimer;
  citation: AboutCitation;
}
