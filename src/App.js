import React from 'react';
import './App.css';
import BattleFieldGround from './components/battlefield/ground';
import Tank from './components/tank/tank';

function App() {
  return (
    <div className="App">
      <BattleFieldGround />
      <Tank />
    </div>
  );
}

export default App;
