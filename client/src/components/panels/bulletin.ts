import { ScoresData } from "../../types/Types";
import './bulletin.scss';

class Bulletin {
  bulletinPanel: HTMLDivElement;
  bulletinArea: HTMLDivElement;
  bulletinMain: HTMLDivElement;
  bulletinShow: boolean = false;
  constructor() {
    const bulletinPanel = document.createElement('div');
    bulletinPanel.id = 'bulletin-panel';
    bulletinPanel.style.display = 'none';
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

    bulletinPanel.addEventListener('transitionend', this.transitionHandler.bind(this));
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
    this.bulletinPanel.style.display = 'block';
    this.bulletinPanel.classList.add('bulletin-panel-show');
    this.bulletinMain.classList.add('bulletin-main-show');
  }

  hidebulletin() {
    this.bulletinPanel.classList.remove('bulletin-panel-show');
    this.bulletinMain.classList.remove('bulletin-main-show');
  }

  toggleBulletin() {
    this.bulletinShow = !this.bulletinShow;
    if (this.bulletinShow) {
      this.showbulletin();
    } else {
      this.hidebulletin();
    }
  }
}

export default Bulletin;
