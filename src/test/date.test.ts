import { describe, it, expect } from 'vitest';
import {
  isOverdue,
  isDueToday,
  isUpcoming,
  formatDueDate,
  toDateInputValue,
} from '../utils/date';
import { addDays, subDays } from 'date-fns';

describe('isOverdue', () => {
  it('returns false for null date', () => {
    expect(isOverdue(null)).toBe(false);
  });
  it('returns true for past date', () => {
    expect(isOverdue(subDays(new Date(), 2))).toBe(true);
  });
  it('returns false for today', () => {
    expect(isOverdue(new Date())).toBe(false);
  });
  it('returns false for future date', () => {
    expect(isOverdue(addDays(new Date(), 3))).toBe(false);
  });
});

describe('isDueToday', () => {
  it('returns false for null', () => {
    expect(isDueToday(null)).toBe(false);
  });
  it('returns true for today', () => {
    expect(isDueToday(new Date())).toBe(true);
  });
  it('returns false for yesterday', () => {
    expect(isDueToday(subDays(new Date(), 1))).toBe(false);
  });
  it('returns false for tomorrow', () => {
    expect(isDueToday(addDays(new Date(), 1))).toBe(false);
  });
});

describe('isUpcoming', () => {
  it('returns false for null', () => {
    expect(isUpcoming(null)).toBe(false);
  });
  it('returns true for tomorrow', () => {
    expect(isUpcoming(addDays(new Date(), 1))).toBe(true);
  });
  it('returns true for next week', () => {
    expect(isUpcoming(addDays(new Date(), 7))).toBe(true);
  });
  it('returns false for today', () => {
    expect(isUpcoming(new Date())).toBe(false);
  });
  it('returns false for past date', () => {
    expect(isUpcoming(subDays(new Date(), 1))).toBe(false);
  });
});

describe('toDateInputValue', () => {
  it('returns empty string for null', () => {
    expect(toDateInputValue(null)).toBe('');
  });
  it('returns YYYY-MM-DD format', () => {
    const d = new Date(2025, 0, 15); // Jan 15 2025
    expect(toDateInputValue(d)).toBe('2025-01-15');
  });
});

describe('formatDueDate', () => {
  it('returns empty string for null', () => {
    expect(formatDueDate(null)).toBe('');
  });
  it('returns "Today" for today', () => {
    expect(formatDueDate(new Date())).toBe('Today');
  });
  it('returns formatted date for other dates', () => {
    const result = formatDueDate(addDays(new Date(), 5));
    expect(result).not.toBe('Today');
    expect(result.length).toBeGreaterThan(0);
  });
});
