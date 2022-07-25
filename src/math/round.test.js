import { round } from './round';

describe('round function', () => {
  it('can round up', () => {
    expect(round(5.627, 2)).toBe(5.63);
    expect(round(8.88263919, 3)).toBe(8.883);
    expect(round(0.11669823, 5)).toBe(0.1167);
  });

  it('can round down', () => {
    expect(round(10.6218, 1)).toBe(10.6);
    expect(round(21.00782340792, 6)).toBe(21.007823);
    expect(round(8.0901026, 3)).toBe(8.09);
  });

  it('can round to an integer', () => {
    expect(round(3.8)).toBe(4);
    expect(round(11.0923)).toBe(11);
  });

  it('rounds to an integer by default', () => {
    expect(round(1.2553)).toBe(1);
    expect(round(5)).toBe(5);
    expect(round(2.9)).toBe(3);
  });

  it('can round to more places than the number has', () => {
    // 1.528 has fewer than 8 decimal places
    expect(round(1.526, 8)).toBe(1.526);
  });

  it('can round negative numbers', () => {
    expect(round(-12.03)).toBe(-12);
    expect(round(-8.239, 2)).toBe(-8.24);
  });

  it('handles nonfinite values', () => {
    expect(round(NaN)).toBe(NaN);
    expect(round(Infinity)).toBe(Infinity);
    expect(round(-Infinity)).toBe(-Infinity);
  });
});
