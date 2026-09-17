export const StatusEffects = {
  NONE: 0,
  POWER_TILE: 1 << 0,
  PHYSICAL_RESISTANCE_TILE: 1 << 1,
  MAGICAL_RESISTANCE_TILE: 1 << 2,
  CRYSTAL_DAMAGE_TILE: 1 << 3,
  TELEPORTER_TILE: 1 << 4,
  SPEED_TILE: 1 << 5,
  RUNE_METAL: 1 << 6,
  SHINING_HELM: 1 << 7,
  SUPER_CHARGE: 1 << 8,
  FACTION_EQUIPMENT: 1 << 9,
  MANA_VIAL: 1 << 10,
  PRIESTESS_DEBUFF: 1 << 11,
  DWARVEN_BREW: 1 << 12,
  ANNIHILATOR_DEBUFF: 1 << 13,
  ENGINEER_SHIELD: 1 << 14
  // MEAT: 1 << 15,
  // BLOODLUST: 1 << 16,
  // KNEELING: 1 << 17,
  // ENGINEER_ATTACK_BUFF: 1 << 18,
  // JARATE: 1 << 19,
  // SANDVICH: 1 << 20,
  // MONK_DEBUFF: 1 << 21,
  // POISONER_DEBUFF: 1 << 22
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