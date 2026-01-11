import React from 'react';
import { vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ContractionProvider, useContractions } from '../../src/context/ContractionContext';
import { Contraction, ContractionSet } from '../../src/types';

// Mock Date.now for predictable timestamps
const mockNow = 1700000000000;
let currentTime = mockNow;
const originalDateNow = Date.now;

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ContractionProvider>{children}</ContractionProvider>
);

describe('ContractionContext', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    currentTime = mockNow;
    Date.now = vi.fn(() => currentTime);
  });

  afterEach(() => {
    Date.now = originalDateNow;
  });

  describe('initial state', () => {
    it('starts with empty contractions', async () => {
      const { result } = renderHook(() => useContractions(), { wrapper });

      await waitFor(() => {
        expect(result.current.state.isLoading).toBe(false);
      });

      expect(result.current.state.contractions).toEqual([]);
      expect(result.current.state.activeContraction).toBeNull();
      expect(result.current.state.savedSets).toEqual([]);
    });

    it('loads existing contractions from storage', async () => {
      const existingContractions: Contraction[] = [
        { id: 'existing-1', startTime: 1000, endTime: 2000 },
      ];
      await AsyncStorage.setItem('contractions', JSON.stringify(existingContractions));

      const { result } = renderHook(() => useContractions(), { wrapper });

      await waitFor(() => {
        expect(result.current.state.isLoading).toBe(false);
      });

      expect(result.current.state.contractions).toEqual(existingContractions);
    });

    it('loads existing saved sets from storage', async () => {
      const existingSets: ContractionSet[] = [
        { id: 'set-1', name: 'Test Set', contractions: [], createdAt: 1000 },
      ];
      await AsyncStorage.setItem('contractionSets', JSON.stringify(existingSets));

      const { result } = renderHook(() => useContractions(), { wrapper });

      await waitFor(() => {
        expect(result.current.state.isLoading).toBe(false);
      });

      expect(result.current.state.savedSets).toEqual(existingSets);
    });
  });

  describe('startContraction', () => {
    it('creates a new active contraction', async () => {
      const { result } = renderHook(() => useContractions(), { wrapper });

      await waitFor(() => {
        expect(result.current.state.isLoading).toBe(false);
      });

      act(() => {
        result.current.startContraction();
      });

      expect(result.current.state.activeContraction).not.toBeNull();
      expect(result.current.state.activeContraction?.startTime).toBe(mockNow);
      expect(result.current.state.activeContraction?.endTime).toBeNull();
      expect(result.current.state.activeContraction?.id).toBeDefined();
    });

    it('replaces existing active contraction', async () => {
      const { result } = renderHook(() => useContractions(), { wrapper });

      await waitFor(() => {
        expect(result.current.state.isLoading).toBe(false);
      });

      act(() => {
        result.current.startContraction();
      });

      const firstId = result.current.state.activeContraction?.id;
      currentTime = mockNow + 1000;

      act(() => {
        result.current.startContraction();
      });

      expect(result.current.state.activeContraction?.startTime).toBe(mockNow + 1000);
      expect(result.current.state.activeContraction?.endTime).toBeNull();
      expect(result.current.state.activeContraction?.id).not.toBe(firstId);
    });

    it('does not add to contractions list until ended', async () => {
      const { result } = renderHook(() => useContractions(), { wrapper });

      await waitFor(() => {
        expect(result.current.state.isLoading).toBe(false);
      });

      act(() => {
        result.current.startContraction();
      });

      expect(result.current.state.contractions).toHaveLength(0);
    });
  });

  describe('endContraction', () => {
    it('completes the active contraction and adds to history', async () => {
      const { result } = renderHook(() => useContractions(), { wrapper });

      await waitFor(() => {
        expect(result.current.state.isLoading).toBe(false);
      });

      act(() => {
        result.current.startContraction();
      });

      currentTime = mockNow + 60000; // 1 minute later

      act(() => {
        result.current.endContraction();
      });

      expect(result.current.state.activeContraction).toBeNull();
      expect(result.current.state.contractions).toHaveLength(1);
      expect(result.current.state.contractions[0].startTime).toBe(mockNow);
      expect(result.current.state.contractions[0].endTime).toBe(mockNow + 60000);
    });

    it('adds new contractions to the beginning of the list', async () => {
      const { result } = renderHook(() => useContractions(), { wrapper });

      await waitFor(() => {
        expect(result.current.state.isLoading).toBe(false);
      });

      // First contraction
      act(() => {
        result.current.startContraction();
      });
      const firstId = result.current.state.activeContraction?.id;
      currentTime = mockNow + 30000;
      act(() => {
        result.current.endContraction();
      });

      // Second contraction
      currentTime = mockNow + 60000;
      act(() => {
        result.current.startContraction();
      });
      const secondId = result.current.state.activeContraction?.id;
      currentTime = mockNow + 90000;
      act(() => {
        result.current.endContraction();
      });

      expect(result.current.state.contractions).toHaveLength(2);
      // Second contraction should be first (most recent)
      expect(result.current.state.contractions[0].id).toBe(secondId);
      expect(result.current.state.contractions[1].id).toBe(firstId);
    });

    it('does nothing if no active contraction', async () => {
      const { result } = renderHook(() => useContractions(), { wrapper });

      await waitFor(() => {
        expect(result.current.state.isLoading).toBe(false);
      });

      act(() => {
        result.current.endContraction();
      });

      expect(result.current.state.contractions).toHaveLength(0);
      expect(result.current.state.activeContraction).toBeNull();
    });

    it('persists contractions to storage', async () => {
      const { result } = renderHook(() => useContractions(), { wrapper });

      await waitFor(() => {
        expect(result.current.state.isLoading).toBe(false);
      });

      act(() => {
        result.current.startContraction();
      });
      currentTime = mockNow + 60000;
      act(() => {
        result.current.endContraction();
      });

      await waitFor(async () => {
        const stored = await AsyncStorage.getItem('contractions');
        expect(stored).toBeTruthy();
      });
    });
  });

  describe('clearHistory', () => {
    it('clears all contractions', async () => {
      const { result } = renderHook(() => useContractions(), { wrapper });

      await waitFor(() => {
        expect(result.current.state.isLoading).toBe(false);
      });

      // Add a contraction
      act(() => {
        result.current.startContraction();
      });
      currentTime = mockNow + 60000;
      act(() => {
        result.current.endContraction();
      });

      expect(result.current.state.contractions).toHaveLength(1);

      act(() => {
        result.current.clearHistory();
      });

      expect(result.current.state.contractions).toHaveLength(0);
    });

    it('also clears active contraction', async () => {
      const { result } = renderHook(() => useContractions(), { wrapper });

      await waitFor(() => {
        expect(result.current.state.isLoading).toBe(false);
      });

      act(() => {
        result.current.startContraction();
      });

      expect(result.current.state.activeContraction).not.toBeNull();

      act(() => {
        result.current.clearHistory();
      });

      expect(result.current.state.activeContraction).toBeNull();
    });
  });

  describe('saveSet', () => {
    it('saves current contractions as a new set', async () => {
      const { result } = renderHook(() => useContractions(), { wrapper });

      await waitFor(() => {
        expect(result.current.state.isLoading).toBe(false);
      });

      // Add contractions
      act(() => {
        result.current.startContraction();
      });
      currentTime = mockNow + 60000;
      act(() => {
        result.current.endContraction();
      });

      currentTime = mockNow + 120000;
      act(() => {
        result.current.saveSet('Morning Session');
      });

      expect(result.current.state.savedSets).toHaveLength(1);
      expect(result.current.state.savedSets[0].name).toBe('Morning Session');
      expect(result.current.state.savedSets[0].contractions).toHaveLength(1);
    });

    it('adds new sets to the beginning', async () => {
      const { result } = renderHook(() => useContractions(), { wrapper });

      await waitFor(() => {
        expect(result.current.state.isLoading).toBe(false);
      });

      act(() => {
        result.current.saveSet('Set 1');
      });

      currentTime = mockNow + 1000;
      act(() => {
        result.current.saveSet('Set 2');
      });

      expect(result.current.state.savedSets).toHaveLength(2);
      expect(result.current.state.savedSets[0].name).toBe('Set 2');
      expect(result.current.state.savedSets[1].name).toBe('Set 1');
    });
  });

  describe('loadSet', () => {
    it('loads contractions from a saved set', async () => {
      const { result } = renderHook(() => useContractions(), { wrapper });

      await waitFor(() => {
        expect(result.current.state.isLoading).toBe(false);
      });

      // Create and save contractions
      act(() => {
        result.current.startContraction();
      });
      currentTime = mockNow + 60000;
      act(() => {
        result.current.endContraction();
      });

      act(() => {
        result.current.saveSet('Test Set');
      });

      // Clear current contractions
      act(() => {
        result.current.clearHistory();
      });

      expect(result.current.state.contractions).toHaveLength(0);

      // Load the saved set
      const setId = result.current.state.savedSets[0].id;
      act(() => {
        result.current.loadSet(setId);
      });

      expect(result.current.state.contractions).toHaveLength(1);
    });

    it('clears active contraction when loading set', async () => {
      const { result } = renderHook(() => useContractions(), { wrapper });

      await waitFor(() => {
        expect(result.current.state.isLoading).toBe(false);
      });

      act(() => {
        result.current.saveSet('Empty Set');
      });

      act(() => {
        result.current.startContraction();
      });

      expect(result.current.state.activeContraction).not.toBeNull();

      const setId = result.current.state.savedSets[0].id;
      act(() => {
        result.current.loadSet(setId);
      });

      expect(result.current.state.activeContraction).toBeNull();
    });

    it('does nothing for non-existent set', async () => {
      const { result } = renderHook(() => useContractions(), { wrapper });

      await waitFor(() => {
        expect(result.current.state.isLoading).toBe(false);
      });

      act(() => {
        result.current.startContraction();
      });
      currentTime = mockNow + 60000;
      act(() => {
        result.current.endContraction();
      });

      const contractionCount = result.current.state.contractions.length;

      act(() => {
        result.current.loadSet('non-existent-id');
      });

      expect(result.current.state.contractions).toHaveLength(contractionCount);
    });
  });

  describe('deleteSet', () => {
    it('removes a saved set', async () => {
      const { result } = renderHook(() => useContractions(), { wrapper });

      await waitFor(() => {
        expect(result.current.state.isLoading).toBe(false);
      });

      act(() => {
        result.current.saveSet('Set to Delete');
      });

      expect(result.current.state.savedSets).toHaveLength(1);

      const setId = result.current.state.savedSets[0].id;
      act(() => {
        result.current.deleteSet(setId);
      });

      expect(result.current.state.savedSets).toHaveLength(0);
    });

    it('removes only the specified set', async () => {
      const { result } = renderHook(() => useContractions(), { wrapper });

      await waitFor(() => {
        expect(result.current.state.isLoading).toBe(false);
      });

      act(() => {
        result.current.saveSet('Set 1');
      });
      act(() => {
        result.current.saveSet('Set 2');
      });
      act(() => {
        result.current.saveSet('Set 3');
      });

      const setToDeleteId = result.current.state.savedSets[1].id;
      act(() => {
        result.current.deleteSet(setToDeleteId);
      });

      expect(result.current.state.savedSets).toHaveLength(2);
      expect(result.current.state.savedSets.find(s => s.id === setToDeleteId)).toBeUndefined();
    });
  });

  describe('useContractions hook', () => {
    it('throws error when used outside provider', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useContractions());
      }).toThrow('useContractions must be used within a ContractionProvider');

      consoleSpy.mockRestore();
    });
  });
});
