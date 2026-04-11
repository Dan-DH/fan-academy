export enum EColyseusMessages {
  // SENT BY THE CLIENT
  PING = 'ping',
  CLIENT_TURN_UPDATE = 'clientTurnUpdate',
  CHAT_MESSAGE_SENT = 'chatMessageSent',
  NEW_GAME_REQUEST = 'newGameRequest',
  GET_GAMELIST = 'getGameList',
  GET_GAME = 'getGame',
  DELETE_GAME_REQUEST = 'deleteGameRequest',

  // SENT BY THE SERVER
  PONG = 'pong',
  SEND_GAMELIST = 'sendGamelist',
  SEND_GAME = 'sendGame',
  SERVER_TURN_UPDATE = 'serverTurnUpdate',
  GAME_OVER = 'gameOver',
  CHAT_MESSAGE_RECEIVED = 'chatMessageReceived',
  NEW_GAME_STARTED = 'newGameStarted',
  NEW_GAME_CREATED = 'newGameCreated', // used for new games and challenges as well
  CHALLENGE_RECEIVED = 'challengeReceived',
  CHALLENGE_REFUSED = 'challengeRefused',
  DELETED_GAME_UPDATE = 'deletedGameUpdate'
}