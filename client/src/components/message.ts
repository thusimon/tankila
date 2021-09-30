import { MessageListener } from '../data/Types';
import { getWebSockedDomain } from './utils/urls';

class Message {
  ws!: WebSocket;
  id: string;
  constructor(id: string) {
    this.id = id;
  }

  async getConnection(): Promise<boolean> {
    const wsUri = getWebSockedDomain();
    this.ws = new WebSocket(`${wsUri}/websockets?id=${encodeURIComponent(this.id)}`);

    return new Promise((resolve) => {
      // Connection opened
      this.ws.addEventListener('open', () => {
        resolve(true);
      });
      this.ws.addEventListener('error', () => {
        resolve(false);
      });
    });
  }

  listenOnMessage(callback: MessageListener): void {
    this.ws.addEventListener('message', evt => {
      callback(evt.data);
    });
  }

  sendMessage(msg: string): void {
    this.ws.send(msg);
  }
}

export default Message;