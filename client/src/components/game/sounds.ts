class Sounds {
  welcome: HTMLAudioElement;
  engineRun: HTMLAudioElement;
  tankShoot: HTMLAudioElement;
  happyNotif: HTMLAudioElement;
  rewardAdd: HTMLAudioElement;
  volumn = 0.2;
  constructor() {
    this.welcome = new Audio('./sounds/welcome.wav');
    this.welcome.loop = false;
    this.engineRun = new Audio('./sounds/engine-run.wav');
    this.engineRun.loop = true;
    this.tankShoot = new Audio('./sounds/tank-shoot.wav');
    this.tankShoot.loop = false;
    this.happyNotif = new Audio('./sounds/happy-notification.wav');
    this.happyNotif.loop = false;
    this.rewardAdd = new Audio('./sounds/reward-add.wav');
    this.rewardAdd.loop = false;
    this.adjustVolumn(0.2);
  }

  adjustVolumn(newVolumn: number): void {
    this.volumn = newVolumn;
    this.welcome.volume = newVolumn;
    this.engineRun.volume = newVolumn * 1.5 < 1 ? newVolumn * 1.5 : 1;
    this.tankShoot.volume = newVolumn;
    this.happyNotif.volume = newVolumn;
    this.rewardAdd.volume = newVolumn;
  }

  playWelcome(): void {
    this.welcome.pause();
    this.welcome.currentTime = 0;
    this.welcome.play();
  }

  playEngineRun(): void {
    this.engineRun.play();
  }

  stopEngineRun(): void {
    this.engineRun.pause();
  }

  playTankShoot(): void {
    this.tankShoot.pause();
    this.tankShoot.currentTime = 0;
    this.tankShoot.play();
  }

  playHappyNotification(): void {
    this.happyNotif.pause();
    this.happyNotif.currentTime = 0;
    this.happyNotif.play();
  }

  playRewardAdd(): void {
    this.rewardAdd.pause();
    this.rewardAdd.currentTime = 0;
    this.rewardAdd.play();
  }
}

export default Sounds;
