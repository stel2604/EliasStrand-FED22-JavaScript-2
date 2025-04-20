import { describe, it, expect } from 'vitest';
import { extractPath } from '../utils/extractPath.js'; // tilpass sti etter hvor du legger funksjonen

describe('extractPath', () => {
  it('should return "index" for "/"', () => {
    expect(extractPath('/')).toBe('index');
  });

  it('should return "index" for "/index.html"', () => {
    expect(extractPath('/index.html')).toBe('index');
  });

  it('should return "info" for "/info.html"', () => {
    expect(extractPath('/info.html')).toBe('info');
  });

  it('should return false for "/no-match"', () => {
    expect(extractPath('/no-match')).toBe(false);
  });
});
