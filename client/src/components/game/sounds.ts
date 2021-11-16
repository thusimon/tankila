class Sounds {
  welcome: HTMLAudioElement;
  engineRun: HTMLAudioElement;
  tankShoot: HTMLAudioElement;
  volumn: number = 0.2;
  constructor() {
    this.welcome = new Audio('./sounds/welcome.wav');
    this.welcome.loop = false;
    this.engineRun = new Audio('./sounds/engine-run.wav');
    this.engineRun.loop = true;
    this.tankShoot = new Audio('./sounds/tank-shoot.wav');
    this.tankShoot.loop = false;
    this.adjustVolumn(0.2);
  }

  adjustVolumn(newVolumn: number) {
    this.volumn = newVolumn;
    this.welcome.volume = newVolumn;
    this.engineRun.volume = newVolumn * 1.5;
    this.tankShoot.volume = newVolumn;
  }

  playWelcome() {
    this.welcome.play();
  }

  playEngineRun() {
    this.engineRun.play();
  }

  stopEngineRun() {
    this.engineRun.pause();
  }

  playTankShoot() {
    this.tankShoot.pause();
    this.tankShoot.currentTime = 0;
    this.tankShoot.play();
  }

}

export default Sounds;
