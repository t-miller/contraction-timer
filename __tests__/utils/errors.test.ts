import { describe, it, expect } from 'vitest';
import { StorageError } from '../../src/utils/errors';

describe('StorageError', () => {
  it('creates error with operation and key', () => {
    const error = new StorageError('save', 'contractions', new Error('disk full'));
    expect(error.message).toBe('Failed to save contractions');
    expect(error.operation).toBe('save');
    expect(error.key).toBe('contractions');
    expect(error.cause).toBeInstanceOf(Error);
  });

  it('creates error for load operation', () => {
    const error = new StorageError('load', 'sets', new Error('corrupted'));
    expect(error.message).toBe('Failed to load sets');
    expect(error.operation).toBe('load');
  });

  it('is instanceof Error', () => {
    const error = new StorageError('save', 'test', null);
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(StorageError);
  });
});
