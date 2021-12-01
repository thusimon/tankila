import { RewardStatus, RewardType } from '../../types/Types';
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

  show() {
    this.rewardsPanel.style.display = 'flex';
  }

  updateStatus(rewardStatus: RewardStatus) {
    this.rewardKeys.forEach((key, idx) => {
      const leftTime = rewardStatus[key]!;
      const rewardView = this.rewards[idx];
      if (leftTime > 0) {
        // show the status and update the time
        rewardView[0].classList.add('reward-container-show');
        rewardView[1].textContent = `${leftTime}s`;
      } else {
        // hide the status
        rewardView[0].classList.remove('reward-container-show');
      }
    });
  }
}

export default Rewards;
