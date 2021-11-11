import { ScoresData } from "../../types/Types";
import './bulletin.scss';

class Bulletin {
  bulletinPanel: HTMLDivElement;
  bulletinArea: HTMLDivElement;
  bulletinMain: HTMLDivElement;
  bulletinShow: boolean = false;
  port: string;
  constructor(port: string) {
    this.port = port;
    const bulletinPanel = document.createElement('div');
    bulletinPanel.id = 'bulletin-panel';
    this.bulletinPanel = bulletinPanel;

    const bulletinMain = document.createElement('div');
    bulletinMain.id = 'bulletin-main';
    this.bulletinMain = bulletinMain;

    const bulletinTitle = document.createElement('div');
    bulletinTitle.id = 'bulletin-title';
    bulletinTitle.textContent = 'Hero Bulletin';

    const bulletinArea = document.createElement('div');
    bulletinArea.id = 'bulletin-area';
    this.bulletinArea = bulletinArea;

    this.hidebulletin();
    bulletinMain.append(bulletinTitle, bulletinArea);
    bulletinPanel.append(bulletinMain);
    document.body.append(bulletinPanel);
  }

  transitionHandler() {
    if (!this.bulletinShow) {
      this.bulletinPanel.style.display = 'none';
    }
  }

  showbulletin() {
    this.bulletinMain.classList.remove('bulletin-main-hide');
    this.bulletinMain.classList.add('bulletin-main-show');
  }

  hidebulletin() {
    this.bulletinPanel.classList.remove('bulletin-main-show');
    this.bulletinMain.classList.add('bulletin-main-hide');
  }

  fetchBulletin() {
    let url = `${window.location.protocol}//${window.location.hostname}`;
    if (this.port) {
      url += `:${this.port}`;
    }
    url += '/api/tankilabulletins';
    return fetch(url, {
      method: 'GET',
      mode: 'cors'
    }).then(response => response.json())
    .then(bulletins => {
      console.log(bulletins);
    });
  }
  toggleBulletin() {
    this.bulletinShow = !this.bulletinShow;
    if (this.bulletinShow) {
      this.fetchBulletin();
      this.showbulletin();
    } else {
      this.hidebulletin();
    }
  }
}

export default Bulletin;
