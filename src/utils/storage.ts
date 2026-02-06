import AsyncStorage from '@react-native-async-storage/async-storage';
import { Contraction, ContractionSet } from '../types';
import { StorageError } from './errors';

const STORAGE_KEY = 'contractions';
const SETS_STORAGE_KEY = 'contractionSets';

export async function saveContractions(contractions: Contraction[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(contractions));
  } catch (error) {
    throw new StorageError('save', STORAGE_KEY, error);
  }
}

export async function loadContractions(): Promise<Contraction[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    throw new StorageError('load', STORAGE_KEY, error);
  }
}

export async function clearContractions(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    throw new StorageError('save', STORAGE_KEY, error);
  }
}

export async function saveSets(sets: ContractionSet[]): Promise<void> {
  try {
    await AsyncStorage.setItem(SETS_STORAGE_KEY, JSON.stringify(sets));
  } catch (error) {
    throw new StorageError('save', SETS_STORAGE_KEY, error);
  }
}

export async function loadSets(): Promise<ContractionSet[]> {
  try {
    const data = await AsyncStorage.getItem(SETS_STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    throw new StorageError('load', SETS_STORAGE_KEY, error);
  }
}
