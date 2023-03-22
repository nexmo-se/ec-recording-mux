import React, { createContext, useContext, useState } from 'react';
import useFirebaseAuth from './useFirebaseAuth';

export const StateContext = createContext({});

export default function AppStateProvider(props) {
  const [error, setError] = useState(null);

  let contextValue = {
    error,
    setError,
  };


  return (
    <StateContext.Provider
      value={{
        ...contextValue,
        ...useFirebaseAuth(), // eslint-disable-line react-hooks/rules-of-hooks
      }}
    >
      {props.children}
    </StateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useAppState must be used within the AppStateProvider');
  }
  return context;
}
