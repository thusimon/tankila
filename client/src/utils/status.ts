import { RewardType } from "../../../common/types";

export const getRewardText = (rewardType: RewardType): string => {
  switch (rewardType) {
    case RewardType.TANK_SWIFT: {
      return '🚀';
    }
    case RewardType.TANK_SAMLL: {
      return '🐁';
    }
    case RewardType.TANK_INVULNERABLE: {
      return '🛡️';
    }
    case RewardType.BULLTET_LARGE: {
      return '⚔️';
    }
    case RewardType.BULLET_POWER: {
      return '🔥';
    }
    default: {
      return '';
    }
  }
};

export const getRewardColor = (rewardType: RewardType): string => {
  switch (rewardType) {
    case RewardType.TANK_SWIFT: {
      return '#FF00FF';
    }
    case RewardType.TANK_SAMLL: {
      return '#FFC400';
    }
    case RewardType.TANK_INVULNERABLE: {
      return '#99004C';
    }
    case RewardType.BULLTET_LARGE: {
      return '#0000FF';
    }
    case RewardType.BULLET_POWER: {
      return '#FF0000';
    }
    default: {
      return '#000000';
    }
  }
}
