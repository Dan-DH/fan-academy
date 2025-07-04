import GameScene from "../game.scene";

export function loadGameBoardUI(context: GameScene): void {
  context.load.image('gameBoard', '/assets/images/maps/game_board.png');

  context.load.image('itemRack', '/assets/images/gameItems/item_rack.png');

  context.load.image('doorClosed', '/assets/images/gameItems/door_closed.png');
  context.load.image('doorOpen', '/assets/images/gameItems/door_open.png');
  context.load.image('doorBanner', '/assets/images/gameItems/door_banner.png');

  context.load.image('actionArrow', '/assets/images/gameItems/action_arrow.png');
  context.load.image('actionPie', '/assets/images/gameItems/action_pie.png');
  context.load.image('actionCircle', '/assets/images/gameItems/action_circle.png');

  context.load.image('turnButton', '/assets/ui/turn_button.png');

  context.load.image('popupBackground', '/assets/images/gameItems/NextGameButton-hd.png');
  context.load.image('popupButton', '/assets/images/gameItems/ColorSwatch_Color-hd.png');

  context.load.image('playerBanner', '/assets/images/gameItems/player_banner.png');
  context.load.image('vsBanner', '/assets/images/gameItems/vs_banner.png');
}