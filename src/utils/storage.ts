import AsyncStorage from '@react-native-async-storage/async-storage';
import { Contraction, ContractionSet } from '../types';

const STORAGE_KEY = 'contractions';
const SETS_STORAGE_KEY = 'contractionSets';

export async function saveContractions(contractions: Contraction[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(contractions));
  } catch (error) {
    console.error('Failed to save contractions:', error);
  }
}

export async function loadContractions(): Promise<Contraction[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load contractions:', error);
  }
  return [];
}

export async function clearContractions(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear contractions:', error);
  }
}

export async function saveSets(sets: ContractionSet[]): Promise<void> {
  try {
    await AsyncStorage.setItem(SETS_STORAGE_KEY, JSON.stringify(sets));
  } catch (error) {
    throw new Error('Failed to save contraction sets. Please try again.');
  }
}

export async function loadSets(): Promise<ContractionSet[]> {
  try {
    const data = await AsyncStorage.getItem(SETS_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    throw new Error('Failed to load saved sets. Please restart the app.');
  }
}
