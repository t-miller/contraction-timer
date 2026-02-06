import AsyncStorage from '@react-native-async-storage/async-storage';

export const CURRENT_VERSION = 1;
const VERSION_KEY = 'data_version';

export async function migrateData(): Promise<void> {
  const versionStr = await AsyncStorage.getItem(VERSION_KEY);
  const version = versionStr ? parseInt(versionStr, 10) : 0;

  if (version === CURRENT_VERSION) {
    return;
  }

  if (version < 1) {
    await migrateV0ToV1();
  }

  await AsyncStorage.setItem(VERSION_KEY, CURRENT_VERSION.toString());
}

async function migrateV0ToV1(): Promise<void> {
  const data = await AsyncStorage.getItem('contractions');
  if (data) {
    try {
      const contractions = JSON.parse(data);
      const migrated = contractions.map((c: Record<string, unknown>) => ({
        ...c,
        id: String(c.id),
      }));
      await AsyncStorage.setItem('contractions', JSON.stringify(migrated));
    } catch {
      // Corrupted data - skip migration, validation on load will handle it
    }
  }
}
