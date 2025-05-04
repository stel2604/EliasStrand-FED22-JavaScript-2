import { describe, it, expect } from 'vitest';
import { isActivePath } from '../utils/isActivePath';

describe('isActivePath', () => {
  it('returns true when paths match exactly', () => {
    expect(isActivePath('/about', '/about')).toBe(true);
  });

  it('returns true when href is "/" and path is "/"', () => {
    expect(isActivePath('/', '/')).toBe(true);
  });

  it('returns true when href is "/" and path is "/index.html"', () => {
    expect(isActivePath('/index.html', '/')).toBe(true);
  });

  it('returns true when path includes href', () => {
    expect(isActivePath('/about/team', '/about')).toBe(true);
  });

  it('returns false when paths don’t match', () => {
    expect(isActivePath('/contact', '/about')).toBe(false);
  });
});
