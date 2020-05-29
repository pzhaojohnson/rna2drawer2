import highlightBase from './highlightBase';

it('handles missing base argument', () => {
  expect(
    () => highlightBase()
  ).not.toThrow();
});

it('handles missing props argument', () => {
  let b = {
    addCircleHighlighting: jest.fn(() => { return {}; }),
  };
  highlightBase(b);
  expect(
    b.addCircleHighlighting.mock.calls.length
  ).toBe(1);
});

it('handles empty props argument', () => {
  let b = {
    addCircleHighlighting: jest.fn(() => { return {}; }),
  };
  highlightBase(b, {});
  expect(
    b.addCircleHighlighting.mock.calls.length
  ).toBe(1);
});

it('highlights base with given props', () => {
  let h = {};
  let b = {
    addCircleHighlighting: () => h,
  };
  let hps = {
    radius: 5.67,
    stroke: 'cyan',
    strokeWidth: 8.12,
    strokeOpacity: 0.87,
    fill: 'crimson',
    fillOpacity: 0.08,
  };
  highlightBase(b, hps);
  expect(
    JSON.stringify(h)
  ).toBe(
    JSON.stringify(hps)
  );
});
