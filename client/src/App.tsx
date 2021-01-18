import React, { useState } from 'react';
import './App.css';
import { useGameData, GameDataContext } from './context/context';
import GameContainer from './components/game/game-container';
import GameContainer3 from './components/game/game-container3';
import Welcome from './components/welcome';

function App():JSX.Element {
  const [gameData, setGameData] = useState({id: '', engine: true});
  console.log(gameData);
  const getView = () => {
    if (!gameData.id) {
      return <Welcome />;
    } else if (gameData.engine) {
      return <GameContainer3 />;
    } else {
      return <GameContainer />;
    }
  };
  return <GameDataContext.Provider value={{ gameData, setGameData }}>
    <div className="App">
      {getView()}
    </div>
  </GameDataContext.Provider>;
}

export default App;
