export const StatusEffects = {
  NONE: 0,
  RUNE_METAL: 1 << 0,
  SHINING_HELM: 1 << 1,
  SUPER_CHARGE: 1 << 2,
  FACTION_EQUIPMENT: 1 << 3,
  MANA_VIAL: 1 << 4,
  PRIESTESS_DEBUFF: 1 << 5,
  DWARVEN_BREW: 1 << 6,
  ANNIHILATOR_DEBUFF: 1 << 7,
  ENGINEER_SHIELD: 1 << 8
  // MEAT: 1 << 9,
  // BLOODLUST: 1 << 10,
  // KNEELING: 1 << 11,
  // ENGINEER_ATTACK_BUFF: 1 << 12,
  // JARATE: 1 << 13,
  // SANDVICH: 1 << 14,
  // MONK_DEBUFF: 1 << 15,
  // POISONER_DEBUFF: 1 << 16
};

export class StatusTracker {
  status: number;
  constructor(initialMask = StatusEffects.NONE) {
    this.status = initialMask;
  }

  add(...effects: number[]) {
    for (const effect of effects) {
      this.status |= effect;
    }
  }

  remove(...effects: number[]) {
    for (const effect of effects) {
      this.status &= ~effect;
    }
  }

  toggle(effect: number) {
    this.status ^= effect;
  }

  has(effect: number) {
    return (this.status & effect) !== 0;
  }

  hasAll(...effects: number[]) {
    const combined = effects.reduce((acc, curr) => acc | curr, 0);
    return (this.status & combined) === combined;
  }

  get() {
    return this.status;
  }

  clear() {
    this.status = StatusEffects.NONE;
  }
}