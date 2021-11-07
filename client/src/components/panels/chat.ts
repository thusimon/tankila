import Game from '../game/game';
import './chat.scss';

class Chat {
  chatPanel: HTMLDivElement;
  chatArea: HTMLTextAreaElement;
  chatInput: HTMLInputElement;
  constructor() {
    const chatPanel = document.createElement('div');
    chatPanel.id = 'chat-panel';
    this.chatPanel = chatPanel;

    const chatArea = document.createElement('textarea');
    chatArea.id = 'chat-area';
    this.chatArea = chatArea;

    const chatInputArea = document.createElement('div');
    chatInputArea.id = 'chat-input-area';
    const chatInput = document.createElement('input');
    chatInput.id = 'chat-input';
    this.chatInput = chatInput;
    const enterKey = document.createElement('span');
    enterKey.id = 'chat-enter-key';
    enterKey.textContent = '⏎';
    chatInputArea.append(chatInput, enterKey);

    chatPanel.append(chatArea, chatInputArea);
    this.hideChat = this.hideChat.bind(this);
    this.hideChat();
    document.body.append(chatPanel);
  }

  showChat() {
    this.chatPanel.style.display = 'block';
  }

  hideChat() {
    this.chatPanel.style.display = 'none';
  }
}

export default Chat;
