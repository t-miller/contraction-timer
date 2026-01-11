export interface Contraction {
  id: string;
  startTime: number;
  endTime: number | null;
}

export interface ContractionSet {
  id: string;
  name: string;
  contractions: Contraction[];
  createdAt: number;
}

export interface AppState {
  contractions: Contraction[];
  activeContraction: Contraction | null;
  isLoading: boolean;
  savedSets: ContractionSet[];
}

export type AppAction =
  | { type: 'START_CONTRACTION' }
  | { type: 'END_CONTRACTION' }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'LOAD_CONTRACTIONS'; payload: Contraction[] }
  | { type: 'LOAD_SETS'; payload: ContractionSet[] }
  | { type: 'SAVE_SET'; payload: { name: string } }
  | { type: 'LOAD_SET'; payload: { id: string } }
  | { type: 'DELETE_SET'; payload: { id: string } };

export interface ContractionContextValue {
  state: AppState;
  startContraction: () => void;
  endContraction: () => void;
  clearHistory: () => void;
  saveSet: (name: string) => void;
  loadSet: (id: string) => void;
  deleteSet: (id: string) => void;
}
