import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { AppState, AppAction, ContractionContextValue, Contraction, ContractionSet } from '../types';
import { generateId } from '../utils/formatting';
import { saveContractions, loadContractions, clearContractions, saveSets, loadSets } from '../utils/storage';

const initialState: AppState = {
  contractions: [],
  activeContraction: null,
  isLoading: true,
  savedSets: [],
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
    case 'LOAD_SETS':
      return {
        ...state,
        savedSets: action.payload,
      };
    case 'SAVE_SET': {
      const newSet: ContractionSet = {
        id: generateId(),
        name: action.payload.name,
        contractions: state.contractions,
        createdAt: Date.now(),
      };
      return {
        ...state,
        savedSets: [newSet, ...state.savedSets],
      };
    }
    case 'LOAD_SET': {
      const setToLoad = state.savedSets.find((s) => s.id === action.payload.id);
      if (!setToLoad) return state;
      return {
        ...state,
        contractions: setToLoad.contractions,
        activeContraction: null,
      };
    }
    case 'DELETE_SET':
      return {
        ...state,
        savedSets: state.savedSets.filter((s) => s.id !== action.payload.id),
      };
    default:
      return state;
  }
}

const ContractionContext = createContext<ContractionContextValue | null>(null);

export function ContractionProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const load = async () => {
      const contractions = await loadContractions();
      dispatch({ type: 'LOAD_CONTRACTIONS', payload: contractions });
      try {
        const sets = await loadSets();
        dispatch({ type: 'LOAD_SETS', payload: sets });
      } catch (error) {
        Alert.alert('Error', (error as Error).message);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!state.isLoading) {
      saveContractions(state.contractions);
    }
  }, [state.contractions, state.isLoading]);

  useEffect(() => {
    const save = async () => {
      try {
        await saveSets(state.savedSets);
      } catch (error) {
        Alert.alert('Error', (error as Error).message);
      }
    };
    if (!state.isLoading) {
      save();
    }
  }, [state.savedSets, state.isLoading]);

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

  const saveSet = useCallback((name: string) => {
    dispatch({ type: 'SAVE_SET', payload: { name } });
  }, []);

  const loadSet = useCallback((id: string) => {
    dispatch({ type: 'LOAD_SET', payload: { id } });
  }, []);

  const deleteSet = useCallback((id: string) => {
    dispatch({ type: 'DELETE_SET', payload: { id } });
  }, []);

  return (
    <ContractionContext.Provider
      value={{ state, startContraction, endContraction, clearHistory, saveSet, loadSet, deleteSet }}
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
