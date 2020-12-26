import React, { FormEvent, useRef } from 'react';
import { useGameData } from '../context/context';

import './welcome.scss';

const Welcome = (): JSX.Element => {
  const inputE = useRef<HTMLInputElement>(null);
  const { setGameData } = useGameData();
  const formPreventDefault = (e: FormEvent) => {
    e.preventDefault();
    if (inputE.current && inputE.current.value) {
      const name = inputE.current.value;
      setGameData({id: name});
    }
  };
  return <div id='tank-name-form'>
    <form onSubmit={formPreventDefault}>
      <input id='tank-name' size={50} placeholder='please name your tank' ref={inputE}></input>
      <button >Start</button>
    </form>
  </div>;
};

export default Welcome;
