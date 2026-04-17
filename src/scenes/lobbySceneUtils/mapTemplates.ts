import { ETiles } from "../../enums/gameEnum";

/**
  * 2 medium crystals
  * 2 attack tiles
  * 2 physical resistance tiles
  * 1 assault tile
  */
const map1 = [
  {
    // row: 1,
    // col: 0,
    tileType: ETiles.SPAWN,
    boardPosition: 9
  },
  {
    // row: 3,
    // col: 8,
    tileType: ETiles.SPAWN,
    boardPosition: 35
  },
  {
    // row: 3,
    // col: 0,
    tileType: ETiles.SPAWN,
    boardPosition: 27
  },
  {
    // row: 1,
    // col: 8,
    tileType: ETiles.SPAWN,
    boardPosition: 17
  },
  {
    // row: 1,
    // col: 2,
    tileType: ETiles.POWER,
    boardPosition: 11
  },
  {
    // row: 3,
    // col: 6,
    tileType: ETiles.POWER,
    boardPosition: 33
  },
  {
    // row: 2,
    // col: 1,
    tileType: ETiles.PHYSICAL_RESISTANCE,
    boardPosition: 19
  },
  {
    // row: 2,
    // col: 7,
    tileType: ETiles.PHYSICAL_RESISTANCE,
    boardPosition: 25
  },
  {
    // row: 2,
    // col: 4,
    tileType: ETiles.CRYSTAL_DAMAGE,
    boardPosition: 22
  }
];

/**
  * 2 medium crystals
  * 2 attack tiles
  * 1 magical resistance tile
  * 1 assault tile
  */
const map2 = [
  {
    // row: 0,
    // col: 0,
    tileType: ETiles.SPAWN,
    boardPosition: 0
  },
  {
    // row: 0,
    // col: 8,
    tileType: ETiles.SPAWN,
    boardPosition: 8
  },
  {
    // row: 4,
    // col: 0,
    tileType: ETiles.SPAWN,
    boardPosition: 36
  },
  {
    // row: 4,
    // col: 8,
    tileType: ETiles.SPAWN,
    boardPosition: 44
  },
  {
    // row: 2,
    // col: 2,
    tileType: ETiles.POWER,
    boardPosition: 20
  },
  {
    // row: 2,
    // col: 6,
    tileType: ETiles.POWER,
    boardPosition: 24
  },
  {
    // row: 0,
    // col: 4,
    tileType: ETiles.MAGICAL_RESISTANCE,
    boardPosition: 4
  },
  {
    // row: 4,
    // col: 4,
    tileType: ETiles.CRYSTAL_DAMAGE,
    boardPosition: 40
  }
];

/**
  * Dwarves map:
  * 2 medium crystals
  * 2 assault tiles
  * 1 attack tile
  * 2 teleporters
  */
const map3 = [
  {
    // row: 1,
    // col: 0,
    tileType: ETiles.SPAWN,
    boardPosition: 9
  },
  {
    // row: 3,
    // col: 8,
    tileType: ETiles.SPAWN,
    boardPosition: 35
  },
  {
    // row: 3,
    // col: 0,
    tileType: ETiles.SPAWN,
    boardPosition: 27
  },
  {
    // row: 1,
    // col: 8,
    tileType: ETiles.SPAWN,
    boardPosition: 17
  },
  {
    // row: 2,
    // col: 4,
    tileType: ETiles.POWER,
    boardPosition: 22
  },
  {
    // row: 0,
    // col: 6,
    tileType: ETiles.TELEPORTER,
    boardPosition: 6
  },
  {
    // row: 4,
    // col: 2,
    tileType: ETiles.TELEPORTER,
    boardPosition: 38
  },
  {
    // row: 3,
    // col: 2,
    tileType: ETiles.CRYSTAL_DAMAGE,
    boardPosition: 29
  },
  {
    // row: 1,
    // col: 6,
    tileType: ETiles.CRYSTAL_DAMAGE,
    boardPosition: 15
  }
];

/**
  * Single crystal map
  * 2 assault tiles
  * 2 attack tiles
  * 2 physical resistance tiles
  */
const map4 = [
  {
    // row: 0,
    // col: 0,
    tileType: ETiles.SPAWN,
    boardPosition: 0
  },
  {
    // row: 0,
    // col: 8,
    tileType: ETiles.SPAWN,
    boardPosition: 8
  },
  {
    // row: 4,
    // col: 0,
    tileType: ETiles.SPAWN,
    boardPosition: 36
  },
  {
    // row: 4,
    // col: 8,
    tileType: ETiles.SPAWN,
    boardPosition: 44
  },
  {
    // row: 1,
    // col: 2,
    tileType: ETiles.POWER,
    boardPosition: 11
  },
  {
    // row: 3,
    // col: 6,
    tileType: ETiles.POWER,
    boardPosition: 33
  },
  {
    // row: 1,
    // col: 6,
    tileType: ETiles.PHYSICAL_RESISTANCE,
    boardPosition: 15
  },
  {
    // row: 3,
    // col: 2,
    tileType: ETiles.PHYSICAL_RESISTANCE,
    boardPosition: 29
  },
  {
    // row: 0,
    // col: 4,
    tileType: ETiles.CRYSTAL_DAMAGE,
    boardPosition: 4
  },
  {
    // row: 4,
    // col: 4,
    tileType: ETiles.CRYSTAL_DAMAGE,
    boardPosition: 40
  }
];

/**
  * Tribe map:
  * 3 small crystals (not barbed)
  * 2 assault tiles
  * 2 magical resist tiles
  */
const map5 = [
  {
    // row: 1,
    // col: 0,
    tileType: ETiles.SPAWN,
    boardPosition: 9
  },
  {
    // row: 3,
    // col: 8,
    tileType: ETiles.SPAWN,
    boardPosition: 35
  },
  {
    // row: 3,
    // col: 0,
    tileType: ETiles.SPAWN,
    boardPosition: 27
  },
  {
    // row: 1,
    // col: 8,
    tileType: ETiles.SPAWN,
    boardPosition: 17
  },
  {
    // row: 2,
    // col: 1,
    tileType: ETiles.POWER,
    boardPosition: 19
  },
  {
    // row: 2,
    // col: 7,
    tileType: ETiles.POWER,
    boardPosition: 25
  },
  {
    // row: 0,
    // col: 5,
    tileType: ETiles.MAGICAL_RESISTANCE,
    boardPosition: 5
  },
  {
    // row: 4,
    // col: 3,
    tileType: ETiles.MAGICAL_RESISTANCE,
    boardPosition: 39
  },
  {
    // row: 0,
    // col: 3,
    tileType: ETiles.CRYSTAL_DAMAGE,
    boardPosition: 3
  },
  {
    // row: 4,
    // col: 5,
    tileType: ETiles.CRYSTAL_DAMAGE,
    boardPosition: 41
  }
];

/**
 * kitty-corner map:
 * 2 medium crystals
 * 2 assault tiles
 * 1 attack tile
 * 2 speed tiles
 */
const map6 = [
  {
    // row: 0,
    // col: 2,
    tileType: ETiles.SPAWN,
    boardPosition: 2
  },
  {
    // row: 2,
    // col: 8,
    tileType: ETiles.SPAWN,
    boardPosition: 26
  },
  {
    // row: 2,
    // col: 0,
    tileType: ETiles.SPAWN,
    boardPosition: 18
  },
  {
    // row: 4,
    // col: 6,
    tileType: ETiles.SPAWN,
    boardPosition: 42
  },
  {
    // row: 4,
    // col: 2,
    tileType: ETiles.CRYSTAL_DAMAGE,
    boardPosition: 38
  },
  {
    // row: 0,
    // col: 6,
    tileType: ETiles.CRYSTAL_DAMAGE,
    boardPosition: 6
  },
  {
    // row: 2,
    // col: 4,
    tileType: ETiles.POWER,
    boardPosition: 22
  },
  {
    // row: 3,
    // col: 7,
    tileType: ETiles.SPEED,
    boardPosition: 34
  },
  {
    // row: 1,
    // col: 1,
    tileType: ETiles.SPEED,
    boardPosition: 10
  }
];

/**
 * Shaolin map:
 * 2 medium crystals
 * 2 assault tiles
 * 1 attack tile
 * 1 speed tile
 */
const map7 = [
  {
    // row: 1,
    // col: 0,
    tileType: ETiles.SPAWN,
    boardPosition: 9
  },
  {
    // row: 4,
    // col: 0,
    tileType: ETiles.SPAWN,
    boardPosition: 36
  },
  {
    // row: 1,
    // col: 8,
    tileType: ETiles.SPAWN,
    boardPosition: 17
  },
  {
    // row: 4,
    // col: 8,
    tileType: ETiles.SPAWN,
    boardPosition: 44
  },
  {
    // row: 1,
    // col: 4,
    tileType: ETiles.POWER,
    boardPosition: 13
  },
  {
    // row: 4,
    // col: 4,
    tileType: ETiles.SPEED,
    boardPosition: 40
  },
  {
    // row: 2,
    // col: 2,
    tileType: ETiles.CRYSTAL_DAMAGE,
    boardPosition: 20
  },
  {
    // row: 2,
    // col: 6,
    tileType: ETiles.CRYSTAL_DAMAGE,
    boardPosition: 24
  }
];

// console.log([map1, map2, map3, map4, map5, map6, map7]);
export const mapTemplates: {
  // row: number,// TODO: remove if not used
  // col: number,
  tileType: ETiles,
  boardPosition: number
}[][] = [map1, map2, map3, map4, map5, map6, map7];
