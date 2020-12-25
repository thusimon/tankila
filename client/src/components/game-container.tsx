import React, {useEffect, useRef} from 'react';
import Game from './game';
import './game-container.scss';

const GameContainer = (): JSX.Element => {
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const current = container.current;
    if (current) {
      current.style.width = `${width}px`;
      current.style.height = `${height}px`;
    }
    new Game({
      width,
      height,
      canvasParentId: 'game-container',
      syncRate: 100
    });
  }, []);
  return <div id='game-container' ref={container}></div>;
};

export default GameContainer;