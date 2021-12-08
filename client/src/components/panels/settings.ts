import Bulletin from './bulletin';
import Sounds from '../game/sounds';
import './settings.scss';

class Settings {
  settingsPanel: HTMLDivElement;
  settingsMain: HTMLDivElement;
  audioSlider: HTMLInputElement;
  settingShown = false;
  port: string;
  sounds: Sounds
  bulletin: Bulletin;
  constructor(port: string, sounds: Sounds) {
    this.port = port;
    this.sounds = sounds;
    const settingsPanel = document.createElement('div');
    settingsPanel.id = 'settings-panel';
    settingsPanel.style.display = 'none';
    this.settingsPanel = settingsPanel;

    const settingsMain = document.createElement('div');
    settingsMain.id = 'settings-main';
    settingsMain.addEventListener('transitionend', this.transitionHandler.bind(this));
    this.settingsMain = settingsMain;

    const settingsHeader = document.createElement('div');
    settingsHeader.id = 'settings-header';

    const settingsTitle = document.createElement('div');
    settingsTitle.id = 'settings-title';
    settingsTitle.textContent = 'Settings';

    const settingsClose = document.createElement('button');
    settingsClose.id = 'settings-close';
    settingsClose.textContent = '✖';
    settingsClose.addEventListener('click', () => this.hideSetting(true));

    settingsHeader.append(settingsTitle, settingsClose);

    const settingsOptionsContainer = document.createElement('div');
    settingsOptionsContainer.id = 'settings-options-container';

    const audioSettingContainer = document.createElement('div');
    audioSettingContainer.className = 'sub-settings-container';
    const audioSlider = document.createElement('input');
    audioSlider.type = 'range';
    audioSlider.id = 'audio-volumn';
    audioSlider.min = '0';
    audioSlider.max = '1';
    audioSlider.value = `${this.sounds.volumn}`;
    audioSlider.step = '0.01';
    audioSlider.addEventListener('change', this.audioUpate.bind(this));
    this.audioSlider = audioSlider;

    const audioLabel = document.createElement('label');
    audioLabel.id = 'audio-volumn-label';
    audioLabel.htmlFor = audioSlider.id;
    audioLabel.textContent = 'Audio Volumn';

    audioSettingContainer.append(audioLabel, audioSlider);

    const bulletinContainer = document.createElement('div');
    bulletinContainer.className = 'sub-settings-container';
    const bulletinButton = document.createElement('button');
    bulletinButton.className = 'setting-button';
    bulletinButton.textContent = 'Bulletin';
    bulletinButton.addEventListener('click', this.showBulletin.bind(this));
    bulletinContainer.append(bulletinButton);

    this.hideSetting(true);
    settingsOptionsContainer.append(audioSettingContainer, bulletinContainer);
    settingsMain.append(settingsHeader, settingsOptionsContainer);
    settingsPanel.append(settingsMain);

    document.body.append(settingsPanel);

    this.bulletin = new Bulletin(port);
  }

  transitionHandler(): void {
    if (!this.settingShown) {
      this.settingsPanel.style.display = 'none';
    }
  }

  audioUpate(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newVal = Number(target.value);
    this.sounds.adjustVolumn(newVal);
    this.sounds.playWelcome();
  }

  showSetting(): void {
    this.audioSlider.value = `${this.sounds.volumn}`;
    this.settingsPanel.style.display = 'block';
    this.settingsMain.classList.remove('settings-main-hide');
    this.settingsMain.classList.add('settings-main-show');
  }

  hideSetting(enforce: boolean): void {
    if (enforce) {
      this.settingShown = false;
    }
    this.settingsMain.classList.remove('settings-main-show');
    this.settingsMain.classList.add('settings-main-hide');
  }

  toggleSetting(): void {
    this.settingShown = !this.settingShown;
    if (this.settingShown) {
      this.showSetting();
    } else {
      this.hideSetting(false);
    }
  }

  showBulletin(): void {
    this.bulletin.toggleBulletin();
  }
}

export default Settings;
