import { describe, it, expect } from 'vitest';
import {
  ContractionSchema,
  ContractionSetSchema,
  validateContractions,
  validateSets,
} from '../../src/schemas';

describe('ContractionSchema', () => {
  it('validates valid contraction', () => {
    const valid = {
      id: '123',
      startTime: 1000,
      endTime: 2000,
    };
    expect(() => ContractionSchema.parse(valid)).not.toThrow();
  });

  it('validates contraction with null endTime', () => {
    const valid = {
      id: '123',
      startTime: 1000,
      endTime: null,
    };
    expect(() => ContractionSchema.parse(valid)).not.toThrow();
  });

  it('rejects invalid id', () => {
    const invalid = {
      id: 123, // should be string
      startTime: 1000,
      endTime: 2000,
    };
    expect(() => ContractionSchema.parse(invalid)).toThrow();
  });

  it('rejects missing startTime', () => {
    const invalid = {
      id: '123',
      endTime: 2000,
    };
    expect(() => ContractionSchema.parse(invalid)).toThrow();
  });

  it('rejects negative timestamps', () => {
    const invalid = {
      id: '123',
      startTime: -1000,
      endTime: 2000,
    };
    expect(() => ContractionSchema.parse(invalid)).toThrow();
  });
});

describe('ContractionSetSchema', () => {
  it('validates valid set', () => {
    const valid = {
      id: '123',
      name: 'Test Set',
      contractions: [],
      createdAt: 1000,
    };
    expect(() => ContractionSetSchema.parse(valid)).not.toThrow();
  });

  it('validates set with contractions', () => {
    const valid = {
      id: '123',
      name: 'Test Set',
      contractions: [{ id: '1', startTime: 1000, endTime: 2000 }],
      createdAt: 1000,
    };
    expect(() => ContractionSetSchema.parse(valid)).not.toThrow();
  });

  it('rejects empty name', () => {
    const invalid = {
      id: '123',
      name: '',
      contractions: [],
      createdAt: 1000,
    };
    expect(() => ContractionSetSchema.parse(invalid)).toThrow();
  });
});

describe('validateContractions', () => {
  it('returns valid contractions', () => {
    const data = [{ id: '1', startTime: 1000, endTime: 2000 }];
    expect(validateContractions(data)).toEqual(data);
  });

  it('throws on invalid data', () => {
    const data = [{ invalid: true }];
    expect(() => validateContractions(data)).toThrow();
  });

  it('returns empty array for null/undefined', () => {
    expect(validateContractions(null)).toEqual([]);
    expect(validateContractions(undefined)).toEqual([]);
  });
});

describe('validateSets', () => {
  it('returns valid sets', () => {
    const data = [
      {
        id: '1',
        name: 'Test',
        contractions: [],
        createdAt: 1000,
      },
    ];
    expect(validateSets(data)).toEqual(data);
  });

  it('throws on invalid data', () => {
    const data = [{ name: '' }];
    expect(() => validateSets(data)).toThrow();
  });

  it('returns empty array for null/undefined', () => {
    expect(validateSets(null)).toEqual([]);
    expect(validateSets(undefined)).toEqual([]);
  });
});
