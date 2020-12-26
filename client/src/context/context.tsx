import { GameDataContextType } from '../data/Types';
import { createContext, useContext } from 'react';

export const GameDataContext = createContext<GameDataContextType>({ 
  gameData: {id: ''},
  setGameData: () => console.warn('no data provider')
});

export const useGameData = ():GameDataContextType => useContext(GameDataContext);
