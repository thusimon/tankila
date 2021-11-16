class Settings {
  settingsPanel: HTMLDivElement;
  constructor() {
    const settingsPanel = document.createElement('div');
    settingsPanel.id = 'settings-panel'; 
    this.settingsPanel = settingsPanel;
  }
}

export default Settings;
