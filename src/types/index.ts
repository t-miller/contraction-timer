export interface Contraction {
  id: string;
  startTime: number;
  endTime: number | null;
}

export interface AppState {
  contractions: Contraction[];
  activeContraction: Contraction | null;
  isLoading: boolean;
}

export type AppAction =
  | { type: 'START_CONTRACTION' }
  | { type: 'END_CONTRACTION' }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'LOAD_CONTRACTIONS'; payload: Contraction[] };

export interface ContractionContextValue {
  state: AppState;
  startContraction: () => void;
  endContraction: () => void;
  clearHistory: () => void;
}
