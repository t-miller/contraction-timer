import { describe, it, expect, vi, beforeEach } from 'vitest';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { migrateData, CURRENT_VERSION } from '../../src/utils/migrations';

describe('migrateData', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    vi.clearAllMocks();
  });

  it('sets version if not present', async () => {
    await migrateData();

    const version = await AsyncStorage.getItem('data_version');
    expect(version).toBe(CURRENT_VERSION.toString());
  });

  it('does nothing if already at current version', async () => {
    await AsyncStorage.setItem('data_version', CURRENT_VERSION.toString());

    await migrateData();

    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1); // only the initial setup call
  });

  it('migrates from v0 to v1 by ensuring IDs are strings', async () => {
    const oldData = JSON.stringify([{ id: 1, startTime: 1000, endTime: 2000 }]);
    await AsyncStorage.setItem('contractions', oldData);

    await migrateData();

    const data = await AsyncStorage.getItem('contractions');
    const parsed = JSON.parse(data!);
    expect(parsed[0].id).toBe('1');

    const version = await AsyncStorage.getItem('data_version');
    expect(version).toBe('1');
  });

  it('handles empty storage gracefully during migration', async () => {
    await expect(migrateData()).resolves.not.toThrow();
  });
});
