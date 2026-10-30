import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePassword,
  validateDisplayName,
  validateTaskTitle,
  validateTaskDescription,
} from '../utils/validation';

describe('validateEmail', () => {
  it('returns null for valid email', () => {
    expect(validateEmail('user@example.com')).toBeNull();
  });
  it('returns error for empty email', () => {
    expect(validateEmail('')).not.toBeNull();
  });
  it('returns error for email without @', () => {
    expect(validateEmail('userexample.com')).not.toBeNull();
  });
  it('returns error for email without domain', () => {
    expect(validateEmail('user@')).not.toBeNull();
  });
  it('returns error for whitespace-only email', () => {
    expect(validateEmail('   ')).not.toBeNull();
  });
});

describe('validatePassword', () => {
  it('returns null for valid password', () => {
    expect(validatePassword('secret123')).toBeNull();
  });
  it('returns error for empty password', () => {
    expect(validatePassword('')).not.toBeNull();
  });
  it('returns error for password shorter than 6 chars', () => {
    expect(validatePassword('abc')).not.toBeNull();
  });
  it('accepts password of exactly 6 chars', () => {
    expect(validatePassword('abcdef')).toBeNull();
  });
});

describe('validateDisplayName', () => {
  it('returns null for valid name', () => {
    expect(validateDisplayName('Jane Doe')).toBeNull();
  });
  it('returns error for empty name', () => {
    expect(validateDisplayName('')).not.toBeNull();
  });
  it('returns error for single character', () => {
    expect(validateDisplayName('J')).not.toBeNull();
  });
  it('returns error for name over 60 chars', () => {
    expect(validateDisplayName('A'.repeat(61))).not.toBeNull();
  });
  it('returns error for whitespace-only', () => {
    expect(validateDisplayName('   ')).not.toBeNull();
  });
});

describe('validateTaskTitle', () => {
  it('returns null for valid title', () => {
    expect(validateTaskTitle('Buy groceries')).toBeNull();
  });
  it('returns error for empty title', () => {
    expect(validateTaskTitle('')).not.toBeNull();
  });
  it('returns error for whitespace-only title', () => {
    expect(validateTaskTitle('   ')).not.toBeNull();
  });
  it('returns error for title over 200 chars', () => {
    expect(validateTaskTitle('A'.repeat(201))).not.toBeNull();
  });
  it('accepts title of exactly 200 chars', () => {
    expect(validateTaskTitle('A'.repeat(200))).toBeNull();
  });
});

describe('validateTaskDescription', () => {
  it('returns null for empty description', () => {
    expect(validateTaskDescription('')).toBeNull();
  });
  it('returns null for valid description', () => {
    expect(validateTaskDescription('Buy apples and oranges')).toBeNull();
  });
  it('returns error for description over 2000 chars', () => {
    expect(validateTaskDescription('A'.repeat(2001))).not.toBeNull();
  });
  it('accepts description of exactly 2000 chars', () => {
    expect(validateTaskDescription('A'.repeat(2000))).toBeNull();
  });
});
