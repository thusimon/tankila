import { MessageListener } from '../types/Types';
import { getWebSockedDomain } from '../utils/urls';

class Message {
  ws!: WebSocket;
  production: string;
  port: string;
  constructor(production: string, port: string) {
    this.production = production;
    this.port = port;
  }

  async getConnection(id: string, name: string): Promise<boolean> {
    const wsUri = getWebSockedDomain(this.production, this.port);
    this.ws = new WebSocket(`${wsUri}/websockets?id=${encodeURIComponent(id)}&name=${encodeURIComponent(name)}`);

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
