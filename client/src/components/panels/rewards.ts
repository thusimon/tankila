import './rewards.scss';

class Rewards {
  rewardsPanel: HTMLDivElement;
  rewards: HTMLDivElement[];
  constructor() {
    const rewardsPanel = document.createElement('div');
    rewardsPanel.id = 'rewards-panel';
    rewardsPanel.style.display = 'none';
    this.rewardsPanel = rewardsPanel;

    const rewardsMain = document.createElement('div');
    rewardsMain.id = 'rewards-main';
    
    // create 5 rewards
    this.rewards = [];
    for (let i = 0; i < 5; i++) {
      const reward = document.createElement('div');
      reward.className = 'reward-container';
      const rewardType = document.createElement('div');
      rewardType.className = 'reward-type';
      const rewardTime = document.createElement('div');
      rewardTime.className = 'reward-time';
      reward.id = `reward-${i}`;
      reward.append(rewardType, rewardTime);
      this.rewards.push(reward);
      rewardsMain.append(reward);
    }

    rewardsPanel.append(rewardsMain);

    document.body.append(rewardsPanel);
  }
}

export default Rewards;
