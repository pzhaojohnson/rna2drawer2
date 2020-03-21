import StrictLayoutBaseProps from './StrictLayoutBaseProps';

it('can be instantiated', () => {
  let bps = new StrictLayoutBaseProps();
});

it('can be copied using the spread operator', () => {
  let bps0 = new StrictLayoutBaseProps();
  bps0.stretch3 = 1;
  bps0.flatOutermostLoopAngle3 = 0.5;
  bps0.flipStem = !bps0.flipStem;
  bps0.loopShape = 'triangle';
  bps0.maxTriangleLoopAngle = 0.27 * Math.PI;

  let bps1 = {...bps0};

  expect(Object.keys(bps1).length).toBe(Object.keys(bps0).length);

  Object.keys(bps0).forEach(k => {
    expect(bps1[k]).toBe(bps0[k]);
  });
});

it('can be converted to a JSON string and parsed from a JSON string', () => {
  let bps0 = new StrictLayoutBaseProps();
  bps0.stretch3 = 1;
  bps0.flatOutermostLoopAngle3 = 0.5;
  bps0.flipStem = !bps0.flipStem;
  bps0.loopShape = 'triangle';
  bps0.maxTriangleLoopAngle = 0.68 * Math.PI;

  let s = JSON.stringify(bps0);
  let bps1 = JSON.parse(s);

  expect(Object.keys(bps1).length).toBe(Object.keys(bps0).length);

  Object.keys(bps0).forEach(k => {
    expect(bps1[k]).toBe(bps0[k]);
  });
});
