import { BulletinType, ScoresData } from "../../types/Types";
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
    while (this.bulletinArea.firstChild) {
      this.bulletinArea.removeChild(this.bulletinArea.firstChild);
    }
    let url = `${window.location.protocol}//${window.location.hostname}`;
    if (this.port) {
      url += `:${this.port}`;
    }
    url += '/api/tankilabulletins';
    return fetch(url, {
      method: 'GET',
      mode: 'cors'
    }).then(response => response.json())
    .then((bulletinsResp: BulletinType[]) => {
      this.constructBulletin(bulletinsResp);
    });
  }

  constructBulletin(bulletins: BulletinType[]) {
    const dateTimeOptions = {
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric',
      hour12: false
    } as const;
    bulletins.forEach((bulletin, idx) => {
      const bulletinOuterContainer = document.createElement('div');
      bulletinOuterContainer.className = 'bulletin-outer-container';

      const bulletinContainer = document.createElement('div');
      bulletinContainer.className = 'bulletin-container';
      const bulletinName = document.createElement('div');
      bulletinName.className = 'bulletin-name';
      bulletinName.textContent = bulletin.name;
      const bulletinCredit = document.createElement('div');
      bulletinCredit.className = 'bulletin-credit';
      bulletinCredit.textContent = `${bulletin.credit}`;
      const bulletinDate = document.createElement('div');
      bulletinDate.className = 'bulletin-date';
      bulletinDate.textContent = new Intl.DateTimeFormat('en-US', dateTimeOptions).format(new Date(bulletin.updatedAt));
      bulletinContainer.append(bulletinName, bulletinCredit, bulletinDate);
      bulletinOuterContainer.append(bulletinContainer);
      this.bulletinArea.append(bulletinOuterContainer);
      setTimeout(() => {
        bulletinOuterContainer.classList.add('bulletin-outer-container-show');
      }, idx * 50);
    })
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
