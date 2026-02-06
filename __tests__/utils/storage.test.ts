import { vi } from 'vitest';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  saveContractions,
  loadContractions,
  clearContractions,
  saveSets,
  loadSets,
} from '../../src/utils/storage';
import { Contraction, ContractionSet } from '../../src/types';
import { StorageError } from '../../src/utils/errors';

describe('storage utilities', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    vi.clearAllMocks();
  });

  describe('saveContractions', () => {
    it('saves contractions to AsyncStorage', async () => {
      const contractions: Contraction[] = [
        { id: '1', startTime: 1000, endTime: 2000 },
        { id: '2', startTime: 3000, endTime: 4000 },
      ];

      await saveContractions(contractions);

      const stored = await AsyncStorage.getItem('contractions');
      expect(stored).toBe(JSON.stringify(contractions));
    });

    it('saves empty array', async () => {
      await saveContractions([]);

      const stored = await AsyncStorage.getItem('contractions');
      expect(stored).toBe('[]');
    });

    it('overwrites existing contractions', async () => {
      const initial: Contraction[] = [{ id: '1', startTime: 1000, endTime: 2000 }];
      const updated: Contraction[] = [{ id: '2', startTime: 3000, endTime: 4000 }];

      await saveContractions(initial);
      await saveContractions(updated);

      const stored = await AsyncStorage.getItem('contractions');
      expect(stored).toBe(JSON.stringify(updated));
    });

    it('handles contractions with null endTime', async () => {
      const contractions: Contraction[] = [
        { id: '1', startTime: 1000, endTime: null },
      ];

      await saveContractions(contractions);

      const stored = await AsyncStorage.getItem('contractions');
      expect(stored).toBe(JSON.stringify(contractions));
    });
  });

  describe('loadContractions', () => {
    it('loads contractions from AsyncStorage', async () => {
      const contractions: Contraction[] = [
        { id: '1', startTime: 1000, endTime: 2000 },
      ];
      await AsyncStorage.setItem('contractions', JSON.stringify(contractions));

      const result = await loadContractions();

      expect(result).toEqual(contractions);
    });

    it('returns empty array when no data exists', async () => {
      const result = await loadContractions();

      expect(result).toEqual([]);
    });

    it('throws StorageError when JSON is corrupted', async () => {
      await AsyncStorage.setItem('contractions', 'invalid json');

      await expect(loadContractions()).rejects.toThrow(StorageError);
    });

    it('throws StorageError with correct message when JSON is corrupted', async () => {
      await AsyncStorage.setItem('contractions', 'invalid json');

      await expect(loadContractions()).rejects.toThrow('Failed to load contractions');
    });
  });

  describe('saveContractions error handling', () => {
    it('throws StorageError when save fails', async () => {
      vi.mocked(AsyncStorage.setItem).mockRejectedValueOnce(new Error('disk full'));

      await expect(saveContractions([])).rejects.toThrow(StorageError);
    });

    it('throws StorageError with correct message when save fails', async () => {
      vi.mocked(AsyncStorage.setItem).mockRejectedValueOnce(new Error('disk full'));

      await expect(saveContractions([])).rejects.toThrow('Failed to save contractions');
    });
  });

  describe('clearContractions', () => {
    it('removes contractions from AsyncStorage', async () => {
      await AsyncStorage.setItem('contractions', '[]');

      await clearContractions();

      const stored = await AsyncStorage.getItem('contractions');
      expect(stored).toBeNull();
    });

    it('does not throw when no data exists', async () => {
      await expect(clearContractions()).resolves.not.toThrow();
    });
  });

  describe('saveSets', () => {
    it('saves sets to AsyncStorage', async () => {
      const sets: ContractionSet[] = [
        {
          id: '1',
          name: 'Test Set',
          contractions: [{ id: 'c1', startTime: 1000, endTime: 2000 }],
          createdAt: 1000,
        },
      ];

      await saveSets(sets);

      const stored = await AsyncStorage.getItem('contractionSets');
      expect(stored).toBe(JSON.stringify(sets));
    });

    it('saves empty array', async () => {
      await saveSets([]);

      const stored = await AsyncStorage.getItem('contractionSets');
      expect(stored).toBe('[]');
    });
  });

  describe('loadSets', () => {
    it('loads sets from AsyncStorage', async () => {
      const sets: ContractionSet[] = [
        {
          id: '1',
          name: 'Test Set',
          contractions: [],
          createdAt: 1000,
        },
      ];
      await AsyncStorage.setItem('contractionSets', JSON.stringify(sets));

      const result = await loadSets();

      expect(result).toEqual(sets);
    });

    it('returns empty array when no data exists', async () => {
      const result = await loadSets();

      expect(result).toEqual([]);
    });
  });

  describe('data validation', () => {
    it('rejects invalid contractions on load', async () => {
      const invalidData = JSON.stringify([{ invalid: 'data' }]);
      await AsyncStorage.setItem('contractions', invalidData);

      await expect(loadContractions()).rejects.toThrow(StorageError);
    });

    it('rejects invalid sets on load', async () => {
      const invalidData = JSON.stringify([{ name: '' }]);
      await AsyncStorage.setItem('contractionSets', invalidData);

      await expect(loadSets()).rejects.toThrow(StorageError);
    });
  });
});
