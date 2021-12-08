import { BulletinType } from "../../types/Types";
import './bulletin.scss';

class Bulletin {
  bulletinPanel: HTMLDivElement;
  bulletinArea: HTMLDivElement;
  bulletinMain: HTMLDivElement;
  bulletinShow = false;
  port: string;
  constructor(port: string) {
    this.port = port;
    const bulletinPanel = document.createElement('div');
    bulletinPanel.id = 'bulletin-panel';
    bulletinPanel.style.display = 'none';
    this.bulletinPanel = bulletinPanel;

    const bulletinMain = document.createElement('div');
    bulletinMain.id = 'bulletin-main';
    bulletinMain.classList.add('bulletin-main-hide');
    bulletinMain.addEventListener('transitionend', this.transitionHandler.bind(this));
    this.bulletinMain = bulletinMain;

    const bulletinHeader = document.createElement('div');
    bulletinHeader.id = 'bulletin-header';

    const bulletinTitle = document.createElement('div');
    bulletinTitle.id = 'bulletin-title';
    bulletinTitle.textContent = 'Hero Bulletin';

    const bulletinClose = document.createElement('button');
    bulletinClose.id = 'bulletin-close';
    bulletinClose.textContent = '✖';
    bulletinClose.addEventListener('click', () => this.hidebulletin(true));

    bulletinHeader.append(bulletinTitle, bulletinClose);

    const bulletinArea = document.createElement('div');
    bulletinArea.id = 'bulletin-area';
    this.bulletinArea = bulletinArea;

    this.hidebulletin(true);
    bulletinMain.append(bulletinHeader, bulletinArea);
    bulletinPanel.append(bulletinMain);
    document.body.append(bulletinPanel);
  }

  transitionHandler(): void {
    if (!this.bulletinShow) {
      this.bulletinPanel.style.display = 'none';
    }
  }

  showbulletin(): void {
    this.bulletinPanel.style.display = 'block';
    this.bulletinMain.classList.remove('bulletin-main-hide');
    this.bulletinMain.classList.add('bulletin-main-show');
  }

  hidebulletin(enforce: boolean): void {
    if (enforce == true) {
      this.bulletinShow = false;
    }
    this.bulletinMain.classList.remove('bulletin-main-show');
    this.bulletinMain.classList.add('bulletin-main-hide');
  }

  async fetchBulletin(): Promise<void> {
    while (this.bulletinArea.firstChild) {
      this.bulletinArea.removeChild(this.bulletinArea.firstChild);
    }
    let url = `${window.location.protocol}//${window.location.hostname}`;
    if (window.location.protocol === 'http:' && this.port) {
      url += `:${this.port}`;
    }
    url += '/api/tankilabulletins';
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors'
    });
    const bulletinsResp = await response.json();
    this.constructBulletin(bulletinsResp);
  }

  constructBulletin(bulletins: BulletinType[]): void {
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

  toggleBulletin(): void {
    this.bulletinShow = !this.bulletinShow;
    if (this.bulletinShow) {
      this.fetchBulletin();
      this.showbulletin();
    } else {
      this.hidebulletin(false);
    }
  }
}

export default Bulletin;
