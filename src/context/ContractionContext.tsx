import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { AppState, AppAction, ContractionContextValue, Contraction } from '../types';
import { generateId } from '../utils/formatting';
import { saveContractions, loadContractions, clearContractions } from '../utils/storage';

const initialState: AppState = {
  contractions: [],
  activeContraction: null,
  isLoading: true,
};

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'START_CONTRACTION': {
      const newContraction: Contraction = {
        id: generateId(),
        startTime: Date.now(),
        endTime: null,
      };
      return {
        ...state,
        activeContraction: newContraction,
      };
    }
    case 'END_CONTRACTION': {
      if (!state.activeContraction) return state;
      const completedContraction: Contraction = {
        ...state.activeContraction,
        endTime: Date.now(),
      };
      return {
        ...state,
        contractions: [completedContraction, ...state.contractions],
        activeContraction: null,
      };
    }
    case 'CLEAR_HISTORY':
      return {
        ...state,
        contractions: [],
        activeContraction: null,
      };
    case 'LOAD_CONTRACTIONS':
      return {
        ...state,
        contractions: action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
}

const ContractionContext = createContext<ContractionContextValue | null>(null);

export function ContractionProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    loadContractions().then((contractions) => {
      dispatch({ type: 'LOAD_CONTRACTIONS', payload: contractions });
    });
  }, []);

  useEffect(() => {
    if (!state.isLoading) {
      saveContractions(state.contractions);
    }
  }, [state.contractions, state.isLoading]);

  const startContraction = useCallback(() => {
    dispatch({ type: 'START_CONTRACTION' });
  }, []);

  const endContraction = useCallback(() => {
    dispatch({ type: 'END_CONTRACTION' });
  }, []);

  const clearHistory = useCallback(() => {
    clearContractions();
    dispatch({ type: 'CLEAR_HISTORY' });
  }, []);

  return (
    <ContractionContext.Provider
      value={{ state, startContraction, endContraction, clearHistory }}
    >
      {children}
    </ContractionContext.Provider>
  );
}

export function useContractions(): ContractionContextValue {
  const context = useContext(ContractionContext);
  if (!context) {
    throw new Error('useContractions must be used within a ContractionProvider');
  }
  return context;
}
