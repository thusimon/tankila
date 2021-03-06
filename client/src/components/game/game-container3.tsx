import React, {useEffect} from 'react';
import { useGameData } from '../../context/context';
import './game-container3.scss';
import Game3 from './game3';

const GameContainer3 = (): JSX.Element => {
  const { gameData } = useGameData();
  let game3: Game3 | undefined;
  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    if (!game3) {
      game3 = new Game3({
        width,
        height,
        canvasParentId: 'game-container',
        syncRate: 100,
        id: gameData.id
      });
      game3.addMe();
    }
  }, []);
  return (<div id='overall-container'>
    <div id='game-container'></div>
    <div id='stat-container'></div>
  </div>);
};

export default GameContainer3;