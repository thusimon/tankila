import React, { FormEvent, useRef, useEffect } from 'react';
import { useGameData } from '../context/context';

import './welcome.scss';

const Welcome = (): JSX.Element => {
  const inputTankNameE = useRef<HTMLInputElement>(null);
  const inputEngineE = useRef<HTMLInputElement>(null);
  const { setGameData, gameData } = useGameData();
  useEffect(() => {
    if (inputEngineE.current) {
      inputEngineE.current.checked = gameData.engine;
    }
  }, []);
  const formPreventDefault = (e: FormEvent) => {
    e.preventDefault();
    let name = '', engine = true;
    if (inputTankNameE.current && inputTankNameE.current.value) {
      name = inputTankNameE.current.value;
    }
    if (inputEngineE.current) {
      engine = inputEngineE.current.checked;
    }
    setGameData({
      id: name,
      engine
    });
  };
  return <div id='tank-name-form'>
    <form onSubmit={formPreventDefault}>
      <div className='form-div'>
        <input id='tank-name' size={50} placeholder='please name your tank' ref={inputTankNameE}></input>
      </div>
      <div className='form-div'>
        <input id='threejs-engine' type='checkbox' ref={inputEngineE}></input><label htmlFor='threejs-engine'>Engine Mode</label>
      </div>
      <button>Start</button>
    </form>
  </div>;
};

export default Welcome;
