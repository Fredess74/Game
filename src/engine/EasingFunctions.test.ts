import { describe, it, expect } from 'vitest';
import { EasingFunctions, interpolate } from './EasingFunctions';

describe('EasingFunctions', () => {
  describe('linear', () => {
    it('should return input value', () => {
      expect(EasingFunctions.linear(0)).toBe(0);
      expect(EasingFunctions.linear(0.5)).toBe(0.5);
      expect(EasingFunctions.linear(1)).toBe(1);
    });
  });

  describe('easeIn', () => {
    it('should implement quadratic ease-in', () => {
      expect(EasingFunctions.easeIn(0)).toBe(0);
      expect(EasingFunctions.easeIn(0.5)).toBe(0.25);
      expect(EasingFunctions.easeIn(1)).toBe(1);
    });
  });

  describe('easeOut', () => {
    it('should implement quadratic ease-out', () => {
      expect(EasingFunctions.easeOut(0)).toBe(0);
      expect(EasingFunctions.easeOut(0.5)).toBe(0.75);
      expect(EasingFunctions.easeOut(1)).toBe(1);
    });
  });

  describe('easeInOut', () => {
    it('should implement quadratic ease-in-out', () => {
      expect(EasingFunctions.easeInOut(0)).toBe(0);
      expect(EasingFunctions.easeInOut(0.25)).toBe(0.125);
      expect(EasingFunctions.easeInOut(0.5)).toBe(0.5);
      expect(EasingFunctions.easeInOut(0.75)).toBe(0.875);
      expect(EasingFunctions.easeInOut(1)).toBe(1);
    });
  });

  describe('easeInBack', () => {
    it('should start at 0', () => {
      // Use toBeCloseTo or allow -0 since 0 * -s = -0
      expect(EasingFunctions.easeInBack(0)).toBeCloseTo(0);
    });

    it('should overshoot backwards initially', () => {
      // For small t, s term dominates
      const result = EasingFunctions.easeInBack(0.1);
      expect(result).toBeLessThan(0);
    });

    it('should reach 1 at the end', () => {
      expect(EasingFunctions.easeInBack(1)).toBeCloseTo(1);
    });
  });

  describe('easeOutBounce', () => {
    it('should start at 0', () => {
      expect(EasingFunctions.easeOutBounce(0)).toBe(0);
    });

    it('should end at 1', () => {
      expect(EasingFunctions.easeOutBounce(1)).toBe(1);
    });

    it('should have intermediate values between 0 and 1 generally', () => {
        // Just verify it doesn't return NaN or wildly incorrect values for a few points
        expect(EasingFunctions.easeOutBounce(0.5)).toBeGreaterThan(0);
        expect(EasingFunctions.easeOutBounce(0.5)).toBeLessThan(1);
    });
  });

  describe('step', () => {
    it('should return 0 for t < 0.5', () => {
      expect(EasingFunctions.step(0)).toBe(0);
      expect(EasingFunctions.step(0.49)).toBe(0);
    });

    it('should return 1 for t >= 0.5', () => {
      expect(EasingFunctions.step(0.5)).toBe(1);
      expect(EasingFunctions.step(0.51)).toBe(1);
      expect(EasingFunctions.step(1)).toBe(1);
    });
  });
});

describe('interpolate', () => {
  it('should interpolate linearly by default', () => {
    expect(interpolate(0, 100, 0.5)).toBe(50);
  });

  it('should use specified easing function', () => {
    // step function jumps at 0.5
    expect(interpolate(0, 100, 0.4, 'step')).toBe(0);
    expect(interpolate(0, 100, 0.6, 'step')).toBe(100);
  });

  it('should clamp t between 0 and 1', () => {
    expect(interpolate(0, 100, -0.5)).toBe(0); // Clamped to 0, so linear(0) = 0
    expect(interpolate(0, 100, 1.5)).toBe(100); // Clamped to 1, so linear(1) = 1
  });

  it('should handle start > end', () => {
      expect(interpolate(100, 0, 0.5)).toBe(50);
  });

  it('should handle negative values', () => {
      expect(interpolate(-10, 10, 0.5)).toBe(0);
  });
});
