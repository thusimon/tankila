import Game from '../game/game';
import { uuidv4 } from '../../utils/urls';
import './welcome.scss';
import { RewardType } from '../../../../common/types';
import { getRewardText } from '../../utils/status';

class Welcome {
  menuPanel: HTMLDivElement;
  constructor(game: Game) {
    const menuPanel = document.createElement('div');
    menuPanel.id = 'menu-panel';
    this.menuPanel = menuPanel;

    const startGame = document.createElement('div');
    startGame.id = 'start-game';

    const label = document.createElement('label');
    label.htmlFor = 'tank-name-input';
    label.textContent = 'Name your tank:';
    const tankNameContainer = document.createElement('div');
    tankNameContainer.id = 'tank-name-container';

    const tankNameInput = document.createElement('input');
    tankNameInput.id = 'tank-name-input';
    tankNameInput.type = 'text';
    tankNameInput.ariaLabel = 'tank-name';
    tankNameInput.autocomplete = 'off';
    const startButton = document.createElement('button');
    startButton.id = 'start-button';
    startButton.textContent = 'Start';
    startButton.disabled = true;
    tankNameContainer.append(tankNameInput, startButton);

    const instructionLabel = document.createElement('div');
    instructionLabel.className = 'instruction-title';
    instructionLabel.textContent = 'Keyboard Operations:';

    const instructionContainer = document.createElement('div');
    instructionContainer.id = 'instruction-container';
    const instructionCells = [];
    const instructionContent = [];
    for (let i = 0; i < 8; i++) {
      const instructionCell = document.createElement('div');
      instructionCell.className = 'instruction-cell';
      instructionCell.id = `cell-${i}`;
      const cellContent = document.createElement('span');
      instructionCell.appendChild(cellContent);
      instructionCells.push(instructionCell);
      instructionContent.push(cellContent);
    }

    const keyW = instructionCells[1];
    keyW.classList.add('keyboard-cell');
    const keyWContent = instructionContent[1];
    keyWContent.textContent = 'W🡑';

    const keyA = instructionCells[4];
    keyA.classList.add('keyboard-cell');
    const keyAContent = instructionContent[4];
    keyAContent.textContent = '🡐A';

    const keyS = instructionCells[5];
    keyS.classList.add('keyboard-cell');
    const keySContent = instructionContent[5];
    keySContent.textContent = 'S🡓';

    const keyD = instructionCells[6];
    keyD.classList.add('keyboard-cell');
    const keyDContent = instructionContent[6];
    keyDContent.textContent = 'D🡒';

    const keySpace = instructionCells[7];
    keySpace.classList.add('keyboard-cell');
    const keySpaceContent = instructionContent[7];
    keySpaceContent.textContent = 'Space: Shoot';

    const keyEsc = instructionCells[3];
    keyEsc.classList.add('keyboard-cell');
    keyEsc.classList.add('right-cell');
    const keyEscContent = instructionContent[3];
    keyEscContent.textContent = 'Esc: Settings';

    instructionContainer.append(...instructionCells);
    
    const rewardLabel = document.createElement('div');
    rewardLabel.className = 'instruction-title';
    rewardLabel.textContent = 'Rewards:';

    const rewardContainer = document.createElement('div');
    rewardContainer.id = 'reward-container';
    for(let i = 0; i < 5 ; i++) {
      const reward = document.createElement('div');
      reward.classList.add('reward-cell');
      const rewardType = i as RewardType;
      reward.textContent = getRewardText(rewardType);
      reward.title = this.getRewardInstruction(rewardType);
      rewardContainer.append(reward);
    }

    startGame.append(label, tankNameContainer, instructionLabel, instructionContainer, rewardLabel, rewardContainer);

    menuPanel.append(startGame);
    document.body.append(menuPanel);

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

  showPanel(): void {
    this.menuPanel.style.display = 'block';
  }

  hidePanel(): void {
    this.menuPanel.style.display = 'none';
  }

  getRewardInstruction(type: RewardType): string {
    switch (type) {
      case RewardType.TANK_SWIFT:
        return 'Swift, faster movement';
      case RewardType.TANK_SAMLL:
        return 'Dodge, tank shrinks';
      case RewardType.TANK_INVULNERABLE:
        return 'Invulnerability, can\'t be damaged';
      case RewardType.BULLET_POWER:
        return 'Battle Effectiveness, larger ammunition size';
      case RewardType.BULLTET_LARGE:
        return 'Fire Power, ammunition gains more scores';
      default:
        return 'Unknown';
    }
  }
}

export default Welcome;
