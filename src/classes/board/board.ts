import { EHeroes, ETiles, ERange, EBoardUnit } from "../../enums/gameEnums";
import { Coordinates, ICrystalBE, IHeroBE } from "../../interfaces/gameInterface";
import GameScene from "../../scenes/game.scene";
import { getGridDistance, belongsToPlayer } from "../../utils/gameUtils";
import { createBasicTileData, isEnemySpawn } from "../../utils/boardUtils";
import { ManaVial } from "../factions/elves/items";
import { Phantom } from "../factions/elves/phantom";
import { Item } from "../factions/item";
import { Crystal } from "./crystal";
import { Tile } from "./tile";
import { Engineer } from "../factions/dwarves/engineer";
import { Dwarf } from "../factions/dwarves/dwarves";
import { Hero } from "../factions/hero";
import { Grenadier } from "../factions/dwarves/grenadier";
import { HealingPotion } from "../factions/council/items";
import { DwarvenBrew } from "../factions/dwarves/items";
import { addReticleTween, removeReticleTween } from "../../utils/unitAnimations";
import { mapTemplates } from "./mapTemplates";
import { createNewHero } from "../../utils/createUnit";
import { StatusEffects } from "../../utils/statuses";
import { mapCrystalFromBE } from "../../utils/mapCrystalFromBE";
import { fanAcademy } from "../../main";
import { mapCrystalToBE } from "../../utils/mapCrystalToBE";
import { mapHeroToBE } from "../../utils/mapHeroToBE";

export class Board {
  tileSize: number = 90;
  context: GameScene;
  grid: Tile[];
  units: (Hero | Crystal)[];

  constructor(context: GameScene, boardUnits: (IHeroBE | ICrystalBE)[], map: number) {
    this.context = context;
    this.grid = this.createTileGrid(map);
    this.units = this.createBoardUnits(boardUnits);
    this.updatePaladinAurasAcrossBoard(); // run once on game start, after this.units is set
    this.checkCrystalDebuffLevelOnTurnStart();
  }

  createBoardUnits(boardUnits: (IHeroBE | ICrystalBE)[]): (Hero | Crystal)[] {
    const units: (Hero | Crystal)[] = [];

    boardUnits.forEach(u => {
      if (u.boardType === EBoardUnit.HERO) units.push(createNewHero(u as IHeroBE));
      if (u.boardType === EBoardUnit.CRYSTAL) units.push(new Crystal(mapCrystalFromBE(u as ICrystalBE)));
    });

    return units;
  }

  createTileGrid(map: number) {
    const gridArray = [];
    const specialTilesFromMap = mapTemplates[map];
    const tileCoordinates = fanAcademy.registry.get('tileCoords') as Coordinates[];

    for (let boardPosition = 0; boardPosition < 45; boardPosition++) {
      const coordinates = tileCoordinates[boardPosition];
      const specialTileMatch = specialTilesFromMap.find(tile => tile.boardPosition === boardPosition);

      if (specialTileMatch) {
        gridArray.push(new Tile(this.context, specialTileMatch));
      } else {
        gridArray.push(new Tile(this.context, createBasicTileData(coordinates)));
      }
    }
    return gridArray;
  }

  getTileFromCoordinates(row: number, col: number): Tile {
    const result = this.grid.find(tile => tile.row === row && tile.col === col);
    if (!result) throw new Error('Board getTile() No tile found');
    return result;
  }

  getTileFromBoardPosition(boardPosition: number): Tile {
    const result = this.grid.find(tile => tile.boardPosition === boardPosition);
    if (!result) throw new Error('Board getTile() No tile found');
    return result;
  }

  // Only used for saving the board state after an action
  getBoardState(): (IHeroBE | ICrystalBE)[] {
    return this.units.map(u => {
      if (u instanceof Hero) return mapHeroToBE(u);
      if (u instanceof Crystal) return mapCrystalToBE(u);
    }) as (IHeroBE | ICrystalBE)[];
  }

  // FIXME: did I delete this?
  clearHighlights() {
    this.grid.forEach(tile => tile.clearHighlight());
  }

  highlightSpawns(unitType: EHeroes) {
    const spawns = new Set<Tile>();

    /** We add:
       *  -friendly spawn tiles (unless they are occupied by a live unit other than an enemy phantom)
       *  -any tile with a KO'd unit if the unit spawning is a Wraith (and the tile is not an enemy spawn)
       */
    this.grid.forEach(tile => {
      const enemySpawn = isEnemySpawn(this.context, tile);
      const unitOnTile = this.units.find(u => u instanceof Hero && u.stats.boardPosition === tile.boardPosition) as Hero;

      if (tile.tileType === ETiles.SPAWN && !enemySpawn) {
        if (!unitOnTile || unitOnTile.stats.isKO || unitOnTile.stats.unitType === EHeroes.PHANTOM) spawns.add(tile);
      }

      if (unitType === EHeroes.WRAITH && unitOnTile?.stats.isKO && !enemySpawn) spawns.add(tile);
    });

    this.highlightTiles([...spawns]);
  }

  // FIXME: confirm this works
  highlightAllLivingEnemyTargets(unit: Hero | Item): void {
    this.units.map(u => {
      if (unit.stats.belongsTo !== unit.stats.belongsTo) u.getTile().setHighlight();
    });
    // this.crystals.map(crystal => { if (crystal.stats.belongsTo !== unit.stats.belongsTo) crystal.getTile().setHighlight();});
    // this.heroes.map(u => {if (u.stats.belongsTo !== unit.stats.belongsTo && !u.stats.isKO) u.getTile().setHighlight();});
  }

  highlightEnemyTargets(hero: Hero): void {
    const unitsInRange: (Hero | Crystal)[] = this.getUnitsInRange(hero, ERange.ATTACK);
    if (!unitsInRange.length) return;

    const enemyLOSCheck: (Hero | Crystal)[] = [];

    unitsInRange.forEach(u => {
      /**
       * Show attack reticle if one of the below is true:
       *  -target is an enemy hero and it's not KO
       *  -target is an enemy crystal
       *  -target is KO and active unit is a Necro or a Wraith
       *  -target is KO and standing on an enemy spawn, and hero is orthogonally adjacent
       */

      if (
        u instanceof Crystal && u.stats.belongsTo !== hero.stats.belongsTo ||
        u instanceof Hero && u.stats.belongsTo !== hero.stats.belongsTo && !u.stats.isKO ||
        (hero.stats.unitType === EHeroes.NECROMANCER || hero.stats.unitType === EHeroes.WRAITH) && u instanceof Hero && u.stats.isKO ||
        u instanceof Hero && u.stats.isKO && this.isOrthogonalAdjacent(hero, u) && isEnemySpawn(this.context, u.getTile())
      ) {
        enemyLOSCheck.push(u);
      }
    });

    const enemiesToHighlight: (Hero | Crystal)[] = [];
    const enemiesBlocked: (Hero | Crystal)[] = [];

    enemyLOSCheck.forEach((enemy: Hero | Crystal) => {
      if (this.hasLineOfSight(hero, enemy) || hero instanceof Grenadier) {
        enemiesToHighlight.push(enemy);
      } else {
        enemiesBlocked.push(enemy);
      }
    });

    enemiesToHighlight.forEach(enemy => addReticleTween(enemy.visuals.attackReticle));
    enemiesBlocked.forEach(enemy => enemy.visuals.blockedLOS.setVisible(true));
  }

  highlightFriendlyTargets(hero: Hero) {
    if (!hero.stats.canHeal && !hero.stats.canBuff) return;

    const unitsInHealingRange: (Hero | Crystal)[] = hero.stats.canHeal ? this.getUnitsInRange(hero, ERange.HEAL) : [];
    const unitsInBuffRange: (Hero | Crystal)[] = hero.stats.canBuff ? this.getUnitsInRange(hero, ERange.BUFF) : [];
    const totalUnitsInRange: (Hero | Crystal)[] = unitsInHealingRange.concat(unitsInBuffRange);

    if (!totalUnitsInRange.length) return;

    totalUnitsInRange.forEach(u => {
      const maxHealth = u.stats.maxHealth;
      const currentHealth = u.stats.currentHealth;

      if (u instanceof Hero && hero.stats.canHeal && u.stats.belongsTo === hero.stats.belongsTo && currentHealth! < maxHealth!) {
        addReticleTween(u.visuals.healReticle);
      }
      // Will need to update this logic for any future buffs by other units
      if (hero.stats.canBuff && u.stats.belongsTo === hero.stats.belongsTo && !u.status.has(StatusEffects.ENGINEER_SHIELD)) {
        if (u instanceof Crystal) addReticleTween(u.visuals.healReticle);
        if (u instanceof Hero && !u.stats.isKO) addReticleTween(u.visuals.healReticle);
      }
    });
  }

  highlightMovementArea(hero: Hero) {
    const tilesInRange = this.getTilesInMoveRange(hero);

    this.highlightTiles(tilesInRange);
  }

  highlightTeleportOptions(hero: Hero) {
    // Teleporting tile
    if (hero.getTile().tileType === ETiles.TELEPORTER) {
      const teleportTiles: Tile[] = this.grid.filter(tile => tile.tileType === ETiles.TELEPORTER && !this.isTileOccupiedExcludingKOs(tile.boardPosition));
      this.highlightTiles(teleportTiles);
    }

    // Ninja teleporting
    if (hero.stats.unitType !== EHeroes.NINJA) return;

    this.units.forEach(u => {
      if (hero.stats.belongsTo === u.stats.belongsTo) return;
      if (u instanceof Crystal) return;
      if(!u.stats.isKO && u.stats.unitId !== hero.stats.unitId) addReticleTween(u.visuals.allyReticle);
    });
  }

  highlightEquipmentTargets(item: Item): void {
    this.units.forEach(u => {
      if (u instanceof Crystal) return;
      if (u.stats.belongsTo !== item.stats.belongsTo) return;
      if (u instanceof Phantom) return;
      if (u.isAlreadyEquipped(item)) return;
      if (item instanceof HealingPotion && u.isFullHP()) return;
      if (!item.stats.canHeal && u.stats.isKO) return;
      if (item.stats.canHeal && u.stats.isKO) {
        if (item instanceof ManaVial) return;
        if (item instanceof DwarvenBrew) return;
      }

      u.getTile().setHighlight();
    });
  }

  highlightAllBoard() {
    this.highlightTiles(this.grid);
  }

  highlightTiles(tiles: Tile[]) {
    tiles.forEach(tile => {
      tile.setHighlight();
    });
  }

  // FIXME: remove if not used, or adapt for single number param
  highlightTilesByPosition(positions: number[]) {
    positions.forEach(p => {
      if (p < 0 || p > 44) {
        console.error('highlightTilesByPosition() - position not in board: ', p);
        return;
      }
      const tile = this.grid.find(t => t.boardPosition === p);
      tile!.setHighlight();
    });
  }

  removeReticles(): void {
    this.units.forEach(u => {
      removeReticleTween(u.visuals.attackReticle);
      removeReticleTween(u.visuals.healReticle);
      u.visuals.blockedLOS.setVisible(false);
      if (u instanceof Hero) removeReticleTween(u.visuals.allyReticle);
    });
  }

  getTilesInMoveRange(hero: Hero): Tile[] {
    let speedTileBonus = 0;
    if (hero.status. has(StatusEffects.SPEED_TILE)) {
      if (hero instanceof Dwarf) {
        speedTileBonus = hero instanceof Engineer ? 4 : 3;
      } else {
        speedTileBonus = 2;
      }
    }

    const range = hero.stats.movement + speedTileBonus;

    const inRangeTiles = new Set<Tile>;

    this.grid.forEach(t => {
      const distance = getGridDistance(t.row, t.col, hero.stats.row, hero.stats.col);

      if (distance > range) return;

      if (
        !isEnemySpawn(this.context, t) &&
        !this.isTileOccupiedExcludingKOs(t.boardPosition)
      ) inRangeTiles.add(t);
    });

    return [...inRangeTiles];
  }

  getUnitsInRange(hero: Hero, rangeType: ERange): (Hero | Crystal)[] {
    let range: number;

    switch (rangeType) {
      case ERange.ATTACK:
        range = hero.stats.attackRange;
        break;

      case ERange.HEAL:
        range = hero.stats.healingRange;
        break;

      case ERange.BUFF:
        range = hero.stats.buffRange;
        break;

      default:
        break;
    }

    const inRangeUnits = new Set<(Hero | Crystal)>;

    this.units.forEach(u => {
      const distance = getGridDistance(u.stats.row, u.stats.col, hero.stats.row, hero.stats.col);

      if (distance > range) return;

      if (u instanceof Crystal || u instanceof Hero && u.stats.unitId !== hero.stats.unitId) inRangeUnits.add(u); // TODO: refactor this for legibility
    });

    return [...inRangeUnits];
  }

  // FIXME: change parameter from Tile to bp
  get3x3AreaOfEffectTiles(boardPosition: number): Tile[] {
    const totalRows = 4;
    const totalCols = 8;
    const areaTiles: Tile[] = [];

    const tile = this.getTileFromBoardPosition(boardPosition);

    // Loop through the 3x3 square centered on the target tile
    for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
      for (let colOffset = -1; colOffset <= 1; colOffset++) {
        const currentRow = tile.row + rowOffset;
        const currentCol = tile.col + colOffset;

        // Check that the current tile is within the bounds of the map
        const isRowValid = currentRow >= 0 && currentRow <= totalRows;
        const isColValid = currentCol >= 0 && currentCol <= totalCols;

        if (isRowValid && isColValid) {
          const aoeTile = this.getTileFromCoordinates(currentRow, currentCol);
          areaTiles.push(aoeTile);
        } else {
          console.warn('Invalid tile coordinates skipped:', currentRow, currentCol);
        }
      }
    }

    return areaTiles;
  }

  getAttackDirection(attackerBP: number, targetBP: number): number {
    const distance =  targetBP - attackerBP;

    let direction: number;

    switch (distance) {
      case -27:
      case -18:
      case -9:
        direction = 1;
        break;
      case -8:
        direction = 2;
        break;
      case 1:
      case 2:
      case 3:
        direction = 3;
        break;
      case 10:
        direction = 4;
        break;
      case 9:
      case 18:
      case 27:
        direction = 5;
        break;
      case 8:
        direction = 6;
        break;
      case -1:
      case -2:
      case -3:
        direction = 7;
        break;
      case -10:
        direction = 8;
        break;
      default:
        direction = 0;
        break;
    }

    if (direction === 0) console.error(`getAttackDirection() No direction found between: ${attackerBP} and ${targetBP}`);

    return direction;
  }

  hasLineOfSight(attacker: Hero, target: (Hero | Crystal)): boolean {
    if (this.isAdjacent(attacker, target)) return true;

    if (attacker.stats.row === target.stats.row || attacker.stats.col === target.stats.col) {
      const attackDirection = this.getAttackDirection(attacker.stats.boardPosition, target.stats.boardPosition);

      const attackDirectionOffsetMap: Record<string, number[]> = {
        1: [-9, -18],
        3: [1, 2],
        5: [9, 18],
        7: [-1, -2]
      };

      const offsets = attackDirectionOffsetMap[attackDirection];

      if (!offsets) return true;

      for (const offset of offsets) {
        const positionToCheck = attacker.stats.boardPosition + offset; // should never be out of bounds

        if (positionToCheck === target.stats.boardPosition) return true; // don't block self

        const unitInPosition = this.units.find(u => u.stats.boardPosition === positionToCheck);

        if (unitInPosition){
          const belongsToPlayerCheck = belongsToPlayer(this.context, unitInPosition);
          if (!belongsToPlayerCheck && unitInPosition instanceof Crystal) return false;
          if (!belongsToPlayerCheck && unitInPosition instanceof Hero && !unitInPosition.stats.isKO) return false;
        }
      }
    }

    // Get the coordinates of the two tiles that can block the target
    const tileOffsetMap: Record<string, [number, number][]> = {
      '1, 2': [[0, 1], [1, 1]],
      '1, -2': [[0, -1], [1, -1]],

      '-1, 2': [[0, 1], [-1, 1]],
      '-1, -2': [[0, -1], [-1, -1]],

      '2, 1': [[1, 0], [1, 1]],
      '2, -1': [[1, 0], [1, -1]],

      '-2, 1': [[-1, 0], [-1, 1]],
      '-2, -1': [[-1, 0], [-1, -1]]
    };

    const getOffset = {
      row: target.stats.row - attacker.stats.row,
      col: target.stats.col - attacker.stats.col
    };

    const tileCoordKey = `${getOffset.row}, ${getOffset.col}`;
    const offsetsToCheck = tileOffsetMap[tileCoordKey];

    let result: boolean | undefined;

    if (offsetsToCheck && offsetsToCheck.length) {
      for (const offset of offsetsToCheck) {
        const tileRow = attacker.stats.row + offset[0];
        const tileCol = attacker.stats.col + offset[1];

        const isWrongRow = tileRow < 0 || tileRow > 4;
        const isWrongCol = tileCol < 0 || tileCol > 8;
        if (isWrongRow || isWrongCol) continue;

        const unit = this.units.find(u => u.stats.row === tileRow && u.stats.col === tileCol);

        if (unit?.stats.boardPosition === target.stats.boardPosition) return true; // don't block self

        if (unit) {
          const belongsToPlayerCheck = belongsToPlayer(this.context, unit);
          if (!belongsToPlayerCheck && unit instanceof Crystal) result = false;
          if (!belongsToPlayerCheck && unit instanceof Hero && !unit.stats.isKO) result = false;
          break;
        }
      };
    }

    return result !== false;
  }

  // Includes diagonally adjacent
  isAdjacent(target: Hero | Crystal, unitToCompare: Hero | Crystal): boolean {
    const row = Math.abs(target.stats.row - unitToCompare.stats.row);
    const col = Math.abs(target.stats.col - unitToCompare.stats.col);

    return col <= 1 && row <= 1 && !(row === 0 && col === 0);
  }

  isOrthogonalAdjacent(hero: Hero, unitToCompare: Hero | Crystal): boolean {
    const row = Math.abs(hero.stats.row - unitToCompare.stats.row);
    const col = Math.abs(hero.stats.col - unitToCompare.stats.col);

    return row === 1 && col === 0 || row === 0 && col === 1;
  }

  getAliveAdjacentFriendlyUnitsOnBoard(target: Hero | Crystal): (Hero | Crystal)[] {
    return this.units.filter(u => {
      if (target.stats.belongsTo === u.stats.belongsTo && this.isAdjacent(target, u)) {
        if (u instanceof Crystal) return true;
        if (u instanceof Hero && !u.stats.isKO) return true;
      }
    });
  }

  searchForAliveAdjacentFriendlyUnit(target: Hero | Crystal, unitToSearch: EHeroes): number {
    return this.units.filter(u =>
      u instanceof Hero &&
      u.stats.unitType === unitToSearch &&
      target.stats.belongsTo === u.stats.belongsTo &&
      this.isAdjacent(target, u) &&
      !u.stats.isKO).length;
  }

  updatePaladinAurasAcrossBoard(): void {
    this.units.map(unit => {
      unit.stats.paladinAura = this.searchForAliveAdjacentFriendlyUnit(unit, EHeroes.PALADIN);
      if (unit instanceof Hero) unit.unitCard.updateCardData(unit);
      if (unit instanceof Crystal) unit.unitCard.updateCardData(unit);
    });
  }

  checkCrystalDebuffLevelOnTurnStart(): void {
    const assaultTiles = this.grid.filter(t => t.tileType === ETiles.CRYSTAL_DAMAGE);
    let pOneUnitsOnAssaultTiles = 0;
    let pTwoUnitsOnAssaultTiles = 0;

    this.units.forEach(u => {
      if (u instanceof Crystal) return;
      const tileMatch = assaultTiles.find(t => t.boardPosition === u.stats.boardPosition);
      if (tileMatch) {
        if (u.stats.belongsTo === 1) pOneUnitsOnAssaultTiles += 1;
        if (u.stats.belongsTo === 2) pTwoUnitsOnAssaultTiles += 1;
      }
    });

    this.units.forEach(u => {
      if (u instanceof Crystal) u.updateCrystalDebuffAnimation(u.stats.belongsTo === 1 ? pTwoUnitsOnAssaultTiles : pOneUnitsOnAssaultTiles);
    });
  }

  updateCrystalsAfterUnitMove(attackerBelongsTo: number, increase: boolean): void {
    this.units.forEach(u => {
      if (u instanceof Hero) return;
      if (u.stats.belongsTo !== attackerBelongsTo) {
        let newLevel: number = 0;

        if (increase) newLevel = u.stats.debuffLevel + 1;
        if (!increase && u.stats.debuffLevel > 0) newLevel = u.stats.debuffLevel - 1; // Safeguard to avoid it going negative until I figure out the bug

        u.updateCrystalDebuffAnimation(newLevel);
      }
    });
  };

  // Check if a Necromancer should stomp an enemit unit or create a phantom
  necromancerStompCheck(activeUnit: Hero, koUnit: Hero, withinAttackingRange: boolean, withinStompingRange: boolean): boolean {
    if (activeUnit.stats.unitType !== EHeroes.NECROMANCER) return true; // not a necro, so stomp

    if (koUnit.visuals.blockedLOS.visible) return true; // stomp if LOS is blocked for phantom creation

    if (!withinAttackingRange && withinStompingRange) return true; // if standing on a speed tile he can stomp further than he can attack

    return false;
  }

  removeEngineerShield(unitId: string): void {
    const target = this.units.find(unit => unit.stats.unitId === unitId);
    if (!target || !target.status.has(StatusEffects.ENGINEER_SHIELD)) throw new Error(`removeEngineerShield: no target or engineerId found with id ${unitId}`);

    this.updateEngineerOnShieldLost(target.stats.unitId!);
    target.removeEngineerShield();
  }

  updateEngineerOnShieldLost(unitId: string): void {
    const engineer = this.units.find(u => u instanceof Hero && u.stats.shieldingAlly === unitId) as Hero;
    if (!engineer) return;
    engineer.stats.shieldingAlly = undefined;
  }

  getGunnerSplashTargets(attacker: Hero, target: Hero | Crystal) {
    const dx = target.stats.col - attacker.stats.col;
    const dy = target.stats.row - attacker.stats.row;

    let targetPairs = [];

    if (Math.abs(dx) === 2 || Math.abs(dy) === 2) {
      // Orthogonal target
      const mx = dx / 2;
      const my = dy / 2;
      const sx = dx === 0 ? 1 : 0;
      const sy = dy === 0 ? 1 : 0;

      targetPairs = [
        {
          p1: {
            x: attacker.stats.col + mx + sx,
            y: attacker.stats.row + my + sy
          },
          p2: {
            x: attacker.stats.col + dx + sx,
            y: attacker.stats.row + dy + sy
          }
        },
        {
          p1: {
            x: attacker.stats.col + mx - sx,
            y: attacker.stats.row + my - sy
          },
          p2: {
            x: attacker.stats.col + dx - sx,
            y: attacker.stats.row + dy - sy
          }
        }
      ];
    } else {
      // Diagonally adjacent
      targetPairs = [
        {
          p1: {
            x: attacker.stats.col + dx,
            y: attacker.stats.row
          },
          p2: {
            x: attacker.stats.col + 2 * dx,
            y: attacker.stats.row
          }
        },
        {
          p1: {
            x: attacker.stats.col,
            y: attacker.stats.row + dy
          },
          p2: {
            x: attacker.stats.col,
            y: attacker.stats.row + 2 * dy
          }
        }
      ];
    }

    const result: (Hero | Crystal)[] = [];

    targetPairs.forEach(pair => {
      const unitAtP1 = this.checkIfAliveEnemyHeroOrCrystalOnCoordinates(attacker, pair.p1);

      if (unitAtP1) {
        result.push(unitAtP1);
      } else {
        const unitAtP2 = this.checkIfAliveEnemyHeroOrCrystalOnCoordinates(attacker, pair.p2);
        if (unitAtP2) result.push(unitAtP2);
      }
    });

    return result;
  }

  checkIfAliveEnemyHeroOrCrystalOnCoordinates(attacker: Hero, pair: {
    x: number,
    y: number
  }): Hero | Crystal | undefined {
    if (this.isOffBoard(pair)) return undefined;

    const match = this.units.find(u => u.stats.col === pair.x &&
      u.stats.row === pair.y &&
      u.stats.belongsTo !== attacker.stats.belongsTo);

    if (match instanceof Crystal || match instanceof Hero && !match.stats.isKO) return match;

    return  undefined;
  }

  isOffBoard(unit: {
    x: number,
    y: number
  }): boolean { return unit.x < 0 || unit.x >= 9 || unit.y < 0 || unit.y >= 5 ;}

  getAliveEnemyUnitsOnAssaultTiles(belongsTo: number): Hero[] {
    const result: Hero[] = [];

    this.grid.forEach(t => {
      const matchedUnit = this.units.find(u => u.stats.boardPosition === t.boardPosition && u.stats.belongsTo !== belongsTo && u instanceof Hero && !u.stats.isKO);
      if (matchedUnit) result.push(matchedUnit as Hero);
    });

    return result;
  }

  isTileOccupiedExcludingKOs(boardPosition: number): boolean {
    return !!this.units.find(u => u instanceof Crystal ? u.stats.boardPosition === boardPosition : !u.stats.isKO && u.stats.boardPosition === boardPosition);
  }

  isTileOccupiedIncludingKOs(boardPosition: number): boolean {
    return !!this.units.find(u => u.stats.boardPosition === boardPosition);
  }

  isTileOccupiedByEnemiesIncludingKOs(belongsTo: number, boardPosition: number): boolean {
    return !!this.units.find(u => u.stats.boardPosition === boardPosition && u.stats.belongsTo !== belongsTo);
  }
}
