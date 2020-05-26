import mouseMoveToStretch from './mouseMoveToStretch';

let strictDrawing = {
  drawing: {
    zoom: 1,
  },
  baseWidth: 10,
  baseHeight: 10,
};

describe('returns zero on missing arguments', () => {
  it('missing arguments', () => {
    expect(mouseMoveToStretch(undefined, 1, strictDrawing)).toBe(0);
    expect(mouseMoveToStretch(null, 1, strictDrawing)).toBe(0);
    expect(mouseMoveToStretch(1, undefined, strictDrawing)).toBe(0);
    expect(mouseMoveToStretch(1, null, strictDrawing)).toBe(0);
    expect(mouseMoveToStretch(1, 1, undefined)).toBe(0);
    expect(mouseMoveToStretch(1, 1, null)).toBe(0);
  });

  it('does not just check if xMove and yMove are falsy', () => {
    expect(mouseMoveToStretch(0, 1, strictDrawing)).toBeGreaterThan(0);
    expect(mouseMoveToStretch(1, 0, strictDrawing)).toBeGreaterThan(0);
  });
});

it('returns zero if calculated stretch is nonfinite', () => {
  let strictDrawing = {
    drawing: {
      zoom: 0,
    },
    baseWidth: 10,
    baseHeight: 10,
  };
  expect(mouseMoveToStretch(1, 1, strictDrawing)).toBe(0);
});

it('calculates stretch', () => {
  let strictDrawing = {
    drawing: {
      zoom: 2,
    },
    baseWidth: 12,
    baseHeight: 8,
  };
  expect(mouseMoveToStretch(3, 4, strictDrawing)).toBeCloseTo(0.25);
});
