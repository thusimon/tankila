import Game from './components/game/game';
import {uuidv4} from './utils/urls';
class Welcome {
  constructor(game: Game) {
    const menuPanel = document.getElementById('menu-panel') as HTMLDivElement
    const startButton = document.getElementById('start-button') as HTMLInputElement
    startButton.disabled = true;
    const tankNameInput = document.getElementById('tank-name-input') as HTMLInputElement;
    tankNameInput.addEventListener('input', (evt) => {
      const input = evt.target as HTMLInputElement;
      if (input.value && input.value.length > 0) {
        startButton.disabled = false;
      } else {
        startButton.disabled = true;
      }
    }, true);
    
    startButton.addEventListener('click', async function () {
      menuPanel.style.display = 'none'

      const tankId = uuidv4();
      const tankName = tankNameInput.value;
      game.connectToServer(tankId, tankName);
    }, true);
  }
}

export default Welcome;
