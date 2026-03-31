import { Client, Room } from "colyseus.js";
import { EFaction, EGameModes } from "../enums/gameEnums";
import { IGameOver, IGameState } from "../interfaces/gameInterface";
import { renderChatMessage } from "../scenes/gameSceneUtils/chatComponent";
import UIScene from "../scenes/ui.scene";

export async function createGame(context: UIScene, faction: EFaction, gameMode: EGameModes): Promise<void> {
  const { colyseusClient, userId } = context;
  const token = localStorage.getItem("jwt");

  if (!colyseusClient || !userId || !faction || !token) {
    console.error('createGame error: missing one of client / userId / faction / token');
    return;
  }

  try {
    console.log('Checking for open games | creating a new game...');

    const room = await colyseusClient.create('game_room', {
      userId,
      faction,
      token,
      gameMode
    });

    context.currentRoom = room;
    subscribeToListeners(room);

    console.log("Created and joined room:");
  } catch (error) {
    console.error("Failed to create or join room:", error);
  }
}

export async function joinGame(client: Client, userId: string, roomId: string, context: UIScene): Promise<Room | undefined> {
  const token = localStorage.getItem("jwt");

  if(!client || !userId || !roomId || !token) {
    console.error('joinGame, { client | userid | gameid | token } missing');
    return undefined;
  }

  let room: Room;

  try {
    room = await client.joinOrCreate("game_room", {
      userId,
      roomId,
      token,
      mongoId: roomId
    });

    console.log("Joined or created room:", room.roomId);

    context.currentRoom = room;
    subscribeToListeners(room);
  } catch (error) {
    console.error("Failed to join or create room", error);
    return undefined;
  }

  return room;
}

function subscribeToListeners(room: Room): void {
  room.onMessage('chatMessageReceived', (message) => {
    renderChatMessage(message);
  });

  room.onMessage('pong', () => {});

  room?.onLeave((code: number) => {
    console.log("Left room with code:", code);
  });
}

export function sendTurnMessage(currentRoom: Room, currentTurn: IGameState[], newActivePlayer: string, turnNumber: number, gameOver?: IGameOver): void {
  const token = localStorage.getItem("jwt");
  if (!currentRoom || !currentTurn || !newActivePlayer || !token) {
    console.error('Error sending turn, missing one or more params');
    return;
  }

  currentRoom.send("turnSent", {
    _id: currentRoom.roomId,
    currentTurn,
    newActivePlayer,
    gameOver,
    turnNumber,
    token
  });
}

export function sendChatMessage(currentRoom: Room, message: string): void {
  const token = localStorage.getItem("jwt");

  currentRoom.send("chatMessage", {
    _id: currentRoom.roomId,
    message,
    token
  });
}
