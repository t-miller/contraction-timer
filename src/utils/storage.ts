import AsyncStorage from '@react-native-async-storage/async-storage';
import { Contraction } from '../types';

const STORAGE_KEY = 'contractions';

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
