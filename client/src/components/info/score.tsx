import React from 'react';
import { ScorePros } from '../../data/Types';

const Score: React.FunctionComponent<ScorePros> = ({scores, id}: ScorePros): JSX.Element => {
  return (<div id='score-info'>
    {scores.map(score => {
      const className = score.id === id ? 'me' : 'player';
      return <p className={className} key={score.id}>{score.id}: {score.score}</p>;
    })}
  </div>);
};

export default Score;