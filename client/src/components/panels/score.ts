import { ScoresData } from "../../types/Types";
import './score.scss';

class Score {
  scorePanel: HTMLDivElement;
  scoreArea: HTMLTextAreaElement;
  scoreControl: HTMLSpanElement;
  scoreShow: boolean = true;
  constructor() {
    const scorePanel = document.createElement('div');
    scorePanel.id = 'score-panel';
    scorePanel.style.display = 'none';
    this.scorePanel = scorePanel;

    const scoreHeader = document.createElement('div');
    scoreHeader.id = 'score-header';
    const scoreTitle = document.createElement('span');
    scoreTitle.id = 'score-title';
    scoreTitle.textContent = 'Score Board';
    const scoreControl = document.createElement('span');
    scoreControl.id = 'score-control';
    scoreControl.textContent = '⯅';
    this.scoreControl = scoreControl;
    scoreHeader.append(scoreTitle, scoreControl);
    scorePanel.append(scoreHeader);

    const scoreArea = document.createElement('textarea');
    scoreArea.id = 'score-area';
    scoreArea.readOnly = true;
    this.scoreArea = scoreArea;

    scorePanel.append(scoreArea);
    this.showPanel = this.showPanel.bind(this);
    this.showScore = this.showScore.bind(this);
    this.hideScore = this.hideScore.bind(this);
    this.toggleScore = this.toggleScore.bind(this);
    this.hideScore();

    this.scoreControl.addEventListener('click', this.toggleScore);
    document.body.append(scorePanel);
  }

  showPanel() {
    this.scorePanel.style.display = 'block';
  }

  toggleScore() {
    this.scoreShow = !this.scoreShow;
    if (this.scoreShow) {
      this.showScore();
    } else {
      this.hideScore();
    }
  }

  showScore() {
    this.scoreArea.classList.remove('score-hide');
    this.scoreArea.classList.add('score-show');
    this.scoreControl.textContent = '⯅';
  }

  hideScore() {
    this.scoreArea.classList.remove('score-show');
    this.scoreArea.classList.add('score-hide');
    this.scoreControl.textContent = '⯆';
  }

  updateScore(scoresData: ScoresData) {
    // sort score
    const scoresArray = Object.keys(scoresData).map(tankId => [tankId, scoresData[tankId].n, scoresData[tankId].s]);
    scoresArray.sort((a, b) => {
      const scoreA = a[2] as number;
      const scoreB = b[2] as number;
      return scoreB - scoreA;
    })
    const scoresText = scoresArray.reduce((accu, score) => {
      const tankScore = `${score[1]}: ${score[2]}\n`;
      return accu + tankScore;
    }, '');
    this.scoreArea.value = scoresText;
  }
}

export default Score;
