import mouseMoveToStretch from './mouseMoveToStretch';

it('returns zero if calculated stretch is nonfinite', () => {
  let mode = {
    strictDrawing: {
      drawing: {
        zoom: 0,
      },
      baseWidth: 10,
      baseHeight: 10,
    },
  };
  expect(mouseMoveToStretch(mode, 1, 1)).toBe(0);
});

it('calculates stretch', () => {
  let mode = {
    strictDrawing: {
      drawing: {
        zoom: 2,
      },
      baseWidth: 12,
      baseHeight: 8,
    },
  };
  expect(mouseMoveToStretch(mode, 3, 4)).toBeCloseTo(0.15);
});
