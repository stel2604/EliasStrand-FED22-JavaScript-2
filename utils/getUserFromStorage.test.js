import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { getUserFromStorage } from '../utils/getUserFromStorage.js';

describe('getUserFromStorage', () => {
  const mockUser = { name: 'Elias', role: 'student' };

  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return the user object if it exists in localStorage', () => {
    localStorage.getItem.mockReturnValue(JSON.stringify(mockUser));
    const result = getUserFromStorage();
    expect(result).toEqual(mockUser);
  });

  it('should return null if no user exists in localStorage', () => {
    localStorage.getItem.mockReturnValue(null);
    const result = getUserFromStorage();
    expect(result).toBeNull();
  });
});
