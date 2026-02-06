import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { AppState, AppAction, ContractionContextValue, Contraction, ContractionSet } from '../types';
import { generateId } from '../utils/formatting';
import { saveContractions, loadContractions, clearContractions, saveSets, loadSets } from '../utils/storage';
import { migrateData } from '../utils/migrations';

const initialState: AppState = {
  contractions: [],
  activeContraction: null,
  isLoading: true,
  savedSets: [],
  error: null,
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
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
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
      try {
        await migrateData();
        const [loadedContractions, loadedSets] = await Promise.all([
          loadContractions(),
          loadSets(),
        ]);
        dispatch({ type: 'LOAD_CONTRACTIONS', payload: loadedContractions });
        dispatch({ type: 'LOAD_SETS', payload: loadedSets });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error : new Error(String(error)) });
        dispatch({ type: 'LOAD_CONTRACTIONS', payload: [] });
      }
    };
    load();
  }, []);

  useEffect(() => {
    const save = async () => {
      try {
        await saveContractions(state.contractions);
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error : new Error(String(error)) });
      }
    };
    if (!state.isLoading) {
      save();
    }
  }, [state.contractions, state.isLoading]);

  useEffect(() => {
    const save = async () => {
      try {
        await saveSets(state.savedSets);
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error : new Error(String(error)) });
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

  const setError = useCallback((error: Error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  return (
    <ContractionContext.Provider
      value={{ state, startContraction, endContraction, clearHistory, saveSet, loadSet, deleteSet, setError, clearError }}
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
