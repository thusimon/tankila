class Sounds {
  welcome: HTMLAudioElement;
  engineRun: HTMLAudioElement;
  volumn: number = 0.2;
  constructor() {
    this.welcome = new Audio('./sounds/welcome.wav');
    this.welcome.loop = false;
    this.engineRun = new Audio('./sounds/engine-run.wav');
    this.engineRun.loop = true;
    this.adjustVolumn(0.2);
  }

  adjustVolumn(newVolumn: number) {
    this.volumn = newVolumn;
    this.welcome.volume = newVolumn;
    this.engineRun.volume = newVolumn;
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
    const tankShoot = new Audio('./sounds/tank-shoot.wav');
    tankShoot.loop = false;
    tankShoot.volume = this.volumn;
    tankShoot.play();
  }

}

export default Sounds;
