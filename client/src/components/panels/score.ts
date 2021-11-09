import { ScoresData, Tanks } from "../../types/Types";

class Score {
  scorePanel: HTMLDivElement;
  scoreArea: HTMLTextAreaElement;
  constructor() {
    const scorePanel = document.createElement('div');
    scorePanel.id = 'score-panel';
    this.scorePanel = scorePanel;

    const scoreArea = document.createElement('textarea');
    scoreArea.id = 'score-area';
    scoreArea.readOnly = true;
    this.scoreArea = scoreArea;

    scorePanel.append(scoreArea);
    this.showScore = this.showScore.bind(this);
    this.hideScore = this.hideScore.bind(this);
    this.hideScore();
    document.body.append(scorePanel);
  }

  showScore() {
    this.scorePanel.classList.add('score-show');
  }

  hideScore() {
    this.scorePanel.classList.remove('score-show');
  }

  updateScore(scoresData: ScoresData) {
    const scores = Object.keys(scoresData).reduce((accu, tankId) => {
      const {n, s} = scoresData[tankId];
      const tankScore = `${n}: ${s}\n`;
      return accu + tankScore;
    }, '');
    this.scoreArea.value = scores;
  }
}

export default Score;
