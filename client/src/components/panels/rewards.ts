import { RewardStatus, RewardType } from '../../../../common/types';
import { getRewardColor, getRewardText } from '../../utils/status';
import './rewards.scss';

class Rewards {
  rewardsPanel: HTMLDivElement;
  rewards: HTMLDivElement[][];
  rewardKeys: RewardType[] = [];
  constructor() {
    this.rewardKeys = Object.keys(RewardType)
    .filter(key => !Number.isNaN(parseInt(key)))
    .map(key => parseInt(key) as unknown as RewardType);
    const rewardsPanel = document.createElement('div');
    rewardsPanel.id = 'rewards-panel';
    rewardsPanel.style.display = 'none';
    this.rewardsPanel = rewardsPanel;
    
    // create 5 rewards
    this.rewards = [];
    this.rewardKeys.forEach((key, idx) => {
      const rewardType = this.rewardKeys[key];
      const reward = document.createElement('div');
      reward.className = 'reward-container';
      const rewardTypeView = document.createElement('div');
      rewardTypeView.className = 'reward-type';
      rewardTypeView.textContent = getRewardText(rewardType);
      rewardTypeView.style.backgroundColor = getRewardColor(rewardType);
      const rewardTimeView = document.createElement('div');
      rewardTimeView.className = 'reward-time';
      reward.id = `reward-${idx}`;
      reward.append(rewardTypeView, rewardTimeView);
      this.rewards.push([reward, rewardTimeView]);
      rewardsPanel.append(reward);
    });

    document.body.append(rewardsPanel);
  }

  show(): void {
    this.rewardsPanel.style.display = 'flex';
  }

  updateStatus(rewardStatus: RewardStatus): void {
    this.rewardKeys.forEach((key, idx) => {
      const leftTime = Math.floor(rewardStatus[key]);
      const rewardView = this.rewards[idx];
      if (leftTime > 0) {
        // show the status and update the time
        rewardView[0].classList.add('reward-container-show');
        rewardView[1].textContent = `${leftTime}s`;
        this.toggleLeftTimeClass(rewardView[1], leftTime);
      } else {
        // hide the status
        rewardView[0].classList.remove('reward-container-show');
      }
    });
  }

  toggleLeftTimeClass(rewardReview: HTMLDivElement, leftTime: number): void {
    if (leftTime > 10) {
      rewardReview.classList.add('reward-time-high');
      rewardReview.classList.remove('reward-time-low');
    } else {
      rewardReview.classList.add('reward-time-low');
      rewardReview.classList.remove('reward-time-high');
    }
  }
}

export default Rewards;
