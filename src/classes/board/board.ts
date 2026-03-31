import { EHeroes, ETiles, ERange } from "../../enums/gameEnums";
import { IHero, ITile } from "../../interfaces/gameInterface";
import GameScene from "../../scenes/game.scene";
import { getGridDistance, belongsToPlayer } from "../../utils/gameUtils";
import { createBasicTileData, isEnemySpawn } from "../../utils/boardUtils";
import { createNewHero } from "../../utils/createUnit";
import { ManaVial } from "../factions/elves/items";
import { Phantom } from "../factions/elves/phantom";
import { Item } from "../factions/item";
import { Crystal } from "./crystal";
import { Tile } from "./tile";
import { Engineer } from "../factions/dwarves/enginner";
import { Dwarf } from "../factions/dwarves/dwarves";
import { Hero } from "../factions/hero";
import { Grenadier } from "../factions/dwarves/grenadier";
import { HealingPotion } from "../factions/council/items";
import { DwarvenBrew } from "../factions/dwarves/items";

export class Board {
  tileSize: number = 90;
  context: GameScene;
  tiles: Tile[];
  units: Hero[] = [];
  crystals: Crystal[] = [];

  constructor(context: GameScene, data: ITile[]) {
    this.context = context;
    this.tiles = this.createTileGrid(data);
    this.crystals.forEach(crystal => crystal.updateCrystalDebuffAnimation(crystal.stats.debuffLevel));
  }

  createTileGrid(tiles: ITile[]) {
    const grid: Tile[] = [];

    for (let boardPosition = 0; boardPosition < 45; boardPosition++) {
      const coordinates = this.context.centerPoints[boardPosition];
      const matchingTileData = tiles.find(tile => tile.boardPosition === boardPosition);

      let newTile;

      if (!matchingTileData) {
        grid.push(new Tile(this.context, createBasicTileData(coordinates)));
        continue;
      } else {
        newTile = new Tile(this.context, matchingTileData);
      }

      if (matchingTileData.hero) this.units.push(createNewHero(this.context, matchingTileData.hero, newTile));

      if (matchingTileData.crystal) this.crystals.push(new Crystal(this.context, matchingTileData.crystal));

      grid.push(newTile);
    }

    return grid;
  }

  getTileFromCoordinates(row: number, col: number): Tile {
    const result = this.tiles.find(tile => tile.row === row && tile.col === col);
    if (!result) throw new Error('Board getTile() No tile found');
    return result;
  }

  getTileFromBoardPosition(boardPosition: number): Tile {
    const result = this.tiles.find(tile => tile.boardPosition === boardPosition);
    if (!result) throw new Error('Board getTile() No tile found');
    return result;
  }

  getBoardState(): ITile[] {
    return this.tiles.filter(tile => tile.hero || tile.tileType !== ETiles.BASIC).map(tile => tile.getTileData());
  }

  clearHighlights() {
    this.tiles.forEach(tile => tile.clearHighlight());
  }

  highlightSpawns(unitType: EHeroes) {
    const spawns = new Set<Tile>();

    this.tiles.forEach(tile => {
      const enemySpawn = isEnemySpawn(this.context, tile);
      /** We add:
       *  -friendly spawn tiles (unless they are occupied by a live unit other than an enemy phantom)
       *  -any tile with a KO'd unit if the unit spawning is a Wraith
       */
      if (tile.tileType === ETiles.SPAWN && !enemySpawn){
        if (!tile.hero) spawns.add(tile);
        if (tile.hero?.isKO) spawns.add(tile);
        if (tile.hero?.unitType === EHeroes.PHANTOM) spawns.add(tile);
      }
      if (
        unitType === EHeroes.WRAITH &&
        tile.hero?.isKO &&
        !isEnemySpawn(this.context, tile)
      )
        spawns.add(tile);
    });

    this.highlightTiles([...spawns]);
  }

  highlightAllLivingEnemyTargets(unit: Hero | Item): void {
    this.crystals.map(crystal => { if (crystal.stats.belongsTo !== unit.stats.belongsTo) crystal.getTile().setHighlight();});
    this.units.map(u => {if (u.stats.belongsTo !== unit.stats.belongsTo && !u.stats.isKO) u.getTile().setHighlight();});
  }

  highlightEnemyTargets(hero: Hero): void {
    const tilesInRange: Tile[] = this.getHeroTilesInRange(hero, ERange.ATTACK);
    if (!tilesInRange.length) return;

    const enemyLOSCheck: (Hero | Crystal)[] = [];

    tilesInRange.forEach(tile => {
      const target = tile.hero ? this.units.find(unit => unit.stats.unitId === tile.hero!.unitId) : tile.crystal ? this.crystals.find(crystal => crystal.stats.boardPosition === tile.crystal?.boardPosition) : undefined;
      if (!target) {
        console.error('No target found', tile.hero);
        return;
      }

      /**
       * Show attack reticle if one of the below is true:
       *  -target is an enemy hero and it's not KO
       *  -target is an enemy crystal
       *  -target is KO and active unit is a Necro or a Wraith
       *  -target is KO and standing on an enemy spawn, and hero is orthogonally adjacent
       */

      if (
        target instanceof Crystal && target.stats.belongsTo !== hero.stats.belongsTo ||
        target instanceof Hero && target.stats.belongsTo !== hero.stats.belongsTo && !target.stats.isKO ||
        (hero.stats.unitType === EHeroes.NECROMANCER || hero.stats.unitType === EHeroes.WRAITH) && target instanceof Hero && target.stats.isKO ||
        target instanceof Hero && target.stats.isKO && this.isOrthogonalAdjacent(hero, target) && isEnemySpawn(this.context, target.getTile())
      ) {
        enemyLOSCheck.push(target);
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

    enemiesToHighlight.forEach(enemy => enemy.visuals.attackReticle.setVisible(true));
    enemiesBlocked.forEach(enemy => enemy.visuals.blockedLOS.setVisible(true));
  }

  highlightFriendlyTargets(hero: Hero) {
    if (!hero.stats.canHeal && !hero.stats.canBuff) return;

    const tilesInHealingRange: Tile[] = hero.stats.canHeal ? this.getHeroTilesInRange(hero, ERange.HEAL) : [];
    const tilesInBuffRange: Tile[] = hero.stats.canBuff ? this.getHeroTilesInRange(hero, ERange.BUFF) : [];
    const tilesInRange: Tile[] = tilesInHealingRange.concat(tilesInBuffRange);

    if (!tilesInRange.length) return;

    tilesInRange.forEach(tile => {
      const target = tile.hero ? this.units.find(unit => unit.stats.unitId === tile.hero?.unitId) : this.crystals.find(crystal => crystal.stats.boardPosition === tile.crystal?.boardPosition);
      if (!target) {
        console.error('No healing target found', tile);
        return;
      }

      const maxHealth = target.stats.maxHealth;
      const currentHealth = target.stats.currentHealth;

      if (target instanceof Hero && hero.stats.canHeal && target.stats.belongsTo === hero.stats.belongsTo && currentHealth! < maxHealth!) {
        target.visuals.healReticle.setVisible(true);
      }
      // Will need to update this logic for any future buffs by other units
      if (hero.stats.canBuff && target.stats.belongsTo === hero.stats.belongsTo && !target.stats.engineerShield) {
        if (target instanceof Crystal) target.visuals.healReticle.setVisible(true);
        if (target instanceof Hero && !target.stats.isKO) target.visuals.healReticle.setVisible(true);
      }
    });
  }

  highlightMovementArea(hero: Hero) {
    const tilesInRange = this.getHeroTilesInRange(hero, ERange.MOVE);

    this.highlightTiles(tilesInRange);
  }

  highlightTeleportOptions(hero: Hero) {
    // Teleporting tile
    if (hero.getTile().tileType === ETiles.TELEPORTER) {
      const teleportTiles: Tile[] = this.tiles.filter(tile => tile.tileType === ETiles.TELEPORTER && (!tile.hero || tile.hero.isKO));
      this.highlightTiles(teleportTiles);
    }

    // Ninja teleporting
    if (hero.stats.unitType !== EHeroes.NINJA) return;

    const friendlyUnitsOnBoard: Hero[] = [];
    this.units.forEach(unit => {
      if (hero.stats.belongsTo === unit.stats.belongsTo && !unit.stats.isKO) friendlyUnitsOnBoard.push(unit);
    });

    if (friendlyUnitsOnBoard.length <= 1) return;

    friendlyUnitsOnBoard.forEach(unit => {
      unit.visuals.allyReticle.setVisible(true);
    });
  }

  highlightEquipmentTargets(item: Item): void {
    const tilesToHighlight: Tile[] = [];

    this.units.forEach(hero => {
      if (hero.stats.belongsTo !== item.stats.belongsTo) return;
      if (hero instanceof Phantom) return;
      if (hero.isAlreadyEquipped(item)) return;
      if (item instanceof HealingPotion && hero.isFullHP()) return;
      if (!item.stats.canHeal && hero.stats.isKO) return;
      if (item.stats.canHeal &&  hero.stats.isKO) {
        if (item instanceof ManaVial) return;
        if (item instanceof DwarvenBrew) return;
      }

      tilesToHighlight.push(hero.getTile());
    });

    this.highlightTiles(tilesToHighlight);
  }

  highlightAllBoard() {
    this.highlightTiles(this.tiles);
  }

  highlightTiles(tiles: Tile[]) {
    tiles.forEach(tile => {
      tile.setHighlight();
    });
  }

  removeReticles(): void {
    this.units.forEach(unit => {
      unit.visuals.attackReticle.setVisible(false);
      unit.visuals.blockedLOS.setVisible(false);

      unit.visuals.healReticle.setVisible(false);
      unit.visuals.allyReticle.setVisible(false);
    });

    this.crystals.forEach(crystal => {
      crystal.visuals.attackReticle.setVisible(false);
      crystal.visuals.healReticle.setVisible(false);
      crystal.visuals.blockedLOS.setVisible(false);
    });
  }

  getHeroTilesInRange(hero: Hero, rangeType: ERange): Tile[] {
    const heroTile = this.getTileFromBoardPosition(hero.stats.boardPosition);
    let speedTileBonus = 0;
    let range: number;

    if (hero.stats.speedTile) {
      if (hero instanceof Dwarf) {
        speedTileBonus = hero instanceof Engineer ? 4 : 3;
      } else {
        speedTileBonus = 2;
      }
    }

    switch (rangeType) {
      case ERange.MOVE:
        range = hero.stats.movement + speedTileBonus;
        break;

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

    if (!heroTile) {
      console.error('No tile found - getTilesInRange');
      return [];
    }

    const inRangeTiles = new Set<Tile>;

    this.tiles.forEach(tile => {
      const distance = getGridDistance(tile.row, tile.col, heroTile.row, heroTile.col);

      if (distance <= range) {
        if (
          rangeType === ERange.MOVE &&
          !isEnemySpawn(this.context, tile) &&
          (!tile.hero || tile.hero.isKO) &&
          !tile.crystal
        ) inRangeTiles.add(tile);

        if ([ERange.ATTACK, ERange.HEAL, ERange.BUFF].includes(rangeType)) {
          if (tile.crystal || tile.hero && tile.hero.unitId !== hero.stats.unitId) inRangeTiles.add(tile); // TODO: refactor this for legibility
        }
      }
    });

    return [...inRangeTiles];
  }

  get3x3AreaOfEffectTiles(tile: Tile): Tile[] {
    const totalRows = 4;
    const totalCols = 8;
    const areaTiles: Tile[] = [];

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

        const tile = this.getTileFromBoardPosition(positionToCheck);

        if (
          tile.crystal && !belongsToPlayer(this.context, tile.crystal) ||
          tile.hero && !belongsToPlayer(this.context, tile.hero) && !tile.hero.isKO
        ) return false;
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

        const tile = this.getTileFromCoordinates(tileRow, tileCol);

        if (tile.boardPosition === target.stats.boardPosition) return true; // don't block self

        if (
          tile.crystal && !belongsToPlayer(this.context, tile.crystal) ||
          tile.hero && !belongsToPlayer(this.context, tile.hero) && !tile.hero.isKO
        ) {
          result = false;
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
    const result: (Hero | Crystal)[] = [];

    this.units.forEach(unit => {
      if (!unit.stats.isKO && target.stats.belongsTo === unit.stats.belongsTo && this.isAdjacent(target, unit)) result.push(unit);
    });
    this.crystals.forEach(crystal => {
      if (target.stats.belongsTo === crystal.stats.belongsTo && this.isAdjacent(target, crystal)) result.push(crystal);
    });

    return result;
  }

  searchForAliveAdjacentFriendlyUnit(target: Hero | Crystal, unitToSearch: EHeroes): number {
    return this.units.filter(unit =>
      unit.stats.unitType === unitToSearch &&
      target.stats.belongsTo === unit.stats.belongsTo &&
      this.isAdjacent(target, unit) &&
      !unit.stats.isKO).length;
  }

  updatePaladinAurasAcrossBoard(): void {
    this.units.map(unit => {
      unit.stats.paladinAura = this.searchForAliveAdjacentFriendlyUnit(unit, EHeroes.PALADIN);
      unit.updateTileData();
      unit.unitCard.updateCardData(unit);
    });

    this.crystals.map(crystal => {
      crystal.stats.paladinAura = this.searchForAliveAdjacentFriendlyUnit(crystal, EHeroes.PALADIN);
      crystal.updateTileData();
      crystal.unitCard.updateCardData(crystal);
    });
  }

  // Check if a Necromancer should stomp an enemit unit or create a phantom
  necromancerStompCheck(activeUnit: Hero, koUnit: Hero, withinAttackingRange: boolean, withinStompingRange: boolean): boolean {
    if (activeUnit.stats.unitType !== EHeroes.NECROMANCER) return true; // not a necro, so stomp

    if (koUnit.visuals.blockedLOS.visible) return true; // stomp if LOS is blocked for phantom creation

    if (!withinAttackingRange && withinStompingRange) return true; // if standing on a speed tile he can stomp further than he can attack

    return false;
  }

  removeEngineerShield(unitId: string): void {
    let target;

    if (unitId.includes('crystal')) {
      target = this.crystals.find(crystal => crystal.stats.unitId === unitId);
    } else {
      target = this.units.find(unit => unit.stats.unitId === unitId);
    }

    if (!target || !target.stats.engineerShield) throw new Error(`removeEngineerShield: no target or engineerId found with id ${unitId}`);
    this.updateEngineerOnShieldLost(target.stats.engineerShield);
    target.removeEngineerShield();
  }

  updateEngineerOnShieldLost(engineerId: string): void {
    const engineer = this.units.find(unit => unit.stats.unitId === engineerId);
    if (!engineer) return;
    engineer.stats.shieldingAlly = undefined;
    engineer.updateTileData();
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

    const found = this.units.find(unit => unit.stats.col === pair.x &&
      unit.stats.row === pair.y &&
      unit.stats.belongsTo !== attacker.stats.belongsTo &&
      !unit.stats.isKO) ||
      this.crystals.find(unit => unit.stats.col === pair.x && unit.stats.row === pair.y && unit.stats.belongsTo !== attacker.stats.belongsTo);

    return found || undefined;
  }

  isOffBoard(unit: {
    x: number,
    y: number
  }): boolean { return unit.x < 0 || unit.x >= 9 || unit.y < 0 || unit.y >= 5 ;}

  getUnitsOnAssaultTiles(belongsTo: number): IHero[] {
    return this.tiles.filter(tile => tile.tileType === ETiles.CRYSTAL_DAMAGE && tile.hero && tile.hero.belongsTo !== belongsTo).map(tile => {return tile.hero!;});
  }
}