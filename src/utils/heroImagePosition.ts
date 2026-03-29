import { EHeroes } from "../enums/gameEnums";

export function positionHeroImage(unitType: EHeroes, belongsToP1: boolean, inHand: boolean, isKO: boolean): {
  charImageX: number,
  charImageY: number
} {
  const x = 0;
  const y = -10;

  const playerIndex = belongsToP1 ? 1 : 2;

  const unitMap = {
    // Council
    [EHeroes.ARCHER]: {
      1: {
        charImageX: x,
        charImageY: y
      },
      2: {
        charImageX: x,
        charImageY: y
      },
      KO: {
        1: {
          charImageX: x,
          charImageY: y
        },
        2: {
          charImageX: x,
          charImageY: y
        }
      },
      hand: {
        charImageX: x,
        charImageY: y - 15
      }
    },
    [EHeroes.CLERIC]: {
      1: {
        charImageX: x,
        charImageY: y
      },
      2: {
        charImageX: x,
        charImageY: y
      },
      KO: {
        1: {
          charImageX: x,
          charImageY: y
        },
        2: {
          charImageX: x,
          charImageY: y
        }
      },
      hand: {
        charImageX: x,
        charImageY: y - 15
      }
    },
    [EHeroes.KNIGHT]: {
      1: {
        charImageX: x + 5,
        charImageY: y - 5
      },
      2: {
        charImageX: x,
        charImageY: y - 5
      },
      KO: {
        1: {
          charImageX: x,
          charImageY: y
        },
        2: {
          charImageX: x,
          charImageY: y
        }
      },
      hand: {
        charImageX: x,
        charImageY: y - 15
      }
    },
    [EHeroes.NINJA]: {
      1: {
        charImageX: x,
        charImageY: y
      },
      2: {
        charImageX: x,
        charImageY: y
      },
      KO: {
        1: {
          charImageX: x,
          charImageY: y
        },
        2: {
          charImageX: x,
          charImageY: y
        }
      },
      hand: {
        charImageX: x,
        charImageY: y - 15
      }
    },
    [EHeroes.WIZARD]: {
      1: {
        charImageX: x + 10,
        charImageY: y - 5
      },
      2: {
        charImageX: x - 10,
        charImageY: y - 5
      },
      KO: {
        1: {
          charImageX: x,
          charImageY: y
        },
        2: {
          charImageX: x,
          charImageY: y
        }
      },
      hand: {
        charImageX: x,
        charImageY: y - 15
      }
    },
    // Elves
    [EHeroes.PRIESTESS]: {
      1: {
        charImageX: x + 20,
        charImageY: y - 10
      },
      2: {
        charImageX: x - 15,
        charImageY: y - 10
      },
      KO: {
        1: {
          charImageX: x,
          charImageY: y
        },
        2: {
          charImageX: x,
          charImageY: y
        }
      },
      hand: {
        charImageX: x,
        charImageY: y - 15
      }
    },
    [EHeroes.IMPALER]: {
      1: {
        charImageX: x + 10,
        charImageY: y - 5
      },
      2: {
        charImageX: x - 15,
        charImageY: y - 5
      },
      KO: {
        1: {
          charImageX: x,
          charImageY: y
        },
        2: {
          charImageX: x,
          charImageY: y
        }
      },
      hand: {
        charImageX: x + 15,
        charImageY: y - 15
      }
    },
    [EHeroes.NECROMANCER]: {
      1: {
        charImageX: x + 20,
        charImageY: y - 10
      },
      2: {
        charImageX: x - 5,
        charImageY: y - 10
      },
      KO: {
        1: {
          charImageX: x,
          charImageY: y
        },
        2: {
          charImageX: x,
          charImageY: y
        }
      },
      hand: {
        charImageX: x + 10,
        charImageY: y - 15
      }
    },
    [EHeroes.PHANTOM]: {
      1: {
        charImageX: x,
        charImageY: y + 10
      },
      2: {
        charImageX: x,
        charImageY: y + 10
      },
      KO: {
        1: {
          charImageX: x,
          charImageY: y
        },
        2: {
          charImageX: x,
          charImageY: y
        }
      },
      hand: {
        charImageX: x,
        charImageY: y - 15
      }
    },
    [EHeroes.VOIDMONK]: {
      1: {
        charImageX: x,
        charImageY: y - 10
      },
      2: {
        charImageX: x,
        charImageY: y - 10
      },
      KO: {
        1: {
          charImageX: x,
          charImageY: y + 10
        },
        2: {
          charImageX: x,
          charImageY: y + 10
        }
      },
      hand: {
        charImageX: x + 5,
        charImageY: y - 15
      }
    },
    [EHeroes.WRAITH]: {
      1: {
        charImageX: x,
        charImageY: y
      },
      2: {
        charImageX: x,
        charImageY: y
      },
      KO: {
        1: {
          charImageX: x,
          charImageY: y
        },
        2: {
          charImageX: x,
          charImageY: y
        }
      },
      hand: {
        charImageX: x,
        charImageY: y - 15
      }
    },

    // Dwarves
    [EHeroes.PALADIN]: {
      1: {
        charImageX: x,
        charImageY: y - 3
      },
      2: {
        charImageX: x,
        charImageY: y - 3
      },
      KO: {
        1: {
          charImageX: x,
          charImageY: y + 10
        },
        2: {
          charImageX: x,
          charImageY: y + 10
        }
      },
      hand: {
        charImageX: x,
        charImageY: y - 15
      }
    },
    [EHeroes.GUNNER]: {
      1: {
        charImageX: x,
        charImageY: y + 5
      },
      2: {
        charImageX: x,
        charImageY: y + 5
      },
      KO: {
        1: {
          charImageX: x,
          charImageY: y + 10
        },
        2: {
          charImageX: x,
          charImageY: y + 10
        }
      },
      hand: {
        charImageX: x,
        charImageY: y - 15
      }
    },
    [EHeroes.ENGINEER]: {
      1: {
        charImageX: x + 10,
        charImageY: y
      },
      2: {
        charImageX: x,
        charImageY: y
      },
      KO: {
        1: {
          charImageX: x,
          charImageY: y + 10
        },
        2: {
          charImageX: x,
          charImageY: y + 10
        }
      },
      hand: {
        charImageX: x,
        charImageY: y - 10
      }
    },
    [EHeroes.ANNIHILATOR]: {
      1: {
        charImageX: x,
        charImageY: y - 5
      },
      2: {
        charImageX: x,
        charImageY: y - 5
      },
      KO: {
        1: {
          charImageX: x,
          charImageY: y + 10
        },
        2: {
          charImageX: x,
          charImageY: y + 10
        }
      },
      hand: {
        charImageX: x,
        charImageY: y - 15
      }
    },
    [EHeroes.GRENADIER]: {
      1: {
        charImageX: x,
        charImageY: y + 2
      },
      2: {
        charImageX: x,
        charImageY: y + 2
      },
      KO: {
        1: {
          charImageX: x,
          charImageY: y + 10
        },
        2: {
          charImageX: x,
          charImageY: y + 10
        }
      },
      hand: {
        charImageX: x,
        charImageY: y - 15
      }
    }
  };

  if (inHand) return unitMap[unitType]['hand'];
  if (isKO) return unitMap[unitType]['KO'][playerIndex];
  return unitMap[unitType][playerIndex];
}