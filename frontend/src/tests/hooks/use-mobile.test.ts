import { describe, it, expect, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useIsMobile } from '../../hooks/use-mobile';

describe('useIsMobile', () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('should return true for mobile viewport', () => {
    window.matchMedia = (query: string) => ({
      matches: query === '(max-width: 768px)',
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('should return false for desktop viewport', () => {
    window.matchMedia = (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('should use default value when matchMedia is not supported', () => {
    const originalMatchMedia = window.matchMedia;
    // @ts-expect-error - testing undefined scenario
    window.matchMedia = undefined;

    const { result } = renderHook(() => useIsMobile());
    
    // Should return false as default when matchMedia is not available
    expect(result.current).toBe(false);

    window.matchMedia = originalMatchMedia;
  });
});
