import React, { useState } from 'react';
import './App.css';
import { useGameData, GameDataContext } from './context/context';
import GameContainer from './components/game/game-container';
import Welcome from './components/welcome';

function App():JSX.Element {
  const [gameData, setGameData] = useState({id: ''});
  console.log(gameData);
  return <GameDataContext.Provider value={{ gameData, setGameData }}>
    <div className="App">
      {
        gameData.id ? <GameContainer /> : <Welcome />
      }
    </div>
  </GameDataContext.Provider>;
}

export default App;
