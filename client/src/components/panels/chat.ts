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
    chatArea.readOnly = true;
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
    this.showChat = this.showChat.bind(this);
    this.hideChat = this.hideChat.bind(this);
    this.getChatInputContent = this.getChatInputContent.bind(this);

    this.hideChat();
    document.body.append(chatPanel);
  }

  showChat() {
    this.chatPanel.style.display = 'block';
  }

  hideChat() {
    this.chatPanel.style.display = 'none';
  }

  getChatInputContent() {
    return this.chatInput.value;
  }

  clearChatInputContent() {
    this.chatInput.value = '';
  }

  appendChat(name: string, content: string) {
    const now = new Date();
    const hour = `0${now.getHours()}`.substr(-2);
    const minute = `0${now.getMinutes()}`.substr(-2);
    const message = `[${hour}:${minute}]${name}: ${content}\n`;
    this.chatArea.value += message;
    this.chatArea.scrollTop = this.chatArea.scrollHeight;
  }
}

export default Chat;
