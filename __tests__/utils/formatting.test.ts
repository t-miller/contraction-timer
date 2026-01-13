import {
  formatDuration,
  formatDurationHoursMinutes,
  formatTime,
  generateId,
} from '../../src/utils/formatting';

describe('formatDuration', () => {
  it('formats 0 milliseconds as 0:00', () => {
    expect(formatDuration(0)).toBe('0:00');
  });

  it('formats seconds correctly', () => {
    expect(formatDuration(5000)).toBe('0:05');
    expect(formatDuration(30000)).toBe('0:30');
    expect(formatDuration(59000)).toBe('0:59');
  });

  it('formats minutes correctly', () => {
    expect(formatDuration(60000)).toBe('1:00');
    expect(formatDuration(90000)).toBe('1:30');
    expect(formatDuration(120000)).toBe('2:00');
  });

  it('formats minutes and seconds correctly', () => {
    expect(formatDuration(65000)).toBe('1:05');
    expect(formatDuration(125000)).toBe('2:05');
    expect(formatDuration(599000)).toBe('9:59');
  });

  it('handles double-digit minutes', () => {
    expect(formatDuration(600000)).toBe('10:00');
    expect(formatDuration(3600000)).toBe('60:00');
  });

  it('pads seconds with leading zero', () => {
    expect(formatDuration(61000)).toBe('1:01');
    expect(formatDuration(69000)).toBe('1:09');
  });

  it('floors fractional seconds', () => {
    expect(formatDuration(1500)).toBe('0:01');
    expect(formatDuration(1999)).toBe('0:01');
  });
});

describe('formatDurationHoursMinutes', () => {
  it('formats 0 milliseconds as 0h 00min', () => {
    expect(formatDurationHoursMinutes(0)).toBe('0h 00min');
  });

  it('formats minutes correctly', () => {
    expect(formatDurationHoursMinutes(60000)).toBe('0h 01min');
    expect(formatDurationHoursMinutes(1800000)).toBe('0h 30min');
    expect(formatDurationHoursMinutes(3540000)).toBe('0h 59min');
  });

  it('formats hours correctly', () => {
    expect(formatDurationHoursMinutes(3600000)).toBe('1h 00min');
    expect(formatDurationHoursMinutes(7200000)).toBe('2h 00min');
  });

  it('formats hours and minutes correctly', () => {
    expect(formatDurationHoursMinutes(3660000)).toBe('1h 01min');
    expect(formatDurationHoursMinutes(5400000)).toBe('1h 30min');
    expect(formatDurationHoursMinutes(7260000)).toBe('2h 01min');
  });

  it('pads minutes with leading zero', () => {
    expect(formatDurationHoursMinutes(3660000)).toBe('1h 01min');
    expect(formatDurationHoursMinutes(4140000)).toBe('1h 09min');
  });

  it('ignores seconds', () => {
    expect(formatDurationHoursMinutes(3661000)).toBe('1h 01min');
    expect(formatDurationHoursMinutes(3659000)).toBe('1h 00min');
  });
});

describe('formatTime', () => {
  it('formats a timestamp to HH:MM format', () => {
    // Create a date with a known time
    const date = new Date(2024, 0, 1, 14, 30, 0);
    const result = formatTime(date.getTime());
    // Result should contain the hour and minute
    expect(result).toMatch(/\d{1,2}:\d{2}/);
  });

  it('formats midnight correctly', () => {
    const midnight = new Date(2024, 0, 1, 0, 0, 0);
    const result = formatTime(midnight.getTime());
    expect(result).toMatch(/12:00|00:00|0:00/);
  });

  it('formats noon correctly', () => {
    const noon = new Date(2024, 0, 1, 12, 0, 0);
    const result = formatTime(noon.getTime());
    expect(result).toMatch(/12:00/);
  });
});

describe('generateId', () => {
  it('generates a string', () => {
    const id = generateId();
    expect(typeof id).toBe('string');
  });

  it('generates non-empty strings', () => {
    const id = generateId();
    expect(id.length).toBeGreaterThan(0);
  });

  it('generates unique IDs', () => {
    const ids = new Set<string>();
    for (let i = 0; i < 100; i++) {
      ids.add(generateId());
    }
    expect(ids.size).toBe(100);
  });

  it('contains alphanumeric characters', () => {
    const id = generateId();
    expect(id).toMatch(/^[a-z0-9]+$/);
  });
});
