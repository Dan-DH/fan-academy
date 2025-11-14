import { GameObjects } from "phaser";
import { sendChatMessage } from "../../colyseus/colyseusGameRoom";
import { IChatMessage } from "../../interfaces/gameInterface";
import GameScene from "../game.scene";

export const chatPlayers = {
  player1: '',
  player2: ''
};

export function renderChatMessage(chatMessage: IChatMessage): void {
  const chatMessagesDiv = document.getElementById('chatmessages');
  if (!chatMessagesDiv) return;

  const { username, message } = chatMessage;
  const msgElement = document.createElement('div');

  msgElement.innerHTML = `<span class="username">${username}</span>: <span class="message">${message}</span>`;
  const usernameSpan = msgElement.querySelector('.username') as HTMLElement;
  // const messageSpan = msgElement.querySelector('.message') as HTMLElement;

  usernameSpan.style.color = chatPlayers.player1 === chatMessage.username ? '#4fc3f7' : '#f44336';
  usernameSpan.style.fontWeight = 'bold';

  // msgElement.textContent = `${username}: ${message}`;
  chatMessagesDiv.appendChild(msgElement);
  chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
}

export function createChatComponent(context: GameScene): GameObjects.DOMElement {
  // Set up player usernames to apply color to each message
  chatPlayers.player1 = context.currentGame.players[0].userData.username;
  chatPlayers.player2 = context.currentGame.players[1].userData.username;

  const chat = context.add.dom(495, 800).createFromCache('chatComponent').setOrigin(0.5);
  const chatRoot = chat.node as HTMLElement;
  chatRoot.style.pointerEvents = 'auto';

  const chatContainer = chat.getChildByID('chatcomponent') as HTMLElement;
  const chatInput = chat.getChildByID('chatinput') as HTMLInputElement;
  const chatMessages = chat.getChildByID('chatmessages') as HTMLElement;

  // Get canvas size
  const width = context.scale.width;
  const height = context.scale.height;

  chatContainer.style.width = `${width * 0.705}px`;
  chatContainer.style.height = `${height * 0.19}px`;
  chatContainer.style.backgroundColor = '#111';
  chatContainer.style.borderRadius = '8px';
  chatContainer.style.padding = '8px';
  chatContainer.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
  chatContainer.style.display = 'flex';
  chatContainer.style.flexDirection = 'column';
  chatContainer.style.gap = '8px';

  chatMessages.style.flex = '1';
  chatMessages.style.overflowY = 'auto';
  chatMessages.style.overflowX = 'hidden';
  chatMessages.style.whiteSpace = 'pre-wrap';
  chatMessages.style.backgroundColor = '#222';
  chatMessages.style.color = '#fff';
  chatMessages.style.fontFamily = 'proLight';
  chatMessages.style.fontSize = '30px';
  chatMessages.style.padding = '8px';
  chatMessages.style.borderRadius = '4px';
  chatMessages.style.maxHeight = `${height * 0.25}px`;
  chatMessages.style.touchAction = 'manipulation';

  chatInput.style.width = '100%';
  chatInput.style.height = '25px';
  chatInput.style.padding = '6px';
  chatInput.style.border = 'none';
  chatInput.style.borderRadius = '4px';
  chatInput.style.fontSize = '25px';
  chatInput.style.fontFamily = 'proLight';

  // Optionally apply responsive height to inner elements too
  const messagesDiv = chat.getChildByID('chatmessages') as HTMLElement;
  messagesDiv.style.maxHeight = `${height * 0.25}px`;

  chatInput.addEventListener('keydown', (keyPressed) => {
    if (keyPressed.key === 'Enter' && chatInput.value.trim()) {
      sendChatMessage(context.currentRoom, chatInput.value.trim());
      chatInput.value = '';
    }
  });

  // Render the messages
  const messagesToRender = context.currentGame.chatLogs.messages;

  messagesToRender.forEach((message) => renderChatMessage(message));
  chatMessages.scrollTop = chatMessages.scrollHeight;

  return chat;
}