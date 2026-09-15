import { Coordinates } from "../interfaces/gameInterface";

export function calculateBoardCenterPoints(): Coordinates[] {
  const topLeft = {
    x: 545,
    y: 225,
    row: 0,
    col: 0
  };

  const result: Coordinates[] = [];
  let boardPosition = 0;

  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 9; col++) {
      const x = topLeft.x + col * 90;
      const y = topLeft.y + row * 90;

      result.push({
        x,
        y,
        row,
        col,
        boardPosition
      });

      boardPosition++;
    }
  }
  return result;
}

export function calculateAllCenterPoints(): Coordinates[] {
  // Adding coordinates for the board tiles
  const centerPoints: Coordinates[] = calculateBoardCenterPoints();

  // Adding coordinates for the items in the player's hand
  const leftMostItem = {
    x: 700,
    y: 745
  };

  for (let item = 0; item < 6; item++) {
    centerPoints.push({
      x: leftMostItem.x,
      y: leftMostItem.y
    });

    leftMostItem.x += 80;
  }

  // Adding coordinates for the deck (door)
  centerPoints.push({
    x: 435,
    y: 720
  });

  return centerPoints;
}
